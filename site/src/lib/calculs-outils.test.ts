import { describe, expect, it } from 'vitest';
import * as O from './calculs-outils';

describe('décence énergétique (modules 1.4 et 3.9)', () => {
  it('suit le calendrier métropole et outre-mer', () => {
    expect(O.dateNonDecence('G', 'metropole')).toBe('2025-01-01');
    expect(O.dateNonDecence('F', 'metropole')).toBe('2028-01-01');
    expect(O.dateNonDecence('E', 'metropole')).toBe('2034-01-01');
    expect(O.dateNonDecence('D', 'metropole')).toBeNull();
    expect(O.dateNonDecence('G', 'outre-mer')).toBe('2028-01-01');
    expect(O.dateNonDecence('F', 'outre-mer')).toBe('2031-01-01');
    expect(O.dateNonDecence('E', 'outre-mer')).toBeNull();
  });
  it('diagnostique un bail signé en 2026', () => {
    expect(O.diagnosticDpe('G', 'metropole', '2026-09-24')).toMatchObject({ decent: false, loyerGele: true });
    expect(O.diagnosticDpe('F', 'metropole', '2026-09-24')).toMatchObject({ decent: true, loyerGele: true });
    expect(O.diagnosticDpe('F', 'metropole', '2028-01-01').decent).toBe(false);
    expect(O.diagnosticDpe('G', 'outre-mer', '2026-09-24').decent).toBe(true);
    expect(O.diagnosticDpe('D', 'metropole', '2026-09-24')).toMatchObject({ decent: true, loyerGele: false });
  });
});

describe('régularisation des charges (exemple du module 2.2)', () => {
  it('complément de 72 € et provision ajustée à 56 €', () => {
    const r = O.regularisationCharges(50, 12, 672);
    expect(r).toEqual({ provisionsAnnuelles: 600, solde: 72, provisionMensuelleAjustee: 56 });
  });
  it('remboursement de 60 € si les dépenses sont de 540 €', () => {
    expect(O.regularisationCharges(50, 12, 540).solde).toBe(-60);
  });
});

describe('meublé de tourisme (exemple du module 3.8)', () => {
  const r = O.comparaisonTourisme({
    prixNuit: 120,
    tauxOccupation: 0.65,
    commission: 0.35,
    autresChargesTourisme: 5_335,
    classe: false,
    loyerMensuelClassique: 900,
    chargesClassique: 0,
  });
  it('environ 237 nuits et 28 470 € de recettes, reste environ 13 200 €', () => {
    expect(Math.floor(r.nuits)).toBe(237);
    expect(r.recettesTourisme).toBe(28_470);
    expect(Math.round(r.chargesTourisme / 100) * 100).toBe(15_300);
    expect(Math.round(r.netTourisme / 100) * 100).toBe(13_200);
    expect(r.recettesClassique).toBe(10_800);
  });
  it('micro-BIC : 15 000 € et 30 % non classé, 83 600 € et 50 % sinon', () => {
    expect(r.microBicTourisme).toMatchObject({ abattement: 0.3, plafond: 15_000, dansLePlafond: false });
    expect(r.microBicClassique).toMatchObject({ abattement: 0.5, plafond: 83_600, base: 5_400 });
  });
});

describe('Denormandie et Loc’Avantages (module 3.4)', () => {
  it('réduction de 18 % sur neuf ans, plafonnée à 300 000 € et 5 500 €/m²', () => {
    const r = O.denormandie({ prix: 150_000, travaux: 60_000, surface: 60, duree: 9 });
    expect(r.base).toBe(210_000);
    expect(r.reduction).toBe(37_800);
    expect(r.parAn).toBe(4_200);
    expect(r.conditionTravaux).toBe(true);
    expect(O.denormandie({ prix: 280_000, travaux: 100_000, surface: 100, duree: 12 }).base).toBe(300_000);
    expect(O.denormandie({ prix: 200_000, travaux: 50_000, surface: 40, duree: 6 }).base).toBe(220_000);
    expect(O.denormandie({ prix: 200_000, travaux: 20_000, surface: 60, duree: 6 }).conditionTravaux).toBe(false);
  });
  it('Loc1 15 % (20 % avec intermédiation), Loc2 35 % (40 %), Loc3 65 %', () => {
    expect(O.tauxLocAvantages('loc1', false)).toBe(0.15);
    expect(O.tauxLocAvantages('loc1', true)).toBe(0.2);
    expect(O.tauxLocAvantages('loc2', false)).toBe(0.35);
    expect(O.tauxLocAvantages('loc2', true)).toBe(0.4);
    expect(O.locAvantages(600, 'loc3', false)).toMatchObject({ taux: 0.65, reductionAnnuelle: 4_680 });
  });
});

