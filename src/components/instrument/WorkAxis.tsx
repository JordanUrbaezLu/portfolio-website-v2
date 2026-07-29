"use client";
// ─────────────────────────────────────────────────────────────────────────
// The Work section's time axis, with a playhead: scrolling scrubs the tape.
// The roles run newest-first down the page, so scrolling down runs the
// playhead right-to-left — into the past — with a live month/year readout.
// Motion here is a position report (your scroll mapped onto the career
// timeline), which is the only kind of motion this site permits itself.
//
// Scroll handler is rAF-throttled and writes refs directly — no React
// render per scroll frame.
// ─────────────────────────────────────────────────────────────────────────
import { useEffect, useRef } from "react";
import { TIMELINE } from "@/data/experiences";

const SPAN = TIMELINE.end - TIMELINE.start;
const TICKS = [2019, 2021, 2023, 2025];
const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function WorkAxis() {
  const playhead = useRef<HTMLDivElement>(null);
  const chip = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = document.getElementById("work");
    if (!section) return;
    let raf = 0;

    const update = () => {
      raf = 0;
      const rect = section.getBoundingClientRect();
      const anchor = window.innerHeight * 0.45;
      const travel = Math.max(1, rect.height - anchor);
      const p = Math.min(1, Math.max(0, (anchor - rect.top) / travel));
      // Down the page = back through time.
      const year = TIMELINE.end - p * SPAN;
      const x = Math.min(
        97.5,
        Math.max(2.5, ((year - TIMELINE.start) / SPAN) * 100)
      );
      if (playhead.current) playhead.current.style.left = `${x}%`;
      if (chip.current) {
        const yr = Math.floor(year);
        const mo = Math.min(11, Math.max(0, Math.floor((year - yr) * 12)));
        chip.current.textContent = `${MONTHS[mo]} ${yr}`;
      }
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="sticky top-14 z-20 -mx-4 mt-10 hidden h-10 border-b border-rule bg-void px-4 md:-mx-5 md:block md:px-5"
    >
      <div className="relative mx-auto h-full max-w-[86rem]">
        {TICKS.map((year) => (
          <span
            key={year}
            className="absolute bottom-0 flex -translate-x-1/2 flex-col items-center"
            style={{ left: `${((year - TIMELINE.start) / SPAN) * 100}%` }}
          >
            <span className="label mb-1 leading-none">{year}</span>
            <span className="h-1.5 w-px bg-rule-lit" />
          </span>
        ))}

        {/* The playhead: where your scroll currently sits in the career. */}
        <div
          ref={playhead}
          className="absolute bottom-0 top-0 w-px -translate-x-1/2 bg-paper"
          style={{ left: "97.5%" }}
        >
          <span
            ref={chip}
            className="label absolute -top-0.5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-paper px-1.5 py-1 leading-none !text-void"
          >
            Now
          </span>
        </div>
      </div>
    </div>
  );
}
