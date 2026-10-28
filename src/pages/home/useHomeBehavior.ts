import { useEffect } from "react";
import * as THREE from "three";
import { PREM_DOTS } from "@/components/icons/static/prem-logo-data";

export function useHomeBehavior(): void {
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

    const setTimeoutTracked = (fn: () => void, ms?: number): number => {
      const id = window.setTimeout(fn, ms);
      addCleanup(() => window.clearTimeout(id));
      return id;
    };

    const initGlobe = () => {
      const container = document.getElementById("hero-canvas-container");
      if (!container) return;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
      camera.position.z = 300;

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      container.appendChild(renderer.domElement);

      function sizeRenderer() {
        const rect = container!.getBoundingClientRect();
        const size = Math.max(120, Math.min(rect.width || 0, rect.height || 0) || 320);
        renderer.setSize(size, size, false);
        renderer.domElement.style.width = size + "px";
        renderer.domElement.style.height = size + "px";
        camera.aspect = 1;
        camera.updateProjectionMatrix();
      }
      sizeRenderer();
      let resizeRaf: number;
      const onResize = () => {
        cancelAnimationFrame(resizeRaf);
        resizeRaf = requestAnimationFrame(sizeRenderer);
      };
      on(window, "resize", onResize);

      const INK_COLOR = 0x0c0c0c;
      const GLOBE_RADIUS = 100;

      const globeGroup = new THREE.Group();
      scene.add(globeGroup);

      const geometry = new THREE.IcosahedronGeometry(GLOBE_RADIUS, 3);
      const edgesGeometry = new THREE.EdgesGeometry(geometry);
      const lineMaterial = new THREE.LineBasicMaterial({
        color: INK_COLOR,
        transparent: true,
        opacity: 0.15,
      });
      const wireframeSphere = new THREE.LineSegments(edgesGeometry, lineMaterial);
      globeGroup.add(wireframeSphere);

      const hubs: Record<string, { lat: number; lon: number }> = {
        Docs: { lat: 40.7128, lon: -74.006 },
        Slack: { lat: 51.5074, lon: -0.1278 },
        Email: { lat: 25.2048, lon: 55.2708 },
        Calendar: { lat: 1.3521, lon: 103.8198 },
      };

      function getPositionFromLatLon(lat: number, lon: number, radius: number) {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180);
        const x = -(radius * Math.sin(phi) * Math.cos(theta));
        const z = radius * Math.sin(phi) * Math.sin(theta);
        const y = radius * Math.cos(phi);
        return new THREE.Vector3(x, y, z);
      }

      const hubVectors: Record<string, THREE.Vector3> = {};
      const markerGeometry = new THREE.CircleGeometry(2, 16);
      const markerMaterial = new THREE.MeshBasicMaterial({
        color: INK_COLOR,
        side: THREE.DoubleSide,
      });

      for (const [name, coords] of Object.entries(hubs)) {
        const pos = getPositionFromLatLon(coords.lat, coords.lon, GLOBE_RADIUS);
        hubVectors[name] = pos;
        const marker = new THREE.Mesh(markerGeometry, markerMaterial);
        marker.position.copy(pos);
        marker.lookAt(new THREE.Vector3(0, 0, 0));
        globeGroup.add(marker);
      }

      const arcs: Array<{ line: THREE.Line; length: number; progress: number }> = [];
      const connections = [
        ["Docs", "Slack"],
        ["Slack", "Email"],
        ["Email", "Calendar"],
        ["Calendar", "Slack"],
        ["Docs", "Calendar"],
      ];

      function createArc(startVec: THREE.Vector3, endVec: THREE.Vector3) {
        const mid = startVec.clone().lerp(endVec, 0.5);
        const dist = startVec.distanceTo(endVec);
        mid.normalize();
        const arcHeight = GLOBE_RADIUS + dist * 0.3;
        mid.multiplyScalar(arcHeight);

        const curve = new THREE.QuadraticBezierCurve3(startVec, mid, endVec);
        const points = curve.getPoints(50);
        const pathGeometry = new THREE.BufferGeometry().setFromPoints(points);

        const pathMaterial = new THREE.LineBasicMaterial({
          color: INK_COLOR,
          transparent: true,
          opacity: 0.9,
        });

        const arcLine = new THREE.Line(pathGeometry, pathMaterial);
        arcLine.geometry.setDrawRange(0, 0);
        globeGroup.add(arcLine);

        return { line: arcLine, length: points.length, progress: Math.random() * 2 };
      }

      connections.forEach((conn) =>
        arcs.push(createArc(hubVectors[conn[0]], hubVectors[conn[1]])),
      );

      globeGroup.rotation.x = 0.2;
      globeGroup.rotation.y = -0.5;

      const clock = new THREE.Clock();

      let globeRaf = 0;
      function animate() {
        globeRaf = requestAnimationFrame(animate);
        const delta = clock.getDelta();
        globeGroup.rotation.y += 0.002;

        arcs.forEach((arc) => {
          arc.progress += delta * 0.8;
          if (arc.progress > 2) arc.progress = 0;

          const segmentLength = 15;
          const totalPoints = arc.length;

          let startPoint = Math.floor(arc.progress * totalPoints) - segmentLength;
          let endPoint = Math.floor(arc.progress * totalPoints);

          startPoint = Math.max(0, startPoint);
          endPoint = Math.min(totalPoints, endPoint);

          if (startPoint > totalPoints) arc.line.geometry.setDrawRange(0, 0);
          else arc.line.geometry.setDrawRange(startPoint, endPoint - startPoint);
        });
        renderer.render(scene, camera);
      }
      animate();

      addCleanup(() => {
        cancelAnimationFrame(globeRaf);
        cancelAnimationFrame(resizeRaf);
        geometry.dispose();
        edgesGeometry.dispose();
        lineMaterial.dispose();
        markerGeometry.dispose();
        markerMaterial.dispose();
        arcs.forEach((arc) => {
          arc.line.geometry.dispose();
          const m = arc.line.material;
          if (Array.isArray(m)) m.forEach((mm) => mm.dispose());
          else m.dispose();
        });
        renderer.dispose();
        if (renderer.domElement.parentNode === container) {
          container.removeChild(renderer.domElement);
        }
      });
    };
    initGlobe();

    const initWorldModel = () => {
      const canvas = document.getElementById(
        "worldModelCanvas",
      ) as HTMLCanvasElement | null;
      const container = document.querySelector(".world-graph") as HTMLElement | null;
      if (!canvas || !container) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const section = document.getElementById("connectors");
      if (!section) return;
      const worldMark = container.querySelector(".world-mark") as HTMLElement | null;

      const isDark = !!section.querySelector(".main-card.theme-dark");
      const INK = isDark ? "242, 241, 237" : "12, 12, 12";

      let dpr = window.devicePixelRatio || 1;
      let w = 0,
        h = 0;
      function resize() {
        dpr = window.devicePixelRatio || 1;
        w = canvas!.offsetWidth;
        h = canvas!.offsetHeight;
        canvas!.width = w * dpr;
        canvas!.height = h * dpr;
        ctx!.setTransform(1, 0, 0, 1, 0, 0);
        ctx!.scale(dpr, dpr);
      }
      on(window, "resize", resize);

      if (typeof ResizeObserver !== "undefined") {
        const ro = new ResizeObserver(resize);
        ro.observe(container);
        addCleanup(() => ro.disconnect());
      }
      resize();

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const sourceEls = Array.from(
        container.querySelectorAll(".world-source"),
      ) as HTMLElement[];
      const hubEl = container.querySelector(".world-hub") as HTMLElement | null;

      function getCenter(el: HTMLElement) {
        const cr = container!.getBoundingClientRect();
        const r = el.getBoundingClientRect();
        return {
          x: r.left - cr.left + r.width / 2,
          y: r.top - cr.top + r.height / 2,
        };
      }

      let particles: Array<{
        sourceIdx: number;
        age: number;
        duration: number;
        jitter: number;
      }> = [];
      let logoNodes: Array<{ index: number; age: number }> = [];
      let lastEmit = 0;
      let lastTime = performance.now();
      let elapsed = 0;

      const RESET_AT = 30000;
      const EMIT_INTERVAL = 460;
      const PARTICLE_DURATION = 1500;
      const LOGO_VIEWBOX_WIDTH = 313;
      const LOGO_VIEWBOX_HEIGHT = 324;
      const logoOrder = PREM_DOTS.map((_, index) => index).sort(
        (a, b) => PREM_DOTS[a].dist - PREM_DOTS[b].dist,
      );
      const logoEdges = PREM_DOTS.flatMap((dot, index) => {
        const nearest = PREM_DOTS
          .map((candidate, candidateIndex) => ({
            index: candidateIndex,
            distance: Math.hypot(
              candidate.cx - dot.cx,
              candidate.cy - dot.cy,
            ),
          }))
          .filter((candidate) => candidate.index !== index)
          .sort((a, b) => a.distance - b.distance)
          .slice(0, 2);

        return nearest
          .filter((candidate) => index < candidate.index)
          .map((candidate) => [index, candidate.index] as const);
      });

      function reset() {
        particles = [];
        logoNodes = [];
        elapsed = 0;
        lastEmit = performance.now() - EMIT_INTERVAL + 250;
      }

      function emitEvent() {
        if (!sourceEls.length) return;
        const idx = Math.floor(Math.random() * sourceEls.length);
        particles.push({
          sourceIdx: idx,
          age: 0,
          duration: PARTICLE_DURATION + (Math.random() - 0.5) * 280,
          jitter: (Math.random() - 0.5) * 18,
        });

        const el = sourceEls[idx];
        el.classList.remove("pulse");
        void el.offsetWidth;
        el.classList.add("pulse");
      }

      function pulseWorldMark() {
        if (!worldMark) return;
        worldMark.classList.remove("is-hit");
        void worldMark.offsetWidth;
        worldMark.classList.add("is-hit");
      }

      function revealNextLogoNode() {
        if (logoNodes.length >= logoOrder.length) return;
        logoNodes.push({ index: logoOrder[logoNodes.length], age: 0 });
      }

      let isVisible = false;
      const obs = new IntersectionObserver(
        (entries) => {
          isVisible = entries[0].isIntersecting;
          if (isVisible) reset();
        },
        { threshold: 0.15 },
      );
      obs.observe(section);
      addCleanup(() => obs.disconnect());

      function easeInOut(t: number) {

        return t * t * t * (t * (t * 6 - 15) + 10);
      }
      let worldRaf = 0;
      function draw(now: number) {
        worldRaf = requestAnimationFrame(draw);
        const dt = now - lastTime;
        lastTime = now;
        if (!isVisible) return;

        if (reducedMotion && logoNodes.length === 0) {
          logoNodes = logoOrder.map((index) => ({ index, age: 1000 }));
        } else if (!reducedMotion) {
          elapsed += dt;
          if (elapsed > RESET_AT) reset();
          if (now - lastEmit > EMIT_INTERVAL) {
            emitEvent();
            lastEmit = now;
          }
        }

        ctx!.clearRect(0, 0, w, h);

        const sourceCenters = sourceEls.map(getCenter);
        const hubC = getCenter(hubEl!);

        ctx!.lineWidth = 1;
        ctx!.setLineDash([2.5, 5]);
        ctx!.strokeStyle = `rgba(${INK}, 1)`;
        ctx!.globalAlpha = isDark ? 0.22 : 0.16;
        sourceCenters.forEach((s) => {
          const sx = s.x + 26;
          const sy = s.y;
          const cpx = sx + (hubC.x - sx) * 0.5;
          const cpy = sy;
          ctx!.beginPath();
          ctx!.moveTo(sx, sy);
          ctx!.quadraticCurveTo(cpx, cpy, hubC.x, hubC.y);
          ctx!.stroke();
        });
        ctx!.setLineDash([]);

        particles = particles.filter((p) => {
          p.age += dt;
          if (p.age >= p.duration) {
            revealNextLogoNode();
            pulseWorldMark();
            return false;
          }
          const t = easeInOut(Math.min(1, p.age / p.duration));
          const s = sourceCenters[p.sourceIdx];
          const sx = s.x + 26;
          const sy = s.y;
          const cpx = sx + (hubC.x - sx) * 0.5;
          const cpy = sy + p.jitter;
          const u = 1 - t;
          const px = u * u * sx + 2 * u * t * cpx + t * t * hubC.x;
          const py = u * u * sy + 2 * u * t * cpy + t * t * hubC.y;

          const halo = ctx!.createRadialGradient(px, py, 0, px, py, 14);
          halo.addColorStop(0, `rgba(${INK}, ${isDark ? 0.55 : 0.35})`);
          halo.addColorStop(1, `rgba(${INK}, 0)`);
          ctx!.fillStyle = halo;
          ctx!.globalAlpha = 1;
          ctx!.beginPath();
          ctx!.arc(px, py, 14, 0, Math.PI * 2);
          ctx!.fill();

          ctx!.beginPath();
          ctx!.arc(px, py, 2.6, 0, Math.PI * 2);
          ctx!.fillStyle = `rgba(${INK}, 1)`;
          ctx!.globalAlpha = 0.95;
          ctx!.fill();
          return true;
        });
        ctx!.globalAlpha = 1;

        const markRect = worldMark?.getBoundingClientRect();
        const markWidth = markRect?.width ?? Math.min(w * 0.3, 176);
        const markHeight = markRect?.height ?? markWidth * (324 / 313);
        const markLeft = hubC.x - markWidth / 2;
        const markTop = hubC.y - markHeight / 2;
        const sx = markWidth / LOGO_VIEWBOX_WIDTH;
        const sy = markHeight / LOGO_VIEWBOX_HEIGHT;
        const visible = new Set(logoNodes.map((node) => node.index));

        logoEdges.forEach(([from, to]) => {
          if (!visible.has(from) || !visible.has(to)) return;
          const a = PREM_DOTS[from];
          const b = PREM_DOTS[to];
          ctx!.beginPath();
          ctx!.moveTo(markLeft + a.cx * sx, markTop + a.cy * sy);
          ctx!.lineTo(markLeft + b.cx * sx, markTop + b.cy * sy);
          ctx!.strokeStyle = `rgba(${INK}, 1)`;
          ctx!.lineWidth = 0.65;
          ctx!.globalAlpha = isDark ? 0.24 : 0.18;
          ctx!.stroke();
        });

        logoNodes.forEach((node) => {
          node.age += dt;
          const reveal = easeInOut(Math.min(1, node.age / 680));
          const dot = PREM_DOTS[node.index];
          const x = markLeft + dot.cx * sx;
          const y = markTop + dot.cy * sy;
          const radius = (1.5 + Math.min(dot.dist / 145, 1) * 0.85) * reveal;

          ctx!.beginPath();
          ctx!.arc(x, y, radius, 0, Math.PI * 2);
          ctx!.fillStyle = `rgba(${INK}, 1)`;
          ctx!.globalAlpha = (isDark ? 0.9 : 0.78) * reveal;
          ctx!.fill();
        });
        ctx!.globalAlpha = 1;

        ctx!.globalAlpha = 1;
      }
      worldRaf = requestAnimationFrame(draw);
      addCleanup(() => cancelAnimationFrame(worldRaf));
    };
    initWorldModel();

    const initWorldStats = () => {
      const nums = document.querySelectorAll(
        "#connectors .world-stat-num",
      ) as NodeListOf<HTMLElement>;
      if (!nums.length) return;
      const statRafs: number[] = [];
      let played = false;
      function play() {
        if (played) return;
        played = true;
        nums.forEach((el) => {
          const target = parseInt(el.getAttribute("data-target") || "0", 10);
          const start = performance.now();
          const duration = 1800;
          function tick(now: number) {
            const t = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            el.textContent = Math.floor(target * eased).toLocaleString();
            if (t < 1) statRafs.push(requestAnimationFrame(tick));
          }
          statRafs.push(requestAnimationFrame(tick));
        });
      }
      const connectorsEl = document.getElementById("connectors");
      if (connectorsEl) {
        const obs = new IntersectionObserver(
          (entries) => {
            if (entries[0].isIntersecting) play();
          },
          { threshold: 0.15 },
        );
        obs.observe(connectorsEl);
        addCleanup(() => obs.disconnect());
      }

      setTimeoutTracked(() => {
        if (!played) {
          nums.forEach((el) => {
            const target = parseInt(el.getAttribute("data-target") || "0", 10);
            el.textContent = target.toLocaleString();
          });
          played = true;
        }
      }, 2500);
      addCleanup(() => statRafs.forEach((id) => cancelAnimationFrame(id)));
    };
    initWorldStats();

    (function initScrollReveals() {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      document.querySelectorAll("section[id] .card-header > div").forEach((el) => {
        if (el.closest("#hero")) return;
        el.classList.add("scroll-reveal");
      });

      document
        .querySelectorAll(
          ".bento, .privacy-grid, .anywhere-points, .faq-grid, .feature-grid, .step-grid",
        )
        .forEach((el) => el.classList.add("scroll-stagger"));

      if (!("IntersectionObserver" in window)) {
        document
          .querySelectorAll(".scroll-reveal, .scroll-stagger")
          .forEach((el) => el.classList.add("is-in"));
        return;
      }

      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-in");
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -4% 0px" },
      );

      document
        .querySelectorAll(".scroll-reveal, .scroll-stagger")
        .forEach((el) => obs.observe(el));
      addCleanup(() => obs.disconnect());

      setTimeoutTracked(() => {
        document
          .querySelectorAll(".scroll-reveal, .scroll-stagger")
          .forEach((el) => el.classList.add("is-in"));
      }, 2000);
    })();

    document.querySelectorAll(".nav-dropdown").forEach((dd) => {
      const trigger = dd.querySelector(".nav-dropdown-trigger") as HTMLElement | null;
      const menu = dd.querySelector(".nav-dropdown-menu") as HTMLElement | null;
      if (!trigger || !menu) return;
      on(trigger, "click", (e) => {
        e.stopPropagation();
        const willOpen = !menu.classList.contains("open");
        document
          .querySelectorAll(".nav-dropdown-menu.open")
          .forEach((m) => m.classList.remove("open"));
        if (willOpen) menu.classList.add("open");
        trigger.setAttribute("aria-expanded", willOpen ? "true" : "false");
      });
      menu.querySelectorAll("a").forEach((a) => {
        on(a, "click", () => {
          menu.classList.remove("open");
          trigger.setAttribute("aria-expanded", "false");
        });
      });
    });
    on(document, "click", (e) => {
      document.querySelectorAll(".nav-dropdown-menu.open").forEach((m) => {
        const dd = m.closest(".nav-dropdown");
        if (dd && !dd.contains(e.target as Node)) m.classList.remove("open");
      });
    });

    const scroller = document.querySelector(".scroller") as HTMLElement | null;
    const sections = Array.from(
      document.querySelectorAll(".section-wrapper"),
    ) as HTMLElement[];

    document
      .querySelectorAll(".local-nav a, .hero-integrations-list a")
      .forEach((anchor) => {
        on(anchor, "click", function (this: HTMLAnchorElement, e) {
          const href = this.getAttribute("href");
          if (!href || !href.startsWith("#")) return;
          const targetId = href.substring(1);
          const targetSection = document.getElementById(targetId);
          if (!targetSection) return;
          e.preventDefault();
          targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      });

    function updateActiveLink() {
      let current = sections[0] ? sections[0].id : "";
      const probe = window.innerHeight * 0.35;
      for (const section of sections) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= probe) current = section.id;
      }
      document.querySelectorAll(".local-nav a").forEach((a) => {
        const isActive = a.getAttribute("href") === "#" + current;
        a.classList.toggle("active", isActive);
      });
    }
    on(window, "scroll", updateActiveLink, { passive: true });
    if (scroller) on(scroller, "scroll", updateActiveLink, { passive: true });
    updateActiveLink();

    (function initHowItWorks() {
      const stage = document.querySelector("[data-how-stage]") as HTMLElement | null;
      if (!stage) return;
      if (stage.dataset.reactManaged === "true") return;

      const tabs = Array.from(
        stage.querySelectorAll("[data-how-tab]"),
      ) as HTMLElement[];
      const panes = Array.from(
        stage.querySelectorAll("[data-how-pane]"),
      ) as HTMLElement[];
      if (!tabs.length || !panes.length) return;

      const reduceMotionMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
      const DEFAULT_STEP_MS = 8000;
      const MIN_STEP_MS = 6000;
      const MAX_STEP_MS = 32000;
      let currentIndex = 0;
      let advanceTimer: number | null = null;
      let isInView = false;
      let userPaused = false;

      function getStepDuration(pane: HTMLElement | undefined) {
        if (!pane) return DEFAULT_STEP_MS;
        const explicit = parseInt(pane.dataset.duration || "", 10);
        if (!Number.isNaN(explicit) && explicit > 0) {
          return Math.min(Math.max(explicit, MIN_STEP_MS), MAX_STEP_MS);
        }
        if (pane.dataset.hasVideo === "true") {
          const video = pane.querySelector("video") as HTMLVideoElement | null;
          const dur = video && Number.isFinite(video.duration) ? video.duration : 0;
          if (dur > 0) {

            const ms = Math.ceil(dur * 1000) + 200;
            return Math.min(Math.max(ms, MIN_STEP_MS), MAX_STEP_MS);
          }
        }
        return DEFAULT_STEP_MS;
      }

      function clearAdvance() {
        if (advanceTimer) {
          clearTimeout(advanceTimer);
          advanceTimer = null;
        }
      }

      function setPlaying(playing: boolean) {
        stage!.dataset.playing = playing ? "true" : "false";
      }

      function syncVideo(pane: HTMLElement, shouldPlay: boolean) {
        const video = pane.querySelector("video") as HTMLVideoElement | null;
        if (!video) return;
        if (pane.dataset.hasVideo !== "true") {
          try {
            video.pause();
          } catch (e) {

          }
          return;
        }
        if (shouldPlay) {
          try {
            video.currentTime = 0;
            const p = video.play();
            if (p && typeof p.catch === "function") p.catch(() => {});
          } catch (e) {

          }
        } else {
          try {
            video.pause();
          } catch (e) {

          }
        }
      }

      function activate(index: number, opts?: { focus?: boolean }) {
        const o = opts || {};
        const safe = ((index % tabs.length) + tabs.length) % tabs.length;
        currentIndex = safe;

        tabs.forEach((tab, i) => {
          const active = i === safe;
          tab.classList.toggle("is-active", active);
          tab.setAttribute("aria-selected", active ? "true" : "false");
          tab.setAttribute("tabindex", active ? "0" : "-1");
        });

        panes.forEach((pane, i) => {
          const active = i === safe;
          pane.classList.toggle("is-active", active);
          if (active) pane.removeAttribute("hidden");
          else pane.setAttribute("hidden", "");
          syncVideo(pane, active);
        });

        setPlaying(false);
        void stage!.offsetWidth;
        if (isInView && !userPaused && !reduceMotionMQ.matches) {
          startStep();
        } else {
          clearAdvance();
        }

        if (o.focus) tabs[safe].focus();
      }

      function startStep() {
        clearAdvance();
        const duration = getStepDuration(panes[currentIndex]);
        stage!.style.setProperty("--step-duration", duration + "ms");
        setPlaying(true);
        syncVideo(panes[currentIndex], true);
        advanceTimer = window.setTimeout(() => {
          activate(currentIndex + 1);
        }, duration);
      }

      panes.forEach((pane) => {
        const v = pane.querySelector("video") as HTMLVideoElement | null;
        if (!v) return;
        on(v, "loadedmetadata", () => {
          if (panes[currentIndex] === pane && stage!.dataset.playing === "true") {
            startStep();
          }
        });
      });

      function pause() {
        userPaused = true;
        clearAdvance();
        setPlaying(false);
      }

      function resume() {
        userPaused = false;
        if (isInView && !reduceMotionMQ.matches) {
          startStep();
        }
      }

      tabs.forEach((tab, i) => {
        on(tab, "click", () => {
          if (i === currentIndex) return;
          userPaused = false;
          activate(i);
        });
        on(tab, "keydown", (ev) => {
          const e = ev as KeyboardEvent;
          const k = e.key;
          if (k === "ArrowDown" || k === "ArrowRight") {
            e.preventDefault();
            userPaused = false;
            activate(i + 1, { focus: true });
          } else if (k === "ArrowUp" || k === "ArrowLeft") {
            e.preventDefault();
            userPaused = false;
            activate(i - 1, { focus: true });
          } else if (k === "Home") {
            e.preventDefault();
            userPaused = false;
            activate(0, { focus: true });
          } else if (k === "End") {
            e.preventDefault();
            userPaused = false;
            activate(tabs.length - 1, { focus: true });
          }
        });
      });

      const screen = stage.querySelector(".how-screen") as HTMLElement | null;
      if (screen) {
        on(screen, "mouseenter", pause);
        on(screen, "mouseleave", resume);
      }

      if ("IntersectionObserver" in window) {
        const obs = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              isInView = entry.isIntersecting;
              if (isInView && !userPaused && !reduceMotionMQ.matches) {
                startStep();
              } else {
                clearAdvance();
                setPlaying(false);
                syncVideo(panes[currentIndex], false);
              }
            });
          },
          { threshold: 0.32 },
        );
        obs.observe(stage);
        addCleanup(() => obs.disconnect());
      } else {
        isInView = true;
      }

      if (reduceMotionMQ.addEventListener) {
        const onMQ = () => {
          if (reduceMotionMQ.matches) {
            clearAdvance();
            setPlaying(false);
          } else if (isInView && !userPaused) {
            startStep();
          }
        };
        reduceMotionMQ.addEventListener("change", onMQ);
        addCleanup(() => reduceMotionMQ.removeEventListener("change", onMQ));
      }

      on(document, "visibilitychange", () => {
        if (document.hidden) {
          clearAdvance();
          setPlaying(false);
          syncVideo(panes[currentIndex], false);
        } else if (isInView && !userPaused && !reduceMotionMQ.matches) {
          startStep();
        }
      });

      addCleanup(() => {
        clearAdvance();
        panes.forEach((pane) => syncVideo(pane, false));
      });

      activate(0);
    })();

    (function initPlatformCta() {
      const BASE =
        "https://fluso-releases.s3.amazonaws.com/desktop/prod/";
      const WIN_ICON_PATH =
        '<path d="M3 5.7l8.2-1.12V11.5H3V5.7zm0 6.8h8.2v6.92L3 18.3v-5.8zM12.3 4.42L21 3.2v8.3h-8.7V4.42zm0 8.08H21v8.3l-8.7-1.22V12.5z"/>';
      const ua = navigator.userAgent || "";
      const ctas = document.querySelectorAll("[data-platform-cta]");
      if (!ctas.length) return;

      const apply = (href: string, label: string, iconPath?: string) => {
        ctas.forEach((cta) => {
          cta.setAttribute("href", href);
          if (iconPath) {
            const icon = cta.querySelector("[data-platform-icon]");
            if (icon) icon.innerHTML = iconPath;
          }
          if (label) {
            const el = cta.querySelector("[data-platform-label]");
            if (el) el.textContent = label;
          }
        });
      };

      if (/Windows|Win64|Win32|WOW64/i.test(ua)) {
        apply(BASE + "Fluso-latest-windows.exe", "Download for Windows", WIN_ICON_PATH);
        return;
      }
      if (!/Mac/i.test(ua)) return;

      const setMac = (intel: boolean) =>
        apply(
          BASE + (intel ? "Fluso-latest-x64.dmg" : "Fluso-latest-arm64.dmg"),
          intel ? "Download for Mac (Intel)" : "Download for Mac",
        );

      const webglIsIntel = (): boolean => {
        try {
          const gl = document
            .createElement("canvas")
            .getContext("webgl") as WebGLRenderingContext | null;
          if (!gl) return false;
          const dbg = gl.getExtension("WEBGL_debug_renderer_info");
          const r = dbg
            ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL))
            : "";
          return /Intel|AMD|Radeon|NVIDIA/i.test(r);
        } catch {
          return false;
        }
      };

      const uaData = (navigator as unknown as {
        userAgentData?: {
          getHighEntropyValues?: (h: string[]) => Promise<{ architecture?: string }>;
        };
      }).userAgentData;

      if (uaData?.getHighEntropyValues) {
        uaData
          .getHighEntropyValues(["architecture"])
          .then((v) => {
            const arch = v?.architecture;
            if (arch === "x86") setMac(true);
            else if (arch === "arm") setMac(false);
            else setMac(webglIsIntel());
          })
          .catch(() => setMac(webglIsIntel()));
      } else {
        setMac(webglIsIntel());
      }
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
