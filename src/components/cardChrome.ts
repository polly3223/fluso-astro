import { cn } from "@/utils/styles";

export const CARD = cn(
  "relative flex w-full flex-col overflow-hidden",
  "rounded-[clamp(16px,1.4vw,24px)]",
);

export const CARD_BODY = "relative flex w-full flex-col";

export const CARD_PAD = cn(
  "px-[clamp(28px,4.4vw+8px,80px)] py-[clamp(48px,7vh,96px)]",
  "max-md:px-[clamp(20px,5vw,28px)] max-md:py-[clamp(40px,6vh,56px)]",
);

export const KICKER =
  "font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-(--text-muted)";

export const TITLE = cn(
  "-ml-[0.05em] text-(length:--title-size) font-medium leading-[0.92] tracking-[-0.04em]",
  "max-md:text-[clamp(32px,9vw+4px,48px)]",
  "[&_strong]:font-medium",
);

export const SUBTITLE = cn(
  "mt-(--title-mt) text-(length:--subtitle-size) font-normal leading-[1.4] tracking-[-0.01em] text-(--text-muted)",
  "max-md:text-[clamp(14.5px,1.4vw+11px,17px)]",
  "[&_strong]:font-medium [&_strong]:text-(--text-primary)",
);

export const BTN_PRIMARY = cn(
  "group/cta inline-flex cursor-pointer items-center gap-2.5 rounded-full border border-transparent no-underline",
  "bg-(--text-primary) px-[28px] py-[15px] text-[15px] font-medium tracking-[-0.005em] text-(--card-bg)",
  "transition-[background,color,border-color,transform] duration-[180ms] ease-[ease]",
  "hover:-translate-y-px hover:opacity-95",
  "[&_svg]:size-4 [&_svg]:transition-transform [&_svg]:duration-[180ms] [&_svg]:ease-[ease] hover:[&_svg]:translate-x-0.5",
);

export const BTN_GHOST = cn(
  "group/cta inline-flex cursor-pointer items-center gap-2.5 rounded-full no-underline",
  "border border-(--border-soft) bg-transparent px-[28px] py-[15px] text-[15px] font-medium tracking-[-0.005em] text-(--text-primary)",
  "transition-[background,border-color,transform] duration-[180ms] ease-[ease]",
  "hover:-translate-y-px hover:border-current/40",
  "[&_svg]:size-4 [&_svg]:transition-transform [&_svg]:duration-[180ms] [&_svg]:ease-[ease] hover:[&_svg]:translate-x-0.5",
);

export const ARROW_SVG_PROPS = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;
