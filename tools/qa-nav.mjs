// Tight crop of the top nav across the four canonical pages so we
// can eyeball that the "Benchmarks Soon" pill sits on the same
// baseline as the other links.
import { chromium } from 'playwright';
import path from 'node:path';
import fs from 'node:fs/promises';

const HOST = 'http://localhost:8765';
const OUT = path.resolve('tmp-screens/nav');
await fs.mkdir(OUT, { recursive: true });
const PAGES = ['index.html', 'get-started.html', 'pricing.html', 'enterprise.html', 'for-founders.html'];

const browser = await chromium.launch();
try {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  for (const p of PAGES) {
    await page.goto(`${HOST}/${p}`, { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(300);
    // Capture the top 80px strip
    await page.screenshot({ path: path.join(OUT, `${p.replace('.html','')}_nav.png`), clip: { x: 0, y: 0, width: 1440, height: 80 } });
    // Also dump bounding boxes of every visible nav item so we can spot drift
    const rects = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('.global-bar .local-nav > *'));
      return items.map(el => {
        const r = el.getBoundingClientRect();
        return { tag: el.tagName.toLowerCase(), cls: el.className, text: el.textContent.trim().slice(0, 24), top: Math.round(r.top), bottom: Math.round(r.bottom), height: Math.round(r.height) };
      });
    });
    console.log(p);
    for (const r of rects) console.log('  ', r);
  }
} finally {
  await browser.close();
}
