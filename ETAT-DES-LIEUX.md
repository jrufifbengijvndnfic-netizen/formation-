# État des lieux — site « L'immobilier locatif en France »

Document de reprise : à lire en premier pour continuer le projet dans une nouvelle session.
Dernière mise à jour : 24 septembre 2026.

---

## 1. Ce qu'on construit

Transformer la formation livrée dans `files/` en site statique, selon
`files/BRIEF-claude-code-site-formation.md` (le cahier des charges), complété par
`files/cahier-des-charges-seo.md` (référencement, performances, domaine `formation-locatif.com`).

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
| 5. Direction artistique, accessibilité, performance | ✅ terminée — axe : 0 violation |
| Vérifications étendues (WebKit, clavier, mobiles, Lighthouse partout) | ✅ faites — voir §5 |
| Cahier des charges SEO | ✅ appliqué — écarts assumés au §3 |

Critères d'acceptation (section 11 du brief) : tous vérifiés automatiquement, voir §5.

**Reste à faire (hors code)** : déposer le PDF (voir §7) et choisir l'hébergement.

### Reconstruction du 24 septembre 2026

La session précédente (étapes 1 et 2) n'avait jamais été poussée sur GitHub : le dépôt
`formation-` était vide. Tout a été reconstruit à partir des fichiers du pack, puis poussé sur la
branche `claude/admiring-einstein-bp3wj6`.

---

**Versions** : `versions/VERSIONS.md`. Chaque nouveauté mise en ligne ajoute 1 au numéro
(version actuelle : **003**) et produit `versions/formation-location-version-NNN.zip` (contenu de
`site/dist` + `vercel.json`).

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

**Référencement** (`files/cahier-des-charges-seo.md`, tout est dans `site/src/lib/seo.ts`,
`site/src/layouts/Base.astro` et `site/astro.config.mjs`) :
- domaine par défaut `https://formation-locatif.com` (modifiable par `SITE_URL`) ; marque
  « Formation Locatif » en suffixe des titres ;
- JSON-LD `Course` sur l'accueil : nom et description repris de la page (Google exige qu'ils
  reflètent le contenu affiché ; la phrase d'exemple « devenir rentier… » du cahier n'a pas été
  reprise), durée de 45 h (minimums du tableau 0.2) ; offres des niveaux et de la formation
  complète (page Tarifs) ; `WebApplication` gratuite sur chaque simulateur ;
- `BreadcrumbList` sur toutes les pages sauf l'accueil, généré à partir du fil d'Ariane affiché ;
- `FAQPage` non appliqué : le site n'a ni blog ni FAQ, et écrire des réponses serait réécrire le
  fond (interdit par le brief) ;
- Tailwind non adopté (le cahier le « recommande ») : la feuille de style, écrite à la main, pèse
  9 Ko compressée sans règle inutilisée d'un framework ; la migrer n'apporterait rien ;
- `aria-label="Fil d'Ariane"` gardé en français (la page est en français ; le cahier écrit
  « Breadcrumb ») ;
- polices : API `fonts` d'Astro (hébergées localement, préchargées, `swap`, polices de secours
  aux métriques ajustées) ;
- 301 : `REDIRECTIONS` → `_redirects` (Netlify, Cloudflare Pages) et `vercel.json` ; la page
  `/annexe/c/` reste en repli (meta refresh, `noindex`).

