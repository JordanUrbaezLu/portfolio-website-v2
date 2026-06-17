# Portfolio — durable brief (read first)

**Mission:** A conversion-focused personal portfolio for Jordan Urbaez-Lu (Senior
Software Engineer). Primary goal: get recruiters & eng managers to **get in touch**.
Aesthetic: **"Aurora Glass"** — premium dark, indigo→teal→violet aurora, glassmorphism.

## Stack
Next.js 15 (App Router) · React 19 · TypeScript (strict) · Tailwind **v4** ·
framer-motion · lucide-react · @iconify/react.

## Commands
- `npm run dev` — dev server
- `npm run build` — production build (also type-checks + lints)
- `npm run status` — one-shot health/integrity check (run this first)
- `node scripts/audit.mjs <url> <outPrefix> [--mobile] [--sel=#a,#b] [--steps=N]`
  — visual screenshots (body-scroll aware). Needs a server running.

## Page structure
Single page: **Hero → About → Experience → Skills → Contact** (no Projects section).
Positioning: Senior SWE at Walmart Global Tech — web performance + agentic AI.

## Code map
- `src/app/page.tsx` — the single page; lazy-loads sections, owns the scroll-spy registry.
- `src/app/layout.tsx` — fonts (Inter+Sora via next/font), SEO/OG metadata. **Owns** `/public/og.png`.
- `src/app/globals.css` — **the design system** (Aurora tokens via `@theme`, glass/glow/grain/motion utilities). Source of truth.
- `src/components/sections/*` — sections: Hero, About, Experience, Skills, Contact.
- `src/components/ui/*` — primitives: Button, Card, Tag, Section, SectionHeader, SocialLinks, StatBand, LogoStrip, HeadshotProgress.
- `src/data/*` — all content. `profile.ts` = identity/social/metrics/companies/hero copy; `about.ts` = bio + focus areas; `experiences.ts`; `skills.ts`.

## Hard-won facts — do not re-learn
- **Tailwind v4, no config file:** there is no `tailwind.config.ts` (v4 doesn't need one without `@config`). The `@theme` block + custom classes in `globals.css` are authoritative; v4 auto-detects content. Define tokens/utilities there.
- **Desktop scroll model:** `html{overflow:hidden}`, `body` scrolls. Tools that scroll via `window.scrollTo` do nothing on desktop — scroll `document.body`. Section reveals use framer `whileInView` (`once:true`); they only fire once scrolled into view. (`scripts/audit.mjs` handles this.)
- **Contact form = `mailto:` handoff** (no backend; `/api/contact` does not exist by design).
- A Projects section + a full case-study system (`/work/[slug]`, `case-study/*`, `case-studies.ts`) **used to exist** but were removed — they were template content (Anchor/Dialed, `github.com/jrmoynihan99`) that wasn't the owner's. Don't re-introduce that data. The primitives (Card/Section/etc.) make rebuilding a real projects section easy if the owner provides real work.

## ⚠️ Owner action items (placeholders to swap)
- `src/data/profile.ts` → `socials.linkedin` (real LinkedIn URL) and `resumeUrl` (drop real PDF at `/public/Jordan-Urbaez-Lu-Resume.pdf`).
- `src/data/profile.ts` → `siteUrl` (production domain, used for OG/canonical).

## Verification bar for changes
1. `npm run build` is green. 2. `npm run status` passes. 3. Visually verify touched
pages with `scripts/audit.mjs` at desktop **and** `--mobile`. Keep section `id`s
(home/about/experience/skills/contact) — the scroll-spy depends on them.
