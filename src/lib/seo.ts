/**
 * Constantes SEO — source unique de vérité pour le domaine et les méta par défaut.
 * Le domaine de production est figé ici (canonique), indépendamment de l'URL locale,
 * pour que metadataBase / sitemap / robots / canonicals pointent toujours vers le vrai site.
 */
export const SITE_URL = "https://rosamalheur.fr";

export const SITE_NAME = "Rosa Malheur";

export const SITE_DESCRIPTION =
  "Laisses pour chien faites main en France à partir de cordes d'escalade recyclées : simples ou multiposition, du 1,50 m au 5 m, corde et mousqueton au choix.";

/** Image de partage par défaut (résolue contre metadataBase). */
export const OG_IMAGE = "/brand/rosa-malheur.png";

/**
 * Bloc images d'Open Graph à reprendre dans toute page qui redéfinit openGraph :
 * Next fusionne openGraph en surface, une page sans images perdrait celle du layout.
 */
export const OG_IMAGES = [{ url: OG_IMAGE, width: 600, height: 600, alt: "Rosa Malheur, laisses pour chien" }];

/** Mots-clés principaux pour la boutique. */
export const SITE_KEYWORDS = [
  "laisse chien",
  "laisse pour chien",
  "laisse corde d'escalade",
  "laisse multiposition",
  "laisse recyclée",
  "laisse fait main",
  "laisse chien France",
  "Rosa Malheur",
];
