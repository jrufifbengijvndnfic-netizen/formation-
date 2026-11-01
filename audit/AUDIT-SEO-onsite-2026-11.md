# Audit SEO technique (onsite), formation-locatif.com, 1er novembre 2026

Méthode : celle de l'agent « Onsite Audit » (système 3) de *The Four Systems* (easygrowth.fr),
appliquée **sans DataForSEO**, sur le site version 023 construit localement (`site/dist`, servi
avec compression gzip comme sur Hostinger). Écarts avec la méthode d'origine, à connaître :

- Notes Lighthouse : Lighthouse 13 lancé sur cette machine (Chromium, profils mobile et
  ordinateur), au lieu du Lighthouse de DataForSEO. Ce sont de vraies mesures, en laboratoire.
- INP : non mesurable sans vrais visiteurs. Remplacé par le TBT (mesure de laboratoire la plus
  proche) ; chaque page est marquée « INP inconnu ». À relire dans Search Console (rapport
  Core Web Vitals) quand le site aura du trafic.
- Contrôles « on-page » : faits par un script sur les **111 pages** du site (au lieu de 3 pages
  avec DataForSEO).
- Valeur business par mot-clé (BVS) : non calculable sans les résultats Google (SERP). La
  section « Points stratégiques » donne des hypothèses à vérifier, pas des mesures.
- Site en ligne, robots.txt et en-têtes réels : non consultables depuis l'environnement (réseau
  bloqué). Les fichiers livrés dans le ZIP 023 ont été contrôlés à la place.

Pages auditées (accueil + pages prioritaires) : accueil, page de vente
`/formation-investissement-locatif/`, outil DPE `/simulateurs/dpe-location/` (porte d'entrée
gratuite la plus forte), module gratuit `/module/1-1/`.

## Bilan du site

- Verdict : **orange léger** (technique excellente ; détails on-page et données structurées à compléter)
- Performance moyenne : 100 (mobile et ordinateur)
- Accessibilité moyenne : 100
- Bonnes pratiques moyenne : 100
- SEO moyenne : 100
- Pages auditées avec Lighthouse : 4 (8 mesures) ; pages contrôlées on-page : 111 (105 indexables)

Le verdict n'est pas vert pour deux raisons prévues par la grille : des types de données
structurées attendus manquent (auteur, cours, glossaire) et 27 titres dépassent 65 caractères.
Aucun point rouge.

## Notes par page (mobile, puis ordinateur)

| URL | Verdict | Perf | A11y | BP | SEO | LCP | CLS | INP |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| / | vert | 100 / 100 | 100 / 100 | 100 / 100 | 100 / 100 | 0,9 s / 0,2 s | 0 | inconnu (TBT 0 ms) |
| /formation-investissement-locatif/ | vert | 100 / 100 | 100 / 100 | 100 / 100 | 100 / 100 | 0,9 s / 0,2 s | 0 | inconnu (TBT 0 ms) |
| /simulateurs/dpe-location/ | vert | 100 / 100 | 100 / 100 | 100 / 100 | 100 / 100 | 0,8 s / 0,2 s | 0 | inconnu (TBT 0 ms) |
| /module/1-1/ | vert | 100 / 100 | 100 / 100 | 100 / 100 | 100 / 100 | 0,8 s / 0,2 s | 0 | inconnu (TBT 0 ms) |

Seuils de la grille : LCP bon sous 2,5 s, CLS bon sous 0,1, INP bon sous 200 ms. L'élément LCP
de chaque page est le titre H1 (du texte, pas une image) : la vérification « image LCP »
(`fetchpriority`, dimensions) ne s'applique pas.

> L'INP est la mesure officielle de réactivité depuis mars 2024. Ici, seul le TBT de
> laboratoire est disponible : 0 ms sur toutes les pages, ce qui laisse attendre un bon INP,
> sans le prouver.

## Robots des IA et llms.txt

`robots.txt` livré : `User-agent: *`, `Allow: /`, `Disallow: /pagefind/`, plus le plan du site.
Aucun robot n'est nommé : tous suivent la règle générale et sont **autorisés**.

| Robot | Règle dans robots.txt |
| --- | --- |
| GPTBot (entraînement OpenAI) | non mentionné, donc autorisé |
| OAI-SearchBot (recherche ChatGPT) | non mentionné, donc autorisé |
| ClaudeBot (entraînement Anthropic) | non mentionné, donc autorisé |
| Claude-SearchBot / Claude-User | non mentionné, donc autorisé |
| PerplexityBot | non mentionné, donc autorisé |
| Google-Extended (Gemini) | non mentionné, donc autorisé |
| Applebot-Extended | non mentionné, donc autorisé |
| Bytespider (TikTok) | non mentionné, donc autorisé |

