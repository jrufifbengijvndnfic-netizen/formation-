/**
 * Identifiants « slug », selon la convention des fichiers livrés (structure.json,
 * glossaire.json) : minuscules, sans accents, tout caractère non alphanumérique
 * remplacé par un tiret, et tronqués à 80 caractères (un seul titre concerné :
 * le module 3.11). Changer cette règle casse la parité avec les JSON livrés.
 */
export const LONGUEUR_MAX_SLUG = 80;

export function slugify(texte: string): string {
  return texte
    .normalize('NFKD')
    .replace(/[\u0080-\uffff]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, LONGUEUR_MAX_SLUG)
    .replace(/-+$/g, '');
}
