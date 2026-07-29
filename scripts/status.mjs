// One-shot project health + integrity check.  Run: npm run status
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { execSync } from "node:child_process";
import { join } from "node:path";

const ROOT = process.cwd();
const P = (...p) => join(ROOT, ...p);
let warn = 0;
let fail = 0;
const ok = (m) => console.log("  \x1b[32m✓\x1b[0m " + m);
const wn = (m) => {
  warn++;
  console.log("  \x1b[33m⚠\x1b[0m " + m);
};
const er = (m) => {
  fail++;
  console.log("  \x1b[31m✗\x1b[0m " + m);
};
const head = (m) => console.log("\n\x1b[1m" + m + "\x1b[0m");

const read = (rel) => {
  try {
    return readFileSync(P(rel), "utf8");
  } catch {
    return "";
  }
};

console.log("\x1b[1m\x1b[36mPortfolio — status\x1b[0m");

head("Toolchain");
existsSync(P("node_modules"))
  ? ok("node_modules present")
  : er("run `npm install`");

head("Type check");
try {
  execSync("npx tsc --noEmit", { cwd: ROOT, stdio: "pipe" });
  ok("tsc --noEmit clean");
} catch (e) {
  er(
    "tsc errors:\n" +
      (e.stdout?.toString() || e.message).split("\n").slice(0, 12).join("\n")
  );
}

head("Routes & key files");
[
  "src/app/page.tsx",
  "src/app/layout.tsx",
  "src/app/globals.css",
  "src/lib/latency.tsx",
  "src/lib/useVitals.ts",
  "src/lib/paintFacts.ts",
  "src/components/instrument/XRay.tsx",
  "src/components/instrument/Replay.tsx",
  "src/components/instrument/InputEcho.tsx",
  "src/types/perf-dom.d.ts",
  "public/og.png",
  "src/data/profile.ts",
].forEach((f) => (existsSync(P(f)) ? ok(f) : er("missing " + f)));

head("Sections wired in page.tsx");
{
  const page = read("src/app/page.tsx");
  ["Hero", "Experience", "About", "Skills", "Contact", "Footer"].forEach((s) =>
    page.includes(`<${s} `) || page.includes(`<${s}/>`) || page.includes(`<${s} />`)
      ? ok(`${s} rendered`)
      : er(`${s} not rendered`)
  );
}

head("Dependency weight");
{
  // The site's whole argument is about weight. Anything that creeps back into
  // dependencies has to justify itself here.
  const pkg = JSON.parse(read("package.json") || "{}");
  const deps = Object.keys(pkg.dependencies || {});
  const ALLOWED = ["next", "react", "react-dom"];
  const extra = deps.filter((d) => !ALLOWED.includes(d));
  extra.length === 0
    ? ok(`runtime deps: ${deps.join(", ")}`)
    : wn(
        `extra runtime deps beyond next/react/react-dom: ${extra.join(", ")} — ` +
          "the colophon claims three. Update the copy or drop the dep."
      );
}

head("Instrument honesty");
{
  // The fader must never be described as network latency: it blocks the main
  // thread. If the label and the mechanism drift apart, the demo stops being
  // defensible — which is the only thing holding it up.
  const bar = read("src/components/instrument/TransportBar.tsx");
  const profile = read("src/data/profile.ts");
  /Main-thread load/i.test(bar)
    ? ok("fader is labelled as main-thread load")
    : er("fader label drifted — it must not claim to add network latency");
  /main thread/i.test(profile)
    ? ok("hero copy describes the mechanism accurately")
    : wn("profile.invitation no longer names the mechanism");
  // The echo shows the input-delay phase; pointermove has no interactionId,
  // so calling it INP would be the exact overclaim a staff reviewer catches.
  const echo = read("src/components/instrument/InputEcho.tsx");
  /input delay/i.test(echo) && !/is INP, made visible/i.test(echo)
    ? ok("input echo is labelled as input delay, not INP")
    : er("InputEcho drifted toward claiming INP");
  // Paint facts must come from buffered observers — prod hydrates before
  // first paint, so a mount-time timeline read caches fcp=null forever.
  /paintPo\.observe\(\{ type: "paint", buffered: true \}/.test(
    read("src/lib/paintFacts.ts")
  )
    ? ok("FCP is captured via a buffered observer")
    : er("paintFacts reads paint entries without a buffered observer");
}

head("Content placeholders");
{
  const prof = read("src/data/profile.ts");
  const resume = prof.match(/resumeUrl:\s*"([^"]+)"/)?.[1];
  if (resume) {
    existsSync(P("public", resume.replace(/^\//, "")))
      ? ok("resume file present at " + resume)
      : er("resume missing at public" + resume);
  }
  /vercel\.app/i.test(prof.match(/siteUrl:\s*"([^"]+)"/)?.[1] || "")
    ? wn("profile.siteUrl is still a vercel.app domain (affects OG/canonical)")
    : ok("siteUrl set to a custom domain");
  /123-456|555-|example\.com/i.test(prof)
    ? er("placeholder contact details still in profile.ts")
    : ok("contact details are real");
}

head("Font payload");
{
  const dir = P(".next/static/media");
  if (!existsSync(dir)) {
    wn("no build output — run `npm run build` to measure fonts");
  } else {
    const preloaded = readdirSync(dir).filter((f) => f.endsWith(".p.woff2"));
    const bytes = preloaded.reduce(
      (n, f) => n + statSync(join(dir, f)).size,
      0
    );
    const kb = Math.round(bytes / 1024);
    kb <= 120
      ? ok(`critical-path fonts: ${kb} kB across ${preloaded.length} file(s)`)
      : wn(`critical-path fonts up to ${kb} kB — heavier than the JS bundle`);
  }
}

head("Hygiene");
{
  const files = [];
  const walk = (d) => {
    for (const e of readdirSync(P(d), { withFileTypes: true })) {
      if (e.name === "node_modules" || e.name.startsWith(".")) continue;
      const rel = d + "/" + e.name;
      e.isDirectory() ? walk(rel) : files.push(rel);
    }
  };
  try {
    walk("src");
    const offenders = files.filter(
      (f) => /\.(t|j)sx?$/.test(f) && /console\.log\(/.test(read(f))
    );
    offenders.length === 0
      ? ok("no console.log in src")
      : offenders.forEach((o) => wn("console.log in " + o));
  } catch {}
  existsSync(P("scripts/_probe.mjs"))
    ? wn("scripts/_probe.mjs is a scratch file — delete it")
    : ok("no scratch probes left in scripts/");
}

console.log(
  "\n" +
    (fail
      ? "\x1b[31m✗ " + fail + " failing, " + warn + " warnings\x1b[0m"
      : "\x1b[32m✓ healthy\x1b[0m — " + warn + " warning(s)")
);
process.exit(fail ? 1 : 0);
