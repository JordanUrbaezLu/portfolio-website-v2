"use client";
import React, { useState } from "react";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { MotionParallax } from "@/components/animations/MotionParallax";
import { MotionReveal } from "@/components/animations/MotionReveal";
import { skillGroups, type SkillLevel } from "@/data/skills";
import { BrandIcon } from "@/components/icons/BrandIcon";

type IconCategory = "frontend" | "backend" | "tooling" | "testing" | "other";

function getIconCategory(groupTitle: string): IconCategory {
  const title = groupTitle.toLowerCase();
  if (title.includes("frontend")) return "frontend";
  if (title.includes("backend") || title.includes("devops")) return "backend";
  if (title.includes("tooling") || title.includes("testing")) return "tooling";
  return "other";
}

const LEVEL_DOTS: Record<SkillLevel, number> = {
  Expert: 3,
  Proficient: 2,
  Familiar: 1,
};

/** Three-dot meter: filled dots aurora-tinted, empties faint. */
function LevelMeter({ level }: { level: SkillLevel }) {
  const filled = LEVEL_DOTS[level];
  return (
    <span
      className="flex items-center gap-1"
      role="img"
      aria-label={`Proficiency: ${level}`}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={
            i < filled
              ? "h-1.5 w-1.5 rounded-full bg-gradient-to-r from-indigo-400 to-violet-400 shadow-[0_0_6px_rgba(129,140,248,0.55)]"
              : "h-1.5 w-1.5 rounded-full bg-white/15"
          }
        />
      ))}
    </span>
  );
}

const SkillChip = React.memo(
  ({
    skill,
    category,
  }: {
    skill: { name: string; level: SkillLevel; icon?: string };
    category: IconCategory;
  }) => (
    <div className="group relative glass rounded-2xl px-3.5 py-3 transition-colors duration-300 hover:bg-white/[0.08]">
      <div className="flex items-center gap-2.5">
        <span className="shrink-0 grid h-8 w-8 place-items-center rounded-lg bg-white/[0.06] ring-1 ring-white/10">
          <BrandIcon
            name={skill.icon || skill.name}
            category={category}
            className="h-5 w-5"
          />
        </span>
        <div className="min-w-0 flex-1">
          <h4 className="truncate text-sm font-medium text-white">
            {skill.name}
          </h4>
          {/* Level label fades in on hover/focus; meter is the always-on signal */}
          <span className="block text-[0.7rem] font-medium uppercase tracking-[0.12em] text-white/0 transition-colors duration-300 group-hover:text-white/45 group-focus-within:text-white/45">
            {skill.level}
          </span>
        </div>
        <LevelMeter level={skill.level} />
      </div>
    </div>
  )
);

SkillChip.displayName = "SkillChip";

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
      className="relative py-20 md:py-28 px-4 z-20"
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
              eyebrow="Skills"
              activateUnderline={underlineActive}
              underlineDelay={80}
            >
              The Toolkit
            </SectionHeader>
          </MotionReveal>

          {/* Groups */}
          <div className="space-y-12 md:space-y-14">
            {skillGroups.map((group) => {
              const category = getIconCategory(group.title);
              return (
                <div key={group.title}>
                  {/* Group header row with faint divider */}
                  <MotionReveal direction="up" delay={0}>
                    <div className="mb-5 flex items-center gap-4">
                      <h3 className="font-display shrink-0 text-lg md:text-xl font-semibold tracking-tight text-white/90">
                        {group.title}
                      </h3>
                      <div className="h-px flex-1 bg-gradient-to-r from-white/12 to-transparent" />
                    </div>
                  </MotionReveal>

                  {/* Grid — one reveal per group, per-chip CSS stagger */}
                  <MotionReveal direction="up" delay={60}>
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5">
                      {group.items.map((skill, i) => (
                        <div
                          key={skill.name}
                          className="skill-chip-reveal"
                          style={{ animationDelay: `${i * 60}ms` }}
                        >
                          <SkillChip skill={skill} category={category} />
                        </div>
                      ))}
                    </div>
                  </MotionReveal>
                </div>
              );
            })}
          </div>
        </div>
      </MotionParallax>

      {/* Per-chip staggered fade-in (cheap, GPU-friendly) */}
      <style jsx>{`
        .skill-chip-reveal {
          opacity: 0;
          transform: translateY(14px);
          animation: skillChipIn 0.55s var(--ease-out-expo, ease-out) forwards;
        }
        @keyframes skillChipIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .skill-chip-reveal {
            opacity: 1;
            transform: none;
            animation: none;
          }
        }
      `}</style>
    </Section>
  );
}
