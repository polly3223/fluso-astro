import {localePath} from "@/i18n";
import { Trans, useTranslation } from "react-i18next";
import { cn } from "@/utils/styles";
import BloomCard from "@/components/BloomCard";
import { CARD_BODY, CARD_PAD, KICKER, SUBTITLE, TITLE } from "@/components/cardChrome";

const capNum = KICKER;
const capH =
  "mt-1 text-[clamp(26px,1.6vh+17px,36px)] font-medium leading-[1.05] tracking-[-0.025em] text-(--text-primary)";
const capDesc =
  "text-[15.5px] leading-[1.55] text-(--text-muted) [&_strong]:font-medium [&_strong]:text-(--text-primary)";

const capCol =
  "flex flex-col gap-4 border-(--border-soft) max-[1024px]:border-r-0 max-[1024px]:px-0 max-[1024px]:py-7";

const deployList = "mt-auto flex flex-col border-t border-(--border-soft) pt-1";
const deployItem =
  "grid grid-cols-[22px_1fr_auto] items-baseline gap-x-4 gap-y-1 border-b border-(--border-soft) py-[18px] transition-[padding-left] duration-[0.25s] ease-[ease] last:border-b-0 hover:pl-1.5";
const deployLetter =
  "self-start pt-[3px] font-mono text-[11px] font-medium tracking-[0.08em] text-[rgba(12,12,12,0.4)] [grid-row:1/3]";
const deployName =
  "text-[17px] font-medium leading-[1.25] tracking-[-0.01em] text-(--text-primary) [grid-column:2] [grid-row:1]";
const deploySpec =
  "text-[14px] leading-[1.55] text-(--text-muted) [grid-column:2/4] [grid-row:2]";

const CONNECTORS = [
  { title: "Snowflake", src: "https://api.iconify.design/logos/snowflake-icon.svg" },
  { title: "BigQuery", src: "https://api.iconify.design/gcp/bigquery.svg" },
  { title: "Databricks", src: "https://api.iconify.design/simple-icons/databricks.svg?color=%23FF3621" },
  { title: "Salesforce", src: "https://api.iconify.design/logos/salesforce.svg" },
  { title: "Slack", src: "https://api.iconify.design/logos/slack-icon.svg" },
  { title: "Notion", src: "https://api.iconify.design/logos/notion-icon.svg" },
  { title: "Gmail", src: "https://api.iconify.design/logos/google-gmail.svg" },
];

