import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  PREM_LOGO_PATHS,
  PREM_DOTS,
} from "@/components/icons/static/prem-logo-data";

const ICON = 44;
const PER_SIDE = 5;
const D_FAR = 360;
const COL_X = 134;
const ROW_GAP = 46;

const CONVEYOR_SEC = 10;
const BLUR_MAX = 8;
const SCALE_MIN = 0.6;
const ENTER_SPAN = 0.16;
const FADE_END = 0.7;
const FADE_SPAN = 0.22;
const SAMPLES = 32;
const SWALLOW_POW = 1.8;

const NS = "http://www.w3.org/2000/svg";
const CENTER_X = 156.6;
const CENTER_Y = 161.8;
const MAX_DIST = 145.1;
const SPRING = 0.04;
const DAMPING = 0.8;
const MAX_EXPAND = 14;
const BLOOM_SEC = 8;
const PULSE_SPEED = (2 * Math.PI) / (BLOOM_SEC * 1000);

const CORE_DIST = 40;
const CORE_SPIN_SEC = 48;

const ICONS: { icon: string; label: string }[] = [

  { icon: "logos:google-drive", label: "Google Drive" },
  { icon: "logos:google-gmail", label: "Gmail" },
  { icon: "vscode-icons:file-type-outlook", label: "Outlook" },
  { icon: "logos:google-calendar", label: "Google Calendar" },
  { icon: "logos:slack-icon", label: "Slack" },

  { icon: "logos:microsoft-teams", label: "Microsoft Teams" },
  { icon: "logos:notion-icon", label: "Notion" },
  { icon: "logos:dropbox", label: "Dropbox" },
  { icon: "logos:github-icon", label: "GitHub" },
  { icon: "logos:linear-icon", label: "Linear" },
];

function beltKeyframes(side: -1 | 1) {
  const x: number[] = [];
  const opacity: number[] = [];
  const scale: number[] = [];
  const filter: string[] = [];
  for (let k = 0; k <= SAMPLES; k++) {
    const u = k / SAMPLES;
    const d = D_FAR * (1 - u);
    x.push(side * d);
    const enter = Math.min(1, u / ENTER_SPAN);
    const exit = Math.min(1, Math.max(0, (u - (FADE_END - FADE_SPAN)) / FADE_SPAN));
    const dissolve = Math.max(1 - enter, exit);
    opacity.push(1 - dissolve);
    scale.push(1 - exit * (1 - SCALE_MIN));
    filter.push(`blur(${(dissolve * BLUR_MAX).toFixed(2)}px)`);
  }
  return { x, opacity, scale, filter };
}

const LEFT_KF = beltKeyframes(-1);
const RIGHT_KF = beltKeyframes(1);

const BELT_TIMES = Array.from({ length: SAMPLES + 1 }, (_, k) =>
  (k / SAMPLES) ** (1 / SWALLOW_POW),
);

function BeltIcon({
  icon,
  i,
  reduced,
}: {
  icon: string;
  i: number;
  reduced: boolean;
}) {
  const side: -1 | 1 = i < PER_SIDE ? -1 : 1;
  const j = i % PER_SIDE;
  const img = (
    <img
      src={`https://api.iconify.design/${icon.replace(":", "/")}.svg`}
      alt=""
      loading="lazy"
      className="size-9 grayscale brightness-150 [-webkit-user-drag:none] select-none"
    />
  );
  if (reduced) {
    const d = COL_X + j * ROW_GAP;
    return (
      <div
        aria-hidden="true"
        style={{
          transform: `translateX(${side * d}px)`,
          marginLeft: -ICON / 2,
          marginTop: -ICON / 2,
        }}
        className="absolute top-1/2 left-1/2 grid size-12 place-items-center"
      >
        {img}
      </div>
    );
  }
  const kf = side < 0 ? LEFT_KF : RIGHT_KF;
  return (
    <motion.div
      aria-hidden="true"
      style={{ marginLeft: -ICON / 2, marginTop: -ICON / 2 }}
      className="absolute top-1/2 left-1/2 grid size-11 place-items-center"
      animate={{ x: kf.x, opacity: kf.opacity, scale: kf.scale, filter: kf.filter }}
      transition={{
        duration: CONVEYOR_SEC,
        repeat: Infinity,
        ease: "linear",
        times: BELT_TIMES,

        delay: -(j / PER_SIDE) * CONVEYOR_SEC,
      }}
    >
      {img}
    </motion.div>
  );
}

