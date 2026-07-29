import { Chroma } from "@/components/ui/Chroma";
import { HeroConsole } from "@/components/instrument/HeroConsole";
import { metrics, profile, scale } from "@/data/profile";

export function Hero() {
  return (
    <section id="top" className="arrive px-4 pt-24 md:px-5 md:pt-32">
      <div className="mx-auto max-w-[86rem]">
        <p className="label">
          {profile.role} · {profile.company} · {profile.location}
        </p>

        <div className="mt-8 grid gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end">
          {/* ── The statement ── */}
          <div>
            <h1 className="register-in display-xl text-[clamp(2.15rem,7vw,6.25rem)]">
              {profile.headline.map((line) => (
                <span key={line} className="block">
                  <Chroma>{line}</Chroma>
                </span>
              ))}
            </h1>

            <p className="prose-body mt-8 max-w-[46ch]">{profile.lede}</p>

            <div className="mt-9 flex flex-wrap items-center gap-x-3 gap-y-2">
              <a
                href="#contact"
                className="bg-paper px-5 py-3.5 text-void transition-colors hover:bg-white"
              >
                <span className="label !text-void">Get in touch</span>
              </a>
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-rule-lit px-5 py-3.5 text-paper transition-colors hover:bg-panel"
              >
                <span className="label !text-paper">Résumé ↗</span>
              </a>
              <a
                href={profile.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline px-2 py-3.5 text-dim transition-colors hover:text-paper"
              >
                <span className="label !text-current">LinkedIn ↗</span>
              </a>
              <a
                href={profile.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline px-2 py-3.5 text-dim transition-colors hover:text-paper"
              >
                <span className="label !text-current">GitHub ↗</span>
              </a>
            </div>
          </div>

          {/* ── The proof, set as a readout ── */}
          <aside className="border-t border-rule pt-6 lg:border-t-0 lg:pt-0">
            <p className="label">Measured impact</p>
            <dl className="mt-5">
              {metrics.map((m) => (
                <div
                  key={m.label}
                  className="silkscreen flex items-baseline gap-4 py-4"
                >
                  <dt className="sr-only">{m.label}</dt>
                  <dd className="flex w-[6rem] shrink-0 items-baseline gap-1">
                    <span aria-hidden className="readout text-sm text-faint">
                      {m.dir === "down" ? "↓" : "↑"}
                    </span>
                    <span className="readout text-[1.75rem] font-semibold leading-none tracking-tight text-paper">
                      {m.value}
                    </span>
                    <span className="readout text-sm leading-none text-dim">
                      {m.unit}
                    </span>
                  </dd>
                  <p className="text-[0.9375rem] leading-snug text-dim">
                    {m.label}
                  </p>
                </div>
              ))}
            </dl>
          </aside>
        </div>

        {/* ── The console: the instruments, as controls, above the fold. ── */}
        <HeroConsole />

        {/* ── Scale, stated once ── */}
        <div className="mt-14 grid gap-px border border-rule bg-rule sm:grid-cols-3">
          {scale.map((s) => (
            <div key={s.label} className="bg-void px-5 py-6">
              <p className="display-sm text-xl text-paper">{s.value}</p>
              <p className="label mt-2">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
