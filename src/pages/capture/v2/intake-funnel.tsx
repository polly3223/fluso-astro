import { motion } from "motion/react";
import type { CaptureVariant } from "../kit";
import { ACCENT, ink, useCycle } from "../kit";
import {
  E,
  HowStage3D,
  SPRING_SETTLE,
  V1Header,
  useReducedMotion,
} from "../v1kit";
import { CommitmentCard, SrcGlyph } from "../v2kit";
import { V2, type CommitSource } from "../v2data";

export const CYCLE = 9000;

/* The featured commitment funnels from EMAIL (V2.featured.from === "email"). */
const FEATURED = V2.featured;

/* Two more commitments funnel in below — one from Slack, one from Doc — so the
 * intake reads "thread" and "doc" alongside the email. Real how-1 tasks only. */
const SECONDARY = [
  V2.commitments.find((c) => c.from === "slack") ?? V2.commitments[0],
  V2.commitments.find((c) => c.from === "doc") ?? V2.commitments[1],
] as const;

/* The four sources read across the top — order matches the source bar. */
const SOURCES = V2.sources;
const SRC_LABEL: Record<CommitSource, string> = {
  email: "Gmail",
  slack: "Slack",
  doc: "Drive",
  meeting: "Calendar",
};

/* Funnel-token x positions (% of the source-bar width) for each chip column.
 * Four chips evenly spaced → centres at ~12.5 / 37.5 / 62.5 / 87.5. */
const CHIP_X: Record<CommitSource, number> = {
  meeting: 12.5,
  slack: 37.5,
  doc: 62.5,
  email: 87.5,
};

/* Stamp beats (seconds into the 9s cycle). Front-loaded so the fully-stamped
 * state holds for most of the loop (the payoff dominates, not the build-up). */
const STAMP_FEATURED = 2.7;
const STAMP_SECONDARY = [3.3, 3.6] as const;

/**
 * @param startAt seconds into the cycle to render from. 0 = play normally.
 *   When scrubbed, the Stage is remounted with startAt = fraction × cycle so
 *   every beat that's already elapsed snaps to its end state and the rest plays
 *   out with shifted delays — i.e. the animation "seeks" to the scrub point.
 */
export function Stage({ startAt = 0, loop = true }: { startAt?: number; loop?: boolean } = {}) {
  const reduced = useReducedMotion() ?? false;
  const cycle = useCycle(CYCLE, !reduced && loop);
  // shift each choreography delay back by the seek offset (clamped at 0)
  const shift = (delay: number) => Math.max(delay - startAt, 0);

  return (
    <HowStage3D cycle={cycle} reduced={reduced} maxW={480} loop={loop}>
      <div className="flex flex-col gap-3">
        {/* ── 1. SOURCE BAR — the four reads, faint, evenly spaced ── */}
        <SourceBar reduced={reduced} shift={shift} />

        {/* ── 2. HEADER — "Needs your attention" + count 0→20 ── */}
        <motion.div
          className="px-0.5"
          initial={reduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduced ? { duration: 0 } : { duration: 0.5, ease: E.emphasized, delay: shift(0.8) }}
        >
          <V1Header cycle={cycle} reduced={reduced} live="gmail" countDelay={shift(0.9)} />
        </motion.div>

        {/* ── 3. FUNNEL + LIST ── */}
        <div className="relative flex flex-col gap-2">
          {/* curved guides + travelling tokens (decorative, screen-space in column) */}
          {!reduced && <FunnelLayer cycle={cycle} startAt={startAt} />}

          {/* FEATURED — funnels from Email, lands at the list head, then stamped */}
          <FunnelCommitment
            reduced={reduced}
            arriveDelay={shift(1.7)}
            stampDelay={shift(STAMP_FEATURED)}
            featured
            commitment={FEATURED}
          />

          {SECONDARY.map((c, i) => (
            <FunnelCommitment
              key={c.title}
              reduced={reduced}
              arriveDelay={shift(2.1 + i * 0.3)}
              stampDelay={shift(STAMP_SECONDARY[i])}
              commitment={c}
            />
          ))}
        </div>
      </div>
    </HowStage3D>
  );
}

/* ── The intake row: four labelled SrcGlyph chips. The one a commitment
 *    funnels from pulses on intake (~2.0s) — establishing "it reads sources". */
