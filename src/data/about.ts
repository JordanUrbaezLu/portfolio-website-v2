// /src/data/about.ts

export type AboutCTA = { href: string; label: string };

export interface AboutData {
  paragraphs: string[];
  availabilityLabel: string;
  role: string;
  focus: string;
  ctas: AboutCTA[];
}

export const about: AboutData = {
  paragraphs: [
    "Full‑stack engineer with 7+ years of experience architecting and scaling high‑performance web applications, with deep expertise in React and Next.js. Currently leading large‑scale optimizations and feature development for Walmart.com, improving Core Web Vitals by 75%+, accelerating user growth, and reducing membership churn. Skilled in TypeScript, GraphQL, and modern frontend architecture patterns including SSR, RSC, and client–server data orchestration. Looking to contribute on a collaborative team where I can deliver measurable product impact, continue growing technically, and help the organization ship reliable, user‑first software.",
  ],
  availabilityLabel: "Open to opportunities",
  role: "Senior Software Engineer",
  focus: "React • Next.js • TypeScript • GraphQL • Node.js • Java",
  ctas: [
    { href: "#projects", label: "View Projects" },
    { href: "#experience", label: "Experience" },
    { href: "#contact", label: "Contact" },
  ],
};

export interface EducationItem {
  degree: string;
  school: string;
}

export const education: EducationItem[] = [
  {
    degree: "Computer Science",
    school: "University of Massachusetts Lowell",
  },
];
