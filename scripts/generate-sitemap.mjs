// generate-sitemap.mjs — build public/sitemap.xml and public/robots.txt.
//
// The route table in src/App.tsx is the single source of truth: this script
// parses the `<Route path="…" element={<Component …>} />` entries and the
// matching `lazy(() => import("@/pages/…"))` declarations, so adding a route to
// the router automatically adds it to the sitemap on the next build — no second
// list to keep in sync. The catch-all (`path="*"`) and anything in EXCLUDE is
// dropped. `<lastmod>` per URL comes from the last git commit that touched the
// page's source file (falls back to today for un-committed/new files).
//
// Output lands in public/, which Vite copies into dist/ on `vite build`, which
// the Vercel build output then serves as real files (the `filesystem` handler
// in tools/build-vercel-output.mjs runs before the SPA fallback). Wired into
// `npm run build` ahead of `vite build`; also runnable standalone via
// `npm run sitemap`. Override the host with SITE_URL (no trailing slash).

import { execFileSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(fileURLToPath(new URL(".", import.meta.url)), "..");
const SITE_URL = (process.env.SITE_URL || "https://fluso.ai").replace(/\/+$/, "");

// Routes that exist in the router but should not be advertised to crawlers.
const EXCLUDE = new Set([]);

// changefreq/priority are advisory (Google ignores them; some crawlers still
// read them). Keep it simple: home first, legal pages low, everything else mid.
function hints(route) {
  if (route === "/") return { changefreq: "weekly", priority: "1.0" };
  if (route === "/privacy" || route === "/terms")
    return { changefreq: "yearly", priority: "0.3" };
  return { changefreq: "monthly", priority: "0.8" };
}

const appSource = await readFile(path.join(root, "src", "App.tsx"), "utf8");

// name -> source file, from `const Name = lazy(() => import("@/pages/…"));`
const componentFile = new Map();
for (const m of appSource.matchAll(
  /const\s+(\w+)\s*=\s*lazy\(\(\)\s*=>\s*import\(\s*["']([^"']+)["']\s*\)\)/g,
)) {
  const [, name, spec] = m;
  const rel = spec.replace(/^@\//, "src/");
  componentFile.set(name, path.join(root, `${rel}.tsx`));
}

// route path -> component name, from `<Route path="…" element={<Name …}`
const routes = [];
for (const m of appSource.matchAll(
  /<Route\s+path=["']([^"']+)["']\s+element=\{<(\w+)/g,
)) {
  const [, routePath, component] = m;
  if (routePath === "*" || EXCLUDE.has(routePath)) continue;
  routes.push({ routePath, component });
}

if (routes.length === 0) {
  throw new Error(
    "generate-sitemap: no routes parsed from src/App.tsx — did the <Route> markup change?",
  );
}

const today = new Date().toISOString().slice(0, 10);

function lastmodFor(component) {
  const file = componentFile.get(component);
  if (!file) return today;
  try {
    const out = execFileSync(
      "git",
      ["log", "-1", "--format=%cs", "--", file],
      { cwd: root, encoding: "utf8" },
    ).trim();
    return out || today;
  } catch {
    return today;
  }
}

const urls = routes
  .map(({ routePath, component }) => {
    const loc = routePath === "/" ? `${SITE_URL}/` : `${SITE_URL}${routePath}`;
    return { loc, lastmod: lastmodFor(component), ...hints(routePath) };
  })
  .sort((a, b) => a.loc.localeCompare(b.loc));

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) =>
      `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`,
  )
  .join("\n")}
</urlset>
`;

const robots = `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Allow: /

# Internal / non-marketing artifacts — keep out of the index.
Disallow: /design-system.html
Disallow: /fluso-building-blocks-video.html
Disallow: /fluso-visual-identity-system.html

Sitemap: ${SITE_URL}/sitemap.xml
`;

const publicDir = path.join(root, "public");
await mkdir(publicDir, { recursive: true });
await writeFile(path.join(publicDir, "sitemap.xml"), sitemap);
await writeFile(path.join(publicDir, "robots.txt"), robots);

console.log(
  `sitemap: ${urls.length} URLs → public/sitemap.xml, public/robots.txt (host ${SITE_URL})`,
);
