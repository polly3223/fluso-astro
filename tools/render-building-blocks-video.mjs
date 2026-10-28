import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join } from "node:path";

const width = 1920;
const height = 1080;
const fps = 24;
const duration = 8;
const frames = fps * duration;
const frameDir = "/private/tmp/fluso-building-blocks-frames";
const output = "assets/video/fluso-building-blocks-hero.mp4";
const poster = "assets/video/fluso-building-blocks-poster.png";
const chrome = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const blocks = [
  {
    label: "Automations",
    x: 930,
    y: 230,
    size: 150,
    depth: 84,
    h: 118,
    accent: "#6e8063",
    delay: 0.04,
    icon: "nodes",
  },
  {
    label: "Domain Skills",
    x: 720,
    y: 430,
    size: 180,
    depth: 100,
    h: 140,
    accent: "#9f5a31",
    delay: 0.2,
    icon: "spark",
  },
  {
    label: "Enterprise Connectors",
    x: 1085,
    y: 585,
    size: 188,
    depth: 104,
    h: 148,
    accent: "#405b69",
    delay: 0.36,
    icon: "grid",
  },
  {
    label: "Agent Sandbox",
    x: 840,
    y: 790,
    size: 170,
    depth: 96,
    h: 134,
    accent: "#6888c1",
    delay: 0.52,
    icon: "terminal",
  },
];

function clamp(value, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}

function easeOutCubic(value) {
  const t = clamp(value);
  return 1 - Math.pow(1 - t, 3);
}

function easeInOutSine(value) {
  return -(Math.cos(Math.PI * clamp(value)) - 1) / 2;
}

function loop(value) {
  return value - Math.floor(value);
}

function points(list) {
  return list.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
}

function bezierPoint(p0, p1, p2, p3, t) {
  const mt = 1 - t;
  const mt2 = mt * mt;
  const t2 = t * t;
  return {
    x: mt2 * mt * p0.x + 3 * mt2 * t * p1.x + 3 * mt * t2 * p2.x + t2 * t * p3.x,
    y: mt2 * mt * p0.y + 3 * mt2 * t * p1.y + 3 * mt * t2 * p2.y + t2 * t * p3.y,
  };
}

