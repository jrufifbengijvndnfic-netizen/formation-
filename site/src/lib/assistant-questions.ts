/**
 * Questions fréquentes de l'outil « Poser une question », telles qu'un bailleur les écrit, chacune
 * rattachée à la fiche de la formation qui y répond. Elles servent deux fois :
 * - rattachées à leur fiche, elles l'aident à ressortir pour toutes les questions voisines (mots du
 *   langage courant que le texte de la formation n'emploie pas) ;
 * - affichées par thème sur la page de l'outil, elles montrent ce qu'on peut demander.
 *
 * Seules les questions sont écrites ici : la réponse reste le passage de la formation. Cible :
 * - « l:1.7:Le dossier du candidat » : passage de leçon du module 1.7 dont le titre commence ainsi ;
 * - « p:2.14:points-cles » (ou « pieges-a-eviter ») : rubrique d'un module ;
 * - « g:treve-hivernale » : terme du glossaire ; « s:dpe-location » : simulateur ;
 * - « f:f4 » : modèle de lettre.
 * Une cible introuvable (formation modifiée) arrête le build et le test.
 */

export interface ThemeQuestions {
  theme: string;
  questions: [question: string, cible: string][];
}

export const QUESTIONS_FREQUENTES: ThemeQuestions[] = [
  {
    theme: 'DPE, décence et travaux',
    questions: [
      ['Mon logement est classé G : puis-je encore le louer ?', 'l:3.9:Le calendrier de la décence'],
      ['Mon logement est classé G : quels travaux faire ?', 'l:3.9:Bâtir un plan de travaux'],
      ['Ma maison est classée G : que dois-je faire ?', 'l:3.9:Bâtir un plan de travaux'],
      [
        'À partir de quand un logement classé F sera-t-il interdit à la location ?',
        'l:3.9:Le calendrier de la décence',
      ],
      ['Un logement classé E pourra-t-il toujours être loué ?', 'l:3.9:Le calendrier de la décence'],
      ['Puis-je augmenter le loyer d’un logement classé F ou G ?', 'l:3.9:Le calendrier de la décence'],
      ['Mon logement est-il encore louable ?', 's:dpe-location'],
      ['Mon DPE date de 2019 : est-il encore valable ?', 'l:1.5:Les diagnostics obligatoires'],
      ['Quels diagnostics dois-je remettre au locataire ?', 'l:1.5:Les diagnostics obligatoires'],
      ['Quels sont les critères d’un logement décent ?', 'l:1.4:Critères de décence'],
      ['Que risque-t-on à louer un logement non décent ?', 'l:1.4:Conséquences de l’indécence'],
      ['Qu’est-ce que le permis de louer ?', 'g:permis-de-louer'],
      ['Par quels travaux commencer pour gagner une classe DPE ?', 'l:3.9:Bâtir un plan de travaux'],
      ['Quelles aides pour financer une rénovation énergétique ?', 'l:3.9:Les aides et leviers'],
      ['Puis-je faire des travaux avec le locataire en place ?', 'l:3.9:Travailler avec le locataire en place'],
      ['Faut-il un audit énergétique pour vendre ?', 'l:3.9:L’audit énergétique'],
      ['Quel taux de TVA pour des travaux de rénovation ?', 'l:2.3:TVA sur travaux'],
    ],
  },
  {
    theme: 'Fixer et faire évoluer le loyer',
    questions: [
      ['Comment fixer le loyer de mon logement ?', 'l:1.6:Étape 1'],
      ['Quelles règles de loyer s’appliquent dans ma commune ?', 'l:1.6:Étape 2'],
      ['Comment calculer la révision annuelle du loyer ?', 'l:2.1:La révision annuelle'],
      ['J’ai oublié de réviser le loyer : puis-je le faire rétroactivement ?', 'l:2.1:La révision annuelle'],
      ['Quel trimestre de l’IRL faut-il utiliser ?', 'l:2.1:La révision annuelle'],
      ['Puis-je augmenter le loyer entre deux locataires en zone tendue ?', 'l:2.1:La relocation en zone tendue'],
      ['Comment savoir si ma commune est en zone tendue ?', 'l:1.2:Zone tendue'],
      ['Comment fonctionne l’encadrement des loyers ?', 'l:2.1:L’encadrement des loyers'],
      ['Quand peut-on demander un complément de loyer ?', 'l:2.1:L’encadrement des loyers'],
      ['Mon loyer est trop bas : puis-je le réévaluer au renouvellement du bail ?', 'l:2.1:La réévaluation'],
      ['Quel est le loyer maximal à la relocation ?', 's:loyer-relocation'],
      ['Mon loyer respecte-t-il l’encadrement ?', 's:encadrement-loyers'],
    ],
  },
  {
    theme: 'Trouver un locataire et signer le bail',
    questions: [
      ['Quels documents puis-je demander à un candidat locataire ?', 'l:1.7:Le dossier du candidat'],
      ['Quelles pièces est-il interdit de demander à un candidat ?', 'l:1.7:Ce qui est interdit de demander'],
      ['Comment évaluer la solvabilité d’un locataire ?', 'l:1.7:Évaluer la solvabilité'],
      ['Caution, Visale ou assurance loyers impayés : que choisir ?', 'l:1.7:Choisir la garantie'],
      ['Puis-je demander un garant si j’ai une assurance loyers impayés ?', 'l:1.7:Choisir la garantie'],
      ['Que doit contenir une annonce de location ?', 'l:1.7:L’annonce'],
      ['Comment refuser un candidat sans discriminer ?', 'l:1.7:Ne pas discriminer'],
      ['Location vide ou meublée : que choisir ?', 'l:1.3:Choisir le bon type de location'],
      ['Quel mobilier est obligatoire dans un logement meublé ?', 'l:1.2:Logement vide ou meublé'],
      ['Quelles mentions sont obligatoires dans le bail ?', 'l:1.8:Les mentions obligatoires'],
      ['Quels documents faut-il annexer au bail ?', 'l:1.8:Les annexes obligatoires'],
      ['Quelles clauses sont interdites dans un bail ?', 'l:1.8:Les clauses interdites'],
      ['Quelle est la durée d’un bail vide ou meublé ?', 'l:1.8:Durée et renouvellement'],
      ['Quel est le montant maximal du dépôt de garantie ?', 'l:1.2:Dépôt de garantie'],
      ['Comment réussir l’état des lieux d’entrée ?', 'l:1.9:Principe'],
      ['Le locataire refuse de signer l’état des lieux : que faire ?', 'l:1.9:À défaut d’accord'],
      ['Comment tenir compte de la vétusté ?', 'l:1.9:Vétusté'],
    ],
  },
  {
    theme: 'Vie du bail : charges, réparations, assurances',
    questions: [
      ['Quelles charges puis-je récupérer auprès du locataire ?', 'l:2.2:La liste limitative'],
      ['Quelles charges ne sont jamais récupérables ?', 'l:2.2:Ce qui n’est jamais récupérable'],
      ['Comment faire la régularisation annuelle des charges ?', 'l:2.2:Provisions et régularisation'],
      ['Provision ou forfait de charges : quelle différence ?', 'l:1.2:Provision et régularisation'],
      ['Qui paie l’entretien de la chaudière ?', 'l:2.3:Qui paie quoi'],
      ['Qui paie les réparations : le propriétaire ou le locataire ?', 'l:2.3:Qui paie quoi'],
      ['Le locataire peut-il faire des travaux dans le logement ?', 'l:2.3:Les travaux du locataire'],
      ['Puis-je faire des travaux pendant le bail ?', 'l:2.3:Les travaux du bailleur pendant le bail'],
      ['Que faire en cas de dégât des eaux ?', 'l:2.3:Les sinistres'],
      ['Le locataire doit-il être assuré ?', 'l:1.10:Assurance habitation'],
      ['Ai-je besoin d’une assurance propriétaire non occupant ?', 'l:2.4:L’assurance propriétaire non occupant'],
      ['Suis-je obligé de fournir une quittance de loyer ?', 'l:1.10:Paiement et quittance'],
      ['Puis-je entrer dans le logement loué quand je veux ?', 'l:1.10:Visites et accès'],
      ['Mon locataire peut-il sous-louer ?', 'l:2.5:La sous-location'],
      ['Dois-je déclarer l’occupation de mon logement aux impôts ?', 'l:2.9:Déclaration d’occupation des biens'],
    ],
  },
  {
    theme: 'Fin du bail et dépôt de garantie',
    questions: [
      ['Quel préavis pour un locataire qui veut partir ?', 'l:1.11:Le congé donné par le locataire'],
      ['Mon locataire s’en va : quel préavis doit-il respecter ?', 'l:1.11:Le congé donné par le locataire'],
      ['Quand le préavis du locataire est-il réduit à un mois ?', 'l:1.11:Le congé donné par le locataire'],
      ['Comment donner congé à mon locataire ?', 'l:1.11:Le congé donné par le bailleur'],
      ['Puis-je vendre mon logement loué ?', 'l:1.11:Le congé donné par le bailleur'],
      ['Puis-je reprendre mon logement pour y habiter ?', 'l:1.11:Le congé donné par le bailleur'],
      ['À quelles dates puis-je donner congé ?', 's:dates-de-conge'],
      ['En combien de temps rendre le dépôt de garantie ?', 'l:1.11:Restitution du dépôt de garantie'],
      ['Que se passe-t-il si je rends le dépôt de garantie en retard ?', 'l:1.11:Restitution du dépôt de garantie'],
      ['Quelles retenues puis-je faire sur le dépôt de garantie ?', 'l:1.11:Restitution du dépôt de garantie'],
      [
        'Le locataire a abîmé le logement : que puis-je retenir sur le dépôt ?',
        'l:1.11:Restitution du dépôt de garantie',
      ],
      ['En cas de désaccord, qui établit l’état des lieux ?', 'l:1.9:À défaut d’accord'],
      ['Combien coûte un retard de restitution du dépôt de garantie ?', 's:depot-de-garantie'],
      ['Comment faire l’état des lieux de sortie ?', 'l:1.9:Principe'],
    ],
  },
  {
    theme: 'Impayés et litiges',
    questions: [
      ['Mon locataire ne paie plus son loyer : que faire ?', 'l:2.13:Réagir au premier incident'],
      ['Comment se déroule une procédure d’expulsion ?', 'l:2.13:La procédure judiciaire'],
      ['Combien de temps dure une procédure pour impayé ?', 'l:2.13:La procédure judiciaire'],
      ['Puis-je changer les serrures si mon locataire ne paie pas ?', 'l:2.13:La procédure judiciaire'],
      ['Qu’est-ce que la trêve hivernale ?', 'g:treve-hivernale'],
      ['Comment prévenir les impayés ?', 'l:2.13:Prévenir'],
      ['Que faire face à un squat ?', 'l:3.10:Squat'],
      ['Comment régler un litige sans aller au tribunal ?', 'l:3.10:Les voies amiables'],
      ['Quels délais de prescription faut-il connaître ?', 'l:3.10:Les délais à connaître'],
      ['Où trouver une aide juridique gratuite ?', 'l:3.10:Où trouver de l’aide'],
      ['Comment relancer un locataire en retard de paiement ?', 'f:f3'],
      ['Comment envoyer une mise en demeure de payer ?', 'f:f4'],
    ],
  },
  {
    theme: 'Impôts',
    questions: [
      ['Micro-foncier ou régime réel : lequel choisir ?', 'l:2.6:Micro ou réel'],
      ['Quel est le plafond du micro-foncier ?', 'l:2.6:Le micro-foncier'],
      ['Quelles charges puis-je déduire de mes revenus fonciers ?', 'l:2.6:Le régime réel'],
      ['Comment fonctionne le déficit foncier ?', 'l:2.6:Le déficit foncier'],
      ['Comment déclarer mes loyers aux impôts ?', 'l:2.6:Déclarer'],
      ['Quels prélèvements sociaux sur mes loyers ?', 'l:2.6:Prélèvements sociaux'],
      ['Quelle est ma tranche marginale d’imposition ?', 'l:1.2:Tranche marginale'],
      ['LMNP ou LMP : quelle différence ?', 'l:2.7:LMNP ou LMP'],
      ['Micro-BIC ou régime réel en meublé : que choisir ?', 'l:2.8:Choisir son régime fiscal'],
      ['Comment fonctionne l’amortissement en LMNP ?', 'l:2.7:L’amortissement'],
      ['Que se passe-t-il à la revente d’un bien en LMNP ?', 'l:2.7:La revente'],
      ['Quelles démarches pour démarrer en location meublée ?', 'l:2.7:Formalités de démarrage'],
      ['Dois-je payer la CFE en location meublée ?', 'l:2.7:La CFE'],
      ['Combien d’impôt sur la plus-value à la revente ?', 'l:3.5:Calcul'],
      ['Quel impôt quand je revends mon appartement ?', 'l:3.5:Calcul'],
      ['Au bout de combien d’années la plus-value est-elle exonérée ?', 'l:3.5:Abattements pour durée de détention'],
      ['Suis-je concerné par l’IFI ?', 'l:3.6:Qui est concerné'],
      ['Qu’est-ce que le dispositif Jeanbrun ?', 'g:jeanbrun-dispositif'],
      ['Le Pinel existe-t-il encore ?', 'l:3.4:Les dispositifs éteints'],
    ],
  },
  {
    theme: 'Investir et financer',
    questions: [
      ['Comment calculer la rentabilité d’un investissement locatif ?', 'l:1.12:Les formules de base'],
      ['Quelle différence entre rentabilité brute et nette ?', 'l:1.12:Les formules de base'],
      ['Combien puis-je emprunter pour un investissement locatif ?', 'l:2.10:Les normes du Haut Conseil'],
      ['Comment la banque compte-t-elle mes loyers ?', 'l:2.10:Comment la banque compte vos loyers'],
      ['Qu’est-ce que l’effet de levier ?', 'g:effet-de-levier'],
      ['Combien coûtent les frais de notaire ?', 'l:2.11:Les frais d’acquisition'],
      ['Que vérifier avant d’acheter en copropriété ?', 'l:2.11:Analyser la copropriété'],
      ['Faut-il créer une SCI pour investir ?', 'l:3.3:La société civile immobilière'],
      ['SCI à l’IR ou à l’IS : que choisir ?', 'l:3.3:La SCI à l’impôt sur les sociétés'],
      ['Gérer moi-même ou passer par une agence ?', 'p:2.14:points-cles'],
      ['Comment transmettre un bien locatif à mes enfants ?', 'l:3.7:Donation simple et donation-partage'],
      ['Qu’est-ce que le démembrement de propriété ?', 'g:demembrement'],
    ],
  },
  {
    theme: 'Situations du quotidien',
    questions: [
      ['Puis-je interdire les animaux dans mon logement ?', 'l:1.8:Les clauses interdites'],
      ['Mon locataire touche les APL : puis-je les recevoir directement ?', 'l:1.10:Aides au logement'],
      ['Mon locataire est décédé : que devient le bail ?', 'l:1.10:Situations courantes'],
      ['Mon locataire a abandonné le logement : que faire ?', 'l:1.10:Situations courantes'],
      ['Mon locataire se sépare de son conjoint : qui doit le loyer ?', 'l:1.10:Couples'],
      ['Mon logement est vide depuis longtemps : dois-je payer une taxe ?', 'l:2.9:Taxes sur les logements vacants'],
      ['Charges de copropriété : lesquelles payer, lesquelles refacturer ?', 'l:2.2:En copropriété'],
      ['À quoi sert l’assemblée générale de copropriété ?', 'l:2.12:L’assemblée générale'],
      ['Qu’est-ce que le fonds de travaux de la copropriété ?', 'l:2.12:Le fonds de travaux'],
      ['Nous sommes plusieurs propriétaires : comment fonctionne l’indivision ?', 'l:3.3:L’indivision'],
      ['Quels papiers conserver et combien de temps ?', 'l:2.14:Documents à conserver'],
    ],
  },
  {
    theme: 'Courte durée, colocation et autres baux',
    questions: [
      ['Puis-je louer mon logement sur Airbnb ?', 'l:3.8:Le cadre juridique en 2026'],
      [
        'Combien de jours par an puis-je louer ma résidence principale en courte durée ?',
        'l:3.8:Le cadre juridique en 2026',
      ],
      ['Faut-il un numéro d’enregistrement pour louer en courte durée ?', 'l:3.8:Le cadre juridique en 2026'],
      ['Comment sont imposés les meublés de tourisme ?', 'l:3.8:Fiscalité'],
      ['Comment fonctionne une colocation ?', 'l:2.5:La colocation'],
      ['Qu’est-ce qu’un bail mobilité ?', 'g:bail-mobilite'],
      ['Puis-je louer à un membre de ma famille ?', 'l:2.5:Louer à un membre de sa famille'],
      ['Puis-je louer une chambre chez moi ?', 'l:2.5:Louer une chambre chez soi'],
      ['Comment louer un parking ou un box ?', 'l:3.11:Parkings, boxes, caves'],
      ['Qu’est-ce qu’un bail commercial ?', 'g:bail-commercial'],
    ],
  },
];
