"use client";
import React from "react";
import { ArrowRight, Download, Mail } from "lucide-react";
import { MotionReveal } from "@/components/animations/MotionReveal";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { HeadshotProgress } from "@/components/ui/HeadshotProgress";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { StatBand } from "@/components/ui/StatBand";
import { LogoStrip } from "@/components/ui/LogoStrip";
import { profile } from "@/data/profile";

export function Home({
  registry,
}: {
  registry: React.RefObject<Record<string, HTMLElement | null>>;
}) {
  return (
    <Section id="home" registry={registry} className="relative z-20 px-4">
      {/* ── Identity block ── */}
      <div className="flex flex-col items-center justify-center pt-24 pb-12 md:min-h-screen md:pt-0 md:pb-0">
          <div className="mx-auto max-w-3xl text-center">
            {/* Current-role chip */}
            <MotionReveal direction="up" delay={0}>
              <div className="mb-8 flex justify-center">
                <span className="ring-aurora relative inline-flex items-center gap-2.5 rounded-full bg-white/[0.05] px-4 py-1.5 text-sm font-medium text-white/80 backdrop-blur-md">
                  <span className="h-2 w-2 rounded-full bg-gradient-to-r from-indigo-400 to-violet-400 shadow-[0_0_10px_rgba(129,140,248,0.9)]" />
                  {profile.role}
                  <span className="h-3 w-px bg-white/20" />
                  <span className="text-white/55">{profile.company}</span>
                </span>
              </div>
            </MotionReveal>

            {/* Headshot */}
            <MotionReveal direction="up" delay={60}>
              <div className="mb-8 flex items-center justify-center">
                <div className="relative">
                  <div className="absolute -inset-6 rounded-full bg-gradient-to-tr from-indigo-500/30 via-cyan-400/20 to-violet-500/30 blur-2xl" />
                  <div className="relative">
                    <HeadshotProgress size={148} gap={8} border={2} trigger />
                  </div>
                </div>
              </div>
            </MotionReveal>

            {/* Name */}
            <MotionReveal direction="up" delay={120}>
              <h1 className="font-display text-5xl font-semibold tracking-tight text-white md:text-7xl">
                {profile.name}
              </h1>
            </MotionReveal>

            {/* Value prop */}
            <MotionReveal direction="up" delay={200}>
              <p className="mx-auto mt-6 max-w-2xl text-[1.6rem] font-light leading-tight tracking-tight text-white/85 md:text-[2rem]">
                <span className="text-aurora font-normal">Fast, resilient web</span>{" "}
                at scale — and the{" "}
                <span className="text-aurora font-normal">agentic AI</span> to ship it.
              </p>
            </MotionReveal>

            {/* Supporting line */}
            <MotionReveal direction="up" delay={260}>
              <p className="mx-auto mt-5 max-w-xl text-base font-light leading-relaxed text-white/55">
                {profile.heroLine}
              </p>
            </MotionReveal>

            {/* CTAs */}
            <MotionReveal direction="up" delay={340}>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                <Button href="#contact" variant="primary" size="lg">
                  <Mail size={18} />
                  Get in touch
                </Button>
                <Button href="#experience" variant="glass" size="lg">
                  View experience
                  <ArrowRight size={18} />
                </Button>
                <Button
                  as="a"
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outline"
                  size="lg"
                >
                  <Download size={18} />
                  Résumé
                </Button>
              </div>
            </MotionReveal>

            {/* Social row */}
            <MotionReveal direction="up" delay={420}>
              <div className="mt-8 flex justify-center">
                <SocialLinks />
              </div>
            </MotionReveal>
          </div>
      </div>

      {/* ── Proof band (clear separation from the identity block) ── */}
      <div className="mx-auto max-w-5xl space-y-14 pb-10 pt-10 md:pt-4">
        <MotionReveal direction="up">
          <StatBand />
        </MotionReveal>
        <MotionReveal direction="up" delay={80}>
          <LogoStrip />
        </MotionReveal>
      </div>
    </Section>
  );
}
