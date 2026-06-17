"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { usePageTitle } from "@/lib/use-page-title";
import { formatPrice } from "@/lib/utils";
import { ArrowLeft, ArrowRight, Check, MapPin } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import MondialRelayPicker from "@/components/shop/MondialRelayPicker";
import { MondialRelayPoint } from "@/components/shop/MondialRelayWidget";
import GiftCardInput, { type AppliedGiftCard } from "@/components/shop/GiftCardInput";
import PromoCodeInput, { type AppliedPromo } from "@/components/shop/PromoCodeInput";
import RetroStar from "@/components/shop/RetroStar";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe, type Stripe, type StripeElementsOptions } from "@stripe/stripe-js";

// Chargé une seule fois au niveau module : Stripe.js doit rester unique sur la page.
const stripePromise: Promise<Stripe | null> | null =
  typeof window !== "undefined" && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
    : null;

interface CartItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    price: number;
    image?: string;
  };
  variant?: string;
  quantity: number;
  subtotal: number;
}

type Step = "shipping" | "payment" | "confirmation";

export default function CheckoutPage() {
  usePageTitle("Finalisation de la commande");
  const { data: session, status } = useSession();
  const [step, setStep] = useState<Step>("shipping");
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [promo, setPromo] = useState<AppliedPromo | null>(null);
  const [giftCard, setGiftCard] = useState<AppliedGiftCard | null>(null);

  const [email, setEmail] = useState("");
  // Mot de passe optionnel : si le client en saisit un, on crée son compte
  // avec et il est connecté automatiquement après le paiement. Sinon on lui
  // envoie un email pour le configurer plus tard.
  const [password, setPassword] = useState("");

  const [shippingAddress, setShippingAddress] = useState({
    name: "",
    street: "",
    city: "",
    zip: "",
    country: "FR",
    phone: "",
  });

  // Par défaut, l'adresse de facturation est l'adresse renseignée par le client.
  // S'il coche cette case, on affiche un formulaire séparé pour renseigner une
  // adresse de facturation différente (utile en B2B, cadeau, etc.).
  const [differentBilling, setDifferentBilling] = useState(false);
  const [billingAddress, setBillingAddress] = useState({
    street: "",
    city: "",
    zip: "",
    country: "FR",
  });

  const [pickupPoint, setPickupPoint] = useState<MondialRelayPoint | null>(null);
  // Code Enseigne Mondial Relay (utilisé uniquement par le widget de carte côté client).
  // Lu depuis NEXT_PUBLIC_MONDIAL_RELAY_BRAND, sinon code de démonstration officiel
  // BDTEST13, ou écrasé par les réglages admin (apiKeys.mondialRelayBrandCode) si configuré.
  const [mondialRelayBrandCode, setMondialRelayBrandCode] = useState<string>(
    process.env.NEXT_PUBLIC_MONDIAL_RELAY_BRAND || "BDTEST13"
  );

  const [shippingRates, setShippingRates] = useState({
    pickupRate: 399,
    pickupFreeThreshold: 5000,
  });
  const [taxConfig, setTaxConfig] = useState({ rate: 20, pricesIncludeTax: true, label: "TVA" });

  // État du paiement : la commande et l'intention Stripe sont créées au passage
  // à l'étape « paiement », pour pouvoir afficher le PaymentElement de Stripe.
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  // Montant réellement prélevé par carte (calculé par le serveur, après prise en
  // compte de la carte cadeau et du minimum facturable Stripe).
  const [payAmount, setPayAmount] = useState<number | null>(null);
  const [paidOrderNumber, setPaidOrderNumber] = useState<string | null>(null);
  // Indique si le client a créé son compte avec un mot de passe pendant le
  // checkout : si oui, on le connecte automatiquement après paiement réussi.
  const [accountReadyForLogin, setAccountReadyForLogin] = useState(false);
  // Indique si la commande a déclenché la création d'un nouveau compte.
  // Sert à choisir le bon message sur l'écran de confirmation.
  const [createdNewAccount, setCreatedNewAccount] = useState(false);

  // Remonte la page en haut à chaque changement d'étape, sinon Next.js conserve
  // le scroll position et le client se retrouve en bas de l'étape suivante.
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [step]);

  // Remise code promo (sur le sous-total) — calculée par /api/promos/validate.
  // Le serveur reste l'autorité finale lors du checkout.
  const discount = promo ? Math.min(promo.discount, cartTotal) : 0;
  const discountedSubtotal = Math.max(0, cartTotal - discount);

  // Mondial Relay only. Le seuil de gratuité s'apprécie après remise (comme le serveur).
  const shippingCost =
    shippingRates.pickupFreeThreshold > 0 && discountedSubtotal >= shippingRates.pickupFreeThreshold
      ? 0
      : shippingRates.pickupRate;

  const taxableBase = discountedSubtotal + shippingCost;
  const taxAmount = taxConfig.pricesIncludeTax
    ? Math.round(taxableBase - taxableBase / (1 + taxConfig.rate / 100))
    : Math.round(taxableBase * (taxConfig.rate / 100));
  const total = taxConfig.pricesIncludeTax ? taxableBase : taxableBase + taxAmount;

  // Carte cadeau : déduction du montant à régler par carte (le serveur reste
  // l'autorité — ici c'est uniquement l'affichage indicatif).
  const giftCardAmount = giftCard ? Math.min(giftCard.balance, total) : 0;
  const amountDue = Math.max(0, total - giftCardAmount);

  useEffect(() => {
    // Guest checkout : pas de redirect vers /login.
    // Le compte sera créé automatiquement à partir de l'email saisi lors de la commande.
    fetch("/api/cart")
      .then((r) => r.json())
      .then((data) => {
        setCartItems(data.items || []);
        setCartTotal(data.total || 0);
      });

    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        // Use the merchant's brand code if configured, otherwise stay on the test code.
        if (data?.apiKeys?.mondialRelayBrandCode) {
          setMondialRelayBrandCode(data.apiKeys.mondialRelayBrandCode);
        }
        setShippingRates({
          pickupRate: data?.shipping?.pickupRate ?? 399,
          pickupFreeThreshold: data?.shipping?.pickupFreeThreshold ?? 5000,
        });
        setTaxConfig({
          rate: data?.tax?.rate ?? 20,
          pricesIncludeTax: data?.tax?.pricesIncludeTax ?? true,
          label: data?.tax?.label || "TVA",
        });
      })
      .catch(() => {});
  }, [status]);

  // Crée la commande côté serveur et récupère le clientSecret Stripe.
  // Doit être appelée AVANT de monter le PaymentElement (qui en a besoin).
  async function handleCreateOrder() {
    setLoading(true);

    try {
      // Construit l'adresse de livraison à partir du point relais (la commande
      // physique part chez Mondial Relay), tout en conservant le nom et le
      // téléphone du client pour la fiche transporteur.
      const shippingForApi = pickupPoint
        ? {
            name: shippingAddress.name,
            street: [pickupPoint.Adresse1, pickupPoint.Adresse2].filter(Boolean).join(" "),
            city: pickupPoint.Ville,
            zip: pickupPoint.CP,
            country: pickupPoint.Pays || "FR",
            phone: shippingAddress.phone,
          }
        : shippingAddress;

      // Adresse de facturation : par défaut celle saisie par le client,
      // sinon l'adresse alternative qu'il a renseignée explicitement.
      const billingForApi = differentBilling
        ? {
            name: shippingAddress.name,
            street: billingAddress.street,
            city: billingAddress.city,
            zip: billingAddress.zip,
            country: billingAddress.country,
            phone: shippingAddress.phone,
          }
        : {
            name: shippingAddress.name,
            street: shippingAddress.street,
            city: shippingAddress.city,
            zip: shippingAddress.zip,
            country: shippingAddress.country,
            phone: shippingAddress.phone,
          };

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password: password || undefined,
          shippingAddress: shippingForApi,
          billingAddress: billingForApi,
          paymentMethod: "stripe",
          shippingCost,
          shippingMethod: "pickup",
          pickupPoint: pickupPoint
            ? {
                id: pickupPoint.ID,
                name: pickupPoint.Nom,
                street: [pickupPoint.Adresse1, pickupPoint.Adresse2].filter(Boolean).join(" "),
                city: pickupPoint.Ville,
                zip: pickupPoint.CP,
                country: pickupPoint.Pays || "FR",
                carrier: "mondialrelay",
              }
            : undefined,
          promoCode: promo?.code || undefined,
          giftCardCode: giftCard?.code || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Erreur lors de la commande");
        setLoading(false);
        return;
      }

      // Commande intégralement réglée par carte cadeau : aucun paiement Stripe,
      // la commande est déjà validée côté serveur.
      if (data.paid) {
        setPaidOrderNumber(data.orderNumber);
        setAccountReadyForLogin(Boolean(data.accountHasPassword));
        setCreatedNewAccount(Boolean(data.isNewAccount));
        if (Boolean(data.accountHasPassword) && password) {
          try {
            await signIn("credentials", { email, password, redirect: false });
          } catch {
            // ignore
          }
        }
        setStep("confirmation");
        return;
      }

      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
        setPayAmount(typeof data.amountDue === "number" ? data.amountDue : null);
        setPaidOrderNumber(data.orderNumber);
        setAccountReadyForLogin(Boolean(data.accountHasPassword));
        setCreatedNewAccount(Boolean(data.isNewAccount));
        setStep("payment");
      } else {
        toast.error("Erreur lors de l'initialisation du paiement");
      }
    } catch {
      toast.error("Erreur serveur");
    }

    setLoading(false);
  }

  // ── Loading state ─────────────────────────────────────────────
  if (status === "loading") {
    return (
      <div className="bg-[var(--cream)] min-h-[80vh] flex items-center justify-center">
        <p className="font-display font-extrabold text-[var(--black)]/60">Chargement…</p>
      </div>
    );
  }

  // ── Confirmation state ────────────────────────────────────────
  if (step === "confirmation") {
    return (
      <div className="bg-[var(--cream)] min-h-[80vh] py-20 md:py-28 px-4 relative overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden>
          <RetroStar points={8} className="absolute top-16 left-[12%] w-12 h-12 text-[var(--orange)] hidden sm:block" />
          <RetroStar points={10} className="absolute bottom-20 right-[14%] w-14 h-14 text-[var(--pink-dark)] hidden sm:block" />
        </div>
        <div className="relative z-10 max-w-lg mx-auto text-center">
          <div className="w-16 h-16 rounded-full border-2 border-[var(--black)] bg-[var(--pink)] text-[var(--black)] flex items-center justify-center mx-auto mb-7">
            <Check size={26} strokeWidth={2.5} />
          </div>
          <span className="inline-block pill-rosa bg-[var(--orange)] text-white px-4 py-1.5 text-[11px] font-display font-extrabold uppercase tracking-wide">
            Merci
          </span>
          <h1 className="mt-5 font-display font-extrabold text-4xl md:text-5xl text-[var(--black)] leading-[0.95]">
            Commande <span className="text-[var(--orange)]">confirmée</span>
          </h1>
          <p className="mt-6 text-[15px] text-[var(--black)]/75 leading-relaxed mb-10 max-w-md mx-auto font-semibold">
            {paidOrderNumber ? (
              <>Commande <span className="font-display font-extrabold text-[var(--black)]">{paidOrderNumber}</span> enregistrée. Vous recevrez un email avec les détails dans quelques instants.</>
            ) : (
              <>Vous recevrez un email avec les détails de votre commande dans quelques instants.</>
            )}
            {accountReadyForLogin && (
              <>
                <br />
                <span className="text-[var(--orange)] font-extrabold">Votre espace client est prêt, vous y êtes déjà connecté.</span>
              </>
            )}
            {!accountReadyForLogin && createdNewAccount && (
              <>
                <br />
                Un email vous a été envoyé pour activer votre espace client et choisir votre mot de passe.
              </>
            )}
            {!accountReadyForLogin && !createdNewAccount && !session?.user && (
              <>
                <br />
                Cette adresse a déjà un espace client. <Link href="/login" className="text-[var(--orange)] font-extrabold underline">Connectez-vous</Link> pour suivre votre commande.
              </>
            )}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/account/orders" className="btn-rosa text-[15px]">
              Mes commandes
              <ArrowRight size={16} strokeWidth={2.5} />
            </Link>
            <Link href="/" className="btn-rosa-outline text-[15px]">
              Retour à la boutique
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Main checkout flow ────────────────────────────────────────
  return (
    <div className="bg-[var(--cream)] min-h-[80vh] py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[12px] font-display font-extrabold uppercase tracking-wide text-[var(--black)]/55 hover:text-[var(--orange)] transition mb-8"
        >
          <ArrowLeft size={15} strokeWidth={2.5} /> Continuer mes achats
        </Link>

        {/* Header */}
        <div className="mb-10">
          <span className="inline-block pill-rosa bg-[var(--pink)] text-[var(--black)] px-4 py-1.5 text-[11px] font-display font-extrabold uppercase tracking-wide">
            Finalisation
          </span>
          <h1 className="mt-4 font-display font-extrabold text-4xl md:text-5xl text-[var(--black)] leading-[0.95]">
            Votre <span className="text-[var(--orange)]">commande</span>
          </h1>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center gap-4 mb-10 max-w-md">
          <StepDot label="Livraison" active={step === "shipping"} done={step === "payment"} number={1} />
          <span className={`flex-1 h-1 rounded-full transition-colors ${step === "payment" ? "bg-[var(--orange)]" : "bg-[var(--black)]/15"}`} />
          <StepDot label="Paiement" active={step === "payment"} done={false} number={2} />
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-10">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-6 min-w-0">
            {step === "shipping" && (
              <>
                {/* Coordonnées + adresse */}
                <Card eyebrow="Vous concernant" title="Vos coordonnées">
                  <div className="space-y-5">
                    <Field
                      label="Nom complet"
                      required
                      value={shippingAddress.name}
                      onChange={(v) => setShippingAddress({ ...shippingAddress, name: v })}
                    />
                    <Field
                      label="Email"
                      type="email"
                      required
                      placeholder="vous@exemple.com"
                      value={email}
                      onChange={setEmail}
                    />
                    {!session?.user && (
                      <div>
                        <Field
                          label="Mot de passe (créez votre espace client)"
                          type="password"
                          placeholder="Minimum 8 caractères"
                          value={password}
                          onChange={setPassword}
                        />
                        <p className="text-[12px] text-[var(--black)]/50 mt-2 leading-relaxed">
                          Optionnel. Si vous le renseignez, votre espace client est créé immédiatement et vous y êtes connecté après le paiement. Sinon, un email vous sera envoyé pour le configurer plus tard.
                        </p>
                      </div>
                    )}
                    <Field
                      label="Téléphone (requis par Mondial Relay)"
                      type="tel"
                      required
                      value={shippingAddress.phone}
                      onChange={(v) => setShippingAddress({ ...shippingAddress, phone: v })}
                    />
                    <Field
                      label="Adresse"
                      required
                      placeholder="12 rue de la Fontaine"
                      value={shippingAddress.street}
                      onChange={(v) => setShippingAddress({ ...shippingAddress, street: v })}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                      <Field
                        label="Code postal"
                        required
                        placeholder="35000"
                        value={shippingAddress.zip}
                        onChange={(v) => setShippingAddress({ ...shippingAddress, zip: v })}
                      />
                      <div className="sm:col-span-2">
                        <Field
                          label="Ville"
                          required
                          placeholder="Rennes"
                          value={shippingAddress.city}
                          onChange={(v) => setShippingAddress({ ...shippingAddress, city: v })}
                        />
                      </div>
                    </div>

                    <label className="flex items-start gap-3 pt-1 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={differentBilling}
                        onChange={(e) => setDifferentBilling(e.target.checked)}
                        className="w-4 h-4 mt-0.5 accent-[var(--orange)]"
                      />
                      <span className="text-[13px] font-semibold text-[var(--black)]/70 group-hover:text-[var(--black)] transition">
                        Utiliser une adresse de facturation différente
                      </span>
                    </label>
                  </div>
                </Card>

                {/* Adresse de facturation (conditionnelle) */}
                {differentBilling && (
                  <Card eyebrow="Pour la facture" title="Adresse de facturation">
                    <p className="text-[13px] text-[var(--black)]/55 mb-6">
                      Cette adresse figurera sur votre facture. Indispensable pour la TVA en cas d&apos;achat professionnel.
                    </p>
                    <div className="space-y-5">
                      <Field
                        label="Adresse"
                        required
                        placeholder="12 rue de la Fontaine"
                        value={billingAddress.street}
                        onChange={(v) => setBillingAddress({ ...billingAddress, street: v })}
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        <Field
                          label="Code postal"
                          required
                          placeholder="35000"
                          value={billingAddress.zip}
                          onChange={(v) => setBillingAddress({ ...billingAddress, zip: v })}
                        />
                        <div className="sm:col-span-2">
                          <Field
                            label="Ville"
                            required
                            placeholder="Rennes"
                            value={billingAddress.city}
                            onChange={(v) => setBillingAddress({ ...billingAddress, city: v })}
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Sélecteur point relais Mondial Relay (gratuit) */}
                <Card eyebrow="Retrait" title="Choisissez votre point relais">
                  <p className="text-[13px] text-[var(--black)]/55 mb-6">
                    Toutes les commandes sont expédiées via Mondial Relay. Choisissez le point relais où récupérer votre commande.
                  </p>

                  <MondialRelayPicker
                    brandCode={mondialRelayBrandCode}
                    postCode={shippingAddress.zip}
                    value={pickupPoint}
                    onSelect={(p) => setPickupPoint(p)}
                  />
                </Card>

                <button
                  disabled={loading}
                  onClick={() => {
                    if (!shippingAddress.name) {
                      toast.error("Veuillez renseigner votre nom");
                      return;
                    }
                    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                      toast.error("Veuillez renseigner un email valide");
                      return;
                    }
                    if (password && password.length < 8) {
                      toast.error("Le mot de passe doit faire au moins 8 caractères");
                      return;
                    }
                    if (!shippingAddress.phone) {
                      toast.error("Le téléphone est obligatoire pour Mondial Relay");
                      return;
                    }
                    if (!shippingAddress.street || !shippingAddress.zip || !shippingAddress.city) {
                      toast.error("Veuillez renseigner votre adresse complète");
                      return;
                    }
                    if (
                      differentBilling &&
                      (!billingAddress.street || !billingAddress.zip || !billingAddress.city)
                    ) {
                      toast.error("Veuillez compléter l'adresse de facturation");
                      return;
                    }
                    if (!pickupPoint) {
                      toast.error("Veuillez choisir un point relais sur la carte");
                      return;
                    }
                    void handleCreateOrder();
                  }}
                  className="btn-rosa w-full text-[15px] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Préparation du paiement…" : <>Continuer vers le paiement <ArrowRight size={16} strokeWidth={2.5} /></>}
                </button>
              </>
            )}

            {step === "payment" && (
              <>
                {/* Récapitulatif retrait */}
                {pickupPoint && (
                  <Card eyebrow="Retrait" title="Votre point relais">
                    <div className="flex items-start gap-3">
                      <span className="w-11 h-11 rounded-full border-2 border-[var(--black)] bg-[var(--pink)] text-[var(--black)] flex items-center justify-center shrink-0">
                        <MapPin size={17} strokeWidth={2} />
                      </span>
                      <div className="text-[14px] leading-relaxed">
                        <p className="font-display font-extrabold text-[var(--black)]">{pickupPoint.Nom}</p>
                        <p className="text-[var(--black)]/65 mt-0.5">
                          {pickupPoint.Adresse1}
                          {pickupPoint.Adresse2 ? `, ${pickupPoint.Adresse2}` : ""}
                        </p>
                        <p className="text-[var(--black)]/65">
                          {pickupPoint.CP} {pickupPoint.Ville}
                        </p>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Stripe Elements : carte bancaire */}
                <Card eyebrow="Sécurisé" title="Paiement par carte">
                  {!stripePromise && (
                    <p className="text-[13px] font-bold text-[var(--orange)]">
                      Clé publique Stripe manquante (NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY).
                      Vérifiez votre configuration.
                    </p>
                  )}
                  {stripePromise && clientSecret && (
                    <Elements
                      stripe={stripePromise}
                      options={
                        {
                          clientSecret,
                          appearance: {
                            theme: "flat",
                            variables: {
                              colorPrimary: "#DC480F",
                              colorBackground: "#ffffff",
                              colorText: "#0E0D0D",
                              colorDanger: "#DC480F",
                              fontFamily: "var(--font-nunito), system-ui, sans-serif",
                              borderRadius: "14px",
                              spacingUnit: "4px",
                            },
                            rules: {
                              ".Input": {
                                border: "2px solid rgba(14,13,13,0.15)",
                                padding: "12px 14px",
                              },
                              ".Input:focus": {
                                border: "2px solid #DC480F",
                                boxShadow: "none",
                              },
                              ".Label": {
                                fontSize: "12px",
                                fontWeight: "700",
                                color: "#0E0D0D",
                              },
                            },
                          },
                        } as StripeElementsOptions
                      }
                    >
                      <PaymentForm
                        total={payAmount ?? amountDue}
                        onSuccess={async () => {
                          // Auto-connexion si le client a choisi un mot de passe
                          // pendant le checkout. Best-effort : si ça échoue,
                          // on passe quand même à la confirmation.
                          if (accountReadyForLogin && password) {
                            try {
                              await signIn("credentials", {
                                email,
                                password,
                                redirect: false,
                              });
                            } catch {
                              // ignore
                            }
                          }
                          setStep("confirmation");
                        }}
                        onBack={() => setStep("shipping")}
                      />
                    </Elements>
                  )}
                  <p className="text-[12px] text-[var(--black)]/45 mt-6 text-center">
                    Carte de test Stripe : 4242 4242 4242 4242 · n&apos;importe quelle date future · n&apos;importe quel CVC.
                  </p>
                </Card>
              </>
            )}
          </div>

          {/* Récapitulatif sticky */}
          <aside className="lg:col-span-1 min-w-0">
            <div className="card-rosa bg-white px-6 sm:px-7 py-7 lg:sticky lg:top-28" style={{ boxShadow: "6px 6px 0 0 var(--black)" }}>
              <p className="text-[11px] font-display font-extrabold uppercase tracking-wide text-[var(--orange)] mb-1.5">
                Votre sélection
              </p>
              <h2 className="font-display font-extrabold text-2xl text-[var(--black)] leading-none mb-6">
                Récapitulatif
              </h2>

              <div className="divide-y-2 divide-[var(--black)]/8">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex justify-between items-start gap-3 py-3 first:pt-0">
                    <div className="min-w-0 flex-1">
                      <p className="font-display font-extrabold text-[14px] text-[var(--black)] leading-tight truncate">
                        {item.product.name}
                      </p>
                      <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--orange)] mt-1">
                        × {item.quantity}
                      </p>
                    </div>
                    <span className="font-display font-extrabold text-[14px] text-[var(--black)] shrink-0">
                      {formatPrice(item.subtotal)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t-2 border-[var(--black)]/10 mt-5 pt-5 space-y-3">
                <SummaryRow
                  label={`Sous-total${taxConfig.pricesIncludeTax ? " TTC" : " HT"}`}
                  value={formatPrice(cartTotal)}
                />
                {discount > 0 && (
                  <SummaryRow
                    label={`Réduction${promo ? ` (${promo.code})` : ""}`}
                    value={<span className="text-[var(--orange)] font-extrabold">-{formatPrice(discount)}</span>}
                  />
                )}
                <SummaryRow
                  label="Livraison"
                  value={
                    shippingCost === 0 ? (
                      <span className="text-[var(--orange)] font-extrabold">Offerte</span>
                    ) : (
                      formatPrice(shippingCost)
                    )
                  }
                />
                {taxConfig.rate > 0 && (
                  <SummaryRow
                    label={`${taxConfig.pricesIncludeTax ? "Dont " : ""}${taxConfig.label} (${taxConfig.rate} %)`}
                    value={formatPrice(taxAmount)}
                    subdued
                  />
                )}
              </div>

              <div className="border-t-2 border-[var(--black)]/10 mt-5 pt-5 flex items-end justify-between">
                <span className="text-[12px] font-display font-extrabold uppercase tracking-wide text-[var(--black)]/50">
                  Total TTC
                </span>
                <span className="font-display font-extrabold text-3xl text-[var(--black)]">
                  {formatPrice(total)}
                </span>
              </div>

              {/* Code promo */}
              <div className="border-t-2 border-[var(--black)]/10 mt-5 pt-5">
                <p className="text-[11px] font-display font-extrabold uppercase tracking-wide text-[var(--black)]/50 mb-3">
                  Code promo
                </p>
                <PromoCodeInput
                  subtotal={cartTotal}
                  appliedPromo={promo}
                  onApply={(p) => setPromo(p)}
                  onRemove={() => setPromo(null)}
                  disabled={step === "payment"}
                />
              </div>

              {/* Carte cadeau */}
              <div className="border-t-2 border-[var(--black)]/10 mt-5 pt-5">
                <p className="text-[11px] font-display font-extrabold uppercase tracking-wide text-[var(--black)]/50 mb-3">
                  Carte cadeau
                </p>
                <GiftCardInput
                  appliedCard={giftCard}
                  onApply={(c) => setGiftCard(c)}
                  onRemove={() => setGiftCard(null)}
                  disabled={step === "payment"}
                />
                {giftCard && (
                  <div className="mt-4 space-y-2">
                    <SummaryRow
                      label="Carte cadeau"
                      value={<span className="text-[var(--orange)] font-extrabold">-{formatPrice(giftCardAmount)}</span>}
                    />
                    <div className="flex items-end justify-between pt-2 border-t-2 border-[var(--black)]/8">
                      <span className="text-[12px] font-display font-extrabold uppercase tracking-wide text-[var(--black)]/50">
                        Reste à payer
                      </span>
                      <span className="font-display font-extrabold text-xl text-[var(--black)]">
                        {formatPrice(amountDue)}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {session?.user?.email && (
                <p className="text-[11px] text-[var(--black)]/45 mt-6 text-center truncate font-semibold">
                  Connecté en tant que {session.user.email}
                </p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────

function StepDot({
  label,
  active,
  done,
  number,
}: {
  label: string;
  active: boolean;
  done: boolean;
  number: number;
}) {
  const dotClass = active
    ? "bg-[var(--orange)] text-white border-[var(--black)]"
    : done
    ? "bg-[var(--pink)] text-[var(--black)] border-[var(--black)]"
    : "bg-white text-[var(--black)]/40 border-[var(--black)]/20";

  return (
    <div className="flex items-center gap-3">
      <span
        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-[13px] font-display font-extrabold ${dotClass}`}
      >
        {done ? <Check size={14} strokeWidth={2.5} /> : number}
      </span>
      <span
        className={`text-[12px] font-display font-extrabold uppercase tracking-wide hidden sm:inline ${
          active ? "text-[var(--black)]" : "text-[var(--black)]/45"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

function Card({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card-rosa bg-white px-6 sm:px-8 py-7" style={{ boxShadow: "5px 5px 0 0 var(--black)" }}>
      <div className="mb-6">
        <p className="text-[11px] font-display font-extrabold uppercase tracking-wide text-[var(--orange)] mb-1.5">
          {eyebrow}
        </p>
        <h2 className="font-display font-extrabold text-2xl text-[var(--black)] leading-none">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-[12px] font-display font-extrabold uppercase tracking-wide text-[var(--black)] mb-2">
        {label}
        {required && <span className="text-[var(--orange)] ml-1">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-white border-2 border-[var(--black)]/15 rounded-2xl text-[14px] text-[var(--black)] focus:border-[var(--orange)] focus:ring-0 outline-none transition placeholder:text-[var(--black)]/30"
      />
    </div>
  );
}

function SummaryRow({
  label,
  value,
  subdued,
}: {
  label: string;
  value: React.ReactNode;
  subdued?: boolean;
}) {
  return (
    <div className={`flex justify-between text-[13px] font-semibold ${subdued ? "text-[var(--black)]/40" : "text-[var(--black)]/70"}`}>
      <span>{label}</span>
      <span className={subdued ? "" : "text-[var(--black)] font-display font-extrabold"}>{value}</span>
    </div>
  );
}

function PaymentForm({
  total,
  onSuccess,
  onBack,
}: {
  total: number;
  onSuccess: () => void;
  onBack: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setSubmitting(true);
    setError(null);

    // redirect: "if_required" : pour les cartes classiques on reste sur la page,
    // seul un challenge 3DS provoque éventuellement une redirection.
    const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout`,
      },
      redirect: "if_required",
    });

    if (stripeError) {
      setError(stripeError.message || "Erreur lors du paiement");
      setSubmitting(false);
      return;
    }

    if (paymentIntent && paymentIntent.status === "succeeded") {
      onSuccess();
    } else {
      setError("Paiement non finalisé. Merci de réessayer.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      {error && <p className="text-[13px] text-[var(--orange)] font-bold">{error}</p>}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className="btn-rosa-outline px-5 disabled:opacity-60"
          aria-label="Retour"
        >
          <ArrowLeft size={16} strokeWidth={2.5} />
        </button>
        <button
          type="submit"
          disabled={!stripe || submitting}
          className="btn-rosa flex-1 text-[15px] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? "Paiement en cours…" : <>Payer {formatPrice(total)} <ArrowRight size={16} strokeWidth={2.5} /></>}
        </button>
      </div>
    </form>
  );
}
