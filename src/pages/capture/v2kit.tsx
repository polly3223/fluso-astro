import { motion } from "motion/react";
import type { CSSProperties, ReactNode } from "react";
import { ink } from "./kit";
import { E } from "./v1kit";
import type { CommitSource } from "./v2data";
import gmailLogo from "../../../assets/connectors/gmail.svg?url";
import slackLogo from "../../../assets/connectors/slack.svg?url";
import driveLogo from "../../../assets/connectors/google-drive.svg?url";
import calendarLogo from "../../../assets/connectors/google-calendar.svg?url";

/* ------------------------------------------------------------------ *
 * v2 shared kit — "Tracks outstanding work".
 * The new mechanic vs v1: each commitment is STAMPED with three marks —
 * owner, deadline, and where it came from. Built on the v1 language.
 * ------------------------------------------------------------------ */

const I = {
  clock: (
    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden>
      <circle cx="7" cy="7" r="5.2" stroke="currentColor" strokeWidth="1.2" />
      <path d="M7 4.2V7l2 1.4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
} as const;

/* Real brand glyphs per source — Gmail, Slack, Drive, Calendar — so the intake
 * row reads as the actual integrations it pulls from (not generic line art). */
const SRC_LOGO: Record<CommitSource, string> = {
  email: gmailLogo,
  slack: slackLogo,
  doc: driveLogo,
  meeting: calendarLogo,
};

/** A source glyph for the intake row (Calendar / Slack / Drive / Gmail). */
export function SrcGlyph({ k, size = 14 }: { k: CommitSource; size?: number }) {
  return (
    <img
      src={SRC_LOGO[k]}
      alt=""
      width={size}
      height={size}
      className="shrink-0 object-contain"
      style={{ width: size, height: size }}
    />
  );
}

const SRC_LABEL: Record<CommitSource, string> = {
  email: "Gmail",
  slack: "Slack",
  doc: "Drive",
  meeting: "Calendar",
};

/** A single chip (icon + text) with a "stamp" landing animation. */
function StampChip({
  children,
  reduced,
  delay,
  accent = false,
}: {
  children: ReactNode;
  reduced: boolean;
  delay: number;
  accent?: boolean;
}) {
  return (
    <motion.span
      className="inline-flex items-center gap-1 rounded-[6px] px-1.5 py-[3px] text-[10.5px] font-medium tracking-[-0.01em]"
      style={{ color: ink(0.62), background: ink(0.05), boxShadow: `inset 0 0 0 1px ${ink(0.08)}` }}
      initial={reduced ? false : { opacity: 0, scale: 1.22, rotate: -3 }}
      animate={
        reduced
          ? {}
          : {
              opacity: 1,
              scale: 1,
              rotate: 0,
              boxShadow: [
                `inset 0 0 0 1px ${ink(0.08)}, 0 0 0 0 rgba(166,190,206,0)`,
                `inset 0 0 0 1px ${accent ? "rgba(166,190,206,0.5)" : ink(0.08)}, 0 0 7px -3px rgba(166,190,206,0.4)`,
                `inset 0 0 0 1px ${ink(0.08)}, 0 0 0 0 rgba(166,190,206,0)`,
              ],
            }
      }
      transition={
        reduced
          ? { duration: 0 }
          : { duration: 0.42, ease: E.emphasized, delay, boxShadow: { duration: 0.6, ease: E.emphasized, delay } }
      }
    >
      {children}
    </motion.span>
  );
}

/** The three stamps a commitment gets: owner · deadline · source. */
export function StampChips({
  owner,
  initials,
  deadline,
  from,
  reduced,
  baseDelay,
  step = 0.32,
}: {
  owner: string;
  initials: string;
  deadline: string;
  from: CommitSource;
  reduced: boolean;
  baseDelay: number;
  step?: number;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <StampChip reduced={reduced} delay={baseDelay} accent>
        <span
          className="grid size-[14px] shrink-0 place-items-center rounded-full text-[8px] font-semibold leading-none"
          style={{ background: ink(0.14), color: ink(0.82) }}
        >
          {initials.charAt(0)}
        </span>
        <span style={{ color: ink(0.72) }}>{owner}</span>
      </StampChip>
      <StampChip reduced={reduced} delay={baseDelay + step}>
        <span style={{ color: ink(0.5) }}>{I.clock}</span>
        <span className="tabular-nums">{deadline}</span>
      </StampChip>
      <StampChip reduced={reduced} delay={baseDelay + step * 2}>
        <span style={{ color: ink(0.45) }}>from</span>
        <SrcGlyph k={from} size={12} />
        <span>{SRC_LABEL[from]}</span>
      </StampChip>
    </div>
  );
}

/** A commitment card: title + the three stamps beneath it. */
export function CommitmentCard({
  title,
  owner,
  initials,
  deadline,
  from,
  reduced,
  stampDelay,
  featured = false,
  className,
  style,
}: {
  title: string;
  owner: string;
  initials: string;
  deadline: string;
  from: CommitSource;
  reduced: boolean;
  stampDelay: number;
  featured?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={className}
      style={{ background: ink(featured ? 0.06 : 0.03), boxShadow: `inset 0 0 0 1px ${ink(featured ? 0.12 : 0.07)}`, borderRadius: 9, padding: "10px 12px", ...style }}
    >
      <div className="flex items-center gap-2.5">
        <SrcGlyph k={from} />
        <span
          className="min-w-0 flex-1 truncate text-[13px] tracking-[-0.01em]"
          style={{ color: ink(featured ? 0.95 : 0.7), fontWeight: featured ? 500 : 400 }}
        >
          {title}
        </span>
      </div>
      <div className="mt-2 pl-[26px]">
        <StampChips
          owner={owner}
          initials={initials}
          deadline={deadline}
          from={from}
          reduced={reduced}
          baseDelay={stampDelay}
        />
      </div>
    </div>
  );
}

/** The feature copy block — "Tracks outstanding work" + body. */
export function FeatureCopy({
  heading,
  body,
  reduced,
}: {
  heading: string;
  body: string;
  reduced: boolean;
}) {
  return (
    <div className="max-w-[34ch]">
      <motion.h3
        className="text-[clamp(17px,1.4vw,22px)] font-medium tracking-[-0.02em]"
        style={{ color: ink(0.95) }}
        initial={reduced ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={reduced ? { duration: 0 } : { duration: 0.5, ease: E.emphasized, delay: 0.3 }}
      >
        {heading}
      </motion.h3>
      <motion.p
        className="mt-2.5 text-[13px] leading-[1.55]"
        style={{ color: ink(0.55) }}
        initial={reduced ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={reduced ? { duration: 0 } : { duration: 0.5, ease: E.emphasized, delay: 0.45 }}
      >
        {body}
      </motion.p>
    </div>
  );
}
