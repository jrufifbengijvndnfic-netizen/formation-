/**
 * Calculs de la formation (annexe E), traduction fidèle de
 * files/formation-immobilier-locatif-2026/reference-calculs.py.
 *
 * Module pur : aucune dépendance au DOM ni à Node, utilisable au build et dans le navigateur.
 * Les fonctions de la première partie portent le nom et la logique exacte de leur équivalent
 * Python (mêmes formules, même ordre des opérations) ; la seconde partie assemble ces briques
 * en résultats détaillés pour les simulateurs.
 *
 * Écarts assumés par rapport au Python, uniquement pour des entrées que le Python ne traite pas :
 * taux nul (le Python divise par zéro) et horizon supérieur à la durée du crédit.
 */
import { ajouterMois, anneesPleines } from './dates-fr';

/** Prélèvements sociaux sur les revenus fonciers et les plus-values immobilières. */
export const PS_FONCIER = 0.172;
/** Prélèvements sociaux sur la location meublée non professionnelle (LFSS 2026). */
export const PS_LMNP = 0.186;

// ===========================================================================
// 1. Traduction de reference-calculs.py
// ===========================================================================

/** Mensualité hors assurance d'un prêt amortissable à taux fixe. */
export function mensualite(capital: number, tauxAnnuel: number, annees: number): number {
  const t = tauxAnnuel / 12;
  const n = annees * 12;
  if (n <= 0) return 0;
  if (t === 0) return capital / n;
  return (capital * t) / (1 - (1 + t) ** -n);
}

/** Facteur mensualité + assurance pour 1 € emprunté. */
function facteurMensuel(tauxAnnuel: number, annees: number, tauxAssurance: number): number {
  return mensualite(1, tauxAnnuel, annees) + tauxAssurance / 12;
}

/** Retourne [mensualité maximale assurance comprise, capital empruntable] (méthode des 35 %). */
export function capaciteEmprunt(
  revenusMensuels: number,
  loyersMensuels: number,
  creditsExistants: number,
  tauxAnnuel: number,
  annees: number,
  tauxAssurance: number,
): [number, number] {
  const mMax = 0.35 * (revenusMensuels + 0.7 * loyersMensuels) - creditsExistants;
  return [mMax, mMax / facteurMensuel(tauxAnnuel, annees, tauxAssurance)];
}

export function revisionIrl(loyer: number, irlNouveau: number, irlAncien: number, classeDpe = 'D'): number {
  return classeDpe === 'F' || classeDpe === 'G' ? loyer : (loyer * irlNouveau) / irlAncien;
}

export function penaliteDepot(loyerHc: number, moisCommences: number): number {
  return 0.1 * loyerHc * moisCommences;
}

export function impotMicroFoncier(loyers: number, tmi: number): number {
  const base = 0.7 * loyers;
  return base * (tmi + PS_FONCIER);
}

export function impotReelFoncier(loyers: number, charges: number, nbLocaux: number, tmi: number): number {
  const base = Math.max(0, loyers - charges - 20 * nbLocaux);
  return base * (tmi + PS_FONCIER);
}

/** Retourne [déficit imputable sur le revenu global, déficit reportable sur 10 ans]. */
export function deficitFoncier(
  loyers: number,
  interets: number,
  autresCharges: number,
  plafond = 10_700,
): [number, number] {
  const resteLoyers = loyers - interets;
  let deficitHorsInterets: number;
  let deficitInterets: number;
  if (resteLoyers >= 0) {
    deficitHorsInterets = Math.max(0, autresCharges - resteLoyers);
    deficitInterets = 0;
  } else {
    deficitHorsInterets = autresCharges;
    deficitInterets = -resteLoyers;
  }
  const imputable = Math.min(deficitHorsInterets, plafond);
  return [imputable, deficitHorsInterets - imputable + deficitInterets];
}

export function impotMicroBic(recettes: number, abattement: number, tmi: number): number {
  const base = Math.max(0, recettes - Math.max(305, recettes * abattement));
  return base * (tmi + PS_LMNP);
}

/**
 * Retourne [base imposable, impôt, amortissements reportés].
 * L'amortissement ne crée pas de déficit (article 39 C du CGI).
 */
export function lmnpReel(
  loyers: number,
  charges: number,
  amortissementsDisponibles: number,
  tmi: number,
): [number, number, number] {
  const avant = loyers - charges;
  const utilise = Math.min(amortissementsDisponibles, Math.max(0, avant));
  const base = Math.max(0, avant) - utilise;
  return [base, base * (tmi + PS_LMNP), amortissementsDisponibles - utilise];
}

