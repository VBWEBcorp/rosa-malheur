"use client";

import { useState } from "react";

/**
 * Logo Rosa Malheur (chat + lettrage), version détourée `public/brand/rosa-malheur.png`.
 * Si le fichier n'est pas encore présent, on retombe proprement sur un
 * lettrage typographique « Rosa Malheur » — donc aucune image cassée à l'écran.
 */
export default function BrandLogo({
  className = "",
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span className={`font-display font-extrabold leading-[0.8] tracking-tight inline-block ${className}`}>
        <span className="block text-[var(--orange)]">Rosa</span>
        <span className="block text-[var(--black)] -mt-1">Malheur</span>
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/brand/rosa-malheur.png"
      alt="Rosa Malheur — laisses pour chien"
      onError={() => setFailed(true)}
      loading={priority ? "eager" : "lazy"}
      className={className}
    />
  );
}
