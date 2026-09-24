/**
 * Les simulateurs et outils : champs (avec valeurs par défaut issues des exemples de la formation),
 * contrôles de saisie et résultats détaillés. Module pur, partagé par le build (résultat
 * pré-affiché, lisible sans JavaScript) et par le navigateur (recalcul à chaque saisie).
 * Tous les calculs passent par calculs.ts.
 */
import * as C from './calculs';
import * as O from './calculs-outils';
import { ecartJours, estDateIso, formaterDateFr } from './dates-fr';
import { euros, eurosArrondis, nombre, pourcent } from './format';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ChampBase {
  id: string;
  libelle: string;
  aide?: string;
  groupe: string;
}
export interface ChampNombre extends ChampBase {
  type: 'nombre';
  unite?: string;
  defaut: number;
  min?: number;
  max?: number;
  entier?: boolean;
  /** Valeurs proposées à la saisie (liste de suggestions). */
  suggestions?: { valeur: number; libelle: string }[];
}
export interface ChampChoix extends ChampBase {
  type: 'choix';
  options: { valeur: string; libelle: string }[];
  defaut: string;
}
export interface ChampCase extends ChampBase {
  type: 'case';
  defaut: boolean;
}
export interface ChampDate extends ChampBase {
  type: 'date';
  defaut: string;
}
export type Champ = ChampNombre | ChampChoix | ChampCase | ChampDate;

export type Valeurs = Record<string, number | string | boolean>;

export interface LigneResultat {
  libelle: string;
  valeur: string;
  detail?: string;
  fort?: boolean;
}
export interface TableauResultat {
  legende: string;
  entetes: string[];
  lignes: string[][];
  /** Colonnes numériques (alignées à droite). */
  numeriques?: boolean[];
}
export interface BlocResultat {
  titre: string;
  lignes?: LigneResultat[];
  tableau?: TableauResultat;
  texte?: string;
  alerte?: { genre: 'info' | 'attention' | 'surveiller'; texte: string };
}
export interface Resultat {
  synthese: { libelle: string; valeur: string; detail?: string }[];
  blocs: BlocResultat[];
}
export interface ErreurSaisie {
  champ: string;
  message: string;
}

export interface Simulateur {
  id: string;
  titre: string;
  resume: string;
  /** Modules qui expliquent le calcul. */
  modules: string[];
  /** Ancre de la formule dans l'annexe E (« e1 »…), pour les 14 simulateurs de l'annexe E. */
  formule?: string;
  /** Règles appliquées, tirées de la formation (outils sans formule dans l'annexe E). */
  methode?: string[];
  groupes: { id: string; titre: string }[];
  champs: Champ[];
  /** Contrôles croisés entre champs (en plus des bornes de chaque champ). */
  controler?: (v: Valeurs) => ErreurSaisie[];
  calculer: (v: Valeurs) => Resultat;
}

// ---------------------------------------------------------------------------
// Aides à la déclaration
// ---------------------------------------------------------------------------

const eur = (
  id: string,
  libelle: string,
  defaut: number,
  groupe: string,
  extra: Partial<ChampNombre> = {},
): ChampNombre => ({
  type: 'nombre',
  id,
  libelle,
  unite: '€',
  defaut,
  min: 0,
  groupe,
  ...extra,
});
const pct = (
  id: string,
  libelle: string,
  defaut: number,
  groupe: string,
  extra: Partial<ChampNombre> = {},
): ChampNombre => ({
  type: 'nombre',
  id,
  libelle,
  unite: '%',
  defaut,
  min: 0,
  max: 100,
  groupe,
  ...extra,
});
const ans = (id: string, libelle: string, defaut: number, groupe: string, max = 30): ChampNombre => ({
  type: 'nombre',
  id,
  libelle,
  unite: 'ans',
  defaut,
  min: 1,
  max,
  entier: true,
  groupe,
});

const OPTIONS_TMI = [
  { valeur: '0', libelle: '0 %' },
  { valeur: '11', libelle: '11 %' },
  { valeur: '30', libelle: '30 %' },
  { valeur: '41', libelle: '41 %' },
  { valeur: '45', libelle: '45 %' },
];
const tmi = (groupe: string): ChampChoix => ({
  type: 'choix',
  id: 'tmi',
  libelle: "Tranche marginale d'imposition (TMI)",
  options: OPTIONS_TMI,
  defaut: '30',
  groupe,
  aide: 'Barème 2026 (revenus 2025), par part : 11 % jusqu’à 29 579 €, 30 % jusqu’à 84 577 €, 41 % jusqu’à 181 917 €, 45 % au-delà.',
});

const n = (v: Valeurs, id: string): number => Number(v[id]);
const s = (v: Valeurs, id: string): string => String(v[id]);
const b = (v: Valeurs, id: string): boolean => v[id] === true;
const taux = (v: Valeurs, id: string): number => n(v, id) / 100;
const dateFr = (iso: string | null): string => (iso ? formaterDateFr(iso) : '—');
/** Montant signé (« +308,37 € », « −460 € »). */
const signe = (x: number, decimales = 2): string => (x > 0 ? `+${euros(x, decimales)}` : euros(x, decimales));

const AVERTISSEMENT_HCSF =
  'Les normes du HCSF limitent la durée à 25 ans (27 ans avec un différé justifié) et le taux d’effort à 35 %, assurance comprise.';

// ---------------------------------------------------------------------------
// 1. Rentabilité
// ---------------------------------------------------------------------------

const rentabilite: Simulateur = {
  id: 'rentabilite',
  titre: 'Rentabilité et cash-flow',
  resume: 'Rentabilités brute et nette, cash-flow mensuel avant impôt d’un investissement locatif.',
  modules: ['1.12', '3.2'],
  formule: 'e1',
  groupes: [
    { id: 'acq', titre: 'Coût de l’opération' },
    { id: 'loyer', titre: 'Loyer' },
    { id: 'charges', titre: 'Charges non récupérables (par an)' },
    { id: 'credit', titre: 'Financement' },
    { id: 'impot', titre: 'Impôt' },
  ],
  champs: [
    eur('prix', 'Prix du bien', 100_000, 'acq'),
    eur('frais', "Frais d'acquisition", 8_000, 'acq', {
      aide: 'Environ 7 à 8,5 % dans l’ancien, 2 à 3 % dans le neuf.',
    }),
    eur('travaux', 'Travaux', 7_000, 'acq'),
    eur('mobilier', 'Mobilier', 3_000, 'acq'),
    eur('fraisBancaires', 'Frais de garantie et de dossier du prêt', 0, 'acq'),
    eur('loyer', 'Loyer mensuel hors charges', 520, 'loyer'),
    {
      type: 'nombre',
      id: 'vacance',
      libelle: 'Vacance locative',
      unite: 'mois par an',
      defaut: 1,
      min: 0,
      max: 12,
      groupe: 'loyer',
      aide: 'Souvent 1 mois par an en meublé, 2 à 4 semaines en vide.',
    },
    eur('taxeFonciere', 'Taxe foncière (hors taxe d’ordures ménagères)', 700, 'charges'),
    eur('copro', 'Charges de copropriété non récupérables', 300, 'charges'),
    eur('pno', 'Assurance propriétaire non occupant (PNO)', 120, 'charges'),
    eur('gli', 'Assurance loyers impayés', 187, 'charges', { aide: 'Environ 2,5 à 4 % des loyers.' }),
    eur('gestion', 'Frais de gestion', 0, 'charges'),
    eur('entretien', 'Entretien et petits travaux', 300, 'charges'),
    eur('capital', 'Montant emprunté', 110_000, 'credit'),
    pct('taux', 'Taux du crédit (hors assurance)', 3.35, 'credit', { max: 20 }),
    ans('duree', 'Durée du crédit', 20, 'credit'),
    pct('assurance', 'Assurance emprunteur (du capital initial, par an)', 0.25, 'credit', { max: 5 }),
    eur('impots', 'Impôts liés au bien (par an)', 0, 'impot', {
      aide: 'Facultatif : impôt sur le revenu et prélèvements sociaux dus sur ce bien, pour la rentabilité nette-nette.',
    }),
  ],
  controler: (v) =>
    n(v, 'prix') + n(v, 'frais') + n(v, 'travaux') + n(v, 'mobilier') + n(v, 'fraisBancaires') <= 0
      ? [{ champ: 'prix', message: 'Le coût total de l’opération doit être supérieur à zéro.' }]
      : [],
  calculer(v) {
    const r = C.rentabilite({
      prix: n(v, 'prix'),
      fraisAcquisition: n(v, 'frais'),
      travaux: n(v, 'travaux'),
      mobilier: n(v, 'mobilier'),
      fraisBancaires: n(v, 'fraisBancaires'),
      loyerMensuelHc: n(v, 'loyer'),
      taxeFonciere: n(v, 'taxeFonciere'),
      coproNonRecuperable: n(v, 'copro'),
      pno: n(v, 'pno'),
      gli: n(v, 'gli'),
      gestion: n(v, 'gestion'),
      entretien: n(v, 'entretien'),
      moisVacance: n(v, 'vacance'),
      impotsLies: n(v, 'impots'),
      capital: n(v, 'capital'),
      tauxCredit: taux(v, 'taux'),
      dureeCredit: n(v, 'duree'),
      tauxAssurance: taux(v, 'assurance'),
    });
    const net = r.loyersAnnuels - r.chargesNonRecup - r.vacance;
    const blocs: BlocResultat[] = [
      {
        titre: 'Coût total de l’opération',
        lignes: [
          { libelle: 'Prix + frais + travaux + mobilier + frais bancaires', valeur: euros(r.coutTotal, 0), fort: true },
        ],
      },
      {
        titre: 'Rentabilités',
        lignes: [
          {
            libelle: 'Loyers annuels hors charges',
            valeur: euros(r.loyersAnnuels),
            detail: `12 × ${euros(n(v, 'loyer'))}`,
          },
          {
            libelle: 'Rentabilité brute',
            valeur: pourcent(r.rentaBrute),
            detail: `${euros(r.loyersAnnuels, 0)} / ${euros(r.coutTotal, 0)}`,
            fort: true,
          },
          { libelle: 'Charges non récupérables', valeur: euros(r.chargesNonRecup) },
          {
            libelle: 'Provision pour vacance',
            valeur: euros(r.vacance),
            detail: `${nombre(n(v, 'vacance'), 0, 2)} mois de loyer`,
          },
          {
            libelle: 'Rentabilité nette de charges',
            valeur: pourcent(r.rentaNette),
            detail: `(${euros(r.loyersAnnuels, 0)} − ${euros(r.chargesNonRecup + r.vacance)}) / ${euros(r.coutTotal, 0)}`,
            fort: true,
          },
          ...(n(v, 'impots') > 0
            ? [{ libelle: 'Rentabilité nette-nette (après impôt)', valeur: pourcent(r.rentaNetteNette), fort: true }]
            : []),
        ],
      },
      {
        titre: 'Cash-flow mensuel',
        lignes: [
          {
            libelle: 'Loyers nets de charges et de vacance, par mois',
            valeur: euros(net / 12),
            detail: `${euros(net)} / 12`,
          },
          { libelle: 'Mensualité du crédit (hors assurance)', valeur: euros(-r.mensualite) },
          { libelle: 'Assurance emprunteur', valeur: euros(-r.assuranceMensuelle) },
          { libelle: 'Cash-flow mensuel avant impôt', valeur: euros(r.cashFlowAvantImpot), fort: true },
          ...(n(v, 'impots') > 0
            ? [{ libelle: 'Cash-flow mensuel après impôt', valeur: euros(r.cashFlowApresImpot), fort: true }]
            : []),
        ],
        texte:
          r.cashFlowAvantImpot < 0
            ? `Un cash-flow négatif représente l’effort d’épargne mensuel nécessaire pour détenir le bien (environ ${eurosArrondis(-r.cashFlowAvantImpot)} par mois ici), en partie compensé par le remboursement du capital.`
            : 'Un cash-flow positif signifie que les loyers couvrent les charges et le crédit avant impôt.',
      },
    ];
    return {
      synthese: [
        { libelle: 'Rentabilité brute', valeur: pourcent(r.rentaBrute) },
        { libelle: 'Rentabilité nette', valeur: pourcent(r.rentaNette) },
        { libelle: 'Cash-flow mensuel avant impôt', valeur: euros(r.cashFlowAvantImpot) },
      ],
      blocs,
    };
  },
};

// ---------------------------------------------------------------------------
// 2. Mensualité de crédit
// ---------------------------------------------------------------------------

const credit: Simulateur = {
  id: 'credit',
  titre: 'Mensualité de crédit',
  resume: 'Mensualité, coût total et tableau d’amortissement annuel d’un prêt à taux fixe.',
  modules: ['1.12', '2.10'],
  formule: 'e2',
  groupes: [{ id: 'pret', titre: 'Prêt' }],
  champs: [
    eur('capital', 'Montant emprunté', 110_000, 'pret'),
    pct('taux', 'Taux nominal annuel (hors assurance)', 3.35, 'pret', { max: 20 }),
    ans('duree', 'Durée', 20, 'pret'),
    pct('assurance', 'Assurance emprunteur (du capital initial, par an)', 0.25, 'pret', { max: 5 }),
  ],
  calculer(v) {
    const c = C.credit(n(v, 'capital'), taux(v, 'taux'), n(v, 'duree'), taux(v, 'assurance'));
    const blocs: BlocResultat[] = [
      {
        titre: 'Mensualité',
        lignes: [
          { libelle: 'Mensualité hors assurance', valeur: euros(c.mensualite), detail: 'C × t / (1 − (1 + t)^(−n))' },
          {
            libelle: 'Assurance emprunteur',
            valeur: euros(c.assuranceMensuelle),
            detail: 'Capital × taux d’assurance / 12',
          },
          { libelle: 'Mensualité totale', valeur: euros(c.mensualiteTotale), fort: true },
        ],
      },
      {
        titre: 'Coût du crédit',
        lignes: [
          { libelle: 'Intérêts', valeur: euros(c.coutInterets) },
          { libelle: 'Assurance', valeur: euros(c.coutAssurance) },
          { libelle: 'Coût total', valeur: euros(c.coutTotal), fort: true },
        ],
      },
      {
        titre: 'Tableau d’amortissement annuel',
        tableau: {
          legende: 'Tableau d’amortissement annuel',
          entetes: ['Année', 'Mensualités', 'Intérêts', 'Capital remboursé', 'Assurance', 'Capital restant dû'],
          numeriques: [true, true, true, true, true, true],
          lignes: c.tableau.map((a) => [
            String(a.annee),
            euros(a.mensualites),
            euros(a.interets),
            euros(a.capitalRembourse),
            euros(a.assurance),
            euros(a.capitalRestantDu),
          ]),
        },
      },
    ];
    if (n(v, 'duree') > 25)
      blocs.unshift({ titre: 'Durée', alerte: { genre: 'attention', texte: AVERTISSEMENT_HCSF } });
    return {
      synthese: [
        { libelle: 'Mensualité hors assurance', valeur: euros(c.mensualite) },
        { libelle: 'Mensualité assurance comprise', valeur: euros(c.mensualiteTotale) },
        { libelle: 'Coût total du crédit', valeur: euros(c.coutTotal, 0) },
      ],
      blocs,
    };
  },
};

