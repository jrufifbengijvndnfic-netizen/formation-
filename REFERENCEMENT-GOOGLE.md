# Mettre formation-locatif.com en ligne sur Hostinger et le faire apparaître sur Google

Guide du 25 septembre 2026 (version 013 du site). À suivre dans l'ordre.

## Pourquoi on ne trouve rien aujourd'hui

1. **Le domaine pointe vers Hostinger, pas vers Vercel.** Relevé du 25 septembre 2026 :
   `formation-locatif.com` → 191.101.104.241 et 191.96.144.26 (serveurs Hostinger), `www` → CDN
   Hostinger (`cdn.hstgr.net`). Le site envoyé à Vercel n'est donc pas celui que l'on voit à cette
   adresse : il faut déposer le site dans l'hébergement Hostinger (étape 1).
2. **Google ne connaît pas encore le site.** Un domaine neuf n'apparaît dans Google qu'après avoir
   été découvert puis exploré. On accélère avec Google Search Console (étape 3).
3. Taper « formation-locatif.com » dans la **barre d'adresse** du navigateur ouvre le site
   directement ; le taper dans la **recherche Google** ne donne rien tant que Google ne l'a pas
   indexé. Pour vérifier l'indexation : chercher `site:formation-locatif.com` dans Google.

## Étape 1 — Déposer le site dans Hostinger (plan Premium)

1. hPanel → **Sites web** → formation-locatif.com → **Gestionnaire de fichiers**.
2. Ouvrez le dossier **`public_html`**. Supprimez les fichiers par défaut d'Hostinger
   (`default.php`, `index.php`, ancien site éventuel). Si vous aviez déjà envoyé un ZIP et qu'il a
   créé un sous-dossier (par exemple `formation-location-version-011`), supprimez-le aussi : le site
   était alors à `formation-locatif.com/formation-location-version-011/`, pas à la racine.
3. Envoyez `formation-location-version-022.zip` dans `public_html`, clic droit → **Extraire** →
   destination : `public_html` lui-même. Les fichiers `index.html`, `.htaccess`, `sitemap.xml`,
   `robots.txt` et les dossiers `module`, `simulateurs`… doivent se trouver **directement** dans
   `public_html` (le ZIP 022 est prévu pour : pas de dossier intermédiaire).
4. Supprimez le fichier ZIP de `public_html` après l'extraction.
5. hPanel → **Sécurité → SSL** : vérifiez que le certificat SSL gratuit est **actif** pour
   `formation-locatif.com` et `www.formation-locatif.com`.
6. Vérifiez dans le navigateur :
   - `https://formation-locatif.com/` affiche la formation ;
   - `http://formation-locatif.com/` et `https://www.formation-locatif.com/` **redirigent** vers
     `https://formation-locatif.com/` (règle du fichier `.htaccess`) ;
   - `https://formation-locatif.com/sitemap.xml` et `/robots.txt` s'affichent ;
   - une adresse inventée (`/test-404/`) affiche la page « Page introuvable » du site.

**Le fichier `.htaccess` est caché** : dans le gestionnaire de fichiers, activez l'affichage des
fichiers cachés pour le voir. Il ne faut pas le supprimer.

**Et Vercel ?** Depuis la version 017, le site ne contient plus rien de propre à Vercel (ni script
de mesure, ni `vercel.json`) : supprimez le projet Vercel s'il existe encore, pour qu'aucune copie du
site ne reste en ligne à une adresse `….vercel.app`.

**Si une page répond « 403 Forbidden »** : le `.htaccess` du site n'en produit qu'un seul cas,
quand un dossier n'a pas de `index.html` (`Options -Indexes`), par exemple si le ZIP a été extrait
dans un sous-dossier au lieu de `public_html`. Si `public_html/index.html` est bien là, le 403 vient
du filtrage d'Hostinger : hPanel → **Sécurité** (pare-feu, protection anti-robots, blocage d'adresses
IP ou de pays) et **CDN** (mode de protection) ; vérifier aussi qu'aucune protection par mot de passe
n'est active sur `public_html`. Googlebot (adresses 66.249.x.x) ne doit jamais être bloqué.

