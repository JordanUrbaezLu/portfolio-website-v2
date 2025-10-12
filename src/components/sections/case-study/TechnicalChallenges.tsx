"use client";
import React, { useMemo, useState, useEffect, lazy, Suspense } from "react";
import clsx from "clsx";
import { ChevronDown, ChevronUp } from "@/components/icons/lucide-icons";
import { MotionParallax } from "@/components/animations/MotionParallax";
import { MotionReveal } from "@/components/animations/MotionReveal";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { caseStudies } from "@/data/case-studies";
import { MetricBadge } from "./technical-challenges/MetricBadge";
import { CodeLightbox } from "./technical-challenges/CodeLightbox";
// Lazy load CodePeek to improve initial render performance
const CodePeek = lazy(() => import("./technical-challenges/CodePeek"));
type Registry = React.RefObject<Record<string, HTMLElement | null>>;
export function TechnicalChallenges({
  registry,
  slug,
}: {
  registry: Registry;
  slug: string;
}) {
  const [underlineActive, setUnderlineActive] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [codeLightbox, setCodeLightbox] = useState<{
    language: string;
    snippet: string;
    caption?: string;
  } | null>(null);
  const cs = caseStudies[slug];
  const data = cs?.technicalChallenges;
  const items = useMemo(() => data?.challenges ?? [], [data]);
  useEffect(() => {
    const handleHashChange = () => {
      if (typeof window !== "undefined" && window.location.hash) {
        const hash = window.location.hash.substring(1);
        const match = hash.match(/^technical-challenge-(\d+)$/);
        if (match) {
          const index = parseInt(match[1], 10);
          setTimeout(() => {
            setExpanded(index);
            const element = document.getElementById(
              `technical-challenge-${index}`
            );
            if (element) {
              element.scrollIntoView({ behavior: "smooth", block: "center" });
            }
          }, 300);
        }
      }
    };
    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);
  if (!cs || !data) return null;
  return (
    <Section
      id="technical-challenges"
      registry={registry}
      className="relative py-16 md:py-24 px-4 z-20"
    >
      <MotionParallax range={30}>
        <div className="mx-auto max-w-5xl">
          <MotionReveal
            direction="up"
            delay={0}
            onViewportEnter={() =>
              setTimeout(() => setUnderlineActive(true), 300)
            }
          >
            <SectionHeader
              activateUnderline={underlineActive}
              underlineDelay={80}
            >
              Technical Challenges
            </SectionHeader>
          </MotionReveal>
          {data.intro && (
            <MotionReveal direction="up">
              <p className="mb-8 text-white/70 text-center">{data.intro}</p>
            </MotionReveal>
          )}
          <div className="space-y-6">
            {items.map((c, i) => {
              const isOpen = expanded === i;
              const hasCode = !!c.code;
              return (
                <MotionReveal key={i} direction="up">
                  <Card
                    id={`technical-challenge-${i}`}
                    padding="p-0"
                    className={clsx(
                      "group transition-all overflow-hidden",
                      isOpen ? "bg-white/[0.06]" : "hover:bg-white/[0.04]"
                    )}
                  >
                    {/* Header - Clickable */}
                    <button
                      className="flex w-full items-start gap-4 p-5 md:p-7 text-left cursor-pointer"
                      onClick={() => setExpanded(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      aria-controls={`challenge-${i}`}
                    >
                      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-sm font-medium text-white/70 group-hover:bg-white/20 transition-colors">
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="text-xl md:text-2xl font-medium text-white">
                            {c.title}
                          </h3>
                          <div className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-1.5 text-xs text-white/70 border border-white/10 group-hover:bg-white/10 group-hover:text-white transition-all shrink-0">
                            <span className="font-medium">
                              {isOpen ? "Collapse" : "Expand"}
                            </span>
                            {isOpen ? (
                              <ChevronUp className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
                            ) : (
                              <ChevronDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
                            )}
                          </div>
                        </div>
                        {/* Metrics badges */}
                        {c.impact?.length ? (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {c.impact.map((m, idx) => (
                              <MetricBadge
                                key={idx}
                                label={m.label}
                                value={m.value}
                              />
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </button>
                    {/* Collapsible content - Animated */}
                    <div
                      id={`challenge-${i}`}
                      className={clsx(
                        "grid overflow-hidden transition-[grid-template-rows,opacity] duration-300",
                        isOpen
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      )}
                    >
                      <div className="min-h-0">
                        <div className="mt-5 space-y-5 px-5 md:px-7 pb-5 md:pb-7">
                          {/* Context or Problem (legacy) */}
                          {(c.context || c.problem) && (
                            <div>
                              <h4 className="text-xs uppercase tracking-wider text-white/50 mb-2">
                                {c.context
                                  ? "Context / Constraints"
                                  : "Challenge"}
                              </h4>
                              <p className="text-white/70">
                                {c.context ?? c.problem}
                              </p>
                            </div>
                          )}
                          {/* Approach or Solution (legacy) */}
                          {(c.approach?.length || c.solution) && (
                            <div>
                              <h4 className="text-xs uppercase tracking-wider text-white/50 mb-2">
                                {c.approach?.length ? "Approach" : "Solution"}
                              </h4>
                              {c.approach?.length ? (
                                <ul className="list-disc pl-5 text-white/80 space-y-1.5">
                                  {c.approach.map((a, idx) => (
                                    <li key={idx}>{a}</li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-white/80">{c.solution}</p>
                              )}
                            </div>
                          )}
                          {/* Trade-offs */}
                          {c.tradeoffs?.length ? (
                            <div>
                              <h4 className="text-xs uppercase tracking-wider text-white/50 mb-2">
                                Trade-offs
                              </h4>
                              <ul className="list-disc pl-5 text-white/70 space-y-1.5">
                                {c.tradeoffs.map((t, idx) => (
                                  <li key={idx}>{t}</li>
                                ))}
                              </ul>
                            </div>
                          ) : null}
                          {/* Outcome */}
                          {(c.outcome || c.impact?.length) && (
                            <div>
                              <h4 className="text-xs uppercase tracking-wider text-white/50 mb-2">
                                Outcome
                              </h4>
                              {c.outcome && (
                                <p className="text-white/80">{c.outcome}</p>
                              )}
                            </div>
                          )}
                          {/* Technologies */}
                          {c.technologies?.length ? (
                            <div>
                              <h4 className="text-xs uppercase tracking-wider text-white/50 mb-2">
                                Technologies
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {c.technologies.map((t, idx) => (
                                  <Tag key={idx}>{t}</Tag>
                                ))}
                              </div>
                            </div>
                          ) : null}
                          {/* Code - Full Width - Only mounts when open */}
                          {hasCode && isOpen && (
                            <div>
                              <Suspense
                                fallback={
                                  <div className="h-48 rounded-2xl border border-white/10 bg-black/40 animate-pulse flex items-center justify-center">
                                    <span className="text-xs text-white/40">
                                      Loading code...
                                    </span>
                                  </div>
                                }
                              >
                                <CodePeek
                                  language={c.code!.language.toUpperCase()}
                                  snippet={c.code!.snippet}
                                  caption={c.code!.caption}
                                  onExpand={() =>
                                    setCodeLightbox({
                                      language: c.code!.language.toUpperCase(),
                                      snippet: c.code!.snippet,
                                      caption: c.code!.caption,
                                    })
                                  }
                                />
                              </Suspense>
                            </div>
                          )}
                          {/* Links */}
                          {c.links?.length ? (
                            <div className="pt-1">
                              <div className="flex flex-wrap gap-3">
                                {c.links.map((l, idx) => (
                                  <a
                                    key={idx}
                                    href={l.href}
                                    target="_blank"
                                    className="text-sm text-blue-300 hover:text-blue-200 underline underline-offset-4"
                                  >
                                    {l.label}
                                  </a>
                                ))}
                              </div>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </Card>
                </MotionReveal>
              );
            })}
          </div>
        </div>
      </MotionParallax>
      {/* Code Lightbox */}
      <CodeLightbox
        open={!!codeLightbox}
        onClose={() => setCodeLightbox(null)}
        language={codeLightbox?.language || ""}
        snippet={codeLightbox?.snippet || ""}
        caption={codeLightbox?.caption}
      />
    </Section>
  );
}
