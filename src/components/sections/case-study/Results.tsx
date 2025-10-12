"use client";
import React, { useState } from "react";
import { MotionParallax } from "@/components/animations/MotionParallax";
import { MotionReveal } from "@/components/animations/MotionReveal";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { caseStudies } from "@/data/case-studies";

export function Results({
  registry,
  slug,
}: {
  registry: React.RefObject<Record<string, HTMLElement | null>>;
  slug: string;
}) {
  const [underlineActive, setUnderlineActive] = useState(false);

  // Fetch project data based on slug
  const caseStudy = caseStudies[slug];
  if (!caseStudy) {
    return null;
  }

  const resultsData = caseStudy.results;

  return (
    <Section
      id="results"
      registry={registry}
      className="relative py-16 md:py-24 px-4 z-20"
    >
      <MotionParallax range={30}>
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <MotionReveal
            direction="up"
            delay={0}
            onViewportEnter={() =>
              setTimeout(() => setUnderlineActive(true), 300)
            }
          >
            <SectionHeader
              activateUnderline={underlineActive}
              underlineDelay={80}
            >
              Results & Impact
            </SectionHeader>
          </MotionReveal>

          {/* Intro */}
          <MotionReveal direction="up">
            <div className="mb-16">
              <p className="text-lg md:text-xl text-white/70 leading-relaxed text-center">
                {resultsData.intro}
              </p>
            </div>
          </MotionReveal>

          {/* Outcomes */}
          <div className="space-y-8">
            {resultsData.outcomes.map((outcome, index) => (
              <MotionReveal key={index} direction="up">
                <Card padding="p-8 md:p-10">
                  <h3 className="text-2xl md:text-3xl text-white font-light mb-6">
                    {outcome.title}
                  </h3>
                  <ul className="space-y-4">
                    {outcome.points.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-white/60 mt-2.5" />
                        <span className="text-white/70 leading-relaxed">
                          {point}
                        </span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </MotionReveal>
            ))}
          </div>
        </div>
      </MotionParallax>
    </Section>
  );
}
