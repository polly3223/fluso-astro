import {locale} from "@/i18n";
import { Suspense, useLayoutEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import LegalNav from "@/pages/for-lawyers/LegalNav";
import LegalWordmark from "@/pages/for-lawyers/LegalWordmark";
import Parent from "@/pages/home/sections/Parent.tsx";
import { seoForPath } from "@/seo/config";
import { useSeo } from "@/seo/useSeo";
// The SHARP poster (same file the hero shows) — not the soft LQIP — so the
// loading fallback is already full quality and there's no soft→sharp jump
// when the lazy chunk swaps in and the video starts.
import legalHeroPoster from "../../assets/video/hero-main-poster.webp?url";

export default function Layout() {
  const { t } = useTranslation("common");
  const { pathname, hash } = useLocation();
  useSeo(seoForPath(pathname, locale));
  const cleanPath = pathname.replace(/\/$/, "") || "/";
  const isLegal = cleanPath === "/for-lawyers";
  const isAppReviewLegal = cleanPath === "/terms" || cleanPath === "/privacy";
  const isHome = pathname === "/";
  const routeFallback = isLegal ? (
    <div
      aria-hidden="true"
      className="h-dvh w-full bg-cover bg-center"
      style={{
        // Mirrors the loaded hero exactly so nothing "pops in" when the lazy chunk
        // swaps in: (1) uniform 20% dark tint, (2) the same darker bottom scrim
        // (its 32vh band mapped onto the bottom 32% here), (3) the poster.
        backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), linear-gradient(to top, #0c0c0c 0%, rgba(6,6,6,0.98) 5%, rgba(0,0,0,0.88) 15%, rgba(0,0,0,0.5) 24%, transparent 32%), url("${legalHeroPoster}")`,
      }}
    />
  ) : isHome ? (
    <div aria-hidden="true" className="relative h-dvh w-full bg-ink">
      <div
        // light region marker so SiteNav resolves to the dark/black bar while
        // the home chunk is still loading — no cream→black flash on first paint
        data-nav-light
        className="absolute inset-4 overflow-hidden bg-cream"
        style={{ borderRadius: 28 }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 90% at 88% 0%, rgba(12,12,12,0.05), transparent 55%)",
          }}
        />
      </div>
    </div>
  ) : (
    <div data-nav-light className="min-h-dvh bg-cream" />
  );

  useLayoutEffect(() => {
    if (hash) return;
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return (
    <>
      {isLegal ? <LegalNav /> : <SiteNav hidePricing={isAppReviewLegal} />}
      <Suspense fallback={routeFallback}>
        <Outlet />
      </Suspense>

      <div className="min-h-dvh flex flex-col justify-end">
          <Parent />
          <SiteFooter
              brandLabel={isLegal ? <LegalWordmark /> : undefined}
              extraProduct={
                  isLegal
                      ? [
                          {
                              href: "https://form.typeform.com/to/vZnBDhzs",
                              label: t("footer.requestEarlyAccess"),
                              external: true,
                          },
                      ]
                      : []
              }
              hidePricing={isAppReviewLegal}
          />
      </div>
    </>
  );
}