describe('relocation en zone tendue (module 2.1)', () => {
  const base = {
    dernierLoyer: 700,
    reviseDansLes12Mois: false,
    irlAncien: 146.68,
    irlNouveau: 148.37,
    passoire: false,
    exception: 'aucune' as const,
    coutTravaux: 0,
    loyerVoisinage: 0,
  };
  it('dernier loyer révisé selon l’IRL', () => {
    expect(O.loyerRelocation(base).maximum).toBe(708.07);
    expect(O.loyerRelocation({ ...base, reviseDansLes12Mois: true }).maximum).toBe(700);
  });
  it('aucune hausse pour un logement F ou G', () => {
    expect(O.loyerRelocation({ ...base, passoire: true, exception: 'travaux', coutTravaux: 10_000 })).toMatchObject({
      maximum: 700,
      exceptionRefusee: true,
    });
  });
  it('travaux : 15 % du coût par an si au moins la moitié de la dernière année de loyer', () => {
    expect(O.loyerRelocation({ ...base, exception: 'travaux', coutTravaux: 8_000 }).maximum).toBe(808.07);
    expect(O.loyerRelocation({ ...base, exception: 'travaux', coutTravaux: 4_000 }).exceptionRefusee).toBe(true);
  });
  it('sous-évaluation : moitié de l’écart', () => {
    expect(
      O.loyerRelocation({ ...base, reviseDansLes12Mois: true, exception: 'sous-evalue', loyerVoisinage: 800 }).maximum,
    ).toBe(750);
  });
});

describe('encadrement, usure, TVA, loyer au m²', () => {
  it('encadrement : référence + 20 % et − 30 %', () => {
    const r = O.encadrementLoyer({ surface: 30, loyerReference: 25, loyerBase: 950, complement: 0, passoire: false });
    expect(r).toMatchObject({ majore: 30, minore: 17.5, plafond: 900, depassement: 50, conforme: false });
  });
  it('seuils d’usure du 3e trimestre 2026', () => {
    expect(O.seuilUsure('fixe', 8)).toBe(4.07);
    expect(O.seuilUsure('fixe', 15)).toBe(4.57);
    expect(O.seuilUsure('fixe', 20)).toBe(5.29);
    expect(O.seuilUsure('variable', 25)).toBe(5.28);
    expect(O.seuilUsure('relais', 2)).toBe(6.39);
  });
  it('TVA 10 %, 5,5 % ou 20 %', () => {
    expect(O.tvaTravaux(10_000, 'entretien')).toEqual({ taux: 0.1, tva: 1_000, ttc: 11_000 });
    expect(O.tvaTravaux(10_000, 'energetique').ttc).toBe(10_550);
    expect(O.tvaTravaux(10_000, 'neuf').tva).toBe(2_000);
  });
  it('exemple du module 1.6 : 42 m² à 13,20 €', () => {
    expect(O.loyerAuM2({ surface: 42, prixM2: 13.2, charges: 55, meuble: false })).toMatchObject({
      loyer: 554.4,
      chargesComprises: 609.4,
      depotMaximum: 554.4,
    });
    expect(O.loyerAuM2({ surface: 42, prixM2: 13.2, charges: 55, meuble: true }).depotMaximum).toBe(1_108.8);
  });
});
