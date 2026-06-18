// Visual audit helper — body-scroll aware (this site makes <body> the scroll
// container on desktop). Triggers framer-motion whileInView reveals, then
// captures either specific selectors or stepped viewport "scrollshots".
//
// Usage:
//   node scripts/audit.mjs <url> <outPrefix> [--mobile] [--sel=#a,#b] [--steps=4]
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
const sels = flag("sel", "");
const steps = parseInt(flag("steps", "0"), 10);

const width = parseInt(flag("w", mobile ? "390" : "1440"), 10);
const height = parseInt(flag("h", mobile ? "844" : "900"), 10);

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({
  viewport: { width, height },
  deviceScaleFactor: 2,
  isMobile: mobile,
  hasTouch: mobile,
});
await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });

// Scroll through using whichever element actually scrolls.
const pageHeight = await page.evaluate(async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const docEl = document.scrollingElement || document.documentElement;
  const scroller =
    docEl.scrollHeight > docEl.clientHeight + 4 ? docEl : document.body;
  const total = Math.max(scroller.scrollHeight, document.body.scrollHeight);
  const step = window.innerHeight * 0.7;
  for (let y = 0; y <= total; y += step) {
    if (scroller.scrollTo) scroller.scrollTo(0, y);
    scroller.scrollTop = y;
    window.scrollTo(0, y);
    document.body.scrollTop = y;
    await sleep(150);
  }
  if (scroller.scrollTo) scroller.scrollTo(0, 0);
  scroller.scrollTop = 0;
  window.scrollTo(0, 0);
  document.body.scrollTop = 0;
  await sleep(450);
  return total;
});

const setScroll = (y) =>
  page.evaluate((yy) => {
    const docEl = document.scrollingElement || document.documentElement;
    const scroller =
      docEl.scrollHeight > docEl.clientHeight + 4 ? docEl : document.body;
    if (scroller.scrollTo) scroller.scrollTo(0, yy);
    scroller.scrollTop = yy;
    window.scrollTo(0, yy);
    document.body.scrollTop = yy;
  }, y);

if (sels) {
  for (const sel of sels.split(",")) {
    const el = await page.$(sel);
    if (!el) {
      console.error("missing", sel);
      continue;
    }
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    const safe = sel.replace(/[^a-z0-9]/gi, "");
    await el.screenshot({ path: `${outPrefix}_${safe}.png` });
    console.log("wrote", `${outPrefix}_${safe}.png`);
  }
} else {
  const n = steps || Math.max(2, Math.ceil(pageHeight / height));
  for (let i = 0; i < n; i++) {
    const y = Math.round((pageHeight - height) * (i / Math.max(1, n - 1)));
    await setScroll(y);
    await page.waitForTimeout(450);
    await page.screenshot({ path: `${outPrefix}_v${i}.png` });
    console.log("wrote", `${outPrefix}_v${i}.png`, "@", y);
  }
}

await browser.close();
