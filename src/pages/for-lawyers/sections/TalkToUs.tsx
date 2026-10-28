import { motion } from "motion/react";
import { cn } from "@/utils/styles";
import { TYPE_CARD_TITLE } from "@/components/typography";
import { fadeUp, stagger, VIEWPORT } from "./reveal";
import { GLASS_DARK, GLASS_LIGHT } from "./bits";


export default function TalkToUs() {

  return (
      <section id="enterprise" className="relative scroll-mt-14">
        <main
            className={cn(
                "theme-dark relative flex min-h-[20dvh] flex-col justify-center overflow-hidden bg-cream bg-(image:--dark-card-glow) text-(--text-primary)",
                "px-[clamp(24px,3.4vw,56px)] py-[clamp(104px,14vh,176px)]",
            )}
            aria-labelledby="enterprise-title"
        >
          <div className="relative z-[2] text-ink flex items-center justify-center">
            <motion.div
                variants={stagger}
                initial="hidden"
                whileInView="show"
                viewport={VIEWPORT}
                className="flex flex-wrap items-center gap-x-10 gap-y-6"
            >
              <motion.p
                  variants={fadeUp}
                  className={cn("m-0 font-medium", TYPE_CARD_TITLE)}
              >
                The conversation starts with what your firm actually does.
              </motion.p>
              {/*<motion.a*/}
              {/*    variants={fadeUp}*/}
              {/*    href="mailto:support@premai.io"*/}
              {/*    className={cn(*/}
              {/*        GLASS_DARK,*/}
              {/*    )}*/}
              {/*>*/}
              {/*  Talk to us*/}
              {/*</motion.a>*/}
            </motion.div>
          </div>
        </main>
      </section>
  );
}
