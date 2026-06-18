"use client";
import React from "react";
import clsx from "clsx";
import { getTechMeta } from "@/data/tech";

/**
 * A tech chip whose whole background is the brand color fading left→right:
 * full color on the left, transparent on the right (e.g. GraphQL = pink→clear).
 * No icon.
 */
export function TechBadge({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const { color } = getTechMeta(name);

  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-lg border border-white/10 px-3 py-1 text-xs font-medium text-white",
        className
      )}
      style={{
        backgroundImage: `linear-gradient(90deg, ${color}b3 0%, ${color}40 45%, transparent 100%)`,
      }}
    >
      {name}
    </span>
  );
}