// ---------------------------------------------------------------------------
// 3. Capacité d'emprunt
// ---------------------------------------------------------------------------

const capacite: Simulateur = {
  id: 'capacite-emprunt',
  titre: 'Capacité d’emprunt',
  resume: 'Mensualité maximale à 35 % des revenus (70 % des loyers retenus) et capital empruntable.',
  modules: ['2.10'],
  formule: 'e3',
  groupes: [
    { id: 'revenus', titre: 'Revenus et charges' },
    { id: 'pret', titre: 'Prêt envisagé' },
  ],
  champs: [
    eur('revenus', 'Revenus nets mensuels du foyer', 3_000, 'revenus'),
    eur('loyers', 'Loyers mensuels (futurs et actuels)', 700, 'revenus', {
      aide: 'La banque en retient généralement 70 %.',
    }),
    eur('credits', 'Mensualités des crédits en cours', 0, 'revenus'),
    pct('taux', 'Taux du crédit (hors assurance)', 3.45, 'pret', { max: 20 }),
    ans('duree', 'Durée', 25, 'pret'),
    pct('assurance', 'Assurance emprunteur (du capital, par an)', 0.3, 'pret', { max: 5 }),
  ],
  calculer(v) {
    const c = C.capaciteDetaillee(
      n(v, 'revenus'),
      n(v, 'loyers'),
      n(v, 'credits'),
      taux(v, 'taux'),
      n(v, 'duree'),
      taux(v, 'assurance'),
    );
    const blocs: BlocResultat[] = [
      {
        titre: 'Mensualité maximale',
        lignes: [
          {
            libelle: 'Revenus retenus',
            valeur: euros(c.revenusRetenus),
            detail: `${euros(n(v, 'revenus'))} + 70 % × ${euros(n(v, 'loyers'))}`,
          },
          { libelle: 'Charge maximale (35 %)', valeur: euros(c.chargeMaximale) },
          { libelle: 'Crédits en cours', valeur: euros(-n(v, 'credits')) },
          { libelle: 'Mensualité maximale, assurance comprise', valeur: euros(c.mensualiteMax), fort: true },
        ],
      },
      {
        titre: 'Capital empruntable',
        lignes: [
          { libelle: 'Dont mensualité hors assurance', valeur: euros(c.mensualiteHorsAssurance) },
          { libelle: 'Dont assurance', valeur: euros(c.assuranceMensuelle) },
          {
            libelle: 'Capital empruntable',
            valeur: euros(c.capital, 0),
            detail: 'Mensualité maximale / (t / (1 − (1 + t)^(−n)) + taux d’assurance / 12)',
            fort: true,
          },
        ],
        texte:
          'La banque regarde aussi le reste à vivre, l’épargne résiduelle, la stabilité professionnelle et la tenue des comptes.',
      },
    ];
    if (c.mensualiteMax <= 0) {
      blocs.unshift({
        titre: 'Capacité',
        alerte: {
          genre: 'attention',
          texte: 'Les crédits en cours absorbent déjà toute la capacité d’endettement à 35 %.',
        },
      });
    }
    if (n(v, 'duree') > 25)
      blocs.unshift({ titre: 'Durée', alerte: { genre: 'attention', texte: AVERTISSEMENT_HCSF } });
    return {
      synthese: [
        { libelle: 'Mensualité maximale (assurance comprise)', valeur: euros(c.mensualiteMax) },
        { libelle: 'Capital empruntable', valeur: `environ ${euros(c.capital, 0)}` },
      ],
      blocs,
    };
  },
};

// ---------------------------------------------------------------------------
// 4. Révision de loyer
// ---------------------------------------------------------------------------

const CLASSES_DPE = ['A', 'B', 'C', 'D', 'E', 'F', 'G'].map((c) => ({ valeur: c, libelle: c }));

const revision: Simulateur = {
  id: 'revision-loyer',
  titre: 'Révision annuelle du loyer',
  resume: 'Nouveau loyer selon l’IRL, date d’effet de la révision et blocage des logements F et G.',
  modules: ['2.1'],
  formule: 'e4',
  groupes: [
    { id: 'loyer', titre: 'Loyer et indices' },
    { id: 'dates', titre: 'Dates' },
  ],
  champs: [
    eur('loyer', 'Loyer actuel hors charges', 700, 'loyer'),
    {
      type: 'nombre',
      id: 'irlAncien',
      libelle: 'IRL du trimestre de référence, année précédente',
      defaut: 146.68,
      min: 50,
      max: 500,
      groupe: 'loyer',
    },
    {
      type: 'nombre',
      id: 'irlNouveau',
      libelle: 'IRL du même trimestre, année en cours',
      defaut: 148.37,
      min: 50,
      max: 500,
      groupe: 'loyer',
    },
    { type: 'choix', id: 'dpe', libelle: 'Classe DPE du logement', options: CLASSES_DPE, defaut: 'D', groupe: 'loyer' },
    {
      type: 'case',
      id: 'gel',
      libelle: 'Bail conclu, renouvelé ou tacitement reconduit depuis le 24 août 2022 (métropole)',
      defaut: true,
      groupe: 'loyer',
      aide: 'Outre-mer : depuis le 1er juillet 2024.',
    },
    {
      type: 'date',
      id: 'dateRevision',
      libelle: 'Date de révision prévue au bail',
      defaut: '2026-09-01',
      groupe: 'dates',
    },
    {
      type: 'date',
      id: 'dateDemande',
      libelle: 'Date à laquelle le bailleur demande la révision',
      defaut: '2026-11-15',
      groupe: 'dates',
    },
  ],
  calculer(v) {
    const r = C.revisionLoyer({
      loyer: n(v, 'loyer'),
      irlAncien: n(v, 'irlAncien'),
      irlNouveau: n(v, 'irlNouveau'),
      classeDpe: s(v, 'dpe'),
      gelApplicable: b(v, 'gel'),
      dateRevision: s(v, 'dateRevision'),
      dateDemande: s(v, 'dateDemande'),
    });
    const hausse = r.loyerRevise - n(v, 'loyer');
    const blocs: BlocResultat[] = [];
    if (r.bloque) {
      blocs.push({
        titre: 'Révision impossible',
        alerte: {
          genre: 'attention',
          texte: `Aucune révision n’est possible pour un logement classé ${s(v, 'dpe')} en métropole si le bail a été conclu, renouvelé ou tacitement reconduit depuis le 24 août 2022 (1er juillet 2024 outre-mer).`,
        },
      });
    }
    blocs.push({
      titre: 'Calcul du loyer révisé',
      lignes: [
        {
          libelle: 'Loyer révisé maximal',
          valeur: euros(r.bloque ? n(v, 'loyer') : C.revisionIrl(n(v, 'loyer'), n(v, 'irlNouveau'), n(v, 'irlAncien'))),
          detail: `${euros(n(v, 'loyer'))} × ${nombre(n(v, 'irlNouveau'), 2)} / ${nombre(n(v, 'irlAncien'), 2)}`,
          fort: true,
        },
        { libelle: 'Variation de l’IRL', valeur: pourcent(n(v, 'irlNouveau') / n(v, 'irlAncien') - 1) },
      ],
    });
    const explications: Record<C.StatutRevision, string> = {
      'a-la-date': `La demande est faite au plus tard à la date de révision : le nouveau loyer s’applique à compter du ${dateFr(r.dateEffet)}.`,
      'a-la-demande': `La demande est postérieure à la date de révision : la révision prend effet à la date de la demande, le ${dateFr(r.dateEffet)}, sans rétroactivité.`,
      perdue: `La demande intervient plus d’un an après la date de révision (délai expiré le ${dateFr(r.dateLimiteDemande)}) : la révision de cette année est perdue.`,
    };
    blocs.push({
      titre: 'Date d’effet',
      lignes: [
        { libelle: 'Date limite pour demander la révision', valeur: dateFr(r.dateLimiteDemande) },
        {
          libelle: 'Date d’effet',
          valeur: r.statut === 'perdue' ? 'Révision perdue' : dateFr(r.dateEffet),
          fort: true,
        },
      ],
      texte: explications[r.statut],
    });
    return {
      synthese: [
        { libelle: 'Nouveau loyer hors charges', valeur: euros(r.loyerRevise) },
        { libelle: 'Hausse mensuelle', valeur: signe(hausse) },
        { libelle: 'Date d’effet', valeur: r.statut === 'perdue' ? 'Révision perdue' : dateFr(r.dateEffet) },
      ],
      blocs,
    };
  },
};

// ---------------------------------------------------------------------------
// 5. Pénalité de retard du dépôt de garantie
// ---------------------------------------------------------------------------

const depot: Simulateur = {
  id: 'depot-de-garantie',
  titre: 'Pénalité de retard du dépôt de garantie',
  resume: 'Délai légal de restitution, mois de retard commencés et pénalité de 10 % du loyer par mois.',
  modules: ['1.11'],
  formule: 'e5',
  groupes: [{ id: 'depot', titre: 'Restitution' }],
  champs: [
    eur('loyer', 'Loyer mensuel hors charges', 800, 'depot'),
    { type: 'date', id: 'dateCles', libelle: 'Date de remise des clés', defaut: '2026-03-03', groupe: 'depot' },
    {
      type: 'choix',
      id: 'edl',
      libelle: 'État des lieux de sortie',
      options: [
        { valeur: 'conforme', libelle: 'Conforme à l’état des lieux d’entrée (délai d’un mois)' },
        { valeur: 'differences', libelle: 'Différences constatées (délai de deux mois)' },
      ],
      defaut: 'conforme',
      groupe: 'depot',
    },
    { type: 'date', id: 'dateRestitution', libelle: 'Date de restitution', defaut: '2026-05-12', groupe: 'depot' },
    {
      type: 'case',
      id: 'adresse',
      libelle: 'Le locataire a transmis sa nouvelle adresse',
      defaut: true,
      groupe: 'depot',
      aide: 'La pénalité n’est pas due si le retard résulte de l’absence de transmission de la nouvelle adresse.',
    },
  ],
  controler: (v) =>
    s(v, 'dateRestitution') < s(v, 'dateCles')
      ? [{ champ: 'dateRestitution', message: 'La restitution ne peut pas précéder la remise des clés.' }]
      : [],
  calculer(v) {
    const r = C.penaliteDepotDetaillee({
      loyerHc: n(v, 'loyer'),
      dateRemiseCles: s(v, 'dateCles'),
      etatDesLieuxConforme: s(v, 'edl') === 'conforme',
      dateRestitution: s(v, 'dateRestitution'),
      adresseTransmise: b(v, 'adresse'),
    });
    const jours = ecartJours(r.dateLimite, s(v, 'dateRestitution'));
    const blocs: BlocResultat[] = [
      {
        titre: 'Délai légal',
        lignes: [
          { libelle: 'Délai à compter de la remise des clés', valeur: r.delaiMois === 1 ? '1 mois' : '2 mois' },
          { libelle: 'Date limite de restitution', valeur: dateFr(r.dateLimite), fort: true },
        ],
      },
      {
        titre: 'Retard et pénalité',
        lignes: [
          { libelle: 'Restitution', valeur: dateFr(s(v, 'dateRestitution')) },
          { libelle: 'Retard', valeur: r.retard ? `${jours} jour${jours > 1 ? 's' : ''}` : 'Aucun' },
          { libelle: 'Mois de retard commencés', valeur: String(r.retard && b(v, 'adresse') ? r.moisRetard : 0) },
          {
            libelle: 'Pénalité due au locataire',
            valeur: euros(r.penalite),
            detail: `10 % × ${euros(n(v, 'loyer'))} × ${r.moisRetard} mois`,
            fort: true,
          },
        ],
        texte: r.penalite > 0 ? 'La pénalité s’ajoute à la restitution du dépôt de garantie.' : undefined,
      },
    ];
    if (r.retard && !b(v, 'adresse')) {
      blocs.push({
        titre: 'Adresse',
        alerte: {
          genre: 'info',
          texte: 'Faute de nouvelle adresse transmise par le locataire, la pénalité n’est pas due.',
        },
      });
    }
    blocs.push({
      titre: 'Copropriété',
      alerte: {
        genre: 'info',
        texte:
          'En copropriété, le bailleur peut conserver une provision de 20 % au plus jusqu’à l’approbation annuelle des comptes, puis doit régulariser dans le mois qui suit.',
      },
    });
    return {
      synthese: [
        { libelle: 'Date limite de restitution', valeur: dateFr(r.dateLimite) },
        { libelle: 'Mois de retard commencés', valeur: String(r.moisRetard) },
        { libelle: 'Pénalité', valeur: euros(r.penalite) },
      ],
      blocs,
    };
  },
};

// ---------------------------------------------------------------------------
// 6. Micro-foncier ou réel
// ---------------------------------------------------------------------------

