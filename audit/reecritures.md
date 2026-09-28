# Réécritures : page de vente et accueil

Propositions liées à `audit/AUDIT-VENTE.md`.

**Contraintes respectées :**
- titre principal de moins de 15 mots ;
- un seul résultat par titre ;
- aucun mot de la liste noire ;
- la location en France est nommée ;
- chiffres tirés du produit uniquement ;
- exemples présentés comme des exemples ;
- contenu pédagogique non modifié.

Rien ici n'est encore appliqué : c'est la matière des actions A1 à A7, à valider.

## 1. Titres (12 propositions)

Chaque titre est passé aux quatre tests de la phase 2 :

- **E** : Et alors ?
- **P** : Preuve
- **C** : Concret
- **S** : Suppression (le titre apporte-t-il quelque chose ?)

Un ✓ veut dire que le test est réussi.

| # | Forme | Titre | Mots | E | P | C | S | Rang |
|---|---|---|---|---|---|---|---|---|
| T1 | Résultat pour une cible | **Formation pour bailleurs : gardez votre logement louable et votre location en règle** (actuel) | 12 | ✓ | ✓ | ✓ | ✓ | 1 |
| T2 | Question factuelle | **Votre logement pourra-t-il encore être loué en 2028 ?** | 9 | ✓ | ✓ (loi Climat, calendrier DPE) | ✓ | ✓ | 2 |
| T3 | Résultat pour une cible | Propriétaires bailleurs : louez en règle, du DPE à la déclaration d'impôts | 12 | ✓ | ✓ | ✓ | ✓ | 3 |
| T4 | Méthode | 38 modules pour louer en France sans erreur, à jour au 24 septembre 2026 | 14 | ✓ | ✓ | ✓ | ✓ | 4 |
| T5 | Ancrage sur une date | Logement classé F : ce qui change pour votre location le 1er janvier 2028 | 13 | ✓ | ✓ | ✓ | ~ (trop étroit pour toute la formation) | 5 |
| T6 | Coût de l'erreur | Micro-foncier ou réel : dans notre exemple, 2 000 € d'impôt d'écart par an | 13 | ✓ | ✓ (module 2.6) | ✓ | ~ (un seul sujet) | 6 |
| T7 | Résultat pour une cible | Louer un logement en France : les règles du bailleur, dans l'ordre | 12 | ~ | ✓ | ~ | ✓ | 7 |
| T8 | Méthode | Trois niveaux pour gérer votre location seul, du bail à la fiscalité | 12 | ✓ | ✓ | ✓ | ✓ | 8 |
| T9 | Question factuelle | Bail, loyer, DPE, impôts : êtes-vous sûr d'être en règle ? | 11 | ✓ | ✓ | ~ | ~ (ton inquiétant, à la limite) | 9 |
| T10 | Ancrage sur une date | Location en France : les règles de 2026 expliquées, textes officiels à l'appui | 12 | ~ | ✓ | ~ | ✓ | 10 |
| T11 | Coût de l'erreur | Un congé mal délivré ou un dépôt rendu en retard se paie : la formation du bailleur | 17 | ✓ | ✓ | ✓ | ✗ (> 15 mots) | écarté |
| T12 | Méthode | La formation complète du propriétaire bailleur | 6 | ✗ (« complète » : vide) | ✗ | ✗ | ✗ | écarté |

**Titres retenus** : T1 (garder), T2 (à tester en A/B quand la mesure existera) et T3.

**Variantes écartées :**
- T11 est trop long.
- T12 est trop vide.
- Toute formule « gagnez », « rentable », « liberté financière » est exclue (liste noire).

## 2. Sous-titres (trois par titre retenu)

**T1, « Formation pour bailleurs : gardez votre logement louable et votre location en règle »**

1. DPE, loyer, bail, charges, impayés, impôts : les règles de la location, dans l'ordre où vous en avez
   besoin. À jour au 24 septembre 2026. **(recommandé, 25 mots)**
2. 38 modules, 24 simulateurs et 10 lettres pour le bailleur qui gère seul ou prépare son premier achat.
3. Chaque règle avec son texte officiel, un cas chiffré et un exercice corrigé.

**T2, « Votre logement pourra-t-il encore être loué en 2028 ? »**

1. Les logements G ne peuvent plus être reloués depuis 2025, les F suivent en 2028 : la formation vous dit
   ce qui s'applique à vous, et quand.
