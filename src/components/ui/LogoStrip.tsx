"use client";
import React from "react";
import clsx from "clsx";
import { companies as defaultCompanies, type CompanyTenure } from "@/data/profile";

export function LogoStrip({
  items = defaultCompanies,
  label = "Experience at",
  className,
}: {
  items?: CompanyTenure[];
  label?: string;
  className?: string;
}) {
  return (
    <div className={clsx("flex flex-col items-center gap-5", className)}>
      <span className="text-xs font-medium uppercase tracking-[0.22em] text-white/40">
        {label}
      </span>
      <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-5 md:gap-x-12">
        {items.map((c) => (
          <div
            key={c.name}
            className="group flex flex-col items-center text-center opacity-70 transition-opacity duration-300 hover:opacity-100"
          >
            <span className="font-display text-lg md:text-xl font-semibold tracking-tight text-white/85 group-hover:text-white">
              {c.name}
            </span>
            <span className="text-[0.7rem] uppercase tracking-wider text-white/35">
              {c.note}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
