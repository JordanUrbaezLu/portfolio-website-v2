"use client";
import { useEffect, useState } from "react";
import { profile } from "@/data/profile";

export interface NavSection {
  id: string;
  label: string;
}

export function TopBar({
  sections,
  active,
}: {
  sections: readonly NavSection[];
  active: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const go = (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setOpen(false);
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
  };

  return (
    <>
      {/* Opaque, not frosted — content must not bleed through the chrome. */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-rule bg-void">
        <div className="flex h-14 items-center gap-4 px-4 md:px-5">
          {/* Identity — the one thing a hiring manager must never hunt for. */}
          <a
            href="#top"
            onClick={go("top")}
            className="flex min-w-0 items-center gap-3"
          >
            <span className="readout shrink-0 border border-rule-lit px-1.5 py-1 text-[0.6875rem] font-semibold leading-none text-paper">
              {profile.initials}
            </span>
            <span className="min-w-0 truncate">
              <span className="display-sm block text-[0.9375rem] leading-none text-paper">
                {profile.name}
              </span>
              <span className="label mt-1 block truncate leading-none">
                {profile.role} · {profile.company}
              </span>
            </span>
          </a>

          <nav className="ml-auto hidden items-center gap-1 md:flex">
            {sections.map((s) => {
              const isActive = active === s.id;
              return (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  onClick={go(s.id)}
                  aria-current={isActive ? "true" : undefined}
                  className={`relative px-3 py-2 transition-colors ${
                    isActive ? "text-paper" : "text-faint hover:text-paper"
                  }`}
                >
                  <span className="label !text-current">{s.label}</span>
                  <span
                    aria-hidden
                    className={`absolute inset-x-3 bottom-1 h-px transition-opacity ${
                      isActive ? "bg-paper opacity-100" : "opacity-0"
                    }`}
                  />
                </a>
              );
            })}
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 border border-rule-lit px-3 py-2 text-paper transition-colors hover:bg-panel-2"
            >
              <span className="label !text-paper">Résumé ↗</span>
            </a>
          </nav>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="ml-auto border border-rule-lit px-3 py-2 text-paper md:hidden"
          >
            <span className="label !text-paper">{open ? "Close" : "Menu"}</span>
          </button>
        </div>
      </header>

      {open && (
        <div
          id="mobile-nav"
          className="fixed inset-0 z-40 flex flex-col bg-void pt-14 md:hidden"
        >
          <nav className="flex flex-1 flex-col justify-center px-6">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                onClick={go(s.id)}
                aria-current={active === s.id ? "true" : undefined}
                className="silkscreen block py-5"
              >
                <span
                  className={`display-lg block text-4xl ${
                    active === s.id ? "text-paper" : "text-dim"
                  }`}
                >
                  {s.label}
                </span>
              </a>
            ))}
          </nav>
          <div className="px-6 pb-28">
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block border border-rule-lit px-4 py-4 text-center text-paper"
            >
              <span className="label !text-paper">Download résumé ↗</span>
            </a>
          </div>
        </div>
      )}
    </>
  );
}
