import {localePath} from "@/i18n";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { Trans, useTranslation } from "react-i18next";
import { cn } from "@/utils/styles";
import {
  TYPE_BODY,
  TYPE_BODY_SMALL,
  TYPE_CARD_TITLE,
  TYPE_FEATURE_TITLE,
} from "@/components/typography";
import { CARD_HEADER, TITLE, subtitle } from "./_chrome";
import { MobileExpandBg } from "./MobileExpandBg";

import gdocsLogo from "../../../../assets/connectors/google-docs.svg?url";
import gsheetsLogo from "../../../../assets/connectors/google-sheets.svg?url";
import gslidesLogo from "../../../../assets/connectors/google-slides.svg?url";

const cdn = (slug: string) => `https://api.iconify.design/${slug}.svg`;

function BentoTile({
  area,
  className,
                     bgClassName,
  children,
  as = "article",
  href,
  dark = false,
  filled = false,
}: {
  area: string;
  className?: string;
  bgClassName?: string;
  children: React.ReactNode;
  as?: "article" | "a";
  href?: string;
  dark?: boolean;

  filled?: boolean;
}) {
  const Tag = as === "a" ? motion.a : motion.article;

  return (
    <Tag
      data-area={area}
      href={href}
      style={{ gridArea: area }}
      className={cn(

        "bento-tile group/tile relative flex min-h-0 cursor-default flex-col overflow-hidden rounded-[22px] border no-underline",
        "p-[clamp(18px,2vh+6px,30px)_clamp(20px,2.3vw+8px,36px)]",
        "lg:border-(--border-soft) lg:bg-transparent",
        dark
          ? "text-white! border-white/20 bg-ink bg-(image:--dark-card-glow) lg:bg-none"
          : " border-black/15 bg-[#faf9f5] text-(--text-primary)",
        className,
      )}
    >

      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 bg-cream transition-opacity duration-500 ease-out max-lg:hidden",
          filled ? "opacity-100" : "opacity-0",
          bgClassName,
        )}
      />
      {children}
    </Tag>
  );
}

function BentoIcon({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "relative grid size-16 shrink-0 place-items-center rounded-[14px] text-(--text-primary)",
        "[&_svg]:size-9 [&_svg]:fill-none [&_svg]:stroke-current [&_svg]:[stroke-linecap:round] [&_svg]:[stroke-linejoin:round] [&_svg]:[stroke-width:1.5]",
      )}
    >
      {children}
    </div>
  );
}

function BentoHeading({
  children,
  title,
  className,
  wrapperClassName,
}: {
  children: React.ReactNode;
  title: string;
  className?: string;
  wrapperClassName?: string;
}) {
  return (

    <div
      className={cn(
        "relative grid grid-cols-[4rem_minmax(0,1fr)] items-center gap-[clamp(11px,1.4vw,22px)]",
        BLEND_TEXT
      )}
    >
      <BentoIcon>{children}</BentoIcon>
      <h3 className={cn(BENTO_NAME, "min-w-0", className)}>{title}</h3>
    </div>
  );
}

const BLEND_TEXT =
  "lg:mix-blend-difference lg:[--text-primary:#fff] lg:[--text-muted:rgba(255,255,255,0.72)]";

const BENTO_NAME = cn(
  "relative m-0 font-normal text-(--text-primary)",
  TYPE_CARD_TITLE,
);
const BENTO_DESC = cn(
  "relative z-[1] m-0 max-w-[42ch] text-(--text-muted)",
  TYPE_BODY,
  "overflow-hidden [-webkit-box-orient:vertical] [-webkit-line-clamp:3] [display:-webkit-box]",
  BLEND_TEXT,
);

const FORMAT_CHIPS: [string, string][] = [
  [gdocsLogo, "Docs"],
  [gsheetsLogo, "Sheets"],
  [gslidesLogo, "Slides"],
  [cdn("vscode-icons/file-type-word"), "Word"],
  [cdn("vscode-icons/file-type-excel"), "Excel"],
  [cdn("vscode-icons/file-type-powerpoint"), "PPT"],
  [cdn("vscode-icons/file-type-pdf2"), "PDF"],
  [cdn("logos/notion-icon"), "Notion"],
];

