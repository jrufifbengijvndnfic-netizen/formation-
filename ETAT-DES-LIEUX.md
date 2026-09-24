# État des lieux — site « L'immobilier locatif en France »

Document de reprise : à lire en premier pour continuer le projet dans une nouvelle session.
Dernière mise à jour : 24 septembre 2026.

---

## 1. Ce qu'on construit

Transformer la formation livrée dans `files/` en site statique, selon
`files/BRIEF-claude-code-site-formation.md` (à lire intégralement, c'est le cahier des charges).

- 38 modules sur 3 niveaux, 3 examens, 7 checklists, 9 annexes
- 122 questions de quiz, 180 termes de glossaire, 10 modèles de lettres
- 14 simulateurs de calcul
- Site statique Astro + TypeScript, hébergeable n'importe où

**Règle absolue du brief** : ne jamais modifier un chiffre, une date, un taux, un montant ou une
référence de texte juridique. Le travail porte sur la structure, l'interactivité, le design et la
fiabilité technique — jamais sur le fond.

---

## 2. Où on en est

| Étape du brief | État |
|---|---|
| 1. Projet Astro + parseur du Markdown | ✅ terminée, 33 tests verts |
| 2. `calculs.ts` (14 simulateurs) | 🚧 code écrit, **tests non écrits** |
| 3. Pages, navigation, composants | ⬜ pas commencée |
| 4. Quiz, progression, glossaire, recherche, lettres, checklists | ⬜ pas commencée |
| 5. Direction artistique, accessibilité, performance | ⬜ pas commencée |

### Étape 1 — terminée

`src/lib/parse-formation.ts` lit le Markdown et en extrait toute la structure (encadrés `> [!TYPE]`,
blocs ` ```quiz `, blocs ` ```lettre `, formules, tableaux, listes, glossaire).

Validation forte : `scripts/build-json.ts` **régénère `structure.json`, `quiz.json` et
`glossaire.json` à l'identique** des fichiers livrés dans le pack. C'est la meilleure preuve que le
parseur lit le contenu fidèlement. Ces comparaisons tournent aussi dans `npm test`
(`src/lib/json-parity.test.ts`).

Comptages vérifiés automatiquement : 56 éléments, 38 modules (12/14/12), 122 questions, 180 termes,
10 lettres, 14 blocs de formules, 46 encadrés (7 NOUVEAU, 9 ATTENTION, 15 EXEMPLE, 3 ASTUCE,
2 DEFINITION, 10 A_SURVEILLER), 7 checklists.

### Étape 2 — à finir en priorité

`src/lib/calculs.ts` transcrit `files/formation-immobilier-locatif-2026/reference-calculs.py` et
l'annexe E. **Ce module est committé sans aucun test : il n'est pas vérifié.**

La prochaine tâche est d'écrire `src/lib/calculs.test.ts` avec les 20 jeux de tests de la
**section 8 du brief** (tolérance 0,01 € sauf 1 € pour la capacité d'emprunt et 0,05 pour les TRI).

Points de vigilance repérés à la transcription :

- `plusValue` : le forfait travaux de 15 % ne s'applique **que si** la détention ≥ 5 ans ;
  l'abattement PS est non linéaire (paliers à 22 ans puis 23–30 ans).
- `surtaxe` : barème à 6 bornes avec lissage.
- `ifi` : décote `17 500 − 1,25 % × patrimoine` entre 1,3 et 1,4 M€.
- `scenarioColocation` : amortissements réputés différés et déficits reportés d'année en année —
  c'est la source d'écart la plus probable sur le TRI.
- Le fichier Python de référence passe : `python3 files/formation-immobilier-locatif-2026/reference-calculs.py`.

---

## 3. Décisions prises (et pourquoi)

**Source unique de vérité.** Le Markdown n'est pas recopié dans `site/`. Le build lit directement
`files/formation-immobilier-locatif-2026/formation-immobilier-locatif-2026.md` via `src/lib/source.ts`.
Modifier ce seul fichier et relancer `npm run build` met le site à jour — c'est le critère
d'acceptation 9 du brief.

**Identifiants tronqués à 80 caractères.** `src/lib/slug.ts` reproduit la convention des fichiers
livrés, y compris leur troncature à 80 caractères. Un seul titre est concerné (module 3.11). Sans
ça, `structure.json` ne se régénère pas à l'identique.

**`node_modules` hors iCloud.** Le dossier porte l'attribut `com.apple.fileprovider.ignore#P`, donc
iCloud ne le synchronise pas. Sans ça, ce sont 327 Mo et des dizaines de milliers de fichiers qui
partent en synchro.

---

## 4. Piège majeur : le « : » dans le chemin

Le projet est sous `…/Schöpli:cloud/…`. Ce deux-points casse le `PATH` que npm construit pour
`node_modules/.bin` : **tout script npm qui appelle un binaire par son nom échoue** avec
`command not found`.

```
sh: astro: command not found
```

D'où les scripts de `package.json`, qui appellent les binaires directement via `node` :

```json
"dev":   "node ./node_modules/astro/astro.js dev",
"test":  "node ./node_modules/vitest/vitest.mjs run",
"build": "npm run check && node ./node_modules/astro/astro.js build && node ./node_modules/pagefind/lib/runner/bin.cjs --site dist"
```

**Ne pas « corriger » ces scripts vers la forme habituelle** (`"dev": "astro dev"`) : ça les casse.
La seule vraie solution serait de renommer le dossier `Schöpli:cloud`.

---

## 5. Commandes

```bash
cd "/Users/hugopinaud/Library/Mobile Documents/com~apple~CloudDocs/Schöpli:cloud/Formation-immobilier/site"

npm install          # dépendances (déjà fait)
npm test             # 33 tests : parseur + parité JSON
npm run build-json   # vérifie que les 3 JSON se régénèrent à l'identique
npm run build-json -- --write   # les réécrit dans le pack
npm run dev          # serveur de développement (pas encore de pages)
npm run build        # build + index de recherche Pagefind
```

---

## 6. Arborescence

```
Formation-immobilier/
├── ETAT-DES-LIEUX.md          ← ce fichier
├── files/
│   ├── BRIEF-claude-code-site-formation.md      ← le cahier des charges
│   └── formation-immobilier-locatif-2026/
│       ├── formation-immobilier-locatif-2026.md ← SOURCE UNIQUE DE VÉRITÉ
│       ├── structure.json, quiz.json, glossaire.json  ← régénérables
│       └── reference-calculs.py                 ← référence des simulateurs
└── site/
    ├── package.json            ← scripts en « node ./node_modules/… » (voir §4)
    ├── scripts/build-json.ts
    └── src/lib/
        ├── source.ts           ← chemin du Markdown, date de mise à jour
        ├── types.ts, slug.ts
        ├── parse-formation.ts  + parse-formation.test.ts   (30 tests)
        ├── json-parity.test.ts (3 tests)
        └── calculs.ts          ← ⚠️ pas encore testé
```

Note : le contenu de la formation est présent **en triple** — à plat dans `files/`, dans
`files/formation-immobilier-locatif-2026/`, et dans `pack-formation-immobilier-locatif-2026.zip`.
Les copies `.md` sont identiques (`diff` vide). À nettoyer un jour.

---

## 7. État git

Dépôt initialisé, **aucun remote configuré**.

- Branche : `main`
- Commit : `5acb53f` — 27 fichiers, ~2,6 Mo (`node_modules` exclu)

Rien n'est encore poussé sur GitHub. La machine n'a ni Homebrew, ni `gh`, ni clé SSH, ni
identifiants git enregistrés. L'accès réseau à github.com fonctionne.

### Pour brancher GitHub

Option clé SSH (la plus simple ici) :

```bash
ssh-keygen -t ed25519 -C "hugo.pinaud@icloud.com"   # valider les questions, passphrase au choix
cat ~/.ssh/id_ed25519.pub                            # copier le résultat
```

Coller cette clé publique dans GitHub → *Settings* → *SSH and GPG keys* → *New SSH key*.
Créer ensuite un dépôt **vide** sur github.com (sans README ni .gitignore), puis :

```bash
cd "/Users/hugopinaud/Library/Mobile Documents/com~apple~CloudDocs/Schöpli:cloud/Formation-immobilier"
git remote add origin git@github.com:<ton-compte>/<ton-depot>.git
git push -u origin main
```

Option `gh` si tu préfères : installer Homebrew, puis `brew install gh`, puis `gh auth login`,
puis `gh repo create --source=. --private --push`.

⚠️ Le dossier `.git` est dans iCloud Drive. Si iCloud évince des fichiers en cours d'écriture, le
dépôt peut se corrompre. Plus sûr : travailler dans un clone local et garder iCloud comme miroir.

---

## 8. Prochaines actions, dans l'ordre

1. **Écrire `src/lib/calculs.test.ts`** — les 20 jeux de tests de la section 8 du brief. Rien
   d'autre ne démarre tant que ce n'est pas vert.
2. Étape 3 : pages et composants (`index`, `module/[id]`, `annexe/[id]`, `simulateurs/[id]`…).
3. Étape 4 : quiz, progression `localStorage`, glossaire en infobulles, recherche Pagefind,
   lettres remplissables, checklists, frise du calendrier.
4. Étape 5 : direction artistique « plan cadastral et tampons administratifs », accessibilité
   WCAG 2.2 AA, Lighthouse ≥ 95.
5. `site/README.md` + procédure de mise à jour du contenu (section 12 du brief).
