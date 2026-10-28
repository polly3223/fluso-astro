import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { cn } from "@/utils/styles";

const EASE_SPRING = { stiffness: 90, damping: 24, mass: 0.45 } as const;
const FRAME = 16;
const RADIUS = 24;

export default function BloomCard({
  id,
  hero = false,
  className,
  children,
}: {
  id?: string;
  hero?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion() ?? false;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: hero ? ["start start", "end start"] : ["start 0.6", "start 0.15"],
  });
  const t = useSpring(scrollYProgress, EASE_SPRING);
  const range: [number, number] = [0, hero ? 0.55 : 1];
  const margin = useTransform(t, range, [0, -FRAME], { clamp: true });
  const radius = useTransform(t, range, [RADIUS, 0], { clamp: true });

  return (
    <section ref={ref} id={id} className={cn("relative w-full", className)}>

      <motion.div
        style={reduced ? undefined : { marginLeft: margin, marginRight: margin, borderRadius: radius }}
        className={cn(
          "relative flex h-full flex-col overflow-hidden",
          reduced && "rounded-[clamp(16px,1.4vw,24px)]",
        )}
      >
        {children}
      </motion.div>
    </section>
  );
}
