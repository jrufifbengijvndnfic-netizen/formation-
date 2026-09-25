# Instagram : semaine 1, prêt à publier

Trois carrousels de 10 images (1080 × 1350, format portrait), la bio et les légendes.
Chaque chiffre vient de la formation, module indiqué sur les images. À jour au 25 septembre 2026.

| Dossier | Sujet du plan | Couleur | Images | Publier |
|---|---|---|---|---|
| 001 | DPE : les trois dates à retenir (sujet 1) | lie-de-vin, niveau 3 | `001-dpe-trois-dates/01.png` à `10.png` | lundi |
| 002 | Micro-foncier ou réel : l'écart chiffré (sujet 23) | bleu ardoise, niveau 2 | `002-micro-foncier-ou-reel/` | mercredi |
| 003 | Dossier locataire : ce qui est interdit (sujet 12) | vert, niveau 1 | `003-dossier-locataire-interdit/` | vendredi |

## Avant la première publication

1. **Vérifier que le site est en ligne** à `formation-locatif.com` : les images y renvoient (`/simulateurs/dpe-location/`, `/simulateurs/micro-foncier-ou-reel/`).
2. **Vérifier le nom** du compte sur Instagram, LinkedIn et en nom de domaine. Les images portent « Formation Locatif » ; si le nom change, il se modifie en une ligne dans `site/scripts/instagram.ts`.
3. **Photo de profil** : le logo du site (`site/public/favicon.svg`), sur fond blanc. Il reste lisible en tout petit.
4. **Passer en compte professionnel** (gratuit) pour avoir les statistiques : visites du profil, clics sur le lien.

## La bio

Instagram limite la bio à 150 caractères. Celle-ci en fait 142 :

```
Louer un logement en France, sans erreur coûteuse.
Pour les bailleurs particuliers.
Chaque publication sourcée, à jour.
↓ Simulateurs gratuits
```

**Le lien** : `https://formation-locatif.com/simulateurs/`, une seule destination. Quand la newsletter sera installée, remplacer par la page d'inscription.

**Stories à la une**, à créer au fil des semaines : Commencer ici · Simulateurs · Le programme · Avis · Qui suis-je.

## Les légendes

Instagram n'affiche que les deux premières lignes avant « plus » : elles doivent donner envie d'ouvrir. Cinq hashtags au maximum, en fin de légende.

### 001 : DPE

```
Trois dates. Si votre logement est mal classé, l'une d'elles vous concerne.

Depuis le 1er janvier 2025, un logement classé G n'est plus décent en métropole : plus de nouveau bail, de renouvellement ni de reconduction. F suit en 2028, E en 2034.

Et si le logement est classé F ou G, le loyer est déjà gelé : aucune révision, aucune hausse à la relocation.

Le simulateur gratuit vous dit si votre logement est encore louable, selon sa classe et la date du bail. Lien en bio.

Sources : loi Climat et résilience du 22 août 2021, loi du 6 juillet 1989 (art. 6 et 20-1), décret n° 2002-120. À jour au 25 septembre 2026.
Information générale, pas un conseil personnalisé.

#DPE #proprietairebailleur #immobilierlocatif #passoirethermique #locationimmobiliere
```

### 002 : micro-foncier ou réel

```
Même appartement, mêmes loyers. 3 172 € d'impôt d'un côté, 1 156 € de l'autre.

La différence tient à une case cochée sur la déclaration. Le micro-foncier retire 30 % des loyers, quoi que vous ayez dépensé. Le réel déduit les charges réellement payées : intérêts d'emprunt, taxe foncière, copropriété, travaux.

La règle : le réel devient intéressant dès que vos charges dépassent 30 % des loyers. Avec un crédit, c'est presque toujours le cas.

Faites le calcul avec vos propres chiffres : simulateur gratuit, lien en bio.

Sources : Code général des impôts, art. 28, 31 et 32 ; BOFiP-RFPI. Exemple pédagogique, tranche à 30 %.

#revenusfonciers #fiscaliteimmobiliere #proprietairebailleur #impots #immobilierlocatif
```

### 003 : dossier locataire

```
Vous demandez des relevés bancaires à vos candidats ? C'est interdit.

La liste des pièces qu'un bailleur peut exiger est fixée par décret. Tout le reste est exclu : documents bancaires, carte Vitale, contrat de mariage, casier judiciaire, chèque de réservation…

L'amende peut atteindre 3 000 € pour un particulier.

Ce que vous pouvez demander tient en quatre catégories, une pièce par catégorie : c'est à l'image 7. Enregistrez le carrousel pour votre prochaine mise en location.

Sources : loi du 6 juillet 1989, art. 22-2 ; décret n° 2015-1437 du 5 novembre 2015. À jour au 25 septembre 2026.

#dossierlocataire #proprietairebailleur #gestionlocative #locationimmobiliere #bailleur
```

## Texte alternatif

Instagram permet d'écrire un texte alternatif pour chaque image (Paramètres avancés, Accessibilité). Mettre au moins, sur la première image, le titre et le sous-titre. Le texte de chaque image est dans `site/scripts/instagram-carrousels.ts`.

## Faire les carrousels suivants

1. Ajouter un dossier dans `site/scripts/instagram-carrousels.ts`, en copiant un existant. Types d'images disponibles : couverture, texte (avec liste, note ou tampon « Attention »), date DPE, gros chiffre, calcul, comparaison en barres, catégories, sources, appel final.
2. Depuis le dossier `site/` : `npm run instagram` (tous) ou `npm run instagram -- 004` (un seul).
3. Les images arrivent dans `communication/instagram/`. Le script signale tout texte qui déborde.

Règle du plan : un sujet, un module source, un chiffre vérifié dans la formation, les textes cités à l'avant-dernière image.