function PremLogoBloom({
  part,
  className,
}: {
  part?: "core" | "outer";
  className?: string;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const reduced = useReducedMotion() ?? false;

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const idx: number[] = [];
    for (let i = 0; i < PREM_LOGO_PATHS.length; i++) {
      const inCore = PREM_DOTS[i].dist < CORE_DIST;
      if (part === "core" && !inCore) continue;
      if (part === "outer" && inCore) continue;
      idx.push(i);
    }
    const m = idx.length;

    const els: SVGPathElement[] = [];
    for (let k = 0; k < m; k++) {
      const dot = PREM_DOTS[idx[k]];
      const el = document.createElementNS(NS, "path");
      el.setAttribute("d", PREM_LOGO_PATHS[idx[k]]);
      el.setAttribute("fill", "currentColor");
      el.style.transformOrigin = `${dot.cx}px ${dot.cy}px`;
      svg.appendChild(el);
      els.push(el);
    }

    if (reduced) return () => els.forEach((e) => e.remove());

    const ox = new Float32Array(m);
    const oy = new Float32Array(m);
    const vx = new Float32Array(m);
    const vy = new Float32Array(m);
    const scale = new Float32Array(m).fill(1);
    const opacity = new Float32Array(m).fill(1);
    const vs = new Float32Array(m);
    const vo = new Float32Array(m);

    let raf = 0;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      for (let k = 0; k < m; k++) {
        const dot = PREM_DOTS[idx[k]];
        const dx = dot.cx - CENTER_X;
        const dy = dot.cy - CENTER_Y;
        const dist = Math.max(0.1, Math.sqrt(dx * dx + dy * dy));
        const normDist = dist / MAX_DIST;

        const pulse = (Math.sin(now * PULSE_SPEED - normDist * 2) + 1) / 2;
        const expandDist = normDist * normDist * MAX_EXPAND * pulse;
        const targetX = (dx / dist) * expandDist;
        const targetY = (dy / dist) * expandDist;

        const dotSpring = SPRING * (1.2 - normDist * 0.5);
        const dotDamp = DAMPING + normDist * 0.05;

        vx[k] += (targetX - ox[k]) * dotSpring;
        vy[k] += (targetY - oy[k]) * dotSpring;
        vx[k] *= dotDamp;
        vy[k] *= dotDamp;
        ox[k] += vx[k];
        oy[k] += vy[k];

        const targetScale =
          1 + (1 - normDist) * 0.08 * pulse - normDist * normDist * 0.12 * pulse;
        vs[k] += (targetScale - scale[k]) * dotSpring;
        vs[k] *= dotDamp;
        scale[k] += vs[k];

        const targetOpacity = 1 - normDist * normDist * 0.25 * pulse;
        vo[k] += (targetOpacity - opacity[k]) * dotSpring;
        vo[k] *= dotDamp;
        opacity[k] += vo[k];

        els[k].style.transform = `translate(${ox[k]}px,${oy[k]}px) scale(${scale[k]})`;
        els[k].style.opacity = String(opacity[k]);
      }
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      els.forEach((e) => e.remove());
    };
  }, [reduced, part]);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 313 324"
      fill="none"
      aria-hidden="true"
      className={className}
    />
  );
}

export default function HeroLogoStage({ className }: { className?: string }) {
  const reduced = useReducedMotion() ?? false;

  return (

    <div className="pointer-events-none absolute inset-0">

      <div className="absolute inset-0 grid place-items-center">
        <div className={`relative size-[175px] text-[#faf9f5] ${className ?? ""}`}>

          <PremLogoBloom part="outer" className="absolute inset-0 size-full" />

          <motion.div
            className="absolute inset-0"
            animate={reduced ? undefined : { rotate: 360 }}
            transition={
              reduced
                ? undefined
                : { duration: CORE_SPIN_SEC, repeat: Infinity, ease: "linear" }
            }
          >
            <PremLogoBloom part="core" className="size-full" />
          </motion.div>
        </div>
      </div>

      <div className="absolute inset-0">
        {ICONS.map((ic, i) => (
          <BeltIcon key={ic.icon} icon={ic.icon} i={i} reduced={reduced} />
        ))}
      </div>
    </div>
  );
}