export type RegimeJeanbrun = 'intermediaire' | 'social' | 'tres_social';

export const TAUX_JEANBRUN: Record<'neuf' | 'ancien', Record<RegimeJeanbrun, number>> = {
  neuf: { intermediaire: 0.035, social: 0.045, tres_social: 0.055 },
  ancien: { intermediaire: 0.03, social: 0.035, tres_social: 0.04 },
};

/** Retourne [déduction annuelle plafonnée, base amortissable]. */
export function jeanbrun(
  prixHorsFrais: number,
  travaux = 0,
  neuf = true,
  regime: RegimeJeanbrun = 'intermediaire',
  plafond = 8_000,
): [number, number] {
  const taux = TAUX_JEANBRUN[neuf ? 'neuf' : 'ancien'][regime];
  const base = 0.8 * (prixHorsFrais + (neuf ? 0 : travaux));
  return [Math.min(base * taux, plafond), base];
}

/** Surtaxe sur les plus-values immobilières (barème à paliers avec lissage). */
export function surtaxe(p: number): number {
  const paliers: [number, number, [number, number] | null][] = [
    [50_000, 0, null],
    [60_000, 0.02, [60_000, 1 / 20]],
    [100_000, 0.02, null],
    [110_000, 0.03, [110_000, 1 / 10]],
    [150_000, 0.03, null],
    [160_000, 0.04, [160_000, 0.15]],
    [200_000, 0.04, null],
    [210_000, 0.05, [210_000, 0.2]],
    [250_000, 0.05, null],
    [260_000, 0.06, [260_000, 0.25]],
  ];
  if (p <= 50_000) return 0;
  for (const [borne, taux, lissage] of paliers.slice(1)) {
    if (p <= borne) return taux * p - (lissage ? (lissage[0] - p) * lissage[1] : 0);
  }
  return 0.06 * p;
}

/** Abattement pour durée de détention, impôt sur le revenu (19 %). */
export function abattementPvIr(annees: number): number {
  if (annees < 6) return 0;
  return annees <= 21 ? 0.06 * (annees - 5) : 1;
}

/** Abattement pour durée de détention, prélèvements sociaux (17,2 %). */
export function abattementPvPs(annees: number): number {
  const d = annees;
  if (d < 6) return 0;
  if (d <= 21) return 0.0165 * (d - 5);
  if (d === 22) return 0.0165 * 16 + 0.016;
  if (d <= 30) return 0.0165 * 16 + 0.016 + 0.09 * (d - 22);
  return 1;
}

export interface ResultatPlusValue {
  plus_value: number;
  ir: number;
  ps: number;
  surtaxe: number;
  total: number;
}

export function plusValue(
  prixAchat: number,
  fraisReels: number,
  travauxReels: number,
  prixVente: number,
  annees: number,
  amortissements = 0,
  fraisCession = 0,
): ResultatPlusValue {
  let acq = prixAchat + Math.max(fraisReels, 0.075 * prixAchat);
  acq += annees >= 5 ? Math.max(travauxReels, 0.15 * prixAchat) : travauxReels;
  acq -= amortissements;
  const pv = Math.max(0, prixVente - fraisCession - acq);
  const abIr = abattementPvIr(annees);
  const abPs = abattementPvPs(annees);
  const ir = pv * (1 - abIr) * 0.19;
  const ps = pv * (1 - Math.min(abPs, 1)) * PS_FONCIER;
  const st = surtaxe(pv * (1 - abIr));
  return { plus_value: pv, ir, ps, surtaxe: st, total: ir + ps + st };
}

export const BAREME_IFI: [number, number][] = [
  [800_000, 0],
  [1_300_000, 0.005],
  [2_570_000, 0.007],
  [5_000_000, 0.01],
  [10_000_000, 0.0125],
  [Infinity, 0.015],
];

/** Applique un barème progressif [plafond de tranche, taux] ; retourne le détail par tranche. */
export function appliquerBareme(
  montant: number,
  bareme: [number, number][],
): { total: number; tranches: { de: number; a: number; taux: number; assiette: number; montant: number }[] } {
  let total = 0;
  let bas = 0;
  const tranches: { de: number; a: number; taux: number; assiette: number; montant: number }[] = [];
  for (const [haut, taux] of bareme) {
    if (montant > bas) {
      const assiette = Math.min(montant, haut) - bas;
      total += assiette * taux;
      tranches.push({ de: bas, a: haut, taux, assiette, montant: assiette * taux });
    }
    bas = haut;
  }
  return { total, tranches };
}

