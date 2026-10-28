import { Link } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";
import { useDownloadBehavior } from "./useDownloadBehavior";
import { cn } from "@/utils/styles";
import BloomCard from "@/components/BloomCard";
import { CARD, CARD_BODY, SUBTITLE, TITLE } from "@/components/cardChrome";

const stepNumCls =
  "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-(--text-primary) font-mono text-[11.5px] text-(--card-bg)";
const stepBodyCls =
  "text-[15px] leading-[1.5] tracking-[-0.005em] text-(--text-primary) [&_strong]:font-medium";
const footerLinkCls =
  "border-b border-[rgba(12,12,12,0.25)] no-underline transition-[border-color] duration-180 ease-[ease] hover:border-current";

type TrustFact = { label: string; body: string };

const FACT_ICONS = [
  (
    <>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10 15 15 0 0 1 4-10z" />
    </>
  ),
  (
    <>
      <path d="M21 12a9 9 0 0 1-15.4 6.4M3 12a9 9 0 0 1 15.4-6.4" />
      <path d="M21 4v5h-5M3 20v-5h5" />
    </>
  ),
];

export default function Download() {
  const { t } = useTranslation("download");
  useDownloadBehavior();

  const facts = t("trust", { returnObjects: true }) as TrustFact[];

  return (
    <div className="relative z-2 isolate flex flex-col gap-4 overflow-x-clip p-4">

      <BloomCard hero id="download">
        <main
          data-nav-light
          className={cn(
            CARD_BODY,
            "theme-light min-h-[calc(100dvh-2rem)] bg-(--card-bg) text-(--text-primary)",
            "px-[clamp(28px,4.4vw+8px,80px)] pb-[clamp(28px,4vh,48px)] pt-[calc(var(--nav-h)+clamp(52px,6.5vh,88px))]",
            "max-[1024px]:min-h-0 max-[1024px]:px-7 max-[1024px]:pb-9",
            "max-[640px]:px-[22px] max-[640px]:pb-7",
          )}
        >
          <div className="relative z-10">
            {/*<span className={cn(KICKER, "mb-[clamp(14px,2vh,22px)] block")}>Download</span>*/}
            <h1 className={TITLE}>
              <Trans t={t} i18nKey="hero.title" components={{ br: <br /> }} />
            </h1>
            <p className={cn(SUBTITLE, "max-w-[520px] max-[1024px]:max-w-full")}>
              {t("hero.subtitle")}
            </p>
          </div>

          <div className="relative z-10 my-auto grid min-h-0 grid-cols-[1.05fr_1fr] gap-[clamp(40px,6vw,80px)] pt-[clamp(24px,3.6vh,44px)] max-[1024px]:grid-cols-1 max-[1024px]:gap-8">

            <div className="flex flex-col">
              {/*<span className={cn(KICKER, "mb-3.5 inline-block")} id="dl-detected-label">Detected</span>*/}

              <a
                id="dl-primary"
                className={cn(
                  "group flex cursor-pointer items-center gap-4.5",
                  "rounded-[18px] border border-transparent bg-(--text-primary) px-6 py-5.5 text-(--card-bg) no-underline",
                  "shadow-[0_14px_32px_rgba(12,12,12,0.18),0_2px_6px_rgba(12,12,12,0.1)]",
                  "transition-[background,border-color,transform] duration-180 ease-[ease]",
                  "[-webkit-tap-highlight-color:transparent]",
                  "hover:-translate-y-px hover:bg-[#1a1a1a]",
                  "max-[640px]:px-4.5 max-[640px]:py-4.5",
                )}
                href="https://fluso-releases.s3.amazonaws.com/desktop/prod/Fluso-latest-arm64.dmg"
                download
                data-platform="mac-arm64"
              >
                <svg className="shrink-0" width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" data-icon>
                  <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.05.28.05.43zm4.565 15.71c-.03.07-.463 1.58-1.518 3.12-.945 1.34-1.94 2.71-3.43 2.71-1.517 0-1.9-.88-3.63-.88-1.698 0-2.302.91-3.67.91-1.377 0-2.332-1.26-3.428-2.8-1.287-1.82-2.323-4.63-2.323-7.28 0-4.28 2.797-6.55 5.552-6.55 1.448 0 2.675.95 3.6.95.865 0 2.222-1.01 3.902-1.01.613 0 2.886.06 4.374 2.19-.13.09-2.383 1.37-2.383 4.19 0 3.26 2.854 4.42 2.955 4.45z" />
                </svg>
                <span className="flex min-w-0 flex-auto flex-col gap-[3px] text-left">
                  <span className="text-[17px] leading-[1.2] font-medium tracking-[-0.01em]" data-title>{t("platforms.primary.title")}</span>
                  <span className="font-mono text-[11px] leading-[1.3] tracking-[0.12em] uppercase text-[rgba(242,241,237,0.65)]" data-meta>{t("platforms.primary.meta")}</span>
                </span>
                <svg className="shrink-0 opacity-85 transition-transform duration-180 ease-[ease] group-hover:translate-y-0.5" width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M8 2.5v8.5M4.5 7.5L8 11l3.5-3.5M3 14h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>

              <div className="mt-3.5 grid grid-cols-2 gap-2.5 max-[640px]:grid-cols-1" id="dl-others">

              </div>

              <p className="mt-5 text-[13.5px] leading-[1.5] text-(--text-muted)">
                {t("platforms.footnote")}
              </p>
            </div>

            <div className="flex flex-col border-l border-(--border-soft) pl-[clamp(24px,3vw,40px)] max-[1024px]:border-l-0 max-[1024px]:border-t max-[1024px]:pl-0 max-[1024px]:pt-7">
              {/*<span className={cn(KICKER, "mb-3.5")}>Install</span>*/}
              <ol className="flex list-none flex-col gap-[clamp(16px,1.8vh+4px,22px)]">
                <li className="flex gap-4">
                  <span className={stepNumCls}>1</span>
                  <span className={stepBodyCls}>
                    <Trans
                      t={t}
                      i18nKey="install.steps.quit"
                      components={{
                        strong: <strong />,
                        kbd: (
                          <span
                            className="rounded-[5px] border border-[rgba(12,12,12,0.12)] bg-[rgba(12,12,12,0.06)] px-[7px] py-px font-mono text-[11.5px] tracking-[0.01em] whitespace-nowrap"
                            id="dl-quit-kbd"
                          />
                        ),
                      }}
                    />
                  </span>
                </li>
                <li className="flex gap-4">
                  <span className={stepNumCls}>2</span>
                  <span className={stepBodyCls} id="dl-step-2">
                    <Trans t={t} i18nKey="install.steps.open.mac" components={{ strong: <strong /> }} />
                  </span>
                </li>
                <li className="flex gap-4">
                  <span className={stepNumCls}>3</span>
                  <span className={stepBodyCls} id="dl-step-3">
                    <Trans t={t} i18nKey="install.steps.place.mac" components={{ strong: <strong /> }} />
                  </span>
                </li>
                <li className="flex gap-4">
                  <span className={stepNumCls}>4</span>
                  <span className={stepBodyCls}>
                    {t("install.steps.signIn")}
                  </span>
                </li>
              </ol>
              <p className="mt-5.5 text-[13.5px] leading-[1.5] tracking-[-0.005em] text-(--text-muted)">
                <Trans
                  t={t}
                  i18nKey="install.help"
                  components={{
                    switch: <a href="#dl-others" className="text-(--text-primary)" />,
                    email: <a href="mailto:fluso@premai.io" className="text-(--text-primary)" />,
                  }}
                />
              </p>
            </div>
          </div>

          <div className="relative z-10 items-center gap-[clamp(24px,4vw,52px)] border-t border-(--border-soft) pt-[clamp(14px,2vh,22px)] max-[1024px]:mt-8 max-[1024px]:grid-cols-1 max-[1024px]:gap-3">
            {/*<div className={KICKER}>Guarantee</div>*/}
            <div className="text-[clamp(14px,0.4vh+13px,15.5px)] leading-[1.55] tracking-[-0.01em] text-(--text-muted) [&_a]:text-(--text-primary)">
              <Trans
                t={t}
                i18nKey="guarantee"
                components={{
                  terms: <Link to="/terms" className={footerLinkCls} />,
                  privacy: <Link to="/privacy" className={footerLinkCls} />,
                }}
              />
            </div>
          </div>
        </main>
      </BloomCard>

      <section id="dl-trust" className={CARD}>
        <main
          className={cn(
            "theme-dark relative flex flex-col bg-(--card-bg) text-bone",
            "px-[clamp(28px,4.4vw+8px,80px)] py-[clamp(40px,6vh,72px)]",
            "max-md:px-[clamp(20px,5vw,28px)] max-md:py-9",
          )}
        >
          <div className="grid grid-cols-3 gap-[clamp(24px,3vw,48px)] max-[980px]:grid-cols-1 max-[980px]:gap-6">
            {facts.map((f, i) => (
              <div
                key={f.label}
                className={cn(
                  "flex flex-col gap-2.5 border-r border-(--border-soft) pr-7 [&:last-child]:border-r-0 [&:last-child]:pr-0",
                  "max-[980px]:border-b max-[980px]:border-r-0 max-[980px]:pb-5 max-[980px]:pr-0 max-[980px]:[&:last-child]:border-b-0 max-[980px]:[&:last-child]:pb-0",
                )}
              >
                <span className="inline-flex size-9 items-center justify-center text-(--text-primary) [&_svg]:size-[26px]" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{FACT_ICONS[i]}</svg>
                </span>
                <span className="font-mono text-[10.5px] font-medium uppercase tracking-[0.16em] text-(--text-muted)">{f.label}</span>
                <span className="max-w-[40ch] text-[14.5px] leading-[1.55] text-(--text-muted)">{f.body}</span>
              </div>
            ))}
          </div>
        </main>
      </section>
    </div>
  );
}
