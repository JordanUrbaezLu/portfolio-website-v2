"use client";
import React, { useState } from "react";
import { Gauge, Sparkles, Boxes, MapPin, Download, ArrowRight } from "lucide-react";
import { MotionParallax } from "@/components/animations/MotionParallax";
import { MotionReveal } from "@/components/animations/MotionReveal";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";
import { about, education } from "@/data/about";
import { profile } from "@/data/profile";

const focusIcons = { Gauge, Sparkles, Boxes } as const;

export function About({
  registry,
}: {
  registry: React.RefObject<Record<string, HTMLElement | null>>;
}) {
  const [underlineActive, setUnderlineActive] = useState(false);
  const focusPills = about.focus.split("•").map((s) => s.trim()).filter(Boolean);

  return (
    <Section
      id="about"
      registry={registry}
      className="relative py-20 md:py-28 px-4 z-20"
    >
      <MotionParallax range={40}>
        <div className="mx-auto max-w-6xl">
          <MotionReveal
            direction="up"
            delay={0}
            onViewportEnter={() => setTimeout(() => setUnderlineActive(true), 300)}
          >
            <SectionHeader
              eyebrow="About me"
              activateUnderline={underlineActive}
              underlineDelay={80}
            >
              About
            </SectionHeader>
          </MotionReveal>

          <div className="grid items-start gap-10 md:grid-cols-5 md:gap-12">
            {/* Left: narrative */}
            <MotionReveal direction="right" className="md:col-span-3">
              <div className="space-y-5">
                {about.paragraphs.map((p, i) => (
                  <p
                    key={i}
                    className={
                      i === 0
                        ? "text-lg leading-relaxed font-light text-white/85 md:text-xl"
                        : "text-base leading-relaxed font-light text-white/65 md:text-lg"
                    }
                  >
                    {p}
                  </p>
                ))}
              </div>

              <div className="mt-7 flex flex-wrap gap-2">
                {focusPills.map((pill) => (
                  <Tag key={pill}>{pill}</Tag>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button href="#experience" variant="glass" size="md">
                  View experience
                  <ArrowRight size={16} />
                </Button>
                <Button
                  as="a"
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outline"
                  size="md"
                >
                  <Download size={16} />
                  Résumé
                </Button>
              </div>
            </MotionReveal>

            {/* Right: at-a-glance + education */}
            <MotionReveal direction="left" delay={60} className="md:col-span-2">
              <div className="space-y-5">
                <Card glow>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/40">
                    Currently
                  </p>
                  <p className="mt-2 font-display text-lg font-semibold tracking-tight text-white">
                    {about.currentRole}
                  </p>
                  <p className="text-white/55">{about.currentCompany}</p>

                  <div className="my-5 h-px bg-gradient-to-r from-white/15 via-white/5 to-transparent" />

                  <dl className="space-y-4 text-sm">
                    <div>
                      <dt className="text-xs uppercase tracking-wider text-white/40">
                        Focus
                      </dt>
                      <dd className="mt-1 font-light text-white/85">
                        {about.role} · React, Next.js &amp; Agentic AI
                      </dd>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={15} className="text-white/40" aria-hidden />
                      <span className="font-light text-white/85">
                        {profile.location}
                      </span>
                    </div>
                  </dl>
                </Card>

                {education.length > 0 && (
                  <Card interactive>
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/40">
                      Education
                    </p>
                    {education.map((ed) => (
                      <div key={ed.degree} className="mt-3">
                        <p className="font-light text-white">{ed.degree}</p>
                        <p className="font-light text-white/55">{ed.school}</p>
                      </div>
                    ))}
                  </Card>
                )}
              </div>
            </MotionReveal>
          </div>

          {/* What I focus on — product framing */}
          <div className="mt-16">
            <MotionReveal direction="up">
              <p className="mb-6 text-center text-xs font-medium uppercase tracking-[0.2em] text-white/40">
                What I focus on
              </p>
            </MotionReveal>
            <div className="grid gap-5 md:grid-cols-3">
              {about.focusAreas.map((area, i) => {
                const Icon = focusIcons[area.icon];
                return (
                  <MotionReveal key={area.title} direction="up" delay={i * 80}>
                    <Card interactive className="h-full">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-indigo-500/20 to-violet-500/20 text-indigo-200">
                        <Icon size={20} />
                      </div>
                      <h3 className="mt-4 font-display text-lg font-semibold tracking-tight text-white">
                        {area.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed font-light text-white/60">
                        {area.body}
                      </p>
                    </Card>
                  </MotionReveal>
                );
              })}
            </div>
          </div>
        </div>
      </MotionParallax>
    </Section>
  );
}