export function ifi(patrimoineNet: number): number {
  if (patrimoineNet <= 1_300_000) return 0;
  let impot = appliquerBareme(patrimoineNet, BAREME_IFI).total;
  if (patrimoineNet < 1_400_000) impot -= 17_500 - 0.0125 * patrimoineNet;
  return Math.max(0, impot);
}

/** Droits de mutation à titre onéreux dans l'ancien. */
export function dmto(prix: number, tauxDepartemental = 0.045): number {
  return prix * tauxDepartemental * 1.0237 + prix * 0.012;
}

export const BAREME_EMOLUMENTS: [number, number][] = [
  [6_500, 0.0387],
  [17_000, 0.01596],
  [60_000, 0.01064],
  [Infinity, 0.00799],
];

export function emolumentsTtc(prix: number): number {
  return appliquerBareme(prix, BAREME_EMOLUMENTS).total * 1.2;
}

export const BAREME_LIGNE_DIRECTE: [number, number][] = [
  [8_072, 0.05],
  [12_109, 0.1],
  [15_932, 0.15],
  [552_324, 0.2],
  [902_838, 0.3],
  [1_805_677, 0.4],
  [Infinity, 0.45],
];

export function droitsLigneDirecte(base: number): number {
  return appliquerBareme(base, BAREME_LIGNE_DIRECTE).total;
}

/** Valeur de la nue-propriété selon l'âge de l'usufruitier (article 669 du CGI). */
export function coefNuePropriete(age: number): number {
  const limites: [number, number][] = [
    [21, 0.1],
    [31, 0.2],
    [41, 0.3],
    [51, 0.4],
    [61, 0.5],
    [71, 0.6],
    [81, 0.7],
    [91, 0.8],
  ];
  for (const [limite, coef] of limites) if (age < limite) return coef;
  return 0.9;
}

export function van(flux: number[], taux: number): number {
  return flux.reduce((s, f, k) => s + f / (1 + taux) ** k, 0);
}

/** Taux de rendement interne par dichotomie entre −99 % et 100 % (200 itérations). */
export function tri(flux: number[]): number {
  let bas = -0.99;
  let haut = 1.0;
  let mil = 0;
  for (let i = 0; i < 200; i++) {
    mil = (bas + haut) / 2;
    if (van(flux, mil) > 0) bas = mil;
    else haut = mil;
  }
  return mil;
}

// ===========================================================================
// 2. Projet locatif sur plusieurs années (module 3.2, annexe E12)
// ===========================================================================

export interface ParamsProjet {
  prix: number;
  fraisAcquisition: number;
  travaux: number;
  mobilier: number;
  /** Montant emprunté ; 0 pour un achat comptant (sans levier). */
  emprunt: number;
  tauxCredit: number;
  dureeCredit: number;
  tauxAssurance: number;
  /** Loyers annuels hors charges de la première année. */
  loyersAnnuels: number;
  croissanceLoyers: number;
  /** Charges non récupérables fixes de la première année (taxe foncière, copropriété, PNO…). */
  chargesFixes: number;
  /** Assurance loyers impayés, en part des loyers. */
  tauxGli: number;
  /** Provision de vacance, en part des loyers. */
  tauxVacance: number;
  croissanceCharges: number;
  croissancePrix: number;
  horizon: number;
  partTerrain: number;
  dureeAmortBati: number;
  dureeAmortMobilier: number;
  tmi: number;
}

/** Cas d'étude du module 3.2 : colocation meublée en LMNP au réel. */
export const PROJET_MODULE_3_2: ParamsProjet = {
  prix: 160_000,
  fraisAcquisition: 12_800,
  travaux: 20_000,
  mobilier: 6_000,
  emprunt: 180_000,
  tauxCredit: 0.0345,
  dureeCredit: 25,
  tauxAssurance: 0.003,
  loyersAnnuels: 16_200,
  croissanceLoyers: 0.01,
  chargesFixes: 3_300,
  tauxGli: 0.03,
  tauxVacance: 0.05,
  croissanceCharges: 0.02,
  croissancePrix: 0.01,
  horizon: 15,
  partTerrain: 0.15,
  dureeAmortBati: 30,
  dureeAmortMobilier: 7,
  tmi: 0.3,
};

