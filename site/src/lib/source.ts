/**
 * Emplacement du Markdown source unique de vérité. Le site ne le recopie pas :
 * il le lit directement dans le pack livré (files/formation-immobilier-locatif-2026/),
 * à côté des JSON qu'il régénère. Le pack est cherché en remontant depuis le dossier
 * courant (le code est regroupé par Astro au build, son propre emplacement change) ;
 * la variable FORMATION_PACK permet d'imposer un autre dossier.
 */
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const NOM_SOURCE = 'formation-immobilier-locatif-2026.md';
export const NOM_PDF = 'formation-immobilier-locatif-2026.pdf';
const SOUS_DOSSIER = path.join('files', 'formation-immobilier-locatif-2026');

function trouverPack(): string {
  if (process.env.FORMATION_PACK) return path.resolve(process.env.FORMATION_PACK);
  const departs = [process.cwd(), path.dirname(fileURLToPath(import.meta.url))];
  for (const depart of departs) {
    let dossier = depart;
    for (;;) {
      const candidat = path.join(dossier, SOUS_DOSSIER);
      if (existsSync(path.join(candidat, NOM_SOURCE))) return candidat;
      const parent = path.dirname(dossier);
      if (parent === dossier) break;
      dossier = parent;
    }
  }
  throw new Error(
    `Markdown source introuvable (${path.join(SOUS_DOSSIER, NOM_SOURCE)}) en remontant depuis ${process.cwd()}. ` +
      'Lancez les commandes depuis le dossier site/ ou définissez FORMATION_PACK.',
  );
}

/** Dossier du pack de contenu (Markdown, JSON, calculs de référence, PDF). */
export const DOSSIER_PACK = trouverPack();
/** Racine du dossier site/ (voisin du dossier files/). */
export const RACINE_SITE = path.resolve(DOSSIER_PACK, '..', '..', 'site');
export const CHEMIN_SOURCE = path.join(DOSSIER_PACK, NOM_SOURCE);
export const CHEMIN_PDF = path.join(DOSSIER_PACK, NOM_PDF);

export function lireSource(): string {
  return readFileSync(CHEMIN_SOURCE, 'utf8');
}

export function pdfDisponible(): boolean {
  return existsSync(CHEMIN_PDF);
}

/** Exercices d'entraînement et questions notées des examens (complément de la formation). */
export const NOM_EXERCICES = 'exercices.md';
export const CHEMIN_EXERCICES = path.join(DOSSIER_PACK, NOM_EXERCICES);
export const lireExercicesSource = (): string => readFileSync(CHEMIN_EXERCICES, 'utf8');
