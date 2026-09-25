import { describe, expect, it } from 'vitest';
import {
  ErreurExercices,
  estCorrect,
  lireExercices,
  lireNombre,
  nombreFrancais,
  reponseAttendue,
  tirer,
  type Exercice,
} from './exercices';
import { modules, parseFormation, tousLesElements } from './parse-formation';
import { lireExercicesSource, lireSource } from './source';

const formation = parseFormation(lireSource());
const sections = lireExercices(lireExercicesSource());

describe('fichier exercices.md', () => {
  it('dix exercices pour chacun des 38 modules, sans section orpheline', () => {
    const numeros = modules(formation).map((m) => m.numero);
    const parModule = sections.filter((s) => s.portee === 'module');
    expect(parModule.map((s) => s.cle)).toEqual(numeros);
    for (const s of parModule) expect(s.exercices, s.cle).toHaveLength(10);
  });

  it('des questions pour chaque cas de chaque examen', () => {
    const examens = tousLesElements(formation).filter((e) => e.type === 'examen');
    expect(examens).toHaveLength(3);
    for (const e of examens) {
      const cle = /niveau (\d)/.exec(e.titre) ? `niveau-${/niveau (\d)/.exec(e.titre)?.[1]}` : 'final';
      const nbCas = (e.markdown.match(/^\*\*Cas \d+ — /gm) ?? []).length;
      const s = sections.find((x) => x.cle === cle);
      expect(s, cle).toBeDefined();
      const cas = new Set(s?.exercices.map((x) => x.cas));
      expect([...cas].sort(), cle).toEqual(Array.from({ length: nbCas }, (_, i) => i + 1));
    }
  });

  it('des identifiants uniques et des explications', () => {
    const tous = sections.flatMap((s) => s.exercices);
    expect(new Set(tous.map((x) => x.id)).size).toBe(tous.length);
    for (const x of tous) expect(x.explication.length, x.id).toBeGreaterThan(10);
  });

  it('mélange les types dans chaque module', () => {
    for (const s of sections.filter((x) => x.portee === 'module')) {
      expect(new Set(s.exercices.map((x) => x.type)).size, s.cle).toBeGreaterThanOrEqual(2);
    }
  });
});

describe('analyse', () => {
  const un = (bloc: string) =>
    lireExercices(`## Module 1.1\n\n\`\`\`exercices\n${bloc}\n\`\`\`\n`)[0]?.exercices[0] as Exercice;

  it('lit un calcul avec unité et tolérance', () => {
    const x = un('T: nombre\nQ: Combien ?\nR: 16,5\nU: €\nP: 0,01\nE: Parce que.');
    expect(x).toMatchObject({ type: 'nombre', valeur: 16.5, tolerance: 0.01, unite: '€', id: 'x1-1-1' });
  });

  it('distingue la proposition C du numéro de cas, et E de l’explication', () => {
    const s = lireExercices(
      '## Examen final\n\n```exercices\nC: 2\nT: multi\nQ: ?\nA: a\nB: b\nC: c\nD: d\nE: e\nR: A, E\nE: Explication.\n```\n',
    );
    const x = s[0]?.exercices[0] as Exercice;
    expect(x.cas).toBe(2);
    expect(x.options).toEqual({ A: 'a', B: 'b', C: 'c', D: 'd', E: 'e' });
    expect(x.lettres).toEqual(['A', 'E']);
    expect(x.explication).toBe('Explication.');
  });

  it('lit une suite et refuse une suite en tête de section', () => {
    const s = lireExercices(
      '## Module 1.1\n\n```exercices\nT: vf\nQ: a\nR: V\nE: explication 1\n\nT: vf\nL: suite\nQ: b\nR: F\nE: explication 2\n```\n',
    );
    expect(s[0]?.exercices.map((x) => Boolean(x.suite))).toEqual([false, true]);
    expect(() => un('T: vf\nL: suite\nQ: b\nR: F\nE: x')).toThrow(/premier exercice/);
  });

  it('cite la ligne fautive', () => {
    expect(() => un('T: qcm\nQ: ?\nA: a\nB: b\nC: c\nD: d\nR: F\nE: x')).toThrow(ErreurExercices);
    expect(() => un('T: qcm\nQ: ?\nA: a\nB: b\nC: c\nD: d\nR: F\nE: x')).toThrow(/ligne 4/);
    expect(() => un('T: vf\nQ: ?\nR: Oui\nE: x')).toThrow(/V ou F/);
    expect(() => un('T: nombre\nQ: ?\nR: beaucoup\nE: x')).toThrow(/nombre attendu/);
  });
});

describe('correction', () => {
  const qcm = { type: 'qcm', lettres: ['B'], options: { A: 'a', B: 'b', C: 'c', D: 'd' }, tolerance: 0 } as Exercice;
  const multi = {
    type: 'multi',
    lettres: ['A', 'C'],
    options: { A: 'a', B: 'b', C: 'c', D: 'd' },
    tolerance: 0,
  } as Exercice;
  const nombre = { type: 'nombre', valeur: 736, tolerance: 0, unite: '€' } as Exercice;
  const approx = { type: 'nombre', valeur: 829.43, tolerance: 1 } as Exercice;
  const vf = { type: 'vf', vrai: false } as Exercice;

  it('qcm et multi : ensemble exact', () => {
    expect(estCorrect(qcm, ['B'])).toBe(true);
    expect(estCorrect(qcm, ['A'])).toBe(false);
    expect(estCorrect(multi, ['C', 'A'])).toBe(true);
    expect(estCorrect(multi, ['A'])).toBe(false);
    expect(estCorrect(multi, ['A', 'B', 'C'])).toBe(false);
    expect(estCorrect(multi, [])).toBe(false);
  });

  it('nombre : écritures françaises et tolérance', () => {
    expect(estCorrect(nombre, '736')).toBe(true);
    expect(estCorrect(nombre, '736,00 €')).toBe(true);
    expect(estCorrect(nombre, '735')).toBe(false);
    expect(estCorrect(approx, '829')).toBe(true);
    expect(estCorrect(approx, '831')).toBe(false);
    expect(estCorrect(nombre, '')).toBe(false);
    expect(lireNombre('1 400')).toBe(1400);
    expect(lireNombre('−358,92')).toBe(-358.92);
    expect(lireNombre('12 %')).toBe(12);
    expect(lireNombre('douze')).toBeNaN();
  });

  it('vrai ou faux', () => {
    expect(estCorrect(vf, 'F')).toBe(true);
    expect(estCorrect(vf, 'V')).toBe(false);
    expect(estCorrect(vf, null)).toBe(false);
  });

  it('affiche la réponse attendue', () => {
    expect(reponseAttendue(nombre)).toBe('736\u00a0€');
    expect(reponseAttendue(multi)).toBe('A — a ; C — c');
    expect(nombreFrancais(-358.92)).toBe('−358,92');
    expect(nombreFrancais(10550)).toBe('10\u202f550');
  });
});

describe('tirage de l’examen final', () => {
  const pool = Array.from({ length: 200 }, (_, i) => ({ id: i, source: `m${i % 38}` }));
  it('au moins une question par module, sans doublon', () => {
    const t = tirer(pool, 50);
    expect(t).toHaveLength(50);
    expect(new Set(t).size).toBe(50);
    expect(new Set(t.map((q) => q.source)).size).toBe(38);
  });
  it('change à chaque tirage', () => {
    const a = tirer(pool, 50)
      .map((q) => q.id)
      .join();
    const b = tirer(pool, 50)
      .map((q) => q.id)
      .join();
    expect(a).not.toBe(b);
  });
});
