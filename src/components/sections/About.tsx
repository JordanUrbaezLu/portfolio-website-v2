import { SectionHead } from "@/components/ui/SectionHead";
import { about, education } from "@/data/about";
import { profile } from "@/data/profile";

export function About() {
  return (
    <section id="about" className="px-4 pt-28 md:px-5 md:pt-36">
      <div className="mx-auto max-w-[86rem]">
        <SectionHead code="About" title="How I think about it" />

        <div className="mt-12 grid gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,1fr)_19rem]">
          <div className="space-y-6">
            {about.paragraphs.map((p, i) => (
              <p
                key={p}
                className={
                  i === 0
                    ? "max-w-[56ch] text-[1.25rem] leading-relaxed text-paper"
                    : "max-w-[62ch] text-[1.0625rem] leading-relaxed text-dim"
                }
              >
                {p}
              </p>
            ))}
          </div>

          <aside className="border-t border-rule pt-6 lg:border-t-0 lg:pt-0">
            <p className="label">Details</p>
            <dl className="mt-5 space-y-5">
              <div className="silkscreen pt-4">
                <dt className="label">Based</dt>
                <dd className="mt-1.5 text-[0.9375rem] text-paper">
                  {profile.location}
                </dd>
              </div>
              {education.map((ed) => (
                <div key={ed.degree} className="silkscreen pt-4">
                  <dt className="label">Education</dt>
                  <dd className="mt-1.5 text-[0.9375rem] text-paper">
                    {ed.degree}
                  </dd>
                  <dd className="mt-0.5 text-[0.9375rem] text-dim">
                    {ed.school}
                  </dd>
                </div>
              ))}
              <div className="silkscreen pt-4">
                <dt className="label">Open to</dt>
                <dd className="mt-1.5 text-[0.9375rem] text-paper">
                  Senior and staff frontend roles
                </dd>
              </div>
            </dl>
          </aside>
        </div>

        {/* Three things I keep doing, each with the measurement that backs it. */}
        <div className="mt-16 grid gap-px border border-rule bg-rule md:grid-cols-3">
          {about.focusAreas.map((area) => (
            <div
              key={area.title}
              className="flex flex-col bg-void px-6 py-7 md:px-7 md:py-8"
            >
              <span className="label">{area.code}</span>
              <h3 className="display-sm mt-4 text-[1.375rem] text-paper">
                {area.title}
              </h3>
              <p className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-dim">
                {area.body}
              </p>
              <p className="readout mt-6 border-t border-rule pt-4 text-[0.75rem] leading-snug text-paper">
                {area.proof}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
