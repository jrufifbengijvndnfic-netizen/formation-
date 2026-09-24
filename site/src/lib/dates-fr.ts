/** Dates en français : lecture (« 1er janvier 2028 », « 4e trimestre 2026 ») et affichage. */

export const MOIS = [
  'janvier',
  'février',
  'mars',
  'avril',
  'mai',
  'juin',
  'juillet',
  'août',
  'septembre',
  'octobre',
  'novembre',
  'décembre',
] as const;

export interface PeriodeFr {
  /** Premier jour de la période, ISO « AAAA-MM-JJ ». */
  debut: string;
  /** Dernier jour de la période, ISO. Identique à debut pour une date précise. */
  fin: string;
  precision: 'jour' | 'mois' | 'trimestre' | 'annee';
}

const pad = (n: number): string => String(n).padStart(2, '0');

export function iso(annee: number, mois: number, jour: number): string {
  return `${annee}-${pad(mois)}-${pad(jour)}`;
}

function dernierJourDuMois(annee: number, mois: number): number {
  return new Date(Date.UTC(annee, mois, 0)).getUTCDate();
}

/**
 * Lit une date ou une période écrite en français. Renvoie null si le texte n'est pas reconnu.
 * Formes reconnues : « 24 août 2022 », « 1er janvier 2023 », « 4e trimestre 2026 »,
 * « septembre 2026 », « 2027 ».
 */
export function lireDateFr(texte: string): PeriodeFr | null {
  const t = texte.trim().toLowerCase();
  const moisRe = MOIS.join('|');
  let m = new RegExp(`^(\\d{1,2})(?:er)? (${moisRe}) (\\d{4})$`).exec(t);
  if (m) {
    const d = iso(Number(m[3]), MOIS.indexOf(m[2] as (typeof MOIS)[number]) + 1, Number(m[1]));
    return { debut: d, fin: d, precision: 'jour' };
  }
  m = /^([1-4])(?:er|e) trimestre (\d{4})$/.exec(t);
  if (m) {
    const annee = Number(m[2]);
    const q = Number(m[1]);
    const moisFin = q * 3;
    return {
      debut: iso(annee, moisFin - 2, 1),
      fin: iso(annee, moisFin, dernierJourDuMois(annee, moisFin)),
      precision: 'trimestre',
    };
  }
  m = new RegExp(`^(${moisRe}) (\\d{4})$`).exec(t);
  if (m) {
    const annee = Number(m[2]);
    const mois = MOIS.indexOf(m[1] as (typeof MOIS)[number]) + 1;
    return {
      debut: iso(annee, mois, 1),
      fin: iso(annee, mois, dernierJourDuMois(annee, mois)),
      precision: 'mois',
    };
  }
  m = /^(\d{4})$/.exec(t);
  if (m) {
    return { debut: iso(Number(m[1]), 1, 1), fin: iso(Number(m[1]), 12, 31), precision: 'annee' };
  }
  return null;
}

/** « 2026-09-24 » → « 24 septembre 2026 » (« 1er » pour le premier du mois). */
export function formaterDateFr(isoDate: string): string {
  const [a, m, j] = isoDate.split('-').map(Number);
  const jour = j === 1 ? '1er' : String(j);
  return `${jour} ${MOIS[m - 1]} ${a}`;
}

/** Ajoute des mois à une date ISO ; le jour est ramené au dernier jour du mois si besoin. */
export function ajouterMois(isoDate: string, mois: number): string {
  const [a, m, j] = isoDate.split('-').map(Number);
  const total = a * 12 + (m - 1) + mois;
  const annee = Math.floor(total / 12);
  const moisCible = (total % 12) + 1;
  return iso(annee, moisCible, Math.min(j, dernierJourDuMois(annee, moisCible)));
}

/** Nombre de jours entre deux dates ISO (b − a). */
export function ecartJours(a: string, b: string): number {
  const ta = Date.parse(`${a}T00:00:00Z`);
  const tb = Date.parse(`${b}T00:00:00Z`);
  return Math.round((tb - ta) / 86_400_000);
}

/** Nombre d'années pleines écoulées entre deux dates ISO. */
export function anneesPleines(debut: string, fin: string): number {
  const [a1, m1, j1] = debut.split('-').map(Number);
  const [a2, m2, j2] = fin.split('-').map(Number);
  let n = a2 - a1;
  if (m2 < m1 || (m2 === m1 && j2 < j1)) n -= 1;
  return Math.max(0, n);
}

export function estDateIso(texte: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(texte)) return false;
  const [a, m, j] = texte.split('-').map(Number);
  return m >= 1 && m <= 12 && j >= 1 && j <= dernierJourDuMois(a, m);
}
