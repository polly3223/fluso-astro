/* v4 — "Builds artifacts in formats you work with" (how-step-3-connect.mp4).
   From a report, the user asks for a format ("Make a PDF of this report") and
   Fluso drafts the native artifact — a formatted document — ready to send.
   Copy verbatim from the block + the recording. */

export type FormatKey = "doc" | "sheet" | "slides" | "word" | "excel" | "ppt" | "pdf";

export const V4 = {
  heading: "Builds artifacts in formats you work with",
  body:
    "Docs, sheets, slides, Word, Excel, PowerPoint, PDFs. Drafted natively in the format you need, ready to send.",

  /** The request from the recording. */
  request: "Make a PDF of this report",

  /** Every format it can draft natively — order matches the copy. PDF is chosen. */
  formats: ["doc", "sheet", "slides", "word", "excel", "ppt", "pdf"] as FormatKey[],
  active: "pdf" as FormatKey,

  /** The artifact it builds — a paginated PDF rendered in the preview. */
  artifact: {
    file: "nasdaq-top-performers.pdf",
    pages: 4,
    title: "NASDAQ Top Performers",
    subtitle: "February 8 – May 8, 2026",
    section: "Executive Summary",
    lines: [
      "Semiconductors dominated the quarter, led by AI-server demand.",
      "Biotech delivered the single highest percentage gain.",
      "Memory and storage names rode a supply-driven rally.",
    ],
  },
} as const;

export const FORMAT_LABEL: Record<FormatKey, string> = {
  doc: "Doc",
  sheet: "Sheet",
  slides: "Slides",
  word: "Word",
  excel: "Excel",
  ppt: "PPT",
  pdf: "PDF",
};
