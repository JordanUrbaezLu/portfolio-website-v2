"use client";
// ─────────────────────────────────────────────────────────────────────────
// The instrument. Fixed to the bottom of every screen.
//
// Left  — this page's real telemetry, from PerformanceObserver.
// Mid   — a live frame-time trace, one bar per real frame.
// Right — the fader that puts genuine load on the main thread.
//
// data-instrument marks this subtree so the global "interactions get slower"
// rule skips it: the control you use to escape must never feel sluggish.
// ─────────────────────────────────────────────────────────────────────────
import { useCallback, useEffect, useState } from "react";
import { BLOCK_MAX, useLatency } from "@/lib/latency";
import {
  formatKB,
  getTransferSummary,
  type TransferSummary,
} from "@/lib/paintFacts";
import {
  formatVital,
  unitFor,
  useTelemetry,
  verdictFor,
  VITAL_TITLE,
  type VitalName,
  type Verdict,
} from "@/lib/useVitals";
import { FrameTrace } from "./FrameTrace";

const VERDICT_TEXT: Record<Verdict, string> = {
  good: "text-good",
  warn: "text-warn",
  poor: "text-poor",
  pending: "text-faint",
};
const VERDICT_RULE: Record<Verdict, string> = {
  good: "bg-good",
  warn: "bg-warn",
  poor: "bg-poor",
  pending: "bg-rule-lit",
};

/** Plain-language bands for how the page now feels. */
function loadState(ms: number): string {
  if (ms === 0) return "As shipped";
  if (ms < 70) return "Noticeable";
  if (ms < 170) return "Sluggish";
  return "Unusable";
}

/** LOAD metrics are settled facts; LIVE metrics answer to the fader. */
/**
 * While the schematic is up the same cells report inventory instead of
 * vitals — one instrument, switched to a different range. A second stats
 * panel floating over the first would have been a feature buffet.
 */
interface Inventory {
  elements: number;
  transfer: TransferSummary;
}

function measureInventory(): Inventory {
  // The schematic overlay is in the DOM by the time this runs; excluding it
  // stops the instrument counting itself.
  const overlay = document.querySelector("[data-xray-layer]");
  const overlayCount = overlay ? overlay.querySelectorAll("*").length + 1 : 0;
  return {
    elements: document.querySelectorAll("*").length - overlayCount,
    transfer: getTransferSummary(),
  };
}

function InventoryCell({ name, value }: { name: string; value: string }) {
  return (
    <div className="min-w-0">
      <div className="label leading-none">{name}</div>
      <div className="readout mt-1.5 whitespace-nowrap text-[0.9375rem] leading-none tabular-nums text-paper">
        {value}
      </div>
      <div className="mt-1.5 h-px w-full bg-rule-lit opacity-40" />
    </div>
  );
}

const CELLS: { name: VitalName; live: boolean }[] = [
  { name: "LCP", live: false },
  { name: "CLS", live: false },
  { name: "INP", live: true },
  { name: "TBT", live: true },
];

function VitalCell({
  name,
  value,
  supported,
  live,
}: {
  name: VitalName;
  value: number | null;
  supported: boolean;
  live: boolean;
}) {
  const verdict = verdictFor(name, value);
  // Three distinct empty states. "Waiting for a click" is not "broken".
  const hint = !supported
    ? `${name} is not measurable in this browser`
    : value === null
      ? name === "INP"
        ? "INP — waiting for your first interaction"
        : `${name} — not recorded yet`
      : VITAL_TITLE[name];

  return (
    <div className="min-w-0" title={hint}>
      <div className="label flex items-center gap-1 leading-none">
        {name}
        {live && supported && (
          <span
            aria-hidden
            className="h-1 w-1 rounded-full bg-current opacity-60"
          />
        )}
      </div>
      <div className="mt-1.5 flex items-baseline gap-0.5">
        <span
          className={`readout text-[0.9375rem] leading-none tabular-nums ${
            supported && value !== null ? VERDICT_TEXT[verdict] : "text-faint"
          }`}
        >
          {!supported
            ? "n/a"
            : value === null
              ? // "Ready" rather than an em-dash: INP has nothing to report
                // until you interact, and a dash reads as a broken sensor.
                "ready"
              : formatVital(name, value)}
        </span>
        {supported && value !== null && (
          <span className="readout text-[0.625rem] leading-none text-faint">
            {unitFor(name)}
          </span>
        )}
      </div>
      {/* Keyed on the value: each new browser entry re-lands the underline. */}
      <div
        key={supported ? (value === null ? "pending" : Math.round(value * 1000)) : "na"}
        className={`measure-land mt-1.5 h-px w-full ${
          supported ? VERDICT_RULE[verdict] : "bg-rule"
        } ${verdict === "pending" || !supported ? "opacity-40" : ""}`}
      />
    </div>
  );
}

