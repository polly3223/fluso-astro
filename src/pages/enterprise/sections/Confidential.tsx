import { Trans, useTranslation } from "react-i18next";
import { cn } from "@/utils/styles";
import { CARD, CARD_PAD, KICKER, SUBTITLE, TITLE } from "@/components/cardChrome";

const LETTERS = ["A", "B", "C"];

const item =
  "grid grid-cols-[22px_1fr_auto] items-baseline gap-x-4 gap-y-1 border-b border-(--border-soft) py-[20px] transition-[padding-left] duration-[0.25s] ease-[ease] last:border-b-0 hover:pl-1.5";

export default function Confidential() {
  const { t } = useTranslation("enterprise");
  const items = t("confidential.items", { returnObjects: true }) as { name: string; tag: string; spec: string[] }[];

  return (
    <section id="confidential" className={cn(CARD, "scroll-mt-[calc(var(--nav-h)+18px)]")}>

      <main className={cn("theme-dark relative flex flex-col bg-(--card-bg) bg-(image:--dark-card-glow) text-bone", CARD_PAD)}>
        <div className="relative z-10 grid grid-cols-[1.02fr_1fr] gap-[clamp(40px,4vw+16px,80px)] max-[1024px]:grid-cols-1 max-[1024px]:gap-8">
          <div className="flex min-w-0 flex-col">
            {/*<span className={cn(KICKER, "mb-[clamp(14px,2vh,22px)]")}>04 / Confidential computing</span>*/}
            <h2 className={TITLE}>
              <Trans t={t} i18nKey="confidential.title" components={{ br: <br /> }} />
            </h2>
            <p className={cn(SUBTITLE, "max-w-[48ch] max-[1024px]:max-w-full")}>
              <Trans t={t} i18nKey="confidential.subtitle" components={{ strong: <strong /> }} />
            </p>
            <a
              className="mt-[clamp(20px,3vh,32px)] inline-flex items-center gap-3 self-start text-inherit no-underline opacity-[0.82] transition-opacity duration-[0.18s] ease-[ease] hover:opacity-100"
              href="https://premai.io"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("confidential.poweredByAria")}
            >
              <span className="whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.14em] text-(--text-muted)">{t("confidential.poweredBy")}</span>
              <img src="/assets/prem-logo-white.png" alt="Prem AI" className="block h-5 w-auto" />
            </a>
          </div>

          <div className="flex flex-col border-t border-(--border-soft)">
            {items.map((d, index) => (
              <div key={LETTERS[index]} className={item}>
                <span className="self-start pt-[3px] font-mono text-[11.5px] font-medium tracking-[0.08em] text-[rgba(242,241,237,0.4)] [grid-row:1/3]">{LETTERS[index]}</span>
                <h4 className="text-[18px] font-medium leading-[1.25] tracking-[-0.01em] text-(--text-primary) [grid-column:2] [grid-row:1]">{d.name}</h4>
                <span className="self-start whitespace-nowrap pt-1 font-mono text-[10.5px] uppercase tracking-[0.12em] text-(--text-muted) [grid-column:3] [grid-row:1]">{d.tag}</span>
                <p className="text-[14px] leading-[1.55] text-(--text-muted) [grid-column:2/4] [grid-row:2]">
                  {d.spec[0]}
                  <span className="mx-1.5 inline-block text-[rgba(242,241,237,0.28)]">/</span>
                  {d.spec[1]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </section>
  );
}
