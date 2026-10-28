import { useReducedMotion } from "motion/react";
import { cn } from "@/utils/styles";
import { IconPrem } from "@/components/IconPrem";
import { PremLogoThinking } from "@/components/PremLogoThinking";

/* ------------------------------------------------------------------ *
 * An abstract, stylized rendering of the Fluso iPhone app — NOT a 1:1
 * screenshot. Same discipline as HeroAppMockup: pure CSS/JSX, a few
 * evocative strings, everything else quiet. Sized to lean against the
 * desktop mockup's corner in the hero.
 * ------------------------------------------------------------------ */

const ICON = {
  menu: (
    <svg width="9" height="9" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path d="M2 3.4h8M2 6h8M2 8.6h8" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" />
    </svg>
  ),
  plus: (
    <svg width="9" height="9" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path d="M6 1.8v8.4M1.8 6h8.4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  ),
  folder: (
    <svg width="9" height="9" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path d="M1.5 3.2c0-.5.4-.9.9-.9h2l1 1.1h4.2c.5 0 .9.4.9.9v4.5c0 .5-.4.9-.9.9H2.4c-.5 0-.9-.4-.9-.9z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
    </svg>
  ),
  cal: (
    <svg width="9" height="9" viewBox="0 0 14 14" fill="none" aria-hidden>
      <rect x="2" y="3" width="10" height="9" rx="1.6" stroke="currentColor" strokeWidth="1.2" />
      <path d="M2 5.6h10M4.5 1.8v2.2M9.5 1.8v2.2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  ),
  check: (
    <svg width="9" height="9" viewBox="0 0 12 12" fill="none" aria-hidden>
      <rect x="1.5" y="1.5" width="9" height="9" rx="2.5" stroke="currentColor" strokeWidth="1.15" />
      <path d="M3.8 6.1 5.3 7.6 8.2 4.5" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  screen: (
    <svg width="9" height="9" viewBox="0 0 14 14" fill="none" aria-hidden>
      <rect x="1.8" y="2.4" width="10.4" height="7" rx="1.4" stroke="currentColor" strokeWidth="1.2" />
      <path d="M5 11.7h4M7 9.4v2.3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  ),
  clip: (
    <svg width="10" height="10" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M11.2 7.3 7.5 11a2.2 2.2 0 0 1-3.1-3.1l4.2-4.2a1.4 1.4 0 0 1 2 2L6.3 9.9a.6.6 0 0 1-.9-.9l3.6-3.6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  sparkle: (
    <svg width="8" height="8" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path d="M7 1.5c.4 2.6 1.4 3.6 4 4-2.6.4-3.6 1.4-4 4-.4-2.6-1.4-3.6-4-4 2.6-.4 3.6-1.4 4-4Z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
    </svg>
  ),
  mic: (
    <svg width="10" height="10" viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect x="6" y="2.2" width="4" height="7" rx="2" stroke="currentColor" strokeWidth="1.2" />
      <path d="M3.8 7.4a4.2 4.2 0 0 0 8.4 0M8 11.6v2.2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  ),
  arrowUp: (
    <svg width="10" height="10" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M8 12.5v-9M4.2 7.3 8 3.5l3.8 3.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
} as const;

const SUGGESTIONS = [
  { icon: ICON.cal, label: "Prep for my next meeting" },
  { icon: ICON.check, label: "Catch me up on my tasks" },
  { icon: ICON.screen, label: "Prepare a slide deck" },
];

/** Small circular chrome button (hamburger / plus). */
function ChromeButton({ children }: { children: React.ReactNode }) {
  return (
    <span className="grid size-[17px] shrink-0 place-items-center rounded-full bg-white/[0.05] text-[rgba(250,249,245,0.75)] ring-1 ring-white/[0.07]">
      {children}
    </span>
  );
}

export default function HeroPhoneMockup({ className }: { className?: string }) {
  const reduced = useReducedMotion() ?? false;

  return (
    <div
      aria-hidden="true"
      className={cn(
        // hardware frame — graphite with a top-left rim light so it reads as a
        // separate object even against the dark desktop mockup behind it
        "relative isolate w-full overflow-hidden rounded-[30px] p-[5px]",
        className,
      )}
      style={{
        aspectRatio: "9 / 19",
        background:
          "linear-gradient(145deg, #4a4a4e 0%, #26262a 32%, #19191c 62%, #303034 100%)",
        boxShadow:
          "0 0 0 1px rgba(250,249,245,0.22), 0 44px 84px -26px rgba(12,12,12,0.66), 0 16px 34px -14px rgba(12,12,12,0.52)",
      }}
    >
      {/* side buttons */}
      <span className="absolute -left-px top-[21%] h-[4.2%] w-[2px] rounded-full bg-white/[0.22]" />
      <span className="absolute -left-px top-[27.5%] h-[4.2%] w-[2px] rounded-full bg-white/[0.22]" />
      <span className="absolute -right-px top-[24%] h-[7%] w-[2px] rounded-full bg-white/[0.22]" />

      {/* screen — ringed in black so a dark seam separates it from the bezel */}
      <div className="relative flex h-full flex-col overflow-hidden rounded-[25px] bg-[#0d0d0d] px-[9px] pb-[8px] pt-[7px] text-bone ring-1 ring-black/80">
        {/* faint dotted canvas, matching the desktop mockup */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.6]"
          style={{
            backgroundImage: "radial-gradient(rgba(250,249,245,0.05) 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        />

        {/* status bar + dynamic island */}
        <div className="relative flex items-center justify-between px-[6px] pb-[8px] pt-[2px]">
          <span className="text-[7px] font-semibold tracking-[0.02em] text-[rgba(250,249,245,0.9)]">
            9:41
          </span>
          <span className="absolute left-1/2 top-[1px] h-[10px] w-[34px] -translate-x-1/2 rounded-full bg-black ring-1 ring-white/[0.05]" />
          <span className="flex items-center gap-[3px] text-[rgba(250,249,245,0.9)]">
            {/* cellular */}
            <svg width="9" height="7" viewBox="0 0 12 9" fill="currentColor" aria-hidden>
              {[0, 1, 2, 3].map((i) => (
                <rect key={i} x={i * 3} y={6 - i * 2} width="2" height={3 + i * 2} rx="0.8" />
              ))}
            </svg>
            {/* wifi */}
            <svg width="9" height="7" viewBox="0 0 12 9" fill="none" aria-hidden>
              <path d="M1.4 3.2a7 7 0 0 1 9.2 0M3.1 5.1a4.6 4.6 0 0 1 5.8 0M4.8 7a2.1 2.1 0 0 1 2.4 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            {/* battery */}
            <svg width="12" height="7" viewBox="0 0 16 9" fill="none" aria-hidden>
              <rect x="0.6" y="0.6" width="12.6" height="7.8" rx="2" stroke="currentColor" strokeWidth="1" opacity="0.5" />
              <rect x="2" y="2" width="7" height="5" rx="1" fill="currentColor" />
              <path d="M14.6 3.2v2.6a1.5 1.5 0 0 0 0-2.6Z" fill="currentColor" opacity="0.5" />
            </svg>
          </span>
        </div>

        {/* app header: menu · Home · plus */}
        <div className="flex items-center justify-between px-[2px]">
          <div className="flex items-center gap-[5px]">
            <ChromeButton>{ICON.menu}</ChromeButton>
            <span className="flex items-center gap-[4px] rounded-full bg-white/[0.05] py-[4px] pl-[7px] pr-[8px] ring-1 ring-white/[0.07]">
              <span className="text-[rgba(250,249,245,0.6)]">{ICON.folder}</span>
              <span className="text-[7.6px] font-medium leading-none text-[rgba(250,249,245,0.88)]">
                Home
              </span>
            </span>
          </div>
          <ChromeButton>{ICON.plus}</ChromeButton>
        </div>

        {/* centered greeting */}
        <div className="flex flex-1 flex-col items-center justify-center gap-[9px] px-[10px] text-center">
          <span className="grid place-items-center text-[rgba(250,249,245,0.88)]">
            {reduced ? (
              <IconPrem className="size-[22px]" />
            ) : (
              <PremLogoThinking width="22px" height="22px" type="ripple" />
            )}
          </span>
          <span className="font-serif text-[9.6px] italic leading-[1.45] text-[rgba(250,249,245,0.94)]">
            Marco, the tedious one —
            <br />
            pass it here.
          </span>
        </div>

        {/* suggestions */}
        <div className="flex flex-col gap-[8px] px-[6px] pb-[10px]">
          {SUGGESTIONS.map((s) => (
            <span key={s.label} className="flex items-center gap-[6px] text-[rgba(250,249,245,0.62)]">
              {s.icon}
              <span className="text-[7.6px] leading-none">{s.label}</span>
            </span>
          ))}
        </div>

        {/* input box */}
        <div className="rounded-[12px] border border-white/[0.09] bg-white/[0.025] p-[7px] shadow-[0_12px_28px_-18px_rgba(0,0,0,0.8)]">
          <div className="px-[3px] pb-[9px] pt-[2px]">
            <span className="text-[7.4px] leading-none text-[rgba(250,249,245,0.42)]">
              Describe what you need help with...
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-[4px]">
              <span className="grid size-[16px] place-items-center rounded-[5px] text-[rgba(250,249,245,0.5)] ring-1 ring-white/[0.07]">
                {ICON.clip}
              </span>
              <span className="flex items-center gap-[3px] rounded-full px-[6px] py-[4px] text-[rgba(250,249,245,0.6)] ring-1 ring-white/[0.07]">
                {ICON.sparkle}
                <span className="text-[6.8px] leading-none">High</span>
              </span>
            </div>
            <div className="flex items-center gap-[6px]">
              <span className="text-[rgba(250,249,245,0.45)]">{ICON.mic}</span>
              <span className="grid size-[18px] place-items-center rounded-full bg-bone/90 text-ink shadow-[0_3px_10px_-3px_rgba(250,249,245,0.5)]">
                {ICON.arrowUp}
              </span>
            </div>
          </div>
        </div>

        {/* home indicator */}
        <span className="mx-auto mt-[7px] h-[3px] w-[34%] shrink-0 rounded-full bg-white/[0.22]" />
      </div>
    </div>
  );
}