export interface AnneeProjet {
  annee: number;
  loyers: number;
  charges: number;
  interets: number;
  assurance: number;
  mensualites: number;
  resultatImposable: number;
  impot: number;
  cashFlow: number;
}

export interface ResultatProjet {
  tri: number;
  flux: number[];
  annees: AnneeProjet[];
  apport: number;
  coutTotal: number;
  mensualite: number;
  assuranceMensuelle: number;
  chargesAnnee1: number;
  amortissementsBati: number;
  prixRevente: number;
  capitalRestantDu: number;
  plusValue: ResultatPlusValue;
  produitNetRevente: number;
  cashFlowsCumules: number;
}

/**
 * Généralisation de scenario_colocation() : mêmes étapes, mêmes arrondis implicites.
 * Avec PROJET_MODULE_3_2 elle reproduit exactement le Python.
 */
export function simulerProjet(p: ParamsProjet): ResultatProjet {
  const coutTotal = p.prix + p.fraisAcquisition + p.travaux + p.mobilier;
  const levier = p.emprunt > 0;
  const m = levier ? mensualite(p.emprunt, p.tauxCredit, p.dureeCredit) : 0;
  const ass = (p.emprunt * p.tauxAssurance) / 12;

  const interets: number[] = [];
  let crd = p.emprunt;
  for (let a = 0; a < p.dureeCredit; a++) {
    let ia = 0;
    for (let k = 0; k < 12; k++) {
      const i = (crd * p.tauxCredit) / 12;
      ia += i;
      crd -= m - i;
    }
    interets.push(ia);
  }
  let crdFin = p.emprunt;
  for (let k = 0; k < Math.min(p.horizon, p.dureeCredit) * 12; k++) {
    crdFin -= m - (crdFin * p.tauxCredit) / 12;
  }

  const ab = (p.prix * (1 - p.partTerrain) + p.travaux) / p.dureeAmortBati;
  const am = p.mobilier / p.dureeAmortMobilier;
  const chargesAnnee1 = p.chargesFixes + (p.tauxGli + p.tauxVacance) * p.loyersAnnuels;
  const flux = [-(coutTotal - p.emprunt)];
  const annees: AnneeProjet[] = [];
  let ard = 0;
  let deficit = 0;
  let amortBati = 0;

  for (let y = 1; y <= p.horizon; y++) {
    const loy = p.loyersAnnuels * (1 + p.croissanceLoyers) ** (y - 1);
    const ch = chargesAnnee1 * (1 + p.croissanceCharges) ** (y - 1);
    const enCours = levier && y <= p.dureeCredit;
    const interetsAnnee = enCours ? (interets[y - 1] ?? 0) : 0;
    const assuranceAnnee = enCours ? 12 * ass : 0;
    let base = loy - ch - (enCours ? interetsAnnee + assuranceAnnee : 0) - (y === 1 ? p.fraisAcquisition : 0);
    if (base < 0) {
      deficit += -base;
      base = 0;
    } else {
      const u = Math.min(deficit, base);
      base -= u;
      deficit -= u;
    }
    const amob = y <= p.dureeAmortMobilier ? am : 0;
    const dispo = ab + amob + ard;
    const utilise = Math.min(dispo, base);
    ard = dispo - utilise;
    amortBati += (utilise * ab) / (ab + amob);
    const imposable = base - utilise;
    const impot = imposable * (p.tmi + PS_LMNP);
    const mensualites = enCours ? 12 * (m + ass) : 0;
    const cashFlow = loy - ch - mensualites - impot;
    flux.push(cashFlow);
    annees.push({
      annee: y,
      loyers: loy,
      charges: ch,
      interets: interetsAnnee,
      assurance: assuranceAnnee,
      mensualites,
      resultatImposable: imposable,
      impot,
      cashFlow,
    });
  }

  const prixRevente = p.prix * (1 + p.croissancePrix) ** p.horizon;
  const pv = plusValue(p.prix, p.fraisAcquisition, p.travaux, prixRevente, p.horizon, amortBati);
  const produitNetRevente = prixRevente - crdFin - pv.total;
  const cashFlowsCumules = flux.slice(1).reduce((s, x) => s + x, 0);
  flux[flux.length - 1] += produitNetRevente;

  return {
    tri: tri(flux),
    flux,
    annees,
    apport: coutTotal - p.emprunt,
    coutTotal,
    mensualite: m,
    assuranceMensuelle: ass,
    chargesAnnee1,
    amortissementsBati: amortBati,
    prixRevente,
    capitalRestantDu: crdFin,
    plusValue: pv,
    produitNetRevente,
    cashFlowsCumules,
  };
}

