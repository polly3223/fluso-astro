// Dev-only OG card harness entry. Renders every per-route OgCard stacked so the
// Open Graph images can be regenerated. This file is NOT imported by the app and
// tools/og/og.html is not a Vite build input, so none of it ships to production.
//
// Regenerate assets/og/<slug>.png:
//   1. npm run dev
//   2. open http://localhost:5173/tools/og/og.html in a 1200px-wide viewport
//   3. full-page screenshot, then slice into 16 tiles (1200×630 each, in
//      OG_DATA order) — e.g. with ImageMagick:
//        magick sheet.png -crop 1920x1008+0+<i*1008> +repage -resize 1200x630 <slug>.png
//      (the headless capture paints content at DPR scale; verify tile geometry
//       against the rendered card rects before committing.)
import { createRoot } from "react-dom/client";
import "@/index.css";
import OgCard from "@/pages/og/OgCard";
import { OG_DATA } from "@/pages/og/ogData";

createRoot(document.getElementById("og-root")!).render(
  <>
    {Object.keys(OG_DATA).map((route) => (
      <OgCard key={route} route={route} />
    ))}
  </>,
);
