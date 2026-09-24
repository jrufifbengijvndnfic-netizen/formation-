import { describe, expect, it } from 'vitest';
import { chargerFormation } from './formation';
import { ordreAffichage, LETTRES } from './ordre-quiz';
import { modules, quizDuModule } from './parse-formation';

const formation = chargerFormation();
const quiz = modules(formation).map((m) => ({ id: m.numero as string, questions: quizDuModule(m) }));

describe('ordre d’affichage des propositions de quiz', () => {
  it('garde les quatre propositions, sans en perdre ni en dupliquer', () => {
    for (const { id, questions } of quiz) {
      for (const ordre of ordreAffichage(id, questions)) expect([...ordre].sort()).toEqual([...LETTRES]);
    }
  });

  it('place la bonne réponse à une position différente pour chaque question d’un quiz', () => {
    for (const { id, questions } of quiz) {
      const positions = ordreAffichage(id, questions).map((o, i) => o.indexOf(questions[i]!.reponse as never));
      expect(new Set(positions).size).toBe(Math.min(4, questions.length));
    }
  });

  it('répartit les bonnes réponses sur A, B, C et D (le texte source en compte 97 en « B »)', () => {
    const compte = [0, 0, 0, 0];
    for (const { id, questions } of quiz) {
      ordreAffichage(id, questions).forEach((o, i) => compte[o.indexOf(questions[i]!.reponse as never)]!++);
    }
    const total = compte.reduce((a, b) => a + b, 0);
    for (const n of compte) expect(n / total).toBeGreaterThan(0.15);
  });

  it('est stable d’une construction à l’autre', () => {
    const { id, questions } = quiz[0]!;
    expect(ordreAffichage(id, questions)).toEqual(ordreAffichage(id, questions));
  });
});
