import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useAnimationFrame,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { Trans, useTranslation } from "react-i18next";
import { cn } from "@/utils/styles";
import { TYPE_BODY_SMALL, TYPE_CARD_TITLE, TYPE_CTA } from "@/components/typography";
import { CARD_HEADER, MAIN_CARD_DARK, TITLE, subtitle } from "./_chrome";
import { PREM_DOTS } from "@/components/icons/static/prem-logo-data";

type Source = { source: string; icon: string; x: number; y: number };

const SOURCES: Source[] = [
  { source: "outlook", icon: "vscode-icons/file-type-outlook.svg", x: 22, y: 12 },
  { source: "slack", icon: "logos/slack-icon.svg", x: 44, y: 24 },
  { source: "teams", icon: "logos/microsoft-teams.svg", x: 16, y: 38 },
  { source: "gmail", icon: "logos/google-gmail.svg", x: 50, y: 52 },
  { source: "onedrive", icon: "logos/microsoft-onedrive.svg", x: 16, y: 66 },
  { source: "calendar", icon: "logos/google-calendar.svg", x: 44, y: 80 },
  { source: "excel", icon: "vscode-icons/file-type-excel.svg", x: 26, y: 92 },

  { source: "github", icon: "simple-icons/github.svg?color=%23faf9f5", x: 64, y: 28 },
  { source: "notion", icon: "logos/notion-icon.svg", x: 64, y: 72 },
];

const HUB = { x: 86, y: 50 };

// Desktop source positions (left→right flow). On mobile the sources are
// re-laid into a ring around a centred hub — see the layout effect below.
const SOURCE_HOME = SOURCES.map((s) => ({ x: s.x, y: s.y }));

const BLOB_REST = "58% 42% 55% 45% / 52% 58% 42% 48%";
const rnd = (min: number, max: number) => min + Math.random() * (max - min);

function waveFor(
  i: number,
  offset = { x: 0, y: 0 },
  tether = offset,
) {
  const s = SOURCES[i];
  const sourceX = s.x + offset.x;
  const sourceY = s.y + offset.y;
  const dx = HUB.x - sourceX;
  const tetherX = s.x + tether.x;
  const tetherY = s.y + tether.y;
  const tetherDx = HUB.x - tetherX;
  const bow = (i % 2 ? 1 : -1) * (7 + (i % 3) * 4);
  return {
    p0: { x: sourceX, y: sourceY },
    p1: { x: tetherX + tetherDx * 0.28, y: tetherY + bow },
    p2: {
      x: sourceX + dx * 0.68,
      y: HUB.y - bow * 0.9 + (tetherY - sourceY) * 0.18,
    },
    p3: { x: HUB.x, y: HUB.y },
  };
}
const wavePath = (
  i: number,
  offset = { x: 0, y: 0 },
  tether = offset,
) => {
  const { p0, p1, p2, p3 } = waveFor(i, offset, tether);
  return `M ${p0.x} ${p0.y} C ${p1.x} ${p1.y}, ${p2.x} ${p2.y}, ${p3.x} ${p3.y}`;
};
const cubicAt = (a: number, b: number, c: number, d: number, t: number) => {
  const u = 1 - t;
  return u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * c + t * t * t * d;
};

const smootherstep = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

const MARK_ORDER = PREM_DOTS.map((_, i) => i).sort(
  (a, b) => PREM_DOTS[a].dist - PREM_DOTS[b].dist,
);
const MARK_RANK: number[] = [];
MARK_ORDER.forEach((dotIdx, rank) => (MARK_RANK[dotIdx] = rank));
const MARK_EDGES = PREM_DOTS.flatMap((dot, index) => {
  const nearest = PREM_DOTS.map((c, ci) => ({
    index: ci,
    d: Math.hypot(c.cx - dot.cx, c.cy - dot.cy),
  }))
    .filter((c) => c.index !== index)
    .sort((a, b) => a.d - b.d)
    .slice(0, 2);
  return nearest.filter((c) => index < c.index).map((c) => [index, c.index] as const);
});
const DOTS_PER_ARRIVAL = 2;
const HOLD_MS = 6500;

