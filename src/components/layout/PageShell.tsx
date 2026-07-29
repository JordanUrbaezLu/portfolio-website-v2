"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { LatencyProvider, usePrefersReducedMotion } from "@/lib/latency";
import { installPaintFacts, markHydrated } from "@/lib/paintFacts";
import {
  InstrumentContext,
  type InstrumentModes,
} from "@/components/instrument/InstrumentContext";
import { TransportBar } from "@/components/instrument/TransportBar";
import { XRay } from "@/components/instrument/XRay";
import { Replay } from "@/components/instrument/Replay";
import { InputEcho } from "@/components/instrument/InputEcho";
import { TopBar, type NavSection } from "@/components/layout/TopBar";
import { useActiveSection } from "@/hooks/useActiveSection";

const SECTIONS: readonly NavSection[] = [
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "stack", label: "Stack" },
  { id: "contact", label: "Contact" },
];

/* A scroll-velocity fringe was built here and cut on review: once scrolling
   also tears the h1, the tear stops meaning "the main thread is degraded"
   and becomes decoration — which retroactively cheapens the fader's signal.
   The RGB split means exactly one thing, so --split stays load-owned. */

function Shell({ children }: { children: React.ReactNode }) {
  const ids = useMemo(() => ["top", ...SECTIONS.map((s) => s.id)], []);
  const active = useActiveSection(ids);
  const reduced = usePrefersReducedMotion();

  const [xray, setXray] = useState(false);
  const [replaying, setReplaying] = useState(false);

  useEffect(() => {
    installPaintFacts();
    // The hydration timestamp Replay stages as its final act.
    markHydrated();
  }, []);

  const toggleXray = useCallback(() => {
    setReplaying(false);
    setXray((v) => !v);
  }, []);
  const startReplay = useCallback(() => {
    if (reduced) return;
    setXray(false);
    setReplaying(true);
  }, [reduced]);
  const endReplay = useCallback(() => setReplaying(false), []);
  const closeXray = useCallback(() => setXray(false), []);

  // X toggles the schematic anywhere except inside a form field.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== "x") return;
      if (e.metaKey || e.ctrlKey || e.altKey || e.repeat) return;
      const t = e.target as HTMLElement | null;
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
      toggleXray();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggleXray]);

  const modes = useMemo<InstrumentModes>(
    () => ({
      xray,
      toggleXray,
      replaying,
      startReplay,
      replayAvailable: !reduced,
    }),
    [xray, toggleXray, replaying, startReplay, reduced]
  );

  return (
    <InstrumentContext.Provider value={modes}>
      <a
        href="#work"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:bg-paper focus:px-4 focus:py-3 focus:text-void"
      >
        Skip to content
      </a>
      <TopBar sections={SECTIONS} active={active} />
      <main className="pb-20 md:pb-32">{children}</main>
      <XRay active={xray} onClose={closeXray} />
      <Replay active={replaying} onDone={endReplay} />
      <InputEcho />
      <TransportBar
        xrayActive={xray}
        onToggleXray={toggleXray}
        replayActive={replaying}
        onReplay={startReplay}
        replayAvailable={!reduced}
      />
    </InstrumentContext.Provider>
  );
}

/**
 * Client boundary for the interactive chrome. Sections stay server-rendered
 * and are passed through as children, so none of their markup ships as JS.
 */
export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <LatencyProvider>
      <Shell>{children}</Shell>
    </LatencyProvider>
  );
}
