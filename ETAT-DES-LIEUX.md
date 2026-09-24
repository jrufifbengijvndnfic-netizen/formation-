# État des lieux — site « L'immobilier locatif en France »

Document de reprise : à lire en premier pour continuer le projet dans une nouvelle session.
Dernière mise à jour : 24 septembre 2026.

---

## 1. Ce qu'on construit

Transformer la formation livrée dans `files/` en site statique, selon
`files/BRIEF-claude-code-site-formation.md` (le cahier des charges).

- 38 modules sur 3 niveaux, 3 examens, 7 checklists, 9 annexes
- 122 questions de quiz, 180 termes de glossaire, 10 modèles de lettres
- 14 simulateurs de calcul
- Site statique Astro 7 + TypeScript, hébergeable n'importe où

**Règle absolue du brief** : ne jamais modifier un chiffre, une date, un taux, un montant ou une
référence de texte juridique. Le travail porte sur la structure, l'interactivité, le design et la
fiabilité technique — jamais sur le fond.

---

## 2. Où on en est

| Étape du brief | État |
|---|---|
| 1. Projet Astro + parseur du Markdown | ✅ terminée — les 3 JSON se régénèrent à l'identique |
| 2. `calculs.ts` (14 simulateurs) | ✅ terminée — section 8 du brief, toutes les assertions du Python, test différentiel |
| 3. Pages, navigation, composants | ✅ terminée — 78 pages |
| 4. Quiz, progression, glossaire, recherche, lettres, checklists, frise | ✅ terminée |
| 5. Direction artistique, accessibilité, performance | ✅ terminée — axe : 0 violation, Lighthouse 98–100 |

Critères d'acceptation (section 11 du brief) : tous vérifiés automatiquement, voir §5.

**Reste à faire (hors code)** : déposer le PDF (voir §7) et choisir l'hébergement.

### Reconstruction du 24 septembre 2026

La session précédente (étapes 1 et 2) n'avait jamais été poussée sur GitHub : le dépôt
`formation-` était vide. Tout a été reconstruit à partir des fichiers du pack, puis poussé sur la
branche `claude/admiring-einstein-bp3wj6`.

---

## 3. Décisions prises (et pourquoi)

**Source unique de vérité.** Le build lit directement
`files/formation-immobilier-locatif-2026/formation-immobilier-locatif-2026.md` (cherché en
remontant depuis le dossier courant, voir `site/src/lib/source.ts`). Modifier ce seul fichier et
relancer `npm run build` met le site à jour ; en développement, la page se recharge d'elle-même.
La date « Contenu à jour au … » est lue dans la ligne d'édition du Markdown.

**Comptages vérifiés au build.** `site/src/lib/attendus.ts` fixe les nombres attendus ; le build
s'arrête s'ils ne correspondent plus (critère d'acceptation 1). Correction par rapport à l'ancien
état des lieux : le document compte **18** blocs de formules sans langage (14 dans l'annexe E,
4 dans les modules 1.12, 2.1, 3.2 et 3.5), et non 14.

**Identifiants tronqués à 80 caractères.** `site/src/lib/slug.ts` reproduit la convention des
fichiers livrés (un seul titre concerné : module 3.11).

**Adresses courtes.** `/module/1-1/`, `/examen/niveau-1/`, `/annexe/a/`… ; l'annexe C est la page
`/glossaire/` (`/annexe/c/` y redirige). La progression est indexée par numéro de module (« 1.1 »),
stable même si un titre change.

**Calculs.** `calculs.ts` reprend `reference-calculs.py` à l'identique (mêmes formules, même ordre
d'opérations). Le test `calculs-differentiel.test.ts` envoie ~2 500 entrées aléatoires aux deux
implémentations et compare les résultats. Le cas du module 3.2 est généralisé (`simulerProjet`) :
il reproduit tout le tableau annuel et le tableau de sensibilité du module.

**Typographie.** À l'affichage seulement, des espaces insécables françaises sont ajoutées (milliers,
unités, « : ; ? ! », guillemets). C'est la seule adaptation, signalée sur la page À propos.

**Infobulles du glossaire.** Première occurrence de chaque terme par module (hors titres, tableaux,
formules, gras, liens, rubrique « Textes de référence »). Les sigles (TRI, VAN, ORT…) sont
reconnus avec leur casse exacte pour ne pas confondre « TRI » et « tri ». Termes exclus : Bail,
Congé, Zonage A, B, C.

**Scripts en fichiers séparés** (`assetsInlineLimit: 0`) : l'intégration en ligne des petits
scripts par Astro 7 casse l'import dynamique de Pagefind (placeholder `__VITE_PRELOAD__` non remplacé).

