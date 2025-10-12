import React from "react";
import clsx from "clsx";

export function Card({
  children,
  className = "",
  padding = "p-8",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  padding?: string;
  id?: string;
}) {
  return (
    <div
      id={id}
      className={clsx(
        "bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl",
        padding,
        className
      )}
    >
      {children}
    </div>
  );
}
