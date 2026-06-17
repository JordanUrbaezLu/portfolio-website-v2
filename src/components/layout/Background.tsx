"use client";
import React from "react";

/**
 * Aurora canvas. The no-flash base gradient lives on <html> (globals.css);
 * this layer adds the slow-drifting colored blobs, film grain, and a faint
 * grid for depth. Purely decorative — pointer-events disabled, fixed behind
 * all content. Honors prefers-reduced-motion (animation classes self-disable).
 */
export function Background() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Drifting aurora blobs */}
      <div
        className="aurora-blob animate-aurora-a"
        style={{
          top: "-12%",
          left: "-8%",
          width: "46vw",
          height: "46vw",
          background:
            "radial-gradient(circle at center, rgba(99,102,241,0.55), rgba(99,102,241,0) 70%)",
        }}
      />
      <div
        className="aurora-blob animate-aurora-b"
        style={{
          top: "-6%",
          right: "-12%",
          width: "42vw",
          height: "42vw",
          background:
            "radial-gradient(circle at center, rgba(34,211,238,0.42), rgba(34,211,238,0) 70%)",
        }}
      />
      <div
        className="aurora-blob animate-aurora-c"
        style={{
          bottom: "-18%",
          left: "30%",
          width: "50vw",
          height: "50vw",
          background:
            "radial-gradient(circle at center, rgba(167,139,250,0.4), rgba(167,139,250,0) 70%)",
        }}
      />

      {/* Faint dotted grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Film grain */}
      <div className="grain-overlay absolute inset-0 mix-blend-overlay" />

      {/* Top + bottom vignette to anchor content */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% -10%, transparent 55%, rgba(3,4,10,0.55) 100%)",
        }}
      />
    </div>
  );
}
