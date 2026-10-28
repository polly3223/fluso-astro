import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Trans, useTranslation } from "react-i18next";
import { cn } from "@/utils/styles";
import { TYPE_FEATURE_TITLE, TYPE_LEAD } from "@/components/typography";
import { fadeUp, VIEWPORT } from "./reveal";
import { MaskTitle } from "./bits";

const KEY = "font-serif text-[1.06em] font-normal italic tracking-[0.01em]";

// right-column copy, 20% larger than the standard lead size
const LEAD_LG =
  "[font-size:calc(var(--type-lead-size)*1.2)] [line-height:var(--type-lead-leading)] [letter-spacing:var(--type-lead-tracking)]";

const CYCLE_MS = 4000;

export default function Practice() {
  const { t } = useTranslation("lawyers");
  const features = t("practice.features", { returnObjects: true }) as { title: string; body: string }[];
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = window.setTimeout(
      () => setActive((i) => (i + 1) % features.length),
      CYCLE_MS,
    );
    return () => window.clearTimeout(id);
  }, [active]);

  return (
    <section id="practice" className="relative">

      <main
        className={cn(
          "relative flex min-h-[78dvh] flex-col justify-center overflow-hidden bg-cream bg-(image:--dark-card-glow) text-[#0c0c0c]",
          "px-[clamp(24px,3.4vw,56px)] py-[clamp(96px,13vh,160px)]",
        )}
        aria-labelledby="practice-title"
      >
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className={cn(
            "grid grid-cols-2 items-center gap-x-[clamp(48px,7vw,128px)] text-inc",
            "max-lg:grid-cols-1 max-lg:gap-y-14",
          )}
        >
          {/* left half — heading + feature list, centred on its half */}
          <div className="flex flex-col items-center justify-center text-center">
            <MaskTitle id="practice-title" lines={[t("practice.title")]} className="text-center" />

            <div className="mt-[clamp(40px,6vh,72px)] flex flex-col items-center gap-[clamp(8px,1.4vh,18px)]">
              {features.map((f, i) => {
                const d = Math.abs(i - active);
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActive(i)}
                    aria-pressed={i === active}
                    className={cn(
                      "m-0 cursor-pointer border-0 bg-transparent p-0 text-center font-sans text-inherit",
                      "font-normal",
                      TYPE_FEATURE_TITLE,
                      "transition-opacity duration-[400ms] ease-[ease]",
                      d === 0 ? "opacity-100" : d === 1 ? "opacity-35" : "opacity-15",
                      i !== active && "hover:opacity-60",
                    )}
                  >
                    <Trans t={t} i18nKey={`practice.features.${i}.title` as never} components={{ em: <em className={KEY} /> }} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* right half — body copy, centred on its half */}
          <div className="flex flex-col items-center justify-center text-center max-lg:mt-2">
            <div className="relative flex min-h-[200px] items-center">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <p className={cn("m-0 mx-auto max-w-[40ch] text-pretty text-(--text-muted)", LEAD_LG)}>
                    {features[active].body}
                  </p>

                  <motion.span
                    aria-hidden="true"
                    className="mx-auto mt-6 block h-px w-[clamp(120px,18vw,220px)] origin-center bg-blue-300/60"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: [0, 1, 0] }}
                    transition={{
                      duration: (CYCLE_MS - 400) / 1000,
                      times: [0, 0.13, 1],
                      ease: ["easeOut", "linear"],
                    }}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </main>
    </section>
  );
}
