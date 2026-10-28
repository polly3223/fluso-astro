import { useLocation } from "react-router-dom";
import { locale, localePath } from "@/i18n";
import { cn } from "@/utils/styles";

// Flags rounded via the SVG's own `rounded` + `overflow-hidden` (no internal
// clipPath, so multiple switcher instances can't collide on ids).
function FlagEN({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 14" className={className} aria-hidden="true" preserveAspectRatio="none">
      <rect width="20" height="14" fill="#012169" />
      <path d="M0 0 20 14M20 0 0 14" stroke="#fff" strokeWidth="2.8" />
      <path d="M0 0 20 14M20 0 0 14" stroke="#C8102E" strokeWidth="1.4" />
      <path d="M10 0V14M0 7H20" stroke="#fff" strokeWidth="3.4" />
      <path d="M10 0V14M0 7H20" stroke="#C8102E" strokeWidth="2" />
    </svg>
  );
}

function FlagIT({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 14" className={className} aria-hidden="true" preserveAspectRatio="none">
      <rect width="6.67" height="14" fill="#009246" />
      <rect width="6.67" height="14" x="6.67" fill="#F1F2F1" />
      <rect width="6.66" height="14" x="13.34" fill="#CE2B37" />
    </svg>
  );
}

const LANGS = [
  { code: "en", label: "English", Flag: FlagEN },
  { code: "it", label: "Italiano", Flag: FlagIT },
];

export default function LanguageSwitcher() {
  const { pathname, search, hash } = useLocation();
  return (
    <nav aria-label="Language" className="inline-flex shrink-0 items-center gap-2 max-xl:gap-1">
      {LANGS.map(({ code, label, Flag }) => (
        <a
          key={code}
          href={localePath(pathname, code) + search + hash}
          lang={code}
          hrefLang={code}
          aria-label={label}
          aria-current={locale === code ? "page" : undefined}
          title={label}
          className={cn("inline-flex size-4 items-center justify-center rounded-full text-inherit focus-visible:outline-2 focus-visible:outline-offset-2 max-xl:size-7", locale === code && "xl:scale-105")}
        >
          <Flag className={cn(
            "block h-4 w-4 overflow-hidden rounded-lg border-[1.5px] border-transparent grayscale transition-opacity",
            locale === code ? "opacity-100 shadow-[0_0_0_1.5px_currentColor]" : "opacity-45 hover:opacity-85",
          )} />
        </a>
      ))}
    </nav>
  );
}
