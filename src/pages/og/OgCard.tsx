import FlusoWordmark from "@/components/FlusoWordmark";
import LegacyAppMockup from "./LegacyAppMockup";
import { TYPE_DISPLAY } from "@/components/typography";
import { cn } from "@/utils/styles";
import { OG_DATA, OG_DEFAULT_BADGE, slugForRoute, type OgEntry } from "./ogData";

// A 1200×630 Open Graph card built from the real site primitives — the actual
// FlusoWordmark, the legacy app illustration, the hero badge + Swiss flag, the
// cream-on-radial-gradient hero treatment and the shared type tokens.
//
// This is NOT wired into the SPA router — it is rendered only by the dev-only
// harness at tools/og/og.html (see tools/og/main.tsx), which is used to
// regenerate assets/og/<slug>.png. Nothing in the app imports it, so it never
// ships to production.

// The hero's "Engineered in Switzerland" badge, verbatim.
function Badge({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-(--border-soft)",
        "bg-white/55 px-4 py-2 text-[17px] font-medium backdrop-blur-[6px]",
      )}
    >
      <svg className="block shrink-0" viewBox="0 0 32 32" width="17" height="17" aria-hidden="true">
        <rect width="32" height="32" rx="4" fill="#DA291C" />
        <rect x="13" y="6" width="6" height="20" fill="#fff" />
        <rect x="6" y="13" width="20" height="6" fill="#fff" />
      </svg>
      {children}
    </div>
  );
}

export default function OgCard({ route }: { route: string }) {
  const data: OgEntry = OG_DATA[route] ?? OG_DATA["/"];

  return (
    <div
      id={"og-" + slugForRoute(route)}
      className="theme-light relative h-[630px] w-[1200px] overflow-hidden bg-cream text-(--text-primary)"
      data-og-card
    >
      {/* same warm radial wash the hero uses */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 88% 0%, rgba(12,12,12,0.05), transparent 55%)",
        }}
      />

      <div className="relative z-[1] grid h-full grid-cols-[0.92fr_1.08fr] items-center gap-12 px-[72px]">
        {/* copy */}
        <div className="flex min-w-0 flex-col items-start">
          <FlusoWordmark className="mb-12 h-[30px] w-auto text-ink" />
          <Badge>{data.badge ?? OG_DEFAULT_BADGE}</Badge>
          <h1
            className={cn(
              "mt-7 mb-0 -ml-[0.04em] font-medium whitespace-pre-line",
              TYPE_DISPLAY,
            )}
          >
            {data.title}
          </h1>
          <p className="mt-6 mb-0 max-w-[26ch] text-[23px] leading-[1.32] font-normal text-(--text-muted)">
            {data.subtitle}
          </p>
        </div>

        {/* product mockup, bleeding off the right edge like the hero */}
        <div className="relative h-full">
          <div className="absolute top-1/2 left-0 w-[860px] -translate-y-1/2">
            <div className="rounded-[18px] shadow-[0_50px_120px_-40px_rgba(12,12,12,0.5)]">
              <LegacyAppMockup />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
