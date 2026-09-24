import { describe, expect, it } from 'vitest';
import { rendreResultat } from './rendu-simulateur';
import {
  controlerValeurs,
  depuisParametres,
  executer,
  SIMULATEURS,
  simulateurParId,
  valeursParDefaut,
  versParametres,
  type Resultat,
} from './simulateurs';

const parDefaut = (id: string): Resultat => {
  const sim = simulateurParId(id)!;
  const { erreurs, resultat } = executer(sim, valeursParDefaut(sim));
  expect(erreurs).toEqual([]);
  return resultat!;
};
const synthese = (r: Resultat) => r.synthese.map((x) => x.valeur.replace(/\u202f|\u00a0/g, ' '));

describe('simulateurs : valeurs par défaut issues des exemples de la formation', () => {
  it('14 simulateurs aux identifiants uniques, tous calculables', () => {
    expect(SIMULATEURS).toHaveLength(14);
    expect(new Set(SIMULATEURS.map((s) => s.id)).size).toBe(14);
    for (const s of SIMULATEURS) {
      const r = executer(s, valeursParDefaut(s));
      expect(r.erreurs, s.id).toEqual([]);
      expect(rendreResultat(r.resultat!)).toContain('sim-synthese');
      expect(
        s.champs.every((c) => s.groupes.some((g) => g.id === c.groupe)),
        s.id,
      ).toBe(true);
    }
  });
  it('rentabilité (module 1.12)', () => {
    expect(synthese(parDefaut('rentabilite'))).toEqual(['5,29 %', '3,49 %', '−309,68 €']);
  });
  it('crédit', () => {
    expect(synthese(parDefaut('credit'))).toEqual(['629,51 €', '652,43 €', '46 582 €']);
  });
  it('capacité d’emprunt (module 2.10)', () => {
    expect(synthese(parDefaut('capacite-emprunt'))).toEqual(['1 221,50 €', 'environ 233 581 €']);
  });
  it('révision (module 2.1)', () => {
    expect(synthese(parDefaut('revision-loyer'))).toEqual(['708,07 €', '+8,07 €', '15 novembre 2026']);
  });
  it('dépôt de garantie (module 1.11)', () => {
    expect(synthese(parDefaut('depot-de-garantie'))).toEqual(['3 avril 2026', '2', '160,00 €']);
  });
  it('micro-foncier ou réel (module 2.8)', () => {
    expect(synthese(parDefaut('micro-foncier-ou-reel'))).toEqual(['2 577,12 €', '1 052,56 €', '1 524,56 €']);
  });
  it('micro-BIC ou réel (module 2.8)', () => {
    const r = parDefaut('micro-bic-ou-reel');
    expect(synthese(r)).toEqual(['2 187,00 €', '0,00 €']);
    expect(r.synthese[1]?.detail?.replace(/\u202f|\u00a0/g, ' ')).toBe('2 014,29 € d’amortissements reportés');
  });
  it('Jeanbrun (module 3.4)', () => {
    expect(synthese(parDefaut('jeanbrun'))).toEqual(['160 000 €', '5 600 €', '50 400 €']);
  });
  it('plus-value (module 3.5)', () => {
    expect(synthese(parDefaut('plus-value'))).toEqual(['57 500,00 €', '15 ans', '12 628,15 €']);
  });
  it('IFI (module 3.6)', () => {
    expect(synthese(parDefaut('ifi'))).toEqual(['1 320 000 €', '1 640,00 €']);
  });
  it('frais d’acquisition (module 2.11)', () => {
    expect(synthese(parDefaut('frais-acquisition'))).toEqual(['11 613,30 €', '2 394,30 €', '15 208 €']);
  });
  it('TRI (module 3.2)', () => {
    const r = parDefaut('tri');
    expect(synthese(r)).toEqual(['11,9 %', '4,1 %', '+308 €']);
    const sens = r.blocs
      .find((b) => b.titre === 'Sensibilité')
      ?.tableau?.lignes.map((l) => l[1]?.replace(/\u00a0/g, ' '));
    expect(sens).toEqual(['11,9 %', '9,6 %', '9,4 %', '10,0 %', '7,9 %', '9,3 %']);
  });
  it('donation (module 3.7)', () => {
    expect(synthese(parDefaut('donation'))).toEqual(['180 000 €', '14 194,35 €']);
  });
  it('dates de congé', () => {
    expect(synthese(parDefaut('dates-de-conge'))).toEqual(['30 décembre 2026', '24 décembre 2026']);
  });
});

describe('simulateurs : saisie et partage', () => {
  const sim = simulateurParId('rentabilite')!;
  it('signale des erreurs explicites', () => {
    const v = { ...valeursParDefaut(sim), prix: Number.NaN, duree: 45, vacance: -1 };
    const erreurs = controlerValeurs(sim, v);
    expect(erreurs.map((e) => e.champ)).toEqual(['prix', 'vacance', 'duree']);
    expect(erreurs[0]?.message).toBe('Saisissez un nombre, par exemple 1 250,50.');
    expect(erreurs[2]?.message).toMatch(/^La valeur doit être entre 1 et 30 ans\.$/);
  });
  it('contrôle les incohérences entre champs', () => {
    const pv = simulateurParId('plus-value')!;
    const erreurs = controlerValeurs(pv, { ...valeursParDefaut(pv), dateVente: '2010-01-01' });
    expect(erreurs).toEqual([{ champ: 'dateVente', message: 'La date de vente doit suivre la date d’achat.' }]);
  });
  it('fait l’aller-retour des paramètres dans l’adresse', () => {
    const v = { ...valeursParDefaut(sim), loyer: 610, taux: 3.1 };
    const p = versParametres(sim, v);
    expect(p.toString()).toBe('loyer=610&taux=3.1');
    expect(depuisParametres(sim, p)).toEqual(v);
    const conge = simulateurParId('dates-de-conge')!;
    const vc = depuisParametres(conge, new URLSearchParams('reduit=1&type=meuble&echeance=nimporte'));
    expect(vc.reduit).toBe(true);
    expect(vc.type).toBe('meuble');
    expect(vc.echeance).toBe('2027-06-30');
  });
});
