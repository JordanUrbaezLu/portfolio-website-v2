// ─────────────────────────────────────────────────────────────────────────
// The receipt. A page should be able to account for what it costs the
// device it runs on; this one itemises it. Two ledgers:
//   · long-task time — the browser's own longtask entries, buffered from
//     navigation, so the total includes anything before hydration
//   · the fader's share — the latency engine reports each deliberate block
//     it schedules (only those long enough to register as long tasks, so
//     the attribution can never exceed the ledger it's attributed against)
// ─────────────────────────────────────────────────────────────────────────

let longTaskMs = 0;
let faderMs = 0;
let installed = false;

export function installReceipt(): void {
  if (installed || typeof window === "undefined") return;
  installed = true;
  try {
    const po = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) longTaskMs += entry.duration;
    });
    po.observe({ type: "longtask", buffered: true });
  } catch {
    // No longtask observer in this engine; the receipt shows n/a.
    longTaskMs = -1;
  }
}

/** Called by the latency engine for each deliberate block ≥ the 50ms
 *  long-task threshold — smaller spins never appear in the ledger, so they
 *  must not appear in the attribution either. */
export function chargeFader(ms: number): void {
  faderMs += ms;
}

export interface Receipt {
  /** Milliseconds since navigation start. */
  sessionMs: number;
  /** Total long-task time, or null when the engine can't measure it. */
  longTaskMs: number | null;
  /** The share deliberately caused via the fader. */
  faderMs: number;
}

export function getReceipt(): Receipt {
  installReceipt();
  return {
    sessionMs: typeof performance === "undefined" ? 0 : performance.now(),
    longTaskMs: longTaskMs < 0 ? null : longTaskMs,
    faderMs: longTaskMs < 0 ? faderMs : Math.min(faderMs, longTaskMs),
  };
}
