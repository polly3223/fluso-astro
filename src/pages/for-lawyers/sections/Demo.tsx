import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { cn } from "@/utils/styles";
import { fadeUp, stagger, VIEWPORT } from "./reveal";
import { GLASS_LIGHT, MaskTitle } from "./bits";

export default function Demo() {
  const { t } = useTranslation("lawyers");
  const titleLines = t("demo.title", { returnObjects: true }) as string[];
  return (
    <section
      id="demo"
      className="relative snap-start border-t border-blue-300/20 [scroll-snap-stop:always]"
    >
      <main
        className={cn(
          "theme-dark relative flex h-dvh flex-col items-center justify-center overflow-hidden bg-[#0c0c0c] text-center text-(--text-primary)",
          "px-[clamp(24px,3.4vw,56px)] py-[clamp(104px,15vh,180px)]",
        )}
        aria-labelledby="demo-title"
      >

        <img
            className="absolute inset-0 z-0 size-full object-cover object-center brightness-90"
            src="/assets/video/demo-meeting.jpg"
            alt=""
            aria-hidden="true"
        />

        {/* cool blue grade over the photo (brand blue spectrum) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 bg-[#3c586a] opacity-45 mix-blend-color"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-[#1c2e3c]/35 to-[#0c0c0c]/45"
        />

        {/* fade the photo into the dark section below for a smooth transition */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[clamp(120px,28vh,300px)] bg-gradient-to-b from-transparent to-[#0c0c0c]"
        />

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="relative z-[2] flex flex-col items-center"
        >

          <MaskTitle
            id="demo-title"
            lines={titleLines}
            className="text-center text-paper"
          />
          <motion.p
            variants={fadeUp}
            className="mt-[clamp(14px,2vh,22px)] text-xl max-w-[42ch] text-balance text-white"
          >
            {t("demo.lead")}
          </motion.p>
          <motion.div variants={fadeUp} className="mt-[clamp(28px,4.4vh,52px)]">
            <a
              href="https://form.typeform.com/to/vZnBDhzs"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                GLASS_LIGHT,
              )}
            >
              {t("demo.cta")}
            </a>
          </motion.div>
        </motion.div>
      </main>
    </section>
  );
}
