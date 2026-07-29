// src/data/profile.ts
// ─────────────────────────────────────────────────────────────────────────
// Identity, contact, and the headline proof. Every number here comes from
// the résumé at /public/Jordan_Urbaez_Lu_Resume.pdf — keep them in sync.
// ─────────────────────────────────────────────────────────────────────────

export interface SocialLink {
  label: string;
  href: string;
  icon: "linkedin" | "github" | "mail";
}

/** A measurement. `value` and `unit` are set in mono; `label` explains it. */
export interface Metric {
  value: string;
  unit?: string;
  label: string;
  /** Direction of the change, so the arrow never contradicts the number. */
  dir?: "down" | "up";
}

export const profile = {
  name: "Jordan Urbaez-Lu",
  firstName: "Jordan",
  lastName: "Urbaez-Lu",
  initials: "JU",
  role: "Senior Lead Software Engineer",
  company: "Walmart Global Tech",

  /** Hero headline, split so the line breaks are set rather than reflowed. */
  headline: ["I make the web", "fast for tens", "of millions."],

  /** The claim the whole page is built to prove. */
  lede: "I lead the Walmart+ web platform — membership, account and payments for tens of millions of members, at hundreds of millions of page views a month. I took P75 page latency down 45%.",

  /** The hero console rows. Named after what each control actually does —
      main-thread blocking, not network latency. The distinction is the whole
      reason any of it is believable. */
  invitation:
    "Put real load on this page's main thread — genuine long tasks, not a filter. Try to use the page while it's on. That gap is what INP measures, and closing it is most of my job.",
  invitation2:
    "The page can draw its own schematic: live geometry, every byte it shipped, and the exact element the browser crowned as LCP.",
  invitation3:
    "Or watch this session's own load again, slowed down — every timestamp measured, none of it staged.",

  subhead:
    "Senior Lead Software Engineer at Walmart Global Tech. I lead the Walmart+ web platform — membership, account and payments for tens of millions of members — and cut P75 page latency by 45%.",

  location: "Sunnyvale, CA",
  email: "jordana.urbaez@gmail.com",
  phone: "(978) 289-7135",
  phoneHref: "tel:+19782897135",

  siteUrl: "https://jordan-urbaez-lu.vercel.app",
  resumeUrl: "/Jordan_Urbaez_Lu_Resume.pdf",

  socials: {
    linkedin: "https://www.linkedin.com/in/jordan-urbaez-lu/",
    github: "https://github.com/JordanUrbaezLu",
  },
} as const;

export const socialLinks: SocialLink[] = [
  { label: "LinkedIn", href: profile.socials.linkedin, icon: "linkedin" },
  { label: "GitHub", href: profile.socials.github, icon: "github" },
  { label: "Email", href: `mailto:${profile.email}`, icon: "mail" },
];

/** Above-the-fold proof. Four measurements, set like a readout. */
export const metrics: Metric[] = [
  {
    value: "45",
    unit: "%",
    label: "P75 page latency removed from Walmart+",
    dir: "down",
  },
  {
    value: "75",
    unit: "%+",
    label: "LCP, FCP and INP improved on P0/P1 pages",
    dir: "up",
  },
  { value: "15", unit: "%", label: "Membership renewals gained", dir: "up" },
  { value: "3", unit: "%", label: "Membership churn reduced", dir: "down" },
];

/** Conversation openers for the contact section. Each one is a real story
    from the résumé, so a hiring manager can start a specific conversation
    instead of a generic one. */
export const askAbout = [
  "The Node/TypeScript/GraphQL data-fetching rearchitecture behind the 45% P75 win",
  "Running the A/B programme that moved renewals 15% and churn 3%",
  "Putting agentic AI into production: incident triage, and models that reschedule a renewal before a card fails",
];

/** Scale facts — stated once, in the reader's units, not engineering's. */
export const scale = [
  { value: "Tens of millions", label: "active members served" },
  { value: "Hundreds of millions", label: "page views + API calls / month" },
  { value: "7+ years", label: "shipping for the web" },
];
