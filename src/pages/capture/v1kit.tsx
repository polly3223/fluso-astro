import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState, type CSSProperties } from "react";
import { cn } from "@/utils/styles";
import { ACCENT, ICON, ink, SourceGlyph } from "./kit";
import { CAPTURE } from "./data";
import driveLogo from "../../../assets/connectors/google-drive.svg?url";

/* ------------------------------------------------------------------ *
 * v1 shared kit — the "Swiss / cinematic" motion language.
 * Tokens + the pieces every v1 variant shares (cursor, action toolbar,
 * source-detail reveal, grain, vignette, light-sweep, count pill) so the
 * four choreographies feel like one elite product and carry the same
 * concrete how-1 actions: cursor → click → expand → source → actions.
 * ------------------------------------------------------------------ */

// easing family (critically damped, long tails)
export const E = {
  emphasized: [0.22, 1, 0.36, 1] as const,
  reveal: [0.16, 1, 0.3, 1] as const,
  exit: [0.4, 0, 1, 1] as const,
  cinematic: [0.83, 0, 0.17, 1] as const,
};
export const SPRING_SETTLE = { type: "spring", stiffness: 240, damping: 30, mass: 1 } as const;
export const SPRING_HERO = { type: "spring", stiffness: 150, damping: 22, mass: 1.1 } as const;

export const ACCENT_WASH = "rgba(166,190,206,0.10)";
export const FOCUS_RING = "0 0 0 1px rgba(166,190,206,0.40), 0 0 0 4px rgba(166,190,206,0.16)";
export const REST_SHADOW = "inset 0 1px 0 0 rgba(250,249,245,0.04), 0 1px 2px rgba(8,9,11,0.40), 0 8px 24px rgba(8,9,11,0.34)";
export const LIFT_SHADOW = "inset 0 1px 0 0 rgba(250,249,245,0.05), 0 4px 12px rgba(8,9,11,0.48), 0 24px 64px rgba(8,9,11,0.42)";

export const GRAIN_URL =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

// <svg xmlns="http://www.w3.org/2000/svg" width="140" height="140">
//   <filter id="n">
//     <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/>
//   </filter>
//   <rect width="100%" height="100%" filter="url(#n)"/>
// </svg>


/** Static film grain over the whole stage (soft-light, 4%). */
export function Grain() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[40] rounded-2xl"
      style={{ backgroundImage: GRAIN_URL, backgroundSize: "140px 140px", opacity: 0.01, mixBlendMode: "soft-light" }}
    />
  );
}
/** Edge vignette pulling the eye to the list. */
export function Vignette() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[1] bg-ink"
    />
  );
}

