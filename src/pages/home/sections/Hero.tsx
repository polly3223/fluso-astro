import { lazy, Suspense, useEffect } from "react";
import { motion, stagger, useAnimate, useReducedMotion, type Variants } from "motion/react";
import { Trans, useTranslation } from "react-i18next";
import { cn } from "@/utils/styles";
import { TYPE_BODY_SMALL, TYPE_CTA, TYPE_DISPLAY, TYPE_LEAD } from "@/components/typography";
import { useMorphingShape } from "@/hooks/useMorphingShape";
import HeroAppMockup from "./HeroAppMockup";
import HeroPhoneMockup from "./HeroPhoneMockup";

// TEMPORARY dev-only hero font picker. import.meta.env.DEV folds to false in
// prod, so the lazy import is dead-code-eliminated and nothing ships.
const HeroFontPicker = import.meta.env.DEV
  ? lazy(() => import("@/dev/HeroFontPicker"))
  : null;

import gdriveLogo from "../../../../assets/connectors/google-drive.svg?url";
import gmailLogo from "../../../../assets/connectors/gmail.svg?url";
import outlookLogo from "../../../../assets/connectors/outlook.svg?url";
import gcalLogo from "../../../../assets/connectors/google-calendar.svg?url";
import slackLogo from "../../../../assets/connectors/slack.svg?url";
import teamsLogo from "../../../../assets/connectors/microsoft-teams.svg?url";
import notionLogo from "../../../../assets/connectors/notion.svg?url";
import dropboxLogo from "../../../../assets/connectors/dropbox.svg?url";
import githubLogo from "../../../../assets/connectors/github.svg?url";
import linearLogo from "../../../../assets/connectors/linear.svg?url";

const EASE = [0.22, 1, 0.36, 1] as const;

const WORKS_WITH: { src: string; label: string }[] = [
  { src: gdriveLogo, label: "Google Drive" },
  { src: gmailLogo, label: "Gmail" },
  { src: outlookLogo, label: "Microsoft Outlook" },
  { src: gcalLogo, label: "Google Calendar" },
  { src: slackLogo, label: "Slack" },
  { src: teamsLogo, label: "Microsoft Teams" },
  { src: notionLogo, label: "Notion" },
  { src: dropboxLogo, label: "Dropbox" },
  { src: githubLogo, label: "GitHub" },
  { src: linearLogo, label: "Linear" },
];


const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};
const rise: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0">
    <motion.circle
      cx="8"
      cy="8"
      r="7"
      stroke="currentColor"
      strokeWidth="1.25"
      opacity="0.4"
      fill="none"
      variants={{
        hidden: { pathLength: 0, opacity: 0 },
        show: { pathLength: 1, opacity: 0.4, transition: { duration: 0.75, ease: EASE } },
      }}
    />
    <motion.path
      d="M4.8 8.2 7 10.4 11.2 6.1"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      variants={{
        hidden: { pathLength: 0 },
        show: { pathLength: 1, transition: { duration: 0.5, ease: EASE, delay: 0.45 } },
      }}
    />
  </svg>
);

const checksContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.45, delayChildren: 1.1 } },
};
const checkItem: Variants = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0, transition: { duration: 0.85, ease: EASE } },
};

