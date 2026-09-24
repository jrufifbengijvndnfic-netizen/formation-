/**
 * Lecture du Markdown de la formation (source unique de vérité) et extraction de sa structure :
 * parties, éléments (sections 0.x, modules, examens, checklist, annexes), rubriques (####),
 * encadrés `> [!TYPE]`, blocs ```quiz, ```lettre, formules (blocs sans langage),
 * listes des checklists et termes du glossaire.
 *
 * Le parseur ne modifie jamais le texte : il découpe et classe. Toute syntaxe inattendue
 * (encadré inconnu, question de quiz incomplète…) provoque une erreur qui cite la ligne fautive,
 * pour que le build échoue plutôt que de publier un contenu tronqué.
 */
import { lireDateFr } from './dates-fr';
import { slugify } from './slug';
import {
  TYPES_ENCADRE,
  type Checklist,
  type Element,
  type Encadre,
  type Formation,
  type Lettre,
  type Niveau,
  type Partie,
  type QuizQuestion,
  type Rubrique,
  type TermeGlossaire,
  type TypeElement,
  type TypeEncadre,
  type TypePartie,
} from './types';

export class ErreurFormation extends Error {
  constructor(message: string, ligne?: number) {
    super(ligne ? `Ligne ${ligne} : ${message}` : message);
    this.name = 'ErreurFormation';
  }
}

interface Ligne {
  texte: string;
  /** Numéro de ligne dans le fichier, à partir de 1. */
  n: number;
  /** Vrai si la ligne est une clôture ``` ou se trouve dans un bloc de code. */
  code: boolean;
}

const RE_FENCE_OUVRANTE = /^```([\w-]*)\s*$/;
const RE_FENCE_FERMANTE = /^```\s*$/;
const RE_SEPARATEUR = /^-{3,}\s*$/;

function decouperLignes(md: string): Ligne[] {
  const brutes = md.replace(/\r\n?/g, '\n').split('\n');
  const lignes: Ligne[] = [];
  let dansCode = false;
  let ouverture = 0;
  brutes.forEach((texte, i) => {
    const n = i + 1;
    if (!dansCode && RE_FENCE_OUVRANTE.test(texte)) {
      dansCode = true;
      ouverture = n;
      lignes.push({ texte, n, code: true });
      return;
    }
    if (dansCode) {
      if (RE_FENCE_FERMANTE.test(texte)) dansCode = false;
      lignes.push({ texte, n, code: true });
      return;
    }
    lignes.push({ texte, n, code: false });
  });
  if (dansCode) throw new ErreurFormation('bloc de code ``` jamais refermé', ouverture);
  return lignes;
}

const titreDe = (l: Ligne, niveau: number): string | null => {
  if (l.code) return null;
  const m = new RegExp(`^#{${niveau}} (.+?)\\s*$`).exec(l.texte);
  return m ? m[1] : null;
};

/** Retire les lignes vides et les séparateurs `---` en début et en fin de bloc. */
function nettoyer(lignes: Ligne[]): Ligne[] {
  let debut = 0;
  let fin = lignes.length;
  const vide = (l: Ligne) => !l.code && (l.texte.trim() === '' || RE_SEPARATEUR.test(l.texte));
  while (debut < fin && vide(lignes[debut])) debut++;
  while (fin > debut && vide(lignes[fin - 1])) fin--;
  return lignes.slice(debut, fin);
}

const joindre = (lignes: Ligne[]): string =>
  nettoyer(lignes)
    .map((l) => l.texte)
    .join('\n');

/** Découpe une liste de lignes en blocs commençant chacun par un titre de niveau donné. */
function decouperParTitre(
  lignes: Ligne[],
  niveau: number,
): { avant: Ligne[]; blocs: { titre: string; ligne: Ligne; corps: Ligne[] }[] } {
  const avant: Ligne[] = [];
  const blocs: { titre: string; ligne: Ligne; corps: Ligne[] }[] = [];
  for (const l of lignes) {
    const titre = titreDe(l, niveau);
    if (titre !== null) {
      blocs.push({ titre, ligne: l, corps: [] });
    } else if (blocs.length) {
      blocs[blocs.length - 1].corps.push(l);
    } else {
      avant.push(l);
    }
  }
  return { avant, blocs };
}

// ---------------------------------------------------------------------------
// Blocs de code
// ---------------------------------------------------------------------------

interface BlocCode {
  langage: string;
  lignes: Ligne[];
  debut: number;
}

function blocsDeCode(lignes: Ligne[]): BlocCode[] {
  const blocs: BlocCode[] = [];
  let courant: BlocCode | null = null;
  for (const l of lignes) {
    if (!l.code) continue;
    if (!courant) {
      const m = RE_FENCE_OUVRANTE.exec(l.texte);
      if (!m) continue;
      courant = { langage: m[1], lignes: [], debut: l.n };
    } else if (RE_FENCE_FERMANTE.test(l.texte)) {
      blocs.push(courant);
      courant = null;
    } else {
      courant.lignes.push(l);
    }
  }
  return blocs;
}

