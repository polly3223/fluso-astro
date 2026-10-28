import { motion } from "motion/react";
import type { CSSProperties } from "react";
import { ink, ACCENT } from "./kit";
import { E } from "./v1kit";
import type { StepStatus } from "./v3kit";
import type { Channel } from "./v6data";

import gmailIcon from "../../../assets/connectors/gmail.svg?url";
import slackIcon from "../../../assets/connectors/slack.svg?url";
import teamsIcon from "../../../assets/connectors/microsoft-teams.svg?url";

/* ------------------------------------------------------------------ *
 * v6 shared kit — "Flows through your communications".
 * A note drafted in your voice, delivered through email · Slack · Teams,
 * each with a Sending → Sent confirmation. Built on the v1 language.
 * ------------------------------------------------------------------ */

export const CHANNEL_SRC: Record<Channel, string> = {
  email: gmailIcon,
  slack: slackIcon,
  teams: teamsIcon,
};
export const CHANNEL_LABEL: Record<Channel, string> = {
  email: "Email",
  slack: "Slack",
  teams: "Teams",
};

const CHECK = (
  <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden>
    <path d="M2.8 6.2 5 8.4 9.2 3.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const PEN = (
  <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden>
    <path d="M9.5 2.5 11.5 4.5 5 11l-2.5.5L3 9z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
  </svg>
);

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

function initials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

/** The note Fluso drafts, in your voice. */
export function DraftCard({ text, signoff, reduced }: { text: string; signoff: string; reduced: boolean }) {
  return (
    <motion.div
      className="rounded-[11px] p-3"
      style={{ background: ink(0.03), boxShadow: `inset 0 0 0 1px ${ink(0.07)}` }}
      initial={reduced ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduced ? { duration: 0 } : { duration: 0.45, ease: E.emphasized }}
    >
      <div className="mb-2 flex items-center gap-1.5 text-[11px] font-medium" style={{ color: ink(0.55) }}>
        <span style={{ color: ACCENT }}>{PEN}</span>
        Draft
      </div>
      <p className="text-[12px] leading-snug" style={{ color: ink(0.78) }}>{text}</p>
      <p className="mt-1.5 text-[11px] italic" style={{ color: ink(0.42) }}>{signoff}</p>
    </motion.div>
  );
}

/** The pill on a delivery card: Sending → Sent. */
function SendPill({ status, reduced }: { status: StepStatus; reduced: boolean }) {
  if (status === "done") {
    return (
      <span className="inline-flex items-center gap-1 rounded-[7px] px-2 py-1 text-[10.5px] font-medium" style={{ color: ACCENT, background: "rgba(166,190,206,0.12)", boxShadow: "inset 0 0 0 1px rgba(166,190,206,0.3)" }}>
        {CHECK} Sent
      </span>
    );
  }
  if (status === "running") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-[7px] px-2 py-1 text-[10.5px] font-medium" style={{ color: ink(0.6), boxShadow: `inset 0 0 0 1px ${ink(0.12)}` }}>
        <MiniSpinner reduced={reduced} /> Sending
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-[7px] px-2 py-1 text-[10.5px] font-medium" style={{ color: ink(0.45) }}>
      Queued
    </span>
  );
}

/** A delivery: channel icon + recipient + Sending/Sent state. */
export function DeliveryCard({
  channel,
  to,
  detail,
  status,
  reduced,
  className,
  style,
}: {
  channel: Channel;
  to: string;
  detail: string;
  status: StepStatus;
  reduced: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const sent = status === "done";
  return (
    <div
      className={className}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        borderRadius: 10,
        padding: "10px 12px",
        background: sent ? "rgba(166,190,206,0.06)" : ink(0.03),
        boxShadow: `inset 0 0 0 1px ${sent ? "rgba(166,190,206,0.24)" : ink(0.07)}`,
        ...style,
      }}
    >
      <span className="relative grid size-[30px] shrink-0 place-items-center rounded-[8px]" style={{ background: ink(0.05), boxShadow: `inset 0 0 0 1px ${ink(0.07)}` }}>
        <span className="grid size-[18px] place-items-center rounded-full text-[8px] font-semibold" style={{ background: ink(0.14), color: ink(0.8) }}>
          {initials(to)}
        </span>
        {/* channel badge */}
        <span className="absolute -bottom-1 -right-1 grid size-[15px] place-items-center rounded-full" style={{ background: "#0e0e0e", boxShadow: `inset 0 0 0 1px ${ink(0.12)}` }}>
          <img src={CHANNEL_SRC[channel]} alt="" width={10} height={10} className="size-[10px] object-contain" />
        </span>
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[12.5px] font-medium tracking-[-0.01em]" style={{ color: ink(sent ? 0.92 : 0.78) }}>{to}</span>
        <span className="block truncate text-[10.5px]" style={{ color: ink(0.45) }}>{CHANNEL_LABEL[channel]} · {detail}</span>
      </span>
      <SendPill status={status} reduced={reduced} />
    </div>
  );
}
