import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  site: 'https://fluso.ai',
  srcDir: './astro',
  output: 'static',
  i18n: {defaultLocale: 'en', locales: ['en', 'it'], routing: {prefixDefaultLocale: false}},
  redirects: {'/it/privacy': '/privacy', '/it/terms': '/terms'},
  trailingSlash: 'never',
  server: { allowedHosts: process.env.ASTRO_ALLOWED_HOST ? [process.env.ASTRO_ALLOWED_HOST] : [] },
  devToolbar: { enabled: false },
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
    envPrefix: ['PUBLIC_', 'VITE_'],
  },
});
