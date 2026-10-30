# Prompt Claude Code : créer un site-formation qui se vend (méthode en 10 phases)

Méthode tirée du projet formation-locatif.com (22 versions, du 24 au 29 septembre 2026), rendue
indépendante du thème.

> **Mode d'emploi (pour vous, pas pour Claude)**
>
> 1. Copiez ce fichier à la racine du nouveau projet, à côté d'un dossier `files/` qui contient la
>    formation écrite (un fichier Markdown) et, s'il y en a, les calculs de référence et le PDF.
> 2. Remplissez la section 2 : tout ce qui est entre crochets. Écrivez **[À FOURNIR]** ce que vous
>    ne savez pas encore.
> 3. Collez dans Claude Code le texte de la section « Lancement ».
> 4. À chaque phase, Claude vous montre son plan : répondez point par point, puis validez.

---

## Lancement (texte à coller dans Claude Code)

```text
Lis PROMPT-methode-site-formation.md en entier, puis ETAT-DES-LIEUX.md s'il existe.
Exécute la méthode phase par phase, de la phase 0 à la phase 9, sans sauter d'étape.
Au début de chaque phase, montre-moi le plan de la phase et attends ma validation avant de modifier quoi que ce soit.
Marque [À FOURNIR] toute information que seul le propriétaire peut apporter.
Règle absolue : ne modifie aucun chiffre, aucune date ni aucune référence du contenu de la formation.
Attends ma validation explicite avant de fusionner quoi que ce soit.
```

Pour reprendre dans une nouvelle session : « Lis ETAT-DES-LIEUX.md et PROMPT-methode-site-formation.md,
puis reprends à la phase [N]. »

---

## 1. Rôle et mission

Tu es à la fois développeur web, ingénieur qualité, spécialiste du référencement et spécialiste de
la conversion.

Mission : transformer la formation écrite fournie dans `files/` en un site statique rapide,
accessible et bien référencé, qui fait apprendre, présente l'offre et la vend, sans rien inventer.

Résultat attendu à la fin de la phase 9 :

- un site construit depuis le seul Markdown ;
- des outils gratuits qui amènent des visiteurs ;
- une pédagogie mesurable ;
- toutes les barrières de qualité au vert (phase 5) ;
- une page de vente auditée (phase 7) ;
- un accès réservé aux acheteurs (phase 8) ;
- un zip prêt à déposer chez l'hébergeur ;
- un journal de reprise à jour.

---

## 2. Faits sur le projet (à remplir par le propriétaire : seule source de vérité)

