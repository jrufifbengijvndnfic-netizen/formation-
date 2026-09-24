/** Adresses des pages et parcours de lecture (précédent / suivant). */
import type { Element, Formation } from './types';

/** Préfixe une adresse interne par la base du site (BASE_PATH, utile sur GitHub Pages). */
export function lien(chemin = ''): string {
  const base = ((import.meta as { env?: { BASE_URL?: string } }).env?.BASE_URL ?? '/').replace(/\/?$/, '/');
  return base + chemin.replace(/^\//, '');
}

/** Page de vente de la formation. */
export const CHEMIN_VENTE = 'formation-investissement-locatif/';

export const idModule = (numero: string): string => numero.replace('.', '-');

export function slugExamen(e: Element): string {
  const m = /niveau (\d)/.exec(e.titre);
  return m ? `niveau-${m[1]}` : 'final';
}

export const slugChecklist = (e: Element): string => e.id.replace(/^checklist-/, '');

/** Chemin (sans la base) de la page d'un élément. */
export function cheminElement(e: Element): string {
  switch (e.type) {
    case 'section':
      return `mode-d-emploi/#${e.id}`;
    case 'module':
      return `module/${idModule(e.numero ?? '')}/`;
    case 'examen':
      return `examen/${slugExamen(e)}/`;
    case 'checklist':
      return `checklist/${slugChecklist(e)}/`;
    case 'annexe':
      return e.numero === 'C' ? 'glossaire/' : `annexe/${(e.numero ?? '').toLowerCase()}/`;
  }
}

export const lienElement = (e: Element): string => lien(cheminElement(e));

export const cheminModule = (numero: string): string => `module/${idModule(numero)}/`;
export const cheminAnnexe = (lettre: string): string =>
  lettre === 'C' ? 'glossaire/' : `annexe/${lettre.toLowerCase()}/`;

/** Libellé court d'un élément pour la navigation. */
export function libelleCourt(e: Element): string {
  switch (e.type) {
    case 'module':
      return `Module ${e.numero}`;
    case 'annexe':
      return `Annexe ${e.numero}`;
    case 'examen':
      return slugExamen(e) === 'final' ? 'Examen final' : `Examen du niveau ${slugExamen(e).slice(-1)}`;
    case 'checklist':
      return 'Checklist';
    case 'section':
      return e.numero ?? e.titre;
  }
}

/** Parcours de lecture : modules, examens et checklist des trois niveaux, dans l'ordre du document. */
export function parcours(f: Formation): Element[] {
  return f.parties.filter((p) => p.type === 'niveau').flatMap((p) => p.elements);
}

export function voisins(f: Formation, e: Element): { precedent?: Element; suivant?: Element } {
  const liste = parcours(f);
  const i = liste.findIndex((x) => x.id === e.id);
  if (i < 0) return {};
  return { precedent: liste[i - 1], suivant: liste[i + 1] };
}
