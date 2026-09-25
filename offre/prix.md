# Prix et structure (impératifs B1, B2)

## Décision de la phase 0

| Offre | Prix | Contenu |
|---|---|---|
| Niveau 1 — Fondations | 97 € | 12 modules, quiz, 120 exercices, examen du niveau, checklist |
| Niveau 2 — Gestion, fiscalité et financement | 197 € | 14 modules, quiz, 140 exercices, examen du niveau |
| Niveau 3 — Expert | 297 € | 12 modules, quiz, 120 exercices, examen final et test de 50 questions |
| Formation complète (3 niveaux) | 447 € | tout, au lieu de 591 € achetés séparément |

Écart assumé avec la feuille de route (qui conseillait un prix unique entre 150 et 400 €) : le
niveau 1 à 97 € sert de produit d'appel, la formation complète est l'offre mise en avant.

« 447 € au lieu de 591 € » est un **vrai calcul** (97 + 197 + 297), pas un prix barré fictif.

## Modalités

- Paiement unique par carte.
- **Paiement en 3 fois** proposé pour la formation complète (3 × 149 €), si Stripe le permet sur le
  compte (fonction de paiement fractionné, ou Klarna / Alma via Stripe) : à vérifier à la création du
  compte.
- Mention TVA : à renseigner (`CONDITIONS.mentionPrix` dans `site/src/lib/entreprise.ts`).

## Deux comparaisons honnêtes (pour la page de vente)

1. **Une erreur évitée** : dans l'exemple du module 2.6, le régime réel plutôt que le micro-foncier
   représente environ 2 000 € d'impôt par an — plus de quatre fois le prix de la formation complète.
   (Présenté comme un exemple, jamais comme un gain garanti.)
2. **Un mois de loyer** : pour un logement loué 600 € par mois, la formation complète coûte moins
   d'un mois de loyer ; un logement devenu non décent ou un loyer révisé à tort coûtent davantage.

## En trois phrases, à l'oral

« Le niveau 1 coûte moins de 100 € et couvre tout pour louer un premier logement dans les règles.
La formation complète, 447 €, réunit les trois niveaux avec les exercices, les examens et les
24 outils. C'est moins qu'une seule erreur de régime fiscal ou qu'un mois de loyer perdu. »
