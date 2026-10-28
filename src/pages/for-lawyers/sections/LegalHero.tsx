import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { cn } from "@/utils/styles";
import { TYPE_BODY, TYPE_DISPLAY, TYPE_LABEL, TYPE_LEAD } from "@/components/typography";
import { EASE, lineUp } from "./reveal";
import { GLASS_LIGHT } from "./bits";
import heroMobileSeg0 from "../../../../assets/video/hero-main-1080-seg0.webm";
import heroMobileSeg1 from "../../../../assets/video/hero-main-1080-seg1.webm";
import heroMobileSeg2 from "../../../../assets/video/hero-main-1080-seg2.webm";
import heroMobileSeg3 from "../../../../assets/video/hero-main-1080-seg3.webm";
import heroDesktopSeg0 from "../../../../assets/video/hero-main-4k-seg0.webm";
import heroDesktopSeg1 from "../../../../assets/video/hero-main-4k-seg1.webm";
import heroDesktopSeg2 from "../../../../assets/video/hero-main-4k-seg2.webm";
import heroDesktopSeg3 from "../../../../assets/video/hero-main-4k-seg3.webm";
import heroPoster from "../../../../assets/video/hero-main-poster.webp?url";
import heroPosterInline from "../../../../assets/video/hero-main-poster-lqip.webp?inline";

const PLAYBACK_RATE = 0.76;
const HERO_MOBILE_SEGMENTS = [
  heroMobileSeg0,
  heroMobileSeg1,
  heroMobileSeg2,
  heroMobileSeg3,
] as const;
const HERO_DESKTOP_SEGMENTS = [
  heroDesktopSeg0,
  heroDesktopSeg1,
  heroDesktopSeg2,
  heroDesktopSeg3,
] as const;

type NetworkInformationLike = {
  saveData?: boolean;
  effectiveType?: "slow-2g" | "2g" | "3g" | "4g" | string;
  downlink?: number;
  rtt?: number;
};

type HeroTier = "mobile" | "desktop-1080" | "desktop-4k" | "still";

function hasFastDesktopConnection(connection?: NetworkInformationLike): boolean {
  if (!connection) return false;
  if (connection.saveData) return false;
  if (connection.effectiveType && connection.effectiveType !== "4g") return false;
  if (typeof connection.downlink === "number" && connection.downlink < 8) return false;
  if (typeof connection.rtt === "number" && connection.rtt > 250) return false;
  return (
    connection.effectiveType === "4g" ||
    (typeof connection.downlink === "number" && connection.downlink >= 8)
  );
}

/**
 * Pick the right hero media once, at mount:
 *  - reduced-motion or Save-Data  → "still" (poster only, no video download)
 *  - viewport ≤ 768px             → "mobile" (1080p)
 *  - desktop with fast hints      → "desktop-4k"
 *  - desktop otherwise            → "desktop-1080"
 */
function resolveHeroTier(): HeroTier {
  if (typeof window === "undefined" || !window.matchMedia) return "desktop-1080";
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const connection = (navigator as { connection?: NetworkInformationLike }).connection;
  if (prefersReducedMotion || connection?.saveData) return "still";
  if (window.matchMedia("(max-width: 768px)").matches) return "mobile";
  return hasFastDesktopConnection(connection) ? "desktop-4k" : "desktop-1080";
}

function SegmentedHeroVideo({ segments }: { segments: readonly string[] }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const readySegmentsRef = useRef<Set<number>>(new Set());
  const preloadingSegmentsRef = useRef<Set<number>>(new Set());
  const preloadAbortRefs = useRef<Set<AbortController>>(new Set());
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    readySegmentsRef.current = new Set();
    preloadingSegmentsRef.current = new Set();
    preloadAbortRefs.current.forEach((controller) => controller.abort());
    preloadAbortRefs.current = new Set();
    setCurrentIndex(0);

    return () => {
      preloadAbortRefs.current.forEach((controller) => controller.abort());
      preloadAbortRefs.current = new Set();
    };
  }, [segments]);

  const nextOf = (index: number) => (index + 1) % segments.length;

  const preloadSegment = (index: number) => {
    if (readySegmentsRef.current.has(index)) return;
    if (preloadingSegmentsRef.current.has(index)) return;

    preloadingSegmentsRef.current.add(index);
    const controller = new AbortController();
    preloadAbortRefs.current.add(controller);

    void fetch(segments[index], {
      cache: "force-cache",
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error(`Video preload failed: ${response.status}`);
        return response.blob();
      })
      .then(() => {
        readySegmentsRef.current.add(index);
        const nextIndex = nextOf(index);
        if (nextIndex !== currentIndex) preloadSegment(nextIndex);
      })
      .catch(() => undefined)
      .finally(() => {
        preloadingSegmentsRef.current.delete(index);
        preloadAbortRefs.current.delete(controller);
      });
  };

  const armNextPreload = (index: number) => {
    const nextIndex = nextOf(index);
    preloadSegment(nextIndex);
  };

  useEffect(() => {
    preloadSegment(nextOf(0));
  }, [segments]);

  const playVisible = () => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = PLAYBACK_RATE;
    void video.play().catch(() => undefined);
  };

  const handleVisibleReady = () => {
    readySegmentsRef.current.add(currentIndex);
    armNextPreload(currentIndex);
    playVisible();
  };

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      playVisible();
      if (readySegmentsRef.current.has(currentIndex)) {
        armNextPreload(currentIndex);
      }
    });
    return () => cancelAnimationFrame(raf);
  }, [currentIndex, segments]);

  const handleEnded = () => {
    const video = videoRef.current;
    const nextIndex = nextOf(currentIndex);

    if (readySegmentsRef.current.has(nextIndex)) {
      setCurrentIndex(nextIndex);
      return;
    }

    preloadSegment(nextIndex);
    if (!video) return;
    video.currentTime = 0;
    playVisible();
  };

  return (
    <>
      <video
        key={segments[currentIndex]}
        ref={videoRef}
        className="absolute inset-0 z-0 size-full object-cover"
        autoPlay
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        disablePictureInPicture
        tabIndex={-1}
        onLoadedData={handleVisibleReady}
        onEnded={handleEnded}
      >
        <source src={segments[currentIndex]} type="video/webm" />
      </video>
    </>
  );
}

