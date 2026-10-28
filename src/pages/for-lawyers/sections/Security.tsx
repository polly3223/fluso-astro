import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { cn } from "@/utils/styles";
import { TYPE_CARD_TITLE, TYPE_LABEL, TYPE_LEAD } from "@/components/typography";
import { fadeUp, stagger, VIEWPORT_GRID } from "./reveal";
import { MaskTitle } from "./bits";
import PerimeterField from "./PerimeterField";
import { GRAIN_URL } from "@/pages/capture/v1kit.tsx";

const CYCLE_MS = 2500;

export default function Security() {
  const { t } = useTranslation("lawyers");
  const titleLines = t("security.title", { returnObjects: true }) as string[];
  const fragments = t("security.fragments", { returnObjects: true }) as { title: string; body: string }[];
  const matterTypes = t("security.matterTypes", { returnObjects: true }) as string[];
  const [active, setActive] = useState(0);
  useEffect(() => {
    const id = window.setInterval(
      () => setActive((i) => (i + 1) % matterTypes.length),
      CYCLE_MS,
    );
    return () => window.clearInterval(id);
  }, []);

  return (
    <section id="security" className="relative">
      <main
        className={cn(
          "theme-dark relative flex min-h-[88dvh] flex-col justify-center overflow-hidden bg-[#0c0c0c] bg-(image:--dark-card-glow)  text-(--text-primary)",
          "px-[clamp(24px,3.4vw,56px)] py-[clamp(96px,13vh,160px)]",
        )}
        aria-labelledby="security-title"
      >

        <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-[40] rounded-2xl"
            style={{ backgroundImage: GRAIN_URL, backgroundSize: "140px 140px", opacity: 0.55, mixBlendMode: "soft-light" }}
        />
        <PerimeterField />

        <div className="relative z-[1]">
        <MaskTitle
          id="security-title"
          lines={titleLines}
        />

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT_GRID}
          className="mt-[clamp(40px,6vh,72px)] flex max-w-[600px] flex-col gap-[clamp(32px,4.8vh,56px)]"
        >
          {fragments.map((f, i) => (
            <motion.div key={i} variants={fadeUp}>
              <h3 className={cn("m-0 font-medium", TYPE_CARD_TITLE)}>
                {f.title}
              </h3>
              <p className={cn("mt-3 mb-0 max-w-[46ch] text-(--text-muted)", TYPE_LEAD)}>
                {f.body}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT_GRID}
          className="mt-[clamp(44px,7vh,88px)] flex items-center gap-5 max-md:flex-col max-md:items-start max-md:gap-3"
        >
          <span className={cn("font-mono font-medium uppercase text-(--text-muted)", TYPE_LABEL)}>
            {t("security.matterTypesLabel")}
          </span>
          <span
            className={cn(
              "relative inline-flex h-[52px] min-w-[340px] items-center overflow-hidden",
              "rounded-[5px] border border-blue-300/28 px-6",
            )}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={matterTypes[active]}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="whitespace-nowrap text-[18px] font-medium tracking-[-0.005em]"
              >
                {matterTypes[active]}
              </motion.span>
            </AnimatePresence>
          </span>
        </motion.div>
        </div>
      </main>
    </section>
  );
}
