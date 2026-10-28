import { motion } from "motion/react";
import type { CaptureVariant } from "../kit";
import { ACCENT, ink, useCycle } from "../kit";
import { E, HowStage3D, useReducedMotion } from "../v1kit";
import { AssuranceBar, ToolTile } from "../v5kit";
import { usePipeline, type StepStatus } from "../v3kit";
import { V5 } from "../v5data";

export const CYCLE = 11500;

/* The faithful default — Fluso's real "connect your tools" screen.
 *   1. header "Connect your tools" — establishes the integrations panel,
 *   2. a 4×2 grid of the eight tools (Gmail, Outlook, Drive, Calendar, Slack,
 *      Teams, Notion, Linear), each a ToolTile that flips Connect → Connecting
 *      → Connected in turn ("one click each"). A subtle accent ring flashes on
 *      each tile the moment it lands on Connected,
 *   3. the AssuranceBar footer — lock + "One click each · No migration project ·
 *      No passwords handed off", emphasized once everything is connected.
 * usePipeline sequences the connects (all 8 by ~7.7s); the fully-connected
 * state then dominates the ~11.5s loop. Routed through the shared <HowStage3D>, so
 * it carries the same gentle perspective tilt + idle drift + entrance as its
 * siblings; the column content + its connect choreography stay. */

export function Stage({ loop = true }: { loop?: boolean } = {}) {
  const reduced = useReducedMotion() ?? false;
  const cycle = useCycle(CYCLE, !reduced && loop);

  const pipe = usePipeline(cycle, reduced, V5.tools.length, {
    start: 1.15,
    step: 0.85,
    run: 0.6,
    resultGap: 0.4,
  });

  return (
    <HowStage3D cycle={cycle} reduced={reduced} maxW={480} loop={loop}>
      <div className="flex flex-col gap-4">
        {/* ── 1. HEADER — establishes the integrations screen ── */}
        <motion.div
          className="flex items-center justify-between px-0.5"
          initial={reduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduced ? { duration: 0 } : { duration: 0.45, ease: E.emphasized }}
        >
          <span className="text-[14px] font-medium tracking-[-0.01em]" style={{ color: ink(0.92) }}>
            Connect your tools
          </span>
          <ConnectedCount done={pipe.doneCount} total={V5.tools.length} reduced={reduced} />
        </motion.div>

        {/* ── 2. THE GRID — 4×2 tiles connecting one by one ── */}
        <div className="grid grid-cols-2 gap-[10px]">
          {V5.tools.map((t, i) => (
            <ConnectingTile
              key={t.key}
              toolKey={t.key}
              name={t.name}
              status={pipe.statuses[i]}
              reduced={reduced}
              index={i}
            />
          ))}
        </div>

        {/* ── 3. ASSURANCE FOOTER — lock + the three reassurances ── */}
        <motion.div
          className="rounded-[10px] px-3 py-2.5"
          style={{ background: ink(0.025), boxShadow: `inset 0 0 0 1px ${ink(0.06)}` }}
          animate={
            reduced || !pipe.resultIn
              ? {}
              : {
                  boxShadow: [
                    `inset 0 0 0 1px ${ink(0.06)}`,
                    `inset 0 0 0 1px rgba(166,190,206,0.34)`,
                    `inset 0 0 0 1px ${ink(0.08)}`,
                  ],
                }
          }
          transition={reduced ? { duration: 0 } : { duration: 1.1, ease: E.emphasized }}
        >
          <AssuranceBar items={V5.assurances} reduced={reduced} delay={reduced ? 0 : 0.4} />
        </motion.div>
      </div>
    </HowStage3D>
  );
}

/* A tool tile that flashes an accent ring the instant it lands on Connected.
 * The ring is keyed to the done state so it fires exactly once per connect. */
function ConnectingTile({
  toolKey,
  name,
  status,
  reduced,
  index,
}: {
  toolKey: typeof V5.tools[number]["key"];
  name: string;
  status: StepStatus;
  reduced: boolean;
  index: number;
}) {
  const connected = status === "done";
  return (
    <motion.div
      className="relative"
      initial={reduced ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduced ? { duration: 0 } : { duration: 0.4, ease: E.emphasized, delay: 0.25 + index * 0.05 }}
    >
      <ToolTile toolKey={toolKey} name={name} status={status} reduced={reduced} />

      {/* accent ring flash on connect — mounts only with the done state */}
      {!reduced && connected && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[10px]"
          initial={{ opacity: 0, boxShadow: `0 0 0 0 rgba(166,190,206,0)` }}
          animate={{
            opacity: [0, 1, 0],
            boxShadow: [
              `0 0 0 0 rgba(166,190,206,0)`,
              `0 0 11px 1px rgba(166,190,206,0.4), 0 0 0 1px rgba(166,190,206,0.32)`,
              `0 0 22px 7px rgba(166,190,206,0), 0 0 0 5px rgba(166,190,206,0)`,
            ],
          }}
          transition={{ duration: 0.85, ease: E.emphasized }}
        />
      )}
    </motion.div>
  );
}

/* Tiny "n/8 connected" tally beside the header — climbs as tiles flip. */
function ConnectedCount({ done, total, reduced }: { done: number; total: number; reduced: boolean }) {
  const all = done >= total;
  return (
    <motion.span
      className="inline-flex items-center gap-1 rounded-full px-2 py-[3px] text-[10.5px] font-medium tabular-nums"
      style={{
        color: all ? ACCENT : ink(0.55),
        background: all ? "rgba(166,190,206,0.10)" : ink(0.05),
        boxShadow: `inset 0 0 0 1px ${all ? "rgba(166,190,206,0.3)" : ink(0.08)}`,
      }}
      animate={reduced ? {} : { scale: all ? [1, 1.08, 1] : 1 }}
      transition={reduced ? { duration: 0 } : { duration: 0.4, ease: E.emphasized }}
    >
      {done}/{total} connected
    </motion.span>
  );
}

const variant: CaptureVariant = {
  id: "connect-grid",
  technique: "2.5D",
  title: "Connect grid",
  note: "A grid of your tools — Gmail, Outlook, Drive, Calendar, Slack, Teams, Notion, Linear — each connecting in one click.",
  Stage,
};

export default variant;
