"use client";
import * as React from "react";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { Download, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { profile } from "@/data/profile";

export function SiteNav({
  active,
  sections,
}: {
  active: string;
  sections: { id: string; label: string }[];
}) {
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  // Scroll-aware mobile bar (mobile scrolls the window/document).
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while menu is open
  React.useEffect(() => {
    const prev = document.body.style.overflow;
    if (open) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev || "";
    };
  }, [open]);

  // Close on Escape
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const onLinkClick =
    (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      setOpen(false);
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        history.replaceState(null, "", `#${id}`);
      }
    };

  const Monogram = () => (
    <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 font-display text-[0.7rem] font-bold text-white shadow-[0_4px_14px_-4px_rgba(99,102,241,0.8)]">
      JU
    </span>
  );

  return (
    <>
      {/* ── Desktop nav: floating centered glass pill ── */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 hidden md:block">
        <div className="glass-strong flex items-center gap-1.5 rounded-full px-2 py-2 shadow-2xl lg:gap-2">
          <ul className="flex items-center gap-0.5 text-sm font-medium lg:gap-1">
            {sections.map((section) => {
              const isActive = active === section.id;
              return (
                <li key={section.id} className="relative">
                  <a
                    href={`#${section.id}`}
                    onClick={onLinkClick(section.id)}
                    aria-current={isActive ? "page" : undefined}
                    className={`relative block rounded-full px-3.5 py-2 transition-colors duration-300 whitespace-nowrap lg:px-4 ${
                      isActive ? "text-white" : "text-white/55 hover:text-white"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-active-pill"
                        className="absolute inset-0 -z-10 rounded-full bg-white/10 ring-1 ring-inset ring-white/15"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 32,
                          mass: 0.8,
                        }}
                      />
                    )}
                    <span className="relative z-10">{section.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>

          <span className="mx-1 h-6 w-px bg-white/12" aria-hidden="true" />

          <Button
            as="a"
            href={profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="primary"
            size="sm"
            className="!rounded-full"
          >
            <Download size={15} />
            Resume
          </Button>
        </div>
      </nav>

      {/* ── Desktop social links (top-right, floating) ── */}
      <div className="fixed top-6 right-6 z-50 hidden lg:block">
        <div className="glass-strong rounded-full px-2 py-1.5 shadow-2xl">
          <SocialLinks size="sm" className="gap-1.5" />
        </div>
      </div>

      {/* ── Mobile top bar (full-width, scroll-aware) ── */}
      <header
        className={clsx(
          "md:hidden fixed inset-x-0 top-0 z-50 transition-all duration-300",
          scrolled
            ? "border-b border-white/10 bg-[#070a16]/75 backdrop-blur-xl"
            : "border-b border-transparent"
        )}
      >
        <div className="flex h-14 items-center justify-between px-4">
          <a
            href="#home"
            onClick={onLinkClick("home")}
            className="flex items-center"
            aria-label="Back to top"
          >
            <Monogram />
          </a>
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.05] text-white/90 backdrop-blur-md transition-transform active:scale-95"
          >
            <Menu size={20} />
          </button>
        </div>
      </header>

      {/* ── Mobile full-screen menu ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="md:hidden fixed inset-0 z-[60]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-[#05070f]/85 backdrop-blur-2xl" />
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(700px 480px at 15% -10%, rgba(99,102,241,0.30), transparent 60%), radial-gradient(620px 460px at 110% 110%, rgba(167,139,250,0.26), transparent 60%)",
              }}
            />

            {/* Content */}
            <div className="relative flex h-full flex-col px-6 pb-10 pt-3">
              <div className="flex h-14 items-center justify-between">
                <span className="flex items-center gap-2.5">
                  <Monogram />
                  <span className="font-display text-sm font-semibold tracking-tight text-white">
                    {profile.name}
                  </span>
                </span>
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                  className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.05] text-white/90 transition-transform active:scale-95"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="flex flex-1 flex-col justify-center">
                <ul className="space-y-1">
                  {sections.map((section, index) => {
                    const isActive = active === section.id;
                    return (
                      <motion.li
                        key={section.id}
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 16 }}
                        transition={{
                          delay: 0.08 + index * 0.05,
                          duration: 0.4,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                      >
                        <a
                          href={`#${section.id}`}
                          onClick={onLinkClick(section.id)}
                          aria-current={isActive ? "page" : undefined}
                          className="group flex items-baseline gap-4 py-3"
                        >
                          <span
                            className={clsx(
                              "font-mono text-sm tabular-nums transition-colors",
                              isActive ? "text-indigo-300" : "text-white/30"
                            )}
                          >
                            0{index + 1}
                          </span>
                          <span
                            className={clsx(
                              "font-display text-3xl font-semibold tracking-tight transition-colors",
                              isActive
                                ? "text-aurora"
                                : "text-white/80 group-hover:text-white"
                            )}
                          >
                            {section.label}
                          </span>
                        </a>
                      </motion.li>
                    );
                  })}
                </ul>
              </nav>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.08 + sections.length * 0.05, duration: 0.4 }}
                className="space-y-5"
              >
                <Button
                  as="a"
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  variant="primary"
                  size="lg"
                  className="w-full"
                >
                  <Download size={18} />
                  Download résumé
                </Button>
                <div className="flex justify-center">
                  <SocialLinks />
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