- `/llms.txt` : **absent**
- `/llms-full.txt` : **absent**

Le site est visible des moteurs de recherche à base d'IA. Choix à faire par vous (la grille ne
tranche pas) : laisser aussi les robots d'**entraînement** lire tout le texte, y compris les
modules réservés, présents dans le code source des pages (verrou d'affichage de la version 022).
Bloquer `GPTBot`, `ClaudeBot`, `Google-Extended`, `Applebot-Extended` et `Bytespider` tout en
gardant les robots de **recherche** (`OAI-SearchBot`, `Claude-SearchBot`, `PerplexityBot`)
protégerait mieux le contenu payant sans perdre la visibilité dans ChatGPT, Claude ou Perplexity.

## Problèmes de gabarit (une correction règle plusieurs pages)

| Problème | Pages touchées | Gravité | Correction |
| --- | --- | --- | --- |
| `render-blocking-insight` : feuille de style `Base.css` (11 Ko) chargée avant l'affichage | 4 sur 4 (tout le site) | faible (gain estimé 150 à 300 ms sur mobile, en laboratoire) | Intégrer les petites feuilles de style dans la page (`build.inlineStylesheets` d'Astro) |
| Titres de plus de 65 caractères (coupés dans Google) | 27 pages indexables (modules, examens, annexes, simulateurs) | moyenne | Retirer « \| Formation Locatif » des titres longs, raccourcir les plus longs (exemple : module 3.4, 72 caractères) |
| Aucune personne identifiée comme auteur (`Person`) dans les données structurées | 105 pages | moyenne (crédibilité E-E-A-T) | Ajouter l'auteur ou le relecteur sur les modules et À propos ; **nom et qualifications [À FOURNIR]** |
| Modules sans type « contenu de cours » | 38 modules (seulement `WebPage` + fil d'Ariane) | faible | Déclarer chaque module comme `LearningResource` ou `Article` rattaché au `Course` |
| Glossaire sans `DefinedTermSet` | 1 page (180 termes) | faible | Déclarer les termes en `DefinedTermSet` / `DefinedTerm` |

## Résultats par page

### Accueil `/`
**Verdict : vert.** Titre de 68 caractères (« Formation investissement locatif en ligne : DPE, loyer,
bail, impôts ») : un peu long, il risque d'être coupé. Données structurées : `Course`,
`CourseInstance`, `Offer`, `Organization`, `WebSite`. Un seul H1, aucun niveau de titre sauté.

### Page de vente `/formation-investissement-locatif/`
**Verdict : vert** (page « argent » : seuil 90, toutes les notes à 100). 2 773 mots, `FAQPage`,
`Course`, `Offer`. Titre de 67 caractères. Deux feuilles de style bloquantes (300 ms estimés sur
mobile).

### Outil DPE `/simulateurs/dpe-location/`
**Verdict : vert.** `WebApplication` + `Offer` + `Organization`. 927 mots. Titre de 65 caractères.

### Module gratuit `/module/1-1/`
**Verdict : vert.** 3 079 mots. Seulement `BreadcrumbList` : rien n'indique à Google qu'il s'agit
d'une leçon d'un cours, ni qui l'a écrite.

## Contrôles « on-page » sur les 111 pages

| Contrôle | Résultat |
| --- | --- |
| Un seul H1 | 110 pages sur 111 ; `/annexe/c/` n'en a pas, mais elle est volontairement hors index (doublon du glossaire) |
| Niveaux de titres sautés (H2 puis H4…) | aucun |
| Titre présent / trop court | tous présents ; 2 courts (« Annexes », « À propos ») |
| Description | 105 sur 105, toutes entre 70 et 160 caractères |
| Balise canonique | 105 sur 105 |
| Images | aucune balise `<img>` (illustrations en SVG/CSS) : rien à convertir en WebP/AVIF |
| Liens en `http://` (contenu mixte) | aucun |
| Liens internes cassés | aucun (8 611 liens vérifiés au build) |
| Langue `fr` | 111 sur 111 |
| Open Graph et Twitter (partage) | 105 sur 105 |
| Données structurées illisibles | aucune |
| Pages pauvres (moins de 300 mots) | aucune |
| Plan du site | 105 adresses, toutes datées du 1er novembre 2026 |
| `.htaccess` | HTTPS et adresse sans « www » imposés, compression, cache, en-têtes de sécurité |
| Pages hors index (voulu) | 404, `/progression/`, `/acces/`, `/assistant/`, `/annexe/c/`, `/recherche/` |

## Alertes sur les pages « argent »

Aucune. La page de vente, les tarifs et l'accueil sont à 100 partout.

## Points stratégiques (valeur business, hypothèses à vérifier)

Sans les résultats Google, la note BVS ne peut pas être calculée. À vérifier dès qu'un outil de
mots-clés ou Search Console sera disponible :

- Pages probablement **« zéro clic »** (Google affiche souvent la réponse lui-même) :
  `/simulateurs/taux-usure/`, `/simulateurs/revision-loyer/` (requête « IRL »),
  `/simulateurs/loyer-au-m2/`. Elles restent utiles pour la confiance et les liens vers la
  formation ; à ne pas prioriser pour du contenu nouveau.
- Pages probablement **à forte valeur** (intention d'achat ou problème urgent) :
  `/formation-investissement-locatif/`, `/simulateurs/dpe-location/` (« logement G louable »),
  `/simulateurs/micro-bic-ou-reel/` (LMNP, très actuel avec le budget 2027).
- `/assistant/` (« Poser une question ») est hors index : choix cohérent (contenu calculé dans le
  navigateur), à garder.

## Crédibilité pour Google (hors grille technique, ajouté à la demande du propriétaire)

Une note Lighthouse SEO de 100 vérifie seulement que la page est lisible par Google (titre,
description, liens, langue). Elle ne dit rien de la **confiance** que Google accorde au site.
Pour un sujet juridique et financier (catégorie « YMYL » chez Google : *Your Money or Your
Life*), la confiance pèse lourd. Constats sur le site livré (version 023) :

| Signal de confiance | État | Effet |
| --- | --- | --- |
| Éditeur du site (mentions légales) | **« à compléter »** : nom, forme juridique, adresse, immatriculation, contact, directeur de la publication | Signal négatif fort : site anonyme sur un sujet d'argent et de droit ; aussi une obligation légale (LCEN) |
| CGV | 12 informations du vendeur manquantes | Empêche de vendre et nuit à la confiance |
| Auteur identifié (nom, parcours, qualification) | absent sur tout le site | Google ne peut rattacher l'expertise à personne |
| Contact | aucune adresse e-mail ni formulaire publié | Signal négatif ; bonus « questions par e-mail » masqué |
| Avis ou témoignages d'élèves | aucun | Normal avant les premières ventes ; ne jamais en inventer |
| Sources officielles citées en lien | Légifrance lié sur 3 pages seulement ; les articles de loi sont cités dans le texte, sans lien | Liens vers les sources renforcent la vérifiabilité |
| Liens d'autres sites vers formation-locatif.com | inconnus (domaine récent, non mesurable ici) | Principal moteur de l'autorité ; à construire |
| Search Console et Bing | codes de vérification non renseignés | Sans eux, aucune donnée de recherche réelle |

## Actions recommandées (par priorité)

1. **Ajouter l'auteur** (`Person` : nom, qualification, lien vers À propos) sur les modules, la
   page de vente et À propos. C'est le signal de crédibilité qui manque le plus pour un sujet
   juridique et financier. Nécessite le nom et les qualifications **[À FOURNIR]**.
2. **Raccourcir les 27 titres de plus de 65 caractères** : retirer « | Formation Locatif » quand
   le titre est long, et raccourcir les intitulés des modules 3.4, 3.11 et de l'outil donation.
   Correction de gabarit dans `seo.ts` plus 5 à 6 titres à la main.
3. **Décider de la politique des robots d'IA** : conseillé, bloquer l'entraînement (GPTBot,
   ClaudeBot, Google-Extended, Applebot-Extended, Bytespider) et garder la recherche
   (OAI-SearchBot, Claude-SearchBot, PerplexityBot), puisque le texte des modules réservés est
   lisible dans le code source.
4. **Compléter les données structurées** : chaque module en `LearningResource` rattaché au
   `Course` (avec `isAccessibleForFree` déjà en place), le glossaire en `DefinedTermSet`.
5. **Créer `/llms.txt`** : une page en Markdown qui présente le site aux IA (la formation, les
   24 outils gratuits, les 10 lettres, la page de vente). Gain modeste mais facile, généré au
   build. En option : intégrer la feuille de style principale pour supprimer les 150 à 300 ms
   de blocage.

Aucune de ces corrections n'a été appliquée : elles attendent votre accord.

## Fichiers

- Mesures Lighthouse et contrôles on-page : `audit/onsite-audit-2026-11-01.json`
