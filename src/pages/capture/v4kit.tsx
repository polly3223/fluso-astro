import { motion } from "motion/react";
import { ink, ACCENT } from "./kit";
import { E } from "./v1kit";
import { FORMAT_LABEL, type FormatKey } from "./v4data";

import docIcon from "../../../assets/connectors/google-docs.svg?url";
import sheetIcon from "../../../assets/connectors/google-sheets.svg?url";
import slidesIcon from "../../../assets/connectors/google-slides.svg?url";
import wordIcon from "../../../assets/connectors/word.svg?url";
import excelIcon from "../../../assets/connectors/excel.svg?url";
import pptIcon from "../../../assets/connectors/powerpoint.svg?url";
import pdfIcon from "../../../assets/connectors/pdf.svg?url";

/* ------------------------------------------------------------------ *
 * v4 shared kit — "Builds artifacts in formats you work with".
 * A format bar (Doc · Sheet · Slides · Word · Excel · PPT · PDF) and a
 * document artifact that assembles in a preview (title → section → body),
 * paginated like a PDF, then ready to send. Built on the v1 language.
 * ------------------------------------------------------------------ */

/** Official brand mark per format — Google Docs/Sheets/Slides, Word, Excel,
 *  PowerPoint, PDF — so the bar reads as the real formats, not dry glyphs. */
const FMT_SRC: Record<FormatKey, string> = {
  doc: docIcon,
  sheet: sheetIcon,
  slides: slidesIcon,
  word: wordIcon,
  excel: excelIcon,
  ppt: pptIcon,
  pdf: pdfIcon,
};

/** A single format chip; the active one is accent-lit, with its official icon. */
export function FormatChip({ k, active }: { k: FormatKey; active: boolean }) {
  return (
    <span
      className="inline-flex shrink-0 items-center gap-1.5 rounded-[7px] px-2 py-1.5 text-[11px] font-medium tracking-[-0.01em] transition-[filter,opacity]"
      style={{
        color: active ? ACCENT : ink(0.55),
        background: active ? "rgba(166,190,206,0.10)" : ink(0.03),
        boxShadow: `inset 0 0 0 1px ${active ? "rgba(166,190,206,0.32)" : ink(0.07)}`,
        opacity: active ? 1 : 0.72,
      }}
    >
      <img
        src={FMT_SRC[k]}
        alt=""
        width={14}
        height={14}
        className="size-[14px] shrink-0 object-contain"
        style={{ filter: active ? "none" : "saturate(0.85)" }}
      />
      {FORMAT_LABEL[k]}
    </span>
  );
}

/** The format bar — every format Fluso can draft; `active` is highlighted.
 *  Optionally a marker sweeps across to land on the active format. */
export function FormatBar({
  formats,
  active,
  reduced,
  sweep = true,
}: {
  formats: readonly FormatKey[];
  active: FormatKey;
  reduced: boolean;
  sweep?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {formats.map((k, i) => (
        <motion.span
          key={k}
          initial={reduced || !sweep ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduced || !sweep ? { duration: 0 } : { duration: 0.35, ease: E.emphasized, delay: 0.3 + i * 0.05 }}
        >
          <FormatChip k={k} active={k === active} />
        </motion.span>
      ))}
    </div>
  );
}