/** Équivalent exact de scenario_colocation(levier, taux, horizon, croissance_prix) : [TRI, flux]. */
export function scenarioColocation({ levier = true, taux = 0.0345, horizon = 15, croissancePrix = 0.01 } = {}): [
  number,
  number[],
] {
  const r = simulerProjet({
    ...PROJET_MODULE_3_2,
    emprunt: levier ? PROJET_MODULE_3_2.emprunt : 0,
    tauxCredit: taux,
    horizon,
    croissancePrix,
  });
  return [r.tri, r.flux];
}

// ===========================================================================
// 3. Résultats détaillés pour les simulateurs
// ===========================================================================

export interface AnneeAmortissement {
  annee: number;
  mensualites: number;
  interets: number;
  capitalRembourse: number;
  assurance: number;
  capitalRestantDu: number;
}

/** Tableau d'amortissement annuel (annexe E2 : assurance sur le capital initial). */
export function tableauAmortissement(
  capital: number,
  tauxAnnuel: number,
  annees: number,
  tauxAssurance: number,
): AnneeAmortissement[] {
  const m = mensualite(capital, tauxAnnuel, annees);
  const ass = (capital * tauxAssurance) / 12;
  const lignes: AnneeAmortissement[] = [];
  let crd = capital;
  for (let a = 1; a <= annees; a++) {
    let interets = 0;
    let rembourse = 0;
    for (let k = 0; k < 12; k++) {
      const i = (crd * tauxAnnuel) / 12;
      interets += i;
      rembourse += m - i;
      crd -= m - i;
    }
    lignes.push({
      annee: a,
      mensualites: 12 * m,
      interets,
      capitalRembourse: rembourse,
      assurance: 12 * ass,
      capitalRestantDu: Math.abs(crd) < 1e-6 ? 0 : crd,
    });
  }
  return lignes;
}

export interface ResultatCredit {
  mensualite: number;
  assuranceMensuelle: number;
  mensualiteTotale: number;
  coutInterets: number;
  coutAssurance: number;
  coutTotal: number;
  tableau: AnneeAmortissement[];
}

export function credit(capital: number, tauxAnnuel: number, annees: number, tauxAssurance: number): ResultatCredit {
  const m = mensualite(capital, tauxAnnuel, annees);
  const ass = (capital * tauxAssurance) / 12;
  const n = annees * 12;
  return {
    mensualite: m,
    assuranceMensuelle: ass,
    mensualiteTotale: m + ass,
    coutInterets: m * n - capital,
    coutAssurance: ass * n,
    coutTotal: m * n - capital + ass * n,
    tableau: tableauAmortissement(capital, tauxAnnuel, annees, tauxAssurance),
  };
}

export interface ParamsRentabilite {
  prix: number;
  fraisAcquisition: number;
  travaux: number;
  mobilier: number;
  fraisBancaires: number;
  loyerMensuelHc: number;
  taxeFonciere: number;
  coproNonRecuperable: number;
  pno: number;
  gli: number;
  gestion: number;
  entretien: number;
  /** Vacance exprimée en mois de loyer par an. */
  moisVacance: number;
  impotsLies: number;
  capital: number;
  tauxCredit: number;
  dureeCredit: number;
  tauxAssurance: number;
}

/** Rentabilités brute, nette, nette-nette et cash-flow mensuel (annexe E1, module 1.12). */
export function rentabilite(p: ParamsRentabilite) {
  const coutTotal = p.prix + p.fraisAcquisition + p.travaux + p.mobilier + p.fraisBancaires;
  const loyersAnnuels = 12 * p.loyerMensuelHc;
  const chargesNonRecup = p.taxeFonciere + p.coproNonRecuperable + p.pno + p.gli + p.gestion + p.entretien;
  const vacance = (loyersAnnuels * p.moisVacance) / 12;
  const m = mensualite(p.capital, p.tauxCredit, p.dureeCredit);
  const ass = (p.capital * p.tauxAssurance) / 12;
  const cashFlowAvantImpot = (loyersAnnuels - chargesNonRecup - vacance) / 12 - (m + ass);
  return {
    coutTotal,
    loyersAnnuels,
    chargesNonRecup,
    vacance,
    rentaBrute: loyersAnnuels / coutTotal,
    rentaNette: (loyersAnnuels - chargesNonRecup - vacance) / coutTotal,
    rentaNetteNette: (loyersAnnuels - chargesNonRecup - vacance - p.impotsLies) / coutTotal,
    mensualite: m,
    assuranceMensuelle: ass,
    cashFlowAvantImpot,
    cashFlowApresImpot: cashFlowAvantImpot - p.impotsLies / 12,
  };
}