const LETTRES_QUIZ = ['A', 'B', 'C', 'D'] as const;

export function lireQuiz(bloc: BlocCode, numeroModule: string): QuizQuestion[] {
  const questions: QuizQuestion[] = [];
  type Brouillon = Partial<Record<'Q' | 'A' | 'B' | 'C' | 'D' | 'R' | 'E', string>> & { n: number };
  let brouillon: Brouillon | null = null;

  const clore = () => {
    if (!brouillon) return;
    const b = brouillon;
    for (const cle of ['Q', 'A', 'B', 'C', 'D', 'R', 'E'] as const) {
      if (!b[cle]) throw new ErreurFormation(`question de quiz sans ligne « ${cle}: »`, b.n);
    }
    const reponse = b.R as string;
    if (!(LETTRES_QUIZ as readonly string[]).includes(reponse)) {
      throw new ErreurFormation(`réponse de quiz « ${reponse} » : attendu A, B, C ou D`, b.n);
    }
    questions.push({
      id: `q${numeroModule.replace('.', '-')}-${questions.length + 1}`,
      question: b.Q as string,
      options: { A: b.A as string, B: b.B as string, C: b.C as string, D: b.D as string },
      reponse: reponse as QuizQuestion['reponse'],
      explication: b.E as string,
    });
    brouillon = null;
  };

  for (const l of bloc.lignes) {
    if (l.texte.trim() === '') {
      clore();
      continue;
    }
    const m = /^([QABCDRE]): ?(.*)$/.exec(l.texte);
    if (!m) throw new ErreurFormation(`ligne de quiz non reconnue : « ${l.texte} »`, l.n);
    const cle = m[1] as keyof Omit<Brouillon, 'n'>;
    brouillon ??= { n: l.n };
    if (brouillon[cle] !== undefined) {
      throw new ErreurFormation(`ligne « ${cle}: » en double (ligne vide manquante ?)`, l.n);
    }
    brouillon[cle] = m[2].trim();
  }
  clore();
  if (!questions.length) throw new ErreurFormation('bloc quiz vide', bloc.debut);
  return questions;
}

// ---------------------------------------------------------------------------
// Encadrés
// ---------------------------------------------------------------------------

function lireEncadres(lignes: Ligne[], elementId: string): Encadre[] {
  const encadres: Encadre[] = [];
  let groupe: Ligne[] = [];
  const clore = () => {
    if (!groupe.length) return;
    const premiere = groupe[0];
    const m = /^>\s*\[!([A-Z_]+)\]\s*$/.exec(premiere.texte);
    if (m) {
      const type = m[1];
      if (!(TYPES_ENCADRE as readonly string[]).includes(type)) {
        throw new ErreurFormation(
          `type d'encadré inconnu « ${type} » (attendu : ${TYPES_ENCADRE.join(', ')})`,
          premiere.n,
        );
      }
      encadres.push({
        type: type as TypeEncadre,
        lignes: groupe.slice(1).map((l) => l.texte.replace(/^>\s?/, '')),
        elementId,
        rang: encadres.length + 1,
      });
    }
    groupe = [];
  };
  for (const l of lignes) {
    if (!l.code && l.texte.startsWith('>')) groupe.push(l);
    else clore();
  }
  clore();
  return encadres;
}

// ---------------------------------------------------------------------------
// Éléments
// ---------------------------------------------------------------------------

const RE_MODULE = /^Module (\d+\.\d+) — (.+)$/;
const RE_ANNEXE = /^Annexe ([A-Z]) — (.+)$/;
const RE_SECTION = /^(\d+\.\d+) (.+)$/;

function typeElement(titre: string, n: number): { type: TypeElement; numero?: string; court: string } {
  let m = RE_MODULE.exec(titre);
  if (m) return { type: 'module', numero: m[1], court: m[2] };
  m = RE_ANNEXE.exec(titre);
  if (m) return { type: 'annexe', numero: m[1], court: m[2] };
  if (titre.startsWith('Examen ')) return { type: 'examen', court: titre };
  m = /^Checklist — (.+)$/.exec(titre);
  if (m) return { type: 'checklist', court: m[1] };
  m = RE_SECTION.exec(titre);
  if (m) return { type: 'section', numero: m[1], court: m[2] };
  throw new ErreurFormation(`titre de niveau 3 non reconnu : « ${titre} »`, n);
}

const RE_ITEM_LISTE = /^\d+\. (.+)$/;

