# Fluso — Astro

Astro version of [fluso.ai](https://fluso.ai), preserving the existing design and adding the current pricing, Agents and Italian routes. The original English-only copy is preserved in the `current-site-baseline` tag.

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

## Current work

- Free $0, Plus $10/month (10× Free), Pro $30/month (10× Plus); weekly usage allowances, no absolute token quotas. Pro includes confidential mode. The eligible 30-day card-required Pro trial is preserved.
- Homepage Agents section, setup explanation and three selectable workflow examples. The actual `AgentReplica`/`AgentSurface` components are reused from the previous Fluso landing, with desktop and phone layouts and synthetic example content.
- English at `/`; Italian marketing pages at `/it/`. The URL determines the language. Header flags and footer language links preserve the current page, query and section.
- Localized canonical/alternate metadata and sitemap. Privacy and terms retain their existing published English versions; their Italian URLs redirect to English.
- Retired Telegram, outdated model and mobile-roadmap claims are removed from current marketing copy.

## Where to work

- `astro/pages/[...path].astro` and `astro/pages/it/[...path].astro` generate the routes; `astro/layouts/Site.astro` owns their HTML metadata.
- `src/Website.tsx` mounts the existing React application as an Astro client island. This preserves the original visual behavior; the components have not all been rewritten as native Astro templates.
- `src/pages/home/sections/Agents.tsx` contains the new section. `astro/components/app-replica/` contains the reused native Astro demo, passed into React through a slot.
- `src/pages/home/sections/` contains the other homepage sections and animations.
- `src/components/SiteNav.tsx` contains desktop and mobile navigation.
- `src/i18n/locales/en/` and `it/` contain localized copy. `src/i18n/index.ts` selects the language from the URL; the React router uses the same locale base.
- `src/index.css`, `src/components/typography.ts` and local component classes control styling.
- `assets/` contains images, icons and videos. `scripts/sync-static.ts` copies them and supporting documents to `public/` before development and builds.
- `src/seo/config.ts` contains localized route metadata. `scripts/generate-sitemap.ts` generates the sitemap.

## Publication

This repository is not connected to the production Fluso deployment. Preview pages include `noindex, nofollow`; remove that deliberately before a production launch. Existing app, contact and download links still point to their original destinations. Fonts and some icons use external public services.

`vercel.json` describes an optional Astro deployment, including legacy-page, English legal and desktop-auth redirects. No hosting project or automatic deployment has been configured. `bun run preview` runs a local Bun static server with the same redirects, bound to localhost. `PORT` defaults to 8902. For remote Astro development, set `ASTRO_ALLOWED_HOST` to the preview hostname.

The former production waitlist serverless integration and its Google Sheets endpoint are not included. The current UI does not submit to it. This project is static and does not process form submissions.

For an official fluso.ai rollout, integrate through the production website repository, review and merge before deployment, verify its Vercel project configuration, remove preview indexing restrictions, then verify the public routes and assets. This repository does not change the official domain or production accounts.

## Provenance

Based on website source `db8181c2939855fbed42372bb89f03e0ffea0145`, whose compiled application and stylesheet matched the live site. Before launch edits, all 16 routes were compared at desktop and mobile sizes: heading geometry, links and page heights matched. One timed rotating label differed in animation phase. The English-only baseline passed 201 browser checks.

The cookie-consent package is included in `vendor/cookie-consent`, so installation requires no private package registry access. Its metadata declares MIT; see `THIRD_PARTY_NOTICES.md`. Dependencies are pinned in `bun.lock`.