const foncier: Simulateur = {
  id: 'micro-foncier-ou-reel',
  titre: 'Micro-foncier ou régime réel',
  resume:
    'Impôt et prélèvements sociaux d’une location nue dans chaque régime, déficit foncier imputable et reportable.',
  modules: ['2.6', '2.8'],
  formule: 'e6',
  groupes: [
    { id: 'loyers', titre: 'Loyers' },
    { id: 'charges', titre: 'Charges déductibles au réel (par an)' },
    { id: 'foyer', titre: 'Foyer fiscal' },
  ],
  champs: [
    eur('loyers', 'Loyers bruts annuels', 7_800, 'loyers'),
    eur('interets', 'Intérêts et frais d’emprunt, assurance emprunteur comprise', 3_800, 'charges', {
      aide: 'Le déficit dû aux intérêts ne s’impute que sur les revenus fonciers des dix années suivantes.',
    }),
    eur('taxeFonciere', 'Taxe foncière (hors TEOM récupérée)', 900, 'charges'),
    eur('copro', 'Charges de copropriété non récupérables', 400, 'charges'),
    eur('assurances', 'Primes d’assurance (PNO, loyers impayés)', 150, 'charges'),
    eur('travaux', 'Travaux de réparation, d’entretien et d’amélioration', 300, 'charges'),
    eur('gestion', 'Frais de gestion', 0, 'charges'),
    eur('autres', 'Autres charges déductibles', 0, 'charges'),
    {
      type: 'nombre',
      id: 'locaux',
      libelle: 'Nombre de locaux',
      aide: 'Forfait de 20 € par local pour les menus frais non justifiés.',
      defaut: 1,
      min: 0,
      max: 50,
      entier: true,
      groupe: 'charges',
    },
    tmi('foyer'),
    {
      type: 'case',
      id: 'renovation',
      libelle: 'Rénovation énergétique faisant passer le logement de E, F ou G à A, B, C ou D',
      defaut: false,
      groupe: 'foyer',
      aide: 'Plafond d’imputation porté à 21 400 € pour les dépenses payées jusqu’au 31 décembre 2027.',
    },
  ],
  calculer(v) {
    const autres = ['taxeFonciere', 'copro', 'assurances', 'travaux', 'gestion', 'autres'].reduce(
      (t, k) => t + n(v, k),
      0,
    );
    const t = taux(v, 'tmi');
    const plafond = b(v, 'renovation') ? 21_400 : 10_700;
    const r = C.comparatifFoncier({
      loyers: n(v, 'loyers'),
      interets: n(v, 'interets'),
      autresCharges: autres,
      nbLocaux: n(v, 'locaux'),
      tmi: t,
      plafondDeficit: plafond,
    });
    const charges = n(v, 'interets') + autres;
    const blocs: BlocResultat[] = [];
    if (!r.micro.eligible) {
      blocs.push({
        titre: 'Micro-foncier',
        alerte: {
          genre: 'attention',
          texte: 'Au-delà de 15 000 € de revenus fonciers bruts, le régime réel est obligatoire.',
        },
      });
    }
    blocs.push({
      titre: 'Micro-foncier (abattement de 30 %)',
      lignes: [
        { libelle: 'Base imposable', valeur: euros(r.micro.base), detail: `70 % × ${euros(n(v, 'loyers'))}` },
        { libelle: `Impôt sur le revenu (${nombre(n(v, 'tmi'))} %)`, valeur: euros(r.micro.ir) },
        { libelle: 'Prélèvements sociaux (17,2 %)', valeur: euros(r.micro.ps) },
        { libelle: 'Total', valeur: euros(r.micro.impot), fort: true },
      ],
    });
    const lignesReel: LigneResultat[] = [
      {
        libelle: 'Résultat foncier',
        valeur: euros(r.reel.resultat),
        detail: `${euros(n(v, 'loyers'))} − ${euros(charges)} de charges − ${n(v, 'locaux')} × 20 €`,
      },
    ];
    if (r.reel.resultat >= 0) {
      lignesReel.push(
        { libelle: `Impôt sur le revenu (${nombre(n(v, 'tmi'))} %)`, valeur: euros(r.reel.ir) },
        { libelle: 'Prélèvements sociaux (17,2 %)', valeur: euros(r.reel.ps) },
        { libelle: 'Total', valeur: euros(r.reel.impot), fort: true },
      );
    } else {
      lignesReel.push(
        {
          libelle: 'Déficit imputable sur le revenu global',
          valeur: euros(r.reel.deficitImputable),
          detail: `Plafond de ${euros(plafond, 0)}, charges hors intérêts`,
          fort: true,
        },
        { libelle: 'Déficit reportable sur 10 ans', valeur: euros(r.reel.deficitReportable) },
        { libelle: 'Économie d’impôt sur le revenu cette année', valeur: euros(r.reel.economieImpot) },
        { libelle: 'Impôt sur ces loyers', valeur: euros(0), fort: true },
      );
    }
    blocs.push({
      titre: 'Régime réel (déclaration 2044)',
      lignes: lignesReel,
      texte:
        r.reel.resultat < 0
          ? 'Condition : le bien doit rester loué nu jusqu’au 31 décembre de la troisième année suivant l’imputation, sinon l’avantage est repris.'
          : undefined,
    });
    const ecart = r.micro.impot - r.reel.impot;
    return {
      synthese: [
        { libelle: 'Micro-foncier', valeur: euros(r.micro.impot) },
        { libelle: 'Régime réel', valeur: euros(r.reel.impot) },
        {
          libelle: ecart >= 0 ? 'Gain du régime réel' : 'Gain du micro-foncier',
          valeur: euros(Math.abs(ecart)),
          ...(r.reel.deficitImputable > 0
            ? { detail: `+ ${euros(r.reel.deficitImputable, 0)} de déficit imputable` }
            : {}),
        },
      ],
      blocs,
    };
  },
};

// ---------------------------------------------------------------------------
// 7. Micro-BIC ou LMNP réel
// ---------------------------------------------------------------------------

const meuble: Simulateur = {
  id: 'micro-bic-ou-reel',
  titre: 'Micro-BIC ou LMNP au réel',
  resume: 'Impôt d’une location meublée non professionnelle dans chaque régime et amortissements reportés.',
  modules: ['2.7', '2.8'],
  formule: 'e7',
  groupes: [
    { id: 'recettes', titre: 'Recettes' },
    { id: 'charges', titre: 'Charges déductibles au réel (par an)' },
    { id: 'amort', titre: 'Amortissements' },
    { id: 'foyer', titre: 'Foyer fiscal' },
  ],
  champs: [
    eur('recettes', 'Loyers annuels (recettes)', 9_000, 'recettes'),
    {
      type: 'choix',
      id: 'type',
      libelle: 'Type de location meublée',
      options: [
        { valeur: 'longue-duree', libelle: 'Longue durée (résidence principale, étudiant, mobilité)' },
        { valeur: 'tourisme-classe', libelle: 'Meublé de tourisme classé ou chambre d’hôtes' },
        { valeur: 'tourisme-non-classe', libelle: 'Meublé de tourisme non classé' },
      ],
      defaut: 'longue-duree',
      groupe: 'recettes',
    },
    eur('taxeFonciere', 'Taxe foncière', 900, 'charges'),
    eur('copro', 'Charges de copropriété non récupérables', 400, 'charges'),
    eur('assurances', 'Assurances (PNO, loyers impayés)', 150, 'charges'),
    eur('entretien', 'Entretien', 300, 'charges'),
    eur('interets', 'Intérêts d’emprunt et assurance emprunteur', 3_800, 'charges'),
    eur('comptabilite', 'Expert-comptable', 500, 'charges'),
    eur('autres', 'Autres charges (CFE, gestion…)', 0, 'charges'),
    eur('prix', 'Prix d’acquisition du bien', 150_000, 'amort'),
    pct('terrain', 'Part du terrain (non amortissable)', 15, 'amort', {
      aide: 'Souvent 10 à 20 % du prix selon la localisation.',
    }),
    ans('dureeBati', 'Durée moyenne d’amortissement du bâti', 30, 'amort', 80),
    eur('mobilier', 'Mobilier et équipements', 5_000, 'amort'),
    ans('dureeMobilier', 'Durée d’amortissement du mobilier', 7, 'amort', 20),
    eur('travaux', 'Travaux d’amélioration', 0, 'amort'),
    ans('dureeTravaux', 'Durée d’amortissement des travaux', 10, 'amort', 50),
    eur('differes', 'Amortissements reportés des années précédentes', 0, 'amort'),
    tmi('foyer'),
  ],
  calculer(v) {
    const charges = ['taxeFonciere', 'copro', 'assurances', 'entretien', 'interets', 'comptabilite', 'autres'].reduce(
      (t, k) => t + n(v, k),
      0,
    );
    const r = C.comparatifMeuble({
      recettes: n(v, 'recettes'),
      typeMeuble: s(v, 'type') as C.TypeMeuble,
      charges,
      prix: n(v, 'prix'),
      partTerrain: taux(v, 'terrain'),
      dureeBati: n(v, 'dureeBati'),
      mobilier: n(v, 'mobilier'),
      dureeMobilier: n(v, 'dureeMobilier'),
      travaux: n(v, 'travaux'),
      dureeTravaux: n(v, 'dureeTravaux'),
      amortissementsDifferes: n(v, 'differes'),
      tmi: taux(v, 'tmi'),
    });
    const blocs: BlocResultat[] = [];
    if (!r.micro.eligible) {
      blocs.push({
        titre: 'Micro-BIC',
        alerte: {
          genre: 'attention',
          texte: `Recettes supérieures au plafond du micro-BIC (${euros(r.micro.plafond, 0)}) : le régime réel s’impose.`,
        },
      });
    }
    blocs.push({
      titre: `Micro-BIC (abattement de ${nombre(r.micro.abattement * 100)} %, minimum 305 €)`,
      lignes: [
        { libelle: 'Abattement', valeur: euros(r.micro.abattementEffectif) },
        { libelle: 'Base imposable', valeur: euros(r.micro.base) },
        { libelle: `Impôt sur le revenu (${nombre(n(v, 'tmi'))} %)`, valeur: euros(r.micro.ir) },
        { libelle: 'Prélèvements sociaux (18,6 %)', valeur: euros(r.micro.ps) },
        { libelle: 'Total', valeur: euros(r.micro.impot), fort: true },
      ],
    });
    blocs.push({
      titre: 'LMNP au régime réel',
      lignes: [
        {
          libelle: 'Résultat avant amortissements',
          valeur: euros(r.reel.resultatAvantAmortissement),
          detail: `${euros(n(v, 'recettes'))} − ${euros(charges)} de charges`,
        },
        {
          libelle: 'Amortissement du bâti',
          valeur: euros(r.reel.amortBati),
          detail: `${euros(n(v, 'prix'))} × ${nombre(100 - n(v, 'terrain'), 0, 2)} % / ${n(v, 'dureeBati')} ans`,
        },
        { libelle: 'Amortissement du mobilier', valeur: euros(r.reel.amortMobilier) },
        { libelle: 'Amortissement des travaux', valeur: euros(r.reel.amortTravaux) },
        { libelle: 'Amortissements disponibles (avec reports)', valeur: euros(r.reel.amortissementsDisponibles) },
        { libelle: 'Amortissements utilisés', valeur: euros(r.reel.amortissementsUtilises) },
        {
          libelle: 'Amortissements reportés sans limite de durée',
          valeur: euros(r.reel.amortissementsReportes),
          fort: true,
        },
        { libelle: 'Base imposable', valeur: euros(r.reel.base) },
        { libelle: 'Impôt et prélèvements sociaux', valeur: euros(r.reel.impot), fort: true },
      ],
      texte:
        r.reel.deficitReportable > 0
          ? `Les charges dépassent les recettes : ce déficit de ${euros(r.reel.deficitReportable)} ne s’impute que sur des bénéfices de location meublée non professionnelle des dix années suivantes, jamais sur le revenu global.`
          : 'L’amortissement ne peut ni créer ni augmenter un déficit : la fraction non utilisée est reportée.',
    });
    blocs.push({
      titre: 'À la revente',
      alerte: {
        genre: 'info',
        texte:
          'Pour les cessions depuis le 15 février 2025, les amortissements déduits en LMNP (hors résidences services) minorent le prix d’acquisition et augmentent la plus-value.',
      },
    });
    if (n(v, 'recettes') > 23_000) {
      blocs.push({
        titre: 'Statut',
        alerte: {
          genre: 'info',
          texte:
            'Au-delà de 23 000 € de recettes, vérifiez le statut : le loueur est professionnel (LMP) si ces recettes excèdent aussi les autres revenus d’activité du foyer.',
        },
      });
    }
    return {
      synthese: [
        { libelle: 'Micro-BIC', valeur: euros(r.micro.impot) },
        {
          libelle: 'LMNP au réel',
          valeur: euros(r.reel.impot),
          detail: `${euros(r.reel.amortissementsReportes)} d’amortissements reportés`,
        },
      ],
      blocs,
    };
  },
};

// ---------------------------------------------------------------------------
// 8. Dispositif Jeanbrun
// ---------------------------------------------------------------------------

