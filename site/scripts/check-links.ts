/**
 * Vérifie le site construit (dist/). Lancé à la fin de « npm run build ». Code de sortie 1 en cas
 * d'erreur.
 * - Liens internes : chaque lien vers une page du site mène à un fichier existant, et chaque ancre
 *   (#…) à un identifiant présent dans la page.
 * - Ressources (scripts, feuilles de style, polices, images, icônes, préchargements, image de
 *   partage, url() des CSS) : chacune correspond à un fichier de dist/ et aucune n'est chargée depuis
 *   un autre domaine. Les liens <a> vers d'autres sites restent permis.
 * - /favicon.ico existe (demandé d'office par les navigateurs et les robots).
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

const DIST = path.resolve(process.argv[2] ?? 'dist');
const BASE = (process.env.BASE_PATH ?? '/').replace(/\/?$/, '/');

function pages(dossier: string): string[] {
  return readdirSync(dossier).flatMap((nom) => {
    const chemin = path.join(dossier, nom);
    if (statSync(chemin).isDirectory()) return nom === 'pagefind' || nom === '_astro' ? [] : pages(chemin);
    return nom.endsWith('.html') ? [chemin] : [];
  });
}

const cacheIds = new Map<string, Set<string>>();
function idsDe(fichier: string): Set<string> {
  let ids = cacheIds.get(fichier);
  if (!ids) {
    const html = readFileSync(fichier, 'utf8');
    ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1] as string));
    cacheIds.set(fichier, ids);
  }
  return ids;
}

/** Fichier servi pour une adresse interne (/module/1-1/ → dist/module/1-1/index.html). */
function fichierPour(adresse: string): string | null {
  if (!adresse.startsWith(BASE)) return null;
  const relatif = decodeURIComponent(adresse.slice(BASE.length));
  const candidat = path.join(DIST, relatif);
  if (relatif === '' || relatif.endsWith('/')) return path.join(candidat, 'index.html');
  return candidat;
}

const erreurs: string[] = [];
let liens = 0;
const toutes = pages(DIST);
for (const fichier of toutes) {
  const html = readFileSync(fichier, 'utf8');
  const page =
    '/' +
    path
      .relative(DIST, fichier)
      .replace(/index\.html$/, '')
      .split(path.sep)
      .join('/');
  for (const m of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    const brut = (m[1] as string).replace(/&amp;/g, '&');
    if (/^(https?:|mailto:|tel:|data:|javascript:)/.test(brut)) continue;
    liens++;
    const [chemin, ancre] = brut.split('#') as [string, string | undefined];
    const sansRequete = chemin.split('?')[0] as string;
    const cible =
      sansRequete === ''
        ? fichier
        : fichierPour(sansRequete.startsWith('/') ? sansRequete : path.posix.join(page, sansRequete));
    if (!cible) {
      erreurs.push(`${page} → ${brut} : hors du site (base ${BASE})`);
      continue;
    }
    if (!existsSync(cible)) {
      erreurs.push(`${page} → ${brut} : page introuvable`);
      continue;
    }
    if (ancre && cible.endsWith('.html') && !idsDe(cible).has(decodeURIComponent(ancre))) {
      erreurs.push(`${page} → ${brut} : ancre « #${ancre} » absente`);
    }
  }
}

// --------------------------------------------------------------- Ressources chargées par les pages
const SITE = new URL(process.env.SITE_URL ?? 'https://formation-locatif.com');
const ressources = new Set<string>();

/** Vérifie une ressource ; `depuis` sert aux chemins relatifs (page ou feuille de style). */
function verifierRessource(brut: string, depuis: string, origine: string): void {
  const adresse = brut.replace(/&amp;/g, '&').trim();
  if (adresse === '' || /^(data:|#)/.test(adresse)) return;
  let chemin: string;
  if (/^(https?:)?\/\//.test(adresse)) {
    const url = new URL(adresse, SITE);
    if (url.host !== SITE.host) {
      erreurs.push(`${origine} → ${adresse} : ressource chargée depuis un autre domaine`);
      return;
    }
    chemin = url.pathname;
  } else {
    chemin = new URL(adresse, new URL(depuis, 'http://x')).pathname;
  }
  ressources.add(chemin);
  const cible = fichierPour(chemin);
  if (!cible || !existsSync(cible)) erreurs.push(`${origine} → ${adresse} : fichier absent de dist/`);
}

/** Valeurs d'un attribut dans une balise (srcset : chaque adresse de la liste). */
function attribut(balise: string, nom: string): string[] {
  const m = balise.match(new RegExp(`\\s${nom}="([^"]*)"`));
  if (!m) return [];
  const v = m[1] as string;
  return nom === 'srcset' ? v.split(',').map((s) => s.trim().split(/\s+/)[0] as string) : [v];
}

for (const fichier of toutes) {
  const html = readFileSync(fichier, 'utf8');
  const page = '/' + path.relative(DIST, fichier).split(path.sep).join('/');
  for (const [balise, nom] of html.matchAll(/<(script|link|img|source|meta|use|image)\b[^>]*>/g) as Iterable<
    [string, string]
  >) {
    const valeurs: string[] = [];
    if (nom === 'script' || nom === 'img' || nom === 'source') {
      valeurs.push(...attribut(balise, 'src'), ...attribut(balise, 'srcset'));
    } else if (nom === 'link') {
      const rel = attribut(balise, 'rel')[0] ?? '';
      // canonical et og:url désignent des pages (vérifiées plus haut), pas des fichiers à charger.
      if (!/\b(canonical|alternate)\b/.test(rel)) valeurs.push(...attribut(balise, 'href'));
    } else if (nom === 'meta') {
      if (/property="(og|twitter):image"/.test(balise)) valeurs.push(...attribut(balise, 'content'));
    } else {
      valeurs.push(...attribut(balise, 'href'));
    }
    valeurs.forEach((v) => verifierRessource(v, page, page));
  }
}

const astro = path.join(DIST, '_astro');
for (const nom of existsSync(astro) ? readdirSync(astro) : []) {
  if (!nom.endsWith('.css')) continue;
  const css = readFileSync(path.join(astro, nom), 'utf8');
  const depuis = `${BASE}_astro/${nom}`;
  for (const m of css.matchAll(/url\(\s*(['"]?)([^'")]+)\1\s*\)/g)) verifierRessource(m[2] as string, depuis, depuis);
}

if (!existsSync(path.join(DIST, 'favicon.ico'))) erreurs.push('/favicon.ico : absent de dist/');

if (erreurs.length) {
  console.error(`✗ ${erreurs.length} erreur(s) sur ${liens} liens et ${ressources.size} ressources :`);
  console.error(`- ${erreurs.slice(0, 50).join('\n- ')}`);
  process.exitCode = 1;
} else {
  console.log(
    `✓ ${liens} liens internes et ${ressources.size} ressources vérifiés sur ${toutes.length} pages : rien de cassé, rien d'externe.`,
  );
}
