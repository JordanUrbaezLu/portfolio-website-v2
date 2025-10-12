export type SkillLevel = "Expert" | "Proficient" | "Familiar";

export interface Skill {
  name: string;
  level: SkillLevel;
  icon?: string; // key consumed by BrandIcon (optional; falls back if missing)
}

export interface SkillGroup {
  title: string;
  items: Skill[];
}

export const skillGroups: SkillGroup[] = [
  {
    title: "Frontend",
    items: [
      { name: "React", level: "Expert", icon: "react" },
      { name: "Next.js", level: "Expert", icon: "next.js" },
      { name: "TypeScript", level: "Expert", icon: "typescript" },
      { name: "Core Web Vitals", level: "Proficient" }, // conceptual -> fallback
      { name: "GraphQL", level: "Expert", icon: "graphql" },
    ],
  },
  {
    title: "Backend & DevOps",
    items: [
      { name: "Java", level: "Familiar", icon: "java" },
      { name: "Node.js", level: "Proficient", icon: "node.js" },
      { name: "Express", level: "Proficient", icon: "express" },
      { name: "Go", level: "Proficient", icon: "go" },
      { name: "Rest", level: "Familiar" }, // conceptual -> fallback
      { name: "Docker", level: "Familiar", icon: "docker" },
      { name: "Github Actions", level: "Expert", icon: "github actions" },
    ],
  },
  {
    title: "Tooling & Testing",
    items: [
      { name: "Jest", level: "Proficient", icon: "jest" },
      { name: "Jenkins", level: "Familiar", icon: "jenkins" },
      {
        name: "React Testing Lib",
        level: "Familiar",
        icon: "react testing lib",
      },
    ],
  },
  {
    title: "Other",
    items: [
      {
        name: "LLMs",
        level: "Proficient",
        icon: "llms / neural nets",
      },
      { name: "C/C++", level: "Expert", icon: "c/c++ (embedded)" },
      { name: "Python", level: "Expert", icon: "python" },
      { name: "Agile/Scrum", level: "Proficient" }, // conceptual -> fallback
      { name: "CI/CD", level: "Expert" }, // conceptual -> fallback
    ],
  },
];
