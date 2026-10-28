import { Link } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";
import { cn } from "@/utils/styles";
import BloomCard from "@/components/BloomCard";
import FaqList from "@/components/FaqList";
import { CARD_BODY, CARD_PAD, TITLE } from "@/components/cardChrome";

const A = "text-[#0c0c0c] border-b border-b-[rgba(12,12,12,0.3)] no-underline hover:border-b-[#0c0c0c]";

export default function Faq() {
  const { t } = useTranslation("pricing");

  return (
    <BloomCard id="faq" className="scroll-mt-[calc(var(--nav-h)+18px)]">
      <main
        data-nav-light
        className={cn(CARD_BODY, "theme-light bg-(--card-bg) text-(--text-primary)", CARD_PAD)}
        aria-labelledby="faq-title"
      >
        <div className="grid grid-cols-[minmax(280px,1fr)_minmax(0,1.8fr)] items-start gap-[clamp(36px,5vw,84px)] max-[1024px]:grid-cols-1 max-[1024px]:gap-8">
          <aside className="sticky top-[calc(var(--nav-h)+32px)] max-[1024px]:static">
            {/*<span className={cn(KICKER, "mb-[clamp(14px,2vh,22px)] block")}>FAQ</span>*/}
            <h2 id="faq-title" className={TITLE}><Trans t={t} i18nKey="faq.title" components={{ br: <br /> }} /></h2>
            <p className="my-[18px] mb-7 max-w-[32ch] text-[clamp(16px,1vw+8px,18px)] leading-[1.55] text-[rgba(12,12,12,0.68)] max-[1024px]:max-w-none">{t("faq.subtitle")}</p>
            <a className="print:hidden inline-flex items-center gap-2 py-[14px] px-6 rounded-full bg-[#0c0c0c] text-[#faf9f5] text-[15px] font-medium tracking-[-0.005em] border border-[#0c0c0c] cursor-pointer font-[inherit] no-underline transition-[background,color] duration-[180ms] ease-[ease] hover:bg-[#1d1d1d]" href="https://form.typeform.com/to/vZnBDhzs" target="_blank" rel="noopener noreferrer">
              {t("faq.cta")}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </a>
            <span className="block mt-3.5 text-[13px] text-[rgba(12,12,12,0.5)]">
              <Trans
                t={t}
                i18nKey="faq.tryFree"
                components={{
                  tryfree: (
                    <Link className="text-[rgba(12,12,12,0.72)] border-b border-b-[rgba(12,12,12,0.18)] pb-px no-underline transition-[color] duration-[180ms] ease-[ease] hover:text-[#0c0c0c]" to="/get-started" />
                  ),
                }}
              />
            </span>
          </aside>

          <FaqList
            variant="light"
            answerComponents={{
              pricing: <Link className={A} to="/pricing" />,
              download: <Link className={A} to="/download" />,
              contact: <a className={A} href="https://form.typeform.com/to/vZnBDhzs" target="_blank" rel="noopener noreferrer" />,
            }}
          />
        </div>
      </main>
    </BloomCard>
  );
}
