"use client";
import React, { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Background, BackgroundVariant } from "@/components/layout/Background";
import { SiteNav } from "@/components/layout/SiteNav";
import { BackButton } from "@/components/layout/BackButton";
import { useActiveSection } from "@/hooks/useActiveSection";
import { CaseStudyHero } from "@/components/sections/case-study/Hero";
import { FeaturesToggle } from "@/components/sections/case-study/FeaturesToggle";
import { OverviewToggle } from "@/components/sections/case-study/OverviewToggle";
import { shouldShowFeaturesToggle } from "@/components/sections/case-study/Features";
import { shouldShowOverviewToggle } from "@/components/sections/case-study/Overview";

// Lazy load all sections below the fold
const Overview = dynamic(
  () =>
    import("@/components/sections/case-study/Overview").then((m) => ({
      default: m.Overview,
    })),
  { ssr: true }
);
const ProblemSolution = dynamic(
  () =>
    import("@/components/sections/case-study/ProblemSolution").then((m) => ({
      default: m.ProblemSolution,
    })),
  { ssr: true }
);
const Features = dynamic(
  () =>
    import("@/components/sections/case-study/Features").then((m) => ({
      default: m.Features,
    })),
  { ssr: true }
);
const TechStack = dynamic(
  () =>
    import("@/components/sections/case-study/TechStack").then((m) => ({
      default: m.TechStack,
    })),
  { ssr: true }
);
const TechnicalChallenges = dynamic(
  () =>
    import("@/components/sections/case-study/TechnicalChallenges").then(
      (m) => ({ default: m.TechnicalChallenges })
    ),
  { ssr: true }
);
const Results = dynamic(
  () =>
    import("@/components/sections/case-study/Results").then((m) => ({
      default: m.Results,
    })),
  { ssr: true }
);

// Define case study sections for navigation
const caseStudySections = [
  { id: "hero", label: "Home" },
  { id: "overview", label: "Overview" },
  { id: "problem-solution", label: "Problems & Solutions" },
  { id: "features", label: "Features" },
  { id: "tech", label: "Tech Stack" },
  { id: "technical-challenges", label: "Technical Challenges" },
  { id: "results", label: "Results" },
];

export default function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const registry = useRef<Record<string, HTMLElement | null>>({});
  const active = useActiveSection(registry);
  const { slug } = React.use(params);

  // State for view modes
  const [overviewViewMode, setOverviewViewMode] = useState<
    "desktop" | "mobile"
  >("desktop");
  const [featuresViewMode, setFeaturesViewMode] = useState<
    "desktop" | "mobile"
  >("mobile");

  const showOverviewToggle = shouldShowOverviewToggle(slug);
  const showFeaturesToggle = shouldShowFeaturesToggle(slug);

  return (
    <div className="relative min-h-screen">
      <Background variant={slug as BackgroundVariant} />
      <BackButton href="/#projects" />
      <SiteNav active={active} sections={caseStudySections} />

      <CaseStudyHero registry={registry} slug={slug} />
      <Overview
        registry={registry}
        slug={slug}
        viewMode={overviewViewMode}
        onViewModeChange={setOverviewViewMode}
      />
      <ProblemSolution registry={registry} slug={slug} />
      <Features
        registry={registry}
        slug={slug}
        viewMode={featuresViewMode}
        onViewModeChange={setFeaturesViewMode}
      />
      <TechStack registry={registry} slug={slug} />
      <TechnicalChallenges registry={registry} slug={slug} />
      <Results registry={registry} slug={slug} />

      {/* Floating toggles - rendered at page level */}
      {showOverviewToggle && (
        <OverviewToggle
          viewMode={overviewViewMode}
          onViewModeChange={setOverviewViewMode}
          registry={registry}
        />
      )}
      {showFeaturesToggle && (
        <FeaturesToggle
          viewMode={featuresViewMode}
          onViewModeChange={setFeaturesViewMode}
          registry={registry}
        />
      )}
    </div>
  );
}