/** Count-up 0 -> to, re-triggered each cycle; holds final when not looping. */
export function useCountUp(cycle: number, loop: boolean, to: number, startDelay: number, durMs: number): number {
  const [n, setN] = useState(loop ? 0 : to);
  useEffect(() => {
    if (!loop) {
      setN(to);
      return;
    }
    setN(0);
    let raf = 0;
    const begin = performance.now() + startDelay;
    const tick = (now: number) => {
      if (now < begin) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const t = Math.min(1, (now - begin) / durMs);
      setN(Math.round((1 - Math.pow(1 - t, 3)) * to));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [cycle, loop, to, startDelay, durMs]);
  return n;
}

/** "20" pill — counts up with an odometer blur that clears on landing. */
export function CountPill({ cycle, reduced, startDelay = 1.2 }: { cycle: number; reduced: boolean; startDelay?: number }) {
  const n = useCountUp(cycle, !reduced, CAPTURE.count, startDelay * 1000, 1000);
  return (
    <motion.span
      key={reduced ? "c" : `c${cycle}`}
      className="grid h-[20px] min-w-[20px] place-items-center rounded-full px-1.5 text-[11px] font-medium tabular-nums"
      style={{ color: ACCENT, background: ink(0.06), boxShadow: `inset 0 0 0 1px ${ink(0.08)}` }}
      initial={reduced ? false : { filter: "blur(2px)" }}
      animate={{ filter: "blur(0px)" }}
      transition={reduced ? { duration: 0 } : { duration: 1, ease: E.emphasized, delay: startDelay }}
    >
      {n}
    </motion.span>
  );
}

/** Section header — title + count pill + connectors (live chip highlighted). */
export function V1Header({
  cycle,
  reduced,
  live = "gmail",
  countDelay = 1.2,
}: {
  cycle: number;
  reduced: boolean;
  live?: "gmail" | "slack";
  countDelay?: number;
}) {
  const chips: { k: "tasks" | "gmail" | "drive" | "slack"; node: React.ReactNode }[] = [
    { k: "tasks", node: <span style={{ color: ACCENT }}>{ICON.check}</span> },
    { k: "gmail", node: <SourceGlyph k="gmail" size={14} /> },
    { k: "drive", node: <img src={driveLogo} alt="" width={14} height={14} className="object-contain" /> },
    { k: "slack", node: <SourceGlyph k="slack" size={14} /> },
  ];
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-baseline gap-2.5">
        <span className="text-[14px] font-medium tracking-[-0.01em]" style={{ color: ink(0.92) }}>
          {CAPTURE.sectionTitle}
        </span>
        <CountPill cycle={cycle} reduced={reduced} startDelay={countDelay} />
      </div>
      <div
        className="flex items-center gap-2.5 rounded-full px-2.5 py-1.5"
        style={{ background: ink(0.04), boxShadow: `inset 0 0 0 1px ${ink(0.07)}` }}
      >
        {chips.map((c) => (
          <motion.span
            key={c.k}
            className="grid place-items-center"
            initial={reduced ? false : { opacity: 0 }}
            animate={
              reduced
                ? { opacity: 1 }
                : c.k === live
                  ? { opacity: 1, scale: [1, 1.22, 1], filter: [`drop-shadow(0 0 0 ${ink(0)})`, `drop-shadow(0 0 6px ${ACCENT})`, `drop-shadow(0 0 0 ${ink(0)})`] }
                  : { opacity: 1 }
            }
            transition={reduced ? { duration: 0 } : { duration: 0.6, ease: E.emphasized, delay: 1.6 }}
          >
            {c.node}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

/** A supporting task row (idle list item). */
export function Row({
  title,
  src,
  className,
  style,
}: {
  title: string;
  src: "gmail" | "slack" | "tasks";
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={cn("flex items-center gap-2.5 rounded-[9px] px-3 py-2.5", className)}
      style={{ background: ink(0.03), boxShadow: `inset 0 0 0 1px ${ink(0.07)}`, ...style }}
    >
      <SourceGlyph k={src} />
      <span className="min-w-0 flex-1 truncate text-[13px] tracking-[-0.01em]" style={{ color: ink(0.62) }}>
        {title}
      </span>
      <span style={{ color: ink(0.3) }}>{ICON.chevron}</span>
    </div>
  );
}

/** macOS-style pointer (screen-space — keep OUT of any preserve-3d layer). */
export function CursorArrow({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className={className} style={style} aria-hidden>
      <path
        d="M5 3.5 18.5 11.2l-5.7 1.3-2.4 5.4z"
        fill="#faf9f5"
        stroke="rgba(8,9,11,0.55)"
        strokeWidth="1.1"
        strokeLinejoin="round"
        style={{ filter: "drop-shadow(0 2px 4px rgba(8,9,11,0.5))" }}
      />
    </svg>
  );
}

/** Expanding ring at a click point. Mount keyed to the click beat. */
export function ClickRing({ reduced, delay, style }: { reduced: boolean; delay: number; style?: CSSProperties }) {
  if (reduced) return null;
  return (
    <motion.span
      className="pointer-events-none absolute size-[26px] rounded-full"
      style={{ marginLeft: -13, marginTop: -13, boxShadow: `0 0 0 1.5px ${ACCENT}`, ...style }}
      initial={{ opacity: 0, scale: 0.3 }}
      animate={{ opacity: [0, 0.9, 0], scale: [0.3, 1.5, 1.9] }}
      transition={{ duration: 0.6, ease: E.emphasized, delay }}
    />
  );
}

/** The source detail revealed inside the expanded featured card.
 *  `delay` = seconds into the cycle when the container has opened. */
export function FeaturedDetail({ reduced, delay }: { reduced: boolean; delay: number }) {
  const f = CAPTURE.featured;
  return (
    <div className="px-3 pb-3">
      <motion.div
        className="flex items-center gap-1.5 border-t pb-2.5 pt-2.5 text-[11px]"
        style={{ borderColor: ink(0.08), color: ink(0.42) }}
        initial={reduced ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={reduced ? { duration: 0 } : { duration: 0.4, ease: E.emphasized, delay }}
      >
        <span className="grid size-[18px] place-items-center rounded-[6px]" style={{ color: ink(0.62), boxShadow: `inset 0 0 0 1px ${ink(0.1)}` }}>
          {ICON.envelope}
        </span>
        <span className="relative font-medium" style={{ color: ink(0.72) }}>
          {f.source}
          <motion.span
            className="absolute -bottom-0.5 left-0 h-px w-full origin-left"
            style={{ background: ACCENT }}
            initial={reduced ? false : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={reduced ? { duration: 0 } : { duration: 0.5, ease: E.reveal, delay: delay + 0.15 }}
          />
        </span>
        <span style={{ color: ink(0.28) }}>·</span>
        <span className="tabular-nums">{f.time}</span>
      </motion.div>
      <motion.p
        className="text-[12.5px] leading-[1.5]"
        style={{ color: ink(0.6), overflow: "hidden" }}
        initial={reduced ? false : { clipPath: "inset(0 0 100% 0)", opacity: 0 }}
        animate={{ clipPath: "inset(0 0 0% 0)", opacity: 1 }}
        transition={reduced ? { duration: 0 } : { duration: 0.55, ease: E.reveal, delay: delay + 0.2 }}
      >
        {f.body}
      </motion.p>
    </div>
  );
}

/** Row action toolbar (open · complete · dismiss); complete highlights on hover. */
export function ActionToolbar({
  reduced,
  appearDelay,
  hoverDelay,
}: {
  reduced: boolean;
  appearDelay: number;
  hoverDelay: number;
}) {
  return (
    <motion.div
      className="flex items-center gap-1"
      initial={reduced ? false : { opacity: 0, x: 4 }}
      animate={{ opacity: 1, x: 0 }}
      transition={reduced ? { duration: 0 } : { duration: 0.35, ease: E.emphasized, delay: appearDelay }}
    >
      {[
        { k: "open", node: ICON.monitor },
        { k: "done", node: ICON.check },
        { k: "dismiss", node: ICON.x },
      ].map((b) => (
        <motion.span
          key={b.k}
          className="grid size-[22px] place-items-center rounded-[6px]"
          style={{ color: ink(0.45) }}
          initial={false}
          animate={
            reduced || b.k !== "done"
              ? {}
              : { color: [ink(0.45), "#0c0c0c"], backgroundColor: ["rgba(166,190,206,0)", ACCENT] }
          }
          transition={reduced ? { duration: 0 } : { duration: 0.25, ease: E.emphasized, delay: hoverDelay }}
        >
          {b.node}
        </motion.span>
      ))}
    </motion.div>
  );
}

/** A single specular light-sweep across the featured row (fires once). */
export function LightSweep({ reduced, delay }: { reduced: boolean; delay: number }) {
  if (reduced) return null;
  return (
    <motion.span
      className="pointer-events-none absolute inset-y-0 z-[5] w-[26%] skew-x-[-18deg]"
      style={{ background: "linear-gradient(100deg, transparent, rgba(250,249,245,0.12), transparent)" }}
      initial={{ left: "-30%", opacity: 0 }}
      animate={{ left: ["-30%", "130%"], opacity: [0, 1, 0] }}
      transition={{ duration: 0.9, ease: "linear", delay }}
    />
  );
}

/** Collapsed featured title row (always visible). */
export function FeaturedTitleRow() {
  return (
    <div className="flex items-center gap-2.5 px-3 pb-2.5 pt-2.5">
      <SourceGlyph k="gmail" />
      <span className="min-w-0 flex-1 truncate text-[13px] font-medium tracking-[-0.01em]" style={{ color: ink(0.95) }}>
        {CAPTURE.featured.title}
      </span>
    </div>
  );
}

/** Shared 3D stage for the How-it-works step animations. One gentle, uniform
 *  perspective tilt + slow idle camera drift + entrance + consistent framing,
 *  so all five steps read as one cohesive (lightly 3D) family. Children render
 *  on the tilted camera plane (preserve-3d) — they should NOT add their own
 *  perspective/grain/vignette/scene-key. Owns the per-cycle cross-dissolve. */
export function HowStage3D({
  cycle,
  reduced,
  children,
  maxW = 480,
  cycleMs = 9000,
  scale = 1.4,
  loop = true,
}: {
  cycle: number;
  reduced: boolean;
  children: React.ReactNode;
  maxW?: number;
  cycleMs?: number;
  scale?: number;
  /** Free-running cross-dissolve loop. true on the /capture demo; false on the
   *  home How-it-works section, where the section itself drives the timeline
   *  (plays once per step, holds, then the step advances + remounts). */
  loop?: boolean;
}) {
  // When looping, the stage clips to its frame and cross-dissolves each cycle.
  // When not looping (home), it plays once, holds, and lets the scaled content
  // spill past the frame edge by design ("это стиль").
  return (
    <div className={cn("relative h-full w-full", loop ? "overflow-hidden" : "overflow-visible")}>
      {/*<Grain />*/}
      {/*<Vignette />*/}
      <motion.div
        key={reduced || !loop ? "stage" : `stage${cycle}`}
        className="absolute inset-0 z-[10] flex items-start justify-center pt-[5%]"
        style={{ perspective: 1200, perspectiveOrigin: "50% 36%" }}
        initial={reduced ? false : { opacity: 1 }}
        animate={reduced || !loop ? { opacity: 1 } : { opacity: [1, 1, 0] }}
        transition={reduced || !loop ? { duration: 0 } : { duration: cycleMs / 1000, ease: E.exit, times: [0, 0.977, 1] }}
      >
        {/* content enlarged +30% via `zoom` — a crisp re-raster at the larger
            size, NOT a bitmap upscale (transform: scale on a 3D layer blurs).
            Grain/Vignette stay frame-size, so the bg is unchanged. */}
        <motion.div
          className="relative w-full px-6"
          style={{ maxWidth: maxW, zoom: scale, transformStyle: "preserve-3d", transformOrigin: "50% 14%" }}
          initial={reduced ? false : { opacity: 0, y: 22, rotateX: 8, rotateY: -5 }}
          animate={
            reduced
              ? { opacity: 1, rotateX: 4, rotateY: -3 }
              : { opacity: 1, y: 0, rotateX: [8, 4, 4, 5], rotateY: [-5, -3, -2, -4] }
          }
          transition={
            reduced
              ? { duration: 0.4, ease: E.emphasized }
              : {
                  opacity: { ...SPRING_HERO },
                  y: { ...SPRING_HERO },
                  rotateX: { duration: cycleMs / 1000, ease: E.cinematic, times: [0, 0.14, 0.7, 1] },
                  rotateY: { duration: cycleMs / 1000, ease: E.cinematic, times: [0, 0.14, 0.7, 1] },
                }
          }
        >
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
}

export { useReducedMotion };