export default function Hero() {
  const { t } = useTranslation("home");
  const checks = t("hero.checks", { returnObjects: true }) as string[];
  const ctaShape = useMorphingShape<HTMLAnchorElement>({
    radiusMin: 22,
    radiusMax: 32,
  });
  const reduced = useReducedMotion() ?? false;

  const [worksWithRef, animateWorksWith] = useAnimate();
  useEffect(() => {
    if (reduced) return;
    const run = () => {
      animateWorksWith(
        ".ww-logo",
        {
          filter: ["grayscale(1)", "grayscale(0)", "grayscale(0)", "grayscale(1)"],
          opacity: [0.65, 1, 1, 0.65],
          y: [0, -4, -4, 0],
          scale: [1, 1.14, 1.14, 1],
        },
        { duration: 1.1, ease: "easeInOut", delay: stagger(0.09) },
      );
    };
    const first = window.setTimeout(run, 2800);
    const every = window.setInterval(run, 60_000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(every);
    };
  }, [reduced, animateWorksWith]);

  return (
    <section id="hero" className="max-md:h-auto relative h-dvh overflow-hidden">
      {HeroFontPicker && (
        <Suspense fallback={null}>
          <HeroFontPicker />
        </Suspense>
      )}
      <div
        aria-hidden="true"
        className="absolute inset-0 overflow-hidden bg-cream"
        style={{ margin: 16, borderRadius: 28 }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 90% at 88% 0%, rgba(12,12,12,0.05), transparent 55%)",
          }}
        />
      </div>

      <main
        className={cn(
          "relative z-[1] flex h-full w-full flex-col overflow-hidden theme-light text-(--text-primary)",
          "px-(--card-px-x) max-md:px-(--card-px-x-mobile) pb-[clamp(40px,3.8vh,40px)] pt-[calc(var(--nav-h)+clamp(30px,5vh,68px))]",
        )}
      >

          <div
            className={cn(
              "relative z-[1] grid flex-[1_1_auto] items-center gap-[clamp(24px,4vw,64px)]",
              "grid-cols-[minmax(320px,0.82fr)_minmax(0,1.22fr)]",
              "max-lg:grid-cols-1 max-lg:gap-9",
            )}
          >
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="hero-copy flex min-w-0 flex-col items-start"
            >
              <motion.div
                variants={rise}
                className={cn(
                  "max-md:mt-4 mb-[clamp(18px,2.6vh,30px)] inline-flex items-center gap-1.5",
                  "rounded-full border border-(--border-soft) px-3.5 py-[7px]",
                  "bg-white/55 backdrop-blur-[6px]",
                  TYPE_BODY_SMALL,
                  "md:font-medium max-md:gap-2 max-md:text-xs max-md:whitespace-nowrap max-md:w-full",
                )}
              >
                <svg className="block shrink-0" viewBox="0 0 32 32" width="14" height="14" aria-hidden="true" focusable="false">
                  <rect width="32" height="32" rx="4" fill="#DA291C" />
                  <rect x="13" y="6" width="6" height="20" fill="#fff" />
                  <rect x="6" y="13" width="20" height="6" fill="#fff" />
                </svg>{" "}
                {t("hero.badge")}
              </motion.div>

              <motion.h1
                  variants={rise}
                  className={cn(
                    "m-0 -ml-[0.04em] font-medium",
                    TYPE_DISPLAY,
                  )}
              >
                <Trans t={t} i18nKey="hero.title" components={{ br: <br /> }} />
              </motion.h1>

              <motion.p
                variants={rise}
                  className={cn(
                    "mt-[clamp(16px,2.2vh,26px)] max-w-[40ch]",
                    "m-0 mt-6 max-w-[40ch] font-normal text-(--text-muted)",
                    TYPE_LEAD,
                  )}
              >
                {t("hero.lead")}
              </motion.p>

              <motion.div
                variants={rise}
                className="mt-[clamp(24px,3.4vh,40px)] flex w-fit flex-col items-center gap-[clamp(10px,1.4vh,16px)] max-md:w-full"
              >
                <div className="flex flex-wrap items-stretch gap-3 max-md:w-full max-md:flex-col">
                <motion.a
                  // ref={ctaShape.ref}
                  style={{ clipPath: ctaShape.clipPath }}
                  className={cn(
                    "group/cta inline-flex cursor-pointer items-center gap-2.5 no-underline",
                    "bg-ink px-[clamp(26px,2vw+16px,40px)] py-[clamp(16px,1.4vh+7px,21px)] text-bone",
                    TYPE_CTA,
                    "font-medium",

                    "transition-[transform,filter,background] duration-[220ms] ease-[ease]",
                    "hover:bg-[#1a1a1a]",
                    "max-md:w-full max-md:justify-center",
                  )}
                  data-platform-cta
                  href="https://fluso-releases.s3.amazonaws.com/desktop/prod/Fluso-latest-arm64.dmg"
                  download
                >
                  <svg
                    className="-mt-px transition-transform duration-[220ms] ease-[ease] group-hover/cta:scale-[1.06]"
                    data-platform-icon
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.05.28.05.43zm4.565 15.71c-.03.07-.463 1.58-1.518 3.12-.945 1.34-1.94 2.71-3.43 2.71-1.517 0-1.9-.88-3.63-.88-1.698 0-2.302.91-3.67.91-1.377 0-2.332-1.26-3.428-2.8-1.287-1.82-2.323-4.63-2.323-7.28 0-4.28 2.797-6.55 5.552-6.55 1.448 0 2.675.95 3.6.95.865 0 2.222-1.01 3.902-1.01.613 0 2.886.06 4.374 2.19-.13.09-2.383 1.37-2.383 4.19 0 3.26 2.854 4.42 2.955 4.45z" />
                  </svg>
                  <span className="whitespace-nowrap" data-platform-label>{t("hero.downloadMac")}</span>
                </motion.a>

                <a
                  className={cn(
                    "group/ios inline-flex cursor-pointer items-center gap-2.5 no-underline",
                    "rounded-[22px] border border-ink/20 bg-transparent text-ink",
                    "px-[clamp(24px,2vw+14px,38px)] py-[clamp(15px,1.4vh+6px,20px)]",
                    TYPE_CTA,
                    "font-medium",
                    "transition-[border-color,background,transform] duration-[220ms] ease-[ease]",
                    "hover:border-ink/50 hover:bg-ink/[0.04]",
                    "max-md:w-full max-md:justify-center",
                  )}
                  href="https://apps.apple.com/us/app/fluso/id6780937477"
                  target="_blank"
                  rel="noreferrer"
                >
                  <svg
                    className="-mt-px transition-transform duration-[220ms] ease-[ease] group-hover/ios:scale-[1.06]"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <rect x="7" y="2.6" width="10" height="18.8" rx="2.8" strokeWidth="1.6" />
                    <path d="M10.6 18.4h2.8" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                  <span className="whitespace-nowrap">{t("hero.downloadIphone")}</span>
                </a>
                </div>

                <a
                  className={cn(
                    "group/alt inline-flex items-center gap-1 no-underline",
                    "border-b border-transparent font-normal text-ink/55",
                    TYPE_BODY_SMALL,
                    "transition-[color,border-color] duration-[180ms] ease-[ease]",
                    "hover:border-b-ink/40 hover:text-ink/85",
                  )}
                  href="/download"
                >
                  {t("hero.otherPlatforms")}{" "}
                  <span aria-hidden="true" className="inline-block transition-transform duration-[180ms] ease-[ease] group-hover/alt:translate-x-0.5">
                    →
                  </span>
                </a>
              </motion.div>

            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 36 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
              className="relative flex min-w-0 items-center justify-center max-lg:hidden"
              style={{ perspective: 1400 }}
            >

              <div
                aria-hidden="true"
                className="absolute inset-x-[8%] bottom-[4%] h-[24%] rounded-xl bg-ink/25 blur-3xl"
              />
              <div className="relative w-full lg:translate-x-[clamp(4px,1vw,16px)] [filter:drop-shadow(0_40px_80px_rgba(12,12,12,0.32))_drop-shadow(0_8px_20px_rgba(12,12,12,0.16))]">
                <div className="relative mx-auto w-full max-w-[840px]">
                  <HeroAppMockup />
                  {/* iPhone app, leaning against the desktop mockup's corner */}
                  <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: EASE, delay: 0.55 }}
                    className="absolute -bottom-[14px] -right-[clamp(12px,1.4vw,26px)] w-[clamp(148px,15.5vw,190px)]"
                  >
                    <HeroPhoneMockup />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.5 }}
            className="relative z-[1] mt-[clamp(14px,2vh,24px)] pt-[clamp(12px,1.8vh,20px)]"
          >
            {/* Left: the three guarantees. Right: everything else (works-with
                logos + the foundation line). Side-by-side keeps the whole hero
                inside one 100dvh viewport — nothing clips. */}
            <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-[clamp(28px,5vw,72px)] gap-y-5 max-md:grid-cols-1">
              <motion.ul
                role="list"
                variants={checksContainer}
                initial="hidden"
                animate="show"
                className="m-0 flex shrink-0 list-none flex-col gap-[clamp(6px,1vh,10px)] p-0"
              >
                {checks.map((c) => (
                  <motion.li
                    key={c}
                    variants={checkItem}
                    className="flex items-center gap-2 text-lg font-normal tracking-[-0.005em] text-ink/55"
                  >
                    <CheckIcon />
                    {c}
                  </motion.li>
                ))}
              </motion.ul>

              <div className="flex w-fit min-w-0 max-w-full justify-self-end flex-col gap-[clamp(10px,1.6vh,16px)] max-md:w-full max-md:justify-self-stretch">
                <div className="flex flex-wrap items-center gap-[clamp(12px,1.4vw,22px)]">
                  <span className={cn("shrink-0 font-normal text-(--text-muted)", TYPE_BODY_SMALL,)}>
                    {t("hero.syncsWith")}
                  </span>
                  <div
                    ref={worksWithRef}
                    className="flex flex-wrap items-center gap-[clamp(12px,1.4vw,24px)]"
                  >
                    {WORKS_WITH.map((w) => (
                      <a
                        key={w.label}
                        href="/connectors"
                        aria-label={w.label}
                        title={w.label}
                        onClick={(e) => {
                          // Smooth-scroll to the connectors section instead of the
                          // browser's instant hash jump (the legacy global handler
                          // only catches .local-nav / .hero-integrations-list links).
                          const target = document.getElementById("connectors");
                          if (!target) return;
                          e.preventDefault();
                          target.scrollIntoView({ behavior: "smooth", block: "start" });
                        }}
                        className="group/ww transition-transform duration-[200ms] ease-[ease] hover:-translate-y-0.5"
                      >
                        <img
                          src={w.src}
                          alt=""
                          width="24"
                          height="24"
                          loading="lazy"
                          className="ww-logo size-[24px] object-contain grayscale opacity-50 group-hover/ww:opacity-100! group-hover/ww:grayscale-0!"
                        />
                      </a>
                    ))}
                  </div>
                </div>
                <p className={cn("m-0 max-w-[68ch] text-(--text-muted)", TYPE_BODY_SMALL)}>
                  {t("hero.foundation")}
                </p>
              </div>
            </div>
          </motion.div>
      </main>
    </section>
  );
}
