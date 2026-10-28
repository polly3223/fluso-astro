import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { cn } from "@/utils/styles";
import { useMorphingShape } from "@/hooks/useMorphingShape";
import LegalWordmark from "./LegalWordmark";

type IndustryKey =
  | "founders"
  | "lawyers"
  | "investors"
  | "marketers"
  | "researchers"
  | "doctors"
  | "consultants"
  | "sales"
  | "operations";

const INDUSTRY_LINKS: { href: string; key: IndustryKey }[] = [
  { href: "/for-founders", key: "founders" },
  { href: "/for-lawyers", key: "lawyers" },
  { href: "/for-investors", key: "investors" },
  { href: "/for-marketers", key: "marketers" },
  { href: "/for-researchers", key: "researchers" },
  { href: "/for-doctors", key: "doctors" },
  { href: "/for-consultants", key: "consultants" },
  { href: "/for-sales", key: "sales" },
  { href: "/for-operations", key: "operations" },
] as const;

const TOP_LINKS: { href: string; key: "pricing" | "enterprise"; soon?: boolean }[] = [
  { href: "/pricing", key: "pricing" },
  { href: "/enterprise", key: "enterprise" },
] as const;

const IconChevron = ({
  size = 12,
  className,
}: {
  size?: number;
  className?: string;
}) => (
  <svg
    viewBox="0 0 12 12"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <path d="M3 4.5l3 3 3-3" />
  </svg>
);

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5 fill-none stroke-current stroke-[1.6]"
      aria-hidden="true"
    >
      {open ? (
        <>
          <path d="m6 6 12 12" />
          <path d="m18 6-12 12" />
        </>
      ) : (
        <>
          <path d="M4 8h16" />
          <path d="M4 16h16" />
        </>
      )}
    </svg>
  );
}

