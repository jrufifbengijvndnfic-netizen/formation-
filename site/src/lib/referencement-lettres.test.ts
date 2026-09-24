import { describe, expect, it } from 'vitest';
import { chargerFormation } from './formation';
import { lettres } from './parse-formation';
import { REFERENCEMENT_LETTRES } from './referencement-lettres';
import { SIMULATEURS } from './simulateurs';

describe('référencement des modèles de lettres', () => {
  const ids = lettres(chargerFormation()).map((l) => l.id);

  it('couvre chaque lettre de l’annexe F, avec des adresses uniques', () => {
    expect(Object.keys(REFERENCEMENT_LETTRES).sort()).toEqual([...ids].sort());
    const slugs = Object.values(REFERENCEMENT_LETTRES).map((r) => r.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it.each(Object.entries(REFERENCEMENT_LETTRES))('%s : longueurs et simulateur existant', (_id, r) => {
    expect(r.description.length).toBeGreaterThanOrEqual(110);
    expect(r.description.length).toBeLessThanOrEqual(160);
    expect(r.titre.length).toBeLessThanOrEqual(72);
    expect(r.slug).toMatch(/^[a-z0-9-]+$/);
    if (r.simulateur) expect(SIMULATEURS.map((s) => s.id)).toContain(r.simulateur);
  });
});
