import { Link } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";
import { cn } from "@/utils/styles";
import BloomCard from "@/components/BloomCard";


export default function GetStarted() {
  const { t } = useTranslation("getStarted");
  const steps = t("steps", { returnObjects: true }) as { title: string; copy: string }[];

  return (
    <>
      <div className="relative z-2 flex flex-col p-4">
        <BloomCard
          hero
          id="getting-started"
          className="scroll-mt-[calc(var(--nav-h)_+_18px)]"
        >
          <main

            data-nav-light
            className={cn(

              "[--card-bg:#faf9f5] [--text-primary:#0c0c0c] [--text-muted:rgba(12,12,12,0.6)]",
              "[--border-color:rgba(12,12,12,1)] [--border-soft:rgba(12,12,12,0.1)] [--border-vsoft:rgba(12,12,12,0.05)]",

              "relative flex flex-col",
              "bg-(--card-bg) text-(--text-primary)",

              "min-h-[calc(100dvh-2rem)]",
              "px-16 pb-14 pt-[calc(var(--nav-h)+clamp(48px,6.5vh,88px))]",
              "max-[1024px]:px-7 max-[1024px]:pb-9",
              "max-[640px]:px-[22px] max-[640px]:pb-7",
            )}
          >
            <div>
              <div>
                <h1
                  className={cn(
                    "text-[clamp(40px,5vh_+_19px,64px)] leading-[0.92] font-medium",
                    "tracking-[-0.04em] -ml-[0.05em]",
                    "max-[1024px]:text-[48px] max-[640px]:text-[38px]",
                  )}
                >
                  <Trans t={t} i18nKey="hero.title" components={{ br: <br /> }} />
                </h1>
                <p
                  className={cn(
                    "mt-[clamp(10px,1.2vh_+_2px,18px)] max-w-[480px]",
                    "text-[clamp(15px,1vh_+_13px,22px)] font-normal leading-[1.4]",
                    "tracking-[-0.01em] text-(--text-muted)",
                    "max-[1024px]:max-w-full max-[1024px]:text-[19px]",
                  )}
                >
                  {t("hero.subtitle")}
                </p>
              </div>
            </div>

            <div
              className={cn(
                "relative z-10 mt-[clamp(14px,2vh_+_4px,20px)] min-h-0 flex-auto",
                "grid grid-cols-[1fr_1fr] gap-[clamp(40px,6vw,80px)]",
                "max-[1024px]:grid-cols-[1fr] max-[1024px]:gap-8 max-[1024px]:grow-0",
              )}
            >
              <div
                className={cn(
                  "flex flex-col border-r border-(--border-soft) pr-[clamp(24px,3vw,40px)]",
                  "max-[1024px]:border-r-0 max-[1024px]:pr-0",
                  "max-[1024px]:border-b max-[1024px]:pb-7",
                )}
              >
                <div className="mb-[clamp(18px,2.6vh_+_4px,32px)] flex gap-5">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-(--text-primary) font-['JetBrains_Mono',monospace] text-[12px] text-(--card-bg)">
                    1
                  </div>
                  <div className="pt-0.5">
                    <div className="mb-1 text-[17px] font-medium">
                      {steps[0].title}
                    </div>
                    <div className="mt-1 max-w-[28ch] text-[14px] leading-[1.5] text-(--text-muted)">
                      {steps[0].copy}
                    </div>
                  </div>
                </div>
                <div className="mb-[clamp(18px,2.6vh_+_4px,32px)] flex gap-5">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-(--text-primary) font-['JetBrains_Mono',monospace] text-[12px] text-(--card-bg)">
                    2
                  </div>
                  <div className="pt-0.5">
                    <div className="mb-1 text-[17px] font-medium">
                      {steps[1].title}
                    </div>
                    <div className="mt-1 max-w-[28ch] text-[14px] leading-[1.5] text-(--text-muted)">
                      {steps[1].copy}
                    </div>
                  </div>
                </div>
                <div className="mb-0 flex gap-5">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-(--text-primary) font-['JetBrains_Mono',monospace] text-[12px] text-(--card-bg)">
                    3
                  </div>
                  <div className="pt-0.5">
                    <div className="mb-1 text-[17px] font-medium">
                      {steps[2].title}
                    </div>
                    <div className="mt-1 max-w-[28ch] text-[14px] leading-[1.5] text-(--text-muted)">
                      {steps[2].copy}
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-10 max-[1024px]:pt-7">
                  <div className="mb-3 text-[11.5px] uppercase tracking-[0.1em] text-(--text-muted)">
                    {t("support.label")}
                  </div>
                  <div className="text-[20px]">
                    <a
                      className={cn(
                        "border-b border-transparent text-inherit no-underline",
                        "transition-[border-color] duration-180 ease-[ease]",
                        "hover:border-b-current motion-reduce:transition-none",
                      )}
                      href="mailto:fluso@premai.io"
                    >
                      fluso@premai.io
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex w-full max-w-[360px] flex-col items-stretch justify-center gap-3.5 max-[1024px]:max-w-full">
                <a
                  className={cn(
                    "group flex w-full items-center gap-4.5 no-underline",
                    "rounded-[18px] border border-transparent px-6 py-[22px]",
                    "bg-(--text-primary) text-(--card-bg)",
                    "shadow-[0_14px_32px_rgba(12,12,12,0.18),0_2px_6px_rgba(12,12,12,0.1)]",
                    "transition-[transform,box-shadow,background,border-color] duration-220 ease-[ease]",
                    "[-webkit-tap-highlight-color:transparent] motion-reduce:transition-none",
                    "hover:-translate-y-0.5 hover:bg-[#1a1a1a]",
                    "hover:shadow-[0_20px_42px_rgba(12,12,12,0.24),0_4px_10px_rgba(12,12,12,0.12)]",
                    "max-[1024px]:px-5 max-[1024px]:py-4.5",
                  )}
                  href="https://fluso-releases.s3.amazonaws.com/desktop/prod/Fluso-latest-arm64.dmg"
                  download
                >
                  <svg
                    className="shrink-0"
                    width="26"
                    height="26"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.05.28.05.43zm4.565 15.71c-.03.07-.463 1.58-1.518 3.12-.945 1.34-1.94 2.71-3.43 2.71-1.517 0-1.9-.88-3.63-.88-1.698 0-2.302.91-3.67.91-1.377 0-2.332-1.26-3.428-2.8-1.287-1.82-2.323-4.63-2.323-7.28 0-4.28 2.797-6.55 5.552-6.55 1.448 0 2.675.95 3.6.95.865 0 2.222-1.01 3.902-1.01.613 0 2.886.06 4.374 2.19-.13.09-2.383 1.37-2.383 4.19 0 3.26 2.854 4.42 2.955 4.45z" />
                  </svg>
                  <span className="flex min-w-0 flex-auto flex-col gap-[3px] text-left">
                    <span className="text-[16px] font-medium leading-[1.2] tracking-[-0.01em]">
                      {t("download.mac.title")}
                    </span>
                    <span className="font-['JetBrains_Mono',monospace] text-[10.5px] uppercase leading-[1.3] tracking-[0.12em] text-[rgba(242,241,237,0.65)]">
                      {t("download.mac.meta")}
                    </span>
                  </span>
                  <svg
                    className="shrink-0 opacity-85 transition-transform duration-220 ease-[ease] group-hover:translate-y-0.5 motion-reduce:transition-none"
                    width="18"
                    height="18"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M8 2.5v8.5M4.5 7.5L8 11l3.5-3.5M3 14h10"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
                <a
                  className={cn(
                    "group flex w-full items-center gap-4.5 no-underline",
                    "rounded-[18px] border border-[rgba(12,12,12,0.08)] px-6 py-[22px]",
                    "bg-[rgba(12,12,12,0.035)] text-(--text-primary)",
                    "transition-[transform,box-shadow,background,border-color] duration-220 ease-[ease]",
                    "[-webkit-tap-highlight-color:transparent] motion-reduce:transition-none",
                    "hover:-translate-y-0.5 hover:border-[rgba(12,12,12,0.18)] hover:bg-[rgba(12,12,12,0.06)]",
                    "hover:shadow-[0_12px_28px_rgba(12,12,12,0.08)]",
                    "max-[1024px]:px-5 max-[1024px]:py-4.5",
                  )}
                  href="https://fluso-releases.s3.amazonaws.com/desktop/prod/Fluso-latest-windows.exe"
                  download
                >
                  <svg
                    className="shrink-0"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M3 5.7l8.2-1.12V11.5H3V5.7zm0 6.8h8.2v6.92L3 18.3v-5.8zM12.3 4.42L21 3.2v8.3h-8.7V4.42zm0 8.08H21v8.3l-8.7-1.22V12.5z" />
                  </svg>
                  <span className="flex min-w-0 flex-auto flex-col gap-[3px] text-left">
                    <span className="text-[16px] font-medium leading-[1.2] tracking-[-0.01em]">
                      {t("download.windows.title")}
                    </span>
                    <span className="font-['JetBrains_Mono',monospace] text-[10.5px] uppercase leading-[1.3] tracking-[0.12em] text-(--text-muted)">
                      {t("download.windows.meta")}
                    </span>
                  </span>
                  <svg
                    className="shrink-0 opacity-55 transition-transform duration-220 ease-[ease] group-hover:translate-y-0.5 group-hover:opacity-85 motion-reduce:transition-none"
                    width="18"
                    height="18"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M8 2.5v8.5M4.5 7.5L8 11l3.5-3.5M3 14h10"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
                <a
                  className={cn(
                    "group mt-1.5 inline-flex items-center gap-1 self-start",
                    "border-b border-transparent no-underline",
                    "text-[12.5px] tracking-[-0.005em] text-[rgba(12,12,12,0.6)]",
                    "transition-[color,border-color] duration-180 ease-[ease] motion-reduce:transition-none",
                    "hover:border-b-[rgba(12,12,12,0.4)] hover:text-[rgba(12,12,12,0.85)]",
                  )}
                  href="/download"
                >
                  {t("download.moreOptions")}{" "}
                  <span
                    aria-hidden="true"
                    className="inline-block transition-transform duration-180 ease-[ease] group-hover:translate-x-0.5 motion-reduce:transition-none"
                  >
                    →
                  </span>
                </a>
              </div>
            </div>

            <div
              className={cn(
                "relative z-10 mt-auto grid grid-cols-[1fr_3fr] gap-[clamp(24px,4vw,40px)]",
                "border-t border-(--border-color) pt-[clamp(12px,1.6vh_+_4px,20px)]",
                "max-[1024px]:mt-8 max-[1024px]:grid-cols-[1fr] max-[1024px]:gap-5 max-[1024px]:pt-5",
              )}
            >
              <div className="text-[13px] font-medium text-(--text-muted)">
                {t("guarantee.label")}
              </div>
              <div className="text-[clamp(13.5px,0.5vh_+_12.5px,15px)] leading-[1.5] tracking-[-0.01em]">
                <Trans
                  t={t}
                  i18nKey="guarantee.body"
                  components={{ terms: <Link to="/terms" /> }}
                />
              </div>
            </div>
          </main>
        </BloomCard>
      </div>
    </>
  );
}
