import {resolve, sep, extname} from 'node:path';
import {existsSync} from 'node:fs';

const root = resolve('dist');
const routes = ['pricing','enterprise','download','get-started','privacy','terms','for-founders','for-lawyers','for-investors','for-marketers','for-researchers','for-doctors','for-consultants','for-sales','for-operations'];
const port = Number(process.env.PORT || 8902);
Bun.serve({hostname: '127.0.0.1', port, async fetch(request) {
  const url = new URL(request.url);
  if (!['GET', 'HEAD'].includes(request.method)) return new Response('Method not allowed', {status: 405});
  if (/^\/auth\/client(?:\/|$)/.test(url.pathname)) return Response.redirect(`https://app.fluso.ai${url.pathname}${url.search}`, 307);
  if (['/it/privacy','/it/terms'].includes(url.pathname.replace(/\/$/, ''))) return Response.redirect(new URL(url.pathname.slice(3).replace(/\/$/, '') + url.search, url).href, 308);
  if (routes.some(route => url.pathname === `/${route}.html`)) return Response.redirect(new URL(url.pathname.slice(0,-5) + url.search, url).href, 308);
  let pathname: string;
  try { pathname = decodeURIComponent(url.pathname); } catch { return new Response('Bad path', {status: 400}); }
  const path = resolve(root, `.${pathname}`);
  if (path !== root && !path.startsWith(root + sep)) return new Response('Not found', {status: 404});
  const candidate = extname(path) && existsSync(path) ? path : resolve(path, 'index.html');
  const file = Bun.file(candidate);
  const found = await file.exists();
  const body = found ? file : Bun.file(resolve(root, '404.html'));
  return new Response(request.method === 'HEAD' ? null : body, {status: found ? 200 : 404, headers: {'Content-Type': body.type, 'Cache-Control': 'no-cache'}});
}});
console.log(`Fluso preview: http://localhost:${port}`);
