import { Trans, useTranslation } from "react-i18next";
import { cn } from "@/utils/styles";
import BloomCard from "@/components/BloomCard";
import { CARD_BODY, SUBTITLE, TITLE } from "@/components/cardChrome";

// Structural plan data (icons, ids, variants, links). All text comes from
// i18n (pricing.plans.items) by index; the feature `icon`s map to the
// feature text at the same index.
type Plan = {
  id: string;
  icon: React.ReactNode;
  priceIsText?: boolean;
  price?: string;
  featureIcons: React.ReactNode[];
  ctaVariant: "primary" | "outline";
  ctaHref: string;
  ctaExternal?: boolean;
  featured?: boolean;
};

// i18n text for a single plan.
type PlanText = {
  name: string;
  desc: string;
  price?: string;
  period: string;
  includes: string;
  features: string[];
  cta: string;
};

const Check = ({ w = "2.4" }: { w?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
);

const PLANS: Plan[] = [
  {
    id: "free",
    icon: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </>
    ),
    priceIsText: true,
    featureIcons: [
      <Check />,
      <Check />,
      <Check />,
      <Check />,
      <Check />,
      <Check />,
      <Check />,
      <Check />,
    ],
    ctaVariant: "outline",
    ctaHref: "/get-started",
  },
  {
    id: "plus",
    icon: <path d="M12 2v20M2 12h20" />,
    price: "$10",
    featureIcons: [<Check />, <Check />, <Check />],
    ctaVariant: "outline",
    ctaHref: "/get-started",
  },
  {
    id: "pro",
    featured: true,
    icon: (
      <>
        <path d="M12 2 3 7v6c0 5 3.8 9.4 9 11 5.2-1.6 9-6 9-11V7l-9-5z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    price: "$30",
    featureIcons: [<Check />, <Check />, <Check />],
    ctaVariant: "primary",
    ctaHref: "/get-started",
  },
  {
    id: "ent",
    icon: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </>
    ),
    priceIsText: true,
    featureIcons: [
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /><circle cx="12" cy="16" r="1.4" fill="currentColor" /></svg>,
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="8" r="3.5" /><path d="M3 21a6 6 0 0 1 12 0" /><path d="m16 5 3 3-3 3" /></svg>,
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12c0 5-9 10-9 10S3 17 3 12a9 9 0 1 1 18 0z" /><circle cx="12" cy="12" r="3" /></svg>,
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h0a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5h0a1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v0a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" /></svg>,
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>,
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5v6c0 1.7 4 3 9 3s9-1.3 9-3V5M3 11v6c0 1.7 4 3 9 3s9-1.3 9-3v-6" /></svg>,
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M8 13h8M8 17h6M8 9h2" /></svg>,
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>,
      <Check />,
    ],
    ctaVariant: "outline",
    ctaHref: "https://form.typeform.com/to/vZnBDhzs",
    ctaExternal: true,
  },
];