| Élément | Valeur |
| --- | --- |
| Thème de la formation | [THÈME] |
| Titre exact | [TITRE] |
| Public | [débutant, confirmé ; profil en une phrase] |
| Langue | [français] |
| Structure | [N niveaux, N modules, N examens, N annexes] |
| Évaluations existantes | [N questions de quiz ; exercices : oui ou non] |
| Outils gratuits envisagés | [calculateurs, modèles de documents, checklists, diagnostics, calendriers…] |
| Date « contenu à jour au » | [JJ mois AAAA] |
| Avertissement obligatoire | [ex. « Cette formation ne remplace pas un conseil personnalisé. »] |
| Domaine | [https://exemple.com] |
| Hébergeur | [Hostinger (Apache) ou autre] |
| Marque (suffixe des titres de page) | [NOM] |
| Prix | [prix par niveau ; prix du pack] |
| Auteur | [nom et présentation] ou [À FOURNIR] |
| Éditeur (mentions légales) | [nom ou raison sociale, statut, adresse, SIREN, e-mail] ou [À FOURNIR] |
| Paiement | [Stripe, plateforme de cours, ou plus tard] |
| Dépôt modèle (facultatif) | [lien d'un site-formation existant à copier comme point de départ] |

Tout ce qui n'est ni dans ce tableau ni dans `files/` est inconnu : marque-le [À FOURNIR] et
explique ce qu'il bloque.

---

## 3. Règles absolues

1. **Fidélité.** Ne modifie jamais un chiffre, une date, un taux, un montant, une référence de texte
   ni le sens d'une phrase du contenu. Seules les corrections typographiques évidentes sont permises,
   et signalées. Une erreur de fond repérée devient un constat soumis à l'auteur, jamais une
   correction d'initiative.
2. **Rien d'inventé.** Ni avis, ni nombre d'élèves, ni prix barré, ni compte à rebours, ni « places
   limitées », ni logo de média, ni certification.
3. **Aucune promesse de résultat** (gain, rendement, guérison, réussite garantie…). Les exemples
   chiffrés sont présentés comme des exemples.
4. **Toujours visibles** : la date « contenu à jour au » et l'avertissement, sur l'accueil, la page
   de vente, chaque module et chaque outil.
5. **Aucune donnée personnelle collectée**, aucun traceur publicitaire. La progression reste dans le
   navigateur.
6. **Chaque constat est prouvé** : fichier et ligne, capture ou mesure. Distingue toujours le
   constat, l'hypothèse et la recommandation.
7. **Plan avant code.** Au début de chaque phase, montre le plan et attends la validation. Ensuite :
   une branche par chantier, un commit par changement, les tests lancés à chaque étape, rien de
   fusionné sans accord explicite.
8. **Tout est poussé sur GitHub** à la fin de chaque étape : le conteneur de travail est éphémère, ce
   qui n'est pas poussé peut se perdre.
9. **Honnêteté sur les limites.** Ce que tu ne peux pas vérifier (vrais acheteurs, vrais téléphones,
   sources officielles inaccessibles), tu le dis, et tu prépares le protocole pour un humain.

---

## 4. Portes bloquantes

Une porte en échec = pas de trafic payant, quelle que soit la note. Les portes P10 et P11 peuvent
rester ouvertes tant que la vente n'est pas lancée : dis-le clairement.

| # | Porte | Vérification |
| --- | --- | --- |
| P1 | Le build part du seul Markdown | Modifier une phrase du Markdown, relancer le build : le site change |
| P2 | Comptages fidèles | Le build échoue si le nombre de modules, questions, termes… ne correspond plus |
| P3 | Zéro erreur publique | Zéro lien cassé, zéro ressource en 404, zéro erreur de console ; plan du site et robots.txt servis |
| P4 | Accessibilité | axe : 0 violation WCAG 2.2 A et AA ; parcours complet au clavier ; 320 px sans défilement horizontal |
| P5 | Vitesse | Lighthouse mobile ≥ 95 en performance et en accessibilité, sur toutes les pages |
| P6 | Aucune affirmation trompeuse | Revue complète des textes : liste noire, libellés exacts, promesses tenables |
| P7 | Documents légaux | Mentions légales, CGV (rétractation et son exception pour le contenu numérique), confidentialité, médiateur, mention de TVA |
| P8 | Bouton principal visible sans défiler sur mobile | Test en 375 × 667 px |
| P9 | Prix TTC visible avant paiement | Page de vente et récapitulatif de paiement |
| P10 | Contenu payant protégé | Navigation privée, sans code ni compte : l'accès direct aux pages payantes est refusé |
| P11 | Paiement de bout en bout | Achat test jusqu'à l'accès, la facture et l'e-mail ; deux cases non pré-cochées (accès immédiat, renonciation à la rétractation) |

---

## 5. Déroulé en dix phases

Pour chaque phase : **Objectif**, **À faire**, **Livrables**, **Fini quand**. À la fin de chaque
phase, arrête-toi et rends un compte rendu court : ce qui est fait, ce qui est mesuré, ce qui reste
[À FOURNIR].

### Phase 0 — Cadrer

**Objectif.** Comprendre le contenu et prendre les décisions avant d'écrire une ligne de code.

**À faire.**

1. Lis tout `files/` : la formation, les données dérivées, l'implémentation de référence des calculs
   s'il y en a une, le PDF.
2. Fais l'inventaire : niveaux, modules, rubriques, questions, termes, modèles, formules, encadrés.
   Signale toute incohérence de structure.
3. Présente-moi les sept décisions de vente, une par ligne, avec tes options et ta recommandation :
   - douleur principale mise en avant ;
   - cible prioritaire ;
   - prix ;
   - structure de l'offre (offre unique, niveaux, pack) ;
   - accompagnement tenable dans la durée ;
   - solution de vente (plateforme, site et paiement, comptes membres) ;
   - autres langues.
4. Crée `ETAT-DES-LIEUX.md` : ce qu'on construit, où on en est, chaque décision avec son pourquoi,
   les pièges rencontrés, les commandes. Il sera mis à jour à chaque version.
5. Crée `FEUILLE-DE-ROUTE.md` : les tâches jusqu'à la vente, chacune avec Objectif, À faire,
   Livrable, Fini quand, et la mention [BLOQUANT] ou [PRO] quand il le faut.

**Livrables.** `ETAT-DES-LIEUX.md`, `FEUILLE-DE-ROUTE.md`, le tableau des sept décisions rempli.

**Fini quand** les sept décisions sont prises et le plan de la phase 1 est validé.

### Phase 1 — La source unique

**Objectif.** Un seul fichier Markdown d'où sort tout le site.

**Format à lire** (adapte-le si la formation diffère, sans changer le texte) :

| Élément | Écriture dans le Markdown | Rendu sur le site |
| --- | --- | --- |
| Titre et édition | `# Titre`, puis `**Édition [mois année] — contenu à jour au [date]**` | Titre du site ; date lue ici et affichée partout |
| Partie | `## NIVEAU 1 — Titre` | Page de niveau, avec sa couleur |
| Module | `### Module 1.1 — Titre` (aussi `### Examen …`, `### Checklist …`, `### Annexe A — …`) | Une page par élément |
| Rubriques | `#### Objectifs`, `#### Leçon`, `#### Points clés`, `#### Pièges à éviter`, `#### Textes de référence`, `#### Quiz 1.1` | Sommaire du module, ancres |
| Encadré | `> [!TYPE]` : `NOUVEAU`, `ATTENTION`, `EXEMPLE`, `ASTUCE`, `DEFINITION`, `A_SURVEILLER` | Encadré coloré ; les « À surveiller » regroupés sur une page |
| Quiz | Bloc de code `quiz` : lignes `Q:`, `A:` à `D:`, `R:`, `E:` | Quiz interactif avec explication |
| Modèle de document | Bloc de code `lettre`, champs `[entre crochets]` | À remplir, copier, imprimer |
| Formule | Bloc de code sans langage | Formule en chasse fixe |
| Glossaire | `**Terme** : définition`, dans l'annexe dédiée | Page glossaire et infobulles |

**À faire.**

1. Lis le Markdown au build avec un parseur testé ; régénère à l'identique les JSON dérivés.
2. Crée `src/lib/attendus.ts` avec les comptages attendus : le build échoue s'ils ne correspondent
   plus. Un ajout volontaire = ces nombres mis à jour dans le même commit.
3. Mets les compléments dans des fichiers à côté de la source, jamais dans le texte de l'auteur.
   Chacun décrit son format dans ses premières lignes :
   - `exercices.md` : `T:` type (`qcm`, `multi`, `nombre`, `vf`), `Q:` énoncé, `A:` à `E:`, `R:`
     réponse, `U:` unité, `P:` tolérance, `E:` explication, `L: suite`, `C:` numéro du cas d'examen ;
   - `actions.md` : `## Module X.Y`, l'action en une ligne, puis `Outil : identifiant` si un outil
     aide.
4. Le build refuse un fichier mal formé en citant la ligne fautive.

**Fini quand** le build passe sur le Markdown complet et que les comptages correspondent au sommaire.

### Phase 2 — Construire le site

**Objectif.** Un site statique, généré depuis le Markdown, hébergeable partout, sans base de données.

**Pile recommandée.**

| Besoin | Choix |
| --- | --- |
| Générateur | Astro + TypeScript strict ; JavaScript seulement dans les îlots interactifs |
| Recherche | Pagefind (index statique créé au build) |
| Données de l'élève | `localStorage`, avec repli en mémoire si le stockage est bloqué |
| Polices | Auto-hébergées, préchargées, `font-display: swap` |
| Styles | Une feuille écrite à la main, sans framework CSS |
| Qualité | ESLint, Prettier, Vitest, Playwright, axe-core |

**Architecture.**

- `src/lib/` : logique pure, sans navigateur, entièrement testée (parseur, rendu, calculs, outils,
  référencement, comptages, progression) ;
- `src/components/` : quiz, modèles, checklists, outils, encadrés ;
- `src/scripts/` : le JavaScript des îlots ;
- `src/cours/` : les pages du cours ; `src/pages/` : les pages publiques (vente, tarifs, outils,
  pages légales) ;
- `scripts/` : les contrôles (liens, indexation, tests navigateur, Lighthouse) et un serveur de test
  qui compresse les fichiers comme un vrai hébergeur.

**Cinq étapes, chacune testée avant la suivante.**

1. Projet et parseur, avec un test des comptages.
2. Module de calculs traduit de l'implémentation de référence, avec tous ses cas testés.
3. Pages, navigation et composants.
4. Interactivité : quiz, progression, infobulles du glossaire, recherche, outils, modèles,
   checklists.
5. Direction artistique, accessibilité, performance.

**Pages à produire.**

- accueil ;
- mode d'emploi ;
- une page par niveau ;
- une page par module : sommaire latéral, quiz, précédent et suivant, « marquer comme lu », temps
  de lecture ;
- une page par examen, avec corrigés repliables ;
- une page par annexe ;
- glossaire filtrable de A à Z ;
- outils ;
- « À surveiller » ;
- recherche ;
- progression : export et import en JSON, réinitialisation ;
- à propos, méthode et sources, mises à jour.

**Deux éditions du même code** :

- **complète** : la formation et les outils ;
- **outils** : seulement les outils, la vente, les pages légales et les extraits gratuits, pour le
  jour où le cours sera servi ailleurs.

**Fidélité.** Le texte n'est jamais réécrit. Seule la typographie de la langue (espaces insécables
en français) est ajoutée à l'affichage, et c'est écrit sur la page À propos.

**Critères d'acceptation.**

1. Tous les éléments sont présents et fidèles au Markdown (comptages vérifiés au build).
2. Toutes les questions fonctionnent et affichent leur explication.
3. Tous les termes du glossaire sont consultables, filtrables et utilisés en infobulles.
4. Tous les outils passent leurs cas testés.
5. Les modèles se remplissent, se copient et s'impriment.
6. La progression survit à deux visites, s'exporte et se réinitialise.
7. La date et l'avertissement sont visibles ; les « À surveiller » sont regroupés.
8. axe sans erreur bloquante ; Lighthouse ≥ 95.
9. Le build part du seul Markdown.

**Fini quand** les neuf critères passent.

### Phase 3 — Les outils gratuits

**Objectif.** Des outils qui répondent à une recherche précise, puis renvoient vers le module qui les
explique.

**À faire.**

1. Chaque calcul est traduit de l'implémentation de référence, dans le même ordre d'opérations.
2. Les tests reprennent tous les cas chiffrés connus (tolérance 0,01).
3. Un **test différentiel** envoie environ 2 500 entrées aléatoires au code du site et au code de
   référence, puis compare les résultats.
4. Les valeurs par défaut viennent d'un exemple de la formation, et le résultat de cet exemple est
   calculé au build : il s'affiche même sans JavaScript.
5. Le résultat montre les étapes du calcul, pas seulement le total.
6. Les paramètres passent dans l'adresse de la page : un calcul se partage par un lien.
7. Prévois une page par outil et par modèle. Chacune a son titre, sa description pensée pour la
   recherche et ses données structurées `WebApplication` gratuites. Ajoute une vitrine `/outils/`.
8. Choisis un **outil phare**, celui qui répond à la douleur principale. Relie-le depuis l'accueil, la
   page de vente, la vitrine et les modules concernés.
9. Glossaire : infobulle sur la première occurrence de chaque terme par module, hors titres,
   tableaux, formules et gras. Les sigles respectent la casse. Une liste d'exclusion écarte les mots
   ambigus.
10. Sous chaque outil et chaque modèle, un encart « Aller plus loin » nomme le module qui explique le
    sujet, son niveau et son prix.

Si le thème n'a pas de calculs, remplace les simulateurs par des diagnostics, des modèles de
documents, des checklists ou des calendriers. La règle reste la même : une vérité de référence et
des cas testés.

**Fini quand** tous les cas testés passent, que le test différentiel ne trouve aucun écart et que
chaque outil renvoie vers un module qui existe.

### Phase 4 — Une pédagogie mesurable

**Objectif.** L'élève sait à tout moment s'il a compris : un module se valide par un quiz et dix
exercices réussis à 70 %.

**À faire.**

1. **Quiz** :
   - explication après chaque réponse, meilleur score gardé, réussite à 70 % ;
   - `fieldset`, `legend` et `aria-live` pour l'accessibilité ;
   - vérifie la répartition des bonnes réponses. Si la même lettre revient trop souvent, redistribue-la
     à l'affichage, de façon stable, sans toucher au texte source.
2. **Exercices** : dix par module, écrits uniquement depuis le texte du module. Types : choix unique,
   choix multiples, nombre à saisir, vrai ou faux. Réponses visibles seulement après « Corriger ».
   Ce sont de nouveaux contenus : **l'auteur les relit**.
3. **Examens** : questions notées par cas ; le corrigé d'un cas s'ouvre après sa correction.
4. **Test final** : 50 questions tirées dans les quiz et les exercices, au moins une par module, un
   nouveau tirage à chaque essai, et un bilan des modules à revoir.
5. **Progression sans compte** :
   - statut par module (non commencé, lu, validé) ;
   - jauges masquées tant que l'élève n'a rien fait ;
   - export et import en JSON ;
   - réinitialisation.
6. **Une action concrète par module**, de moins de dix minutes, souvent avec un outil.
7. **« Commencer ici »** : une première heure guidée (module gratuit, outil phare, un calcul, une
   checklist) pour un premier résultat sur sa propre situation.
8. **Facultatif, « Poser une question »** : retrouver, parmi des fiches tirées de la formation, le
   passage qui répond à une question écrite avec ses mots. Moteur de pertinence BM25, synonymes du
   langage courant, questions fréquentes par thème. Aucune IA générative, rien d'inventé, rien
   d'envoyé.

**Fini quand** chaque module a son quiz et ses dix exercices, que le test final tire bien une
question par module et que l'auteur a relu les exercices.

### Phase 5 — La qualité, prouvée

**Objectif.** Quatre barrières automatiques au vert avant chaque envoi, et le fond relu par un
humain.

| Barrière | Commande | Ce qu'elle vérifie |
| --- | --- | --- |
| Tests unitaires | `npm test` | Parseur, parité des JSON, calculs et test différentiel, rendu, référencement, exercices, actions |
| Build | `npm run build` | Types, pages, index de recherche, liens internes et ressources, titres, descriptions et canoniques uniques, plan du site cohérent |
| Navigateur | `npm run test:site` | axe sur toutes les pages (thème clair, échantillon en sombre), un seul h1, titres sans saut, régions, balises SEO, 320 px, iPhone et Pixel émulés, parcours complet au clavier, parcours fonctionnels, stockage bloqué |
| Vitesse | `npm run lighthouse` | Profil mobile, toutes les pages : performance, accessibilité, bonnes pratiques, référencement |

**À faire aussi.**

1. Le serveur de test compresse comme l'hébergeur ; sans cela, Lighthouse sous-estime la vitesse.
2. Lance les mêmes tests dans Firefox et WebKit (`NAVIGATEUR=firefox`, `NAVIGATEUR=webkit`).
3. Pour chaque changement visible, fais des captures avant et après en 375 et 1 440 px, et regarde-les
   une à une.
4. `TESTS-MANUELS.md` : une heure sur un vrai iPhone et un vrai Android, avec VoiceOver, TalkBack et
   NVDA, texte agrandi, mode sombre, navigation privée. Chaque étape est réussie ou non.
5. `VERIFICATION-FOND.md` :
   - refais chaque exemple chiffré et chaque corrigé avec le module de calculs ;
   - vérifie la cohérence des références citées ;
   - cherche l'actualité de chaque nouveauté datée ;
   - liste les écarts et **ne corrige que ce que l'auteur valide** ;
   - écris les limites : ce rapport n'est pas une validation par un professionnel.
6. `conformite/revue-textes.md` : recherche, dans toutes les pages publiées, des fausses urgences,
   prix barrés, avis inventés, promesses de résultat et fausses certifications.

**Fini quand** les quatre barrières sont à zéro échec, Lighthouse est ≥ 95, les tests manuels sont
prêts et les écarts de fond sont tranchés par l'auteur.

### Phase 6 — Référencement et hébergement

**Objectif.** Une requête cible par page, des balises vérifiées à chaque build, une seule adresse
servie en HTTPS.

**Règles pour chaque page.**

- Une requête par page ; jamais deux pages sur le même mot-clé ni avec le même h1.
- Titres de module : le sujet d'abord, le numéro ensuite.
- Titre de 70 caractères au plus ; marque en suffixe si elle tient.
- Description de 50 à 160 caractères, coupée au mot.
- Adresse canonique absolue ; Open Graph ; carte `summary_large_image` ; image de partage.
- Données structurées : `Course` avec ses offres, `WebApplication` pour les outils,
  `BreadcrumbList` identique au fil d'Ariane affiché, `WebSite` sur l'accueil, `FAQPage` sur la page
  de vente.
- Pages sans intérêt pour la recherche (recherche interne, progression, accès) en `noindex`, et
  retirées automatiquement du plan du site.
- Plan du site avec dates de mise à jour ; `robots.txt` qui ne ferme que l'index de recherche
  interne ; aucun script tiers.

**Contrôles qui arrêtent le build.**

- `check-links` : liens internes, ressources présentes et locales, `favicon.ico`.
- `check-indexation` : titres, descriptions et canoniques uniques ; plan du site égal à la liste
  exacte des pages indexables.

**Hébergement Apache** (ex. Hostinger) : le build génère le `.htaccess`, jamais modifié à la main.

- HTTPS imposé, adresse sans « www », en redirection 301 ;
- `DirectoryIndex index.html`, page 404, `Options -Indexes` ;
- redirection de `/sitemap_index.xml` vers `/sitemap.xml` ;
- en-têtes de sécurité ;
- cache d'un an pour les fichiers versionnés, `no-cache` pour le HTML ;
- compression.

**Livraison.** Le zip contient le site **à sa racine**, `.htaccess` compris.

**Guide `REFERENCEMENT-GOOGLE.md`.**

1. Dépôt dans `public_html` : le vider (sauf `.well-known`), envoyer le zip, « Extraire », supprimer
   le zip.
2. Search Console : propriété « Domaine », vérifiée par un enregistrement DNS TXT.
3. Envoyer `sitemap.xml`.
4. Demander l'indexation des dix pages clés, une dizaine par jour.
5. Importer le site dans Bing Webmaster Tools.
6. Obtenir des liens honnêtes, jamais achetés.
7. Prévenir des délais : quelques jours pour le nom du site, plusieurs mois pour les recherches
   disputées.

**Fini quand** les deux contrôles passent, Lighthouse donne 100 en référencement et `site:` montre
les premières pages.

### Phase 7 — Vendre, sans rien inventer

**Objectif.** Une offre écrite, une page de vente complète, un audit noté sur 100 qui dit si la page
peut recevoir du trafic.

**À faire.**

1. **Écris l'offre dans `offre/`**, un fichier par sujet :

   | Fichier | Contenu | Fini quand |
   | --- | --- | --- |
   | `promesse.md` | Une phrase de moins de 15 mots, un résultat concret, sans promesse de résultat garanti ; trois « vous saurez faire » ; dix variantes écartées | Un inconnu la reformule correctement |
   | `cible.md` | Deux ou trois profils (situation, problème, niveau) et « ce n'est pas pour vous si » | Prêt à coller dans la page |
   | `pourquoi-payer.md` | Tableau « chercher seul / suivre la formation », sans dénigrer les sources gratuites | Tient sur un écran, tout est prouvable |
   | `prix.md` | Prix, structure, comparaisons honnêtes, jamais de prix barré fictif | Justifiable en trois phrases |
   | `garantie.md` | Durée, qui, comment, en langage simple, cohérente avec le droit de rétractation | Relue avec les CGV |
   | `bonus.md` | Chaque outil ou annexe face à l'objection qu'il lève | Chaque bonus existe déjà |
   | `frontiere-gratuit-payant.md` | Ce qui est gratuit, ce qui est payant, et pourquoi | Validé par le propriétaire |

2. **Construis la page de vente en 14 blocs**, dans cet ordre :
   1. titre, sous-titre, bouton, preuve courte, visuel réel ;
   2. le problème et son coût, avec des exemples chiffrés sourcés ;
   3. la solution et la méthode ;
   4. le programme, repliable par niveau ;
   5. la démonstration gratuite ;
   6. pour qui, et pour qui ce n'est pas ;
   7. chercher seul contre suivre la formation ;
   8. l'auteur et la méthode ;
   9. les preuves ;
   10. l'offre ;
   11. la garantie ;
   12. la FAQ (au moins 15 questions, une par objection) ;
   13. le bouton final ;
   14. l'avertissement.

3. **Rédige l'audit `audit/AUDIT-VENTE.md`**, en lecture seule jusqu'au plan :
   - état des portes bloquantes (section 4) ;
   - **test des 5 secondes** sur la capture du premier écran, mobile et ordinateur. Six questions
     notées de 0 à 2 : quoi, pour qui, quel résultat, pourquoi y croire, combien, que faire. Seuil :
     11 sur 12. Pour toute note sous 2, donne la correction exacte ;
   - **analyse phrase par phrase**, avec quatre tests : « et alors ? », preuve, concret,
     suppression. Mesure aussi la longueur moyenne des phrases (moins de 20 mots), le jargon non
     expliqué au premier écran, la part de bénéfices (60 % au moins) et la liste noire (section 7) ;
   - **les 14 blocs**, chacun présent, faible ou absent ;
   - **les 20 objections** : tout est gratuit ailleurs ; je débute ; ce sera périmé ; trop
     technique ; qui êtes-vous ; combien de temps ; est-ce à jour ; remboursement ; facture ;
     conseil personnalisé ; paiement en plusieurs fois ; mobile ; durée d'accès ; mises à jour
     incluses ; accompagnement ; j'ai déjà de l'expérience ; avis ; données ; pourquoi ce prix ; et
     si je ne comprends pas. Pour chacune : où la page répond, comment, et si c'est convaincant ;
   - **les preuves et la confiance** : pour chaque élément absent, un texte provisoire honnête ;
   - **l'offre, le prix et la garantie** : deux ou trois structures à tester, sans fixer de prix à la
     place du propriétaire ;
   - **les boutons** :
     - un objectif par page ;
     - libellé verbe + bénéfice, et exact ;
     - bouton principal visible sans défiler, puis répété après chaque bloc de persuasion ;
     - trois clics au plus jusqu'au paiement ;
     - cibles tactiles de 44 px ;
     - parcours réel et parcours idéal en schéma ;
   - **le mobile et la vitesse** : textes à 16 px minimum, aucun défilement horizontal ;
   - **le référencement et le plan de marquage** soumis au consentement. Événements :
     `vue_page_vente`, `clic_cta_principal`, `debut_contenu_gratuit`, `inscription_email`,
     `debut_paiement`, `achat`, `premiere_lecon`, posés en attributs `data-suivi` avant même l'outil
     de mesure ;
   - **la grille sur 100** (section 6) ;
   - **un plan d'action noté ICE** (impact × confiance × facilité, de 1 à 10) ;
   - **la liste [À FOURNIR]**, classée par impact sur les ventes.

   Livre aussi `audit/reecritures.md` : dix titres, trois sous-titres et cinq libellés de bouton par
   titre retenu, la réécriture des trois sections les plus faibles et la FAQ.

4. **Montre-moi le plan ICE et attends ma validation.** Ensuite :
   - une action par commit, dans l'ordre ICE ;
   - captures avant et après en 375 et 1 440 px ;
   - Lighthouse sur la page touchée ;
   - puis refais le test des 5 secondes, l'analyse phrase par phrase, les objections, les boutons et
     la vitesse, et recalcule la note (`audit/scorecard.json`), en trois itérations au plus.

5. **Prépare le test humain** (`audit/test-humains.md`) : cinq personnes de la cible, sur téléphone,
   sans aide. Le protocole comprend :
   - le test des 5 secondes ;
   - quatre tâches : trouver le prix, dire ce qu'on reçoit, trouver ce qui est gratuit, aller
     jusqu'au paiement ;
   - trois questions ouvertes ;
   - une grille de saisie.

   Si trois personnes sur cinq butent au même endroit, ce point passe en tête du plan.

6. **Pages légales et informations du vendeur.**
   - Pages : mentions légales, CGV, confidentialité.
   - Les champs du vendeur vivent dans un seul fichier (`src/lib/entreprise.ts`). Un champ vide
     s'affiche « à compléter », et le build le liste.
   - Une réponse de FAQ qui dépend d'un champ vide dit « précisé à l'ouverture du paiement », puis
     se remplace seule quand le champ est renseigné.
   - Un bonus qui dépend d'un moyen absent (par exemple une adresse e-mail) ne s'affiche pas.

**Fini quand** aucune porte n'est en échec (hors P10 et P11 avant la vente), le test des 5 secondes
atteint 11 sur 12, la note est ≥ 90, et le reste est listé [À FOURNIR].

### Phase 8 — Réserver l'accès aux acheteurs

**Objectif.** Que le site fonctionne comme un produit payant, avec un niveau de protection choisi en
connaissance de cause.

**À faire.**

1. **Fixe la frontière gratuit / payant.** Par défaut :
   - verrouillés : modules (sauf un extrait gratuit), examens, test final ;
   - libres : extrait gratuit, glossaire, annexes de référence, outils, modèles.
2. **Présente-moi les options et leurs limites** avant de coder :

   | Option | Protection | Coût |
   | --- | --- | --- |
   | Verrou d'affichage par code | Un visiteur ordinaire ne lit rien sans code ; le texte reste dans le code source | Simple ; le référencement, la recherche et l'outil de questions continuent de marcher |
   | Contenu chiffré dans la page | Illisible sans code, même dans le code source | Pages retirées de Google, recherche plus pauvre |
   | Contrôle par le serveur | Réelle | Règles serveur impossibles à tester hors de l'hébergeur |
   | Paiement et espace membre | Réelle, un accès par acheteur | Compte de paiement, comptes membres |

3. **Si le verrou par code est retenu**, voici la spécification qui a fait ses preuves :
   - `src/lib/acces.ts` :
     - un code par niveau ;
     - le site ne garde que l'**empreinte** du code (SHA-256 du code précédé d'un préfixe, tronquée
       à 32 caractères), jamais le code en clair ;
     - la saisie tolère espaces, tirets et minuscules ;
   - le code est gardé dans `localStorage`, à défaut `sessionStorage`, à défaut en mémoire pour la
     visite, avec un message clair dans chaque cas ;
   - un script en ligne dans le `<head>` pose les niveaux ouverts sur `<html>` **avant
     l'affichage** : aucun clignotement du verrou ;
   - un composant `Reserve` affiche le verrou et le contenu, masqué par la feuille de style ; sans
     JavaScript, la page reste verrouillée ;
   - le verrou montre : le niveau, son prix, le champ « Votre code d'accès », « Voir les offres », et
     ce qui reste gratuit ;
   - les messages : code inconnu refusé ; code d'un autre niveau accepté, avec « il faut le code de
     ce niveau » ;
   - la page « Mes accès » (`/acces/`, en `noindex`) permet de saisir un code, de voir l'état des
     niveaux et de retirer ses codes (ordinateur partagé) ;
   - les pages de niveau affichent « Réservé » ou « Gratuit » à côté de chaque module ;
   - l'outil de questions, pour un niveau fermé, indique le module qui répond, sans le passage ;
   - sur téléphone, le sommaire du module est masqué tant que la page est verrouillée, pour que le
     verrou soit dans le premier écran ;
   - les données structurées signalent le contenu payant : `isAccessibleForFree: false` et un
     `cssSelector` sur le contenu réservé ;
   - un script `npm run code-acces -- <code> <niveau>` donne la ligne d'empreinte à ajouter.
     Retirer une ligne ferme ce code partout à la version suivante ;
   - les tests couvrent : mauvais code, bon code, mémoire d'une page à l'autre, retrait, stockage
     bloqué, clavier, 320 px, axe sur le verrou.
