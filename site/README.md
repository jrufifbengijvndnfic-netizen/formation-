# Site « L'immobilier locatif en France » — édition septembre 2026

Site statique (Astro 7 + TypeScript) généré à partir d'un **seul fichier Markdown** :
`../files/formation-immobilier-locatif-2026/formation-immobilier-locatif-2026.md`.

38 modules sur trois niveaux, 3 examens, 7 checklists, 9 annexes, 122 questions de quiz,
180 termes de glossaire, 10 modèles de lettres et 24 simulateurs et outils (14 formules de l'annexe E,
10 outils fondés sur les règles des modules).

## Commandes

À lancer depuis ce dossier `site/` (Node 22.12 ou plus récent).

| Commande                          | Rôle                                                                                                          |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `npm install`                     | Installe les dépendances                                                                                      |
| `npm run dev`                     | Serveur de développement ; modifier le Markdown recharge la page                                              |
| `npm test`                        | Tests unitaires (parseur, parité JSON, calculs, rendu, simulateurs…)                                          |
| `npm run build`                   | Vérification des types, build, index de recherche Pagefind, contrôle des liens internes → `dist/`             |
| `npm run preview`                 | Sert `dist/` en local                                                                                         |
| `npm run test:site`               | Après un build : axe, structure et SEO de toutes les pages, 320 px, iPhone et Pixel émulés, clavier, parcours |
| `npm run lighthouse`              | Après un build : Lighthouse mobile sur toutes les pages (`-- --desktop` pour le profil ordinateur)            |
| `npm run image-partage`           | Régénère l'image de partage `public/images/og-image.webp` (titre et accroche de la formation)                 |
| `npm run build-json`              | Vérifie que `structure.json`, `quiz.json` et `glossaire.json` correspondent au Markdown                       |
| `npm run build-json -- --write`   | Régénère ces trois fichiers dans le pack                                                                      |
| `npm run lint` / `npm run format` | ESLint / Prettier                                                                                             |

Les scripts appellent les binaires par `node ./node_modules/…` et non par leur nom : le dossier
d'origine du projet contient un « : » (`Schöpli:cloud`) qui casse le `PATH` construit par npm.
Ne pas les « simplifier ».

`npm run test:site` utilise le Chromium de Playwright (`npx playwright install chromium` une fois)
ou celui indiqué par `CHROMIUM_PATH`. `NAVIGATEUR=firefox` ou `NAVIGATEUR=webkit` (moteur de Safari)
lance les mêmes tests dans ces navigateurs (`npx playwright install firefox webkit`).

## Mettre à jour le contenu (section 12 du brief)

1. Modifier le Markdown source (y compris la ligne « **Édition … — contenu à jour au … ** » : la date
   affichée partout sur le site en est tirée).
2. Si un calcul change : mettre à jour `reference-calculs.py`, puis `src/lib/calculs.ts` et
   `src/lib/calculs.test.ts` (le test différentiel compare les deux automatiquement).
3. Si le nombre de modules, questions, termes, lettres… change volontairement : ajuster
   `src/lib/attendus.ts` (le build s'arrête sinon, c'est voulu).
4. `npm run build-json -- --write`, `npm test`, `npm run build`, `npm run test:site`.

La syntaxe reconnue est celle de la section 4 du brief. Une erreur de syntaxe (encadré inconnu,
question de quiz incomplète, bloc de code non refermé…) arrête le build en citant la ligne fautive.

## Version PDF

Déposer `formation-immobilier-locatif-2026.pdf` dans le pack
(`../files/formation-immobilier-locatif-2026/`) : le build le copie dans `dist/` et affiche alors les
liens de téléchargement (accueil, pied de page, à propos). Sans ce fichier, les liens sont masqués.

## Déploiement

Le dossier `dist/` est autonome. Il est hébergé chez Hostinger (Apache) : son contenu, fichier caché
`.htaccess` compris, se dépose à la racine de `public_html` (voir `../REFERENCEMENT-GOOGLE.md`).

| Variable                  | Effet                                                                                                       |
| ------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `SITE_URL=https://…`      | Domaine des adresses canoniques, d'Open Graph et du plan du site (défaut : `https://formation-locatif.com`) |
| `BASE_PATH=/sous-dossier` | Site servi dans un sous-dossier (GitHub Pages : `/nom-du-depot`)                                            |

Chaque build produit aussi dans `dist/` :

- `sitemap.xml` (adresses canoniques indexables uniquement) et `robots.txt` (fonction `robots`) ;
- `.htaccess` (fonction `htaccess`, `src/lib/seo.ts`) : HTTPS et domaine sans « www » (301),
  `/sitemap_index.xml` → `/sitemap.xml` (301), page 404, redirections, en-têtes de sécurité et cache.

