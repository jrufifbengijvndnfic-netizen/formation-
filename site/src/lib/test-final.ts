/**
 * Banque de questions de l'examen final (test de 50 questions tirées au hasard) : questions des
 * quiz et exercices d'entraînement des 38 modules. Servie en JSON à la page du test.
 */
import type { Exercice } from './exercices';
import type { Element, QuizQuestion } from './types';

export interface QuestionTest {
  id: string;
  /** Numéro du module (« 2.6 ») : sert au tirage et au bilan « modules à revoir ». */
  source: string;
  type: Exercice['type'];
  question: string;
  options: Exercice['options'];
  lettres: Exercice['lettres'];
  valeur?: number;
  tolerance: number;
  unite?: string;
  vrai?: boolean;
  explication: string;
}

export interface BanqueTest {
  total: number;
  seuil: number;
  modules: Record<string, { titre: string; href: string }>;
  questions: QuestionTest[];
}

const depuisQuiz = (q: QuizQuestion, module: string): QuestionTest => ({
  id: q.id,
  source: module,
  type: 'qcm',
  question: q.question,
  options: q.options,
  lettres: [q.reponse],
  tolerance: 0,
  explication: q.explication,
});

const depuisExercice = (x: Exercice): QuestionTest => {
  const reste: Exercice = { ...x };
  delete reste.cas;
  delete reste.suite;
  return reste;
};

export function banqueTest(
  modules: Element[],
  quiz: (m: Element) => QuizQuestion[],
  exercices: (numero: string) => Exercice[],
  lienModule: (m: Element) => string,
): BanqueTest {
  return {
    total: 50,
    seuil: 0.7,
    modules: Object.fromEntries(
      modules.map((m) => [m.numero ?? '', { titre: `Module ${m.numero} — ${m.titreCourt}`, href: lienModule(m) }]),
    ),
    questions: modules.flatMap((m) => [
      ...quiz(m).map((q) => depuisQuiz(q, m.numero ?? '')),
      // Les exercices « suite » dépendent du précédent : exclus du tirage.
      ...exercices(m.numero ?? '')
        .filter((x) => !x.suite)
        .map(depuisExercice),
    ]),
  };
}
