// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

/**
 * Déploiement :
 * - SITE_URL (ex. https://formation.example.fr) active les adresses canoniques, Open Graph et le plan du site ;
 * - BASE_PATH (ex. /formation-) permet d'héberger le site dans un sous-dossier (GitHub Pages).
 */
const site = process.env.SITE_URL || undefined;
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: site ? [sitemap()] : [],
  prefetch: false,
  devToolbar: { enabled: false },
  vite: {
    server: {
      // Le Markdown source est hors de site/ : on le surveille pour recharger la page en développement.
      watch: { ignored: ['!**/files/formation-immobilier-locatif-2026/**'] },
      fs: { allow: ['..'] },
    },
  },
});
