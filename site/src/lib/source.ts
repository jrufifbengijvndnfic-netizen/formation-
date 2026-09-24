/**
 * Emplacement du Markdown source unique de vérité. Le site ne le recopie pas :
 * il le lit directement dans le pack livré, à côté des JSON qu'il régénère.
 */
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ici = path.dirname(fileURLToPath(import.meta.url));

/** Racine du dossier site/. */
export const RACINE_SITE = path.resolve(ici, '../..');

/** Dossier du pack de contenu (Markdown, JSON, calculs de référence, PDF). */
export const DOSSIER_PACK = path.resolve(RACINE_SITE, '../files/formation-immobilier-locatif-2026');

export const NOM_SOURCE = 'formation-immobilier-locatif-2026.md';
export const CHEMIN_SOURCE = path.join(DOSSIER_PACK, NOM_SOURCE);
export const NOM_PDF = 'formation-immobilier-locatif-2026.pdf';
export const CHEMIN_PDF = path.join(DOSSIER_PACK, NOM_PDF);

export function lireSource(): string {
  return readFileSync(CHEMIN_SOURCE, 'utf8');
}

export function pdfDisponible(): boolean {
  return existsSync(CHEMIN_PDF);
}
