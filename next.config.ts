import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Force la racine Turbopack à ce dossier : sinon Next remonte dans
  // c:\Users\conta\OneDrive\Desktop\Cursor et n'arrive plus à résoudre
  // tailwindcss & co (qui sont dans le node_modules local du projet).
  turbopack: {
    root: path.resolve("."),
  },
  images: {
    remotePatterns: [
      {
        // Bucket R2 Rosa Malheur (URL publique du bucket « rosamalheur »)
        protocol: "https",
        hostname: "pub-3ee0e4f265924ced8d8db8bf19798ba5.r2.dev",
      },
      {
        // Cloudflare R2 public URLs (pattern: pub-<hash>.r2.dev) — couvre tous les buckets
        protocol: "https",
        hostname: "**.r2.dev",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "i.ibb.co",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
    ],
  },
};

export default nextConfig;