function itemsNumerotes(lignes: Ligne[]): string[] {
  return lignes
    .filter((l) => !l.code)
    .map((l) => RE_ITEM_LISTE.exec(l.texte)?.[1])
    .filter((x): x is string => Boolean(x));
}

function lireElement(
  titre: string,
  ligneTitre: Ligne,
  corps: Ligne[],
  niveau: Niveau | undefined,
): Element {
  const { type, numero, court } = typeElement(titre, ligneTitre.n);
  const id = slugify(titre);
  const { avant, blocs } = decouperParTitre(corps, 4);
  const idsVus = new Map<string, number>();

  const rubriques: Rubrique[] = blocs.map(({ titre: tr, ligne, corps: c }) => {
    let rid = slugify(tr) || 'rubrique';
    const deja = idsVus.get(rid) ?? 0;
    idsVus.set(rid, deja + 1);
    if (deja) rid = `${rid}-${deja + 1}`;
    const rubrique: Rubrique = { titre: tr, id: rid, markdown: joindre(c) };
    const codes = blocsDeCode(c);

    const quiz = /^Quiz (\d+\.\d+)$/.exec(tr);
    if (quiz) {
      if (type !== 'module' || quiz[1] !== numero) {
        throw new ErreurFormation(`rubrique « ${tr} » hors de son module (${titre})`, ligne.n);
      }
      const blocsQuiz = codes.filter((b) => b.langage === 'quiz');
      if (blocsQuiz.length !== 1) {
        throw new ErreurFormation(`la rubrique « ${tr} » doit contenir un seul bloc \`\`\`quiz`, ligne.n);
      }
      rubrique.quiz = lireQuiz(blocsQuiz[0], quiz[1]);
    }

    const lettre = /^(F\d+)\. (.+)$/.exec(tr);
    const blocsLettre = codes.filter((b) => b.langage === 'lettre');
    if (blocsLettre.length) {
      if (!lettre || blocsLettre.length !== 1) {
        throw new ErreurFormation(`bloc \`\`\`lettre hors d'une rubrique « Fn. Titre »`, blocsLettre[0].debut);
      }
      rubrique.lettre = {
        id: lettre[1].toLowerCase(),
        numero: lettre[1],
        titre: lettre[2],
        texte: blocsLettre[0].lignes.map((l) => l.texte).join('\n'),
      };
    }

    const checklistG = /^(G\d+)\. (.+)$/.exec(tr);
    if (checklistG && type === 'annexe') {
      rubrique.checklist = {
        id: checklistG[1].toLowerCase(),
        titre: checklistG[2],
        items: itemsNumerotes(c),
        elementId: id,
      };
    }

    if (type === 'annexe' && /^[A-Z]$/.test(tr)) {
      rubrique.termes = nettoyer(c)
        .filter((l) => !l.code && l.texte.trim() !== '')
        .map((l) => {
          const m = /^\*\*(.+?)\*\* : (.+)$/.exec(l.texte);
          if (!m) throw new ErreurFormation(`ligne de glossaire non reconnue : « ${l.texte} »`, l.n);
          return { terme: m[1], definition: m[2].trim(), lettre: tr, id: slugify(m[1]) };
        });
    }
    return rubrique;
  });

  const element: Element = {
    type,
    titre,
    id,
    numero,
    titreCourt: court,
    niveau,
    intro: joindre(avant),
    rubriques,
    markdown: joindre(corps),
    encadres: lireEncadres(corps, id),
    formules: blocsDeCode(corps)
      .filter((b) => b.langage === '')
      .map((b) => b.lignes.map((l) => l.texte).join('\n')),
    ligne: ligneTitre.n,
  };
  if (type === 'checklist') {
    element.rubriques = [];
    const items = itemsNumerotes(corps);
    if (!items.length) throw new ErreurFormation(`checklist sans liste numérotée`, ligneTitre.n);
  }
  return element;
}

function typePartie(titre: string, n: number): { type: TypePartie; niveau?: Niveau; court: string } {
  if (/^0\. /.test(titre)) return { type: 'mode-emploi', court: titre.replace(/^0\. /, '') };
  const m = /^NIVEAU ([123]) — (.+)$/.exec(titre);
  if (m) return { type: 'niveau', niveau: Number(m[1]) as Niveau, court: m[2] };
  const a = /^ANNEXES — (.+)$/.exec(titre);
  if (a) return { type: 'annexes', court: a[1] };
  throw new ErreurFormation(`titre de partie non reconnu : « ${titre} »`, n);
}

// ---------------------------------------------------------------------------
// Point d'entrée
// ---------------------------------------------------------------------------

