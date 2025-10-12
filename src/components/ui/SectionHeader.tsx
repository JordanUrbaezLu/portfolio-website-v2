"use client";
import React, { useRef, useLayoutEffect, useState } from "react";
import { MotionReveal } from "@/components/animations/MotionReveal";

type Dir = "up" | "left" | "right";

export function SectionHeader({
  children,
  className = "",
  reveal = true,
  direction = "up",
  delay = 0,
  activateUnderline = false, // <-- new prop
  underlineDelay = 0,
}: {
  children: React.ReactNode;
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
      if (textRef.current) {
        const width = textRef.current.offsetWidth;
        setTextWidth(width);
      }
    };
    measureText();
    const resizeObserver = new ResizeObserver(measureText);
    if (textRef.current) resizeObserver.observe(textRef.current);
    return () => resizeObserver.disconnect();
  }, [children]);

  const headerContent = (
    <div className={`text-center mb-12 md:mb-20 ${className}`}>
      <h2
        ref={textRef}
        className="text-4xl md:text-5xl font-light text-white mb-4 inline-block"
      >
        {children}
      </h2>
      <div className="relative mx-auto w-16 h-px" style={{ minWidth: "4rem" }}>
        {/* Base underline - always visible */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent" />

        {/* Animated underline */}
        <div
          className="absolute top-0 left-1/2 h-px -translate-x-1/2 bg-gradient-to-r from-transparent via-white/80 to-transparent shadow-sm shadow-white/20 transition-all duration-700 ease-out"
          style={{
            width: activateUnderline ? `${textWidth}px` : 0,
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