4. **Écris la limite là où le propriétaire la lira**, dans le README, le journal et le compte rendu :
   un verrou d'affichage n'est pas une protection par le serveur, et des codes courts se devinent.
5. **Prépare l'étape suivante** (`offre/plan-paiement-et-acces.md`) :
   - liens de paiement ;
   - deux cases non pré-cochées : accès immédiat, renonciation à la rétractation ;
   - facture automatique ;
   - page de remerciement ;
   - codes par acheteur ou espace membre.

**Fini quand** les tests du verrou passent et que la limite est écrite.

### Phase 9 — Livrer une version à la fois

**Objectif.** Toujours savoir ce qui est en ligne, et pouvoir revenir en arrière.

**À faire.**

1. **Numéroter** : chaque nouveauté ajoute 1. `versions/VERSIONS.md` reçoit une ligne : numéro, date
   et ce qui change, en langage simple.
2. **Produire le zip** `versions/[nom]-version-NNN.zip` depuis le dossier construit, fichiers à la
   racine, `.htaccess` compris. Ouvre-le pour vérifier : `index.html` et `.htaccess` à la racine, la
   nouveauté présente dans la page concernée.
3. **Mettre à jour les documents** dans la même version : `ETAT-DES-LIEUX.md`,
   `REFERENCEMENT-GOOGLE.md` (nom du zip), `README` du site, et le journal public des mises à jour
   quand le fond change.
