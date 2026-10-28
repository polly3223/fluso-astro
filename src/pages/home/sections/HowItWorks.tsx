import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Trans, useTranslation } from "react-i18next";
import { cn } from "@/utils/styles";
import { TYPE_BODY, TYPE_BODY_SMALL, TYPE_LABEL } from "@/components/typography";
import { CARD_HEADER, MAIN_CARD_DARK, TITLE, subtitle } from "./_chrome";
import { Stage as IntakeFunnelStage, CYCLE as INTAKE_FUNNEL_CYCLE_MS } from "@/pages/capture/v2/intake-funnel";
import { Stage as ReasoningDepthStage, CYCLE as REASONING_DEPTH_CYCLE_MS } from "@/pages/capture/v3/depth-stages";
import { Stage as DocumentForwardStage, CYCLE as DOC_FORWARD_CYCLE_MS } from "@/pages/capture/v4/doc-forward";
import { Stage as ConnectGridStage, CYCLE as CONNECT_GRID_CYCLE_MS } from "@/pages/capture/v5/connect-grid";
import { Stage as DraftFanStage, CYCLE as DRAFT_FAN_CYCLE_MS } from "@/pages/capture/v6/draft-fan";

// Steps 1 & 2 are live animations instead of videos.
// Step 1 ("Tracks outstanding work") — the Intake Funnel reads sources, pulls
// commitments, and stamps each with owner · deadline · source.
// Step 2 ("Performs complex multi-step tasks") — the Reasoning depth view: the
// query reasons through research → draft → check → revise, each on its model,
// then the report surfaces. Each holds exactly one full loop.
const STEP_1_MS = INTAKE_FUNNEL_CYCLE_MS;
const STEP_2_MS = REASONING_DEPTH_CYCLE_MS;
const STEP_3_MS = DOC_FORWARD_CYCLE_MS;
const STEP_4_MS = CONNECT_GRID_CYCLE_MS;
const STEP_5_MS = DRAFT_FAN_CYCLE_MS;

const DEFAULT_STEP_MS = 8000;
const MIN_STEP_MS = 6000;
const MAX_STEP_MS = 32000;

const HOW_STEP = cn(
  "how-step",
  "relative grid w-full cursor-pointer grid-cols-1 gap-y-1.5 border-0 bg-transparent py-[clamp(10px,1.2vh,16px)] text-left font-sans text-(--text-primary)",
  "transition-[opacity,border-color,box-shadow] duration-[220ms] ease-[ease]",
  // selection ring is white (bone), not the global legal-green focus outline
  "focus-visible:[outline-color:var(--text-primary)] focus-visible:outline-offset-4 focus-visible:rounded-sm",
  "before:absolute before:-left-6 before:top-[clamp(18px,2vh,24px)] before:size-[9px] before:rounded-full before:border-2 before:border-(--border-color) before:bg-(--card-bg)",
  "before:box-border before:transition-[background,border-color,transform] before:duration-[220ms]",
  "max-[980px]:rounded-2xl max-[980px]:border max-[980px]:border-(--border-soft) max-[980px]:bg-charcoal max-[980px]:bg-(image:--dark-card-glow) max-[980px]:p-5 max-[980px]:gap-y-1",
  "max-[980px]:before:hidden max-md:gap-3 max-md:p-[14px_14px]",
);

