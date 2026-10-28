import "i18next";
import type enCommon from "./locales/en/common.json";
import type enHome from "./locales/en/home.json";
import type enFounders from "./locales/en/founders.json";
import type enInvestors from "./locales/en/investors.json";
import type enMarketers from "./locales/en/marketers.json";
import type enResearchers from "./locales/en/researchers.json";
import type enDoctors from "./locales/en/doctors.json";
import type enConsultants from "./locales/en/consultants.json";
import type enSales from "./locales/en/sales.json";
import type enOperations from "./locales/en/operations.json";
import type enLawyers from "./locales/en/lawyers.json";
import type enPricing from "./locales/en/pricing.json";
import type enEnterprise from "./locales/en/enterprise.json";
import type enDownload from "./locales/en/download.json";
import type enGetStarted from "./locales/en/getStarted.json";
import type enFaq from "./locales/en/faq.json";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "common";
    resources: {
      common: typeof enCommon;
      home: typeof enHome;
      founders: typeof enFounders;
      investors: typeof enInvestors;
      marketers: typeof enMarketers;
      researchers: typeof enResearchers;
      doctors: typeof enDoctors;
      consultants: typeof enConsultants;
      sales: typeof enSales;
      operations: typeof enOperations;
      lawyers: typeof enLawyers;
      pricing: typeof enPricing;
      enterprise: typeof enEnterprise;
      download: typeof enDownload;
      getStarted: typeof enGetStarted;
      faq: typeof enFaq;
    };
  }
}
