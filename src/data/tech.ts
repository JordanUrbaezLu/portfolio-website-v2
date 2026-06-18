// One brand color per tech. <TechBadge> fades it left→right (full color on the
// left, transparent on the right) across the whole chip — no icons.
export interface TechMeta {
  color: string;
}

const TECH: Record<string, TechMeta> = {
  react: { color: "#38bdf8" },
  "next.js": { color: "#94a3b8" },
  next: { color: "#94a3b8" },
  graphql: { color: "#ec4899" },
  "node.js": { color: "#4ade80" },
  node: { color: "#4ade80" },
  java: { color: "#f97316" },
  redux: { color: "#a855f7" },
  typescript: { color: "#3b82f6" },
  javascript: { color: "#eab308" },
  scss: { color: "#ec4899" },
  sass: { color: "#ec4899" },
  css: { color: "#38bdf8" },
  html: { color: "#f97316" },
  express: { color: "#94a3b8" },
  go: { color: "#22d3ee" },
  docker: { color: "#38bdf8" },
  python: { color: "#facc15" },
  jest: { color: "#f43f5e" },

  "core web vitals": { color: "#10b981" },
  "design system": { color: "#8b5cf6" },
  "https/tls": { color: "#10b981" },
  authorization: { color: "#6366f1" },
  rest: { color: "#14b8a6" },
  "ci/cd": { color: "#0ea5e9" },
  "dashboard monitoring": { color: "#f59e0b" },
  "dasboard monitoring": { color: "#f59e0b" }, // matches data typo
};

const FALLBACK: TechMeta = { color: "#818cf8" };

export function getTechMeta(name: string): TechMeta {
  return TECH[name.trim().toLowerCase()] ?? FALLBACK;
}
