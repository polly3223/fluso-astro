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

import itCommon from "./locales/it/common.json";
import itHome from "./locales/it/home.json";
import itFounders from "./locales/it/founders.json";
import itInvestors from "./locales/it/investors.json";
import itMarketers from "./locales/it/marketers.json";
import itResearchers from "./locales/it/researchers.json";
import itDoctors from "./locales/it/doctors.json";
import itConsultants from "./locales/it/consultants.json";
import itSales from "./locales/it/sales.json";
import itOperations from "./locales/it/operations.json";
import itLawyers from "./locales/it/lawyers.json";
import itPricing from "./locales/it/pricing.json";
import itEnterprise from "./locales/it/enterprise.json";
import itDownload from "./locales/it/download.json";
import itGetStarted from "./locales/it/getStarted.json";
import itFaq from "./locales/it/faq.json";

// The URL selects the language. Saved browser preferences never override it.
export const locale = typeof location !== "undefined" && /^\/it(?:\/|$)/.test(location.pathname) ? "it" : "en";
export const localePath = (path: string, lang = locale) => `${lang === "it" ? "/it" : ""}${path}`;
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
  it: {
    common: itCommon,
    home: itHome,
    founders: itFounders,
    investors: itInvestors,
    marketers: itMarketers,
    researchers: itResearchers,
    doctors: itDoctors,
    consultants: itConsultants,
    sales: itSales,
    operations: itOperations,
    lawyers: itLawyers,
    pricing: itPricing,
    enterprise: itEnterprise,
    download: itDownload,
    getStarted: itGetStarted,
    faq: itFaq,
  },
} as const;

i18n.use(initReactI18next).init({
  lng: locale,
  fallbackLng: "en",
  supportedLngs: ["en", "it"],
  ns: Object.keys(resources.en),
  defaultNS,
  resources,
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});

export default i18n;
