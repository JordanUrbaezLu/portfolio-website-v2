# Portfolio — durable brief (read first)

**Mission:** Get recruiters and eng managers to contact Jordan Urbaez-Lu (Senior
Lead SWE, Walmart Global Tech). **Thesis:** a web-performance engineer's
portfolio should not describe speed — it should let you operate it. The visitor
puts real load on the page and feels the difference.

**Aesthetic: "Instrument."** True-neutral near-black, matte panels, hairline
rules, one variable typeface at three widths. No glass, no gradients, no aurora.
Colour is spent only where it carries meaning (vitals verdicts, spectral fringe).

## Stack
Next.js 15 (App Router) · React 19 · TypeScript (strict) · Tailwind **v4**.
**Three runtime dependencies: `next`, `react`, `react-dom`.** Nothing else.

## Commands
- `npm run dev` · `npm run build` · `npm run status` (run this first)
- `node scripts/audit.mjs <url> <out> [--mobile] [--steps=N] [--latency=260] [--reduced]`
  — screenshots. `--latency` drives the fader before shooting.

## Page structure
Single page: **Hero → Work → About → Stack → Contact → Footer**.
Section ids: `top / work / about / stack / contact`. The nav depends on them.

## Code map
- `src/app/page.tsx` — server component; composes sections inside `PageShell`.
- `src/components/layout/PageShell.tsx` — the only client boundary for chrome;
  owns mode state (schematic/replay), the X key, hydration mark.
- `src/app/globals.css` — **the design system.** `@theme` tokens + utilities.
- `src/lib/latency.tsx` — the fader's state + the real main-thread blocking.
- `src/lib/useVitals.ts` — live PerformanceObserver telemetry, zero deps.
- `src/lib/paintFacts.ts` — the session's load story (TTFB/FCP/LCP+element,
  transfer sizes, hydration mark). X-Ray and Replay read only from here.
