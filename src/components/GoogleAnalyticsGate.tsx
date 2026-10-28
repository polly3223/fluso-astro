// Overridable via VITE_GA_MEASUREMENT_ID (see .env / .env.example) for
// staging or one-off testing without touching code; falls back to the
// site's real production property so nothing needs to be set for this to
// work out of the box.
const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || "G-883B5QLSZW";

/**
 * Loads Google Analytics (gtag.js) only after the user accepts cookies.
 *
 * The snippet is rendered as `type="text/plain"` with a `data-category`
 * marker — the cookie-consent library scans the DOM for scripts tagged this
 * way and swaps them to real, executable scripts once the category is
 * accepted. This mirrors how fluso-frontend gates its Google Tag Manager
 * snippet (see GtmConsentGate). Gated on the category, not a per-service
 * toggle — see VercelAnalyticsGate.tsx for why.
 *
 * The whole gtag bootstrap — defining `gtag`, queuing the initial calls, and
 * injecting the async loader script — lives in one inline snippet so nothing
 * outside this gated block ever talks to Google Analytics before consent.
 */
export function GoogleAnalyticsGate() {
  const snippet = `(function(w,d,s,i){
  w.dataLayer = w.dataLayer || [];
  function gtag(){w.dataLayer.push(arguments);}
  w.gtag = gtag;
  gtag('js', new Date());
  gtag('config', i);
  var f = d.getElementsByTagName(s)[0], j = d.createElement(s);
  j.async = true;
  j.src = 'https://www.googletagmanager.com/gtag/js?id=' + i;
  f.parentNode.insertBefore(j, f);
})(window,document,'script','${GA_ID}');`;

  return (
    <script
      type="text/plain"
      data-category="analytics"
      dangerouslySetInnerHTML={{ __html: snippet }}
    />
  );
}
