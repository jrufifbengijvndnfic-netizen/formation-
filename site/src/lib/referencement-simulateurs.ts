/**
 * Référencement des simulateurs, outils gratuits d'appel vers le site : titre de page et titre
 * principal calqués sur les recherches des internautes (« simulateur rentabilité locative »,
 * « calcul frais de notaire »…), description de 160 caractères au plus.
 * Ces textes décrivent l'outil ; ils ne reprennent ni ne modifient le fond de la formation.
 */
import { adresseAbsolue, MARQUE } from './seo';
import type { Simulateur } from './simulateurs';

export interface ReferencementSimulateur {
  /** Titre de la page (onglet, résultats Google), avant « | Formation Locatif ». */
  titre: string;
  /** Titre principal (h1). */
  h1: string;
  description: string;
}

export const REFERENCEMENT_SIMULATEURS: Record<string, ReferencementSimulateur> = {
  rentabilite: {
    titre: 'Simulateur rentabilité locative gratuit : brute, nette et cash-flow',
    h1: 'Simulateur de rentabilité locative et de cash-flow',
    description:
      'Calculez gratuitement la rentabilité brute et nette et le cash-flow mensuel de votre investissement locatif : prix, frais, loyer, charges, crédit, vacance.',
  },
  credit: {
    titre: 'Simulateur prêt immobilier gratuit : mensualité et amortissement',
    h1: 'Simulateur de prêt immobilier : mensualité et tableau d’amortissement',
    description:
      'Calculez la mensualité, le coût total et le tableau d’amortissement annuel d’un prêt immobilier à taux fixe, assurance emprunteur comprise. Gratuit.',
  },
  'capacite-emprunt': {
    titre: 'Calcul capacité d’emprunt immobilier gratuit (règle des 35 %)',
    h1: 'Calcul de capacité d’emprunt immobilier',
    description:
      'Estimez votre mensualité maximale et le capital empruntable selon la règle des 35 % d’endettement, avec 70 % des loyers retenus. Gratuit, sans inscription.',
  },
  'revision-loyer': {
    titre: 'Calcul révision de loyer IRL gratuit : nouveau loyer et date d’effet',
    h1: 'Calcul de la révision de loyer avec l’IRL',
    description:
      'Calculez le loyer révisé selon l’indice de référence des loyers (IRL), la date d’effet de la révision et le blocage des logements classés F ou G. Gratuit.',
  },
  'depot-de-garantie': {
    titre: 'Dépôt de garantie non rendu : calcul de la pénalité de retard',
    h1: 'Calcul de la pénalité de retard du dépôt de garantie',
    description:
      'Délai légal de restitution du dépôt de garantie, mois de retard et pénalité de 10 % du loyer par mois commencé : calcul gratuit pour locataires et bailleurs.',
  },
  'micro-foncier-ou-reel': {
    titre: 'Micro-foncier ou réel : simulateur gratuit de l’impôt sur les loyers',
    h1: 'Simulateur micro-foncier ou régime réel',
    description:
      'Comparez l’impôt et les prélèvements sociaux de vos loyers de location nue au micro-foncier et au régime réel, déficit foncier compris. Simulateur gratuit.',
  },
  'micro-bic-ou-reel': {
    titre: 'Simulateur LMNP gratuit : micro-BIC ou régime réel',
    h1: 'Simulateur LMNP : micro-BIC ou régime réel',
    description:
      'Comparez l’impôt de votre location meublée non professionnelle (LMNP) au micro-BIC et au régime réel avec amortissements. Simulateur gratuit, sans inscription.',
  },
  jeanbrun: {
    titre: 'Simulateur Jeanbrun gratuit : amortissement du bailleur privé',
    h1: 'Simulateur du dispositif Jeanbrun (statut du bailleur privé)',
    description:
      'Base amortissable, déduction annuelle et total sur l’engagement de neuf ans du dispositif Jeanbrun (loi de finances pour 2026). Simulateur gratuit.',
  },
  'plus-value': {
    titre: 'Calcul plus-value immobilière gratuit : abattements et impôt',
    h1: 'Calcul de la plus-value immobilière',
    description:
      'Calculez la plus-value brute, les abattements pour durée de détention, l’impôt, les prélèvements sociaux et la surtaxe à la vente d’un bien. Gratuit.',
  },
  ifi: {
    titre: 'Simulateur IFI gratuit : impôt sur la fortune immobilière',
    h1: 'Simulateur de l’impôt sur la fortune immobilière (IFI)',
    description:
      'Calculez votre patrimoine immobilier net taxable et l’IFI dû selon le barème, décote comprise. Simulateur gratuit de l’impôt sur la fortune immobilière.',
  },
  'frais-acquisition': {
    titre: 'Calcul frais de notaire gratuit : achat immobilier ancien ou neuf',
    h1: 'Calcul des frais de notaire',
    description:
      'Estimez les frais de notaire d’un achat immobilier : droits de mutation, émoluments du notaire, contribution de sécurité immobilière et débours. Gratuit.',
  },
  tri: {
    titre: 'Calcul TRI investissement locatif gratuit : flux et sensibilité',
    h1: 'Calcul du TRI d’un investissement locatif',
    description:
      'Calculez le taux de rendement interne (TRI) des fonds propres d’un projet locatif, avec et sans crédit, les flux annuels et la sensibilité. Gratuit.',
  },
  donation: {
    titre: 'Calcul droits de donation immobilière gratuit : pleine ou nue-propriété',
    h1: 'Calcul des droits de donation d’un bien immobilier',
    description:
      'Calculez la valeur taxable d’un bien donné en pleine ou en nue-propriété, l’abattement et les droits de donation selon le barème. Simulateur gratuit.',
  },
  'dates-de-conge': {
    titre: 'Congé et préavis du bail : calcul gratuit des dates limites',
    h1: 'Calcul des dates de congé d’un bail d’habitation',
    description:
      'Date limite du congé donné par le bailleur et date de fin du préavis du locataire, selon le type de bail et le préavis applicable. Calcul gratuit.',
  },
  'dpe-location': {
    titre: 'DPE et location : mon logement est-il encore louable ? (calcul gratuit)',
    h1: 'Mon logement est-il encore louable ? Décence énergétique et DPE',
    description:
      'Classe DPE G, F ou E : date d’interdiction de louer, gel du loyer, audit à la vente. Vérifiez gratuitement si votre logement est encore louable en 2026.',
  },
  'regularisation-charges': {
    titre: 'Calcul régularisation des charges locatives gratuit',
    h1: 'Calcul de la régularisation des charges locatives',
    description:
      'Comparez les provisions versées aux charges récupérables réelles : complément dû par le locataire ou trop-perçu, et nouvelle provision mensuelle. Gratuit.',
  },
  'meuble-de-tourisme': {
    titre: 'Rentabilité Airbnb ou location meublée classique : simulateur gratuit',
    h1: 'Rentabilité location courte durée (Airbnb) ou meublé à l’année',
    description:
      'Nuits louées, recettes, commissions et revenu net d’une location courte durée type Airbnb comparés à un meublé à l’année, micro-BIC compris. Gratuit.',
  },
  denormandie: {
    titre: 'Simulateur Denormandie gratuit : réduction d’impôt dans l’ancien',
    h1: 'Simulateur de réduction d’impôt Denormandie',
    description:
      'Calculez la réduction d’impôt Denormandie (12, 18 ou 21 %) d’un logement ancien rénové : plafonds de 300 000 € et 5 500 €/m², condition de 25 % de travaux.',
  },
  'loc-avantages': {
    titre: 'Simulateur Loc’Avantages gratuit : réduction d’impôt Loc1, Loc2, Loc3',
    h1: 'Simulateur de réduction d’impôt Loc’Avantages',
    description:
      'Calculez la réduction d’impôt Loc’Avantages selon la convention Loc1, Loc2 ou Loc3 et l’intermédiation locative : 15 à 65 % des loyers. Simulateur gratuit.',
  },
  'loyer-relocation': {
    titre: 'Loyer à la relocation en zone tendue : calcul gratuit du maximum',
    h1: 'Calcul du loyer maximal à la relocation en zone tendue',
    description:
      'Loyer maximal d’un nouveau bail en zone tendue : dernier loyer, révision IRL, exceptions (travaux, sous-évaluation) et blocage des logements F et G. Gratuit.',
  },
  'encadrement-loyers': {
    titre: 'Encadrement des loyers : calcul gratuit du loyer maximal',
    h1: 'Encadrement des loyers : calcul du loyer maximal',
    description:
      'Loyer de référence majoré et minoré, plafond du loyer de base et dépassement : vérifiez gratuitement si un loyer respecte l’encadrement des loyers.',
  },
  'taux-usure': {
    titre: 'Taux d’usure 2026 : calcul gratuit pour votre prêt immobilier',
    h1: 'Taux d’usure : mon prêt immobilier est-il possible ?',
    description:
      'Comparez le TAEG de votre offre au taux d’usure du 3e trimestre 2026 selon la durée et le type de prêt (fixe, variable, relais). Vérification gratuite.',
  },
  'tva-travaux': {
    titre: 'TVA travaux 5,5 %, 10 % ou 20 % : calcul gratuit',
    h1: 'Calcul de la TVA sur travaux : 5,5 %, 10 % ou 20 %',
    description:
      'Quel taux de TVA pour vos travaux : 10 % en entretien et amélioration, 5,5 % en rénovation énergétique, 20 % en neuf ou agrandissement ? Calcul gratuit.',
  },
  'loyer-au-m2': {
    titre: 'Calcul loyer au m² et dépôt de garantie maximal : gratuit',
    h1: 'Calcul du loyer au m² et du dépôt de garantie maximal',
    description:
      'Estimez le loyer hors charges à partir du prix au m², le loyer charges comprises et le dépôt de garantie maximal en location vide ou meublée. Gratuit.',
  },
};

