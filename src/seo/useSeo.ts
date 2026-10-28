import { useEffect } from "react";
import type { ResolvedSeo } from "./config";

// Imperatively reconcile <head> with the current route's SEO. We mutate the DOM
// directly (rather than rendering tags into the React tree) so it always
// updates the SAME tag — overwriting the static defaults shipped in index.html
// instead of appending duplicates. React 19 does not manage these nodes, so
// there is no hydration conflict.
//
// Only the per-page parts are touched here: title, description, canonical, and
// the og/twitter title/description/url. Site-level tags (og:image, og:type,
// twitter:card, …) stay as the static index.html defaults.

function upsert(
  selector: string,
  create: () => HTMLElement,
  attr: string,
  value: string,
) {
  let el = document.head.querySelector<HTMLElement>(selector);
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

function meta(kind: "name" | "property", key: string, content: string) {
  upsert(
    `meta[${kind}="${key}"]`,
    () => {
      const el = document.createElement("meta");
      el.setAttribute(kind, key);
      return el;
    },
    "content",
    content,
  );
}

export function useSeo(seo: ResolvedSeo) {
  const { title, description, canonical, ogImage, english, italian } = seo;
  useEffect(() => {
    document.title = title;

    meta("name", "description", description);

    upsert(
      'link[rel="canonical"]',
      () => {
        const el = document.createElement("link");
        el.setAttribute("rel", "canonical");
        return el;
      },
      "href",
      canonical,
    );

    for (const [lang, href] of [['en', english], ['it', italian], ['x-default', english]]) {
      const selector = `link[rel="alternate"][hreflang="${lang}"]`;
      if (!href) { document.head.querySelector(selector)?.remove(); continue; }
      upsert(selector, () => {
        const link = document.createElement('link');
        link.rel = 'alternate'; link.hreflang = lang!;
        return link;
      }, 'href', href);
    }

    meta("property", "og:title", title);
    meta("property", "og:description", description);
    meta("property", "og:url", canonical);
    meta("property", "og:image", ogImage);

    meta("name", "twitter:title", title);
    meta("name", "twitter:description", description);
    meta("name", "twitter:image", ogImage);
  }, [title, description, canonical, ogImage, english, italian]);
}
