# Brief pour Claude Code — Site web « L'immobilier locatif en France » (édition septembre 2026)

Ce brief décrit le site à construire à partir des fichiers de contenu fournis. Il est destiné à Claude Code. Le contenu est rédigé et vérifié : ton travail porte sur la structure, l'interactivité, le design et la fiabilité technique, pas sur le fond juridique.

---

## 1. Objectif

Transformer une formation de 38 modules en trois niveaux (Fondations, Gestion-fiscalité-financement, Expert), avec 122 questions de quiz, trois examens de cas pratiques et neuf annexes, en un site web statique, rapide, accessible et agréable à suivre, qui permet à l'apprenant de progresser seul, de tester ses connaissances et d'utiliser des simulateurs de calcul.

Public : particuliers débutants à confirmés qui veulent devenir autonomes en investissement locatif en France. Langue : français uniquement.

---

## 2. Fichiers fournis

| Fichier | Rôle |
|---|---|
| `formation-immobilier-locatif-2026.md` | **Source unique de vérité** du contenu. Tout le site doit être généré à partir de ce fichier. |
| `structure.json` | Arborescence dérivée du Markdown (parties, modules, sections, identifiants). Pratique pour la navigation ; en cas d'écart, le Markdown prévaut. |
| `quiz.json` | Les 122 questions de quiz, par module, avec options, bonne réponse et explication. |
| `glossaire.json` | Les 180 termes du glossaire (annexe C), avec lettre et identifiant. |
| `reference-calculs.py` | Implémentation de référence de tous les calculs (annexe E) avec jeux de tests : les simulateurs doivent reproduire exactement ces résultats. |
| `formation-immobilier-locatif-2026.pdf` | Version imprimable, à proposer en téléchargement sur le site. |

Idéalement, écris un script de build qui régénère `structure.json`, `quiz.json` et `glossaire.json` depuis le Markdown, pour que la mise à jour du contenu se fasse en modifiant un seul fichier.

---

## 3. Règles d'intégrité du contenu (impératives)

1. Ne modifie jamais les chiffres, dates, taux, montants, numéros de textes (lois, décrets, articles) ni le sens des phrases. Seules les corrections typographiques évidentes sont permises, et doivent être signalées.
2. Affiche en permanence la date de mise à jour : « Contenu à jour au 24 septembre 2026 ».
3. Affiche l'avertissement de la section 0.4 sur la page d'accueil, en pied de chaque module et dans les simulateurs : la formation ne remplace pas un conseil juridique, fiscal ou financier personnalisé.
4. Les encadrés « À surveiller » signalent des textes non encore adoptés ou des échéances : ils doivent rester très visibles.
5. Ne publie aucune donnée personnelle ; aucun traceur publicitaire.

---

## 4. Syntaxe du Markdown à interpréter

| Élément | Syntaxe | Rendu attendu |
|---|---|---|
| Titre du document | `# ...` (une seule fois) | Titre du site |
| Partie | `## ...` : « 0. Mode d'emploi… », « NIVEAU 1 — … », « NIVEAU 2 — … », « NIVEAU 3 — … », « ANNEXES — … » | Page de partie, couleur de niveau |
| Module ou section | `### Module X.Y — Titre`, `### Examen …`, `### Checklist …`, `### Annexe A — …`, `### 0.1 …` | Une page par module, examen, checklist ou annexe |
| Rubrique | `#### Objectifs`, `#### Leçon`, `#### Points clés`, `#### Pièges à éviter`, `#### Textes de référence`, `#### Quiz X.Y` ; lettres `#### A` à `#### Z` dans l'annexe C ; `#### F1. …` dans l'annexe F ; `#### G1. …` dans l'annexe G | Sous-sections avec ancres |
| Encadré | Citation dont la première ligne est `> [!TYPE]`, types : `NOUVEAU`, `ATTENTION`, `EXEMPLE`, `ASTUCE`, `DEFINITION`, `A_SURVEILLER` | Composant d'encadré avec étiquette (Nouveau, Attention, Exemple chiffré, Astuce, Définition, À surveiller) ; chaque ligne `> ` est une ligne à part (conserver les retours à la ligne dans les exemples chiffrés) |
| Quiz | Bloc de code ` ```quiz ` : lignes `Q:`, `A:` à `D:`, `R:` (lettre), `E:` (explication), questions séparées par une ligne vide | Composant de quiz interactif |
| Modèle de lettre | Bloc ` ```lettre ` | Composant « lettre » : texte copiable, champs `[entre crochets]` à compléter |
| Formules | Bloc de code sans langage | Bloc de formule en police à chasse fixe (annexe E : spécification des simulateurs) |
| Tableaux | Tableaux Markdown à barres verticales | Tableaux responsives (défilement horizontal sur mobile, en-tête figé si long) |
| Listes numérotées | `1. …` | Liste ordonnée ; dans les checklists, cases à cocher |
| Glossaire | Dans l'annexe C : lignes `**Terme** : définition` | Page glossaire et infobulles |
| Séparateur | `---` | Espacement ou filet discret |

