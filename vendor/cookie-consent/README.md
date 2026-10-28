# @premai/cookie-consent

Self-contained, GDPR-compliant cookie consent. A thin,
themeable wrapper around [`vanilla-cookieconsent`](https://github.com/orestbida/cookieconsent)
(MIT, zero-dependency, no external CDN).

Works three ways from one core:

1. **Any bundler / framework** — `@premai/cookie-consent`
2. **React** — `@premai/cookie-consent/react`
3. **Plain `<script>` tag** (no bundler, no React) — the standalone IIFE build

Consent is opt-in by default: `necessary` cookies are always on and read-only;
everything else (analytics, functional, marketing…) loads only after the user agrees.

## Install

```sh
# before it's published to the internal registry, link locally:
#   "@premai/cookie-consent": "file:../prem-cookie-consent"
```

## Usage

### React (Next.js / Vite)

```tsx
import { CookieConsent, createConfig } from "@premai/cookie-consent/react"
import "@premai/cookie-consent/styles.css"

// mount once, high in the tree
<CookieConsent config={createConfig({ privacyPolicyUrl: "/privacy" })} />
```

Re-open preferences from anywhere (e.g. a footer link):

```tsx
import { ManageCookiesButton } from "@premai/cookie-consent/react"

<ManageCookiesButton className="underline">Cookie settings</ManageCookiesButton>
```

### Any bundler (no React)

```ts
import { init } from "@premai/cookie-consent"
import "@premai/cookie-consent/styles.css"

init({ privacyPolicyUrl: "/privacy" })
```

### Plain `<script>` tag

```html
<link rel="stylesheet" href="/prem-cookie-consent.css" />
<script src="/prem-cookie-consent.iife.global.js"></script>
<script>
  PremCookieConsent.init({ privacyPolicyUrl: "/privacy" });
</script>
```

(Both files are in `dist/` after `npm run build`: `dist/prem-cookie-consent.iife.global.js`
and `dist/prem-cookie-consent.css`.)

## Gating scripts (analytics, GTM, chat widgets…)

Tag any script you want to defer until consent with `type="text/plain"` and a
`data-category`. The plugin runs it only once that category is accepted:

```html
<!-- runs only after "analytics" is accepted -->
<script type="text/plain" data-category="analytics" data-service="Google Tag Manager">
  (function(w,d,s,l,i){/* GTM snippet */})(window,document,'script','dataLayer','GTM-XXXXXXX');
</script>
```

Or check imperatively: `acceptedCategory("analytics")`, and react to changes via the
`onChange` option.

## Configuration

`createConfig(options)` / `init(options)`:

| option | default | description |
| --- | --- | --- |
| `categories` | `["necessary","analytics"]` | Categories to expose. `necessary` is forced read-only + enabled. |
| `privacyPolicyUrl` | – | Appends a "Privacy Policy" link to the consent description. |
| `language` | `"en"` | Default language code. |
| `copy` | – | Deep-partial override of all banner/modal text (incl. per-category). |
| `guiOptions` | box / bottom-left | vanilla-cookieconsent layout/position. |
| `onConsent` / `onChange` | – | Consent lifecycle callbacks. |
| `autoShow` | `true` | Show the consent modal automatically on load. |
| `configOverrides` | – | Escape hatch, deep-merged over the generated config. |
| `config` (init only) | – | Provide a full vanilla-cookieconsent config; ignores all other options. |

## Theming

The plugin is themed via vanilla-cookieconsent's CSS variables (scoped to `#cc-main`).
Import `styles.css`, then override the variables to match your app (including dark mode).
See `src/styles.css` for the common variables and an example.

## Build

```sh
npm install
npm run build   # -> dist/ : core ESM, react ESM, IIFE, CSS, .d.ts
```

## Releasing

Releases are cut by the **Publish NPM** GitHub Actions workflow, which publishes to
the GitHub Packages registry under the repo's org scope.

1. Make sure **Settings → Actions → General → Workflow permissions** is set to
   **Read and write** (one-time; lets the workflow push the version commit/tag and
   publish the package).
2. Go to the **Actions** tab → **Publish NPM** → **Run workflow**.
3. Pick the version increment (`patch` / `minor` / `major`) and run it.

That's it — no manual version editing. The workflow will:

- build (`prepack` → `npm run build`),
- bump `version` in `package.json`, commit `chore: release vX.Y.Z`, tag `vX.Y.Z`, and push,
- publish `@<org>/cookie-consent` to GitHub Packages.

### Installing a published version

Consumers need an `.npmrc` pointing the org scope at GitHub Packages, plus a token (PAT with `read:packages`, or `secrets.GITHUB_TOKEN` within Workflows):

```
@premAI-io:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Then `npm install @<org>/cookie-consent` as usual.
