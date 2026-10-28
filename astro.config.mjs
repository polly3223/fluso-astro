import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';
import path from 'node:path';

// Preserve the public site's legacy links and desktop-auth handoff locally.
function routeCompatibility(server) {
  server.middlewares.use((request, response, next) => {
    const url = new URL(request.url || '/', 'http://localhost');
    const auth = /^\/auth\/client(?:\/|$)/.test(url.pathname);
    const legacy = /^\/[^/]+\.html$/.test(url.pathname) && !existsSync(path.join(process.cwd(), 'dist', url.pathname));
    if (!auth && !legacy) return next();
    response.statusCode = auth ? 307 : 308;
    response.setHeader('Location', (auth ? 'https://app.fluso.ai'+url.pathname : url.pathname.slice(0,-5)) + url.search);
    response.end();
  });
}

export default defineConfig({
  site: 'https://fluso.ai',
  srcDir: './astro',
  output: 'static',
  trailingSlash: 'never',
  server: { allowedHosts: process.env.ASTRO_ALLOWED_HOST ? [process.env.ASTRO_ALLOWED_HOST] : [] },
  devToolbar: { enabled: false },
  integrations: [react()],
  vite: {
    plugins: [tailwindcss(), {name: 'original-route-redirects', configureServer: routeCompatibility, configurePreviewServer: routeCompatibility}],
    resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
    envPrefix: ['PUBLIC_', 'VITE_'],
  },
});
