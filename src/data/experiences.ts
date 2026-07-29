// src/data/experiences.ts
// ─────────────────────────────────────────────────────────────────────────
// The Experience section renders as a waterfall: bar position and length are
// real tenure on a shared time axis, so the chart says something true rather
// than decorating a list. Dates are decimal years (2022.5 = Jul 2022).
// ─────────────────────────────────────────────────────────────────────────

import type { Metric } from "./profile";

export interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  location: string;
  /** Human-readable period, shown verbatim. */
  period: string;
  /** Decimal year the role started. */
  start: number;
  /** Decimal year it ended; `null` means current. */
  end: number | null;
  summary: string;
  /** What actually moved. Rendered as a readout, not prose. */
  metrics: Metric[];
  /** Work that has no single number attached. */
  notes: string[];
  stack: string[];
}

/** Shared axis for the waterfall. Bump `end` when the year turns. */
export const TIMELINE = { start: 2018.6, end: 2026.7 } as const;

export const experiences: ExperienceItem[] = [
  {
    id: "walmart",
    title: "Senior Lead Software Engineer",
    company: "Walmart Global Tech",
    location: "Sunnyvale, CA",
    period: "Jul 2022 — Present",
    start: 2022.5,
    end: null,
    summary:
      "Web platform lead for Walmart+ — membership, account and payment experiences for tens of millions of active members, at hundreds of millions of page views and API requests a month.",
    metrics: [
      { value: "45", unit: "%", label: "P75 page latency", dir: "down" },
      {
        value: "75",
        unit: "%+",
        label: "LCP · FCP · INP on P0/P1 pages",
        dir: "up",
      },
      { value: "15", unit: "%", label: "Membership renewals", dir: "up" },
      { value: "3", unit: "%", label: "Membership churn", dir: "down" },
      { value: "20", unit: "%+", label: "Feature delivery speed", dir: "up" },
      { value: "10", unit: "%", label: "Developer output per sprint", dir: "up" },
    ],
    notes: [
      "Rebuilt the API and data-fetching architecture in Node.js, TypeScript and GraphQL — the change that took P75 latency down 45%.",
      "Shipped an AI-powered on-call analyzer in Next.js that reads incident signal and cuts triage time, adding roughly 10% developer output per sprint.",
      "Built the React/SCSS/Storybook design system that standardised accessible UI across hundreds of production pages.",
      "Built AI-driven billing optimisation in Java Spring Boot — models read payment behaviour to schedule renewals predictively, lifting billing success and retention.",
    ],
    stack: [
      "React",
      "Next.js",
      "TypeScript",
      "GraphQL",
      "Node.js",
      "Java Spring Boot",
    ],
  },
  {
    id: "meltwater",
    title: "Senior Software Engineer",
    company: "Meltwater",
    location: "Boston, MA",
    period: "Dec 2020 — Jun 2022",
    start: 2020.92,
    end: 2022.5,
    summary:
      "Led the web team on the analytics platform, rebuilding the front-end architecture that thousands of enterprise creators worked in every day.",
    metrics: [
      { value: "2.8", unit: "s", label: "P75 latency removed", dir: "down" },
      { value: "20", unit: "%", label: "Creator engagement", dir: "up" },
      { value: "16", unit: "%", label: "REST API response time", dir: "down" },
    ],
    notes: [
      "Cut 2.8 seconds off P75 by reworking asset loading and the render path — LCP, FCP and TTFB together.",
      "Modernised the React + TypeScript interfaces across web and mobile dashboards, lifting feature interaction and time on page.",
      "Tuned the Node.js and Express services behind the dashboards to hold response times under heavy traffic.",
    ],
    stack: ["React", "TypeScript", "Redux", "Node.js", "Express", "SCSS"],
  },
  {
    id: "beyondtrust",
    title: "React Developer",
    company: "BeyondTrust",
    location: "Somerville, MA",
    period: "Aug 2019 — Oct 2020",
    start: 2019.58,
    end: 2020.83,
    summary:
      "Built the React interfaces for secure credential injection and remote access — the screens enterprise admins used to reach production systems without ever handling a password.",
    metrics: [],
    notes: [
      "Shipped credential-injection and remote-access workflows that made enterprise authentication both faster and safer.",
      "Worked directly against the backend session layer to keep data exchange and session handling reliable under real load.",
    ],
    stack: ["React", "TypeScript", "REST", "TLS", "Session management"],
  },
  {
    id: "drift",
    title: "Web Developer",
    company: "Drift",
    location: "Boston, MA",
    period: "Oct 2018 — Aug 2019",
    start: 2018.75,
    end: 2019.58,
    summary:
      "Owned the release cycle for a high-traffic marketing site in a team that shipped constantly.",
    metrics: [{ value: "99.9", unit: "%", label: "Uptime held", dir: "up" }],
    notes: [
      "Ran production deploys for the main marketing site and kept content delivery fast through a rapid release cadence.",
      "Partnered with design and marketing to ship features and content on schedule.",
    ],
    stack: ["JavaScript", "HTML", "CSS", "CI/CD"],
  },
];
