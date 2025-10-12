"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

export function HeadshotProgress({
  src,
  alt = "Jason Moynihan",
  size = 160,
  gap = 8,
  border = 2,
  duration = 350,
  trigger = false,
  image,
}: {
  src?: string;
  alt?: string;
  size?: number;
  gap?: number;
  border?: number;
  duration?: number;
  trigger?: boolean;
  image?: string;
}) {
  const [progress, setProgress] = useState(0);
  const [showSweep, setShowSweep] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const ringRadius = (size - border) / 2;
  const circumference = 2 * Math.PI * ringRadius;
  const imgSize = size - 2 * gap - border;

  // Determine image source based on props
  const imageSrc =
    src || (image ? `/assets/${image}.png` : "/assets/headshot.png");

  // Animate sweep when trigger becomes true
  useEffect(() => {
    if (trigger) {
      setShowSweep(true);
      setProgress(0);
      const start = Date.now();
      clearInterval(intervalRef.current!);
      intervalRef.current = setInterval(() => {
        const elapsed = Date.now() - start;
        const pct = Math.min(1, elapsed / duration);
        setProgress(pct);
        if (pct === 1) {
          clearInterval(intervalRef.current!);
        }
      }, 16);
    }
  }, [trigger, duration]);

  return (
    <div
      className="relative select-none group"
      style={{
        width: size,
        height: size,
      }}
    >
      {/* 1. STATIC faint base ring */}
      <svg
        className="absolute top-0 left-0 z-10 pointer-events-none"
        width={size}
        height={size}
        style={{ display: "block" }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={ringRadius}
          fill="none"
          stroke="#fff"
          strokeOpacity={0.2}
          strokeWidth={border}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: 0,
            transition: "stroke-opacity 0.25s",
          }}
        />
      </svg>

      {/* 2. ANIMATED sweep ring */}
      <svg
        className="absolute top-0 left-0 z-20 pointer-events-none"
        width={size}
        height={size}
        style={{ display: "block", transform: "rotate(-90deg)" }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={ringRadius}
          fill="none"
          stroke="#fff"
          strokeOpacity={showSweep || progress === 1 ? 1 : 0}
          strokeWidth={border}
          style={{
            filter: progress === 1 ? "drop-shadow(0 0 8px #fff)" : undefined,
            strokeDasharray: circumference,
            strokeDashoffset: circumference * (1 - progress),
            transition:
              "stroke-dashoffset 0.3s, stroke-opacity 0.18s, filter 0.25s",
            pointerEvents: "none",
          }}
        />
      </svg>

      {/* Headshot Image - Using Next.js Image */}
      <div
        className="absolute top-0 left-0 z-30 flex items-center justify-center rounded-full"
        style={{
          width: size,
          height: size,
        }}
      >
        <div
          className="relative rounded-full overflow-hidden"
          style={{
            width: imgSize,
            height: imgSize,
            border: "2px solid rgba(255,255,255,0.14)",
            boxShadow: "0 2px 8px 0 rgba(0,0,0,0.18)",
          }}
        >
          <Image
            src={imageSrc}
            alt={alt}
            fill
            sizes={`${imgSize}px`}
            className="object-cover select-none pointer-events-none"
            draggable={false}
            priority={trigger} // Load immediately if trigger is true (hero section)
          />
        </div>
      </div>
    </div>
  );
}
