import { useEffect, useState } from "react";
import { CookieConsent } from "@premAI-io/cookie-consent";

/**
 * Tracks whether the "analytics" category is currently accepted, staying in
 * sync as the user changes their choice via the consent banner/preferences.
 *
 * Category-level only (no per-service variant) — see VercelAnalyticsGate.tsx
 * for why an analytics provider without clean teardown can't safely hang off
 * an individually-togglable service.
 *
 * Initial state is read synchronously (lazy useState initializer) rather
 * than seeded `false`, so returning visitors get the right value immediately.
 */
export function useAnalyticsConsent(): boolean {
  const [consented, setConsented] = useState(() => CookieConsent.acceptedCategory("analytics"));

  useEffect(() => {
    const sync = () => setConsented(CookieConsent.acceptedCategory("analytics"));
    sync();

    window.addEventListener("cc:onConsent", sync);
    window.addEventListener("cc:onChange", sync);
    return () => {
      window.removeEventListener("cc:onConsent", sync);
      window.removeEventListener("cc:onChange", sync);
    };
  }, []);

  return consented;
}
