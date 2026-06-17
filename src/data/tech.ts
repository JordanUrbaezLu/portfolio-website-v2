// Per-tech brand gradient + glyph, used by <TechBadge>.
// `iconify` = a bundled brand logo (rendered white on the gradient tile).
// `lucide`  = a lucide icon name for abstract concepts with no logo.
// `from`/`to` = the left→right gradient that fills the icon's background tile.
export interface TechMeta {
  iconify?: string;
  lucide?: string;
  from: string;
  to: string;
}

const TECH: Record<string, TechMeta> = {
  react: { iconify: "logos:react", from: "#22d3ee", to: "#3b82f6" },
  "next.js": { iconify: "logos:nextjs-icon", from: "#94a3b8", to: "#475569" },
  next: { iconify: "logos:nextjs-icon", from: "#94a3b8", to: "#475569" },
  graphql: { iconify: "logos:graphql", from: "#ec4899", to: "#d946ef" },
  "node.js": { iconify: "logos:nodejs-icon", from: "#4ade80", to: "#16a34a" },
  node: { iconify: "logos:nodejs-icon", from: "#4ade80", to: "#16a34a" },
  java: { iconify: "logos:java", from: "#fb923c", to: "#ef4444" },
  redux: { iconify: "logos:redux", from: "#a78bfa", to: "#7c3aed" },
  typescript: { iconify: "logos:typescript-icon", from: "#60a5fa", to: "#2563eb" },
  javascript: { iconify: "logos:javascript", from: "#fbbf24", to: "#f59e0b" },
  scss: { iconify: "logos:sass", from: "#f472b6", to: "#fb7185" },
  sass: { iconify: "logos:sass", from: "#f472b6", to: "#fb7185" },
  css: { iconify: "logos:css-3", from: "#38bdf8", to: "#3b82f6" },
  html: { iconify: "logos:html-5", from: "#fb923c", to: "#f59e0b" },
  express: { iconify: "logos:express", from: "#a3a3a3", to: "#525252" },
  go: { iconify: "logos:go", from: "#22d3ee", to: "#0891b2" },
  docker: { iconify: "logos:docker-icon", from: "#38bdf8", to: "#2563eb" },
  python: { iconify: "logos:python", from: "#60a5fa", to: "#fbbf24" },
  jest: { iconify: "logos:jest", from: "#f472b6", to: "#dc2626" },

  // Abstract concepts → lucide glyph on a gradient tile
  "core web vitals": { lucide: "Gauge", from: "#34d399", to: "#22d3ee" },
  "design system": { lucide: "Component", from: "#a78bfa", to: "#8b5cf6" },
  "https/tls": { lucide: "Lock", from: "#34d399", to: "#10b981" },
  authorization: { lucide: "ShieldCheck", from: "#818cf8", to: "#6366f1" },
  rest: { lucide: "Webhook", from: "#2dd4bf", to: "#06b6d4" },
  "ci/cd": { lucide: "GitBranch", from: "#38bdf8", to: "#6366f1" },
  "dashboard monitoring": { lucide: "Activity", from: "#fbbf24", to: "#f59e0b" },
  "dasboard monitoring": { lucide: "Activity", from: "#fbbf24", to: "#f59e0b" }, // data typo
};

const FALLBACK: TechMeta = { lucide: "Code2", from: "#818cf8", to: "#a78bfa" };

export function getTechMeta(name: string): TechMeta {
  return TECH[name.trim().toLowerCase()] ?? FALLBACK;
}
