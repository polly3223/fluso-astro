/* v3 — "Performs complex multi-step tasks" (how-step-2-reason.mp4).
   A complex task is broken into steps (research → draft → check → revise);
   each step runs on the right model — fast where that's enough, frontier where
   it matters — then a finished, cited artifact comes out. Copy verbatim. */

export type StepModel = "fast" | "frontier";

export type TaskStep = {
  name: string;
  detail: string;
  model: StepModel;
};

export const V3 = {
  heading: "Performs complex multi-step tasks",
  body:
    "Breaks the work into steps: research, draft, check, revise. Each step runs on the right model, fast where that's enough, frontier where it matters.",

  /** The task that's broken down — real from the recording, trimmed. */
  prompt: "Do a deep research on the best performing NASDAQ stocks over the last 3 months.",

  /** The four steps, each routed to the model that fits. */
  steps: [
    { name: "Research", detail: "Gather sources & market data", model: "frontier" },
    { name: "Draft", detail: "Write the report", model: "frontier" },
    { name: "Check", detail: "Verify figures & citations", model: "fast" },
    { name: "Revise", detail: "Tighten and format", model: "fast" },
  ] satisfies TaskStep[],

  /** What comes out the other end. */
  result: { name: "nasdaq-top-performers.md", meta: "29 sources · ~25 KB" },

  /* ---- Chat / reasoning interface (the real how-2 UI) ---- */

  /** The user's message in the thread. */
  query: "Do a deep research on the best performing NASDAQ stocks over the last 3 months.",

  /** Elapsed reasoning time, like the recording's "Worked for 8m 43s". */
  worked: "8m 43s",

  /** The reasoning trace — one line per step, each tagged with its model. */
  reasoning: [
    { step: "Research", line: "Pulled 50+ NASDAQ tickers and 3 months of price data", model: "frontier" },
    { step: "Draft", line: "Wrote the report with per-sector breakdowns", model: "frontier" },
    { step: "Check", line: "Verified every figure against its source", model: "fast" },
    { step: "Revise", line: "Tightened the prose and formatted to share", model: "fast" },
  ] as { step: string; line: string; model: StepModel }[],

  /** The streamed answer — a report with a title, body lines, and citations. */
  report: {
    file: "nasdaq-top-performers.md",
    sources: "29 sources",
    title: "NASDAQ top performers · Feb–May 2026",
    lines: [
      { text: "Semiconductors dominated, led by AI-server demand", cite: "1" },
      { text: "Biotech delivered the single highest percentage gain", cite: "7" },
      { text: "Memory & storage rode a supply-driven rally", cite: "12" },
    ],
  },
} as const;
