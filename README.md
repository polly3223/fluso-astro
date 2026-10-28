# Fluso — Astro

English-only Astro copy of the current [fluso.ai](https://fluso.ai) website, prepared on 28 October 2026. The existing design, content, fonts, imagery and animations are preserved. The language switcher and Italian resources are removed. The Agents update is the next task and has not been added here.

## Run locally

Install [Bun](https://bun.sh), then:

```sh
bun install --frozen-lockfile
bun run dev
```

Open **http://localhost:8902**. No credentials or environment variables are required.

```sh
bun run check   # Astro + TypeScript diagnostics
bun run build   # Static site in dist/
bun run preview
```

## Where to work

- `astro/pages/[...path].astro` generates the 16 existing routes; `astro/layouts/Site.astro` owns their HTML metadata.
- `src/Website.tsx` mounts the existing React application as an Astro client island. This deliberately preserves the original visual behavior; the components have not been rewritten as native Astro templates.
- `src/pages/home/sections/` contains homepage sections and animations.
- `src/components/SiteNav.tsx` contains desktop and mobile navigation.
- `src/i18n/locales/en/` contains English copy. The translation API is retained for future languages, but English is the only configured language.
- `src/index.css`, `src/components/typography.ts` and local component classes control styling.
- `assets/` contains the original images, icons and videos. `scripts/sync-static.ts` copies static assets and documents to `public/` before development and builds.
- `src/seo/config.ts` contains route metadata.

## Preview and publication

The project is a standalone copy. It is not connected to the production Fluso deployment. Pages currently include `noindex, nofollow`; remove that deliberately before a production launch. Existing app, contact and download links still point to their original destinations. Fonts and some icons are loaded from external public services.

The former production waitlist serverless integration and its Google Sheets endpoint are not included. The current 16-page UI does not submit to it. The local preview is static and does not process form submissions.

`vercel.json` describes an optional future Astro deployment and preserves the existing page and desktop-auth redirects. No hosting project or automatic deployment is configured. Local preview hostnames can be supplied with `ASTRO_ALLOWED_HOST`.

The pricing copy intentionally matches the source snapshot, including its existing Pro wording. Update it separately when changing launch content.

## Provenance

Based on the website source snapshot `db8181c2939855fbed42372bb89f03e0ffea0145`. Its compiled application and stylesheet were checked against the live website. Before the requested English-only change, all 16 routes were compared at desktop and mobile sizes: heading geometry, links and page heights matched; one timed rotating label differed in animation phase.

The cookie-consent package is included in `vendor/cookie-consent` so local installation does not require access to a private package registry. Its package metadata declares MIT; see `THIRD_PARTY_NOTICES.md`. Dependencies are pinned in `bun.lock`.
