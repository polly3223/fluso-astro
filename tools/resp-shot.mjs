#!/usr/bin/env node
// Screenshot helper: capture key pages at multiple viewports and a full-page render.
// Usage: node tools/resp-shot.mjs [pageFile ...]
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const HOST = 'http://localhost:8765';
const OUT = path.resolve('tmp-screens/resp');
await fs.mkdir(OUT, { recursive: true });

const ALL_PAGES = [
  'index.html',
  'index.html',
  'for-consultants.html',
  'for-founders.html',
  'for-doctors.html',
  'for-investors.html',
  'for-lawyers.html',
  'for-marketers.html',
  'for-operations.html',
  'for-researchers.html',
  'for-sales.html',
  'pricing.html',
  'get-started.html',
  'benchmarks.html',
];

const VIEWPORTS = [
  { w: 360, h: 800, label: 'mob-360' },
  { w: 375, h: 812, label: 'mob-375' },
  { w: 414, h: 896, label: 'mob-414' },
  { w: 768, h: 1024, label: 'tab-768' },
  { w: 1024, h: 768, label: 'tab-1024' },
  { w: 1280, h: 800, label: 'lap-1280' },
  { w: 1440, h: 900, label: 'lap-1440' },
];

const pages = process.argv.slice(2).length ? process.argv.slice(2) : ALL_PAGES;

const browser = await chromium.launch();
try {
  for (const page of pages) {
    for (const vp of VIEWPORTS) {
      const context = await browser.newContext({
        viewport: { width: vp.w, height: vp.h },
        deviceScaleFactor: 2,
      });
      const tab = await context.newPage();
      try {
        await tab.goto(`${HOST}/${page}`, { waitUntil: 'networkidle', timeout: 15000 });
      } catch (e) {
        await tab.goto(`${HOST}/${page}`, { waitUntil: 'domcontentloaded', timeout: 10000 });
      }
      // Pre-scroll the page to trigger any IntersectionObservers before screenshotting
      await tab.evaluate(async () => {
        const scroller = document.querySelector('.scroller');
        const target = scroller && getComputedStyle(scroller).overflowY === 'scroll' ? scroller : window;
        const h = (target === window) ? document.documentElement.scrollHeight : scroller.scrollHeight;
        const step = Math.max(200, window.innerHeight * 0.85);
        for (let y = 0; y < h; y += step) {
          if (target === window) window.scrollTo(0, y);
          else target.scrollTop = y;
          await new Promise(r => setTimeout(r, 60));
        }
        if (target === window) window.scrollTo(0, 0);
        else target.scrollTop = 0;
        await new Promise(r => setTimeout(r, 60));
      });
      await tab.waitForTimeout(2400);
      const overflow = await tab.evaluate(() => {
        return {
          vw: window.innerWidth,
          dw: document.documentElement.scrollWidth,
          bw: document.body.scrollWidth,
        };
      });
      const baseName = page.replace(/\.html$/, '');
      const top = path.join(OUT, `${baseName}_${vp.label}_top.png`);
      await tab.screenshot({ path: top, fullPage: false });
      const full = path.join(OUT, `${baseName}_${vp.label}_full.png`);
      await tab.screenshot({ path: full, fullPage: true });
      console.log(`${page.padEnd(28)} ${vp.label.padEnd(9)} vw=${overflow.vw} dW=${overflow.dw} bW=${overflow.bw}${overflow.dw > overflow.vw ? '  *** OVERFLOW' : ''}`);
      await context.close();
    }
  }
} finally {
  await browser.close();
}
