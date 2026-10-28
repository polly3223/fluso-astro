import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/utils/styles";
import { TYPE_BODY, TYPE_CARD_TITLE, TYPE_LEAD } from "@/components/typography";
import { fadeUp, stagger, VIEWPORT } from "./reveal";
import { MaskTitle } from "./bits";

// Stable keys (decoupled from the display labels, which come from i18n).
const AREA_KEYS = [
  "litigation",
  "contracts",
  "ma",
  "dueDiligence",
  "ip",
  "employment",
  "privacyData",
  "regulatory",
  "crossBorder",
  "ventureCapital",
  "criminal",
  "tax",
] as const;

type AreaKey = (typeof AREA_KEYS)[number];

const PRACTICE_SLIDES: { image: string; areas: readonly AreaKey[]; position: string }[] = [
  {
    image: "assets/legal/practice-areas/litigation.jpg",
    areas: ["litigation", "criminal"],
    position: "center",
  },
  {
    image: "assets/legal/practice-areas/contracts-docs.jpg",
    areas: ["contracts", "employment"],
    position: "right center",
  },
  {
    image: "assets/legal/practice-areas/transactions.jpg",
    areas: ["ma", "ventureCapital"],
    position: "center",
  },
  {
    image: "assets/legal/practice-areas/diligence.jpg",
    areas: ["dueDiligence", "tax"],
    position: "center 42%",
  },
  {
    image: "assets/legal/practice-areas/advisory.jpg",
    areas: ["ip", "privacyData"],
    position: "center",
  },
  {
    image: "assets/legal/practice-areas/regulatory.jpg",
    areas: ["regulatory", "crossBorder"],
    position: "center",
  },
];

function PracticeCarousel({
  active,
  onChange,
}: {
  active: number;
  onChange: (index: number) => void;
}) {
  const { t } = useTranslation("lawyers");
  const reduced = useReducedMotion() ?? false;

  // On phones the row is too narrow for 6 strips at desktop widths — the active
  // strip ends up too thin to show its label. Give the active strip a much
  // bigger share and turn the others into thin slats.
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <motion.div variants={fadeUp} className="min-w-0">
      <div
        role="group"
        aria-label={t("practiceAreas.carouselLabel")}
        className="flex h-[clamp(430px,62vh,680px)] gap-2.5 overflow-hidden max-md:h-[480px]"
      >
        {PRACTICE_SLIDES.map((slide, index) => {
          const isActive = index === active;
          return (
            <motion.button
              key={slide.image}
              type="button"
              onClick={() => onChange(index)}
              animate={{
                // mobile: flex-basis 0 so flexGrow alone splits the row — the
                // active strip takes ~60% (enough for its label), the rest are
                // thin slats. desktop: keep the original feel.
                flexGrow: isActive ? (isMobile ? 6 : 4.2) : isMobile ? 0.8 : 0.72,
                flexBasis: isMobile ? 0 : "auto",
              }}
              transition={
                reduced
                  ? { duration: 0 }
                  : { duration: 0.9, ease: [0.22, 1, 0.36, 1] }
              }
              aria-label={t("practiceAreas.showAriaLabel", {
                areas: slide.areas
                  .map((key) => t(`practiceAreas.areas.${key}`))
                  .join(` ${t("practiceAreas.and")} `),
              })}
              aria-pressed={isActive}
              className={cn(
                "group relative min-w-[54px] cursor-pointer overflow-hidden rounded-[4px] bg-ink text-left",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
                "max-md:min-w-[20px]",
              )}
            >
              <motion.img
                src={slide.image}
                alt=""
                animate={{ scale: isActive ? 1 : 1.08 }}
                transition={
                  reduced
                    ? { duration: 0 }
                    : { duration: 1.1, ease: [0.22, 1, 0.36, 1] }
                }
                className="absolute inset-0 size-full object-cover"
                style={{ objectPosition: slide.position }}
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/65 via-black/5 to-black/15" />
              <motion.div
                animate={{ opacity: isActive ? 1 : 0 }}
                transition={{ duration: reduced ? 0 : 0.35 }}
                className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-[clamp(18px,2vw,28px)] max-md:p-3 text-white"
              >
                <div className="min-w-0">
                  <div className={TYPE_CARD_TITLE}>
                    {slide.areas.map((key) => (
                      <span key={key} className="block whitespace-nowrap font-serif italic">
                        {t(`practiceAreas.areas.${key}`)}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

const CYCLE_MS = 5000;

export default function PracticeAreas() {
  const { t } = useTranslation("lawyers");
  const titleLines = t("practiceAreas.title", { returnObjects: true }) as string[];
  // Open the watch slide (IP / Privacy & data) by default.
  const [active, setActive] = useState(4);

  // Auto-advance through the slides every 5s; any manual pick resets the timer.
  useEffect(() => {
    const id = window.setTimeout(
      () => setActive((i) => (i + 1) % PRACTICE_SLIDES.length),
      CYCLE_MS,
    );
    return () => window.clearTimeout(id);
  }, [active]);

  return (
    <section id="practice-areas" className="relative scroll-mt-14">
      <main
        className={cn(
          "theme-light relative flex min-h-[92dvh] flex-col justify-center overflow-hidden bg-cream text-(--text-primary)",
          "px-[clamp(24px,3.4vw,56px)] pb-[clamp(96px,13vh,160px)]",
        )}
        aria-labelledby="practice-areas-title"
      >
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className={cn(
            "grid grid-cols-[minmax(0,1.32fr)_minmax(360px,0.68fr)] items-start gap-[clamp(48px,7vw,120px)]",
            "max-lg:grid-cols-1",
          )}
        >
          <PracticeCarousel active={active} onChange={setActive} />

          <div className="lg:sticky lg:top-32">
            <MaskTitle
              id="practice-areas-title"
              lines={titleLines}
              className="max-w-[18ch]"
            />

            <motion.p
              variants={fadeUp}
                className={cn("mt-[clamp(28px,4vh,48px)] mb-0 max-w-[50ch] text-(--text-muted)", TYPE_LEAD)}
            >
              {t("practiceAreas.lead")}
            </motion.p>

          </div>
        </motion.div>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
            className={cn("mt-[clamp(44px,6vh,76px)] mb-0 max-w-[76ch] leading-[1.9]", TYPE_BODY)}
        >
          {AREA_KEYS.map((key, i) => {
            const slideIndex = PRACTICE_SLIDES.findIndex((slide) =>
              slide.areas.includes(key),
            );
            const isActive = slideIndex === active;
            return (
              <span key={key} className="whitespace-nowrap">
                <button
                  type="button"
                  onClick={() => setActive(slideIndex)}
                  className={cn(
                    "inline cursor-pointer border-0 bg-transparent p-0 font-sans text-[length:inherit] text-xl font-medium tracking-[-0.01em]",
                    "transition-colors duration-300",
                    isActive ? "text-ink" : "text-ink/40 hover:text-ink/70",
                  )}
                >
                  {t(`practiceAreas.areas.${key}`)}
                </button>
                {i < AREA_KEYS.length - 1 && (
                  <span aria-hidden="true" className="mx-2.5 text-ink/25">
                    ·
                  </span>
                )}
              </span>
            );
          })}
        </motion.p>

      </main>
    </section>
  );
}
