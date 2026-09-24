import { describe, expect, it } from 'vitest';
import { ajouterMois, anneesPleines, ecartJours, estDateIso, formaterDateFr, lireDateFr } from './dates-fr';

describe('dates en français', () => {
  it('lit les dates du calendrier réglementaire', () => {
    expect(lireDateFr('24 août 2022')).toEqual({ debut: '2022-08-24', fin: '2022-08-24', precision: 'jour' });
    expect(lireDateFr('1er janvier 2028')?.debut).toBe('2028-01-01');
    expect(lireDateFr('4e trimestre 2026')).toEqual({
      debut: '2026-10-01',
      fin: '2026-12-31',
      precision: 'trimestre',
    });
    expect(lireDateFr('1er trimestre 2027')?.fin).toBe('2027-03-31');
    expect(lireDateFr('septembre 2026')?.fin).toBe('2026-09-30');
    expect(lireDateFr('À paraître')).toBeNull();
  });
  it('formate une date ISO', () => {
    expect(formaterDateFr('2026-09-24')).toBe('24 septembre 2026');
    expect(formaterDateFr('2027-01-01')).toBe('1er janvier 2027');
  });
  it('ajoute des mois en ramenant au dernier jour du mois', () => {
    expect(ajouterMois('2026-03-03', 1)).toBe('2026-04-03');
    expect(ajouterMois('2027-08-31', -6)).toBe('2027-02-28');
    expect(ajouterMois('2026-11-30', 3)).toBe('2027-02-28');
    expect(ajouterMois('2028-03-31', -1)).toBe('2028-02-29');
  });
  it('compte les années pleines et les jours', () => {
    expect(anneesPleines('2011-03-15', '2026-10-15')).toBe(15);
    expect(anneesPleines('2014-06-15', '2026-09-15')).toBe(12);
    expect(anneesPleines('2014-06-15', '2026-06-14')).toBe(11);
    expect(ecartJours('2026-04-03', '2026-05-12')).toBe(39);
  });
  it('valide une date ISO', () => {
    expect(estDateIso('2026-02-29')).toBe(false);
    expect(estDateIso('2028-02-29')).toBe(true);
    expect(estDateIso('2026-9-1')).toBe(false);
  });
});
