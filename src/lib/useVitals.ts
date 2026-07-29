"use client";
// ─────────────────────────────────────────────────────────────────────────
// Live telemetry for *this* page, measured with PerformanceObserver. No
// dependency — shipping the `web-vitals` package to prove you care about
// bytes would be its own kind of joke.
//
// Two classes of number, kept apart on purpose:
//   · LOAD metrics (TTFB, LCP, CLS) describe how this page arrived. They are
//     settled facts and the fader cannot change them.
//   · LIVE metrics (INP, TBT) describe how it is responding right now. These
//     are the ones the fader moves, and they move because the blocking is
//     real — TBT is summed from the browser's own long-task entries, not
//     from anything this code asserts.
//
// The live sample is resettable. An earlier version accumulated interaction
// durations for the whole session, which meant anyone who played with the
// demo left the page permanently reporting a red verdict about itself.
// ─────────────────────────────────────────────────────────────────────────
import { useCallback, useEffect, useRef, useState } from "react";

export type VitalName = "TTFB" | "LCP" | "CLS" | "INP" | "TBT";
export type Verdict = "good" | "warn" | "poor" | "pending";

export interface Reading {
  value: number | null;
  /**
   * False when the engine has no observer for this metric. As of mid-2026
   * that is CLS and TBT outside Chromium — `layout-shift` and `longtask` were
   * never implemented in Gecko or WebKit. LCP and INP landed in Safari 26.2
   * and Firefox 144, so those now read across all three engines.
   */
  supported: boolean;
}

export type Telemetry = Record<VitalName, Reading>;

/* Google's published thresholds. TBT has no field threshold; these are the
   Lighthouse lab bands. [good ceiling, poor floor] */
const THRESHOLDS: Record<VitalName, [number, number]> = {
  TTFB: [800, 1800],
  LCP: [2500, 4000],
  CLS: [0.1, 0.25],
  INP: [200, 500],
  TBT: [200, 600],
};

export const VITAL_TITLE: Record<VitalName, string> = {
  TTFB: "Time to first byte — how fast the server answered",
  LCP: "Largest contentful paint — when the main content finished rendering",
  CLS: "Cumulative layout shift — how much the page moved under you",
  INP: "Interaction to next paint — how fast this page answers your input",
  TBT: "Total blocking time — main thread unavailable to respond",
};

export function verdictFor(name: VitalName, value: number | null): Verdict {
  if (value === null) return "pending";
  const [good, poor] = THRESHOLDS[name];
  if (value <= good) return "good";
  if (value <= poor) return "warn";
  return "poor";
}

export function formatVital(name: VitalName, value: number | null): string {
  if (value === null) return "—";
  if (name === "CLS") return value.toFixed(3);
  return Math.round(value).toLocaleString("en-US");
}

export function unitFor(name: VitalName): string {
  return name === "CLS" ? "" : "ms";
}

/** Feature-detect once, without throwing on browsers that lack the API. */
function observes(type: string): boolean {
  if (typeof PerformanceObserver === "undefined") return false;
  const types = PerformanceObserver.supportedEntryTypes;
  return Array.isArray(types) && types.includes(type);
}

const EMPTY: Telemetry = {
  TTFB: { value: null, supported: true },
  LCP: { value: null, supported: true },
  CLS: { value: null, supported: true },
  INP: { value: null, supported: true },
  TBT: { value: null, supported: true },
};

