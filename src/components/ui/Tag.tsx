import React from "react";
export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-3 py-1 bg-white/10 border border-white/20 rounded-lg text-sm text-white/80 font-medium">
      {children}
    </span>
  );
}
