/**
 * Calculs des outils ajoutés en version 005, fondés sur les règles écrites dans la formation
 * (modules cités en commentaire). Fonctions pures, testées dans calculs-outils.test.ts.
 */

const arrondi2 = (x: number) => Math.round(x * 100) / 100;

// ---------------------------------------------------------------------------
// Décence énergétique et DPE (modules 1.4, 1.5, 3.9)
// ---------------------------------------------------------------------------

export type ClasseDpe = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
export type Territoire = 'metropole' | 'outre-mer';

/** Date (incluse) à partir de laquelle la classe est non décente, ou null. Tableau du module 3.9. */
export function dateNonDecence(classe: ClasseDpe, territoire: Territoire): string | null {
  const calendrier: Record<Territoire, Partial<Record<ClasseDpe, string>>> = {
    metropole: { G: '2025-01-01', F: '2028-01-01', E: '2034-01-01' },
    'outre-mer': { G: '2028-01-01', F: '2031-01-01' },
  };
  return calendrier[territoire][classe] ?? null;
}

/** Gel des loyers (révision, relocation, renouvellement) des logements F et G : date d'effet. */
export const debutGelLoyers = (territoire: Territoire): string =>
  territoire === 'metropole' ? '2022-08-24' : '2024-07-01';

export interface DiagnosticDpe {
  decent: boolean;
  /** Date à partir de laquelle le logement n'est plus décent (passée ou future), ou null. */
  nonDecentDepuis: string | null;
  loyerGele: boolean;
  mentionExcessive: boolean;
  /** Audit énergétique obligatoire à la vente d'une maison ou d'un immeuble en monopropriété. */
  auditVenteDepuis: string | null;
}

export function diagnosticDpe(classe: ClasseDpe, territoire: Territoire, dateBail: string): DiagnosticDpe {
  const limite = dateNonDecence(classe, territoire);
  const audit: Partial<Record<ClasseDpe, string>> = {
    G: '2023-04-01',
    F: '2023-04-01',
    E: '2025-01-01',
    D: '2034-01-01',
  };
  return {
    decent: limite === null || dateBail < limite,
    nonDecentDepuis: limite,
    loyerGele: (classe === 'F' || classe === 'G') && dateBail >= debutGelLoyers(territoire),
    mentionExcessive: classe === 'F' || classe === 'G',
    auditVenteDepuis: audit[classe] ?? null,
  };
}

// ---------------------------------------------------------------------------
// Régularisation des charges (module 2.2)
// ---------------------------------------------------------------------------

export interface Regularisation {
  provisionsAnnuelles: number;
  /** Positif : complément dû par le locataire ; négatif : somme à lui rembourser. */
  solde: number;
  provisionMensuelleAjustee: number;
}

export function regularisationCharges(
  provisionMensuelle: number,
  mois: number,
  depensesReelles: number,
): Regularisation {
  const provisionsAnnuelles = arrondi2(provisionMensuelle * mois);
  return {
    provisionsAnnuelles,
    solde: arrondi2(depensesReelles - provisionsAnnuelles),
    provisionMensuelleAjustee: arrondi2(depensesReelles / 12),
  };
}

// ---------------------------------------------------------------------------
// Meublé de tourisme ou location meublée classique (module 3.8)
// ---------------------------------------------------------------------------

export interface ComparaisonTourisme {
  nuits: number;
  recettesTourisme: number;
  commissions: number;
  chargesTourisme: number;
  netTourisme: number;
  recettesClassique: number;
  netClassique: number;
  /** Base imposable au micro-BIC (après abattement) et respect du plafond. */
  microBicTourisme: { abattement: number; plafond: number; base: number; dansLePlafond: boolean };
  microBicClassique: { abattement: number; plafond: number; base: number; dansLePlafond: boolean };
}

