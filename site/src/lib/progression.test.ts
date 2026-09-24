import { describe, expect, it } from 'vitest';
import {
  avancement,
  CLE_PROGRESSION,
  ecrireProgression,
  enregistrerQuiz,
  lireProgression,
  marquerLu,
  progressionVide,
  statutModule,
  validerProgression,
  type StockageSimple,
} from './progression';

class Memoire implements StockageSimple {
  donnees = new Map<string, string>();
  getItem(k: string) {
    return this.donnees.get(k) ?? null;
  }
  setItem(k: string, v: string) {
    this.donnees.set(k, v);
  }
  removeItem(k: string) {
    this.donnees.delete(k);
  }
}
const bloque: StockageSimple = {
  getItem: () => {
    throw new Error('SecurityError');
  },
  setItem: () => {
    throw new Error('QuotaExceededError');
  },
  removeItem: () => undefined,
};

describe('progression', () => {
  it('survit à un stockage absent ou bloqué (navigation privée)', () => {
    expect(lireProgression(null)).toEqual(progressionVide());
    expect(lireProgression(bloque)).toEqual(progressionVide());
    expect(ecrireProgression(bloque, progressionVide())).toBe(false);
  });
  it('enregistre et relit', () => {
    const m = new Memoire();
    let p = marquerLu(progressionVide(), '1.1', true, '2026-09-24');
    p = enregistrerQuiz(p, '1.1', 0.75, '2026-09-24');
    expect(ecrireProgression(m, p)).toBe(true);
    expect(lireProgression(m)).toEqual(p);
    expect(m.getItem(CLE_PROGRESSION)).toContain('"version":1');
  });
  it('garde le meilleur score et compte les tentatives', () => {
    let p = enregistrerQuiz(progressionVide(), '2.1', 0.5, 'a');
    p = enregistrerQuiz(p, '2.1', 1, 'b');
    p = enregistrerQuiz(p, '2.1', 0.25, 'c');
    expect(p.quiz['2.1']).toEqual({ meilleur: 1, dernier: 0.25, tentatives: 3, le: 'c' });
  });
  it('calcule le statut et l’avancement (quiz réussi à 70 %)', () => {
    let p = marquerLu(progressionVide(), '1.1', true, 'x');
    p = enregistrerQuiz(p, '1.2', 0.66, 'x');
    p = enregistrerQuiz(p, '1.3', 0.7, 'x');
    p = marquerLu(p, '1.3', true, 'x');
    expect(['1.1', '1.2', '1.3', '1.4'].map((m) => statutModule(p, m))).toEqual([
      'lu',
      'non-commence',
      'termine',
      'non-commence',
    ]);
    expect(avancement(p, ['1.1', '1.2', '1.3', '1.4'])).toEqual({
      total: 4,
      lus: 2,
      reussis: 1,
      pourcentage: 38,
      termine: false,
    });
    expect(avancement(p, ['1.3']).termine).toBe(true);
  });
  it('refuse un fichier importé invalide et nettoie les entrées suspectes', () => {
    expect(validerProgression(null)).toBeNull();
    expect(validerProgression({ version: 2 })).toBeNull();
    const p = validerProgression({
      version: 1,
      lus: { '1.1': '2026-09-24', '<script>': 'x', '1.2': 5 },
      quiz: { '1.1': { meilleur: 2 }, '1.2': { meilleur: 0.5, tentatives: 3 } },
      checklists: { g1: [true, 'oui', false], 'bad key!': [true] },
    });
    expect(p).toEqual({
      version: 1,
      lus: { '1.1': '2026-09-24' },
      quiz: { '1.2': { meilleur: 0.5, dernier: 0.5, tentatives: 3, le: '' } },
      checklists: { g1: [true, false, false] },
    });
  });
  it('permet de marquer un module comme non lu', () => {
    const p = marquerLu(marquerLu(progressionVide(), '1.1', true, 'x'), '1.1', false, 'y');
    expect(p.lus).toEqual({});
  });
});
