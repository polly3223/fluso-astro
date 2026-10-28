import { Trans, useTranslation } from "react-i18next";
import { cn } from "@/utils/styles";
import { CARD, KICKER, TITLE } from "@/components/cardChrome";

type Cta = { href: string; variant: "primary" | "ghost"; external?: boolean };

const CTAS: Cta[] = [
  { href: "/get-started", variant: "primary" },
  { href: "https://form.typeform.com/to/vZnBDhzs", variant: "ghost", external: true },
];

const CTA_BASE =
  "group/cta inline-flex items-center gap-2.5 py-4 px-[28px] rounded-full text-[15px] font-medium tracking-[-0.005em] no-underline cursor-pointer border border-transparent font-[inherit] transition-[background,color,border-color,transform] duration-[180ms] ease-[ease] hover:-translate-y-px";

export default function Closing() {
  const { t } = useTranslation("pricing");
  const ctaLabels = t("closing.ctas", { returnObjects: true }) as string[];

  return (
    <section id="closing" className={cn(CARD, "scroll-mt-[calc(var(--nav-h)+18px)]")}>
      <main
        className={cn(
          "theme-dark relative flex flex-col items-center bg-(--card-bg) bg-(image:--dark-card-glow) text-center text-bone",
          "px-[clamp(28px,4.4vw+8px,80px)] py-[clamp(64px,9vh,128px)]",
          "max-md:px-[clamp(20px,5vw,28px)] max-md:py-[clamp(48px,7vh,72px)]",
        )}
      >
        <div className="relative z-10 flex flex-col items-center">
          {/*<span className={cn(KICKER, "mb-[clamp(14px,2vh,22px)]")}>Get started</span>*/}
          <h2 className={cn(TITLE, "ml-0 max-w-[18ch]")}>
            <Trans t={t} i18nKey="closing.title" components={{ br: <br /> }} />
          </h2>
          <p className="mt-(--title-mt) max-w-[56ch] text-(length:--subtitle-size) leading-[1.5] text-(--text-muted)">
            {t("closing.subtitle")}
          </p>
          <div className="mt-[clamp(24px,3.4vh,40px)] flex flex-wrap justify-center gap-3">
            {CTAS.map((c, i) => (
              <a
                key={c.href}
                className={cn(
                  CTA_BASE,
                  c.variant === "primary"
                    ? "bg-bone text-ink border-bone shadow-[0_14px_32px_rgba(0,0,0,0.25)] hover:bg-white hover:border-white"
                    : "bg-transparent text-bone border-[rgba(242,241,237,0.3)] hover:bg-[rgba(242,241,237,0.08)] hover:border-[rgba(242,241,237,0.55)]",
                )}
                href={c.href}
                {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {ctaLabels[i]}
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="transition-transform duration-[180ms] ease-[ease] group-hover/cta:translate-x-0.5"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </a>
            ))}
          </div>
        </div>
      </main>
    </section>
  );
}
