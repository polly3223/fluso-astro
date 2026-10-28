#!/usr/bin/env node
// Mobile responsive audit for index.html.
// - Captures full-page screenshots at mobile widths.
// - Captures per-section screenshots.
// - Reports horizontal overflow and per-section overflow on each viewport.
// Usage: node tools/mobile-audit.mjs [tag]
//   tag — subdir name under tmp-screens/mobile-audit/ (default: mobile-before)
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const HOST = 'http://localhost:8765';
const TAG = process.argv[2] || 'mobile-before';
const PAGE = 'index.html';
const OUT = path.resolve(`tmp-screens/mobile-audit/${TAG}`);
await fs.mkdir(OUT, { recursive: true });

const VIEWPORTS = TAG.startsWith('desktop')
  ? [
      { w: 1440, h: 900, label: 'lap-1440' },
      { w: 1280, h: 800, label: 'lap-1280' },
    ]
  : [
      { w: 360, h: 800, label: 'mob-360' },
      { w: 375, h: 812, label: 'mob-375' },
      { w: 390, h: 844, label: 'mob-390' },
      { w: 414, h: 896, label: 'mob-414' },
      { w: 768, h: 1024, label: 'tab-768' },
    ];

const SECTIONS = ['#hero', '#how-it-works', '#capabilities', '#connectors', '#privacy', '#faq'];

const browser = await chromium.launch();
const report = { tag: TAG, viewports: [] };
try {
  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({
      viewport: { width: vp.w, height: vp.h },
      deviceScaleFactor: 2,
    });
    const page = await ctx.newPage();
    const errs = [];
    page.on('pageerror', e => errs.push(`pageerror: ${e.message}`));
    page.on('console', m => { if (m.type() === 'error') errs.push(`console: ${m.text()}`); });

    await page.goto(`${HOST}/${PAGE}`, { waitUntil: 'networkidle', timeout: 20000 });
    await page.waitForTimeout(800);

    // Pre-scroll to trigger lazy/observers
    await page.evaluate(async () => {
      const scroller = document.querySelector('.scroller');
      const useScroller = scroller && getComputedStyle(scroller).overflowY === 'scroll';
      const max = useScroller ? scroller.scrollHeight : document.documentElement.scrollHeight;
      const step = Math.max(200, window.innerHeight * 0.85);
      for (let y = 0; y < max; y += step) {
        if (useScroller) scroller.scrollTop = y; else window.scrollTo(0, y);
        await new Promise(r => setTimeout(r, 60));
      }
      if (useScroller) scroller.scrollTop = 0; else window.scrollTo(0, 0);
      await new Promise(r => setTimeout(r, 80));
    });
    await page.waitForTimeout(700);

    // Overflow probe
    const probe = await page.evaluate(() => {
      const out = { vw: window.innerWidth, dW: document.documentElement.scrollWidth, bW: document.body.scrollWidth, offenders: [] };
      const all = document.querySelectorAll('body *');
      for (const el of all) {
        const r = el.getBoundingClientRect();
        if (r.right > window.innerWidth + 1 && r.width > 8 && r.width < 4000) {
          out.offenders.push({
            tag: el.tagName.toLowerCase(),
            cls: (el.className && typeof el.className === 'string' ? el.className.slice(0, 80) : ''),
            id: el.id || '',
            right: Math.round(r.right),
            width: Math.round(r.width),
          });
        }
      }
      out.offenders = out.offenders.slice(0, 25);
      return out;
    });

    // Per-section sizing & overlap check
    const sectionInfo = await page.evaluate((sels) => {
      const scroller = document.querySelector('.scroller');
      const useScroller = scroller && getComputedStyle(scroller).overflowY === 'scroll';
      const root = useScroller ? scroller : document.documentElement;
      const list = [];
      for (const sel of sels) {
        const el = document.querySelector(sel);
        if (!el) { list.push({ sel, missing: true }); continue; }
        const r = el.getBoundingClientRect();
        list.push({
          sel,
          top: Math.round(r.top + (useScroller ? scroller.scrollTop : window.scrollY)),
          height: Math.round(r.height),
          width: Math.round(r.width),
          right: Math.round(r.right),
        });
      }
      return { list, useScroller };
    }, SECTIONS);

    // Full-page screenshot for visual review
    const full = path.join(OUT, `${vp.label}_FULL.png`);
    await page.screenshot({ path: full, fullPage: true });

    // Per-section screenshots
    for (const sec of SECTIONS) {
      const exists = await page.locator(sec).count();
      if (!exists) continue;
      const handle = page.locator(sec);
      try {
        await handle.scrollIntoViewIfNeeded({ timeout: 5000 });
      } catch {}
      await page.waitForTimeout(250);
      try {
        await handle.screenshot({ path: path.join(OUT, `${vp.label}_${sec.replace('#','')}.png`) });
      } catch (e) {
        // fallback to viewport screenshot
        await page.screenshot({ path: path.join(OUT, `${vp.label}_${sec.replace('#','')}_VP.png`) });
      }
    }

    report.viewports.push({
      label: vp.label, vw: vp.w, vh: vp.h,
      docWidth: probe.dW, bodyWidth: probe.bW,
      hasOverflow: probe.dW > probe.vw + 1,
      offenders: probe.offenders,
      sections: sectionInfo.list,
      errs,
    });
    await ctx.close();
  }
} finally {
  await browser.close();
}

await fs.writeFile(path.join(OUT, '_report.json'), JSON.stringify(report, null, 2));
console.log(`Wrote ${OUT}`);
for (const v of report.viewports) {
  const flag = v.hasOverflow ? ' ** OVERFLOW' : '';
  console.log(`${v.label.padEnd(10)} vw=${v.vw} dW=${v.docWidth}${flag} errs=${v.errs.length} offenders=${v.offenders.length}`);
  if (v.offenders.length) {
    for (const o of v.offenders.slice(0, 5)) {
      console.log(`   off: <${o.tag} ${o.id ? '#'+o.id : ''} .${o.cls}> right=${o.right} w=${o.width}`);
    }
  }
}
