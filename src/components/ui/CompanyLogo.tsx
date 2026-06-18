"use client";
import React from "react";
import clsx from "clsx";

// The Walmart "spark" — six tapered rays. Only Walmart gets a logo (big name);
// other companies render no mark.
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

export function CompanyLogo({
  company,
  className,
}: {
  company: string;
  className?: string;
}) {
  if (!company.trim().toLowerCase().includes("walmart")) return null;

  return (
    <span
      aria-hidden="true"
      className={clsx(
        "grid h-9 w-9 shrink-0 place-items-center rounded-xl ring-1 ring-inset ring-white/20 shadow-[0_4px_12px_-4px_rgba(0,0,0,0.6)]",
        className
      )}
      style={{ backgroundImage: "linear-gradient(135deg,#0071dc,#004b95)" }}
    >
      <WalmartSpark />
    </span>
  );
}