/** Micro-BIC 2026 : 83 600 € et 50 % (longue durée, tourisme classé, chambres d'hôtes) ; 15 000 € et 30 % sinon. */
export function microBic(recettes: number, classeOuLongueDuree: boolean) {
  const abattement = classeOuLongueDuree ? 0.5 : 0.3;
  const plafond = classeOuLongueDuree ? 83_600 : 15_000;
  return { abattement, plafond, base: arrondi2(recettes * (1 - abattement)), dansLePlafond: recettes <= plafond };
}

export function comparaisonTourisme(p: {
  prixNuit: number;
  tauxOccupation: number;
  commission: number;
  autresChargesTourisme: number;
  classe: boolean;
  loyerMensuelClassique: number;
  chargesClassique: number;
}): ComparaisonTourisme {
  const nuits = 365 * p.tauxOccupation;
  const recettesTourisme = arrondi2(nuits * p.prixNuit);
  const commissions = arrondi2(recettesTourisme * p.commission);
  const chargesTourisme = arrondi2(commissions + p.autresChargesTourisme);
  const recettesClassique = arrondi2(p.loyerMensuelClassique * 12);
  return {
    nuits,
    recettesTourisme,
    commissions,
    chargesTourisme,
    netTourisme: arrondi2(recettesTourisme - chargesTourisme),
    recettesClassique,
    netClassique: arrondi2(recettesClassique - p.chargesClassique),
    microBicTourisme: microBic(recettesTourisme, p.classe),
    microBicClassique: microBic(recettesClassique, true),
  };
}

// ---------------------------------------------------------------------------
// Denormandie et Loc'Avantages (module 3.4)
// ---------------------------------------------------------------------------

export const TAUX_DENORMANDIE: Record<6 | 9 | 12, number> = { 6: 0.12, 9: 0.18, 12: 0.21 };

export function denormandie(p: { prix: number; travaux: number; surface: number; duree: 6 | 9 | 12 }) {
  const prixDeRevient = p.prix + p.travaux;
  const plafond = Math.min(300_000, 5_500 * p.surface);
  const base = Math.min(prixDeRevient, plafond);
  const taux = TAUX_DENORMANDIE[p.duree];
  const reduction = arrondi2(base * taux);
  return {
    prixDeRevient,
    plafond,
    base,
    taux,
    reduction,
    parAn: arrondi2(reduction / p.duree),
    partTravaux: prixDeRevient > 0 ? p.travaux / prixDeRevient : 0,
    conditionTravaux: prixDeRevient > 0 && p.travaux / prixDeRevient >= 0.25,
  };
}

export type ConventionLocAvantages = 'loc1' | 'loc2' | 'loc3';

export function tauxLocAvantages(convention: ConventionLocAvantages, intermediation: boolean): number {
  if (convention === 'loc3') return 0.65;
  if (convention === 'loc2') return intermediation ? 0.4 : 0.35;
  return intermediation ? 0.2 : 0.15;
}

export function locAvantages(loyerMensuel: number, convention: ConventionLocAvantages, intermediation: boolean) {
  const loyersAnnuels = arrondi2(loyerMensuel * 12);
  const taux = tauxLocAvantages(convention, intermediation || convention === 'loc3');
  return {
    loyersAnnuels,
    taux,
    reductionAnnuelle: arrondi2(loyersAnnuels * taux),
    sur6Ans: arrondi2(loyersAnnuels * taux * 6),
  };
}

// ---------------------------------------------------------------------------
// Loyer à la relocation en zone tendue (module 2.1)
// ---------------------------------------------------------------------------

export type ExceptionRelocation = 'aucune' | 'travaux' | 'sous-evalue' | 'libre';

