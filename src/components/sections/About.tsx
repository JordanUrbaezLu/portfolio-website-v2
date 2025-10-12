"use client";
import React, { useState } from "react";
import { MotionParallax } from "@/components/animations/MotionParallax";
import { MotionReveal } from "@/components/animations/MotionReveal";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { about, education } from "@/data/about"; // <-- new import

export function About({
  registry,
}: {
  registry: React.RefObject<Record<string, HTMLElement | null>>;
}) {
  const [underlineActive, setUnderlineActive] = useState(false);

  return (
    <Section
      id="about"
      registry={registry}
      className="relative py-16 md:py-24 px-4 z-20"
    >
      <MotionParallax range={40}>
        <div className="max-w-6xl mx-auto">
          {/* Header + underline timing */}
          <MotionReveal
            direction="up"
            delay={0}
            onViewportEnter={() =>
              setTimeout(() => setUnderlineActive(true), 240)
            }
          >
            <SectionHeader
              activateUnderline={underlineActive}
              underlineDelay={80}
            >
              About
            </SectionHeader>
          </MotionReveal>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
            {/* Left: brief professional summary (from data) */}
            <MotionReveal direction="right">
              <div className="space-y-6">
                {about.paragraphs.map((p, i) => (
                  <p
                    key={i}
                    className={`text-lg leading-relaxed font-light ${
                      i === 0 ? "text-white/80" : "text-white/70"
                    }`}
                  >
                    {p}
                  </p>
                ))}
              </div>
            </MotionReveal>

            {/* Right: concise facts/availability card */}
            {/* Right: concise facts/availability + education card */}
            <MotionReveal direction="left" delay={60}>
              <div className="space-y-6">
                {/* Availability card */}
                <Card className="hover:bg-white/10 transition-colors">
                  <div className="space-y-5">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full" />
                      <span className="text-white/80 font-medium">
                        {about.availabilityLabel}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-white/40 font-medium uppercase tracking-wider mb-1">
                          Role
                        </p>
                        <p className="text-white font-light">{about.role}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/40 font-medium uppercase tracking-wider mb-1">
                          Focus
                        </p>
                        <p className="text-white font-light">{about.focus}</p>
                      </div>
                    </div>

                    <div className="pt-1 flex flex-wrap gap-4">
                      {about.ctas.map((cta) => (
                        <a
                          key={cta.href}
                          href={cta.href}
                          className="inline-flex items-center gap-2 text-white/80 hover:text-white font-medium group"
                        >
                          {cta.label}
                          <svg
                            className="w-4 h-4 transition-transform group-hover:translate-x-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M17 8l4 4m0 0-4 4m4-4H3"
                            />
                          </svg>
                        </a>
                      ))}
                    </div>
                  </div>
                </Card>

                {/* Education card */}
                {education.length > 0 && (
                  <Card className="hover:bg-white/10 transition-colors">
                    <div className="space-y-3">
                      <p className="text-xs text-white/40 font-medium uppercase tracking-wider">
                        Education
                      </p>
                      {education.map((ed, i) => (
                        <div key={i}>
                          <p className="text-white font-light">{ed.degree}</p>
                          <p className="text-white/60 font-light">
                            {ed.school} · {ed.year}
                          </p>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </div>
            </MotionReveal>
          </div>
        </div>
      </MotionParallax>
    </Section>
  );
}
