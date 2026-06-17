"use client";
import React from "react";
import clsx from "clsx";
import { Icon } from "@iconify/react";
import {
  Gauge,
  Component,
  Lock,
  ShieldCheck,
  Webhook,
  GitBranch,
  Activity,
  Code2,
} from "lucide-react";
import { registerIconCollections } from "@/components/icons/iconify-setup";
import { getTechMeta } from "@/data/tech";

registerIconCollections();

const lucideMap = {
  Gauge,
  Component,
  Lock,
  ShieldCheck,
  Webhook,
  GitBranch,
  Activity,
  Code2,
} as const;

/**
 * A tech chip showing the real brand logo on a rounded tile whose background
 * is the technology's left→right brand gradient (GraphQL pink, Node green, …).
 * The logo is rendered white for clean contrast; abstract concepts (Core Web
 * Vitals, CI/CD, …) use a matching lucide glyph.
 */
export function TechBadge({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const meta = getTechMeta(name);
  const gradient = `linear-gradient(135deg, ${meta.from}, ${meta.to})`;
  const LucideIcon = meta.lucide
    ? lucideMap[meta.lucide as keyof typeof lucideMap]
    : null;

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] py-1 pl-1 pr-2.5 text-xs font-medium text-white/80 transition-colors duration-200 hover:border-white/25 hover:text-white",
        className
      )}
    >
      <span
        aria-hidden="true"
        className="grid h-[18px] w-[18px] shrink-0 place-items-center rounded-[5px] ring-1 ring-inset ring-white/20 shadow-sm"
        style={{ backgroundImage: gradient }}
      >
        {meta.iconify ? (
          <Icon
            icon={meta.iconify}
            className="h-[11px] w-[11px]"
            style={{ filter: "brightness(0) invert(1)" }}
          />
        ) : LucideIcon ? (
          <LucideIcon className="h-[11px] w-[11px] text-white" strokeWidth={2.4} />
        ) : null}
      </span>
      {name}
    </span>
  );
}