export function capaciteDetaillee(
  revenusMensuels: number,
  loyersMensuels: number,
  creditsExistants: number,
  tauxAnnuel: number,
  annees: number,
  tauxAssurance: number,
) {
  const [mensualiteMax, capital] = capaciteEmprunt(
    revenusMensuels,
    loyersMensuels,
    creditsExistants,
    tauxAnnuel,
    annees,
    tauxAssurance,
  );
  const revenusRetenus = revenusMensuels + 0.7 * loyersMensuels;
  return {
    revenusRetenus,
    chargeMaximale: 0.35 * revenusRetenus,
    mensualiteMax,
    capital: Math.max(0, capital),
    mensualiteHorsAssurance: mensualiteMax > 0 ? mensualite(Math.max(0, capital), tauxAnnuel, annees) : 0,
    assuranceMensuelle: (Math.max(0, capital) * tauxAssurance) / 12,
  };
}

export type StatutRevision = 'a-la-date' | 'a-la-demande' | 'perdue';

/** Révision annuelle (annexe E4) avec date d'effet. Dates ISO « AAAA-MM-JJ ». */
export function revisionLoyer(p: {
  loyer: number;
  irlAncien: number;
  irlNouveau: number;
  classeDpe: string;
  /** Bail conclu, renouvelé ou tacitement reconduit depuis le 24 août 2022 (métropole). */
  gelApplicable: boolean;
  dateRevision: string;
  dateDemande: string;
}) {
  const bloque = p.gelApplicable && (p.classeDpe === 'F' || p.classeDpe === 'G');
  const loyerRevise = revisionIrl(p.loyer, p.irlNouveau, p.irlAncien, bloque ? p.classeDpe : 'D');
  const limite = ajouterMois(p.dateRevision, 12);
  let statut: StatutRevision;
  let dateEffet: string | null;
  if (p.dateDemande <= p.dateRevision) {
    statut = 'a-la-date';
    dateEffet = p.dateRevision;
  } else if (p.dateDemande <= limite) {
    statut = 'a-la-demande';
    dateEffet = p.dateDemande;
  } else {
    statut = 'perdue';
    dateEffet = null;
  }
  return {
    bloque,
    loyerRevise: statut === 'perdue' ? p.loyer : loyerRevise,
    variation: loyerRevise / p.loyer - 1,
    statut,
    dateEffet,
    dateLimiteDemande: limite,
  };
}

/** Nombre de mois commencés entre une date limite et une date de restitution (annexe E5). */
export function moisDeRetardCommences(dateLimite: string, dateRestitution: string): number {
  if (dateRestitution <= dateLimite) return 0;
  let mois = 1;
  while (ajouterMois(dateLimite, mois) < dateRestitution) mois++;
  return mois;
}

export function penaliteDepotDetaillee(p: {
  loyerHc: number;
  dateRemiseCles: string;
  etatDesLieuxConforme: boolean;
  dateRestitution: string;
  adresseTransmise: boolean;
}) {
  const delaiMois = p.etatDesLieuxConforme ? 1 : 2;
  const dateLimite = ajouterMois(p.dateRemiseCles, delaiMois);
  const moisRetard = p.adresseTransmise ? moisDeRetardCommences(dateLimite, p.dateRestitution) : 0;
  return {
    delaiMois,
    dateLimite,
    retard: p.dateRestitution > dateLimite,
    moisRetard,
    penalite: penaliteDepot(p.loyerHc, moisRetard),
  };
}