export default function HowItWorks() {
  const { t } = useTranslation("home");
  const steps = (
    t("howItWorks.steps", { returnObjects: true }) as { title: string; copy: string }[]
  ).map((s, i) => ({ n: String(i + 1), ...s }));

  const stageRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [stepDuration, setStepDuration] = useState(DEFAULT_STEP_MS);
  // Latches true the first time the stage scrolls into view, then stays true
  // forever — the 1→2→3→4→5 cycle runs continuously after that, independent of
  // scroll. (Earlier this tracked isIntersecting live, so scrolling away and
  // back restarted the whole sequence.)
  const [hasStarted, setHasStarted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [playCycle, setPlayCycle] = useState(0);

  const activate = (index: number) => {
    const next = (index + steps.length) % steps.length;
    setActiveIndex(next);
    setPlayCycle((cycle) => cycle + 1);
  };

  // Clicking the progress line restarts the active step's animation (and its
  // line) from the beginning — bumping playCycle remounts the pane.
  const replay = () => setPlayCycle((cycle) => cycle + 1);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        // Start once on the first reveal, then stop observing entirely so later
        // scrolls never re-trigger the sequence.
        setHasStarted(true);
        observer.disconnect();
      },
      { threshold: 0.32 },
    );
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const activeVideo = videoRefs.current[activeIndex];
    if (activeIndex === 0) {
      // step 1 is the Intake Funnel animation (no video) — hold ~one full loop
      setStepDuration(STEP_1_MS);
    } else if (activeIndex === 1) {
      // step 2 is the Reasoning depth animation (no video) — hold one full loop
      setStepDuration(STEP_2_MS);
    } else if (activeIndex === 2) {
      // step 3 is the Document forward animation (no video) — hold one full loop
      setStepDuration(STEP_3_MS);
    } else if (activeIndex === 3) {
      // step 4 is the Connect grid animation (no video) — hold one full loop
      setStepDuration(STEP_4_MS);
    } else if (activeIndex === 4) {
      // step 5 is the Draft & fan animation (no video) — hold one full loop
      setStepDuration(STEP_5_MS);
    } else if (activeVideo && Number.isFinite(activeVideo.duration)) {
      const duration = Math.min(
        Math.max(Math.ceil(activeVideo.duration * 1000) + 200, MIN_STEP_MS),
        MAX_STEP_MS,
      );
      setStepDuration(duration);
    } else {
      setStepDuration(DEFAULT_STEP_MS);
    }

    videoRefs.current.forEach((video, index) => {
      if (!video) return;
      if (index === activeIndex && hasStarted && !isHovered) {
        video.currentTime = 0;
        void video.play().catch(() => undefined);
      } else {
        video.pause();
      }
    });
  }, [activeIndex, isHovered, hasStarted, playCycle]);

  useEffect(() => {
    if (!hasStarted || isHovered) return;
    const timer = window.setTimeout(() => activate(activeIndex + 1), stepDuration);
    return () => window.clearTimeout(timer);
  }, [activeIndex, isHovered, hasStarted, playCycle, stepDuration]);

  const syncDuration = (index: number, video: HTMLVideoElement) => {
    if (index !== activeIndex || !Number.isFinite(video.duration)) return;
    const duration = Math.min(
      Math.max(Math.ceil(video.duration * 1000) + 200, MIN_STEP_MS),
      MAX_STEP_MS,
    );
    setStepDuration(duration);
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      activate(index + 1);
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      activate(index - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      activate(0);
    } else if (event.key === "End") {
      event.preventDefault();
      activate(steps.length - 1);
    }
  };

  return (
    <section
      id="how-it-works"
      className={cn(
        "relative flex w-full flex-col min-h-dvh px-12 py-32 bg-primary"
      )}
    >
      <main
        className={cn(
          MAIN_CARD_DARK,
          "max-[980px]:p-4",

          "max-md:px-0 max-md:py-[clamp(48px,7vh,96px)]",
        )}
        aria-labelledby="how-it-works-title"
      >
        <div className={cn(CARD_HEADER, "max-md:px-0.5")}>
          <div>
            <h1 className={cn(TITLE, "text-(--text-primary)")} id="how-it-works-title">
              <Trans t={t} i18nKey="howItWorks.title" components={{ br: <br /> }} />
            </h1>
            <p className={subtitle()}>{t("howItWorks.subtitle")}</p>
          </div>
        </div>

        <div
            ref={stageRef}
            className={cn(
              "how-layout relative z-10 grid min-h-[clamp(520px,62vh,700px)] flex-[1_1_auto] grid-cols-[minmax(280px,0.82fr)_minmax(0,1.55fr)] items-center gap-[clamp(36px,5vw,72px)]",
            "max-[980px]:grid-cols-1 max-[980px]:grid-rows-[auto] max-[980px]:gap-3",
          )}
          data-how-stage
          data-react-managed="true"
          data-playing={hasStarted && !isHovered ? "true" : "false"}
          style={{ "--step-duration": `${stepDuration}ms` } as React.CSSProperties}
        >
          <ol
              className={cn(
                "how-list relative m-0 flex list-none flex-col p-0 pl-6",
                "before:absolute before:bottom-2.5 before:left-1 before:top-2.5 before:w-px before:bg-(--border-color) before:opacity-40",
                "max-[980px]:gap-3 max-[980px]:p-[4px_0]",
                "max-[980px]:before:hidden",
              "max-md:gap-2.5 max-md:p-[4px_0]",
            )}
            role="tablist"
            aria-label={t("howItWorks.tablistLabel")}
          >
            {steps.map((s, i) => (
              <li key={s.n} className="block max-[980px]:shrink-0">
                <button
                    className={cn(
                      HOW_STEP,
                      i === activeIndex
                        ? "is-active opacity-100 before:scale-[1.15] before:border-(--text-primary) before:bg-(--text-primary) max-[980px]:border-(--border-color) max-[980px]:shadow-[0_10px_24px_rgba(0,0,0,0.18)]"
                        : "opacity-55 hover:opacity-85 max-[980px]:opacity-100",
                    )}
                  type="button"
                  role="tab"
                  id={`how-tab-${s.n}`}
                  aria-controls={`how-pane-${s.n}`}
                  aria-selected={i === activeIndex ? "true" : "false"}
                  tabIndex={i === activeIndex ? 0 : -1}
                  data-how-tab={s.n}
                  data-step={s.n}
                  onClick={() => activate(i)}
                  onKeyDown={(event) => handleKeyDown(event, i)}
                >
                {/*  <span*/}
                {/*      className={cn(*/}
                {/*        "how-step-num block font-mono font-medium",*/}
                {/*        i === activeIndex ? "text-(--text-primary)" : "text-(--text-muted)",*/}
                {/*        TYPE_LABEL,*/}
                {/*        "before:content-['0'] after:content-['_·_'] after:opacity-50",*/}
                {/*        "max-[980px]:size-[22px] max-md:size-[22px]",*/}
                {/*    )}*/}
                {/*    aria-hidden="true"*/}
                {/*  >*/}
                {/*    {s.n}*/}
                {/*  </span>*/}
                  <span className="how-step-body contents">
                    <span
                        className={cn(
                          "how-step-title m-0 font-medium text-(--text-primary) text-balance",
                          TYPE_BODY,
                          "[font-size:var(--type-lead-size)] [line-height:var(--type-lead-leading)] [letter-spacing:var(--type-lead-tracking)]"
                      )}
                    >
                      {s.title}
                    </span>
                    {/* Accordion: the description + progress line collapse for
                        inactive steps and reveal only for the active one. Motion
                        animates the height (auto↔0) reliably where a CSS grid
                        0fr→1fr transition stalls inside the button's own grid.
                        Below 981px a stylesheet rule (index.css) forces every card
                        open past these inline styles — the stacked mobile layout
                        has no single "active cell". */}
                    <motion.span
                        className="how-step-reveal block overflow-hidden"
                        initial={false}
                        animate={{
                          height: i === activeIndex ? "auto" : 0,
                          opacity: i === activeIndex ? 1 : 0,
                        }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <span
                          className={cn(
                            "how-step-copy mt-0.5 block max-w-[44ch] text-(--text-muted) text-pretty",
                            TYPE_BODY_SMALL,
                          )}
                      >
                        {s.copy}
                      </span>
                      <span
                          className={cn(
                            // padded hit area so the 1px line is easy to click/scrub
                            "how-step-progress group/scrub relative -my-1.5 mt-[clamp(6px,1vh+1px,14px)] block max-w-[220px] py-2",
                            i === activeIndex ? "cursor-pointer" : "pointer-events-none",
                          "max-[980px]:hidden",
                        )}
                        onClick={(event) => {
                          if (i !== activeIndex) return;
                          event.stopPropagation();
                          replay();
                        }}
                        aria-hidden="true"
                      >
                        <span className="block h-px overflow-hidden rounded-full bg-[rgba(242,241,237,0.12)] transition-[height] duration-150 group-hover/scrub:h-[2px]">
                          <motion.i
                            key={`${activeIndex}-${playCycle}-${i}`}
                            className="block h-full rounded-[inherit] bg-(--text-primary)"
                            initial={{ width: "0%" }}
                            animate={{
                              width: i === activeIndex && hasStarted && !isHovered ? "100%" : "0%",
                            }}
                            transition={{ duration: stepDuration / 1000, ease: "linear" }}
                          />
                        </span>
                      </span>
                    </motion.span>
                  </span>
                  <svg className="how-step-chev hidden" viewBox="0 0 16 16" aria-hidden="true">
                    <path d="M6 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </li>
            ))}
          </ol>

            <div
              className={cn(
                "how-screen relative flex h-full min-h-0 w-full min-w-0 items-start justify-center self-stretch [container-type:size]",
                "max-[980px]:hidden",
              )}
            onMouseEnter={() => setIsHovered(true)}
            // Resume on leave without bumping playCycle: bumping it changed the
            // active pane's key and remounted the animation, replaying it from
            // the start every time the cursor left the area.
            onMouseLeave={() => setIsHovered(false)}
            >
              <div
                className={cn(
                  // no overflow clip — the +30% content is meant to spill past
                  // the frame edge ("это стиль"); the frame just sets the box.
                  "how-screen-frame relative aspect-video w-full max-w-full rounded-[14px] isolation-isolate",
                )}
              >
                <article className={cn("how-pane absolute inset-0 transition-opacity duration-500", activeIndex === 0 ? "is-active z-2 opacity-100" : "pointer-events-none opacity-0")} id="how-pane-1" role="tabpanel" aria-labelledby="how-tab-1" aria-hidden={activeIndex !== 0} data-how-pane="1" data-step="1" data-tone="indigo" data-has-video="false">
                  {/* Don't mount until the stage first scrolls into view: the
                      stage auto-plays on mount, so mounting on load played the
                      animation early and then remounted (restarted) when
                      hasStarted flipped. Gating the mount makes it play once,
                      on first entry. */}
                  {hasStarted && (
                    <IntakeFunnelStage key={`s1-${activeIndex === 0 ? playCycle : "idle"}`} loop={false} />
                  )}
                </article>

                <article className={cn("how-pane absolute inset-0 transition-opacity duration-500", activeIndex === 1 ? "is-active z-2 opacity-100" : "pointer-events-none opacity-0")} id="how-pane-2" role="tabpanel" aria-labelledby="how-tab-2" aria-hidden={activeIndex !== 1} data-how-pane="2" data-step="2" data-tone="emerald" data-has-video="false">
                  {/* live animation — remounts each time step 2 becomes active */}
                  {hasStarted && (
                    <ReasoningDepthStage key={`s2-${activeIndex === 1 ? playCycle : "idle"}`} loop={false} />
                  )}
                </article>

                <article className={cn("how-pane absolute inset-0 transition-opacity duration-500", activeIndex === 2 ? "is-active z-2 opacity-100" : "pointer-events-none opacity-0")} id="how-pane-3" role="tabpanel" aria-labelledby="how-tab-3" aria-hidden={activeIndex !== 2} data-how-pane="3" data-step="3" data-tone="violet" data-has-video="false">
                  {/* live animation — remounts each time step 3 becomes active */}
                  {hasStarted && (
                    <DocumentForwardStage key={`s3-${activeIndex === 2 ? playCycle : "idle"}`} loop={false} />
                  )}
                </article>

                <article className={cn("how-pane absolute inset-0 transition-opacity duration-500", activeIndex === 3 ? "is-active z-2 opacity-100" : "pointer-events-none opacity-0")} id="how-pane-4" role="tabpanel" aria-labelledby="how-tab-4" aria-hidden={activeIndex !== 3} data-how-pane="4" data-step="4" data-tone="amber" data-has-video="false">
                  {/* live animation — remounts each time step 4 becomes active */}
                  {hasStarted && (
                    <ConnectGridStage key={`s4-${activeIndex === 3 ? playCycle : "idle"}`} loop={false} />
                  )}
                </article>

                <article className={cn("how-pane absolute inset-0 transition-opacity duration-500", activeIndex === 4 ? "is-active z-2 opacity-100" : "pointer-events-none opacity-0")} id="how-pane-5" role="tabpanel" aria-labelledby="how-tab-5" aria-hidden={activeIndex !== 4} data-how-pane="5" data-step="5" data-tone="teal" data-has-video="false">
                  {/* live animation — remounts each time step 5 becomes active */}
                  {hasStarted && (
                    <DraftFanStage key={`s5-${activeIndex === 4 ? playCycle : "idle"}`} loop={false} />
                  )}
                </article>
            </div>
          </div>
        </div>
      </main>
    </section>
  );
}
