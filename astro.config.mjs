// @ts-check
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://takuto-tana.github.io',
  base: '/portfolio',
  trailingSlash: 'always',
  output: 'static',
  devToolbar: { enabled: false },
  integrations: [sitemap()],
});