**Mises à jour suivantes** : à chaque nouvelle version, supprimez l'ancien contenu de
`public_html` (sauf `.well-known` s'il existe) et extrayez le nouveau ZIP.

## Étape 2 — Vérifier le domaine dans Google Search Console

1. Allez sur <https://search.google.com/search-console> avec votre compte Google.
2. **Ajouter une propriété** → choisissez **Domaine** → saisissez `formation-locatif.com`.
3. Google affiche un enregistrement **TXT** (`google-site-verification=…`). Copiez-le.
4. hPanel → **Domaines** → formation-locatif.com → **DNS / Serveurs de noms** → **Gérer les
   enregistrements DNS** → ajoutez : type **TXT**, nom **@**, valeur = le texte copié, TTL par défaut.
5. Revenez dans Search Console → **Vérifier** (si ça échoue, réessayez une heure plus tard).

Variante sans DNS : propriété « préfixe d'URL » → méthode « balise HTML » → envoyez-moi le code, je le
mets dans `VERIFICATIONS.google` (`site/src/lib/seo.ts`) et je régénère le site.

## Étape 3 — Faire explorer le site par Google

1. Search Console → **Sitemaps** → saisissez `sitemap.xml` → **Envoyer**. Le plan liste les
   105 pages publiques, avec leur date de mise à jour.
2. Search Console → **Inspection de l'URL** (barre en haut) → collez chaque adresse ci-dessous →
   **Demander une indexation** (environ dix demandes par jour, commencez par celles-ci) :
   1. `https://formation-locatif.com/`
   2. `https://formation-locatif.com/simulateurs/dpe-location/` (la page de notre douleur principale)
   3. `https://formation-locatif.com/formation-investissement-locatif/`
   4. `https://formation-locatif.com/outils/`
   5. `https://formation-locatif.com/simulateurs/`
   6. `https://formation-locatif.com/simulateurs/revision-loyer/`
   7. `https://formation-locatif.com/module/1-4/`
   8. `https://formation-locatif.com/simulateurs/rentabilite/`
   9. `https://formation-locatif.com/simulateurs/frais-acquisition/`
   10. `https://formation-locatif.com/simulateurs/plus-value/`
   Puis les jours suivants : `/lettres/`, les autres simulateurs, `/glossaire/`.
3. Revenez au bout d'une semaine : **Pages** (combien sont indexées, et pourquoi pas les autres) et
   **Performances** (requêtes sur lesquelles le site apparaît).

## Étape 4 — Bing (et donc aussi DuckDuckGo, Ecosia, Qwant en partie)

<https://www.bing.com/webmasters> → **Importer depuis Google Search Console** : le site et le plan du
site sont repris en deux clics.

## Étape 5 — Se faire connaître (les liens entrants)

Google classe mieux un site que d'autres sites citent. Sans tricher (pas d'achat de liens) :

- créez une page ou un profil au nom de « Formation Locatif » (LinkedIn, Facebook, Instagram…) avec
  le lien vers le site ;
- partagez un outil utile quand quelqu'un pose la question (groupes de propriétaires bailleurs,
  forums, réseaux), en respectant les règles de chaque espace : par exemple le simulateur « Mon
  logement est-il encore louable ? » pour une question sur le DPE ;
- demandez à votre entourage (blog, association, école) de citer un outil qui leur a servi ;
- publiez une courte actualité à chaque échéance (IRL du 15 octobre 2026, fin de l'encadrement le
  24 novembre 2026…) avec le lien vers le simulateur correspondant.

## À quoi s'attendre

- **Quelques jours à deux semaines** après l'envoi du plan : les premières pages apparaissent avec
  `site:formation-locatif.com` et la recherche du nom « Formation Locatif ».
- **Un à trois mois** : premières apparitions sur des recherches précises (« calcul révision loyer
  IRL 2026 », « logement classé F location 2028 »…).
- **Plusieurs mois** : les recherches très disputées (« simulateur rentabilité locative ») sont tenues
  par des sites anciens ; on y monte avec le temps, les liens entrants et les mises à jour régulières.
  Personne ne peut garantir la première place de Google.

## Ce qui est déjà fait dans le site

Contrôle complet avant envoi : `audit/AUDIT-SEO-avant-google.md`.


Titres et descriptions pensés pour les recherches, une page par outil et par lettre, plan du site
avec dates de mise à jour, `robots.txt`, adresses officielles (canoniques), données structurées
(formation, outils, fil d'Ariane, nom du site « Formation Locatif »), pages rapides (Lighthouse 99 à
100), adaptées au mobile, et redirections HTTPS / sans « www » pour Hostinger (`.htaccess`).
