// Per-route SEO metadata. Single source of truth for <title>, meta description,
// canonical URL and the Open Graph / Twitter overrides applied at runtime by
// useSeo() (see ./useSeo). The site-level fallbacks (og:image, og:type,
// twitter:card, …) live statically in index.html so social scrapers — which do
// NOT run JS — still get a valid Fluso card; useSeo only overrides the parts
// that change per page (title/description/url/canonical). Google renders JS, so
// it picks up the per-route values here for indexing.
//
// EN-only for now (matches the rest of the site). When more routes move to
// i18n these strings can move into the per-route locale JSON.

export const SITE_URL = "https://fluso.ai";
export const SITE_NAME = "Fluso";
export const OG_IMAGE = `${SITE_URL}/assets/og-share.png`;

export const DEFAULT_TITLE = "Fluso — Your Proactive AI Workspace";
export const DEFAULT_DESCRIPTION =
  "Fluso brings proactive AI to everything you do — full context, complete control, deep focus. Connected context, open-weight models, your boundary.";

export interface RouteSeo {
  title: string;
  description: string;
}

// Keyed by the clean route path (no trailing slash, except "/").
export const ROUTE_SEO: Record<string, RouteSeo> = {
  "/": { title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION },
  "/pricing": {
    title: "Fluso Desktop Pricing — Fluso",
    description:
      "Fluso desktop: Free at $0, Plus at $10/month with 10× Free usage, or Pro at $30/month with unlimited token usage and confidential mode. Prices in USD.",
  },
  "/enterprise": {
    title: "Enterprise — Fluso",
    description:
      "Fluso for the enterprise: runs within your secure boundaries with no third-party dependencies. Connectors to your systems, skills your team codifies.",
  },
  "/download": {
    title: "Download Fluso for Mac & Windows",
    description:
      "Get Fluso for your machine. Fluso runs as a desktop app on macOS and Windows — pick your installer and get started.",
  },
  "/get-started": {
    title: "Get Started — Fluso",
    description:
      "Start with one serious project. Install Fluso on macOS or Windows today and put your proactive AI agent to work.",
  },
  "/privacy": {
    title: "Privacy Policy — Fluso",
    description: "How Fluso handles your data and protects your privacy.",
  },
  "/terms": {
    title: "Terms of Service — Fluso",
    description: "The terms governing your use of Fluso.",
  },
  "/for-founders": {
    title: "Fluso for Founders",
    description:
      "An agent for founders. Investor updates, hiring inbox, and data rooms — the compounding work, handled while you build.",
  },
  "/for-lawyers": {
    title: "Fluso Legal — AI for Lawyers",
    description:
      "The legal AI that verifies before it answers. Fluso reasons like a lawyer and works on privileged information, within your boundary.",
  },
  "/for-investors": {
    title: "Fluso for Investors",
    description:
      "An agent for investors. Sourcing, diligence, and portfolio monitoring — running while you take the next meeting.",
  },
  "/for-marketers": {
    title: "Fluso for Marketers",
    description:
      "An agent for marketers. Briefs, performance reads, and asset trafficking — the work that pulls you off strategy, gone.",
  },
  "/for-researchers": {
    title: "Fluso for Researchers",
    description:
      "An agent for researchers. Literature review, citation work, and the formatting tax — handed off so you can think.",
  },
  "/for-doctors": {
    title: "Fluso for Doctors",
    description:
      "An agent for doctors. Charting, prior auth, and the inbox — handled, so you can stay with the patient.",
  },
  "/for-consultants": {
    title: "Fluso for Consultants",
    description:
      "An agent for consultants. Decks, models, and the synthesis grind — handled with the rigor your principal expects.",
  },
  "/for-sales": {
    title: "Fluso for Sales",
    description:
      "An agent for sellers. Account research, follow-ups, and CRM hygiene — done before your first coffee.",
  },
  "/for-operations": {
    title: "Fluso for Operations",
    description:
      "An agent for operators. Vendor reviews, invoice routing, and ticket triage — running across every tool you bought.",
  },
};

export interface ResolvedSeo extends RouteSeo {
  canonical: string;
  ogImage: string;
}

export function seoForPath(pathname: string): ResolvedSeo {
  const clean = pathname.replace(/\/+$/, "") || "/";
  const known = clean in ROUTE_SEO;
  const meta = known
    ? ROUTE_SEO[clean]
    : { title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION };
  const canonical = clean === "/" ? `${SITE_URL}/` : `${SITE_URL}${clean}`;
  // Per-route OG card lives at /assets/og/<slug>.png (slug "home" for "/").
  // Unknown routes fall back to the home card.
  const slug = !known || clean === "/" ? "home" : clean.slice(1);
  const ogImage = `${SITE_URL}/assets/og/${slug}.png`;
  return { ...meta, canonical, ogImage };
}
