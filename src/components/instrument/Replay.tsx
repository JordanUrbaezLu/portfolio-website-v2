"use client";
// ─────────────────────────────────────────────────────────────────────────
// Load replay. Re-stages this session's own page load in slow motion, from
// the timings the browser actually recorded. Silent cinema rules: one clock,
// markers that trigger like an oscilloscope (no slide-ins), a curtain that
// lifts at the real FCP, and the real LCP element crowned at the real LCP
// time. The final act is hydration — the gap between "readable" and "the
// instrument came alive" is the whole server-rendering argument, staged.
//
// Honesty rules, in order of importance:
//   · t=0 is navigation start, and is labelled that — the request itself
//     left at requestStart, which gets its own marker
//   · the finished render stands in for the original frames, and the card
//     says so
//   · if the visitor left the fader up, the replay itself lags — and the end
//     card admits it, because the reconstruction obeys the same physics the
//     page does. The measurement and the theater are not exempt from each
//     other.
//
// The counter mutates a ref's textContent inside rAF; re-rendering React at
// 60Hz to display a millisecond counter would be a self-own.
// ─────────────────────────────────────────────────────────────────────────
import { useEffect, useRef, useState } from "react";
import { getHydratedAt, getPaintFacts } from "@/lib/paintFacts";
import { useLatency } from "@/lib/latency";

interface Marker {
  at: number;
  text: string;
}

interface Timeline {
  markers: Marker[];
  fcpAt: number;
  lcpAt: number | null;
  end: number;
  scale: number;
  lcpBox: { top: number; left: number; width: number; height: number } | null;
}

const REPLAY_DURATION_MS = 5600;

function buildTimeline(): Timeline | null {
  const facts = getPaintFacts();
  const fcp = facts.fcp;
  if (fcp === null) return null; // Nothing measured — nothing to restage.

  const lcp = facts.lcp !== null && facts.lcp >= fcp ? facts.lcp : null;
  const hydrated = getHydratedAt();

  const markers: Marker[] = [{ at: 0, text: "0 ms — navigation started" }];
  if (facts.requestStart !== null && facts.requestStart > 4) {
    markers.push({
      at: facts.requestStart,
      text: `${Math.round(facts.requestStart)} ms — request sent`,
    });
  }
  if (facts.ttfb !== null) {
    markers.push({
      at: facts.ttfb,
      text: `${Math.round(facts.ttfb)} ms — first byte arrived`,
    });
  }
  markers.push({
    at: fcp,
    text: `${Math.round(fcp)} ms — first paint · page readable`,
  });

  let lcpBox: Timeline["lcpBox"] = null;
  if (lcp !== null && facts.lcpElement && document.contains(facts.lcpElement)) {
    const r = facts.lcpElement.getBoundingClientRect();
    lcpBox = { top: r.top, left: r.left, width: r.width, height: r.height };
    markers.push({
      at: lcp,
      text: `${Math.round(lcp)} ms — largest contentful paint`,
    });
  }

  if (hydrated !== null && hydrated > fcp) {
    markers.push({
      at: hydrated,
      text: `${Math.round(hydrated)} ms — JavaScript hydrated · the bar below came alive`,
    });
  }

  markers.sort((a, b) => a.at - b.at);
  const end = markers[markers.length - 1].at + 120;
  const scale = REPLAY_DURATION_MS / end;

  return { markers, fcpAt: fcp, lcpAt: lcp, end, scale, lcpBox };
}

/** "×24 slower", or the honest inversion for a genuinely slow session. */
function scaleLabel(scale: number): string {
  if (scale >= 1) return `×${Math.round(scale)} slower`;
  return `×${(1 / scale).toFixed(1)} faster`;
}

