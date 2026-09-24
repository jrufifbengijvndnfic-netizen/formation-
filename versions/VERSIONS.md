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
