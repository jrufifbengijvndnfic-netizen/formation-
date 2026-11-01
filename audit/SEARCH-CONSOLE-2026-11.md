# Search Console : bilan au 1er novembre 2026, formation-locatif.com

Source : exports Search Console fournis par le propriétaire le 1er novembre 2026
(Performances, recherche Web, 3 derniers mois, soit du 24 septembre au 30 octobre 2026 ;
Indexation des pages). Données réelles, à la différence de l'étude des recherches
(`audit/ETUDE-RECHERCHES-2026-11.md`), qui reposait sur des hypothèses.

## Les chiffres

| Mesure | Valeur |
|---|---|
| Clics | 4 (0 à 1 par jour) |
| Impressions (affichages dans Google) | 1 267 |
| Taux de clic | 0,3 % |
| Position moyenne | 39 (4e page de Google) |
| Pages indexées | **54 sur 105** |
| Pages « Détectée, actuellement non indexée » | **51** (Google connaît l'adresse mais ne l'a pas encore explorée) |
| Page exclue par « noindex » | 1 (voulu : recherche, progression, accès… ) |
| Appareils | ordinateur 80 % des impressions, mobile 19 % |
| Pays | France 88 % des impressions |
| Résultats enrichis | aucun |

**Évolution.** Fin septembre, Google a testé le site : 63 à 176 impressions par jour, position
18 à 26. Depuis le 1er octobre : 5 à 30 impressions par jour, position 30 à 70. C'est le schéma
habituel d'un site neuf (Google essaie les pages, puis les reclasse faute de signaux de
confiance). Les données ne permettent pas de l'attribuer à une modification du site.

## Diagnostic

### 1. La moitié du site n'est pas dans Google

Les 52 adresses du plan du site sans aucune impression correspondent aux 51 pages
« Détectée, actuellement non indexée ». Parmi elles :

- **32 modules sur 38**, dont le **module 1.1 gratuit** (seuls 1.7, 2.3, 3.4, 3.8, 3.9 et 3.11
  apparaissent) ;
- **l'outil DPE** (`/simulateurs/dpe-location/`), le plus important pour la vente, ainsi que les
  outils encadrement, révision du loyer, régularisation des charges, micro-foncier ou réel,
  plus-value, IFI, Denormandie et dates de congé ;
- 5 lettres (relance d'impayé, révision du loyer, restitution du dépôt, quittance, attestation
  d'assurance) et 5 annexes (A, B, D, E, F).

« Détectée, non indexée » ne signale pas une erreur technique (l'audit technique est à 100) :
Google n'a pas jugé utile d'explorer ces pages, faute d'autorité du domaine (aucun lien d'autres
sites, site anonyme, domaine récent). Remèdes, du plus rapide au plus durable : demandes
d'indexation manuelles, liens depuis d'autres sites, signaux de confiance (éditeur, auteur).

### 2. Le trafic potentiel vient des simulateurs, pas des modules

| Thème des recherches | Recherches | Impressions | Position moyenne | Page |
|---|---:|---:|---:|---|
| Donation (droits, nue-propriété, usufruit) | 69 | 431 | 34 | outil donation |
| LMNP, location meublée | 20 | 139 | 41 | outil micro-BIC ou réel |
| Airbnb, courte durée | 21 | 100 | 51 | outil meublé de tourisme |
| Formation pour bailleurs | 6 | 73 | 41 | page de vente |
| Frais de notaire | 19 | 66 | 83 | outil frais d'acquisition |
| Crédit, taux d'usure, emprunt | 25 | 48 | 61 | outils crédit, usure |
| Lettres, charges, congé | 17 | 33 | 62 | lettres |
| Loc'Avantages | 11 | 19 | 17 | outil Loc'Avantages |
| Jeanbrun | 5 | 18 | 57 | outil Jeanbrun |

Pages qui ont eu des clics : Loc'Avantages (2 clics, position 14), lettre « notification de
travaux » (1 clic, position 10), module 3.11 (1 clic).

### 3. Les mots exacts des internautes

- **« formations pour les bailleurs »** : 56 impressions, position 39 ; « formation pour les
  bailleurs » : 5, position 28. C'est la recherche d'achat la plus fréquente : elle confirme la
  niche repérée dans l'étude. Le titre H1 de la page de vente dit déjà « Formation pour
  bailleurs », mais le titre de page dit « Formation propriétaire bailleur ».
- **Donation** : presque toutes les recherches contiennent **« simulateur »** (« simulateur
  droits de donation », « simulateur frais donation nu propriété », « simulateur donation avec
  usufruit »). Le titre de la page dit « Calcul droits de donation… » et le H1 « Calcul des
  droits de donation… » : le mot « simulateur » n'y figure pas. Sur la nue-propriété et
  l'usufruit, la page est déjà entre la 5e et la 16e place.
- **Courte durée** : « simulateur location courte durée », « calcul rentabilité airbnb »,
  « simulateur airbnb » ; le titre parle de « Rentabilité Airbnb ou location meublée classique ».
- **LMNP** : « simulateur lmnp », « simulateur lmnp gratuit », « simulation impôt lmnp »,
  « simulateur lmnp amortissement » : le titre actuel correspond déjà (« Simulateur LMNP
  gratuit… ») ; il manque surtout de l'autorité, et le budget 2027 va faire monter ces
  recherches.

## Plan d'action révisé

### A. À faire par le propriétaire (aucun développement)

1. **Demander l'indexation** (Search Console → Inspection de l'URL → coller l'adresse →
   « Demander une indexation »), une dizaine par jour, dans cet ordre :
   - Jour 1 : `/simulateurs/dpe-location/`, `/module/1-1/`, `/simulateurs/encadrement-loyers/`,
     `/simulateurs/revision-loyer/`, `/module/2-1/`, `/module/1-5/`, `/module/2-7/`,
     `/simulateurs/micro-foncier-ou-reel/`, `/simulateurs/regularisation-charges/`,
     `/lettres/relance-loyer-impaye/`
   - Jour 2 : `/lettres/revision-du-loyer/`, `/lettres/restitution-depot-de-garantie/`,
     `/lettres/quittance-de-loyer/`, `/simulateurs/plus-value/`, `/simulateurs/dates-de-conge/`,
     `/simulateurs/denormandie/`, `/simulateurs/ifi/`, `/module/1-4/`, `/module/2-13/`,
     `/module/3-7/`
   - Jours suivants : les autres modules.
