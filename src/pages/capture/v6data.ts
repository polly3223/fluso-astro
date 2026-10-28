/* v6 — "Flows through your communications" (how-step-5.mp4).
   From a finished report, the user asks to send it to people on Slack / email /
   Teams; Fluso drafts the note in your voice and delivers it through each
   channel, with sent confirmations. Copy verbatim; recipients are Italian. */

export type Channel = "email" | "slack" | "teams";

export const V6 = {
  heading: "Flows through your communications",
  body:
    "Replies, follow-ups, recaps. Drafted in your voice and delivered through email, Slack, and Teams, the same apps your team already lives in.",

  /** The request from the recording (generalised to the three channels). */
  request: "Send this report to the team on Slack, email, and Teams",

  /** The note Fluso drafts — short, in your voice. */
  draft: {
    text: "Sharing the NASDAQ top-performers report — semis led the quarter, biotech had the single biggest gain. Full PDF attached; happy to dig into any sector.",
    signoff: "— sent in your voice",
  },

  /** Where it's delivered — one per channel, each confirms Sent. */
  deliveries: [
    { channel: "email", to: "Marco Busico", detail: "makro@premai.io" },
    { channel: "slack", to: "Jai Singh", detail: "#research" },
    { channel: "teams", to: "Kim Mangiagalli", detail: "Markets" },
  ] as { channel: Channel; to: string; detail: string }[],
} as const;
