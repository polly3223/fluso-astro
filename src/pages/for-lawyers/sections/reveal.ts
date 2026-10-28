import type { Variants } from "motion/react";

export const EASE = [0.22, 1, 0.36, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

export const fadeUpSm: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

export const lineUp: Variants = {
  hidden: { y: "112%" },
  show: { y: 0, transition: { duration: 0.85, ease: EASE } },
};

export const ruleX: Variants = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 0.9, ease: EASE } },
};

export const VIEWPORT = { once: true, amount: 0.3 } as const;
export const VIEWPORT_GRID = { once: true, amount: 0.2 } as const;
