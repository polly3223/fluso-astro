import { useEffect, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useTranslation } from "react-i18next";
import { cn } from "@/utils/styles";
import {
  LEGAL_DIAGRAM_COLOR,
  LEGAL_DIAGRAM_LINE_COLOR,
  LEGAL_DIAGRAM_NODE_OPACITY,
  LEGAL_DIAGRAM_NODE_SIZE,
} from "./legalDiagramStyle";

// Labels come from i18n (engineFlow.sources / engineFlow.stages), matched by index.
const SOURCES: { logo?: string; icon?: string }[] = [
  { logo: "assets/legal/sources/westlaw-icon.svg" },
  { logo: "assets/legal/sources/lexisnexis-icon.svg" },
  { logo: "assets/legal/sources/eur-lex.svg" },
  { icon: "registry" },
  { icon: "dms" },
];

const STAGES = [
  { icon: "collect" },
  { icon: "analyze" },
  { icon: "verify" },
  { icon: "draft" },
];

const STAGE_MS = 4000;
const EASE = [0.22, 1, 0.36, 1] as const;

const PANEL = "rounded-2xl max-md:rounded-xl border bg-(--flow-panel)";

const PANEL_H = "h-[clamp(404px,47vh,448px)] max-md:h-auto";

// Animated colors can't tween through CSS vars, so resolve them per theme.
const accentOf = (dark: boolean) => (dark ? LEGAL_DIAGRAM_COLOR : "#54738c");
const iconOffOf = (dark: boolean) => (dark ? "rgba(242,241,237,0.4)" : "rgba(12,12,12,0.5)");
const dotOffOf = (dark: boolean) => (dark ? "rgba(242,241,237,0.55)" : "rgba(12,12,12,0.7)");

function SourceMark({ logo, icon }: { logo?: string; icon?: string }) {
  if (logo) {
    return (
      <span className="grid size-10 shrink-0 place-items-center text-(--text-muted) max-md:size-7">
        <img
          src={logo}
          alt=""
          style={{ filter: "grayscale(1) invert(var(--flow-logo-invert))" }}
          className="block size-9 select-none object-contain opacity-70 max-md:size-4"
        />
      </span>
    );
  }

  return (
    <span className="grid size-10 shrink-0 place-items-center text-(--text-muted) max-md:size-7">
      {icon === "registry" ? (
        <svg viewBox="0 0 24 24" className="size-8 fill-none stroke-current stroke-[1.4] max-md:size-6" aria-hidden="true">
          <path d="M4 21h16M6 21V9h12v12M4 9l8-5 8 5M9 12v5M12 12v5M15 12v5" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="size-8 fill-none stroke-current stroke-[1.4] max-md:size-6" aria-hidden="true">
          <ellipse cx="12" cy="6" rx="7" ry="3" />
          <path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
        </svg>
      )}
    </span>
  );
}

function StageIcon({ type, active, replay, dark }: { type: string; active: boolean; replay: number; dark: boolean }) {
  const reduced = useReducedMotion() ?? false;
  const common =
    "size-11 fill-none stroke-current stroke-[1.4] [stroke-linecap:round] [stroke-linejoin:round] max-md:size-7";

  let glyph: ReactNode;
  if (type === "collect") {
    glyph = (
      <>
        <path d="M12 4v9M8.5 9.5 12 13l3.5-3.5" />
        <path d="M5 15v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3" />
      </>
    );
  } else if (type === "analyze") {
    glyph = (
      <>
        <circle cx="11" cy="11" r="6" />
        <path d="m15.5 15.5 4.5 4.5" />
      </>
    );
  } else if (type === "verify") {
    glyph = (
      <>
        <path d="M12 3l7 3v5c0 4.6-2.9 7.7-7 10-4.1-2.3-7-5.4-7-10V6l7-3Z" />
        <path d="m9 11.5 2 2 4-4.5" />
      </>
    );
  } else {
    glyph = (
      <>
        <path d="M7 3h7l4 4v14H7V3ZM14 3v4h4" />
        <path d="M10.5 12h6M10.5 16h6" />
      </>
    );
  }

  return (
    <motion.svg
      key={replay}
      viewBox="0 0 24 24"
      className={common}
      initial={active && !reduced ? { opacity: 0, scale: 0.4, rotate: -8 } : false}
      animate={{
        opacity: 1,
        scale: 1,
        rotate: 0,
        color: active ? accentOf(dark) : iconOffOf(dark),
      }}
      transition={{
        type: "spring",
        stiffness: 320,
        damping: 17,
        color: { duration: 0.4, ease: "easeOut" },
      }}
      aria-hidden="true"
    >
      {glyph}
    </motion.svg>
  );
}

