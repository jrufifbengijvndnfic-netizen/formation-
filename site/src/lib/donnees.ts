/**
 * Données prêtes à l'emploi pour les pages (exécuté au build uniquement) :
 * formation chargée et vérifiée, index, rendu HTML des éléments, repères du glossaire.
 */
import { COURS_PUBLIC, MODULES_GRATUITS } from './edition';
import { lireExercices, type Exercice } from './exercices';
import { ChercheurGlossaire } from './glossaire-match';
import { chargerFormation } from './formation';
import { cheminElement, lien } from './navigation';
import { encadres, glossaire, modules, quizDuModule, tousLesElements } from './parse-formation';
import { nouveauContexte, rendreMarkdown, texteBrut, type ContexteRendu } from './render';
import { lireActionsSource, lireExercicesSource, pdfDisponible } from './source';
import { lireActions } from './actions';
import type { Element, Encadre, Niveau, Partie, Rubrique, TermeGlossaire } from './types';

export const formation = chargerFormation();
export const elements = tousLesElements(formation);
export const tousLesModules = modules(formation);
export const niveaux = formation.parties.filter((p) => p.type === 'niveau') as (Partie & { niveau: Niveau })[];
export const partieModeEmploi = formation.parties.find((p) => p.type === 'mode-emploi') as Partie;
export const partieAnnexes = formation.parties.find((p) => p.type === 'annexes') as Partie;
export const annexes = partieAnnexes.elements;
export const termes = glossaire(formation);
/** Modules publiés (liens autorisés) : tous dans l'édition complète, les extraits gratuits sinon. */
export const modulesExistants = new Set(
  tousLesModules.map((m) => m.numero as string).filter((n) => COURS_PUBLIC || MODULES_GRATUITS.includes(n)),
);
export const estPublie = (numeroModule: string): boolean => modulesExistants.has(numeroModule);
export const chercheur = new ChercheurGlossaire(termes);

/** Exercices de fin de module et questions notées des examens (exercices.md). */
export const sectionsExercices = lireExercices(lireExercicesSource());
export const exercicesDuModule = (numero: string): Exercice[] =>
  sectionsExercices.find((s) => s.portee === 'module' && s.cle === numero)?.exercices ?? [];
/** Action « À faire maintenant » de fin de module (actions.md). */
export const actionsModules = lireActions(lireActionsSource());
export const actionDuModule = (numero: string) => actionsModules.find((a) => a.module === numero);
export const exercicesDExamen = (cle: string): Exercice[] =>
  sectionsExercices.find((s) => s.portee === 'examen' && s.cle === cle)?.exercices ?? [];
export const avecPdf = pdfDisponible();

/** Titre du site : partie du titre du document après « — ». */
export const titreSite = formation.titre.split(' — ').at(-1) ?? formation.titre;
export const miseAJour = `Contenu à jour au ${formation.aJourAuTexte}`;

export const elementParId = (id: string): Element | undefined => elements.find((e) => e.id === id);
export const moduleParNumero = (n: string): Element | undefined => tousLesModules.find((m) => m.numero === n);
export const niveauDe = (n: Niveau) => niveaux.find((p) => p.niveau === n) as Partie & { niveau: Niveau };
export const modulesDuNiveau = (n: Niveau) => niveauDe(n).elements.filter((e) => e.type === 'module');
export const numerosDuNiveau = (n: Niveau) => modulesDuNiveau(n).map((m) => m.numero as string);

// ---------------------------------------------------------------------------
// Section 0 : organisation et avertissement
// ---------------------------------------------------------------------------

const section = (numero: string) => partieModeEmploi.elements.find((e) => e.numero === numero) as Element;

/** Tableau de la section 0.2 : intitulé, public et durée indicative de chaque niveau. */
export const organisation: Record<string, { intitule: string; public: string; duree: string }> = Object.fromEntries(
  section('0.2')
    .markdown.split('\n')
    .map((l) => /^\| (Niveau \d|Annexes) \| (.+?) \| (.+?) \| (.+?) \|$/.exec(l))
    .filter((m): m is RegExpExecArray => Boolean(m))
    .map((m) => [m[1] as string, { intitule: m[2] as string, public: m[3] as string, duree: m[4] as string }]),
);

/** Premier paragraphe de la section 0.4 (avertissement), à afficher partout où le brief l'exige. */
export const avertissementMd = section('0.4').markdown.split('\n\n')[0] as string;
export const avertissementHtml = rendreMarkdown(avertissementMd, nouveauContexte({ liensAnnexes: COURS_PUBLIC }));

// ---------------------------------------------------------------------------
// Rendu des éléments
// ---------------------------------------------------------------------------

export interface MorceauRendu {
  rubrique?: Rubrique;
  html: string;
}

export function contexteElement(e: Element, options: Partial<ContexteRendu> = {}): ContexteRendu {
  return nouveauContexte({
    modulesExistants,
    moduleCourant: e.numero,
    // Infobulles et liens d'annexes seulement si le glossaire et les annexes sont publiés.
    glossaire: e.type === 'module' && COURS_PUBLIC ? chercheur : undefined,
    liensAnnexes: COURS_PUBLIC,
    corriges: e.type === 'examen',
    ancresFormules: e.type === 'annexe' && e.numero === 'E',
    colonneModule: e.numero === '0.5',
    prefixeEncadres: e.type === 'section' ? `${e.id}-` : undefined,
    ...options,
  });
}

