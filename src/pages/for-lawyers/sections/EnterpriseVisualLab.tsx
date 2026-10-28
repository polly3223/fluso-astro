import {
  useLayoutEffect,
  useRef,
  useState,
  type MutableRefObject,
} from "react";
import { motion, useAnimationFrame, useReducedMotion } from "motion/react";
import {
  LEGAL_DIAGRAM_COLOR,
  LEGAL_DIAGRAM_LINE_OPACITY,
  LEGAL_DIAGRAM_LINE_WIDTH,
  LEGAL_DIAGRAM_NODE_OPACITY,
  LEGAL_DIAGRAM_NODE_SIZE,
} from "./legalDiagramStyle";

const EASE = [0.22, 1, 0.36, 1] as const;
// One travelling dot at a time: each route gets a travel window inside a single
// shared loop, so they fire in turn (not all at once) with only a brief gap.
const DOT_CYCLE = 20; // seconds for the full loop across all routes
const DOT_TRAVEL = 3.6; // seconds a single dot is in flight

// Dots that reach the node collect inside it and drift chaotically, accumulating
// up to FLOAT_MAX. A new one settles in roughly each time a travelling dot arrives.
const FLOAT_MAX = 30;
const FLOAT_SPAWN_MS = (DOT_CYCLE / 5) * 1000; // ~one per travelling-dot arrival

type Anchor = { left: number; right: number; y: number };

