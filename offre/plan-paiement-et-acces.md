# Plan technique : paiement Stripe et espace membre (tâches 2.1, 2.2, 2.5)

**Statut : plan à valider avant développement** (la feuille de route demande de montrer le plan
avant de coder). Décision de la phase 0 : site actuel + Stripe + comptes membres.

## Architecture proposée

| Brique | Choix proposé | Pourquoi |
|---|---|---|
| Site | Astro actuel, **mode hybride** : pages publiques statiques (comme aujourd'hui), pages du cours rendues par le serveur à la demande | Garde les quiz, exercices, simulateurs, progression ; le contenu payant n'est jamais publié en fichier statique |
| Hébergement | Vercel (adaptateur `@astrojs/vercel`, fonctions serveur) | Déjà en place ; offre gratuite suffisante au départ |
| Paiement | **Stripe Checkout** (page de paiement hébergée par Stripe) | Carte, Apple Pay, Google Pay ; facture automatique ; paiement en 3 fois possible via Klarna en France |
| Comptes | **Connexion par lien magique** envoyé par e-mail (pas de mot de passe) | Simple pour l'élève, rien à retenir, rien à fuiter |
| Base de données | Supabase (région Europe) : comptes, achats, progression | Offre gratuite, authentification intégrée, données dans l'UE (RGPD) |
| E-mails | Envoi transactionnel (Resend ou Brevo) sur votre domaine | Lien de connexion, confirmation d'achat |
| PDF | Stockage privé Supabase, lien signé valable quelques minutes | Jamais dans un dossier public |

## Parcours d'achat

1. Page de vente → bouton « Acheter » d'une offre.
2. **Page de commande sur le site** (avant Stripe) : adresse e-mail, récapitulatif, prix TTC, et
   **deux cases distinctes, non cochées** (article L. 221-28, 13°, du Code de la consommation) :
   - « Je demande l'accès immédiat à la formation, avant la fin du délai de rétractation de 14 jours. »
   - « Je reconnais perdre ainsi mon droit de rétractation. »
   Le bouton « Payer » reste inactif tant que les deux ne sont pas cochées ; l'accord est horodaté et
   transmis à Stripe (métadonnées de la session).
3. Stripe Checkout (paiement, facture automatique).
4. **Webhook Stripe** (fonction serveur) : vérifie la signature, enregistre l'achat (niveaux
   débloqués) et envoie l'e-mail de confirmation, qui **rappelle les deux accords** (confirmation
   écrite exigée par l'article L. 221-13).
5. Page de remerciement → « Commencer ici » (parcours de la première heure).

## Protection du contenu

- Un **middleware** vérifie, pour chaque page du cours, la session et les niveaux achetés ; sinon,
  redirection vers la page de connexion ou de vente.
- Extraits gratuits (module 1.1, checklist) et outils restent statiques et publics.
- La recherche Pagefind actuelle indexe le cours dans un fichier public : elle sera limitée aux
  pages publiques, et une recherche du cours sera servie aux membres uniquement.
- Le plan du site (`sitemap.xml`) ne contiendra plus que les pages publiques.
- La progression (aujourd'hui dans le navigateur) sera synchronisée avec le compte ; l'export et
  l'import restent possibles.

## Tests prévus (« fini quand »)

- En navigation privée, sans compte : `/module/2-6/`, `/examen/final/`, le PDF et l'index de recherche
  du cours ne renvoient aucun contenu payant (test automatique ajouté à `test-site`).
- Achat test en mode test Stripe, puis achat réel avec une vraie carte et remboursement.
- Cases non cochées : paiement impossible ; e-mail de confirmation contenant les deux accords.
- Acheteur du niveau 1 : accès au niveau 1 seulement.

## Ce qu'il me faut de votre part

1. Un **compte Stripe** activé (identité, statut, IBAN) et ses clés (test puis production), à mettre
   dans les variables d'environnement de Vercel — jamais dans le code.
2. Un **projet Supabase** (ou votre accord pour que je vous guide pour le créer).
3. Un **domaine d'envoi d'e-mails** (formation-locatif.com) et un service d'envoi.
4. Les informations du vendeur dans `site/src/lib/entreprise.ts` (déjà listées au build).
5. Votre validation de la garantie (`offre/garantie.md`) et la relecture des CGV par un juriste.

## Estimation

3 à 5 jours de développement de mon côté une fois les comptes créés, puis une journée de tests
avec vous. Coûts : commissions Stripe (1,5 % + 0,25 € par carte européenne), Supabase et Vercel
gratuits au départ, envoi d'e-mails gratuit jusqu'à quelques milliers par mois.