---

## 5. Architecture technique recommandée

- **Générateur statique : Astro** (TypeScript), avec parsing du Markdown au build via remark/rehype et des plugins maison pour les encadrés, les blocs `quiz` et `lettre`. Alternative acceptable : Vite + TypeScript avec rendu au build. Pas de framework lourd côté client : îlots interactifs uniquement pour les quiz, simulateurs, checklists, recherche et progression.
- **Calculs** : un module pur `src/lib/calculs.ts` (aucune dépendance au DOM), traduction fidèle de `reference-calculs.py`, couvert par des tests unitaires (Vitest) reprenant tous ses jeux de tests (section 8).
- **Recherche** : index statique généré au build (Pagefind recommandé).
- **Persistance** : `localStorage` pour la progression, les scores, l'état des checklists et le thème, avec gestion d'erreur (navigation privée) et bouton « Réinitialiser ma progression » et « Exporter / importer » (fichier JSON).
- **Hébergement** : n'importe quel hébergement statique (Hostinger, Netlify, Vercel, GitHub Pages…). Le build doit produire un dossier `dist/` autonome.
- **Qualité** : TypeScript strict, ESLint, Prettier, tests Vitest, vérification des liens internes au build.

Arborescence indicative :

```
src/
  content/formation-immobilier-locatif-2026.md
  lib/parse-formation.ts      (Markdown -> structure, quiz, glossaire, lettres, encadrés)
  lib/calculs.ts              (+ calculs.test.ts)
  components/ Callout, Quiz, Letter, Checklist, GlossaryTerm, DataTable, Timeline, Simulator*, ProgressBar, LevelBadge
  pages/ index, niveau-[n], module/[id], examen/[id], annexe/[id], glossaire, simulateurs/[id], a-surveiller, recherche, a-propos
public/formation-immobilier-locatif-2026.pdf
scripts/build-json.ts         (régénère structure.json, quiz.json, glossaire.json)
```

---

## 6. Pages et navigation

| Page | Contenu |
|---|---|
| Accueil | Promesse, trois cartes de niveaux (couleur, nombre de modules, durée indicative, progression), accès rapide aux simulateurs, au glossaire et à « À surveiller », date de mise à jour, avertissement, téléchargement du PDF |
| Mode d'emploi | Section 0 complète, dont le tableau des 20 nouveautés 2025-2026 avec liens vers les modules cités (colonne « Module ») |
| Niveau | Introduction du niveau, liste des modules avec objectifs résumés et état (non commencé, lu, quiz réussi), examen de fin de niveau |
| Module | Fil d'Ariane, sommaire latéral des rubriques (sticky sur desktop), contenu, quiz, boutons « module précédent / suivant », « marquer comme lu », temps de lecture estimé |
| Examen | Cas pratiques avec corrigés repliables (l'apprenant réfléchit avant d'ouvrir le corrigé) |
| Annexes A à I | Pages dédiées ; composants spécifiques ci-dessous |
| Glossaire | Index A–Z, filtre instantané, ancre par terme, lien retour vers les modules qui l'emploient |
| Simulateurs | Index des simulateurs puis une page par simulateur |
| À surveiller | Annexe I mise en avant, plus la liste de tous les encadrés `A_SURVEILLER` du site avec lien vers leur module |
| Recherche | Recherche plein texte avec extraits |

Navigation globale : en-tête avec niveaux, simulateurs, glossaire, recherche ; barre de progression globale ; raccourci clavier « / » pour la recherche.

