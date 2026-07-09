// Visual verification harness for the «مِداد» HTML-in-Canvas stage.
// Requires Chrome Beta locally; not run in CI.
// Usage: URL=http://localhost:5173/ node scripts/verify-ink.mjs
import puppeteer from 'puppeteer-core';

const BETA = '/Applications/Google Chrome Beta.app/Contents/MacOS/Google Chrome Beta';
const OUT = process.env.OUT ?? '/tmp/ink';

const browser = await puppeteer.launch({
  executablePath: BETA,
  headless: true,
  args: [
    '--enable-blink-features=CanvasDrawElement',
    '--no-first-run',
    '--window-size=1200,900',
    '--user-data-dir=/tmp/ink-verify-profile',
  ],
  defaultViewport: { width: 1200, height: 900 },
});
const page = await browser.newPage();
const logs = [];
page.on('console', (m) => logs.push(`[${m.type()}] ${m.text()}`));
page.on('pageerror', (e) => logs.push(`[pageerror] ${e.message}`));

await page.goto(process.env.URL ?? 'http://localhost:5173/', { waitUntil: 'networkidle0' });
await page.evaluate(() => {
  [...document.querySelectorAll('button')].find((b) => b.textContent.includes('شكل القصيدة'))?.click();
});
await new Promise((r) => setTimeout(r, 1000));

const state1 = await page.evaluate(async () => {
  const ink = [...document.querySelectorAll('section')].find((s) => s.textContent.includes('مِداد'));
  ink?.scrollIntoView({ block: 'center' });
  await new Promise((r) => setTimeout(r, 2500)); // let fonts + snapshot + ring settle
  const canvas = ink?.querySelector('canvas');
  const verseEl = canvas?.querySelector('div');
  let pixelStats = null;
  let taint = null;
  if (canvas) {
    try {
      const probe = document.createElement('canvas');
      probe.width = canvas.width;
      probe.height = canvas.height;
      const pctx = probe.getContext('2d');
      pctx.drawImage(canvas, 0, 0);
      const d = pctx.getImageData(0, 0, probe.width, probe.height).data;
      let opaque = 0;
      for (let i = 3; i < d.length; i += 4) if (d[i] > 40) opaque++;
      pixelStats = { opaquePx: opaque, total: d.length / 4 };
      taint = 'clean';
    } catch (e) {
      taint = `tainted: ${e.name}`;
    }
  }
  const rect = verseEl?.getBoundingClientRect();
  return {
    hasCanvas: !!canvas,
    canvasSize: canvas ? [canvas.width, canvas.height] : null,
    verseRect: rect ? [Math.round(rect.width), Math.round(rect.height)] : null,
    verseVisibleText: verseEl ? getComputedStyle(verseEl).visibility : null,
    degradedNote: ink?.textContent.includes('تعذّرت قراءة') ?? false,
    unsupported: ink?.textContent.includes('متصفحك لا يدعم') ?? false,
    pixelStats,
    taint,
  };
});

const ink = await page.$('section:last-of-type canvas');
if (ink) await ink.screenshot({ path: `${OUT}-ring.png` });

// Toggle dissolve and capture mid-flight + settled
await page.evaluate(() => {
  const inkSec = [...document.querySelectorAll('section')].find((s) => s.textContent.includes('مِداد'));
  [...inkSec.querySelectorAll('button')].find((b) => /حلَّ|أعد/.test(b.textContent))?.click();
});
await new Promise((r) => setTimeout(r, 700));
if (ink) await ink.screenshot({ path: `${OUT}-mid.png` });
await new Promise((r) => setTimeout(r, 2500));
if (ink) await ink.screenshot({ path: `${OUT}-dissolved.png` });

console.log(JSON.stringify(state1, null, 2));
console.log('--- console ---');
console.log(logs.slice(-25).join('\n') || '(no messages)');
await browser.close();
