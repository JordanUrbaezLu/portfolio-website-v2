"use client";
// Shared handle on the instrument modes, so controls can live where the
// visitor is looking (the hero) while the state stays in one place (the
// shell). Server-rendered sections pass through the provider untouched;
// only the small client controls inside them consume it.
import { createContext, useContext } from "react";

export interface InstrumentModes {
  xray: boolean;
  toggleXray: () => void;
  replaying: boolean;
  startReplay: () => void;
  /** False under prefers-reduced-motion — the replay is pure motion. */
  replayAvailable: boolean;
}

export const InstrumentContext = createContext<InstrumentModes | null>(null);

export function useInstrumentModes(): InstrumentModes {
  const ctx = useContext(InstrumentContext);
  if (!ctx) {
    throw new Error("useInstrumentModes must be used inside PageShell");
  }
  return ctx;
}
