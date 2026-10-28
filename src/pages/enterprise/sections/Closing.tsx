import { Link } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";
import { cn } from "@/utils/styles";
import BloomCard from "@/components/BloomCard";
import { ARROW_SVG_PROPS, CARD_BODY, KICKER, TITLE } from "@/components/cardChrome";

export default function Closing() {
  const { t } = useTranslation("enterprise");

  return (
    <BloomCard id="closing" className="scroll-mt-[calc(var(--nav-h)+18px)]">
      <main
        data-nav-light
        className={cn(
          CARD_BODY,
          "theme-light items-center bg-(--card-bg) text-center text-(--text-primary)",
          "px-[clamp(28px,4.4vw+8px,80px)] py-[clamp(64px,9vh,128px)]",
          "max-md:px-[clamp(20px,5vw,28px)] max-md:py-[clamp(48px,7vh,72px)]",
        )}
      >
        {/*<span className={cn(KICKER, "mb-[clamp(14px,2vh,22px)]")}>Get started</span>*/}
        <h2 className={cn(TITLE, "ml-0 max-w-[16ch]")}>
          <Trans t={t} i18nKey="closing.title" components={{ br: <br /> }} />
        </h2>
        <p className="mt-(--title-mt) max-w-[52ch] text-(length:--subtitle-size) font-normal leading-[1.45] tracking-[-0.01em] text-(--text-muted)">
          {t("closing.subtitle")}
        </p>
        <div className="mt-[clamp(24px,3.4vh,40px)] flex flex-wrap items-center justify-center gap-3">
          <a
            className={cn(
              "group/cta inline-flex cursor-pointer items-center gap-2.5 rounded-full border border-transparent no-underline",
              "bg-ink px-[30px] py-4 text-[15px] font-medium tracking-[-0.005em] text-bone",
              "shadow-[0_14px_32px_rgba(12,12,12,0.18),0_2px_6px_rgba(12,12,12,0.1)]",
              "transition-[background,transform] duration-[180ms] ease-[ease] hover:-translate-y-px hover:bg-[#1a1a1a]",
              "[&_svg]:size-3.5 [&_svg]:transition-transform [&_svg]:duration-[180ms] [&_svg]:ease-[ease] hover:[&_svg]:translate-x-0.5",
            )}
            href="https://form.typeform.com/to/vZnBDhzs"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("closing.ctaPrimary")}
            <svg {...ARROW_SVG_PROPS} aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
          </a>
          <a
            className={cn(
              "group/cta inline-flex cursor-pointer items-center gap-2.5 rounded-full no-underline",
              "border border-[rgba(12,12,12,0.25)] bg-transparent px-[30px] py-4 text-[15px] font-medium tracking-[-0.005em] text-(--text-primary)",
              "transition-[background,border-color,transform] duration-[180ms] ease-[ease] hover:-translate-y-px hover:border-[rgba(12,12,12,0.5)] hover:bg-white/50",
              "[&_svg]:size-3.5 [&_svg]:transition-transform [&_svg]:duration-[180ms] [&_svg]:ease-[ease] hover:[&_svg]:translate-x-0.5",
            )}
            href="/pricing"
          >
            {t("closing.ctaSecondary")}
            <svg {...ARROW_SVG_PROPS} aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
          </a>
        </div>
        <p className="mt-5 text-[13px] text-(--text-muted)">
          <Trans
            t={t}
            i18nKey="closing.footnote"
            components={{
              try: (
                <Link to="/get-started" className="border-b border-[rgba(12,12,12,0.25)] pb-px text-(--text-primary) no-underline transition-[border-color] duration-[180ms] ease-[ease] hover:border-current" />
              ),
            }}
          />
        </p>
      </main>
    </BloomCard>
  );
}
