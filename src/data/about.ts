// /src/data/about.ts

export type AboutCTA = { href: string; label: string };

export interface FocusArea {
  title: string;
  body: string;
  /** lucide-react icon name resolved in About.tsx */
  icon: "Gauge" | "Sparkles" | "Boxes";
}

export interface AboutData {
  paragraphs: string[];
  currentRole: string;
  currentCompany: string;
  role: string;
  focus: string;
  focusAreas: FocusArea[];
  ctas: AboutCTA[];
}

export const about: AboutData = {
  paragraphs: [
    "I’m a Senior Software Engineer at Walmart Global Tech, where I lead the Walmart+ Payments & Account Management web platform — improving page performance, reducing membership churn, and streamlining payment experiences for millions of users with React, Next.js, and TypeScript.",
    "Alongside the platform work, I build agentic AI systems focused on developer productivity, operational efficiency, and intelligent workflow automation at scale.",
    "Across 7+ years I’ve cared about one thing: shipping fast, reliable, user-first software — and increasingly, using AI to help teams ship more of it.",
  ],
  currentRole: "Senior Software Engineer",
  currentCompany: "Walmart Global Tech",
  role: "Senior Software Engineer",
  focus: "React • Next.js • TypeScript • Agentic AI • GraphQL • Node.js",
  focusAreas: [
    {
      title: "Web Performance",
      body: "Core Web Vitals, SSR/RSC, and frontend architecture that stays fast for millions of users.",
      icon: "Gauge",
    },
    {
      title: "Agentic AI",
      body: "Autonomous AI systems for developer productivity, operational efficiency, and workflow automation.",
      icon: "Sparkles",
    },
    {
      title: "Product Engineering",
      body: "Payments and account UX that lifts retention and reduces churn — built to ship and measure.",
      icon: "Boxes",
    },
  ],
  ctas: [
    { href: "#experience", label: "Experience" },
    { href: "#contact", label: "Get in touch" },
  ],
};

export interface EducationItem {
  degree: string;
  school: string;
}

export const education: EducationItem[] = [
  {
    degree: "B.S. Computer Science",
    school: "University of Massachusetts Lowell",
  },
];
