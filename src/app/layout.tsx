import type { Metadata, Viewport } from "next";
import { Baloo_2, Nunito, Bagel_Fat_One } from "next/font/google";
import "./globals.css";
import Providers from "@/components/shop/Providers";
import Analytics from "@/components/shop/Analytics";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, OG_IMAGE, SITE_KEYWORDS } from "@/lib/seo";

// Titres : Baloo 2 (rond, bubble, esprit sérigraphie 70s).
const baloo = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

// Texte courant : Nunito (chaleureux, lisible).
const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

// Grands titres « funky » 70s, proche du lettrage du logo (poids unique 400).
const bagel = Bagel_Fat_One({
  variable: "--font-bagel",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Rosa Malheur · Laisses pour chien en corde d'escalade recyclée",
    template: "%s | Rosa Malheur",
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Rosa Malheur · Laisses pour chien en corde d'escalade recyclée",
    description: SITE_DESCRIPTION,
    images: [{ url: OG_IMAGE, alt: "Rosa Malheur — laisses pour chien" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rosa Malheur · Laisses pour chien en corde d'escalade recyclée",
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#F2D0AD",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      data-scroll-behavior="smooth"
      className={`${baloo.variable} ${nunito.variable} ${bagel.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://i.ibb.co" crossOrigin="" />
        <link rel="preconnect" href="https://i.ytimg.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://i.ibb.co" />
        <link rel="dns-prefetch" href="https://i.ytimg.com" />
      </head>
      <body className="min-h-full flex flex-col">
        <Analytics />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
