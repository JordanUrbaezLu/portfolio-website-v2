import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { MediaDisplay } from "./MediaDisplay";
import { ProjectLinkButton } from "./ProjectLinkButton";
import type { Project } from "@/data/projects";

export function FeaturedProjectCard({ project }: { project: Project }) {
  const isMobileStack = project.mediaLayout !== "hybrid";

  return (
    <Card className="overflow-hidden group hover:bg-white/10 hover:border-white/20 transition-all duration-300 mb-8">
      <div className="grid lg:grid-cols-2 gap-8 p-6 md:p-8">
        {/* Left: Project Info */}
        <div className="flex flex-col justify-center">
          <h3 className="text-3xl md:text-4xl font-light text-white mb-4">
            {project.title}
          </h3>
          <p className="text-white/80 font-light mb-6 text-lg leading-relaxed">
            {project.summary}
          </p>
          <div className="flex flex-wrap gap-2 mb-8">
            {project.tech.map((tech) => (
              <Tag key={tech}>{tech}</Tag>
            ))}
          </div>
          <div className="flex flex-wrap gap-4">
            {project.links?.map((link) => (
              <ProjectLinkButton key={link.href} link={link} />
            ))}
          </div>
        </div>

        {/* Right: Media Display */}
        <div className="relative h-[500px] flex items-center justify-center">
          {isMobileStack ? (
            // Original mobile stack layout (for Anchor)
            <>
              {project.media.slice(0, 3).map((media, index) => (
                <div
                  key={index}
                  className="absolute rounded-3xl overflow-hidden bg-white/5 shadow-2xl border-2 border-white/10 transition-all duration-300 group-hover:shadow-3xl"
                  style={{
                    width: "200px",
                    aspectRatio: "9/19.5",
                    transform: `translateX(${(index - 1) * 180}px) translateY(${
                      [0, -20, 15][index]
                    }px)`,
                    zIndex: index === 1 ? 3 : index === 0 ? 2 : 1,
                  }}
                >
                  <MediaDisplay media={media} />
                </div>
              ))}
            </>
          ) : (
            // Hybrid layout (for Dialed) - desktop left, mobile right
            <>
              {/* Desktop view - left side, large landscape, moved up */}
              <div
                className="absolute rounded-xl overflow-hidden bg-white/5 shadow-2xl border-2 border-white/10 transition-all duration-300 group-hover:shadow-3xl"
                style={{
                  width: "420px",
                  aspectRatio: "16/10",
                  transform: "translateX(-80px) translateY(0px)",
                  zIndex: 1,
                }}
              >
                <MediaDisplay media={project.media[0]} />
              </div>

              {/* Mobile view - right side, tall portrait */}
              <div
                className="absolute rounded-3xl overflow-hidden bg-white/5 shadow-2xl border-2 border-white/10 transition-all duration-300 group-hover:shadow-3xl"
                style={{
                  height: "420px",
                  aspectRatio: "9/19.5",
                  transform: "translateX(180px) translateY(10px)",
                  zIndex: 2,
                }}
              >
                <MediaDisplay media={project.media[1]} />
              </div>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
