"use client";
import React from "react";

export type BackgroundVariant =
  | "slate"
  | "beige"
  | "forest"
  | "dialed"
  | "sunset"
  | "ocean"
  | "purple"
  | "anchor";

const backgroundVariants = {
  slate: "bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950",
  beige: "bg-gradient-to-br from-stone-950 via-neutral-900 to-slate-950",
  forest: "bg-gradient-to-br from-slate-900 via-gray-800 to-stone-900",
  dialed: "bg-gradient-to-br from-stone-900 via-slate-800 to-gray-900",
  sunset: "bg-gradient-to-br from-slate-950 via-blue-950/50 to-gray-950",
  ocean: "bg-gradient-to-br from-slate-900 via-gray-800 to-slate-950",
  purple: "bg-gradient-to-br from-slate-900 via-gray-900 to-stone-950",
  anchor: "bg-gradient-to-br from-[#4A3D35] via-[#A48374] to-[#4A3D35]",
};

export function Background({
  variant = "slate",
}: {
  variant?: BackgroundVariant;
}) {
  return (
    <>
      {/* Gradient base */}
      <div className={`fixed inset-0 -z-20 ${backgroundVariants[variant]}`} />

      {/* Subtle grid */}
      <div className="fixed inset-0 -z-10 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Mouse glow w/ trailing tail */}
      {/* <MouseGlowLayer /> */}
    </>
  );
}