2. DPE, gel des loyers, travaux, aides : le calendrier et vos options, textes officiels à l'appui.
3. Commencez par le test gratuit, puis suivez les modules qui vous concernent.

**T3, « Propriétaires bailleurs : louez en règle, du DPE à la déclaration d'impôts »**

1. Trois niveaux, du premier bail à la transmission, avec quiz et exercices corrigés.
2. Pour le bailleur en place, celui qui gère seul, et le futur premier investisseur.
3. Des règles datées et sourcées, des outils de calcul et des lettres prêtes à compléter.

## 3. Boutons (cinq par titre retenu)

**Libellé principal recommandé : « Lire le module 1.1 gratuitement ».**

| Titre | Libellés (verbe + bénéfice) |
|---|---|
| T1 | **Lire le module 1.1 gratuitement** · Voir le programme et les prix · Tester mon logement gratuitement · Commencer par le module gratuit · Choisir mon niveau |
| T2 | **Tester mon logement gratuitement** · Lire le module gratuit sur le DPE* · Voir le calendrier de décence · Voir le programme et les prix · Commencer par le module 1.1 |
| T3 | **Lire le module 1.1 gratuitement** · Voir les 38 modules · Calculer ma rentabilité gratuitement · Choisir mon niveau · Voir le programme et les prix |

\* À n'utiliser que si le module DPE (1.4) devient gratuit : aujourd'hui, seul le 1.1 l'est dans l'offre
payante.

**Libellés écartés :**
- « Commencer gratuitement le niveau 1 » : inexact, seul le module 1.1 est gratuit.
- « En savoir plus » : vague.
- « Je me lance ! » : pas de bénéfice.

**Bouton d'achat (au lancement de Stripe)** : « Acheter le niveau 1 : 97 € ».

## 4. Réécriture des trois sections les plus faibles

### 4.1 Bloc 1 : premier écran de la page de vente (action A1)

```
[fil d'Ariane]
Formation en ligne · à jour au 24 septembre 2026
# Formation pour bailleurs : gardez votre logement louable et votre location en règle
DPE, loyer, bail, charges, impayés, impôts : les règles de la location, dans l'ordre où vous en avez besoin.
[ Lire le module 1.1 gratuitement ]      (bouton principal)
Module 1.1 gratuit, sans inscription · puis dès 97 € le niveau, 447 € les trois
38 modules · 24 simulateurs · 10 lettres · textes officiels cités dans chaque module
[ Voir le programme et les prix ]        (bouton secondaire)
Logement classé E, F ou G ? Vérifiez gratuitement s'il reste louable
```

Estimation en 375 × 667 : le fil d'Ariane, la pastille, le titre sur 4 lignes et le chapeau sur 3 lignes
portent le bouton principal vers y ≈ 480 à 520 px. À mesurer après modification.

### 4.2 Bloc 13 : bouton final (action A4)

```
## Prêt à commencer ?
Le module 1.1 est gratuit et sans inscription : lisez-le en entier, avec son quiz, avant de décider.
[ Lire le module 1.1 gratuitement ]
Ensuite : niveau 1 à 97 €, ou les trois niveaux pour 447 €. [Voir les offres]
{si garantie : « <garantie>, détail dans les CGV. »}
```

Ce bloc est répété, sans le titre, après « Le problème », après le comparatif et après « Essayez avant
d'acheter ».

### 4.3 Bloc 10 : l'offre, quand le paiement n'est pas encore ouvert (action A6)

Texte actuel : « Achat en ligne bientôt disponible. » Il devient :

> Le paiement en ligne ouvre prochainement. En attendant, le module 1.1, les 24 simulateurs et les
> 10 lettres sont en accès libre.

Quand `FORMULAIRE_EMAIL.action` sera renseigné, ajouter : « Laissez votre e-mail pour être prévenu de
l'ouverture. »

Le bonus « Vos questions par e-mail » et la phrase de FAQ correspondante ne s'affichent que si
`EDITEUR.email` est renseigné.

## 5. FAQ : une réponse courte par objection

Les réponses marquées *(provisoire)* se remplacent automatiquement par la valeur de `CONDITIONS` dès
qu'elle est renseignée. Elles n'affirment rien qui ne soit vrai aujourd'hui.

1. **Tout est gratuit ailleurs, pourquoi payer ?** Les règles sont publiques mais dispersées entre lois,
   décrets et BOFiP. La formation les met dans l'ordre, avec un cas chiffré et un exercice corrigé pour
   chacune. Vous n'avez plus à rapprocher les textes vous-même.
