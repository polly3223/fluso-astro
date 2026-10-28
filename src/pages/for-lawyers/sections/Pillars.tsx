import { motion } from "motion/react";
import { Trans, useTranslation } from "react-i18next";
import { cn } from "@/utils/styles";
import { TYPE_FEATURE_TITLE, TYPE_LEAD } from "@/components/typography";
import { lineUp, stagger, VIEWPORT, VIEWPORT_GRID, fadeUp } from "./reveal";
import EngineFlow from "./EngineFlow";
import { GRAIN_URL } from "@/pages/capture/v1kit.tsx";

const KEY = "font-serif text-[1.06em] font-normal italic tracking-[0.01em]";

function InkWash({ text, alignRight = false }: { text: string; alignRight?: boolean }) {
  return (
    <motion.p
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.014, delayChildren: 0.35 } },
      }}
      className={cn(
        "mt-5 mb-0 max-w-[54ch] text-(--text-muted)",
        TYPE_LEAD,
        alignRight && "ml-auto text-right",
      )}
    >
      {text.split(" ").map((w, i) => (
        <motion.span
          key={`${w}-${i}`}
          variants={{
            hidden: { opacity: 0.14 },
            show: { opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
          }}
        >
          {w}{" "}
        </motion.span>
      ))}
    </motion.p>
  );
}

export default function Pillars() {
  const { t } = useTranslation("lawyers");
  const pillars = t("pillars", { returnObjects: true }) as { title: string; body: string }[];

  return (
    <section id="pillars" className="relative scroll-mt-14">
      <main
        className={cn(
          "relative flex min-h-[80dvh] flex-col justify-center overflow-hidden text-(--text-primary)",
          "theme-dark bg-[#0c0c0c] bg-(image:--dark-card-glow)",
          "px-[clamp(24px,3.4vw,56px)] py-[clamp(140px,17vh,220px)] max-md:min-h-0 max-md:py-[clamp(72px,11vh,110px)]",
        )}
      >
          <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-[40] rounded-2xl"
              style={{ backgroundImage: GRAIN_URL, backgroundSize: "140px 140px", opacity: 0.55, mixBlendMode: "soft-light" }}
          />
        <div
          className={cn(
            "grid grid-cols-2 gap-x-[clamp(40px,6vw,110px)] gap-y-12",
            "max-md:grid-cols-1",
          )}
        >
          {pillars.map((p, index) => {
            const last = index === pillars.length - 1;
            return (
              <motion.div
                key={index}
                variants={stagger}
                initial="hidden"
                whileInView="show"
                viewport={VIEWPORT}
                className={cn(last && "text-right")}
              >
                <h2
                  className={cn(
                    "m-0 font-normal",
                    last ? "-mr-[0.03em]" : "-ml-[0.03em]",
                    TYPE_FEATURE_TITLE,
                  )}
                >
                  <span className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
                    <motion.span variants={lineUp} className="block will-change-transform">
                      <Trans t={t} i18nKey={`pillars.${index}.title` as never} components={{ em: <em className={KEY} /> }} />
                    </motion.span>
                  </span>
                </h2>
                <InkWash text={p.body} alignRight={last} />
              </motion.div>
            );
          })}
        </div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT_GRID}
          className="mt-[clamp(140px,17vh,220px)] max-md:mt-[clamp(40px,8vh,72px)]"
        >
          <EngineFlow dark />
        </motion.div>

      </main>
    </section>
  );
}