4. **Ranger le code avec Git** :
   - une branche principale ;
   - une branche par chantier ;
   - un commit par changement, avec un message qui dit quoi et pourquoi ;
   - fusion seulement après validation explicite ;
   - tout poussé avant de rendre la main.
5. **Envoyer le zip** au propriétaire avec les instructions de dépôt et les vérifications à faire en
   ligne :
   - l'accueil ;
   - les redirections `www` et `http` ;
   - une adresse inventée (page 404) ;
   - la nouveauté elle-même.

**Fini quand** la checklist de la section 9 est entièrement cochée.

---

## 6. Grille de notation sur 100 (page de vente)

Note chaque axe de 0 à 5, justifie, puis pondère.

| Axe | Poids | Ce qui donne 5 sur 5 |
| --- | --- | --- |
| Compréhension immédiate | 20 | Test des 5 secondes à 12 sur 12, titre spécifique, aucun jargon au premier écran |
| Promesse et offre | 15 | Résultat concret, offre lisible, prix et contenu clairs, garantie visible |
| Persuasion et structure | 15 | Les 14 blocs présents, ordre logique, un bénéfice par section |
| Objections et preuves | 15 | Les 20 objections traitées, preuves vérifiables, auteur identifié |
| Friction et boutons | 10 | Un objectif par page, trois clics au plus jusqu'au paiement, boutons explicites |
| Mobile et vitesse | 10 | Lighthouse ≥ 95, aucun défilement horizontal, cibles tactiles conformes |
| Confiance et conformité | 10 | Toutes les mentions, rétractation gérée, aucune affirmation trompeuse |
| Mesure et référencement | 5 | Événements suivis avec consentement, données structurées, plan du site |

