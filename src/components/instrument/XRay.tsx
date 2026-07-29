"use client";
// ─────────────────────────────────────────────────────────────────────────
// X-Ray ("Schematic"). Press X and the page draws its own anatomy: real
// element geometry, client islands vs server sections, and a crown on the
// actual element the browser scored as LCP. Nothing is illustrated — every
// box is live layout.
//
// The numbers live in the transport bar: while the schematic is up, the
// bar's cells swap from vitals to inventory. One instrument, switched to a
// different range — not a second dashboard floating over the first.
//
// Geometry is computed once on open and on debounced resize, never per
// frame: a schematic that caused layout thrash while claiming to expose it
// would be this site's whole argument, lost.
// ─────────────────────────────────────────────────────────────────────────
import { useEffect, useRef, useState } from "react";
import { getPaintFacts } from "@/lib/paintFacts";
import { usePrefersReducedMotion } from "@/lib/latency";

type Kind = "section" | "heading" | "interactive" | "block" | "island" | "lcp";

interface Box {
  top: number;
  left: number;
  width: number;
  height: number;
  kind: Kind;
  label?: string;
}

interface Snapshot {
  boxes: Box[];
  docHeight: number;
}

/* Only the site's own ink plus the spectral channels — the moment this
   borrows DevTools' blue/purple/green overlay palette it reads as a port,
   not an authored view. */
const BOX_STYLE: Record<Kind, string> = {
  section: "border border-paper/60",
  heading: "border border-dim/50",
  interactive: "border border-dim/40",
  block: "border border-faint/25",
  island: "border border-dashed border-[#6da2ff]",
  lcp: "border-2 border-warn",
};

/** Live layout → boxes. One synchronous read pass, then done. */
function measure(): Snapshot {
  const main = document.querySelector("main");
  const boxes: Box[] = [];
  const push = (el: Element, kind: Kind, label?: string) => {
    const r = el.getBoundingClientRect();
    if (r.width < 8 || r.height < 8) return;
    boxes.push({
      top: r.top + window.scrollY,
      left: r.left + window.scrollX,
      width: r.width,
      height: r.height,
      kind,
      label,
    });
  };

  // Below md the full anatomy is confetti; sections, islands and the LCP
  // crown carry the idea on their own.
  const detailed = window.innerWidth >= 768;

  if (main) {
    for (const section of main.querySelectorAll("section")) {
      const els = section.querySelectorAll("*").length;
      push(
        section,
        "section",
        `#${section.id || "section"} · ${els.toLocaleString("en-US")} elements · server`
      );
    }
    for (const island of main.querySelectorAll("[data-island]")) {
      push(island, "island", "client island · hydrated");
    }
    if (detailed) {
      for (const h of main.querySelectorAll("h1, h2, h3")) {
        push(h, "heading", h.tagName);
      }
      for (const el of main.querySelectorAll("p, dl, ul, ol, pre")) {
        push(el, "block");
      }
      for (const el of main.querySelectorAll("a, button, input, textarea")) {
        push(el, "interactive");
      }
    }
  }

  const facts = getPaintFacts();
  if (facts.lcpElement && document.contains(facts.lcpElement)) {
    push(
      facts.lcpElement,
      "lcp",
      `LCP · ${Math.round(facts.lcp ?? 0).toLocaleString("en-US")} ms`
    );
  }

  return {
    boxes: boxes.slice(0, 600),
    docHeight: document.documentElement.scrollHeight,
  };
}

/**
 * The assembly: on activation, one particle per visible element flies from a
 * scattered position to its element's true top-left corner, then the drawn
 * schematic takes over. The page's own matter, organising itself. Bounded
 * rAF (~600ms), viewport-only particles, skipped under reduced motion.
 */
function AssembleCanvas({
  boxes,
  onDone,
}: {
  boxes: Box[];
  onDone: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) {
      onDoneRef.current();
      return;
    }
    const w = window.innerWidth;
    const h = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const sy = window.scrollY;
    // Four particles per box — its corners — flying home from a
    // deterministic scatter (no Math.random: the same page assembles the
    // same way every time, like a machine, not confetti).
    const visible = boxes
      .filter((b) => b.top + b.height > sy && b.top < sy + h)
      .slice(0, 280)
      .map((b) => ({
        x: b.left,
        y: b.top - sy,
        w: b.width,
        h: b.height,
      }));
    const parts: { tx: number; ty: number; sx: number; sy: number }[] = [];
    visible.forEach((b, i) => {
      const corners = [
        [b.x, b.y],
        [b.x + b.w, b.y],
        [b.x, b.y + b.h],
        [b.x + b.w, b.y + b.h],
      ];
      corners.forEach(([cx, cy], c) => {
        const seed = i * 4 + c;
        parts.push({
          tx: cx,
          ty: cy,
          sx: (Math.abs(Math.sin(seed * 12.9898)) * 1.7 * w) % w,
          sy: (Math.abs(Math.sin(seed * 78.233)) * 1.7 * h) % h,
        });
      });
    });

    const DURATION = 800;
    const started = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - started) / DURATION);
      const e = 1 - Math.pow(1 - t, 3);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "rgba(238,242,244,0.9)";
      for (const p of parts) {
        ctx.fillRect(
          p.sx + (p.tx - p.sx) * e - 1,
          p.sy + (p.ty - p.sy) * e - 1,
          2,
          2
        );
      }
      // The outlines materialise as their corners arrive.
      if (e > 0.6) {
        const a = ((e - 0.6) / 0.4) * 0.45;
        ctx.strokeStyle = `rgba(238,242,244,${a.toFixed(3)})`;
        ctx.lineWidth = 1;
        for (const b of visible) ctx.strokeRect(b.x, b.y, b.w, b.h);
      }
      if (t >= 1) {
        onDoneRef.current();
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [boxes]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[63]"
    />
  );
}

