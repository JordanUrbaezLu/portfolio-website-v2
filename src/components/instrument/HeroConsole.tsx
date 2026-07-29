"use client";
// ─────────────────────────────────────────────────────────────────────────
// The console. The three instruments, as real controls, in the first
// viewport — v2's mistake was hiding everything interesting behind a
// keyboard shortcut and a small button at the bottom of the screen. A page
// whose argument is its instruments leads with the instruments.
//
// Every button here drives the same state as the transport bar; nothing is
// duplicated except the visitor's chance of finding it.
// ─────────────────────────────────────────────────────────────────────────
import { useLatency } from "@/lib/latency";
import { useInstrumentModes } from "./InstrumentContext";
import { profile } from "@/data/profile";

const DEMO_LOAD = 200;

export function HeroConsole() {
  const { blocked, setBlocked, reset } = useLatency();
  const { xray, toggleXray, replaying, startReplay, replayAvailable } =
    useInstrumentModes();

  const rows: {
    key: string;
    text: string;
    label: string;
    onClick: () => void;
    active?: boolean;
    disabled?: boolean;
    title?: string;
  }[] = [
    {
      key: "load",
      text: profile.invitation,
      label: blocked > 0 ? "Reset · esc" : `Load it · ${DEMO_LOAD} ms/s`,
      onClick: () => (blocked > 0 ? reset() : setBlocked(DEMO_LOAD)),
      active: blocked > 0,
    },
    {
      key: "xray",
      text: profile.invitation2,
      label: xray ? "Close · esc" : "Schematic · x",
      onClick: toggleXray,
      active: xray,
    },
    {
      key: "replay",
      text: profile.invitation3,
      label: "◂ Replay load",
      onClick: startReplay,
      disabled: replaying || !replayAvailable,
      title: replayAvailable
        ? undefined
        : "Disabled under your reduced-motion setting",
    },
  ];

  return (
    <div className="mt-14 max-w-[44rem] border border-rule">
      <div className="flex items-center gap-2 border-b border-rule bg-panel px-5 py-2.5">
        <span className="live-dot h-1.5 w-1.5 rounded-full bg-good" />
        <p className="label !text-paper">
          This page is a live instrument — operate it
        </p>
      </div>
      {rows.map((row) => (
        <div
          key={row.key}
          className="flex flex-col gap-3 border-b border-rule px-5 py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
        >
          <p className="max-w-[52ch] text-[0.9375rem] leading-relaxed text-dim">
            {row.text}
          </p>
          <button
            type="button"
            onClick={row.onClick}
            disabled={row.disabled}
            title={row.title}
            className={`shrink-0 self-start border px-3.5 py-2.5 transition-colors sm:self-auto ${
              row.active
                ? "border-paper bg-paper"
                : "border-field hover:bg-panel"
            } disabled:pointer-events-none disabled:opacity-30`}
          >
            <span
              className={`label whitespace-nowrap ${
                row.active ? "!text-void" : "!text-paper"
              }`}
            >
              {row.label}
            </span>
          </button>
        </div>
      ))}
    </div>
  );
}
