// Per-route copy for the OG cards (rendered by OgCard, captured to
// assets/og/<slug>.png). Keyed by clean route path, same keys as src/seo/config.
// Titles may contain "\n" for an explicit line break. Badge defaults to the real
// hero badge; override per route where a different framing reads better.

export const OG_DEFAULT_BADGE = "Engineered in Switzerland, hosted in the EU";

export interface OgEntry {
  title: string;
  subtitle: string;
  badge?: string;
}

export const OG_DATA: Record<string, OgEntry> = {
  "/": {
    title: "Your proactive\nAI workspace",
    subtitle: "Full context. Complete control. Deep focus.",
  },
  "/pricing": {
    title: "Fluso desktop plans,\nserious capacity.",
    subtitle: "Workspace capacity for desktop teams.",
  },
  "/enterprise": {
    title: "Built for the\nenterprise.",
    subtitle: "Runs within your secure boundaries — no third-party dependencies.",
  },
  "/download": {
    title: "Get Fluso for\nyour machine.",
    subtitle: "A desktop app for macOS and Windows.",
  },
  "/get-started": {
    title: "Start with one\nserious project.",
    subtitle: "On macOS and Windows today.",
  },
  "/privacy": {
    title: "Privacy at\nthe core.",
    subtitle: "How Fluso handles your data — and your boundary.",
  },
  "/terms": {
    title: "Terms of\nservice.",
    subtitle: "The terms governing your use of Fluso.",
  },
  "/for-founders": {
    badge: "Fluso for founders",
    title: "An agent for\nfounders.",
    subtitle: "The compounding work, handled while you build.",
  },
  "/for-lawyers": {
    badge: "Fluso Legal",
    title: "The legal AI that verifies\nbefore it answers.",
    subtitle: "It reasons like a lawyer — on privileged information, within your boundary.",
  },
  "/for-investors": {
    badge: "Fluso for investors",
    title: "An agent for\ninvestors.",
    subtitle: "Running while you take the next meeting.",
  },
  "/for-marketers": {
    badge: "Fluso for marketers",
    title: "An agent for\nmarketers.",
    subtitle: "The work that pulls you off strategy, gone.",
  },
  "/for-researchers": {
    badge: "Fluso for researchers",
    title: "An agent for\nresearchers.",
    subtitle: "The formatting tax, handed off so you can think.",
  },
  "/for-doctors": {
    badge: "Fluso for doctors",
    title: "An agent for\ndoctors.",
    subtitle: "Handled, so you can stay with the patient.",
  },
  "/for-consultants": {
    badge: "Fluso for consultants",
    title: "An agent for\nconsultants.",
    subtitle: "The synthesis grind, with a principal's rigor.",
  },
  "/for-sales": {
    badge: "Fluso for sales",
    title: "An agent for\nsellers.",
    subtitle: "Done before your first coffee.",
  },
  "/for-operations": {
    badge: "Fluso for operations",
    title: "An agent for\noperators.",
    subtitle: "Running across every tool you bought.",
  },
};

export const slugForRoute = (route: string) => (route === "/" ? "home" : route.slice(1));
export const routeForSlug = (slug: string) => (slug === "home" ? "/" : `/${slug}`);
