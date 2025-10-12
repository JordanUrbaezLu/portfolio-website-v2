// src/data/projects.ts

export type ProjectLinkType = "appstore" | "live" | "github" | "case";

export interface ProjectLink {
  type: ProjectLinkType;
  label?: string;
  href: string;
}

export interface ProjectMedia {
  type: "video" | "image";
  src: string;
  poster?: string;
  alt?: string;
}

export interface Project {
  title: string;
  slug?: string;
  summary: string;
  tech: string[];
  media: ProjectMedia[];
  mediaLayout?: "mobile-stack" | "hybrid"; // New field
  links?: ProjectLink[];
  featured?: boolean;
}

export const projects: Project[] = [
  {
    title: "Next Pokédex",
    slug: "next-pokédex",
    summary: "Pokedex powered by Next.js, React, GraphQL, and Java.",
    tech: ["Next.js", "React", "Typescript", "Java", "GraphQL"],
    media: [
      {
        type: "image",
        src: "/assets/nextPokedex.png",
        alt: "Next Pokedex",
      },
    ],
    links: [
      {
        type: "live",
        label: "Demo",
        href: "https://next-pokedex-git-favorite-jordanurbaezlus-projects.vercel.app/generation/1",
      },
      {
        type: "github",
        href: "https://github.com/jrmoynihan99/Smart-Light-Intersection",
      },
    ],
  },
  {
    title: "Airbnb Clone",
    slug: "airbnb clone",
    summary: "Airbnb clone integrated with membership features",
    tech: ["Next.js", "React", "Typescript", "TailwindCSS"],
    media: [
      {
        type: "image",
        src: "/assets/airbnbClone.png",
        alt: "Airbnb",
      },
    ],
    links: [
      {
        type: "live",
        label: "Demo",
        href: "https://next-js-airbnb-app-teal.vercel.app/",
      },
      {
        type: "github",
        href: "https://github.com/JordanUrbaezLu/NextJS-Airbnb-App",
      },
    ],
  },
  {
    title: "Void UI React Component Library",
    slug: "void-ui",
    summary: "Modern React component library with a Void theme.",
    tech: ["React", "Typescript", "SCSS", "Storybook", "Chromatic"],
    media: [
      {
        type: "image",
        src: "/assets/voidui.png",
        alt: "Void UI",
      },
    ],
    links: [
      {
        type: "live",
        label: "Demo",
        href: "https://jordanurbaezlu.github.io/void-ui-library/?path=/story/components-inputs-datepicker--selected",
      },
      {
        type: "github",
        href: "https://github.com/JordanUrbaezLu/void-ui-library",
      },
    ],
  },
  {
    title: "Spaceship PVP",
    slug: "spaceship-pvp",
    summary: "Spaceship PVP game created with Python.",
    tech: ["Python", "Game Assets", "PVP"],
    media: [
      {
        type: "image",
        src: "/assets/spaceshipPVP.png",
        alt: "Spaceship PVP",
      },
    ],
    links: [
      {
        type: "github",
        href: "https://github.com/JordanUrbaezLu/SpaceshipPVP",
      },
    ],
  },
];