**Lecture.**

- **90 et plus, sans porte en échec** : prêt pour le trafic, y compris payant.
- **75 à 89** : corriger puis retester avant tout budget publicitaire.
- **Moins de 75, ou une porte en échec** : pas de trafic.

---

## 7. Liste noire (texte visible, boutons, métadonnées)

| Catégorie | Exemples interdits |
| --- | --- |
| Promesses de résultat | « gagnez », « garanti », « sans effort », « liberté », « résultats assurés » + **[promesses propres au secteur : À FOURNIR]** |
| Fausse urgence | « offre limitée », « dernières places », compte à rebours, prix barré fictif |
| Superlatifs | « incroyable », « révolutionnaire », « secret », « méthode infaillible » |
| Fausse preuve | Avis non vérifiés, « des milliers d'élèves », logos de médias, « recommandé par » sans source |
| Fausse qualification | « certifiante », labels ou financements revendiqués sans certification réelle |
| Ton alarmiste | « vous allez perdre », « erreur fatale » |
| Vide | « solution complète », « clé en main », « à la pointe », sans fait vérifiable |

Une négation honnête (« ce n'est pas une formation certifiante ») n'est pas une faute.

---

## 8. Pièges connus, à éviter dès le départ

- **Travail non poussé** : une session entière peut se perdre. Pousse à la fin de chaque étape.
- **Caractère spécial dans le chemin du dossier** (par exemple « : ») : les scripts npm échouent.
  Appelle les outils par `node ./node_modules/…`.
- **Zip avec un dossier intermédiaire** : le site se retrouve dans un sous-dossier. Mets les fichiers
  à la racine du zip.
- **Restes d'un ancien hébergeur** (script de mesure, fichiers de configuration) : des 404 à chaque
  visite. Le build vérifie que toute ressource existe et est locale.
- **`favicon.ico` et `/sitemap_index.xml` manquants** : des 404 inutiles. Fournis-les ou redirige.
- **Deux pages sur la même requête** : elles se concurrencent. Une requête et un h1 par page.
- **Mesures sans compression** : Lighthouse faussement bas. Le serveur de test compresse.
- **Petits scripts intégrés dans le HTML** : ils peuvent casser l'import de Pagefind. Garde les
  scripts en fichiers (`assetsInlineLimit: 0`).
- **Quiz prévisibles** : la même lettre de bonne réponse. Redistribue à l'affichage.
- **Un seul navigateur testé** : des débordements sur Safari mobile. Teste WebKit et Firefox.
- **Bouton qui promet plus que l'offre** : libellé inexact. Revue des textes à chaque changement de la
  page de vente.
- **Promesse sans moyen** (réponse par e-mail sans adresse publiée) : affiche seulement si le moyen
  existe.
- **Bouton flottant sur téléphone** qui cache une information clé : regarde les captures en 375 px.
- **Espaces insécables tapées telles quelles dans le code** : le lint échoue. Écris `&nbsp;`.
- **Retour à la ligne entre un texte et une valeur, dans un gabarit Astro** : l'espace est perdue.
  Écris `{' '}`.
- **Code du navigateur qui importe un réglage du build** (`process.env`) : erreur dans le navigateur.
  Mets les réglages partagés dans un petit fichier sans dépendance.
- **Fonctions nommées dans `page.evaluate` sous tsx** : `__name is not defined`. Passe une fonction
  anonyme ou une chaîne.
- **Sources officielles inaccessibles pendant la relecture** : appuie-toi sur des sources secondaires
  concordantes, écris les limites, et demande une relecture professionnelle.
- **Outils de commande indisponibles en cours de session** : garde le travail écrit, reprends avec
  « continue », puis relance tous les tests avant l'envoi.

---

## 9. Checklist avant chaque mise en ligne

```bash
npm run lint && npm run format:check
npm test
npm run build
npm run test:site
npm run lighthouse
cd dist && zip -qr -X ../../versions/[nom]-version-NNN.zip .
```

- [ ] Lint et formatage sans aucun problème
- [ ] Tests unitaires : 0 échec
- [ ] Build : liens, ressources et indexation au vert
- [ ] Si l'édition « outils » existe : elle construit aussi, puis on reconstruit l'édition complète pour le zip
- [ ] Tests navigateur : 0 échec
- [ ] Lighthouse mobile ≥ 95 en performance et en accessibilité sur les pages touchées
- [ ] Captures en 375 et 1 440 px des pages touchées, regardées une à une
- [ ] Contenu : aucun chiffre, date ou référence changé sans accord de l'auteur ; date « à jour au » exacte
- [ ] Page de vente modifiée : revue des textes refaite
- [ ] `VERSIONS.md`, `ETAT-DES-LIEUX.md`, `REFERENCEMENT-GOOGLE.md` et `README` à jour
- [ ] Zip ouvert et vérifié : `index.html` et `.htaccess` à la racine, nouveauté présente
- [ ] Commits poussés ; fusion seulement après validation explicite
- [ ] Après le dépôt : accueil, redirections, page 404 et nouveauté vérifiées en ligne
- [ ] Nouvelles pages publiques : plan du site renvoyé dans la Search Console

---

## 10. Livrables attendus à la fin

| Fichier ou dossier | Contenu |
| --- | --- |
| `site/` | Le code du site, ses tests et ses scripts de contrôle |
| `ETAT-DES-LIEUX.md` | Le journal de reprise |
| `FEUILLE-DE-ROUTE.md` | Les tâches vers la vente, cochées |
| `offre/` | Promesse, cible, pourquoi payer, prix, garantie, bonus, frontière, plan de paiement |
| `audit/` | Audit de vente, réécritures, test humain, notes avant et après, captures |
| `VERIFICATION-FOND.md` | La relecture du fond et la suite donnée |
| `TESTS-MANUELS.md` | Le protocole sur vrais appareils |
| `conformite/revue-textes.md` | La revue des textes de vente |
| `REFERENCEMENT-GOOGLE.md` | Mise en ligne, Search Console, Bing, liens |
| `versions/` | `VERSIONS.md` et un zip par version |

---

## 11. Fin de mission

Termine chaque grande étape, et la mission entière, par :

1. le verdict : GO ou NO-GO, et pourquoi ;
2. ce qui a changé, avec les mesures avant et après ;
3. les résultats des tests (nombre de vérifications, échecs) ;
4. les décisions qui reviennent au propriétaire ;
5. la liste [À FOURNIR], classée par impact sur les ventes ;
6. ce que tu n'as pas pu vérifier, et pourquoi ;
7. le zip de la version, envoyé.

**Attends ma validation explicite avant de fusionner quoi que ce soit.**
