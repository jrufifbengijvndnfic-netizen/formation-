import { describe, expect, it } from 'vitest';
import { REFERENCEMENT_SIMULATEURS, siglesAExpliquer, simulateurJsonLd } from './referencement-simulateurs';
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

describe('catégories de la page d’accueil', () => {
  it('rangent chaque simulateur exactement une fois', async () => {
    const { CATEGORIES_SIMULATEURS } = await import('./referencement-simulateurs');
    const ids = CATEGORIES_SIMULATEURS.flatMap((c) => c.ids);
    expect([...ids].sort()).toEqual(SIMULATEURS.map((s) => s.id).sort());
  });
});

describe('sigles expliqués sous le titre', () => {
  it('développe les sigles une fois, sauf ceux déjà développés', () => {
    expect(siglesAExpliquer('Simulateur LMNP : micro-BIC ou régime réel')).toEqual([
      ['LMNP', 'location meublée non professionnelle'],
      ['BIC', 'bénéfices industriels et commerciaux'],
    ]);
    expect(siglesAExpliquer('Simulateur de l’impôt sur la fortune immobilière (IFI)')).toEqual([]);
    expect(siglesAExpliquer('Calcul de la révision de loyer avec l’IRL. IRL publié.')).toHaveLength(1);
  });
});
