// One-shot project health + integrity check.  Run: npm run status
import { existsSync, readFileSync, readdirSync } from "node:fs";
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
existsSync(P("node_modules")) ? ok("node_modules present") : er("run `npm install`");

head("Type check");
try {
  execSync("npx tsc --noEmit", { cwd: ROOT, stdio: "pipe" });
  ok("tsc --noEmit clean");
} catch (e) {
  er("tsc errors:\n" + (e.stdout?.toString() || e.message).split("\n").slice(0, 12).join("\n"));
}

head("Routes & key files");
[
  "src/app/page.tsx",
  "src/app/layout.tsx",
  "src/app/globals.css",
  "public/og.png",
  "src/data/profile.ts",
  "src/data/about.ts",
].forEach((f) => (existsSync(P(f)) ? ok(f) : er("missing " + f)));

head("Sections wired in page.tsx");
{
  const page = read("src/app/page.tsx");
  ["About", "Experience", "Skills", "Contact"].forEach((s) =>
    page.includes(`<${s} `) ? ok(`${s} rendered`) : er(`${s} not rendered`)
  );
}

head("Owner placeholders (swap before launch)");
{
  const prof = read("src/data/profile.ts");
  const resumeMatch = prof.match(/resumeUrl:\s*"([^"]+)"/);
  const resume = resumeMatch ? resumeMatch[1] : null;
  if (resume) {
    existsSync(P("public", resume.replace(/^\//, "")))
      ? ok("resume file present at " + resume)
      : wn("resume file missing at public" + resume + " (drop the real PDF)");
  }
  /linkedin\.com\/in\/jordan-urbaez-lu/i.test(prof)
    ? wn("profile.socials.linkedin still the PLACEHOLDER — set the real URL")
    : ok("LinkedIn URL customized");
  /vercel\.app/i.test(prof.match(/siteUrl:\s*"([^"]+)"/)?.[1] || "")
    ? wn("profile.siteUrl still a placeholder domain (affects OG/canonical)")
    : ok("siteUrl set to a custom domain");
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
    const offenders = files.filter((f) => /\.(t|j)sx?$/.test(f) && /console\.log\(/.test(read(f)));
    offenders.length === 0
      ? ok("no console.log in src")
      : offenders.forEach((o) => wn("console.log in " + o));
  } catch {}
}

console.log(
  "\n" +
    (fail
      ? "\x1b[31m✗ " + fail + " failing, " + warn + " warnings\x1b[0m"
      : "\x1b[32m✓ healthy\x1b[0m — " + warn + " warning(s)")
);
process.exit(fail ? 1 : 0);
