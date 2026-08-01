import puppeteer from 'puppeteer-core';
const CH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const OUT = process.env.OUT ?? '/tmp/ros';
const URL = process.env.URL ?? 'http://localhost:5173/';
const DSF = Number(process.env.DSF ?? 2);
const browser = await puppeteer.launch({
  executablePath: CH, headless: true,
  args: ['--no-first-run', '--user-data-dir=/tmp/ros-prof', '--force-color-profile=srgb'],
  defaultViewport: { width: 1440, height: 1100, deviceScaleFactor: DSF },
});
const page = await browser.newPage();
const errs = [];
page.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
await page.goto(URL, { waitUntil: 'networkidle0' });
await new Promise((r) => setTimeout(r, 4200));
const cards = await page.$$('#tour-cards [role="button"]');
console.log('cards:', cards.length);
for (let i = 0; i < cards.length; i++) await cards[i].screenshot({ path: `${OUT}-card${i + 1}.png` });
const grid = await page.$('#tour-cards');
if (grid) await grid.screenshot({ path: `${OUT}-grid.png` });
const stats = await page.evaluate(() => {
  const svgs = [...document.querySelectorAll('#tour-cards svg')];
  const all = svgs.flatMap((s) => [...s.querySelectorAll('*')]);
  const A = document.getAnimations();
  return {
    svgNodes: all.length,
    uses: all.filter((e) => e.tagName === 'use').length,
    paths: all.filter((e) => e.tagName === 'path').length,
    filters: all.filter((e) => e.tagName === 'filter').length,
    running: A.filter((a) => a.playState === 'running').length,
    infinite: A.filter((a) => a.effect && a.effect.getTiming().iterations === Infinity).length,
  };
});
console.log(JSON.stringify(stats));
const frames = await page.evaluate(() => new Promise((res) => {
  const ts = []; let last = performance.now();
  const tick = (now) => { ts.push(now - last); last = now;
    if (ts.length < 180) requestAnimationFrame(tick); else res(ts.slice(5)); };
  requestAnimationFrame(tick);
}));
frames.sort((a, b) => a - b);
const q = (p) => frames[Math.floor(frames.length * p)].toFixed(2);
console.log(`idle n=${frames.length} median=${q(0.5)} p95=${q(0.95)} max=${frames[frames.length-1].toFixed(2)} over20=${frames.filter(f=>f>20).length}`);
if (errs.length) console.log('ERRORS:\n' + errs.join('\n'));
await browser.close();
