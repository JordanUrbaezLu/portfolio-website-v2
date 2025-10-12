"use client";
import React, { useEffect, useRef, useState } from "react";
import { MotionParallax } from "@/components/animations/MotionParallax";
import { MotionReveal } from "@/components/animations/MotionReveal";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FeaturedProjectCard } from "./projects/FeaturedProjectCard";
import { RegularProjectCard } from "./projects/RegularProjectCard";
import { MobileProjectCards } from "./projects/MobileProjectCards";
import { projects as data } from "@/data/projects";

export function Projects({
  registry,
}: {
  registry: React.RefObject<Record<string, HTMLElement | null>>;
}) {
  const [underlineActive, setUnderlineActive] = useState(false);

  // Separate featured and regular projects
  const featured = data.filter((p) => p.featured);
  const regular = data.filter((p) => !p.featured);

  return (
    <Section
      id="projects"
      registry={registry}
      className="relative py-16 md:py-24 px-4 z-20"
    >
      <MotionParallax range={30}>
        {/* Section header */}
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
            Projects
          </SectionHeader>
        </MotionReveal>

        {/* Desktop Layout */}
        <div className="hidden md:block">
          {/* Featured project layout */}
          <div className="max-w-7xl mx-auto mb-16">
            {featured.map((project, i) => (
              <MotionReveal key={project.title} direction="up" delay={0}>
                <FeaturedProjectCard project={project} />
              </MotionReveal>
            ))}
          </div>

          {/* Regular projects grid */}
          {regular.length > 0 && (
            <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-6">
              {regular.map((project, i) => {
                // Calculate column position (0 = left, 1 = middle, 2 = right)
                const col = i % 3;

                return (
                  <MotionReveal
                    key={project.title}
                    direction="up"
                    delay={col * 50}
                  >
                    <RegularProjectCard project={project} />
                  </MotionReveal>
                );
              })}
            </div>
          )}
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden">
          <MobileProjectCards projects={[...featured, ...regular]} />
        </div>
      </MotionParallax>
    </Section>
  );
}
