import { useRef } from "react";
import { motion } from "motion/react";
import { Trans, useTranslation } from "react-i18next";
import { cn } from "@/utils/styles";
import { TYPE_CARD_TITLE, TYPE_LEAD } from "@/components/typography";
import { fadeUp, stagger, VIEWPORT, VIEWPORT_GRID } from "./reveal";
import { GLASS_LIGHT, MaskTitle } from "./bits";
import EnterpriseVisualLab from "./EnterpriseVisualLab";
import { GRAIN_URL } from "@/pages/capture/v1kit.tsx";

export default function Enterprise() {
  const { t } = useTranslation("lawyers");
  const titleLines = t("enterprise.title", { returnObjects: true }) as string[];
  const items = t("enterprise.items", { returnObjects: true }) as { title: string; body: string }[];
  const routeAnchors = useRef<Array<HTMLElement | null>>([]);

  return (
    <section id="enterprise" className="relative">
      <main
        className={cn(
          "theme-dark relative flex min-h-[92dvh] flex-col justify-center overflow-hidden bg-[#0c0c0c] bg-(image:--dark-card-glow) text-(--text-primary)",
          "px-[clamp(24px,3.4vw,56px)] py-[clamp(104px,14vh,176px)]",
        )}
        aria-labelledby="enterprise-title"
      >

        <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-[40] rounded-2xl"
            style={{ backgroundImage: GRAIN_URL, backgroundSize: "140px 140px", opacity: 0.55, mixBlendMode: "soft-light" }}
        />
        <EnterpriseVisualLab anchorRefs={routeAnchors} />

        <div className="relative z-[2] text-white">
          <MaskTitle
            id="enterprise-title"
            lines={titleLines}
          />

          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
              className={cn("mt-[clamp(20px,3vh,36px)] mb-0 max-w-[56ch] text-(--text-muted) text-white", TYPE_LEAD)}
          >
            <Trans t={t} i18nKey="enterprise.lead" components={{ fluso: <span className="text-white" /> }} />
          </motion.p>

          <motion.dl
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT_GRID}
            className="m-0 mt-[clamp(36px,5.4vh,64px)] max-w-[880px]"
          >
            {items.map((item, index) => (
              <motion.div
                key={index}
                variants={fadeUp}
                ref={(node) => {
                  routeAnchors.current[index] = node;
                }}
                className={cn(
                  "grid grid-cols-[minmax(220px,1fr)_2fr] gap-x-[clamp(28px,4vw,72px)] gap-y-1.5",
                  "max-md:grid-cols-1",
                )}
              >
                <dt className={cn("py-6 font-medium max-md:pb-0", TYPE_CARD_TITLE)}>
                  {item.title}
                </dt>

                <dd
                  className={cn(
                    "m-0 py-6 text-(--text-muted)",
                    TYPE_LEAD,
                    "max-md:pt-0",
                  )}
                >
                  {item.body}
                </dd>
              </motion.div>
            ))}
          </motion.dl>
        </div>
      </main>
    </section>
  );
}
