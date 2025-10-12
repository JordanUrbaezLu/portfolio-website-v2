"use client";
import { useEffect, useState } from "react";

export function useActiveSection(
  registry: React.MutableRefObject<Record<string, HTMLElement | null>>
) {
  const [active, setActive] = useState("home");

  useEffect(() => {
    // Find the actual scroll container
    const getScrollContainer = () => {
      // Check if we're scrolling on the document
      if (document.documentElement.scrollHeight > window.innerHeight) {
        return window;
      }
      // Otherwise find a scrollable parent
      const entries = Object.values(registry.current);
      const firstSection = entries.find((el) => el !== null);
      if (!firstSection) return window;

      let parent = firstSection.parentElement;
      while (parent) {
        const overflow = window.getComputedStyle(parent).overflowY;
        if (overflow === "auto" || overflow === "scroll") {
          return parent;
        }
        parent = parent.parentElement;
      }
      return window;
    };

    function onScroll() {
      const entries = Object.entries(registry.current);

      if (entries.length === 0) {
        return;
      }

      let closestId = entries[0]?.[0] ?? "home";
      let minDistance = Infinity;

      // Find section closest to top (past or just below 100px)
      for (const [id, el] of entries) {
        if (!el) continue;
        const rect = el.getBoundingClientRect();

        // Only consider sections that are at least a little visible
        if (rect.bottom < 80) continue; // Section already far above view

        const distance = Math.abs(rect.top - 100);
        if (distance < minDistance) {
          minDistance = distance;
          closestId = id;
        }
      }

      // Bottom-of-page: force last as active
      const scrollContainer = getScrollContainer();
      const scrollHeight =
        scrollContainer === window
          ? document.body.scrollHeight
          : (scrollContainer as HTMLElement).scrollHeight;
      const scrollY =
        scrollContainer === window
          ? window.scrollY
          : (scrollContainer as HTMLElement).scrollTop;
      const clientHeight =
        scrollContainer === window
          ? window.innerHeight
          : (scrollContainer as HTMLElement).clientHeight;

      if (clientHeight + scrollY >= scrollHeight - 10) {
        const [lastId, lastEl] = entries[entries.length - 1];
        if (lastEl) closestId = lastId;
      }

      setActive(closestId);
    }

    const scrollContainer = getScrollContainer();
    scrollContainer.addEventListener("scroll", onScroll, { passive: true });
    setTimeout(onScroll, 10);

    return () => scrollContainer.removeEventListener("scroll", onScroll);
  }, [registry]);

  return active;
}
