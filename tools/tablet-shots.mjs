#!/usr/bin/env node
// Quick tablet capture at 820 and 1024 to verify the in-between range.
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
const HOST = 'http://localhost:8765';
const OUT = path.resolve('tmp-screens/mobile-audit/tablet-after');
await fs.mkdir(OUT, { recursive: true });
const browser = await chromium.launch();
for (const vp of [{w:820,h:1180,label:'tab-820'}, {w:1024,h:768,label:'tab-1024'}]) {
  const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto(`${HOST}/index.html`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(900);
  await page.evaluate(async () => {
    const max = document.documentElement.scrollHeight;
    for (let y = 0; y < max; y += 600) { window.scrollTo(0, y); await new Promise(r=>setTimeout(r,70)); }
    window.scrollTo(0,0);
  });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(OUT, `${vp.label}_FULL.png`), fullPage: true });
  await ctx.close();
}
await browser.close();
console.log('done');