Les redirections se déclarent dans `REDIRECTIONS` (`src/lib/seo.ts`). `public/favicon.ico` est
fabriqué à partir de `public/favicon.svg` par `npm run favicon`.

À la fin du build, `scripts/check-links.ts` vérifie les liens internes et chaque ressource chargée
(scripts, styles, polices, images, icônes, préchargements) : fichier présent dans `dist/`, aucun
chargement depuis un autre domaine, `favicon.ico` présent. `scripts/check-indexation.ts` vérifie
titres et descriptions uniques, adresses canoniques absolues et plan du site cohérent.

## Éditions

Par défaut, le build produit le **site complet** : la formation en page d'accueil et les outils
gratuits (vitrine sur `/outils/`). `EDITION=outils npm run build` ne produit que les outils gratuits,
la page de vente, les tarifs, les pages d'information et les extraits gratuits (module 1.1 et une
checklist : `MODULES_GRATUITS`, `CHECKLISTS_GRATUITES`), pour le jour où le cours deviendra payant. Pages du cours :
`src/cours/` ; vitrine des outils : `src/outils/` ; routes injectées par `astro.config.mjs`. Voir
`src/lib/edition.ts`.

## Exercices et examens notés

`files/formation-immobilier-locatif-2026/exercices.md` (format décrit en tête du fichier) est lu par
`src/lib/exercices.ts` ; toute erreur arrête le build en citant la ligne. Composant
`src/components/Exercices.astro` et script `src/scripts/exercices.ts` : fin de chaque module (après le
quiz) et questions de chaque cas d'examen (le corrigé du cas s'affiche après la correction). Test final :
`src/cours/examen/test-final.astro`, banque servie en JSON (`/examen/test-final/questions.json`, chargée
au démarrage) et tirage de 50 questions au moins une par module (`tirer`, `src/scripts/test-final.ts`).
Scores dans la progression (`exercices`, `examens`) ; un module est validé quand quiz et exercices sont
réussis à 70 %.

## Tarifs et vente

Les prix se règlent dans `OFFRES` (`src/lib/seo.ts`) : niveau 1 à 97 €, niveau 2 à 197 €, niveau 3 à
297 €, formation complète à 447 €. Ils s'affichent sur `/tarifs/`, l'accueil et les pages de niveau.
Renseigner `lienAchat` (page de paiement de la plateforme de vente) fait apparaître le bouton
« Acheter » ; sans lui, le site indique « achat en ligne bientôt disponible ». Le site étant statique,
il ne protège pas le contenu payant : la plateforme de vente s'en charge.

Page de vente : `src/pages/formation-investissement-locatif.astro` (`CHEMIN_VENTE` dans
`src/lib/navigation.ts`). Encart « Aller plus loin » vers la formation : `src/components/EncartFormation.astro`
(simulateurs, lettres, fin des extraits gratuits).

