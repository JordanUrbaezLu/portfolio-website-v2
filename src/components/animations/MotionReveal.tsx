"use client";
import { motion } from "framer-motion";
import React from "react";

type Dir = "up" | "left" | "right";

export function MotionReveal({
  children,
  direction = "up",
  delay = 0,
  onAnimationComplete,
  onViewportEnter,
}: {
  children: React.ReactNode;
  direction?: Dir;
  delay?: number;
  onAnimationComplete?: () => void;
  onViewportEnter?: () => void; // <-- add this
}) {
  // <--- this was missing!
  const hidden =
    direction === "up"
      ? { opacity: 0, y: 60 }
      : direction === "left"
      ? { opacity: 0, x: 60 }
      : { opacity: 0, x: -60 };

  return (
    <motion.div
      initial={hidden}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        type: "spring",
        stiffness: 80,
        damping: 18,
        delay: delay / 1000,
      }}
      onAnimationComplete={onAnimationComplete}
      onViewportEnter={onViewportEnter} // <-- pass this
    >
      {children}
    </motion.div>
  );
}
