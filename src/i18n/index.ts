import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enCommon from "./locales/en/common.json";
import enHome from "./locales/en/home.json";
import enFounders from "./locales/en/founders.json";
import enInvestors from "./locales/en/investors.json";
import enMarketers from "./locales/en/marketers.json";
import enResearchers from "./locales/en/researchers.json";
import enDoctors from "./locales/en/doctors.json";
import enConsultants from "./locales/en/consultants.json";
import enSales from "./locales/en/sales.json";
import enOperations from "./locales/en/operations.json";
import enLawyers from "./locales/en/lawyers.json";
import enPricing from "./locales/en/pricing.json";
import enEnterprise from "./locales/en/enterprise.json";
import enDownload from "./locales/en/download.json";
import enGetStarted from "./locales/en/getStarted.json";
import enFaq from "./locales/en/faq.json";

// English-only for this first Astro version. Keep copy separate from layout so
// translations can be added later without changing the components.
export const defaultNS = "common";
export const resources = {
  en: {
    common: enCommon,
    home: enHome,
    founders: enFounders,
    investors: enInvestors,
    marketers: enMarketers,
    researchers: enResearchers,
    doctors: enDoctors,
    consultants: enConsultants,
    sales: enSales,
    operations: enOperations,
    lawyers: enLawyers,
    pricing: enPricing,
    enterprise: enEnterprise,
    download: enDownload,
    getStarted: enGetStarted,
    faq: enFaq,
  },
} as const;

i18n.use(initReactI18next).init({
  lng: "en",
  fallbackLng: "en",
  supportedLngs: ["en"],
  ns: Object.keys(resources.en),
  defaultNS,
  resources,
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});

export default i18n;