const T_TITLE = 0.3;
const T_REST = 0.95;
const T_TAGLINE = T_REST;
const T_CTA = T_REST;
const T_QUOTE = T_REST;

export default function LegalHero() {
  const { t } = useTranslation("lawyers");
  const titleLines = t("hero.title", { returnObjects: true }) as string[];
  const [tier] = useState<HeroTier>(resolveHeroTier);
  const heroSegments =
    tier === "desktop-4k" ? HERO_DESKTOP_SEGMENTS : HERO_MOBILE_SEGMENTS;

  return (
    <section id="hero" data-nav-light className="relative">
      <main
        className={cn(
          "relative flex h-dvh w-full flex-col justify-end overflow-hidden bg-ink text-bone",
          "px-[clamp(24px,3.4vw,56px)] pb-[clamp(45px,7vh,75px)] pt-28",
        )}
      >

        {/*/!* Layer 1 — tiny inlined LQIP: paints instantly with zero network (LCP). *!/*/}
        {/*<img*/}
        {/*  src={heroPosterInline}*/}
        {/*  alt=""*/}
        {/*  aria-hidden="true"*/}
        {/*  fetchPriority="high"*/}
        {/*  decoding="sync"*/}
        {/*  className="absolute inset-0 z-0 size-full object-cover"*/}
        {/*/>*/}

        {/*/!* Layer 2 — sharp 4K poster, extracted from the video's own first frame so it*/}
        {/*    matches pixel-for-pixel. Stays visible beneath the video the whole time. *!/*/}
        <img
          src={heroPoster}
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          className="absolute inset-0 z-0 size-full object-cover"
        />

        {/* Layer 3 — the video. It sits on top of the matching poster (Layer 2 is the
            video's own first frame), so when it starts painting the handoff is invisible.
            Omitted entirely for "still" (reduced-motion / Save-Data). */}
        {tier !== "still" && (
          <SegmentedHeroVideo segments={heroSegments} />
        )}

        {/* thin uniform dark filter over the whole first screen — subtle mood/contrast */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1] bg-black/20"
        />

        {/* bottom scrim — ~30% of the viewport tall, noticeably darker so the
            headline/CTA/quote really pop; blends into the dark section below. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[clamp(280px,32vh,540px)]"
          style={{
            background:
              "linear-gradient(to top, #0c0c0c 0%, rgba(6,6,6,0.98) 16%, rgba(0,0,0,0.88) 46%, rgba(0,0,0,0.5) 76%, transparent 100%)",
          }}
        />

        <div className="relative z-[2] flex items-end justify-between gap-10">

          <div className="max-w-[760px]">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, ease: EASE }}
              className={cn("m-0 mb-5 font-chill pl-3 font-medium uppercase text-blue-300", TYPE_LABEL)}
            >
              {t("hero.eyebrow")}
            </motion.p>

            <motion.h1
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: {
                  transition: { staggerChildren: 0.14, delayChildren: T_TITLE },
                },
              }}
                className={cn(
                  "m-0 -ml-[0.03em] font-normal",
                  TYPE_DISPLAY,
                  "text-paper",
                )}
            >
              {titleLines.map((line) => (
                <span
                  key={line}
                  className="block overflow-hidden pb-[0.1em] -mb-[0.1em]"
                >
                  <motion.span variants={lineUp} className="block will-change-transform">
                    {line}
                  </motion.span>
                </span>
              ))}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: T_TAGLINE }}
              className={cn("m-0 mt-6 max-w-[40ch] text-bone/85", TYPE_LEAD)}
            >
              {t("hero.tagline")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: T_CTA }}
              className="mt-9"
            >
              <a
                href="https://form.typeform.com/to/vZnBDhzs"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  GLASS_LIGHT,
                )}
              >
                {t("hero.cta")}
              </a>
            </motion.div>
          </div>

          <motion.blockquote
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: T_QUOTE, duration: 0.7, ease: EASE }}
            className={cn(
              "m-0 max-w-[40ch] shrink-0 border-l border-bone/30 pl-6",
              "max-lg:hidden",
            )}
          >
            <p className={cn("m-0 text-bone/80 font-serif italic", TYPE_BODY)}>
              {t("hero.quote")}
            </p>
          </motion.blockquote>
        </div>
      </main>
    </section>
  );
}
