// Render a book chapter (hand-paginated HTML) to PDF and audit it: page
// count, no overflowing leaves, fonts loaded, figures populated.
// Requires Chrome Beta locally; not run in CI.
// Usage: node scripts/render-chapter.mjs            (chapter I, default)
//        CH=docs/x.html OUT=docs/x.pdf SHOTS=1,7 node scripts/render-chapter.mjs
import puppeteer from 'puppeteer-core';

const BETA = '/Applications/Google Chrome Beta.app/Contents/MacOS/Google Chrome Beta';
const ROOT = '/Users/mohammedabdallah/Projects/khalil';
const SRC = `file://${ROOT}/${process.env.CH ?? 'docs/group-theory-chapter.html'}`;
const OUT = `${ROOT}/${process.env.OUT ?? 'docs/the-turn-that-changes-nothing.pdf'}`;

const browser = await puppeteer.launch({
  executablePath: BETA,
  headless: true,
  args: ['--no-first-run', '--user-data-dir=/tmp/book-profile'],
  defaultViewport: { width: 700, height: 1000, deviceScaleFactor: 2 },
});
const page = await browser.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
await page.goto(SRC, { waitUntil: 'networkidle0' });
await page.evaluate(() => document.fonts.ready);
await new Promise((r) => setTimeout(r, 400));

const audit = await page.evaluate(() => {
  const pages = [...document.querySelectorAll('.page')];
  const overflow = pages
    .map((p, i) => {
      // measure real content extent inside the fixed leaf
      let maxBottom = 0;
      for (const child of p.querySelectorAll('*')) {
        const r = child.getBoundingClientRect();
        const pr = p.getBoundingClientRect();
        if (r.bottom - pr.top > maxBottom) maxBottom = r.bottom - pr.top;
      }
      return { page: i + 1, contentBottom: Math.round(maxBottom), leaf: Math.round(p.getBoundingClientRect().height) };
    })
    .filter((x) => x.contentBottom > x.leaf + 1);
  const rings = document.querySelectorAll('svg[data-ring]');
  const emptyRings = [...rings].filter((s) => !s.querySelector('circle')).length;
  const figs = ['fig-fan', 'fig-compose', 'fig-clock', 'fig-roll', 'fig-collapse', 'fig-catalog']
    .map((id) => ({ id, children: document.getElementById(id)?.children.length ?? -1 }));
  return { pageCount: pages.length, overflow, ringCount: rings.length, emptyRings, figs };
});
console.log(JSON.stringify(audit, null, 1));
if (errors.length) console.log('PAGE ERRORS:', errors);

await page.pdf({
  path: OUT,
  width: '6in',
  height: '9in',
  printBackground: true,
  margin: { top: 0, bottom: 0, left: 0, right: 0 },
});
console.log('pdf written:', OUT);

// per-page screenshots for visual review
const shots = process.env.SHOTS ? process.env.SHOTS.split(',').map(Number) : [];
for (const n of shots) {
  const handle = (await page.$$('.page'))[n - 1];
  if (handle) await handle.screenshot({ path: `/tmp/book-p${n}.png` });
}
if (shots.length) console.log('shots:', shots.join(','));
await browser.close();
