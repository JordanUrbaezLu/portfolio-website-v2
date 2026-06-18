"use client";
import React, { useRef, useLayoutEffect, useState } from "react";
import { MotionReveal } from "@/components/animations/MotionReveal";

type Dir = "up" | "left" | "right";

export function SectionHeader({
  children,
  eyebrow,
  className = "",
  reveal = true,
  direction = "up",
  delay = 0,
  activateUnderline = false,
  underlineDelay = 0,
}: {
  children: React.ReactNode;
  /** small uppercase kicker above the title */
  eyebrow?: string;
  className?: string;
  reveal?: boolean;
  direction?: Dir;
  delay?: number;
  activateUnderline?: boolean;
  underlineDelay?: number;
}) {
  const textRef = useRef<HTMLHeadingElement>(null);
  const [textWidth, setTextWidth] = useState(0);

  useLayoutEffect(() => {
    const measureText = () => {
      if (textRef.current) setTextWidth(textRef.current.offsetWidth);
    };
    measureText();
    const resizeObserver = new ResizeObserver(measureText);
    if (textRef.current) resizeObserver.observe(textRef.current);
    return () => resizeObserver.disconnect();
  }, [children]);

  const headerContent = (
    <div className={`text-center mb-12 md:mb-16 ${className}`}>
      {eyebrow && (
        <div className="mb-4 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-white/60">
            <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-indigo-400 to-violet-400" />
            {eyebrow}
          </span>
        </div>
      )}
      <h2
        ref={textRef}
        className="text-4xl md:text-5xl font-semibold text-white inline-block tracking-tight"
      >
        {children}
      </h2>
      <div
        className="relative mx-auto mt-5 h-px"
        style={{ minWidth: "4rem", width: "4rem" }}
      >
        {/* Base hairline */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        {/* Animated aurora underline */}
        <div
          className="absolute top-0 left-1/2 h-px -translate-x-1/2 bg-gradient-to-r from-transparent via-indigo-300 to-transparent shadow-[0_0_8px_rgba(129,140,248,0.6)] transition-all duration-700 ease-out"
          style={{
            width: activateUnderline ? `${Math.max(textWidth, 64)}px` : 0,
            opacity: activateUnderline ? 1 : 0,
            transitionDelay: activateUnderline ? `${underlineDelay}ms` : "0ms",
          }}
        />
      </div>
    </div>
  );

  if (!reveal) return headerContent;
  return (
    <MotionReveal direction={direction} delay={delay}>
      {headerContent}
    </MotionReveal>
  );
}