function FlowLane({ delay }: { delay: number }) {
  const reduced = useReducedMotion() ?? false;
  return (
    <div
      className="relative h-px w-full overflow-visible"
      style={{ backgroundColor: LEGAL_DIAGRAM_LINE_COLOR }}
      aria-hidden="true"
    >
      {!reduced && (
        <motion.span
          className="absolute top-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: LEGAL_DIAGRAM_NODE_SIZE,
            height: LEGAL_DIAGRAM_NODE_SIZE,
            backgroundColor: LEGAL_DIAGRAM_COLOR,
            opacity: LEGAL_DIAGRAM_NODE_OPACITY,
          }}
          animate={{ left: ["-2%", "96%"], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 2.6, times: [0, 0.1, 0.9, 1], repeat: Infinity, ease: "linear", delay }}
        />
      )}
    </div>
  );
}

function MobileLane({ delay }: { delay: number }) {
  const reduced = useReducedMotion() ?? false;
  return (
    <div
      className="relative h-7 w-px"
      style={{ backgroundColor: LEGAL_DIAGRAM_LINE_COLOR }}
    >
      {!reduced && (
        <motion.span
          className="absolute left-1/2 -translate-x-1/2 rounded-full"
          style={{
            width: LEGAL_DIAGRAM_NODE_SIZE,
            height: LEGAL_DIAGRAM_NODE_SIZE,
            backgroundColor: LEGAL_DIAGRAM_COLOR,
            opacity: LEGAL_DIAGRAM_NODE_OPACITY,
          }}
          animate={{ top: ["-6%", "88%"], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 2.8, times: [0, 0.12, 0.88, 1], repeat: Infinity, ease: "linear", delay }}
        />
      )}
    </div>
  );
}

// Mobile only: the five sources fan down into the process block.
function MobileFanLanes() {
  const reduced = useReducedMotion() ?? false;
  return (
    <div className="flex h-6 items-stretch justify-evenly px-7" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className="relative block w-px"
          style={{ backgroundColor: LEGAL_DIAGRAM_LINE_COLOR }}
        >
          {!reduced && (
            <motion.span
              className="absolute left-1/2 -translate-x-1/2 rounded-full"
              style={{
                width: LEGAL_DIAGRAM_NODE_SIZE,
                height: LEGAL_DIAGRAM_NODE_SIZE,
                backgroundColor: LEGAL_DIAGRAM_COLOR,
                opacity: LEGAL_DIAGRAM_NODE_OPACITY,
              }}
              animate={{ top: ["-18%", "118%"], opacity: [0, 1, 1, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: 0.5,
                ease: "easeInOut",
                delay: i * 0.14,
              }}
            />
          )}
        </span>
      ))}
    </div>
  );
}

// Mobile only: a single line into the final deliverable.
function MobileSingleLane() {
  const reduced = useReducedMotion() ?? false;
  return (
    <div className="flex h-6 justify-center" aria-hidden="true">
      <span
        className="relative block w-px"
        style={{ backgroundColor: LEGAL_DIAGRAM_LINE_COLOR }}
      >
        {!reduced && (
          <motion.span
            className="absolute left-1/2 -translate-x-1/2 rounded-full"
            style={{
              width: LEGAL_DIAGRAM_NODE_SIZE,
              height: LEGAL_DIAGRAM_NODE_SIZE,
              backgroundColor: LEGAL_DIAGRAM_COLOR,
              opacity: LEGAL_DIAGRAM_NODE_OPACITY,
            }}
            animate={{ top: ["-18%", "118%"], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5, ease: "easeInOut" }}
          />
        )}
      </span>
    </div>
  );
}

