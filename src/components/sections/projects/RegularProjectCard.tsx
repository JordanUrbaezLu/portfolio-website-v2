import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { MediaDisplay } from "./MediaDisplay";
import { ProjectLinkButton } from "./ProjectLinkButton";
import { MediaNavigation } from "./MediaNavigation";
import type { Project } from "@/data/projects";

export function RegularProjectCard({ project }: { project: Project }) {
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

  return (
    <Card className="h-full flex flex-col overflow-hidden group hover:bg-white/10 hover:border-white/20 hover:scale-[1.01] transition-all duration-300">
      {/* Media on top - fixed aspect ratio */}
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

      {/* Content below - grows to fill available space */}
      <div className="flex-1 flex flex-col p-5 md:p-6">
        <h3 className="text-xl md:text-2xl font-light text-white mb-3">
          {project.title}
        </h3>

        {/* Description grows to fill space, pushing tags/links to bottom */}
        <p className="flex-1 text-white/70 font-light mb-4 leading-relaxed text-sm">
          {project.summary}
        </p>

        {/* Tags and links stay at bottom */}
        <div className="flex-shrink-0">
          <div className="flex flex-wrap gap-1.5 mb-5">
            {project.tech.map((tech) => (
              <Tag key={tech}>{tech}</Tag>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            {project.links?.map((link) => (
              <ProjectLinkButton key={link.href} link={link} size="sm" />
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
