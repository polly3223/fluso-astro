#!/usr/bin/env node
// Capture pricing page screenshots across viewports.
// Usage: node tools/pricing-shots.mjs <tag>
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const HOST = process.env.HOST || 'http://localhost:8765';
const TAG = process.argv[2] || 'pricing';
const OUT = path.resolve(`tmp-screens/pricing/${TAG}`);
await fs.mkdir(OUT, { recursive: true });

const VIEWPORTS = [
    { w: 1440, h: 900, label: 'desktop-1440', isMobile: false },
    { w: 1280, h: 800, label: 'desktop-1280', isMobile: false },
    { w: 1024, h: 768, label: 'tablet-1024', isMobile: false },
    { w: 768,  h: 1024, label: 'tablet-768', isMobile: false },
    { w: 414,  h: 896, label: 'mobile-414', isMobile: true, deviceScaleFactor: 2 },
    { w: 375,  h: 812, label: 'mobile-375', isMobile: true, deviceScaleFactor: 2 },
];

const SECTIONS = ['#pricing-hero', '#plans', '#trust', '#compare', '#faq', '#closing'];

const browser = await chromium.launch();
try {
    for (const vp of VIEWPORTS) {
        const ctx = await browser.newContext({
            viewport: { width: vp.w, height: vp.h },
            deviceScaleFactor: vp.deviceScaleFactor || 1,
            isMobile: !!vp.isMobile,
            hasTouch: !!vp.isMobile,
        });
        const page = await ctx.newPage();
        const failures = [];
        page.on('pageerror', (err) => failures.push(`pageerror: ${err.message}`));
        page.on('console', (msg) => {
            if (msg.type() === 'error') failures.push(`console.error: ${msg.text()}`);
        });
        page.on('requestfailed', (req) => {
            failures.push(`requestfailed: ${req.method()} ${req.url()} — ${req.failure()?.errorText}`);
        });

        await page.goto(`${HOST}/pricing.html`, { waitUntil: 'networkidle', timeout: 20000 });
        await page.waitForTimeout(700);

        // First, a full-page shot for vertical review
        await page.screenshot({
            path: path.join(OUT, `${vp.label}__full.png`),
            fullPage: true,
        });

        // And per-section shots
        for (const sec of SECTIONS) {
            await page.evaluate((sel) => {
                const el = document.querySelector(sel);
                if (!el) return;
                el.scrollIntoView({ behavior: 'instant', block: 'start' });
            }, sec);
            await page.waitForTimeout(350);
            await page.screenshot({
                path: path.join(OUT, `${vp.label}_${sec.replace('#', '')}.png`),
                fullPage: false,
            });
        }

        // Dimensions + active link check
        const probe = await page.evaluate(() => {
            const active = Array.from(document.querySelectorAll('.global-bar a.active')).map(a => a.textContent.trim());
            const footerExists = !!document.querySelector('footer.site-footer');
            const navHasPrem = !!document.querySelector('.global-bar .nav-prem-logo');
            const scrollH = document.documentElement.scrollHeight;
            const hasHorizontalOverflow = document.documentElement.scrollWidth > window.innerWidth + 1;
            return { active, footerExists, navHasPrem, scrollH, hasHorizontalOverflow };
        });

        console.log(`[${vp.label}] active=${probe.active.join(',')||'∅'} footer=${probe.footerExists} navPrem=${probe.navHasPrem} h=${probe.scrollH} hOverflow=${probe.hasHorizontalOverflow}`);
        if (failures.length) {
            console.log(`  failures: ${failures.length}`);
            for (const f of failures) console.log(`    ${f}`);
        }

        await ctx.close();
    }
} finally {
    await browser.close();
}
console.log(`Wrote ${OUT}`);
