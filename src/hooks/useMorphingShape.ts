import { useRef } from "react";
import { useAnimationFrame, useMotionValue, useScroll } from "motion/react";

export type MorphingShapeOptions = {

  radiusMin?: number;

  radiusMax?: number;

  segmentMs?: number;

  spawnMinGapMs?: number;
  spawnMaxGapMs?: number;

  radiusMaxVariance?: number;

  bulgeRange?: number;

  scrollGated?: boolean;

  driftX?: number;

  driftScale?: number;

  // Downward-only vertical drift (px). The bar dips toward the cream below and
  // returns; it never rises into a dark frame above it.
  driftY?: number;

  driftPeriodMs?: number;
};

type CornerState = {
  curlStartMs: number | null;
  xPeak: number;
  yPeak: number;
  yLag: number;
  bulgeP1: number;
  bulgeP2: number;
};

const ARC_K = 0.5523;
const SCROLL_EPSILON = 0.5;

function curlEnvelope(
  curlStartMs: number | null,
  now: number,
  segmentMs: number,
): number {
  if (curlStartMs == null) return 0;
  const elapsed = now - curlStartMs;
  if (elapsed < 0 || elapsed >= 3 * segmentMs) return 0;
  if (elapsed < segmentMs) {
    return (1 - Math.cos((elapsed / segmentMs) * Math.PI)) / 2;
  }
  if (elapsed < 2 * segmentMs) return 1;
  return (1 + Math.cos(((elapsed - 2 * segmentMs) / segmentMs) * Math.PI)) / 2;
}

function radiusAt(
  curlStartMs: number | null,
  peak: number,
  now: number,
  segmentMs: number,
  radiusMin: number,
): number {
  return (
    radiusMin +
    (peak - radiusMin) * curlEnvelope(curlStartMs, now, segmentMs)
  );
}

function buildPath(
  w: number,
  h: number,
  corners: CornerState[],
  now: number,
  segmentMs: number,
  radiusMin: number,
): string {
  const shape = (c: CornerState) => {
    const xStart = c.curlStartMs;
    const yStart = xStart == null ? null : xStart + c.yLag;
    const env = curlEnvelope(xStart, now, segmentMs);
    return {
      rx: radiusAt(xStart, c.xPeak, now, segmentMs, radiusMin),
      ry: radiusAt(yStart, c.yPeak, now, segmentMs, radiusMin),
      k1: ARC_K + c.bulgeP1 * env,
      k2: ARC_K + c.bulgeP2 * env,
    };
  };
  const tl = shape(corners[0]);
  const tr = shape(corners[1]);
  const br = shape(corners[2]);
  const bl = shape(corners[3]);

  const scale = Math.min(
    1,
    w / Math.max(1, tl.rx + tr.rx),
    w / Math.max(1, bl.rx + br.rx),
    h / Math.max(1, tl.ry + bl.ry),
    h / Math.max(1, tr.ry + br.ry),
  );
  if (scale < 1) {
    for (const c of [tl, tr, br, bl]) {
      c.rx *= scale;
      c.ry *= scale;
    }
  }
  return [
    `M ${tl.rx} 0`,
    `L ${w - tr.rx} 0`,
    `C ${w - tr.rx * (1 - tr.k1)} 0 ${w} ${tr.ry * (1 - tr.k2)} ${w} ${tr.ry}`,
    `L ${w} ${h - br.ry}`,
    `C ${w} ${h - br.ry * (1 - br.k1)} ${w - br.rx * (1 - br.k2)} ${h} ${w - br.rx} ${h}`,
    `L ${bl.rx} ${h}`,
    `C ${bl.rx * (1 - bl.k1)} ${h} 0 ${h - bl.ry * (1 - bl.k2)} 0 ${h - bl.ry}`,
    `L 0 ${tl.ry}`,
    `C 0 ${tl.ry * (1 - tl.k1)} ${tl.rx * (1 - tl.k2)} 0 ${tl.rx} 0`,
    "Z",
  ].join(" ");
}

