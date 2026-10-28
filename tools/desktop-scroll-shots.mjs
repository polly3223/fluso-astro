#!/usr/bin/env node
// Capture per-section desktop screenshots by scrolling the inner .scroller.
// Usage: node tools/desktop-scroll-shots.mjs <tag>
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const HOST = 'http://localhost:8765';
const TAG = process.argv[2] || 'desktop-after';
const OUT = path.resolve(`tmp-screens/mobile-audit/${TAG}`);
await fs.mkdir(OUT, { recursive: true });

const VIEWPORTS = [
  { w: 1440, h: 900, label: 'lap-1440' },
  { w: 1280, h: 800, label: 'lap-1280' },
];
const SECTIONS = ['#hero', '#how-it-works', '#capabilities', '#connectors', '#privacy', '#faq'];

const browser = await chromium.launch();
try {
  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({
      viewport: { width: vp.w, height: vp.h },
      deviceScaleFactor: 1,
    });
    const page = await ctx.newPage();
    await page.goto(`${HOST}/index.html`, { waitUntil: 'networkidle', timeout: 20000 });
    await page.waitForTimeout(900);

    for (const sec of SECTIONS) {
      await page.evaluate((sel) => {
        const scroller = document.querySelector('.scroller');
        const el = document.querySelector(sel);
        if (!el || !scroller) return;
        scroller.scrollTo({ top: el.offsetTop, behavior: 'instant' });
      }, sec);
      await page.waitForTimeout(450);
      await page.screenshot({ path: path.join(OUT, `${vp.label}_${sec.replace('#','')}.png`), fullPage: false });
    }
    await ctx.close();
  }
} finally {
  await browser.close();
}
console.log(`Wrote ${OUT}`);
