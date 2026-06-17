/**
 * Étoile « burst » rétro façon affiche sérigraphiée (8 ou 10 branches).
 * Purement décorative. La couleur suit `currentColor` par défaut, donc
 * `className="text-[var(--orange)]"` suffit à la teinter.
 */
export default function RetroStar({
  points = 8,
  spike = 0.42,
  className = "",
  style,
}: {
  points?: number;
  /** Profondeur des creux (0 = pointes fines, 1 = pas de creux). */
  spike?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const cx = 50;
  const cy = 50;
  const R = 50;
  const r = R * spike;
  const coords: string[] = [];
  for (let i = 0; i < points * 2; i++) {
    const angle = (Math.PI / points) * i - Math.PI / 2;
    const radius = i % 2 === 0 ? R : r;
    coords.push(
      `${(cx + radius * Math.cos(angle)).toFixed(2)},${(cy + radius * Math.sin(angle)).toFixed(2)}`
    );
  }
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      <polygon points={coords.join(" ")} fill="currentColor" />
    </svg>
  );
}
