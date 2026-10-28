/* v2 — "Tracks outstanding work".
   Illustrates the feature copy: Fluso reads every meeting, thread, and doc,
   pulls out the actual commitments, and stamps each with an OWNER, a DEADLINE,
   and WHERE IT CAME FROM. Copy is verbatim; commitments use the how-1 tasks. */

export type CommitSource = "email" | "slack" | "doc" | "meeting";

export type Commitment = {
  title: string;
  owner: string;
  initials: string;
  deadline: string;
  from: CommitSource;
};

export const V2 = {
  heading: "Tracks outstanding work",
  body:
    "Reads across Gmail, Slack, Drive, and Calendar. Pulls out the actual commitments and stamps each one with an owner, a deadline, and where it came from.",

  /** The sources it reads — "every meeting, thread, and doc" (+ email). */
  sources: ["meeting", "slack", "doc", "email"] as CommitSource[],

  /** The one commitment stamped on-screen, beat by beat. */
  featured: {
    title: "Share documents including links, GitHub repos, open sourcing roadmap, and confidential computing doc",
    owner: "Marco Busico",
    initials: "MB",
    deadline: "Fri",
    from: "email" as CommitSource,
  },

  /** The rest of the tracked commitments (real how-1 tasks, stamped). */
  commitments: [
    { title: "Resume work on secret management after v1", owner: "Jai Singh", initials: "LB", deadline: "Mar 14", from: "slack" },
    { title: "QA for secret management project", owner: "Kim Mangiagalli", initials: "GR", deadline: "Tue", from: "slack" },
    { title: "Prepare full-time offer letter for Jai Singh", owner: "You", initials: "Y", deadline: "Today", from: "email" },
    { title: "Push redesigned website to production", owner: "You", initials: "Y", deadline: "Thu", from: "doc" },
  ] satisfies Commitment[],
} as const;
