"use client";
import React from "react";
import clsx from "clsx";
import { Linkedin, Github, Mail, Phone } from "lucide-react";
import { socialLinks, type SocialLink } from "@/data/profile";

const iconMap = {
  linkedin: Linkedin,
  github: Github,
  mail: Mail,
  phone: Phone,
} as const;

export function SocialLinks({
  links = socialLinks,
  size = "md",
  className,
}: {
  links?: SocialLink[];
  size?: "sm" | "md";
  className?: string;
}) {
  const dim = size === "sm" ? "h-9 w-9" : "h-11 w-11";
  const icon = size === "sm" ? 16 : 18;

  return (
    <div className={clsx("flex items-center gap-3", className)}>
      {links.map((link) => {
        const Icon = iconMap[link.icon];
        const external = link.href.startsWith("http");
        return (
          <a
            key={link.label}
            href={link.href}
            aria-label={link.label}
            title={link.label}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            className={clsx(
              dim,
              "group inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/70 transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-300/40 hover:bg-white/[0.08] hover:text-white"
            )}
          >
            <Icon
              size={icon}
              className="transition-transform duration-300 group-hover:scale-110"
            />
          </a>
        );
      })}
    </div>
  );
}
