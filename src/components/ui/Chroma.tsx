/**
 * Chromatic channel split — the page's signature.
 *
 * Three stacked copies of the same glyphs: a red plate offset one way, a blue
 * plate the other, and the real text on top. Composited additively, so at rest
 * you get a whisper of subpixel fringe and under load the channels tear apart.
 * Only the base copy is exposed to assistive tech.
 *
 * Transform-only, so the fader stays on the compositor while it drags.
 */
export function Chroma({
  children,
  className = "",
}: {
  children: string;
  className?: string;
}) {
  return (
    <span className={`chroma ${className}`}>
      <span className="chroma-plate" data-ch="r" aria-hidden="true">
        {children}
      </span>
      <span className="chroma-plate" data-ch="b" aria-hidden="true">
        {children}
      </span>
      <span className="chroma-base">{children}</span>
    </span>
  );
}
