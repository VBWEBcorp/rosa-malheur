import type { ContentPageDef } from "../registry";

/**
 * Accueil — `src/app/(shop)/page.tsx` + `components/shop/HeroSection.tsx`.
 * Les `default` reprennent à l'identique les textes affichés sur le site.
 * Chaque clé est réellement lue par la page (via getContent) : modifier ici dans
 * l'admin change le site immédiatement.
 *
 * Le titre et la description du « Bloc produit » viennent de la fiche produit
 * (Produits › La laisse), pas d'ici.
 */
export const homePage: ContentPageDef = {
  id: "home",
  name: "Page d'accueil",
  route: "/",
  icon: "Home",
  category: "page",
  description: "Le haut de page, vos atouts, le bloc produit et les bandeaux de la page d'accueil.",
  sections: [
    {
      id: "hero",
      title: "Haut de page (sous le logo)",
      fields: [
        { key: "home_hero_eyebrow", type: "text", label: "Petit bandeau au-dessus du logo", default: "Vente éphémère · laisses & jouets pour chiens" },
        { key: "home_hero_tagline", type: "textarea", label: "Phrase d'accroche (sous le logo)", default: "Des laisses faites main à partir de cordes d'escalade recyclées. Solides, colorées, pensées pour durer." },
        { key: "home_hero_cta_primary", type: "text", label: "Bouton principal", default: "Configurer ma laisse" },
        { key: "home_hero_cta_secondary", type: "text", label: "Bouton secondaire", default: "Notre histoire" },
      ],
    },
    {
      id: "valeurs",
      title: "Vos 3 atouts (cartes colorées)",
      fields: [
        { key: "home_val1_title", type: "text", label: "Atout 1 · titre", default: "Cordes recyclées" },
        { key: "home_val1_text", type: "textarea", label: "Atout 1 · texte", default: "Une seconde vie pour les cordes d'escalade. Moins de déchets, autant de solidité." },
        { key: "home_val2_title", type: "text", label: "Atout 2 · titre", default: "Bien-être animal" },
        { key: "home_val2_text", type: "textarea", label: "Atout 2 · texte", default: "Des laisses douces, robustes et sûres, pensées pour le confort de votre chien." },
        { key: "home_val3_title", type: "text", label: "Atout 3 · titre", default: "Fait main en France" },
        { key: "home_val3_text", type: "textarea", label: "Atout 3 · texte", default: "Chaque laisse est fabriquée et nouée à la main, en petite série." },
      ],
    },
    {
      id: "produit",
      title: "Bloc produit (fond noir)",
      fields: [
        { key: "home_produit_eyebrow", type: "text", label: "Étiquette", help: "Le nom, le prix et la description viennent de la fiche produit.", default: "Le produit" },
        { key: "home_produit_cta", type: "text", label: "Bouton", default: "Configurer ma laisse" },
      ],
    },
    {
      id: "matiere",
      title: "Section « Notre matière »",
      fields: [
        { key: "home_matiere_eyebrow", type: "text", label: "Étiquette", default: "Notre matière" },
        { key: "home_matiere_title", type: "text", label: "Titre", default: "Des cordes d'escalade," },
        { key: "home_matiere_title_accent", type: "text", label: "Titre · mot en orange", default: "une seconde vie" },
        { key: "home_matiere_text", type: "textarea", label: "Texte", default: "On récupère des cordes d'escalade déclassées — encore ultra-résistantes mais retirées des falaises — pour en faire des laisses qui en ont vu d'autres. Chaque modèle est noué à la main : la même corde qui assurait un grimpeur tient désormais votre chien. Solide, durable, et plein de caractère." },
        { key: "home_matiere_cta", type: "text", label: "Bouton", default: "En savoir plus" },
      ],
    },
    {
      id: "cta",
      title: "Bandeau final (rose)",
      fields: [
        { key: "home_cta_title", type: "text", label: "Titre", default: "Une question, une envie sur-mesure ?" },
        { key: "home_cta_subtitle", type: "text", label: "Sous-titre", default: "Écrivez-nous, on adore parler chiens et cordes." },
        { key: "home_cta_button", type: "text", label: "Bouton", default: "Nous contacter" },
      ],
    },
  ],
};
