"use client";
import React from "react";
import clsx from "clsx";

// The Walmart "spark" — six tapered rays. (Walmart/Meltwater aren't in any
// bundled icon set, so the marks are crafted here.)
function WalmartSpark() {
  return (
    <svg viewBox="0 0 24 24" className="h-[16px] w-[16px]" aria-hidden="true">
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <rect
          key={a}
          x="11.1"
          y="2.4"
          width="1.8"
          height="6.2"
          rx="0.9"
          fill="#ffc220"
          transform={`rotate(${a} 12 12)`}
        />
      ))}
    </svg>
  );
}

type CompanyMeta =
  | { kind: "walmart"; tile: string }
  | { kind: "mono"; mono: string; tile: string };

const COMPANY: Record<string, CompanyMeta> = {
  "walmart global tech": {
    kind: "walmart",
    tile: "linear-gradient(135deg,#0071dc,#004b95)",
  },
  walmart: {
    kind: "walmart",
    tile: "linear-gradient(135deg,#0071dc,#004b95)",
  },
  meltwater: {
    kind: "mono",
    mono: "M",
    tile: "linear-gradient(135deg,#2b3a8c,#4f6bed)",
  },
  beyondtrust: {
    kind: "mono",
    mono: "B",
    tile: "linear-gradient(135deg,#f26c21,#fb923c)",
  },
  drift: {
    kind: "mono",
    mono: "D",
    tile: "linear-gradient(135deg,#06b6d4,#6366f1)",
  },
};

export function CompanyLogo({
  company,
  className,
}: {
  company: string;
  className?: string;
}) {
  const meta: CompanyMeta = COMPANY[company.trim().toLowerCase()] ?? {
    kind: "mono",
    mono: company.trim().charAt(0).toUpperCase() || "•",
    tile: "linear-gradient(135deg,#818cf8,#a78bfa)",
  };

  return (
    <span
      aria-hidden="true"
      className={clsx(
        "grid h-9 w-9 shrink-0 place-items-center rounded-xl ring-1 ring-inset ring-white/20 shadow-[0_4px_12px_-4px_rgba(0,0,0,0.6)]",
        className
      )}
      style={{ backgroundImage: meta.tile }}
    >
      {meta.kind === "walmart" ? (
        <WalmartSpark />
      ) : (
        <span className="font-display text-sm font-bold leading-none text-white">
          {meta.mono}
        </span>
      )}
    </span>
  );
}
