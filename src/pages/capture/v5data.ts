/* v5 — "Plugs into tools you already use" (how-step-4 block).
   Note: how-step-4-run.mp4 actually shows the report/export flow; this block's
   copy is about INTEGRATIONS, so v5 reproduces Fluso's real "connect your tools"
   screen — one-click connect, no migration, no passwords. Copy verbatim. */

export type ToolKey = "gmail" | "outlook" | "drive" | "calendar" | "slack" | "teams" | "notion" | "linear";

export const V5 = {
  heading: "Plugs into tools you already use",
  body:
    "Gmail, Outlook, Drive, Calendar, Slack, Teams, Notion, Linear. One click each. No migration project. No passwords handed off.",

  /** The eight tools from the copy, in order. Each connects in one click. */
  tools: [
    { key: "gmail", name: "Gmail" },
    { key: "outlook", name: "Outlook" },
    { key: "drive", name: "Drive" },
    { key: "calendar", name: "Calendar" },
    { key: "slack", name: "Slack" },
    { key: "teams", name: "Teams" },
    { key: "notion", name: "Notion" },
    { key: "linear", name: "Linear" },
  ] as { key: ToolKey; name: string }[],

  /** The reassurances — one click, no migration, no passwords. */
  assurances: ["One click each", "No migration project", "No passwords handed off"],
} as const;
