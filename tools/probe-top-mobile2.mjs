// Mobile: measure scroller top AND main-card top
import { chromium } from 'playwright';
const HOST = 'http://localhost:8765';
const PAGES = ['index.html','pricing.html','enterprise.html','get-started.html','for-founders.html','for-doctors.html'];
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
console.log('page'.padEnd(28),'bar.bot','scroller.top','card.top','header.top');
for (const p of PAGES) {
  await page.goto(`${HOST}/${p}`, { waitUntil: 'networkidle', timeout: 12000 });
  await page.waitForTimeout(700);
  const m = await page.evaluate(() => {
    const bar = document.querySelector('.global-bar');
    const scroller = document.querySelector('.scroller');
    const card = document.querySelector('.scroller .main-card') || document.querySelector('.main-card');
    const header = document.querySelector('.scroller h1, .scroller .title, .scroller [class*="title"]') || document.querySelector('h1');
    const r = (e) => e ? e.getBoundingClientRect() : null;
    return {
      bar: r(bar)?.bottom,
      scroller: r(scroller)?.top,
      card: r(card)?.top,
      header: r(header)?.top,
    };
  });
  const fmt = (x) => String(x?.toFixed?.(1) ?? '-').padStart(7);
  console.log(`${p.padEnd(28)}${fmt(m.bar)} ${fmt(m.scroller)} ${fmt(m.card)} ${fmt(m.header)}`);
}
await ctx.close();
await browser.close();
