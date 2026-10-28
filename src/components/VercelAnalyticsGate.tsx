import { Analytics } from "@vercel/analytics/react";
import { useAnalyticsConsent } from "@/hooks/useAnalyticsConsent";

/**
 * Renders Vercel Web Analytics only after the "analytics" category is
 * accepted — not a per-service toggle, because @vercel/analytics has no
 * unmount cleanup: rejecting a "vercelAnalytics" service alone would unmount
 * this component but leave its injected script and `window.va` running.
 * Gating on the category means rejecting analytics always revokes the whole
 * category, which forces a full reload (autoClear.reloadPage in
 * cookieConsentConfig.ts) and actually stops both providers.
 */
export function VercelAnalyticsGate() {
  const consented = useAnalyticsConsent();

  if (!consented) return null;

  return <Analytics />;
}
