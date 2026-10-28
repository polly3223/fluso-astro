// Targeted QA for the post-edit home page and get-started.html.
// Captures each major section at desktop/tablet/mobile and checks the
// Industries dropdown hover-persist behaviour.
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const HOST = 'http://localhost:8765';
const OUT = path.resolve('tmp-screens/qa');
await fs.mkdir(OUT, { recursive: true });

const VIEWPORTS = [
  { name: 'desktop', w: 1440, h: 900 },
  { name: 'tablet',  w: 768,  h: 1024 },
  { name: 'mobile',  w: 390,  h: 844 },
];

const SECTIONS = ['#hero', '#how-it-works', '#capabilities', '#connectors', '#privacy', '#faq'];

async function scrollTo(page, selector) {
  await page.evaluate((sel) => {
    const scroller = document.querySelector('.scroller');
    const target = document.querySelector(sel);
    if (!target) return;
    // Try the inner scroller first; fall back to scrollIntoView.
    if (scroller && getComputedStyle(scroller).overflowY === 'scroll') {
      scroller.scrollTo({ top: target.offsetTop, behavior: 'instant' });
    } else {
      target.scrollIntoView({ behavior: 'instant', block: 'start' });
    }
  }, selector);
  await page.waitForTimeout(450);
}

const browser = await chromium.launch();
const issues = [];
try {
  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h } });
    const page = await ctx.newPage();

    page.on('pageerror', e => issues.push(`[${vp.name}] pageerror: ${e.message}`));
    page.on('console', m => { if (m.type() === 'error') issues.push(`[${vp.name}] console error: ${m.text()}`); });

    // ── index.html ─────────────────────────────────────────────
    await page.goto(`${HOST}/index.html`, { waitUntil: 'networkidle', timeout: 20000 });
    await page.waitForTimeout(900);

    for (const sec of SECTIONS) {
      await scrollTo(page, sec);
      const file = path.join(OUT, `ev2_${vp.name}_${sec.replace('#','')}.png`);
      await page.screenshot({ path: file, fullPage: false });
    }

    // Industries dropdown — desktop only
    if (vp.name === 'desktop') {
      // Reset to top
      await page.evaluate(() => {
        const s = document.querySelector('.scroller');
        if (s) s.scrollTop = 0; else window.scrollTo(0,0);
      });
      await page.waitForTimeout(200);

      const trigger = page.locator('.nav-dropdown-trigger').first();
      const menu = page.locator('.nav-dropdown-menu').first();

      // Hover the trigger
      await trigger.hover();
      await page.waitForTimeout(250);
      const menuVisible1 = await menu.evaluate(el => {
        const cs = getComputedStyle(el);
        return cs.opacity === '1' && cs.visibility === 'visible';
      });
      if (!menuVisible1) issues.push(`[${vp.name}] menu did not open on trigger hover`);

      // Snapshot the open menu
      await page.screenshot({ path: path.join(OUT, `ev2_${vp.name}_dropdown_hovered.png`), fullPage: false });

      // Move the cursor straight down through the 14px gap
      const trigBox = await trigger.boundingBox();
      const menuBox = await menu.boundingBox();
      if (trigBox && menuBox) {
        // Slide through the gap mid-x
        const midX = trigBox.x + trigBox.width / 2;
        for (let y = trigBox.y + trigBox.height + 2; y < menuBox.y + 4; y += 2) {
          await page.mouse.move(midX, y);
          await page.waitForTimeout(20);
        }
        // Land on first menu item
        const firstItem = page.locator('.nav-dropdown-menu a').first();
        const itemBox = await firstItem.boundingBox();
        if (itemBox) await page.mouse.move(itemBox.x + itemBox.width / 2, itemBox.y + itemBox.height / 2);
        await page.waitForTimeout(250);

        const menuVisible2 = await menu.evaluate(el => {
          const cs = getComputedStyle(el);
          return cs.opacity === '1' && cs.visibility === 'visible';
        });
        if (!menuVisible2) issues.push(`[${vp.name}] menu closed while crossing the gap — hover-persist broken`);
        await page.screenshot({ path: path.join(OUT, `ev2_${vp.name}_dropdown_on_item.png`), fullPage: false });
      }
    }

    // ── get-started.html ───────────────────────────────────────────────
    await page.goto(`${HOST}/get-started.html`, { waitUntil: 'networkidle', timeout: 20000 });
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(OUT, `gs_${vp.name}_top.png`), fullPage: false });
    // Scroll to the form
    await scrollTo(page, '#beta-form');
    await page.screenshot({ path: path.join(OUT, `gs_${vp.name}_form.png`), fullPage: false });

    // Overflow check
    const overflow = await page.evaluate(() => ({
      vw: window.innerWidth,
      dw: document.documentElement.scrollWidth,
    }));
    if (overflow.dw > overflow.vw + 1) issues.push(`[${vp.name}] horizontal overflow on get-started: ${overflow.dw} > ${overflow.vw}`);

    await ctx.close();
  }
} finally {
  await browser.close();
}

if (issues.length) {
  console.log('ISSUES:');
  for (const i of issues) console.log(' -', i);
  process.exit(1);
} else {
  console.log('All checks passed.');
}