export interface TransportBarProps {
  xrayActive: boolean;
  onToggleXray: () => void;
  replayActive: boolean;
  onReplay: () => void;
  /** False under prefers-reduced-motion — the replay is pure motion. */
  replayAvailable: boolean;
}

export function TransportBar({
  xrayActive,
  onToggleXray,
  replayActive,
  onReplay,
  replayAvailable,
}: TransportBarProps) {
  const { telemetry, resetLive } = useTelemetry();
  const { blocked, setBlocked, reset, touched, jankEnabled } = useLatency();
  const [fps, setFps] = useState<number | null>(null);
  const [hovering, setHovering] = useState(false);
  const [openOnMobile, setOpenOnMobile] = useState(false);

  const resetAll = useCallback(() => {
    reset();
    resetLive();
  }, [reset, resetLive]);

  // Sample frames only when there is something worth sampling.
  const tracing = blocked > 0 || hovering;

  // Inventory range: measured once each time the schematic opens, after the
  // overlay has mounted (so it can be excluded from its own count).
  const [inventory, setInventory] = useState<Inventory | null>(null);
  useEffect(() => {
    if (!xrayActive) {
      setInventory(null);
      return;
    }
    setInventory(measureInventory());
  }, [xrayActive]);

  return (
    <div
      data-instrument
      onPointerEnter={() => setHovering(true)}
      onPointerLeave={() => setHovering(false)}
      onFocus={() => setHovering(true)}
      onBlur={() => setHovering(false)}
      className="fixed inset-x-0 bottom-0 z-[70] border-t border-rule bg-panel"
    >
      <div className="md:flex md:items-stretch">
        {/* ── Measurement rail ── */}
        <div
          className={`${
            openOnMobile ? "grid" : "hidden"
          } grid-cols-4 gap-x-4 gap-y-4 border-b border-rule px-4 py-3 md:flex md:flex-1 md:items-end md:gap-5 md:border-b-0 md:px-5`}
        >
          {/* Mode cluster: the two theatrical instruments. */}
          <div className="col-span-4 flex items-center gap-2 md:flex-col md:items-stretch md:justify-between md:gap-1.5 md:self-stretch md:pb-0.5">
            <div className="hidden items-center gap-2 lg:flex">
              <span className="live-dot h-1.5 w-1.5 rounded-full bg-good" />
              <span className="label text-dim">This page</span>
            </div>
            {/* Hierarchy: replay is a transport function and reads like one;
                the schematic is a view mode and stays quiet. */}
            <div className="flex flex-1 gap-2 md:flex-none">
              <button
                type="button"
                onClick={onReplay}
                disabled={replayActive || !replayAvailable}
                title={
                  replayAvailable
                    ? "Re-stage this session's real load timings in slow motion"
                    : "Disabled under your reduced-motion setting"
                }
                className="flex-1 border border-field px-2.5 py-1.5 transition-colors hover:bg-panel-2 disabled:pointer-events-none disabled:opacity-30 md:flex-none md:py-1"
              >
                <span className="label !text-paper">◂ Replay load</span>
              </button>
              <button
                type="button"
                onClick={onToggleXray}
                aria-pressed={xrayActive}
                className="flex-1 px-2 py-1.5 transition-colors md:flex-none md:py-1"
              >
                <span
                  className={`label ${
                    xrayActive
                      ? "!text-paper underline underline-offset-4"
                      : "!text-dim hover:!text-paper"
                  }`}
                >
                  Schematic<span className="hidden lg:inline"> · x</span>
                </span>
              </button>
            </div>
          </div>

          {xrayActive && inventory ? (
            <>
              <div className="md:w-[4.25rem]">
                <InventoryCell
                  name="Elements"
                  value={inventory.elements.toLocaleString("en-US")}
                />
              </div>
              <div className="md:w-[4.25rem]">
                <InventoryCell
                  name={inventory.transfer.cached ? "JS·cached" : "JS"}
                  value={formatKB(inventory.transfer.js)}
                />
              </div>
              <div className="md:w-[4.25rem]">
                <InventoryCell
                  name="Type"
                  value={formatKB(inventory.transfer.font)}
                />
              </div>
              <div className="md:w-[4.25rem]">
                <InventoryCell
                  name="Requests"
                  value={String(inventory.transfer.requests)}
                />
              </div>
            </>
          ) : (
            CELLS.map(({ name, live }) => (
              <div key={name} className="md:w-[4.25rem]">
                <VitalCell
                  name={name}
                  value={telemetry[name].value}
                  supported={telemetry[name].supported}
                  live={live}
                />
              </div>
            ))
          )}

          <div className="col-span-4 flex items-end gap-3 md:ml-1 md:flex-1">
            <div className="min-w-0 flex-1">
              <div className="label leading-none">Frame time</div>
              <FrameTrace
                className="mt-1.5 h-8 w-full min-w-[6rem]"
                active={tracing}
                onFps={setFps}
              />
            </div>
            <div className="shrink-0">
              <div className="label leading-none">FPS</div>
              <div className="readout mt-1.5 text-[0.9375rem] leading-none tabular-nums text-paper">
                {fps ?? <span className="text-faint">idle</span>}
              </div>
              <div className="mt-1.5 h-px w-full bg-rule-lit opacity-40" />
            </div>
          </div>
        </div>

        {/* ── Control rail ── */}
        <div className="flex items-center gap-3 px-4 py-2.5 md:w-[31rem] md:shrink-0 md:gap-4 md:border-l md:border-rule md:px-5 md:py-3">
          <button
            type="button"
            onClick={() => setOpenOnMobile((v) => !v)}
            aria-expanded={openOnMobile}
            className="shrink-0 py-2 md:hidden"
          >
            <span className="label text-dim">
              {openOnMobile ? "Hide" : "More"}
            </span>
          </button>

          <div className="hidden shrink-0 md:block">
            <div className="label leading-none">Main-thread load</div>
            <div className="mt-1.5 flex items-baseline gap-1">
              <span className="readout text-lg leading-none tabular-nums text-paper">
                {blocked}
              </span>
              <span className="readout text-[0.6875rem] leading-none text-faint">
                ms/s
              </span>
            </div>
          </div>

          <div className="relative flex-1">
            <label htmlFor="latency-fader" className="sr-only">
              Main-thread blocking, in milliseconds per second
            </label>
            <input
              id="latency-fader"
              type="range"
              className="fader"
              min={0}
              max={BLOCK_MAX}
              step={5}
              value={blocked}
              onChange={(e) => setBlocked(Number(e.target.value))}
              aria-valuetext={`${blocked} milliseconds of main-thread blocking per second — ${loadState(
                blocked
              )}`}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-1/2 flex justify-between"
            >
              <span className="h-3 w-px -translate-y-1/2 bg-rule-lit" />
              <span className="h-3 w-px -translate-y-1/2 bg-rule-lit" />
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            {/* Narrow on mobile so the fader itself keeps usable travel. */}
            <div className="w-14 text-right md:w-[5.25rem]">
              <span className="readout text-[0.8125rem] tabular-nums text-paper md:hidden">
                {blocked}
                <span className="text-faint">ms/s</span>
              </span>
              <span
                className={`label hidden md:block ${
                  blocked === 0
                    ? "!text-good"
                    : blocked < 170
                      ? "!text-warn"
                      : "!text-poor"
                }`}
              >
                {loadState(blocked)}
              </span>
            </div>
            <button
              type="button"
              onClick={resetAll}
              disabled={blocked === 0}
              className="border border-field px-2.5 py-1.5 transition-colors hover:bg-panel-2 disabled:pointer-events-none disabled:opacity-30"
            >
              <span className="label !text-paper">
                Reset<span className="hidden lg:inline"> · esc</span>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* One line of honesty. It earns the demo the right to be believed. */}
      <p className="hidden border-t border-rule px-5 py-1.5 text-[0.6875rem] leading-none text-faint md:block">
        {xrayActive
          ? "Schematic: boxes are live layout geometry; sizes are compressed transfer from PerformanceResourceTiming. Esc or X closes."
          : !jankEnabled
            ? "Visual simulation only — real blocking is off on this device or under your reduced-motion setting."
            : touched
              ? "This schedules genuine long tasks on the main thread; the dropped frames and the TBT above are the browser's own measurements. Restores itself after 18s."
              : "Every number here is measured live from this page by PerformanceObserver. None of it is a mock-up."}
      </p>
    </div>
  );
}