function Check({ delay }: { delay: number }) {
  return (
    <motion.svg
      viewBox="0 0 12 12"
      className="size-[14px] shrink-0 fill-none stroke-[1.6]"
      style={{ stroke: "var(--flow-accent)" }}
      initial={false}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45, delay }}
      aria-hidden="true"
    >
      <motion.path
        d="M2 6.2 5 9l5-6"
        initial={false}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay }}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </motion.svg>
  );
}

function Bar({ width, delay = 0, tall = false }: { width: string; delay?: number; tall?: boolean }) {
  const reduced = useReducedMotion() ?? false;
  return (
    <span
      className={cn("relative block overflow-hidden rounded-full bg-(--flow-fill)", tall ? "h-4" : "h-3")}
      style={{ width }}
    >
      {!reduced && (
        <motion.span
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-1/2"
          style={{ background: "linear-gradient(90deg, transparent, var(--flow-shimmer), transparent)" }}
          animate={{ x: ["-120%", "300%"] }}
          transition={{ duration: 3.6, repeat: Infinity, repeatDelay: 0.6, ease: "easeInOut", delay }}
        />
      )}
    </span>
  );
}

function Card({
  className,
  shimmerDelay = 0,
  enterDelay = 0,
  children,
}: {
  className?: string;
  shimmerDelay?: number;
  enterDelay?: number;
  children: ReactNode;
}) {
  const reduced = useReducedMotion() ?? false;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: enterDelay, ease: EASE }}
      className={cn("relative overflow-hidden rounded-xl bg-(--flow-surface)", className)}
    >
      {!reduced && (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-1/4"
          style={{ background: "linear-gradient(100deg, transparent, var(--flow-card-shimmer), transparent)" }}
          animate={{ x: ["-60%", "420%"] }}
          transition={{ duration: 4, repeat: Infinity, repeatDelay: 0.6, ease: "easeInOut", delay: shimmerDelay }}
        />
      )}
      <div className="relative">{children}</div>
    </motion.div>
  );
}

function SourceFragments() {
  return (
    <motion.div
      key="sources"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.55, ease: EASE }}
      className="grid grid-cols-2 gap-4 max-md:gap-3"
    >
      {[
        ["76%", "54%", "66%"],
        ["64%", "82%", "48%"],
        ["86%", "58%", "72%"],
        ["68%", "46%", "78%"],
      ].map((lines, index) => (
        <Card key={index} className="p-6 max-md:p-4" enterDelay={index * 0.08} shimmerDelay={index * 0.4}>
          <span className="mb-5 block size-2.5 rounded-full bg-(--flow-accent) max-md:mb-3" />
          <div className="space-y-3.5 max-md:space-y-2.5">
            {lines.map((width) => (
              <span key={width} className="block h-3 rounded-full bg-(--flow-fill)" style={{ width }} />
            ))}
          </div>
        </Card>
      ))}
    </motion.div>
  );
}

function AnalyzedAuthority() {
  return (
    <Card className="mx-auto w-[92%] p-8 max-md:p-5">
      <div className="mb-7 flex items-center justify-between max-md:mb-5">
        <span className="text-[11px] uppercase tracking-[0.17em] text-(--text-muted)">
          Governing authority
        </span>
        <motion.span
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          className="size-2.5 rounded-full bg-(--flow-accent)"
        />
      </div>
      <div className="space-y-4 max-md:space-y-3">
        <span className="block h-3.5 w-[86%] rounded-full bg-(--flow-fill)" />
        <span className="block h-3.5 w-[82%] rounded-full bg-(--flow-fill)" />
        <span className="block h-3.5 w-[76%] rounded-full bg-(--flow-fill)" />
        <span className="block h-3.5 w-[52%] rounded-full bg-(--flow-fill)" />
      </div>
    </Card>
  );
}

