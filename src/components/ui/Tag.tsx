import React from "react";
import clsx from "clsx";

export function Tag({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs font-medium text-white/75 transition-colors duration-200 hover:border-indigo-300/40 hover:text-white",
        className
      )}
    >
      {children}
    </span>
  );
}