const PULSE_POOL = 6;
const EMIT_MS = 520;

function DraggableSource({
  source,
  index,
  reduced,
  onOffset,
  onTether,
}: {
  source: Source;
  index: number;
  reduced: boolean;
  onOffset: (index: number, x: number, y: number) => void;
  onTether: (index: number, x: number, y: number) => void;
}) {
  const { t } = useTranslation("home");
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const tetherX = useSpring(x, { stiffness: 72, damping: 14, mass: 0.9 });
  const tetherY = useSpring(y, { stiffness: 72, damping: 14, mass: 0.9 });
  const position = useRef({ x: 0, y: 0 });
  const tetherPosition = useRef({ x: 0, y: 0 });
  const settleAnimations = useRef<Array<ReturnType<typeof animate>>>([]);

  useMotionValueEvent(x, "change", (latest) => {
    position.current.x = latest;
    onOffset(index, latest, position.current.y);
  });
  useMotionValueEvent(y, "change", (latest) => {
    position.current.y = latest;
    onOffset(index, position.current.x, latest);
  });
  useMotionValueEvent(tetherX, "change", (latest) => {
    tetherPosition.current.x = latest;
    onTether(index, latest, tetherPosition.current.y);
  });
  useMotionValueEvent(tetherY, "change", (latest) => {
    tetherPosition.current.y = latest;
    onTether(index, tetherPosition.current.x, latest);
  });

  useEffect(
    () => () => {
      settleAnimations.current.forEach((animation) => animation.stop());
    },
    [],
  );

  const settleNearby = () => {
    settleAnimations.current.forEach((animation) => animation.stop());
    const transition = {
      type: "spring" as const,
      stiffness: 175,
      damping: 15,
      mass: 0.82,
    };
    settleAnimations.current = [
      animate(x, rnd(-34, 34), transition),
      animate(y, rnd(-28, 28), transition),
    ];
  };

  return (
    <motion.div
      className="pointer-events-none absolute"
      style={{
        left: `${source.x}%`,
        top: `${source.y}%`,
        marginLeft: -24,
        marginTop: -24,
      }}
      animate={
        reduced
          ? undefined
          : { y: [0, -9, 0, 7, 0], x: [0, 5, 0, -5, 0] }
      }
      transition={{
        duration: 9 + (index % 5) * 1.7,
        ease: "easeInOut",
        repeat: Infinity,
        delay: -index * 1.4,
      }}
    >
      <motion.div
        drag={!reduced}
        dragConstraints={{ left: -120, right: 120, top: -100, bottom: 100 }}
        dragElastic={0.12}
        dragMomentum={false}
        onDragStart={() => {
          settleAnimations.current.forEach((animation) => animation.stop());
        }}
        onDragEnd={settleNearby}
        style={{ x, y }}
        whileHover={reduced ? undefined : { scale: 1.08 }}
        whileDrag={{ scale: 1.16, cursor: "grabbing" }}
        className="pointer-events-auto cursor-grab touch-none select-none"
        aria-label={t("connectors.dragSourceAriaLabel", { source: source.source })}
      >
        <img
          src={`https://api.iconify.design/${source.icon}`}
          alt=""
          draggable={false}
          loading="lazy"
          className="pointer-events-none size-12 select-none [-webkit-user-drag:none] [filter:drop-shadow(0_12px_26px_rgba(0,0,0,0.5))]"
        />
      </motion.div>
    </motion.div>
  );
}