export default function Capabilities() {
  const { t } = useTranslation("enterprise");
  const skills = t("capabilities.skills.items", { returnObjects: true }) as { label: string; meta: string }[];
  const deployModes = t("capabilities.deployment.modes", { returnObjects: true }) as { name: string; spec: string }[];

  return (
    <BloomCard id="capabilities" className="scroll-mt-[calc(var(--nav-h)+18px)]">
      <main data-nav-light className={cn(CARD_BODY, "theme-light bg-(--card-bg) text-(--text-primary)", CARD_PAD)}>
        <div className="relative z-10 border-b border-(--border-soft) pb-[clamp(28px,3.4vh,44px)]">
          {/*<span className={cn(KICKER, "mb-[clamp(14px,2vh,22px)] block")}>Personalisation</span>*/}
          <h2 className={TITLE}>
            <Trans t={t} i18nKey="capabilities.title" components={{ br: <br /> }} />
          </h2>
          <p className={cn(SUBTITLE, "max-w-[56ch] max-[1024px]:max-w-full")}>
            <Trans t={t} i18nKey="capabilities.subtitle" components={{ strong: <strong /> }} />
          </p>
        </div>

        <div className="relative z-10 mt-[clamp(32px,4vh,48px)] grid min-h-0 grow grid-cols-3 max-[1024px]:grid-cols-1 max-[1024px]:gap-0">
          <article className={cn(capCol, "border-r pr-9 max-[1024px]:border-b max-[1024px]:pt-0")}>
            <span className={capNum}>{t("capabilities.connectors.kicker")}</span>
            <h3 className={capH}>
              <Trans t={t} i18nKey="capabilities.connectors.title" components={{ br: <br /> }} />
            </h3>
            <p className={cn(capDesc, "max-w-[38ch]")}>
              <Trans t={t} i18nKey="capabilities.connectors.desc" components={{ strong: <strong /> }} />
            </p>
            <div className="mt-auto grid grid-cols-4 gap-2 pt-5">
              {CONNECTORS.map((c) => (
                <span
                  key={c.title}
                  title={c.title}
                  className="inline-flex aspect-square items-center justify-center rounded-lg border border-(--border-soft) bg-white shadow-[0_2px_6px_rgba(0,0,0,0.04)] transition-[border-color,transform] duration-[0.18s] ease-[ease] hover:-translate-y-0.5 hover:border-[rgba(12,12,12,0.3)]"
                >
                  <img src={c.src} alt="" loading="lazy" className="block size-9" />
                </span>
              ))}
              <a
                className="inline-flex aspect-square flex-col items-center justify-center gap-px rounded-lg border border-dashed border-[rgba(12,12,12,0.22)] text-(--text-primary) no-underline transition-[border-color,background] duration-[0.18s] ease-[ease] hover:border-solid hover:border-[rgba(12,12,12,0.5)] hover:bg-white/60"
                href={localePath("/get-started")}
                title={t("capabilities.connectors.moreTitle")}
              >
                <span className="text-[22px] font-medium leading-none tracking-[-0.02em]">500</span>
                <span className="text-[12px] font-medium leading-none text-(--text-muted)">{t("capabilities.connectors.moreLabel")}</span>
              </a>
            </div>
          </article>

          <article className={cn(capCol, "border-r px-9 max-[1024px]:border-b")}>
            <span className={capNum}>{t("capabilities.skills.kicker")}</span>
            <h3 className={capH}>
              <Trans t={t} i18nKey="capabilities.skills.title" components={{ br: <br /> }} />
            </h3>
            <p className={cn(capDesc, "max-w-[38ch]")}>
              <Trans t={t} i18nKey="capabilities.skills.desc" components={{ strong: <strong /> }} />
            </p>
            <ul className="mt-auto grid list-none grid-cols-1 pt-4">
              {skills.map((s) => (
                <li
                  key={s.label}
                  className="flex items-center gap-3 border-b border-(--border-soft) py-3 text-[14.5px] font-medium text-(--text-primary) last:border-b-0 before:font-mono before:text-[11.5px] before:font-medium before:text-[rgba(12,12,12,0.45)] before:content-['+']"
                >
                  {s.label}
                  <span className="ml-auto font-mono text-[10.5px] uppercase tracking-[0.12em] text-(--text-muted)">{s.meta}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className={cn(capCol, "pl-9 max-[1024px]:pb-0")}>
            <span className={capNum}>{t("capabilities.deployment.kicker")}</span>
            <h3 className={capH}>
              <Trans t={t} i18nKey="capabilities.deployment.title" components={{ br: <br /> }} />
            </h3>
            <p className={cn(capDesc, "max-w-[38ch]")}>
              <Trans t={t} i18nKey="capabilities.deployment.desc" components={{ strong: <strong /> }} />
            </p>
            <div className={deployList}>
              <div className={deployItem}>
                <span className={deployLetter}>A</span>
                <h4 className={deployName}>{deployModes[0].name}</h4>
                <p className={deploySpec}>{deployModes[0].spec}</p>
              </div>
              <div className={deployItem}>
                <span className={deployLetter}>B</span>
                <h4 className={deployName}>{deployModes[1].name}</h4>
                <p className={deploySpec}>
                  <span className="inline-flex items-center gap-4 align-middle [&_img]:block [&_img]:h-5 [&_img]:w-auto [&_img]:opacity-85">
                    <img src="https://api.iconify.design/logos/aws.svg" alt="AWS" title="AWS" loading="lazy" />
                    <img src="https://api.iconify.design/logos/google-cloud.svg" alt="Google Cloud" title="Google Cloud" loading="lazy" />
                    <img src="https://api.iconify.design/logos/microsoft-azure.svg" alt="Microsoft Azure" title="Microsoft Azure" loading="lazy" />
                  </span>
                </p>
              </div>
              <div className={deployItem}>
                <span className={deployLetter}>C</span>
                <h4 className={deployName}>{deployModes[2].name}</h4>
                <p className={deploySpec}>{deployModes[2].spec}</p>
              </div>
            </div>
          </article>
        </div>
      </main>
    </BloomCard>
  );
}
