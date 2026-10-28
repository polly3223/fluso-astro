// Warm the browser cache for the /for-lawyers hero (poster + the first video
// segment for the right tier) BEFORE the user navigates there, so it paints
// instantly on arrival without pulling the full hero loop up front.
//
// Importing the asset URLs here (a main-bundle module) makes their hashed URLs
// known app-wide. The bytes only download when we inject <link rel="prefetch">.
// LegalHero imports the same first segment, so Vite emits one copy and the
// prefetch URL matches what the <video>/<img> later request → cache hit.
import hero4kFirstSegment from "../../assets/video/hero-main-4k-seg0.webm";
import hero1080FirstSegment from "../../assets/video/hero-main-1080-seg0.webm";
import heroPoster from "../../assets/video/hero-main-poster.webp?url";

let started = false;
let armed = false;

type NetworkInformationLike = {
  saveData?: boolean;
  effectiveType?: "slow-2g" | "2g" | "3g" | "4g" | string;
  downlink?: number;
  rtt?: number;
};

function hasFastDesktopConnection(connection?: NetworkInformationLike): boolean {
  if (!connection) return false;
  if (connection.saveData) return false;
  if (connection.effectiveType && connection.effectiveType !== "4g") return false;
  if (typeof connection.downlink === "number" && connection.downlink < 8) return false;
  if (typeof connection.rtt === "number" && connection.rtt > 250) return false;
  return (
    connection.effectiveType === "4g" ||
    (typeof connection.downlink === "number" && connection.downlink >= 8)
  );
}

/** Kick off the prefetch. Idempotent — only ever fires once per session. */
export function prefetchLegalHero() {
  if (started || typeof document === "undefined") return;
  started = true;

  const prefetch = (href: string, as?: string) => {
    if (document.querySelector(`link[rel="prefetch"][href="${CSS.escape(href)}"]`)) return;
    const el = document.createElement("link");
    el.rel = "prefetch";
    if (as) el.as = as;
    el.href = href;
    document.head.appendChild(el);
  };

  // Poster paints first (it's the hero LCP), so prefetch it regardless of prefs.
  prefetch(heroPoster, "image");

  const mm = typeof window !== "undefined" ? window.matchMedia : undefined;
  const reduced = mm?.("(prefers-reduced-motion: reduce)").matches;
  const connection = (navigator as { connection?: NetworkInformationLike }).connection;
  const saveData = connection?.saveData;
  // "still" tier (reduced-motion / Save-Data) downloads no video — poster only.
  if (!reduced && !saveData) {
    const mobile = mm?.("(max-width: 768px)").matches;
    // No `as` for video (not a valid preload destination); the browser still
    // fetches + caches it at low priority for the next navigation.
    prefetch(
      !mobile && hasFastDesktopConnection(connection)
        ? hero4kFirstSegment
        : hero1080FirstSegment,
    );
  }

  // Warm the lazy route chunk too, so the page code is ready with the media.
  void import("@/pages/for-lawyers/Lawyers");
}

/** Install once: prefetch the moment the user hovers / focuses ANY link whose
 *  href points at /for-lawyers (nav dropdown, mobile drawer, footer — all of
 *  them, with no per-link wiring). */
export function armLegalHeroPrefetch() {
  if (armed || typeof document === "undefined") return;
  armed = true;
  const onIntent = (event: Event) => {
    const target = event.target as HTMLElement | null;
    if (target?.closest?.('a[href$="/for-lawyers"]')) prefetchLegalHero();
  };
  document.addEventListener("pointerover", onIntent, { passive: true });
  document.addEventListener("focusin", onIntent);
}
