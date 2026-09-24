/**
 * Jeux de tests des calculs : reprend à l'identique les assertions de reference-calculs.py
 * et le tableau de la section 8 du brief (tolérance 0,01 € sauf mention contraire).
 */
import { describe, expect, it } from 'vitest';
import {
  capaciteDetaillee,
  capaciteEmprunt,
  comparatifFoncier,
  comparatifMeuble,
  coefNuePropriete,
  credit,
  datesConge,
  deficitFoncier,
  dmto,
  donation,
  droitsLigneDirecte,
  emolumentsTtc,
  fraisAcquisition,
  ifi,
  ifiDetaille,
  impotMicroBic,
  impotMicroFoncier,
  impotReelFoncier,
  jeanbrun,
  jeanbrunDetaille,
  lmnpReel,
  mensualite,
  moisDeRetardCommences,
  penaliteDepot,
  penaliteDepotDetaillee,
  plusValue,
  plusValueDetaillee,
  PROJET_MODULE_3_2,
  rentabilite,
  revisionIrl,
  revisionLoyer,
  scenarioColocation,
  simulerProjet,
  surtaxe,
  tableauAmortissement,
  tri,
  van,
} from './calculs';

/** Équivalent de ok(val, attendu, tol) du fichier Python. */
function ok(valeur: number, attendu: number, tolerance = 0.01) {
  expect(Math.abs(valeur - attendu), `${valeur} au lieu de ${attendu}`).toBeLessThanOrEqual(tolerance);
}

