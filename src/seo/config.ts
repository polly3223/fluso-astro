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
      "Fluso desktop: Free at $0, Plus at $10/month with 10× Free usage, or Pro at $30/month with 10× Plus usage and confidential mode. Prices in USD.",
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
  english: string;
  italian: string | null;
}

export function seoForPath(pathname: string, locale: "en" | "it" = "en"): ResolvedSeo {
  const clean = pathname.replace(/\/+$/, "") || "/";
  const known = clean in ROUTE_SEO;
  const meta = known
    ? (locale === "it" ? IT_ROUTE_SEO[clean] : ROUTE_SEO[clean])
    : { title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION };
  const prefix = locale === "it" ? "/it" : "";
  const canonical = `${SITE_URL}${prefix}${clean === "/" ? "/" : clean}`;
  // Per-route OG card lives at /assets/og/<slug>.png (slug "home" for "/").
  // Unknown routes fall back to the home card.
  const slug = !known || clean === "/" ? "home" : clean.slice(1);
  const ogImage = `${SITE_URL}/assets/og/${slug}.png`;
  return { ...meta, canonical, ogImage, english: `${SITE_URL}${clean === "/" ? "/" : clean}`, italian: ["/privacy", "/terms"].includes(clean) ? null : `${SITE_URL}/it${clean === "/" ? "/" : clean}` };
}

export const IT_ROUTE_SEO: Record<string, RouteSeo> = {
  "/": {
    "title": "Fluso — Il tuo spazio di lavoro AI proattivo",
    "description": "Chat, file e app collegate in uno spazio di lavoro privato. Crea agenti per i compiti ricorrenti, con istruzioni, strumenti e routine."
  },
  "/pricing": {
    "title": "Prezzi Fluso Desktop — Fluso",
    "description": "Free a $0, Plus a $10/mese con 10× l’utilizzo di Free, Pro a $30/mese con 10× Plus e modalità confidenziale. Prezzi in USD."
  },
  "/enterprise": {
    "title": "Enterprise — Fluso",
    "description": "Fluso per le organizzazioni: app collegate, istruzioni condivise e opzioni di deployment per le esigenze del tuo team."
  },
  "/download": {
    "title": "Scarica Fluso per Mac e Windows",
    "description": "Scarica Fluso per macOS o Windows e accedi al tuo spazio di lavoro. Disponibile anche sul web e su iPhone."
  },
  "/get-started": {
    "title": "Inizia con Fluso",
    "description": "Collega le tue app, aggiungi i file e inizia con un progetto. Usa chat e agenti per portare avanti il lavoro."
  },
  "/privacy": {
    "title": "Informativa sulla privacy — Fluso",
    "description": "Come Fluso gestisce i tuoi dati e tutela la tua privacy."
  },
  "/terms": {
    "title": "Termini di servizio — Fluso",
    "description": "I termini che regolano l’utilizzo di Fluso."
  },
  "/for-founders": {
    "title": "Fluso per i founder",
    "description": "Aggiornamenti per gli investitori, selezione del personale e data room: un agente per il lavoro che accompagna la crescita."
  },
  "/for-lawyers": {
    "title": "Fluso Legal — AI per avvocati",
    "description": "Un assistente AI per il lavoro legale: analizza documenti, verifica le fonti e lavora nel tuo perimetro."
  },
  "/for-investors": {
    "title": "Fluso per gli investitori",
    "description": "Ricerca di opportunità, due diligence e monitoraggio del portafoglio con un agente e le tue fonti."
  },
  "/for-marketers": {
    "title": "Fluso per il marketing",
    "description": "Brief, analisi dei risultati e preparazione dei contenuti, con il contesto delle tue app."
  },
  "/for-researchers": {
    "title": "Fluso per la ricerca",
    "description": "Revisione della letteratura, citazioni e formattazione: più spazio per il lavoro di ricerca."
  },
  "/for-doctors": {
    "title": "Fluso per i medici",
    "description": "Supporto al lavoro amministrativo e documentale, con le fonti e gli strumenti del tuo team."
  },
  "/for-consultants": {
    "title": "Fluso per i consulenti",
    "description": "Presentazioni, modelli e sintesi: un agente per il lavoro di consulenza."
  },
  "/for-sales": {
    "title": "Fluso per le vendite",
    "description": "Ricerca sui clienti, follow-up e aggiornamento del CRM con le tue app collegate."
  },
  "/for-operations": {
    "title": "Fluso per le operations",
    "description": "Analisi dei fornitori, fatture e richieste: un agente per coordinare il lavoro operativo."
  }
};
