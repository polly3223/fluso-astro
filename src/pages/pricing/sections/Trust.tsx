import { Trans, useTranslation } from "react-i18next";
import { cn } from "@/utils/styles";
import { CARD, CARD_PAD, KICKER, SUBTITLE, TITLE } from "@/components/cardChrome";

type TrustText = { label: string; heading: string; body: string };

const ICONS: React.ReactNode[] = [
  <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" />,
  (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M9 3v18" />
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
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
];

export default function Trust() {
  const { t } = useTranslation("pricing");
  const items = t("trust.items", { returnObjects: true }) as TrustText[];

  return (
    <section id="trust" className={cn(CARD, "scroll-mt-[calc(var(--nav-h)+18px)]")}>
      <main
        className={cn("theme-dark relative flex flex-col bg-(--card-bg) bg-(image:--dark-card-glow) text-bone", CARD_PAD)}
        aria-labelledby="trust-title"
      >
        <div className="relative z-10 mb-[clamp(32px,4.4vh,56px)]">
          {/*<span className={cn(KICKER, "mb-[clamp(14px,2vh,22px)] block")}>Included everywhere</span>*/}
          <h2 id="trust-title" className={TITLE}>
            <Trans t={t} i18nKey="trust.title" components={{ br: <br /> }} />
          </h2>
          <p className={cn(SUBTITLE, "max-w-[56ch]")}>
            {t("trust.subtitle")}
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-4 gap-[clamp(20px,2.4vw,36px)] max-[980px]:grid-cols-2 max-[980px]:gap-6 max-[560px]:grid-cols-1 max-[560px]:gap-[18px]">
          {items.map((item, i) => (
            <div
              key={item.label}
              className={cn(
                "flex flex-col gap-2 border-r border-(--border-soft) pr-6 [&:last-child]:border-r-0 [&:last-child]:pr-0",
                "max-[980px]:border-b max-[980px]:border-r-0 max-[980px]:border-b-(--border-soft) max-[980px]:pb-4 max-[980px]:pr-0 max-[980px]:[&:nth-last-child(-n+2)]:border-b-0 max-[980px]:[&:nth-last-child(-n+2)]:pb-0",
                "max-[560px]:border-b! max-[560px]:border-b-(--border-soft) max-[560px]:pb-3.5 max-[560px]:[&:last-child]:border-b-0! max-[560px]:[&:last-child]:pb-0",
              )}
            >
              <span className="inline-flex size-9 items-center justify-center text-(--text-primary) [&_svg]:size-[26px]" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{ICONS[i]}</svg>
              </span>
              <span className="font-mono text-[10.5px] font-medium uppercase tracking-[0.16em] text-(--text-muted)">{item.label}</span>
              <span className="text-[19px] font-medium leading-[1.25] tracking-[-0.01em] text-(--text-primary)">{item.heading}</span>
              <span className="max-w-[34ch] text-[14.5px] leading-[1.5] text-(--text-muted)">{item.body}</span>
            </div>
          ))}
        </div>
      </main>
    </section>
  );
}
