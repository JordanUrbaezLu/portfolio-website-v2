"use client";
// ─────────────────────────────────────────────────────────────────────────
// Live frame-time trace. Every bar is one real frame, measured from
// requestAnimationFrame deltas — when the fader blocks the main thread the
// spikes you see are the frames that actually dropped.
//
// The loop only runs while `active` is true (the fader is up, or the pointer
// is over the instrument). A permanent rAF loop would make it structurally
// impossible for this page to reach idle — burning battery forever in order
// to display a number claiming it doesn't waste CPU.
//
// Draws straight to canvas inside the loop: no state, no React render per
// frame.
// ─────────────────────────────────────────────────────────────────────────
import { useEffect, useRef } from "react";

const SAMPLES = 96;
/** Full-height bar. Anything worse is clipped and reads as off the scale. */
const CEILING_MS = 50;
const FRAME_BUDGET_MS = 1000 / 60;

const COLOR = {
  ok: "rgba(238,242,244,0.42)",
  warn: "#e8bc5c",
  poor: "#ff5f4d",
  guide: "rgba(238,242,244,0.16)",
  idle: "rgba(238,242,244,0.12)",
};

export function FrameTrace({
  className,
  active,
  onFps,
}: {
  className?: string;
  /** Runs the sampling loop. When false the canvas holds its last trace. */
  active: boolean;
  /** Throttled to ~4Hz so the readout never drives a 60fps re-render. */
  onFps?: (fps: number | null) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onFpsRef = useRef(onFps);
  onFpsRef.current = onFps;

  /* Samples survive across active/inactive cycles so the trace does not blank
     out every time the pointer leaves. */
  const samples = useRef<Float32Array>(
    new Float32Array(SAMPLES).fill(FRAME_BUDGET_MS)
  );
  const head = useRef(0);
  const drawRef = useRef<(dim: boolean) => void>(() => {});

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let cssW = 0;
    let cssH = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cssW = rect.width;
      cssH = rect.height;
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawRef.current(true);
    };

    const draw = (dim: boolean) => {
      if (!cssW || !cssH) return;
      ctx.clearRect(0, 0, cssW, cssH);

      const guideY = cssH - (FRAME_BUDGET_MS / CEILING_MS) * cssH;
      ctx.fillStyle = COLOR.guide;
      ctx.fillRect(0, guideY, cssW, 1);

      const slot = cssW / SAMPLES;
      const barW = Math.max(1, slot - 1);
      for (let i = 0; i < SAMPLES; i++) {
        const value = samples.current[(head.current + i) % SAMPLES];
        const clamped = Math.min(value, CEILING_MS);
        const h = Math.max(1, (clamped / CEILING_MS) * cssH);
        ctx.fillStyle = dim
          ? COLOR.idle
          : value > 34
            ? COLOR.poor
            : value > 20
              ? COLOR.warn
              : COLOR.ok;
        ctx.fillRect(i * slot, cssH - h, barW, h);
      }
    };
    drawRef.current = draw;

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    return () => {
      ro.disconnect();
      drawRef.current = () => {};
    };
  }, []);

  useEffect(() => {
    if (!active) {
      drawRef.current(true);
      onFpsRef.current?.(null);
      return;
    }

    let raf = 0;
    let last = performance.now();
    let accum = 0;
    let count = 0;
    let lastReport = last;

    const tick = (now: number) => {
      const delta = now - last;
      last = now;

      if (delta > 0 && delta < 2000) {
        samples.current[head.current] = delta;
        head.current = (head.current + 1) % SAMPLES;
        accum += delta;
        count++;
      }

      if (now - lastReport >= 250) {
        if (count) onFpsRef.current?.(Math.round(1000 / (accum / count)));
        accum = 0;
        count = 0;
        lastReport = now;
      }

      drawRef.current(false);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // A trace of a tab nobody is looking at measures nothing useful.
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      role="img"
      aria-label="Live frame-time trace for this page"
    />
  );
}
