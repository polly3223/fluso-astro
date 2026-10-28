import type { ReactElement } from "react";
import { Trans, useTranslation } from "react-i18next";
import { cn } from "@/utils/styles";
import { TYPE_BODY, TYPE_BODY_SMALL } from "@/components/typography";

export type FaqItem = { q: string; a: string };

type Variant = "dark" | "light";

type VariantStyles = {
  list: string;
  item: string;
  summary: string;
  lastSummaryPb: string;
  number: string;
  chevron: string;
  answer: string;
};

const VARIANTS: Record<Variant, VariantStyles> = {
  // Home: cream text on a dark background, plain native open (no expand animation).
  dark: {
    list: "border-t border-[rgba(12,12,12,0.12)]",
    item: "faq-item relative border-b border-[rgba(12,12,12,0.12)]",
    summary: cn(
      "relative flex cursor-pointer list-none [&::-webkit-details-marker]:hidden items-start gap-4 p-[22px_48px_22px_0] font-medium text-[#faf9f5]",
      TYPE_BODY,
      "transition-colors duration-[220ms] ease-[ease] hover:text-[#faf9f5]",
      "max-[640px]:gap-3 max-[640px]:p-[18px_36px_18px_0] max-[640px]:text-[15px]",
    ),
    lastSummaryPb: "pb-0 max-[640px]:pb-0",
    number: cn(
      "min-w-[26px] shrink-0 pt-1 font-mono text-[11px] font-medium tracking-[0.14em] text-[#faf9f5]",
      "max-[640px]:min-w-[22px] max-[640px]:pt-[3px] max-[640px]:text-[10.5px]",
    ),
    chevron:
      "q-chev absolute right-1 top-1/2 size-3.5 -translate-y-1/2 text-[#faf9f5] transition-[transform,color] duration-[0.28s] ease-[cubic-bezier(0.22,0.61,0.36,1)]",
    answer: cn(
      "answer max-w-[62ch] overflow-hidden p-[0_48px_24px_42px] text-[#faf9f5]",
      TYPE_BODY_SMALL,
      "[&_p]:m-0 [&_p]:mb-2.5 [&_p:last-child]:mb-0 [&_strong]:font-medium [&_strong]:text-[#faf9f5]",
      "[&_a]:text-[#faf9f5] [&_a]:underline",
      "max-[640px]:p-[0_36px_20px_36px] max-[640px]:text-sm",
    ),
  },
  // Pricing: dark text on a cream card, smooth expand + chevron rotate on open.
  light: {
    list: "border-t border-t-[rgba(12,12,12,0.12)]",
    item: "group relative border-b border-b-[rgba(12,12,12,0.12)]",
    summary:
      "list-none [&::-webkit-details-marker]:hidden cursor-pointer relative py-6 pr-12 pl-0 flex items-start gap-4 text-[clamp(16px,0.4vw+14px,18px)] font-medium tracking-[-0.008em] text-[#0c0c0c] leading-[1.35] transition-[color] duration-[220ms] ease-[ease] hover:text-[rgba(12,12,12,0.7)] group-open:text-[#0c0c0c] max-[640px]:py-[18px] max-[640px]:pr-9 max-[640px]:text-[15px] max-[640px]:gap-3",
    lastSummaryPb: "",
    number:
      "font-(family-name:--font-mono) text-[11.5px] font-medium tracking-[0.14em] text-[rgba(12,12,12,0.4)] min-w-[28px] pt-1 shrink-0 max-[640px]:min-w-[22px] max-[640px]:pt-[3px] max-[640px]:text-[10.5px]",
    chevron:
      "absolute right-1 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[rgba(12,12,12,0.55)] transition-[transform,color] duration-[280ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] shrink-0 group-open:rotate-180 group-open:text-[#0c0c0c]",
    answer:
      "py-0 pr-12 pb-6 pl-[44px] text-[15.5px] leading-[1.6] text-[rgba(12,12,12,0.7)] max-w-[62ch] opacity-0 -translate-y-1 max-h-0 overflow-hidden transition-[opacity,transform] duration-[240ms] ease-[ease] group-open:opacity-100 group-open:translate-y-0 group-open:max-h-[600px] group-open:duration-[320ms] group-open:delay-[40ms] [&_strong]:text-[#0c0c0c] [&_strong]:font-medium max-[640px]:pr-9 max-[640px]:pb-5 max-[640px]:pl-9 max-[640px]:text-[14px]",
  },
};

/**
 * Shared FAQ accordion (the right-hand question column), used on both Home and
 * Pricing. Items live once in the shared `faq` i18n namespace; the surrounding
 * aside (title, CTA) stays page-specific. `answerComponents` are merged with
 * `strong` and passed to <Trans> so each page can style its own inline links.
 */
export default function FaqList({
  variant,
  answerComponents,
}: {
  variant: Variant;
  answerComponents?: Record<string, ReactElement>;
}) {
  const { t } = useTranslation("faq");
  const items = t("items", { returnObjects: true }) as FaqItem[];
  const s = VARIANTS[variant];
  const components = { strong: <strong />, ...answerComponents };

  return (
    <div className={cn("flex flex-col", s.list)}>
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <details key={item.q} className={s.item}>
            <summary className={cn(s.summary, isLast && s.lastSummaryPb)}>
              <span className={s.number}>{String(i + 1).padStart(2, "0")}</span>
              <span className="flex-1">{item.q}</span>
              <svg
                className={s.chevron}
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3 4.5l3 3 3-3" />
              </svg>
            </summary>
            <div className={s.answer}>
              <p className="m-0">
                <Trans t={t} i18nKey={`items.${i}.a` as never} components={components} />
              </p>
            </div>
          </details>
        );
      })}
    </div>
  );
}
