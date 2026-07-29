// Performance APIs that TypeScript's lib.dom.d.ts still does not ship.
// No import/export in this file, so these are global declarations.
//
// Present in lib.dom already (do not redeclare): PerformanceEntry,
// PerformanceObserver, PerformancePaintTiming, PerformanceNavigationTiming,
// LargestContentfulPaint, PerformanceEventTiming.

/** Layout Instability API — absent from lib.dom.d.ts entirely. */
interface LayoutShiftAttribution {
  readonly node: Node | null;
  readonly previousRect: DOMRectReadOnly;
  readonly currentRect: DOMRectReadOnly;
}

/** entryType: "layout-shift". Chromium only — Gecko and WebKit never shipped it. */
interface LayoutShift extends PerformanceEntry {
  readonly value: number;
  readonly hadRecentInput: boolean;
  readonly lastInputTime: DOMHighResTimeStamp;
  readonly sources: ReadonlyArray<LayoutShiftAttribution>;
}

// The interfaces below exist in lib.dom.d.ts; these merges add only the
// members it is missing. Typed exactly as the spec has them, so a future
// TypeScript release that adds them merges cleanly instead of conflicting.

interface PerformanceEventTiming {
  /** Non-zero only for pointerdown/pointerup/click/keydown/keyup. */
  readonly interactionId: number;
}

interface PerformanceObserverInit {
  /** "event" entryType only. Floor is 16ms, rounded to the nearest 8ms. */
  durationThreshold?: DOMHighResTimeStamp;
}
