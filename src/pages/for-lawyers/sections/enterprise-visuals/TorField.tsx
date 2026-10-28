import { useEffect, useRef } from "react";
import * as THREE from "three";

function seeded(index: number) {
  const value = Math.sin(index * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
}

function particleTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 32;
  const context = canvas.getContext("2d");
  if (!context) return null;

  context.fillStyle = "#ffffff";
  context.fillRect(9, 9, 14, 14);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export default function TorField() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 40);
    camera.position.set(0, 0.25, 10.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.domElement.className = "block size-full";
    mount.appendChild(renderer.domElement);

    const field = new THREE.Group();
    field.position.x = -0.25;
    field.rotation.x = -0.08;
    scene.add(field);

    const particleCount = 4200;
    const positions = new Float32Array(particleCount * 3);
    const basePositions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const phases = new Float32Array(particleCount);
    const majorRadius = 3.45;
    const tubeRadius = 0.52;
    const pale = new THREE.Color("#d9dfe2");
    const blue = new THREE.Color("#9ebdce");

    for (let index = 0; index < particleCount; index += 1) {
      const majorAngle = seeded(index + 100) * Math.PI * 2;
      const tubeAngle = seeded(index + 200) * Math.PI * 2;
      const density = Math.pow(seeded(index + 300), 0.72);
      const localRadius = tubeRadius * density;
      const irregularity =
        Math.sin(majorAngle * 3.1) * 0.09 +
        Math.sin(majorAngle * 7.3) * 0.035;
      const ringRadius =
        majorRadius + Math.cos(tubeAngle) * localRadius + irregularity;

      const x = Math.cos(majorAngle) * ringRadius;
      const y =
        Math.sin(majorAngle) * ringRadius +
        Math.sin(tubeAngle) * localRadius * 0.28;
      const z =
        Math.sin(tubeAngle) * localRadius * 1.15 +
        (seeded(index + 400) - 0.5) * 0.16;

      positions[index * 3] = x;
      positions[index * 3 + 1] = y;
      positions[index * 3 + 2] = z;
      basePositions[index * 3] = x;
      basePositions[index * 3 + 1] = y;
      basePositions[index * 3 + 2] = z;
      phases[index] = seeded(index + 500) * Math.PI * 2;

      const color = seeded(index + 600) > 0.9 ? blue : pale;
      const brightness = 0.48 + seeded(index + 700) * 0.48;
      colors[index * 3] = color.r * brightness;
      colors[index * 3 + 1] = color.g * brightness;
      colors[index * 3 + 2] = color.b * brightness;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const texture = particleTexture();
    const material = new THREE.PointsMaterial({
      map: texture,
      alphaTest: 0.15,
      color: 0xffffff,
      size: 0.055,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.9,
      vertexColors: true,
      depthWrite: false,
    });
    const particles = new THREE.Points(geometry, material);
    field.add(particles);

    const pointerTarget = new THREE.Vector2(-0.08, 0);
    const onPointerMove = (event: PointerEvent) => {
      const bounds = mount.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      pointerTarget.set(-0.08 + y * 0.04, x * 0.065);
    };
    mount.addEventListener("pointermove", onPointerMove, { passive: true });

    const resize = () => {
      const width = Math.max(1, mount.clientWidth);
      const height = Math.max(1, mount.clientHeight);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);
    resize();

    const clock = new THREE.Clock();
    renderer.setAnimationLoop(() => {
      const elapsed = clock.getElapsedTime();

      if (!reducedMotion) {
        const positionAttribute = geometry.getAttribute(
          "position",
        ) as THREE.BufferAttribute;
        const positionArray = positionAttribute.array as Float32Array;

        for (let index = 0; index < particleCount; index += 1) {
          const offset = index * 3;
          const x = basePositions[offset];
          const y = basePositions[offset + 1];
          const length = Math.hypot(x, y) || 1;
          const wave =
            Math.sin(elapsed * 0.48 + phases[index] + length * 0.7) * 0.025;
          positionArray[offset] = x + (x / length) * wave;
          positionArray[offset + 1] = y + (y / length) * wave;
          positionArray[offset + 2] =
            basePositions[offset + 2] +
            Math.sin(elapsed * 0.4 + phases[index]) * 0.012;
        }
        positionAttribute.needsUpdate = true;

        field.rotation.x += (pointerTarget.x - field.rotation.x) * 0.018;
        field.rotation.y +=
          (pointerTarget.y + elapsed * 0.032 - field.rotation.y) * 0.012;
        field.rotation.z = elapsed * 0.055;
      }

      renderer.render(scene, camera);
    });

    return () => {
      renderer.setAnimationLoop(null);
      resizeObserver.disconnect();
      mount.removeEventListener("pointermove", onPointerMove);
      geometry.dispose();
      material.dispose();
      texture?.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="pointer-events-auto absolute inset-0 overflow-hidden"
    />
  );
}
