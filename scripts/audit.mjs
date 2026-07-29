// Visual audit helper.
//
// The document scrolls normally now (the old body-scroll model is gone), so
// this just drives window scroll. It force-disables `scroll-behavior: smooth`
// first — otherwise every programmatic scroll animates and the screenshot
// lands mid-flight.
//
// Usage:
//   node scripts/audit.mjs <url> <outPrefix> [--mobile] [--sel=#a,#b] [--steps=4]
//                          [--latency=1200] [--reduced]
import { chromium } from "playwright-core";

const args = process.argv.slice(2);
const url = args[0];
const outPrefix = args[1] || "/tmp/audit";
const flag = (k, d) => {
  const a = args.find((x) => x.startsWith(`--${k}=`));
  return a ? a.split("=")[1] : d;
};
const has = (k) => args.includes(`--${k}`);
const mobile = has("mobile");
const reduced = has("reduced");
const sels = flag("sel", "");
const steps = parseInt(flag("steps", "0"), 10);
/** Drive the latency fader to this value before shooting. */
const latency = parseInt(flag("latency", "0"), 10);

const width = parseInt(flag("w", mobile ? "390" : "1440"), 10);
const height = parseInt(flag("h", mobile ? "844" : "900"), 10);

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({
  viewport: { width, height },
  deviceScaleFactor: 2,
  isMobile: mobile,
  hasTouch: mobile,
  reducedMotion: reduced ? "reduce" : "no-preference",
});

// Kill smooth scrolling before any script runs.
await page.addStyleTag({
  content: "html{scroll-behavior:auto !important}",
}).catch(() => {});

await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
await page.addStyleTag({ content: "html{scroll-behavior:auto !important}" });

// Let the observers report and the fonts settle.
await page.waitForTimeout(1200);

if (latency > 0) {
  await page.evaluate(async (value) => {
    const input = document.getElementById("latency-fader");
    if (!input) return;
    const setter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value"
    ).set;
    setter.call(input, String(value));
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
  }, latency);
  await page.waitForTimeout(1500);
}

const pageHeight = await page.evaluate(
  () => document.documentElement.scrollHeight
);

const setScroll = (y) =>
  page.evaluate((yy) => window.scrollTo({ top: yy, behavior: "instant" }), y);

if (sels) {
  for (const sel of sels.split(",")) {
    const el = await page.$(sel);
    if (!el) {
      console.error("missing", sel);
      continue;
    }
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    const safe = sel.replace(/[^a-z0-9]/gi, "");
    await el.screenshot({ path: `${outPrefix}_${safe}.png` });
    console.log("wrote", `${outPrefix}_${safe}.png`);
  }
} else {
  const n = steps || Math.max(2, Math.ceil(pageHeight / height));
  for (let i = 0; i < n; i++) {
    const y = Math.round((pageHeight - height) * (i / Math.max(1, n - 1)));
    await setScroll(y);
    await page.waitForTimeout(350);
    await page.screenshot({ path: `${outPrefix}_v${i}.png` });
    console.log("wrote", `${outPrefix}_v${i}.png`, "@", y);
  }
}

await browser.close();
