// Capture the connectors section across desktop + tablet + mobile.
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const HOST = 'http://localhost:8765';
const OUT = path.resolve('tmp-screens/probe-connectors');
await fs.mkdir(OUT, { recursive: true });

const VPS = [
  { w: 1440, h: 900, label: 'lap-1440' },
  { w: 1280, h: 800, label: 'lap-1280' },
  { w: 1024, h: 768, label: 'tab-1024' },
  { w: 390,  h: 844, label: 'mob-390'  },
];

const browser = await chromium.launch();
for (const vp of VPS) {
  const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto(`${HOST}/index.html`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await page.evaluate(() => {
    const scroller = document.querySelector('.scroller');
    const target = document.getElementById('connectors');
    if (scroller && getComputedStyle(scroller).overflowY === 'scroll') {
      scroller.scrollTo({ top: target.offsetTop, behavior: 'instant' });
    } else {
      target.scrollIntoView({ behavior: 'instant', block: 'start' });
    }
  });
  await page.waitForTimeout(700);
  await page.screenshot({ path: path.join(OUT, `${vp.label}.png`), fullPage: false });
  await ctx.close();
}
await browser.close();
console.log('done');
