import type { ContentPageDef } from "../registry";

/**
 * Pied de page — `src/components/shop/Footer.tsx`.
 * Les liens des colonnes et les réseaux sociaux sont gérés ailleurs
 * (structure du site / Paramètres › réseaux). On expose ici l'accroche,
 * les titres de colonnes et la mention du bas.
 */
export const footerComponent: ContentPageDef = {
  id: "footer",
  name: "Pied de page",
  route: "Bas de toutes les pages",
  icon: "Layout",
  category: "component",
  description: "L'accroche, les titres des colonnes et la mention en bas de toutes les pages.",
  sections: [
    {
      id: "brand",
      title: "Accroche",
      fields: [
        { key: "footer_tagline", type: "textarea", label: "Phrase d'accroche", default: "Laisses & jouets pour chiens, faits main à partir de cordes d'escalade recyclées. Vintage, costaud, éco-responsable." },
      ],
    },
    {
      id: "columns",
      title: "Titres des colonnes",
      fields: [
        { key: "footer_col1_label", type: "text", label: "Colonne 1", default: "Boutique" },
        { key: "footer_col2_label", type: "text", label: "Colonne 2", default: "La maison" },
        { key: "footer_col3_label", type: "text", label: "Colonne 3", default: "Infos" },
      ],
    },
    {
      id: "bottom",
      title: "Bas de page",
      fields: [
        { key: "footer_bottom_note", type: "text", label: "Mention (après le nom et l'année)", default: "Fait main en France" },
      ],
    },
  ],
};
