// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { copyFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Déploiement :
 * - SITE_URL (ex. https://formation.example.fr) active les adresses canoniques, Open Graph et le plan du site ;
 * - BASE_PATH (ex. /formation-) permet d'héberger le site dans un sous-dossier (GitHub Pages).
 */
const site = process.env.SITE_URL || undefined;
const base = process.env.BASE_PATH || '/';

/** En développement, modifier le Markdown source recharge la page (le contenu est relu). */
function rechargerSurMarkdown() {
  const dossier = path.resolve('../files/formation-immobilier-locatif-2026');
  return {
    name: 'formation-markdown',
    /** @param {import('vite').ViteDevServer} serveur */
    configureServer(serveur) {
      serveur.watcher.add(dossier);
      serveur.watcher.on('change', (fichier) => {
        if (!path.resolve(fichier).startsWith(dossier) || !fichier.endsWith('.md')) return;
        serveur.moduleGraph.invalidateAll();
        serveur.ws.send({ type: 'full-reload' });
      });
    },
  };
}

/** Copie la version PDF du pack dans dist/ si elle existe (liens de téléchargement affichés dans ce cas). */
function copierPdf() {
  const nom = 'formation-immobilier-locatif-2026.pdf';
  const source = path.resolve('../files/formation-immobilier-locatif-2026', nom);
  return {
    name: 'formation-pdf',
    hooks: {
      /** @param {{ dir: URL }} options */
      'astro:build:done': ({ dir }) => {
        if (existsSync(source)) copyFileSync(source, path.join(fileURLToPath(dir), nom));
      },
    },
  };
}

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  build: { format: 'directory' },
  // L'annexe C n'est qu'une redirection vers /glossaire/ : hors du plan du site.
  integrations: [copierPdf(), ...(site ? [sitemap({ filter: (page) => !page.endsWith('/annexe/c/') })] : [])],
  prefetch: false,
  devToolbar: { enabled: false },
  vite: {
    // Scripts toujours servis en fichiers (mis en cache) : l'intégration en ligne casse l'import dynamique de Pagefind.
    build: { assetsInlineLimit: 0 },
    plugins: [rechargerSurMarkdown()],
  },
});
