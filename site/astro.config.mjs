// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import { copyFileSync, existsSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { COURS_PUBLIC, ROUTE_ACCUEIL_OUTILS, ROUTES_COURS, ROUTES_EXTRAITS } from './src/lib/edition.ts';
import { manquants } from './src/lib/entreprise.ts';
import { REDIRECTIONS, SITE_PAR_DEFAUT } from './src/lib/seo.ts';

/**
 * Déploiement :
 * - SITE_URL (par défaut https://formation-locatif.com) : adresses canoniques, Open Graph, plan du site ;
 * - BASE_PATH (ex. /formation-) permet d'héberger le site dans un sous-dossier (GitHub Pages).
 */
const site = process.env.SITE_URL || SITE_PAR_DEFAUT;
const base = process.env.BASE_PATH || '/';
const prefixe = base.replace(/\/?$/, '/');

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

/** Pages du cours (src/cours/, édition complète) et vitrine des outils (src/outils/). */
function pagesDuCours() {
  return {
    name: 'formation-cours',
    hooks: {
      /** @param {{ injectRoute: (r: { pattern: string, entrypoint: string }) => void }} options */
      'astro:config:setup': ({ injectRoute }) => {
        if (COURS_PUBLIC) ROUTES_COURS.forEach((r) => injectRoute(r));
        ROUTES_EXTRAITS.forEach((r) => injectRoute(r));
        injectRoute(ROUTE_ACCUEIL_OUTILS);
      },
    },
  };
}

/** Rappelle à chaque build les informations légales et commerciales encore vides (src/lib/entreprise.ts). */
function informationsAFournir() {
  return {
    name: 'formation-informations',
    hooks: {
      /** @param {{ logger: { warn: (message: string) => void } }} options */
      'astro:build:done': ({ logger }) => {
        const liste = manquants();
        if (liste.length) logger.warn(`Informations à compléter dans src/lib/entreprise.ts : ${liste.join(', ')}`);
      },
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

/**
 * Fichiers générés à chaque build pour les moteurs de recherche et l'hébergement :
 * - sitemap.xml : uniquement les adresses canoniques indexables (ni 404 ni redirections) ;
 * - robots.txt : tout est autorisé, avec l'adresse du plan du site ;
 * - _redirects (Netlify, Cloudflare Pages) : redirections permanentes 301 ;
 * - _headers (Netlify, Cloudflare Pages) : HTTPS strict (HSTS), sécurité, cache des fichiers versionnés.
 * Vercel lit l'équivalent dans vercel.json (vérifié par un test).
 */
function fichiersReferencement() {
  return {
    name: 'formation-referencement',
    hooks: {
      /** @param {{ dir: URL, pages: { pathname: string }[] }} options */
      'astro:build:done': ({ dir, pages }) => {
        const sortie = fileURLToPath(dir);
        const redirigees = new Set(Object.keys(REDIRECTIONS));
        const adresses = pages
          .map((p) => p.pathname.replace(/^\/?/, '').replace(/\/?$/, '/').replace(/^\/$/, ''))
          .filter((p) => p !== '404/' && !redirigees.has(p))
          .sort()
          .map((p) => new URL(prefixe + p, site).href);
        writeFileSync(
          path.join(sortie, 'sitemap.xml'),
          '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
            adresses.map((a) => `  <url><loc>${a}</loc></url>`).join('\n') +
            '\n</urlset>\n',
        );
        writeFileSync(
          path.join(sortie, 'robots.txt'),
          `User-agent: *\nAllow: /\n\nSitemap: ${new URL(prefixe + 'sitemap.xml', site).href}\n`,
        );
        writeFileSync(
          path.join(sortie, '_redirects'),
          Object.entries(REDIRECTIONS)
            .flatMap(([de, vers]) => [
              `${prefixe}${de} ${prefixe}${vers} 301`,
              `${prefixe}${de.replace(/\/$/, '')} ${prefixe}${vers} 301`,
            ])
            .join('\n') + '\n',
        );
        writeFileSync(
          path.join(sortie, '_headers'),
          [
            '/*',
            '  Strict-Transport-Security: max-age=31536000',
            '  X-Content-Type-Options: nosniff',
            '  Referrer-Policy: strict-origin-when-cross-origin',
            '  X-Frame-Options: DENY',
            '  Permissions-Policy: camera=(), microphone=(), geolocation=()',
            `${prefixe}_astro/*`,
            '  Cache-Control: public, max-age=31536000, immutable',
            '',
          ].join('\n'),
        );
      },
    },
  };
}

/** @typedef {{ weight: number | string, style: 'normal', src: [string] }} Variante */

/**
 * Police hébergée avec le site (paquets @fontsource), préchargée, avec police de secours ajustée.
 * @param {string} name
 * @param {`--${string}`} cssVariable
 * @param {string[]} fallbacks
 * @param {Variante[]} variantes
 */
const police = (name, cssVariable, fallbacks, variantes) => ({
  provider: fontProviders.local(),
  name,
  cssVariable,
  fallbacks,
  display: /** @type {const} */ ('swap'),
  options: { variants: /** @type {[Variante, ...Variante[]]} */ (variantes) },
});

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [pagesDuCours(), copierPdf(), fichiersReferencement(), informationsAFournir()],
  fonts: [
    police(
      'Poppins',
      '--police-titre',
      ['sans-serif'],
      [500, 600, 700].map((weight) => ({
        weight,
        style: 'normal',
        src: [`@fontsource/poppins/files/poppins-latin-${weight}-normal.woff2`],
      })),
    ),
    police(
      'Source Serif 4',
      '--police-texte',
      ['serif'],
      [
        {
          weight: '200 900',
          style: 'normal',
          src: ['@fontsource-variable/source-serif-4/files/source-serif-4-latin-wght-normal.woff2'],
        },
      ],
    ),
    police(
      'JetBrains Mono',
      '--police-mono',
      ['monospace'],
      [
        {
          weight: '100 800',
          style: 'normal',
          src: ['@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2'],
        },
      ],
    ),
  ],
  prefetch: false,
  devToolbar: { enabled: false },
  vite: {
    // Scripts toujours servis en fichiers (mis en cache) : l'intégration en ligne casse l'import dynamique de Pagefind.
    build: { assetsInlineLimit: 0 },
    plugins: [rechargerSurMarkdown()],
  },
});