const jeanbrun: Simulateur = {
  id: 'jeanbrun',
  titre: 'Dispositif Jeanbrun',
  resume: 'Base amortissable, déduction annuelle et total sur l’engagement de neuf ans.',
  modules: ['3.4'],
  formule: 'e8',
  groupes: [{ id: 'bien', titre: 'Logement et location' }],
  champs: [
    eur('prix', 'Prix d’acquisition hors frais', 200_000, 'bien'),
    eur('travaux', 'Montant des travaux (ancien)', 0, 'bien'),
    {
      type: 'choix',
      id: 'etat',
      libelle: 'Logement',
      options: [
        { valeur: 'neuf', libelle: 'Neuf ou en VEFA' },
        { valeur: 'ancien', libelle: 'Ancien avec travaux' },
      ],
      defaut: 'neuf',
      groupe: 'bien',
    },
    {
      type: 'choix',
      id: 'regime',
      libelle: 'Type de location',
      options: [
        { valeur: 'intermediaire', libelle: 'Location intermédiaire' },
        { valeur: 'social', libelle: 'Location sociale' },
        { valeur: 'tres_social', libelle: 'Location très sociale' },
      ],
      defaut: 'intermediaire',
      groupe: 'bien',
    },
    {
      type: 'choix',
      id: 'plafond',
      libelle: 'Plafond annuel du foyer',
      options: [
        { valeur: '8000', libelle: '8 000 € (cas général)' },
        { valeur: '10000', libelle: '10 000 € (au moins 50 % des loyers en location sociale)' },
        { valeur: '12000', libelle: '12 000 € (au moins 50 % des loyers en location très sociale)' },
      ],
      defaut: '8000',
      groupe: 'bien',
    },
  ],
  calculer(v) {
    const neuf = s(v, 'etat') === 'neuf';
    const r = C.jeanbrunDetaille({
      prix: n(v, 'prix'),
      travaux: neuf ? 0 : n(v, 'travaux'),
      neuf,
      regime: s(v, 'regime') as C.RegimeJeanbrun,
      plafond: n(v, 'plafond'),
    });
    const blocs: BlocResultat[] = [
      {
        titre: 'Calcul',
        lignes: [
          {
            libelle: 'Base amortissable',
            valeur: euros(r.base, 0),
            detail: neuf
              ? `80 % × ${euros(n(v, 'prix'), 0)} (20 % réputés correspondre au terrain)`
              : `80 % × (${euros(n(v, 'prix'), 0)} + ${euros(n(v, 'travaux'), 0)} de travaux)`,
          },
          { libelle: 'Taux annuel', valeur: pourcent(r.taux, 1) },
          { libelle: 'Déduction théorique', valeur: euros(r.deductionTheorique, 0) },
          {
            libelle: 'Déduction annuelle retenue',
            valeur: euros(r.deduction, 0),
            detail: r.plafonnee ? `Limitée au plafond de ${euros(n(v, 'plafond'), 0)}` : undefined,
            fort: true,
          },
          {
            libelle: 'Total sur les neuf ans d’engagement',
            valeur: euros(r.total9Ans, 0),
            detail: 'Plafonné à la base amortissable',
          },
        ],
        texte:
          'La déduction s’impute sur les revenus fonciers (location nue au régime réel) ; les charges restent déductibles.',
      },
      {
        titre: 'Conditions principales',
        texte:
          'Logement acquis entre le 21 février 2026 et le 31 décembre 2028, situé dans un bâtiment d’habitation collectif, loué nu à titre de résidence principale pendant au moins neuf ans, avec loyers et ressources du locataire plafonnés. Les amortissements déduits sont réintégrés dans le calcul de la plus-value à la revente.',
      },
    ];
    if (!neuf) {
      blocs.push({
        titre: 'Travaux dans l’ancien',
        alerte: r.seuilTravauxAtteint
          ? {
              genre: 'info',
              texte: `Travaux égaux à ${pourcent(r.partTravaux, 1)} du prix : le seuil de 30 % est atteint (réhabilitation lourde conduisant à une classe A ou B exigée).`,
            }
          : {
              genre: 'attention',
              texte: `Travaux égaux à ${pourcent(r.partTravaux, 1)} du prix : le seuil de 30 % n’est pas atteint.`,
            },
      });
      blocs.push({
        titre: 'Projet de loi',
        alerte: {
          genre: 'surveiller',
          texte:
            'Le projet de loi relance logement prévoit d’abaisser le seuil à 20 % et d’exiger au moins la classe D. Tant qu’il n’est pas promulgué, les règles de la loi de finances pour 2026 s’appliquent.',
        },
      });
    }
    return {
      synthese: [
        { libelle: 'Base amortissable', valeur: euros(r.base, 0) },
        { libelle: 'Déduction annuelle', valeur: euros(r.deduction, 0) },
        { libelle: 'Total sur neuf ans', valeur: euros(r.total9Ans, 0) },
      ],
      blocs,
    };
  },
};

// ---------------------------------------------------------------------------
// 9. Plus-value
// ---------------------------------------------------------------------------

const plusValue: Simulateur = {
  id: 'plus-value',
  titre: 'Plus-value immobilière',
  resume: 'Plus-value brute, abattements pour durée de détention, impôt, prélèvements sociaux et surtaxe.',
  modules: ['3.5', '2.7'],
  formule: 'e9',
  groupes: [
    { id: 'achat', titre: 'Acquisition' },
    { id: 'vente', titre: 'Cession' },
  ],
  champs: [
    eur('prixAchat', 'Prix d’achat', 100_000, 'achat'),
    { type: 'date', id: 'dateAchat', libelle: 'Date d’achat', defaut: '2011-03-15', groupe: 'achat' },
    eur('fraisReels', 'Frais d’acquisition réels', 0, 'achat', {
      aide: 'Le forfait de 7,5 % s’applique s’il est plus élevé.',
    }),
    eur('travauxReels', 'Travaux réels non déduits (facturés par des entreprises)', 0, 'achat', {
      aide: 'Forfait de 15 % après 5 ans de détention s’il est plus élevé.',
    }),
    eur('amortissements', 'Amortissements déduits (LMNP hors résidences services, Jeanbrun)', 0, 'achat'),
    eur('prixVente', 'Prix de vente', 180_000, 'vente'),
    { type: 'date', id: 'dateVente', libelle: 'Date de vente', defaut: '2026-10-15', groupe: 'vente' },
    eur('fraisCession', 'Frais de cession (diagnostics, mainlevée, commission à la charge du vendeur…)', 0, 'vente'),
  ],
  controler: (v) =>
    s(v, 'dateVente') < s(v, 'dateAchat')
      ? [{ champ: 'dateVente', message: 'La date de vente doit suivre la date d’achat.' }]
      : [],
  calculer(v) {
    const r = C.plusValueDetaillee({
      prixAchat: n(v, 'prixAchat'),
      dateAchat: s(v, 'dateAchat'),
      fraisReels: n(v, 'fraisReels'),
      travauxReels: n(v, 'travauxReels'),
      prixVente: n(v, 'prixVente'),
      dateVente: s(v, 'dateVente'),
      fraisCession: n(v, 'fraisCession'),
      amortissements: n(v, 'amortissements'),
    });
    const blocs: BlocResultat[] = [
      {
        titre: 'Plus-value brute',
        lignes: [
          {
            libelle: 'Durée de détention',
            valeur: `${r.annees} année${r.annees > 1 ? 's' : ''} pleine${r.annees > 1 ? 's' : ''}`,
          },
          { libelle: 'Prix de cession retenu', valeur: euros(r.prixCessionNet) },
          { libelle: 'Prix d’achat', valeur: euros(n(v, 'prixAchat')) },
          {
            libelle: 'Frais d’acquisition',
            valeur: euros(r.fraisRetenus),
            detail: r.fraisForfait ? 'Forfait de 7,5 %' : 'Frais réels',
          },
          {
            libelle: 'Travaux',
            valeur: euros(r.travauxRetenus),
            detail: r.travauxForfait ? 'Forfait de 15 % (plus de 5 ans de détention)' : 'Travaux réels',
          },
          ...(n(v, 'amortissements') > 0
            ? [{ libelle: 'Amortissements déduits', valeur: euros(-n(v, 'amortissements')) }]
            : []),
          { libelle: 'Prix d’acquisition majoré', valeur: euros(r.prixAcquisitionMajore) },
          { libelle: 'Plus-value brute', valeur: euros(r.plus_value), fort: true },
        ],
      },
      {
        titre: 'Impôt sur le revenu (19 %)',
        lignes: [
          { libelle: 'Abattement pour durée de détention', valeur: pourcent(r.abattementIr, 2) },
          { libelle: 'Base imposable', valeur: euros(r.baseIr) },
          { libelle: 'Impôt sur le revenu', valeur: euros(r.ir), fort: true },
        ],
      },
      {
        titre: 'Prélèvements sociaux (17,2 %)',
        lignes: [
          { libelle: 'Abattement pour durée de détention', valeur: pourcent(r.abattementPs, 2) },
          { libelle: 'Base imposable', valeur: euros(r.basePs) },
          { libelle: 'Prélèvements sociaux', valeur: euros(r.ps), fort: true },
        ],
      },
      {
        titre: 'Surtaxe et total',
        lignes: [
          {
            libelle: 'Surtaxe',
            valeur: euros(r.surtaxe),
            detail:
              r.baseIr > 50_000
                ? 'Base imposable à l’impôt sur le revenu supérieure à 50 000 €'
                : 'Aucune : base inférieure ou égale à 50 000 €',
          },
          { libelle: 'Total dû', valeur: euros(r.total), fort: true },
        ],
        texte:
          'Exonérations non simulées : résidence principale, première cession sous conditions de remploi, prix de cession inférieur ou égal à 15 000 €, certains retraités et invalides, cessions à un organisme de logement social…',
      },
    ];
    return {
      synthese: [
        { libelle: 'Plus-value brute', valeur: euros(r.plus_value) },
        { libelle: 'Durée de détention', valeur: `${r.annees} ans` },
        { libelle: 'Impôt total', valeur: euros(r.total) },
      ],
      blocs,
    };
  },
};

// ---------------------------------------------------------------------------
// 10. IFI
// ---------------------------------------------------------------------------

const ifiSim: Simulateur = {
  id: 'ifi',
  titre: 'Impôt sur la fortune immobilière',
  resume: 'Patrimoine immobilier net taxable, barème, décote et IFI dû.',
  modules: ['3.6'],
  formule: 'e10',
  groupes: [{ id: 'patrimoine', titre: 'Patrimoine au 1er janvier' }],
  champs: [
    eur('actifs', 'Biens immobiliers taxables hors résidence principale', 1_320_000, 'patrimoine', {
      aide: 'Y compris parts de SCI et fraction immobilière des SCPI et OPCI.',
    }),
    eur('rp', 'Valeur de la résidence principale', 0, 'patrimoine', { aide: 'Abattement de 30 %.' }),
    eur('dettes', 'Dettes déductibles', 0, 'patrimoine', {
      aide: 'Emprunts d’acquisition et de travaux, taxe foncière de l’année…',
    }),
  ],
  calculer(v) {
    const r = C.ifiDetaille({ actifs: n(v, 'actifs'), residencePrincipale: n(v, 'rp'), dettes: n(v, 'dettes') });
    const blocs: BlocResultat[] = [
      {
        titre: 'Patrimoine net taxable',
        lignes: [
          { libelle: 'Biens hors résidence principale', valeur: euros(n(v, 'actifs'), 0) },
          { libelle: 'Résidence principale après abattement de 30 %', valeur: euros(0.7 * n(v, 'rp'), 0) },
          { libelle: 'Dettes déductibles', valeur: euros(-n(v, 'dettes'), 0) },
          { libelle: 'Patrimoine net taxable', valeur: euros(r.patrimoineNet, 0), fort: true },
        ],
      },
    ];
    if (!r.redevable) {
      blocs.push({
        titre: 'Seuil',
        alerte: { genre: 'info', texte: 'Patrimoine net taxable inférieur ou égal à 1 300 000 € : pas d’IFI.' },
      });
    } else {
      blocs.push({
        titre: 'Barème',
        tableau: {
          legende: 'Calcul de l’IFI par tranche',
          entetes: ['Tranche', 'Taux', 'Montant taxé', 'Impôt'],
          numeriques: [false, true, true, true],
          lignes: r.tranches.map((t) => [
            Number.isFinite(t.a) ? `De ${euros(t.de, 0)} à ${euros(t.a, 0)}` : `Au-delà de ${euros(t.de, 0)}`,
            pourcent(t.taux, 2),
            euros(t.assiette, 0),
            euros(t.montant),
          ]),
        },
        lignes: [
          { libelle: 'Impôt selon le barème', valeur: euros(r.impotBareme) },
          ...(r.decote > 0
            ? [{ libelle: 'Décote', valeur: euros(-r.decote), detail: '17 500 € − 1,25 % du patrimoine net taxable' }]
            : []),
          { libelle: 'IFI dû', valeur: euros(r.ifi), fort: true },
        ],
        texte:
          'Plafonnement non simulé : l’IFI, l’impôt sur le revenu et les prélèvements sociaux ne peuvent excéder 75 % des revenus de l’année précédente.',
      });
    }
    return {
      synthese: [
        { libelle: 'Patrimoine net taxable', valeur: euros(r.patrimoineNet, 0) },
        { libelle: 'IFI dû', valeur: euros(r.ifi) },
      ],
      blocs,
    };
  },
};

// ---------------------------------------------------------------------------
// 11. Frais d'acquisition
// ---------------------------------------------------------------------------

