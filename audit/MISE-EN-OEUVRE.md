# Mise en œuvre de l'audit de conversion — version 009

Suite de `audit/AUDIT-conversion.md` (plan d'action du § 12), validé en entier par le propriétaire
le 24 septembre 2026. Règles tenues : aucun chiffre, aucune date ni aucune référence juridique de la
formation modifiés ; aucun avis ni chiffre inventé ; l'avertissement reste sur chaque page ; ce qui
manque est affiché « à compléter » ou masqué, jamais deviné.

Preuves : captures **avant** dans `audit/captures/`, **après** dans `audit/captures-apres/` (375 px
« mobile » et 1440 px « bureau » ; `-haut` = premier écran, `-page` = page entière, `-encart` =
encart vers la formation ; préfixe `edition-outils-` = édition sans le cours).

---

## 1. Actions réalisées

| # | Action | Fichiers | Preuve avant → après |
|---|---|---|---|
| A1 | Deux boutons en haut de l'accueil : « Commencer gratuitement le niveau 1 » (module 1.1) et « Voir le programme et les prix » (page de vente). Mêmes boutons sur Tarifs et sur la vitrine des outils | `src/cours/formation.astro`, `src/pages/tarifs.astro`, `src/outils/accueil.astro`, `global.css` (`.bandeau__actions`) | `accueil-mobile-haut.jpg` : aucun bouton → 2 boutons visibles sans défiler |
| A2 | Titre orienté résultat « Louez, gérez et déclarez votre bien sans erreur coûteuse », surtitre avec le nom de la formation, sous-titre chiffré, ligne « Pour qui » (publics du tableau 0.2), prix sous les boutons | `src/cours/formation.astro` | idem ; test des 5 secondes ci-dessous |
| A3 | Jauges « 0 % » et barre « Ma progression » masquées tant qu'aucun module n'est lu (classe posée dans `<head>`, donc sans décalage : CLS 0) | `src/layouts/Base.astro`, `src/scripts/global.ts`, `global.css` | `accueil-mobile-haut.jpg` : barre « Ma progression : 0 % » → absente |
| A4 | Encart « Aller plus loin » : modules qui expliquent l'outil, niveau et prix, bouton « Découvrir la formation ». Sur les 24 simulateurs et les 10 lettres | `src/components/EncartFormation.astro`, `src/pages/simulateurs/[id].astro`, `src/pages/lettres/[slug].astro` | `simulateur-rentabilite-*-encart.jpg`, `lettre-revision-*-encart.jpg` |
| A5 | Phrase corrigée sur les 6 outils dont l'exemple n'est pas celui de la formation (DPE, Denormandie, Loc'Avantages, encadrement, usure, TVA) : « Les valeurs proposées sont un exemple… », bouton « Revenir aux valeurs d'exemple » | `src/lib/simulateurs.ts` (`exempleIllustratif`), `src/components/Simulateur.astro`, `src/pages/simulateurs/[id].astro` | `simulateur-dpe-mobile-haut.jpg` |
| A6 | Titre de l'accueil : « Formation investissement locatif en ligne : louer, gérer, déclarer » | `src/cours/formation.astro` | balise `<title>` de `dist/index.html` |
| B1 | Extraits gratuits (module 1.1, checklist « Mettre en location son premier logement ») publiés dans les deux éditions, avec encart de fin ; l'édition « outils » ne contient plus que des liens vers des pages publiées | `src/lib/edition.ts`, `astro.config.mjs`, `src/lib/donnees.ts`, `src/cours/module/[id].astro`, `src/cours/checklist/[id].astro` | `edition-outils-module-1-1-*-encart.jpg` ; `EDITION=outils npm run build` : 46 pages, aucun lien cassé |
| B2 | Page de vente `/formation-investissement-locatif/` : promesse, problème (exemples du module 2.6 et de l'examen final, présentés comme exemples), méthode, « Tout est sur service-public.fr ? Presque. », programme repliable, extraits gratuits, pour qui / pas pour qui, méthode, offre, FAQ, bouton final, avertissement. Reliée depuis l'accueil, Tarifs, les encarts, l'en-tête (« Tarifs » ; « La formation » dans l'édition outils) et le pied de page | `src/pages/formation-investissement-locatif.astro`, `src/components/EnTete.astro`, `src/components/PiedDePage.astro` | `page-de-vente-*` (avant : page absente ; maquette `maquette-page-de-vente-*`) |
| B3 | Pages `/mentions-legales/`, `/cgv/` (rétractation L. 221-18 et L. 221-28 13°, garantie légale de conformité, médiation L. 612-1), `/confidentialite/` ; © et liens dans le pied de page ; le build liste les informations manquantes | `src/pages/mentions-legales.astro`, `src/pages/cgv.astro`, `src/pages/confidentialite.astro`, `src/lib/entreprise.ts`, `src/components/Info.astro`, `astro.config.mjs` | `mentions-legales-*`, `cgv-*`, `confidentialite-*` |
| B4 | Formulaire d'inscription (aimant « calendrier du bailleur 2026-2027 »), double consentement géré par le service d'e-mailing ; **masqué** tant que `FORMULAIRE_EMAIL.action` est vide | `src/components/InscriptionEmail.astro` (page de vente, simulateurs) | — (non affiché) |
| B5 | Mesure d'audience sans cookie (Vercel Web Analytics) et plan de marquage : `clic_cta_principal`, `debut_contenu_gratuit`, `clic_programme_prix`, `clic_encart_formation`, `clic_fin_extrait`, `vue_page_vente`, `debut_paiement` (+ `debut_paiement_<offre>`), `demande_inscription_email` | `src/layouts/Base.astro`, `src/scripts/global.ts`, attributs `data-suivi` | — |
| B6 | FAQ de 16 questions (réponses tirées du produit ; celles qui dépendent d'une information manquante n'apparaissent qu'une fois l'information renseignée) ; garantie : affichée si renseignée, sinon rappel du droit de rétractation | page de vente | `page-de-vente-*-page.jpg` |
| C2 | Bloc auteur et avis prêts (`AUTEUR`, `AVIS`), affichés seulement renseignés — aucun avis inventé | `src/lib/entreprise.ts`, page de vente | — |
| C4 | Titres de page : marque omise au-delà de 70 caractères, titre de module abrégé avant son sous-titre au-delà de 72 (balise `<title>` seulement, le titre affiché est intact) ; titre de `/simulateurs/` raccourci | `src/lib/seo.ts`, `src/pages/simulateurs/index.astro` | 59 titres sur 100 dépassaient 70 caractères → 3 sur 103 (71 et 72 caractères), aucun au-delà de 72 |
| § 7 | Sigles expliqués sous le titre des outils (DPE, LMNP, BIC, IRL, TRI, TAEG) | `src/lib/referencement-simulateurs.ts` (`siglesAExpliquer`) | `simulateur-dpe-mobile-haut.jpg` |
| § 9 | Mention courte près des résultats qui concluent (DPE, encadrement) : « Résultat indicatif… ne remplace pas l'avis d'un professionnel » | `src/pages/simulateurs/[id].astro` | `simulateur-dpe-*-page.jpg` |
| § 10 | `Course` avec `hasCourseInstance` aussi sur Tarifs et sur la page de vente (fonction commune) | `src/lib/cours-jsonld.ts` | — |

Choix assumé : l'édition publique reste la **complète** (la formation en page d'accueil), comme le
propriétaire l'a demandé ; l'édition « outils » est prête pour le jour où le cours deviendra payant
(B1 : il suffit de construire avec `EDITION=outils`).

## 2. Preuves avant / après

### Test des 5 secondes (premier écran seul, 0 = absent, 1 = flou, 2 = clair)

| Question | Accueil mobile avant → après | Accueil bureau avant → après | Tarifs mobile avant → après |
|---|---|---|---|
| Qu'est-ce que c'est ? | 1 → 2 (surtitre « Formation en ligne … ») | 1 → 2 | 1 → 1 |
| Pour qui ? | 1 → 2 (ligne « Pour qui ») | 1 → 2 | 1 → 1 |
| Quel résultat concret ? | 1 → 2 (« Louez, gérez et déclarez… ») | 1 → 2 | 0 → 0 |
| Pourquoi y croire ? | 1 → 1 (date, chiffres ; auteur et avis à fournir) | 1 → 1 | 0 → 0 |
| Combien et quoi exactement ? | 0 → 1 (prix visibles ; accès et mises à jour à fournir) | 1 → 1 | 1 → 2 |
| Que faire maintenant ? | 0 → 2 (deux boutons) | 0 → 2 | 0 → 2 |
| **Total** | **4 → 10 / 12** | **5 → 10 / 12** | **3 → 6 / 12** |

### Tests automatiques (24 septembre 2026)

| Contrôle | Résultat |
|---|---|
| `npm test` (Vitest) | 204 tests réussis (nouveaux : titres de page, sigles) |
| `npm run lint`, `astro check` | 0 erreur |
| `npm run build` (édition complète) | 105 pages, 7 019 liens internes, aucun lien cassé |
| `npm run test:site` (édition complète) | 4 281 vérifications, 0 échec (axe WCAG 2.2 AA clair et sombre, clavier, 320 px, appareils émulés, SEO, parcours) |
| `EDITION=outils npm run build` puis `test:site` | 46 pages, 2 030 liens, 1 200 vérifications, 0 échec |

### Lighthouse mobile des pages touchées

Mesure du 24 septembre 2026, profil mobile, serveur de test compressé (`audit/lighthouse-apres.json`). Avant : `audit/lighthouse-pages-cles.json` ; « nouvelle » = page créée par cette version ; « non mesurée » = page existante absente de la mesure d'avant. Un écart de 1 point de performance est la variation normale d'une mesure à l'autre.

| Page | Perf. avant → après | Access. | Bonnes pratiques | Référencement | LCP | CLS | Poids avant → après |
|---|---|---|---|---|---|---|---|
| `/` | 99 → 100 | 100 | 100 | 100 | 1.8 s | 0 | 130 → 132 Ko |
| `/formation-investissement-locatif/` | nouvelle → 100 | 100 | 100 | 100 | 1.8 s | 0 | 135 Ko |
| `/tarifs/` | 99 → 100 | 100 | 100 | 100 | 1.8 s | 0 | 130 → 131 Ko |
| `/module/1-1/` | 100 → 99 | 100 | 100 | 100 | 1.8 s | 0 | 139 → 140 Ko |
| `/checklist/mettre-en-location-son-premier-logement/` | non mesurée → 100 | 100 | 100 | 100 | 1.8 s | 0.026 | 132 Ko |
| `/outils/` | 100 → 100 | 100 | 100 | 100 | 1.8 s | 0 | 132 → 133 Ko |
| `/simulateurs/rentabilite/` | 99 → 99 | 100 | 100 | 100 | 2.0 s | 0 | 160 → 161 Ko |
| `/simulateurs/dpe-location/` | non mesurée → 99 | 100 | 100 | 100 | 2.0 s | 0 | 160 Ko |
| `/lettres/revision-du-loyer/` | 100 → 100 | 100 | 100 | 100 | 1.8 s | 0 | 134 → 136 Ko |
| `/mentions-legales/` | nouvelle → 100 | 100 | 100 | 100 | 1.8 s | 0 | 130 Ko |
| `/cgv/` | nouvelle → 100 | 100 | 100 | 100 | 1.8 s | 0 | 131 Ko |
| `/confidentialite/` | nouvelle → 100 | 100 | 100 | 100 | 1.8 s | 0 | 130 Ko |

Le CLS de 0,026 de la checklist vient du chargement des polices (0,051 lors de la mesure précédente de cette page) ; les jauges masquées (A3) ne créent aucun décalage.

## 3. Points restants

- **Vendre** : aucun paiement n'est encore possible ; les cartes de prix affichent « Achat en ligne
  bientôt disponible ». Dès que `lienAchat` est renseigné, les boutons « Acheter » apparaissent
  (événement `debut_paiement`).
- **Contenu payant non protégé** tant que l'édition complète est en ligne (décision du propriétaire).
- **Événements `achat`, `premiere_lecon`, `inscription_email` confirmée** : dépendent de la
  plateforme de vente et du service d'e-mailing.
- **C1** (espace membre intégré) et **C3** (pages d'atterrissage par canal) : chantiers structurels,
  à lancer après le choix de la plateforme et des canaux.
- **CGV** : trame complète, à faire relire par un juriste (renoncement à la rétractation, garantie,
  médiateur, TVA).
- **Mesure** : activer Web Analytics dans Vercel (projet → Analytics → Enable). Sans activation, le
  script `/_vercel/insights/script.js` répond 404 (sans effet sur le site, mais une erreur dans la
  console). Les événements personnalisés demandent l'offre Pro de Vercel ; les pages vues sont
  comptées dans toutes les offres.

## 4. Informations encore à fournir (`site/src/lib/entreprise.ts`)

| Champ | Où il s'affiche |
|---|---|
| `EDITEUR` : nom, statut, adresse, immatriculation (SIREN/SIRET), e-mail de contact, directeur de la publication | Mentions légales, CGV, confidentialité, pied de page (© et Contact) |
| `CONDITIONS.mentionPrix` (« Prix TTC » ou « TVA non applicable, article 293 B du CGI ») | Page de vente, Tarifs, CGV |
| `CONDITIONS.acces` (à vie, 12 mois…) et `misesAJour` | Page de vente, FAQ, CGV |
| `CONDITIONS.facture` et `paiement` (moyens, paiement en plusieurs fois) | Page de vente, FAQ, CGV |
| `CONDITIONS.garantie` (facultatif) | Page de vente, FAQ, CGV |
| `CONDITIONS.mediateur` (nom et site du médiateur de la consommation) | CGV |
| `AUTEUR` : nom et présentation | Page de vente, FAQ |
| `AVIS` : avis réels avec leur mode de vérification | Page de vente |
| `FORMULAIRE_EMAIL.action` : adresse du formulaire du service d'e-mailing (Brevo, MailerLite…) | Page de vente, simulateurs |
| `lienAchat` de chaque offre (`site/src/lib/seo.ts`) | Tarifs, page de vente, vitrine |

Le build rappelle à chaque fois les champs obligatoires encore vides.
