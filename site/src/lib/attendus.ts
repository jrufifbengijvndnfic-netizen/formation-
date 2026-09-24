/**
 * Comptages attendus du contenu (critère d'acceptation 1 du brief). Le build échoue si le
 * Markdown n'y correspond plus. Si vous ajoutez ou retirez volontairement un module, une
 * question, un terme… mettez ces nombres à jour dans le même commit.
 */
import {
  checklists,
  encadres,
  formules,
  glossaire,
  lettres,
  modules,
  tousLesElements,
  toutesLesQuestions,
} from './parse-formation';
import type { Formation, TypeEncadre } from './types';

export const ATTENDUS = {
  elements: 56,
  sections: 5,
  modules: 38,
  modulesParNiveau: { 1: 12, 2: 14, 3: 12 },
  examens: 3,
  checklistsNiveau: 1,
  annexes: 9,
  questions: 122,
  termes: 180,
  lettres: 10,
  /** Blocs de code sans langage : 4 dans les modules (1.12, 2.1, 3.2, 3.5) et 14 dans l'annexe E. */
  formules: 18,
  formulesAnnexeE: 14,
  checklists: 7,
  encadres: 46,
  encadresParType: {
    NOUVEAU: 7,
    ATTENTION: 9,
    EXEMPLE: 15,
    ASTUCE: 3,
    DEFINITION: 2,
    A_SURVEILLER: 10,
  } satisfies Record<TypeEncadre, number>,
} as const;

export function comptages(f: Formation) {
  const els = tousLesElements(f);
  const parType = (t: string) => els.filter((e) => e.type === t).length;
  const mods = modules(f);
  const enc = encadres(f);
  const encadresParType = Object.fromEntries(
    Object.keys(ATTENDUS.encadresParType).map((t) => [t, enc.filter((e) => e.type === t).length]),
  );
  return {
    elements: els.length,
    sections: parType('section'),
    modules: mods.length,
    modulesParNiveau: {
      1: mods.filter((m) => m.niveau === 1).length,
      2: mods.filter((m) => m.niveau === 2).length,
      3: mods.filter((m) => m.niveau === 3).length,
    },
    examens: parType('examen'),
    checklistsNiveau: parType('checklist'),
    annexes: parType('annexe'),
    questions: toutesLesQuestions(f).length,
    termes: glossaire(f).length,
    lettres: lettres(f).length,
    formules: formules(f).length,
    formulesAnnexeE: els.find((e) => e.type === 'annexe' && e.numero === 'E')?.formules.length ?? 0,
    checklists: checklists(f).length,
    encadres: enc.length,
    encadresParType,
  };
}

/** Liste des écarts entre le contenu et les comptages attendus (vide si tout est conforme). */
export function ecartsComptages(f: Formation): string[] {
  const reel = comptages(f);
  const ecarts: string[] = [];
  const comparer = (chemin: string, attendu: unknown, obtenu: unknown) => {
    if (typeof attendu === 'object' && attendu !== null) {
      for (const [k, v] of Object.entries(attendu)) {
        comparer(`${chemin}.${k}`, v, (obtenu as Record<string, unknown>)[k]);
      }
    } else if (attendu !== obtenu) {
      ecarts.push(`${chemin} : attendu ${String(attendu)}, obtenu ${String(obtenu)}`);
    }
  };
  for (const [k, v] of Object.entries(ATTENDUS)) {
    comparer(k, v, (reel as Record<string, unknown>)[k]);
  }
  return ecarts;
}
