import { motion } from "motion/react";
import type { CaptureVariant } from "../kit";
import { ACCENT, ink, useCycle } from "../kit";
import {
  E,
  HowStage3D,
  SPRING_SETTLE,
  useReducedMotion,
} from "../v1kit";
import { DeliveryCard } from "../v6kit";
import { usePipeline, type StepStatus } from "../v3kit";
import { V6, type Channel } from "../v6data";

export const CYCLE = 9000;

/* v6 — "Draft & fan" (2.5D).
 *   From the request, Fluso DRAFTS the note in your voice — the draft arrives
 *   first and reads as being WRITTEN (a clip line-reveal + caret on the body),
 *   THEN the three DeliveryCards FAN OUT below it (each slides/scales in from
 *   the draft, staggered) and send via pipe.statuses (Queued → Sending → Sent).
 *   A faint connector runs from the draft to each channel as it dispatches.
 *   Renders as a clean flat column on the shared HowStage3D tilt.
 *   Still the real send interface; copy is V6 only. */

/* Beats (seconds into the 9s cycle), front-loaded so all-Sent dominates. */
const REQUEST_AT = 0.2;
const DRAFT_AT = 0.7;     // draft card arrives
const WRITE_AT = 1.0;     // body begins writing
const WRITE_DUR = 1.0;    // ~done writing by ~2.0s
const FAN_AT = 2.0;       // delivery cards fan out

/* usePipeline sequences the sends: first Sending at ~2.2s, all Sent by ~4.9s,
 * "Delivered" lands ~5.3s; the all-sent state then holds to the re-key. */
const PIPE = { start: 2.2, step: 0.9, run: 0.6, resultGap: 0.4 } as const;

export function Stage({ loop = true }: { loop?: boolean } = {}) {
  const reduced = useReducedMotion() ?? false;
  const cycle = useCycle(CYCLE, !reduced && loop);
  const pipe = usePipeline(cycle, reduced, V6.deliveries.length, PIPE);

  return (
    <HowStage3D cycle={cycle} reduced={reduced} maxW={480} loop={loop}>
      <div className="flex flex-col gap-3">
        {/* ── 1. THE REQUEST — small right-aligned chat bubble ── */}
        <RequestBubble reduced={reduced} />

        {/* ── 2. THE DRAFT — written in your voice ── */}
        <WrittenDraft reduced={reduced} />

        {/* ── 3. THE DELIVERIES — fan out from the draft, send one by one ── */}
        <div className="relative flex flex-col gap-2.5">
          {/* faint connectors from the draft (top of this band) to each card */}
          {!reduced && <FanConnectors statuses={pipe.statuses} />}

          {V6.deliveries.map((d, i) => (
            <FanDelivery
              key={d.channel}
              reduced={reduced}
              index={i}
              channel={d.channel}
              to={d.to}
              detail={d.detail}
              status={pipe.statuses[i]}
            />
          ))}

          {/* "Delivered to N" once every channel has sent */}
          <DeliveredTally
            count={V6.deliveries.length}
            shown={pipe.resultIn}
            reduced={reduced}
          />
        </div>
      </div>
    </HowStage3D>
  );
}

/* ── The request, as a compact right-aligned bubble (real V6 copy). ── */
function RequestBubble({ reduced }: { reduced: boolean }) {
  return (
    <motion.div
      className="flex justify-end"
      initial={reduced ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduced ? { duration: 0 } : { duration: 0.4, ease: E.emphasized, delay: REQUEST_AT }}
    >
      <div
        className="max-w-[80%] rounded-[12px] rounded-br-[4px] px-3.5 py-2 text-[12.5px] leading-snug"
        style={{ background: ink(0.07), boxShadow: `inset 0 0 0 1px ${ink(0.09)}`, color: ink(0.88) }}
      >
        {V6.request}
      </div>
    </motion.div>
  );
}

const PEN = (
  <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden>
    <path d="M9.5 2.5 11.5 4.5 5 11l-2.5.5L3 9z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
  </svg>
);

/* ── The draft, written in your voice. Mirrors v6kit DraftCard styling, but
 *    the body reveals left-to-right behind a caret so it reads as being typed. ── */
