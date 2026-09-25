/**
 * Contenu des carrousels Instagram. Chaque chiffre et chaque date viennent de la formation
 * (module cité dans `module`) : à mettre à jour en même temps qu'elle.
 * Dessin : scripts/instagram.ts (npm run instagram).
 */

export type Diapo =
  | { genre: 'couverture'; titre: string; sousTitre: string }
  | {
      genre: 'texte';
      surtitre?: string;
      titre: string;
      texte?: string;
      liste?: string[];
      tampon?: 'Attention' | 'Nouveau' | 'À retenir';
      note?: string;
    }
  | { genre: 'date'; date: string; lettre: string; titre: string; texte: string; note?: string }
  | { genre: 'chiffre'; surtitre: string; chiffre: string; titre: string; texte?: string; tampon?: 'Attention' }
  | { genre: 'calcul'; surtitre: string; titre: string; lignes: [string, string][]; total: [string, string] }
  | { genre: 'comparaison'; titre: string; barres: { libelle: string; valeur: number; texte: string }[]; texte: string }
  | { genre: 'categories'; surtitre: string; titre: string; categories: { nom: string; exemples: string }[] }
  | { genre: 'sources'; textes: string[]; note: string }
  | { genre: 'appel'; titre: string; texte: string; lien: string };

export interface Carrousel {
  numero: string;
  slug: string;
  rubrique: string;
  /** Couleur de niveau du module source : 1 vert, 2 bleu ardoise, 3 lie-de-vin. */
  niveau: 1 | 2 | 3;
  module: string;
  diapos: Diapo[];
}

export const A_JOUR_AU = '25 septembre 2026';