function svgText(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function icon(type, cx, cy, scale = 1) {
  const stroke = "#f8f8f6";
  if (type === "nodes") {
    return `
      <g stroke="${stroke}" stroke-width="${5 * scale}" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.94">
        <path d="M ${cx - 22 * scale} ${cy + 8 * scale} C ${cx - 4 * scale} ${cy - 16 * scale}, ${cx + 9 * scale} ${cy + 26 * scale}, ${cx + 28 * scale} ${cy - 2 * scale}"/>
        <circle cx="${cx - 24 * scale}" cy="${cy + 9 * scale}" r="${7 * scale}" fill="${stroke}" stroke="none"/>
        <circle cx="${cx + 1 * scale}" cy="${cy - 12 * scale}" r="${7 * scale}" fill="${stroke}" stroke="none"/>
        <circle cx="${cx + 29 * scale}" cy="${cy - 3 * scale}" r="${7 * scale}" fill="${stroke}" stroke="none"/>
      </g>`;
  }

  if (type === "spark") {
    return `
      <g fill="${stroke}" opacity="0.94">
        <path d="M ${cx} ${cy - 33 * scale} L ${cx + 10 * scale} ${cy - 7 * scale} L ${cx + 36 * scale} ${cy} L ${cx + 10 * scale} ${cy + 8 * scale} L ${cx} ${cy + 34 * scale} L ${cx - 10 * scale} ${cy + 8 * scale} L ${cx - 36 * scale} ${cy} L ${cx - 10 * scale} ${cy - 7 * scale} Z"/>
        <circle cx="${cx + 42 * scale}" cy="${cy - 28 * scale}" r="${5 * scale}"/>
      </g>`;
  }

  if (type === "grid") {
    let cells = "";
    for (let row = 0; row < 2; row += 1) {
      for (let col = 0; col < 3; col += 1) {
        cells += `<rect x="${cx - 34 * scale + col * 24 * scale}" y="${cy - 20 * scale + row * 24 * scale}" width="${16 * scale}" height="${16 * scale}" rx="${3 * scale}" fill="${stroke}" opacity="${0.9 - row * 0.08}"/>`;
      }
    }
    return `<g transform="skewY(-22)">${cells}</g>`;
  }

  return `
    <g stroke="${stroke}" stroke-width="${5 * scale}" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.94">
      <path d="M ${cx - 38 * scale} ${cy - 22 * scale} H ${cx + 38 * scale} V ${cy + 24 * scale} H ${cx - 38 * scale} Z"/>
      <path d="M ${cx - 20 * scale} ${cy - 3 * scale} L ${cx - 6 * scale} ${cy + 8 * scale} L ${cx - 20 * scale} ${cy + 19 * scale}"/>
      <path d="M ${cx + 4 * scale} ${cy + 18 * scale} H ${cx + 24 * scale}"/>
    </g>`;
}

function cube(block, t) {
  const appear = easeOutCubic((t - block.delay) / 0.2);
  const float = Math.sin((t * Math.PI * 2) + block.delay * 10) * 8;
  const lift = (1 - appear) * 46;
  const cx = block.x;
  const cy = block.y + float + lift;
  const w = block.size;
  const d = block.depth;
  const h = block.h;

  const top = [
    [cx, cy - d],
    [cx + w, cy - d / 2],
    [cx, cy],
    [cx - w, cy - d / 2],
  ];
  const left = [
    [cx - w, cy - d / 2],
    [cx, cy],
    [cx, cy + h],
    [cx - w, cy + h - d / 2],
  ];
  const right = [
    [cx + w, cy - d / 2],
    [cx, cy],
    [cx, cy + h],
    [cx + w, cy + h - d / 2],
  ];

  const labelW = Math.max(210, block.label.length * 17 + 34);
  const labelX = cx - labelW * 0.42;
  const labelY = cy - d - 72;
  const labelOpacity = clamp((t - block.delay - 0.08) / 0.14);

  return `
    <g opacity="${appear.toFixed(3)}">
      <ellipse cx="${cx}" cy="${cy + h - 5}" rx="${w * 0.72}" ry="${h * 0.26}" fill="#000000" opacity="0.22"/>
      <polygon points="${points(left)}" fill="#1832d9" stroke="#f8f8f6" stroke-width="3"/>
      <polygon points="${points(right)}" fill="#1737ff" stroke="#f8f8f6" stroke-width="3"/>
      <polygon points="${points(top)}" fill="#2444ff" stroke="#f8f8f6" stroke-width="3"/>
      <path d="M ${cx} ${cy} V ${cy + h}" stroke="#f8f8f6" stroke-width="3" opacity="0.9"/>
      <path d="M ${cx - w * 0.62} ${cy + h - d * 0.34} C ${cx - w * 0.1} ${cy + h - d * 0.18}, ${cx + w * 0.44} ${cy + h - d * 0.8}, ${cx + w * 0.68} ${cy + h - d * 0.38}" stroke="${block.accent}" stroke-width="6" fill="none" opacity="0.75"/>
      <circle cx="${cx - w * 0.58}" cy="${cy + h - d * 0.34}" r="7" fill="#f8f8f6"/>
      ${icon(block.icon, cx - w * 0.38, cy - d * 0.56, block.size / 190)}
      <g opacity="${labelOpacity.toFixed(3)}" transform="translate(${labelX.toFixed(2)} ${labelY.toFixed(2)}) rotate(17)">
        <path d="M 0 0 H ${labelW} L ${labelW + 18} 48 H 18 Z" fill="#f8f8f6"/>
        <text x="22" y="32" font-family="Helvetica Neue, Arial, sans-serif" font-size="31" font-weight="500" fill="#111214">${svgText(block.label)}</text>
      </g>
    </g>`;
}

function gridLines(t) {
  const shift = (t * 54) % 84;
  let lines = "";
  for (let i = -12; i < 32; i += 1) {
    const x = i * 112 - shift;
    lines += `<path d="M ${x} -140 L ${x + 980} 360 L ${x + 1900} 20" stroke="#ffffff" stroke-opacity="0.055" stroke-width="2"/>`;
    lines += `<path d="M ${x} 1220 L ${x + 980} 720 L ${x + 1900} 1060" stroke="#ffffff" stroke-opacity="0.052" stroke-width="2"/>`;
  }

  for (let i = -8; i < 26; i += 1) {
    const x = i * 134 + shift * 0.7;
    lines += `<path d="M ${x} -80 L ${x - 1040} 470 L ${x - 1860} 140" stroke="#ffffff" stroke-opacity="0.045" stroke-width="2"/>`;
    lines += `<path d="M ${x} 1160 L ${x - 1040} 610 L ${x - 1860} 940" stroke="#ffffff" stroke-opacity="0.042" stroke-width="2"/>`;
  }

  for (let y = 100; y < 1050; y += 128) {
    lines += `<path d="M 180 ${y} C 520 ${y - 94}, 912 ${y - 94}, 1280 ${y + 24} S 1760 ${y + 110}, 2020 ${y - 18}" stroke="#ffffff" stroke-opacity="0.032" stroke-width="1.4"/>`;
  }

  return lines;
}

function connections(t) {
  const paths = [
    {
      d: "M 930 296 C 770 320, 640 350, 720 484",
      p0: { x: 930, y: 296 },
      p1: { x: 770, y: 320 },
      p2: { x: 640, y: 350 },
      p3: { x: 720, y: 484 },
    },
    {
      d: "M 720 570 C 866 510, 980 512, 1085 646",
      p0: { x: 720, y: 570 },
      p1: { x: 866, y: 510 },
      p2: { x: 980, y: 512 },
      p3: { x: 1085, y: 646 },
    },
    {
      d: "M 1085 734 C 1040 820, 954 872, 840 856",
      p0: { x: 1085, y: 734 },
      p1: { x: 1040, y: 820 },
      p2: { x: 954, y: 872 },
      p3: { x: 840, y: 856 },
    },
  ];

  const dots = paths.map((path, index) => {
    const p = bezierPoint(path.p0, path.p1, path.p2, path.p3, loop(t * 0.48 + index * 0.31));
    return `<circle cx="${p.x.toFixed(2)}" cy="${p.y.toFixed(2)}" r="8" fill="#f8f8f6"/>`;
  }).join("");

  return `
    <g fill="none" stroke-linecap="round">
      <ellipse cx="940" cy="626" rx="650" ry="332" stroke="#f8f8f6" stroke-width="3" stroke-dasharray="26 25" stroke-dashoffset="${(-t * 120).toFixed(2)}" opacity="0.44"/>
      <ellipse cx="930" cy="605" rx="426" ry="222" stroke="#f8f8f6" stroke-width="2" stroke-dasharray="8 18" stroke-dashoffset="${(t * 96).toFixed(2)}" opacity="0.2"/>
      <path d="M 960 88 V 966" stroke="#f8f8f6" stroke-width="2" opacity="0.36"/>
      ${paths.map((path, index) => `<path d="${path.d}" stroke="#f8f8f6" stroke-width="${index === 1 ? 3.5 : 3}" opacity="${0.64 - index * 0.07}"/>`).join("")}
      ${dots}
    </g>`;
}

function coreSphere(t) {
  const pulse = 1 + Math.sin(t * Math.PI * 2) * 0.04;
  const x = 960;
  const y = 575;
  const r = 56 * pulse;
  return `
    <g transform="translate(${x} ${y})">
      <circle cx="0" cy="0" r="${r.toFixed(2)}" fill="#111214" stroke="#f8f8f6" stroke-width="3" opacity="0.96"/>
      <ellipse cx="0" cy="0" rx="${(r * 0.82).toFixed(2)}" ry="${(r * 0.32).toFixed(2)}" fill="none" stroke="#f8f8f6" stroke-width="2" opacity="0.78"/>
      <ellipse cx="0" cy="0" rx="${(r * 0.32).toFixed(2)}" ry="${(r * 0.82).toFixed(2)}" fill="none" stroke="#f8f8f6" stroke-width="2" opacity="0.7"/>
      <path d="M ${(-r).toFixed(2)} 0 H ${r.toFixed(2)}" stroke="#f8f8f6" stroke-width="2" opacity="0.56"/>
      <circle cx="${(Math.cos(t * Math.PI * 2) * r * 0.64).toFixed(2)}" cy="${(Math.sin(t * Math.PI * 2) * r * 0.22).toFixed(2)}" r="6" fill="#6888c1"/>
    </g>`;
}

function caption(t) {
  const opacity = easeInOutSine(clamp((t - 0.72) / 0.18));
  return `
    <g opacity="${opacity.toFixed(3)}">
      <text x="120" y="158" font-family="Helvetica Neue, Arial, sans-serif" font-size="64" font-weight="500" fill="#f8f8f6">Fluso</text>
      <text x="120" y="205" font-family="Helvetica Neue, Arial, sans-serif" font-size="24" fill="#f8f8f6" opacity="0.54">Composable AI workspace infrastructure</text>
    </g>`;
}

function frameSvg(frame) {
  const t = frame / (frames - 1);
  const driftX = Math.sin(t * Math.PI * 2) * 18;
  const driftY = Math.cos(t * Math.PI * 2) * 10;
  const scale = 0.982 + easeInOutSine(t) * 0.036;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <radialGradient id="bg" cx="50%" cy="42%" r="72%">
      <stop offset="0" stop-color="#18233a"/>
      <stop offset="0.42" stop-color="#101112"/>
      <stop offset="1" stop-color="#070808"/>
    </radialGradient>
    <linearGradient id="wash" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#6888c1" stop-opacity="0.24"/>
      <stop offset="0.52" stop-color="#6e8063" stop-opacity="0.1"/>
      <stop offset="1" stop-color="#9f5a31" stop-opacity="0.14"/>
    </linearGradient>
    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="32" stdDeviation="24" flood-color="#000000" flood-opacity="0.34"/>
    </filter>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  <rect width="${width}" height="${height}" fill="url(#wash)" opacity="0.36"/>
  <g opacity="0.92">${gridLines(t)}</g>
  <g transform="translate(${driftX.toFixed(2)} ${driftY.toFixed(2)}) scale(${scale.toFixed(4)})" transform-origin="960 540">
    ${connections(t)}
    <g filter="url(#softShadow)">
      ${blocks.map((block) => cube(block, t)).join("")}
    </g>
    ${coreSphere(t)}
  </g>
  ${caption(t)}
  <rect x="0" y="0" width="${width}" height="${height}" fill="none" stroke="#ffffff" stroke-opacity="0.06" stroke-width="2"/>
</svg>`;
}

function frameHtml(svg) {
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    html,
    body {
      margin: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: #070808;
    }

    svg {
      display: block;
      width: 100vw;
      height: 100vh;
    }
  </style>
</head>
<body>${svg}</body>
</html>`;
}

rmSync(frameDir, { recursive: true, force: true });
mkdirSync(frameDir, { recursive: true });
mkdirSync("assets/video", { recursive: true });

for (let frame = 0; frame < frames; frame += 1) {
  const id = String(frame).padStart(4, "0");
  const svg = frameSvg(frame);
  const htmlPath = join(frameDir, `frame_${id}.html`);
  const pngPath = join(frameDir, `frame_${id}.png`);

  writeFileSync(htmlPath, frameHtml(svg));

  const shot = spawnSync(chrome, [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    `--window-size=${width},${height}`,
    `--screenshot=${pngPath}`,
    `file://${htmlPath}`,
  ], { stdio: frame % fps === 0 ? "inherit" : "ignore" });

  if (shot.status !== 0) {
    process.exit(shot.status ?? 1);
  }

  if (frame % fps === 0) {
    console.log(`Rasterized frame ${frame + 1}/${frames}`);
  }
}

const encode = spawnSync("ffmpeg", [
  "-y",
  "-framerate",
  String(fps),
  "-i",
  join(frameDir, "frame_%04d.png"),
  "-c:v",
  "libx264",
  "-pix_fmt",
  "yuv420p",
  "-crf",
  "18",
  "-movflags",
  "+faststart",
  output,
], { stdio: "inherit" });

if (encode.status !== 0) {
  process.exit(encode.status ?? 1);
}

const posterFrame = join(frameDir, "frame_0170.png");
const posterResult = spawnSync("ffmpeg", [
  "-y",
  "-i",
  posterFrame,
  "-frames:v",
  "1",
  poster,
], { stdio: "inherit" });

if (posterResult.status !== 0) {
  process.exit(posterResult.status ?? 1);
}

console.log(`Rendered ${output}`);
console.log(`Rendered ${poster}`);
