# Feuille de route : implémenter les 34 impératifs dans la formation

**Projet « L'immobilier locatif en France » · document de travail du 24 septembre 2026**

Ce document est le chemin complet, étape par étape, pour passer du contenu actuel à une formation vendable. Il reprend les 34 impératifs du référentiel `imperatifs-formation-qui-se-vend.md` et les transforme en tâches ordonnées.

## État d'avancement (mis à jour le 25 septembre 2026, version 011 du site)

Légende : [x] fait · [~] fait en partie, reste une information ou une action du propriétaire · [ ] à faire.

- [x] **Phase 0** — sept décisions prises (tableau ci-dessous).
- [x] 1.1 Promesse — `offre/promesse.md`, reprise sur l'accueil et la page de vente.
- [x] 1.2 Cible et exclusion — `offre/cible.md`, section « Pour qui » de la page de vente.
- [x] 1.3 Argumentaire contre le gratuit — `offre/pourquoi-payer.md`, tableau sur la page de vente.
- [x] 1.4 Prix et structure — `offre/prix.md` (paiement en plusieurs fois : dépend de la plateforme de paiement).
- [~] 1.5 Garantie — `offre/garantie.md` : proposition de 14 jours à valider, puis à faire relire (phase 2.3).
- [x] 1.6 Bonus — `offre/bonus.md`, bloc « Inclus » de la page de vente.
- [~] 2.1 Protéger le contenu payant — frontière écrite (`offre/frontiere-gratuit-payant.md`) et plan technique (`offre/plan-paiement-et-acces.md`) ; **développement à lancer après votre accord sur le plan et la création du compte Stripe**.
- [ ] 2.2 Paiement — même plan ; nécessite votre compte Stripe.
- [~] 2.3 Documents juridiques — pages en ligne depuis la version 009 ; reste l'identité du vendeur, le médiateur, la mention de TVA et la **relecture par un juriste** [PRO].
- [x] 2.4 Revue des textes — `conformite/revue-textes.md`.
- [~] 2.5 Accueil après achat — textes prêts (`offre/accueil-apres-achat.md`), à brancher sur le paiement.
- [x] 3.1 Parcours de la première heure — page « Commencer ici » (`/commencer/`).
- [x] 3.2 Une action par module — 38 actions « À faire maintenant » (`files/…/actions.md`), affichées à la fin de chaque module.
- [x] 3.3 Accompagnement — questions par e-mail, réponse sous 72 heures ouvrées (page de vente, FAQ, CGV).
- [~] 3.4 Politique de mise à jour — page `/mises-a-jour/` et journal `MISES-A-JOUR.md` ; durée d'inclusion à confirmer.
- [x] 4.1 Page de vente — 12 blocs en place (version 009, complétée en 011) ; test des 5 secondes à 10/12.
- [x] 4.2 Produit visible — programme complet, module 1.1 et checklist gratuits, 24 simulateurs publics.
- [~] 4.3 Mobile — testé en émulation (320 à 1440 px) ; **test sur un vrai téléphone à faire** (`TESTS-MANUELS.md`).
- [~] 4.4 E-mails — formulaire prêt, séquence écrite (`audit/textes-proposes.md`) ; service d'e-mailing à choisir.
- [~] 4.5 Mesure — événements en place (sans cookie) ; activer Vercel Analytics et Google Search Console.
- [~] 5.1 Page « méthode et sources » — en ligne (`/methode-et-sources/`) ; votre présentation d'auteur à fournir.
- [ ] 5.2 Relecture professionnelle [PRO] — à demander.
- [ ] 5.3 Dix premiers élèves — à recruter.
- [ ] 5.4 Intégrer les retours — après 5.3.
- [ ] Phases 6 à 8 — après le paiement.

## Comment s'en servir

Garde ce fichier à la racine du projet et coche les cases au fur et à mesure. Chaque tâche suit le même format :

- **Objectif** : ce que la tâche produit.
- **À faire** : les gestes concrets.
- **Livrable** : le fichier ou l'élément qui doit exister à la fin.
- **Fini quand** : le critère qui permet de cocher sans se mentir.
- **Impératif** : la référence du référentiel.

Les tâches marquées **[BLOQUANT]** empêchent toute vente tant qu'elles ne sont pas faites. Celles marquées **[PRO]** demandent une validation par un professionnel.

**Ordre de lecture.** Ne saute pas les phases. La phase 1 conditionne tout le reste : tant que la promesse et le prix ne sont pas écrits, la page de vente ne peut pas être rédigée, et le site serait à refaire.

**Durée réaliste** pour un travail en parallèle des études : 8 à 10 semaines jusqu'au lancement, puis une routine mensuelle.

---

## Vue d'ensemble