describe('section 8 du brief — jeux de tests obligatoires', () => {
  it('mensualité : 110 000 €, 3,35 %, 20 ans → 629,51 € ; assurance 0,25 % → 22,92 €', () => {
    ok(mensualite(110_000, 0.0335, 20), 629.51);
    ok((110_000 * 0.0025) / 12, 22.92);
  });

  it('cash-flow du module 1.12 → −309,68 € par mois', () => {
    ok((6_240 - 2_127) / 12 - (mensualite(110_000, 0.0335, 20) + (110_000 * 0.0025) / 12), -309.68);
  });

  it('révision : 700 € ; IRL 146,68 puis 148,37 → 708,07 €', () => {
    ok(revisionIrl(700, 148.37, 146.68), 708.07);
  });

  it('révision en chaîne : 900 € ; IRL 143,46, 145,47 puis 146,60 → 912,61 € puis 919,70 €', () => {
    const premiere = revisionIrl(900, 145.47, 143.46);
    ok(premiere, 912.61);
    ok(revisionIrl(premiere, 146.6, 145.47), 919.7);
  });

  it('pénalité de dépôt : 800 € HC, 2 mois commencés → 160 €', () => {
    ok(penaliteDepot(800, 2), 160);
  });

  it('capacité d’emprunt : 3 000 €, loyer 700 €, 25 ans, 3,45 %, assurance 0,30 % → 1 221,50 € ; ≈ 233 581 €', () => {
    const [m, c] = capaciteEmprunt(3_000, 700, 0, 0.0345, 25, 0.003);
    ok(m, 1_221.5);
    ok(c, 233_581, 1);
  });

  it('capacité d’emprunt : 4 200 €, loyer 800 €, crédit existant 250 € → 1 416 € ; ≈ 270 774 €', () => {
    const [m, c] = capaciteEmprunt(4_200, 800, 250, 0.0345, 25, 0.003);
    ok(m, 1_416);
    ok(c, 270_774, 1);
  });

  it('micro-foncier / réel : loyers 9 600 €, charges 7 150 €, TMI 30 % → 3 171,84 € / 1 156,40 €', () => {
    ok(impotMicroFoncier(9_600, 0.3), 3_171.84);
    ok(impotReelFoncier(9_600, 7_150, 0, 0.3), 1_156.4);
  });

  it('comparatif du module 2.8 → 2 577,12 € ; 1 052,56 € ; 2 187 € ; 0 € et 2 014,29 € reportés', () => {
    ok(impotMicroFoncier(7_800, 0.3), 2_577.12);
    ok(impotReelFoncier(7_800, 5_550, 1, 0.3), 1_052.56);
    ok(impotMicroBic(9_000, 0.5, 0.3), 2_187);
    const [, impot, report] = lmnpReel(9_000, 6_050, 4_250 + 5_000 / 7, 0.3);
    ok(impot, 0);
    ok(report, 2_014.29);
  });

  it('LMNP réel du module 2.7 : base 535,71 € ; impôt 260,36 €', () => {
    const [base, impot] = lmnpReel(9_000, 3_500, 127_500 / 30 + 5_000 / 7, 0.3);
    ok(base, 535.71);
    ok(impot, 260.36);
  });

  it('déficit foncier : imputable 10 700 €, reportable 4 300 € ; plafond 21 400 € → 15 000 €', () => {
    const [imputable, reportable] = deficitFoncier(8_000, 3_000, 20_000);
    ok(imputable, 10_700);
    ok(reportable, 4_300);
    ok(deficitFoncier(8_000, 3_000, 20_000, 21_400)[0], 15_000);
  });

  it('Jeanbrun : 5 600 €, 7 200 €, 8 800 € dans le neuf ; ancien base 156 000 €, 4 680 €', () => {
    ok(jeanbrun(200_000)[0], 5_600);
    ok(jeanbrun(200_000, 0, true, 'social', 10_000)[0], 7_200);
    ok(jeanbrun(200_000, 0, true, 'tres_social', 12_000)[0], 8_800);
    const [deduction, base] = jeanbrun(150_000, 45_000, false);
    ok(base, 156_000);
    ok(deduction, 4_680);
  });

  it('plus-value : achat 100 000 € (forfaits), vente 180 000 €, 15 ans → 12 628,15 €', () => {
    ok(plusValue(100_000, 0, 0, 180_000, 15).total, 12_628.15);
  });

  it('plus-value LMNP : 16 067,96 € (4 262,93 € sans réintégration)', () => {
    ok(plusValue(150_000, 11_000, 0, 200_000, 12, 45_000).total, 16_067.96);
    ok(plusValue(150_000, 11_000, 0, 200_000, 12, 0).total, 4_262.93);
  });

  it('surtaxe : plus-value imposable 55 000 € → 850 €', () => {
    ok(surtaxe(55_000), 850);
  });

  it('IFI : 1 320 000 € → 1 640 €', () => {
    ok(ifi(1_320_000), 1_640);
  });

  it('frais d’acquisition : 200 000 € → DMTO 11 613,30 € ou 12 637 € ; émoluments 2 394,30 € TTC', () => {
    ok(dmto(200_000, 0.045), 11_613.3);
    ok(dmto(200_000, 0.05), 12_637);
    ok(emolumentsTtc(200_000), 2_394.3);
  });

  it('donation : nue-propriété de 300 000 €, usufruitier de 65 ans → 14 194,35 € (pleine propriété 38 194,35 €)', () => {
    ok(droitsLigneDirecte(300_000 * coefNuePropriete(65) - 100_000), 14_194.35);
    ok(droitsLigneDirecte(200_000), 38_194.35);
  });

  it('TRI du module 3.2 : 11,9 % avec levier, 4,1 % sans ; 9,4 % à 4,20 % ; 10,0 % à prix stable', () => {
    const arrondi = (r: number) => Math.round(r * 1000) / 10;
    const [r, flux] = scenarioColocation();
    ok(arrondi(r), 11.9, 0.05);
    ok(flux[1], 308.4, 0.5);
    ok(arrondi(scenarioColocation({ levier: false })[0]), 4.1, 0.05);
    ok(arrondi(scenarioColocation({ taux: 0.042 })[0]), 9.4, 0.05);
    ok(arrondi(scenarioColocation({ croissancePrix: 0 })[0]), 10.0, 0.05);
  });
});

