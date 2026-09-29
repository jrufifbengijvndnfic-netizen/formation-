/**
 * Accès par code aux niveaux de la formation (version 022).
 *
 * Les modules (sauf l'extrait gratuit 1.1), les examens de niveau, l'examen final et le test de
 * 50 questions sont réservés : la page affiche un verrou tant que leur niveau n'est pas ouvert dans le
 * navigateur. Un code ouvre un niveau. Il est vérifié dans le navigateur par son empreinte SHA-256 :
 * le code lui-même n'est écrit nulle part dans le site publié. Les empreintes des codes saisis sont
 * gardées dans le navigateur (localStorage, à défaut sessionStorage).
 *
 * Limite à connaître : c'est un verrou d'affichage, pas une protection par le serveur. Le texte des
 * pages reste dans leur HTML (lisible dans le code source) et un code donné à quelqu'un peut circuler.
 * Une vraie protection viendra avec le paiement en ligne (codes par acheteur ou espace membre).
 *
 * Ajouter ou changer un code : `npm run code-acces -- <code> <niveau>`, puis coller la ligne affichée
 * dans EMPREINTES_ACCES. Retirer une ligne ferme ce code sur tous les appareils, dès la mise en ligne
 * de la version suivante.
 */
import { MODULES_GRATUITS } from './extraits';
import type { Niveau } from './types';

/** Clé du stockage du navigateur : liste des empreintes des codes saisis. */
export const CLE_ACCES = 'formation-immobilier-locatif-2026:acces';

/** Préfixe ajouté au code avant le calcul de son empreinte. */
export const SEL_ACCES = 'formation-locatif:acces:';

/** Caractères hexadécimaux conservés de l'empreinte (128 bits). */
export const LONGUEUR_EMPREINTE = 32;

/** Empreinte d'un code → niveau qu'il ouvre (codes du 29 septembre 2026 : un par niveau). */
export const EMPREINTES_ACCES: Record<string, Niveau> = {
  '3b008d5f4d9887d3404d568c3a378d24': 1,
  '1e7f34052b8a23f9c2d61a1bfcd125fd': 2,
  eb8e493de1fe238bf5fe19fe9fac9c18: 3,
};

/** Vrai tant que les codes ne contiennent que des chiffres : clavier numérique sur téléphone. */
export const CODES_EN_CHIFFRES = true;

/** Code tel qu'il est vérifié : sans espaces, points ni tirets, en majuscules. */
export function normaliserCode(code: string): string {
  return code
    .normalize('NFKC')
    .replace(/[\s.\-_]/g, '')
    .toUpperCase();
}

/** Empreinte d'un code (Web Crypto, disponible dans le navigateur en HTTPS et dans Node). */
export async function empreinteCode(code: string): Promise<string> {
  const donnees = new TextEncoder().encode(SEL_ACCES + normaliserCode(code));
  const hache = new Uint8Array(await crypto.subtle.digest('SHA-256', donnees));
  return [...hache]
    .map((o) => o.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, LONGUEUR_EMPREINTE);
}

/** Niveau ouvert par une empreinte, ou undefined si elle ne correspond à aucun code en vigueur. */
export function niveauDeLEmpreinte(empreinte: string): Niveau | undefined {
  return Object.prototype.hasOwnProperty.call(EMPREINTES_ACCES, empreinte) ? EMPREINTES_ACCES[empreinte] : undefined;
}

/** Niveaux ouverts par des empreintes enregistrées, dans l'ordre (les empreintes retirées sont ignorées). */
export function niveauxOuverts(empreintes: readonly unknown[]): Niveau[] {
  const niveaux = empreintes.map((e) => (typeof e === 'string' ? niveauDeLEmpreinte(e) : undefined));
  return [...new Set(niveaux.filter((n): n is Niveau => n !== undefined))].sort();
}

/** Niveau qu'il faut avoir ouvert pour lire un module, ou undefined s'il est gratuit. */
export function niveauDuModule(numero: string): Niveau | undefined {
  if (MODULES_GRATUITS.includes(numero)) return undefined;
  const n = Number(numero.split('.')[0]);
  return n === 1 || n === 2 || n === 3 ? n : undefined;
}

/**
 * Niveau qu'il faut avoir ouvert pour un examen : « niveau-1 » et « niveau-2 » ; l'examen final et son
 * test de 50 questions sont l'examen du niveau 3.
 */
export function niveauDeLExamen(slug: string): Niveau {
  const m = /^niveau-([12])$/.exec(slug);
  return m ? (Number(m[1]) as Niveau) : 3;
}
