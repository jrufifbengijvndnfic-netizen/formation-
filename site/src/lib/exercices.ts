/**
 * Exercices d'entraînement de fin de module et questions notées des examens, lus dans
 * files/formation-immobilier-locatif-2026/exercices.md (complément ajouté à la demande de l'auteur,
 * sans modifier le Markdown de la formation). Format décrit en tête du fichier.
 * Logique pure : l'analyse reçoit le texte, la correction ne dépend pas du DOM.
 */

export type TypeExercice = 'qcm' | 'multi' | 'nombre' | 'vf';
export const LETTRES_EXERCICE = ['A', 'B', 'C', 'D', 'E'] as const;
export type LettreExercice = (typeof LETTRES_EXERCICE)[number];

export interface Exercice {
  /** Identifiant stable : « x1-1-3 » (module 1.1, exercice 3) ou « xniveau-1-5 ». */
  id: string;
  type: TypeExercice;
  question: string;
  /** Propositions (qcm : A à D ; multi : A à E). */
  options: Partial<Record<LettreExercice, string>>;
  /** Bonne(s) lettre(s) (qcm, multi). */
  lettres: LettreExercice[];
  /** Valeur attendue (nombre) et écart toléré. */
  valeur?: number;
  tolerance: number;
  unite?: string;
  /** Réponse attendue (vf). */
  vrai?: boolean;
  explication: string;
  /** Numéro du cas d'examen auquel la question se rattache. */
  cas?: number;
  /** Prolonge l'exercice précédent (mêmes données) : reste à sa suite, hors tirage du test final. */
  suite?: boolean;
  /** Numéro de module (« 1.1 ») ou clé d'examen (« niveau-1 », « final »). */
  source: string;
}

export interface SectionExercices {
  /** « module » ou « examen ». */
  portee: 'module' | 'examen';
  /** « 1.1 » pour un module, « niveau-1 » ou « final » pour un examen. */
  cle: string;
  exercices: Exercice[];
}

export class ErreurExercices extends Error {
  constructor(message: string, ligne: number) {
    super(`exercices.md, ligne ${ligne} : ${message}`);
  }
}

/** Nombre écrit à la française (« 1 400 », « 16,5 », « −358,92 ») ; NaN si illisible. */
export function lireNombre(texte: string): number {
  const propre = texte
    .replace(/[\s\u00a0\u202f]/g, '')
    .replace(/[€%]|m²|jours?|mois|semaines?/gi, '')
    .replace(/[−–]/g, '-')
    .replace(',', '.');
  if (!/^-?\d+(\.\d+)?$/.test(propre)) return Number.NaN;
  return Number(propre);
}

const RE_SECTION_MODULE = /^## Module (\d\.\d{1,2})\s*$/;
const RE_SECTION_EXAMEN = /^## Examen (?:de fin de niveau (\d)|final)\s*$/;
/** Champs d'un exercice ; X = explication (ligne « E: » après « R: »), cas = « C: » avant « T: ». */
type Brouillon = Partial<Record<'T' | 'Q' | LettreExercice | 'R' | 'U' | 'P' | 'X' | 'L' | 'cas', string>> & {
  n: number;
};

