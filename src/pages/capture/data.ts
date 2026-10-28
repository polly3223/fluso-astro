/* Real copy lifted from how-step-1-capture.mp4 (the Fluso "Capture" flow).
   Texts are kept verbatim from the recording. */

export type SourceKey = "gmail" | "slack" | "tasks";

export type Task = {
  title: string;
  src: SourceKey;
};

export const CAPTURE = {
  inputPlaceholder: "Describe what you need help with...",
  context: "Home",
  sectionTitle: "Needs your attention",
  count: 20,
  addRow: "Add a task...",

  /** The one task that expands to reveal its source + original context. */
  featured: {
    title:
      "Share documents including links, GitHub repos, open sourcing roadmap, and confidential computing doc",
    source: "Email",
    body:
      "Marco Busico committed to sharing documents including links, GitHub repos, open sourcing roadmap, and confidential computing documents from the Highland Europe product deep dive meeting.",
    time: "4h ago",
  },

  /** The rest of the captured list (verbatim copy). */
  tasks: [
    { title: "Resume work on secret management after v1", src: "gmail" },
    { title: "QA for secret management project", src: "slack" },
    { title: "Develop email overall strategy", src: "gmail" },
    { title: "Build Fluso sign-up email automation workflow", src: "slack" },
    { title: "Check with team about demo availability for Prem App", src: "slack" },
    { title: "Prepare full-time offer letter for Jai Singh", src: "gmail" },
    { title: "Push redesigned website to production", src: "slack" },
    { title: "Update LinkedIn header", src: "gmail" },
  ] satisfies Task[],
} as const;
