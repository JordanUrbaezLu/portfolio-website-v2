"use client";
// ─────────────────────────────────────────────────────────────────────────
// The input buffer, drawn like phosphor persistence on a scope: the page
// keeps ~2 seconds of your pointer's path and renders it as a faint,
// decaying trace. It is not decoration — it is literally the buffer the
// instrument reads.
//
// At rest the trace is a whisper of paper that fades as it ages. Put load
// on the main thread and the tail of the path the handler queue hasn't
// digested yet re-renders in channel colour, capped by a hairline reticle
// at the last processed position and the measured *input delay*:
// performance.now() - event.timeStamp, the real time each event waited
// before its handler ran.
//
// What the number is: the input-delay phase, reported as the worst case in
// the last ~700ms (the blocking is bursty; an average would understate what
// the hand just felt). What it is NOT: INP — pointermove has no
// interactionId, and INP adds processing + presentation on discrete
// interactions. The label says "input delay" because that is what it is.
//
// Discipline: fine pointers only, off under reduced motion, and the rAF
// loop exits once the trace has fully decayed — a motionless cursor costs
// nothing.
// ─────────────────────────────────────────────────────────────────────────
import { useEffect, useRef } from "react";
import { useLatency, usePrefersReducedMotion } from "@/lib/latency";

interface Sample {
  x: number;
  y: number;
  t: number;
}

const TRAIL_MS = 2200;
const WINDOW_MS = 700;
/** Below this the gap is frame-alignment noise, not signal. */
const FLOOR_MS = 12;

const PAPER = "238,242,244";
const CHAN_B = "#3d7bff";
const POOR = "#ff5f4d";

export function InputEcho() {
  const { blocked, jankEnabled } = useLatency();
  const reduced = usePrefersReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const loadedRef = useRef(false);
  loadedRef.current = blocked > 0 && jankEnabled;

  useEffect(() => {
    if (reduced) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Canvas font strings cannot resolve var(); take the computed family once.
    const family = getComputedStyle(document.body).fontFamily || "sans-serif";

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const trail: Sample[] = [];
    /** (delay, seenAt) pairs — the readout is the window max. */
    const delays: Array<[number, number]> = [];
    let running = false;
    let raf = 0;

    const windowMax = (now: number): number => {
      while (delays.length && delays[0][1] < now - WINDOW_MS) delays.shift();
      let max = 0;
      for (const [d] of delays) if (d > max) max = d;
      return max;
    };

    /** Position along the real path, at an earlier moment in time. */
    const positionAt = (time: number): Sample | null => {
      if (trail.length === 0) return null;
      if (time <= trail[0].t) return trail[0];
      for (let i = trail.length - 1; i > 0; i--) {
        if (trail[i - 1].t <= time) {
          const a = trail[i - 1];
          const b = trail[i];
          const f = b.t === a.t ? 1 : (time - a.t) / (b.t - a.t);
          return {
            x: a.x + (b.x - a.x) * Math.min(1, f),
            y: a.y + (b.y - a.y) * Math.min(1, f),
            t: time,
          };
        }
      }
      return trail[trail.length - 1];
    };

    const tick = () => {
      const now = performance.now();
      while (trail.length && trail[0].t < now - TRAIL_MS) trail.shift();

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // Fully decayed: one clean frame, then stop until the pointer moves.
      if (trail.length < 2) {
        running = false;
        return;
      }

      const loaded = loadedRef.current;
      const delay = loaded ? windowMax(now) : 0;
      const echoTime = now - delay;

      // ── Phosphor: each segment fades with its age. ──
      ctx.lineWidth = 1;
      ctx.lineCap = "round";
      for (let i = 1; i < trail.length; i++) {
        const a = trail[i - 1];
        const b = trail[i];
        const age = now - b.t;
        const queued = loaded && delay > FLOOR_MS && b.t > echoTime;
        if (queued) continue; // the undigested tail is drawn separately
        const alpha = Math.max(0, 1 - age / TRAIL_MS) * 0.13;
        if (alpha < 0.01) continue;
        ctx.strokeStyle = `rgba(${PAPER},${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      // ── The queue: the stretch of path the main thread hasn't reached. ──
      if (loaded && delay > FLOOR_MS) {
        const echo = positionAt(echoTime);
        if (echo) {
          const color = delay > 150 ? POOR : CHAN_B;
          ctx.strokeStyle = color;
          ctx.globalAlpha = 0.7;
          ctx.beginPath();
          ctx.moveTo(echo.x, echo.y);
          for (let i = 0; i < trail.length; i++) {
            if (trail[i].t > echoTime) ctx.lineTo(trail[i].x, trail[i].y);
          }
          ctx.stroke();
          ctx.globalAlpha = 1;

          // Hairline reticle — the last position the main thread has seen.
          ctx.beginPath();
          ctx.arc(echo.x, echo.y, 6, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(echo.x - 10, echo.y);
          ctx.lineTo(echo.x - 3, echo.y);
          ctx.moveTo(echo.x + 3, echo.y);
          ctx.lineTo(echo.x + 10, echo.y);
          ctx.moveTo(echo.x, echo.y - 10);
          ctx.lineTo(echo.x, echo.y - 3);
          ctx.moveTo(echo.x, echo.y + 3);
          ctx.lineTo(echo.x, echo.y + 10);
          ctx.stroke();

          if (delay > 30) {
            ctx.font = `600 11px ${family}`;
            ctx.fillStyle = color;
            ctx.fillText(
              `input delay +${Math.round(delay)} ms`,
              echo.x + 14,
              echo.y - 10
            );
          }
        }
      }

      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      delays.push([Math.max(0, performance.now() - e.timeStamp), performance.now()]);
      trail.push({ x: e.clientX, y: e.clientY, t: e.timeStamp });
      if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", resize);
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    };
  }, [reduced]);

  if (reduced) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[75]"
    />
  );
}
