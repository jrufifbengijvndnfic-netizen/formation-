# Tests manuels sur vrais appareils et lecteurs d'écran

Les tests automatiques (`npm run test:site`, voir `ETAT-DES-LIEUX.md` § 5) couvrent Chromium,
l'émulation mobile, le clavier et axe. Ils ne remplacent pas un essai humain sur un vrai téléphone
et avec un vrai lecteur d'écran. Compter environ une heure au total. Pour chaque étape :
**✓ ou ✗**, et une note si quelque chose surprend.

Pages à utiliser : l'accueil, le module 2.1, le quiz d'un module, un simulateur (TRI),
l'annexe F (lettres), le glossaire, la recherche, la page Ma progression.

## 1. iPhone (Safari) et Android (Chrome)

1. Ouvrir l'accueil : la mention « Contenu à jour au 24 septembre 2026 » et l'avertissement sont
   lisibles sans zoomer ; rien ne dépasse à droite (pas de défilement horizontal).
2. Menu : ouvrir et fermer la navigation ; chaque lien se touche facilement du pouce.
3. Module 2.1 : toucher un terme souligné (infobulle du glossaire). La bulle reste dans l'écran ;
   un second toucher sur le terme ouvre le glossaire.
4. Quiz : répondre à trois questions, valider, recharger la page. Le statut du module est conservé.
5. Simulateur TRI : modifier deux champs avec le clavier numérique du téléphone (virgule décimale
   acceptée). Le résultat se met à jour et l'adresse de la page peut être partagée (bouton Partager
   du navigateur) : le destinataire retrouve les mêmes valeurs.
6. Annexe F : remplir un modèle de lettre, puis « Copier » et coller dans une note ou un courriel.
7. Recherche : « dépôt de garantie » donne des résultats en moins d'une seconde.
8. Tourner l'écran en paysage, puis revenir en portrait : la mise en page suit.
9. Réglages → Taille du texte au maximum (iOS : Accessibilité → Affichage et taille du texte) :
   le texte grossit et reste lisible.
10. Mode sombre du téléphone : le site passe en thème sombre ; le bouton de thème le force.
11. Safari en navigation privée : marquer un module comme lu. La page le signale sans erreur,
    même si le stockage est limité.

## 2. VoiceOver (iPhone : Réglages → Accessibilité → VoiceOver ; Mac : Cmd + F5)

1. Rotor → Titres : les titres du module s'enchaînent dans l'ordre (un seul titre principal).
2. Rotor → Repères : bannière, navigation (principale, fil d'Ariane, pied de page), principal.
3. Sur l'accueil, l'encadré d'avertissement est lu en entier, avec son titre.
4. Encadré « À surveiller » d'un module : l'étiquette est annoncée avant le texte.
5. Quiz : chaque proposition est annoncée comme bouton radio avec son texte ; après validation,
   le retour (« Bonne réponse » ou « Ce n'est pas la bonne réponse ») est lu sans déplacer le doigt.
6. Simulateur : chaque champ annonce son libellé et son unité ; une saisie invalide (« abc »)
   annonce le message d'erreur ; le résultat recalculé est annoncé.
7. Tableaux (module 2.1, annexe A) : la navigation cellule par cellule annonce les en-têtes.
8. Terme du glossaire : la définition est lue comme description du lien.

## 3. TalkBack (Android : Paramètres → Accessibilité → TalkBack)

Reprendre les points 1, 5 et 6 de la section 2 (titres, quiz, simulateur) avec les gestes de
TalkBack (balayer vers le bas puis la droite pour changer de granularité : titres, liens,
commandes).

## 4. NVDA (Windows, gratuit : nvaccess.org) avec Firefox et Chrome

1. Touche H / Maj + H : parcours des titres ; touche D : des repères ; touche T : des tableaux.
2. Touche Tab depuis le haut de page : le premier arrêt est « Aller au contenu », puis Entrée
   amène au titre du module.
3. Quiz en mode formulaire : flèches pour choisir la réponse, Tab jusqu'à « Valider », Entrée.
   Le retour est annoncé automatiquement.
4. Simulateur : modifier un champ, puis Tab. Le nouveau résultat est annoncé une seule fois,
   sans répétition envahissante.
5. Page Ma progression : les boutons Exporter, Importer et Réinitialiser annoncent leur rôle ;
   la confirmation de réinitialisation est lue.

## 5. Firefox et Safari de bureau

Sur un Mac (Safari) et dans Firefox (Windows, Mac ou Linux), lancer les tests automatiques s'ils
peuvent tourner sur la machine :

```bash
cd site
npx playwright install firefox webkit
npm run build
NAVIGATEUR=firefox npm run test:site
NAVIGATEUR=webkit npm run test:site     # moteur de Safari
```

À défaut, parcourir à la main les points 1 à 7 de la section 1 dans chaque navigateur, et imprimer
un module (Fichier → Imprimer → aperçu) : la date de mise à jour et l'avertissement sont imprimés,
sans menu ni boutons, et l'adresse des liens externes figure entre parenthèses.

## Signaler un problème

Noter : l'appareil, le système et le navigateur avec leurs versions, la page, ce qui était attendu
et ce qui s'est passé, avec une capture d'écran si possible.
