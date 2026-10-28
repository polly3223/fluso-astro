// Same as probe-top-padding but at 390x844 mobile
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
const HOST = 'http://localhost:8765';
const OUT = path.resolve('tmp-screens/probe-top-mob');
await fs.mkdir(OUT, { recursive: true });
const PAGES = ['index.html','pricing.html','enterprise.html','get-started.html','for-founders.html','for-doctors.html'];
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
console.log('page'.padEnd(28), 'bar.bot', 'first.top', 'gap');
for (const p of PAGES) {
  try { await page.goto(`${HOST}/${p}`, { waitUntil: 'networkidle', timeout: 12000 }); } catch (e) { console.log(p, 'ERR'); continue; }
  await page.waitForTimeout(700);
  const m = await page.evaluate(() => {
    const bar = document.querySelector('.global-bar');
    const card = document.querySelector('.scroller .main-card') || document.querySelector('.main-card');
    return { bar: bar?.getBoundingClientRect()?.bottom, top: card?.getBoundingClientRect()?.top };
  });
  console.log(`${p.padEnd(28)} ${String(m.bar?.toFixed(1)).padStart(7)} ${String(m.top?.toFixed(1)).padStart(9)} ${(m.top!=null&&m.bar!=null?(m.top-m.bar).toFixed(1):'').padStart(7)}`);
  await page.screenshot({ path: path.join(OUT, `${p.replace('.html','')}_mob.png`), fullPage: false });
}
await ctx.close();
await browser.close();
