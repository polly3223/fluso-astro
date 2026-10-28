import { motion } from "motion/react";
import type { CSSProperties } from "react";
import { ink, ACCENT } from "./kit";
import { E } from "./v1kit";
import type { StepStatus } from "./v3kit";
import type { ToolKey } from "./v5data";

import gmailIcon from "../../../assets/connectors/gmail.svg?url";
import outlookIcon from "../../../assets/connectors/outlook.svg?url";
import driveIcon from "../../../assets/connectors/google-drive.svg?url";
import calendarIcon from "../../../assets/connectors/google-calendar.svg?url";
import slackIcon from "../../../assets/connectors/slack.svg?url";
import teamsIcon from "../../../assets/connectors/microsoft-teams.svg?url";
import notionIcon from "../../../assets/connectors/notion.svg?url";
import linearIcon from "../../../assets/connectors/linear.svg?url";

/* ------------------------------------------------------------------ *
 * v5 shared kit — "Plugs into tools you already use".
 * Official tool icons + a one-click Connect → Connected toggle, plus the
 * reassurances (no migration, no passwords). Built on the v1 language.
 * ------------------------------------------------------------------ */

export const TOOL_SRC: Record<ToolKey, string> = {
  gmail: gmailIcon,
  outlook: outlookIcon,
  drive: driveIcon,
  calendar: calendarIcon,
  slack: slackIcon,
  teams: teamsIcon,
  notion: notionIcon,
  linear: linearIcon,
};

/* Monochrome (solid-black) brand marks that vanish on the dark tile — flip them
 * to white so they read like the colored logos. */
const MONO_TOOLS = new Set<ToolKey>(["notion"]);
export const toolIconStyle = (k: ToolKey): CSSProperties | undefined =>
  MONO_TOOLS.has(k) ? { filter: "brightness(0) invert(1)" } : undefined;

const CHECK = (
  <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden>
    <path d="M2.8 6.2 5 8.4 9.2 3.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const LOCK = (
  <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden>
    <rect x="3" y="6.2" width="8" height="5.6" rx="1.5" stroke="currentColor" strokeWidth="1.1" />
    <path d="M4.7 6.2V4.9a2.3 2.3 0 0 1 4.6 0v1.3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
  </svg>
);

/** Tiny spinner for the "connecting" state. */
function MiniSpinner({ reduced }: { reduced: boolean }) {
  return (
    <span className="relative grid size-[12px] place-items-center">
      <span className="absolute inset-0 rounded-full" style={{ boxShadow: `inset 0 0 0 1.4px ${ink(0.14)}` }} />
      <motion.span
        className="absolute inset-0 rounded-full"
        style={{ borderTop: `1.4px solid ${ACCENT}`, borderRight: "1.4px solid transparent", borderBottom: "1.4px solid transparent", borderLeft: "1.4px solid transparent" }}
        animate={reduced ? {} : { rotate: 360 }}
        transition={reduced ? { duration: 0 } : { duration: 0.85, ease: "linear", repeat: Infinity }}
      />
    </span>
  );
}

/** The connect control: Connect → Connecting → Connected. */
export function ConnectPill({ status, reduced }: { status: StepStatus; reduced: boolean }) {
  if (status === "done") {
    return (
      <span
        className="inline-flex items-center gap-1 rounded-[7px] px-2 py-1 text-[10.5px] font-medium"
        style={{ color: ACCENT, background: "rgba(166,190,206,0.12)", boxShadow: "inset 0 0 0 1px rgba(166,190,206,0.3)" }}
      >
        {CHECK} Connected
      </span>
    );
  }
  if (status === "running") {
    return (
      <span
        className="inline-flex items-center gap-1.5 rounded-[7px] px-2 py-1 text-[10.5px] font-medium"
        style={{ color: ink(0.6), boxShadow: `inset 0 0 0 1px ${ink(0.12)}` }}
      >
        <MiniSpinner reduced={reduced} /> Connecting
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center rounded-[7px] px-2.5 py-1 text-[10.5px] font-medium"
      style={{ color: ink(0.85), background: ink(0.08), boxShadow: `inset 0 0 0 1px ${ink(0.12)}` }}
    >
      Connect
    </span>
  );
}

/** A tool tile: official icon + name + connect control. */
export function ToolTile({
  toolKey,
  name,
  status,
  reduced,
  className,
  style,
}: {
  toolKey: ToolKey;
  name: string;
  status: StepStatus;
  reduced: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const connected = status === "done";
  return (
    <div
      className={className}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        borderRadius: 10,
        padding: "10px 12px",
        background: connected ? "rgba(166,190,206,0.06)" : ink(0.03),
        boxShadow: `inset 0 0 0 1px ${connected ? "rgba(166,190,206,0.24)" : ink(0.07)}`,
        ...style,
      }}
    >
      <span className="grid size-[28px] shrink-0 place-items-center rounded-[7px]" style={{ background: ink(0.04), boxShadow: `inset 0 0 0 1px ${ink(0.06)}` }}>
        <img src={TOOL_SRC[toolKey]} alt="" width={16} height={16} className="size-[16px] object-contain" style={toolIconStyle(toolKey)} />
      </span>
      <span className="min-w-0 flex-1 truncate text-[13px] font-medium tracking-[-0.01em]" style={{ color: ink(connected ? 0.92 : 0.78) }}>
        {name}
      </span>
      <ConnectPill status={status} reduced={reduced} />
    </div>
  );
}

/** The reassurance footer — one click, no migration, no passwords handed off. */
export function AssuranceBar({ items, reduced, delay = 0 }: { items: readonly string[]; reduced: boolean; delay?: number }) {
  return (
    <motion.div
      className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5"
      initial={reduced ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduced ? { duration: 0 } : { duration: 0.4, ease: E.emphasized, delay }}
    >
      <span className="grid size-[20px] place-items-center rounded-full" style={{ color: ACCENT, boxShadow: "inset 0 0 0 1px rgba(166,190,206,0.28)" }}>
        {LOCK}
      </span>
      {items.map((it, i) => (
        <span key={it} className="flex items-center gap-2.5 text-[11.5px]" style={{ color: ink(0.55) }}>
          {it}
          {i < items.length - 1 && <span style={{ color: ink(0.25) }}>·</span>}
        </span>
      ))}
    </motion.div>
  );
}
