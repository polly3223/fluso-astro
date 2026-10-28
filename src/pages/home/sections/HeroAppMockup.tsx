import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/utils/styles";
import { IconPrem } from "@/components/IconPrem";
import { PremLogoThinking } from "@/components/PremLogoThinking";

import gmailLogo from "../../../../assets/connectors/gmail.svg?url";
import gcalLogo from "../../../../assets/connectors/google-calendar.svg?url";
import notionLogo from "../../../../assets/connectors/notion.svg?url";
import slackLogo from "../../../../assets/connectors/slack.svg?url";
import gdriveLogo from "../../../../assets/connectors/google-drive.svg?url";

/* ------------------------------------------------------------------ *
 * An abstract, stylized rendering of the Fluso workspace — NOT a 1:1
 * screenshot. Skeleton bars stand in for body copy; only a few
 * evocative strings are real. Pure CSS/JSX so it stays crisp at any
 * size and themes with the rest of the site.
 * ------------------------------------------------------------------ */

/** A neutral skeleton bar — the visual stand-in for "text". */
function Bar({
  w,
  h = 6,
  o = 0.12,
  className,
}: {
  w: number | string;
  h?: number;
  o?: number;
  className?: string;
}) {
  return (
    <span
      className={cn("block rounded-full", className)}
      style={{
        width: typeof w === "number" ? `${w}px` : w,
        height: h,
        background: `rgba(250,249,245,${o})`,
      }}
    />
  );
}

/** Tiny rounded icon tile used in the sidebar nav. */
function NavTile({ children }: { children: React.ReactNode }) {
  return (
    <span className="grid size-[18px] shrink-0 place-items-center rounded-[5px] bg-white/[0.05] text-[rgba(250,249,245,0.55)]">
      {children}
    </span>
  );
}