2. **Je n'ai pas encore de bien. Est-ce trop tôt ?** Non. Le niveau 1 part de zéro : choix du type de
   location, décence, diagnostics, bail et premiers calculs de rentabilité.
3. **La loi change tout le temps. Ce sera périmé ?** Chaque module est daté (à jour au 24 septembre 2026)
   et les textes en cours d'adoption sont signalés. Chaque modification est notée dans le journal des mises
   à jour.
4. **C'est trop technique pour moi ?** Chaque niveau part des bases. 180 termes sont expliqués dans le
   glossaire, et chaque module finit par un quiz et dix exercices corrigés.
5. **Qui êtes-vous ?** *(provisoire)* La page « Méthode et sources » explique qui écrit la formation,
   comment elle est construite et vérifiée, et quelles sources officielles elle cite. [À FOURNIR : nom et
   présentation de l'auteur]
6. **Combien de temps faut-il ?** Durées indicatives : 10 à 12 heures pour le niveau 1, 15 à 18 heures pour le niveau 2, 20 heures et plus pour le niveau 3.
7. **Est-ce vraiment à jour ?** Oui : contenu à jour au 24 septembre 2026, date affichée en tête de chaque
   page.
8. **Puis-je être remboursé ?** Vous disposez de quatorze jours de rétractation, sauf si vous demandez
   l'accès immédiat et renoncez expressément à ce droit avant de payer (article L. 221-28 du Code de la
   consommation). [Si une garantie est décidée, elle s'affiche ici.]
9. **Aurai-je une facture ?** *(provisoire)* Oui, les modalités seront précisées à l'ouverture du paiement
   en ligne. [À FOURNIR]
10. **Est-ce un conseil personnalisé ?** Non. C'est une formation d'information générale. Pour une décision
    engageante, consultez un avocat, un notaire, un expert-comptable ou un conseiller en gestion de
    patrimoine.
11. **Puis-je payer en plusieurs fois ?** *(provisoire)* Les moyens de paiement seront précisés à
    l'ouverture du paiement en ligne. [À FOURNIR]
12. **Est-ce lisible sur mobile ?** Oui : le site est conçu et testé pour les petits écrans, simulateurs et
    lettres compris.
13. **Combien de temps ai-je accès ?** *(provisoire)* La durée d'accès sera précisée à l'ouverture du
    paiement en ligne. [À FOURNIR]
14. **Les mises à jour sont-elles incluses ?** La formation est mise à jour à chaque loi de finances et à
    chaque changement majeur. [À FOURNIR : inclusion dans le prix, jusqu'à quand]
15. **Y a-t-il un accompagnement ?** L'outil « Poser une question » répond tout de suite, avec plus de
    1 200 réponses tirées de la formation. {si e-mail : « Pour le reste, écrivez-nous : réponse sous
    72 heures ouvrées. »}
16. **Je gère déjà un bien. Est-ce pour moi ?** Oui : commencez par le niveau 2 (gestion, fiscalité), ou
    par les modules 1.4 et 1.5 si votre logement est classé E, F ou G.
17. **Y a-t-il des avis ?** Pas encore : la formation vient d'ouvrir. Nous ne publierons que des avis
    d'acheteurs vérifiés. En attendant, lisez le module 1.1 en entier pour juger par vous-même.
18. **Mes données sont-elles collectées ?** Aucun cookie ni traceur publicitaire. Votre progression et vos
    saisies restent dans votre navigateur.
19. **Pourquoi ce prix ?** 97 € le niveau, ou 447 € les trois au lieu de 591 €. Pour comparer : dans
    l'exemple du module 2.6, le choix du régime fiscal représente environ 2 000 € d'impôt par an. C'est un
    exemple, pas un gain promis.
20. **Et si je ne comprends pas un module ?** Chaque terme renvoie au glossaire. L'outil « Poser une
    question » retrouve le passage qui répond, et chaque exercice a sa correction détaillée.

Vérification du n° 19 : « 447 € au lieu de 591 € » est la somme réelle 97 + 197 + 297 = 591. Ce n'est pas
un prix barré fictif.

Vérification des n° 6 et 16 : durées et publics tirés du tableau 0.2 de la formation (« Niveau 2 | Gestion,
fiscalité et financement | Bailleur en activité ou futur investisseur | 15 à 18 heures »). Dans le code, on
utilisera `publicNiveau(n)` et `dureeNiveau(n)`, déjà dans la page, plutôt qu'un texte en dur.
