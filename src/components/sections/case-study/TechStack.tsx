"use client";
import React, { useState } from "react";
import { MotionParallax } from "@/components/animations/MotionParallax";
import { MotionReveal } from "@/components/animations/MotionReveal";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { caseStudies } from "@/data/case-studies";

export function TechStack({
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

  const techStackData = caseStudy.techStack;

  return (
    <Section
      id="tech"
      registry={registry}
      className="relative py-16 md:py-24 px-4 z-20"
    >
      <MotionParallax range={30}>
        <div className="max-w-5xl mx-auto">
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
              Tech Stack
            </SectionHeader>
          </MotionReveal>

          {/* Intro */}
          <MotionReveal direction="up" delay={0}>
            <div className="mb-12">
              <p className="text-lg md:text-xl text-white/70 leading-relaxed text-center">
                {techStackData.intro}
              </p>
            </div>
          </MotionReveal>

          {/* Tech Categories */}
          <div className="grid md:grid-cols-2 gap-8">
            {techStackData.categories.map((category, index) => {
              // Calculate column (0 = left, 1 = right)
              const col = index % 2;

              return (
                <MotionReveal key={index} direction="up" delay={col * 80}>
                  <Card padding="p-8">
                    {/* Category Title */}
                    <h3 className="text-xl md:text-2xl text-white/90 font-medium mb-6">
                      {category.title}
                    </h3>
                    {/* Technologies List */}
                    <div className="flex flex-wrap gap-3">
                      {category.technologies.map((tech, idx) => (
                        <div
                          key={idx}
                          className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/80 font-medium text-sm hover:bg-white/10 hover:border-white/20 transition-all cursor-default"
                        >
                          {tech}
                        </div>
                      ))}
                    </div>
                  </Card>
                </MotionReveal>
              );
            })}
          </div>
        </div>
      </MotionParallax>
    </Section>
  );
}
