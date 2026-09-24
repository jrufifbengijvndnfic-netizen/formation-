# Vérification du fond juridique — 24 septembre 2026

Relecture de `files/formation-immobilier-locatif-2026/formation-immobilier-locatif-2026.md` à la
date d'édition affichée (« contenu à jour au 24 septembre 2026 »).

**Le texte n'a pas été modifié.** Conformément au brief (chiffres, dates, taux, montants et
références juridiques intouchables), ce rapport liste les constats ; les corrections proposées sont
à valider par l'auteur, puis à reporter dans le Markdown (le site se régénère seul au build).

## Méthode et limites

- **Calculs** : les 15 exemples chiffrés, les tableaux des modules 2.8 et 3.2, les corrigés des trois
  examens et les questions de quiz qui comportent un calcul ont été refaits (à la main et avec
  `calculs.ts`, lui-même testé contre `reference-calculs.py`). Aucun écart, hormis l'arrondi déjà
  signalé du module 3.2 (§ 2).
- **Références** : les 41 textes numérotés cités (lois, décrets, arrêtés) ont des numéros, des dates
  et des dates de publication cohérents entre eux et avec les dates d'application annoncées.
- **Actualité 2025-2026** : environ 45 recherches ciblées sur les nouveautés datées de la formation.
- **Limite importante** : depuis l'environnement de travail, Légifrance, l'INSEE et la Banque de
  France étaient inaccessibles (blocage réseau). Les constats reposent sur des sources secondaires
  concordantes (presse spécialisée, cabinets d'avocats, courtiers, sites ministériels et
  parlementaires cités par les moteurs de recherche). **Ce rapport n'est pas une validation
  juridique** : les trois écarts du § 1 doivent être confirmés sur le texte officiel avant correction,
  et une relecture par un professionnel (avocat, notaire) reste recommandée, comme le dit
  l'avertissement 0.4.

---

## 1. Écarts de fond (le texte semble dépassé au 24 septembre 2026)

### 1.1 MaPrimeRénov' par geste : la liste des gestes restants est inversée

**Où** : module 3.9, tableau des aides, ligne « MaPrimeRénov' » (ligne 3010 du Markdown).

**Le texte dit** : « l'aide par geste est recentrée sur l'isolation, la ventilation, le chauffage au
bois et le solaire, les autres équipements de chauffage étant pour l'essentiel exclus ».

