"use client";
import React from "react";
import clsx from "clsx";
import { motion } from "framer-motion";
import { metrics as defaultMetrics, type Metric } from "@/data/profile";

export function StatBand({
  items = defaultMetrics,
  className,
}: {
  items?: Metric[];
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4",
        className
      )}
    >
      {items.map((m, i) => (
        <motion.div
          key={m.label}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{
            duration: 0.6,
            delay: i * 0.08,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="text-center md:text-left"
        >
          <div className="text-aurora text-3xl md:text-4xl font-display font-semibold tracking-tight">
            {m.value}
          </div>
          <div className="mt-2 text-sm leading-snug text-white/55">
            {m.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
