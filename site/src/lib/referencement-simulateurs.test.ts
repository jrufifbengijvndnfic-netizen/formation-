import { describe, expect, it } from 'vitest';
import { REFERENCEMENT_SIMULATEURS, simulateurJsonLd } from './referencement-simulateurs';
import { SIMULATEURS } from './simulateurs';

describe('référencement des simulateurs', () => {
  it('couvre chaque simulateur, sans entrée orpheline', () => {
    expect(Object.keys(REFERENCEMENT_SIMULATEURS).sort()).toEqual(SIMULATEURS.map((s) => s.id).sort());
  });

  it.each(Object.entries(REFERENCEMENT_SIMULATEURS))('%s : longueurs utiles pour Google', (_id, r) => {
    expect(r.description.length).toBeGreaterThanOrEqual(110);
    expect(r.description.length).toBeLessThanOrEqual(160);
    expect(r.titre.length).toBeLessThanOrEqual(72);
    expect(r.titre).toMatch(/gratuit|calcul/i);
  });

  it('déclare un outil gratuit', () => {
    const j = simulateurJsonLd(SIMULATEURS[0]!, '/simulateurs/x/', 'https://formation-locatif.com');
    expect(j).toMatchObject({ '@type': 'WebApplication', isAccessibleForFree: true, offers: { price: '0' } });
  });
});
