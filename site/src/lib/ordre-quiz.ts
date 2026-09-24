/**
 * Ordre d'affichage des propositions de quiz. Dans le texte de la formation, la bonne réponse est
 * très souvent « B » ; affichées telles quelles, les réponses deviendraient prévisibles. L'affichage
 * place donc la bonne réponse à une position différente pour chaque question d'un même quiz, de façon
 * déterministe (même ordre à chaque visite). Le texte des questions et des propositions est inchangé.
 */
import type { QuizQuestion } from './types';

export const LETTRES = ['A', 'B', 'C', 'D'] as const;
export type LettreQuiz = (typeof LETTRES)[number];

/** Petit hachage stable (FNV-1a) d'une chaîne. */
function hacher(texte: string): number {
  let h = 0x811c9dc5;
  for (const c of texte) {
    h ^= c.codePointAt(0) ?? 0;
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h;
}

/** Les 24 permutations de [0, 1, 2, 3]. */
const PERMUTATIONS: number[][] = (() => {
  const toutes: number[][] = [];
  const permuter = (reste: number[], debut: number[]) => {
    if (!reste.length) toutes.push(debut);
    reste.forEach((x, i) => permuter([...reste.slice(0, i), ...reste.slice(i + 1)], [...debut, x]));
  };
  permuter([0, 1, 2, 3], []);
  return toutes;
})();

/**
 * Ordre d'affichage (lettres d'origine) des propositions de chaque question d'un quiz. Les positions
 * de la bonne réponse parcourent une permutation propre au quiz : jusqu'à quatre questions, aucune
 * position ne se répète.
 */
export function ordreAffichage(idQuiz: string, questions: QuizQuestion[]): LettreQuiz[][] {
  const positions = PERMUTATIONS[hacher(idQuiz) % PERMUTATIONS.length] as number[];
  return questions.map((q, i) => {
    const bonne = q.reponse as LettreQuiz;
    const cible = positions[i % 4] as number;
    const autres = LETTRES.filter((l) => l !== bonne);
    return [...autres.slice(0, cible), bonne, ...autres.slice(cible)];
  });
}
