import React from "react";

interface MediaNavigationProps {
  mediaLength: number;
  currentIndex: number;
  onPrevious: () => void;
  onNext: () => void;
  onSelect: (index: number) => void;
  size?: "sm" | "lg";
}

export function MediaNavigation({
  mediaLength,
  currentIndex,
  onPrevious,
  onNext,
  onSelect,
  size = "lg",
}: MediaNavigationProps) {
  if (mediaLength <= 1) return null;

  const isLarge = size === "lg";
  const buttonSize = isLarge ? "w-8 h-8" : "w-6 h-6";
  const iconSize = isLarge ? "w-4 h-4" : "w-3 h-3";
  const dotSize = isLarge ? "w-2 h-2" : "w-1.5 h-1.5";
  const spacing = isLarge ? "gap-4" : "gap-3";
  const dotSpacing = isLarge ? "gap-2" : "gap-1.5";
  const marginTop = isLarge ? "mt-4" : "mt-3";

  return (
    <div className={`flex items-center justify-center ${marginTop} ${spacing}`}>
      {/* Left arrow */}
      <button
        onClick={onPrevious}
        className={`${buttonSize} rounded-full border border-white/40 hover:border-white text-white hover:bg-white/10 flex items-center justify-center transition-all duration-200 cursor-pointer`}
        aria-label="Previous media"
      >
        <svg
          className={iconSize}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {/* Dot indicators */}
      <div className={`flex ${dotSpacing}`}>
        {Array.from({ length: mediaLength }, (_, index) => (
          <button
            key={index}
            onClick={() => onSelect(index)}
            className={`${dotSize} rounded-full transition-colors duration-200 cursor-pointer hover:bg-white/50 ${
              index === currentIndex ? "bg-white" : "bg-white/30"
            }`}
            aria-label={`Go to media ${index + 1}`}
          />
        ))}
      </div>

      {/* Right arrow */}
      <button
        onClick={onNext}
        className={`${buttonSize} rounded-full border border-white/40 hover:border-white text-white hover:bg-white/10 flex items-center justify-center transition-all duration-200 cursor-pointer`}
        aria-label="Next media"
      >
        <svg
          className={iconSize}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
}