const CHANNELS: [string, string][] = [
  ["logos/google-gmail", "Gmail"],
  ["vscode-icons/file-type-outlook", "Outlook"],
  ["logos/slack-icon", "Slack"],
  ["logos/microsoft-teams", "Microsoft Teams"],
  ["logos/whatsapp-icon", "WhatsApp"],
  ["logos/salesforce", "Salesforce"],
  ["logos/hubspot", "HubSpot"],
  ["logos/notion-icon", "Notion"],
];

const MEET_LOGOS: [string, string][] = [
  ["logos/zoom-icon", "Zoom"],
  ["logos/google-meet", "Google Meet"],
  ["logos/microsoft-teams", "Microsoft Teams"],
  ["logos/loom", "Loom"],
];

type MobileFeature = {
  logos?: [string, string, string];
  glyph?: React.ReactNode;
  title: string;
  desc: string;
  cta?: boolean;
};

type MobileFeatureVisual = Omit<MobileFeature, "title" | "desc">;

const MOBILE_FEATURE_VISUALS: MobileFeatureVisual[] = [
  { logos: [gdocsLogo, gsheetsLogo, gslidesLogo] },
  { logos: [cdn("logos/google-gmail"), cdn("logos/slack-icon"), cdn("logos/microsoft-teams")] },
  { logos: [cdn("logos/zoom-icon"), cdn("logos/google-meet"), cdn("logos/microsoft-teams")] },
  { logos: [cdn("logos/notion-icon"), cdn("logos/linear-icon"), cdn("logos/github-icon")] },
  {
    glyph: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M21 12a9 9 0 0 1-15.4 6.4M3 12a9 9 0 0 1 15.4-6.4" />
        <path d="M21 4v5h-5M3 20v-5h5" />
      </svg>
    ),
  },
  {
    glyph: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 12V7a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v5" />
        <path d="M3 12h18v5a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4z" />
        <path d="M9 17h6" />
      </svg>
    ),
  },
  { cta: true },
];

const MFL_LOGOS = "inline-flex w-[78px] min-w-[78px] shrink-0 items-center [&_img]:size-[30px] [&_img]:box-border [&_img]:rounded-[9px] [&_img]:border [&_img]:border-[rgba(12,12,12,0.06)] [&_img]:bg-white [&_img]:p-1 [&_img]:shadow-[0_1px_3px_rgba(12,12,12,0.05)] [&_img:not(:first-child)]:-ml-2.5";
const MFL_GLYPH = "inline-flex w-11 min-w-11 shrink-0 items-center [&_svg]:size-[38px] [&_svg]:box-border [&_svg]:rounded-[9px] [&_svg]:border [&_svg]:border-[rgba(12,12,12,0.06)] [&_svg]:bg-white [&_svg]:fill-none [&_svg]:stroke-(--text-primary) [&_svg]:p-[7px] [&_svg]:shadow-[0_1px_3px_rgba(12,12,12,0.05)] [&_svg]:[stroke-linecap:round] [&_svg]:[stroke-linejoin:round] [&_svg]:[stroke-width:1.6]";
const MFL_TITLE = cn("font-medium text-(--text-primary)", TYPE_BODY);
const MFL_DESC = cn("text-(--text-muted)", TYPE_BODY_SMALL);