function construire(b: Brouillon, section: SectionExercices, rang: number): Exercice {
  const type = b.T as TypeExercice;
  if (!['qcm', 'multi', 'nombre', 'vf'].includes(type)) {
    throw new ErreurExercices(`type « ${b.T ?? ''} » : attendu qcm, multi, nombre ou vf`, b.n);
  }
  if (!b.Q) throw new ErreurExercices('exercice sans ligne « Q: »', b.n);
  if (!b.R) throw new ErreurExercices('exercice sans ligne « R: »', b.n);
  if (!b.X) throw new ErreurExercices('exercice sans explication (« E: » en dernière ligne)', b.n);
  const options: Exercice['options'] = {};
  for (const l of LETTRES_EXERCICE) {
    const v = b[l];
    if (v) options[l] = v;
  }
  const base = {
    id: `x${section.cle.replace('.', '-')}-${rang}`,
    type,
    question: b.Q,
    options: {} as Exercice['options'],
    lettres: [] as LettreExercice[],
    tolerance: 0,
    explication: b.X,
    source: section.cle,
    ...(b.cas ? { cas: Number(b.cas) } : {}),
    ...(b.L ? { suite: true } : {}),
  };
  if (b.L && b.L !== 'suite') throw new ErreurExercices(`« L: ${b.L} » : seule la valeur « suite » est admise`, b.n);
  if (b.L && rang === 1) throw new ErreurExercices('le premier exercice d’une section ne peut pas être une suite', b.n);
  if (type === 'qcm' || type === 'multi') {
    const attendues = type === 'qcm' ? ['A', 'B', 'C', 'D'] : ['A', 'B', 'C', 'D', 'E'];
    const presentes = LETTRES_EXERCICE.filter((l) => options[l]);
    if (type === 'qcm' && presentes.join('') !== 'ABCD') {
      throw new ErreurExercices('un qcm a exactement quatre propositions A à D', b.n);
    }
    if (
      type === 'multi' &&
      (presentes.length < 4 || presentes.join('') !== attendues.slice(0, presentes.length).join(''))
    ) {
      throw new ErreurExercices('un multi a quatre ou cinq propositions consécutives à partir de A', b.n);
    }
    const lettres = b.R.split(/\s*,\s*/) as LettreExercice[];
    if (lettres.some((l) => !presentes.includes(l)) || new Set(lettres).size !== lettres.length) {
      throw new ErreurExercices(`réponse « ${b.R} » : lettres inconnues ou en double`, b.n);
    }
    if (type === 'qcm' && lettres.length !== 1) throw new ErreurExercices('un qcm a une seule bonne réponse', b.n);
    if (type === 'multi' && lettres.length < 2)
      throw new ErreurExercices('un multi a au moins deux bonnes réponses', b.n);
    return { ...base, options, lettres: [...lettres].sort() };
  }
  if (Object.keys(options).length) throw new ErreurExercices(`un exercice « ${type} » n'a pas de propositions`, b.n);
  if (type === 'vf') {
    if (b.R !== 'V' && b.R !== 'F') throw new ErreurExercices(`réponse « ${b.R} » : attendu V ou F`, b.n);
    return { ...base, vrai: b.R === 'V' };
  }
  const valeur = lireNombre(b.R);
  const tolerance = b.P ? lireNombre(b.P) : 0;
  if (Number.isNaN(valeur)) throw new ErreurExercices(`réponse « ${b.R} » : nombre attendu`, b.n);
  if (Number.isNaN(tolerance) || tolerance < 0) throw new ErreurExercices(`tolérance « ${b.P} » invalide`, b.n);
  return { ...base, valeur, tolerance, ...(b.U ? { unite: b.U } : {}) };
}

/** Analyse le fichier d'exercices ; toute anomalie lève une erreur qui cite la ligne. */
export function lireExercices(texte: string): SectionExercices[] {
  const sections: SectionExercices[] = [];
  let section: SectionExercices | null = null;
  let dansBloc = false;
  let brouillon: Brouillon | null = null;

  const clore = () => {
    if (!brouillon || !section) return;
    section.exercices.push(construire(brouillon, section, section.exercices.length + 1));
    brouillon = null;
  };

  texte.split('\n').forEach((brut, i) => {
    const n = i + 1;
    const ligne = brut.replace(/\r$/, '');
    if (!dansBloc) {
      const m = RE_SECTION_MODULE.exec(ligne);
      const e = RE_SECTION_EXAMEN.exec(ligne);
      if (m) section = { portee: 'module', cle: m[1] as string, exercices: [] };
      else if (e) section = { portee: 'examen', cle: e[1] ? `niveau-${e[1]}` : 'final', exercices: [] };
      else if (ligne.startsWith('## ')) throw new ErreurExercices(`section inconnue : « ${ligne} »`, n);
      if (m || e) {
        if (sections.some((s) => s.cle === (section as SectionExercices).cle)) {
          throw new ErreurExercices(`section en double : « ${ligne} »`, n);
        }
        sections.push(section as SectionExercices);
      }
      if (ligne.trim() === '```exercices') {
        if (!section) throw new ErreurExercices('bloc d’exercices hors section', n);
        dansBloc = true;
      }
      return;
    }
    if (ligne.trim() === '```') {
      clore();
      dansBloc = false;
      return;
    }
    if (ligne.trim() === '') {
      clore();
      return;
    }
    const m = /^([TQABCDERUPL]): ?(.*)$/.exec(ligne);
    if (!m) throw new ErreurExercices(`ligne non reconnue : « ${ligne} »`, n);
    const cle = m[1] as string;
    const valeur = (m[2] as string).trim();
    brouillon ??= { n };
    const b = brouillon as Brouillon;
    // « C: » avant « T: » = numéro de cas ; « E: » après « R: » = explication.
    if (cle === 'C' && !b.T) b.cas = valeur;
    else if (cle === 'E' && b.R) b.X = valeur;
    else if (b[cle as LettreExercice] !== undefined) {
      throw new ErreurExercices(`ligne « ${cle}: » en double (ligne vide manquante ?)`, n);
    } else b[cle as LettreExercice] = valeur;
  });
  if (dansBloc) throw new ErreurExercices('bloc d’exercices non refermé', texte.split('\n').length);
  return sections;
}

