import React from "react";
export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-3 py-1 bg-teal-400/10 border rounded-lg text-sm text-teal-300 font-medium">
      {children}
    </span>
  );
}
