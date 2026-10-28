// Playwright check for enterprise.html
// - Boots a local static server, opens the page at desktop / laptop / tablet / mobile
// - Captures hero + capabilities screenshots per viewport
// - Reports console errors, failed requests, 4xx/5xx responses, and canvas paint ratio
// - Exits non-zero if anything fails
//
// Run with `playwright` already installed (e.g. via `npm i playwright` somewhere):
//   node tools/check-enterprise.mjs
//
// If `playwright` is installed in a different location, copy this file next to the
// install or pass NODE_PATH appropriately — ESM resolves `playwright` from disk.

import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';

const ROOT = new URL('..', import.meta.url).pathname;
const PORT = 8765;
const URL_ENTERPRISE = `http://localhost:${PORT}/enterprise.html`;
const OUT = `${ROOT}/tmp-screens`;
if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

const server = spawn('python3', ['-m', 'http.server', String(PORT)], { cwd: ROOT, stdio: 'pipe' });
await new Promise(r => setTimeout(r, 800));

const VIEWPORTS = [
  { name: 'desktop', w: 1440, h: 900  },
  { name: 'laptop',  w: 1280, h: 800  },
  { name: 'tablet',  w: 1024, h: 1366 },
  { name: 'mobile',  w: 390,  h: 844  },
];

let exitCode = 0;
const summary = [];

const browser = await chromium.launch();
try {
  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h } });
    const page = await ctx.newPage();

    const consoleErrors = [];
    const requestFails = [];
    const badResponses = [];
    page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
    page.on('pageerror', e => consoleErrors.push('pageerror: ' + e.message));
    page.on('requestfailed', r => requestFails.push(`${r.url()} :: ${r.failure()?.errorText || 'failed'}`));
    page.on('response', r => { if (r.status() >= 400) badResponses.push(`${r.status()} ${r.url()}`); });

    await page.goto(URL_ENTERPRISE, { waitUntil: 'networkidle', timeout: 20000 });
    await page.waitForTimeout(700);

    const heroShot = `${OUT}/enterprise-${vp.name}-hero.png`;
    await page.screenshot({ path: heroShot, fullPage: true });

    const isMobile = vp.w <= 1024;
    await page.evaluate((mobile) => {
      const scroller = document.querySelector('.scroller');
      const target = document.querySelector('#capabilities');
      if (!target) return;
      if (mobile) target.scrollIntoView({ behavior: 'instant', block: 'start' });
      else scroller.scrollTo({ top: target.offsetTop, behavior: 'instant' });
    }, isMobile);
    await page.waitForTimeout(400);
    const capsShot = `${OUT}/enterprise-${vp.name}-caps.png`;
    await page.screenshot({ path: capsShot, fullPage: true });

    const checks = await page.evaluate(() => {
      const out = {};
      const heroTitle = document.querySelector('#hero .title');
      const capTitle = document.querySelector('#capabilities .title');
      const canvas = document.querySelector('#contours-canvas');
      const left = document.querySelector('.hero-left');
      const right = document.querySelector('.hero-right');

      out.heroTitle = heroTitle?.innerText || null;
      out.capTitle = capTitle?.innerText || null;
      out.heroLeftRect = left ? left.getBoundingClientRect().toJSON() : null;
      out.heroRightRect = right ? right.getBoundingClientRect().toJSON() : null;
      out.capColCount = document.querySelectorAll('.cap-col').length;
      out.logoCount = document.querySelectorAll('.cap-logos .logo-tile').length;
      out.skillCount = document.querySelectorAll('.skill-list li').length;
      out.deployCount = document.querySelectorAll('.deploy-row').length;

      // Canvas paint check — sample 200 random pixels, count non-white reads.
      // The contour algorithm draws thin strokes on white background, so a single
      // center pixel often hits background.
      if (canvas && canvas.getContext) {
        try {
          const ctx = canvas.getContext('2d');
          let nonWhite = 0;
          const samples = 200;
          for (let i = 0; i < samples; i++) {
            const x = Math.floor(Math.random() * canvas.width);
            const y = Math.floor(Math.random() * canvas.height);
            const px = ctx.getImageData(x, y, 1, 1).data;
            if (px[0] < 250 || px[1] < 250 || px[2] < 250) nonWhite++;
          }
          out.canvasInkRatio = nonWhite / samples;
        } catch (e) {
          out.canvasReadError = e.message;
        }
      }
      return out;
    });

    const status = consoleErrors.length === 0 && requestFails.length === 0 && badResponses.length === 0 ? 'OK' : 'PROBLEMS';
    if (status !== 'OK') exitCode = 1;
    summary.push({
      viewport: vp.name,
      status,
      checks,
      consoleErrors,
      requestFails,
      badResponses,
      screenshots: [heroShot, capsShot]
    });

    await ctx.close();
  }
} finally {
  await browser.close();
  server.kill();
}

writeFileSync(`${OUT}/summary.json`, JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary, null, 2));
process.exit(exitCode);
