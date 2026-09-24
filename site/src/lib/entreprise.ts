/**
 * Informations de l'éditeur et conditions de vente, À COMPLÉTER PAR LE PROPRIÉTAIRE DU SITE.
 * Rien n'est inventé : tant qu'un champ est vide, les pages concernées affichent « à compléter » et
 * le build liste les champs manquants (voir manquants()). Voir audit/AUDIT-conversion.md § 9 et § 14.
 */

export const EDITEUR = {
  /** Nom et prénom, ou raison sociale. */
  nom: '',
  /** Micro-entreprise, EI, SASU, SARL… */
  statut: '',
  adresse: '',
  /** SIREN ou SIRET (et RCS le cas échéant). */
  immatriculation: '',
  /** Adresse de contact affichée sur le site (mentions légales, FAQ, CGV). */
  email: '',
  directeurPublication: '',
};

/** Hébergeur (Vercel). À adapter si le site est hébergé ailleurs. */
export const HEBERGEUR = {
  nom: 'Vercel Inc.',
  adresse: '440 N Barranca Ave #4133, Covina, CA 91723, États-Unis',
  site: 'https://vercel.com',
};

/** Conditions de l'offre, affichées sur la page de vente, les tarifs et les CGV. */
export const CONDITIONS = {
  /** Ex. « TVA non applicable, article 293 B du CGI » ou « Prix TTC ». */
  mentionPrix: '',
  /** Ex. « Accès à vie » ou « Accès pendant 12 mois ». */
  acces: '',
  /** Ex. « Mises à jour incluses jusqu'à l'édition 2027 ». */
  misesAJour: '',
  /** Ex. « Satisfait ou remboursé pendant 14 jours » ; vide = aucune garantie annoncée. */
  garantie: '',
  /** Ex. « Facture envoyée automatiquement par e-mail ». */
  facture: '',
  /** Ex. « Carte bancaire ; paiement en 3 fois pour la formation complète ». */
  paiement: '',
  /** Médiateur de la consommation (nom et site), obligatoire pour vendre à des particuliers. */
  mediateur: '',
};

/** Auteur de la formation (page de vente, FAQ). */
export const AUTEUR = {
  nom: '',
  /** Quelques phrases : parcours, pourquoi cette formation. */
  presentation: '',
};

/**
 * Avis d'élèves réels, affichés sur la page de vente avec leur mode de vérification (ex. « avis
 * recueilli après l'examen du niveau 1, achat vérifié par la plateforme »). Ne jamais en inventer.
 */
export const AVIS: { texte: string; auteur: string; verification: string }[] = [];

/**
 * Formulaire d'inscription par e-mail (aimant : calendrier du bailleur 2026-2027). Adresse d'envoi
 * fournie par le service d'e-mailing (Brevo, MailerLite…), qui gère le double consentement. Vide =
 * formulaire non affiché.
 */
export const FORMULAIRE_EMAIL = {
  action: '',
  /** Nom du champ e-mail attendu par le service (souvent « email » ou « EMAIL »). */
  champ: 'email',
};

/**
 * Mesure d'audience sans cookie ni donnée personnelle (Vercel Web Analytics). À activer aussi dans le
 * tableau de bord Vercel (Analytics). false = aucun script de mesure.
 */
export const MESURE_AUDIENCE = true;

/** Champs obligatoires encore vides (affichés à chaque build). */
export function manquants(): string[] {
  const liste: [string, string][] = [
    ['EDITEUR.nom', EDITEUR.nom],
    ['EDITEUR.statut', EDITEUR.statut],
    ['EDITEUR.adresse', EDITEUR.adresse],
    ['EDITEUR.immatriculation', EDITEUR.immatriculation],
    ['EDITEUR.email', EDITEUR.email],
    ['EDITEUR.directeurPublication', EDITEUR.directeurPublication],
    ['CONDITIONS.mentionPrix', CONDITIONS.mentionPrix],
    ['CONDITIONS.acces', CONDITIONS.acces],
    ['CONDITIONS.misesAJour', CONDITIONS.misesAJour],
    ['CONDITIONS.facture', CONDITIONS.facture],
    ['CONDITIONS.paiement', CONDITIONS.paiement],
    ['CONDITIONS.mediateur', CONDITIONS.mediateur],
    ['AUTEUR.nom', AUTEUR.nom],
  ];
  return liste.filter(([, v]) => !v.trim()).map(([k]) => k);
}

/** Texte affiché à la place d'une information manquante. */
export const A_COMPLETER = 'à compléter';
