import { locale } from "@/i18n";
import { lazy, Suspense, useEffect, type ReactNode } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Layout from "@/components/Layout";
import { armLegalHeroPrefetch } from "@/utils/heroPrefetch";
import { armClickTracking } from "@/utils/clickTracking";

const Home = lazy(() => import("@/pages/Home"));
const Pricing = lazy(() => import("@/pages/pricing/Pricing"));
const Enterprise = lazy(() => import("@/pages/enterprise/Enterprise"));
const Download = lazy(() => import("@/pages/download/Download"));
const GetStarted = lazy(() => import("@/pages/get-started/GetStarted"));
const Privacy = lazy(() => import("@/pages/privacy/Privacy"));
const Terms = lazy(() => import("@/pages/terms/Terms"));
const Founders = lazy(() => import("@/pages/for-founders/Founders"));
const Lawyers = lazy(() => import("@/pages/for-lawyers/Lawyers"));
const Investors = lazy(() => import("@/pages/for-investors/Investors"));
const Marketers = lazy(() => import("@/pages/for-marketers/Marketers"));
const Researchers = lazy(() => import("@/pages/for-researchers/Researchers"));
const Doctors = lazy(() => import("@/pages/for-doctors/Doctors"));
const Consultants = lazy(() => import("@/pages/for-consultants/Consultants"));
const Sales = lazy(() => import("@/pages/for-sales/Sales"));
const Operations = lazy(() => import("@/pages/for-operations/Operations"));

// Cookie consent + gated analytics — lazy-loaded like the route chunks above
// so the consent library's JS/CSS isn't in the critical bundle. All five are
// rendered on every route (outside <Routes>), mirroring how fluso-frontend
// mounts them once from its root layout.
const CookieConsentBanner = lazy(() =>
  import("@/components/CookieConsentBanner").then((mod) => ({
    default: mod.CookieConsentBanner,
  })),
);
const CookieConsentManageButton = lazy(() =>
  import("@/components/CookieConsentManageButton").then((mod) => ({
    default: mod.CookieConsentManageButton,
  })),
);
const VercelAnalyticsGate = lazy(() =>
  import("@/components/VercelAnalyticsGate").then((mod) => ({
    default: mod.VercelAnalyticsGate,
  })),
);
const GoogleAnalyticsGate = lazy(() =>
  import("@/components/GoogleAnalyticsGate").then((mod) => ({
    default: mod.GoogleAnalyticsGate,
  })),
);
const GtmConsentGate = lazy(() =>
  import("@/components/GtmConsentGate").then((mod) => ({
    default: mod.GtmConsentGate,
  })),
);

function EnglishLegal({path}: {path: string}) {
  useEffect(() => { window.location.replace(path + window.location.search + window.location.hash); }, [path]);
  return null;
}

function NotFound() {
  // Safety net for legacy `*.html` links. The pre-React site shipped
  // download.html, pricing.html, for-lawyers.html, … and those URLs are out in
  // the wild (download.html especially). Production 308-redirects them to the
  // clean route at the Vercel edge before the SPA loads (see
  // vercel.json), so this normally never runs — it's the
  // fallback for the dev server (no edge redirects) or any stray `.html` URL
  // that reaches the client: strip the extension, keep the query, hand off to
  // the matching clean route.
  const { pathname, search } = useLocation();
  if (pathname.endsWith(".html")) {
    return <Navigate to={pathname.slice(0, -".html".length) + search} replace />;
  }
  return (
    <main className="flex min-h-[50vh] flex-col items-center justify-center gap-3">
      <h1 className="text-2xl font-medium tracking-tight">404 — Not found</h1>
    </main>
  );
}

export default function App({ children }: { children?: ReactNode }) {
  // Prefetch the /for-lawyers hero (poster + video) on first hover/focus of any
  // link to it, so the heavy video is cached before the user gets there.
  useEffect(() => armLegalHeroPrefetch(), []);

  // Fire Vercel custom events for key CTA clicks (downloads, contact sales,
  // get started, email, …) — many are off-site links page views never see.
  useEffect(() => armClickTracking(), []);

  return (
    <BrowserRouter basename={locale === "it" ? "/it" : undefined}>
      <Suspense fallback={null}>
        <VercelAnalyticsGate />
        <GoogleAnalyticsGate />
        <GtmConsentGate />
        <CookieConsentBanner />
        <CookieConsentManageButton />
      </Suspense>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home agentDemo={children} />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/enterprise" element={<Enterprise />} />
          <Route path="/download" element={<Download />} />
          <Route path="/get-started" element={<GetStarted />} />
          <Route path="/privacy" element={locale === "it" ? <EnglishLegal path="/privacy" /> : <Privacy />} />
          <Route path="/terms" element={locale === "it" ? <EnglishLegal path="/terms" /> : <Terms />} />
          <Route path="/for-founders" element={<Founders />} />
          <Route path="/for-lawyers" element={<Lawyers />} />
          <Route path="/for-investors" element={<Investors />} />
          <Route path="/for-marketers" element={<Marketers />} />
          <Route path="/for-researchers" element={<Researchers />} />
          <Route path="/for-doctors" element={<Doctors />} />
          <Route path="/for-consultants" element={<Consultants />} />
          <Route path="/for-sales" element={<Sales />} />
          <Route path="/for-operations" element={<Operations />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
