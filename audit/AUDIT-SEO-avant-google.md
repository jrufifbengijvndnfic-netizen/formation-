# Contrôle du référencement avant l'envoi à Google — 25 septembre 2026 (version 013)

But : vérifier que ce qui part vers Google correspond aux décisions de la feuille de route
(douleur principale : le logement qui devient illouable à cause du DPE ; cible : le bailleur déjà
propriétaire ; formation en page d'accueil ; outils gratuits pour attirer le trafic).
Méthode : lecture automatique des 109 pages construites (titre, description, h1, adresse
canonique, indexation, plan du site, liens internes), tests du site, Lighthouse.

## Écarts trouvés et corrigés

| Constat | Correction |
|---|---|
| Accueil : titre et description sans le DPE ni le bailleur (« louer, gérer, déclarer ») | Titre « Formation investissement locatif en ligne : DPE, loyer, bail, impôts » ; description « Logement classé F ou G, loyer, bail, charges, impôts : la formation en ligne du bailleur… » |
| Accueil et page de vente visaient le même mot-clé et avaient le même h1 (les deux pages se concurrençaient) | Page de vente : « Formation propriétaire bailleur : programme, prix et module gratuit », h1 distinct |
| `/outils/` et `/simulateurs/` visaient tous deux « simulateurs immobiliers gratuits » | `/outils/` : « Outils gratuits pour bailleurs : test DPE, simulateurs, lettres types » |
| L'outil DPE (page d'appel de la douleur choisie) n'était relié que depuis les autres outils | Lien « Vérifiez gratuitement s'il reste louable » en haut de l'accueil et de la page de vente, bloc « À la une » sur `/outils/` et `/simulateurs/`, lien depuis la fin des modules 1.4, 1.5 et 3.9 |
| Titre de l'outil DPE trop long (71 caractères), sans les échéances | « DPE G, F ou E : mon logement est-il encore louable ? Test gratuit » ; description avec 2025, 2028 et 2034 |
| Titres des modules commençant par « Module 1.4 — » (mots que personne ne cherche) | Le sujet d'abord : « Le logement décent et les normes à respecter (module 1.4) » ; titre affiché dans la page inchangé |
| 11 descriptions trop courtes (moins de 110 caractères) ; 2 coupées (plus de 160) | Complétées ou raccourcies |
| Pages sans intérêt pour la recherche indexables : recherche interne, « Ma progression », page de repli `/annexe/c/` | `noindex` et retirées du plan du site (105 adresses) ; le build retire automatiquement toute page `noindex` du plan |

## Résultat

- 105 adresses dans le plan du site, toutes indexables, avec leur date de mise à jour ; aucun titre ni
  aucune description en double ; un seul h1 par page ; adresse canonique `https://formation-locatif.com/…`
  sur chaque page indexable.
- Lighthouse mobile, référencement : 100 sur l'accueil, la page de vente, `/outils/`, `/simulateurs/`,
  l'outil DPE et le module 1.4 (performance 99 à 100).
- Tests : 224 tests unitaires, 4 492 vérifications (site complet), 1 278 (édition outils), 0 échec.

## Points restants, sans gravité

- Trois titres de 71 ou 72 caractères (modules 3.4 et 3.11, outil donation) : Google peut les
  couper légèrement.
- Quelques pages courtes par nature (mentions légales, journal des mises à jour, liste des annexes).
- Google n'affiche plus les résultats enrichis « cours » ni « FAQ » pour ce type de site : les
  données structurées restent utiles pour comprendre les pages, sans promesse d'affichage particulier.
