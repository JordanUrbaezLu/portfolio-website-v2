// src/data/about.ts

export interface FocusArea {
  /** Two-letter channel code — this page labels things the way a mixer does. */
  code: string;
  title: string;
  body: string;
  /** The measurement that backs the claim. */
  proof: string;
}

export const about = {
  paragraphs: [
    "I'm a Senior Lead Software Engineer at Walmart Global Tech. My job is the Walmart+ web platform: the pages where tens of millions of members sign up, manage their account, and pay. At that size, how fast a page feels is not a polish item — it is the product.",
    "I spend most of my time in the render path — data fetching, SSR strategy, code splitting, caching. The work that took P75 latency down 45% wasn't one trick. It was rebuilding how the app asks for data, and what it does while it waits.",
    "Increasingly I build the tooling too: an on-call analyzer that reads incident signal, billing models that reschedule a renewal before a card fails. It's the same instinct as performance work — find the wasted time and take it out.",
  ],

  focusAreas: [
    {
      code: "01",
      title: "The render path",
      body: "Core Web Vitals, SSR and streaming strategy, code splitting, caching and prefetching. Making the browser do less, later, and in a better order.",
      proof: "45% of P75 latency removed from Walmart+",
    },
    {
      code: "02",
      title: "Systems that pay for themselves",
      body: "Design systems and internal tooling that compound. Build the thing once, correctly, and every team after you ships faster.",
      proof: "20%+ faster delivery across hundreds of pages",
    },
    {
      code: "03",
      title: "AI where it removes work",
      body: "Agentic tooling in production, not demos. An analyzer that triages incidents; models that schedule renewals before a payment fails.",
      proof: "~10% more developer output per sprint",
    },
  ] satisfies FocusArea[],
} as const;

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