function WrittenDraft({ reduced }: { reduced: boolean }) {
  return (
    <motion.div
      className="rounded-[11px] p-3"
      style={{
        background: ink(0.03),
        boxShadow: `inset 0 0 0 1px ${ink(0.07)}`,
      }}
      initial={reduced ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduced ? { duration: 0 } : { duration: 0.45, ease: E.emphasized, delay: DRAFT_AT }}
    >
      <div className="mb-2 flex items-center gap-1.5 text-[11px] font-medium" style={{ color: ink(0.55) }}>
        <span style={{ color: ACCENT }}>{PEN}</span>
        Draft
      </div>

      {/* body — clip-reveal with a writing caret riding the edge */}
      <p className="relative text-[12px] leading-snug" style={{ color: ink(0.78) }}>
        <motion.span
          className="inline"
          style={{ display: "inline-block" }}
          initial={reduced ? false : { clipPath: "inset(0 100% 0 0)" }}
          animate={{ clipPath: "inset(0 0% 0 0)" }}
          transition={reduced ? { duration: 0 } : { duration: WRITE_DUR, ease: E.reveal, delay: WRITE_AT }}
        >
          {V6.draft.text}
        </motion.span>
        {!reduced && (
          <motion.span
            aria-hidden
            className="ml-0.5 inline-block h-[12px] w-px align-[-1px]"
            style={{ background: ACCENT }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0], scaleY: [1, 1, 1, 1] }}
            transition={{ duration: WRITE_DUR + 0.4, ease: "linear", delay: WRITE_AT, times: [0, 0.04, 0.92, 1] }}
          />
        )}
      </p>

      <motion.p
        className="mt-1.5 text-[11px] italic"
        style={{ color: ink(0.42) }}
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={reduced ? { duration: 0 } : { duration: 0.4, ease: E.emphasized, delay: WRITE_AT + WRITE_DUR }}
      >
        {V6.draft.signoff}
      </motion.p>
    </motion.div>
  );
}

/* ── A delivery that fans in from the draft (rise + slight scale + tilt),
 *    staggered, then sends via its pipe status using the official kit card.
 *    A short accent ring flashes the instant it lands on Sent. ── */
function FanDelivery({
  reduced,
  index,
  channel,
  to,
  detail,
  status,
}: {
  reduced: boolean;
  index: number;
  channel: Channel;
  to: string;
  detail: string;
  status: StepStatus;
}) {
  const sent = status === "done";
  return (
    <motion.div
      className="relative"
      style={{ transformOrigin: "top center" }}
      initial={reduced ? false : { opacity: 0, y: 14, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={reduced ? { duration: 0 } : { ...SPRING_SETTLE, delay: FAN_AT + index * 0.12 }}
    >
      <DeliveryCard
        channel={channel}
        to={to}
        detail={detail}
        status={status}
        reduced={reduced}
      />

      {/* accent ring flash on Sent — mounts only with the done state, fires once */}
      {!reduced && sent && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[10px]"
          initial={{ opacity: 0, boxShadow: "0 0 0 0 rgba(166,190,206,0)" }}
          animate={{
            opacity: [0, 1, 0],
            boxShadow: [
              "0 0 0 0 rgba(166,190,206,0.5)",
              "0 0 0 3px rgba(166,190,206,0.26)",
              "0 0 0 7px rgba(166,190,206,0)",
            ],
          }}
          transition={{ duration: 0.6, ease: E.emphasized }}
        />
      )}
    </motion.div>
  );
}

/* ── Faint connectors from the draft (top of the deliveries band) down to each
 *    delivery card. Each line draws in as its channel begins dispatching, then
 *    settles to a quiet accent once Sent. Pure presentation. ── */
function FanConnectors({ statuses }: { statuses: StepStatus[] }) {
  // three evenly-spaced columns above the cards, fanning out from centre
  const COLS = [22, 50, 78];
  return (
    <span aria-hidden className="pointer-events-none absolute inset-x-0 -top-3 z-[5] h-3">
      {statuses.map((s, i) => {
        if (s === "pending") return null;
        const x = COLS[i];
        const sent = s === "done";
        return (
          <motion.span
            key={i}
            className="absolute top-0 origin-top"
            style={{
              left: `${x}%`,
              width: 1,
              height: 12,
              marginLeft: -0.5,
              background: `linear-gradient(${ink(0)}, ${ACCENT})`,
            }}
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: sent ? 0.4 : 0.8 }}
            transition={{ duration: 0.35, ease: E.emphasized }}
          />
        );
      })}
    </span>
  );
}

const CHECK = (
  <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden>
    <path d="M2.8 6.2 5 8.4 9.2 3.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ── "Delivered to N" — appears once every channel has sent, with a soft
 *    accent settle. Holds for the rest of the loop. ── */
function DeliveredTally({ count, shown, reduced }: { count: number; shown: boolean; reduced: boolean }) {
  return (
    <motion.div
      className="mt-0.5 flex items-center justify-center"
      initial={reduced ? false : { opacity: 0, y: 6 }}
      animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
      transition={reduced ? { duration: 0 } : { duration: 0.45, ease: E.emphasized }}
    >
      <span
        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-[5px] text-[11px] font-medium"
        style={{
          color: ACCENT,
          background: "rgba(166,190,206,0.10)",
          boxShadow: "inset 0 0 0 1px rgba(166,190,206,0.3)",
        }}
      >
        {CHECK} Delivered to {count}
      </span>
    </motion.div>
  );
}

const variant: CaptureVariant = {
  id: "draft-fan",
  technique: "2.5D",
  title: "Draft & fan",
  note: "The note writes itself in your voice, then fans out to email, Slack, and Teams.",
  Stage,
};

export default variant;
