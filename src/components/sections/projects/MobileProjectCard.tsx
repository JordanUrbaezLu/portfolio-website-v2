import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { MediaDisplay } from "./MediaDisplay";
import { ProjectLinkButton } from "./ProjectLinkButton";
import { MediaNavigation } from "./MediaNavigation";
import type { Project } from "@/data/projects";

export function MobileProjectCard({ project }: { project: Project }) {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  const nextMedia = () => {
    setCurrentMediaIndex((prev) =>
      prev === project.media.length - 1 ? 0 : prev + 1
    );
  };

  const prevMedia = () => {
    setCurrentMediaIndex((prev) =>
      prev === 0 ? project.media.length - 1 : prev - 1
    );
  };

  const isMobileStack = project.mediaLayout !== "hybrid";
  const titleSize = project.featured ? "text-2xl" : "text-xl";

  return (
    <Card className="overflow-hidden group hover:bg-white/10 hover:border-white/20 transition-all duration-300 h-full flex flex-col">
      {/* Media on top - different layout for featured projects */}
      {project.featured ? (
        // Featured project: show the same overlapping layout as desktop, scaled down
        <div className="relative h-[280px] flex items-center justify-center overflow-hidden flex-shrink-0">
          {isMobileStack ? (
            // Mobile stack layout (3 phones overlapping) - scaled down for mobile
            <>
              {project.media.slice(0, 3).map((media, index) => (
                <div
                  key={index}
                  className="absolute rounded-2xl overflow-hidden bg-white/5 shadow-xl border-2 border-white/10"
                  style={{
                    width: "120px",
                    aspectRatio: "9/19.5",
                    transform: `translateX(${(index - 1) * 100}px) translateY(${
                      [0, -15, 10][index]
                    }px)`,
                    zIndex: index === 1 ? 3 : index === 0 ? 2 : 1,
                  }}
                >
                  <MediaDisplay media={media} />
                </div>
              ))}
            </>
          ) : (
            // Hybrid layout (desktop + mobile) - scaled down for mobile
            <>
              {/* Desktop view - left side */}
              <div
                className="absolute rounded-lg overflow-hidden bg-white/5 shadow-xl border-2 border-white/10"
                style={{
                  width: "240px",
                  aspectRatio: "16/10",
                  transform: "translateX(-50px) translateY(0px)",
                  zIndex: 1,
                }}
              >
                <MediaDisplay media={project.media[0]} />
              </div>

              {/* Mobile view - right side */}
              <div
                className="absolute rounded-2xl overflow-hidden bg-white/5 shadow-xl border-2 border-white/10"
                style={{
                  height: "240px",
                  aspectRatio: "9/19.5",
                  transform: "translateX(100px) translateY(5px)",
                  zIndex: 2,
                }}
              >
                <MediaDisplay media={project.media[1]} />
              </div>
            </>
          )}
        </div>
      ) : (
        // Regular project: carousel view
        <div className="relative flex-shrink-0">
          <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-white/5">
            <MediaDisplay media={project.media[currentMediaIndex]} />
          </div>
          <MediaNavigation
            mediaLength={project.media.length}
            currentIndex={currentMediaIndex}
            onPrevious={prevMedia}
            onNext={nextMedia}
            onSelect={setCurrentMediaIndex}
            size="sm"
          />
        </div>
      )}

      {/* Content below - will grow to fill remaining space */}
      <div className="p-5 flex-grow flex flex-col">
        <h3 className={`${titleSize} font-light text-white mb-3`}>
          {project.title}
        </h3>
        <p className="text-white/70 font-light mb-4 leading-relaxed text-sm">
          {project.summary}
        </p>
        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.tech.map((tech) => (
            <Tag key={tech}>{tech}</Tag>
          ))}
        </div>
        <div className="flex flex-wrap gap-3 mt-auto">
          {project.links?.slice(0, 2).map((link) => (
            <ProjectLinkButton key={link.href} link={link} size="sm" />
          ))}
        </div>
      </div>
    </Card>
  );
}
