import React from "react";
import { Button } from "@/components/ui/Button";
import type { ProjectLink } from "@/data/projects";

interface ProjectLinkButtonProps {
  link: ProjectLink;
  size?: "sm" | "md";
}

export function ProjectLinkButton({
  link,
  size = "md",
}: ProjectLinkButtonProps) {
  const icon = (
    <svg
      className={`${
        size === "sm" ? "w-3 h-3" : "w-4 h-4"
      } transition-transform group-hover:translate-x-1`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M17 8l4 4m0 0-4 4m4-4H3"
      />
    </svg>
  );

  let label = link.label;
  if (!label) {
    label =
      link.type === "appstore"
        ? "App Store"
        : link.type === "github"
        ? "GitHub"
        : link.type === "live"
        ? "Live Demo"
        : "Case Study";
  }

  return (
    <Button
      as="a"
      href={link.href}
      variant={link.type === "case" ? "primary" : "outline"}
      target={link.type !== "case" ? "_blank" : undefined}
      rel={link.type !== "case" ? "noopener noreferrer" : undefined}
      className={`gap-2 group ${
        size === "sm" ? "px-3 py-1.5 text-sm" : "px-4 py-2"
      }`}
    >
      {label}
      {icon}
    </Button>
  );
}
