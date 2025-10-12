"use client";
import React, { useState } from "react";
import { MotionParallax } from "@/components/animations/MotionParallax";
import { MotionReveal } from "@/components/animations/MotionReveal";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { caseStudies } from "@/data/case-studies";

export function Gallery({
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

  const galleryData = caseStudy.gallery;

  return (
    <Section
      id="gallery"
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
              Gallery
            </SectionHeader>
          </MotionReveal>

          {/* Intro */}
          <MotionReveal direction="up">
            <div className="mb-12">
              <p className="text-lg md:text-xl text-white/70 leading-relaxed">
                {galleryData.intro}
              </p>
            </div>
          </MotionReveal>

          {/* Gallery Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {galleryData.media.map((item, index) => (
              <MotionReveal key={index} direction="up">
                <Card padding="p-0" className="overflow-hidden group">
                  {/* Media Container - Placeholder for now */}
                  <div className="relative aspect-video bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center">
                    {item.type === "video" ? (
                      <div className="text-white/40">
                        <svg
                          width="64"
                          height="64"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <path d="M10 8l6 4-6 4V8z" />
                        </svg>
                      </div>
                    ) : (
                      <div className="text-white/40">
                        <svg
                          width="64"
                          height="64"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <path d="M21 15l-5-5L5 21" />
                        </svg>
                      </div>
                    )}
                    {/* TODO: Replace with actual image/video */}
                    {/* <img 
                      src={`/images/case-studies/${slug}/${item.placeholder}`}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    /> */}
                  </div>

                  {/* Caption */}
                  <div className="p-6">
                    <h4 className="text-lg text-white font-medium mb-2">
                      {item.title}
                    </h4>
                    <p className="text-sm text-white/60">{item.description}</p>
                  </div>
                </Card>
              </MotionReveal>
            ))}
          </div>
        </div>
      </MotionParallax>
    </Section>
  );
}