**Serveur de test compressé.** `scripts/serveur-statique.ts` sert `dist/` en gzip, comme tout
hébergeur : sans compression, Lighthouse mesurait des temps irréalistes (93 au lieu de 98–100).

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
npm test                 # 141 tests : parseur, parité JSON, calculs (+ différentiel Python), rendu, SEO…
npm run build            # types + build + index Pagefind + contrôle des ~4 500 liens internes
npm run test:site        # après le build : axe, structure, SEO, 320 px, mobiles émulés, clavier, parcours
npm run lighthouse       # après le build : toutes les pages (-- --desktop : profil ordinateur)
npm run build-json       # les 3 JSON correspondent-ils au Markdown ?
npm run lint && npm run format:check
```

`npm run test:site` a besoin de Chromium : `npx playwright install chromium`, ou
`CHROMIUM_PATH=/chemin/vers/chrome` ; `NAVIGATEUR=firefox` ou `NAVIGATEUR=webkit` pour les autres
moteurs (`npx playwright install firefox webkit`).

Résultats au 24 septembre 2026 :

- 141 tests unitaires verts ; lint et formatage propres ; les 3 JSON identiques au Markdown.
- **Chromium** (`npm run test:site`) : 3 544 vérifications, 0 échec — axe (WCAG 2.2 A et AA)
  sans violation sur les 76 pages en thème clair et 8 en thème sombre ; un seul h1 dans `<main>`,
  titres sans saut de niveau, régions, titres de page uniques ; balises SEO et JSON-LD sur chaque
  page ; aucun défilement horizontal à 320 px ni sur iPhone 13 et Pixel 7 émulés ; parcours
  complet au clavier de 9 pages types (focus toujours visible et jamais masqué, pas de piège,
  lien d'évitement) ; parcours fonctionnels ; impression.
- **WebKit** (moteur de Safari, via WebKitGTK 2.52 et WebDriver) : 318 vérifications, 0 échec
  (76 pages à 1 280 et 390 px, parcours fonctionnels, recherche, thème). Ce test a révélé un
  défilement horizontal de 4 simulateurs sur mobile, corrigé.
- **Firefox et WebKit via Playwright** : non lancés, le téléchargement de ces navigateurs est
  bloqué dans l'environnement de travail. À faire sur une autre machine (§7).
- **Lighthouse, 77 pages** (serveur de test compressé comme un vrai hébergeur) :
  - mobile : performance 99 à 100 (moyenne 100) ; accessibilité, bonnes pratiques et référencement 100 ;
  - ordinateur : 100 dans les quatre catégories, sur toutes les pages.

---

## 6. Arborescence

```
Formation-immobilier/          (dépôt GitHub « formation- »)
├── ETAT-DES-LIEUX.md          ← ce fichier
├── VERIFICATION-JURIDIQUE.md  ← relecture du fond au 24 septembre 2026 (écarts à trancher)
├── TESTS-MANUELS.md           ← essais sur vrais téléphones et lecteurs d'écran
├── README.md
├── netlify.toml               ← configuration Netlify (Vercel : site/vercel.json)
├── files/
│   ├── BRIEF-claude-code-site-formation.md
│   ├── cahier-des-charges-seo.md
│   └── formation-immobilier-locatif-2026/
│       ├── formation-immobilier-locatif-2026.md   ← SOURCE UNIQUE DE VÉRITÉ
│       ├── structure.json, quiz.json, glossaire.json  ← régénérables (npm run build-json -- --write)
│       └── reference-calculs.py                   ← référence des simulateurs
└── site/                      ← voir site/README.md (architecture détaillée)
    ├── src/lib/               logique pure et testée
    ├── src/components/, src/pages/, src/scripts/, src/styles/
    └── scripts/               build-json, check-links, test-site, lighthouse, serveur-statique,
                               pont-reference.py
```

---

## 7. À faire ensuite

1. **Fond juridique** : corrections validées par l'auteur et intégrées le 24 septembre 2026
   (`VERIFICATION-JURIDIQUE.md`, « Suite donnée »). Reste un point à trancher : « déclare un
   meublé de tourisme en mairie » (module 2.12), à l'heure de Déclaloc.
2. **Tests manuels** : dérouler `TESTS-MANUELS.md` sur un iPhone, un Android, avec VoiceOver,
   TalkBack et NVDA.
3. **Firefox et Safari automatisés** : `NAVIGATEUR=firefox npm run test:site` et
   `NAVIGATEUR=webkit npm run test:site` sur une machine où `npx playwright install firefox webkit`
   fonctionne (bloqué dans l'environnement de travail, voir § 5).
4. **Vente** : prix fixés (niveau 1 : 97 €, niveau 2 : 197 €, niveau 3 : 297 €, formation complète :
   447 €), affichés sur `/tarifs/`, l'accueil et les pages de niveau. Reste à choisir la plateforme de
   paiement et d'espace membre (Systeme.io, Podia, Teachable…) : le site statique ne peut pas
   réserver le contenu aux acheteurs. Ensuite, renseigner `lienAchat` dans `OFFRES`
   (`site/src/lib/seo.ts`) et retirer du site public ce qui devient payant. Prévoir mentions légales,
   CGV (droit de rétractation), facturation et régime de TVA.
5. **Domaine** : `formation-locatif.com` (défaut du build ; le cahier des charges SEO disait `.fr`).
   Une autre adresse se choisit par `SITE_URL=https://… npm run build`.
6. **PDF** : il n'a pas été fourni à cette session. Le déposer sous
   `files/formation-immobilier-locatif-2026/formation-immobilier-locatif-2026.pdf` : le build le
   copie dans `dist/` et affiche les liens de téléchargement (masqués tant qu'il est absent).
7. **Hébergement** : Vercel, Netlify ou Cloudflare Pages (configurations fournies, redirections 301
   et en-têtes HTTPS compris), ou tout hébergement statique en déposant `site/dist/`. Voir `site/README.md`.
8. **Intégration continue** (facultatif) : un workflow GitHub Actions pourrait lancer
   `npm test`, `npm run lint` et `npm run build` à chaque envoi.
9. **Git local sur le Mac** : le travail est sur GitHub (branche `claude/admiring-einstein-bp3wj6`).
   Plutôt que de garder `.git` dans iCloud, cloner le dépôt dans un dossier local hors iCloud.

### Remarques sur le contenu

Les remarques relevées pendant l'intégration (annexe G5 « annexe 3.12 », accord de « adoptée »,
−686 € au lieu de −685 €) sont corrigées, avec la relecture juridique : voir
`VERIFICATION-JURIDIQUE.md`. Ces corrections ont été faites à la demande de l'auteur ; la règle du
brief (ne jamais modifier le fond de sa propre initiative) reste valable.
