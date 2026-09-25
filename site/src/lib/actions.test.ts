import { describe, expect, it } from 'vitest';
import { lireActions } from './actions';
import { modules, parseFormation } from './parse-formation';
import { SIMULATEURS } from './simulateurs';
import { lireActionsSource, lireSource } from './source';

describe('actions « À faire maintenant »', () => {
  const actions = lireActions(lireActionsSource());
  it('une action par module, dans l’ordre', () => {
    expect(actions.map((a) => a.module)).toEqual(modules(parseFormation(lireSource())).map((m) => m.numero));
  });
  it('des textes courts et des outils existants', () => {
    for (const a of actions) {
      expect(a.texte.length, a.module).toBeGreaterThan(40);
      expect(a.texte.length, a.module).toBeLessThan(260);
      if (a.outil)
        expect(
          SIMULATEURS.map((s) => s.id),
          a.module,
        ).toContain(a.outil);
    }
  });
  it('refuse deux lignes de texte', () => {
    expect(() => lireActions('## Module 1.1\nun\ndeux\n')).toThrow(/ligne 3/);
  });
});
