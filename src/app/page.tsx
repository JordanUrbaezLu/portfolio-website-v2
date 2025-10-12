"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { Background } from "@/components/layout/Background";
import { SiteNav } from "@/components/layout/SiteNav";
import { useActiveSection } from "@/hooks/useActiveSection";
import { Home } from "@/components/sections/Hero";

// Lazy load all sections below the fold
const About = dynamic(
  () =>
    import("@/components/sections/About").then((m) => ({ default: m.About })),
  { ssr: true }
);

const Projects = dynamic(
  () =>
    import("@/components/sections/Projects").then((m) => ({
      default: m.Projects,
    })),
  { ssr: true }
);

const Skills = dynamic(
  () =>
    import("@/components/sections/Skills").then((m) => ({ default: m.Skills })),
  { ssr: true }
);

const Experience = dynamic(
  () =>
    import("@/components/sections/Experience").then((m) => ({
      default: m.Experience,
    })),
  { ssr: true }
);

const Contact = dynamic(
  () =>
    import("@/components/sections/Contact").then((m) => ({
      default: m.Contact,
    })),
  { ssr: true }
);

// Define portfolio sections
const portfolioSections = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

export default function HomePage() {
  const registry = useRef<Record<string, HTMLElement | null>>({});
  const active = useActiveSection(registry);

  return (
    <div className="relative min-h-screen">
      <Background variant="sunset" />
      <SiteNav active={active} sections={portfolioSections} />

      {/* Hero loads immediately */}
      <Home registry={registry} />

      {/* All other sections lazy load */}
      <About registry={registry} />
      <Projects registry={registry} />
      <Skills registry={registry} />
      <Experience registry={registry} />
      <Contact registry={registry} />
    </div>
  );
}
