import { describe, expect, it } from 'vitest';
import {
  EMPREINTES_ACCES,
  empreinteCode,
  niveauDeLExamen,
  niveauDuModule,
  niveauxOuverts,
  normaliserCode,
} from './acces';
import { tousLesModules } from './donnees';

describe('accès par code', () => {
  it('ouvre chaque niveau avec son code (0001, 0002, 0003)', async () => {
    expect(EMPREINTES_ACCES[await empreinteCode('0001')]).toBe(1);
    expect(EMPREINTES_ACCES[await empreinteCode('0002')]).toBe(2);
    expect(EMPREINTES_ACCES[await empreinteCode('0003')]).toBe(3);
  });

  it('refuse un code inconnu et ne contient aucun code en clair', async () => {
    expect(EMPREINTES_ACCES[await empreinteCode('0004')]).toBeUndefined();
    expect(EMPREINTES_ACCES[await empreinteCode('')]).toBeUndefined();
    expect(JSON.stringify(EMPREINTES_ACCES)).not.toMatch(/000[123]/);
  });

  it('tolère espaces, tirets et minuscules dans la saisie', async () => {
    expect(normaliserCode(' 00-01 ')).toBe('0001');
    expect(normaliserCode('ab.c d')).toBe('ABCD');
    expect(await empreinteCode(' 0 0 0 2 ')).toBe(await empreinteCode('0002'));
  });

  it('déduit les niveaux ouverts des empreintes enregistrées, sans doublon', async () => {
    const e3 = await empreinteCode('0003');
    const e1 = await empreinteCode('0001');
    expect(niveauxOuverts([e3, e1, e3, 'inconnue', 42, '__proto__'])).toEqual([1, 3]);
    expect(niveauxOuverts([])).toEqual([]);
  });

  it('réserve tous les modules sauf l’extrait gratuit, au niveau du module', () => {
    expect(niveauDuModule('1.1')).toBeUndefined();
    expect(niveauDuModule('1.2')).toBe(1);
    expect(niveauDuModule('2.14')).toBe(2);
    expect(niveauDuModule('3.1')).toBe(3);
    const reserves = tousLesModules.filter((m) => niveauDuModule(m.numero ?? '') !== undefined);
    expect(reserves).toHaveLength(tousLesModules.length - 1);
    expect(reserves.every((m) => niveauDuModule(m.numero ?? '') === m.niveau)).toBe(true);
  });

  it('rattache l’examen final et le test de 50 questions au niveau 3', () => {
    expect(niveauDeLExamen('niveau-1')).toBe(1);
    expect(niveauDeLExamen('niveau-2')).toBe(2);
    expect(niveauDeLExamen('final')).toBe(3);
    expect(niveauDeLExamen('test-final')).toBe(3);
  });
});