---

## 4. Piège majeur : le « : » dans le chemin

Le projet est sous `…/Schöpli:cloud/…`. Ce deux-points casse le `PATH` que npm construit pour
`node_modules/.bin` : **tout script npm qui appelle un binaire par son nom échoue** avec
`command not found`. Les scripts de `site/package.json` appellent donc les binaires via `node` :

```json
"dev":   "node ./node_modules/astro/bin/astro.mjs dev",
"test":  "node ./node_modules/vitest/vitest.mjs run",
"build": "npm run check && node ./node_modules/astro/bin/astro.mjs build && node ./node_modules/pagefind/lib/runner/bin.cjs --site dist && node ./node_modules/tsx/dist/cli.mjs scripts/check-links.ts"
```

Attention : avec **Astro 7**, le binaire est `astro/bin/astro.mjs` (et non plus `astro/astro.js`
comme sous Astro 5). **Ne pas « corriger » ces scripts vers la forme habituelle** (`"dev": "astro dev"`).

---

## 5. Commandes et vérifications

```bash
cd site
npm install
npm test                 # 135 tests : parseur, parité JSON, calculs (+ différentiel Python), rendu…
npm run build            # types + build + index Pagefind + contrôle des ~4 100 liens internes
npm run test:site        # après le build : axe sur toutes les pages, 360 px, 196 vérifications
npm run build-json       # les 3 JSON correspondent-ils au Markdown ?
npm run lint && npm run format:check
```

`npm run test:site` a besoin de Chromium : `npx playwright install chromium`, ou
`CHROMIUM_PATH=/chemin/vers/chrome`.

Résultats au 24 septembre 2026 : 135 tests unitaires verts ; axe (WCAG 2.2 A et AA) sans
violation sur les 76 pages en thème clair et 8 en thème sombre ; aucune page ne défile
horizontalement à 360 px ; Lighthouse (mobile) : performance 98–99, accessibilité, bonnes
pratiques et référencement 100 (accueil, module 2.1, simulateur TRI).

---

## 6. Arborescence

```
Formation-immobilier/          (dépôt GitHub « formation- »)
├── ETAT-DES-LIEUX.md          ← ce fichier
├── README.md
├── files/
│   ├── BRIEF-claude-code-site-formation.md
│   └── formation-immobilier-locatif-2026/
│       ├── formation-immobilier-locatif-2026.md   ← SOURCE UNIQUE DE VÉRITÉ
│       ├── structure.json, quiz.json, glossaire.json  ← régénérables (npm run build-json -- --write)
│       └── reference-calculs.py                   ← référence des simulateurs
└── site/                      ← voir site/README.md (architecture détaillée)
    ├── src/lib/               logique pure et testée
    ├── src/components/, src/pages/, src/scripts/, src/styles/
    └── scripts/               build-json, check-links, test-site, pont-reference.py
```

---

## 7. À faire ensuite

1. **PDF** : il n'a pas été fourni à cette session. Le déposer sous
   `files/formation-immobilier-locatif-2026/formation-immobilier-locatif-2026.pdf` : le build le
   copie dans `dist/` et affiche les liens de téléchargement (masqués tant qu'il est absent).
2. **Hébergement** : définir `SITE_URL` (et `BASE_PATH` pour un sous-dossier) au build, puis déposer
   `site/dist/`. Voir `site/README.md`.
3. **Intégration continue** (facultatif) : un workflow GitHub Actions pourrait lancer
   `npm test`, `npm run lint` et `npm run build` à chaque envoi.
4. **Git local sur le Mac** : le travail est sur GitHub (branche `claude/admiring-einstein-bp3wj6`).
   Plutôt que de garder `.git` dans iCloud, cloner le dépôt dans un dossier local hors iCloud.

### Remarques sur le contenu (non corrigées, à trancher par l'auteur)

Le texte n'a pas été modifié ; ces points relevés pendant l'intégration méritent une vérification :

- **Annexe G, G5, point 6** : « indicateurs de l'annexe 3.12 » — il s'agit sans doute du
  **module** 3.12 (le tableau d'indicateurs y figure).
- **Module 3.8, encadré « À surveiller »** : « Un texte dit « RIPOST » … a été adopté**e** » —
  accord à vérifier (« adopté »).
- **Module 3.2, tableau de sensibilité** : « Loyer de 420 € par chambre » → cash-flow année 1
  affiché −686 € ; le modèle de référence donne −685,23 € (écart d'arrondi sur l'assurance loyers
  impayés : 453,60 € arrondis à 454 €). Le TRI (9,3 %) est identique.
