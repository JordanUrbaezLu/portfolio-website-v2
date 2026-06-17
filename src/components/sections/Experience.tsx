"use client";
import React, { useState } from "react";
import { MotionParallax } from "@/components/animations/MotionParallax";
import { MotionReveal } from "@/components/animations/MotionReveal";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { TechBadge } from "@/components/ui/TechBadge";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { experiences } from "@/data/experiences";

export function Experience({
  registry,
}: {
  registry: React.RefObject<Record<string, HTMLElement | null>>;
}) {
  // Track when to animate the SectionHeader underline
  const [underlineActive, setUnderlineActive] = useState(false);

  return (
    <Section
      id="experience"
      registry={registry}
      className="relative py-20 md:py-28 px-4 z-20"
    >
      <MotionParallax range={40}>
        <div className="mx-auto max-w-4xl">
          {/* Header + underline timing */}
          <MotionReveal
            direction="up"
            delay={0}
            onViewportEnter={() =>
              setTimeout(() => setUnderlineActive(true), 300)
            }
          >
            <SectionHeader
              eyebrow="Experience"
              activateUnderline={underlineActive}
              underlineDelay={80}
            >
              Where I&apos;ve shipped
            </SectionHeader>
          </MotionReveal>

          {/* Timeline */}
          <div className="relative mx-auto max-w-3xl">
            {/* Vertical aurora rail — desktop only, anchored to node centers */}
            <div
              aria-hidden
              className="pointer-events-none absolute bottom-3 left-[7px] top-3 hidden w-px md:block"
            >
              <div className="h-full w-px bg-gradient-to-b from-indigo-400/50 via-violet-400/25 to-transparent" />
            </div>

            <ol className="space-y-8 md:space-y-10">
              {experiences.map((exp, index) => {
                const isLatest = index === 0;
                return (
                  <li key={exp.title} className="relative md:pl-12">
                    <MotionReveal direction="up" delay={index * 90}>
                      {/* Node dot — desktop, sits on the rail */}
                      <span
                        aria-hidden
                        className="absolute top-7 hidden -translate-x-1/2 md:block"
                        style={{ left: "7px" }}
                      >
                        <span className="relative flex h-3.5 w-3.5 items-center justify-center">
                          {isLatest && (
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-50" />
                          )}
                          <span
                            className={
                              isLatest
                                ? "relative inline-flex h-3.5 w-3.5 rounded-full bg-gradient-to-tr from-indigo-400 to-violet-400 shadow-[0_0_12px_rgba(129,140,248,0.8)] ring-2 ring-indigo-300/30"
                                : "relative inline-flex h-2.5 w-2.5 rounded-full bg-white/35 ring-2 ring-white/10"
                            }
                          />
                        </span>
                      </span>

                      <Card
                        interactive
                        glow={isLatest}
                        padding="p-6 md:p-7"
                      >
                        {/* Top row: company logo + name + period */}
                        <div className="flex items-center gap-3">
                          <CompanyLogo company={exp.company} />
                          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-1">
                            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-aurora">
                              {exp.company}
                            </p>
                            {isLatest && (
                              <span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2 py-0.5 text-[0.65rem] font-medium uppercase tracking-wider text-emerald-300">
                                Current
                              </span>
                            )}
                            <span className="ml-auto text-xs font-medium tracking-wide text-white/45">
                              {exp.period}
                            </span>
                          </div>
                        </div>

                        {/* Role title */}
                        <h3 className="mt-3 font-display text-xl font-semibold tracking-tight text-white md:text-2xl">
                          {exp.title}
                        </h3>

                        {/* Description */}
                        <p className="mt-3 text-[0.95rem] font-light leading-relaxed text-white/70">
                          {exp.description}
                        </p>

                        {/* Highlights — brand-gradient tech badges */}
                        <div className="mt-5 flex flex-wrap gap-2">
                          {exp.highlights.map((h) => (
                            <TechBadge key={h} name={h} />
                          ))}
                        </div>
                      </Card>
                    </MotionReveal>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </MotionParallax>
    </Section>
  );
}
