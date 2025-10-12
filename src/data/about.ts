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
    "I’m a front-end engineer who thrives on building things from the ground up. After starting my software journey in embedded medical devices, I took a leap into entrepreneurship — launching a clothing brand that hit six figures on day one and building Anchor, a nonprofit React app that helps young men quit pornography. Both ventures demanded full ownership, creativity, and execution, and both taught me how much I value the impact of design and UX.",
    "Now, as a React/Next engineer, I channel that same entrepreneurial grit and design obsession into software — building AI powered interfaces that are fast, intuitive, and crafted with the same attention to detail I once poured into products and brands.",
  ],
  availabilityLabel: "Open to opportunities",
  role: "AI Frontend / Full-Stack Engineer",
  focus: "React • Next.js • TypeScript • AI",
  ctas: [
    { href: "#projects", label: "View Projects" },
    { href: "#experience", label: "Experience" },
    { href: "#contact", label: "Contact" },
  ],
};

export interface EducationItem {
  degree: string;
  school: string;
  year: string;
}

export const education: EducationItem[] = [
  {
    degree: "B.S. Computer Science",
    school: "University of Massachusetts Lowell",
    year: "2019",
  },
];
