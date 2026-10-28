import { motion } from "motion/react";
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/utils/styles";
import { ACCENT, ink } from "./kit";
import { E } from "./v1kit";
import type { StepModel } from "./v3data";

/* ------------------------------------------------------------------ *
 * v3 shared kit — "Performs complex multi-step tasks".
 * The new vocabulary: a step's status (pending → running → done), the
 * model it runs on (fast / frontier), a pipeline spine, a "Worked for"
 * timer, and the finished artifact. Built on the v1 language.
 * ------------------------------------------------------------------ */

export type StepStatus = "pending" | "running" | "done";

const I = {
  bolt: (
    <svg width="11" height="11" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path d="M7.6 1.5 3.2 8h3l-.8 4.5L10.8 6h-3z" fill="currentColor" />
    </svg>
  ),
  diamond: (
    <svg width="11" height="11" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path d="M7 1.4c.45 2.9 1.3 3.75 4.2 4.2-2.9.45-3.75 1.3-4.2 4.2-.45-2.9-1.3-3.75-4.2-4.2 2.9-.45 3.75-1.3 4.2-4.2Z" fill="currentColor" />
    </svg>
  ),
  check: (
    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path d="M2.8 6.2 5 8.4 9.2 3.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  doc: (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M4 1.8h5l3 3V14H4z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M8.9 1.9V5h3M6 8.4h4M6 10.6h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
} as const;

const MODEL_LABEL: Record<StepModel, string> = { fast: "fast", frontier: "frontier" };

/** Pill marking which model a step runs on. frontier = the accent (where it matters). */
export function ModelBadge({ model }: { model: StepModel }) {
  const frontier = model === "frontier";
  return (
    <span
      className="inline-flex items-center gap-1 rounded-[6px] px-1.5 py-[3px] text-[10px] font-medium tracking-[-0.01em]"
      style={{
        color: frontier ? ACCENT : ink(0.55),
        background: frontier ? "rgba(166,190,206,0.10)" : ink(0.05),
        boxShadow: `inset 0 0 0 1px ${frontier ? "rgba(166,190,206,0.30)" : ink(0.08)}`,
      }}
    >
      {frontier ? I.diamond : I.bolt}
      {MODEL_LABEL[model]}
    </span>
  );
}

/** Status dot: hollow (pending) → spinning arc (running, accent) → check (done). */
export function StatusDot({ status, reduced }: { status: StepStatus; reduced: boolean }) {
  if (status === "done") {
    return (
      <span className="grid size-[18px] shrink-0 place-items-center rounded-full" style={{ background: ACCENT, color: "#0c0c0c" }}>
        {I.check}
      </span>
    );
  }
  if (status === "running") {
    return (
      <span className="relative grid size-[18px] shrink-0 place-items-center">
        <span className="absolute inset-0 rounded-full" style={{ boxShadow: `inset 0 0 0 1.5px ${ink(0.12)}` }} />
        <motion.span
          className="absolute inset-0 rounded-full"
          style={{ borderTop: `1.5px solid ${ACCENT}`, borderRight: "1.5px solid transparent", borderBottom: "1.5px solid transparent", borderLeft: "1.5px solid transparent" }}
          animate={reduced ? {} : { rotate: 360 }}
          transition={reduced ? { duration: 0 } : { duration: 0.9, ease: "linear", repeat: Infinity }}
        />
      </span>
    );
  }
  return <span className="size-[18px] shrink-0 rounded-full" style={{ boxShadow: `inset 0 0 0 1.5px ${ink(0.12)}` }} />;
}

/** A pipeline step row: status · name + detail · model badge. */
export function StepRow({
  name,
  detail,
  model,
  status,
  reduced,
  className,
  style,
}: {
  name: string;
  detail: string;
  model: StepModel;
  status: StepStatus;
  reduced: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const active = status === "running";
  const done = status === "done";
  return (
    <div
      className={cn("flex items-center gap-3 rounded-[10px] px-3 py-2.5", className)}
      style={{
        background: active ? "rgba(166,190,206,0.06)" : ink(0.03),
        boxShadow: `inset 0 0 0 1px ${active ? "rgba(166,190,206,0.28)" : ink(0.07)}`,
        ...style,
      }}
    >
      <StatusDot status={status} reduced={reduced} />
      <span className="min-w-0 flex-1">
        <span className="block text-[13px] font-medium tracking-[-0.01em]" style={{ color: ink(done || active ? 0.92 : 0.62) }}>
          {name}
        </span>
        <span className="block text-[11px]" style={{ color: ink(0.42) }}>
          {detail}
        </span>
      </span>
      <ModelBadge model={model} />
    </div>
  );
}

/** The finished artifact that comes out of the pipeline. */
export function ResultCard({ name, meta }: { name: string; meta: string }) {
  return (
    <div
      className="flex items-center gap-2.5 rounded-[10px] px-3 py-2.5"
      style={{ background: "rgba(166,190,206,0.07)", boxShadow: `inset 0 0 0 1px rgba(166,190,206,0.28)` }}
    >
      <span className="grid size-[26px] shrink-0 place-items-center rounded-[7px]" style={{ color: ACCENT, boxShadow: `inset 0 0 0 1px rgba(166,190,206,0.3)` }}>
        {I.doc}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-mono text-[12px]" style={{ color: ink(0.9) }}>{name}</span>
        <span className="block text-[11px]" style={{ color: ink(0.45) }}>{meta}</span>
      </span>
      <span className="grid size-[18px] shrink-0 place-items-center rounded-full" style={{ background: ACCENT, color: "#0c0c0c" }}>
        {I.check}
      </span>
    </div>
  );
}

export type PipelineState = {
  statuses: StepStatus[];
  doneCount: number;
  ratio: number;
  resultIn: boolean;
};

/** Drives the sequential pipeline: each step pending → running → done in turn,
 *  then the result appears. Re-runs each cycle; settles instantly on reduced. */
export function usePipeline(
  cycle: number,
  reduced: boolean,
  count: number,
  opts?: { start?: number; step?: number; run?: number; resultGap?: number },
): PipelineState {
  const start = opts?.start ?? 1.4;
  const step = opts?.step ?? 1.0;
  const run = opts?.run ?? 0.85;
  const resultGap = opts?.resultGap ?? 0.3;

  const [doneCount, setDoneCount] = useState(reduced ? count : 0);
  const [running, setRunning] = useState(-1);
  const [resultIn, setResultIn] = useState(reduced);

  useEffect(() => {
    if (reduced) {
      setDoneCount(count);
      setRunning(-1);
      setResultIn(true);
      return;
    }
    setDoneCount(0);
    setRunning(-1);
    setResultIn(false);
    const timers: number[] = [];
    for (let i = 0; i < count; i++) {
      timers.push(window.setTimeout(() => setRunning(i), (start + i * step) * 1000));
      timers.push(
        window.setTimeout(() => {
          setDoneCount(i + 1);
          if (i === count - 1) setRunning(-1);
        }, (start + i * step + run) * 1000),
      );
    }
    timers.push(window.setTimeout(() => setResultIn(true), (start + count * step + resultGap) * 1000));
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [cycle, reduced, count, start, step, run, resultGap]);

  const statuses: StepStatus[] = Array.from({ length: count }, (_, i) =>
    i < doneCount ? "done" : i === running ? "running" : "pending",
  );
  return { statuses, doneCount, ratio: count ? doneCount / count : 0, resultIn };
}

/** mm:ss "Worked for" timer that climbs while the pipeline runs. */
export function useWorkedClock(cycle: number, reduced: boolean, runMs: number, startDelay: number): string {
  const [s, setS] = useState(0);
  useEffect(() => {
    if (reduced) {
      setS(523); // settled 8:43, like the recording
      return;
    }
    setS(0);
    let raf = 0;
    const begin = performance.now() + startDelay;
    const tick = (now: number) => {
      const t = Math.max(0, Math.min(1, (now - begin) / runMs));
      setS(Math.round(t * 523));
      if (now - begin < runMs) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [cycle, reduced, runMs, startDelay]);
  const mm = Math.floor(s / 60);
  const ss = String(s % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

/** A label that pairs the "Worked for" caption with the live clock. */
export function WorkedFor({ clock }: { clock: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px]" style={{ color: ink(0.45) }}>
      Worked for <span className="tabular-nums" style={{ color: ink(0.7) }}>{clock}</span>
    </span>
  );
}

/* ============================================================== *
 * Chat / reasoning interface — the real how-2 UI (query → reasoning
 * trace with model tags → streamed report). This is the interface
 * v3 reproduces; the abstract pipeline pieces above are kept for the
 * earlier takes.
 * ============================================================== */

/** Small rotating arc used in the "thinking" header. */
function Spinner({ reduced }: { reduced: boolean }) {
  return (
    <span className="relative grid size-[16px] place-items-center">
      <span className="absolute inset-0 rounded-full" style={{ boxShadow: `inset 0 0 0 1.5px ${ink(0.12)}` }} />
      <motion.span
        className="absolute inset-0 rounded-full"
        style={{ borderTop: `1.5px solid ${ACCENT}`, borderRight: "1.5px solid transparent", borderBottom: "1.5px solid transparent", borderLeft: "1.5px solid transparent" }}
        animate={reduced ? {} : { rotate: 360 }}
        transition={reduced ? { duration: 0 } : { duration: 0.9, ease: "linear", repeat: Infinity }}
      />
    </span>
  );
}

/** The user's message bubble in the thread (right-aligned). */
export function UserBubble({ text, reduced, delay = 0 }: { text: string; reduced: boolean; delay?: number }) {
  return (
    <motion.div
      className="flex justify-end"
      initial={reduced ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduced ? { duration: 0 } : { duration: 0.4, ease: E.emphasized, delay }}
    >
      <div
        className="max-w-[80%] rounded-[12px] rounded-br-[4px] px-3.5 py-2.5 text-[13px] leading-snug"
        style={{ background: ink(0.07), boxShadow: `inset 0 0 0 1px ${ink(0.09)}`, color: ink(0.88) }}
      >
        {text}
      </div>
    </motion.div>
  );
}

/** One line of the reasoning trace: status · line · model tag. */
export function ReasoningLine({
  line,
  model,
  status,
  reduced,
}: {
  line: string;
  model: StepModel;
  status: StepStatus;
  reduced: boolean;
}) {
  return (
    <motion.div
      className="flex items-center gap-2.5"
      initial={reduced ? false : { opacity: 0, x: -6 }}
      animate={{ opacity: status === "pending" ? 0.4 : 1, x: 0 }}
      transition={reduced ? { duration: 0 } : { duration: 0.35, ease: E.emphasized }}
    >
      <StatusDot status={status} reduced={reduced} />
      <span className="min-w-0 flex-1 truncate text-[12px] tracking-[-0.01em]" style={{ color: ink(status === "pending" ? 0.4 : 0.7) }}>
        {line}
      </span>
      <ModelBadge model={model} />
    </motion.div>
  );
}

/** The assistant's reasoning block: a "Worked for m:ss" header + the trace. */
export function ReasoningTrace({
  items,
  statuses,
  clock,
  done,
  reduced,
}: {
  items: { line: string; model: StepModel }[];
  statuses: StepStatus[];
  clock: string;
  done: boolean;
  reduced: boolean;
}) {
  return (
    <div className="rounded-[11px] p-3" style={{ background: ink(0.025), boxShadow: `inset 0 0 0 1px ${ink(0.07)}` }}>
      <div className="mb-2.5 flex items-center gap-2">
        {done ? (
          <span className="grid size-[16px] place-items-center rounded-full" style={{ background: ACCENT, color: "#0c0c0c" }}>
            <svg width="9" height="9" viewBox="0 0 12 12" fill="none" aria-hidden>
              <path d="M2.8 6.2 5 8.4 9.2 3.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        ) : (
          <Spinner reduced={reduced} />
        )}
        <span className="text-[12px] font-medium" style={{ color: ink(0.72) }}>
          {done ? "Reasoned" : "Reasoning"} for
        </span>
        <span className="tabular-nums text-[12px]" style={{ color: ink(0.55) }}>{clock}</span>
      </div>
      <div className="flex flex-col gap-1.5">
        {items.map((it, i) => (
          <ReasoningLine key={it.line} line={it.line} model={it.model} status={statuses[i]} reduced={reduced} />
        ))}
      </div>
    </div>
  );
}

/** A tiny citation chip, like [12]. */
function Cite({ n }: { n: string }) {
  return (
    <span
      className="ml-1 inline-flex items-center rounded-[4px] px-1 align-[1px] text-[9px] font-medium tabular-nums"
      style={{ color: ACCENT, background: "rgba(166,190,206,0.12)" }}
    >
      {n}
    </span>
  );
}

/** The streamed report answer: file pill + title + body lines with citations. */
export function ReportCard({
  report,
  reduced,
}: {
  report: {
    file: string;
    sources: string;
    title: string;
    lines: readonly { readonly text: string; readonly cite: string }[];
  };
  reduced: boolean;
}) {
  return (
    <motion.div
      className="rounded-[11px] p-3"
      style={{ background: "rgba(166,190,206,0.06)", boxShadow: `inset 0 0 0 1px rgba(166,190,206,0.22)` }}
      initial={reduced ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduced ? { duration: 0 } : { duration: 0.5, ease: E.emphasized }}
    >
      <div className="mb-2.5 flex items-center gap-2">
        <span className="grid size-[22px] shrink-0 place-items-center rounded-[6px]" style={{ color: ACCENT, boxShadow: `inset 0 0 0 1px rgba(166,190,206,0.3)` }}>
          {I.doc}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-mono text-[11.5px]" style={{ color: ink(0.9) }}>{report.file}</span>
          <span className="block text-[10.5px]" style={{ color: ink(0.45) }}>{report.sources}</span>
        </span>
      </div>
      <div className="text-[12px] font-medium tracking-[-0.01em]" style={{ color: ink(0.85) }}>{report.title}</div>
      <div className="mt-1.5 flex flex-col gap-1">
        {report.lines.map((l, i) => (
          <motion.div
            key={l.text}
            className="text-[11.5px] leading-snug"
            style={{ color: ink(0.6) }}
            initial={reduced ? false : { opacity: 0, clipPath: "inset(0 100% 0 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0% 0 0)" }}
            transition={reduced ? { duration: 0 } : { duration: 0.5, ease: E.reveal, delay: 0.2 + i * 0.18 }}
          >
            {l.text}
            <Cite n={l.cite} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/** Wraps step children with a vertical spine whose fill tracks progress 0–1. */
export function Spine({ progress, reduced, children }: { progress: number; reduced: boolean; children: ReactNode }) {
  return (
    <div className="relative pl-5">
      <span className="absolute left-[7px] top-2 bottom-2 w-px" style={{ background: ink(0.1) }} />
      <motion.span
        className="absolute left-[7px] top-2 w-px origin-top"
        style={{ background: ACCENT, bottom: 8 }}
        initial={reduced ? false : { scaleY: 0 }}
        animate={{ scaleY: progress }}
        transition={reduced ? { duration: 0 } : { duration: 0.4, ease: E.emphasized }}
      />
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}