export function useTelemetry() {
  const [telemetry, setTelemetry] = useState<Telemetry>(EMPTY);

  /* Batch writes into one state update per frame — an observer that caused
     the jank it measures would be worse than no observer. */
  const pending = useRef<Partial<Telemetry>>({});
  const raf = useRef(0);
  /** Cleared by resetLive(); observers write through these. */
  const interactions = useRef<number[]>([]);
  const blockingSince = useRef(0);
  const applyRef = useRef<(n: VitalName, v: number | null, s?: boolean) => void>(
    () => {}
  );

  const resetLive = useCallback(() => {
    interactions.current = [];
    blockingSince.current = 0;
    applyRef.current("INP", null);
    applyRef.current("TBT", 0);
  }, []);

  useEffect(() => {
    const apply = (name: VitalName, value: number | null, supported = true) => {
      pending.current[name] = { value, supported };
      if (raf.current) return;
      raf.current = requestAnimationFrame(() => {
        raf.current = 0;
        const patch = pending.current;
        pending.current = {};
        setTelemetry((prev) => ({ ...prev, ...patch }));
      });
    };
    applyRef.current = apply;

    const observers: PerformanceObserver[] = [];
    const observe = (
      type: string,
      cb: (entries: PerformanceEntryList) => void,
      init: PerformanceObserverInit = {}
    ) => {
      if (!observes(type)) return false;
      try {
        const po = new PerformanceObserver((list) => cb(list.getEntries()));
        po.observe({ type, buffered: true, ...init });
        observers.push(po);
        return true;
      } catch {
        return false;
      }
    };

    /* ── TTFB ── straight off the navigation entry, no observer needed. */
    const [nav] = performance.getEntriesByType(
      "navigation"
    ) as PerformanceNavigationTiming[];
    if (nav) apply("TTFB", Math.max(0, nav.responseStart - nav.startTime));
    else apply("TTFB", null, false);

    /* ── LCP ── keep the latest candidate. The browser stops emitting once
       the visitor interacts, which is the correct definition. Not available
       from getEntriesByType — it must come through a buffered observer. */
    if (
      !observe("largest-contentful-paint", (entries) => {
        const last = entries[entries.length - 1];
        if (last) apply("LCP", last.startTime);
      })
    ) {
      apply("LCP", null, false);
    }

    /* ── CLS ── session-window algorithm: shifts group into windows that break
       after a 1s gap or 5s of total duration; CLS is the worst window. Shifts
       within 500ms of real input are excluded by the browser via
       hadRecentInput, which is why dragging the fader cannot inflate it. */
    let clsValue = 0;
    let sessionValue = 0;
    let sessionFirst = 0;
    let sessionLast = 0;
    if (
      !observe("layout-shift", (entries) => {
        for (const entry of entries as LayoutShift[]) {
          if (entry.hadRecentInput) continue;
          if (
            sessionValue &&
            (entry.startTime - sessionLast >= 1000 ||
              entry.startTime - sessionFirst >= 5000)
          ) {
            sessionValue = 0;
          }
          if (sessionValue === 0) sessionFirst = entry.startTime;
          sessionLast = entry.startTime;
          sessionValue += entry.value;
          if (sessionValue > clsValue) clsValue = sessionValue;
        }
        apply("CLS", clsValue);
      })
    ) {
      apply("CLS", null, false);
    } else {
      // A page that never shifted has a CLS of 0, not "unknown". Leaving it
      // null renders an em-dash, which reads as broken instrumentation on the
      // one metric this page should be proudest of.
      apply("CLS", 0);
    }

    /* ── INP ── the slowest interaction, discounting one outlier per 50
       (the p98 rule the web-vitals spec uses). Live: blocking the main thread
       makes this climb for real the next time you click something. */
    if (
      !observe(
        "event",
        (entries) => {
          let changed = false;
          for (const entry of entries as PerformanceEventTiming[]) {
            if (!entry.interactionId) continue;
            interactions.current.push(entry.duration);
            changed = true;
          }
          if (!changed) return;
          const sorted = [...interactions.current].sort((a, b) => b - a);
          const index = Math.min(
            sorted.length - 1,
            Math.floor(sorted.length / 50)
          );
          apply("INP", sorted[index]);
        },
        { durationThreshold: 16 }
      )
    ) {
      apply("INP", null, false);
    }

    /* ── TBT ── the browser's own long-task entries, summed as time over the
       50ms threshold. This is the metric the fader actually moves, measured
       by the platform rather than asserted by us. */
    if (
      !observe("longtask", (entries) => {
        for (const entry of entries) {
          blockingSince.current += Math.max(0, entry.duration - 50);
        }
        apply("TBT", blockingSince.current);
      })
    ) {
      apply("TBT", null, false);
    } else {
      // No long tasks yet is a measurement of zero, not an absent sensor.
      apply("TBT", 0);
    }

    return () => {
      for (const po of observers) po.disconnect();
      if (raf.current) cancelAnimationFrame(raf.current);
      raf.current = 0;
      pending.current = {};
    };
  }, []);

  return { telemetry, resetLive };
}
