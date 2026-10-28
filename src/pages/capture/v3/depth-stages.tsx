import type { CaptureVariant } from "../kit";
import { useCycle } from "../kit";
import { HowStage3D, useReducedMotion } from "../v1kit";
import {
  ReasoningTrace,
  ReportCard,
  UserBubble,
  usePipeline,
  useWorkedClock,
} from "../v3kit";
import { V3 } from "../v3data";

/* ------------------------------------------------------------------ *
 * v3 — "Performs complex multi-step tasks" · "Reasoning depth".
 *
 * The ACTUAL Fluso reasoning view: the user's message, the assistant's
 * reasoning trace (each line resolving pending → running → done via
 * usePipeline + a "Reasoned for m:ss" clock), then the streamed report
 * surfacing once the pipeline finishes.
 *
 * The content renders as a clean flat column — the shared <HowStage3D>
 * supplies the uniform, subtle perspective tilt, idle camera drift,
 * entrance, framing, grain/vignette and per-cycle cross-dissolve. The
 * content's own fade/clip reveals replay because HowStage3D re-keys by
 * cycle, sequenced by the pipeline + clock.
 * ------------------------------------------------------------------ */

export const CYCLE = 9000;

export function Stage({ loop = true }: { loop?: boolean } = {}) {
  const reduced = useReducedMotion() ?? false;
  const cycle = useCycle(CYCLE, !reduced && loop);

  const pipe = usePipeline(cycle, reduced, V3.reasoning.length);
  const clock = useWorkedClock(cycle, reduced, 5400, 1400);
  const done = pipe.doneCount === V3.reasoning.length;

  return (
    <HowStage3D cycle={cycle} reduced={reduced} maxW={480} loop={loop}>
      <div className="flex flex-col gap-3">
        {/* 1. the user's message */}
        <UserBubble text={V3.query} reduced={reduced} />

        {/* 2. the reasoning trace — header + per-line statuses */}
        <ReasoningTrace
          items={V3.reasoning}
          statuses={pipe.statuses}
          clock={clock}
          done={done}
          reduced={reduced}
        />

        {/* 3. the streamed report — surfaces when the pipeline finishes */}
        {pipe.resultIn && <ReportCard report={V3.report} reduced={reduced} />}
      </div>
    </HowStage3D>
  );
}

const variant: CaptureVariant = {
  id: "reasoning-depth",
  technique: "3D",
  title: "Reasoning depth",
  note: "The reasoning lines resolve in real depth — each settles toward you as it completes — then the report surfaces in front.",
  Stage,
};

export default variant;
