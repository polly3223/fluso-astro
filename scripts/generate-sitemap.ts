import {ROUTE_SEO, seoForPath} from '../src/seo/config';
const escape = (value: string) => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;');
const pages = Object.keys(ROUTE_SEO).flatMap(path => {
  const locales = ['/privacy', '/terms'].includes(path) ? ['en'] as const : ['en', 'it'] as const;
  return locales.map(locale => `<url><loc>${escape(seoForPath(path, locale).canonical)}</loc>${locales.map(language => `<xhtml:link rel="alternate" hreflang="${language}" href="${escape(seoForPath(path, language).canonical)}"/>`).join('')}</url>`);
});
await Bun.write('public/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${pages.join('\n')}\n</urlset>\n`);