describe('module 3.2 — tableau du cas d’étude et sensibilité', () => {
  const r = simulerProjet(PROJET_MODULE_3_2);
  const annee = (n: number) => r.annees[n - 1];

  it('reproduit les lignes du tableau annuel', () => {
    const attendu: [number, number, number, number, number, number, number][] = [
      [1, 16_200, 4_596, 6_137, 0, 0, 308],
      [5, 16_858, 4_975, 5_455, 0, 0, 587],
      [10, 17_718, 5_493, 4_459, 0, 0, 929],
      [13, 18_255, 5_829, 3_773, 0, 0, 1_130],
      [14, 18_437, 5_945, 3_528, 657, 319, 877],
      [15, 18_621, 6_064, 3_275, 3_542, 1_721, -460],
    ];
    for (const [n, loyers, charges, interets, resultat, impot, cashFlow] of attendu) {
      const a = annee(n);
      ok(a.loyers, loyers, 0.5);
      ok(a.charges, charges, 0.5);
      ok(a.interets, interets, 0.5);
      ok(a.resultatImposable, resultat, 0.5);
      ok(a.impot, impot, 0.5);
      ok(a.cashFlow, cashFlow, 0.5);
    }
  });

  it('reproduit la mensualité, la revente et le produit net', () => {
    ok(r.mensualite, 896.3);
    ok(r.assuranceMensuelle, 45);
    ok(r.apport, 18_800);
    ok(r.coutTotal, 198_800);
    ok(r.prixRevente, 185_755, 0.5);
    ok(r.capitalRestantDu, 90_855, 0.5);
    ok(r.amortissementsBati, 80_200, 50);
    ok(r.plusValue.plus_value, 69_200, 50);
    ok(r.plusValue.total, 15_200, 50);
    ok(r.produitNetRevente, 79_700, 50);
    ok(r.cashFlowsCumules, 9_800, 50);
  });

  it('reproduit le tableau de sensibilité', () => {
    const tauxPct = (p: Partial<typeof PROJET_MODULE_3_2>) =>
      Math.round(simulerProjet({ ...PROJET_MODULE_3_2, ...p }).tri * 1000) / 10;
    ok(tauxPct({ tauxVacance: 0.1 }), 9.6, 0.05);
    ok(tauxPct({ tauxCredit: 0.042 }), 9.4, 0.05);
    ok(tauxPct({ croissancePrix: 0 }), 10.0, 0.05);
    ok(tauxPct({ croissancePrix: -0.01 }), 7.9, 0.05);
    ok(tauxPct({ loyersAnnuels: 420 * 3 * 12 }), 9.3, 0.05);
    ok(simulerProjet({ ...PROJET_MODULE_3_2, tauxCredit: 0.042 }).annees[0].cashFlow, -577, 0.5);
    // Le module affiche −686 € : écart d'arrondi sur l'assurance loyers impayés (453,60 € arrondis à 454 €).
    ok(simulerProjet({ ...PROJET_MODULE_3_2, loyersAnnuels: 420 * 3 * 12 }).annees[0].cashFlow, -686, 1);
  });

  it('coïncide avec le TRI recalculé sur les flux (VAN nulle)', () => {
    expect(Math.abs(van(r.flux, r.tri))).toBeLessThan(1e-6);
  });

  it('sans crédit, n’affiche ni intérêts ni mensualités', () => {
    const comptant = simulerProjet({ ...PROJET_MODULE_3_2, emprunt: 0 });
    expect(comptant.apport).toBe(198_800);
    expect(comptant.annees.every((a) => a.interets === 0 && a.mensualites === 0)).toBe(true);
  });
});

