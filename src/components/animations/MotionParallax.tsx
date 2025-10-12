"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import React, { useRef } from "react";

export function MotionParallax({
  children,
  range = 40,
}: {
  children: React.ReactNode;
  range?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [range, -range]);
  return (
    <div ref={ref}>
      <motion.div style={{ y, willChange: "transform" }}>{children}</motion.div>
    </div>
  );
}