/**
 * Rend l'introduction puis chaque rubrique d'un élément avec un contexte partagé
 * (numérotation des encadrés, première occurrence des termes). Les rubriques « Textes de
 * référence » ne reçoivent pas d'infobulles. Les quiz, lettres et checklists sont rendus
 * par leurs composants.
 */
export function rendreElement(
  e: Element,
  options: Partial<ContexteRendu> = {},
): { intro: string; rubriques: MorceauRendu[] } {
  const ctx = contexteElement(e, options);
  const intro = rendreMarkdown(e.intro, ctx);
  const rubriques = e.rubriques.map((r) => {
    if (r.quiz || r.lettre || r.checklist || r.termes) return { rubrique: r, html: '' };
    const glossaireSauve = ctx.glossaire;
    if (r.titre === 'Textes de référence') ctx.glossaire = undefined;
    const html = rendreMarkdown(r.markdown, ctx);
    ctx.glossaire = glossaireSauve;
    return { rubrique: r, html };
  });
  return { intro, rubriques };
}

// ---------------------------------------------------------------------------
// Repères
// ---------------------------------------------------------------------------

const MOTS_PAR_MINUTE = 200;

/** Temps de lecture estimé (minutes), quiz exclu. */
export function tempsDeLecture(e: Element): number {
  const texte = e.rubriques
    .filter((r) => !r.quiz)
    .map((r) => r.markdown)
    .concat(e.intro)
    .join(' ');
  const mots = texteBrut(texte).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(mots / MOTS_PAR_MINUTE));
}

/** Objectifs d'un module en texte brut (résumé des pages de niveau). */
export const objectifs = (e: Element): string =>
  texteBrut(e.rubriques.find((r) => r.titre === 'Objectifs')?.markdown ?? '');

/** Coupe un texte à environ `max` caractères, sur une fin de mot. */
export function resumer(texte: string, max = 180): string {
  return texte.length > max ? `${texte.slice(0, max - 3).replace(/\s+\S*$/, '')}…` : texte;
}

/** Description courte d'une page (balise meta description). */
export function description(e: Element): string {
  return resumer(objectifs(e) || texteBrut(e.intro || e.markdown));
}

export const nombreQuestions = (e: Element): number => quizDuModule(e).length;

/** Termes du glossaire employés dans chaque module (hors quiz), pour les renvois du glossaire. */
export const modulesParTerme: Map<string, Element[]> = (() => {
  const index = new Map<string, Element[]>();
  const sansExclusion = new ChercheurGlossaire(termes, new Set());
  for (const m of tousLesModules) {
    const texte = [m.intro, ...m.rubriques.filter((r) => !r.quiz).map((r) => r.markdown)].join('\n');
    for (const id of sansExclusion.termesPresents(texteBrut(texte))) {
      index.set(id, [...(index.get(id) ?? []), m]);
    }
  }
  return index;
})();

export const termesParLettre: [string, TermeGlossaire[]][] = (() => {
  const lettres = new Map<string, TermeGlossaire[]>();
  for (const t of termes) lettres.set(t.lettre, [...(lettres.get(t.lettre) ?? []), t]);
  return [...lettres.entries()];
})();

/** Tous les encadrés « À surveiller », avec l'élément qui les contient. */
export const aSurveiller: { encadre: Encadre; element: Element; lien: string; html: string }[] = encadres(formation)
  .filter((x) => x.type === 'A_SURVEILLER')
  .map((x, i) => {
    const element = elementParId(x.elementId) as Element;
    const md = x.lignes.join('\n');
    const html = rendreMarkdown(md, nouveauContexte({ modulesExistants, prefixeEncadres: `s${i + 1}-` }));
    const chemin = cheminElement(element);
    const ancre =
      element.type === 'section'
        ? chemin.replace(/#.*$/, `#${element.id}-encadre-${x.rang}`)
        : `${chemin}#encadre-${x.rang}`;
    return { encadre: x, element, lien: lien(ancre), html };
  });

/** Valeurs de l'IRL publiées (tableau du module 2.1), proposées dans le simulateur de révision. */
export const irlPublies: { valeur: number; libelle: string }[] = (() => {
  const m21 = moduleParNumero('2.1');
  if (!m21) return [];
  return m21.markdown
    .split('\n')
    .map((l) => /^\| ((?:\d+(?:er|e)) trimestre \d{4}) \| (\d+,\d+) \|/.exec(l))
    .filter((m): m is RegExpExecArray => Boolean(m))
    .map((m) => ({ valeur: Number((m[2] as string).replace(',', '.')), libelle: `IRL du ${m[1]}` }));
})();

/** Questions de quiz par module (clé « 1.1 »). */
export const questionsParModule = new Map(tousLesModules.map((m) => [m.numero as string, quizDuModule(m)]));

// ---------------------------------------------------------------------------
// Contenu des pages de simulateurs (référencement) : formule de l'annexe E
// ---------------------------------------------------------------------------

const annexeE = annexes.find((a) => a.numero === 'E') as Element;

/** Formule de l'annexe E d'un simulateur (« e1 »…) : titre et bloc rendu en HTML. */
export function formuleSimulateur(ancre: string): { titre: string; html: string } {
  const rang = Number(ancre.slice(1));
  const code = annexeE.formules[rang - 1];
  const titre = new RegExp(`\\*\\*E${rang}\\. ([^*]+?)\\.?\\*\\*`).exec(annexeE.markdown)?.[1];
  if (!code || !titre) throw new Error(`Formule ${ancre} introuvable dans l'annexe E`);
  return { titre, html: rendreMarkdown('```\n' + code + '\n```', nouveauContexte()) };
}