- `src/components/instrument/*` — TransportBar (the signature), FrameTrace,
  XRay (schematic), Replay (load reconstruction), InputEcho (delay reticle),
  HeroConsole (the three instruments as controls in the first viewport —
  v2 hid them behind a keystroke and nobody noticed the page had changed;
  don't bury them again), InstrumentContext (shared mode state).
- `src/data/*` — all content. Numbers must match `/public/Jordan_Urbaez_Lu_Resume.pdf`.

## The three theatrical instruments (v2)
- **Schematic (X or bar toggle):** page dims, real layout boxes + element
  counts, client islands (`[data-island]`) dashed blue with a heartbeat, the
  real LCP element crowned. The transport bar's cells swap from vitals to
  inventory while it's up — one instrument, different range; never add a
  second floating stats panel.
- **Replay:** re-stages the session's own load ×N slower from real entries
  (navigationStart → requestStart → TTFB → FCP shutter-lift → LCP crown →
  hydration). Silent-cinema rules: linear counter, oscilloscope markers (no
  slide-ins), shutter not fade. If the fader is up during playback, the end
  card admits the replay itself lagged — deliberate; do not "fix" by resetting.
- **Input buffer (InputEcho.tsx):** always-on phosphor trace of the last
  ~2.2s of pointer path, decaying like scope persistence; under load the
  undigested tail renders in channel colour with a reticle at the last
  processed position and the **measured window-max input delay**
  (`performance.now() - event.timeStamp`). It is the input-delay phase, NOT
  INP (pointermove has no interactionId) — never relabel it INP. The rAF
  loop exits when the trace fully decays.

## Ambient motion rules (v3)
Every motion must report a real value. Current inventory:
- Work axis **playhead** (WorkAxis.tsx) — scroll position mapped onto the
  career timeline (down = into the past), month/year chip readout.
- Row↔bar **linked hover** in Work — bar lights + tenure ("3 yr 4 mo").
- **measure-land** pulse — a vital cell's underline redraws when a new
  browser entry arrives (keyed on value).
- **The receipt** (SessionReceipt.tsx + lib/receipt.ts) — footer itemises
  session time, long-task ms (buffered longtask observer), and the fader's
  share (latency engine charges only blocks ≥50ms, so attribution can never
  exceed the ledger). Updates 1Hz only while visible.
- Buttons depress 1px on :active. Nothing else moves at rest.

## Hard-won facts — do not re-learn

- **The fader blocks the main thread. It is NOT network latency.** Calling it
  "added latency" is the fastest way to lose a staff-level reader, and an
  earlier version did exactly that. Label, `aria-valuetext`, hero copy and the
  TBT readout must all agree. `npm run status` checks this.
- **TBT is the honest coupling.** The blocking is measured back by the browser's
  own `longtask` entries, so the readout cannot drift from the mechanism.
- **INP is resettable on purpose.** It accumulates per session; without
  `resetLive()` anyone who plays with the demo leaves the page permanently
  reporting a red verdict about itself.
- **`overflow-x: hidden` breaks `position: sticky`.** It computes `overflow-y`
  to `auto`, making the element a scroll container. Use **`overflow-x: clip`**
  (html *and* body) — the Work section's time axis depends on it.
- **The document scrolls.** The old `html{overflow:hidden}` + body-scroll model
  is gone; it broke `scrollIntoView`, scroll anchoring and every tool that
  scrolls the window. Anchor offset is `scroll-padding-top`, not JS.
- **Tailwind v4, no config file.** `@theme` in `globals.css` is authoritative.
  Tokens follow `--color-*`, `--font-*`, `--ease-*`.
- **next/font:** `Archivo` with `axes: ["wdth"]` gives 62–125 widths from one
  file, drivable via CSS `font-stretch`. Never pass `weight` alongside `axes` —
  build error. An invalid axis is also a hard build failure.
- **lib.dom.d.ts is missing** `LayoutShift`, `PerformanceEventTiming.interactionId`
  and `PerformanceObserverInit.durationThreshold`. Declared in
  `src/types/perf-dom.d.ts`. `LargestContentfulPaint` and `PerformanceEventTiming`
  **are** present — do not redeclare them.
- **CLS and TBT are Chromium-only** (`layout-shift`/`longtask` never shipped in
  Gecko or WebKit). LCP and INP now work in all three. Feature-detect with
  `PerformanceObserver.supportedEntryTypes`; `buffered:true` requires `type`,
  not `entryTypes`; LCP is not available from `getEntriesByType`.
- **`.next` is shared by `dev` and `build`.** Running `next build` while `next dev`
  is up leaves the dev server serving 404 chunks and nothing hydrates. Kill dev
  and `rm -rf .next` after a build.
- **Chroma plates are `user-select: none`.** Without it, selecting the h1 yields
  the headline three times. They carry no `will-change` on purpose.
- **A Projects section was removed** (template content that wasn't the owner's).
  Don't re-introduce that data — see the gap below.
- **The old site shipped 13.4 MB of JS** for ~20 skill icons via three full
  Iconify collections. Icons are now type only. Don't add an icon package.
- **Prod hydrates faster than it paints** (~100ms vs ~120ms locally). A
  one-shot `getEntriesByType("paint")` read at mount cached `fcp: null`
  forever and silently killed Replay — in production only. Paint facts must
  come through **buffered observers**, never a mount-time timeline read.
- **Esc is a stack:** replay > schematic > fader reset. The fader's handler
  checks `dataset.xray`/`dataset.replay` and yields. Breaking this destroys
  the load state a visitor was inspecting when they close the schematic.
- **The scroll-velocity fringe was built and cut**: if scrolling also tears
  the h1, the tear stops meaning "main thread degraded" and the fader's
  signal is cheapened. `--split` stays load-owned. Don't rebuild it.
- **Canvas font strings can't resolve `var()`** — resolve the computed
  `fontFamily` once and interpolate it into `ctx.font`.
- **og.png is generated**, not designed: prod server + 1200×630 Playwright
  screenshot of the hero at rest, `sips -z 630 1200` to final size.

## Biggest content gap
There are **no work samples** — no project, case study, screenshot or diagram.
The strongest single addition would be one real artefact for the GraphQL/Node
data-fetching rearchitecture that produced the 45% P75 win. Ask the owner; do
not invent one.

## Owner action items
- `profile.siteUrl` → production domain (OG/canonical).
- Decide whether `profile.phone` should stay on a public page.
- `TIMELINE.end` in `src/data/experiences.ts` — bump when the year turns.

## Verification bar for changes
1. `npm run build` green. 2. `npm run status` passes. 3. Screenshot desktop
**and** `--mobile`, plus `--latency=260` for the degraded state. 4. Contrast:
text tokens clear 4.5:1, field borders 3:1. 5. `--reduced` leaves nothing stuck
below full opacity.

## v3.1 moments
- **register-in** (globals.css): h1 arrives torn, snaps into register once —
  `backwards` fill only, so the root --split regains control afterwards.
- **Schematic assembly** (XRay AssembleCanvas): 4 corner particles per
  visible box fly home from a deterministic scatter (~800ms bounded rAF),
  outlines materialise as corners arrive, then the DOM schematic snaps in.
  Skipped under reduced motion. No Math.random — same page, same assembly.
- **Tab title** reports load state (latency.tsx) — even browser chrome is
  part of the instrument.
