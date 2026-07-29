"use client";
// ─────────────────────────────────────────────────────────────────────────
// The instrument.
//
// WHAT THIS ACTUALLY DOES, precisely, because the label has to match the
// mechanism: it schedules real synchronous long tasks on the main thread.
// It is NOT network latency — latency is a server and transport property,
// and pretending otherwise on a web-performance portfolio is the first thing
// a staff engineer would catch. What this reproduces is main-thread pressure:
// the failure mode behind bad INP, dropped frames and inputs that queue. That
// is the half of the résumé this page can honestly demonstrate in-browser,
// so that is what the control is named after.
//
// The blocking is genuine. Frames actually drop, the frame trace spikes for
// real, and interactions actually queue.
//
// Guard rails, because a portfolio that bricks a recruiter's laptop is not a
// clever portfolio:
//   · never runs until the visitor moves the fader themselves
//   · restores itself automatically after RESTORE_AFTER_MS
//   · scales down on low-core machines, off entirely below 4 cores
//   · off entirely under prefers-reduced-motion
//   · pauses on a hidden tab
//   · one long task is capped at 110ms, so the page always recovers
//   · Escape resets from anywhere, and the Reset button says so
// ─────────────────────────────────────────────────────────────────────────
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { chargeFader } from "@/lib/receipt";

/** Top of the scale: milliseconds of main-thread blocking per second. */
export const BLOCK_MAX = 260;
/** How often a long task is scheduled while the fader is up. */
const TASK_INTERVAL_MS = 420;
/** Hard ceiling on a single blocking task. */
const TASK_CEILING_MS = 110;
/** Nobody gets stuck in the degraded state. */
const RESTORE_AFTER_MS = 18_000;

interface LatencyValue {
  /** Main-thread blocking, in milliseconds per second. */
  blocked: number;
  /** 0 → 1, the same number the CSS reads as --lat. */
  lat: number;
  setBlocked: (next: number) => void;
  reset: () => void;
  /** True once the fader has been moved off zero at least once. */
  touched: boolean;
  /** False when the machine or the visitor's settings opt out of real jank. */
  jankEnabled: boolean;
}

const LatencyContext = createContext<LatencyValue | null>(null);

export function useLatency(): LatencyValue {
  const ctx = useContext(LatencyContext);
  if (!ctx) throw new Error("useLatency must be used inside <LatencyProvider>");
  return ctx;
}

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return reduced;
}

export function LatencyProvider({ children }: { children: React.ReactNode }) {
  const [blocked, setBlockedState] = useState(0);
  const [touched, setTouched] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  /* Machines that would suffer disproportionately get a gentler version, or
     none. hardwareConcurrency is a coarse signal, but it is the one we have,
     and erring gentle is the right direction. */
  const [cores, setCores] = useState(8);
  useEffect(() => setCores(navigator.hardwareConcurrency || 4), []);
  const jankScale = reducedMotion ? 0 : cores >= 8 ? 1 : cores >= 4 ? 0.5 : 0;
  const jankEnabled = jankScale > 0;

  const setBlocked = useCallback((next: number) => {
    const clamped = Math.max(0, Math.min(BLOCK_MAX, Math.round(next)));
    setBlockedState(clamped);
    if (clamped > 0) setTouched(true);
  }, []);

  const reset = useCallback(() => setBlockedState(0), []);

  /* ── Paint the state into CSS, throttled to one write per frame. Writing a
     variable that ~30 selectors interpolate off, on every pointermove, would
     be its own performance bug. ── */
  const frame = useRef(0);
  const target = useRef(0);
  useEffect(() => {
    target.current = blocked / BLOCK_MAX;
    if (frame.current) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      const root = document.documentElement;
      const lat = target.current;
      root.style.setProperty("--lat", lat.toFixed(4));
      /* Channel registration error: 0px at rest, a torn frame at the top. */
      root.style.setProperty("--split", `${(lat * 7).toFixed(2)}px`);
      root.dataset.degraded = lat > 0 ? "1" : "0";
      // Even the tab title is part of the instrument.
      document.title =
        lat > 0
          ? "⚠ main thread under load — Jordan Urbaez-Lu"
          : "Jordan Urbaez-Lu — Senior Lead Software Engineer";
    });
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
      frame.current = 0;
    };
  }, [blocked]);

  /* ── The real work. Deliberate main-thread blocking. ── */
  useEffect(() => {
    if (blocked <= 0 || !jankEnabled) return;
    const lat = blocked / BLOCK_MAX;
    const budget = Math.round(
      Math.min(TASK_CEILING_MS, 6 + lat * 104) * jankScale
    );

    const id = window.setInterval(() => {
      if (document.hidden) return;
      // Intentional synchronous block: this *is* the demonstration.
      const end = performance.now() + budget;
      let spins = 0;
      while (performance.now() < end) spins++;
      void spins;
      // Itemised on the footer's receipt. Only blocks that clear the 50ms
      // long-task threshold are charged, so the attribution can never
      // exceed the ledger it's attributed against.
      if (budget >= 50) chargeFader(budget);
    }, TASK_INTERVAL_MS);

    return () => window.clearInterval(id);
  }, [blocked, jankEnabled, jankScale]);

  /* ── Auto-restore. A visitor who drags the fader and then scrolls away must
     not end up filling in the contact form on a janky main thread. ── */
  useEffect(() => {
    if (blocked <= 0) return;
    const id = window.setTimeout(reset, RESTORE_AFTER_MS);
    return () => window.clearTimeout(id);
  }, [blocked, reset]);

  /* ── Escape always gets you out — but layers stack. When the schematic or
     the replay is open, Esc belongs to them (their own handlers close them);
     the fader only resets when nothing above it claimed the key. Without
     this, closing the schematic silently destroyed the load state the
     visitor was inspecting. ── */
  const blockedRef = useRef(blocked);
  blockedRef.current = blocked;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || blockedRef.current === 0) return;
      const root = document.documentElement.dataset;
      if (root.xray === "1" || root.replay === "1") return;
      reset();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [reset]);

  const value = useMemo<LatencyValue>(
    () => ({
      blocked,
      lat: blocked / BLOCK_MAX,
      setBlocked,
      reset,
      touched,
      jankEnabled,
    }),
    [blocked, setBlocked, reset, touched, jankEnabled]
  );

  return (
    <LatencyContext.Provider value={value}>
      {children}
      {/* Vignette that deepens with load. A plain gradient — the previous
          version filtered the whole viewport every frame. */}
      <div className="degrade-veil" aria-hidden />
    </LatencyContext.Provider>
  );
}