function VerifiedLines({ final }: { final: boolean }) {
  const { t } = useTranslation("lawyers");
  const widths = final
    ? ["90%", "74%", "83%", "66%", "78%"]
    : ["76%", "61%", "88%", "57%", "70%"];

  return (
    <motion.div
      key={final ? "draft" : "verify"}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.55, ease: EASE }}
    >
      <div className="space-y-5 max-md:space-y-3.5">
        {widths.map((width, index) => (
          <div key={index} className="flex items-center gap-4">
            <Bar width={width} tall delay={index * 0.22} />
            <Check delay={0.18 + index * 0.1} />
          </div>
        ))}
      </div>
      {final && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45, ease: EASE }}
          className="mt-9 flex gap-2.5 max-md:mt-6"
        >
          {(t("engineFlow.chips", { returnObjects: true }) as string[]).map((label) => (
            <span
              key={label}
              className="rounded-md border border-(--flow-chip-border) px-3 py-2.5 text-[9px] uppercase tracking-[0.12em] text-(--flow-accent) max-md:py-2"
            >
              {label}
            </span>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}

function Typewriter({ text, className, startDelay = 160 }: { text: string; className?: string; startDelay?: number }) {
  const reduced = useReducedMotion() ?? false;
  const [count, setCount] = useState(reduced ? text.length : 0);

  useEffect(() => {
    if (reduced) {
      setCount(text.length);
      return;
    }
    setCount(0);
    let i = 0;
    let typeId = 0;
    const startId = window.setTimeout(() => {
      typeId = window.setInterval(() => {
        i += 1;
        setCount(i);
        if (i >= text.length) window.clearInterval(typeId);
      }, 34);
    }, startDelay);
    return () => {
      window.clearTimeout(startId);
      window.clearInterval(typeId);
    };
  }, [text, reduced, startDelay]);

  return (
    <span className={className}>
      {text.slice(0, count)}
      {!reduced && (
        <motion.span
          aria-hidden="true"
          animate={{ opacity: [1, 1, 0, 0] }}
          transition={{ duration: 1, repeat: Infinity, times: [0, 0.5, 0.5, 1], ease: "linear" }}
          className="ml-px inline-block h-[1.05em] w-[2px] translate-y-[2px] bg-(--flow-accent) align-baseline"
        />
      )}
    </span>
  );
}

function Deliverable({ stage, dark }: { stage: number; dark: boolean }) {
  const { t } = useTranslation("lawyers");
  const stageNotes = t("engineFlow.stageNotes", { returnObjects: true }) as string[];
  const panelStages = t("engineFlow.panelStages", { returnObjects: true }) as string[];
  return (
    <div
      className={cn("flex flex-col justify-center overflow-hidden p-8 max-md:p-5", PANEL, PANEL_H)}
      style={{ borderColor: LEGAL_DIAGRAM_LINE_COLOR }}
    >
      <div className="mb-7 flex items-center justify-between gap-4 max-md:mb-5">
        <motion.span
          key={stage}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="max-md:text-xs text-base text-(--text-muted)"
        >
          {panelStages[stage]}
        </motion.span>
        <motion.span
          animate={{
            scale: stage === 3 ? [1, 1.35, 1] : 1,
            backgroundColor: stage >= 2 ? accentOf(dark) : dotOffOf(dark),
          }}
          transition={{ duration: 0.65, ease: EASE }}
          className="size-2.5 rounded-full"
        />
      </div>

      {stage > 0 && (
        <Typewriter
          key={stage}
          text={stageNotes[stage]}
          className="mb-6 block max-w-[42ch] max-md:text-xs text-base leading-[1.55] text-(--flow-text-note) max-md:mb-4 max-md:text-[12.5px]"
        />
      )}

      <div className="relative">
        {stage === 0 && <SourceFragments />}
        {stage === 1 && <AnalyzedAuthority />}
        {stage === 2 && <VerifiedLines final={false} />}
        {stage === 3 && <VerifiedLines final />}
      </div>
    </div>
  );
}

function Sources({ active }: { active: boolean }) {
  const { t } = useTranslation("lawyers");
  const sources = t("engineFlow.sources", { returnObjects: true }) as string[];
  return (
    <ul className="m-0 grid h-full list-none grid-rows-5 gap-3 p-0 max-md:gap-1.5">
      {SOURCES.map((source, index) => (
        <motion.li
          key={index}
          className="flex items-center gap-4 rounded-2xl border bg-(--flow-panel) px-5 max-md:gap-2.5 max-md:rounded-lg max-md:px-3.5"
          style={{ borderColor: LEGAL_DIAGRAM_LINE_COLOR }}
        >
          <SourceMark logo={source.logo} icon={source.icon} />
          <span
            className={cn(
              "text-lg font-normal tracking-[-0.005em] transition-colors duration-500 max-md:text-[15px]",
              active ? "text-(--flow-text)" : "text-(--flow-text-soft)",
            )}
          >
            {sources[index]}
          </span>
        </motion.li>
      ))}
    </ul>
  );
}

function Process({
  stage,
  dark,
  onPick,
  onHover,
}: {
  stage: number;
  dark: boolean;
  onPick: (index: number) => void;
  onHover: (paused: boolean) => void;
}) {
  const { t } = useTranslation("lawyers");
  const stages = t("engineFlow.stages", { returnObjects: true }) as string[];
  return (
    <div
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      className={cn(
        "relative flex flex-col justify-center overflow-hidden px-[clamp(20px,2vw,40px)] py-9 max-md:px-4 max-md:py-5",
        PANEL,
        PANEL_H,
      )}
      style={{ borderColor: LEGAL_DIAGRAM_LINE_COLOR }}
    >
      <motion.div
        aria-hidden="true"
        style={{ background: "radial-gradient(circle, var(--flow-glow), transparent 66%)" }}
        animate={{ scale: stage === 1 ? 1.06 : 1, opacity: stage === 1 ? 0.1 : 0.05 }}
        transition={{ duration: 0.9, ease: EASE }}
        className="pointer-events-none absolute size-[72%] rounded-full"
      />
      <ul className="relative m-0 flex w-full max-w-[330px] list-none flex-col gap-3 p-0 max-md:gap-2">
        {STAGES.map((item, index) => {
          const active = index === stage;
          return (
            <li key={index}>
              <button
                type="button"
                onClick={() => onPick(index)}
                aria-pressed={active}
                className={cn(
                  "flex w-full items-center gap-4 border-0 bg-transparent p-0 text-left max-md:gap-3",
                  "cursor-pointer text-lg font-normal tracking-[-0.005em] max-md:text-[15px]",
                  "[-webkit-tap-highlight-color:transparent] transition-opacity duration-500",
                  active ? "opacity-100" : "opacity-35 hover:opacity-60",
                )}
              >
                <motion.span
                  animate={{ scale: active ? 1.06 : 1 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="grid size-11 shrink-0 place-items-center max-md:size-8"
                >
                  <StageIcon type={item.icon} active={active} replay={active ? stage : -1} dark={dark} />
                </motion.span>
                {stages[index]}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function EngineFlow({ dark = true }: { dark?: boolean }) {
  const { t } = useTranslation("lawyers");
  const reduced = useReducedMotion() ?? false;
  const [stage, setStage] = useState(0);

  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reduced || paused) return;
    const id = window.setInterval(
      () => setStage((current) => (current + 1) % STAGES.length),
      STAGE_MS,
    );
    return () => window.clearInterval(id);
  }, [reduced, paused]);

  return (
    <div
      aria-label={t("engineFlow.ariaLabel")}
      className={cn(
        "mx-auto grid w-full max-w-[1180px] items-stretch",
        "grid-cols-[1.12fr_clamp(24px,3vw,56px)_0.88fr]",
        "max-lg:max-w-[560px] max-lg:grid-cols-1 max-lg:gap-y-6 max-md:gap-y-0",
      )}
    >
      <div
        className={cn(
          "grid items-stretch",
          "grid-cols-[minmax(186px,240px)_clamp(20px,2.4vw,44px)_1fr]",
          "max-md:grid-cols-1 max-md:gap-y-0",
        )}
      >
        <Sources active={stage === 0} />

        <div className="grid grid-rows-5 gap-3 max-md:hidden">
          {SOURCES.map((source, index) => (
            <div key={index} className="flex items-center">
              <FlowLane delay={index * 0.45} />
            </div>
          ))}
        </div>
        <div className="hidden max-md:block">
          <MobileFanLanes />
        </div>

        <Process
          stage={stage}
          dark={dark}
          onPick={(index) => {
            setStage(index);
            setPaused(true);
          }}
          onHover={setPaused}
        />
      </div>

      <div className="flex items-center justify-center">
        <div className="w-full max-lg:hidden">
          <FlowLane delay={1.4} />
        </div>
        <div className="hidden md:max-lg:block">
          <MobileLane delay={1.2} />
        </div>
        <div className="hidden w-full max-md:block">
          <MobileSingleLane />
        </div>
      </div>

      <Deliverable stage={stage} dark={dark} />
    </div>
  );
}
