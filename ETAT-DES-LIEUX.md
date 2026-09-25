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
- 24 simulateurs et outils de calcul : les 14 de l'annexe E et 10 outils ajoutés en version 005
  (DPE, charges, courte durée, Denormandie, Loc'Avantages, relocation, encadrement, usure, TVA, loyer au m²)
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

**Deux éditions** (`site/src/lib/edition.ts`) :
- **« complete »** (par défaut, c'est le site public) : la formation en page d'accueil (modules, quiz,
  examens, checklists, annexes, glossaire, recherche, progression) et les outils gratuits : vitrine sur
  `/outils/`, 24 simulateurs, 10 modèles de lettres (`/lettres/…`). Les outils servent à attirer du
  trafic et de la visibilité vers la formation.
- **« outils »** (`EDITION=outils npm run build`) : seulement les outils gratuits, la page de vente,
  les tarifs, les pages légales et les **extraits gratuits** (module 1.1 et checklist « Mettre en
  location son premier logement », `MODULES_GRATUITS` et `CHECKLISTS_GRATUITES` dans
  `site/src/lib/edition.ts`), pour le jour où le cours sera réservé aux acheteurs.
`npm run test:site` teste l'édition construite (les deux passent).

**Hébergement et référencement** : le domaine `formation-locatif.com` pointe vers Hostinger (plan
Premium), où le site est déposé dans `public_html` ; le build produit un `.htaccess`. Guide de mise en
ligne et de Google Search Console : `REFERENCEMENT-GOOGLE.md`. Codes de vérification éventuels :
`VERIFICATIONS` dans `site/src/lib/seo.ts`.

**Feuille de route vers la vente** : `FEUILLE-DE-ROUTE-implementation.md` (état d'avancement en tête).
Décisions de la phase 0 et textes de l'offre dans `offre/` ; plan technique du paiement Stripe et
de l'espace membre à valider : `offre/plan-paiement-et-acces.md`. Actions de fin de module :
`files/formation-immobilier-locatif-2026/actions.md` (38, testées). Revue de conformité des textes :
`conformite/revue-textes.md`. Journal public des mises à jour : `MISES-A-JOUR.md`.

**Exercices et examens notés** (version 010, à la demande de l'auteur) :
`files/formation-immobilier-locatif-2026/exercices.md`, à côté du Markdown de la formation, qu'il ne
modifie pas. 10 exercices par module (380), tirés uniquement du texte du module, calculs détaillés dans
l'explication ; 43 questions notées pour les cas des trois examens. Le build vérifie le fichier
(`site/src/lib/exercices.ts`, tests dans `exercices.test.ts`) : dix exercices par module, une question
au moins par cas, réponses cohérentes. Un module est validé quand son quiz ET ses exercices sont réussis
à 70 %. Test final de 50 questions (`/examen/test-final/`) tiré dans les quiz et les exercices autonomes
(`L: suite` exclut les exercices qui prolongent le précédent). **À relire par l'auteur** : ce sont de
nouveaux contenus pédagogiques.

**Vente et conversion** (audit `audit/AUDIT-conversion.md`, mis en œuvre en version 009, compte
rendu dans `audit/MISE-EN-OEUVRE.md`) :
- page de vente `/formation-investissement-locatif/` (problème, méthode, programme, extraits
  gratuits, pour qui, offre, 16 questions fréquentes) ; boutons « Commencer gratuitement le
  niveau 1 » et « Voir le programme et les prix » en haut de l'accueil, des Tarifs et de la vitrine ;
- encart « Aller plus loin » (module qui explique l'outil + prix du niveau) sur chaque simulateur,
  chaque lettre et à la fin des extraits gratuits (`site/src/components/EncartFormation.astro`) ;
- pages `/mentions-legales/`, `/cgv/`, `/confidentialite/` ; **informations du vendeur à renseigner
  dans `site/src/lib/entreprise.ts`** (le build liste les champs encore vides ; les pages affichent
  « à compléter ») ;
- mesure d'audience sans cookie (Vercel Web Analytics, `MESURE_AUDIENCE`) et événements
  `data-suivi` (clic_cta_principal, debut_contenu_gratuit, clic_encart_formation, clic_fin_extrait,
  vue_page_vente, debut_paiement…) ; à activer dans Vercel → projet → Analytics ;
- formulaire d'inscription par e-mail prêt, affiché dès que `FORMULAIRE_EMAIL.action` est renseigné.

**Versions** : `versions/VERSIONS.md`. Chaque nouveauté mise en ligne ajoute 1 au numéro
(version actuelle : **013**) et produit `versions/formation-location-version-NNN.zip` (contenu de
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
- `FAQPage` non appliqué : la seule FAQ est celle de la page de vente, et Google n'affiche plus ces
  extraits que pour quelques sites officiels ;
- titres de page : marque en suffixe seulement si le total tient en 70 caractères ; un titre de
  module plus long que 72 caractères est abrégé avant son sous-titre, dans la balise `<title>`
  seulement (`titreDePage`, `site/src/lib/seo.ts`) ;
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

**Ordre des propositions de quiz** (`site/src/lib/ordre-quiz.ts`). Dans le texte, la bonne réponse est
« B » 97 fois sur 122 (jamais « D ») : les quiz semblaient tous identiques. L'affichage place la bonne
réponse à une lettre différente pour chaque question d'un même quiz, de façon stable ; le texte et
`quiz.json` sont inchangés.

**Avertissement discret.** Le texte de la section 0.4 reste affiché intégralement sur chaque page
d'outil (brief), en petit, sous un filet, sans cadre.

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
   447 €) ; page de vente, pages légales et mesure prêtes (version 009). Reste à fournir :
   - la plateforme de paiement et d'espace membre (Systeme.io, Podia, Teachable…), puis `lienAchat`
     dans `OFFRES` (`site/src/lib/seo.ts`) : les boutons « Acheter » apparaissent alors ;
   - l'identité du vendeur, la mention de TVA, l'accès, les mises à jour, la facture, le paiement, le
     médiateur de la consommation et l'auteur dans `site/src/lib/entreprise.ts` (CGV à faire relire
     par un juriste) ;
   - le service d'e-mailing (adresse du formulaire) et l'aimant « calendrier du bailleur 2026-2027 » ;
   - l'activation de Web Analytics dans Vercel (les événements personnalisés demandent l'offre Pro) ;
   - le jour venu, publier l'édition « outils » (`EDITION=outils`) pour réserver le cours aux acheteurs.
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
