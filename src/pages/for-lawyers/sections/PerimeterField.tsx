import { useEffect, useRef } from "react";

const POINTS = 800;
const ACCENT_EVERY = 14;
const RADIUS = 2.6;

export default function PerimeterField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let disposed = false;
    let raf = 0;
    let cleanup = () => {};

    (async () => {
      const THREE = await import("three");
      if (disposed) return;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 50);
      camera.position.z = 7.4;

      const group = new THREE.Group();
      scene.add(group);

      const makeCircleTexture = () => {
        const size = 64;
        const c = document.createElement("canvas");
        c.width = c.height = size;
        const ctx = c.getContext("2d")!;
        const r = size / 2;
        const grad = ctx.createRadialGradient(r, r, 0, r, r, r);
        grad.addColorStop(0, "rgba(255,255,255,1)");
        grad.addColorStop(0.55, "rgba(255,255,255,1)");
        grad.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, size, size);
        return new THREE.CanvasTexture(c);
      };
      const circleTex = makeCircleTexture();

      const bone: number[] = [];
      const accent: number[] = [];
      const golden = Math.PI * (3 - Math.sqrt(5));
      for (let i = 0; i < POINTS; i++) {
        const y = 1 - (i / (POINTS - 1)) * 2;
        const r = Math.sqrt(1 - y * y);
        const theta = golden * i;
        const p = [
          Math.cos(theta) * r * RADIUS,
          y * RADIUS,
          Math.sin(theta) * r * RADIUS,
        ];
        (i % ACCENT_EVERY === 0 ? accent : bone).push(...p);
      }
      const mkPoints = (arr: number[], color: number, size: number, opacity: number) => {
        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.Float32BufferAttribute(arr, 3));
        const mat = new THREE.PointsMaterial({
          color,
          size,
          map: circleTex,
          alphaTest: 0.01,
          transparent: true,
          opacity,
          sizeAttenuation: true,
          depthWrite: false,
        });
        return new THREE.Points(geo, mat);
      };
      const bonePoints = mkPoints(bone, 0xfaf9f5, 0.028, 0.5);
      const accentPoints = mkPoints(accent, 0xa6bece, 0.06, 0.95);
      group.add(bonePoints, accentPoints);

      const shell = new THREE.LineSegments(
        new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(RADIUS, 1)),
        new THREE.LineBasicMaterial({
          color: 0xfaf9f5,
          transparent: true,
          opacity: 0.05,
        }),
      );
      group.add(shell);

      group.rotation.x = 0.28;

      const resize = () => {
        const host = canvas.parentElement;
        if (!host) return;
        const { clientWidth: w, clientHeight: h } = host;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;

        group.position.x = w > 1024 ? 2.4 : 0;
        camera.updateProjectionMatrix();
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(canvas.parentElement!);

      let running = false;
      const tick = (t: number) => {
        group.rotation.y = t * 0.00006;
        group.rotation.z = Math.sin(t * 0.00004) * 0.05;
        renderer.render(scene, camera);
        if (running) raf = requestAnimationFrame(tick);
      };

      if (reduced) {
        renderer.render(scene, camera);
      } else {

        const io = new IntersectionObserver(([entry]) => {
          const next = entry.isIntersecting;
          if (next && !running) {
            running = true;
            raf = requestAnimationFrame(tick);
          } else if (!next && running) {
            running = false;
            cancelAnimationFrame(raf);
          }
        });
        io.observe(canvas);
        const prevCleanup = cleanup;
        cleanup = () => {
          prevCleanup();
          io.disconnect();
        };
      }

      const prevCleanup = cleanup;
      cleanup = () => {
        prevCleanup();
        running = false;
        cancelAnimationFrame(raf);
        ro.disconnect();
        bonePoints.geometry.dispose();
        accentPoints.geometry.dispose();
        (bonePoints.material as InstanceType<typeof THREE.PointsMaterial>).dispose();
        (accentPoints.material as InstanceType<typeof THREE.PointsMaterial>).dispose();
        shell.geometry.dispose();
        (shell.material as InstanceType<typeof THREE.LineBasicMaterial>).dispose();
        circleTex.dispose();
        renderer.dispose();
      };
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className ?? "pointer-events-none absolute inset-0 size-full"}
    />
  );
}