export const referencementSimulateur = (sim: Simulateur): ReferencementSimulateur => {
  const r = REFERENCEMENT_SIMULATEURS[sim.id];
  if (!r) throw new Error(`Référencement manquant pour le simulateur « ${sim.id} »`);
  return r;
};

/** Données structurées schema.org `WebApplication` : outil gratuit, utilisable dans le navigateur. */
export function simulateurJsonLd(sim: Simulateur, chemin: string, site: URL | string): Record<string, unknown> {
  const r = referencementSimulateur(sim);
  const adresse = adresseAbsolue(chemin, site);
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: r.h1,
    description: r.description,
    url: adresse,
    inLanguage: 'fr',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Tous (navigateur web)',
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
    publisher: { '@type': 'Organization', name: MARQUE, url: adresseAbsolue('/', site) },
  };
}

/** Regroupement des simulateurs par thème (page d'accueil). */
export const CATEGORIES_SIMULATEURS: { titre: string; ids: string[] }[] = [
  {
    titre: 'Rentabilité et financement',
    ids: ['rentabilite', 'meuble-de-tourisme', 'tri', 'credit', 'capacite-emprunt', 'taux-usure', 'frais-acquisition'],
  },
  {
    titre: 'Loyer et bail',
    ids: [
      'loyer-au-m2',
      'revision-loyer',
      'loyer-relocation',
      'encadrement-loyers',
      'regularisation-charges',
      'depot-de-garantie',
      'dates-de-conge',
    ],
  },
  { titre: 'Logement et travaux', ids: ['dpe-location', 'tva-travaux'] },
  {
    titre: 'Fiscalité des loyers et de la revente',
    ids: ['micro-foncier-ou-reel', 'micro-bic-ou-reel', 'jeanbrun', 'denormandie', 'loc-avantages', 'plus-value'],
  },
  { titre: 'Patrimoine et transmission', ids: ['ifi', 'donation'] },
];
