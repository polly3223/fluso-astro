import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cn } from "@/utils/styles";
import { FlusoText } from "@/components/FlusoWordmark";

type InternalLink = { to: string; label: string };
type ExternalLink = { href: string; label: string; external: true };
export type FooterLink = InternalLink | ExternalLink;

const INDUSTRY_LINKS = [
  { to: "/for-founders", key: "founders" },
  { to: "/for-lawyers", key: "lawyers" },
  { to: "/for-investors", key: "investors" },
  { to: "/for-marketers", key: "marketers" },
  { to: "/for-researchers", key: "researchers" },
  { to: "/for-doctors", key: "doctors" },
  { to: "/for-consultants", key: "consultants" },
  { to: "/for-sales", key: "sales" },
  { to: "/for-operations", key: "operations" },
] as const;

const PRODUCT_LINKS = [
  { to: "/pricing", key: "pricing" },
  { to: "/enterprise", key: "enterprise" },
  { to: "/get-started", key: "getStarted" },
] as const;

const COMPANY_LINKS = [
  { href: "https://premai.io", key: "premai", external: true },
  { to: "/privacy", key: "privacy" },
  { to: "/terms", key: "terms" },
  { href: "https://form.typeform.com/to/vZnBDhzs", key: "contact", external: true },
] as const;

const SOCIALS = [
  { href: "https://github.com/prem-research", label: "GitHub", icon: "github" },
  { href: "https://www.linkedin.com/company/premai", label: "LinkedIn", icon: "linkedin" },
  { href: "https://x.com/premai_io", label: "X", icon: "x" },
] as const;

const LINK_CLS = cn(
  "group inline-flex items-center gap-[5px]",
  "text-sm leading-[1.3] text-bone/78 no-underline",
  "transition-[color,transform] duration-180 ease-[ease]",
  "hover:text-bone",
);

const COL_TITLE_CLS = cn(
  "mb-4 text-[10.5px] font-medium uppercase tracking-[0.18em]",
  "text-bone/42",
);

function LinkList({
  items,
  className,
}: {
  items: FooterLink[];
  className?: string;
}) {
  return (
    <ul className={cn("m-0 list-none p-0", className ?? "flex flex-col gap-[11px]")}>
      {items.map((i) =>
        "external" in i ? (
          <li key={i.href}>
            <a
              href={i.href}
              target="_blank"
              rel="noopener noreferrer"
              className={LINK_CLS}
            >
              {i.label}{" "}
              <span
                aria-hidden="true"
                className={cn(
                  "text-[11px] opacity-55",
                  "transition-[transform,opacity] duration-200 ease-[ease]",
                  "group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100",
                )}
              >
                ↗
              </span>
            </a>
          </li>
        ) : (
          <li key={i.to}>
            <Link to={i.to} className={LINK_CLS}>
              {i.label}
            </Link>
          </li>
        )
      )}
    </ul>
  );
}

function SocialIcon({ icon }: { icon: (typeof SOCIALS)[number]["icon"] }) {
  if (icon === "github") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4 fill-current">
        <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.88c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.35 1.09 2.92.83.09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.6 9.6 0 0 1 12 6.82a9.6 9.6 0 0 1 2.5.34c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.76c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
      </svg>
    );
  }
  if (icon === "linkedin") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4 fill-current">
        <path d="M6.5 8.25H3.25V21H6.5V8.25ZM4.88 3A1.88 1.88 0 1 0 4.88 6.75 1.88 1.88 0 0 0 4.88 3ZM21 13.69c0-3.84-2.05-5.63-4.79-5.63-2.21 0-3.2 1.22-3.75 2.07V8.25H9.21V21h3.25v-6.31c0-1.66.31-3.27 2.37-3.27 2.03 0 2.05 1.9 2.05 3.38V21H21v-7.31Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4 fill-current">
      <path d="M18.9 3H22l-6.77 7.74L23.2 21h-6.24l-4.89-6.39L6.48 21H3.36l7.24-8.28L2.96 3h6.4l4.42 5.84L18.9 3Zm-1.1 16.2h1.72L8.43 4.7H6.58L17.8 19.2Z" />
    </svg>
  );
}

