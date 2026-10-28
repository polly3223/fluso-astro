import { GTM_ID_DEFAULT } from "@/config/gtm";

// Overridable via VITE_GTM_ID; falls back to GTM_ID_DEFAULT so the real
// container loads out of the box. index.html's <noscript> snippet resolves
// the same env var at build time, so the two stay in sync.
const GTM_ID = import.meta.env.VITE_GTM_ID || GTM_ID_DEFAULT;

/**
 * Loads Google Tag Manager only after the "analytics" cookie category is
 * accepted. Tagged `type="text/plain"` + `data-category` so the
 * cookie-consent library swaps it to a real script on consent. Mirrors
 * GoogleAnalyticsGate.tsx and fluso-frontend's own GtmConsentGate; gated by
 * category, not a per-service toggle (this project doesn't expose
 * per-service controls — see useAnalyticsConsent.ts), since GTM can load
 * arbitrary tags of its own.
 *
 * The paired <noscript> snippet lives as static markup in index.html
 * instead — it only matters with JS disabled, so this component could
 * never insert it in time anyway.
 */
export function GtmConsentGate() {
  const snippet = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`;

  return (
    <script
      type="text/plain"
      data-category="analytics"
      dangerouslySetInnerHTML={{ __html: snippet }}
    />
  );
}
