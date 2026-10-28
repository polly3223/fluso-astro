import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { cn } from "@/utils/styles";
import { TYPE_CARD_TITLE } from "@/components/typography";
import { MaskTitle } from "./bits";

// Body copy, 20% larger than the standard lead — matches the Practice section.
const LEAD_LG =
  "[font-size:calc(var(--type-lead-size)*1.2)] [line-height:var(--type-lead-leading)] [letter-spacing:var(--type-lead-tracking)]";

// Absolute positions for the scattered terms — paired with i18n copy by index.
const POSITIONS = [
  "left-[3%] top-[8%] max-w-[23ch]",
  "left-[39%] top-[25%] max-w-[18ch]",
  "left-[7%] top-[44%] max-w-[22ch]",
  "left-[46%] top-[57%] max-w-[18ch]",
  "left-[4%] top-[77%] max-w-[20ch]",
  "left-[43%] top-[85%] max-w-[19ch]",
];

const CYCLE_MS = 4000;

export default function UseCases() {
  const { t } = useTranslation("lawyers");
  const titleLines = t("useCases.title", { returnObjects: true }) as string[];
  const items = (t("useCases.items", { returnObjects: true }) as { term: string; line: string }[]).map(
    (it, i) => ({ ...it, position: POSITIONS[i] }),
  );
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = window.setTimeout(
      () => setActive((i) => (i + 1) % items.length),
      CYCLE_MS,
    );
    return () => window.clearTimeout(id);
  }, [active]);

  const current = items[active];

  return (
    <section id="use-cases" className="relative">
      <main
        className={cn(
          "theme-light relative flex min-h-[78dvh] flex-col justify-center overflow-hidden bg-cream text-(--text-primary)",
          "px-[clamp(24px,3.4vw,56px)] py-[clamp(96px,13vh,160px)]",
        )}
        aria-labelledby="use-cases-title"
      >
        <div
          className={cn(
            "grid min-h-[clamp(440px,52vh,580px)] grid-cols-[minmax(0,1.45fr)_minmax(360px,0.7fr)] gap-[clamp(48px,7vw,120px)]",
            "max-lg:grid-cols-1 max-lg:gap-14",
          )}
        >
          <div className="relative min-h-[440px] max-lg:order-2 max-lg:min-h-0">
            <div className="absolute inset-0 max-lg:relative max-lg:grid max-lg:grid-cols-2 max-lg:gap-x-8 max-lg:gap-y-1 max-md:grid-cols-1">
              {items.map((useCase, index) => {
                const isActive = index === active;
                return (
                  <motion.button
                    key={index}
                    type="button"
                    onClick={() => setActive(index)}
                    animate={{
                      opacity: isActive ? 1 : 0.24,
                      filter: isActive ? "blur(0px)" : "blur(1.4px)",
                      scale: isActive ? 1 : 0.98,
                    }}
                    whileHover={{ opacity: isActive ? 1 : 0.55, filter: "blur(0px)" }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    className={cn(
                      "absolute cursor-pointer border-0 bg-transparent p-0 text-left font-sans text-ink",
                        TYPE_CARD_TITLE,
                        "font-medium",
                      "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500",
                      useCase.position,
                      "max-lg:relative max-lg:top-auto max-lg:left-auto max-lg:max-w-none max-lg:border-t max-lg:border-ink/12 max-lg:py-5",
                    )}
                  >
                    {useCase.term}
                  </motion.button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col justify-center self-stretch max-lg:order-1">
            <MaskTitle
              id="use-cases-title"
              lines={titleLines}
              className="max-w-[13ch]"
            />

            <div className="mt-[clamp(24px,4vh,44px)] min-h-[112px] border-t border-ink/14 pt-5">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -8, filter: "blur(3px)" }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className={cn("m-0 max-w-[46ch] text-(--text-muted)", LEAD_LG)}>
                    {current.line}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-auto flex items-center gap-2 pt-[clamp(16px,3vh,28px)]">
              {items.map((useCase, index) => (
                <button
                  key={index}
                  type="button"
                  aria-label={useCase.term}
                  onClick={() => setActive(index)}
                  className={cn(
                    "h-px cursor-pointer border-0 p-0 transition-[width,background-color] duration-500",
                    index === active ? "w-12 bg-blue-500" : "w-7 bg-ink/20",
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </section>
  );
}
