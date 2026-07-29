// src/data/skills.ts
// ─────────────────────────────────────────────────────────────────────────
// Grouped by what the tools are *for*, not by self-assessed proficiency —
// a senior engineer's stack is a set of choices, not a set of star ratings.
// Set in type only: brand logo grids cost bundle and say nothing.
// ─────────────────────────────────────────────────────────────────────────

export interface SkillGroup {
  code: string;
  title: string;
  /** One line on what this group is used to do. */
  note: string;
  items: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    code: "FE",
    title: "Interface",
    note: "What the member actually touches.",
    items: [
      "React",
      "Next.js",
      "TypeScript",
      "GraphQL",
      "React Query",
      "Redux",
      "Tailwind",
      "SCSS",
      "Storybook",
      "Accessibility",
    ],
  },
  {
    code: "PF",
    title: "Performance",
    note: "Where the 45% came from.",
    items: [
      "Core Web Vitals",
      "LCP · INP · CLS",
      "Performance profiling",
      "SSR / CSR strategy",
      "Code splitting",
      "Caching & prefetching",
      "A/B testing",
      "Component abstraction",
    ],
  },
  {
    code: "BE",
    title: "Services",
    note: "The data the interface waits on.",
    items: [
      "Node.js",
      "Express",
      "Java Spring Boot",
      "REST APIs",
      "PostgreSQL",
      "MongoDB",
      "SQL",
      "Go",
    ],
  },
  {
    code: "OPS",
    title: "Platform",
    note: "Getting it out and watching it run.",
    items: [
      "Docker",
      "Kubernetes",
      "Jenkins",
      "CI/CD",
      "Nx",
      "Grafana",
      "Prometheus",
      "Git",
    ],
  },
  {
    code: "AI",
    title: "Applied AI",
    note: "Shipped to production, not a demo.",
    items: [
      "Agentic tooling",
      "LLM-driven workflows",
      "Incident triage automation",
      "Predictive billing models",
    ],
  },
];
