import {locale} from "@/i18n";
import { createConfig } from "@premAI-io/cookie-consent/react";

export const cookieConsentConfig = createConfig({
  categories: ["necessary", "analytics"],
  privacyPolicyUrl: locale === "en" ? "/privacy" : undefined,
  language: locale,
  copy: locale === "it" ? {
    consentModal: {title: "La tua privacy", description: 'Usiamo cookie necessari al funzionamento del sito e, con il tuo consenso, cookie di analisi. Leggi la <a href="/privacy" lang="en">Privacy Policy (in inglese)</a>.', acceptAllBtn: "Accetta tutti", acceptNecessaryBtn: "Rifiuta tutti", showPreferencesBtn: "Gestisci preferenze"},
    preferencesModal: {title: "Preferenze cookie", acceptAllBtn: "Accetta tutti", acceptNecessaryBtn: "Rifiuta tutti", savePreferencesBtn: "Salva preferenze", closeIconLabel: "Chiudi", intro: {title: "", description: "Scegli quali cookie consentire. Puoi modificare le preferenze in qualsiasi momento."}},
    categories: {necessary: {title: "Cookie necessari", description: "Consentono il funzionamento del sito e non possono essere disattivati."}, analytics: {title: "Cookie di analisi", description: "Ci aiutano a capire come viene utilizzato il sito e a migliorarlo."}}
  } : {
    preferencesModal: {
      intro: {
        title: "",
      },
    },
  },
  configOverrides: {
    categories: {
      analytics: {
        autoClear: {
          cookies: [{ name: /^_ga/ }, { name: "_gid" }],
          reloadPage: true,
        },
      },
    },
  },
});
