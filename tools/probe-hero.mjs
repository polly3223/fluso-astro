// Measure the vertical gap between the hero product image and the
// "Works with" row on index.html across a few viewports.
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const HOST = 'http://localhost:8765';
const OUT = path.resolve('tmp-screens/probe-hero');
await fs.mkdir(OUT, { recursive: true });

const VPS = [
  { w: 1440, h: 900, label: 'lap-1440' },
  { w: 1280, h: 800, label: 'lap-1280' },
  { w: 1024, h: 768, label: 'tab-1024' },
];

const browser = await chromium.launch();
for (const vp of VPS) {
  const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto(`${HOST}/index.html`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1400);
  const m = await page.evaluate(() => {
    const img = document.querySelector('#hero .hero-product');
    const works = document.querySelector('#hero .hero-integrations');
    const imgRect = img ? img.getBoundingClientRect() : null;
    const wRect = works ? works.getBoundingClientRect() : null;
    return { imgRect, wRect, gap: imgRect && wRect ? wRect.top - imgRect.bottom : null };
  });
  console.log(`${vp.label} (${vp.w}x${vp.h}) — gap=${m.gap?.toFixed?.(1)}  img.bottom=${m.imgRect?.bottom?.toFixed?.(1)}  works.top=${m.wRect?.top?.toFixed?.(1)}`);
  await page.screenshot({ path: path.join(OUT, `${vp.label}_FULL.png`), fullPage: false });
  await ctx.close();
}
await browser.close();
