// Example content shown in the app replica. Everything here is synthetic: no real customers, files, emails or numbers.
export const REPLICA = {
  user: { name: "Marco", initials: "M" },
  project: "Supplier Review",
  // Older chats already in the project. The chat in the animation (chat.title) is added when the request is sent.
  chats: [{ title: "Supplier Contract Checklist" }, { title: "Q3 Pricing Comparison" }],
  homeChats: [{ title: "Weekly Team Update" }, { title: "Offsite Agenda Draft" }, { title: "Travel and Logistics" }],
  greeting: "Point me at something.",
  // The conversation that plays in the animation (short enough to fit the window).
  chat: {
    title: "Supplier Renewal Risks",
    request: "What should I check when a supplier asks for automatic renewal? Keep it to three points.",
    workedFor: "Worked for 24s",
    tool: "Reviewing supplier contract checklist",
    intro: "Three things to check before you let it renew:",
    points: [
      { lead: "Notice deadline", text: "Note the exact opt-out date and how notice must be given (often 30 to 90 days, in writing)." },
      { lead: "Price changes", text: "Look for automatic increases, and ask for a cap or a right to renegotiate." },
      { lead: "Term length", text: "Confirm how long each renewal lasts, and that you can still terminate for convenience." },
    ],
    sources: { label: "Sources used:", file: "files/supplier-contract-review-checklist.md", note: "(Renewal section)" },
  },
  composerHint: "Type @ to pull in files or a prompt you saved",
  suggestions: [
    { icon: "calendarClock", label: "Prep for my next meeting" },
    { icon: "listChecks", label: "Catch me up on my tasks" },
    { icon: "presentation", label: "Prepare a slide deck" },
  ],
  apps: ["gmail", "calendar", "slack", "notion", "linear"],
  tasks: [
    { title: "Confirm the renewal notice date with the supplier", meta: "", age: "2d ago" },
    { title: "Review the revised contract terms before Friday", meta: "Fri", age: "3d ago" },
    { title: "Reply to the vendor about the updated pricing", meta: "In 3d", age: "3d ago" },
  ],
  phone: {
    actions: [
      { icon: "calendarClock", label: "Prep for my next meeting" },
      { icon: "tasks", label: "Catch me up on my tasks" },
      { icon: "presentation", label: "Prepare a slide deck" },
    ],
    placeholder: "Describe what you need help with...",
  },
} as const;
