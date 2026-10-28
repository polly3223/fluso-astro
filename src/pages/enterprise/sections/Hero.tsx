import { Link } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";
import { cn } from "@/utils/styles";
import BloomCard from "@/components/BloomCard";
import { ARROW_SVG_PROPS, BTN_GHOST, BTN_PRIMARY, CARD_BODY, SUBTITLE, TITLE } from "@/components/cardChrome";

export default function Hero() {
  const { t } = useTranslation("enterprise");
  const trust = t("hero.trust", { returnObjects: true }) as string[];

  return (
    <BloomCard hero id="hero" className="scroll-mt-[calc(var(--nav-h)+18px)]">
      <main
        data-nav-light
        className={cn(
          CARD_BODY,
          "theme-light min-h-[calc(100dvh-2rem)] bg-(--card-bg) text-(--text-primary)",
          "max-[1024px]:min-h-0",
        )}
      >
        <div className="grid flex-[1_1_auto] grid-cols-[1.02fr_1fr] max-[1024px]:grid-cols-1">

          <div
            className={cn(
              "flex flex-col border-r border-(--border-soft)",
              "px-[clamp(32px,4vw+8px,72px)] pb-[clamp(28px,4vh,48px)] pt-[calc(var(--nav-h)+clamp(60px,8vh,112px))]",
              "max-[1024px]:border-r-0 max-[1024px]:border-b max-[1024px]:px-7 max-[1024px]:pb-9",
              "max-[640px]:px-[22px]",
            )}
          >

            <div className="my-auto">
              {/*<span className={cn(KICKER, "mb-[clamp(16px,2.4vh,26px)] block")}>Enterprise</span>*/}
              <h1 className={TITLE}>
                <Trans t={t} i18nKey="hero.title" components={{ br: <br /> }} />
              </h1>
              <p className={cn(SUBTITLE, "max-w-[440px] max-[1024px]:max-w-full")}>
                {t("hero.subtitle")}
              </p>
              <div className="mt-[clamp(24px,3.4vh,40px)] flex flex-wrap items-center gap-3">
                <a className={BTN_PRIMARY} href="https://form.typeform.com/to/vZnBDhzs" target="_blank" rel="noopener noreferrer">
                  {t("hero.ctaPrimary")}
                  <svg {...ARROW_SVG_PROPS} aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </a>
                <Link className={BTN_GHOST} to="/pricing">
                  {t("hero.ctaSecondary")}
                  <svg {...ARROW_SVG_PROPS} aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </Link>
              </div>
            </div>

            <ul
              role="list"
              className={cn(
                "mt-[clamp(28px,4vh,48px)] flex list-none flex-wrap gap-x-7 gap-y-2.5 border-t border-(--border-soft) pt-[clamp(16px,2.2vh,24px)]",
                "max-[1024px]:mt-9",
              )}
            >
              {trust.map((label) => (
                <li key={label} className="flex items-center gap-2.5 text-[15px] font-normal tracking-[-0.005em] text-ink/75">
                  <svg width="19" height="19" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0 text-(--text-primary)">
                    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.25" opacity="0.35" />
                    <path d="M4.8 8.2 7 10.4 11.2 6.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {label}
                </li>
              ))}
            </ul>
          </div>

          <div
            className={cn(
              "relative min-w-0 overflow-hidden bg-white",
              "max-[1024px]:mx-7 max-[1024px]:mb-9 max-[1024px]:mt-8 max-[1024px]:h-80 max-[1024px]:rounded-xl max-[1024px]:border max-[1024px]:border-(--border-soft)",
              "max-[640px]:mx-[22px]",
            )}
          >
            <canvas id="contours-canvas" aria-hidden="true" className="absolute inset-0 block h-full! w-full! [filter:contrast(1.05)]" />
            <div className="pointer-events-none absolute inset-0 z-[5] shadow-[inset_0_0_80px_rgba(255,255,255,1)]" />
            <div className="absolute right-[22px] top-[calc(var(--nav-h)+26px)] z-10 flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-[rgba(12,12,12,0.5)] max-[1024px]:top-[18px]">
              <span className="ent-anim size-2 rounded-full bg-[#c4633c] [animation:dotPulse_2.4s_ease-in-out_infinite]" />
              {t("hero.live")}
            </div>
            <div className="absolute bottom-[22px] left-[22px] z-10 flex items-center gap-3 rounded-[8px] border border-(--border-soft) bg-[rgba(253,252,251,0.9)] px-3.5 py-2 font-mono text-[11px] text-(--text-primary) backdrop-blur-[4px]">
              <span className="size-2 rounded-full bg-ink" />
              <span className="font-medium opacity-[0.42]">01</span>
              <span className="font-medium uppercase tracking-[0.08em]">{t("hero.vizLabel")}</span>
            </div>
          </div>
        </div>
      </main>
    </BloomCard>
  );
}
