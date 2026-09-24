/** Mise en forme française des nombres (espaces fines, virgule décimale, signe moins typographique). */

const formateurs = new Map<string, Intl.NumberFormat>();

function formateur(min: number, max: number): Intl.NumberFormat {
  const cle = `${min}-${max}`;
  let f = formateurs.get(cle);
  if (!f) {
    f = new Intl.NumberFormat('fr-FR', { minimumFractionDigits: min, maximumFractionDigits: max });
    formateurs.set(cle, f);
  }
  return f;
}

/** Nombre au format français ; « − » (U+2212) pour les valeurs négatives. */
export function nombre(x: number, decimales = 0, decimalesMax = decimales): string {
  if (!Number.isFinite(x)) return '—';
  const arrondi = Math.abs(x) < 0.5 * 10 ** -decimalesMax ? 0 : x;
  return formateur(decimales, decimalesMax).format(arrondi).replace('-', '−');
}

/** Montant en euros, deux décimales par défaut. */
export function euros(x: number, decimales = 2): string {
  return `${nombre(x, decimales)}\u00a0€`;
}

/** Montant en euros arrondi à l'euro. */
export const eurosArrondis = (x: number): string => euros(x, 0);

/** Taux (0,0529 → « 5,29 % »). */
export function pourcent(x: number, decimales = 2): string {
  return `${nombre(x * 100, decimales)}\u00a0%`;
}

/** Lecture d'une saisie française : « 1 234,56 », « 3,35 », « 110000 ». Renvoie NaN si invalide. */
export function lireNombre(saisie: string): number {
  const nettoye = saisie
    .trim()
    .replace(/[\s\u00a0\u202f]/g, '')
    .replace(/[−–]/g, '-')
    .replace(',', '.')
    .replace(/[€%]$/, '');
  if (nettoye === '' || !/^-?\d*\.?\d+$/.test(nettoye)) return Number.NaN;
  return Number(nettoye);
}

/** Échappement HTML pour les rendus en chaîne (simulateurs, lettres). */
export function echapper(texte: string): string {
  return texte
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Espaces insécables de la typographie française, appliquées à l'affichage uniquement
 * (le texte source n'est pas modifié) : séparateur de milliers (espace fine), espace avant
 * une unité (€, %, m²…), dans les guillemets « » et avant « : ; ? ! ».
 */
export function espacesInsecables(texte: string): string {
  return texte
    .replace(/(\d) (?=\d{3}(?!\d))/g, '$1\u202f')
    .replace(/(\d) (?=(?:€|%|m²|m³|ans?\b|mois\b|jours?\b|heures?\b|semaines?\b|HC\b|CC\b|kWh\b))/g, '$1\u00a0')
    .replace(/« /g, '«\u00a0')
    .replace(/ »/g, '\u00a0»')
    .replace(/ ([:;?!])(?=\s|$)/g, '\u202f$1');
}
