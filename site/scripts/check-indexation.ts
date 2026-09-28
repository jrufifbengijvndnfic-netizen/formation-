/**
 * Vérifie que le site construit (dist/) est prêt pour une indexation propre. Lancé à la fin de
 * « npm run build ». Code de sortie 1 en cas d'erreur.
 * - Chaque page indexable a un <title> unique, une méta-description unique et une adresse canonique
 *   absolue qui désigne la page elle-même, sans noindex.
 * - sitemap.xml est un XML bien formé et liste exactement les pages indexables, en adresses absolues.
 * - robots.txt déclare le plan du site et n'interdit aucune page.
 * - La page 404 n'est pas indexable et renvoie vers l'accueil.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

const DIST = path.resolve(process.argv[2] ?? 'dist');
const BASE = (process.env.BASE_PATH ?? '/').replace(/\/?$/, '/');
const SITE = new URL(process.env.SITE_URL ?? 'https://formation-locatif.com');
const erreurs: string[] = [];

function fichiersHtml(dossier: string): string[] {
  return readdirSync(dossier).flatMap((nom) => {
    const chemin = path.join(dossier, nom);
    if (statSync(chemin).isDirectory()) return nom === 'pagefind' || nom === '_astro' ? [] : fichiersHtml(chemin);
    return nom.endsWith('.html') ? [chemin] : [];
  });
}

const decoder = (t: string) =>
  t
    .replace(/&amp;/g, '&')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');

const titres = new Map<string, string>();
const descriptions = new Map<string, string>();
const indexables = new Set<string>();
const nonIndexables = new Set<string>();

for (const fichier of fichiersHtml(DIST)) {
  const relatif = path.relative(DIST, fichier).split(path.sep).join('/');
  const adresse = new URL(BASE + relatif.replace(/index\.html$/, ''), SITE).href;
  const html = readFileSync(fichier, 'utf8');
  if (relatif === '404.html') {
    if (!html.includes('name="robots" content="noindex"')) erreurs.push('404.html : noindex manquant');
    if (!new RegExp(`<a[^>]+href="${BASE}"`).test(html)) erreurs.push('404.html : aucun lien vers l’accueil');
    continue;
  }
  // Pages de repli d'une redirection (meta refresh) et pages volontairement écartées.
  if (html.includes('http-equiv="refresh"') || html.includes('name="robots" content="noindex"')) {
    nonIndexables.add(adresse);
    continue;
  }
  indexables.add(adresse);
  const titre = decoder(html.match(/<title>([^<]*)<\/title>/)?.[1]?.trim() ?? '');
  const description = decoder(html.match(/<meta name="description" content="([^"]*)"/)?.[1]?.trim() ?? '');
  const canonique = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1] ?? '';
  if (!titre) erreurs.push(`${adresse} : <title> vide ou absent`);
  else if (titres.has(titre)) erreurs.push(`${adresse} : titre identique à ${titres.get(titre)} (« ${titre} »)`);
  else titres.set(titre, adresse);
  if (!description) erreurs.push(`${adresse} : méta-description absente`);
  else if (descriptions.has(description))
    erreurs.push(`${adresse} : description identique à ${descriptions.get(description)}`);
  else descriptions.set(description, adresse);
  if (!canonique) erreurs.push(`${adresse} : adresse canonique absente`);
  else if (canonique !== adresse) erreurs.push(`${adresse} : canonique « ${canonique} » différente de la page`);
}

// --------------------------------------------------------------- Plan du site
const cheminSitemap = path.join(DIST, 'sitemap.xml');
const dansSitemap = new Set<string>();
if (!existsSync(cheminSitemap)) erreurs.push('sitemap.xml absent');
else {
  const xml = readFileSync(cheminSitemap, 'utf8');
  if (!xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')) erreurs.push('sitemap.xml : déclaration XML absente');
  if (!/<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">[\s\S]*<\/urlset>\s*$/.test(xml))
    erreurs.push('sitemap.xml : élément urlset mal formé');
  // Bien formé : chaque <url> contient exactement un <loc> et un <lastmod>, sans caractère à échapper.
  const blocs = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => m[1] as string);
  if (blocs.length !== (xml.match(/<url>/g) ?? []).length) erreurs.push('sitemap.xml : balise <url> non fermée');
  for (const bloc of blocs) {
    const loc = bloc.match(/^\s*<loc>([^<&]+)<\/loc><lastmod>(\d{4}-\d{2}-\d{2})<\/lastmod>\s*$/);
    if (!loc) {
      erreurs.push(`sitemap.xml : entrée invalide ${bloc.trim()}`);
      continue;
    }
    const url = loc[1] as string;
    if (!url.startsWith(SITE.origin + BASE)) erreurs.push(`sitemap.xml : adresse non absolue ou hors site ${url}`);
    if (dansSitemap.has(url)) erreurs.push(`sitemap.xml : doublon ${url}`);
    dansSitemap.add(url);
  }
  for (const u of indexables) if (!dansSitemap.has(u)) erreurs.push(`sitemap.xml : page indexable absente ${u}`);
  for (const u of dansSitemap) {
    if (nonIndexables.has(u)) erreurs.push(`sitemap.xml : page non indexable listée ${u}`);
    else if (!indexables.has(u)) erreurs.push(`sitemap.xml : adresse sans page ${u}`);
  }
}

// --------------------------------------------------------------- robots.txt
const cheminRobots = path.join(DIST, 'robots.txt');
if (!existsSync(cheminRobots)) erreurs.push('robots.txt absent');
else {
  const robots = readFileSync(cheminRobots, 'utf8');
  if (!robots.includes(`Sitemap: ${new URL(BASE + 'sitemap.xml', SITE).href}`))
    erreurs.push('robots.txt : ligne Sitemap absente');
  for (const m of robots.matchAll(/^Disallow:\s*(\S*)/gm)) {
    const interdit = m[1] as string;
    if (interdit === '') continue;
    const touchees = [...indexables].filter((u) => new URL(u).pathname.startsWith(interdit));
    if (touchees.length) erreurs.push(`robots.txt : « Disallow: ${interdit} » bloque ${touchees.length} page(s)`);
  }
}

// --------------------------------------------------------------- .htaccess (Hostinger)
const htaccess = path.join(DIST, '.htaccess');
if (!existsSync(htaccess)) erreurs.push('.htaccess absent');
else if (/X-Robots-Tag/i.test(readFileSync(htaccess, 'utf8'))) erreurs.push('.htaccess : en-tête X-Robots-Tag');

if (erreurs.length) {
  console.error(`✗ Indexation : ${erreurs.length} erreur(s) :\n- ${erreurs.slice(0, 50).join('\n- ')}`);
  process.exitCode = 1;
} else {
  console.log(
    `✓ Indexation : ${indexables.size} pages indexables (titre, description et canonique uniques), ` +
      `${dansSitemap.size} adresses dans sitemap.xml, ${nonIndexables.size} page(s) volontairement non indexée(s).`,
  );
}