export default function Capabilities() {
  const { t } = useTranslation("home");
  const skills = t("capabilities.skills", { returnObjects: true }) as string[];
  const useCasesTags = t("capabilities.useCasesTags", { returnObjects: true }) as string[];
  const mobileText = t("capabilities.mobileFeatures", {
    returnObjects: true,
  }) as { title: string; desc: string }[];
  const mobileFeatures: MobileFeature[] = MOBILE_FEATURE_VISUALS.map((v, i) => ({
    ...v,
    ...mobileText[i],
  }));

  // Cream panel grows a rounded inset frame as the section scrolls in
  // (pricing/enterprise-style), then holds — no card-slicing morph.
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start 0.7"],
  });
  const panelP = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.45 });
  const panelMargin = useTransform(panelP, [0, 1], [0, 16], { clamp: true });
  const panelRadius = useTransform(panelP, [0, 1], [0, 28], { clamp: true });

  return (
    <section
      ref={sectionRef}
      id="capabilities"
      className="relative isolate flex min-h-dvh w-full flex-col overflow-hidden bg-ink"
    >
      <MobileExpandBg />
      <main
        className={cn(
          "min-h-dvh overflow-hidden px-12 py-32",
          "relative z-[1] flex flex-col text-(--text-primary)",
          "max-lg:bg-transparent",
      )}>

        {/* Cream panel: full-bleed → inset rounded card as the section scrolls in
            (pricing/enterprise-style frame), then holds. */}
        <motion.div
          aria-hidden="true"
          data-nav-light
          style={reduced ? { margin: 16, borderRadius: 28 } : { margin: panelMargin, borderRadius: panelRadius }}
          className="pointer-events-none absolute inset-0 z-0 bg-cream max-lg:hidden"
        />
        <div
          className={cn(
            CARD_HEADER,
            "relative z-10 mb-[clamp(2px,0.4vh,6px)]",

            "lg:mix-blend-difference lg:[--text-primary:#fff] lg:[--text-muted:rgba(255,255,255,0.72)]",
          )}
        >
          <div>
            <h1 className={cn(TITLE, "text-(--text-primary)")}>
              <Trans t={t} i18nKey="capabilities.title" components={{ br: <br /> }} />
            </h1>
            <p className={subtitle("max-w-[56ch]")}>{t("capabilities.subtitle")}</p>
          </div>
        </div>

        <div
          className={cn(

            "relative pt-[clamp(8px,1vh+2px,14px)] grid min-h-0 flex-[1_1_auto] grid-cols-12 grid-rows-[repeat(3,minmax(0,1fr))] gap-3",
            "[grid-template-areas:'a_a_a_a_a_a_b_b_b_b_b_b''a_a_a_a_a_a_c_c_c_d_d_d''e_e_e_e_f_f_f_f_g_g_g_g']",
            "max-lg:hidden",
          )}
        >

          <BentoTile
            area="a"
            className={cn(
              "art-docs justify-center gap-[clamp(8px,1.2vh+2px,14px)] p-[clamp(16px,2vh+6px,26px)_clamp(18px,2vw+6px,28px)]",
              "grid grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] grid-rows-[1fr_auto] items-stretch justify-normal gap-x-[clamp(14px,1.8vw,26px)] gap-y-[clamp(6px,0.8vh,12px)]",
              "[grid-template-areas:'text_art''chips_art']",
            )}
          >
            <div className="relative flex max-w-full flex-col self-start [grid-area:text]">
              <BentoHeading
                title={t("capabilities.tiles.buildDocuments.title")}
                className={TYPE_FEATURE_TITLE}
              >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <rect x="6" y="3" width="13" height="18" rx="2" />
                    <path d="M9 8h7M9 12h7M9 16h5" />
                    <path d="M3 6v15a2 2 0 0 0 2 2h12" />
                  </svg>
              </BentoHeading>
              <p className={cn(BENTO_DESC, "mt-[clamp(14px,1.8vh,24px)] max-w-[31ch] [-webkit-line-clamp:4]")}>
                {t("capabilities.tiles.buildDocuments.desc")}
              </p>
            </div>
            <div
              className="relative z-[1] mt-[clamp(6px,1vh+1px,10px)] flex max-w-full flex-wrap gap-2.5 self-end [grid-area:chips]"
              aria-hidden="true"
            >
              {FORMAT_CHIPS.map(([src, label]) => (
                <span
                  key={label}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-[10px] border border-black/15 bg-[#faf9f5] px-3.5 py-2.5 text-[15px] font-medium leading-none text-(--text-primary) shadow-[0_7px_18px_rgba(12,12,12,0.07)]",
                    "[&_img]:size-5 [&_img]:block [&_img]:[filter:saturate(1.05)]",
                  )}
                >
                  <img src={src} alt="" loading="lazy" />
                  {label}
                </span>
              ))}
            </div>
            <div className="relative z-0 h-full min-h-0 w-full overflow-hidden [pointer-events:none] [grid-area:art]" aria-hidden="true">
              <img
                src="assets/bento/build-documents.png"
                alt=""
                loading="lazy"
                decoding="async"
                className={cn(
                  "absolute inset-0 block size-full max-w-none object-contain object-right opacity-[0.96] [-webkit-user-drag:none] select-none",
                  "[-webkit-mask-image:radial-gradient(ellipse_95%_92%_at_55%_50%,#000_78%,rgba(0,0,0,0.5)_92%,transparent_100%)] [mask-image:radial-gradient(ellipse_95%_92%_at_55%_50%,#000_78%,rgba(0,0,0,0.5)_92%,transparent_100%)]",
                  "[filter:drop-shadow(0_14px_26px_rgba(40,50,110,0.10))]",
                )}
              />
            </div>
          </BentoTile>

          <BentoTile
            area="b"
            className="justify-start gap-[clamp(4px,0.6vh,8px)] p-[clamp(14px,1.8vh+4px,22px)_clamp(18px,2vw+6px,26px)]"
          >
            <BentoHeading
              title={t("capabilities.tiles.automateCommunications.title")}
              className={TYPE_FEATURE_TITLE}
            >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M21 11.5a8.4 8.4 0 0 1-3.5 6.8 8.5 8.5 0 0 1-12.5-3.3L3 21l1.7-5.7a8.5 8.5 0 0 1 4.7-11.6A8.4 8.4 0 0 1 21 11.5z" />
                  <path d="M9 10h6M9 14h4" />
                </svg>
            </BentoHeading>
            <p className={cn(BENTO_DESC, "mt-[clamp(12px,1.5vh,20px)] mb-0 max-w-[58ch]")}>{t("capabilities.tiles.automateCommunications.desc")}</p>
            <div
              className="relative z-[1] mt-auto flex flex-wrap items-center gap-[clamp(8px,0.9vw+4px,14px)] pt-[clamp(8px,1.2vh+2px,14px)]"
              aria-hidden="true"
            >
              {CHANNELS.map(([icon, title]) => (
                <span
                  key={title}
                  title={title}
                  className="inline-flex items-center justify-center [&_img]:size-12 [&_img]:block [&_img]:[-webkit-user-drag:none] [&_img]:select-none"
                >
                  <img src={`https://api.iconify.design/${icon}.svg`} alt="" loading="lazy" />
                </span>
              ))}
            </div>
          </BentoTile>

          <BentoTile area="c" className="justify-start">
            <BentoHeading title={t("capabilities.tiles.captureMeetings.title")}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="9" y="3" width="6" height="12" rx="3" />
                  <path d="M5 11a7 7 0 0 0 14 0M12 18v3M8 21h8" />
                </svg>
            </BentoHeading>
            <p className={cn(BENTO_DESC, "mt-[clamp(12px,1.5vh,20px)] mb-0")}>{t("capabilities.tiles.captureMeetings.desc")}</p>
            <div className="relative z-[1] mt-auto flex flex-wrap items-center gap-1.5 pt-[clamp(6px,1vh+1px,12px)]" aria-hidden="true">
              {MEET_LOGOS.map(([icon, title]) => (
                <span
                  key={title}
                  title={title}
                  className={cn(
                    "inline-flex size-[clamp(42px,2.8vh+16px,54px)] items-center justify-center rounded-[12px] border border-black/15 bg-[#faf9f5] shadow-[0_8px_18px_rgba(0,0,0,0.07),inset_0_1px_0_rgba(255,255,255,0.6)]",
                    "[&_img]:size-6 [&_img]:block [&_img]:[-webkit-user-drag:none] [&_img]:select-none",
                  )}
                >
                  <img src={`https://api.iconify.design/${icon}.svg`} alt="" loading="lazy" />
                </span>
              ))}
            </div>
          </BentoTile>

          <BentoTile area="d">
            <BentoHeading title={t("capabilities.tiles.buildAutomations.title")}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M21 12a9 9 0 0 1-15.4 6.4M3 12a9 9 0 0 1 15.4-6.4" />
                  <path d="M21 4v5h-5M3 20v-5h5" />
                </svg>
            </BentoHeading>
            <p className={cn(BENTO_DESC, "mt-[clamp(12px,1.5vh,20px)]")}>{t("capabilities.tiles.buildAutomations.desc")}</p>
          </BentoTile>

          <BentoTile area="e" filled>
            <BentoHeading title={t("capabilities.tiles.organiseProjects.title")}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M9 3v18M3 9h18" />
                  <path d="M13 13h4v4M13 17l4-4" />
                </svg>
            </BentoHeading>
            <p className={cn(BENTO_DESC, "mt-[clamp(12px,1.5vh,20px)]")}>{t("capabilities.tiles.organiseProjects.desc")}</p>
          </BentoTile>

          <BentoTile area="f" filled>
            <BentoHeading title={t("capabilities.tiles.installSkills.title")}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 12V7a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v5" />
                  <path d="M3 12h18v5a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4z" />
                  <path d="M9 17h6" />
                </svg>
            </BentoHeading>
            <p className={cn(BENTO_DESC, "mt-[clamp(12px,1.5vh,20px)]")}>{t("capabilities.tiles.installSkills.desc")}</p>
            <ul
              className={cn(
                "relative m-0 mt-[clamp(8px,1.2vh+2px,16px)] grid min-h-0 grid-cols-2 gap-x-5 p-0 list-none",
                BLEND_TEXT,
              )}
              aria-hidden="true"
            >
              {skills.map((skill, i) => (
                <li
                  key={skill}
                  className={cn(
                    "relative flex items-center border-b border-black/14 py-[clamp(9px,0.9vh+3px,14px)] font-medium text-(--text-primary)",
                    TYPE_BODY,
                    "before:mr-2 before:font-mono before:text-[10.5px] before:font-medium before:text-black/45 before:content-['+']",
                    "lg:border-white/30 lg:before:text-white/55",
                    i >= skills.length - 2 && "border-b-0",
                  )}
                >
                  {skill}
                </li>
              ))}
            </ul>
          </BentoTile>

          <BentoTile
            area="g"
            as="a"
            href={localePath("/for-founders")}
            dark
            filled
            className="no-underline"
            bgClassName="bg-charcoal bg-(image:--dark-card-glow) "
          >
            <BentoHeading title={t("capabilities.tiles.exploreUseCases.title")} className="text-white!">
                <svg viewBox="0 0 24 24" aria-hidden="true"  className="text-white!">
                  <circle cx="9" cy="9" r="3" />
                  <circle cx="17" cy="9" r="3" />
                  <circle cx="13" cy="17" r="3" />
                  <path d="M9 12c0 3 1.5 5 4 5M17 12c0 3-1.5 5-4 5" />
                </svg>
            </BentoHeading>
            <p className={cn(BENTO_DESC, "mt-[clamp(12px,1.5vh,20px)]")}>{t("capabilities.tiles.exploreUseCases.desc")}</p>
            <div className="relative mt-auto flex items-center justify-between gap-2.5 pt-[clamp(6px,1vh+1px,10px)]">
              <span className="flex flex-wrap gap-2 text-sm text-bone/78 lg:mix-blend-difference" aria-hidden="true">
                {useCasesTags.map((tag) => (
                  <span key={tag} className="rounded-full border border-white/20 bg-white/8 px-3.5 py-2">
                    {tag}
                  </span>
                ))}
              </span>
              <span
                className={cn(
                  "inline-flex size-12 shrink-0 items-center justify-center rounded-full border border-white/20 bg-bone text-ink",
                  "[&_svg]:size-5",
                )}
                aria-hidden="true"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </div>
          </BentoTile>
        </div>

        <ul
          className={cn(
            "hidden",
            "max-lg:mt-6 max-lg:flex max-lg:list-none max-lg:flex-col max-lg:border-t max-lg:border-(--border-soft) max-lg:p-0",
            "max-md:mt-[22px]",
          )}
          aria-label={t("capabilities.ariaLabel")}
        >
          {mobileFeatures.map((f) => (
            <li
              key={f.title}
              className={cn(
                "flex items-center gap-[18px] border-b border-(--border-soft) p-[16px_2px]",
                "max-md:gap-4 max-md:p-[18px_2px]",
                "[&:last-child]:border-b-0 [&:last-child]:pb-1",
              )}
            >
              {f.cta ? (
                <a className="flex w-full items-center justify-between gap-3.5 text-inherit no-underline" href={localePath("/for-founders")}>
                  <span className="flex min-w-0 flex-1 flex-col gap-[3px]">
                    <span className={MFL_TITLE}>{f.title}</span>
                    <span className={MFL_DESC}>{f.desc}</span>
                  </span>
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="size-[22px] shrink-0 fill-none stroke-current stroke-[1.8] text-(--text-primary) [stroke-linecap:round] [stroke-linejoin:round]"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </a>
              ) : (
                <>
                  <span className={f.glyph ? MFL_GLYPH : MFL_LOGOS}>
                    {f.glyph ??
                      f.logos!.map((src) => <img key={src} src={src} alt="" loading="lazy" />)}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-[3px]">
                    <span className={MFL_TITLE}>{f.title}</span>
                    <span className={MFL_DESC}>{f.desc}</span>
                  </span>
                </>
              )}
            </li>
          ))}
        </ul>
      </main>
    </section>
  );
}