export function Replay({
  active,
  onDone,
}: {
  active: boolean;
  onDone: () => void;
}) {
  const { blocked } = useLatency();
  const [timeline, setTimeline] = useState<Timeline | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [litMarkers, setLitMarkers] = useState(0);
  const [showLcp, setShowLcp] = useState(false);
  const [ended, setEnded] = useState(false);
  const counterRef = useRef<HTMLSpanElement>(null);
  /** Was the main thread under the visitor's load at any point of playback? */
  const wasLoaded = useRef(false);
  const blockedRef = useRef(blocked);
  blockedRef.current = blocked;

  useEffect(() => {
    if (!active) {
      setTimeline(null);
      setRevealed(false);
      setLitMarkers(0);
      setShowLcp(false);
      setEnded(false);
      wasLoaded.current = false;
      delete document.documentElement.dataset.replay;
      return;
    }

    document.documentElement.dataset.replay = "1";
    if (blockedRef.current > 0) wasLoaded.current = true;

    // The paint order only means anything above the fold.
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    const tl = buildTimeline();
    if (!tl) {
      onDone();
      return;
    }
    setTimeline(tl);

    let raf = 0;
    const started = performance.now();
    let lit = 0;
    let fcpShown = false;
    let lcpShown = false;
    let finished = false;
    let doneTimer = 0;

    const tick = (now: number) => {
      if (blockedRef.current > 0) wasLoaded.current = true;
      // t is replay-time in *real original milliseconds*.
      const t = Math.min((now - started) / tl.scale, tl.end);
      if (counterRef.current) {
        counterRef.current.textContent = Math.round(t).toLocaleString("en-US");
      }
      while (lit < tl.markers.length && tl.markers[lit].at <= t) lit++;
      setLitMarkers(lit);
      if (!fcpShown && t >= tl.fcpAt) {
        fcpShown = true;
        setRevealed(true);
      }
      if (!lcpShown && tl.lcpBox && tl.lcpAt !== null && t >= tl.lcpAt) {
        lcpShown = true;
        setShowLcp(true);
      }
      if (t >= tl.end && !finished) {
        finished = true;
        setEnded(true);
        doneTimer = window.setTimeout(onDone, 1600);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onDone();
    };
    // A resize mid-replay leaves the LCP crown floating over nothing.
    const onResize = () => onDone();
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(doneTimer);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      delete document.documentElement.dataset.replay;
    };
    // `reset` deliberately not called: the reconstruction obeying the
    // visitor's own load is the point, and the end card owns up to it.
  }, [active, onDone]);

  if (!active || !timeline) return null;

  const lastIdx = timeline.markers.length - 1;

  return (
    // Clicking anywhere hands the page straight back.
    <div
      className="fixed inset-0 z-[65] cursor-pointer"
      onClick={onDone}
      role="presentation"
    >
      {/* The curtain: a shutter, not a fade. It lifts — one mechanical
          motion, top edge first — at the moment the real FCP happened. */}
      <div
        className={`absolute inset-0 bg-void transition-transform duration-300 ease-[var(--ease-instrument)] ${
          revealed ? "-translate-y-full" : "translate-y-0"
        }`}
      />

      {/* The LCP crown, exactly where the browser scored it. */}
      {showLcp && timeline.lcpBox && (
        <div className="absolute border-2 border-warn" style={timeline.lcpBox}>
          <span className="label absolute -top-6 right-0 whitespace-nowrap bg-warn px-1.5 py-1 leading-none !text-void">
            largest contentful paint · this element
          </span>
        </div>
      )}

      {/* The narration — an instrument card, so it survives the reveal. */}
      <div className="absolute bottom-28 left-4 border border-rule bg-panel p-5 md:bottom-auto md:left-8 md:top-24 md:p-6">
        <p className="label">
          Replaying this session&rsquo;s load ·{" "}
          {scaleLabel(timeline.scale)} · every timestamp is yours · click to
          skip
        </p>
        <p className="readout mt-3 text-5xl text-paper md:text-6xl">
          <span ref={counterRef}>0</span>
          <span className="text-2xl text-faint"> ms</span>
        </p>
        {/* Markers appear like an oscilloscope trigger: there, or not yet.
            No slides, no eases — animated timestamps read as fiction. */}
        <ol className="mt-5 space-y-2.5">
          {timeline.markers.map((m, i) => (
            <li
              key={m.text}
              className={`readout text-[0.8125rem] ${
                i < litMarkers ? "" : "invisible"
              } ${i === lastIdx ? "text-warn" : "text-paper"}`}
            >
              {m.text}
            </li>
          ))}
        </ol>
        {ended && (
          <div className="mt-5 border-t border-rule pt-4">
            <p className="label !text-good">Replay complete · as measured</p>
            {wasLoaded.current && (
              <p className="mt-2 max-w-[36ch] text-[0.8125rem] leading-relaxed text-warn">
                Note — this replay was itself delayed: your fader was blocking
                the main thread while it played. That&rsquo;s the point.
              </p>
            )}
          </div>
        )}
        <p className="mt-4 max-w-[36ch] text-[0.6875rem] leading-relaxed text-faint">
          Reconstruction: the finished render stands in for the original
          frames. The timestamps are real, from this session&rsquo;s
          PerformanceObserver entries.
        </p>
      </div>
    </div>
  );
}