// ---------------------------------------------------------------------------
// Correction
// ---------------------------------------------------------------------------

/** Réponse donnée : lettres cochées (qcm, multi), texte saisi (nombre), V ou F (vf). */
export type ReponseDonnee = string[] | string | null;

export function estCorrect(x: Exercice, r: ReponseDonnee): boolean {
  if (r === null || (Array.isArray(r) && r.length === 0) || r === '') return false;
  switch (x.type) {
    case 'qcm':
    case 'multi': {
      const donnees = (Array.isArray(r) ? r : [r]).slice().sort();
      return donnees.join(',') === x.lettres.join(',');
    }
    case 'vf':
      return (r === 'V') === x.vrai && (r === 'V' || r === 'F');
    case 'nombre': {
      const v = lireNombre(Array.isArray(r) ? (r[0] ?? '') : r);
      return !Number.isNaN(v) && Math.abs(v - (x.valeur as number)) <= x.tolerance + 1e-9;
    }
  }
}

/** « 1 400 », « 16,5 », « −358,92 » : nombre affiché à la française. */
export function nombreFrancais(v: number): string {
  const [ent, dec] = Math.abs(v).toString().split('.');
  const groupes = (ent as string).replace(/\B(?=(\d{3})+(?!\d))/g, '\u202f');
  return `${v < 0 ? '−' : ''}${groupes}${dec ? `,${dec}` : ''}`;
}

/** Texte de la réponse attendue, pour la correction. */
export function reponseAttendue(x: Exercice): string {
  switch (x.type) {
    case 'qcm':
    case 'multi':
      return x.lettres.map((l) => `${l} — ${x.options[l]}`).join(' ; ');
    case 'vf':
      return x.vrai ? 'Vrai' : 'Faux';
    case 'nombre':
      return `${nombreFrancais(x.valeur as number)}${x.unite ? `\u00a0${x.unite}` : ''}`;
  }
}

export const SEUIL_EXERCICES = 0.7;

/** Tire au hasard `total` questions, au moins une par source, dans un ordre mélangé. */
export function tirer<T extends { source: string }>(pool: T[], total: number, hasard: () => number = Math.random): T[] {
  const melanger = <U>(t: U[]): U[] => {
    const c = [...t];
    for (let i = c.length - 1; i > 0; i--) {
      const j = Math.floor(hasard() * (i + 1));
      [c[i], c[j]] = [c[j] as U, c[i] as U];
    }
    return c;
  };
  const parSource = new Map<string, T[]>();
  for (const q of pool) parSource.set(q.source, [...(parSource.get(q.source) ?? []), q]);
  const choisies = new Set<T>();
  for (const questions of parSource.values()) {
    const q = melanger(questions)[0];
    if (q && choisies.size < total) choisies.add(q);
  }
  for (const q of melanger(pool)) {
    if (choisies.size >= total) break;
    choisies.add(q);
  }
  return melanger([...choisies]);
}
