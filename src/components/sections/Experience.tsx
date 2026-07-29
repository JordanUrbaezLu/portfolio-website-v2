import { SectionHead } from "@/components/ui/SectionHead";
import { WorkAxis } from "@/components/instrument/WorkAxis";
import { experiences, TIMELINE } from "@/data/experiences";

const SPAN = TIMELINE.end - TIMELINE.start;

/** Position on the shared axis, as a percentage. */
function place(start: number, end: number | null) {
  const left = ((start - TIMELINE.start) / SPAN) * 100;
  const width = (((end ?? TIMELINE.end) - start) / SPAN) * 100;
  return { left: `${left}%`, width: `${width}%` };
}

/** "3 yr 4 mo" — the quantity the bar's length encodes, said out loud. */
function tenure(start: number, end: number | null): string {
  const total = (end ?? TIMELINE.end) - start;
  let yr = Math.floor(total);
  let mo = Math.round((total - yr) * 12);
  if (mo === 12) {
    yr += 1;
    mo = 0;
  }
  if (yr === 0) return `${mo} mo`;
  if (mo === 0) return `${yr} yr`;
  return `${yr} yr ${mo} mo`;
}

export function Experience() {
  return (
    <section id="work" className="px-4 pt-28 md:px-5 md:pt-36">
      <div className="mx-auto max-w-[86rem]">
        <SectionHead
          code="Work"
          title="Where the numbers came from"
          note="Bar length is real tenure on a shared time axis — the chart is the dates, not a decoration of them."
        />

        {/* Shared axis with a scroll playhead. Sticky, because a scale that
            scrolls away is a caption: every bar below has to stay readable
            against visible ticks. */}
        <WorkAxis />

        <ol className="mt-2">
          {experiences.map((exp) => {
            const current = exp.end === null;
            return (
              <li
                key={exp.id}
                className="group border-b border-rule py-9 md:py-11"
              >
                {/* Hovering anywhere in the row lights its bar and says the
                    quantity the bar length encodes. Linked highlighting —
                    the chart and the prose confirm each other. */}
                <div
                  aria-hidden
                  className="relative mb-7 hidden h-1.5 w-full bg-panel-2 md:block"
                >
                  <span
                    className={`bar-plot absolute inset-y-0 transition-colors duration-200 ${
                      current
                        ? "bg-paper"
                        : "bg-rule-lit group-hover:bg-dim"
                    }`}
                    style={place(exp.start, exp.end)}
                  />
                  <span
                    className="label absolute -top-6 whitespace-nowrap opacity-0 transition-opacity duration-200 group-hover:opacity-100 !text-paper"
                    style={{ left: place(exp.start, exp.end).left }}
                  >
                    {tenure(exp.start, exp.end)}
                  </span>
                  {current && (
                    <span className="live-dot absolute right-0 top-1/2 h-2.5 w-2.5 -translate-y-1/2 translate-x-1/2 rounded-full bg-paper" />
                  )}
                </div>

                <div className="grid gap-x-12 gap-y-6 lg:grid-cols-[19rem_minmax(0,1fr)]">
                  {/* ── Identity ── */}
                  <div>
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h3 className="display-sm text-xl text-paper">
                        {exp.company}
                      </h3>
                      {current && (
                        <span className="label !text-good">Current</span>
                      )}
                    </div>
                    <p className="mt-2 text-[0.9375rem] leading-snug text-paper">
                      {exp.title}
                    </p>
                    <p className="label mt-3">{exp.period}</p>
                    <p className="label mt-1">{exp.location}</p>
                  </div>

                  {/* ── Substance ── */}
                  <div>
                    <p className="text-[1.0625rem] leading-relaxed text-dim">
                      {exp.summary}
                    </p>

                    {exp.metrics.length > 0 && (
                      <dl className="mt-7 grid grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-3">
                        {exp.metrics.map((m) => (
                          <div key={m.label}>
                            <dt className="sr-only">{m.label}</dt>
                            <dd>
                              <span className="flex items-baseline gap-1">
                                <span
                                  aria-hidden
                                  className="readout text-xs text-faint"
                                >
                                  {m.dir === "down" ? "↓" : "↑"}
                                </span>
                                <span className="readout text-2xl font-semibold leading-none tracking-tight text-paper">
                                  {m.value}
                                </span>
                                <span className="readout text-xs leading-none text-dim">
                                  {m.unit}
                                </span>
                              </span>
                              <span className="label mt-2 block leading-snug">
                                {m.label}
                              </span>
                            </dd>
                          </div>
                        ))}
                      </dl>
                    )}

                    <ul className="mt-7 space-y-3">
                      {exp.notes.map((note) => (
                        <li
                          key={note}
                          className="flex gap-3 text-[0.9375rem] leading-relaxed text-dim"
                        >
                          <span aria-hidden className="text-faint">
                            —
                          </span>
                          <span>{note}</span>
                        </li>
                      ))}
                    </ul>

                    <p className="readout mt-7 text-[0.6875rem] text-faint">
                      {exp.stack.join("  ·  ")}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
