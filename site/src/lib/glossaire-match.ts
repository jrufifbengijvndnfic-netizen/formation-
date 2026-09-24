/**
 * Repérage des termes du glossaire dans un texte : insensible à la casse et aux accents,
 * sauf pour les sigles (« TRI », « VAN », « ORT » ne doivent pas reconnaître « tri », « van »…),
 * pluriel en -s ou -x accepté, variantes utiles (« GLI » pour « Assurance loyers impayés (GLI) »).
 */
import type { TermeGlossaire } from './types';

/** Termes trop courts ou trop génériques pour une infobulle (identifiants du glossaire). */
export const EXCLUSIONS_INFOBULLES = new Set(['bail', 'conge', 'zonage-a-b-c']);

/** Variantes ajoutées à la main (identifiant → formulations employées dans la formation). */
export const VARIANTES: Record<string, string[]> = {
  'loi-du-6-juillet-1989': ['loi de 1989'],
  'liasse-fiscale-2031': ['liasse 2031'],
  dpe: ['diagnostic de performance énergétique'],
  'eco-ptz': ['éco-prêt à taux zéro'],
  'plan-pluriannuel-de-travaux': ['plan pluriannuel'],
  'rentabilite-nette': ['rentabilité nette de charges'],
};

/** Forme normalisée caractère par caractère (même longueur que le texte d'origine). */
export function normaliser(texte: string): string {
  let sortie = '';
  for (let i = 0; i < texte.length; i++) {
    const c = texte[i] as string;
    if (c === '’') sortie += "'";
    else if (c === ' ' || c === ' ') sortie += ' ';
    else sortie += (c.normalize('NFD')[0] ?? c).toLowerCase();
  }
  return sortie;
}

/** Un mot est traité comme un sigle (casse exacte) s'il contient au moins deux capitales ou n'est qu'une capitale. */
function estSigle(mot: string): boolean {
  const capitales = (mot.match(/\p{Lu}/gu) ?? []).length;
  return capitales >= 2 || /^\p{Lu}$/u.test(mot);
}

export function variantesDuTerme(t: TermeGlossaire): string[] {
  const v = new Set<string>([t.terme]);
  const parenthese = /^(.+?) \((.+)\)$/.exec(t.terme);
  if (parenthese) {
    const [, avant, dedans] = parenthese as unknown as [string, string, string];
    v.add(avant);
    if (/^[\p{Lu}\d]{2,}$/u.test(dedans)) v.add(dedans);
    else v.add(`${dedans} ${avant}`);
  }
  const deux = /^([\p{Lu}]{2,}) et ([\p{Lu}]{2,})$/u.exec(t.terme);
  if (deux) {
    v.add(deux[1] as string);
    v.add(deux[2] as string);
  }
  for (const x of VARIANTES[t.id] ?? []) v.add(x);
  return [...v];
}

interface Motif {
  id: string;
  variante: string;
  re: RegExp;
  /** Positions (dans la variante) dont la casse doit correspondre exactement. */
  exactes: number[];
}

export interface Occurrence {
  debut: number;
  fin: number;
  id: string;
}

const echapperRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export class ChercheurGlossaire {
  private readonly motifs: Motif[];
  readonly termes: Map<string, TermeGlossaire>;

  constructor(termes: TermeGlossaire[], exclusions: Set<string> = EXCLUSIONS_INFOBULLES) {
    this.termes = new Map(termes.map((t) => [t.id, t]));
    const motifs: Motif[] = [];
    for (const t of termes) {
      if (exclusions.has(t.id)) continue;
      for (const variante of variantesDuTerme(t)) {
        const exactes: number[] = [];
        let pos = 0;
        for (const mot of variante.split(/([\s'’-]+)/)) {
          if (!/^[\s'’-]+$/.test(mot) && estSigle(mot)) {
            for (let k = 0; k < mot.length; k++) exactes.push(pos + k);
          }
          pos += mot.length;
        }
        const pluriel = /\p{L}$/u.test(variante) && !estSigle(variante.split(/\s+/).at(-1) ?? '') ? '(?:s|x)?' : '';
        const re = new RegExp(
          `(?<![\\p{L}\\p{N}])${echapperRe(normaliser(variante))}${pluriel}(?![\\p{L}\\p{N}])`,
          'gu',
        );
        motifs.push({ id: t.id, variante, re, exactes });
      }
    }
    // Les formulations les plus longues d'abord : « Bail mobilité » avant « Bail ».
    motifs.sort((a, b) => b.variante.length - a.variante.length);
    this.motifs = motifs;
  }

  /** Occurrences non chevauchantes, triées par position. */
  chercher(texte: string): Occurrence[] {
    const norme = normaliser(texte);
    const prises: Occurrence[] = [];
    for (const m of this.motifs) {
      m.re.lastIndex = 0;
      let r: RegExpExecArray | null;
      while ((r = m.re.exec(norme))) {
        const debut = r.index;
        const fin = debut + r[0].length;
        if (!m.exactes.every((k) => texte[debut + k] === m.variante[k])) continue;
        if (prises.some((p) => debut < p.fin && fin > p.debut)) continue;
        prises.push({ debut, fin, id: m.id });
      }
    }
    return prises.sort((a, b) => a.debut - b.debut);
  }

  /** Identifiants des termes présents au moins une fois dans le texte. */
  termesPresents(texte: string): Set<string> {
    return new Set(this.chercher(texte).map((o) => o.id));
  }
}
