/**
 * Petit serveur statique pour dist/ (tests navigateur et Lighthouse), sur un port libre.
 * Compression gzip des fichiers texte, comme le font tous les hébergements statiques : sans elle,
 * Lighthouse mesurerait des temps de chargement irréalistes.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import path from 'node:path';
import { gzipSync } from 'node:zlib';

export const DIST = path.resolve('dist');

const TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.pdf': 'application/pdf',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

const COMPRESSIBLES = new Set(['.html', '.js', '.mjs', '.css', '.json', '.svg', '.xml', '.txt']);

export function verifierDist(): void {
  if (!existsSync(path.join(DIST, 'index.html'))) {
    console.error('dist/ absent : lancez « npm run build » avant.');
    process.exit(1);
  }
}

export async function demarrerServeur(): Promise<{ base: string; serveur: Server }> {
  const serveur = createServer((req, res) => {
    const url = new URL(req.url ?? '/', 'http://localhost');
    let fichier = path.join(DIST, decodeURIComponent(url.pathname));
    if (!fichier.startsWith(DIST)) {
      res.writeHead(403).end();
      return;
    }
    if (existsSync(fichier) && statSync(fichier).isDirectory()) fichier = path.join(fichier, 'index.html');
    if (!existsSync(fichier)) {
      res.writeHead(404, { 'content-type': TYPES['.html'] as string }).end(readFileSync(path.join(DIST, '404.html')));
      return;
    }
    const extension = path.extname(fichier);
    const compresser = COMPRESSIBLES.has(extension) && /\bgzip\b/.test(req.headers['accept-encoding'] ?? '');
    const contenu = readFileSync(fichier);
    res.writeHead(200, {
      'content-type': TYPES[extension] ?? 'application/octet-stream',
      'cache-control': fichier.includes(`${path.sep}_astro${path.sep}`)
        ? 'public, max-age=31536000, immutable'
        : 'no-cache',
      vary: 'accept-encoding',
      ...(compresser ? { 'content-encoding': 'gzip' } : {}),
    });
    res.end(compresser ? gzipSync(contenu) : contenu);
  });
  await new Promise<void>((ok) => serveur.listen(0, '127.0.0.1', ok));
  return { base: `http://127.0.0.1:${(serveur.address() as AddressInfo).port}`, serveur };
}

/** Adresses de toutes les pages publiées (hors 404 et redirections). */
export function toutesLesPages(dossier = DIST): string[] {
  return readdirSync(dossier).flatMap((nom) => {
    const chemin = path.join(dossier, nom);
    if (statSync(chemin).isDirectory()) return nom === 'pagefind' || nom === '_astro' ? [] : toutesLesPages(chemin);
    if (!nom.endsWith('.html') || nom === '404.html') return [];
    const html = readFileSync(chemin, 'utf8');
    if (html.includes('http-equiv="refresh"')) return [];
    return [
      '/' +
        path
          .relative(DIST, chemin)
          .replace(/index\.html$/, '')
          .split(path.sep)
          .join('/'),
    ];
  });
}