export default function SiteFooter({
  extraProduct = [],
  brandLabel = <FlusoText />,
  hidePricing = false,
}: {
  extraProduct?: FooterLink[];
  brandLabel?: React.ReactNode;
  hidePricing?: boolean;
}) {
  const { t } = useTranslation("common");

  const industries: FooterLink[] = INDUSTRY_LINKS.map((l) => ({
    to: l.to,
    label: t(`industries.${l.key}`),
  }));
  const product: FooterLink[] = PRODUCT_LINKS
    .filter((l) => !(hidePricing && l.key === "pricing"))
    .map((l) => ({
      to: l.to,
      label: t(`footer.product.${l.key}`),
    }));
  const company: FooterLink[] = COMPANY_LINKS.map((l) =>
    "external" in l
      ? { href: l.href, label: t(`footer.company.${l.key}`), external: true }
      : { to: l.to, label: t(`footer.company.${l.key}`) },
  );

  return (
    <footer
      role="contentinfo"
      data-nav-dark
      className="theme-dark relative z-2 mt-0 bg-[#0c0c0c] text-bone"
    >
      <div
        className={cn(
          "mx-auto w-full max-w-[1280px]",
          "px-[clamp(24px,5vw,64px)] pt-[clamp(56px,8vh,96px)] pb-[clamp(26px,2.5vh,40px)]",
        )}
      >
        <div
          className={cn(
            "grid items-start",
            "grid-cols-[minmax(280px,1.1fr)_2.4fr] gap-[clamp(40px,5vw,88px)]",
            "max-[980px]:grid-cols-1 max-[980px]:gap-10",
          )}
        >
          <div className="flex max-w-90 flex-col gap-4.5">
            <Link
              to="/"
              className={cn(
                "inline-flex items-center",
                "font-chill text-[20px] font-medium tracking-[-0.01em] text-bone no-underline",
                "opacity-95 transition-opacity duration-180 ease-[ease] hover:opacity-100",
              )}
            >
              <span>{brandLabel}</span>
            </Link>
            <p className="m-0 max-w-[32ch] text-sm leading-[1.55] text-bone/62">
              {t("footer.tagline")}
            </p>
            {/*<div className="mt-1.5 inline-flex items-center gap-3">*/}
            {/*  <span className="text-[10.5px] font-medium uppercase tracking-[0.16em] whitespace-nowrap text-bone/45">*/}
            {/*    {t("footer.productOf")}*/}
            {/*  </span>*/}
            {/*  <a*/}
            {/*    href="https://premai.io"*/}
            {/*    target="_blank"*/}
            {/*    rel="noopener noreferrer"*/}
            {/*    aria-label="Prem AI"*/}
            {/*    className="group"*/}
            {/*  >*/}
            {/*    <img*/}
            {/*      src="/assets/prem-logo-white.png"*/}
            {/*      alt="Prem AI"*/}
            {/*      className={cn(*/}
            {/*        "block h-4.5 w-auto opacity-85",*/}
            {/*        "transition-[opacity,transform] duration-200 ease-[ease]",*/}
            {/*        "group-hover:-translate-y-px group-hover:opacity-100",*/}
            {/*      )}*/}
            {/*    />*/}
            {/*  </a>*/}
            {/*</div>*/}
          </div>
          <nav
            aria-label="Footer"
            className={cn(
              "grid grid-cols-3 gap-[clamp(24px,3vw,56px)]",
              "max-[640px]:grid-cols-2 max-[640px]:gap-x-6 max-[640px]:gap-y-9",
              "max-[420px]:grid-cols-1 max-[420px]:gap-x-8 max-[420px]:gap-y-8",
            )}
          >
            <div>
              <h4 className={cn("m-0", COL_TITLE_CLS)}>{t("footer.columns.product")}</h4>
              <LinkList items={[...product, ...extraProduct]} />
            </div>

            <div className="max-[640px]:col-span-full">
              <h4 className={cn("m-0", COL_TITLE_CLS)}>{t("footer.columns.industries")}</h4>
              <LinkList
                items={industries}
                className={cn(
                  "grid grid-cols-2 gap-x-4.5 gap-y-[11px]",
                  "max-[980px]:grid-cols-1 max-[640px]:grid-cols-2",
                )}
              />
            </div>
            <div>
              <h4 className={cn("m-0", COL_TITLE_CLS)}>{t("footer.columns.company")}</h4>
              <LinkList items={company} />
            </div>
          </nav>
        </div>

        <div
          className={cn(
            "mt-[clamp(36px,3.5vw,56px)] pt-5.5",
            "border-t border-bone/8",
            "flex flex-wrap items-center gap-3",
            "text-[12px] text-bone/45",
            "max-[640px]:gap-x-3.5 max-[640px]:gap-y-2 max-[640px]:text-[11px]",
          )}
        >
          <span>{t("footer.copyright", { year: 2026 })}</span>
          <span aria-hidden="true" className="text-bone/25">
            ·
          </span>
          <span className="inline-flex items-center gap-1.5">
            <svg aria-hidden="true" viewBox="0 0 20 14" className="h-3.5 w-5 rounded-[2px]">
              <rect width="20" height="14" fill="#d52b1e" />
              <path fill="#fff" d="M8.5 2.5h3v3h3v3h-3v3h-3v-3h-3v-3h3z" />
            </svg>
            {t("footer.engineeredInSwitzerland")}
          </span>
          <span aria-hidden="true" className="text-bone/25">
            ·
          </span>
          <span className="inline-flex items-center gap-1.5">
            <svg aria-hidden="true" viewBox="0 0 20 14" className="h-3.5 w-5 rounded-[2px]">
              <rect width="20" height="14" fill="#003399" />
              {Array.from({ length: 12 }, (_, index) => {
                const angle = (index / 12) * Math.PI * 2 - Math.PI / 2;
                return (
                  <circle
                    key={index}
                    cx={10 + Math.cos(angle) * 3.4}
                    cy={7 + Math.sin(angle) * 3.4}
                    r="0.55"
                    fill="#ffcc00"
                  />
                );
              })}
            </svg>
            {t("footer.hostedInEu")}
          </span>
          <span className="inline-flex items-center gap-1">
            {SOCIALS.map((social) => (
              <a
                key={social.href}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                title={social.label}
                className="grid size-7 place-items-center rounded-full text-bone/45 transition-colors duration-180 hover:text-bone"
              >
                <SocialIcon icon={social.icon} />
              </a>
            ))}
          </span>
          <span aria-hidden="true" className="flex-1 max-[640px]:hidden"></span>
          <a
            href="#top"
            className={cn(
              "text-[12px] text-bone/55 no-underline",
              "transition-[color] duration-180 ease-[ease] hover:text-bone",
              "max-[640px]:ml-auto",
            )}
          >
            {t("footer.backToTop")} <span aria-hidden="true">↑</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
