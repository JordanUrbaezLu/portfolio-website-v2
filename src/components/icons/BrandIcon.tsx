"use client";
import * as React from "react";
import { Icon, addCollection, type IconifyJSON } from "@iconify/react";
// Load entire sets once (typed as IconifyJSON)
import logos from "@iconify-json/logos/icons.json";
import devicon from "@iconify-json/devicon/icons.json";
import skillIcons from "@iconify-json/skill-icons/icons.json";

addCollection(logos as IconifyJSON);
addCollection(devicon as IconifyJSON);
addCollection(skillIcons as IconifyJSON);

const ALIASES: Record<string, string> = {
  // Frontend
  react: "logos:react",
  "next.js": "logos:nextjs-icon",
  typescript: "devicon:typescript",
  graphql: "logos:graphql",


  // Backend & DevOps
  "node.js": "logos:nodejs-icon",
  node: "logos:nodejs-icon",
  express: "devicon:express",
  java: "devicon:java",
  docker: "logos:docker-icon",
  "github actions": "devicon:githubactions",
  rest: "devicon:swagger", // REST API with Swagger

  // Tooling & Testing
  jest: "logos:jest",
  jenkins: "logos:jenkins",
  webpack: "logos:webpack",
  "react testing library": "logos:testing-library",
  "react testing lib": "logos:testing-library",

  // Other
  openai: "logos:openai-icon",
  go: "devicon:go",
  "llms / neural nets": "logos:openai-icon",
  "c/c++ (embedded)": "devicon:cplusplus",
  python: "logos:python",
  shopify: "logos:shopify",
  stripe: "logos:stripe",
  "prompt engineering": "logos:openai-icon", // OpenAI for prompt engineering
  "agile/scrum": "devicon:jira", // Jira for agile methodology
  "ci/cd": "devicon:githubactions", // Use GitHub Actions for CI/CD
  "product & brand": "logos:figma", // Figma for design/branding
};

// Generic fallback icons for different categories
const CATEGORY_FALLBACKS: Record<string, string> = {
  frontend: "skill-icons:html",
  backend: "skill-icons:nodejs-dark",
  tooling: "skill-icons:vscode-dark",
  testing: "skill-icons:vitest-dark",
  other: "skill-icons:rocket",
  default: "skill-icons:star",
};

export function BrandIcon({
  name,
  className = "h-5 w-5",
  title,
  category = "default",
}: {
  name: string;
  className?: string;
  title?: string;
  category?:
    | "frontend"
    | "backend"
    | "tooling"
    | "testing"
    | "other"
    | "default";
}) {
  const key = name.trim().toLowerCase();
  const iconName = ALIASES[key];

  if (!iconName) {
    // Use category-specific fallback or default fallback
    const fallbackIcon =
      CATEGORY_FALLBACKS[category] || CATEGORY_FALLBACKS.default;
    return (
      <Icon
        icon={fallbackIcon}
        className={className}
        aria-label={title ?? name}
      />
    );
  }

  return (
    <Icon icon={iconName} className={className} aria-label={title ?? name} />
  );
}