export function XRay({
  active,
  onClose,
}: {
  active: boolean;
  onClose: () => void;
}) {
  const [snap, setSnap] = useState<Snapshot | null>(null);
  const [assembling, setAssembling] = useState(false);
  const reduced = usePrefersReducedMotion();
  const probeRef = useRef<HTMLDivElement>(null);

  // The probe: while the schematic is up, the cursor reads out document
  // coordinates and the element under it — the page as graph paper. Writes
  // refs directly on a throttled rAF; no re-render per move.
  useEffect(() => {
    if (!active) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    let raf = 0;
    let x = 0;
    let y = 0;
    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const el = probeRef.current;
        if (!el) return;
        el.style.transform = `translate3d(${x + 14}px, ${y + 14}px, 0)`;
        const under = document.elementFromPoint(x, y);
        const tag =
          under && under.closest("main")
            ? under.tagName
            : under?.closest("[data-instrument]")
              ? "INSTRUMENT"
              : "—";
        el.textContent = `${tag} · x ${Math.round(x + window.scrollX)} · y ${Math.round(
          y + window.scrollY
        )}`;
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [active]);

  useEffect(() => {
    document.documentElement.dataset.xray = active ? "1" : "0";
    if (!active) {
      setSnap(null);
      setAssembling(false);
      return;
    }
    setSnap(measure());
    if (!reduced) setAssembling(true);

    let timer = 0;
    const onResize = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setSnap(measure()), 200);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKey);
    };
  }, [active, onClose, reduced]);

  if (!active || !snap) return null;

  // The chrome stays live and un-outlined: it is the instrument, not the
  // specimen. Sits above the degradation veil — and drifts by --split like
  // everything else, because the x-ray machine is not exempt from the
  // physics it images. Only the transport bar is.
  return (
    <>
      {assembling && (
        <AssembleCanvas
          boxes={snap.boxes}
          onDone={() => setAssembling(false)}
        />
      )}
      <div
        ref={probeRef}
        aria-hidden
        className="label pointer-events-none fixed left-0 top-0 z-[66] hidden whitespace-nowrap border border-rule bg-panel px-1.5 py-1 leading-none !text-paper md:block"
      />
    <div
      aria-hidden
      data-xray-layer
      className="pointer-events-none absolute left-0 top-0 z-[62] w-full"
      style={{
        height: snap.docHeight,
        transform: "translate3d(var(--split), 0, 0)",
        // The drawn schematic is revealed whole, the instant its particles
        // arrive — schematics don't animate; they're assembled.
        visibility: assembling ? "hidden" : "visible",
      }}
    >
      {snap.boxes.map((b, i) => {
        // Labels normally sit on the line above the box; a box near the top
        // of the document would put its label under the fixed top bar, so it
        // tucks inside instead.
        const clipped = b.top < 84;
        return (
          <div
            key={i}
            className={`absolute ${BOX_STYLE[b.kind]}`}
            style={{
              top: b.top,
              left: b.left,
              width: b.width,
              height: b.height,
            }}
          >
            {b.label && (
              <span
                className={`label absolute whitespace-nowrap leading-none ${
                  b.kind === "lcp"
                    ? `${clipped ? "top-[4.5rem]" : "-top-6"} right-0 bg-warn px-1.5 py-1 !text-void`
                    : b.kind === "island"
                      ? `${clipped ? "top-[4.5rem]" : "-top-4"} right-0 !text-[#6da2ff]`
                      : `${clipped ? "top-[4.5rem] left-1" : "-top-4 left-0"} !text-paper`
                }`}
              >
                {b.kind === "island" && (
                  <span className="live-dot mr-1.5 inline-block h-1 w-1 rounded-full bg-[#6da2ff] align-middle" />
                )}
                {b.label}
              </span>
            )}
          </div>
        );
      })}
    </div>
    </>
  );
}
