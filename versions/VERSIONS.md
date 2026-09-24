# Versions du site formation-locatif.com

Chaque nouveauté mise en ligne augmente le numéro de 1. Le fichier
`formation-location-version-NNN.zip` contient le site **déjà construit**, prêt à publier : les
pages, la recherche, `sitemap.xml`, `robots.txt` et un `vercel.json` (redirections 301, en-têtes
HTTPS). Aucune installation n'est nécessaire.

## Mettre une version en ligne sur Vercel

- **Recommandé : depuis GitHub.** Vercel → Add New → Project → importer le dépôt `formation-`,
  sans rien changer aux réglages. Le `vercel.json` de la racine construit le site. Chaque envoi sur
  GitHub redéploie ensuite automatiquement.
- **Avec le ZIP** : le tableau de bord de Vercel n'accepte pas de ZIP. Décompresser le fichier, puis,
  dans le dossier obtenu, lancer `npx vercel deploy --prod` (Node.js requis ; connexion au compte
  Vercel demandée la première fois).
- **Netlify** accepte directement le dossier décompressé par glisser-déposer (Deploy manually).

## Historique

| Version | Date | Nouveautés |
|---|---|---|
| 001 | 24 septembre 2026 | Site complet : 38 modules, quiz, examens, checklists, lettres, 14 simulateurs gratuits, tarifs, référencement (formation-locatif.com), corrections juridiques. Livrée sous forme de dossier (site + code source) |
| 002 | 24 septembre 2026 | Déploiement Vercel corrigé (erreur 404 : le site est construit depuis le sous-dossier `site/`) ; ZIP prêt à publier avec `vercel.json` |
| 003 | 24 septembre 2026 | Simulateurs enrichis pour Google : méthode de calcul (formule de l'annexe E), exemple chiffré du module et liens vers les autres simulateurs gratuits sur chaque page |
| 004 | 24 septembre 2026 | Site public recentré sur les outils gratuits : nouvel accueil par thèmes, 10 modèles de lettres avec une page chacun (`/lettres/…`), cours retiré du site public (édition complète disponible par `EDITION=complete`), exemples du cours retirés des simulateurs |
| 005 | 24 septembre 2026 | 10 nouveaux outils gratuits tirés des règles de la formation : DPE (logement encore louable ?), régularisation des charges, courte durée (Airbnb) ou meublé à l'année, Denormandie, Loc'Avantages, loyer à la relocation en zone tendue, encadrement des loyers, taux d'usure, TVA des travaux, loyer au m² et dépôt de garantie. 24 outils au total |
| 006 | 24 septembre 2026 | Avertissement plus discret (texte intégral conservé, petit et sans cadre) ; quiz : la bonne réponse n'est plus presque toujours « B », l'ordre d'affichage des propositions est réparti sur A, B, C et D (édition complète) |
| 007 | 24 septembre 2026 | Bandeau du haut réduit à la date de mise à jour (l'avertissement complet reste en bas de chaque page) |
| 008 | 24 septembre 2026 | La formation revient en page d'accueil (modules, quiz, examens, glossaire, recherche…) ; les outils gratuits restent publics, vitrine sur `/outils/`, pour attirer du trafic vers la formation. Édition « outils seuls » gardée pour plus tard (`EDITION=outils`) |
