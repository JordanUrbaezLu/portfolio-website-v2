import React from "react";
import clsx from "clsx";

export function Card({
  children,
  className = "",
  padding = "p-8",
  id,
  interactive = false,
  glow = false,
}: {
  children: React.ReactNode;
  className?: string;
  padding?: string;
  id?: string;
  /** adds hover lift + brighter surface on hover */
  interactive?: boolean;
  /** adds the aurora gradient hairline ring */
  glow?: boolean;
}) {
  return (
    <div
      id={id}
      className={clsx(
        "glass rounded-3xl",
        glow && "ring-aurora",
        interactive &&
          "hover-lift transition-colors duration-300 hover:bg-white/[0.08]",
        padding,
        className
      )}
    >
      {children}
    </div>
  );
}