describe('résultats détaillés des simulateurs', () => {
  it('rentabilité : exemple du module 1.12', () => {
    const r = rentabilite({
      prix: 100_000,
      fraisAcquisition: 8_000,
      travaux: 7_000,
      mobilier: 3_000,
      fraisBancaires: 0,
      loyerMensuelHc: 520,
      taxeFonciere: 700,
      coproNonRecuperable: 300,
      pno: 120,
      gli: 187,
      gestion: 0,
      entretien: 300,
      moisVacance: 1,
      impotsLies: 0,
      capital: 110_000,
      tauxCredit: 0.0335,
      dureeCredit: 20,
      tauxAssurance: 0.0025,
    });
    ok(r.coutTotal, 118_000);
    ok(r.loyersAnnuels, 6_240);
    ok(r.chargesNonRecup + r.vacance, 2_127);
    ok(r.rentaBrute * 100, 5.29, 0.005);
    ok(r.rentaNette * 100, 3.49, 0.005);
    ok(r.cashFlowAvantImpot, -309.68);
  });

  it('crédit : coût des intérêts ≈ 41 082 € et de l’assurance ≈ 5 500 € (module 1.12)', () => {
    const c = credit(110_000, 0.0335, 20, 0.0025);
    ok(c.mensualiteTotale, 652.43);
    ok(c.coutInterets, 41_082, 1);
    ok(c.coutAssurance, 5_500);
    const tableau = tableauAmortissement(110_000, 0.0335, 20, 0.0025);
    expect(tableau).toHaveLength(20);
    ok(tableau.reduce((s, a) => s + a.capitalRembourse, 0), 110_000);
    ok(tableau.at(-1)!.capitalRestantDu, 0);
  });

  it('crédit à taux nul : capital divisé par le nombre de mois', () => {
    ok(mensualite(12_000, 0, 1), 1_000);
  });

  it('capacité d’emprunt détaillée : revenus retenus et plancher à zéro', () => {
    const c = capaciteDetaillee(4_200, 800, 250, 0.0345, 25, 0.003);
    ok(c.revenusRetenus, 4_760);
    ok(c.chargeMaximale, 1_666);
    ok(c.mensualiteHorsAssurance + c.assuranceMensuelle, 1_416);
    expect(capaciteDetaillee(1_000, 0, 500, 0.0345, 25, 0.003).capital).toBe(0);
  });

  it('révision : date d’effet à la demande, sans rétroactivité (module 2.1)', () => {
    const r = revisionLoyer({
      loyer: 700,
      irlAncien: 146.68,
      irlNouveau: 148.37,
      classeDpe: 'D',
      gelApplicable: true,
      dateRevision: '2026-09-01',
      dateDemande: '2026-11-15',
    });
    ok(r.loyerRevise, 708.07);
    expect(r.statut).toBe('a-la-demande');
    expect(r.dateEffet).toBe('2026-11-15');
  });

  it('révision : bloquée pour un logement F ou G, perdue après un an', () => {
    const base = {
      loyer: 700,
      irlAncien: 146.68,
      irlNouveau: 148.37,
      classeDpe: 'G',
      gelApplicable: true,
      dateRevision: '2026-09-01',
      dateDemande: '2026-09-01',
    };
    expect(revisionLoyer(base).bloque).toBe(true);
    expect(revisionLoyer(base).loyerRevise).toBe(700);
    expect(revisionLoyer({ ...base, classeDpe: 'D', dateDemande: '2027-09-02' }).statut).toBe('perdue');
    expect(revisionLoyer({ ...base, classeDpe: 'D', dateDemande: '2027-09-01' }).statut).toBe('a-la-demande');
  });

  it('dépôt de garantie : exemple du module 1.11 (3 mars → 12 mai, 160 €)', () => {
    const r = penaliteDepotDetaillee({
      loyerHc: 800,
      dateRemiseCles: '2026-03-03',
      etatDesLieuxConforme: true,
      dateRestitution: '2026-05-12',
      adresseTransmise: true,
    });
    expect(r.dateLimite).toBe('2026-04-03');
    expect(r.moisRetard).toBe(2);
    ok(r.penalite, 160);
  });

  it('dépôt de garantie : 40 jours de retard sur 600 € → 120 € (quiz 1.11)', () => {
    expect(moisDeRetardCommences('2026-01-10', '2026-02-19')).toBe(2);
    ok(penaliteDepot(600, moisDeRetardCommences('2026-01-10', '2026-02-19')), 120);
    expect(moisDeRetardCommences('2026-04-03', '2026-04-03')).toBe(0);
    expect(moisDeRetardCommences('2026-04-03', '2026-05-03')).toBe(1);
  });

  it('dépôt de garantie : aucune pénalité si le locataire n’a pas transmis sa nouvelle adresse', () => {
    const r = penaliteDepotDetaillee({
      loyerHc: 800,
      dateRemiseCles: '2026-03-03',
      etatDesLieuxConforme: false,
      dateRestitution: '2026-07-12',
      adresseTransmise: false,
    });
    expect(r.dateLimite).toBe('2026-05-03');
    expect(r.penalite).toBe(0);
  });

  it('micro-foncier ou réel : module 2.8, puis déficit du module 2.6 avec le forfait de 20 €', () => {
    const r = comparatifFoncier({
      loyers: 7_800,
      interets: 3_800,
      autresCharges: 1_750,
      nbLocaux: 1,
      tmi: 0.3,
      plafondDeficit: 10_700,
    });
    ok(r.micro.impot, 2_577.12);
    ok(r.reel.impot, 1_052.56);
    ok(r.reel.base, 2_230);
    const d = comparatifFoncier({
      loyers: 8_000,
      interets: 3_000,
      autresCharges: 20_000,
      nbLocaux: 0,
      tmi: 0.3,
      plafondDeficit: 10_700,
    });
    ok(d.reel.deficitImputable, 10_700);
    ok(d.reel.deficitReportable, 4_300);
    ok(d.reel.economieImpot, 3_210);
    expect(d.reel.impot).toBe(0);
  });

  it('micro-BIC ou réel : module 2.8 et plafonds', () => {
    const r = comparatifMeuble({
      recettes: 9_000,
      typeMeuble: 'longue-duree',
      charges: 6_050,
      prix: 150_000,
      partTerrain: 0.15,
      dureeBati: 30,
      mobilier: 5_000,
      dureeMobilier: 7,
      travaux: 0,
      dureeTravaux: 10,
      amortissementsDifferes: 0,
      tmi: 0.3,
    });
    ok(r.micro.impot, 2_187);
    ok(r.micro.base, 4_500);
    ok(r.reel.amortAnnuel, 4_964.29);
    ok(r.reel.impot, 0);
    ok(r.reel.amortissementsReportes, 2_014.29);
    const tourisme = comparatifMeuble({
      recettes: 16_000,
      typeMeuble: 'tourisme-non-classe',
      charges: 0,
      prix: 0,
      partTerrain: 0,
      dureeBati: 30,
      mobilier: 0,
      dureeMobilier: 7,
      travaux: 0,
      dureeTravaux: 10,
      amortissementsDifferes: 0,
      tmi: 0.3,
    });
    expect(tourisme.micro.eligible).toBe(false);
    expect(tourisme.micro.abattement).toBe(0.3);
  });

  it('micro-BIC : abattement minimal de 305 €', () => {
    ok(impotMicroBic(500, 0.5, 0.3), (500 - 305) * 0.486);
  });

  it('Jeanbrun : total sur neuf ans et seuil de travaux dans l’ancien', () => {
    const neuf = jeanbrunDetaille({ prix: 200_000, travaux: 0, neuf: true, regime: 'intermediaire', plafond: 8_000 });
    ok(neuf.total9Ans, 50_400);
    const plafonne = jeanbrunDetaille({ prix: 200_000, travaux: 0, neuf: true, regime: 'tres_social', plafond: 8_000 });
    ok(plafonne.deduction, 8_000);
    expect(plafonne.plafonnee).toBe(true);
    const ancien = jeanbrunDetaille({ prix: 150_000, travaux: 45_000, neuf: false, regime: 'intermediaire', plafond: 8_000 });
    expect(ancien.seuilTravauxAtteint).toBe(true);
    const insuffisant = jeanbrunDetaille({ prix: 150_000, travaux: 40_000, neuf: false, regime: 'intermediaire', plafond: 8_000 });
    expect(insuffisant.seuilTravauxAtteint).toBe(false);
  });

  it('plus-value détaillée : exemple du module 3.5 avec les dates', () => {
    const r = plusValueDetaillee({
      prixAchat: 100_000,
      dateAchat: '2011-03-15',
      fraisReels: 0,
      travauxReels: 0,
      prixVente: 180_000,
      dateVente: '2026-10-15',
      fraisCession: 0,
      amortissements: 0,
    });
    expect(r.annees).toBe(15);
    ok(r.prixAcquisitionMajore, 122_500);
    ok(r.plus_value, 57_500);
    ok(r.baseIr, 23_000);
    ok(r.ir, 4_370);
    ok(r.basePs, 48_012.5);
    ok(r.ps, 8_258.15);
    ok(r.total, 12_628.15);
  });

  it('plus-value : paliers de 22 et 30 ans', () => {
    expect(plusValue(100_000, 0, 0, 300_000, 22).ir).toBe(0);
    ok(plusValue(100_000, 0, 0, 300_000, 22).ps, 177_500 * (1 - 0.28) * 0.172);
    expect(plusValue(100_000, 0, 0, 300_000, 31).total).toBe(0);
    expect(plusValue(100_000, 0, 0, 90_000, 10).total).toBe(0);
  });

  it('plus-value : pas de forfait travaux avant cinq ans', () => {
    ok(plusValue(100_000, 0, 0, 130_000, 4).plus_value, 22_500);
  });

  it('surtaxe : lissage entre les paliers', () => {
    expect(surtaxe(50_000)).toBe(0);
    ok(surtaxe(60_000), 1_200);
    ok(surtaxe(105_000), 3_150 - 500);
    ok(surtaxe(300_000), 18_000);
  });

  it('IFI détaillé : décote, abattement de 30 % et dettes', () => {
    const r = ifiDetaille({ actifs: 1_320_000, residencePrincipale: 0, dettes: 0 });
    ok(r.impotBareme, 2_640);
    ok(r.decote, 1_000);
    ok(r.ifi, 1_640);
    expect(ifiDetaille({ actifs: 1_000_000, residencePrincipale: 500_000, dettes: 100_000 }).patrimoineNet).toBe(1_250_000);
    expect(ifiDetaille({ actifs: 1_000_000, residencePrincipale: 500_000, dettes: 100_000 }).ifi).toBe(0);
    ok(ifi(1_500_000), 2_500 + 1_400);
  });

  it('frais d’acquisition détaillés : environ 15 200 € à 16 200 € (module 2.11)', () => {
    const a = fraisAcquisition({ prix: 200_000, neuf: false, tauxDepartemental: 0.045, debours: 1_000 });
    if (a.neuf) throw new Error('attendu : ancien');
    ok(a.dmto, 11_613.3);
    ok(a.csi, 200);
    ok(a.total, 15_207.6);
    const b = fraisAcquisition({ prix: 200_000, neuf: false, tauxDepartemental: 0.05, debours: 1_000 });
    if (b.neuf) throw new Error('attendu : ancien');
    ok(b.total, 16_231.3);
    const neuf = fraisAcquisition({ prix: 200_000, neuf: true, tauxDepartemental: 0.045, debours: 1_000 });
    expect(neuf).toEqual({ neuf: true, estimationBasse: 4_000, estimationHaute: 6_000 });
  });

  it('donation détaillée : module 3.7', () => {
    const r = donation({ valeur: 300_000, nuePropriete: true, ageUsufruitier: 65, abattement: 100_000 });
    expect(r.coefficient).toBe(0.6);
    ok(r.valeurTaxable, 180_000);
    ok(r.base, 80_000);
    ok(r.droits, 14_194.35);
    ok(r.droitsPleinePropriete, 38_194.35);
  });

  it('coefficients de nue-propriété de l’article 669', () => {
    expect([20, 21, 30, 31, 58, 65, 80, 81, 90, 91].map(coefNuePropriete)).toEqual([
      0.1, 0.2, 0.2, 0.3, 0.5, 0.6, 0.7, 0.8, 0.8, 0.9,
    ]);
  });

  it('dates de congé : six mois (vide), trois mois (meublé), préavis du locataire', () => {
    const vide = datesConge({
      dateEcheance: '2027-06-30',
      typeBail: 'vide',
      dateReceptionConge: '2026-09-24',
      preavisLocataireMois: 3,
    });
    expect(vide.dateLimiteBailleur).toBe('2026-12-30');
    expect(vide.finPreavisLocataire).toBe('2026-12-24');
    const meuble = datesConge({
      dateEcheance: '2027-08-31',
      typeBail: 'meuble',
      dateReceptionConge: '2026-09-24',
      preavisLocataireMois: 1,
    });
    expect(meuble.dateLimiteBailleur).toBe('2027-05-31');
    expect(meuble.finPreavisLocataire).toBe('2026-10-24');
  });

  it('TRI d’une série simple', () => {
    ok(tri([-100, 110]) * 100, 10, 1e-6);
    ok(tri([-1_000, 0, 0, 1_331]) * 100, 10, 1e-6);
  });
});
