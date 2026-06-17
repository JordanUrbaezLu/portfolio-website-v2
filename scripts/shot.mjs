// Screenshot helper for visual verification.
// Usage:
//   node scripts/shot.mjs <url> <out.png> [--w=1440] [--h=900] [--full] [--sel=#projects] [--mobile]
// Drives system Chrome via playwright-core; scrolls the page to trigger
// framer-motion whileInView reveals, then captures.
import { chromium } from "playwright-core";

const args = process.argv.slice(2);
const url = args[0] || "http://localhost:3111/";
const out = args[1] || "/tmp/shot.png";
const getFlag = (k, d) => {
  const a = args.find((x) => x.startsWith(`--${k}=`));
  return a ? a.split("=")[1] : d;
};
const has = (k) => args.includes(`--${k}`);

const mobile = has("mobile");
const width = parseInt(getFlag("w", mobile ? "390" : "1440"), 10);
const height = parseInt(getFlag("h", mobile ? "844" : "900"), 10);
const sel = getFlag("sel", null);
const full = has("full");

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({
  viewport: { width, height },
  deviceScaleFactor: 2,
  isMobile: mobile,
  hasTouch: mobile,
});
await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });

// Scroll through to trigger reveals, then settle back.
await page.evaluate(async () => {
  const sc = document.scrollingElement || document.body;
  const step = window.innerHeight * 0.8;
  for (let y = 0; y <= sc.scrollHeight; y += step) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 120));
  }
  window.scrollTo(0, 0);
  await new Promise((r) => setTimeout(r, 400));
});

await page.waitForTimeout(700);

if (sel) {
  const el = await page.$(sel);
  if (el) {
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(700);
    await el.screenshot({ path: out });
  } else {
    console.error(`selector ${sel} not found; full-page instead`);
    await page.screenshot({ path: out, fullPage: true });
  }
} else {
  await page.screenshot({ path: out, fullPage: full });
}

await browser.close();
console.log("wrote", out);