export default function LegalNav() {
  const { t } = useTranslation("lawyers");
  const { t: tCommon } = useTranslation("common");
  const location = useLocation();
  const currentPath =
    location.pathname !== "/" && location.pathname.endsWith("/")
      ? location.pathname.slice(0, -1)
      : location.pathname;

  const isActive = useCallback(
    (href: string) => href === currentPath,
    [currentPath],
  );

  const industries: { href: string; label: string }[] = INDUSTRY_LINKS.map((l) => ({
    href: l.href,
    label: tCommon(`industries.${l.key}`),
  }));
  const topLinks: { href: string; soon?: boolean; label: string }[] = TOP_LINKS.map((l) => ({
    href: l.href,
    soon: l.soon,
    label: tCommon(`nav.${l.key}`),
  }));
  const industryActive = INDUSTRY_LINKS.some((i) => isActive(i.href));

  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [groupOpen, setGroupOpen] = useState(industryActive);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { ref: bgRef, clipPath, transform } = useMorphingShape<HTMLDivElement>({
    radiusMin: 16,
    radiusMax: 26,
    bulgeRange: 0.18,
    driftX: 2,
    driftScale: 0.005,
    driftPeriodMs: 5200,
  });

  useEffect(() => {
    setOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setDropdownOpen(false);
      }
    };
    const onDocClick = (e: globalThis.MouseEvent) => {
      const target = e.target as Node;
      const trigger = dropdownRef.current;
      const menu = menuRef.current;
      if (trigger && !trigger.contains(target) && menu && !menu.contains(target)) {
        setDropdownOpen(false);
      }
    };
    const onResize = () => {
      setOpen(false);
      setDropdownOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("click", onDocClick);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("click", onDocClick);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const toggleDropdown = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setDropdownOpen((current) => !current);
  };

  return (
    <>
      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={cn(
          "fixed inset-0 z-90 bg-black/40 backdrop-blur-[2px] transition-opacity duration-220 md:hidden",
          open ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
      />
      <header
        role="banner"
        className={cn(
          "legal-nav select-none fixed left-6 top-0 z-100 m-0 mt-6! w-[calc(100%-3rem)]",
          "grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-x-6 p-4! px-8!",
          "text-base leading-[1.2] tracking-[.01em] text-white",
          "max-lg:gap-x-4",
          "max-md:left-2 max-md:mt-2! max-md:w-[calc(100%-1rem)] max-md:grid-cols-[1fr_auto] max-md:gap-x-3 max-md:py-3 max-md:px-4!",
        )}
      >
      <motion.div
        ref={bgRef}
        aria-hidden="true"
        // Freeze to a rounded rect while the mobile menu is open so the bg
        // covers the whole expanded header as one shape.
        style={{
          clipPath: open ? "inset(0 round 24px)" : clipPath,
          transform: open ? "none" : transform,
        }}
        className="pointer-events-none absolute inset-0 -z-10 bg-[rgba(12,12,12,0.58)] backdrop-blur-[30px] [-webkit-backdrop-filter:blur(30px)] shadow-[0_12px_40px_rgba(0,0,0,0.16)]"
      />

      <Link
        to="/"
        aria-label={t("nav.homeLabel")}
        className="justify-self-start text-inherit no-underline max-md:justify-self-auto"
      >
        <LegalWordmark className="text-2xl" />
      </Link>

      <nav
        aria-label={tCommon("nav.primaryLabel")}
        className="flex items-center justify-self-center justify-center gap-6 max-lg:gap-4 max-md:hidden"
      >
        <div ref={dropdownRef} className="relative inline-flex items-center">
          <button
            type="button"
            aria-haspopup="true"
            aria-expanded={dropdownOpen}
            aria-controls="legal-professionals-menu"
            onClick={toggleDropdown}
            className={cn(
              "inline-flex cursor-pointer items-center gap-1.5 border-0 bg-transparent p-0",
              "font-sans text-base font-normal leading-[1.2] text-white",
              "transition-opacity duration-200 ease-[ease]",
              "hover:opacity-80",
              "[-webkit-tap-highlight-color:transparent]",
              industryActive && "opacity-100",
            )}
          >
            {tCommon("nav.professionals")}{" "}
            <IconChevron
              size={10}
              className={cn(
                "transition-transform duration-200",
                dropdownOpen && "rotate-180",
              )}
            />
          </button>
        </div>

        {topLinks.map((link) => (
          link.soon ? (
            <span
              key={link.label}
              aria-disabled="true"
              title={tCommon("nav.comingSoon")}
              className="inline-block cursor-default opacity-35"
            >
              {link.label}
            </span>
          ) : (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "text-base text-white no-underline",
                "transition-opacity duration-200 ease-[ease]",
                "hover:opacity-80",
                isActive(link.href) && "opacity-100",
              )}
            >
              {link.label}
            </Link>
          )
        ))}
      </nav>

      <div
        ref={menuRef}
        role="menu"
        id="legal-professionals-menu"
        className={cn(
          "absolute inset-x-0 top-[calc(100%+10px)] z-100",
          "rounded-[24px] border border-white/12 bg-[rgba(12,12,12,0.48)] p-[clamp(14px,1.6vw,24px)] text-white",
          "backdrop-blur-[34px] [-webkit-backdrop-filter:blur(34px)]",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_28px_72px_rgba(0,0,0,0.42)]",
          "before:absolute before:-top-3 before:inset-x-0 before:h-3 before:content-['']",
          "transition-[opacity,transform] duration-200 ease-[ease]",
          "max-md:hidden",
          dropdownOpen
            ? "visible translate-y-0 opacity-100 pointer-events-auto"
            : "invisible -translate-y-1.5 opacity-0 pointer-events-none",
        )}
      >
        <div className="grid grid-cols-3 gap-1.5 max-lg:grid-cols-2">
          {industries.map((industry) => (
            <Link
              key={industry.href}
              to={industry.href}
              role="menuitem"
              onClick={() => setDropdownOpen(false)}
              className={cn(
                "rounded-2xl px-5 py-3.5 text-[15px] no-underline",
                "text-white/72 transition-[background,color] duration-150",
                "hover:bg-white/9 hover:text-white",
                isActive(industry.href) && "bg-white/12 font-medium text-white",
              )}
            >
              {industry.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-self-end gap-[clamp(14px,1.8vw,28px)] max-md:ml-auto max-md:justify-self-auto">
        <a
          href="https://form.typeform.com/to/vZnBDhzs"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "inline-flex items-center gap-2 rounded-full bg-[#faf9f5] px-5 py-1",
            "text-base font-normal text-[#0c0c0c] no-underline",
            "transition-[transform] duration-200 ease-[ease] active:scale-[0.98]",
            "max-md:px-4 max-md:text-[13px]",
          )}
        >
          <span className="max-md:hidden">{t("nav.requestPrefix")}</span>{t("nav.earlyAccess")}
        </a>

        <button
          type="button"
          aria-label={open ? t("nav.closeNav") : t("nav.openNav")}
          aria-expanded={open}
          aria-controls="legal-mobile-nav"
          onClick={() => setOpen((current) => !current)}
          className={cn(
            "hidden size-9 cursor-pointer place-items-center rounded-full border border-white/20 bg-transparent p-0 text-white max-md:grid",
          )}
        >
          <MenuIcon open={open} />
        </button>
      </div>

      {/* Mobile menu — PART OF THE HEADER: a full-width row that expands the
          header; its bg grows to cover this as one shape. */}
      <div
        id="legal-mobile-nav"
        aria-hidden={!open}
        className={cn(
          "col-span-full hidden min-w-0 max-md:grid",
          "transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.22,0.61,0.36,1)]",
          open ? "[grid-template-rows:1fr]" : "[grid-template-rows:0fr]",
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <nav aria-label={tCommon("nav.navigationLabel")} className="flex flex-col gap-0.5 pt-5">
            <div className="flex flex-col">
              <button
                type="button"
                aria-expanded={groupOpen}
                onClick={() => setGroupOpen((current) => !current)}
                className={cn(
                  "flex w-full cursor-pointer items-center justify-between rounded-lg border-0 bg-transparent",
                  "py-3 pl-1 pr-3 text-left font-sans text-[17px] font-medium tracking-[-.005em] text-white/85",
                  "transition-[background,opacity] duration-150 hover:bg-white/8 hover:text-white",
                  "[-webkit-tap-highlight-color:transparent]",
                  industryActive && "bg-white/10 text-white",
                )}
              >
                <span>{tCommon("nav.professionals")}</span>
                <IconChevron
                  className={cn(
                    "opacity-70 transition-transform duration-200",
                    groupOpen && "rotate-180",
                  )}
                />
              </button>
              <div className={cn("flex-col gap-px pb-1.5 pt-1", groupOpen ? "flex" : "hidden")}>
                {industries.map((industry) => (
                  <Link
                    key={industry.href}
                    to={industry.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "rounded-md px-3.5 py-2.5 text-[15px] text-white/68 no-underline",
                      "transition-[background,opacity,color] duration-150 hover:bg-white/8 hover:text-white",
                      "[-webkit-tap-highlight-color:transparent]",
                      isActive(industry.href) && "bg-white/10 font-medium text-white",
                    )}
                  >
                    {industry.label}
                  </Link>
                ))}
              </div>
            </div>

            {topLinks.map((link) => (
              link.soon ? (
                <span
                  key={link.label}
                  aria-disabled="true"
                  className="rounded-[12px] py-3 pl-1 pr-3 text-[16px] text-white/40"
                >
                  {link.label}
                </span>
              ) : (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg py-3 pl-1 pr-3 text-[17px] font-medium tracking-[-.005em] text-white/80 no-underline",
                    "transition-[background,opacity] duration-150 hover:bg-white/8 hover:text-white",
                    "[-webkit-tap-highlight-color:transparent]",
                    isActive(link.href) && "bg-white/10 text-white",
                  )}
                >
                  {link.label}
                </Link>
              )
            ))}
          </nav>
        </div>
      </div>
    </header>
    </>
  );
}
