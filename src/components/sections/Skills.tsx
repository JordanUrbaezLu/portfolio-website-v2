"use client";
import React, { useState } from "react";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { MotionParallax } from "@/components/animations/MotionParallax";
import { MotionReveal } from "@/components/animations/MotionReveal";
import { Card } from "@/components/ui/Card";
import { skillGroups } from "@/data/skills";
import { BrandIcon } from "@/components/icons/BrandIcon";

function getIconCategory(
  groupTitle: string
): "frontend" | "backend" | "tooling" | "testing" | "other" {
  const title = groupTitle.toLowerCase();
  if (title.includes("frontend")) return "frontend";
  if (title.includes("backend") || title.includes("devops")) return "backend";
  if (title.includes("tooling") || title.includes("testing")) return "tooling";
  return "other";
}

// Memoized skill card component to prevent unnecessary re-renders
const SkillCard = React.memo(
  ({
    skill,
    groupTitle,
  }: {
    skill: { name: string; icon?: string };
    groupTitle: string;
  }) => (
    <Card
      padding="p-5"
      className="relative group cursor-pointer transition-all hover:scale-105"
    >
      {/* Default (icon + name) */}
      <div
        className={`
        flex items-center gap-2 transition-opacity duration-200
        group-hover:opacity-0 group-focus-within:opacity-0
      `}
      >
        <span className="shrink-0 grid place-items-center rounded-md bg-white/5 p-1">
          <BrandIcon
            name={skill.icon || skill.name}
            className="h-5 w-5"
            category={getIconCategory(groupTitle)}
          />
        </span>
        <h4 className="font-medium text-white">{skill.name}</h4>
      </div>

      {/* Morph-in overlay */}
      <a
        href={`/#projects`}
        className={`
        absolute inset-0 z-10 flex flex-col items-center justify-center
        bg-white/10 rounded-3xl shadow-lg
        opacity-0 pointer-events-none
        group-hover:opacity-100 group-hover:pointer-events-auto
        group-focus-within:opacity-100 group-focus-within:pointer-events-auto
        transition-all duration-200
        backdrop-blur-[2px]
        outline-none ring-0 focus-visible:ring-2 focus-visible:ring-white/60
        cursor-pointer
      `}
        tabIndex={0}
      >
        <span className="flex items-center gap-1 text-white font-medium text-base select-none">
          View Projects
          <svg
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="inline-block ml-1"
            aria-hidden="true"
          >
            <path d="M5 9h8m0 0-3.5-3.5M13 9l-3.5 3.5" />
          </svg>
        </span>
      </a>
    </Card>
  )
);

SkillCard.displayName = "SkillCard";

export function Skills({
  registry,
}: {
  registry: React.RefObject<Record<string, HTMLElement | null>>;
}) {
  const [underlineActive, setUnderlineActive] = useState(false);

  return (
    <Section
      id="skills"
      registry={registry}
      className="relative py-16 md:py-24 px-4 z-20"
    >
      <MotionParallax range={30}>
        <div className="max-w-6xl mx-auto">
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
              Skills
            </SectionHeader>
          </MotionReveal>

          {/* Groups */}
          <div className="space-y-12">
            {skillGroups.map((group) => (
              <div key={group.title}>
                {/* Subheader */}
                <MotionReveal direction="up" delay={0}>
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-xl md:text-2xl text-white/90 font-medium tracking-tight">
                      {group.title}
                    </h3>
                    <div className="hidden md:block h-px w-48 bg-white/10" />
                  </div>
                </MotionReveal>

                {/* Single MotionReveal for entire grid instead of individual cards */}
                <MotionReveal direction="up" delay={0}>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {group.items.map((skill, i) => (
                      <div
                        key={skill.name}
                        className="skill-card-container"
                        style={{
                          // CSS animation delay for staggered reveal
                          animationDelay: `${i * 50}ms`,
                        }}
                      >
                        <SkillCard skill={skill} groupTitle={group.title} />
                      </div>
                    ))}
                  </div>
                </MotionReveal>
              </div>
            ))}
          </div>
        </div>
      </MotionParallax>

      {/* CSS animations for better performance */}
      <style jsx>{`
        .skill-card-container {
          opacity: 0;
          transform: translateY(20px);
          animation: skillCardFadeIn 0.6s ease-out forwards;
        }
        @keyframes skillCardFadeIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </Section>
  );
}