function PlanCard({ plan, index }: { plan: Plan; index: number }) {
  const { featured } = plan;
  const { t } = useTranslation("pricing");
  const text = t(`plans.items.${index}` as never, { returnObjects: true }) as PlanText;
  const price = plan.priceIsText ? text.price! : plan.price!;

  const ctaCls = cn(
    "mt-6 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full px-5 py-4 font-[inherit] text-[14.5px] font-medium tracking-[-0.005em] no-underline transition-[background,color,border-color] duration-[180ms] ease-[ease]",
    featured
      ? "border border-bone bg-bone text-ink hover:bg-white"
      : "border border-ink bg-ink text-bone hover:bg-[#1d1d1d]",
  );

  return (
    <article
      className={cn(
        "relative flex flex-col rounded-[18px] p-7 px-[26px] transition-[border-color,box-shadow] duration-[180ms] ease-[ease] max-[720px]:px-[22px] max-[720px]:py-7",
        featured
          ?
            "theme-dark border border-ink bg-ink bg-(image:--dark-card-glow) text-bone shadow-[0_24px_60px_rgba(12,12,12,0.2)] [--card-bg:#0c0c0c] hover:border-[#2a2a2a]"
          : "border border-(--border-soft) bg-white/40 hover:border-[rgba(12,12,12,0.22)]",
      )}
      aria-labelledby={`plan-${plan.id}-name`}
    >
      {featured && (
        <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-ink px-4 py-1.5 font-mono text-[10.5px] font-medium uppercase tracking-[0.16em] text-bone outline outline-1 outline-[rgba(242,241,237,0.25)]">
          {t("plans.mostPopular")}
        </span>
      )}
      <header className="flex items-center gap-3">
        <span
          className={cn(
            "inline-flex size-10 shrink-0 items-center justify-center rounded-[11px] border text-(--text-primary) [&_svg]:size-5",
            featured ? "border-[rgba(242,241,237,0.14)] bg-[rgba(242,241,237,0.06)]" : "border-(--border-soft) bg-[rgba(12,12,12,0.04)]",
          )}
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{plan.icon}</svg>
        </span>
        <h3 id={`plan-${plan.id}-name`} className="text-[24px] font-medium tracking-[-0.015em] text-(--text-primary)">{text.name}</h3>
      </header>
      <p className="mt-3 min-h-[63px] text-[14.5px] leading-[1.5] text-(--text-muted) max-[720px]:min-h-0">{text.desc}</p>

      <div className="mb-6 mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-1 border-t border-(--border-soft) pt-[18px]">
        <span
          className={cn(
            "font-medium leading-none text-(--text-primary)",
            plan.priceIsText ? "text-[32px] tracking-[-0.022em]" : "text-[44px] tracking-[-0.03em]",
          )}
        >
          {price}
        </span>
        <span className="text-[14.5px] leading-[1.3] tracking-[-0.005em] text-(--text-muted)">{text.period}</span>
      </div>

      <div className="flex min-h-0 flex-auto flex-col">
        <div className="mb-4 mt-1.5 font-mono text-[10.5px] font-medium uppercase tracking-[0.14em] text-(--text-muted)">{text.includes}</div>
        <ul className="m-0 flex list-none flex-col gap-3 p-0">
          {plan.featureIcons.map((icon, i) => (
            <li key={i} className="relative pl-10 text-[14.5px] leading-[1.45] text-(--text-primary)">
              <span
                className={cn(
                  "absolute left-0 top-px inline-flex size-7 items-center justify-center rounded-md text-(--text-primary) [&_svg]:size-[15px]",
                  featured ? "bg-[rgba(242,241,237,0.08)]" : "bg-[rgba(12,12,12,0.06)]",
                )}
                aria-hidden="true"
              >
                {icon}
              </span>
              <Trans
                t={t}
                i18nKey={`plans.items.${index}.features.${i}` as never}
                components={{
                  strong: <strong className="font-medium" />,
                  muted: <span className="text-(--text-muted) before:content-['_']" />,
                }}
              />
            </li>
          ))}
        </ul>
      </div>

      <a
        className={ctaCls}
        href={plan.ctaHref}
        {...(plan.ctaExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {text.cta}
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </a>
    </article>
  );
}

export default function Plans() {
  const { t } = useTranslation("pricing");

  return (
    <BloomCard hero id="plans" className="scroll-mt-[calc(var(--nav-h)+18px)]">
      <main
        data-nav-light
        className={cn(
          CARD_BODY,
          "theme-light bg-(--card-bg) text-(--text-primary)",
          "px-[clamp(28px,4.4vw+8px,80px)] pb-[clamp(40px,6vh,72px)] pt-[calc(var(--nav-h)+clamp(56px,7vh,96px))]",
          "max-md:px-[clamp(20px,5vw,28px)]",
        )}
        aria-labelledby="pricing-title"
      >
        <div className="relative z-10 mb-[clamp(32px,4.4vh,56px)]">
          {/*<span className={cn(KICKER, "mb-[clamp(14px,2vh,22px)] block")}>Pricing</span>*/}
          <h1 id="pricing-title" className={TITLE}>
            <Trans t={t} i18nKey="plans.title" components={{ br: <br /> }} />
          </h1>
          <p className={cn(SUBTITLE, "max-w-[64ch]")}>
            {t("plans.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-4 items-stretch gap-[18px] pt-3 max-[1180px]:grid-cols-2 max-[1180px]:gap-4 max-[720px]:grid-cols-1 max-[720px]:gap-3.5">
          {PLANS.map((plan, index) => (
            <PlanCard key={plan.id} plan={plan} index={index} />
          ))}
        </div>
        <div className="mt-6 space-y-2 text-[14px] leading-relaxed text-(--text-muted)">
          <p>{t("plans.billingNote")}</p>
          <p>{t("plans.trialNote")}</p>
        </div>
      </main>
    </BloomCard>
  );
}