export function comparatifFoncier(p: {
  loyers: number;
  interets: number;
  autresCharges: number;
  nbLocaux: number;
  tmi: number;
  plafondDeficit: number;
}) {
  const microEligible = p.loyers <= 15_000;
  const microBase = 0.7 * p.loyers;
  const resultat = p.loyers - p.interets - p.autresCharges - 20 * p.nbLocaux;
  let deficitImputable = 0;
  let deficitReportable = 0;
  if (resultat < 0) {
    [deficitImputable, deficitReportable] = deficitFoncier(
      p.loyers,
      p.interets,
      p.autresCharges + 20 * p.nbLocaux,
      p.plafondDeficit,
    );
  }
  return {
    micro: {
      eligible: microEligible,
      base: microBase,
      ir: microBase * p.tmi,
      ps: microBase * PS_FONCIER,
      impot: impotMicroFoncier(p.loyers, p.tmi),
    },
    reel: {
      resultat,
      base: Math.max(0, resultat),
      ir: Math.max(0, resultat) * p.tmi,
      ps: Math.max(0, resultat) * PS_FONCIER,
      impot: impotReelFoncier(p.loyers, p.interets + p.autresCharges, p.nbLocaux, p.tmi),
      deficitImputable,
      deficitReportable,
      economieImpot: deficitImputable * p.tmi,
    },
  };
}

export type TypeMeuble = 'longue-duree' | 'tourisme-classe' | 'tourisme-non-classe';

export const MICRO_BIC: Record<TypeMeuble, { plafond: number; abattement: number }> = {
  'longue-duree': { plafond: 83_600, abattement: 0.5 },
  'tourisme-classe': { plafond: 83_600, abattement: 0.5 },
  'tourisme-non-classe': { plafond: 15_000, abattement: 0.3 },
};

export function comparatifMeuble(p: {
  recettes: number;
  typeMeuble: TypeMeuble;
  charges: number;
  prix: number;
  partTerrain: number;
  dureeBati: number;
  mobilier: number;
  dureeMobilier: number;
  travaux: number;
  dureeTravaux: number;
  amortissementsDifferes: number;
  tmi: number;
}) {
  const { plafond, abattement } = MICRO_BIC[p.typeMeuble];
  const abattementEffectif = Math.max(305, p.recettes * abattement);
  const microBase = Math.max(0, p.recettes - abattementEffectif);
  const amortBati = (p.prix * (1 - p.partTerrain)) / p.dureeBati;
  const amortMobilier = p.dureeMobilier > 0 ? p.mobilier / p.dureeMobilier : 0;
  const amortTravaux = p.dureeTravaux > 0 ? p.travaux / p.dureeTravaux : 0;
  const amortAnnuel = amortBati + amortMobilier + amortTravaux;
  const disponibles = amortAnnuel + p.amortissementsDifferes;
  const [base, impot, reportes] = lmnpReel(p.recettes, p.charges, disponibles, p.tmi);
  return {
    micro: {
      eligible: p.recettes <= plafond,
      plafond,
      abattement,
      abattementEffectif,
      base: microBase,
      ir: microBase * p.tmi,
      ps: microBase * PS_LMNP,
      impot: impotMicroBic(p.recettes, abattement, p.tmi),
    },
    reel: {
      resultatAvantAmortissement: p.recettes - p.charges,
      amortBati,
      amortMobilier,
      amortTravaux,
      amortAnnuel,
      amortissementsDisponibles: disponibles,
      amortissementsUtilises: disponibles - reportes,
      amortissementsReportes: reportes,
      deficitReportable: Math.max(0, p.charges - p.recettes),
      base,
      ir: base * p.tmi,
      ps: base * PS_LMNP,
      impot,
    },
  };
}

export function jeanbrunDetaille(p: {
  prix: number;
  travaux: number;
  neuf: boolean;
  regime: RegimeJeanbrun;
  plafond: number;
}) {
  const [deduction, base] = jeanbrun(p.prix, p.travaux, p.neuf, p.regime, p.plafond);
  const taux = TAUX_JEANBRUN[p.neuf ? 'neuf' : 'ancien'][p.regime];
  return {
    base,
    taux,
    deductionTheorique: base * taux,
    deduction,
    plafonnee: base * taux > p.plafond,
    total9Ans: Math.min(9 * deduction, base),
    partTravaux: p.prix > 0 ? p.travaux / p.prix : 0,
    seuilTravauxAtteint: p.neuf || p.travaux >= 0.3 * p.prix,
  };
}

