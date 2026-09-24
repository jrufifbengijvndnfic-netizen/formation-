/**
 * Vérifie les liens internes du site construit (dist/) : chaque lien vers une page du site
 * doit mener à un fichier existant, et chaque ancre (#…) à un identifiant présent dans la page.
 * Lancé à la fin de « npm run build ». Code de sortie 1 en cas de lien cassé.
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

if (erreurs.length) {
  console.error(
    `✗ ${erreurs.length} lien(s) interne(s) cassé(s) sur ${liens} :\n- ${erreurs.slice(0, 50).join('\n- ')}`,
  );
  process.exitCode = 1;
} else {
  console.log(`✓ ${liens} liens internes vérifiés sur ${toutes.length} pages : aucun lien cassé.`);
}
