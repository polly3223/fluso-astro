// Plays a looping demo: the request is typed, sent, Fluso thinks, then the answer appears.
// Where both apps are shown (desktop) they take turns, the window first and then the phone. Where only the phone is
// shown (mobile) it simply repeats. Views and phases are data attributes on each app root; styling is in the components.
// It pauses while off screen or in a hidden tab, and restarts on the copies shown when the layout switches between phone and desktop. For people who prefer reduced motion it does not play: the finished chat is shown.
export function animateChatDemo(host: HTMLElement): () => void {
  const allRoots = [...host.querySelectorAll<HTMLElement>("[data-replica-app], [data-replica-phone]")];

  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    for (const root of allRoots) {
      root.setAttribute("data-view", "chat");
      root.setAttribute("data-phase", "answer");
      root.querySelectorAll("[data-replica-reveal]").forEach((el) => el.setAttribute("data-in", ""));
    }
    return () => {};
  } else if (allRoots.length > 0) {
    const request = allRoots[0]?.dataset["request"] ?? "";

    const onScreen = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) onScreen.add(entry.target);
          else onScreen.delete(entry.target);
        }
      },
      { threshold: 0.25 },
    );
    allRoots.forEach((root) => observer.observe(root));

    // Waits stop at once when the signal is aborted (a layout change), however long they were.
    const sleep = (ms: number, signal: AbortSignal) =>
      new Promise<void>((resolve, reject) => {
        const onAbort = () => {
          clearTimeout(timer);
          reject(signal.reason);
        };
        const timer = setTimeout(() => {
          signal.removeEventListener("abort", onAbort);
          resolve();
        }, ms);
        if (signal.aborted) onAbort();
        else signal.addEventListener("abort", onAbort, { once: true });
      });

    // Copies that are actually displayed at this screen size.
    const displayed = () => allRoots.filter((root) => root.getClientRects().length > 0);

    const setAttr = (root: HTMLElement, name: string, value: string) => root.setAttribute(`data-${name}`, value);
    const clearAttr = (root: HTMLElement, name: string) => root.removeAttribute(`data-${name}`);
    const reset = (root: HTMLElement) => {
      setAttr(root, "view", "home");
      for (const name of ["phase", "send", "typing"]) clearAttr(root, name);
      root.querySelector("[data-typed]")?.replaceChildren();
      root.querySelectorAll("[data-replica-reveal]").forEach((el) => el.removeAttribute("data-in"));
    };

    const demo = async (root: HTMLElement, signal: AbortSignal) => {
      const typed = root.querySelector<HTMLElement>("[data-typed]");
      const reveals = [...root.querySelectorAll<HTMLElement>("[data-replica-reveal]")];
      if (!typed) return;

      const wait = async (ms: number) => {
        await sleep(ms, signal);
        while (onScreen.size === 0 || document.hidden) await sleep(250, signal);
      };
      const set = (name: string, value: string) => setAttr(root, name, value);
      const clear = (name: string) => clearAttr(root, name);
      const show = async (index: number, pause: number) => {
        reveals[index]?.setAttribute("data-in", "");
        await wait(pause);
      };

      reset(root);
      await wait(400);

      set("typing", "on");
      for (let i = 1; i <= request.length; i++) {
        typed.textContent = request.slice(0, i);
        await wait(24 + Math.random() * 30);
      }
      await wait(600);

      set("send", "on");
      await wait(350);
      clear("typing");
      typed.textContent = "";
      set("view", "chat");
      clear("send");
      await wait(700);
      await show(0, 500); // the request bubble

      set("phase", "thinking");
      await wait(2200);
      set("phase", "working");
      await wait(2200);
      set("phase", "answer");
      await wait(400);

      for (let i = 1; i < reveals.length; i++) await show(i, i === 1 ? 700 : 850);
      await wait(4500);

      reset(root); // back to the New Chat screen before the next app takes its turn
      await wait(700);
    };

    // One loop owns playback. Crossing the mobile/desktop breakpoint (Tailwind md, 768px) aborts the current demo,
    // so the loop starts again with the copies now on screen.
    let disposed = false;
    let controller = new AbortController();
    const wide = matchMedia("(min-width: 768px)");
    const restart = () => {
      controller.abort();
      controller = new AbortController();
    };
    wide.addEventListener("change", restart);

    const play = async () => {
      while (!disposed) {
        const { signal } = controller;
        try {
          // Intersection delivery waits for layout; Safari can execute this module before responsive CSS is ready.
          const turn = onScreen.size > 0 && !document.hidden ? displayed() : [];
          if (turn.length === 0) await sleep(100, signal);
          for (const root of turn) await demo(root, signal);
        } catch (error) {
          if (!signal.aborted) throw error;
          allRoots.forEach(reset);
        }
      }
    };

    play().catch(console.error);
    return () => {
      disposed = true;
      controller.abort();
      observer.disconnect();
      wide.removeEventListener("change", restart);
    };
  }
  return () => {};
}
