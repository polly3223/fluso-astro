import { useTranslation } from "react-i18next";
import { cn } from "@/utils/styles";
import BloomCard from "@/components/BloomCard";
import { CARD_BODY } from "@/components/cardChrome";

export type Feature = { title: string; desc: string };

export type Connector =
  | { kind: "logo"; src: string; label: string }
  | { kind: "mono"; bg: string; badge: string; label: string };

// One i18n namespace per persona page; all share this identical key shape.
export type PersonaNs =
  | "founders"
  | "investors"
  | "marketers"
  | "researchers"
  | "doctors"
  | "consultants"
  | "sales"
  | "operations";

export type IndustryPageProps = {
  ns: PersonaNs;
  backgroundLayer: boolean;
  connectors: Connector[];
  ctaHref: string;
};

const columnLabelCn = cn(
  "mb-[18px] border-b border-(--border-soft) pb-2.5",
  "font-(family-name:--font-jbmono) text-[12px] font-medium tracking-[0.16em] uppercase",
  "text-(--text-muted)",
);

function FeatureItem({ title, desc }: Feature) {
  return (
    <div className="mb-[18px] last:mb-0">
      <div className="mb-[5px] text-[16.5px] leading-[1.25] font-medium tracking-[-0.012em] text-(--text-primary)">
        {title}
      </div>
      <div className="max-w-[38ch] text-[14px] leading-[1.55] text-(--text-muted) max-[1024px]:max-w-full">
        {desc}
      </div>
    </div>
  );
}

function ConnectorPill(c: Connector) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-md border border-(--border-soft) bg-(--card-bg)",
        "py-1.5 pr-3 pl-2 text-[13px] font-medium text-(--text-primary)",
        "transition-[border-color,transform] duration-200 ease-[ease] motion-reduce:transition-none",
        "hover:-translate-y-px hover:border-[rgba(12,12,12,0.3)]",
      )}
    >
      {c.kind === "logo" ? (
        <span className="mt-0.5 inline-flex size-3.5 shrink-0 items-center justify-center select-none [-webkit-user-drag:none]">
          <img src={c.src} alt="" width="14" height="14" loading="lazy" decoding="async" className="block size-3.5" />
        </span>
      ) : (
        <span
          className={cn(
            "inline-block size-3.5 shrink-0 rounded-[3px] text-center",
            "font-(family-name:--font-jbmono) text-[8.5px] leading-[14px] font-bold tracking-normal uppercase text-white",
          )}

          style={{ background: c.bg }}
        >
          {c.badge}
        </span>
      )}
      {c.label}
    </span>
  );
}

export default function IndustryPage({
  ns,
  connectors,
  ctaHref,
}: IndustryPageProps) {
  const { t } = useTranslation(ns);
  const { t: tc } = useTranslation("common");
  const customSkills = t("customSkills", { returnObjects: true }) as Feature[];
  const automations = t("automations", { returnObjects: true }) as Feature[];

  return (
    <>
      <div className="relative z-2 isolate flex flex-col gap-4 overflow-x-clip p-4" id="top">
        <BloomCard hero id="hero" className="scroll-mt-[calc(var(--nav-h)+18px)]">
          <main
            data-nav-light
            className={cn(
              CARD_BODY,
              "theme-light min-h-[calc(100dvh-2rem)] bg-(--card-bg) text-(--text-primary)",
              "px-[clamp(28px,4.4vw+8px,80px)] pb-[clamp(40px,6vh,72px)] pt-[calc(var(--nav-h)+clamp(56px,7vh,96px))]",
              "max-md:px-[clamp(20px,5vw,28px)] max-[1024px]:min-h-0",
            )}
          >

            <div
              className={cn(
                "pointer-events-none absolute top-1/2 -right-20 z-1",
                "-translate-y-1/2 -rotate-90 whitespace-nowrap",
                "text-[92px] font-bold tracking-[-0.02em] text-[rgba(12,12,12,0.04)]",
                "max-[1024px]:hidden",
              )}
            >
              {t("stamp")}
            </div>

            <div className="relative z-2 mb-2 max-[1024px]:mb-[18px]">
              <h1 className="ml-[-0.05em] text-[64px] leading-[0.9] font-medium tracking-[-0.04em] max-[1024px]:text-[48px] max-[640px]:text-[38px]">
                {t("title")}
              </h1>
              <p
                className={cn(
                  "mt-[22px] max-w-[540px] text-[22px] leading-[1.42] font-normal tracking-[-0.01em] text-(--text-muted)",
                  "[&_b]:font-medium [&_b]:text-(--text-primary) [&_strong]:font-medium [&_strong]:text-(--text-primary)",
                  "max-[1024px]:text-[19px] max-[640px]:text-[17px]",
                )}
              >
                {t("lead")}
              </p>
            </div>

            <div
              className={cn(
                "relative z-2 mt-7 grid min-h-0 grow grid-cols-[1fr_1fr_0.9fr] gap-11",
                "max-[1024px]:mt-6 max-[1024px]:grid-cols-1 max-[1024px]:gap-8",
              )}
            >
              <section>
                <div className={columnLabelCn}>{tc("industryPage.customSkills")}</div>
                {customSkills.map((f, i) => (
                  <FeatureItem key={i} title={f.title} desc={f.desc} />
                ))}
              </section>

              <section>
                <div className={columnLabelCn}>{tc("industryPage.automations")}</div>
                {automations.map((f, i) => (
                  <FeatureItem key={i} title={f.title} desc={f.desc} />
                ))}
              </section>

              <section>
                <div className={columnLabelCn}>{tc("industryPage.connectors")}</div>
                <div className="flex flex-wrap gap-[7px]">
                  {connectors.map((c, i) => (
                    <ConnectorPill key={i} {...c} />
                  ))}
                </div>
              </section>
            </div>

            <footer
              className={cn(
                "relative z-2 mt-auto grid grid-cols-[2fr_3fr_auto] items-center gap-10 border-t border-(--border-color) pt-5",
                "max-[1024px]:mt-7 max-[1024px]:grid-cols-1 max-[1024px]:gap-[18px]",
              )}
            >

              <div className="flex flex-col items-center gap-1">
                <span className="text-[14px] font-medium text-(--text-primary)">{t("footerMetaLabel")}</span>
              </div>
              <p className="max-w-[56ch] text-[14.5px] leading-[1.55] tracking-[-0.005em] text-(--text-muted)">
                {t("footerBlurb")}
              </p>
              <a
                className={cn(
                  "inline-flex items-center gap-2 rounded-md bg-(--text-primary) px-6 py-[13px]",
                  "text-[14px] font-medium whitespace-nowrap text-(--card-bg) no-underline",
                  "transition-[opacity,transform] duration-200 ease-[ease] motion-reduce:transition-none",
                  "hover:translate-x-0.5 hover:opacity-85",
                  "max-[1024px]:w-fit",
                )}
                href={ctaHref}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("ctaLabel")}
                <svg className="size-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 7h8M7 3l4 4-4 4"/></svg>
              </a>
            </footer>
          </main>
        </BloomCard>
      </div>
    </>
  );
}
