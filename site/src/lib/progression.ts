/**
 * Progression de l'apprenant : modules lus, meilleurs scores de quiz, cases des checklists.
 * Logique pure (sans DOM) ; le stockage est injecté pour pouvoir être absent (navigation privée,
 * stockage bloqué) : dans ce cas la progression reste en mémoire le temps de la visite.
 */

export const CLE_PROGRESSION = 'formation-immobilier-locatif-2026:progression';
export const VERSION_PROGRESSION = 1;
/** Un quiz est « réussi » à partir de 70 % de bonnes réponses. */
export const SEUIL_REUSSITE = 0.7;

export interface EtatQuiz {
  /** Meilleur score, entre 0 et 1. */
  meilleur: number;
  dernier: number;
  tentatives: number;
  le: string;
}

export interface Progression {
  version: typeof VERSION_PROGRESSION;
  /** Numéro de module (« 1.1 ») → date ISO de lecture. */
  lus: Record<string, string>;
  quiz: Record<string, EtatQuiz>;
  /** Identifiant de checklist → cases cochées. */
  checklists: Record<string, boolean[]>;
}

export interface StockageSimple {
  getItem(cle: string): string | null;
  setItem(cle: string, valeur: string): void;
  removeItem(cle: string): void;
}

export const progressionVide = (): Progression => ({ version: VERSION_PROGRESSION, lus: {}, quiz: {}, checklists: {} });

const estObjet = (x: unknown): x is Record<string, unknown> => typeof x === 'object' && x !== null && !Array.isArray(x);
const RE_MODULE = /^\d\.\d{1,2}$/;

/** Valide et nettoie une progression (lecture du stockage ou import d'un fichier). */
export function validerProgression(donnees: unknown): Progression | null {
  if (!estObjet(donnees) || donnees.version !== VERSION_PROGRESSION) return null;
  const p = progressionVide();
  if (estObjet(donnees.lus)) {
    for (const [k, v] of Object.entries(donnees.lus)) {
      if (RE_MODULE.test(k) && typeof v === 'string') p.lus[k] = v.slice(0, 40);
    }
  }
  if (estObjet(donnees.quiz)) {
    for (const [k, v] of Object.entries(donnees.quiz)) {
      if (!RE_MODULE.test(k) || !estObjet(v)) continue;
      const { meilleur, dernier, tentatives, le } = v;
      if (typeof meilleur !== 'number' || meilleur < 0 || meilleur > 1) continue;
      p.quiz[k] = {
        meilleur,
        dernier: typeof dernier === 'number' && dernier >= 0 && dernier <= 1 ? dernier : meilleur,
        tentatives: typeof tentatives === 'number' && tentatives >= 1 ? Math.floor(tentatives) : 1,
        le: typeof le === 'string' ? le.slice(0, 40) : '',
      };
    }
  }
  if (estObjet(donnees.checklists)) {
    for (const [k, v] of Object.entries(donnees.checklists)) {
      if (/^[a-z0-9-]{1,80}$/.test(k) && Array.isArray(v) && v.length <= 200) {
        p.checklists[k] = v.map((x) => x === true);
      }
    }
  }
  return p;
}

export function lireProgression(stockage: StockageSimple | null): Progression {
  if (!stockage) return progressionVide();
  try {
    const brut = stockage.getItem(CLE_PROGRESSION);
    return (brut && validerProgression(JSON.parse(brut))) || progressionVide();
  } catch {
    return progressionVide();
  }
}

/** Enregistre ; renvoie false si le stockage est indisponible ou plein. */
export function ecrireProgression(stockage: StockageSimple | null, p: Progression): boolean {
  if (!stockage) return false;
  try {
    stockage.setItem(CLE_PROGRESSION, JSON.stringify(p));
    return true;
  } catch {
    return false;
  }
}

export function enregistrerQuiz(p: Progression, module: string, score: number, maintenant: string): Progression {
  const avant = p.quiz[module];
  return {
    ...p,
    quiz: {
      ...p.quiz,
      [module]: {
        meilleur: Math.max(score, avant?.meilleur ?? 0),
        dernier: score,
        tentatives: (avant?.tentatives ?? 0) + 1,
        le: maintenant,
      },
    },
  };
}

export function marquerLu(p: Progression, module: string, lu: boolean, maintenant: string): Progression {
  const lus = { ...p.lus };
  if (lu) lus[module] = maintenant;
  else delete lus[module];
  return { ...p, lus };
}

export const quizReussi = (p: Progression, module: string): boolean =>
  (p.quiz[module]?.meilleur ?? 0) >= SEUIL_REUSSITE;

export type StatutModule = 'non-commence' | 'lu' | 'quiz-reussi' | 'termine';

export function statutModule(p: Progression, module: string): StatutModule {
  const lu = Boolean(p.lus[module]);
  const reussi = quizReussi(p, module);
  if (lu && reussi) return 'termine';
  if (reussi) return 'quiz-reussi';
  if (lu) return 'lu';
  return 'non-commence';
}

/** Avancement d'un ensemble de modules : moitié pour la lecture, moitié pour le quiz réussi. */
export function avancement(p: Progression, modules: string[]) {
  const lus = modules.filter((m) => p.lus[m]).length;
  const reussis = modules.filter((m) => quizReussi(p, m)).length;
  const total = modules.length;
  return {
    total,
    lus,
    reussis,
    pourcentage: total ? Math.round(((lus + reussis) / (2 * total)) * 100) : 0,
    termine: total > 0 && lus === total && reussis === total,
  };
}
