"use client";
// ─────────────────────────────────────────────────────────────────────────
// The session's own load story, cached once. X-Ray and Replay both read from
// here, so every number they show traces back to a real browser entry:
//   · TTFB / requestStart / FCP — navigation + paint entries (timeline-
//     buffered, free)
//   · LCP + which element it was — a largest-contentful-paint observer,
//     installed with `buffered: true` from the shell's first effect, so the
//     entries emitted before hydration are redelivered rather than lost
//   · transfer sizes — PerformanceResourceTiming, compressed over-the-wire
// Nothing in this file asserts a number the browser didn't produce.
// ─────────────────────────────────────────────────────────────────────────

export interface PaintFacts {
  ttfb: number | null;
  /** When the request actually left — after redirect, DNS, TCP, TLS. */
  requestStart: number | null;
  fcp: number | null;
  lcp: number | null;
  lcpElement: Element | null;
}

const facts: PaintFacts = {
  ttfb: null,
  requestStart: null,
  fcp: null,
  lcp: null,
  lcpElement: null,
};

let installed = false;

export function installPaintFacts(): void {
  if (installed || typeof window === "undefined") return;
  installed = true;

  const [nav] = performance.getEntriesByType(
    "navigation"
  ) as PerformanceNavigationTiming[];
  if (nav) {
    facts.ttfb = Math.max(0, nav.responseStart - nav.startTime);
    facts.requestStart = Math.max(0, nav.requestStart - nav.startTime);
  }

  // FCP through a buffered observer, not a one-shot timeline read: this
  // build hydrates FASTER than it paints (~100ms vs ~120ms locally), so at
  // install time the paint entry may not exist yet. A timeline read here
  // cached fcp=null forever and silently disabled Replay — in production
  // only, because dev was slow enough to hide it.
  try {
    const paintPo = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === "first-contentful-paint") facts.fcp = entry.startTime;
      }
    });
    paintPo.observe({ type: "paint", buffered: true });
  } catch {
    for (const entry of performance.getEntriesByType("paint")) {
      if (entry.name === "first-contentful-paint") facts.fcp = entry.startTime;
    }
  }

  // LCP is not on the performance timeline — it only arrives through a
  // buffered observer, and the browser stops emitting after first input.
  try {
    const po = new PerformanceObserver((list) => {
      const entries = list.getEntries() as LargestContentfulPaint[];
      const last = entries[entries.length - 1];
      if (last) {
        facts.lcp = last.startTime;
        facts.lcpElement = last.element ?? null;
      }
    });
    po.observe({ type: "largest-contentful-paint", buffered: true });
  } catch {
    // No LCP in this engine; Replay falls back to FCP.
  }
}

export function getPaintFacts(): PaintFacts {
  installPaintFacts();
  return facts;
}

/**
 * When the site finished hydrating, marked from the shell's first effect.
 * Replay stages it as its final act — the gap between FCP and this mark is
 * what server rendering buys.
 */
export function markHydrated(): void {
  if (typeof performance === "undefined") return;
  if (performance.getEntriesByName("instrument-hydrated").length === 0) {
    performance.mark("instrument-hydrated");
  }
}

export function getHydratedAt(): number | null {
  if (typeof performance === "undefined") return null;
  const [mark] = performance.getEntriesByName("instrument-hydrated");
  return mark ? mark.startTime : null;
}

export interface TransferSummary {
  /** All sizes in bytes, compressed (transferSize; encoded size if cached). */
  js: number;
  css: number;
  font: number;
  doc: number;
  other: number;
  total: number;
  requests: number;
  /** True when everything came from cache — nothing actually transferred. */
  cached: boolean;
}

export function getTransferSummary(): TransferSummary {
  const out: TransferSummary = {
    js: 0,
    css: 0,
    font: 0,
    doc: 0,
    other: 0,
    total: 0,
    requests: 0,
    cached: true,
  };
  if (typeof performance === "undefined") return out;

  const [nav] = performance.getEntriesByType(
    "navigation"
  ) as PerformanceNavigationTiming[];
  if (nav) {
    if (nav.transferSize > 0) out.cached = false;
    out.doc = nav.transferSize || nav.encodedBodySize || 0;
    out.requests += 1;
  }

  const resources = performance.getEntriesByType(
    "resource"
  ) as PerformanceResourceTiming[];
  for (const r of resources) {
    if (r.transferSize > 0) out.cached = false;
    const bytes = r.transferSize || r.encodedBodySize || 0;
    out.requests += 1;
    if (r.initiatorType === "script") out.js += bytes;
    else if (
      r.initiatorType === "css" ||
      (r.initiatorType === "link" && r.name.endsWith(".css"))
    )
      out.css += bytes;
    else if (/\.woff2?($|\?)/.test(r.name)) out.font += bytes;
    else out.other += bytes;
  }
  out.total = out.js + out.css + out.font + out.doc + out.other;
  return out;
}

/** No 1-kB floor: zero bytes reads "0 kB", because that is what happened. */
export function formatKB(bytes: number): string {
  return `${Math.round(bytes / 1024)} kB`;
}
