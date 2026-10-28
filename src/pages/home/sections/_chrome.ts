import { cn } from "@/utils/styles";
import { TYPE_LEAD, TYPE_SECTION_TITLE } from "@/components/typography";

export const MAIN_CARD_DARK = cn(
  "main-card theme-dark",
  "relative flex min-h-0 flex-col bg-ink text-bone"
);

export const CARD_HEADER = cn(
  "card-header",
  "z-10 mb-6 flex items-start justify-between",
  "max-lg:flex-col max-lg:items-stretch max-lg:gap-5",
);

export const TITLE = cn(
  "flex items-center -ml-[0.05em] font-sans font-normal",
  TYPE_SECTION_TITLE,
);

export const subtitle = (extra?: string) =>
  cn(
    "mt-(--title-mt) max-w-[480px] font-normal text-(--text-muted)",
    TYPE_LEAD,
    extra,
  );
