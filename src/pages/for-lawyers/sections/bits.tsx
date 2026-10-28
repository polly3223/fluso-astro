import { motion } from "motion/react";
import { cn } from "@/utils/styles";
import { TYPE_CTA, TYPE_SECTION_TITLE } from "@/components/typography";
import { lineUp, stagger, VIEWPORT } from "./reveal";

export const GLASS_LIGHT = cn(
  "inline-flex items-center px-[clamp(26px,2vw+16px,40px)] py-[clamp(16px,1.4vh+7px,21px)]",
  TYPE_CTA,
  "font-medium no-underline",
  "rounded-full border border-white/80 bg-[#f2f1ed] text-[#0c0c0c]",
  "shadow-[0_10px_30px_rgba(0,0,0,0.16)]",
  "transition-[background-color,transform,box-shadow] duration-[220ms] ease-[ease]",
  "hover:bg-white hover:shadow-[0_12px_34px_rgba(0,0,0,0.2)] active:scale-[0.98]",
);
export const GLASS_DARK = cn(
  "rounded-[4px] border border-ink/20 bg-ink/6 text-ink",
  "backdrop-blur-[8px] backdrop-saturate-150",
  "shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]",
  "transition-[backdrop-filter] duration-[260ms] ease-[ease]",
  "hover:backdrop-blur-[26px]",
);

export function MaskTitle({
  lines,
  className,
  id,
}: {
  lines: string[];
  className?: string;
  id?: string;
}) {
  return (
    <motion.h2
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
        id={id}
        className={cn(
          "m-0 -ml-[0.05em] font-normal",
          TYPE_SECTION_TITLE,
          className,
        )}
    >
      {lines.map((line) => (
        <span key={line} className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
          <motion.span variants={lineUp} className="block will-change-transform">
            {line}
          </motion.span>
        </span>
      ))}
    </motion.h2>
  );
}
