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
      { name: "Tailwind CSS", level: "Expert", icon: "tailwind css" },
      { name: "Framer Motion", level: "Proficient", icon: "framer motion" },
      { name: "Zustand", level: "Proficient", icon: "zustand" },
      { name: "Redux", level: "Proficient", icon: "redux" },
      { name: "SEO", level: "Proficient" }, // conceptual -> fallback
      {
        name: "React Native",
        level: "Expert",
        icon: "react",
      },
      { name: "SwiftUI", level: "Proficient", icon: "swiftui" },
    ],
  },
  {
    title: "Backend & DevOps",
    items: [
      { name: "Node.js", level: "Proficient", icon: "node.js" },
      { name: "Express", level: "Proficient", icon: "express" },
      { name: "Vercel", level: "Proficient", icon: "vercel" },
      { name: "Rest", level: "Familiar" }, // conceptual -> fallback
      { name: "Java", level: "Familiar", icon: "java" },
      { name: "Firebase", level: "Expert", icon: "firebase" },
      {
        name: "Next.js API Routes",
        level: "Proficient",
        icon: "next.js api routes",
      },
      { name: "Auth (NextAuth)", level: "Proficient", icon: "auth (nextauth)" },
      { name: "Docker", level: "Familiar", icon: "docker" },
      { name: "Edge Functions", level: "Proficient" }, // conceptual -> fallback
    ],
  },
  {
    title: "Tooling & Testing",
    items: [
      { name: "Jest", level: "Proficient", icon: "jest" },
      { name: "Jenkins", level: "Familiar", icon: "jenkins" },
      { name: "Webpack", level: "Proficient", icon: "webpack" },
      { name: "Github Actions", level: "Expert", icon: "github actions" },
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
        name: "LLMs / Neural Nets",
        level: "Proficient",
        icon: "llms / neural nets",
      },
      { name: "C/C++", level: "Expert", icon: "c/c++ (embedded)" },
      { name: "Python", level: "Expert", icon: "python" },
      { name: "Agile/Scrum", level: "Proficient" }, // conceptual -> fallback
      { name: "CI/CD", level: "Expert" }, // conceptual -> fallback
      { name: "Shopify", level: "Expert", icon: "shopify" },
      { name: "Stripe", level: "Expert", icon: "stripe" },
      { name: "Product & Brand", level: "Expert" }, // conceptual -> fallback
      { name: "Prompt Engineering", level: "Proficient" }, // conceptual -> fallback
    ],
  },
];
