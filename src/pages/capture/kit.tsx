import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/utils/styles";
import type { SourceKey } from "./data";

/** One Capture motion study. `Stage` fills its parent window panel. */
export type CaptureVariant = {
  id: string;
  technique: "2.5D" | "3D";
  title: string;
  note: string;
  Stage: () => ReactNode;
};

/** Shared loop clock — re-keys a scene every `ms` so a choreographed
 *  sequence replays. Disabled (returns 0) when reduced motion is set. */
export function useCycle(ms: number, enabled = true): number {
  const [c, setC] = useState(0);
  useEffect(() => {
    if (!enabled) return;
    const id = window.setInterval(() => setC((x) => x + 1), ms);
    return () => window.clearInterval(id);
  }, [ms, enabled]);
  return c;
}

import gmailLogo from "../../../assets/connectors/gmail.svg?url";
import slackLogo from "../../../assets/connectors/slack.svg?url";

/* Shared visual language for the Capture motion variants. Pure presentation —
   each variant supplies its own motion choreography around these pieces. */

export const EASE = [0.22, 1, 0.36, 1] as const;
export const EASE_SNAP = [0.7, 0, 0.2, 1] as const;
export const ACCENT = "#ffffff"; // blue-300
export const ink = (o: number) => `rgba(250,249,245,${o})`;

export const ICON = {
  paperclip: (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M11.2 7.3 7.5 11a2.2 2.2 0 0 1-3.1-3.1l4.2-4.2a1.4 1.4 0 0 1 2 2L6.3 9.9a.6.6 0 0 1-.9-.9l3.6-3.6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  mic: (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect x="6" y="2.2" width="4" height="7" rx="2" stroke="currentColor" strokeWidth="1.2" />
      <path d="M3.8 7.4a4.2 4.2 0 0 0 8.4 0M8 11.6v2.2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  ),
  enter: (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M12.5 4v2.6a2 2 0 0 1-2 2H4M6.4 6.1 3.6 8.6l2.8 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  chevron: (
    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path d="M4.5 3 7.5 6 4.5 9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  plus: (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path d="M6 1.5v9M1.5 6h9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  ),
  monitor: (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect x="2" y="3" width="12" height="8" rx="1.4" stroke="currentColor" strokeWidth="1.2" />
      <path d="M6 13.5h4M8 11v2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  ),
  check: (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M3.5 8.2 6.5 11 12.5 4.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  x: (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  ),
  envelope: (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect x="2" y="3.5" width="12" height="9" rx="1.6" stroke="currentColor" strokeWidth="1.2" />
      <path d="m2.6 4.5 5.4 4 5.4-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  globe: (
    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden>
      <circle cx="7" cy="7" r="5.2" stroke="currentColor" strokeWidth="1.1" />
      <path d="M1.8 7h10.4M7 1.8c1.5 1.6 1.5 8.8 0 10.4M7 1.8c-1.5 1.6-1.5 8.8 0 10.4" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  ),
  folder: (
    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path d="M1.6 3.6c0-.6.4-1 1-1h2.3l1.1 1.2h4.8c.6 0 1 .4 1 1v5c0 .6-.4 1-1 1H2.6c-.6 0-1-.4-1-1z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
    </svg>
  ),
} as const;

/** Small source glyph for a captured row (Gmail / Slack image, or a tasks dot). */
export function SourceGlyph({ k, size = 14 }: { k: SourceKey; size?: number }) {
  if (k === "gmail" || k === "slack") {
    return (
      <img
        src={k === "gmail" ? gmailLogo : slackLogo}
        alt=""
        width={size}
        height={size}
        className="shrink-0 object-contain opacity-80"
        style={{ width: size, height: size }}
      />
    );
  }
  return <span style={{ color: ink(0.45) }}>{ICON.globe}</span>;
}

/** The three connector chips shown beside the section header. */
export function Connectors({ pulse }: { pulse?: SourceKey | null }) {
  const items: { k: SourceKey; node: ReactNode }[] = [
    { k: "tasks", node: <span style={{ color: ACCENT }}>{ICON.check}</span> },
    { k: "gmail", node: <img src={gmailLogo} alt="" className="size-[14px] object-contain" /> },
    { k: "slack", node: <img src={slackLogo} alt="" className="size-[14px] object-contain" /> },
  ];
  return (
    <div
      className="flex items-center gap-2.5 rounded-full px-2.5 py-1.5"
      style={{ background: ink(0.04), boxShadow: `inset 0 0 0 1px ${ink(0.07)}` }}
    >
      {items.map((it) => (
        <span
          key={it.k}
          className="grid place-items-center transition-transform"
          style={{
            transform: pulse === it.k ? "scale(1.25)" : "scale(1)",
            filter: pulse === it.k ? `drop-shadow(0 0 6px ${ACCENT})` : "none",
          }}
        >
          {it.node}
        </span>
      ))}
    </div>
  );
}

/** Shared row chrome class so every variant's task rows match. */
export const ROW =
  "flex items-center gap-2.5 rounded-[9px] px-3 py-2.5 text-[13px] tracking-[-0.01em]";

/** Section title + count badge + connectors. `cn` lets variants drive the count-up. */
export function Header({ title, cn: count, accent = false }: { title: string; cn: number; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <span className="text-[14px] font-medium" style={{ color: ink(0.92) }}>
          {title}
        </span>
        <span
          className="grid h-[20px] min-w-[20px] place-items-center rounded-full px-1.5 text-[11px] font-medium tabular-nums"
          style={{
            color: accent ? ACCENT : ink(0.6),
            background: ink(0.06),
            boxShadow: `inset 0 0 0 1px ${ink(0.08)}`,
          }}
        >
          {count}
        </span>
      </div>
    </div>
  );
}

/** Top input bar (placeholder query + Home pill + send). `typed` clips the text in. */
export function InputBar({
  caretClass,
  className,
}: {
  caretClass?: string;
  className?: string;
}) {
  return (
    <div
      className={cn("rounded-[13px] p-3", className)}
      style={{ background: ink(0.03), boxShadow: `inset 0 0 0 1px ${ink(0.08)}` }}
    >
      <div className="flex items-center px-1 pb-4 pt-0.5">
        <span className="text-[13px]" style={{ color: ink(0.4) }}>
          Describe what you need help with...
        </span>
        <span className={cn("ml-0.5 inline-block h-[15px] w-px", caretClass)} style={{ background: ink(0.55) }} />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5" style={{ color: ink(0.5) }}>
          {ICON.paperclip}
          <span
            className="flex items-center gap-1.5 rounded-[7px] px-2 py-1 text-[12px]"
            style={{ boxShadow: `inset 0 0 0 1px ${ink(0.08)}`, color: ink(0.6) }}
          >
            {ICON.folder} Home {ICON.chevron}
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <span style={{ color: ink(0.45) }}>{ICON.mic}</span>
          <span className="grid size-[26px] place-items-center rounded-full" style={{ background: ink(0.9), color: "#0c0c0c" }}>
            {ICON.enter}
          </span>
        </div>
      </div>
    </div>
  );
}
