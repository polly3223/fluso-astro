import { useEffect } from "react";

export function useEnterpriseBehavior(): void {
  useEffect(() => {

    const cleanups: Array<() => void> = [];
    const addCleanup = (fn: () => void) => cleanups.push(fn);

    const on = (
      target: EventTarget,
      type: string,
      handler: EventListenerOrEventListenerObject,
      opts?: boolean | AddEventListenerOptions,
    ) => {
      target.addEventListener(type, handler, opts);
      addCleanup(() => target.removeEventListener(type, handler, opts));
    };

    document.querySelectorAll(".nav-dropdown").forEach((dd) => {
      const trigger = dd.querySelector(".nav-dropdown-trigger") as HTMLElement | null;
      const menu = dd.querySelector(".nav-dropdown-menu") as HTMLElement | null;
      if (!trigger || !menu) return;
      on(trigger, "click", (e) => {
        e.stopPropagation();
        const open = !menu.classList.contains("open");
        document
          .querySelectorAll(".nav-dropdown-menu.open")
          .forEach((m) => m.classList.remove("open"));
        if (open) menu.classList.add("open");
        trigger.setAttribute("aria-expanded", open ? "true" : "false");
      });
      menu
        .querySelectorAll("a")
        .forEach((a) => on(a, "click", () => menu.classList.remove("open")));
    });
    on(document, "click", (e) => {
      document.querySelectorAll(".nav-dropdown-menu.open").forEach((m) => {
        const dd = m.closest(".nav-dropdown");
        if (dd && !dd.contains(e.target as Node)) m.classList.remove("open");
      });
    });

    (function () {
      const canvas = document.getElementById(
        "contours-canvas",
      ) as HTMLCanvasElement | null;
      if (!canvas) return;
      const ctx = canvas.getContext("2d", { alpha: false });
      if (!ctx) return;
      const C_BG = "#ffffff";
      const dpr = window.devicePixelRatio || 1;
      let w = 0,
        h = 0;
      const t = 1.2;
      let cols = 0,
        rows = 0;
      const RES = 14;

      function resize() {
        const r = canvas!.getBoundingClientRect();
        w = r.width;
        h = r.height;
        if (w <= 0 || h <= 0) return;
        canvas!.width = Math.round(w * dpr);
        canvas!.height = Math.round(h * dpr);
        ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
        cols = Math.floor(w / RES);
        rows = Math.floor(h / RES);
        ctx!.fillStyle = C_BG;
        ctx!.fillRect(0, 0, w, h);
      }

      function draw() {
        ctx!.fillStyle = C_BG;
        ctx!.fillRect(0, 0, w, h);

        ctx!.strokeStyle = "rgba(12,12,12,0.55)";
        ctx!.lineWidth = 1;

        const p1 = {
          x: w / 2 + Math.sin(t * 0.5) * w * 0.32,
          y: h / 2 + Math.cos(t * 0.3) * h * 0.32,
        };
        const p2 = {
          x: w / 2 + Math.cos(t * 0.4) * w * 0.32,
          y: h / 2 + Math.sin(t * 0.6) * h * 0.32,
        };

        for (let i = 0; i < cols; i++) {
          for (let j = 0; j < rows; j++) {
            const x = i * RES + RES / 2;
            const y = j * RES + RES / 2;

            const d1x = x - p1.x,
              d1y = y - p1.y;
            const dist1 = Math.hypot(d1x, d1y) || 1;
            const d2x = x - p2.x,
              d2y = y - p2.y;
            const dist2 = Math.hypot(d2x, d2y) || 1;

            const fx = d1x / dist1 / dist1 - d2x / dist2 / dist2;
            const fy = d1y / dist1 / dist1 - d2y / dist2 / dist2;

            const angle = Math.atan2(fy, fx) + Math.PI / 2;
            const len = RES * 0.45;
            ctx!.beginPath();
            ctx!.moveTo(x - Math.cos(angle) * len, y - Math.sin(angle) * len);
            ctx!.lineTo(x + Math.cos(angle) * len, y + Math.sin(angle) * len);
            ctx!.stroke();
          }
        }

        ctx!.fillStyle = "rgba(196,99,60,0.95)";
        ctx!.beginPath();
        ctx!.arc(p1.x, p1.y, 3.2, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.fillStyle = "rgba(12,12,12,0.85)";
        ctx!.beginPath();
        ctx!.arc(p2.x, p2.y, 3.2, 0, Math.PI * 2);
        ctx!.fill();
      }

      resize();
      draw();
      on(window, "resize", () => {
        resize();
        draw();
      });
    })();

    return () => {
      for (let i = cleanups.length - 1; i >= 0; i--) {
        try {
          cleanups[i]();
        } catch (e) {

        }
      }
    };
  }, []);
}
