// src/components/effects/MouseGlowLayer.tsx
"use client";
import React, { useEffect, useRef } from "react";

type Point = { x: number; y: number; t: number; v: number };

function isTouchDevice() {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}

export function MouseGlowLayer({
  color = "255,255,255", // RGB string
  baseRadius = 10, // base glow size
  maxBoost = 12, // how much extra radius at high speed
  maxTrail = 1000, // max points stored
  tailMs = 300, // how long each point lingers
  zIndex = 20, // render above background (tweak for your stack)
}: {
  color?: string;
  baseRadius?: number;
  maxBoost?: number;
  maxTrail?: number;
  tailMs?: number;
  zIndex?: number | string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const pointsRef = useRef<Point[]>([]);
  const lastRef = useRef<{ x: number; y: number; t: number } | null>(null);
  const enabledRef = useRef<boolean>(false);

  // Fit canvas to window with devicePixelRatio for sharpness
  const fit = () => {
    const c = canvasRef.current!;
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const w = window.innerWidth;
    const h = window.innerHeight;
    c.width = Math.floor(w * dpr);
    c.height = Math.floor(h * dpr);
    c.style.width = w + "px";
    c.style.height = h + "px";
    const ctx = c.getContext("2d")!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  useEffect(() => {
    if (isTouchDevice()) {
      // Don’t render on touch devices
      enabledRef.current = false;
      return;
    }
    enabledRef.current = true;

    const c = canvasRef.current!;
    fit();
    const ctx = c.getContext("2d")!;
    ctx.globalCompositeOperation = "lighter"; // additive glow

    const onResize = () => fit();

    const onMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      const prev = lastRef.current;
      let v = 0;
      if (prev) {
        const dt = Math.max(1, now - prev.t);
        const dx = e.clientX - prev.x;
        const dy = e.clientY - prev.y;
        v = Math.hypot(dx, dy) / dt; // px per ms
      }
      lastRef.current = { x: e.clientX, y: e.clientY, t: now };

      // Keep a short list of recent points; each with velocity snapshot
      const pts = pointsRef.current;
      pts.push({ x: e.clientX, y: e.clientY, t: now, v });
      if (pts.length > maxTrail) pts.shift();
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMouseMove);

    const render = () => {
      const now = performance.now();
      // Cull old points
      const pts = (pointsRef.current = pointsRef.current.filter(
        (p) => now - p.t <= tailMs
      ));

      // Clear with slight fade to create motion blur on very slow moves
      ctx.clearRect(0, 0, c.width, c.height);

      // Draw newest -> oldest so tail looks layered
      for (let i = pts.length - 1; i >= 0; i--) {
        const p = pts[i];
        const age = (now - p.t) / tailMs; // 0 fresh -> 1 old
        const alpha = Math.max(0, 1 - age);

        // Map velocity to radius boost (tweak the 0.8 factor to taste)
        const speed = Math.min(1, p.v * 0.8); // clamp 0..1
        const r = baseRadius + speed * maxBoost;

        // Also taper older points
        const radius = r * (0.6 + 0.4 * (1 - age));

        // Draw a soft radial gradient “blob”
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius);
        grd.addColorStop(0, `rgba(${color},${0.12 * alpha})`);
        grd.addColorStop(0.5, `rgba(${color},${0.06 * alpha})`);
        grd.addColorStop(1, `rgba(${color},0)`);

        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [baseRadius, maxBoost, maxTrail, tailMs, color]);

  // Hidden (no pointer events), fixed full-screen canvas
  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex,
      }}
    />
  );
}
