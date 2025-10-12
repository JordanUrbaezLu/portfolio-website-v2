"use client";
import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";

export function SiteNav({
  active,
  sections,
}: {
  active: string;
  sections: { id: string; label: string }[];
}) {
  const [open, setOpen] = React.useState(false);

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

  return (
    <>
      {/* Desktop nav */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 hidden md:block">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-3 lg:px-8 lg:py-4 shadow-2xl">
          <ul className="flex gap-4 lg:gap-8 text-sm font-medium">
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  onClick={onLinkClick(section.id)}
                  className={`relative py-2 px-3 lg:px-4 rounded-lg transition-all duration-300 whitespace-nowrap ${
                    active === section.id
                      ? "text-white bg-white/10"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile morphing menu (floating, right side) */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        {/* click-away area (transparent) */}
        <AnimatePresence>
          {open && (
            <motion.div
              className="fixed inset-0"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </AnimatePresence>

        {/* Main container - always present, just morphs */}
        <motion.div
          className="relative bg-white/10 backdrop-blur-xl border border-white/15 shadow-xl overflow-hidden"
          animate={{
            width: open ? 240 : 44,
            height: open ? "auto" : 44,
            borderRadius: open ? 16 : 22,
          }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 30,
            mass: 0.8,
          }}
        >
          {/* Always render both, but control visibility with AnimatePresence */}
          <div className="relative w-full h-full">
            {/* Hamburger button */}
            <AnimatePresence>
              {!open && (
                <motion.button
                  type="button"
                  aria-label="Open menu"
                  onClick={() => setOpen(true)}
                  className="absolute inset-0 flex items-center justify-center text-white"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    className="opacity-90"
                  >
                    <path
                      d="M4 7h16M4 12h16M4 17h16"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                </motion.button>
              )}
            </AnimatePresence>

            {/* Menu content */}
            <AnimatePresence>
              {open && (
                <motion.div
                  className="p-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 0.2,
                    delay: 0.1,
                  }}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between px-2 py-1 mb-2">
                    <span className="text-white/80 text-sm font-medium">
                      Menu
                    </span>
                    <button
                      type="button"
                      aria-label="Close menu"
                      onClick={() => setOpen(false)}
                      className="h-8 w-8 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center text-white hover:bg-white/20 active:scale-95 transition-all"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        className="opacity-90"
                      >
                        <path
                          d="M6 6l12 12M18 6l-12 12"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Menu items */}
                  <ul className="space-y-1">
                    {sections.map((section, index) => {
                      const isActive = active === section.id;
                      return (
                        <motion.li
                          key={section.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{
                            delay: 0.15 + index * 0.05,
                            duration: 0.3,
                            type: "spring",
                            stiffness: 300,
                            damping: 25,
                          }}
                        >
                          <a
                            href={`#${section.id}`}
                            onClick={onLinkClick(section.id)}
                            className={`flex items-center justify-between px-3 py-3 rounded-lg transition-all duration-200 ${
                              isActive
                                ? "bg-white/15 text-white"
                                : "bg-white/5 text-white/80 hover:bg-white/10 hover:text-white"
                            }`}
                          >
                            <span className="text-sm font-medium whitespace-nowrap">
                              {section.label}
                            </span>
                            <span
                              className={`h-1.5 w-1.5 rounded-full transition-colors ml-2 ${
                                isActive ? "bg-white" : "bg-white/30"
                              }`}
                            />
                          </a>
                        </motion.li>
                      );
                    })}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </>
  );
}