const ICON_SEND = (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path d="M2 8h9M7.5 4.5 11 8l-3.5 3.5M13.5 2.5v11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const ICON_DL = (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path d="M8 2.5v7M5 6.8 8 9.8l3-3M3.5 12.5h9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** "Ready to send" footer with download + share affordances. */
export function ReadyRow({ file, reduced, delay }: { file: string; reduced: boolean; delay: number }) {
  return (
    <motion.div
      className="flex items-center gap-2 rounded-[9px] px-3 py-2"
      style={{ background: "rgba(166,190,206,0.07)", boxShadow: "inset 0 0 0 1px rgba(166,190,206,0.22)" }}
      initial={reduced ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduced ? { duration: 0 } : { duration: 0.4, ease: E.emphasized, delay }}
    >
      <span className="grid size-[18px] place-items-center rounded-full" style={{ background: ACCENT, color: "#0c0c0c" }}>
        <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden>
          <path d="M2.8 6.2 5 8.4 9.2 3.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="min-w-0 flex-1 truncate font-mono text-[11.5px]" style={{ color: ink(0.85) }}>{file}</span>
      <span className="text-[11px]" style={{ color: ink(0.5) }}>Ready to send</span>
      <span className="grid size-[22px] place-items-center rounded-[6px]" style={{ color: ink(0.55), boxShadow: `inset 0 0 0 1px ${ink(0.1)}` }}>{ICON_DL}</span>
      <span className="grid size-[22px] place-items-center rounded-[6px]" style={{ color: ink(0.55), boxShadow: `inset 0 0 0 1px ${ink(0.1)}` }}>{ICON_SEND}</span>
    </motion.div>
  );
}

/** The document artifact rendered as a light "page" that assembles. `built`
 *  rows (0..N) reveal progressively; `paged` adds a faint second-page edge. */
export function ArtifactPage({
  artifact,
  builtLines,
  reduced,
  className,
}: {
  artifact: { file: string; pages: number; title: string; subtitle: string; section: string; lines: readonly string[] };
  builtLines: number;
  reduced: boolean;
  className?: string;
}) {
  return (
    <div className={className} style={{ perspective: 800 }}>
      {/* faint stacked page edges behind, implying a multi-page PDF */}
      <div className="relative">
        <div aria-hidden className="absolute -right-1.5 -top-1.5 h-full w-full rounded-[10px]" style={{ background: "rgba(250,249,245,0.04)", boxShadow: `inset 0 0 0 1px ${ink(0.05)}` }} />
        <div
          className="relative overflow-hidden rounded-[10px] px-4 pb-4 pt-3.5"
          style={{ background: "rgba(250,249,245,0.06)", boxShadow: `inset 0 0 0 1px ${ink(0.1)}, 0 12px 30px -18px rgba(0,0,0,0.7)` }}
        >
          {/* page header: file + page count */}
          <div className="mb-2.5 flex items-center justify-between text-[10px]" style={{ color: ink(0.4) }}>
            <span className="font-mono">{artifact.file}</span>
            <span className="tabular-nums">{artifact.pages} pages</span>
          </div>
          {/* title block */}
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduced ? { duration: 0 } : { duration: 0.4, ease: E.emphasized }}
          >
            <div className="text-[15px] font-semibold tracking-[-0.015em]" style={{ color: ink(0.95) }}>{artifact.title}</div>
            <div className="text-[11px]" style={{ color: ink(0.5) }}>{artifact.subtitle}</div>
          </motion.div>
          <div className="my-2.5 h-px" style={{ background: ink(0.1) }} />
          <div className="text-[12px] font-medium" style={{ color: ink(0.82) }}>{artifact.section}</div>
          {/* body lines lay in as the artifact builds */}
          <div className="mt-1.5 flex flex-col gap-1.5">
            {artifact.lines.map((l, i) => (
              <motion.p
                key={l}
                className="text-[11px] leading-snug"
                style={{ color: ink(0.6), overflow: "hidden" }}
                initial={reduced ? false : { opacity: 0, clipPath: "inset(0 100% 0 0)" }}
                animate={i < builtLines ? { opacity: 1, clipPath: "inset(0 0% 0 0)" } : { opacity: 0.12, clipPath: "inset(0 0% 0 0)" }}
                transition={reduced ? { duration: 0 } : { duration: 0.45, ease: E.reveal }}
              >
                {l}
              </motion.p>
            ))}
            {/* a couple of faint "more text" lines to imply a full page */}
            {[88, 72].map((w, i) => (
              <span key={i} className="block h-[5px] rounded-full" style={{ width: `${w}%`, background: ink(builtLines > artifact.lines.length - 1 ? 0.12 : 0.06) }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