function FlowGraph() {
  const { t } = useTranslation("home");
  const reduced = useReducedMotion() ?? false;
  const graphRef = useRef<HTMLDivElement>(null);
  const offsets = useRef(
    SOURCES.map(() => ({
      x: 0,
      y: 0,
    })),
  );
  const tetherOffsets = useRef(
    SOURCES.map(() => ({
      x: 0,
      y: 0,
    })),
  );
  const pathEls = useRef<
    Array<{
      rail: SVGPathElement | null;
      current: SVGPathElement | null;
    }>
  >(SOURCES.map(() => ({ rail: null, current: null })));

  const updatePath = (index: number) => {
    const path = wavePath(
      index,
      offsets.current[index],
      tetherOffsets.current[index],
    );
    pathEls.current[index]?.rail?.setAttribute("d", path);
    pathEls.current[index]?.current?.setAttribute("d", path);
  };

  const updateSourceOffset = (index: number, pixelX: number, pixelY: number) => {
    const graph = graphRef.current;
    if (!graph) return;

    const offset = {
      x: (pixelX / Math.max(1, graph.clientWidth)) * 100,
      y: (pixelY / Math.max(1, graph.clientHeight)) * 100,
    };
    offsets.current[index] = offset;
    updatePath(index);
  };

  const updateTetherOffset = (index: number, pixelX: number, pixelY: number) => {
    const graph = graphRef.current;
    if (!graph) return;
    tetherOffsets.current[index] = {
      x: (pixelX / Math.max(1, graph.clientWidth)) * 100,
      y: (pixelY / Math.max(1, graph.clientHeight)) * 100,
    };
    updatePath(index);
  };

  const [revealed, setRevealed] = useState(reduced ? MARK_ORDER.length : 0);
  const revealedRef = useRef(revealed);
  revealedRef.current = revealed;

  // Desktop: hub sits far right, sources flow in from the left. Mobile: centre
  // the hub and ring the sources evenly around it so none get clipped or
  // crammed. Re-render rebuilds the wave paths + positions from HUB/SOURCES.
  const [, bumpHub] = useState(0);
  useEffect(() => {
    const update = () => {
      const mobile = window.innerWidth < 768;
      if (mobile) {
        HUB.x = 50;
        HUB.y = 50;
        const R = 41;
        SOURCES.forEach((s, i) => {
          const a = (i / SOURCES.length) * Math.PI * 2 - Math.PI / 2;
          s.x = 50 + R * Math.cos(a);
          s.y = 50 + R * Math.sin(a);
        });
      } else {
        HUB.x = 86;
        HUB.y = 50;
        SOURCES.forEach((s, i) => {
          s.x = SOURCE_HOME[i].x;
          s.y = SOURCE_HOME[i].y;
        });
      }
      bumpHub((n) => n + 1);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (reduced || revealed < MARK_ORDER.length) return;
    const t = window.setTimeout(() => setRevealed(0), HOLD_MS);
    return () => window.clearTimeout(t);
  }, [revealed, reduced]);

  const [hubBurst, setHubBurst] = useState(0);

  const burstHub = () => {
    if (reduced) return;
    setHubBurst((value) => value + 1);
    setRevealed(MARK_ORDER.length);
  };

  const pulseEls = useRef<(HTMLDivElement | null)[]>([]);
  const slots = useRef(
    Array.from({ length: PULSE_POOL }, () => ({
      active: false,
      src: 0,
      start: 0,
      dur: 0,
    })),
  );
  const lastEmit = useRef(0);

  useAnimationFrame((t) => {
    if (reduced) return;
    if (t - lastEmit.current > EMIT_MS) {
      const free = slots.current.find((s) => !s.active);
      if (free) {
        free.active = true;
        free.src = Math.floor(Math.random() * SOURCES.length);
        free.start = t;
        free.dur = 1500 + (Math.random() - 0.5) * 360;
        lastEmit.current = t;
      }
    }
    slots.current.forEach((s, i) => {
      const el = pulseEls.current[i];
      if (!el) return;
      if (!s.active) {
        el.style.opacity = "0";
        return;
      }
      const k = (t - s.start) / s.dur;
      if (k >= 1) {
        s.active = false;
        el.style.opacity = "0";

        setRevealed((r) => Math.min(MARK_ORDER.length, r + DOTS_PER_ARRIVAL));
        return;
      }
      const e = smootherstep(k);
      const w = waveFor(
        s.src,
        offsets.current[s.src],
        tetherOffsets.current[s.src],
      );
      const x = cubicAt(w.p0.x, w.p1.x, w.p2.x, w.p3.x, e);
      const y = cubicAt(w.p0.y, w.p1.y, w.p2.y, w.p3.y, e);
      el.style.left = `${x}%`;
      el.style.top = `${y}%`;
      el.style.opacity = String(
        k < 0.12 ? k / 0.12 : k > 0.85 ? Math.max(0, (1 - k) / 0.15) : 1,
      );
    });
  });

  return (
    <div ref={graphRef} className="relative size-full">

      <svg
        className="absolute inset-0 size-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        fill="none"
        aria-hidden="true"
      >
        {SOURCES.map((s, i) => {
          const d = wavePath(
            i,
            offsets.current[i],
            tetherOffsets.current[i],
          );
          return (
            <g key={s.source}>
              <path
                ref={(element) => {
                  pathEls.current[i].rail = element;
                }}
                d={d}
                stroke="rgba(250,249,245,0.07)"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
              <motion.path
                ref={(element) => {
                  pathEls.current[i].current = element;
                }}
                d={d}
                stroke="rgba(250,249,245,0.28)"
                strokeWidth="1"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                pathLength={1}
                strokeDasharray="0.05 0.13"
                animate={reduced ? undefined : { strokeDashoffset: [0, -0.36] }}
                transition={{
                  duration: 8 + (i % 4) * 1.9,
                  ease: "linear",
                  repeat: Infinity,
                }}
              />
            </g>
          );
        })}
      </svg>

      {Array.from({ length: PULSE_POOL }, (_, i) => (
        <div
          key={i}
          ref={(el) => {
            pulseEls.current[i] = el;
          }}
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute size-[7px] rounded-full bg-bone opacity-0",
            "-ml-[3.5px] -mt-[3.5px]",
            "shadow-[0_0_14px_4px_rgba(250,249,245,0.35)]",
          )}
        />
      ))}

      {SOURCES.map((source, index) => (
        <DraggableSource
          key={source.source}
          source={source}
          index={index}
          reduced={reduced}
          onOffset={updateSourceOffset}
          onTether={updateTetherOffset}
        />
      ))}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute size-[230px]"
        style={{
          left: `${HUB.x}%`,
          top: `${HUB.y}%`,
          marginLeft: -115,
          marginTop: -115,
        }}
      >
        <svg className="absolute inset-0 size-full" viewBox="0 0 313 324" fill="none">
          {MARK_EDGES.map(([a, b]) => {
            const on = MARK_RANK[a] < revealed && MARK_RANK[b] < revealed;
            return (
              <motion.line
                key={`${a}-${b}`}
                x1={PREM_DOTS[a].cx}
                y1={PREM_DOTS[a].cy}
                x2={PREM_DOTS[b].cx}
                y2={PREM_DOTS[b].cy}
                stroke="rgba(250,249,245,1)"
                strokeWidth="0.7"
                vectorEffect="non-scaling-stroke"
                initial={false}
                animate={{ opacity: on ? 0.2 : 0 }}
                transition={{ duration: 0.9, ease: "easeInOut" }}
              />
            );
          })}
        </svg>
        {PREM_DOTS.map((d, i) => {
          const on = MARK_RANK[i] < revealed;
          const size = 3 + Math.min(d.dist / 145, 1) * 2.6;
          return (
            <motion.span
              key={i}
              className="absolute rounded-full bg-bone"
              style={{
                left: `${(d.cx / 313) * 100}%`,
                top: `${(d.cy / 324) * 100}%`,
                width: size,
                height: size,
                marginLeft: -size / 2,
                marginTop: -size / 2,
              }}
              initial={false}
              animate={{ scale: on ? 1 : 0, opacity: on ? 0.92 : 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            />
          );
        })}
      </div>

      <div
        className="absolute z-[2]"
        style={{
          left: `${HUB.x}%`,
          top: `${HUB.y}%`,
          marginLeft: -48,
          marginTop: -48,
        }}
      >
        <motion.div
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 size-44 -translate-x-1/2 -translate-y-1/2 rounded-full bg-bone/12 blur-2xl lg:hidden"
          animate={reduced ? undefined : { scale: [1, 1.18, 1], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 7, ease: "easeInOut", repeat: Infinity }}
        />
        {hubBurst > 0 && (
          <motion.div
            key={hubBurst}
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 size-24 -translate-x-1/2 -translate-y-1/2"
          >
            <motion.span
              className="absolute inset-0 rounded-full border border-bone/70"
              initial={{ scale: 0.65, opacity: 0.9 }}
              animate={{ scale: 2.7, opacity: 0 }}
              transition={{ duration: 1.15, ease: [0.16, 1, 0.3, 1] }}
            />
            {Array.from({ length: 14 }, (_, index) => {
              const angle = (index / 14) * Math.PI * 2;
              const distance = 72 + (index % 3) * 14;
              return (
                <motion.span
                  key={index}
                  className="absolute left-1/2 top-1/2 size-1.5 rounded-full bg-bone"
                  initial={{ x: -3, y: -3, scale: 1, opacity: 1 }}
                  animate={{
                    x: Math.cos(angle) * distance - 3,
                    y: Math.sin(angle) * distance - 3,
                    scale: 0,
                    opacity: 0,
                  }}
                  transition={{
                    duration: 0.9 + (index % 4) * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                />
              );
            })}
          </motion.div>
        )}

        <div className="relative z-10">
          <motion.div
            role="button"
            tabIndex={0}
            aria-label={t("connectors.hubAriaLabel")}
            onClick={burstHub}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                burstHub();
              }
            }}
            className={cn(
              "relative grid size-24 cursor-pointer select-none place-items-center bg-bone text-ink outline-none",
              "font-chill text-[36px] font-medium",
              "shadow-[0_24px_60px_rgba(0,0,0,0.55)] lg:shadow-none",
              "focus-visible:ring-2 focus-visible:ring-blue-300/70",
            )}
            style={{ borderRadius: BLOB_REST }}
            whileHover={reduced ? undefined : { scale: 1.05 }}
            whileTap={reduced ? undefined : { scale: 0.94 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
          >
            F
          </motion.div>
        </div>
      </div>
    </div>
  );
}

type WorldCard = { title: string; body: string };

export default function Connectors() {
  const { t } = useTranslation("home");
  const cards = t("connectors.cards", { returnObjects: true }) as WorldCard[];

  return (
    <section
      id="connectors"
      className={cn(
        "relative flex min-h-dvh w-full flex-col overflow-hidden bg-primary px-12 py-32",
      )}
    >
      <main
        className={cn(
          MAIN_CARD_DARK,

          "flex-[1_1_auto] overflow-visible bg-[#0c0c0c] p-0",
          "my-[calc(-1*(clamp(48px,7vh,96px)+24px))]",
          "max-lg:min-h-[70vh]",
          "max-md:my-[calc(-1*(clamp(40px,6vh,56px)+24px))] max-md:py-[calc(clamp(40px,6vh,56px)+24px)]",
        )}
        aria-labelledby="world-model-title"
      >
        <div
          className={cn(
            "relative z-[1] isolate grid min-h-0 flex-[1_1_auto] bg-transparent",
            "grid-cols-[minmax(0,1fr)_minmax(320px,1fr)] [grid-template-rows:minmax(0,1fr)_auto_auto]",
            "[grid-template-areas:'content_graph''cards_cards''link_link']",
            "gap-x-[clamp(24px,3vw,64px)]",
            "max-lg:grid-cols-[minmax(0,1fr)] max-lg:[grid-template-rows:auto_auto_auto_auto]",
            "max-lg:[grid-template-areas:'content''graph''cards''link'] max-lg:gap-x-0 max-lg:gap-y-[clamp(20px,3vh,32px)]",
            "max-md:gap-y-6",
          )}
        >
          <div
            className={cn(
              "h-[min(52vh,520px)] min-h-[360px] w-full max-w-[760px] place-self-center [grid-area:graph]",
              "max-lg:h-[clamp(260px,38vh,360px)] max-lg:min-h-0",
            )}
            aria-hidden="true"
          >
            <FlowGraph />
          </div>

          <div
            className={cn(
              "relative z-[5] flex min-h-0 flex-col gap-[clamp(20px,3vh,32px)] self-center [grid-area:content] [pointer-events:none] [&>*]:[pointer-events:auto]",
              "max-lg:gap-5",
              "max-md:gap-3.5",
              "lg:mix-blend-difference lg:[--border-soft:rgba(255,255,255,0.18)] lg:[--text-muted:rgba(255,255,255,0.65)] lg:[--text-primary:#fff]",
            )}
          >
            <div className={cn(CARD_HEADER, "max-w-[46ch] max-lg:max-w-full")}>
              <div>
                <h1 className={cn(TITLE, "text-(--text-primary)")} id="world-model-title">
                  <Trans t={t} i18nKey="connectors.title" components={{ br: <br /> }} />
                </h1>
                <p className={subtitle("max-w-[40ch]")}>
                  {t("connectors.subtitle")}
                </p>
              </div>
            </div>
          </div>

          <div
            className={cn(
              "relative isolate mt-[clamp(28px,4vh,56px)] grid grid-cols-3 border-t border-(--border-soft) bg-transparent [grid-area:cards]",
              "max-lg:mt-0 max-lg:grid-cols-1 max-lg:border-t max-lg:border-(--border-soft)",
              "lg:z-[5] lg:mix-blend-difference lg:[--border-soft:rgba(255,255,255,0.18)] lg:[--text-muted:rgba(255,255,255,0.65)] lg:[--text-primary:#fff]",
            )}
            role="list"
          >
            {cards.map((c, i) => (
              <article
                key={i}
                className={cn(
                  "flex flex-col gap-2.5 border-r border-(--border-soft) bg-transparent",
                  "p-[clamp(18px,2.4vh+4px,26px)_clamp(20px,2vw,28px)_clamp(18px,2.2vh,24px)]",
                  i === cards.length - 1 && "border-r-0",
                  "max-lg:border-r-0 max-lg:border-b max-lg:border-(--border-soft) max-lg:p-[18px_0]",
                  i === 0 && "max-lg:pt-[18px]",
                  i === cards.length - 1 && "max-lg:border-b-0 max-lg:pb-1",
                )}
                role="listitem"
              >
                <h3
                  className={cn(
                    "mt-1 font-medium text-(--text-primary)",
                    TYPE_CARD_TITLE,
                  )}
                >
                  <Trans
                    t={t}
                    i18nKey={`connectors.cards.${i}.title` as never}
                    components={{ br: <br /> }}
                  />
                </h3>
                <p
                  className={cn(
                    "mt-1 max-w-[34ch] text-(--text-muted)",
                    TYPE_BODY_SMALL,
                    "max-[640px]:max-w-full",
                  )}
                >
                  {c.body}
                </p>
              </article>
            ))}
          </div>

          <a
            className={cn(
              "group/link mt-[clamp(14px,2vh,24px)] inline-flex max-w-full gap-2.5 justify-center items-center w-full [grid-area:link]",
              "text-(--text-muted) no-underline transition-colors duration-180 ease-[ease] hover:text-(--text-primary)",
              "lg:relative lg:z-[5] lg:mix-blend-difference lg:[--text-muted:rgba(255,255,255,0.65)] lg:[--text-primary:#fff]",
              TYPE_CTA,
            )}
            href="https://github.com/prem-research"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg className="size-[18px] shrink-0 text-[#faf9f5] opacity-100" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.07 3.29 9.37 7.86 10.89.58.1.79-.25.79-.55 0-.27-.01-1.18-.02-2.13-3.2.7-3.88-1.36-3.88-1.36-.52-1.34-1.27-1.7-1.27-1.7-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.68 1.25 3.34.95.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.18.91-.25 1.89-.38 2.86-.38.97 0 1.95.13 2.86.38 2.19-1.49 3.15-1.18 3.15-1.18.62 1.58.23 2.75.11 3.04.73.8 1.17 1.82 1.17 3.08 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14 0 1.55-.01 2.79-.01 3.17 0 .31.21.66.8.55C20.21 21.37 23.5 17.07 23.5 12 23.5 5.65 18.35.5 12 .5z" />
            </svg>
            <span>
              <Trans
                t={t}
                i18nKey="connectors.researchLink"
                components={{ strong: <strong className="font-medium text-(--text-primary)" /> }}
              />
            </span>
            <svg
              className="size-4 shrink-0 transition-transform duration-[180ms] ease-[ease] group-hover/link:translate-x-[3px]"
              viewBox="0 0 16 16"
              aria-hidden="true"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </a>
        </div>
      </main>
    </section>
  );
}
