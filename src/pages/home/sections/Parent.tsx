import { useEffect, useRef } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { useTranslation } from "react-i18next";
import { cn } from "@/utils/styles";
import { TYPE_CTA, TYPE_LABEL, TYPE_LEAD } from "@/components/typography";
import { IconPrem } from "@/components/IconPrem";
import { PremTextLogo } from "@/components/SiteNav";
import { PremLogoThinking } from "@/components/PremLogoThinking";
import parentBgVideo from "../../../../assets/video/prem-parent-bg.mp4";

export default function Parent({ skipVideo }: { skipVideo?: boolean }) {
  const { t } = useTranslation("common");
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion() ?? false;

  const seen = useInView(sectionRef, { once: true, amount: 0.2 });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.controls = false;
    video.defaultMuted = true;
    video.muted = true;
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
    void video.play().catch(() => undefined);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="parent"
      data-nav-dark
      className={cn(
        "min-h-[50dvh] relative z-[2] flex justify-center items-center overflow-hidden bg-[#0c0c0c] text-center text-[#faf9f5]",
        "mt-[clamp(28px,3.8vw,56px)] p-[clamp(64px,9vw,128px)_clamp(20px,5vw,64px)]",
        "max-[640px]:p-[56px_24px_40px]",
      )}
      aria-labelledby="parent-title"
    >

        {!reduced && !skipVideo && (
          <video
            ref={videoRef}
            className="prem-background-video pointer-events-none absolute inset-0 size-full object-cover"
            src={parentBgVideo}
            autoPlay
            muted
            loop
            playsInline
            controls={false}
            preload="metadata"
            disablePictureInPicture
            disableRemotePlayback
            controlsList="nodownload nofullscreen noremoteplayback"
            aria-hidden="true"
            tabIndex={-1}
          />
      )}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #0c0c0c 0%, rgba(12,12,12,0.55) 28%, rgba(12,12,12,0.55) 72%, #0c0c0c 100%)",
        }}
      />
      <div className="relative z-[1] flex max-w-[780px] flex-col items-center gap-[18px] max-[640px]:gap-4">
        <span className={cn("font-medium uppercase text-[rgba(242,241,237,0.45)]", TYPE_LABEL)}>
          {t("parent.productOf")}
        </span>
        <a
          className="relative inline-flex h-[clamp(44px,5.4vw,66px)] w-[clamp(189px,23.3vw,285px)] items-center opacity-[0.92] transition-opacity duration-[220ms] ease-[ease] hover:opacity-100"
          href="https://premai.io"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Prem AI"
        >
          {/* The mark forms in place on the left (no sideways slide), then the
              wordmark draws in beside it as the dots settle. */}
          <span
            aria-hidden="true"
            className="absolute left-0 top-0 block size-[clamp(44px,5.4vw,66px)]"
          >
            {reduced ? (
              <IconPrem className="size-full" />
            ) : seen ? (
              <PremLogoThinking width="100%" height="100%" once />
            ) : null}
          </span>
          <span
            aria-hidden="true"
            className="absolute right-0 top-1/2 block -translate-y-1/2"
          >
            <PremTextLogo
              className="block h-[clamp(34px,4.2vw,51px)] w-[clamp(134px,16.5vw,201px)] max-w-none"
              draw={!reduced}
              active={seen}
              delay={0.18}
            />
          </span>
        </a>
        <p
          className={cn(
            "mt-1 font-normal text-[rgba(242,241,237,0.74)]",
            TYPE_LEAD,
            "[&_a]:border-b [&_a]:border-[rgba(242,241,237,0.25)] [&_a]:pb-px [&_a]:font-medium [&_a]:text-[#faf9f5] [&_a]:transition-[border-color] [&_a]:duration-[180ms] [&_a:hover]:border-[rgba(242,241,237,0.85)]",
          )}
          id="parent-title"
        >
          {t("parent.tagline")}
        </p>
        <div className="mt-3.5 inline-flex flex-wrap items-center justify-center gap-2.5">
          {[
            { href: "https://premai.io", label: t("parent.visit") },
            { href: "https://form.typeform.com/to/vZnBDhzs", label: t("parent.contact") },
          ].map((cta) => (
            <a
              key={cta.label}
              className={cn(
                "backdrop-blur-xs group/pcta inline-flex items-center gap-[7px] rounded-full border border-[rgba(242,241,237,0.22)] bg-[rgba(242,241,237,0.04)] px-[18px] py-[9px] font-medium text-[#faf9f5]",
                TYPE_CTA,
                "transition-[background,border-color,transform] duration-[220ms] ease-[ease] hover:border-[rgba(242,241,237,0.45)] hover:bg-[rgba(242,241,237,0.1)]",
              )}
              href={cta.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {cta.label}{" "}
              <span aria-hidden="true" className="transition-transform duration-[220ms] ease-[ease] group-hover/pcta:translate-x-[3px]">
                →
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