**Informations du vendeur** : `src/lib/entreprise.ts` (éditeur, conditions de vente, auteur, avis
réels, formulaire e-mail, mesure d'audience). Elles alimentent `/mentions-legales/`, `/cgv/`,
`/confidentialite/`, la page de vente et le pied de page ; un champ vide s'affiche « à compléter » et
le build liste les champs manquants.

**Mesure d'audience** : aucun outil installé (`MESURE_AUDIENCE = false`) ; les pages l'indiquent. Les
attributs `data-suivi="nom"` (clic), `data-suivi-vue` (affichage) et `data-suivi-envoi` (envoi de
formulaire) restent en place pour l'outil qui sera choisi ; aucun script ne les lit aujourd'hui.

Les simulateurs sont gratuits et référencés comme tels (`src/lib/referencement-simulateurs.ts`).

## Poser une question

Page `/assistant/` (édition complète ; accès depuis les raccourcis de l'accueil, le pied de page, la
page Recherche et le lien « Une question sur ce module ? » du sommaire de chaque module, qui fait
passer les réponses de ce module en priorité).

- **Fiches** (`src/lib/assistant.ts`, publiées dans `/assistant/fiches.json`, 150 Ko compressé,
  chargé seulement sur cette page) : un passage par paragraphe à intitulé en gras des leçons, avec
  ses tableaux et encadrés ; points clés, pièges et textes de référence de chaque module ; questions
  des quiz et des exercices avec la bonne réponse et l'explication ; glossaire ; lettres types ;
  checklists ; lignes des tableaux des annexes A, B, H, I et des nouveautés (section 0.5). Rien
  n'est rédigé : tout vient du Markdown de la formation, qui reste la seule source.
- **Moteur** (`src/lib/assistant-recherche.ts`, sans dépendance, exécuté dans le navigateur) :
  mots normalisés (accents, pluriels, formes proches), synonymes du langage courant (`SYNONYMES` :
  « proprio », « Airbnb », « caution » pour le dépôt de garantie, « ne paie plus »…) et sigles du
  glossaire, classement BM25, bonus aux expressions retrouvées telles quelles. Un passage de leçon est
  préféré à une question d'exercice de pertinence voisine. En dessous de 60 % des mots de la question
  retrouvés, l'outil dit qu'il n'a pas trouvé et propose des pistes, la recherche plein texte et,
  si `EDITEUR.email` est renseigné, la question par e-mail.
- **Lien vers le passage** : ancre de la rubrique et fragment de texte (`#lecon:~:text=…`) qui ouvre
  le module sur le paragraphe et le surligne (Chrome, Edge, Safari, Firefox récents).
- **Tests** (`src/lib/assistant.test.ts`) : une liste de questions d'élèves avec le module attendu.
  Si une question réelle reçoit une mauvaise réponse, l'ajouter à cette liste, puis ajuster
  `SYNONYMES` : c'est le levier le plus simple.
- Aucun envoi de données : les questions restent dans le navigateur (sessionStorage, le temps de la
  visite, pour retrouver la conversation au retour d'un module).

## Référencement (cahier des charges SEO)

- Titres « … | Formation Locatif » (marque omise au-delà de 70 caractères, titre abrégé au-delà de 72),
  descriptions de 160 caractères au plus (coupées au mot),
  adresse canonique, Open Graph et carte Twitter `summary_large_image` sur chaque page.
- Données structurées JSON-LD dans le `<head>` : `Course` sur l'accueil, la page Tarifs et les pages
  de niveau (offres de `OFFRES` dans `src/lib/seo.ts`), `WebApplication` gratuite sur chaque simulateur, `BreadcrumbList` sur toutes les autres pages, identique au fil d'Ariane affiché.
- Polices hébergées avec le site (`fonts` dans `astro.config.mjs`), préchargées, `font-display: swap`,
  avec polices de secours aux métriques ajustées (pour limiter les sauts de mise en page au chargement).
- Aucun script tiers (ni mesure d'audience ni traceur, conformément au brief du site).
- `npm run test:site` vérifie tout cela sur chaque page.

## Architecture

```
src/
  lib/                      logique pure, testée (aucune dépendance au DOM)
    parse-formation.ts      Markdown → parties, modules, rubriques, encadrés, quiz, lettres, glossaire
    json-export.ts          régénération à l'identique des trois JSON du pack
    attendus.ts             comptages vérifiés au build (critère d'acceptation 1)
    calculs.ts              traduction fidèle de reference-calculs.py + résultats détaillés
    simulateurs.ts          les 24 simulateurs et outils : champs, valeurs par défaut, contrôles, résultats
    calculs-outils.ts       calculs des 10 outils de la version 005 (DPE, charges, courte durée…)
    render.ts               Markdown → HTML : encadrés, tableaux, formules, liens, infobulles
    glossaire-match.ts      repérage des termes (sigles sensibles à la casse)
    lettres.ts              champs à compléter des modèles de lettres
    progression.ts          progression, validation des imports
    seo.ts                  marque, titres, descriptions, fil d'Ariane JSON-LD, offre, redirections
    donnees.ts              données prêtes pour les pages (build uniquement)
  components/               Quiz, Lettre, Checklist, Frise, Simulateur, ContenuElement…
  scripts/                  îlots côté navigateur (quiz, simulateurs, lettres, progression…)
  pages/                    accueil, mode d'emploi, niveaux, modules, examens, annexes,
                            glossaire, simulateurs, à surveiller, recherche, progression, à propos
  styles/global.css         direction artistique, thème sombre, impression
scripts/
  build-json.ts, check-links.ts, test-site.ts, lighthouse.ts, image-partage.ts,
  serveur-statique.ts (serveur de dist/ avec compression, pour les tests), pont-reference.py
```

## Choix notables

- **Fidélité** : le texte n'est jamais réécrit. À l'affichage seulement, des espaces insécables
  françaises évitent les coupures dans les montants ; les intitulés des cas d'examen deviennent des titres.
- **Infobulles** : première occurrence de chaque terme par module, hors titres, tableaux, formules,
  gras et rubrique « Textes de référence ». Exclusions et variantes : `src/lib/glossaire-match.ts`.
- **Simulateurs** : valeurs par défaut issues des exemples chiffrés de la formation ; le résultat de
  l'exemple est calculé au build (visible sans JavaScript).
- **Données personnelles** : aucun traceur ; progression, scores, cases et thème restent dans le
  navigateur (`localStorage`, avec repli en mémoire si le stockage est bloqué).
