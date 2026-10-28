import { motion } from "motion/react";
import type { CaptureVariant } from "../kit";
import { useCycle } from "../kit";
import { E, HowStage3D, useReducedMotion } from "../v1kit";
import { ArtifactPage, FormatBar, ReadyRow } from "../v4kit";
import { UserBubble, usePipeline } from "../v3kit";
import { V4 } from "../v4data";

/* ------------------------------------------------------------------ *
 * v4 — "Builds artifacts in formats you work with" · "Document forward".
 *
 * The ACTUAL Fluso artifact-preview as a clean flat column on the shared
 * HowStage3D tilt: the request ("Make a PDF of this report") and the
 * FormatBar up top, the drafted document assembling beneath, then the
 * "Ready to send" footer when the build finishes.
 *
 * usePipeline lays each body line in, then flips resultIn for the footer.
 * The shared stage supplies the (uniform, subtle) perspective + idle drift +
 * entrance + per-cycle cross-dissolve; this file only owns the content and
 * its fade/clip reveals, which replay because HowStage3D re-keys by cycle.
 * ------------------------------------------------------------------ */

export const CYCLE = 9000;

export function Stage({ loop = true }: { loop?: boolean } = {}) {
  const reduced = useReducedMotion() ?? false;
  const cycle = useCycle(CYCLE, !reduced && loop);

  // drives the artifact build — each body line lays in, then resultIn flips
  const pipe = usePipeline(cycle, reduced, V4.artifact.lines.length);

  return (
    <HowStage3D cycle={cycle} reduced={reduced} maxW={480} loop={loop}>
      <div className="flex flex-col gap-3.5">
        {/* request bubble + format bar */}
        <div className="flex flex-col gap-2.5">
          <UserBubble text={V4.request} reduced={reduced} />
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduced ? { duration: 0 } : { duration: 0.45, ease: E.emphasized, delay: 0.25 }}
          >
            <FormatBar formats={V4.formats} active={V4.active} reduced={reduced} />
          </motion.div>
        </div>

        {/* the document — body lines lay in as it assembles */}
        <ArtifactPage artifact={V4.artifact} builtLines={pipe.doneCount} reduced={reduced} />

        {/* ready to send — appears when the build finishes */}
        {pipe.resultIn && <ReadyRow file={V4.artifact.file} reduced={reduced} delay={0} />}
      </div>
    </HowStage3D>
  );
}

const variant: CaptureVariant = {
  id: "doc-forward",
  technique: "3D",
  title: "Document forward",
  note: "The request and format bar sit in front; the drafted document opens forward in real depth, like a preview pane.",
  Stage,
};

export default variant;
