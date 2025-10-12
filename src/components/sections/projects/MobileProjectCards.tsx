import React, { useEffect, useRef, useState } from "react";
import { MotionReveal } from "@/components/animations/MotionReveal";
import { MobileProjectCard } from "./MobileProjectCard";
import type { Project } from "@/data/projects";

interface MobileProjectCardsProps {
  projects: Project[];
}

export function MobileProjectCards({ projects }: MobileProjectCardsProps) {
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [maxHeight, setMaxHeight] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Measure the tallest card
  useEffect(() => {
    const measureCards = () => {
      const heights = cardRefs.current
        .filter((ref) => ref !== null)
        .map((ref) => ref!.offsetHeight);

      if (heights.length > 0) {
        const tallest = Math.max(...heights);
        setMaxHeight(tallest);
      }
    };

    // Measure after a short delay to ensure all content is rendered
    const timer = setTimeout(measureCards, 300);

    // Re-measure on window resize
    window.addEventListener("resize", measureCards);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", measureCards);
    };
  }, [projects]);

  // Handle scroll snap for mobile
  const scrollToProject = (index: number) => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const projectWidth = container.scrollWidth / projects.length;
    container.scrollTo({
      left: projectWidth * index,
      behavior: "smooth",
    });
    setCurrentProjectIndex(index);
  };

  // Handle scroll events to update current index
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const projectWidth = container.scrollWidth / projects.length;
      const newIndex = Math.round(scrollLeft / projectWidth);
      setCurrentProjectIndex(newIndex);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [projects.length]);

  return (
    <MotionReveal direction="up" delay={0}>
      {/* Horizontal scroll container */}
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {projects.map((project, index) => (
          <div
            key={project.title}
            ref={(el) => {
              cardRefs.current[index] = el;
            }}
            className="flex-none w-[85vw] snap-center"
            style={{
              minHeight: maxHeight ? `${maxHeight}px` : "auto",
            }}
          >
            <MobileProjectCard project={project} />
          </div>
        ))}
      </div>

      {/* Mobile Navigation Dots */}
      <div className="flex justify-center mt-6 gap-2">
        {projects.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToProject(index)}
            className={`w-2 h-2 rounded-full transition-colors duration-200 ${
              index === currentProjectIndex ? "bg-white" : "bg-white/30"
            }`}
            aria-label={`Go to project ${index + 1}`}
          />
        ))}
      </div>
    </MotionReveal>
  );
}
