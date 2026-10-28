import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";

// Mobile-only cream backdrop that mirrors the hero card: it starts inset +
// rounded and grows to full-bleed + square as the section scrolls in. Drop it
// in as the first child of a (relative, dark-bg) section and make that
// section's content layer transparent on mobile so this shows through.
//
// The OUTER div is the scroll target — it has no margin, so its rect is stable
// and tracking never feeds back on itself. The INNER div carries the animated
// margin/radius.
export function MobileExpandBg() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start start"],
  });
  const t = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.45,
  });
  // Collapse the inset hard and early — the card snaps to full-bleed within the
  // first ~30% of entry (top still well down the viewport), so by the time it's
  // properly on screen it already reads as a full-bleed surface.
  const margin = useTransform(t, [0, 0.3], [16, 0], { clamp: true });
  const radius = useTransform(t, [0, 0.3], [28, 0], { clamp: true });

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 lg:hidden"
    >
      <motion.div
        className="absolute inset-0 overflow-hidden bg-cream"
        style={
          reduced
            ? { margin: 16, borderRadius: 28 }
            : { margin, borderRadius: radius }
        }
      />
    </div>
  );
}
