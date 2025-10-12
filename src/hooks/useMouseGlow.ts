"use client";
import { useEffect, useState } from "react";

export function useMouseGlow() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Skip on touch devices (mobile/tablet)
    if ("ontouchstart" in window || navigator.maxTouchPoints > 0) {
      return;
    }

    const handleMouse = (e: MouseEvent) => {
      setMouse({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  return mouse;
}
