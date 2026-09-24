/**
 * Modèles de lettres (annexe F) : chaque passage entre crochets devient un champ à compléter.
 * - « [date] », « [montant] »… : champ libre (date → sélecteur de date, texte long → zone de texte) ;
 * - « [huit / quinze] », « [virement / chèque] » : liste de choix ;
 * - crochets imbriqués (« [Ce montant … le [date] / …] ») : seuls les crochets intérieurs sont des
 *   champs, le passage englobant reste tel quel pour être adapté après copie.
 * Un champ laissé vide reste affiché entre crochets dans l'aperçu.
 */
import { formaterDateFr, estDateIso } from './dates-fr';

export type GenreChamp = 'texte' | 'date' | 'long' | 'choix';

export interface ChampLettre {
  id: string;
  /** Texte entre crochets, tel qu'il figure dans le modèle. */
  libelle: string;
  genre: GenreChamp;
  options?: string[];
  /** Ligne du modèle où figure le champ, le champ remplacé par « … » (aide à la saisie). */
  contexte: string;
}

export type SegmentLettre = { type: 'texte'; texte: string } | { type: 'champ'; champ: ChampLettre };

const RE_CHAMP = /\[([^[\]]+)\]/g;

function genreDe(libelle: string): Pick<ChampLettre, 'genre' | 'options'> {
  if (libelle.includes(' / ')) return { genre: 'choix', options: libelle.split(' / ').map((x) => x.trim()) };
  if (/^date\b|^date de |\bdate du bail\b/i.test(libelle) && !/ ou /.test(libelle)) return { genre: 'date' };
  if (libelle.length > 55 || /^(Reproduire|justification|description|nature et montant)/i.test(libelle)) {
    return { genre: 'long' };
  }
  return { genre: 'texte' };
}

export function analyserLettre(idLettre: string, texte: string): SegmentLettre[] {
  const segments: SegmentLettre[] = [];
  let curseur = 0;
  let n = 0;
  for (const m of texte.matchAll(RE_CHAMP)) {
    const debut = m.index;
    if (debut > curseur) segments.push({ type: 'texte', texte: texte.slice(curseur, debut) });
    const libelle = m[1] as string;
    const debutLigne = texte.lastIndexOf('\n', debut) + 1;
    const finLigne = texte.indexOf('\n', debut);
    const ligne = texte.slice(debutLigne, finLigne < 0 ? undefined : finLigne);
    const position = debut - debutLigne;
    const contexte = `${ligne.slice(0, position)}…${ligne.slice(position + m[0].length)}`.trim();
    n += 1;
    segments.push({ type: 'champ', champ: { id: `${idLettre}-c${n}`, libelle, contexte, ...genreDe(libelle) } });
    curseur = debut + m[0].length;
  }
  if (curseur < texte.length) segments.push({ type: 'texte', texte: texte.slice(curseur) });
  return segments;
}

export const champsDe = (segments: SegmentLettre[]): ChampLettre[] =>
  segments.flatMap((s) => (s.type === 'champ' ? [s.champ] : []));

/** Valeur affichée pour un champ : saisie mise en forme, ou libellé entre crochets si vide. */
export function valeurChamp(champ: ChampLettre, saisie: string | undefined): string {
  const v = (saisie ?? '').trim();
  if (!v) return `[${champ.libelle}]`;
  if (champ.genre === 'date' && estDateIso(v)) return formaterDateFr(v);
  return v;
}

export function remplirLettre(segments: SegmentLettre[], valeurs: Record<string, string>): string {
  return segments.map((s) => (s.type === 'texte' ? s.texte : valeurChamp(s.champ, valeurs[s.champ.id]))).join('');
}
