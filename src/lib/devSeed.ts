import Category from "@/models/Category";
import Product from "@/models/Product";
import SiteSettings from "@/models/SiteSettings";

// ─────────────────────────────────────────────────────────────────────────
// Seed de développement — Rosa Malheur
//
// Boutique mono-produit : UNE laisse pour chien configurable.
// Le seed est idempotent et ne crée que ce qui manque (création « si absent »),
// pour ne JAMAIS écraser les modifications faites dans l'admin (prix, stock,
// réglages…). En production il ne tourne pas (garde dans db.ts + ici).
// ─────────────────────────────────────────────────────────────────────────

const CATEGORY = {
  name: "Laisses",
  slug: "laisses",
  description: "Laisses pour chien artisanales, simples ou multiposition.",
  order: 1,
};

// Produit unique. Prix en CENTIMES. Les `priceModifier` s'ajoutent au prix de
// base selon l'option choisie (ce sont des valeurs de départ, à ajuster dans
// l'admin → Produits).
const PRODUCT = {
  name: "Laisse Rosa Malheur",
  slug: "laisse",
  shortDescription:
    "Laisse pour chien en corde, simple ou multiposition, du 1,50 m au 5 m. Corde et mousqueton au choix.",
  description:
    "<p>Une laisse robuste et élégante, fabriquée à la main. Choisissez le <strong>type</strong> (simple ou multiposition), la <strong>longueur totale</strong> (1,50 m, 2 m, 3 m ou 5 m), la <strong>couleur de la corde</strong> et la <strong>couleur du mousqueton</strong>.</p><ul><li>Corde résistante et douce au toucher</li><li>Mousqueton solide</li><li>Finitions soignées, faites main</li></ul>",
  price: 3490, // 34,90 € — laisse simple 1,50 m (prix de base, à ajuster)
  weight: 250, // grammes (indicatif, pour le calcul d'expédition)
  variants: [
    {
      name: "Type",
      options: [
        { value: "Simple", priceModifier: 0, stock: 100 },
        { value: "Multiposition", priceModifier: 1000, stock: 100 }, // +10,00 €
      ],
    },
    {
      name: "Longueur totale",
      options: [
        { value: "1,50 m", priceModifier: 0, stock: 100 },
        { value: "2 m", priceModifier: 300, stock: 100 }, // +3,00 €
        { value: "3 m", priceModifier: 600, stock: 100 }, // +6,00 €
        { value: "5 m", priceModifier: 1200, stock: 100 }, // +12,00 €
      ],
    },
    {
      name: "Couleur de la corde",
      options: [
        { value: "Noir", priceModifier: 0, stock: 100 },
        { value: "Rouge", priceModifier: 0, stock: 100 },
        { value: "Bleu", priceModifier: 0, stock: 100 },
        { value: "Vert", priceModifier: 0, stock: 100 },
        { value: "Rose", priceModifier: 0, stock: 100 },
        { value: "Beige", priceModifier: 0, stock: 100 },
      ],
    },
    {
      name: "Couleur du mousqueton",
      options: [
        { value: "Noir", priceModifier: 0, stock: 100 },
        { value: "Argent", priceModifier: 0, stock: 100 },
        { value: "Or", priceModifier: 0, stock: 100 },
        { value: "Bronze", priceModifier: 0, stock: 100 },
      ],
    },
  ],
  stock: 100,
  tags: ["laisse", "chien", "multiposition", "fait-main"],
};

export async function ensureDevSeed(_uri: string) {
  if (process.env.NODE_ENV === "production") return;

  // 1) Catégorie unique « Laisses » (créée si absente).
  let category = await Category.findOne({ slug: CATEGORY.slug });
  if (!category) {
    category = await Category.create({ ...CATEGORY, isActive: true });
    console.log("[db] Catégorie « Laisses » créée.");
  }

  // Photo par défaut servie en statique depuis public/ (le temps d'avoir R2).
  const PLACEHOLDER_IMAGES = [
    { url: "/products/laisse-1.webp", alt: "Laisse Rosa Malheur", order: 0 },
  ];

  // 2) Produit unique « Laisse Rosa Malheur » (créé si absent — jamais écrasé).
  const existingProduct = await Product.findOne({ slug: PRODUCT.slug });
  if (!existingProduct) {
    await Product.create({
      ...PRODUCT,
      category: category._id,
      images: PLACEHOLDER_IMAGES,
      isActive: true,
      isFeatured: true,
      seo: {
        metaTitle: "Laisse pour chien sur-mesure | Rosa Malheur",
        metaDescription: PRODUCT.shortDescription,
      },
    });
    console.log("[db] Produit « Laisse Rosa Malheur » créé.");
  } else if (!existingProduct.images || existingProduct.images.length === 0) {
    // Produit déjà créé mais sans photo : on ajoute la photo par défaut (sans
    // écraser d'éventuelles images déjà chargées depuis l'admin).
    existingProduct.images = PLACEHOLDER_IMAGES;
    await existingProduct.save();
    console.log("[db] Photo par défaut ajoutée au produit existant.");
  }

  // 3) Réglages de la boutique (créés si absents — pas écrasés ensuite, pour
  //    préserver ce que l'admin configure dans Réglages).
  const existingSettings = await SiteSettings.findOne();
  if (!existingSettings) {
    await SiteSettings.create({
      shopName: "Rosa Malheur",
      shopDescription:
        "Laisses pour chien artisanales — simples ou multiposition, du 1,50 m au 5 m.",
      contactEmail: "fanny.rabu@hotmail.fr",
      contactPhone: "",
      address: "",
      currency: "EUR",
      shipping: {
        homeDeliveryEnabled: true,
        mondialRelayEnabled: true,
        homeRate: 490, // 4,90 €
        pickupRate: 390, // 3,90 €
        homeFreeThreshold: 8000, // livraison offerte dès 80 €
        pickupFreeThreshold: 6000,
        defaultWeight: 250,
      },
      // Micro-entreprise par défaut : franchise en base de TVA. À ajuster si assujettie.
      tax: { rate: 0, pricesIncludeTax: true, label: "TVA non applicable, art. 293 B du CGI" },
      giftCards: {
        enabled: true,
        presets: [
          { amount: 2500, label: "Découverte" },
          { amount: 5000, label: "Plaisir" },
          { amount: 7500, label: "Prestige" },
        ],
        expiryMonths: 0,
      },
      invoice: { enabled: false, prefix: "FAC-", nextNumber: 1 },
      analytics: {},
      integrations: {},
      social: { facebook: "", instagram: "", tiktok: "", youtube: "" },
      legal: { legalForm: "Entrepreneur individuel" },
      apiKeys: {},
    });
    console.log("[db] Réglages « Rosa Malheur » créés.");
  }
}