2. **Rendre le site identifiable** : mentions légales, CGV, auteur et contact (voir l'audit
   technique). C'est le signal de confiance qui manque le plus.
3. **Vérifier deux écrans** : Sécurité et actions manuelles → Actions manuelles (doit indiquer
   « Aucun problème détecté ») ; Paramètres → Statistiques sur l'exploration (nombre de pages
   explorées par jour).

### B. Modifications du site proposées (à valider)

| Page | Aujourd'hui | Proposé | Raison |
|---|---|---|---|
| Page de vente, titre | « Formation propriétaire bailleur : programme, prix et module gratuit » | « Formation pour bailleurs : programme, prix et module gratuit » (60 caractères) | mots exacts de la recherche d'achat la plus fréquente |
| Outil donation, titre et H1 | « Calcul droits de donation immobilière gratuit : pleine ou nue-propriété » | « Simulateur droits de donation immobilière : nue-propriété, usufruit » (67) ; H1 « Simulateur des droits de donation d'un bien immobilier » | 431 impressions, « simulateur » dans presque toutes les recherches |
| Outil courte durée, titre | « Rentabilité Airbnb ou location meublée classique : simulateur gratuit » | « Simulateur Airbnb gratuit : rentabilité location courte durée » (61) | mots des recherches |
| Pages déjà indexées et vues (donation, LMNP, Airbnb, Loc'Avantages, frais d'acquisition) | encart « Aller plus loin » vers la formation | ajouter des liens vers l'outil DPE, le module 1.1 et le guide du thème | faire passer l'exploration de Google vers les pages non indexées |

### C. Guides (étape 2), ordre révisé par les données

1. **LMNP et budget 2027 : le plafonnement de l'amortissement** (le thème a déjà 139
   impressions ; vote en cours ; renvoie vers l'outil LMNP).
2. **Encadrement des loyers après le 24 novembre 2026** (échéance).
3. **Donation d'un bien immobilier : nue-propriété, usufruit, calcul des droits** (premier
   thème du site en impressions ; renvoie vers l'outil donation et le module 3.7).
4. **Nouveau DPE au 1er janvier 2027 : votre logement F ou G peut-il redevenir louable ?**
   (renvoie vers l'outil DPE, à faire indexer).
5. **Airbnb ou meublé à l'année en 2026 : la rentabilité réelle** (100 impressions ; règles
   Le Meur, 90 ou 120 jours).
6. **Formation pour bailleurs : ce qu'elle doit contenir et combien elle coûte** (recherche
   d'achat).

### D. Liens d'autres sites (étape 3)

Seul remède durable à « Détectée, non indexée ». Plan à préparer : annuaires sérieux,
associations et forums de propriétaires, partenaires (diagnostiqueurs, courtiers, gestion
locative), citations des outils gratuits. Jamais d'achat de liens.

## Données non fournies ou non exploitables ici

- Liste nominative des 51 pages non indexées : déduite par recoupement (pages du plan du site
  sans impression). Pour la liste exacte : Indexation → Pages → « Détectée, actuellement non
  indexée » → Exporter.
- Les volumes ne portent que sur 5 semaines : à refaire fin décembre pour mesurer l'effet des
  actions.
