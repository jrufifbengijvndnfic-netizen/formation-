# Site « L'immobilier locatif en France » — édition septembre 2026

Site statique (Astro 7 + TypeScript) généré à partir d'un **seul fichier Markdown** :
`../files/formation-immobilier-locatif-2026/formation-immobilier-locatif-2026.md`.

38 modules sur trois niveaux, 3 examens, 7 checklists, 9 annexes, 122 questions de quiz,
180 termes de glossaire, 10 modèles de lettres et 14 simulateurs.

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

Le dossier `dist/` est autonome : il se dépose tel quel sur n'importe quel hébergement statique.

| Variable                  | Effet                                                                                                       |
| ------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `SITE_URL=https://…`      | Domaine des adresses canoniques, d'Open Graph et du plan du site (défaut : `https://formation-locatif.com`) |
| `BASE_PATH=/sous-dossier` | Site servi dans un sous-dossier (GitHub Pages : `/nom-du-depot`)                                            |

Chaque build produit aussi dans `dist/` :

- `sitemap.xml` (adresses canoniques indexables uniquement) et `robots.txt` ;
- `_redirects` (redirections 301) et `_headers` (HTTPS strict, sécurité, cache), lus par Netlify et
  Cloudflare Pages. Vercel lit l'équivalent dans `vercel.json` ; Netlify, `../netlify.toml`.

Les redirections se déclarent dans `REDIRECTIONS` (`src/lib/seo.ts`) ; un test vérifie que
`vercel.json` les reprend.

## Référencement (cahier des charges SEO)

- Titres « … | Formation Locatif », descriptions de 160 caractères au plus (coupées au mot),
  adresse canonique, Open Graph et carte Twitter `summary_large_image` sur chaque page.
- Données structurées JSON-LD dans le `<head>` : `Course` sur l'accueil (avec l'offre de `OFFRE`
  dans `src/lib/seo.ts`), `BreadcrumbList` sur toutes les autres pages, identique au fil d'Ariane affiché.
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
    simulateurs.ts          les 14 simulateurs : champs, valeurs par défaut, contrôles, résultats
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