| Phase | Contenu | Durée | Impératifs couverts |
|---|---|---|---|
| 0 | Sept décisions à prendre | 2 jours | B1, B2 |
| 1 | Positionnement, promesse et offre | 1 semaine | A1, A2, A3, A4, B1, B2, B3, B4 |
| 2 | Conformité et paiement | 1 à 2 semaines | D1, D5, F1, F2, F3, F4, F5 |
| 3 | Améliorations pédagogiques | 1 semaine | C2, C3, C7, C8 |
| 4 | Site, page de vente, e-mails, mesure | 2 à 3 semaines | D2, D3, D4, D6, D7 |
| 5 | Preuves et légitimité | 2 semaines, en parallèle | A5, E4 |
| 6 | Lancement | 1 semaine | tous |
| 7 | Acquisition par le référencement | continu | E1, E2, E3 |
| 8 | Routine d'entretien | continu | C8, E3, E4 |

Les phases 3 et 5 peuvent tourner en parallèle des phases 2 et 4. La phase 5 est longue parce qu'elle dépend d'autres personnes : commence-la tout de suite.

---

## Phase 0 : les sept décisions à prendre maintenant

| # | Décision | Options | Ta réponse (25 septembre 2026) |
|---|---|---|---|
| 1 | Douleur principale mise en avant | DPE et logement bientôt illouable · impayé et procédure · choix du régime fiscal · démarrage du premier investissement | **DPE et logement bientôt illouable** (échéance légale : classe F non décente au 1er janvier 2028) |
| 2 | Cible prioritaire | futur premier investisseur · bailleur déjà propriétaire · optimisateur fiscal | **Bailleur déjà propriétaire** |
| 3 | Prix | entre 150 € et 400 €, prix unique | **Conservé : 97 € (niveau 1), 197 € (niveau 2), 297 € (niveau 3), 447 € les trois niveaux** — écart assumé avec la recommandation « prix unique » |
| 4 | Structure de l'offre | offre unique · offre unique plus niveau 1 en produit d'appel | **Trois niveaux et une formation complète** ; le niveau 1 à 97 € joue le rôle de produit d'appel |
| 5 | Accompagnement que tu peux tenir | aucun, assumé · e-mail de questions · session mensuelle de questions-réponses | **Questions par e-mail, réponse sous 72 heures ouvrées** |
| 6 | Solution technique de vente | plateforme clé en main · ton site plus Stripe et connexion membre · site vitrine plus plateforme | **Site actuel + Stripe + comptes membres** |
| 7 | Anglais | pas maintenant · pilote de dix pages · version complète | **Pas maintenant** |

**Fini quand** les sept lignes sont remplies. ✔

---

## Phase 1 : positionnement, promesse et offre

C'est la phase la plus courte et la plus déterminante. Tout le reste en découle.

### 1.1 Écrire la promesse [Impératifs A1, A2]

**Objectif.** Une phrase que n'importe qui comprend en cinq secondes.

**À faire.** Écris dix versions, puis garde la meilleure. Contraintes : moins de quinze mots, un résultat concret, aucune promesse de gain ni de rendement. Ajoute trois preuves de capacité, du type « vous saurez faire X ».

**Livrable.** Un fichier `offre/promesse.md` contenant la promesse, les trois preuves de capacité et les dix variantes écartées, utiles plus tard pour les tests.

**Fini quand** tu peux montrer la phrase à quelqu'un qui ne connaît pas le projet et qu'il reformule correctement ce que la formation apporte.

### 1.2 Définir la cible et l'exclusion [Impératif A3]

**Objectif.** Nommer qui achète et qui ne doit pas acheter.

**À faire.** Rédige deux ou trois profils en trois lignes chacun : situation, problème, niveau de départ. Puis rédige la liste « cette formation n'est pas pour vous si » : vous cherchez un conseil personnalisé sur votre situation, une méthode pour vous enrichir rapidement, ou du droit immobilier étranger.

**Livrable.** `offre/cible.md`.

**Fini quand** la section « pour qui, et pour qui ce n'est pas » est prête à être collée dans la page de vente.

### 1.3 Construire l'argumentaire contre le gratuit [Impératif A4]

**Objectif.** Répondre à l'objection numéro un de ton sujet.

**À faire.** Fabrique un tableau comparatif honnête, sans dénigrer les sources officielles qui sont excellentes. Colonnes : « chercher seul » et « suivre la formation ». Lignes : temps passé, sources à croiser, risque d'erreur, calculs à refaire soi-même, modèles à rédiger, suivi des changements de loi.

Appuie-toi sur des éléments vérifiables de ton propre produit : 38 modules ordonnés, 24 simulateurs testés, 10 modèles de lettres, 180 termes définis, une date de mise à jour et une page des échéances à venir.

**Livrable.** `offre/pourquoi-payer.md`.

