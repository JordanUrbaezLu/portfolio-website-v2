"use client";
import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { Monitor, Smartphone } from "@/components/icons/lucide-icons";

export function FeaturesToggle({
  viewMode,
  onViewModeChange,
  registry,
}: {
  viewMode: "mobile" | "desktop";
  onViewModeChange: (mode: "desktop" | "mobile") => void;
  registry: React.RefObject<Record<string, HTMLElement | null>>;
}) {
  const [isSectionVisible, setIsSectionVisible] = useState(false);

  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    let attempts = 0;
    const maxAttempts = 50;

    const checkAndObserve = () => {
      attempts++;
      const section = registry.current?.["features"];

      if (!section && attempts < maxAttempts) {
        setTimeout(checkAndObserve, 100);
        return;
      }

      if (!section) {
        console.error("Features section never found for toggle");
        return;
      }

      observer = new IntersectionObserver(
        ([entry]) => {
          setIsSectionVisible(entry.isIntersecting);
        },
        {
          threshold: 0,
          rootMargin: "-10% 0px -10% 0px",
        }
      );

      observer.observe(section);
    };

    checkAndObserve();

    return () => {
      if (observer) observer.disconnect();
    };
  }, [registry]);

  return (
    <div
      className={clsx(
        "fixed bottom-0 left-0 right-0 z-[9999] flex justify-center pb-8 pointer-events-none transition-transform duration-500 ease-out",
        isSectionVisible ? "translate-y-0" : "translate-y-full"
      )}
    >
      <div className="pointer-events-auto inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-2 shadow-2xl">
        <button
          onClick={() => onViewModeChange("desktop")}
          className={clsx(
            "flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-200 cursor-pointer",
            viewMode === "desktop"
              ? "bg-white/20 text-white shadow-lg"
              : "text-white/60 hover:text-white/80"
          )}
        >
          <Monitor className="w-5 h-5" />
          <span className="text-base font-medium">Desktop</span>
        </button>
        <button
          onClick={() => onViewModeChange("mobile")}
          className={clsx(
            "flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-200 cursor-pointer",
            viewMode === "mobile"
              ? "bg-white/20 text-white shadow-lg"
              : "text-white/60 hover:text-white/80"
          )}
        >
          <Smartphone className="w-5 h-5" />
          <span className="text-base font-medium">Mobile</span>
        </button>
      </div>
    </div>
  );
}
