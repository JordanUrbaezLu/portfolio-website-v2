"use client";
// ─────────────────────────────────────────────────────────────────────────
// The receipt. Itemises what this page has actually cost the visitor's
// device — time on page, main-thread time lost to long tasks, and how much
// of that loss the visitor caused themselves with the fader. Pages don't
// account for what they cost; this one closes with the bill.
//
// Updates once a second, and only while the footer is on screen — a
// receipt that burned CPU to display CPU costs would be the site's whole
// argument, lost, in miniature.
// ─────────────────────────────────────────────────────────────────────────
import { useEffect, useRef, useState } from "react";
import { getReceipt, installReceipt, type Receipt } from "@/lib/receipt";

function fmtClock(ms: number): string {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  return m > 0 ? `${m}m ${s % 60}s` : `${s}s`;
}

export function SessionReceipt() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [receipt, setReceipt] = useState<Receipt | null>(null);

  useEffect(() => {
    installReceipt();
    const root = rootRef.current;
    if (!root) return;

    let timer = 0;
    const observer = new IntersectionObserver(([entry]) => {
      window.clearInterval(timer);
      timer = 0;
      if (entry.isIntersecting) {
        setReceipt(getReceipt());
        timer = window.setInterval(() => setReceipt(getReceipt()), 1000);
      }
    });
    observer.observe(root);
    return () => {
      observer.disconnect();
      window.clearInterval(timer);
    };
  }, []);

  const rows: [string, string][] = receipt
    ? [
        ["Time on this page", fmtClock(receipt.sessionMs)],
        [
          "Main thread lost to long tasks",
          receipt.longTaskMs === null
            ? "n/a in this browser"
            : `${Math.round(receipt.longTaskMs).toLocaleString("en-US")} ms`,
        ],
        [
          "Of which: you, on the fader",
          `${Math.round(receipt.faderMs).toLocaleString("en-US")} ms`,
        ],
      ]
    : [];

  return (
    <div ref={rootRef} className="max-w-[24rem]">
      <p className="label">The receipt</p>
      <dl className="mt-3 space-y-2">
        {rows.map(([k, v]) => (
          <div
            key={k}
            className="flex items-baseline justify-between gap-6 border-b border-rule pb-2"
          >
            <dt className="text-[0.8125rem] leading-snug text-faint">{k}</dt>
            <dd className="readout whitespace-nowrap text-[0.8125rem] tabular-nums text-dim">
              {v}
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 text-[0.8125rem] leading-relaxed text-faint">
        Pages don&rsquo;t usually itemise what they cost your device. This one
        closes with the bill.
      </p>
    </div>
  );
}
