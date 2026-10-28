import { useCallback, useRef, useState } from "react";
import { useAnimationFrame } from "motion/react";
import { ManageCookiesButton } from "@premAI-io/cookie-consent/react";
import { cn } from "@/utils/styles";

// Matches lucide-react's "Cookie" icon (used by the equivalent button in
// fluso-frontend) without pulling in the lucide-react dependency — this repo
// hand-rolls its icons locally (see IconChevron/IconMenu in SiteNav.tsx).
function IconCookie({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
      <path d="M8.5 8.5v.01" />
      <path d="M16 15.5v.01" />
      <path d="M12 12v.01" />
      <path d="M11 17v.01" />
      <path d="M7 14v.01" />
    </svg>
  );
}

export function CookieConsentManageButton() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const themeRef = useRef<"light" | "dark">("dark");

  // Same trick SiteNav uses to invert itself over light sections: check what
  // fully covers this element's box among the page's marked light regions
  // (".theme-light" cards, "[data-nav-light]" hero fallbacks — see
  // SiteNav.tsx's computeNavTheme). A "cross" (section edge inside the box)
  // is treated as dark, matching how SiteNav's own Download pill collapses
  // "cross" into "dark" rather than tracking it separately.
  const computeTheme = useCallback((): "light" | "dark" => {
    const el = wrapperRef.current;
    if (!el) return themeRef.current;
    const { top, bottom, left, right } = el.getBoundingClientRect();

    const lights = document.querySelectorAll(
      ".theme-light:not([data-nav-dark]), [data-nav-light]:not([data-nav-dark])",
    );
    for (const light of lights) {
      const r = (light as HTMLElement).getBoundingClientRect();
      if (r.top <= top && r.bottom >= bottom && r.left <= left && r.right >= right) {
        return "light";
      }
    }
    return "dark";
  }, []);

  useAnimationFrame(() => {
    const next = computeTheme();
    if (next !== themeRef.current) {
      themeRef.current = next;
      setTheme(next);
    }
  });

  return (
    <div ref={wrapperRef} className="fixed bottom-5 right-8 z-40">
      <ManageCookiesButton
        aria-label="Cookie settings"
        className={cn(
          "group flex h-10 w-10 cursor-pointer items-center justify-end gap-2 overflow-hidden rounded-full border px-2.5 shadow-[0_4px_16px_rgba(0,0,0,0.35)] backdrop-blur-sm transition-[width,background-color,color,border-color] duration-300 ease-out hover:w-[10.5rem]",
          theme === "light"
            ? "border-white/15 bg-[#161616]/90 text-bone/70 hover:text-bone"
            : "border-black/10 bg-[#faf9f5]/95 text-ink/70 hover:text-ink",
        )}
      >
        <span className="whitespace-nowrap text-base font-normal leading-[1.2] tracking-[.01em] opacity-0 transition-opacity delay-100 duration-200 group-hover:opacity-100">
          Cookie settings
        </span>
        <IconCookie className="h-5 w-5 shrink-0" />
      </ManageCookiesButton>
    </div>
  );
}
