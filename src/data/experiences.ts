export interface ExperienceItem {
  title: string;
  company: string;
  period: string;
  description: string;
  highlights: string[];
}

export const experiences: ExperienceItem[] = [
  {
    title: "Founder & Lead Developer",
    company: "Anchor – Nonprofit Mobile App",
    period: "2025 – Present",
    description:
      "Built and launched a nonprofit accountability app addressing pornography addiction. Available free on the App Store, featuring daily AI-generated content, AI moderation, streak tracking, and anonymous community support.",
    highlights: [
      "React Native + Expo",
      "Firebase (Auth, Firestore, Cloud Functions)",
      "Push Notifications",
      "AI Content Generation",
      "End-to-End Product Design & Launch",
    ],
  },
  {
    title: "Founder & Co-owner",
    company: "RAYN – Clothing Brand",
    period: "2023 – 2025",
    description:
      "Founded and scaled a direct-to-consumer clothing brand, generating $120K in sales on launch day and over $500K in the first year. Oversaw product design, supply chain, e-commerce development, and digital marketing.",
    highlights: [
      "E-commerce Development",
      "Brand Strategy",
      "Digital Marketing",
      "Product Design",
      "International Logistics",
    ],
  },
  {
    title: "Software Engineer",
    company: "ZOLL Medical",
    period: "2019 – 2023",
    description:
      "Engineered embedded C++/Python software for FDA-cleared medical devices. Contributed to invasive blood pressure (IBP) signal processing and waveform display, implemented core API layers across the codebase, and led design of Bluetooth connectivity features.",
    highlights: [
      "Embedded C++ Development",
      "Python",
      "Signal Processing & Visualization",
      "API Architecture",
      "Bluetooth Feature Design",
      "FDA-Regulated Development",
    ],
  },
];
