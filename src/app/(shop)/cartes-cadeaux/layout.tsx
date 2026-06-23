import type { Metadata } from "next";

// La page « cartes cadeaux » est un composant client (paiement Stripe) et ne
// peut donc pas exporter `metadata`. Ce layout de segment porte le SEO côté
// serveur (titre, description, canonical) lu par les moteurs de recherche.
export const metadata: Metadata = {
  title: "Cartes cadeaux",
  description:
    "Offrez une laisse Rosa Malheur avec une carte cadeau : montant au choix, livraison instantanée par email et valable longtemps. Le cadeau idéal pour les amoureux des chiens.",
  alternates: { canonical: "/cartes-cadeaux" },
};

export default function CartesCadeauxLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