**Les sources disent** : depuis le 1er septembre 2026 (décret n° 2026-822 du 25 août 2026 et arrêtés
du même jour, JO du 27 août), **seuls restent finançables par geste** la pompe à chaleur air-eau ou
géothermique, le raccordement à un réseau de chaleur ou de froid et la dépose d'une cuve à fioul
(avec l'audit). **Sont exclus** : l'isolation des combles et toitures, les fenêtres, la ventilation
(VMC), les poêles et chaudières à bois ou à granulés, les chauffe-eau solaires et thermodynamiques.
L'isolation des murs était déjà exclue depuis janvier. Ces travaux restent finançables dans une
rénovation d'ampleur.

Le reste de la ligne est confirmé (guichet rouvert le 23 février 2026, refus de la rénovation
d'ampleur d'une maison qui conserve un chauffage au gaz, Accompagnateur Rénov'). Le tableau 0.5
(n° 12 : « parcours par geste fortement restreint ») est juste.

**Proposition** : « … et l'aide par geste est réservée pour l'essentiel aux pompes à chaleur air-eau
ou géothermiques, au raccordement à un réseau de chaleur et à la dépose des cuves à fioul ;
l'isolation, la ventilation, le chauffage au bois et le solaire n'y sont plus éligibles et relèvent
de la rénovation d'ampleur : vérifiez la liste à jour. »

Sources : [HomeServe](https://www.homeserve.fr/conseils-actualites/renovation-energetique/aides-maprimerenov-geste-travaux-exclus-septembre-2026),
[MoneyVox](https://www.moneyvox.fr/votre-argent/actualites/110179/maprimerenov-les-travaux-qui-ne-sont-plus-eligibles-a-partir-du-1er-septembre-2026),
[Fioulmarket](https://www.fioulmarket.fr/actualites/maprimerenov-une-semaine-apres-le-decret-sur-le-monogeste-le-point-pour-un-foyer-au-fioul),
[Doctrine (décret n° 2026-822)](https://www.doctrine.fr/l/texts/decrets/JORFTEXT000054750363).

### 1.2 DPE : le coefficient 1,7 n'est plus un projet

**Où** : 0.4 (encadré « À surveiller », ligne 39), modules 1.5 (encadré, ligne 433) et 3.9 (encadré,
ligne 2984), annexe A (ligne 3343), annexe B (ligne 3410), annexe I (ligne 4331).

**Le texte dit** : « un projet d'arrêté » mis en consultation jusqu'au 6 août 2026 prévoit
d'abaisser le coefficient à 1,7 au 1er janvier 2027 ; « vérifiez sa publication ».

**Les sources disent** : l'**arrêté du 19 août 2026** modifiant le facteur de conversion de
l'électricité a été **publié au Journal officiel fin août 2026** (les sources divergent sur le jour :
26, 27 ou 31 août). Il fixe bien 1,7 au 1er janvier 2027, pour le DPE et l'audit énergétique, avec
une attestation gratuite de nouvelle étiquette sur l'observatoire de l'ADEME. Les valeurs de la
formation (1,7 ; 1er janvier 2027) sont donc justes ; seul le statut « projet » est dépassé.

**Proposition** : remplacer « projet d'arrêté » par « arrêté du 19 août 2026 » et l'invitation à
« vérifier sa publication » par une invitation à tenir compte du nouveau coefficient (et de
l'attestation ADEME) avant d'arbitrer des travaux. L'encadré de 1.5 peut devenir un encadré
« Nouveau » plutôt que « À surveiller ». Retirer le point de l'annexe I ou le marquer comme acquis.

Sources : [Légifrance, JORFTEXT000054747079](https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000054747079),
[ministère de la Transition écologique](https://www.ecologie.gouv.fr/presse/dpe-audits-energetiques-publication-larrete-abaissant-facteur-conversion-lelectricite-17-1er),
[CPIM](https://www.cpim.fr/dpe-coefficient-electricite-2027-sortie-passoire/).

### 1.3 Meublés de tourisme : le téléservice national existe déjà (écart probable, à confirmer)

**Où** : 0.4 (ligne 39), module 3.8 (tableau, ligne 2903 ; encadré, ligne 2929), annexe B
(ligne 3408), annexe I (ligne 4334).

**Le texte dit** : « le téléservice national est annoncé pour le 4e trimestre 2026 : d'ici là,
suivez la procédure de votre commune ».

**Les sources disent** : le portail national **Déclaloc** fonctionne depuis le 19 mars 2026, et la
déclaration via le téléservice national est **obligatoire depuis le 20 mai 2026** pour tous les
meublés de tourisme (résidence principale comprise), avec un numéro à 13 caractères. La Direction
générale des entreprises a toutefois annoncé un déploiement complet de la version destinée aux
loueurs au **second semestre 2026**, et certaines communes continuent d'orienter les loueurs vers
leur propre portail (souvent adossé à Déclaloc). La phrase de la formation est donc au minimum
incomplète : elle ne cite ni Déclaloc ni l'échéance du 20 mai 2026.

**Proposition** (à ajuster après vérification sur service-public.gouv.fr) : « Décret n° 2026-196 du
19 mars 2026 ; depuis le 20 mai 2026, la déclaration se fait sur le téléservice national
(Déclaloc), dont le déploiement se poursuit au second semestre 2026 : vérifiez auprès de votre
commune la porte d'entrée à utiliser. »

Sources : [Socic](https://www.socic.fr/ressources-comptabilite/articles/declaration-en-ligne-des-meubles-de-tourisme-des-le-20-mai-2026-mode-demploi-complet),
[Meilleurtaux](https://www.meilleurtaux.com/credit-immobilier/actualites/2026-mai/meubles-touristiques-declaration-en-ligne-des-mai-2026.html),
[Lybox](https://blog-investissement-immobilier.lybox.fr/meubles-tourisme-enregistrement-declaloc-20-mai-2026/),
[Lodgify](https://www.lodgify.com/blog/fr/declaloc/), [Déclaloc](https://www.declaloc.fr/).

---

## 2. Points mineurs et imprécisions

| Où (ligne) | Texte | Constat | Proposition |
|---|---|---|---|
| Module 2.1 (1128) | Zone tendue : « plus de 1 400 communes » | Les sources consultées parlent de 28 agglomérations et « plus d'un millier » de communes (environ 1 150) pour le dispositif de relocation. Le chiffre de 1 400 n'a pas été retrouvé. | Vérifier sur l'annexe du décret n° 2025-1267 ; à défaut, écrire « plus d'un millier de communes ». |
| Quiz 2.10 (1932) | Taux d'usure « publié par la Banque de France le 29 juin 2026 » | L'avis est donné comme publié au JO du 28 juin 2026 ; la publication Banque de France peut avoir une date différente. | Vérifier la date de l'avis. |
| Module 1.1 (86) | « 278 000 logements livrés en 2025 selon le gouvernement » | Ce chiffre vient du baromètre de la Fondation EY-Palladio (16 juin 2026) ; l'objectif de 400 000 par an est bien celui du gouvernement. | « selon le baromètre EY-Palladio ». |
| Modules 1.1 (86), 2.10 (1869), annexe A (3362) | Taux moyens de l'été 2026 : 3,2 % (15 ans), 3,35 % (20 ans), 3,45 % (25 ans) | Les baromètres de courtiers de juin 2026 sont un peu plus hauts (Pretto : 3,37 %, 3,47 %, 3,53 %). La formation dit « environ » : l'écart reste faible. | Facultatif : réactualiser. Les exemples chiffrés à 3,35 % restent pédagogiquement valables. |
| 0.4, 0.5, 2.1, annexes A, B, I | Fin de l'encadrement des loyers le 24 novembre 2026 | Une source parle du 25 novembre. Le reste est confirmé : proposition de loi adoptée par l'Assemblée le 11 décembre 2025, examen au Sénat le 21 octobre 2026, préférence du gouvernement pour deux ans sans nouvelles communes. | Vérifier le jour exact (loi ELAN art. 140 modifié par la loi 3DS). |
| Module 2.1 (1151) | Réévaluation : « par tiers sur trois ans si elle est inférieure à 10 %, par sixièmes […] si elle est supérieure » | Simplification acceptable pour un bail de trois ans. L'article 17-2 étale par tiers ou par sixième selon la durée du bail, et par sixième annuel au-delà de 10 % (une hausse d'exactement 10 % s'étale donc par tiers). | Facultatif : « inférieure ou égale à 10 % ». |
| Annexe G, G5 (4279) | « indicateurs de l'annexe 3.12 » | Il s'agit du **module** 3.12. | « du module 3.12 ». |
| Module 3.8 (2929) | « Un texte dit « RIPOST » […] a été adoptée » | Accord : « adopté ». Les dates (Sénat le 26 mai 2026, Assemblée le 15 juillet 2026, CMP à venir) sont confirmées. | Correction typographique évidente, à signaler. |
| Module 3.2 (2410) | Sensibilité « loyer 420 € » : cash-flow −686 € | Le modèle de référence donne −685,23 € (assurance loyers impayés 453,60 € arrondie à 454 €). Le TRI (9,3 %) est identique. | Garder −686 € (arrondi) ou afficher −685 €. |

---

## 3. Confirmé par des sources concordantes

| Point de la formation | Où | Sources |
|---|---|---|
| Loi n° 2026-103 du 19 février 2026 (LF 2026) ; dispositif Jeanbrun pour les acquisitions du 21 février 2026 au 31 décembre 2028 | 0.5 n° 1, 3.4 | [Valority](https://www.valority.com/investir-immobilier/loi-jeanbrun/), [Dexteria](https://www.dexteria-avocats.fr/statut-bailleur-prive-2026-dispositif-jeanbrun/) |
| Déficit foncier doublé à 21 400 € pour les dépenses payées jusqu'au 31 décembre 2027 (E, F ou G vers A à D) | 0.5 n° 2, 2.6, 3.9 | [LégiFiscal](https://www.legifiscal.fr/actualites-fiscales/4332-deficit-foncier-double-report-fin-2027.html) |
| LFSS 2026 : 18,6 % sur la location meublée, 17,2 % sur les revenus fonciers et les plus-values | 0.5 n° 3, 2.6, 2.7 | [Hagnéré Patrimoine](https://www.hagnere-patrimoine.fr/guides-patrimoine/comment-payer-moins-impots/lfss-2026-article-12-prelevements-sociaux) |
| Micro-BIC : 83 600 € pour la location meublée de longue durée | 0.5 n° 4, 2.7 | [Indy](https://www.indy.fr/guide/location-meublee/comptabilite-lmnp/location-meublee-fiscalite/micro-bic-location-meublee/) |
| DPE : coefficient de l'électricité à 1,9 au 1er janvier 2026 ; attestation ADEME | 0.5 n° 5, 1.5 | Arrêté du 13 août 2025 (plusieurs sources) |
| Décret n° 2026-596 du 6 juillet 2026 : contrat type au 1er octobre 2026, clause résolutoire à six semaines incluant le dépôt de garantie | 0.5 n° 7, 1.8 | [Village de la justice](https://www.village-justice.com/articles/nouveau-contrat-location-2026-que-decret-juillet-2026-change-pour-les-bailleurs,58313.html), [Tissot](https://www.tissot.fr/blog/post/223/bail-d-habitation-le-nouveau-contrat-type-s-applique-au-1er-octobre-2026?page_type=post) |
| Décret n° 2026-644 du 20 juillet 2026 : relocation en zone tendue du 1er août 2026 au 31 juillet 2027 ; aucune exception pour F et G | 0.5 n° 8, 2.1 | [ANIL](https://www.anil.org/analyse-juridique-encadrement-evolution-loyers-zones-tendues/) |
| Encadrement des loyers : examen au Sénat le 21 octobre 2026 | 0.5 n° 9, 2.1 | [AEF info](https://www.aefinfo.fr/depeche/754029-la-proposition-de-loi-prolongeant-lencadrement-des-loyers-sera-examinee-au-senat-le-21octobre), [Sénat](https://www.senat.fr/dossier-legislatif/ppl25-168.html) |
| Visale : réforme du 6 janvier 2026, couverture des trois premières années pour les nouveaux contrats | 0.5 n° 10, 2.4 | [Que Choisir](https://www.quechoisir.org/actualite-location-la-garantie-visale-evolue-en-2026-n174094/) |
| Décret n° 2026-196 du 19 mars 2026 (meublés de tourisme, enregistrement) | 0.5 n° 11, 3.8 | [UNIS](https://www.unis-immo.fr/actualites/decret-n-2026-196-du-19-mars-2026-relatif-a-la-location-de-meubles-de-tourisme/) |
| Décret n° 2026-822 du 25 août 2026 : rénovation d'ampleur refusée si un chauffage au gaz est conservé, au 1er septembre 2026 | 0.5 n° 12, 3.9 | [Locservice](https://www.locservice.fr/actualites/maprimerenov-ce-que-le-gouvernement-a-modifie-a-la-rentree-2026-16584.html) |
| MaPrimeRénov' : guichet rouvert le 23 février 2026 | 3.9 | [MoneyVox](https://www.moneyvox.fr/immobilier/actualites/107408/reouverture-de-maprimerenov-ce-lundi-23-fevrier-que-va-t-il-se-passer-en-2026) |
| Facture électronique : réception obligatoire pour les loueurs en meublé depuis le 1er septembre 2026 via une plateforme agréée | 0.5 n° 13, 2.9 | [Meilleurtaux](https://www.meilleurtaux.com/credit-immobilier/actualites/2026-aout/facturation-electronique-1-septembre-2026-ce-change-loueurs-meuble.html), [Dougs](https://www.dougs.fr/blog/facturation-electronique-lmnp/) |
| Thermostat programmable reporté au 1er janvier 2030 (décret n° 2025-1343 du 26 décembre 2025) | 0.5 n° 14, 1.4 | [Service-public.gouv.fr](https://www.service-public.gouv.fr/particuliers/actualites/A18805?lang=fr) |
| IRL du 2e trimestre 2026 : 148,37 (+1,15 %) | 0.5 n° 15, 2.1 | [ANIL](https://www.anil.org/outils/indices-et-plafonds/tableau-de-lirl/) |
| Taux d'usure du 3e trimestre 2026 : 5,29 % (20 ans et plus) | 0.5 n° 16, 2.10 | [Ymanci](https://ymanci.fr/credit-immobilier/actualites/taux-d-usure-troisieme-trimestre-2026/) |
| Fusion TLV et THLV en une taxe unique à compter de 2027 | 0.5 n° 18, 2.9 | [Actu-Juridique](https://www.actu-juridique.fr/fiscalite/fiscal-finances/logements-vacants-une-nouvelle-taxe-unique-a-partir-de-2027/) |
| Contribution pour l'aide juridique de 50 €, hors injonction de payer | 0.5 n° 19, 2.13 | [CNB](https://cnb.avocat.fr/actualite/adoption-de-la-contribution-pour-l-aide-juridique-dans-le-plf-2026) |
| Projet de loi « relance logement » : adopté par le Sénat le 8 juillet 2026 ; Jeanbrun dans l'ancien à 20 % de travaux, étiquette D, ouverture aux maisons | 0.4, 0.5 n° 20, 3.4 | [Vie publique](https://www.vie-publique.fr/loi/303813-relance-logement-projet-de-loi-jeanbrun), [Sénat](https://www.senat.fr/dossier-legislatif/pjl25-801.html) |
| BCE : hausse des taux directeurs en juin 2026 (11 juin) | 1.1 | [Pretto](https://www.pretto.fr/taux-immobilier/historique-taux-immobilier/2026/hausse-taux-bce-impact-credit/) |
| Barème de l'impôt sur le revenu 2026 : 11 600, 29 579, 84 577, 181 917 € | 1.2, annexe A | Plusieurs sources |
| Révision des valeurs locatives repoussée aux impositions de 2031 | 2.9 | Plusieurs sources (LF 2026, art. 106) |
| TVA à 5,5 % étendue aux pompes à chaleur air-air (arrêté du 13 juillet 2026) | 2.3, 3.9 | Plusieurs sources |
| THRS : exonération des gîtes ruraux, exonération facultative des meublés classés et chambres d'hôtes | 2.9 | [L'Officiel des métiers](https://www.lofficieldesmetiers.fr/gites-ruraux-meubles-de-tourisme-chambres-dhotes-des-nouvelles-dispositions-en-votre-faveur-dans-la-loi-de-finances-pour-2026/) |
| Aides au logement : restriction pour certains étudiants extracommunautaires non boursiers au 1er juillet 2026 | Annexe B | Plusieurs sources |
| Décret n° 2026-84 du 12 février 2026 : impayés des bénéficiaires d'aides au logement, au 1er janvier 2027 | 1.10 | Plusieurs sources |
| Abattement de 70 % (ORT, GOU) et exonérations pour cession au logement social prorogés au 31 décembre 2027 | 3.5 | Plusieurs sources |
| Réduction d'impôt de 30 % au Fort des Têtes (Briançon), acquisitions de 2029 à 2032, engagement de quinze ans | 3.4 | Plusieurs sources |
| IFI : « impôt sur la fortune improductive » non retenu dans la LF 2026 | 3.6 | Plusieurs sources |
| Bail mobilité d'une semaine à dix-huit mois en résidence à vocation d'emploi (loi du 26 novembre 2025) ; décret d'application attendu | 2.5, annexe I | Plusieurs sources |
| RIPOST : Sénat le 26 mai 2026, Assemblée le 15 juillet 2026, CMP à venir | 3.8, annexe I | Plusieurs sources |

## 4. Non vérifié en ligne (connaissances générales, sans écart apparent)

Règles stables antérieures à 2025 et vérifiées de mémoire seulement : loi du 6 juillet 1989
(durées, préavis, dépôt de garantie, pénalité de 10 %, congés), calendrier de décence énergétique
(G en 2025, F en 2028, E en 2034), normes HCSF, régimes micro-foncier et réel, abattements pour
durée de détention des plus-values, barème et décote de l'IFI, abattements de droits de donation,
dons familiaux de 100 000 € jusqu'au 31 décembre 2026 (LF 2025), copropriété (articles 24 à 26).

Non vérifiés faute de source accessible : références d'articles du CGI pour les droits de mutation,
règles de la LF 2026 sur le statut LMP des non-résidents, éventuelle extension de Visale aux
saisonniers, et, par nature, les textes encore en discussion (PLF 2027, prolongation de
l'encadrement, projet de loi « relance logement » à l'Assemblée).
