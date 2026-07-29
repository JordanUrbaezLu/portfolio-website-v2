"use client";
import { useEffect, useState } from "react";

/**
 * Scroll spy via IntersectionObserver. The previous implementation ran
 * getBoundingClientRect over every section on every scroll event — exactly
 * the layout thrash this site argues against.
 *
 * The observation band sits in the upper third of the viewport, so a section
 * becomes current as its heading reaches reading height, not when its last
 * pixel leaves the screen.
 */
export function useActiveSection(ids: readonly string[]): string {
  const [active, setActive] = useState(ids[0] ?? "");

  useEffect(() => {
    const visible = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visible.set(entry.target.id, entry.intersectionRatio);
          } else {
            visible.delete(entry.target.id);
          }
        }
        if (visible.size === 0) return;
        // Ties resolve to document order, which is how the nav reads.
        let best = "";
        let bestRatio = -1;
        for (const id of ids) {
          const ratio = visible.get(id);
          if (ratio !== undefined && ratio > bestRatio) {
            bestRatio = ratio;
            best = id;
          }
        }
        if (best) setActive(best);
      },
      {
        rootMargin: "-10% 0px -55% 0px",
        threshold: [0, 0.15, 0.4, 0.75, 1],
      }
    );

    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [ids]);

  return active;
}
