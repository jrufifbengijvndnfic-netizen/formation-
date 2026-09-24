/**
 * Modèles de lettres publiés comme outils gratuits (une page par lettre) : adresse, titre de page,
 * titre principal et description calqués sur les recherches des internautes, simulateur associé.
 */
import type { Lettre } from './types';

export interface ReferencementLettre {
  slug: string;
  titre: string;
  h1: string;
  description: string;
  /** Simulateur utile avec ce courrier. */
  simulateur?: string;
}

const suite = 'Complétez les champs, copiez ou imprimez le courrier. Gratuit, sans inscription.';

export const REFERENCEMENT_LETTRES: Record<string, ReferencementLettre> = {
  f1: {
    slug: 'revision-du-loyer',
    titre: 'Lettre de révision du loyer (IRL) : modèle gratuit à compléter',
    h1: 'Modèle de lettre de révision annuelle du loyer',
    description: `Lettre type pour réviser le loyer selon l’IRL. ${suite}`,
    simulateur: 'revision-loyer',
  },
  f2: {
    slug: 'regularisation-des-charges',
    titre: 'Lettre de régularisation des charges locatives : modèle gratuit',
    h1: 'Modèle de lettre de régularisation annuelle des charges',
    description: `Lettre type pour régulariser les charges locatives de l’année. ${suite}`,
  },
  f3: {
    slug: 'relance-loyer-impaye',
    titre: 'Lettre de relance pour loyer impayé : modèle gratuit',
    h1: 'Modèle de lettre de relance amiable pour loyer impayé',
    description: `Lettre type de relance amiable du locataire en cas de loyer impayé. ${suite}`,
  },
  f4: {
    slug: 'mise-en-demeure-de-payer',
    titre: 'Mise en demeure de payer le loyer : modèle de lettre gratuit',
    h1: 'Modèle de mise en demeure de payer le loyer',
    description: `Lettre type de mise en demeure du locataire de payer loyer et charges. ${suite}`,
  },
  f5: {
    slug: 'conge-pour-vente',
    titre: 'Congé pour vente (location vide) : modèle de lettre gratuit',
    h1: 'Modèle de congé pour vente d’un logement loué vide',
    description: `Lettre type de congé pour vente donné par le bailleur au locataire. ${suite}`,
    simulateur: 'dates-de-conge',
  },
  f6: {
    slug: 'conge-pour-reprise',
    titre: 'Congé pour reprise (location vide) : modèle de lettre gratuit',
    h1: 'Modèle de congé pour reprise d’un logement loué vide',
    description: `Lettre type de congé pour reprise du logement par le bailleur ou un proche. ${suite}`,
    simulateur: 'dates-de-conge',
  },
  f7: {
    slug: 'restitution-depot-de-garantie',
    titre: 'Restitution du dépôt de garantie : modèle de lettre gratuit',
    h1: 'Modèle de lettre de restitution du dépôt de garantie',
    description: `Lettre type pour restituer ou réclamer le dépôt de garantie. ${suite}`,
    simulateur: 'depot-de-garantie',
  },
  f8: {
    slug: 'quittance-de-loyer',
    titre: 'Quittance de loyer : modèle gratuit à compléter et imprimer',
    h1: 'Modèle de quittance de loyer',
    description: `Quittance de loyer type, loyer et charges détaillés. ${suite}`,
  },
  f9: {
    slug: 'demande-attestation-assurance',
    titre: 'Demande d’attestation d’assurance habitation : modèle gratuit',
    h1: 'Modèle de demande d’attestation d’assurance au locataire',
    description: `Lettre type pour demander au locataire son attestation d’assurance habitation. ${suite}`,
  },
  f10: {
    slug: 'notification-de-travaux',
    titre: 'Notification de travaux au locataire : modèle de lettre gratuit',
    h1: 'Modèle de notification de travaux au locataire',
    description: `Lettre type pour informer le locataire de travaux dans le logement. ${suite}`,
  },
};

export const referencementLettre = (l: Lettre): ReferencementLettre => {
  const r = REFERENCEMENT_LETTRES[l.id];
  if (!r) throw new Error(`Référencement manquant pour la lettre « ${l.id} »`);
  return r;
};