export const CARROUSELS: Carrousel[] = [
  {
    numero: '001',
    slug: '001-dpe-trois-dates',
    rubrique: 'Énergie',
    niveau: 3,
    module: 'Modules 1.4 et 3.9',
    diapos: [
      {
        genre: 'couverture',
        titre: 'DPE : les trois dates à retenir',
        sousTitre: 'Le calendrier de la décence énergétique pour les logements loués en métropole.',
      },
      {
        genre: 'texte',
        surtitre: 'L’enjeu',
        titre: 'Trop énergivore, un logement n’est plus décent.',
        texte:
          'Il ne peut plus faire l’objet d’un nouveau bail, d’un renouvellement ni d’une reconduction. Le seuil se resserre en trois étapes.',
      },
      {
        genre: 'date',
        date: '1er janvier 2025',
        lettre: 'G',
        titre: 'Les logements classés G ne sont plus décents.',
        texte: 'Depuis cette date, seules les classes A à F restent louables.',
      },
      {
        genre: 'date',
        date: '1er janvier 2028',
        lettre: 'F',
        titre: 'Les logements classés F ne seront plus décents.',
        texte: 'Seules les classes A à E resteront louables.',
      },
      {
        genre: 'date',
        date: '1er janvier 2034',
        lettre: 'E',
        titre: 'Les logements classés E ne seront plus décents.',
        texte: 'Il faudra un logement classé entre A et D.',
        note: 'Outre-mer : calendrier décalé, G en 2028 et F en 2031.',
      },
      {
        genre: 'texte',
        surtitre: 'La question qu’on pose toujours',
        titre: 'Et le bail déjà signé ?',
        texte:
          'Il n’est pas rompu à la date : il va jusqu’à son terme. Mais le locataire peut exiger à tout moment la mise en conformité, et le juge peut réduire le loyer.',
      },
      {
        genre: 'texte',
        tampon: 'Attention',
        titre: 'Classé F ou G : loyer gelé.',
        texte:
          'Depuis le 24 août 2022, aucune hausse n’est possible : ni révision annuelle, ni à la relocation, ni au renouvellement.',
      },
      {
        genre: 'texte',
        tampon: 'À retenir',
        titre: 'En résumé',
        liste: [
          'G non décent depuis 2025, F en 2028, E en 2034.',
          'Un DPE réalisé avant le 1er juillet 2021 n’est plus valable.',
          'Pour un plan de travaux, visez au moins D : c’est le seuil de 2034.',
        ],
      },
      {
        genre: 'sources',
        textes: [
          'Loi n° 2021-1104 du 22 août 2021 (Climat et résilience)',
          'Loi n° 89-462 du 6 juillet 1989, articles 6 et 20-1',
          'Décret n° 2002-120 du 30 janvier 2002 modifié (décence)',
        ],
        note: 'Information générale, pas un conseil personnalisé. Pour votre cas : l’ADIL de votre département.',
      },
      {
        genre: 'appel',
        titre: 'Votre logement est-il encore louable ?',
        texte: 'Le simulateur gratuit vous donne la réponse selon votre classe DPE et la date du bail.',
        lien: 'formation-locatif.com/simulateurs/dpe-location',
      },
    ],
  },
  {
    numero: '002',
    slug: '002-micro-foncier-ou-reel',
    rubrique: 'Fiscalité',
    niveau: 2,
    module: 'Module 2.6',
    diapos: [
      {
        genre: 'couverture',
        titre: 'Micro-foncier ou réel : l’écart chiffré',
        sousTitre: 'Le même appartement loué nu, déclaré de deux façons.',
      },
      {
        genre: 'texte',
        surtitre: 'L’enjeu',
        titre: 'Le micro-foncier est le régime par défaut.',
        texte: 'Beaucoup de bailleurs y restent par habitude. Sur le cas qui suit, l’écart dépasse 2 000 € par an.',
      },
      {
        genre: 'chiffre',
        surtitre: 'Régime 1 · Le micro-foncier',
        chiffre: '30 %',
        titre: 'Un abattement forfaitaire qui remplace toutes les charges.',
        texte:
          'Possible jusqu’à 15 000 € de loyers bruts par an pour le foyer. On déclare le brut, l’impôt calcule le reste.',
      },
      {
        genre: 'texte',
        surtitre: 'Régime 2 · Le réel',
        titre: 'On déduit les charges réellement payées.',
        liste: [
          'Intérêts et frais d’emprunt',
          'Taxe foncière et charges de copropriété non récupérables',
          'Assurances, frais de gestion',
          'Travaux de réparation, d’entretien et d’amélioration',
        ],
        note: 'Sur option, irrévocable pendant trois ans. Déclaration 2044.',
      },
      {
        genre: 'calcul',
        surtitre: 'Le cas',
        titre: 'Loyers : 9 600 € par an',
        lignes: [
          ['Intérêts d’emprunt', '3 000 €'],
          ['Taxe foncière', '900 €'],
          ['Copropriété non récupérable', '600 €'],
          ['Assurance propriétaire non occupant', '150 €'],
          ['Travaux', '2 500 €'],
        ],
        total: ['Charges réelles', '7 150 €'],
      },
      {
        genre: 'calcul',
        surtitre: 'Au micro-foncier',
        titre: 'On taxe 70 % des loyers',
        lignes: [
          ['Loyers', '9 600 €'],
          ['Abattement de 30 %', '− 2 880 €'],
          ['Revenu imposable', '6 720 €'],
          ['Impôt 30 % + prélèvements sociaux 17,2 %', '× 47,2 %'],
        ],
        total: ['À payer', '3 172 €'],
      },
      {
        genre: 'calcul',
        surtitre: 'Au réel',
        titre: 'On taxe ce qui reste vraiment',
        lignes: [
          ['Loyers', '9 600 €'],
          ['Charges réelles', '− 7 150 €'],
          ['Revenu imposable', '2 450 €'],
          ['Impôt 30 % + prélèvements sociaux 17,2 %', '× 47,2 %'],
        ],
        total: ['À payer', '1 156 €'],
      },
      {
        genre: 'comparaison',
        titre: 'Environ 2 000 € d’écart par an',
        barres: [
          { libelle: 'Micro-foncier', valeur: 3172, texte: '3 172 €' },
          { libelle: 'Réel', valeur: 1156, texte: '1 156 €' },
        ],
        texte: 'La règle : le réel devient intéressant dès que les charges réelles dépassent 30 % des loyers.',
      },
      {
        genre: 'sources',
        textes: [
          'Code général des impôts, articles 28, 31 et 32',
          'Code de la sécurité sociale, article L. 136-8',
          'BOFiP-RFPI (revenus fonciers)',
        ],
        note: 'Exemple pédagogique pour un contribuable dans la tranche à 30 %. Faites le calcul sur votre propre situation.',
      },
      {
        genre: 'appel',
        titre: 'Faites le calcul avec vos chiffres',
        texte: 'Le simulateur gratuit compare les deux régimes sur votre bien.',
        lien: 'formation-locatif.com/simulateurs/micro-foncier-ou-reel',
      },
    ],
  },
  {
    numero: '003',
    slug: '003-dossier-locataire-interdit',
    rubrique: 'Location',
    niveau: 1,
    module: 'Module 1.7',
    diapos: [
      {
        genre: 'couverture',
        titre: 'Dossier locataire : ce qui est interdit',
        sousTitre: 'Ce que vous n’avez pas le droit de demander à un candidat, et ce que vous pouvez exiger.',
      },
      {
        genre: 'texte',
        surtitre: 'L’enjeu',
        titre: 'La liste des pièces est limitative.',
        texte:
          'Un décret fixe ce qu’un bailleur peut demander, pour le candidat comme pour sa caution. Tout ce qui n’y figure pas est exclu.',
      },
      {
        genre: 'texte',
        surtitre: 'Interdit · 1',
        titre: 'Les documents bancaires',
        liste: [
          'Relevés bancaires',
          'Attestation de bonne tenue de compte',
          'Attestation d’absence de crédit',
          'Autorisation de prélèvement automatique',
        ],
      },
      {
        genre: 'texte',
        surtitre: 'Interdit · 2',
        titre: 'La vie privée',
        liste: [
          'Carte Vitale, dossier médical',
          'Contrat de mariage, certificat de concubinage',
          'Jugement de divorce (sauf l’extrait sur l’autorité parentale)',
          'Extrait de casier judiciaire',
          'Photo d’identité en dehors de la pièce d’identité',
        ],
      },
      {
        genre: 'texte',
        surtitre: 'Interdit · 3',
        titre: 'L’argent d’avance',
        liste: ['Chèque de réservation', 'Dépôt sur un compte bloqué'],
        note: 'Et pour un indépendant : pas plus de deux bilans.',
      },
      {
        genre: 'chiffre',
        surtitre: 'La sanction',
        tampon: 'Attention',
        chiffre: '3 000 €',
        titre: 'Amende administrative maximale pour un particulier.',
        texte: 'Jusqu’à 15 000 € pour une société.',
      },
      {
        genre: 'categories',
        surtitre: 'Ce que vous pouvez demander',
        titre: 'Une pièce par catégorie, au choix du candidat',
        categories: [
          { nom: 'Identité', exemples: 'Carte d’identité, passeport, permis de conduire ou titre de séjour' },
          { nom: 'Domicile', exemples: 'Trois dernières quittances, attestation d’hébergement ou taxe foncière' },
          { nom: 'Activité', exemples: 'Contrat de travail, attestation de l’employeur, Kbis, carte d’étudiant' },
          { nom: 'Ressources', exemples: 'Dernier avis d’imposition, trois derniers bulletins de salaire' },
        ],
      },
      {
        genre: 'texte',
        tampon: 'À retenir',
        titre: 'En résumé',
        liste: [
          'Quatre catégories, une pièce par catégorie.',
          'Rien sur le compte bancaire, la santé ou la vie de couple.',
          'Ni chèque de réservation, ni dépôt sur un compte bloqué.',
        ],
      },
      {
        genre: 'sources',
        textes: [
          'Loi n° 89-462 du 6 juillet 1989, article 22-2',
          'Décret n° 2015-1437 du 5 novembre 2015 (pièces justificatives)',
        ],
        note: 'Information générale, pas un conseil personnalisé. Pour votre cas : l’ADIL de votre département.',
      },
      {
        genre: 'appel',
        titre: 'Tous les outils du bailleur, gratuits',
        texte: 'Simulateurs et lettres types, sans inscription.',
        lien: 'formation-locatif.com',
      },
    ],
  },
];
