# Garantie (impératif B3) — PROPOSITION À VALIDER

**Statut : proposition.** Rien n'est affiché sur le site tant que `CONDITIONS.garantie` est vide
(`site/src/lib/entreprise.ts`). À faire relire par un juriste avec les CGV (phase 2.3).

## Proposition : « Satisfait ou remboursé 14 jours »

- **Qui** : tout acheteur, particulier ou professionnel.
- **Comment** : un e-mail à l'adresse de contact, sans justification.
- **Délai** : 14 jours après l'achat.
- **Remboursement** : intégral, par le moyen de paiement utilisé, sous 14 jours ; l'accès est fermé.

## Pourquoi 14 jours et pas 30

L'acheteur qui veut un accès immédiat renonce à son droit légal de rétractation (article L. 221-28,
13°, du Code de la consommation). Une garantie commerciale de 14 jours lui rend exactement ce qu'il
abandonne, dans un délai qu'il connaît déjà. 30 jours rassure davantage mais permet de terminer le
niveau 1 (10 à 12 heures) avant de demander le remboursement.

## Texte prêt pour le site (après validation)

`CONDITIONS.garantie = 'Satisfait ou remboursé pendant 14 jours : un simple e-mail suffit'`
