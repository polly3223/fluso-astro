import { CookieConsent } from "@premAI-io/cookie-consent/react";
import "@premAI-io/cookie-consent/styles.css";
import "./CookieConsentBanner.css";
import { cookieConsentConfig } from "@/utils/cookieConsentConfig";

export function CookieConsentBanner() {
  return <CookieConsent config={cookieConsentConfig} />;
}