export function useMorphingShape<T extends HTMLElement = HTMLElement>(
  opts: MorphingShapeOptions = {},
) {
  const RADIUS_MIN = opts.radiusMin ?? 16;
  const RADIUS_MAX = opts.radiusMax ?? 40;
  const SEGMENT_MS = opts.segmentMs ?? 700;
  const SPAWN_MIN_GAP_MS = opts.spawnMinGapMs ?? 400;
  const SPAWN_MAX_GAP_MS = opts.spawnMaxGapMs ?? 1100;
  const RADIUS_MAX_VARIANCE = opts.radiusMaxVariance ?? 0.25;
  const BULGE_RANGE = opts.bulgeRange ?? 0.25;
  const scrollGated = opts.scrollGated ?? true;
  const DRIFT_X = opts.driftX ?? 0;
  const DRIFT_SCALE = opts.driftScale ?? 0;
  const DRIFT_Y = opts.driftY ?? 0;
  const DRIFT_PERIOD_MS = opts.driftPeriodMs ?? 4500;

  const clipPath = useMotionValue(`inset(0 round ${RADIUS_MIN}px)`);

  const transform = useMotionValue("translate(0px, 0px) scaleX(1)");
  const ref = useRef<T | null>(null);
  const { scrollY } = useScroll();
  const lastScrollY = useRef(0);
  const elapsedMs = useRef(0);
  const nextSpawnMs = useRef(0);
  const corners = useRef<CornerState[]>([
    { curlStartMs: null, xPeak: RADIUS_MAX, yPeak: RADIUS_MAX, yLag: 0, bulgeP1: 0, bulgeP2: 0 },
    { curlStartMs: null, xPeak: RADIUS_MAX, yPeak: RADIUS_MAX, yLag: 0, bulgeP1: 0, bulgeP2: 0 },
    { curlStartMs: null, xPeak: RADIUS_MAX, yPeak: RADIUS_MAX, yLag: 0, bulgeP1: 0, bulgeP2: 0 },
    { curlStartMs: null, xPeak: RADIUS_MAX, yPeak: RADIUS_MAX, yLag: 0, bulgeP1: 0, bulgeP2: 0 },
  ]);

  useAnimationFrame((_, delta) => {
    if (scrollGated) {
      const cur = scrollY.get();
      if (Math.abs(cur - lastScrollY.current) <= SCROLL_EPSILON) return;
      lastScrollY.current = cur;
    }

    const el = ref.current;
    if (!el) return;
    const w = el.clientWidth;
    const h = el.clientHeight;
    if (w <= 0 || h <= 0) return;

    elapsedMs.current += delta;
    const now = elapsedMs.current;

    if (now >= nextSpawnMs.current) {
      const idle: number[] = [];
      for (let i = 0; i < 4; i++) {
        const c = corners.current[i];
        if (c.curlStartMs == null || now - c.curlStartMs >= 3 * SEGMENT_MS) {
          idle.push(i);
        }
      }
      if (idle.length > 0) {
        const pick = idle[Math.floor(Math.random() * idle.length)];
        const jitter = () => 1 - Math.random() * RADIUS_MAX_VARIANCE;
        const bulge = () => (Math.random() - 0.5) * 2 * BULGE_RANGE;
        corners.current[pick] = {
          curlStartMs: now,
          xPeak: RADIUS_MAX * jitter(),
          yPeak: RADIUS_MAX * jitter(),
          yLag: (Math.random() - 0.5) * 0.5 * SEGMENT_MS,
          bulgeP1: bulge(),
          bulgeP2: bulge(),
        };
      }
      nextSpawnMs.current =
        now +
        SPAWN_MIN_GAP_MS +
        Math.random() * (SPAWN_MAX_GAP_MS - SPAWN_MIN_GAP_MS);
    }

    clipPath.set(
      `path("${buildPath(w, h, corners.current, now, SEGMENT_MS, RADIUS_MIN)}")`,
    );

    if (DRIFT_X !== 0 || DRIFT_SCALE !== 0 || DRIFT_Y !== 0) {

      const tx = DRIFT_X * Math.sin((now / DRIFT_PERIOD_MS) * 2 * Math.PI);
      const sx =
        1 +
        DRIFT_SCALE *
          Math.sin((now / (DRIFT_PERIOD_MS * 1.4)) * 2 * Math.PI);
      // Downward-only: (1 - cos)/2 stays in [0, 1], so ty ∈ [0, DRIFT_Y] — the
      // bar only ever dips toward the cream below, never up into the dark frame.
      const ty =
        (DRIFT_Y *
          (1 - Math.cos((now / (DRIFT_PERIOD_MS * 1.15)) * 2 * Math.PI))) /
        2;
      transform.set(`translate(${tx}px, ${ty}px) scaleX(${sx})`);
    }
  });

  return { ref, clipPath, transform };
}