export function loyerRelocation(p: {
  dernierLoyer: number;
  reviseDansLes12Mois: boolean;
  irlAncien: number;
  irlNouveau: number;
  passoire: boolean;
  exception: ExceptionRelocation;
  coutTravaux: number;
  loyerVoisinage: number;
}) {
  const avecIrl = p.reviseDansLes12Mois ? p.dernierLoyer : arrondi2((p.dernierLoyer * p.irlNouveau) / p.irlAncien);
  const base = p.passoire ? p.dernierLoyer : avecIrl;
  let maximum: number | null = base;
  let motif = p.reviseDansLes12Mois
    ? 'Dernier loyer (révisé dans les douze derniers mois)'
    : 'Dernier loyer révisé selon l’IRL';
  let exceptionRefusee = false;
  if (p.passoire) {
    motif = 'Logement F ou G : aucune hausse possible';
    exceptionRefusee = p.exception !== 'aucune';
  } else if (p.exception === 'travaux') {
    if (p.coutTravaux >= 6 * p.dernierLoyer) {
      maximum = arrondi2(base + (0.15 * p.coutTravaux) / 12);
      motif = 'Travaux d’au moins la moitié de la dernière année de loyer : hausse annuelle de 15 % de leur coût';
    } else exceptionRefusee = true;
  } else if (p.exception === 'sous-evalue') {
    if (p.loyerVoisinage > base) {
      maximum = arrondi2(base + (p.loyerVoisinage - base) / 2);
      motif = 'Loyer sous-évalué : hausse de la moitié de l’écart avec le loyer du voisinage';
    } else exceptionRefusee = true;
  } else if (p.exception === 'libre') {
    maximum = null;
    motif = 'Loyer fixé librement (sous réserve de l’encadrement là où il s’applique)';
  }
  return { avecIrl, maximum, motif, exceptionRefusee };
}

// ---------------------------------------------------------------------------
// Encadrement des loyers (module 2.1)
// ---------------------------------------------------------------------------

export function encadrementLoyer(p: {
  surface: number;
  loyerReference: number;
  loyerBase: number;
  complement: number;
  passoire: boolean;
}) {
  const majore = arrondi2(p.loyerReference * 1.2);
  const minore = arrondi2(p.loyerReference * 0.7);
  const plafond = arrondi2(majore * p.surface);
  return {
    majore,
    minore,
    plafond,
    depassement: arrondi2(Math.max(0, p.loyerBase - plafond)),
    conforme: p.loyerBase <= plafond,
    complementInterdit: p.passoire && p.complement > 0,
    loyerTotal: arrondi2(p.loyerBase + p.complement),
  };
}

// ---------------------------------------------------------------------------
// Taux d'usure (module 2.10) : seuils du 3e trimestre 2026
// ---------------------------------------------------------------------------

export type TypePret = 'fixe' | 'variable' | 'relais';

export function seuilUsure(type: TypePret, dureeAnnees: number): number {
  if (type === 'variable') return 5.28;
  if (type === 'relais') return 6.39;
  if (dureeAnnees < 10) return 4.07;
  if (dureeAnnees < 20) return 4.57;
  return 5.29;
}

// ---------------------------------------------------------------------------
// TVA sur travaux (module 2.3)
// ---------------------------------------------------------------------------

export type NatureTravaux = 'entretien' | 'energetique' | 'neuf';
export const TAUX_TVA: Record<NatureTravaux, number> = { entretien: 0.1, energetique: 0.055, neuf: 0.2 };

export function tvaTravaux(montantHt: number, nature: NatureTravaux) {
  const taux = TAUX_TVA[nature];
  const tva = arrondi2(montantHt * taux);
  return { taux, tva, ttc: arrondi2(montantHt + tva) };
}

// ---------------------------------------------------------------------------
// Loyer au m² et dépôt de garantie (modules 1.6, 1.7)
// ---------------------------------------------------------------------------

export function loyerAuM2(p: { surface: number; prixM2: number; charges: number; meuble: boolean }) {
  const loyer = arrondi2(p.surface * p.prixM2);
  return {
    loyer,
    chargesComprises: arrondi2(loyer + p.charges),
    /** Plafond du dépôt de garantie : un mois de loyer hors charges en vide, deux en meublé. */
    depotMaximum: arrondi2(loyer * (p.meuble ? 2 : 1)),
  };
}