---

## 7. Fonctionnalités détaillées

**7.1 Quiz.** Une question à la fois ou toutes les questions du module (au choix), sélection au clavier et à la souris, validation, affichage immédiat de la bonne réponse et de l'explication, score final, bouton « Recommencer » avec mélange optionnel de l'ordre des propositions (en conservant la correspondance de la bonne réponse), mémorisation du meilleur score. Un quiz est « réussi » à partir de 70 %. Accessibilité : `fieldset`/`legend`, `aria-live` pour le retour.

**7.2 Glossaire et infobulles.** Dans le texte des modules, repérer automatiquement la première occurrence de chaque terme du glossaire (insensible à la casse et aux accents, en évitant les titres, tableaux, formules, quiz et lettres) et l'afficher avec une infobulle accessible (activable au clavier et au toucher, `aria-describedby`). Prévoir une liste d'exclusion pour les termes trop courts ou ambigus.

**7.3 Simulateurs (à partir de l'annexe E et de `reference-calculs.py`).** Chaque simulateur : formulaire avec valeurs par défaut issues d'un exemple de la formation, résultats détaillés (étapes du calcul, pas seulement le total), lien vers le module d'explication, avertissement, possibilité de partager les paramètres via l'URL.

| Simulateur | Entrées principales | Sorties |
|---|---|---|
| Rentabilité | Prix, frais, travaux, mobilier, loyer, charges non récupérables, vacance | Rentabilités brute et nette, cash-flow mensuel |
| Mensualité de crédit | Capital, taux, durée, assurance | Mensualité, coût total, tableau d'amortissement annuel |
| Capacité d'emprunt | Revenus, loyers futurs, crédits en cours, taux, durée, assurance | Mensualité maximale (35 %), capital empruntable |
| Révision de loyer | Loyer, IRL ancien et nouveau, classe DPE, date de révision et date de demande | Nouveau loyer, date d'effet, blocage F/G |
| Pénalité de dépôt de garantie | Loyer HC, date de remise des clés, état des lieux conforme ou non, date de restitution | Délai légal, mois de retard commencés, pénalité |
| Micro-foncier ou réel | Loyers, charges détaillées, intérêts, nombre de locaux, TMI | Impôt dans chaque régime, déficit imputable et reportable (plafond 10 700 ou 21 400 €) |
| Micro-BIC ou LMNP réel | Recettes, type de meublé, charges, prix, part du terrain, durées d'amortissement, TMI | Impôt dans chaque régime, amortissements reportés |
| Jeanbrun | Prix, travaux, neuf ou ancien, type de location, plafond du foyer | Base, déduction annuelle, total sur 9 ans |
| Plus-value | Prix et date d'achat, frais, travaux, prix et date de vente, amortissements déduits | Plus-value, abattements, IR, prélèvements sociaux, surtaxe, total |
| IFI | Actifs, résidence principale, dettes | Base, IFI avec décote |
| Frais d'acquisition | Prix, ancien ou neuf, taux départemental | DMTO, émoluments, total estimé |
| TRI d'un projet | Tous les paramètres du cas d'étude du module 3.2 | TRI avec et sans levier, flux annuels, tableau de sensibilité |
| Donation | Valeur, pleine ou nue-propriété, âge de l'usufruitier, abattement disponible | Valeur taxable, droits |
| Dates de congé | Date d'échéance, type de bail, date de réception du congé | Date limite pour le bailleur, fin du préavis du locataire |

**7.4 Lettres (annexe F).** Formulaire généré à partir des champs `[…]`, aperçu en direct, boutons « Copier », « Télécharger (.txt) » et « Imprimer ». Ne jamais envoyer les données saisies à un serveur.

**7.5 Checklists (annexe G et checklist du niveau 1).** Cases à cocher persistées, remise à zéro, impression.

**7.6 Calendrier (annexe B).** Frise chronologique qui distingue le passé, l'imminent (moins de six mois) et le futur par rapport à la date du jour du visiteur, tout en rappelant que le contenu est à jour au 24 septembre 2026.

**7.7 Progression.** Pourcentage par niveau et global, modules lus, quiz réussis, badge de fin de niveau quand tous les modules du niveau sont lus et les quiz réussis, puis examen débloqué (sans empêcher l'accès libre au contenu).

**7.8 Impression.** Feuille de style d'impression propre pour chaque module ; lien vers le PDF complet.

---

## 8. Jeux de tests obligatoires pour les calculs

Tous figurent dans `reference-calculs.py` ; les tests Vitest doivent les reprendre à l'identique (tolérance 0,01 € sauf mention).

| Calcul | Entrées | Résultat attendu |
|---|---|---|
| Mensualité | 110 000 €, 3,35 %, 20 ans | 629,51 € ; assurance 0,25 % : 22,92 € par mois |
| Cash-flow (module 1.12) | Loyers 6 240 €, charges 2 127 €, mensualité et assurance ci-dessus | −309,68 € par mois |
| Révision | 700 € ; IRL 146,68 puis 148,37 | 708,07 € |
| Révision en chaîne | 900 € ; IRL 143,46, 145,47 puis 146,60 | 912,61 € puis 919,70 € |
| Pénalité de dépôt | 800 € HC, 2 mois commencés | 160 € |
| Capacité d'emprunt | 3 000 € de revenus, 700 € de loyer, 25 ans, 3,45 %, assurance 0,30 % | 1 221,50 € par mois ; environ 233 581 € (tolérance 1 €) |
| Capacité d'emprunt | 4 200 €, loyer 800 €, crédit existant 250 € | 1 416 € ; environ 270 774 € (tolérance 1 €) |
| Micro-foncier / réel | Loyers 9 600 €, charges 7 150 €, TMI 30 % | 3 171,84 € / 1 156,40 € |
| Comparatif module 2.8 | Voir le module | Micro-foncier 2 577,12 € ; réel 1 052,56 € ; micro-BIC 2 187 € ; LMNP réel 0 € avec 2 014,29 € d'amortissements reportés |
| LMNP réel (module 2.7) | Loyers 9 000 €, charges 3 500 €, amortissements 4 964,29 € | Base 535,71 € ; impôt 260,36 € |
| Déficit foncier | Loyers 8 000 €, intérêts 3 000 €, autres charges 20 000 € | Imputable 10 700 €, reportable 4 300 € ; avec plafond 21 400 € : imputable 15 000 € |
| Jeanbrun | Neuf 200 000 € | 5 600 € (intermédiaire), 7 200 € (social), 8 800 € (très social) ; ancien 150 000 € + 45 000 € de travaux : base 156 000 €, 4 680 € |
| Plus-value | Achat 100 000 € (forfaits), vente 180 000 €, 15 ans | 12 628,15 € |
| Plus-value LMNP | Achat 150 000 € (frais réels 11 000 €), vente 200 000 €, 12 ans, amortissements 45 000 € | 16 067,96 € (4 262,93 € sans réintégration) |
| Surtaxe | Plus-value imposable 55 000 € | 850 € |
| IFI | 1 320 000 € | 1 640 € |
| Frais d'acquisition | 200 000 € | DMTO 11 613,30 € (4,50 %) ou 12 637 € (5 %) ; émoluments 2 394,30 € TTC |
| Donation | Nue-propriété d'un bien de 300 000 €, usufruitier de 65 ans, abattement 100 000 € | 14 194,35 € (pleine propriété : 38 194,35 €) |
| TRI (module 3.2) | Cas d'étude complet | 11,9 % avec levier, 4,1 % sans levier ; 9,4 % à 4,20 % de taux ; 10,0 % à prix stable |

---

## 9. Direction artistique proposée (à adapter librement)

Concept : **« plan cadastral et tampons administratifs »**. L'univers visuel emprunte au parcellaire, aux plans et aux documents officiels, sans pastiche.

- **Couleurs de niveau** (identiques au PDF pour la cohérence) : Niveau 1 vert parcelle `#2E6B4F`, Niveau 2 bleu ardoise `#2B4C7E`, Niveau 3 lie-de-vin `#7A2E3A`, Annexes gris ardoise `#4A4F5A`, encre `#1C2330`, fond blanc légèrement froid (par exemple `#F5F7F6`), filets `#D3D8DE`.
- **Encadrés** : style « tampon » (bordure gauche épaisse, étiquette typographique, fond très clair) : Nouveau `#2F7D4F`, Attention `#B3261E`, Exemple `#1F5FA8`, Astuce `#9A6400`, Définition `#5B3FA0`, À surveiller `#C0561A`.
- **Typographie** : titres en grotesque géométrique (Poppins, comme le PDF, ou une alternative plus affirmée), texte courant dans un serif très lisible (Source Serif 4 ou Literata), formules en monospace (JetBrains Mono) ; chiffres tabulaires dans les tableaux et simulateurs (`font-variant-numeric: tabular-nums`).
- **Motifs** : fine trame de parcellaire dans les bandeaux de niveau (comme la couverture du PDF), numéros de module traités comme des numéros de parcelle, séparateurs en filets fins.
- **À éviter** : les combinaisons génériques crème et terracotta ou noir et vert acide, les grilles de cartes « SaaS » à ombres portées, les sur-titres en capitales espacées, les dégradés violets, les emojis décoratifs, les animations gratuites.
- **Thème sombre** optionnel, respect de `prefers-reduced-motion`.

---

## 10. Accessibilité, performance, référencement

- WCAG 2.2 niveau AA : contrastes (y compris dans les encadrés et tableaux), navigation complète au clavier, focus visible, structure de titres cohérente, libellés de formulaires, messages d'erreur explicites dans les simulateurs, tableaux avec en-têtes `th` et `scope`.
- Mobile d'abord : lisible à 360 px de large, tableaux défilants dans leur conteneur, pas de défilement horizontal de la page.
- Performance : Lighthouse au moins 95 en performance et accessibilité ; polices auto-hébergées avec `font-display: swap` ; JavaScript uniquement dans les îlots interactifs.
- Référencement : titre et description par page, balises Open Graph, plan du site, données structurées `Course` sur l'accueil.

---

## 11. Critères d'acceptation

1. Les 38 modules, 3 examens, la checklist du niveau 1, les sections 0.1 à 0.5 et les 9 annexes sont présents et fidèles au Markdown (vérification automatisée du nombre d'éléments au build).
2. Les 122 questions fonctionnent et affichent l'explication.
3. Les 180 termes du glossaire sont consultables, filtrables et utilisés en infobulles.
4. Les 14 simulateurs passent tous les jeux de tests de la section 8.
5. Les 10 modèles de lettres sont remplissables, copiables et imprimables.
6. La progression est conservée entre deux visites, exportable et réinitialisable.
7. Date de mise à jour et avertissement visibles ; encadrés « À surveiller » regroupés sur leur page.
8. Aucune erreur d'accessibilité bloquante (axe), Lighthouse au moins 95.
9. Le build part du seul Markdown : modifier une phrase dans le Markdown puis relancer le build met à jour le site.

---

## 12. Mettre à jour le contenu plus tard

Le droit évolue (voir l'annexe I : encadrement des loyers au 24 novembre 2026, projet de loi relance logement, loi de finances pour 2027, coefficient DPE 2027…). Procédure : modifier le Markdown (et, si un calcul change, `reference-calculs.py` puis `calculs.ts` et leurs tests), changer la date de mise à jour, relancer le build.

---

## 13. Prompt de démarrage à coller dans Claude Code

```
Tu travailles dans le dossier [CHEMIN_DU_DOSSIER]. Lis d'abord intégralement BRIEF-claude-code-site-formation.md, puis parcours formation-immobilier-locatif-2026.md, structure.json, quiz.json, glossaire.json et reference-calculs.py.
Construis le site décrit dans le brief, étape par étape :
1) initialise le projet Astro + TypeScript et le parseur du Markdown (encadrés, quiz, lettres, formules, tableaux, glossaire) avec un test qui vérifie les nombres d'éléments (38 modules, 122 questions, 180 termes, 10 lettres) ;
2) crée src/lib/calculs.ts à partir de reference-calculs.py avec tous les tests de la section 8 du brief ;
3) réalise les pages, la navigation et les composants ;
4) ajoute quiz, progression, glossaire en infobulles, recherche, simulateurs, lettres, checklists et calendrier ;
5) applique la direction artistique, vérifie l'accessibilité et les performances.
Règle absolue : ne modifie aucun chiffre, date ou référence juridique du contenu. Montre-moi le plan d'implémentation avant de coder, puis avance étape par étape en lançant les tests à chaque étape.
```
