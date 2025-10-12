import React from "react";
export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="w-full bg-white/10 rounded-full h-1">
      <div
        className="bg-white/60 h-1 rounded-full transition-all duration-1000"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