export function parseFormation(md: string): Formation {
  const lignes = decouperLignes(md);
  const titres1 = lignes.filter((l) => titreDe(l, 1) !== null);
  if (titres1.length !== 1) {
    throw new ErreurFormation(`le document doit avoir un seul titre « # » (${titres1.length} trouvés)`);
  }
  const indexTitre = lignes.indexOf(titres1[0]);
  const titre = titreDe(titres1[0], 1) as string;

  // Conclusion : paragraphe final isolé après le dernier séparateur « --- ».
  let finContenu = lignes.length;
  let conclusion = '';
  for (let i = lignes.length - 1; i > indexTitre; i--) {
    const l = lignes[i];
    if (l.code) break;
    if (RE_SEPARATEUR.test(l.texte)) {
      const apres = lignes.slice(i + 1).filter((x) => x.texte.trim() !== '');
      if (apres.length && apres.every((x) => !/^#/.test(x.texte) && !x.code)) {
        conclusion = apres.map((x) => x.texte).join('\n');
        finContenu = i;
      }
      break;
    }
  }

  const { avant, blocs } = decouperParTitre(lignes.slice(indexTitre + 1, finContenu), 2);
  const entete = nettoyer(avant).filter((l) => l.texte.trim() !== '' && !RE_SEPARATEUR.test(l.texte));
  const ligneEdition = entete.find((l) => /^\*\*.+\*\*$/.test(l.texte));
  if (!ligneEdition) throw new ErreurFormation("ligne d'édition en gras introuvable sous le titre");
  const mentionEdition = ligneEdition.texte.replace(/^\*\*|\*\*$/g, '');
  const m = /Édition (.+?) — contenu à jour au (.+)$/i.exec(mentionEdition);
  const periode = m ? lireDateFr(m[2]) : null;
  if (!m || !periode || periode.precision !== 'jour') {
    throw new ErreurFormation(
      "ligne d'édition attendue : « **Édition <mois année> — contenu à jour au <jour mois année>** »",
      ligneEdition.n,
    );
  }
  const accroche = entete
    .filter((l) => l !== ligneEdition)
    .map((l) => l.texte)
    .join('\n');

  const parties: Partie[] = blocs.map(({ titre: tp, ligne, corps }) => {
    const { type, niveau, court } = typePartie(tp, ligne.n);
    const sous = decouperParTitre(corps, 3);
    return {
      type,
      titre: tp,
      id: slugify(tp),
      niveau,
      titreCourt: court,
      intro: joindre(sous.avant),
      elements: sous.blocs.map((b) => lireElement(b.titre, b.ligne, b.corps, niveau)),
    };
  });

  const ids = new Set<string>();
  for (const p of parties) {
    for (const e of p.elements) {
      if (ids.has(e.id)) throw new ErreurFormation(`identifiant en double : « ${e.id} »`, e.ligne);
      ids.add(e.id);
    }
  }

  return {
    titre,
    mentionEdition,
    edition: m[1],
    aJourAu: periode.debut,
    aJourAuTexte: m[2],
    accroche,
    conclusion,
    parties,
  };
}

// ---------------------------------------------------------------------------
// Accès pratiques
// ---------------------------------------------------------------------------

export const tousLesElements = (f: Formation): Element[] => f.parties.flatMap((p) => p.elements);

export const modules = (f: Formation): Element[] =>
  tousLesElements(f).filter((e) => e.type === 'module');

export function quizDuModule(e: Element): QuizQuestion[] {
  return e.rubriques.find((r) => r.quiz)?.quiz ?? [];
}

export function toutesLesQuestions(f: Formation): QuizQuestion[] {
  return modules(f).flatMap(quizDuModule);
}

export function glossaire(f: Formation): TermeGlossaire[] {
  return tousLesElements(f)
    .filter((e) => e.type === 'annexe')
    .flatMap((e) => e.rubriques.flatMap((r) => r.termes ?? []));
}

export function lettres(f: Formation): Lettre[] {
  return tousLesElements(f).flatMap((e) => e.rubriques.flatMap((r) => (r.lettre ? [r.lettre] : [])));
}

export function encadres(f: Formation): Encadre[] {
  return tousLesElements(f).flatMap((e) => e.encadres);
}

export function formules(f: Formation): string[] {
  return tousLesElements(f).flatMap((e) => e.formules);
}

/** Checklist du niveau 1 puis checklists G1 à G6 de l'annexe G. */
export function checklists(f: Formation): Checklist[] {
  return tousLesElements(f).flatMap((e): Checklist[] => {
    if (e.type === 'checklist') {
      return [
        {
          id: e.id.replace(/^checklist-/, ''),
          titre: e.titreCourt,
          items: e.markdown
            .split('\n')
            .map((l) => RE_ITEM_LISTE.exec(l)?.[1])
            .filter((x): x is string => Boolean(x)),
          elementId: e.id,
        },
      ];
    }
    return e.rubriques.flatMap((r) => (r.checklist ? [r.checklist] : []));
  });
}
