import type { ContentPageDef } from "../registry";

/** Journal — en-tête de la liste d'articles (`src/app/(shop)/blog/page.tsx`). */
export const blogPage: ContentPageDef = {
  id: "blog",
  name: "Journal (blog)",
  route: "/blog",
  icon: "Newspaper",
  category: "page",
  description: "L'en-tête de la page Journal et le message affiché quand il n'y a pas encore d'article.",
  sections: [
    {
      id: "hero",
      title: "En-tête de la page",
      fields: [
        { key: "blog_eyebrow", type: "text", label: "Étiquette", default: "Le journal" },
        { key: "blog_title", type: "text", label: "Titre", default: "Nos" },
        { key: "blog_title_accent", type: "text", label: "Titre · mot en orange", default: "histoires" },
        { key: "blog_subtitle", type: "textarea", label: "Sous-titre", default: "Conseils pour votre chien, coulisses de l'atelier et secondes vies des cordes d'escalade." },
      ],
    },
    {
      id: "empty",
      title: "Quand il n'y a pas encore d'article",
      fields: [
        { key: "blog_empty_title", type: "text", label: "Titre", default: "Le journal arrive bientôt" },
        { key: "blog_empty_text", type: "text", label: "Texte", default: "Premiers articles en cours d'écriture." },
      ],
    },
  ],
};