export default function EnterpriseVisualLab({
  anchorRefs,
}: {
  anchorRefs: MutableRefObject<Array<HTMLElement | null>>;
}) {
  const reduced = useReducedMotion() ?? false;
  const hostRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 1200, height: 820 });
  const [anchors, setAnchors] = useState<Anchor[]>([]);

  useLayoutEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let raf = 0;

    const measure = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const hostRect = host.getBoundingClientRect();
        const next = anchorRefs.current
          .map((anchor) => {
            if (!anchor) return null;
            const rect = anchor.getBoundingClientRect();
            const transform = getComputedStyle(anchor).transform;
            const matrix =
              transform === "none" ? null : new DOMMatrixReadOnly(transform);
            return {
              left: rect.left - hostRect.left - (matrix?.m41 ?? 0),
              right: rect.right - hostRect.left - (matrix?.m41 ?? 0),
              y: rect.top - hostRect.top - (matrix?.m42 ?? 0),
            };
          })
          .filter((point): point is Anchor => point !== null);

        setSize({ width: hostRect.width, height: hostRect.height });
        setAnchors(next);
      });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(host);
    anchorRefs.current.forEach((anchor) => {
      if (anchor) observer.observe(anchor);
    });
    window.addEventListener("resize", measure);
    document.fonts.ready.then(measure);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [anchorRefs]);

  const terminalX = size.width - Math.max(70, Math.min(118, size.width * 0.065));
  const lastAnchor = anchors.at(-1);
  const previousAnchor = anchors.at(-2);
  const rowGap = lastAnchor && previousAnchor
    ? lastAnchor.y - previousAnchor.y
    : size.height * 0.12;
  const routeSources = lastAnchor
    ? [
        ...anchors,
        {
          left: lastAnchor.left,
          right: lastAnchor.right,
          y: Math.min(size.height - 72, lastAnchor.y + rowGap * 0.92),
        },
      ]
    : anchors;
  const sourceTop = routeSources[0]?.y ?? size.height * 0.34;
  const sourceBottom = routeSources.at(-1)?.y ?? size.height * 0.66;
  const targetCenter = (sourceTop + sourceBottom) / 2;
  const targetGap = Math.max(
    52,
    Math.min(84, (sourceBottom - sourceTop) / Math.max(1, routeSources.length - 1)),
  );
  const routeTargets = routeSources.map((_, index) => ({
    x: terminalX,
    y: targetCenter + (index - (routeSources.length - 1) / 2) * targetGap,
  }));
  const terminalTop = routeTargets.length
    ? Math.min(...routeTargets.map((point) => point.y)) - 44
    : size.height * 0.3;
  const terminalBottom = routeTargets.length
    ? Math.max(...routeTargets.map((point) => point.y)) + 44
    : size.height * 0.7;

  // --- Dots that arrive settle inside the node and drift chaotically. ---
  const boxHeight = Math.max(120, terminalBottom - terminalTop);
  const floatBounds = useRef({ left: 0, right: 0, top: 0, bottom: 0 });
  floatBounds.current = {
    left: terminalX - 32 + 7,
    right: terminalX + 32 - 7,
    top: terminalTop + 9,
    bottom: terminalTop + boxHeight - 9,
  };
  const floatRefs = useRef<Array<SVGCircleElement | null>>([]);
  const floatState = useRef(
    Array.from({ length: FLOAT_MAX }, () => ({
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      active: false,
    })),
  );
  const floatCount = useRef(0);
  const lastFloatSpawn = useRef(0);

  useAnimationFrame((t) => {
    if (reduced) return;
    const b = floatBounds.current;
    if (b.right <= b.left || b.bottom <= b.top) return;

    if (floatCount.current < FLOAT_MAX && t - lastFloatSpawn.current > FLOAT_SPAWN_MS) {
      const p = floatState.current[floatCount.current];
      p.x = b.left;
      p.y = b.top + Math.random() * (b.bottom - b.top);
      p.vx = 0.2 + Math.random() * 0.25;
      p.vy = (Math.random() - 0.5) * 0.5;
      p.active = true;
      floatCount.current += 1;
      lastFloatSpawn.current = t;
    }

    for (let i = 0; i < FLOAT_MAX; i++) {
      const p = floatState.current[i];
      const el = floatRefs.current[i];
      if (!el) continue;
      if (!p.active) {
        el.style.opacity = "0";
        continue;
      }
      // chaotic wander: nudge velocity, damp, clamp
      p.vx = Math.max(-0.55, Math.min(0.55, (p.vx + (Math.random() - 0.5) * 0.07) * 0.99));
      p.vy = Math.max(-0.55, Math.min(0.55, (p.vy + (Math.random() - 0.5) * 0.07) * 0.99));
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < b.left) { p.x = b.left; p.vx = Math.abs(p.vx); }
      else if (p.x > b.right) { p.x = b.right; p.vx = -Math.abs(p.vx); }
      if (p.y < b.top) { p.y = b.top; p.vy = Math.abs(p.vy); }
      else if (p.y > b.bottom) { p.y = b.bottom; p.vy = -Math.abs(p.vy); }
      el.setAttribute("cx", String(p.x));
      el.setAttribute("cy", String(p.y));
      el.style.opacity = String(LEGAL_DIAGRAM_NODE_OPACITY);
    }
  });

  return (
    <div
      ref={hostRef}
      className="pointer-events-none absolute inset-0 z-[1] overflow-hidden max-md:hidden"
    >
      {/*<div*/}
      {/*  className="absolute inset-0"*/}
      {/*  style={{*/}
      {/*    background:*/}
      {/*      "linear-gradient(90deg, #0c0c0c 0%, rgba(12,12,12,0.97) 35%, rgba(12,12,12,0.7) 53%, rgba(12,12,12,0.16) 76%, rgba(12,12,12,0.36) 100%)",*/}
      {/*  }}*/}
      {/*/>*/}
      {/*<div className="absolute inset-0 bg-gradient-to-b from-[#0c0c0c]/55 via-transparent to-[#0c0c0c]/70" />*/}

      <motion.svg
        viewBox={`0 0 ${size.width} ${size.height}`}
        className="absolute inset-0 size-full opacity-90"
        fill="none"
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.9 }}
        transition={{ duration: reduced ? 0 : 0.75, ease: EASE }}
      >
        <defs>
          {routeSources.map((source, index) => (
            <linearGradient
              key={index}
              id={`enterprise-route-${index}`}
              gradientUnits="userSpaceOnUse"
              x1={source.left}
              x2={terminalX}
            >
              <stop stopColor={LEGAL_DIAGRAM_COLOR} stopOpacity={LEGAL_DIAGRAM_LINE_OPACITY} />
              <stop offset="1" stopColor={LEGAL_DIAGRAM_COLOR} stopOpacity={LEGAL_DIAGRAM_LINE_OPACITY} />
            </linearGradient>
          ))}
        </defs>

        {routeSources.map((source, index) => {
          const target = routeTargets[index];
          const bend = Math.max(58, (target.x - source.right) * 0.2);
          const d = [
            `M${source.left} ${source.y}`,
            `H${source.right + bend * 0.58}`,
            `C${source.right + bend} ${source.y}`,
            `${source.right + bend} ${target.y}`,
            `${source.right + bend * 1.55} ${target.y}`,
            `H${target.x}`,
          ].join(" ");

          return (
            <motion.g key={`${source.left}-${source.y}`}>
              <motion.path
                d={d}
                stroke={`url(#enterprise-route-${index})`}
                strokeWidth={LEGAL_DIAGRAM_LINE_WIDTH}
                initial={reduced ? false : { pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{
                  duration: 1.5,
                  delay: index * 0.12,
                  ease: EASE,
                }}
              />
              {!reduced && (() => {
                const slot = 1 / routeSources.length;
                const travel = DOT_TRAVEL / DOT_CYCLE;
                const a = index * slot + Math.max(0.01, (slot - travel) / 2);
                const b = a + travel;
                const f = (n: number) => n.toFixed(4);
                return (
                  // Each dot rests ON its terminal point (blended with the node)
                  // until its turn, then jumps to its source and travels back —
                  // so only one dot is moving at any time, sequential, not all at once.
                  <circle r={LEGAL_DIAGRAM_NODE_SIZE / 2} fill={LEGAL_DIAGRAM_COLOR} opacity={LEGAL_DIAGRAM_NODE_OPACITY}>
                    <animateMotion
                      dur={`${DOT_CYCLE}s`}
                      repeatCount="indefinite"
                      calcMode="linear"
                      keyPoints="1;1;0;1;1"
                      keyTimes={`0;${f(a)};${f(a)};${f(b)};1`}
                      path={d}
                    />
                  </circle>
                );
              })()}
              <motion.circle
                cx={target.x}
                cy={target.y}
                r={LEGAL_DIAGRAM_NODE_SIZE / 2}
                fill={LEGAL_DIAGRAM_COLOR}
                opacity={LEGAL_DIAGRAM_NODE_OPACITY}
                initial={reduced ? false : { scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  duration: 0.5,
                  delay: 0.8 + index * 0.12,
                  ease: EASE,
                }}
              />
            </motion.g>
          );
        })}

        <motion.rect
          x={terminalX - 32}
          y={terminalTop}
          width="64"
          height={Math.max(120, terminalBottom - terminalTop)}
          rx="12"
          stroke={LEGAL_DIAGRAM_COLOR}
          strokeOpacity={LEGAL_DIAGRAM_LINE_OPACITY}
          strokeWidth={LEGAL_DIAGRAM_LINE_WIDTH}
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.75 }}
        />

        {/* Dots that have arrived, drifting chaotically inside the node. */}
        {!reduced &&
          Array.from({ length: FLOAT_MAX }, (_, i) => (
            <circle
              key={`float-${i}`}
              ref={(el) => {
                floatRefs.current[i] = el;
              }}
              r={LEGAL_DIAGRAM_NODE_SIZE / 2}
              fill={LEGAL_DIAGRAM_COLOR}
              opacity={0}
            />
          ))}

        <text
          x={terminalX + 32}
          y={terminalTop - 18}
          fill="#faf9f5"
          opacity="0.62"
          textAnchor="end"
          className="font-serif italic"
          fontSize="17"
        >
          Your firm, unified
        </text>
      </motion.svg>
    </div>
  );
}