function SourceBar({ reduced, shift }: { reduced: boolean; shift: (d: number) => number }) {
  return (
    <motion.div
      className="grid grid-cols-4 gap-1.5"
      initial={reduced ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduced ? { duration: 0 } : { duration: 0.5, ease: E.emphasized, delay: shift(0.2) }}
    >
      {SOURCES.map((k, i) => (
        <motion.div
          key={k}
          className="flex items-center justify-center gap-1.5 rounded-[8px] px-2 py-1.5"
          style={{ background: ink(0.03), boxShadow: `inset 0 0 0 1px ${ink(0.06)}` }}
          initial={reduced ? false : { opacity: 0, scale: 0.96 }}
          animate={
            reduced
              ? {}
              : {
                  opacity: 1,
                  scale: 1,
                  boxShadow: [
                    `inset 0 0 0 1px ${ink(0.06)}, 0 0 0 0 rgba(166,190,206,0)`,
                    `inset 0 0 0 1px ${ink(0.06)}, 0 0 0 0 rgba(166,190,206,0)`,
                    `inset 0 0 0 1px ${ACCENT}, 0 0 8px -2px ${ACCENT}`,
                    `inset 0 0 0 1px ${ink(0.06)}, 0 0 0 0 rgba(166,190,206,0)`,
                  ],
                }
          }
          transition={
            reduced
              ? { duration: 0 }
              : {
                  opacity: { duration: 0.4, ease: E.emphasized, delay: shift(0.3 + i * 0.06) },
                  scale: { duration: 0.4, ease: E.emphasized, delay: shift(0.3 + i * 0.06) },
                  // each source flashes as it's "read" during intake (0.9–1.5s)
                  boxShadow: { duration: 0.9, ease: E.emphasized, delay: shift(0.9 + i * 0.1), times: [0, 0.2, 0.45, 1] },
                }
          }
        >
          <SrcGlyph k={k} size={13} />
          <span className="text-[10.5px] font-medium tracking-[-0.01em]" style={{ color: ink(0.5) }}>
            {SRC_LABEL[k]}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
}

/* ── Decorative funnel: a faint curved guide from each contributing source
 *    chip down to the list head, plus an accent token that slides down it and
 *    fades as the commitment card "becomes" solid. Pure presentation. ── */
function FunnelLayer({ cycle, startAt = 0 }: { cycle: number; startAt?: number }) {
  const tokens: { from: CommitSource; arrive: number }[] = [
    { from: "email", arrive: 1.7 },
    { from: SECONDARY[0].from, arrive: 2.1 },
    { from: SECONDARY[1].from, arrive: 2.4 },
  ];
  return (
    <span aria-hidden className="pointer-events-none absolute inset-x-0 -top-7 z-[15] h-7">
      {tokens
        // a token already finished travelling before the seek point — don't replay it
        .filter((t) => t.arrive > startAt)
        .map((t) => {
        const startX = CHIP_X[t.from];
        const begin = Math.max(t.arrive - 0.7 - startAt, 0); // token travels ~0.7s before arrival
        return (
          <motion.span
            key={`${t.from}-${t.arrive}-${cycle}`}
            className="absolute size-[7px] rounded-full"
            style={{ top: 0, left: `${startX}%`, marginLeft: -3.5, background: ACCENT }}
            initial={{ opacity: 0, left: `${startX}%`, top: 0, scale: 0.6 }}
            animate={{
              opacity: [0, 1, 1, 0],
              // curve down toward the list head (50% / bottom of this band)
              left: [`${startX}%`, `${startX}%`, "50%", "50%"],
              top: [0, 2, 22, 28],
              scale: [0.6, 1, 1, 0.5],
            }}
            transition={{
              duration: 0.7,
              ease: E.cinematic,
              delay: begin,
              times: [0, 0.12, 0.82, 1],
            }}
          />
        );
      })}
    </span>
  );
}

/* ── A commitment that funnels into place then receives its stamps. The card
 *    arrives (16px rise + fade) at `arriveDelay`; StampChips land at
 *    `stampDelay`. CommitmentCard already pins title + meta row (no overlap). ── */
function FunnelCommitment({
  reduced,
  arriveDelay,
  stampDelay,
  featured = false,
  commitment,
}: {
  reduced: boolean;
  arriveDelay: number;
  stampDelay: number;
  featured?: boolean;
  commitment: { title: string; owner: string; initials: string; deadline: string; from: CommitSource };
}) {
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduced ? { duration: 0 } : { ...SPRING_SETTLE, delay: arriveDelay }}
    >
      <CommitmentCard
        title={commitment.title}
        owner={commitment.owner}
        initials={commitment.initials}
        deadline={commitment.deadline}
        from={commitment.from}
        reduced={reduced}
        stampDelay={reduced ? 0 : stampDelay}
        featured={featured}
      />
    </motion.div>
  );
}

const variant: CaptureVariant = {
  id: "intake-funnel",
  technique: "2.5D",
  title: "Intake Funnel",
  note: "Sources at the top (meeting, thread, doc, email) funnel a commitment down into the list, which is then stamped.",
  Stage,
};

export default variant;