const frais: Simulateur = {
  id: 'frais-acquisition',
  titre: 'Frais d’acquisition',
  resume: 'Droits de mutation, émoluments du notaire et total estimé des « frais de notaire ».',
  modules: ['2.11'],
  formule: 'e11',
  groupes: [{ id: 'achat', titre: 'Achat' }],
  champs: [
    eur('prix', 'Prix du bien (hors mobilier)', 200_000, 'achat', {
      aide: 'Le mobilier vendu avec le bien, listé à l’acte, n’est pas soumis aux droits de mutation.',
    }),
    {
      type: 'choix',
      id: 'etat',
      libelle: 'Logement',
      options: [
        { valeur: 'ancien', libelle: 'Ancien' },
        { valeur: 'neuf', libelle: 'Neuf' },
      ],
      defaut: 'ancien',
      groupe: 'achat',
    },
    {
      type: 'choix',
      id: 'tauxDepartemental',
      libelle: 'Taxe départementale',
      options: [
        { valeur: '4.5', libelle: '4,50 % (quasi-totalité des départements)' },
        { valeur: '5', libelle: '5 % (actes du 1er avril 2025 au 31 mars 2028, sur délibération)' },
        { valeur: '3.8', libelle: '3,80 % (taux de droit commun)' },
      ],
      defaut: '4.5',
      groupe: 'achat',
      aide: 'Vérifiez le taux de votre département.',
    },
    eur('debours', 'Débours et formalités (estimation)', 1_000, 'achat', { aide: 'Environ 800 à 1 200 €.' }),
  ],
  calculer(v) {
    const r = C.fraisAcquisition({
      prix: n(v, 'prix'),
      neuf: s(v, 'etat') === 'neuf',
      tauxDepartemental: taux(v, 'tauxDepartemental'),
      debours: n(v, 'debours'),
    });
    if (r.neuf) {
      return {
        synthese: [
          {
            libelle: 'Frais estimés dans le neuf',
            valeur: `${euros(r.estimationBasse, 0)} à ${euros(r.estimationHaute, 0)}`,
          },
        ],
        blocs: [
          {
            titre: 'Logement neuf',
            texte: 'Dans le neuf, les frais de notaire sont réduits : environ 2 à 3 % du prix.',
          },
        ],
      };
    }
    return {
      synthese: [
        { libelle: 'Droits de mutation', valeur: euros(r.dmto) },
        { libelle: 'Émoluments du notaire (TTC)', valeur: euros(r.emolumentsTtc) },
        { libelle: 'Total estimé', valeur: euros(r.total, 0), detail: `${pourcent(r.partDuPrix)} du prix` },
      ],
      blocs: [
        {
          titre: 'Droits de mutation à titre onéreux (DMTO)',
          lignes: [
            {
              libelle: 'Taxe départementale',
              valeur: euros(r.taxeDepartementale),
              detail: `${nombre(n(v, 'tauxDepartemental'), 1, 2)} % du prix`,
            },
            {
              libelle: 'Frais d’assiette et de recouvrement',
              valeur: euros(r.fraisAssiette),
              detail: '2,37 % de la taxe départementale',
            },
            { libelle: 'Taxe communale', valeur: euros(r.taxeCommunale), detail: '1,20 % du prix' },
            { libelle: 'Total des droits de mutation', valeur: euros(r.dmto), fort: true },
          ],
        },
        {
          titre: 'Autres frais',
          lignes: [
            {
              libelle: 'Émoluments du notaire hors taxes',
              valeur: euros(r.emolumentsHt),
              detail: 'Barème réglementé dégressif, à vérifier',
            },
            { libelle: 'Émoluments du notaire TTC', valeur: euros(r.emolumentsTtc) },
            { libelle: 'Contribution de sécurité immobilière', valeur: euros(r.csi), detail: '0,10 % du prix' },
            { libelle: 'Débours et formalités', valeur: euros(r.debours) },
            { libelle: 'Total estimé', valeur: euros(r.total), fort: true },
          ],
        },
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 12. TRI d'un projet
// ---------------------------------------------------------------------------

function paramsProjet(v: Valeurs, levier = true): C.ParamsProjet {
  return {
    prix: n(v, 'prix'),
    fraisAcquisition: n(v, 'frais'),
    travaux: n(v, 'travaux'),
    mobilier: n(v, 'mobilier'),
    emprunt: levier ? n(v, 'emprunt') : 0,
    tauxCredit: taux(v, 'taux'),
    dureeCredit: n(v, 'duree'),
    tauxAssurance: taux(v, 'assurance'),
    loyersAnnuels: 12 * n(v, 'loyerLot') * n(v, 'lots'),
    croissanceLoyers: taux(v, 'croissanceLoyers'),
    chargesFixes: ['taxeFonciere', 'copro', 'pno', 'entretien', 'comptabilite'].reduce((t, k) => t + n(v, k), 0),
    tauxGli: taux(v, 'gli'),
    tauxVacance: taux(v, 'vacance'),
    croissanceCharges: taux(v, 'croissanceCharges'),
    croissancePrix: taux(v, 'croissancePrix'),
    horizon: n(v, 'horizon'),
    partTerrain: taux(v, 'terrain'),
    dureeAmortBati: n(v, 'dureeBati'),
    dureeAmortMobilier: n(v, 'dureeMobilier'),
    tmi: taux(v, 'tmi'),
  };
}

const triSim: Simulateur = {
  id: 'tri',
  titre: 'TRI d’un projet locatif',
  resume:
    'Taux de rendement interne des fonds propres avec et sans crédit, flux annuels et sensibilité (cas d’étude du module 3.2).',
  modules: ['3.2'],
  formule: 'e12',
  groupes: [
    { id: 'acq', titre: 'Acquisition' },
    { id: 'credit', titre: 'Financement' },
    { id: 'loyers', titre: 'Loyers' },
    { id: 'charges', titre: 'Charges non récupérables (année 1)' },
    { id: 'hyp', titre: 'Fiscalité (LMNP au réel) et revente' },
  ],
  champs: [
    eur('prix', 'Prix du bien', 160_000, 'acq'),
    eur('frais', 'Frais d’acquisition (déduits la première année)', 12_800, 'acq'),
    eur('travaux', 'Travaux', 20_000, 'acq'),
    eur('mobilier', 'Mobilier', 6_000, 'acq'),
    eur('emprunt', 'Montant emprunté', 180_000, 'credit'),
    pct('taux', 'Taux du crédit', 3.45, 'credit', { max: 20 }),
    ans('duree', 'Durée du crédit', 25, 'credit'),
    pct('assurance', 'Assurance emprunteur (du capital, par an)', 0.3, 'credit', { max: 5 }),
    eur('loyerLot', 'Loyer mensuel hors charges par chambre ou par lot', 450, 'loyers'),
    {
      type: 'nombre',
      id: 'lots',
      libelle: 'Nombre de chambres ou de lots',
      defaut: 3,
      min: 1,
      max: 50,
      entier: true,
      groupe: 'loyers',
    },
    pct('croissanceLoyers', 'Évolution des loyers par an', 1, 'loyers', { min: -10, max: 20 }),
    eur('taxeFonciere', 'Taxe foncière', 1_300, 'charges'),
    eur('copro', 'Copropriété non récupérable', 600, 'charges'),
    eur('pno', 'Assurance PNO', 200, 'charges'),
    eur('entretien', 'Entretien', 800, 'charges'),
    eur('comptabilite', 'Comptabilité', 400, 'charges'),
    pct('gli', 'Assurance loyers impayés (en % des loyers)', 3, 'charges', { max: 20 }),
    pct('vacance', 'Provision de vacance (en % des loyers)', 5, 'charges', { max: 50 }),
    pct('croissanceCharges', 'Évolution des charges par an', 2, 'charges', { min: -10, max: 20 }),
    tmi('hyp'),
    pct('terrain', 'Part du terrain (non amortissable)', 15, 'hyp'),
    ans('dureeBati', 'Durée d’amortissement du bâti et des travaux', 30, 'hyp', 80),
    ans('dureeMobilier', 'Durée d’amortissement du mobilier', 7, 'hyp', 20),
    pct('croissancePrix', 'Évolution du prix du bien par an', 1, 'hyp', { min: -10, max: 20 }),
    ans('horizon', 'Revente au bout de', 15, 'hyp', 30),
  ],
  calculer(v) {
    const p = paramsProjet(v);
    const r = C.simulerProjet(p);
    const sansLevier = C.simulerProjet(paramsProjet(v, false));
    const variantes: [string, Partial<C.ParamsProjet>][] = [
      ['Scénario de base', {}],
      [
        `Vacance de ${nombre(2 * n(v, 'vacance'), 0, 2)} % au lieu de ${nombre(n(v, 'vacance'), 0, 2)} %`,
        { tauxVacance: 2 * p.tauxVacance },
      ],
      [
        `Taux du crédit de ${nombre(n(v, 'taux') + 0.75, 2)} % au lieu de ${nombre(n(v, 'taux'), 2)} %`,
        { tauxCredit: p.tauxCredit + 0.0075 },
      ],
      ['Prix de revente stable (0 % par an)', { croissancePrix: 0 }],
      ['Prix de revente en baisse de 1 % par an', { croissancePrix: -0.01 }],
      [
        `Loyer de ${euros(n(v, 'loyerLot') - 30, 0)} par chambre ou lot au lieu de ${euros(n(v, 'loyerLot'), 0)}`,
        { loyersAnnuels: 12 * (n(v, 'loyerLot') - 30) * n(v, 'lots') },
      ],
    ];
    const sensibilite = variantes.map(([libelle, delta]) => {
      const x = C.simulerProjet({ ...p, ...delta });
      return [libelle, pourcent(x.tri, 1), signe(x.annees[0]?.cashFlow ?? 0, 0)];
    });
    return {
      synthese: [
        { libelle: 'TRI des fonds propres avec crédit', valeur: pourcent(r.tri, 1) },
        { libelle: 'TRI sans crédit (achat comptant)', valeur: pourcent(sansLevier.tri, 1) },
        { libelle: 'Cash-flow après impôt, année 1', valeur: signe(r.annees[0]?.cashFlow ?? 0, 0) },
      ],
      blocs: [
        {
          titre: 'Montage',
          lignes: [
            { libelle: 'Coût total', valeur: euros(r.coutTotal, 0) },
            { libelle: 'Apport', valeur: euros(r.apport, 0) },
            { libelle: 'Mensualité du crédit', valeur: euros(r.mensualite) },
            { libelle: 'Assurance emprunteur', valeur: euros(r.assuranceMensuelle) },
            { libelle: 'Loyers annuels, année 1', valeur: euros(p.loyersAnnuels, 0) },
            {
              libelle: 'Charges annuelles, année 1',
              valeur: euros(r.chargesAnnee1, 0),
              detail: 'Charges fixes + assurance loyers impayés + provision de vacance',
            },
          ],
        },
        {
          titre: 'Flux annuels',
          tableau: {
            legende: 'Flux annuels du projet',
            entetes: ['Année', 'Loyers', 'Charges', 'Intérêts', 'Résultat imposable', 'Impôt', 'Cash-flow après impôt'],
            numeriques: [true, true, true, true, true, true, true],
            lignes: r.annees.map((a) => [
              String(a.annee),
              eurosArrondis(a.loyers),
              eurosArrondis(a.charges),
              eurosArrondis(a.interets),
              eurosArrondis(a.resultatImposable),
              eurosArrondis(a.impot),
              signe(a.cashFlow, 0),
            ]),
          },
          lignes: [{ libelle: 'Cash-flows cumulés sur la période', valeur: signe(r.cashFlowsCumules, 0) }],
        },
        {
          titre: `Revente au bout de ${p.horizon} ans`,
          lignes: [
            { libelle: 'Prix de revente estimé', valeur: euros(r.prixRevente, 0) },
            { libelle: 'Amortissements du bâti déduits (réintégrés)', valeur: euros(r.amortissementsBati, 0) },
            { libelle: 'Plus-value imposable avant abattements', valeur: euros(r.plusValue.plus_value, 0) },
            { libelle: 'Impôt sur la plus-value', valeur: euros(r.plusValue.total, 0) },
            { libelle: 'Capital restant dû', valeur: euros(r.capitalRestantDu, 0) },
            { libelle: 'Produit net pour l’investisseur', valeur: euros(r.produitNetRevente, 0), fort: true },
          ],
        },
        {
          titre: 'Sensibilité',
          tableau: {
            legende: 'Sensibilité du TRI aux hypothèses',
            entetes: ['Variation par rapport au scénario de base', 'TRI des fonds propres', 'Cash-flow année 1'],
            numeriques: [false, true, true],
            lignes: sensibilite,
          },
        },
        {
          titre: 'Hypothèses',
          alerte: {
            genre: 'attention',
            texte:
              'Ces résultats reposent sur des hypothèses simplificatrices (amortissement moyen, fiscalité constante, absence de gros travaux imprévus, pas de réforme). Ils illustrent une méthode, pas une promesse de rendement. Le levier amplifie aussi les pertes.',
          },
        },
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 13. Donation
// ---------------------------------------------------------------------------

const donation: Simulateur = {
  id: 'donation',
  titre: 'Droits de donation en ligne directe',
  resume: 'Valeur taxable en pleine ou nue-propriété, abattement et droits selon le barème.',
  modules: ['3.7'],
  formule: 'e13',
  groupes: [{ id: 'don', titre: 'Donation d’un parent à un enfant' }],
  champs: [
    eur('valeur', 'Valeur du bien en pleine propriété', 300_000, 'don'),
    {
      type: 'choix',
      id: 'nature',
      libelle: 'Ce qui est donné',
      options: [
        { valeur: 'nue', libelle: 'La nue-propriété (le donateur garde l’usufruit)' },
        { valeur: 'pleine', libelle: 'La pleine propriété' },
      ],
      defaut: 'nue',
      groupe: 'don',
    },
    {
      type: 'nombre',
      id: 'age',
      libelle: 'Âge de l’usufruitier',
      unite: 'ans',
      defaut: 65,
      min: 0,
      max: 120,
      entier: true,
      groupe: 'don',
    },
    eur('abattement', 'Abattement disponible', 100_000, 'don', {
      aide: '100 000 € par parent et par enfant, reconstitué tous les quinze ans.',
    }),
  ],
  calculer(v) {
    const nue = s(v, 'nature') === 'nue';
    const r = C.donation({
      valeur: n(v, 'valeur'),
      nuePropriete: nue,
      ageUsufruitier: n(v, 'age'),
      abattement: n(v, 'abattement'),
    });
    const blocs: BlocResultat[] = [
      {
        titre: 'Valeur taxable',
        lignes: [
          {
            libelle: nue ? 'Valeur de la nue-propriété' : 'Pleine propriété',
            valeur: pourcent(r.coefficient, 0),
            detail: nue ? `Usufruitier de ${n(v, 'age')} ans (article 669 du CGI)` : undefined,
          },
          { libelle: 'Valeur taxable', valeur: euros(r.valeurTaxable, 0) },
          { libelle: 'Abattement', valeur: euros(-Math.min(n(v, 'abattement'), r.valeurTaxable), 0) },
          { libelle: 'Base taxable', valeur: euros(r.base, 0), fort: true },
        ],
      },
      {
        titre: 'Droits',
        tableau: {
          legende: 'Droits par tranche du barème en ligne directe',
          entetes: ['Tranche', 'Taux', 'Montant taxé', 'Droits'],
          numeriques: [false, true, true, true],
          lignes: r.tranches.map((t) => [
            Number.isFinite(t.a) ? `De ${euros(t.de, 0)} à ${euros(t.a, 0)}` : `Au-delà de ${euros(t.de, 0)}`,
            pourcent(t.taux, 0),
            euros(t.assiette, 0),
            euros(t.montant),
          ]),
        },
        lignes: [
          { libelle: 'Droits de donation', valeur: euros(r.droits), fort: true },
          ...(nue
            ? [{ libelle: 'Pour comparaison, en pleine propriété', valeur: euros(r.droitsPleinePropriete) }]
            : []),
        ],
        texte: nue
          ? 'Au décès de l’usufruitier, le donataire devient plein propriétaire sans droits supplémentaires.'
          : undefined,
      },
    ];
    return {
      synthese: [
        { libelle: 'Valeur taxable', valeur: euros(r.valeurTaxable, 0) },
        { libelle: 'Droits de donation', valeur: euros(r.droits) },
      ],
      blocs,
    };
  },
};

// ---------------------------------------------------------------------------
// 14. Dates de congé
// ---------------------------------------------------------------------------

const conge: Simulateur = {
  id: 'dates-de-conge',
  titre: 'Dates de congé',
  resume: 'Date limite du congé donné par le bailleur et fin du préavis du locataire.',
  modules: ['1.11'],
  formule: 'e14',
  groupes: [
    { id: 'bail', titre: 'Bail' },
    { id: 'locataire', titre: 'Congé du locataire' },
  ],
  champs: [
    {
      type: 'choix',
      id: 'type',
      libelle: 'Type de bail',
      options: [
        { valeur: 'vide', libelle: 'Location vide' },
        { valeur: 'meuble', libelle: 'Location meublée' },
      ],
      defaut: 'vide',
      groupe: 'bail',
    },
    { type: 'date', id: 'echeance', libelle: 'Date d’échéance du bail', defaut: '2027-06-30', groupe: 'bail' },
    {
      type: 'date',
      id: 'reception',
      libelle: 'Date de réception du congé du locataire',
      defaut: '2026-09-24',
      groupe: 'locataire',
    },
    {
      type: 'case',
      id: 'reduit',
      libelle: 'Préavis réduit à un mois (zone tendue ou cas prévu par la loi)',
      defaut: false,
      groupe: 'locataire',
      aide: 'Location vide uniquement ; le motif doit être précisé et justifié dans le congé. En meublé, le préavis est toujours d’un mois.',
    },
  ],
  calculer(v) {
    const vide = s(v, 'type') === 'vide';
    const preavis = vide && !b(v, 'reduit') ? 3 : 1;
    const r = C.datesConge({
      dateEcheance: s(v, 'echeance'),
      typeBail: vide ? 'vide' : 'meuble',
      dateReceptionConge: s(v, 'reception'),
      preavisLocataireMois: preavis,
    });
    return {
      synthese: [
        { libelle: 'Congé du bailleur à recevoir au plus tard le', valeur: dateFr(r.dateLimiteBailleur) },
        { libelle: 'Fin du préavis du locataire', valeur: dateFr(r.finPreavisLocataire) },
      ],
      blocs: [
        {
          titre: 'Congé donné par le bailleur',
          lignes: [
            { libelle: 'Délai minimal avant l’échéance', valeur: `${r.delaiBailleurMois} mois` },
            { libelle: 'Date limite de réception du congé', valeur: dateFr(r.dateLimiteBailleur), fort: true },
          ],
          texte:
            'Trois motifs seulement : reprise pour habiter, vente (droit de préemption du locataire en location vide) ou motif légitime et sérieux. Le congé pour vente ou pour reprise est accompagné d’une notice d’information. Protection particulière des locataires de plus de 65 ans aux ressources modestes.',
        },
        {
          titre: 'Congé donné par le locataire',
          lignes: [
            { libelle: 'Réception du congé', valeur: dateFr(s(v, 'reception')) },
            { libelle: 'Préavis', valeur: `${preavis} mois` },
            { libelle: 'Fin du préavis', valeur: dateFr(r.finPreavisLocataire), fort: true },
          ],
          texte:
            'Le loyer reste dû jusqu’à la fin du préavis, sauf si un nouveau locataire entre plus tôt avec l’accord du bailleur.',
        },
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// Outils ajoutés en version 005 (règles des modules cités ; calculs dans calculs-outils.ts)
// ---------------------------------------------------------------------------

const dpeLocation: Simulateur = {
  id: 'dpe-location',
  titre: 'Mon logement est-il encore louable ? (DPE)',
  resume: 'Décence énergétique selon la classe DPE, dates d’interdiction de louer, gel du loyer et audit à la vente.',
  modules: ['1.4', '1.5', '3.9'],
  methode: [
    'Métropole : logements G non décents depuis le 1er janvier 2025, F à partir du 1er janvier 2028, E à partir du 1er janvier 2034.',
    'Outre-mer : G non décent à partir du 1er janvier 2028, F à partir du 1er janvier 2031.',
    'Le critère s’applique aux nouveaux baux, aux renouvellements et aux reconductions tacites intervenus après chaque échéance.',
    'Logements F et G : loyer gelé (révision, relocation, renouvellement) depuis le 24 août 2022 en métropole, le 1er juillet 2024 outre-mer.',
  ],
  groupes: [{ id: 'logement', titre: 'Logement' }],
  champs: [
    {
      type: 'choix',
      id: 'classe',
      libelle: 'Classe DPE du logement',
      options: CLASSES_DPE,
      defaut: 'F',
      groupe: 'logement',
    },
    {
      type: 'choix',
      id: 'territoire',
      libelle: 'Situation',
      options: [
        { valeur: 'metropole', libelle: 'Métropole' },
        { valeur: 'outre-mer', libelle: 'Outre-mer' },
      ],
      defaut: 'metropole',
      groupe: 'logement',
    },
    {
      type: 'date',
      id: 'dateBail',
      libelle: 'Date du bail, du renouvellement ou de la reconduction',
      defaut: '2026-09-24',
      groupe: 'logement',
    },
  ],
  controler: (v) =>
    s(v, 'dateBail') < '2025-01-01'
      ? [{ champ: 'dateBail', message: 'Saisissez une date à partir du 1er janvier 2025.' }]
      : [],
  calculer(v) {
    const classe = s(v, 'classe') as O.ClasseDpe;
    const territoire = s(v, 'territoire') as O.Territoire;
    const d = O.diagnosticDpe(classe, territoire, s(v, 'dateBail'));
    const blocs: BlocResultat[] = [
      {
        titre: 'Décence énergétique',
        lignes: [
          { libelle: 'Logement décent à cette date', valeur: d.decent ? 'Oui' : 'Non', fort: true },
          {
            libelle: 'Non décent à partir du',
            valeur: d.nonDecentDepuis ? dateFr(d.nonDecentDepuis) : 'Aucune échéance prévue',
          },
        ],
        alerte: d.decent
          ? d.nonDecentDepuis
            ? {
                genre: 'surveiller',
                texte: `À partir du ${dateFr(d.nonDecentDepuis)}, un nouveau bail, un renouvellement ou une reconduction ne sera plus possible sans travaux.`,
              }
            : undefined
          : {
              genre: 'attention',
              texte:
                'Nouveau bail, renouvellement ou reconduction impossibles : le logement doit d’abord gagner au moins une classe. Un bail en cours n’est pas anéanti, mais le locataire peut exiger la mise en conformité.',
            },
      },
      {
        titre: 'Loyer',
        lignes: [
          {
            libelle: 'Gel du loyer (révision, relocation, renouvellement)',
            valeur: d.loyerGele ? 'Oui' : 'Non',
            detail: d.loyerGele ? `Classe ${classe} : aucune hausse possible` : undefined,
          },
          {
            libelle: 'Mention « logement à consommation énergétique excessive » dans l’annonce',
            valeur: d.mentionExcessive ? 'Obligatoire' : 'Non',
          },
        ],
      },
      {
        titre: 'Vente',
        lignes: [
          {
            libelle: 'Audit énergétique (maison ou immeuble en monopropriété)',
            valeur: d.auditVenteDepuis ? `Obligatoire depuis le ${dateFr(d.auditVenteDepuis)}` : 'Non requis',
          },
        ],
      },
    ];
    return {
      synthese: [
        { libelle: 'Louable à cette date', valeur: d.decent ? 'Oui' : 'Non' },
        { libelle: 'Échéance', valeur: d.nonDecentDepuis ? dateFr(d.nonDecentDepuis) : 'Aucune' },
        { libelle: 'Loyer gelé', valeur: d.loyerGele ? 'Oui' : 'Non' },
      ],
      blocs,
    };
  },
};

const regularisation: Simulateur = {
  id: 'regularisation-charges',
  titre: 'Régularisation des charges locatives',
  resume:
    'Provisions versées comparées aux dépenses récupérables réelles : complément dû ou trop-perçu, nouvelle provision.',
  modules: ['2.2'],
  methode: [
    'Provisions de l’année = provision mensuelle × nombre de mois.',
    'Solde = dépenses récupérables réelles − provisions : complément dû par le locataire s’il est positif, remboursement s’il est négatif.',
    'Nouvelle provision mensuelle = dépenses réelles ÷ 12.',
    'Décompte par nature de charges communiqué un mois avant ; justificatifs tenus à disposition pendant six mois ; prescription de trois ans.',
  ],
  groupes: [{ id: 'charges', titre: 'Charges de l’année' }],
  champs: [
    eur('provision', 'Provision mensuelle sur charges', 50, 'charges'),
    {
      type: 'nombre',
      id: 'mois',
      libelle: 'Nombre de mois de provisions',
      unite: 'mois',
      defaut: 12,
      min: 1,
      max: 12,
      entier: true,
      groupe: 'charges',
    },
    eur('depenses', 'Dépenses récupérables réelles de l’année', 672, 'charges', {
      aide: 'Seules les charges du décret n° 87-713 sont récupérables (ni taxe foncière hors ordures ménagères, ni honoraires du syndic).',
    }),
    {
      type: 'case',
      id: 'tardive',
      libelle: 'Régularisation faite après la fin de l’année civile suivant l’année concernée',
      defaut: false,
      groupe: 'charges',
    },
  ],
  calculer(v) {
    const r = O.regularisationCharges(n(v, 'provision'), n(v, 'mois'), n(v, 'depenses'));
    const du = r.solde > 0;
    const blocs: BlocResultat[] = [
      {
        titre: 'Régularisation',
        lignes: [
          {
            libelle: 'Provisions versées',
            valeur: euros(r.provisionsAnnuelles),
            detail: `${euros(n(v, 'provision'))} × ${n(v, 'mois')} mois`,
          },
          { libelle: 'Dépenses récupérables réelles', valeur: euros(n(v, 'depenses')) },
          {
            libelle: du
              ? 'Complément dû par le locataire'
              : r.solde < 0
                ? 'Trop-perçu à rembourser au locataire'
                : 'Solde',
            valeur: euros(Math.abs(r.solde)),
            fort: true,
          },
          { libelle: 'Nouvelle provision mensuelle conseillée', valeur: euros(r.provisionMensuelleAjustee) },
        ],
      },
    ];
    if (b(v, 'tardive') && du) {
      blocs.push({
        titre: 'Régularisation tardive',
        alerte: { genre: 'attention', texte: 'Le locataire peut exiger un paiement échelonné sur douze mois.' },
      });
    }
    return {
      synthese: [
        { libelle: du ? 'Complément dû' : 'À rembourser', valeur: euros(Math.abs(r.solde)) },
        { libelle: 'Nouvelle provision', valeur: euros(r.provisionMensuelleAjustee) },
      ],
      blocs,
    };
  },
};

const tourisme: Simulateur = {
  id: 'meuble-de-tourisme',
  titre: 'Location courte durée (type Airbnb) ou meublé classique',
  resume:
    'Recettes, charges et revenu net d’un meublé de tourisme comparés à une location meublée à l’année, micro-BIC compris.',
  modules: ['3.8'],
  methode: [
    'Nuits louées = 365 × taux d’occupation ; recettes = nuits × prix par nuit.',
    'Charges = commissions et conciergerie (en % des recettes) + autres charges annuelles.',
    'Micro-BIC (revenus 2026) : meublé de tourisme classé ou location meublée de longue durée, plafond 83 600 € et abattement de 50 % ; meublé de tourisme non classé, plafond 15 000 € et abattement de 30 %.',
    'Résidence principale : location touristique limitée à 120 jours par an (la commune peut abaisser à 90).',
  ],
  groupes: [
    { id: 'tourisme', titre: 'Location de courte durée' },
    { id: 'classique', titre: 'Location meublée à l’année' },
  ],
  champs: [
    eur('prixNuit', 'Prix moyen par nuit', 120, 'tourisme'),
    pct('occupation', 'Taux d’occupation', 65, 'tourisme'),
    pct('commission', 'Commissions et conciergerie', 35, 'tourisme', { aide: 'En pourcentage des recettes.' }),
    eur('autres', 'Autres charges annuelles', 5335, 'tourisme', {
      aide: 'Énergie, internet, consommables, entretien, THRS, CFE, comptabilité…',
    }),
    {
      type: 'case',
      id: 'classe',
      libelle: 'Meublé de tourisme classé (1 à 5 étoiles)',
      defaut: false,
      groupe: 'tourisme',
    },
    {
      type: 'case',
      id: 'residence',
      libelle: 'Il s’agit de ma résidence principale',
      defaut: false,
      groupe: 'tourisme',
    },
    eur('loyer', 'Loyer mensuel en meublé classique', 900, 'classique'),
    eur('chargesClassique', 'Charges annuelles à votre charge', 0, 'classique'),
  ],
  calculer(v) {
    const r = O.comparaisonTourisme({
      prixNuit: n(v, 'prixNuit'),
      tauxOccupation: taux(v, 'occupation'),
      commission: taux(v, 'commission'),
      autresChargesTourisme: n(v, 'autres'),
      classe: b(v, 'classe'),
      loyerMensuelClassique: n(v, 'loyer'),
      chargesClassique: n(v, 'chargesClassique'),
    });
    const ecart = r.netTourisme - r.netClassique;
    const blocs: BlocResultat[] = [
      {
        titre: 'Location de courte durée',
        lignes: [
          { libelle: 'Nuits louées', valeur: nombre(r.nuits, 0) },
          { libelle: 'Recettes brutes', valeur: euros(r.recettesTourisme, 0) },
          { libelle: 'Commissions et conciergerie', valeur: euros(r.commissions, 0) },
          { libelle: 'Total des charges', valeur: euros(r.chargesTourisme, 0) },
          {
            libelle: 'Revenu avant impôt, crédit, taxe foncière et copropriété',
            valeur: euros(r.netTourisme, 0),
            fort: true,
          },
        ],
      },
      {
        titre: 'Location meublée à l’année',
        lignes: [
          { libelle: 'Loyers annuels', valeur: euros(r.recettesClassique, 0) },
          {
            libelle: 'Revenu avant impôt, crédit, taxe foncière et copropriété',
            valeur: euros(r.netClassique, 0),
            fort: true,
          },
        ],
      },
      {
        titre: 'Micro-BIC',
        tableau: {
          legende: 'Base imposable au micro-BIC',
          entetes: ['Location', 'Plafond', 'Abattement', 'Base imposable'],
          lignes: [
            [
              b(v, 'classe') ? 'Tourisme classé' : 'Tourisme non classé',
              euros(r.microBicTourisme.plafond, 0),
              pourcent(r.microBicTourisme.abattement, 0),
              r.microBicTourisme.dansLePlafond ? euros(r.microBicTourisme.base, 0) : 'Plafond dépassé : régime réel',
            ],
            ['Meublé à l’année', euros(83_600, 0), '50 %', euros(r.microBicClassique.base, 0)],
          ],
          numeriques: [false, true, true, true],
        },
      },
    ];
    if (b(v, 'residence') && r.nuits > 120) {
      blocs.unshift({
        titre: 'Résidence principale',
        alerte: {
          genre: 'attention',
          texte: `${nombre(r.nuits, 0)} nuits dépassent la limite de 120 jours par an (90 si votre commune l’a abaissée).`,
        },
      });
    }
    blocs.push({
      titre: 'Avant de vous lancer',
      alerte: {
        genre: 'info',
        texte:
          'Enregistrement obligatoire sur Déclaloc, autorisation de changement d’usage dans de nombreuses villes, DPE exigé, gestion bien plus lourde et risque réglementaire plus élevé.',
      },
    });
    return {
      synthese: [
        { libelle: 'Courte durée', valeur: euros(r.netTourisme, 0) },
        { libelle: 'Meublé à l’année', valeur: euros(r.netClassique, 0) },
        { libelle: 'Écart annuel', valeur: signe(ecart, 0) },
      ],
      blocs,
    };
  },
};

const denormandieSim: Simulateur = {
  id: 'denormandie',
  titre: 'Réduction d’impôt Denormandie',
  resume:
    'Réduction de 12, 18 ou 21 % du prix de revient d’un logement ancien rénové, plafonds et condition de travaux.',
  modules: ['3.4'],
  methode: [
    'Prix de revient = prix d’acquisition + travaux, retenu dans la limite de 300 000 € et de 5 500 € par m².',
    'Réduction = 12 % (6 ans), 18 % (9 ans) ou 21 % (12 ans) du prix de revient retenu, répartie par parts égales.',
    'Travaux d’au moins 25 % du coût total de l’opération, dans une commune « Action cœur de ville » ou en ORT ; dispositif ouvert jusqu’au 31 décembre 2027.',
    'La réduction entre dans le plafonnement global des avantages fiscaux (10 000 € par an).',
  ],
  groupes: [{ id: 'projet', titre: 'Projet' }],
  champs: [
    eur('prix', 'Prix d’acquisition (frais compris)', 150_000, 'projet'),
    eur('travaux', 'Montant des travaux', 60_000, 'projet'),
    { type: 'nombre', id: 'surface', libelle: 'Surface habitable', unite: 'm²', defaut: 60, min: 1, groupe: 'projet' },
    {
      type: 'choix',
      id: 'duree',
      libelle: 'Durée d’engagement de location',
      options: [
        { valeur: '6', libelle: '6 ans (12 %)' },
        { valeur: '9', libelle: '9 ans (18 %)' },
        { valeur: '12', libelle: '12 ans (21 %)' },
      ],
      defaut: '9',
      groupe: 'projet',
    },
  ],
  calculer(v) {
    const duree = Number(s(v, 'duree')) as 6 | 9 | 12;
    const r = O.denormandie({ prix: n(v, 'prix'), travaux: n(v, 'travaux'), surface: n(v, 'surface'), duree });
    return {
      synthese: [
        { libelle: 'Réduction totale', valeur: euros(r.reduction, 0) },
        { libelle: 'Par an', valeur: euros(r.parAn, 0) },
      ],
      blocs: [
        {
          titre: 'Calcul',
          lignes: [
            { libelle: 'Prix de revient', valeur: euros(r.prixDeRevient, 0) },
            { libelle: 'Plafond (300 000 € et 5 500 €/m²)', valeur: euros(r.plafond, 0) },
            { libelle: 'Base retenue', valeur: euros(r.base, 0) },
            { libelle: 'Taux', valeur: pourcent(r.taux, 0) },
            { libelle: 'Réduction d’impôt totale', valeur: euros(r.reduction, 0), fort: true },
            { libelle: `Réduction annuelle pendant ${duree} ans`, valeur: euros(r.parAn, 0) },
          ],
        },
        {
          titre: 'Condition de travaux',
          lignes: [{ libelle: 'Part des travaux dans le coût total', valeur: pourcent(r.partTravaux, 1) }],
          alerte: r.conditionTravaux
            ? undefined
            : {
                genre: 'attention',
                texte: 'Les travaux doivent représenter au moins 25 % du coût total de l’opération.',
              },
        },
      ],
    };
  },
};

const locAvantagesSim: Simulateur = {
  id: 'loc-avantages',
  titre: 'Réduction d’impôt Loc’Avantages',
  resume:
    'Réduction annuelle de 15 à 65 % des loyers selon la convention Loc1, Loc2 ou Loc3 et l’intermédiation locative.',
  modules: ['3.4'],
  methode: [
    'Réduction annuelle = loyers bruts × taux : Loc1 15 % (20 % avec intermédiation locative), Loc2 35 % (40 %), Loc3 65 % (intermédiation obligatoire).',
    'Convention avec l’ANAH d’au moins six ans, loyer inférieur au marché (environ −15 %, −30 % ou −45 %), plafonds de ressources des locataires.',
    'Dispositif ouvert jusqu’au 31 décembre 2027 ; il entre dans le plafonnement global des avantages fiscaux.',
  ],
  groupes: [{ id: 'convention', titre: 'Convention' }],
  champs: [
    eur('loyer', 'Loyer mensuel hors charges', 600, 'convention'),
    {
      type: 'choix',
      id: 'convention',
      libelle: 'Convention',
      options: [
        { valeur: 'loc1', libelle: 'Loc1 (environ −15 % du marché)' },
        { valeur: 'loc2', libelle: 'Loc2 (environ −30 %)' },
        { valeur: 'loc3', libelle: 'Loc3 (environ −45 %)' },
      ],
      defaut: 'loc2',
      groupe: 'convention',
    },
    { type: 'case', id: 'intermediation', libelle: 'Intermédiation locative', defaut: false, groupe: 'convention' },
  ],
  calculer(v) {
    const conv = s(v, 'convention') as O.ConventionLocAvantages;
    const r = O.locAvantages(n(v, 'loyer'), conv, b(v, 'intermediation'));
    return {
      synthese: [
        { libelle: 'Réduction par an', valeur: euros(r.reductionAnnuelle, 0) },
        { libelle: 'Sur 6 ans', valeur: euros(r.sur6Ans, 0) },
      ],
      blocs: [
        {
          titre: 'Calcul',
          lignes: [
            { libelle: 'Loyers bruts annuels', valeur: euros(r.loyersAnnuels, 0) },
            { libelle: 'Taux de réduction', valeur: pourcent(r.taux, 0) },
            { libelle: 'Réduction d’impôt annuelle', valeur: euros(r.reductionAnnuelle, 0), fort: true },
            { libelle: 'Sur la durée minimale de six ans', valeur: euros(r.sur6Ans, 0) },
          ],
          alerte:
            conv === 'loc3' && !b(v, 'intermediation')
              ? {
                  genre: 'info',
                  texte: 'En Loc3, l’intermédiation locative est obligatoire : elle est retenue d’office.',
                }
              : undefined,
        },
      ],
    };
  },
};

const relocation: Simulateur = {
  id: 'loyer-relocation',
  titre: 'Loyer maximal à la relocation en zone tendue',
  resume:
    'Loyer d’un nouveau bail en zone tendue : dernier loyer, révision IRL, exceptions et blocage des logements F et G.',
  modules: ['2.1'],
  methode: [
    'Le loyer du nouveau bail ne peut excéder le dernier loyer du précédent locataire, augmenté de la variation de l’IRL s’il n’a pas été révisé dans les douze derniers mois.',
    'Travaux d’au moins la moitié de la dernière année de loyer : hausse annuelle limitée à 15 % de leur coût TTC. Loyer sous-évalué : moitié de l’écart avec le loyer du voisinage.',
    'Vacance de plus de 18 mois, première location ou gros travaux récents : loyer libre (sous réserve de l’encadrement).',
    'Logements F ou G : aucune hausse, quelle que soit l’exception. Régime reconduit pour les baux du 1er août 2026 au 31 juillet 2027.',
  ],
  groupes: [
    { id: 'loyer', titre: 'Dernier loyer' },
    { id: 'exception', titre: 'Exception' },
  ],
  champs: [
    eur('dernierLoyer', 'Dernier loyer du précédent locataire (hors charges)', 700, 'loyer'),
    {
      type: 'case',
      id: 'revise',
      libelle: 'Loyer révisé dans les douze derniers mois',
      defaut: false,
      groupe: 'loyer',
    },
    {
      type: 'nombre',
      id: 'irlAncien',
      libelle: 'IRL de la dernière révision',
      defaut: 146.68,
      min: 1,
      groupe: 'loyer',
    },
    { type: 'nombre', id: 'irlNouveau', libelle: 'Dernier IRL publié', defaut: 148.37, min: 1, groupe: 'loyer' },
    { type: 'choix', id: 'dpe', libelle: 'Classe DPE', options: CLASSES_DPE, defaut: 'D', groupe: 'loyer' },
    {
      type: 'choix',
      id: 'exception',
      libelle: 'Exception invoquée',
      options: [
        { valeur: 'aucune', libelle: 'Aucune' },
        { valeur: 'travaux', libelle: 'Travaux d’amélioration depuis le dernier bail' },
        { valeur: 'sous-evalue', libelle: 'Loyer manifestement sous-évalué' },
        { valeur: 'libre', libelle: 'Vacance > 18 mois, première location ou gros travaux récents' },
      ],
      defaut: 'aucune',
      groupe: 'exception',
    },
    eur('travaux', 'Coût TTC des travaux', 0, 'exception'),
    eur('voisinage', 'Loyer de référence du voisinage (mensuel)', 0, 'exception'),
  ],
  calculer(v) {
    const r = O.loyerRelocation({
      dernierLoyer: n(v, 'dernierLoyer'),
      reviseDansLes12Mois: b(v, 'revise'),
      irlAncien: n(v, 'irlAncien'),
      irlNouveau: n(v, 'irlNouveau'),
      passoire: ['F', 'G'].includes(s(v, 'dpe')),
      exception: s(v, 'exception') as O.ExceptionRelocation,
      coutTravaux: n(v, 'travaux'),
      loyerVoisinage: n(v, 'voisinage'),
    });
    const blocs: BlocResultat[] = [
      {
        titre: 'Loyer du nouveau bail',
        lignes: [
          { libelle: 'Dernier loyer', valeur: euros(n(v, 'dernierLoyer')) },
          { libelle: 'Après révision IRL éventuelle', valeur: euros(r.avecIrl) },
          {
            libelle: 'Loyer maximal',
            valeur: r.maximum === null ? 'Libre' : euros(r.maximum),
            detail: r.motif,
            fort: true,
          },
        ],
      },
    ];
    if (r.exceptionRefusee) {
      blocs.push({
        titre: 'Exception',
        alerte: {
          genre: 'attention',
          texte: ['F', 'G'].includes(s(v, 'dpe'))
            ? 'Logement F ou G : aucune exception ne permet de hausse.'
            : 'Les conditions de l’exception ne sont pas remplies avec les montants saisis.',
        },
      });
    }
    return { synthese: [{ libelle: 'Loyer maximal', valeur: r.maximum === null ? 'Libre' : euros(r.maximum) }], blocs };
  },
};

const encadrement: Simulateur = {
  id: 'encadrement-loyers',
  titre: 'Encadrement des loyers : mon loyer est-il conforme ?',
  resume: 'Loyer de référence majoré et minoré, plafond du loyer de base, dépassement et complément de loyer.',
  modules: ['2.1'],
  methode: [
    'Loyer de référence majoré = loyer de référence × 1,2 ; minoré = loyer de référence × 0,7 (en € par m²).',
    'Le loyer de base ne peut dépasser loyer de référence majoré × surface habitable.',
    'Complément de loyer possible pour des caractéristiques exceptionnelles, interdit notamment pour un logement F ou G.',
    'Loyers de référence : arrêté préfectoral en vigueur (Paris, Lille, Lyon et Villeurbanne, Montpellier, Bordeaux, Pays basque, Grenoble-Alpes Métropole, Plaine Commune, Est Ensemble).',
  ],
  groupes: [{ id: 'logement', titre: 'Logement' }],
  champs: [
    {
      type: 'nombre',
      id: 'surface',
      libelle: 'Surface habitable',
      unite: 'm²',
      defaut: 30,
      min: 1,
      groupe: 'logement',
    },
    {
      type: 'nombre',
      id: 'reference',
      libelle: 'Loyer de référence (arrêté préfectoral)',
      unite: '€/m²',
      defaut: 25,
      min: 0,
      groupe: 'logement',
      aide: 'Le loyer de référence (médian) de votre secteur, type de logement et époque de construction.',
    },
    eur('loyerBase', 'Loyer de base prévu (hors charges)', 950, 'logement'),
    eur('complement', 'Complément de loyer', 0, 'logement'),
    { type: 'choix', id: 'dpe', libelle: 'Classe DPE', options: CLASSES_DPE, defaut: 'D', groupe: 'logement' },
  ],
  calculer(v) {
    const r = O.encadrementLoyer({
      surface: n(v, 'surface'),
      loyerReference: n(v, 'reference'),
      loyerBase: n(v, 'loyerBase'),
      complement: n(v, 'complement'),
      passoire: ['F', 'G'].includes(s(v, 'dpe')),
    });
    const blocs: BlocResultat[] = [
      {
        titre: 'Références',
        lignes: [
          { libelle: 'Loyer de référence majoré', valeur: `${nombre(r.majore, 2)} €/m²` },
          { libelle: 'Loyer de référence minoré', valeur: `${nombre(r.minore, 2)} €/m²` },
          { libelle: 'Loyer de base maximal', valeur: euros(r.plafond), fort: true },
        ],
      },
      {
        titre: 'Votre loyer',
        lignes: [
          { libelle: 'Loyer de base prévu', valeur: euros(n(v, 'loyerBase')) },
          { libelle: 'Dépassement mensuel', valeur: euros(r.depassement), fort: r.depassement > 0 },
        ],
        alerte: r.conforme
          ? undefined
          : {
              genre: 'attention',
              texte:
                'Loyer supérieur au plafond : le locataire peut obtenir une diminution et le remboursement du trop-perçu ; amende administrative jusqu’à 5 000 € (15 000 € pour une personne morale).',
            },
      },
    ];
    if (r.complementInterdit) {
      blocs.push({
        titre: 'Complément',
        alerte: { genre: 'attention', texte: 'Complément de loyer interdit pour un logement F ou G.' },
      });
    }
    return {
      synthese: [
        { libelle: 'Loyer maximal', valeur: euros(r.plafond) },
        { libelle: 'Conforme', valeur: r.conforme ? 'Oui' : 'Non' },
      ],
      blocs,
    };
  },
};

const usure: Simulateur = {
  id: 'taux-usure',
  titre: 'Taux d’usure : mon prêt immobilier est-il possible ?',
  resume: 'Comparaison du TAEG de votre offre avec le taux d’usure du trimestre selon la durée et le type de prêt.',
  modules: ['2.10'],
  methode: [
    'Aucun prêt ne peut dépasser le taux d’usure : on compare le TAEG (intérêts, assurance obligatoire, frais de dossier et de garantie) au seuil.',
    'Seuils du 3e trimestre 2026 : taux fixe de moins de 10 ans 4,07 % ; de 10 à moins de 20 ans 4,57 % ; 20 ans et plus 5,29 % ; taux variable 5,28 % ; prêts relais 6,39 %.',
    'Les seuils sont publiés à la fin de chaque trimestre pour le trimestre suivant.',
  ],
  groupes: [{ id: 'pret', titre: 'Offre de prêt' }],
  champs: [
    {
      type: 'nombre',
      id: 'taeg',
      libelle: 'TAEG de l’offre',
      unite: '%',
      defaut: 4.2,
      min: 0,
      max: 30,
      groupe: 'pret',
    },
    ans('duree', 'Durée du prêt', 20, 'pret'),
    {
      type: 'choix',
      id: 'type',
      libelle: 'Type de prêt',
      options: [
        { valeur: 'fixe', libelle: 'Taux fixe' },
        { valeur: 'variable', libelle: 'Taux variable' },
        { valeur: 'relais', libelle: 'Prêt relais' },
      ],
      defaut: 'fixe',
      groupe: 'pret',
    },
  ],
  calculer(v) {
    const seuil = O.seuilUsure(s(v, 'type') as O.TypePret, n(v, 'duree'));
    const ok = n(v, 'taeg') <= seuil;
    return {
      synthese: [
        { libelle: 'Taux d’usure', valeur: `${nombre(seuil, 2)} %` },
        { libelle: 'Offre possible', valeur: ok ? 'Oui' : 'Non' },
      ],
      blocs: [
        {
          titre: 'Comparaison (3e trimestre 2026)',
          lignes: [
            { libelle: 'TAEG de l’offre', valeur: `${nombre(n(v, 'taeg'), 2)} %` },
            { libelle: 'Taux d’usure applicable', valeur: `${nombre(seuil, 2)} %`, fort: true },
            {
              libelle: 'Marge',
              valeur: `${nombre(seuil - n(v, 'taeg'), 2)} point${Math.abs(seuil - n(v, 'taeg')) >= 2 ? 's' : ''}`,
            },
          ],
          alerte: ok
            ? undefined
            : {
                genre: 'attention',
                texte: 'TAEG supérieur au taux d’usure : la banque ne peut pas accorder ce prêt en l’état.',
              },
        },
      ],
    };
  },
};

const tva: Simulateur = {
  id: 'tva-travaux',
  titre: 'TVA des travaux : 5,5 %, 10 % ou 20 %',
  resume: 'Taux de TVA applicable aux travaux dans un logement, montant de TVA et prix TTC.',
  modules: ['2.3'],
  methode: [
    '10 % pour l’amélioration et l’entretien de logements achevés depuis plus de deux ans.',
    '5,5 % pour les travaux de rénovation énergétique éligibles (étendu en 2026 à certaines pompes à chaleur air-air performantes).',
    '20 % pour les travaux assimilés à une construction neuve ou à un agrandissement.',
  ],
  groupes: [{ id: 'travaux', titre: 'Travaux' }],
  champs: [
    eur('montant', 'Montant hors taxes', 10_000, 'travaux'),
    {
      type: 'choix',
      id: 'nature',
      libelle: 'Nature des travaux',
      options: [
        { valeur: 'entretien', libelle: 'Amélioration ou entretien (logement de plus de deux ans)' },
        { valeur: 'energetique', libelle: 'Rénovation énergétique éligible' },
        { valeur: 'neuf', libelle: 'Construction neuve ou agrandissement' },
      ],
      defaut: 'entretien',
      groupe: 'travaux',
    },
  ],
  calculer(v) {
    const r = O.tvaTravaux(n(v, 'montant'), s(v, 'nature') as O.NatureTravaux);
    return {
      synthese: [
        { libelle: 'Taux', valeur: pourcent(r.taux, 1) },
        { libelle: 'Prix TTC', valeur: euros(r.ttc) },
      ],
      blocs: [
        {
          titre: 'Montants',
          lignes: [
            { libelle: 'Hors taxes', valeur: euros(n(v, 'montant')) },
            { libelle: `TVA à ${pourcent(r.taux, 1)}`, valeur: euros(r.tva) },
            { libelle: 'Toutes taxes comprises', valeur: euros(r.ttc), fort: true },
          ],
        },
      ],
    };
  },
};

const loyerM2: Simulateur = {
  id: 'loyer-au-m2',
  titre: 'Estimer un loyer au m² et le dépôt de garantie',
  resume:
    'Loyer hors charges à partir du prix au m² des biens comparables, loyer charges comprises et dépôt de garantie maximal.',
  modules: ['1.6'],
  methode: [
    'Loyer hors charges = surface habitable × prix au m² retenu parmi les biens comparables.',
    'Loyer charges comprises = loyer hors charges + provision sur charges récupérables.',
    'Dépôt de garantie : au plus un mois de loyer hors charges en location vide, deux mois en meublé, interdit en bail mobilité.',
    'En zone tendue et dans les villes encadrées, vérifiez aussi les plafonds de relocation et d’encadrement.',
  ],
  groupes: [{ id: 'logement', titre: 'Logement' }],
  champs: [
    {
      type: 'nombre',
      id: 'surface',
      libelle: 'Surface habitable',
      unite: 'm²',
      defaut: 42,
      min: 1,
      groupe: 'logement',
    },
    {
      type: 'nombre',
      id: 'prixM2',
      libelle: 'Loyer au m² retenu (hors charges)',
      unite: '€/m²',
      defaut: 13.2,
      min: 0,
      groupe: 'logement',
    },
    eur('charges', 'Provision mensuelle sur charges', 55, 'logement'),
    { type: 'case', id: 'meuble', libelle: 'Location meublée', defaut: false, groupe: 'logement' },
  ],
  calculer(v) {
    const r = O.loyerAuM2({
      surface: n(v, 'surface'),
      prixM2: n(v, 'prixM2'),
      charges: n(v, 'charges'),
      meuble: b(v, 'meuble'),
    });
    return {
      synthese: [
        { libelle: 'Loyer hors charges', valeur: euros(r.loyer) },
        { libelle: 'Dépôt maximal', valeur: euros(r.depotMaximum) },
      ],
      blocs: [
        {
          titre: 'Loyer',
          lignes: [
            {
              libelle: 'Loyer hors charges',
              valeur: euros(r.loyer),
              detail: `${nombre(n(v, 'surface'), 0)} m² × ${nombre(n(v, 'prixM2'), 2)} €`,
              fort: true,
            },
            { libelle: 'Loyer charges comprises', valeur: euros(r.chargesComprises) },
            {
              libelle: 'Dépôt de garantie maximal',
              valeur: euros(r.depotMaximum),
              detail: b(v, 'meuble') ? 'Deux mois de loyer hors charges' : 'Un mois de loyer hors charges',
            },
          ],
        },
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// Registre, valeurs et contrôles
// ---------------------------------------------------------------------------

export const SIMULATEURS: Simulateur[] = [
  rentabilite,
  credit,
  capacite,
  revision,
  depot,
  foncier,
  meuble,
  jeanbrun,
  plusValue,
  ifiSim,
  frais,
  triSim,
  donation,
  conge,
  dpeLocation,
  regularisation,
  tourisme,
  denormandieSim,
  locAvantagesSim,
  relocation,
  encadrement,
  usure,
  tva,
  loyerM2,
];

export const simulateurParId = (id: string): Simulateur | undefined => SIMULATEURS.find((x) => x.id === id);

export function valeursParDefaut(sim: Simulateur): Valeurs {
  return Object.fromEntries(sim.champs.map((c) => [c.id, c.defaut]));
}

/** Valeurs numériques des champs « choix » dont les options sont des nombres (TMI, plafonds, taux). */
function normaliserChoix(sim: Simulateur, v: Valeurs): Valeurs {
  const sortie: Valeurs = { ...v };
  for (const c of sim.champs) {
    if (c.type === 'choix' && c.options.every((o) => /^-?\d+(\.\d+)?$/.test(o.valeur))) {
      sortie[c.id] = Number(v[c.id]);
    }
  }
  return sortie;
}

export function controlerValeurs(sim: Simulateur, v: Valeurs): ErreurSaisie[] {
  const erreurs: ErreurSaisie[] = [];
  for (const c of sim.champs) {
    const x = v[c.id];
    if (c.type === 'nombre') {
      if (typeof x !== 'number' || !Number.isFinite(x)) {
        erreurs.push({ champ: c.id, message: 'Saisissez un nombre, par exemple 1 250,50.' });
      } else if (c.entier && !Number.isInteger(x)) {
        erreurs.push({ champ: c.id, message: 'Saisissez un nombre entier.' });
      } else if ((c.min !== undefined && x < c.min) || (c.max !== undefined && x > c.max)) {
        const bornes =
          c.min !== undefined && c.max !== undefined
            ? `entre ${nombre(c.min, 0, 2)} et ${nombre(c.max, 0, 2)}`
            : c.min !== undefined
              ? `supérieure ou égale à ${nombre(c.min, 0, 2)}`
              : `inférieure ou égale à ${nombre(c.max ?? 0, 0, 2)}`;
        erreurs.push({ champ: c.id, message: `La valeur doit être ${bornes}${c.unite ? ` ${c.unite}` : ''}.` });
      }
    } else if (c.type === 'date') {
      if (typeof x !== 'string' || !estDateIso(x)) erreurs.push({ champ: c.id, message: 'Saisissez une date valide.' });
    } else if (c.type === 'choix') {
      if (!c.options.some((o) => o.valeur === String(x)))
        erreurs.push({ champ: c.id, message: 'Choisissez une option.' });
    }
  }
  if (!erreurs.length && sim.controler) erreurs.push(...sim.controler(normaliserChoix(sim, v)));
  return erreurs;
}

/** Calcule le résultat si les valeurs sont valides. */
export function executer(sim: Simulateur, v: Valeurs): { erreurs: ErreurSaisie[]; resultat?: Resultat } {
  const erreurs = controlerValeurs(sim, v);
  if (erreurs.length) return { erreurs };
  return { erreurs, resultat: sim.calculer(normaliserChoix(sim, v)) };
}

// ---------------------------------------------------------------------------
// Paramètres dans l'adresse (partage)
// ---------------------------------------------------------------------------

export function versParametres(sim: Simulateur, v: Valeurs): URLSearchParams {
  const p = new URLSearchParams();
  const defauts = valeursParDefaut(sim);
  for (const c of sim.champs) {
    const x = v[c.id];
    if (x === undefined || x === defauts[c.id]) continue;
    p.set(c.id, typeof x === 'boolean' ? (x ? '1' : '0') : String(x));
  }
  return p;
}

export function depuisParametres(sim: Simulateur, p: URLSearchParams): Valeurs {
  const v = valeursParDefaut(sim);
  for (const c of sim.champs) {
    const brut = p.get(c.id);
    if (brut === null) continue;
    if (c.type === 'nombre') {
      const x = Number(brut);
      if (Number.isFinite(x)) v[c.id] = x;
    } else if (c.type === 'case') {
      v[c.id] = brut === '1' || brut === 'true';
    } else if (c.type === 'date') {
      if (estDateIso(brut)) v[c.id] = brut;
    } else if (c.options.some((o) => o.valeur === brut)) {
      v[c.id] = brut;
    }
  }
  return v;
}
