export interface ExperienceItem {
  title: string;
  company: string;
  period: string;
  description: string;
  highlights: string[];
}

export const experiences: ExperienceItem[] = [
  {
    title: "Senior Lead Software Engineer",
    company: "Walmart Global Tech",
    period: "2022 – Present",
    description:
      "Improved Walmart+ churn and renewal flows serving millions of members worldwide; a 2% churn reduction and 3% renewal uplift translated to significant recurring revenue gains through targeted A/B testing and UX/payment optimizations.",
    highlights: ["Next.js", "React", "GraphQL", "Node.js", "Java"],
  },
  {
    title: "Senior Full Stack Software Engineer",
    company: "Meltwater",
    period: "2020 – 2022",
    description:
      "Improved Core Web Vitals and frontend maintainability across the Analytics web app by migrating legacy Redux logic to modern React Context, resulting in smoother UX and reduced complexity for thousands of enterprise users.",
    highlights: ["React", "Redux", "Core Web Vitals", "Design System", "SCSS"],
  },
  {
    title: "React Developer",
    company: "BeyondTrust",
    period: "2019 – 2020",
    description:
      "Developed React‑based UI for secure credential injection and remote access workflows in close collaboration with backend services.",
    highlights: ["React", "Typescript", "HTTPS/TLS", "Authorization", "REST"],
  },
  {
    title: "Web Developer",
    company: "Drift",
    period: "2018 – 2019",
    description:
      "Maintained and led production deployment cycle for the main marketing site in a fast‑paced release environment.",
    highlights: ["Javascript", "HTML", "CSS", "CI/CD", "Dasboard Monitoring"],
  },
];
