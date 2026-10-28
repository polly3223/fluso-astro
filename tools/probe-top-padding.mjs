// Measure top-of-page gap for index.html vs nav pages.
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const HOST = 'http://localhost:8765';
const OUT = path.resolve('tmp-screens/probe-top');
await fs.mkdir(OUT, { recursive: true });

const PAGES = [
  'index.html',
  'pricing.html',
  'enterprise.html',
  'get-started.html',
  'for-founders.html',
  'for-doctors.html',
  'for-marketers.html',
  'for-investors.html',
  'for-sales.html',
];

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();

console.log('page'.padEnd(28), 'bar.bot', 'first.top', 'gap', 'firstSel');
for (const p of PAGES) {
  try {
    await page.goto(`${HOST}/${p}`, { waitUntil: 'networkidle', timeout: 12000 });
  } catch (e) {
    console.log(`${p.padEnd(28)} ERROR ${e.message.slice(0,80)}`);
    continue;
  }
  await page.waitForTimeout(700);
  const m = await page.evaluate(() => {
    const bar = document.querySelector('.global-bar');
    // Locate the first visible "card" / hero
    const candidates = [
      '.scroller .main-card',
      '.main-card',
      'main',
      'section#hero',
      'header',
    ];
    let first = null;
    for (const sel of candidates) {
      const el = document.querySelector(sel);
      if (el) { first = { sel, rect: el.getBoundingClientRect() }; break; }
    }
    return {
      barRect: bar ? bar.getBoundingClientRect() : null,
      first,
    };
  });
  const barBot = m.barRect ? m.barRect.bottom : null;
  const firstTop = m.first ? m.first.rect.top : null;
  const gap = (barBot != null && firstTop != null) ? (firstTop - barBot) : null;
  console.log(`${p.padEnd(28)} ${String(barBot?.toFixed(1)).padStart(7)} ${String(firstTop?.toFixed(1)).padStart(9)} ${String(gap?.toFixed(1)).padStart(7)} ${m.first?.sel||''}`);
  await page.screenshot({ path: path.join(OUT, `${p.replace('.html','')}_top.png`), fullPage: false });
}
await ctx.close();
await browser.close();