**Fini quand** le tableau tient sur un écran et ne contient aucune affirmation que tu ne peux pas prouver.

### 1.4 Fixer le prix et la structure [Impératifs B1, B2]

**Objectif.** Un prix lisible et défendable.

**À faire.** Fixe le prix décidé en phase 0. Ajoute un paiement en deux ou trois fois. Prépare deux comparaisons honnêtes pour la page de vente. N'affiche aucun prix barré qui n'aurait jamais été pratiqué.

**Livrable.** `offre/prix.md` avec le prix, les modalités et les comparaisons.

**Fini quand** tu peux justifier le prix à l'oral en trois phrases.

### 1.5 Écrire la garantie [Impératif B3]

**Objectif.** Réduire le risque perçu.

**À faire.** Choisis une durée entre 14 et 30 jours. Écris les conditions en langage simple : qui peut demander, comment, dans quel délai, et sous quelle forme est le remboursement. Prépare cette rédaction pour la faire valider en phase 2, car elle croise le droit de rétractation.

**Livrable.** `offre/garantie.md`.

**Fini quand** un lecteur extérieur comprend la garantie sans poser de question.

### 1.6 Nommer les bonus [Impératif B4]

**Objectif.** Transformer tes annexes en arguments.

**À faire.** Donne un nom et une utilité à chaque ensemble : la boîte à calculs, le classeur de lettres, les checklists, le calendrier des échéances 2026-2028. Associe chaque bonus à l'objection qu'il lève.

**Livrable.** `offre/bonus.md`.

**Fini quand** chaque bonus est relié à une objection précise.

---

## Phase 2 : conformité et paiement

Cette phase est bloquante. Vendre sans ces éléments t'expose juridiquement et détruit la confiance.

### 2.1 Protéger le contenu payant [BLOQUANT] [Impératif D1]

**Objectif.** Qu'on ne puisse pas lire la formation sans payer.

**À faire.** Mets en œuvre la solution choisie en phase 0. Trace la frontière entre le public et le payant. Vérifie aussi que le contenu payant n'est pas accessible par une adresse directe, et que le PDF n'est pas déposé dans un dossier public du site.

**Livrable.** Un espace membre fonctionnel et un tableau `offre/frontiere-gratuit-payant.md`.

**Fini quand** tu as essayé, en navigation privée et sans compte, d'atteindre un module payant et que tu n'y arrives pas.

### 2.2 Mettre en place le paiement [BLOQUANT] [Impératif D1]

**Objectif.** Encaisser proprement.

**À faire.** Configure le paiement, le paiement fractionné, la facture automatique et l'e-mail de confirmation. Fais un achat test avec une carte réelle, puis un remboursement test.

**Livrable.** Parcours d'achat opérationnel.

**Fini quand** un achat test aboutit à un accès immédiat, une facture et un e-mail reçus.

### 2.3 Écrire les documents juridiques [BLOQUANT] [PRO] [Impératifs F1, F2]

**Objectif.** Être en règle avant la première vente.

**À faire.** Mentions légales, CGV, confidentialité, cookies, médiateur, mention de TVA. Droit de rétractation du contenu numérique : deux cases distinctes, jamais pré-cochées (accès immédiat, renoncement), confirmées dans l'e-mail.

**Livrable.** Les pages juridiques en ligne.

**Fini quand** un juriste a relu les conditions de vente et le parcours d'achat.

### 2.4 Nettoyer tout ce qui pourrait être trompeur [Impératifs F3, F4, F5]

**Livrable.** Une revue écrite, `conformite/revue-textes.md`.

**Fini quand** aucune affirmation du site n'est invérifiable.

### 2.5 Soigner l'accueil après achat [Impératif D5]

**Livrable.** E-mail et page de remerciement.

**Fini quand** l'achat test t'a conduit sans hésitation jusqu'à la première leçon.

---

## Phase 3 : améliorations pédagogiques

### 3.1 Créer le parcours de la première heure [Impératif C2]

**Livrable.** Une page `Commencer ici`.

**Fini quand** un testeur obtient un résultat chiffré personnel en moins d'une heure.

### 3.2 Ajouter une action par module [Impératif C3]

**Livrable.** Une action « à faire maintenant » pour chacun des 38 modules.

**Fini quand** les 38 modules ont leur action et que la validation ne signale aucune erreur de structure.

### 3.3 Décider et annoncer l'accompagnement [Impératif C7]

**Livrable.** Une phrase dans la page de vente et dans les conditions de vente.

### 3.4 Écrire la politique de mise à jour [Impératif C8]

**Livrable.** `MISES-A-JOUR.md`, publié sur le site.

---

## Phase 4 : site, page de vente, e-mails et mesure

### 4.1 Construire la page de vente [BLOQUANT] [Impératif D2]

