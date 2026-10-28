// Vercel Web Analytics custom events for the site's key CTAs.
//
// Most CTAs are plain <a>/<Link> elements, and several point off-site (S3
// downloads, the Typeform contact form, mailto:, premai.io) so they never
// trigger an SPA route change — Vercel's automatic page views can't see them.
// The same destinations also appear across many components (nav, hero, FAQ,
// pricing plans, closing sections), and some hrefs are set at runtime by the
// platform-detection hooks. Rather than wire an onClick into every button we
// listen once at the document level and classify the click by its href.
//
// Internal-route clicks (/get-started, /download) ALSO get an event so we can
// see which page drove the click — the destination's page view only tells us
// arrivals, not the source.

import { track } from "@vercel/analytics";

const S3_HOST = "fluso-releases.s3";
const TYPEFORM = "form.typeform.com/to/";
const PREM_AI = "premai.io";

function platformFromHref(href: string): string {
  if (/arm64|x64|\.dmg/i.test(href)) return "mac";
  if (/windows|\.exe/i.test(href)) return "windows";
  if (/linux|\.appimage|\.deb/i.test(href)) return "linux";
  return "unknown";
}

type Event = { name: string; data: Record<string, string> };

function classify(link: HTMLAnchorElement): Event | null {
  const raw = link.getAttribute("href") ?? "";
  if (!raw) return null;
  const page = window.location.pathname;

  // Off-site / non-navigation links (invisible to page-view tracking).
  if (raw.includes(S3_HOST)) {
    return { name: "Download App", data: { platform: platformFromHref(raw), page } };
  }
  if (raw.includes(TYPEFORM)) {
    return { name: "Contact Sales", data: { page } };
  }
  if (raw.startsWith("mailto:")) {
    return { name: "Email Contact", data: { address: raw.slice(7).split("?")[0], page } };
  }
  if (raw.includes(PREM_AI)) {
    return { name: "Visit Prem AI", data: { page } };
  }

  // Internal route CTAs — same-origin only, matched on the resolved pathname.
  if (link.origin === window.location.origin) {
    if (link.pathname === "/get-started") return { name: "Get Started", data: { page } };
    if (link.pathname === "/download") return { name: "Download Page", data: { page } };
  }

  return null;
}

/** Start listening for CTA clicks. Returns a cleanup fn for React effects. */
export function armClickTracking(): () => void {
  if (typeof document === "undefined") return () => {};

  const onClick = (event: MouseEvent) => {
    const target = event.target as Element | null;
    const link = target?.closest?.<HTMLAnchorElement>("a[href]");
    if (!link) return;
    const hit = classify(link);
    if (hit) track(hit.name, hit.data);
  };

  document.addEventListener("click", onClick, { capture: true });
  return () => document.removeEventListener("click", onClick, { capture: true });
}