const ICON = {
  plus: (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path d="M6 1.5v9M1.5 6h9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  ),
  check: (
    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden>
      <rect x="1.5" y="1.5" width="9" height="9" rx="2.5" stroke="currentColor" strokeWidth="1.1" />
      <path d="M3.8 6.1 5.3 7.6 8.2 4.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  doc: (
    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path d="M3 1.5h4l2.5 2.5V10.5H3z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
      <path d="M6.8 1.6V4h2.3" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
    </svg>
  ),
  grid: (
    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden>
      {[1.5, 6.8].map((y) =>
        [1.5, 6.8].map((x) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="3.7" height="3.7" rx="1" stroke="currentColor" strokeWidth="1.05" />
        )),
      )}
    </svg>
  ),
  folder: (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path d="M1.5 3.2c0-.5.4-.9.9-.9h2l1 1.1h4.2c.5 0 .9.4.9.9v4.5c0 .5-.4.9-.9.9H2.4c-.5 0-.9-.4-.9-.9z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
    </svg>
  ),
  lock: (
    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden>
      <rect x="3" y="6.2" width="8" height="6" rx="1.6" stroke="currentColor" strokeWidth="1.1" />
      <path d="M4.7 6.2V4.8a2.3 2.3 0 0 1 4.6 0v1.4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  ),
  gear: (
    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden>
      <circle cx="7" cy="7" r="1.8" stroke="currentColor" strokeWidth="1.1" />
      <path d="M7 1.6v1.5M7 10.9v1.5M12.4 7h-1.5M3.1 7H1.6M10.8 3.2l-1 1M4.2 9.8l-1 1M10.8 10.8l-1-1M4.2 4.2l-1-1" stroke="currentColor" strokeWidth="1.05" strokeLinecap="round" />
    </svg>
  ),
  clip: (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M11.2 7.3 7.5 11a2.2 2.2 0 0 1-3.1-3.1l4.2-4.2a1.4 1.4 0 0 1 2 2L6.3 9.9a.6.6 0 0 1-.9-.9l3.6-3.6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  mic: (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect x="6" y="2.2" width="4" height="7" rx="2" stroke="currentColor" strokeWidth="1.2" />
      <path d="M3.8 7.4a4.2 4.2 0 0 0 8.4 0M8 11.6v2.2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  ),
  enter: (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M12.5 4v2.6a2 2 0 0 1-2 2H4M6.4 6.1 3.6 8.6l2.8 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  chevron: (
    <svg width="9" height="9" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path d="M3 4.5 6 7.5 9 4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  mail: (
    <svg width="11" height="11" viewBox="0 0 14 14" fill="none" aria-hidden>
      <rect x="1.8" y="3" width="10.4" height="8" rx="1.6" stroke="currentColor" strokeWidth="1.1" />
      <path d="m2.4 4 4.6 3.4L11.6 4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  sparkle: (
    <svg width="11" height="11" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path d="M7 1.5c.4 2.6 1.4 3.6 4 4-2.6.4-3.6 1.4-4 4-.4-2.6-1.4-3.6-4-4 2.6-.4 3.6-1.4 4-4Z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
    </svg>
  ),
  cal: (
    <svg width="11" height="11" viewBox="0 0 14 14" fill="none" aria-hidden>
      <rect x="2" y="3" width="10" height="9" rx="1.6" stroke="currentColor" strokeWidth="1.1" />
      <path d="M2 5.6h10M4.5 1.8v2.2M9.5 1.8v2.2" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  ),
  screen: (
    <svg width="11" height="11" viewBox="0 0 14 14" fill="none" aria-hidden>
      <rect x="1.8" y="2.4" width="10.4" height="7" rx="1.4" stroke="currentColor" strokeWidth="1.1" />
      <path d="M5 11.7h4M7 9.4v2.3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  ),
} as const;

const CHIPS = [
  { icon: ICON.cal, label: "Prep for my next meeting" },
  { icon: ICON.check, label: "Catch me up on my tasks" },
  { icon: ICON.screen, label: "Prepare a slide deck" },
  { icon: ICON.mail, label: "Summarize my inbox" },
  { icon: ICON.sparkle, label: "What needs my attention?" },
];

const APP_GLYPHS = [gmailLogo, gcalLogo, notionLogo, slackLogo, gdriveLogo];

// ~10 abstract chat rows of varied width — stand-ins for chat history.
const CHATS = [
  "Offsite agenda draft",
  "Venue shortlist — Lisbon",
  "Budget breakdown",
  "Travel & logistics",
  "Team dinner options",
  "Icebreaker ideas",
  "Workshop schedule",
  "Vendor follow-ups",
  "Packing checklist",
  "Post-event survey",
];

export default function HeroAppMockup() {
  const reduced = useReducedMotion() ?? false;

  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative isolate w-full overflow-hidden rounded-[18px]",
        "mx-auto max-w-[840px]",
        "bg-[#0e0e0e] text-bone",
        "ring-1 ring-white/[0.08]",
      )}
      style={{
        aspectRatio: "16 / 10.2",
        maxHeight: "min(76vh, 760px)",
      }}
    >
      {/* depth: cool top-left wash + warm settle bottom-right */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-inc!"
        style={{
          background: "#0c0c0c",
        }}
      />
      {/* faint dotted canvas, like the real workspace */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.6]"
        style={{
          backgroundImage: "radial-gradient(rgba(250,249,245,0.05) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      <div className="grid h-full grid-cols-[clamp(150px,22%,196px)_1fr]">
        {/* ---------------------------- Sidebar ---------------------------- */}
        <aside className="flex h-full flex-col gap-[13px] border-r border-white/[0.06] bg-white/[0.015] p-[clamp(10px,1.5%,16px)] text-[8.8px] leading-none tracking-[-0.01em]">
          {/* New chat */}
          <div className="flex items-center gap-2 rounded-[9px] bg-white/[0.07] px-2.5 py-2 ring-1 ring-white/[0.06]">
            <NavTile>{ICON.plus}</NavTile>
            <span className="font-medium text-[rgba(250,249,245,0.92)]">New Chat</span>
          </div>

          {/* primary nav */}
          <div className="flex flex-col gap-[3px] px-1">
            {[
              { icon: ICON.check, label: "Tasks" },
              { icon: ICON.doc, label: "Projects" },
              { icon: ICON.grid, label: "Customization" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 py-[4px]">
                <NavTile>{item.icon}</NavTile>
                <span className="text-[rgba(250,249,245,0.7)]">{item.label}</span>
              </div>
            ))}
          </div>

          {/* search field */}
          <div className="mx-1 mt-1 flex items-center gap-2 rounded-[7px] bg-white/[0.03] px-2 py-[7px] ring-1 ring-white/[0.04]">
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden className="text-[rgba(250,249,245,0.4)]">
              <circle cx="5" cy="5" r="3.2" stroke="currentColor" strokeWidth="1.1" />
              <path d="m7.4 7.4 2 2" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
            </svg>
            <span className="text-[rgba(250,249,245,0.4)]">Search...</span>
          </div>

          {/* folder + chat history */}
          <div className="flex min-h-0 flex-1 flex-col gap-[7px] overflow-hidden px-1">
            <div className="mb-0.5 flex items-center gap-2">
              <span className="text-[rgba(250,249,245,0.5)]">{ICON.chevron}</span>
              <NavTile>{ICON.folder}</NavTile>
              <span className="truncate font-medium text-[rgba(250,249,245,0.8)]">Team Building Plans</span>
            </div>
            {CHATS.map((title, i) => (
              <div key={i} className="py-[1px] pl-[26px] pr-1">
                <span className="block truncate text-[rgba(250,249,245,0.62)]">{title}</span>
              </div>
            ))}
          </div>

          {/* user chip */}
          <div className="flex shrink-0 items-center gap-2 rounded-[8px] px-1 py-1.5">
            <span className="grid size-[20px] shrink-0 place-items-center rounded-full bg-white/[0.1] text-[8px] font-medium text-[rgba(250,249,245,0.85)]">
              M
            </span>
            <span className="text-[rgba(250,249,245,0.7)]">Marco</span>
          </div>
        </aside>

        {/* ----------------------------- Main ------------------------------ */}
        <div className="relative flex h-full flex-col px-[clamp(16px,5%,44px)] py-[clamp(12px,3%,24px)]">
          {/* top-right controls */}
          <div className="absolute right-[clamp(12px,3%,22px)] top-[clamp(10px,3%,18px)] flex items-center gap-3 text-[rgba(250,249,245,0.4)]">
            {ICON.lock}
            {ICON.gear}
          </div>

          {/* centered prompt block */}
          <div className="flex flex-1 flex-col justify-center">
            {/* greeting — animated mark + display-italic line */}
            <div className="mb-[clamp(12px,3.2%,22px)] flex items-center gap-3">
              <span className="grid shrink-0 place-items-center text-[rgba(250,249,245,0.88)]">
                {reduced ? (
                  <IconPrem className="size-[clamp(17px,2.3vw,23px)]" />
                ) : (
                  <PremLogoThinking
                    width="clamp(17px, 2.3vw, 23px)"
                    height="clamp(17px, 2.3vw, 23px)"
                    type="ripple"
                  />
                )}
              </span>
              <span data-hero-greeting className="font-serif text-[clamp(14.4px,1.84vw,20px)] italic leading-none text-[rgba(250,249,245,0.94)]">
                Where shall we begin?
              </span>
            </div>

            {/* input box */}
            <div className="rounded-[14px] border border-white/[0.09] bg-white/[0.025] p-[clamp(10px,2.2%,16px)] shadow-[0_18px_40px_-24px_rgba(0,0,0,0.8)]">
              <div className="flex items-center gap-1 px-1 pb-[clamp(14px,4%,26px)] pt-1">
                <span className="text-[clamp(9.6px,1.2vw,11.6px)] leading-none text-[rgba(250,249,245,0.9)]">
                  Plan a two-day team offsite for 14 people
                </span>
                {!reduced && (
                  <motion.span
                    className="ml-0.5 block h-[15px] w-px bg-[rgba(250,249,245,0.6)]"
                    animate={{ opacity: [1, 1, 0, 0] }}
                    transition={{ duration: 1.1, repeat: Infinity, ease: "linear", times: [0, 0.5, 0.5, 1] }}
                  />
                )}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="grid size-[24px] place-items-center rounded-[7px] text-[rgba(250,249,245,0.5)] ring-1 ring-white/[0.07]">
                    {ICON.clip}
                  </span>
                  <span className="flex items-center gap-1.5 rounded-[7px] px-2 py-[5px] text-[rgba(250,249,245,0.6)] ring-1 ring-white/[0.07]">
                    {ICON.folder}
                    <span className="whitespace-nowrap text-[clamp(8px,0.96vw,9.2px)] leading-none">
                      Team Building Plans
                    </span>
                    {ICON.chevron}
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="text-[rgba(250,249,245,0.45)]">{ICON.mic}</span>
                  <span className="grid size-[28px] place-items-center rounded-full bg-bone/90 text-ink shadow-[0_4px_14px_-4px_rgba(250,249,245,0.5)]">
                    {ICON.enter}
                  </span>
                </div>
              </div>
            </div>

            {/* suggestion chips */}
            <div className="mt-[clamp(12px,3%,20px)] flex flex-wrap items-center gap-2">
              {CHIPS.map((c, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-[6px] text-[clamp(8px,0.92vw,9.2px)] leading-none text-[rgba(250,249,245,0.62)] ring-1 ring-white/[0.08]"
                >
                  {c.icon}
                  <span className="whitespace-nowrap">{c.label}</span>
                </span>
              ))}
            </div>

            {/* connect your apps */}
            <div className="mt-[clamp(12px,3%,18px)] flex items-center gap-2.5">
              <div className="flex items-center -space-x-1.5">
                {APP_GLYPHS.map((src, i) => (
                  <span
                    key={i}
                    className="grid size-[20px] place-items-center rounded-full bg-[#171717] ring-1 ring-white/[0.1]"
                  >
                    <img
                      src={src}
                      alt=""
                      width="11"
                      height="11"
                      className={cn(
                        "size-[11px] object-contain opacity-70",
                        src === notionLogo && "opacity-90 brightness-0 invert",
                      )}
                    />
                  </span>
                ))}
              </div>
              <span className="text-[clamp(8px,0.96vw,9.2px)] leading-none text-[rgba(250,249,245,0.55)]">
                Connect your apps
              </span>
              <span className="text-[rgba(250,249,245,0.4)]">{ICON.chevron}</span>
            </div>
          </div>

          {/* recent tasks */}
          <div className="mt-[clamp(12px,3%,22px)]">
            <div className="mb-[clamp(8px,2%,12px)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bar w={68} h={6} o={0.28} />
                <span className="grid size-[14px] place-items-center rounded-full bg-white/[0.06] text-[6.4px] text-[rgba(250,249,245,0.5)]">
                  3
                </span>
              </div>
              <Bar w={48} h={5} o={0.14} />
            </div>
            <div className="grid grid-cols-3 gap-[clamp(6px,1.5%,12px)]">
              {[gmailLogo, gmailLogo, notionLogo].map((src, i) => (
                <div
                  key={i}
                  className={cn(
                    "rounded-[10px] border border-white/[0.06] bg-white/[0.02] p-[clamp(8px,2%,13px)]",
                    i === 2 && "max-[1100px]:hidden",
                  )}
                >
                  <div className="mb-[10px] flex items-center gap-1.5">
                    <img
                      src={src}
                      alt=""
                      width="11"
                      height="11"
                      className={cn(
                        "size-[11px] object-contain opacity-65",
                        src === notionLogo && "opacity-90 brightness-0 invert",
                      )}
                    />
                    <Bar w={26} h={5} o={0.18} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Bar w="92%" h={6} o={0.2} />
                    <Bar w="64%" h={6} o={0.2} />
                  </div>
                  <Bar w={34} h={4} o={0.1} className="mt-[10px]" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
