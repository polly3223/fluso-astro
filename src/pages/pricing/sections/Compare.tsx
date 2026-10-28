import type { ReactNode } from "react";
import { Trans, useTranslation } from "react-i18next";
import { cn } from "@/utils/styles";
import BloomCard from "@/components/BloomCard";
import { CARD_BODY, CARD_PAD, KICKER, SUBTITLE, TITLE } from "@/components/cardChrome";

const CELL =
  "py-[17px] px-5 text-[15px] text-(--text-primary) border-b border-(--border-soft) flex items-center gap-2 transition-colors duration-150 group-hover/row:bg-[rgba(12,12,12,0.045)] max-md:py-3 max-md:px-3.5 max-md:text-[13.5px]";

function Cell({
  children,
  muted,
  label,
  last,
}: {
  children?: ReactNode;
  muted?: boolean;
  label?: boolean;
  last?: boolean;
}) {
  return (
    <div
      className={[
        CELL,
        muted && "text-(--text-muted)",
        label && "font-medium text-(--text-primary)",
        last && "border-b-0",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}

function Check({ on, last, label }: { on: boolean; last?: boolean; label: string }) {
  return (
    <div className={last ? `${CELL} border-b-0` : CELL}>
      <span
        role="img"
        aria-label={label}
        className={[
          "w-5 h-5 rounded-full inline-flex items-center justify-center shrink-0 [&_svg]:w-3 [&_svg]:h-3 [&_svg]:block",
          on
            ? "bg-[#0c0c0c] text-[#faf9f5]"
            : "bg-transparent border border-[rgba(12,12,12,0.16)] text-[rgba(12,12,12,0.32)]",
        ].join(" ")}
      >
        {on ? (
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3.5 8.5 6.5 11 12.5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
        ) : (
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M5 5l6 6M11 5l-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
        )}
      </span>
    </div>
  );
}

// Structural shape of each cell, kept in code. Text for text-cells is pulled
// from i18n (compare.rows[ri].cells) by column index. `true`/`false` render a
// check/cross; an object renders the i18n text with the given styling.
type CellShape = boolean | { muted?: boolean; strong?: boolean };
type RowShape = [CellShape, CellShape, CellShape, CellShape];

const t0 = (muted = false): CellShape => ({ muted });

const ROW_SHAPES: RowShape[] = [
  [t0(true), t0(), { strong: true }, t0()],
  [false, false, true, true],
  [true, true, true, true],
  [true, true, true, true],
  [t0(), t0(), t0(), t0()],
  [true, true, true, true],
  [true, true, true, true],
  [true, true, true, true],
  [false, false, false, true],
  [false, false, false, true],
  [false, false, false, true],
  [false, false, false, true],
  [false, false, false, true],
  [t0(), t0(), t0(), t0()],
];

type RowText = { label: string; cells?: [string, string, string, string] };

export default function Compare() {
  const { t } = useTranslation("pricing");
  const rows = t("compare.rows", { returnObjects: true }) as RowText[];
  const headers = t("compare.headers", { returnObjects: true }) as string[];
  const includedLabel = t("compare.included");
  const notIncludedLabel = t("compare.notIncluded");

  return (
    <BloomCard id="compare" className="scroll-mt-[calc(var(--nav-h)+18px)]">
      <main
        data-nav-light
        className={cn(CARD_BODY, "theme-light bg-(--card-bg) text-(--text-primary)", CARD_PAD)}
        aria-labelledby="compare-title"
      >
        <div className="relative z-10">
          {/*<span className={cn(KICKER, "mb-[clamp(14px,2vh,22px)] block")}>Compare</span>*/}
          <h2 id="compare-title" className={TITLE}>
            <Trans t={t} i18nKey="compare.title" components={{ br: <br /> }} />
          </h2>
          <p className={cn(SUBTITLE, "max-w-[56ch]")}>{t("compare.subtitle")}</p>
        </div>

        <span className="hidden mt-[18px] font-(family-name:--font-mono) text-[10.5px] font-medium tracking-[0.16em] uppercase text-(--text-muted) items-center gap-2 max-md:inline-flex [&_svg]:w-4 [&_svg]:h-4" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="5 9 1 12 5 15" /><polyline points="19 9 23 12 19 15" /><line x1="1" y1="12" x2="23" y2="12" /></svg>
          {t("compare.swipeHint")}
        </span>
        <div className="mt-[clamp(28px,3.6vh+4px,44px)] overflow-x-auto border border-(--border-soft) rounded-[18px] bg-[rgba(12,12,12,0.02)] [-webkit-overflow-scrolling:touch]">
          <div className="grid grid-cols-[minmax(220px,2fr)_repeat(4,minmax(120px,1fr))] min-w-[760px]">

            <div className="contents">
              {headers.map((h, i) => (
                <div
                  key={h}
                  className={[
                    "py-5 px-5 flex items-center gap-2 font-(family-name:--font-mono) text-[11.5px] font-medium tracking-[0.14em] uppercase bg-[rgba(12,12,12,0.05)] border-b border-b-[rgba(12,12,12,0.16)] max-md:py-3.5 max-md:text-[10.5px]",
                    i === 0 ? "text-(--text-primary)" : "text-(--text-muted)",
                  ].join(" ")}
                >
                  {h}
                </div>
              ))}
            </div>

            {ROW_SHAPES.map((shape, ri) => {
              const last = ri === ROW_SHAPES.length - 1;
              const row = rows[ri];
              return (
                <div key={row.label} className="contents group/row">
                  <Cell label last={last}>{row.label}</Cell>
                  {shape.map((c, ci) =>
                    typeof c === "boolean" ? (
                      <Check key={ci} on={c} last={last} label={c ? includedLabel : notIncludedLabel} />
                    ) : (
                      <Cell key={ci} muted={c.muted} last={last}>
                        {c.strong ? <strong>{row.cells?.[ci]}</strong> : row.cells?.[ci]}
                      </Cell>
                    ),
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </BloomCard>
  );
}