Douze blocs : promesse et bouton, problème et coût, solution et mécanisme, programme, démonstration, pour qui et pour qui ce n'est pas, auteur et méthode, preuves, offre et prix, garantie, FAQ d'au moins quinze objections, bouton final.

**Fini quand** la page passe le test des cinq secondes : au moins 10 sur 12.

### 4.2 Rendre le produit visible [Impératif D3]
### 4.3 Vérifier le parcours mobile [Impératif D4]
### 4.4 Capter les e-mails et écrire la séquence [Impératif D6]
### 4.5 Installer la mesure [Impératif D7]

---

## Phase 5 : preuves et légitimité

### 5.1 Créer la page « méthode et sources » [Impératif A5]
### 5.2 Obtenir une relecture professionnelle [PRO] [Impératif A5]
### 5.3 Recruter dix premiers élèves [Impératif E4]
### 5.4 Intégrer les retours [Impératifs C1 à C6]

---

## Phase 6 : lancement

6.1 Répétition générale · 6.2 Objectifs de départ (`objectifs.md`) · 6.3 Ouverture des ventes.

## Phase 7 : acquisition par le référencement

7.1 Pages qui attirent · 7.2 Crédibilité perçue · 7.3 Actualité réglementaire · 7.4 Anglais (décision : pas maintenant).

## Phase 8 : routine d'entretien

| Fréquence | À faire |
|---|---|
| Chaque semaine | Lire les actualités de service-public et de l'ANIL ; répondre aux questions des élèves ; noter les objections entendues |
| Chaque mois | Relire le tableau de bord ; publier un article ; demander un avis aux nouveaux élèves |
| Chaque trimestre | Mettre à jour l'IRL et les taux d'usure ; relire la grille des 34 impératifs ; tester une amélioration de la page de vente |
| Chaque année | Intégrer la loi de finances et la LFSS ; réviser les chiffres clés, le calendrier et la page des échéances ; publier le journal des mises à jour |

---

## Correspondance impératifs et tâches

| Impératif | Tâche | Phase |
|---|---|---|
| A1 Problème précis | 1.1, 4.1 | 1 et 4 |
| A2 Promesse de transformation | 1.1 | 1 |
| A3 Cible nommée | 1.2 | 1 |
| A4 Raison de payer | 1.3 | 1 |
| A5 Légitimité de l'auteur | 5.1, 5.2 | 5 |
| B1 Prix cohérent | 0, 1.4 | 0 et 1 |
| B2 Offre simple | 0, 1.4 | 0 et 1 |
| B3 Réduction du risque | 1.5, 2.3 | 1 et 2 |
| B4 Bonus utiles | 1.6 | 1 |
| C1 Progression | acquis, vérifié en 5.4 | 5 |
| C2 Victoire rapide | 3.1 | 3 |
| C3 Passage à l'action | 3.2 | 3 |
| C4 Exemples chiffrés | acquis, valorisé en 4.1 | 4 |
| C5 Effort mental réduit | acquis (glossaire en infobulles) | 4 |
| C6 Vérification des acquis | acquis (quiz, 380 exercices, examens notés, test final) | 4 |
| C7 Accompagnement | 3.3 | 3 |
| C8 Mises à jour | 3.4, phase 8 | 3 et 8 |
| D1 Contenu protégé | 2.1, 2.2 | 2 |
| D2 Page de vente | 4.1 | 4 |
| D3 Produit visible | 4.2 | 4 |
| D4 Mobile | 4.3 | 4 |
| D5 Accueil après achat | 2.5 | 2 |
| D6 E-mails et séquence | 4.4 | 4 |
| D7 Mesure | 4.5 | 4 |
| E1 Pages qui attirent | 7.1, 7.4 | 7 |
| E2 Crédibilité pour Google | 7.2 | 7 |
| E3 Publication régulière | 7.3 | 7 |
| E4 Avis | 5.3 | 5 |
| F1 Mentions obligatoires | 2.3 | 2 |
| F2 Rétractation numérique | 2.3 | 2 |
| F3 Aucune pratique trompeuse | 2.4 | 2 |
| F4 Avertissement | 2.4 | 2 |
| F5 Mentions réglementées | 2.4 | 2 |

---

## Les pièges de ce plan

**Vouloir tout faire avant de vendre.** Les phases 0 à 6 suffisent pour lancer.

**Sauter la phase 1.** Sans promesse écrite, la page de vente sera floue.

**Repousser la phase 5.** Les avis et la relecture dépendent d'autres personnes : lance les demandes dès la première semaine.

**Traiter la conformité en dernier.** Elle est bloquante.

**Confondre travail sur le produit et travail sur la vente.** Le temps disponible doit aller aux phases 2, 4 et 5, pas à l'ajout d'un 39e module.
