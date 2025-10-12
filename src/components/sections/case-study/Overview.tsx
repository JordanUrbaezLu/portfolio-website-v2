"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import clsx from "clsx";
import { motion, useAnimation, useReducedMotion } from "framer-motion";
import { MotionParallax } from "@/components/animations/MotionParallax";
import { MotionReveal } from "@/components/animations/MotionReveal";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { caseStudies } from "@/data/case-studies";

export function Overview({
  registry,
  slug,
  // onViewModeChange, // (unused)
  viewMode,
}: {
  registry: React.RefObject<Record<string, HTMLElement | null>>;
  slug: string;
  onViewModeChange?: (mode: "desktop" | "mobile") => void;
  viewMode?: "desktop" | "mobile";
}) {
  // ==== DO NOT RETURN BEFORE HOOKS ====
  const caseStudy = caseStudies[slug];
  const missing = !caseStudy;

  // State
  const [underlineActive, setUnderlineActive] = useState(false);
  const [internalViewMode] = useState<"desktop" | "mobile">("desktop");
  const [mediaHeight, setMediaHeight] = useState<number | null>(null);
  const leftColumnRef = useRef<HTMLDivElement>(null);
  const goalsColumnRef = useRef<HTMLDivElement>(null);

  // Motion controls
  const prefersReducedMotion = useReducedMotion();
  const controls = useAnimation();

  // SAFARI FIX: Add reRenderKey to force layout recalculation
  const [reRenderKey, setReRenderKey] = useState(0);

  // Derived data (safe defaults)
  const activeViewMode = viewMode ?? internalViewMode;
  const csOrientation = caseStudy?.orientation || "portrait";
  const overviewData = caseStudy?.overview;
  const overviewOrientation = overviewData?.orientation || csOrientation;

  const computedOrientation: "portrait" | "landscape" =
    overviewOrientation === "both"
      ? activeViewMode === "desktop"
        ? "landscape"
        : "portrait"
      : (overviewOrientation as "portrait" | "landscape");

  // Visual state used during animation
  const [visualOrientation, setVisualOrientation] = useState<
    "portrait" | "landscape"
  >(computedOrientation);
  const [visualViewMode, setVisualViewMode] = useState<"desktop" | "mobile">(
    activeViewMode
  );
  const animatingRef = useRef(false);

  // Cross-fade/scale timeline
  useEffect(() => {
    if (
      visualOrientation === computedOrientation &&
      visualViewMode === activeViewMode
    )
      return;

    if (prefersReducedMotion) {
      setVisualOrientation(computedOrientation);
      setVisualViewMode(activeViewMode);
      setReRenderKey((prev) => prev + 1); // SAFARI FIX: Force reflow
      return;
    }

    if (animatingRef.current) return;
    animatingRef.current = true;

    (async () => {
      await controls.start({
        opacity: 0,
        scale: 0.98,
        filter: "blur(2px)",
        transition: { duration: 0.16, ease: [0.22, 0.61, 0.36, 1] },
      });

      setVisualOrientation(computedOrientation);
      setVisualViewMode(activeViewMode);
      setReRenderKey((prev) => prev + 1); // SAFARI FIX: Force reflow

      await controls.start({
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        transition: { duration: 0.22, ease: [0.22, 0.61, 0.36, 1] },
      });

      animatingRef.current = false;
    })();
  }, [
    computedOrientation,
    activeViewMode,
    controls,
    prefersReducedMotion,
    visualOrientation,
    visualViewMode,
  ]);

  // Media by visual mode
  const activeMedia = overviewData?.mediaByDevice
    ? overviewData.mediaByDevice[visualViewMode]
    : overviewData?.media;

  // Resize: measure the column matching the *visual* orientation
  useEffect(() => {
    const refToObserve =
      visualOrientation === "portrait"
        ? leftColumnRef.current
        : goalsColumnRef.current;
    if (!refToObserve) return;

    const update = () => {
      setMediaHeight(refToObserve?.offsetHeight ?? null);
      // SAFARI FIX: Force reflow after state update
      if (refToObserve) {
        void refToObserve.offsetHeight;
      }
    };
    update();

    window.addEventListener("resize", update);
    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(refToObserve);

    return () => {
      window.removeEventListener("resize", update);
      resizeObserver.disconnect();
    };
  }, [visualOrientation, visualViewMode]);

  // Render nothing AFTER hooks if missing data
  if (missing || !overviewData) return null;

  return (
    <Section
      id="overview"
      registry={registry}
      className="relative py-16 md:py-24 px-4 z-20"
    >
      <MotionParallax range={30}>
        <div className="max-w-5xl mx-auto">
          {/* Header */}
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
              Overview
            </SectionHeader>
          </MotionReveal>

          <MotionReveal direction="up">
            {/* Persistent container that animates but never remounts */}
            <motion.div
              animate={controls}
              initial={false}
              style={{ willChange: "opacity, transform, filter" }}
            >
              {visualOrientation === "portrait" ? (
                // Portrait layout
                <div className="flex flex-col lg:flex-row gap-12 mb-16 lg:items-start">
                  {/* Left: Description + Goals - on mobile when viewing mobile mode, text wraps around media */}
                  <div ref={leftColumnRef} className="space-y-12 flex-1">
                    {/* Description with floating media on mobile */}
                    <div className="md:block">
                      {/* Media floats on mobile screens only, in mobile view mode */}
                      {activeMedia && (
                        <div
                          key={`portrait-media-mobile-${reRenderKey}`}
                          className="md:hidden float-right ml-4 mb-4 relative rounded-3xl overflow-hidden bg-white/5 shadow-2xl border-2 border-white/20 p-1 flex-shrink-0"
                          style={{
                            width: "140px",
                          }}
                        >
                          {activeMedia.type === "video" ||
                          activeMedia.type === "gif" ? (
                            <video
                              key={activeMedia.src}
                              src={activeMedia.src}
                              autoPlay
                              loop
                              muted
                              playsInline
                              style={{ aspectRatio: "9 / 19.5" }}
                              className="w-full h-auto object-cover rounded-3xl"
                            />
                          ) : (
                            <Image
                              src={activeMedia.src}
                              alt={activeMedia.alt || "App preview"}
                              width={140}
                              height={273}
                              sizes="140px"
                              className="w-full h-auto object-cover rounded-2xl"
                            />
                          )}
                        </div>
                      )}
                      <p className="text-lg md:text-xl text-white/70 leading-relaxed">
                        {overviewData.description}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-2xl md:text-3xl text-white/90 font-light mb-8">
                        Project Goals
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {overviewData.goals.map((goal, index) => (
                          <Card key={index} padding="p-6" className="group">
                            <div className="flex items-start gap-4">
                              <div className="shrink-0 w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/60 font-medium text-sm group-hover:bg-white/20 transition-colors">
                                {index + 1}
                              </div>
                              <p className="text-white/80 leading-relaxed pt-1">
                                {goal}
                              </p>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right: Portrait media - hidden on mobile screens, shown on md+ */}
                  {activeMedia && (
                    <div
                      key={`portrait-media-desktop-${reRenderKey}`}
                      className="hidden md:block flex-shrink-0"
                      style={{ width: "clamp(220px, 28vw, 384px)" }}
                    >
                      <div
                        className="relative rounded-4xl overflow-hidden bg-white/5 shadow-2xl border-2 border-white/20 p-1"
                        style={{
                          aspectRatio: "9 / 19.5", // keep the phone shape
                          maxHeight: mediaHeight ?? undefined, // cap to the text column height
                        }}
                      >
                        {activeMedia.type === "video" ||
                        activeMedia.type === "gif" ? (
                          <video
                            key={activeMedia.src}
                            src={activeMedia.src}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full rounded-4xl object-cover" // OK now because the box ratio matches
                          />
                        ) : (
                          <Image
                            src={activeMedia.src}
                            alt={activeMedia.alt || "App preview"}
                            fill
                            sizes="384px"
                            className="object-cover rounded-4xl"
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // Landscape layout
                <div className="space-y-12 mb-16">
                  <div className="flex flex-col lg:flex-row gap-12 lg:items-start">
                    <div className="flex-1">
                      <p className="text-lg md:text-xl text-white/70 leading-relaxed">
                        {overviewData.description}
                      </p>
                    </div>

                    {/* SAFARI FIX: Let media render at natural aspect ratio */}
                    {activeMedia && (
                      <div
                        key={`landscape-media-${reRenderKey}`}
                        className={clsx(
                          "relative rounded-3xl overflow-hidden bg-white/5 shadow-2xl border-2 border-white/20 p-2",
                          "flex-shrink-0 w-full lg:w-auto"
                        )}
                        style={{ maxWidth: "600px" }}
                      >
                        {activeMedia.type === "video" ||
                        activeMedia.type === "gif" ? (
                          <video
                            key={activeMedia.src}
                            src={activeMedia.src}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-auto rounded-2xl"
                          />
                        ) : (
                          <div className="relative w-full rounded-2xl overflow-hidden">
                            <Image
                              src={activeMedia.src}
                              alt={activeMedia.alt || "App preview"}
                              width={1000}
                              height={1000}
                              sizes="600px"
                              className="w-full h-auto object-contain"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div ref={goalsColumnRef}>
                    <h3 className="text-2xl md:text-3xl text-white/90 font-light mb-8">
                      Project Goals
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {overviewData.goals.map((goal, index) => (
                        <Card key={index} padding="p-6" className="group">
                          <div className="flex items-start gap-4">
                            <div className="shrink-0 w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/60 font-medium text-sm group-hover:bg-white/20 transition-colors">
                              {index + 1}
                            </div>
                            <p className="text-white/80 leading-relaxed pt-1">
                              {goal}
                            </p>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </MotionReveal>
        </div>
      </MotionParallax>
    </Section>
  );
}

// Helper
export function shouldShowOverviewToggle(slug: string): boolean {
  const cs = caseStudies[slug];
  if (!cs) return false;
  const overviewData = cs.overview;
  const overviewOrientation =
    overviewData.orientation || cs.orientation || "portrait";
  const hasDeviceSpecificMedia = !!overviewData.mediaByDevice;
  return overviewOrientation === "both" && hasDeviceSpecificMedia;
}
