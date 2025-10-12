"use client";
import React from "react";
import { useRouter } from "next/navigation";

export function BackButton({ href }: { href?: string }) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <nav className="fixed top-6 left-6 z-50">
      <a
        href={href || "#"}
        onClick={handleClick}
        className="group flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 shadow-2xl hover:bg-white/10 hover:border-white/20 transition-all duration-300"
        aria-label="Go back"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-white/70 group-hover:text-white transition-colors duration-300 group-hover:-translate-x-0.5 transition-transform"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors duration-300">
          Back
        </span>
      </a>
    </nav>
  );
}
