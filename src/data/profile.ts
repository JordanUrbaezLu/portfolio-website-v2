// src/data/profile.ts
// ─────────────────────────────────────────────────────────────────────────
// Single source of truth for identity, contact, social links, and the
// recruiter-facing "proof" content (impact metrics + companies).
//
//  ▸▸ ACTION REQUIRED — swap the two placeholders below ◂◂
//     1. profile.socials.linkedin  → your real LinkedIn URL
//     2. profile.resumeUrl         → drop your PDF at /public and update path
//  Everything else is wired and live.
// ─────────────────────────────────────────────────────────────────────────

export interface SocialLink {
  label: string;
  href: string;
  /** lucide-react icon name handled in SocialLinks.tsx */
  icon: "linkedin" | "github" | "mail" | "phone";
}

export interface Metric {
  value: string;
  label: string;
}

export interface CompanyTenure {
  name: string;
  /** short note shown under the wordmark */
  note: string;
}

export const profile = {
  name: "Jordan Urbaez-Lu",
  firstName: "Jordan",
  lastName: "Urbaez-Lu",
  role: "Senior Software Engineer",
  company: "Walmart Global Tech",

  // Big hero value prop (rendered with aurora highlights in Hero.tsx).
  headline: "Fast, resilient web at scale — and the agentic AI to ship it.",

  // Short supporting line under the hero headline.
  heroLine:
    "Leading the Walmart+ Payments & Account Management web platform — and building agentic AI for developer productivity at scale.",

  // SEO / OpenGraph description.
  subhead:
    "Senior Software Engineer at Walmart Global Tech — leading the Walmart+ Payments & Account Management web platform, improving performance and retention for millions, and building agentic AI for developer productivity.",

  // Top-level focus areas (hero pills + about).
  focusAreas: ["Web Performance", "Agentic AI", "React · Next.js · TypeScript"],

  location: "Santa Clara, CA",
  email: "jordana.urbaez@gmail.com",
  phone: "123-456-7891",
  phoneHref: "tel:1234567891",

  // Used for SEO / OpenGraph canonical URL. Swap for your production domain.
  siteUrl: "https://jordan-urbaez-lu.vercel.app",

  // Real résumé (lives in /public).
  resumeUrl: "/Jordan_Urbaez_Lu_Resume.pdf",

  socials: {
    // PLACEHOLDER — replace with your real LinkedIn profile URL.
    linkedin: "https://www.linkedin.com/in/jordan-urbaez-lu/",
    github: "https://github.com/JordanUrbaezLu",
  },
} as const;

// Hero / footer social row.
export const socialLinks: SocialLink[] = [
  { label: "LinkedIn", href: profile.socials.linkedin, icon: "linkedin" },
  { label: "GitHub", href: profile.socials.github, icon: "github" },
  { label: "Email", href: `mailto:${profile.email}`, icon: "mail" },
];

// Above-the-fold credibility band.
export const metrics: Metric[] = [
  { value: "75%+", label: "Core Web Vitals gains on Walmart.com" },
  { value: "Millions", label: "Walmart+ users served in production" },
  { value: "7+", label: "Years building for the web" },
  { value: "Agentic AI", label: "Systems built for developer productivity" },
];

// "Experience at" wordmark strip — instant social proof.
export const companies: CompanyTenure[] = [
  { name: "Walmart", note: "Global Tech" },
  { name: "Meltwater", note: "Analytics" },
  { name: "BeyondTrust", note: "Security" },
  { name: "Drift", note: "Marketing" },
];