export function plusValueDetaillee(p: {
  prixAchat: number;
  dateAchat: string;
  fraisReels: number;
  travauxReels: number;
  prixVente: number;
  dateVente: string;
  fraisCession: number;
  amortissements: number;
}) {
  const annees = anneesPleines(p.dateAchat, p.dateVente);
  const forfaitFrais = 0.075 * p.prixAchat;
  const forfaitTravaux = 0.15 * p.prixAchat;
  const fraisRetenus = Math.max(p.fraisReels, forfaitFrais);
  const travauxRetenus = annees >= 5 ? Math.max(p.travauxReels, forfaitTravaux) : p.travauxReels;
  const prixAcquisitionMajore = p.prixAchat + fraisRetenus + travauxRetenus - p.amortissements;
  const r = plusValue(p.prixAchat, p.fraisReels, p.travauxReels, p.prixVente, annees, p.amortissements, p.fraisCession);
  const abIr = abattementPvIr(annees);
  const abPs = Math.min(abattementPvPs(annees), 1);
  return {
    annees,
    fraisRetenus,
    fraisForfait: fraisRetenus === forfaitFrais && forfaitFrais > p.fraisReels,
    travauxRetenus,
    travauxForfait: annees >= 5 && forfaitTravaux > p.travauxReels,
    prixCessionNet: p.prixVente - p.fraisCession,
    prixAcquisitionMajore,
    abattementIr: abIr,
    abattementPs: abPs,
    baseIr: r.plus_value * (1 - abIr),
    basePs: r.plus_value * (1 - abPs),
    ...r,
  };
}

export function ifiDetaille(p: { actifs: number; residencePrincipale: number; dettes: number }) {
  const patrimoineNet = p.actifs + 0.7 * p.residencePrincipale - p.dettes;
  const redevable = patrimoineNet > 1_300_000;
  const bareme = appliquerBareme(Math.max(0, patrimoineNet), BAREME_IFI);
  const decote = redevable && patrimoineNet < 1_400_000 ? 17_500 - 0.0125 * patrimoineNet : 0;
  return {
    patrimoineNet,
    redevable,
    tranches: bareme.tranches,
    impotBareme: redevable ? bareme.total : 0,
    decote,
    ifi: ifi(patrimoineNet),
  };
}

export function fraisAcquisition(p: { prix: number; neuf: boolean; tauxDepartemental: number; debours: number }) {
  if (p.neuf) {
    return { neuf: true as const, estimationBasse: 0.02 * p.prix, estimationHaute: 0.03 * p.prix };
  }
  const taxeDepartementale = p.prix * p.tauxDepartemental;
  const fraisAssiette = taxeDepartementale * 0.0237;
  const taxeCommunale = p.prix * 0.012;
  const emolumentsHt = appliquerBareme(p.prix, BAREME_EMOLUMENTS).total;
  const csi = 0.001 * p.prix;
  const total = dmto(p.prix, p.tauxDepartemental) + emolumentsHt * 1.2 + csi + p.debours;
  return {
    neuf: false as const,
    taxeDepartementale,
    fraisAssiette,
    taxeCommunale,
    dmto: dmto(p.prix, p.tauxDepartemental),
    emolumentsHt,
    emolumentsTtc: emolumentsTtc(p.prix),
    csi,
    debours: p.debours,
    total,
    partDuPrix: p.prix > 0 ? total / p.prix : 0,
  };
}

export function donation(p: { valeur: number; nuePropriete: boolean; ageUsufruitier: number; abattement: number }) {
  const coefficient = p.nuePropriete ? coefNuePropriete(p.ageUsufruitier) : 1;
  const valeurTaxable = p.valeur * coefficient;
  const base = Math.max(0, valeurTaxable - p.abattement);
  const bareme = appliquerBareme(base, BAREME_LIGNE_DIRECTE);
  return {
    coefficient,
    valeurTaxable,
    base,
    tranches: bareme.tranches,
    droits: droitsLigneDirecte(base),
    droitsPleinePropriete: droitsLigneDirecte(Math.max(0, p.valeur - p.abattement)),
  };
}

/** Dates de congé (annexe E14). Dates ISO. */
export function datesConge(p: {
  dateEcheance: string;
  typeBail: 'vide' | 'meuble';
  dateReceptionConge: string;
  preavisLocataireMois: number;
}) {
  const delaiBailleurMois = p.typeBail === 'vide' ? 6 : 3;
  return {
    delaiBailleurMois,
    dateLimiteBailleur: ajouterMois(p.dateEcheance, -delaiBailleurMois),
    finPreavisLocataire: ajouterMois(p.dateReceptionConge, p.preavisLocataireMois),
  };
}
