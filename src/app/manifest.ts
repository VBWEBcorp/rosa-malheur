import type { MetadataRoute } from "next";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/seo";

// Web App Manifest : permet l'installation sur mobile et complète le SEO
// (nom, description, couleurs de la charte, icônes).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} · Laisses pour chien en corde d'escalade recyclée`,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#F2D0AD",
    theme_color: "#F2D0AD",
    lang: "fr",
    icons: [
      { src: "/brand/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
