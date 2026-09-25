# Exercices d'entraînement et examens notés — complément à la formation « L'immobilier locatif en France » (édition septembre 2026)

Ce fichier complète le Markdown de la formation, sans le modifier. Il a été ajouté à la demande de
l'auteur : dix exercices à la fin de chaque module et des questions notées pour les cas des examens.
Chaque exercice reprend uniquement des règles, des chiffres et des dates écrits dans le module
concerné (ou dans le cas d'examen) ; les calculs sont détaillés dans l'explication.

Format d'un exercice (une ligne par champ, une ligne vide entre deux exercices) :

- `T:` type : `qcm` (une seule bonne réponse, A à D), `multi` (plusieurs bonnes réponses, A à E),
  `nombre` (valeur à saisir), `vf` (vrai ou faux) ;
- `Q:` énoncé ; `A:` à `E:` propositions (qcm, multi) ;
- `R:` réponse : une lettre (qcm), des lettres séparées par des virgules (multi), un nombre écrit à
  la française (nombre), `V` ou `F` (vf) ;
- `U:` unité affichée (nombre) ; `P:` écart toléré, dans l'unité (nombre ; 0 par défaut) ;
- `E:` explication affichée après la correction ;
- `L: suite` : l'exercice prolonge le précédent (mêmes données) ; il reste à sa suite quand les
  questions sont mélangées et n'entre pas dans le tirage du test final.

Les sections « Examen » rattachent des questions à un cas (`C:` numéro du cas).

---

## Module 1.1

```exercices
T: vf
Q: La loi du 6 juillet 1989 est d'ordre public : une clause du bail moins favorable au locataire que la loi est réputée non écrite.
R: V
E: Vrai. On ne peut pas déroger à la loi de 1989 au détriment du locataire ; toute clause contraire est réputée non écrite (points clés du module).

T: qcm
Q: Un locataire occupe le logement sept mois par an, sans obligation professionnelle, raison de santé ni force majeure. Au sens de la loi de 1989, ce logement…
A: est sa résidence principale, puisqu'il y vit plus de six mois
B: n'est pas sa résidence principale : il faut au moins huit mois d'occupation par an
C: devient automatiquement un meublé de tourisme
D: doit être loué en bail mobilité
R: B
E: La résidence principale suppose une occupation d'au moins huit mois par an (article 2 de la loi de 1989), sauf obligation professionnelle, raison de santé ou force majeure.

T: multi
Q: Parmi ces éléments, lesquels sont des risques de l'investissement locatif cités dans le module ?
A: La vacance du logement
B: L'impayé
C: La faible liquidité du bien
D: Un rendement minimal garanti par l'État
E: Le durcissement réglementaire
R: A, B, C, E
E: Vacance, impayé, travaux imprévus, durcissement réglementaire, faible liquidité, fiscalité et concentration du patrimoine sont les risques cités. Aucun rendement n'est garanti par l'État.

T: qcm
Q: Qu'appelle-t-on l'effet de levier en immobilier locatif ?
A: Revendre rapidement avec une plus-value
B: Financer l'achat à crédit : la banque avance l'essentiel du prix et le loyer rembourse une partie des échéances
C: Augmenter le loyer chaque année au-delà de l'IRL
D: Déduire les intérêts d'emprunt de son salaire
R: B
E: L'effet de levier consiste à se constituer un patrimoine avec un effort d'épargne limité, grâce au crédit remboursé en partie par les loyers.

T: qcm
Q: Quelle instance règle à l'amiable et gratuitement de nombreux litiges locatifs ?
A: La commission départementale de conciliation (CDC)
B: Le service des impôts des particuliers
C: La Banque de France
D: Le syndic de copropriété
R: A
E: La commission départementale de conciliation règle gratuitement et à l'amiable de nombreux litiges entre bailleurs et locataires.

T: qcm
Q: Quel juge est compétent pour les litiges de bail d'habitation ?
A: Le tribunal de commerce
B: Le juge des contentieux de la protection du tribunal judiciaire
C: Le conseil de prud'hommes
D: Le tribunal administratif
R: B
E: Le juge des contentieux de la protection (JCP), au tribunal judiciaire, est compétent pour les litiges de bail d'habitation.

T: qcm
Q: Qui gère la garantie Visale ?
A: La CAF
B: L'ANAH
C: Action Logement
D: L'ADIL
R: C
E: Action Logement gère la garantie Visale ; la CAF verse les aides au logement, l'ANAH gère le conventionnement et MaPrimeRénov', l'ADIL conseille gratuitement.

T: qcm
Q: Quel professionnel, ancien huissier, signifie un commandement de payer et exécute une décision d'expulsion ?
A: Le notaire
B: Le commissaire de justice
C: L'avocat
D: Le syndic
R: B
E: Le commissaire de justice (ancien huissier) signifie les actes, dresse des constats et exécute les décisions.

T: vf
Q: Signer un « bail civil » avec un locataire qui vit en réalité dans le logement à titre principal permet d'échapper à la loi de 1989.
R: F
E: Faux. Le juge requalifie le bail civil en bail de la loi de 1989 si le locataire y vit à titre principal (piège cité dans le module).

T: qcm
Q: Quel texte régit la copropriété ?
A: La loi Hoguet du 2 janvier 1970
B: La loi du 10 juillet 1965 et le décret du 17 mars 1967
C: Le Code du tourisme
D: La loi ALUR du 24 mars 2014 uniquement
R: B
E: La copropriété relève de la loi du 10 juillet 1965 et de son décret du 17 mars 1967 ; la loi Hoguet encadre les agents immobiliers.
```

## Module 1.2

```exercices
T: nombre
Q: Un logement meublé est loué 700 € hors charges par mois. Quel est le dépôt de garantie maximal ?
R: 1400
U: €
E: En location meublée, le dépôt de garantie est plafonné à deux mois de loyer hors charges : 2 × 700 = 1 400 €.

T: nombre
L: suite
Q: Le même logement est loué vide, 700 € hors charges par mois. Quel est le dépôt de garantie maximal ?
R: 700
U: €
E: En location vide, le plafond est d'un mois de loyer hors charges : 700 €.

T: qcm
Q: Quel dépôt de garantie peut-on demander dans un bail mobilité ?
A: Un mois de loyer hors charges
B: Deux mois de loyer hors charges
C: Aucun
D: Un montant libre
R: C
E: Aucun dépôt de garantie n'est autorisé en bail mobilité.

T: multi
Q: Lesquelles de ces surfaces sont exclues de la surface habitable ?
A: Un balcon
B: Une cave
C: Une partie de pièce mesurant 1,70 m de hauteur
D: Une chambre de 10 m² sous 2,50 m de plafond
E: Une véranda
R: A, B, C, E
E: La surface habitable exclut les parties de moins de 1,80 m de hauteur, les caves, balcons, vérandas, terrasses, garages, combles non aménagés… La chambre de 10 m² y est comptée.

T: qcm
Q: Dans quel cas peut-on choisir un forfait de charges, non régularisable ?
A: En location vide
B: En location meublée
C: Dans tous les baux de la loi de 1989
D: Jamais
R: B
E: Le forfait de charges est possible en location meublée, en colocation et en bail mobilité ; en location vide, les charges sont appelées par provisions puis régularisées.

T: qcm
Q: Un foyer a un revenu imposable de 40 000 € par part (barème 2026). Quelle est sa tranche marginale d'imposition ?
A: 11 %
B: 30 %
C: 41 %
D: 45 %
R: B
E: La tranche à 30 % s'applique de 29 579 € à 84 577 € par part ; 40 000 € s'y trouve.

T: vf
Q: La liste des charges récupérables auprès du locataire est indicative : le bail peut en ajouter.
R: F
E: Faux. La liste est limitative (décret n° 87-713 du 26 août 1987) ; facturer une charge qui n'y figure pas est un piège cité dans le module.

T: qcm
Q: Que risque un logement loué « meublé » auquel il manque des équipements obligatoires ?
A: Rien, si le bail dit « meublé »
B: Une requalification en location vide, avec ses règles plus protectrices
C: Une amende fiscale automatique
D: La nullité du bail
R: B
E: À défaut de la liste minimale d'équipements (décret du 31 juillet 2015), la location est requalifiée en location vide.

T: multi
Q: Quelles conséquences entraîne le classement d'une commune en zone tendue ?
A: Le blocage des loyers à la relocation
B: Un préavis réduit à un mois pour le locataire en location vide
C: La taxe sur les logements vacants
D: Un dépôt de garantie de deux mois en location vide
E: L'interdiction de la location meublée
R: A, B, C
E: Zone tendue : blocage des loyers à la relocation, préavis d'un mois en location vide, taxe sur les logements vacants. Le dépôt reste d'un mois en location vide et le meublé reste possible.

T: vf
Q: Le dépôt de garantie produit des intérêts au profit du locataire.
R: F
E: Faux. Le dépôt de garantie n'est pas révisable et ne produit pas d'intérêts.
```

## Module 1.3

```exercices
T: qcm
Q: Une SARL (personne morale, non familiale) loue un logement vide. Quelle est la durée minimale du bail ?
A: 1 an
B: 3 ans
C: 6 ans
D: 9 ans
R: C
E: La durée minimale est de 3 ans pour un bailleur personne physique ou une SCI familiale, 6 ans pour une personne morale.

T: qcm
Q: Quelle est la durée du bail étudiant ?
A: 9 mois, sans reconduction
B: 1 an, reconductible
C: 1 à 10 mois, non renouvelable
D: 3 ans
R: A
E: Le bail étudiant est un meublé de neuf mois, sans reconduction tacite, réservé aux étudiants.

T: qcm
Q: Quelle est la durée d'un bail mobilité ?
A: 9 mois exactement
B: 1 à 10 mois, non renouvelable
C: 1 an minimum
D: Libre
R: B
E: Le bail mobilité dure de 1 à 10 mois et n'est pas renouvelable.

T: multi
Q: Parmi ces locataires, lesquels entrent dans les motifs légaux du bail mobilité ?
A: Une personne en formation professionnelle
B: Un étudiant de l'enseignement supérieur
C: Un salarié en mutation
D: Un retraité qui veut tester une nouvelle ville
E: Un jeune en service civique
R: A, B, C, E
E: Motifs : formation, études supérieures, stage, apprentissage, service civique, mutation ou mission temporaire. Le retraité n'entre dans aucun motif.

T: qcm
Q: Un bail mobilité est signé avec une personne qui n'entre dans aucun motif légal. Que risque le bailleur ?
A: Rien
B: Une requalification en bail meublé d'un an
C: Une requalification en meublé de tourisme
D: Une amende de 15 000 €
R: B
E: C'est le premier piège du module : le bail est requalifié en location meublée d'un an.

T: qcm
Q: Quel est le préavis du locataire en location meublée ?
A: 1 mois
B: 2 mois
C: 3 mois
D: 6 mois
R: A
E: En meublé, le préavis du locataire est d'un mois ; en location vide, il est de trois mois (un mois en zone tendue et dans certains cas).

T: qcm
Q: Un bailleur veut vendre son logement loué vide. Quand doit-il donner congé ?
A: 1 mois avant l'échéance
B: 3 mois avant l'échéance
C: 6 mois avant l'échéance
D: À tout moment
R: C
E: En location vide, le congé du bailleur se donne six mois avant l'échéance (trois mois en meublé), pour vendre, reprendre ou motif légitime et sérieux.

T: qcm
Q: Dans quelle catégorie sont imposés les revenus d'une location meublée ?
A: Revenus fonciers
B: Bénéfices industriels et commerciaux (BIC)
C: Traitements et salaires
D: Revenus de capitaux mobiliers
R: B
E: La location meublée relève des BIC ; la location vide, des revenus fonciers.

T: vf
Q: La colocation est un régime de bail distinct, qui échappe à la loi de 1989.
R: F
E: Faux. La colocation est une location vide ou meublée à plusieurs locataires, avec un bail unique ou des baux individuels (article 8-1 de la loi de 1989).

T: qcm
Q: Quelle est la durée maximale de séjour d'un même client dans un meublé de tourisme ?
A: 30 jours
B: 90 jours
C: 120 jours
D: 9 mois
R: B
E: Le meublé de tourisme accueille une clientèle de passage, pour un séjour de 90 jours maximum par client.
```

## Module 1.4

```exercices
T: vf
Q: La seule pièce principale d'un logement mesure 8 m² sous un plafond de 2,50 m. Elle respecte le critère de surface et de volume de la décence.
R: V
E: Vrai. Le critère est une pièce de 9 m² avec 2,20 m de hauteur, OU un volume habitable d'au moins 20 m³. Ici, 8 × 2,50 = 20 m³.

T: qcm
Q: La seule pièce principale mesure 8,50 m² sous 2,30 m de plafond. Le critère de surface et de volume est-il respecté ?
A: Oui, car la hauteur dépasse 2,20 m
B: Oui, car le volume dépasse 20 m³
C: Non : moins de 9 m² et un volume de 19,55 m³ seulement
D: Oui, car la surface dépasse 8 m²
R: C
E: 8,50 m² < 9 m², et 8,50 × 2,30 = 19,55 m³ < 20 m³ : aucun des deux seuils n'est atteint.

T: qcm
Q: En métropole, un logement classé F peut-il faire l'objet d'un nouveau bail signé en mars 2028 ?
A: Oui, seuls les logements G sont non décents
B: Non : depuis le 1er janvier 2028, seules les classes A à E sont décentes
C: Oui, si le loyer est baissé
D: Oui, jusqu'en 2034
R: B
E: Calendrier : G non décent depuis 2025, F à partir du 1er janvier 2028, E à partir du 1er janvier 2034.

T: qcm
Q: À partir du 1er janvier 2034, quelle classe DPE minimale faut-il en métropole pour qu'un logement soit décent ?
A: C
B: D
C: E
D: F
R: B
E: À partir du 1er janvier 2034, le logement doit être classé entre A et D.

T: qcm
Q: Outre-mer, à partir de quand un logement classé G est-il non décent ?
A: 2025
B: 2028
C: 2031
D: 2034
R: B
E: Outre-mer, le calendrier est décalé : G non décent en 2028, F en 2031.

T: vf
Q: Un bail en cours est automatiquement annulé le jour où le logement devient non décent.
R: F
E: Faux. Le bail en cours n'est pas anéanti, mais le locataire peut exiger la mise en conformité, demander au juge une réduction ou une suspension du loyer et des dommages et intérêts.

T: nombre
Q: Le locataire d'un logement non décent perçoit une aide au logement. Pendant combien de mois au plus la CAF ou la MSA peut-elle conserver l'aide en attendant les travaux ?
R: 18
U: mois
E: Dispositif de conservation de l'aide issu de la loi ALUR : dix-huit mois au plus, le locataire ne payant que le loyer résiduel.

T: qcm
Q: Dans un secteur soumis à autorisation préalable de mise en location, un bailleur loue malgré un refus. Quelle amende encourt-il au plus ?
A: 1 000 €
B: 5 000 €
C: 15 000 €
D: 50 000 €
R: C
E: Jusqu'à 5 000 € sans autorisation, portée à 15 000 € en cas de récidive ou de location malgré un refus.

T: qcm
Q: Dans une location meublée, qui entretient le détecteur de fumée (DAAF) ?
A: Le locataire
B: Le bailleur
C: Le syndic
D: Personne, il n'est pas obligatoire en meublé
R: B
E: Le DAAF est fourni et installé par le bailleur et entretenu par le locataire, sauf en location saisonnière, meublée, en foyer et en logement de fonction, où le bailleur s'en charge.

T: qcm
Q: Un arrêté de mise en sécurité ou de traitement de l'insalubrité frappe le logement. Pendant l'arrêté, le loyer…
A: reste dû en totalité
B: est réduit de moitié
C: cesse d'être dû
D: est versé à la mairie
R: C
E: Pendant l'arrêté, le loyer cesse d'être dû ; le propriétaire doit faire les travaux et, selon les cas, héberger ou reloger les occupants.
```

## Module 1.5

```exercices
T: qcm
Q: Un DPE a été réalisé en mars 2019. Peut-il être annexé à un bail signé en septembre 2026 ?
A: Oui, un DPE est valable 10 ans
B: Non : les DPE réalisés du 1er janvier 2018 au 30 juin 2021 ne sont plus valables depuis le 1er janvier 2025
C: Oui, s'il est accompagné d'une attestation 2026
D: Non, un DPE n'est valable que 6 ans
R: B
E: Les DPE réalisés entre le 1er janvier 2018 et le 30 juin 2021 ne sont plus valables depuis le 1er janvier 2025 : il faut en commander un nouveau.

T: qcm
Q: Un DPE a été réalisé en septembre 2021. Jusqu'à quand est-il valable ?
A: Septembre 2027
B: Septembre 2031
C: Décembre 2024
D: Sans limite
R: B
E: Un DPE est valable 10 ans ; celui de septembre 2021, postérieur au 30 juin 2021, reste valable jusqu'en septembre 2031.

T: qcm
Q: L'état des risques a été établi le 1er février 2026. Le bail est signé le 15 septembre 2026. Que faire ?
A: Rien, l'état des risques est valable 10 ans
B: En faire établir un nouveau : il doit dater de moins de 6 mois à la signature
C: L'annexer tel quel, il est valable 1 an
D: Le supprimer, il n'est plus obligatoire
R: B
E: L'état des risques doit dater de moins de six mois à la date de signature ; sept mois et demi se sont écoulés.

T: multi
Q: Maison construite en 1935, installation électrique de 30 ans, installation de gaz de 10 ans, hors zone d'aérodrome. Quels diagnostics faut-il annexer au bail ?
A: DPE
B: État des risques
C: Constat de risque d'exposition au plomb
D: État de l'installation d'électricité
E: État de l'installation de gaz
R: A, B, C, D
E: DPE et état des risques toujours ; plomb car construit avant 1949 ; électricité car installation de plus de 15 ans. Le gaz (10 ans) n'est pas exigé.

T: qcm
Q: Un logement consomme 200 kWh d'énergie primaire par m² et par an et émet 55 kg de CO2 par m² et par an. Quelle est sa classe DPE ?
A: C
B: D
C: E
D: F
R: C
E: 200 kWh donne D (jusqu'à 250), 55 kg donne E (jusqu'à 70). Avec le double seuil, la plus mauvaise étiquette l'emporte : E.

T: qcm
Q: Un logement consomme 340 kWh d'énergie primaire par m² et par an et émet 20 kg de CO2 par m² et par an. Quelle est sa classe ?
A: C
B: E
C: F
D: G
R: C
E: 340 kWh donne F (de 331 à 420), 20 kg donne C : la plus mauvaise des deux, F, l'emporte.

T: nombre
Q: Le bail indique 50 m² et un loyer de 800 €. La surface habitable réelle est de 46 m². À combien le locataire peut-il obtenir que le loyer soit ramené ?
R: 736
U: €
E: L'écart est de 4 m², soit 8 %, plus de 5 % : baisse proportionnelle du loyer (article 3-1). 800 × 46 / 50 = 736 €.

T: vf
Q: Le bail indique 50 m² ; la surface réelle est de 48 m². Le locataire peut obtenir une baisse du loyer.
R: F
E: Faux. L'écart est de 2 m², soit 4 %, sous le seuil de 5 % prévu par l'article 3-1.

T: qcm
Q: Quel coefficient convertit l'électricité en énergie primaire pour les DPE établis à partir du 1er janvier 2027 ?
A: 2,3
B: 1,9
C: 1,7
D: 1
R: C
E: Le coefficient est passé de 2,3 à 1,9 le 1er janvier 2026 ; l'arrêté du 19 août 2026 l'abaisse à 1,7 pour les DPE établis à partir du 1er janvier 2027.

T: vf
Q: L'audit énergétique réglementaire doit être annexé au bail d'une maison classée F.
R: F
E: Faux. L'audit énergétique réglementaire est un diagnostic de vente ; il n'est pas exigé pour louer.
```

## Module 1.6

```exercices
T: nombre
Q: Hors zone tendue, des T3 comparables se louent 11,50 € hors charges par m². Quel loyer mensuel hors charges retenir pour un T3 de 60 m² à ce prix ?
R: 690
U: €
E: On raisonne en euros par m² hors charges : 60 × 11,50 = 690 € HC.

T: nombre
L: suite
Q: Ce T3 de 60 m² est loué vide 690 € HC avec 60 € de provisions sur charges. Quel est le dépôt de garantie maximal ?
R: 690
U: €
E: En location vide, le dépôt est plafonné à un mois de loyer hors charges : 690 €. Les charges n'entrent pas dans le calcul.

T: qcm
Q: En zone tendue, entre deux locataires, le loyer hors charges ne peut pas dépasser…
A: le loyer de marché constaté par l'observatoire local
B: le dernier loyer appliqué au précédent locataire, éventuellement révisé selon l'IRL
C: 10 % de plus que le dernier loyer
D: le loyer de référence majoré de la commune
R: B
E: Article 18 et décret n° 2017-1198 : le loyer est bloqué au dernier loyer appliqué, éventuellement révisé selon l'IRL, sauf exceptions.

T: multi
Q: Quelles situations permettent, en zone tendue, de dépasser le dernier loyer du précédent locataire ?
A: Des travaux importants
B: Un loyer manifestement sous-évalué
C: Un logement vacant depuis plus de 18 mois
D: Un simple changement de locataire
E: Un logement classé F
R: A, B, C
E: Les exceptions sont les travaux importants, le loyer manifestement sous-évalué et la vacance de plus de 18 mois. Un logement F ou G ne peut au contraire subir aucune hausse.

T: nombre
Q: Dans une commune soumise à l'encadrement, le loyer de référence majoré est de 22 € par m². Quel loyer de base maximal pour 35 m² (sans complément de loyer) ?
R: 770
U: €
E: Le loyer de base ne peut dépasser le loyer de référence majoré multiplié par la surface : 22 × 35 = 770 €.

T: qcm
Q: Un logement classé F, hors zone tendue, se libère. Le bailleur peut-il augmenter le loyer pour le nouveau locataire ?
A: Oui, le loyer est libre hors zone tendue
B: Non : un logement F ou G ne peut subir aucune hausse à la relocation
C: Oui, dans la limite de l'IRL
D: Oui, s'il fournit un nouveau DPE
R: B
E: En métropole, un logement classé F ou G ne peut subir aucune hausse à la relocation, à la révision annuelle ni au renouvellement.

T: vf
Q: Hors zone tendue, pour un logement classé D, le loyer est fixé librement à la première location et à la relocation.
R: V
E: Vrai (article 17). Seuls la zone tendue, l'encadrement et le gel des logements F et G limitent le loyer.

T: qcm
Q: Le bailleur a fixé des provisions sur charges nettement supérieures aux dépenses réelles. Que se passe-t-il ?
A: Il garde l'excédent
B: L'excédent devra être remboursé au locataire
C: Il peut l'imputer sur le loyer de l'année suivante sans accord
D: Rien, les provisions sont forfaitaires
R: B
E: Les provisions sont estimées sans surévaluation : une provision excessive devra être remboursée à la régularisation.

T: qcm
Q: Dans une commune soumise à l'encadrement, un bailleur ajoute un complément de loyer pour un logement sans caractéristique exceptionnelle. C'est…
A: autorisé si le locataire signe
B: un piège : le complément de loyer suppose des caractéristiques exceptionnelles
C: obligatoire au-delà de 30 m²
D: autorisé à la première location seulement
R: B
E: Appliquer un complément de loyer sans caractéristique exceptionnelle est l'un des pièges cités par le module.

T: qcm
Q: Jusqu'à quelle date le décret qui bloque les loyers à la relocation en zone tendue est-il reconduit ?
A: 31 décembre 2026
B: 31 juillet 2027
C: 24 novembre 2026
D: 1er janvier 2028
R: B
E: Le décret n° 2017-1198 est reconduit jusqu'au 31 juillet 2027. Le 24 novembre 2026 est la fin de l'expérimentation de l'encadrement, sauf prolongation.
```

## Module 1.7

```exercices
T: multi
Q: Parmi ces pièces, lesquelles est-il interdit de demander à un candidat locataire ?
A: Des relevés bancaires
B: Une carte Vitale
C: Un chèque de réservation
D: Le dernier avis d'imposition
E: Les trois derniers bulletins de salaire
R: A, B, C
E: Relevés bancaires, carte Vitale et chèque de réservation figurent dans la liste des pièces interdites (article 22-2). L'avis d'imposition et les bulletins de salaire sont admis.

T: nombre
Q: Le loyer charges comprises est de 800 €. Avec la pratique d'un taux d'effort d'environ un tiers, quel revenu mensuel minimal attend-on, soit environ trois fois le loyer ?
R: 2400
U: €
E: En pratique, le loyer ne dépasse pas 33 à 35 % des revenus, soit des revenus d'environ trois fois le loyer : 3 × 800 = 2 400 €.

T: qcm
Q: Un bailleur personne physique demande des pièces interdites. Quelle amende administrative encourt-il au plus ?
A: 450 €
B: 3 000 €
C: 15 000 €
D: 45 000 €
R: B
E: Jusqu'à 3 000 € pour une personne physique, 15 000 € pour une personne morale.

T: qcm
Q: Refuser un candidat en raison de sa situation de famille est un délit puni de…
A: une simple amende de 750 €
B: trois ans d'emprisonnement et 45 000 € d'amende
C: la nullité du bail seulement
D: rien, le bailleur choisit librement
R: B
E: La discrimination au logement est punie de trois ans d'emprisonnement et 45 000 € d'amende (Code pénal, articles 225-1 et 225-2).

T: vf
Q: Le bailleur peut refuser une caution au motif qu'elle réside à l'étranger.
R: F
E: Faux. L'article 22-1 interdit de refuser une caution parce qu'elle n'est pas de nationalité française ou ne réside pas en métropole.

T: qcm
Q: Un bailleur a souscrit une assurance loyers impayés. Son futur locataire est apprenti. Peut-il aussi exiger une caution ?
A: Non, jamais
B: Oui : le cumul est permis pour un étudiant ou un apprenti
C: Oui, pour tout locataire
D: Seulement si l'assureur le refuse
R: B
E: Le cumul d'une garantie des loyers impayés et d'une caution est interdit à peine de nullité du cautionnement, sauf pour un étudiant ou un apprenti.

T: qcm
Q: Depuis la réforme de 2026, quelle période couvre la garantie Visale ?
A: Toute la durée du bail
B: Les trois premières années d'occupation
C: Un an
D: Neuf mois
R: B
E: Réforme 2026 : couverture limitée aux trois premières années d'occupation ; le bailleur signe le contrat en ligne avant ou le jour du bail.

T: nombre
Q: Une agence loue un logement de 45 m² en zone tendue (non très tendue). Quel montant maximal d'honoraires peut-elle facturer au locataire, état des lieux d'entrée compris ?
R: 585
U: €
E: Visite, dossier et bail : 10 € × 45 = 450 € ; état des lieux : 3 € × 45 = 135 € ; total 585 €.

T: nombre
L: suite
Q: Même question pour 30 m² dans une commune hors zone tendue.
R: 330
U: €
E: 8 € × 30 = 240 € pour la visite, le dossier et le bail, plus 3 € × 30 = 90 € pour l'état des lieux : 330 €.

T: qcm
Q: Quelle mention est obligatoire dans l'annonce d'un logement classé F ou G ?
A: « Logement à rénover »
B: « Logement à consommation énergétique excessive »
C: « Location interdite »
D: Aucune mention particulière
R: B
E: Pour un logement F ou G, l'annonce doit porter la mention « logement à consommation énergétique excessive », en plus des classes énergie et climat.
```

## Module 1.8

```exercices
T: qcm
Q: À partir de quand les nouveaux contrats types (décret n° 2026-596) s'appliquent-ils ?
A: Au 1er janvier 2026
B: Aux baux conclus ou renouvelés à partir du 1er octobre 2026
C: À tous les baux en cours dès juillet 2026
D: Au 1er janvier 2027
R: B
E: Le décret du 6 juillet 2026 met à jour les contrats types pour les baux conclus ou renouvelés à partir du 1er octobre 2026.

T: vf
Q: Les baux en cours doivent être refaits sur le nouveau contrat type au 1er octobre 2026.
R: F
E: Faux. Les baux en cours n'ont pas à être refaits.

T: qcm
Q: Selon la clause résolutoire légale, combien de temps après un commandement de payer resté sans effet le bail est-il résilié de plein droit ?
A: 8 jours
B: 1 mois
C: 6 semaines
D: 2 mois
R: C
E: Le bail est résilié de plein droit six semaines après un commandement de payer resté sans effet.

T: qcm
L: suite
Q: Et pour la clause résolutoire facultative en cas de défaut d'assurance ?
A: 8 jours après commandement
B: 1 mois après commandement
C: 6 semaines après commandement
D: 3 mois après commandement
R: B
E: La clause facultative pour défaut d'assurance prend effet un mois après un commandement resté sans effet.

T: multi
Q: Parmi ces clauses, lesquelles sont interdites (réputées non écrites) ?
A: Obliger le locataire à laisser visiter le dimanche
B: Imposer le prélèvement automatique
C: Interdire tout animal familier
D: Une clause de solidarité entre colocataires
E: Prévoir des pénalités en cas de retard de paiement
R: A, B, C, E
E: Visites le dimanche, prélèvement imposé, interdiction d'un animal familier (hors chiens de première catégorie) et pénalités de retard sont interdits. La clause de solidarité en colocation fait partie des clauses prévues.

T: qcm
Q: En zone tendue, le précédent locataire est parti il y a 10 mois. Que doit mentionner le bail ?
A: Rien de particulier
B: Le montant et la date de versement du dernier loyer appliqué au précédent locataire
C: Le nom du précédent locataire
D: Le loyer de marché estimé
R: B
E: Cette mention est obligatoire quand le précédent locataire est parti moins de 18 mois avant.

T: qcm
Q: Depuis quand le bail doit-il mentionner l'identifiant fiscal du logement ?
A: 1er janvier 2024
B: 1er janvier 2025
C: 1er octobre 2026
D: Ce n'est pas une mention du bail
R: A
E: L'identifiant fiscal du logement est une mention obligatoire depuis le 1er janvier 2024 ; la classe DPE, depuis le 1er janvier 2025.

T: qcm
Q: Un bailleur personne physique prévoit de reprendre le logement pour une raison familiale précise. Quelle durée de bail vide peut-il signer ?
A: Un bail de 1 à 3 ans, si l'événement est mentionné dans le bail
B: Un bail de 6 mois
C: Un bail d'un an reconductible comme en meublé
D: Aucune dérogation : 3 ans obligatoirement
R: A
E: Article 11 : un bail de un à trois ans est possible si un événement précis justifie la reprise pour des raisons professionnelles ou familiales, mentionné dans le bail.

T: multi
Q: Parmi ces documents, lesquels sont des annexes obligatoires du bail ?
A: Le dossier de diagnostic technique
B: La notice d'information sur les droits et obligations des parties
C: L'état des lieux d'entrée
D: Une grille de vétusté
E: En copropriété, les extraits du règlement de copropriété prévus par le texte
R: A, B, C, E
E: La grille de vétusté n'est annexée que si les parties en conviennent ; les quatre autres documents sont obligatoires.

T: qcm
Q: Une clause oblige le locataire à laisser visiter trois heures par jour ouvrable pendant la mise en vente. Elle est…
A: valable
B: interdite au-delà de deux heures par jour ouvrable
C: valable seulement le samedi
D: obligatoire
R: B
E: L'article 4 interdit d'imposer des visites le dimanche, les jours fériés ou plus de deux heures les jours ouvrables.
```

## Module 1.9

```exercices
T: qcm
Q: Le locataire refuse de venir à l'état des lieux de sortie. Que faire ?
A: Le bailleur le fait seul et le locataire est lié
B: Le faire dresser par un commissaire de justice, coût partagé par moitié
C: Garder tout le dépôt de garantie
D: Le faire dresser par un voisin
R: B
E: À défaut d'accord, un commissaire de justice dresse l'état des lieux à l'initiative de la partie la plus diligente ; le coût réglementé est partagé par moitié.

T: nombre
Q: Au moins combien de jours à l'avance les parties doivent-elles être convoquées à l'état des lieux dressé par commissaire de justice ?
R: 7
U: jours
E: Convocation au moins sept jours à l'avance, par lettre recommandée.

T: nombre
Q: Dans quel délai (en jours) le locataire peut-il demander que l'état des lieux d'entrée soit complété ?
R: 10
U: jours
E: Dans les dix jours suivant l'état des lieux d'entrée ; pour le chauffage, pendant le premier mois de la période de chauffe.

T: qcm
Q: Le locataire est entré en juin. Jusqu'à quand peut-il faire compléter l'état des lieux pour les éléments de chauffage ?
A: Dix jours après l'entrée
B: Pendant le premier mois de la période de chauffe
C: Jusqu'à la fin du bail
D: Jamais
R: B
E: Pour le chauffage, la demande peut intervenir pendant le premier mois de la période de chauffe, puisque l'équipement n'a pas pu être testé en été.

T: qcm
Q: Aucun état des lieux d'entrée n'a été fait, sans que le bailleur y ait fait obstacle. À la sortie…
A: le locataire ne peut rien devoir
B: le locataire est présumé avoir reçu le logement en bon état de réparations locatives, sauf preuve contraire
C: le bailleur doit rendre tout le dépôt sans examen
D: le bail est nul
R: B
E: Article 1731 du Code civil : présomption de bon état à l'entrée, sauf preuve contraire et sauf si le bailleur a fait obstacle à l'état des lieux.

T: vf
Q: Pour un mur repeint il y a sept ans et simplement usé, le bailleur peut retenir sur le dépôt le prix d'une peinture neuve.
R: F
E: Faux. L'usure normale n'est pas imputable au locataire et une retenue ne peut pas enrichir le bailleur.

T: multi
Q: Que doit contenir au minimum un état des lieux (décret du 30 mars 2016) ?
A: Les relevés des compteurs individuels
B: Le détail et la destination des clés
C: L'état des revêtements et équipements de chaque pièce
D: Des photos de chaque pièce
E: Le montant du loyer
R: A, B, C
E: Compteurs, clés et description pièce par pièce font partie du contenu minimal. Les photos sont possibles mais pas obligatoires ; le loyer figure dans le bail.

T: qcm
Q: Qu'ajoute-t-on à l'état des lieux en location meublée ?
A: Un inventaire et un état détaillé du mobilier
B: Une grille de vétusté obligatoire
C: Un constat de commissaire de justice
D: Rien
R: A
E: En meublé, un inventaire et un état détaillé du mobilier sont établis à l'entrée et à la sortie.

T: qcm
Q: Quelle description est la plus utile dans un état des lieux ?
A: « Bon état général »
B: « État d'usage »
C: « Trois trous de cheville au mur nord »
D: « RAS »
R: C
E: Des qualificatifs précis protègent les deux parties ; les formules vagues sont un piège.

T: qcm
Q: Quelles informations l'état des lieux de sortie mentionne-t-il en plus ?
A: La nouvelle adresse du locataire et la date de l'état des lieux d'entrée
B: Le montant du prochain loyer
C: Le nom du futur locataire
D: L'avis d'imposition du locataire
R: A
E: L'état des lieux de sortie mentionne la nouvelle adresse du locataire et la date de l'état des lieux d'entrée.
```

## Module 1.10

```exercices
T: qcm
Q: Le locataire demande une quittance. Le bailleur…
A: peut facturer 5 € par quittance
B: doit la remettre gratuitement
C: peut refuser si le loyer est payé par virement
D: doit passer par une agence
R: B
E: La remise de la quittance est gratuite et obligatoire quand le locataire la demande (article 21).

T: nombre
Q: Le locataire ne justifie pas de son assurance malgré une mise en demeure. Le bailleur souscrit une assurance pour son compte à 15 € par mois. Quel montant mensuel maximal peut-il récupérer ?
R: 16,5
U: €
P: 0,01
E: Le coût peut être majoré au plus de 10 % (article 7 g) : 15 × 1,10 = 16,50 €.

T: qcm
Q: Combien de temps après une mise en demeure restée sans effet le bailleur peut-il souscrire l'assurance pour le locataire ?
A: 8 jours
B: 1 mois
C: 3 mois
D: Immédiatement
R: B
E: Un mois après une mise en demeure restée sans effet.

T: qcm
Q: Des travaux de rénovation privent le locataire d'une chambre pendant 30 jours. Que prévoit la loi ?
A: Rien, les travaux sont d'intérêt général
B: Une diminution du loyer à proportion du temps et de la partie du logement dont il a été privé
C: Le remboursement de trois mois de loyer
D: La résiliation automatique du bail
R: B
E: Au-delà de vingt et un jours de travaux, le loyer est diminué à proportion du temps et de la partie du logement dont le locataire a été privé.

T: qcm
Q: La chaudière, ancienne, tombe en panne. Qui paie son remplacement, et qui paie l'entretien annuel ?
A: Le locataire paie les deux
B: Le bailleur paie le remplacement ; l'entretien annuel reste à la charge du locataire
C: Le bailleur paie les deux
D: Le syndic paie le remplacement
R: B
E: Le remplacement d'un équipement vétuste est une réparation non locative (bailleur) ; l'entretien annuel est une charge du locataire.

T: qcm
Q: Le bailleur vend son logement occupé. Que devient le bail ?
A: Il prend fin à la vente
B: Il se poursuit avec l'acquéreur, qui reprend le dépôt de garantie et les obligations du bailleur
C: Le locataire doit partir sous trois mois
D: Un nouveau bail doit être signé
R: B
E: Le bail se poursuit avec l'acquéreur, qui reprend le dépôt de garantie et les obligations du bailleur.

T: multi
Q: Le locataire décède. Au profit de qui le bail peut-il être transféré ?
A: Son conjoint
B: Son partenaire de PACS
C: Son concubin notoire qui vivait avec lui depuis deux ans
D: Un ami hébergé depuis trois mois
E: Son fils qui vivait avec lui depuis dix-huit mois
R: A, B, C, E
E: Article 14 : conjoint, partenaire de PACS, et descendants, ascendants, concubin notoire ou personnes à charge vivant avec lui depuis au moins un an. L'ami hébergé depuis trois mois n'y figure pas.

T: vf
Q: Le logement semble abandonné depuis un mois : le bailleur peut y entrer et le vider lui-même.
R: F
E: Faux. Il faut la procédure de constat d'abandon par commissaire de justice puis la résiliation par le juge (article 14-1) ; entrer soi-même est une violation de domicile.

T: qcm
Q: Seul le mari a signé le bail du logement familial. Qui est titulaire du bail ?
A: Le mari seulement
B: Les deux époux, cotitulaires
C: L'épouse seulement si elle le demande au juge
D: Personne tant que l'épouse n'a pas signé
R: B
E: Les époux sont cotitulaires du bail de leur résidence principale, même si un seul a signé (article 1751 du Code civil).

T: qcm
Q: Le locataire sous-loue le logement sur une plateforme sans accord écrit. Que peut faire le bailleur ?
A: Rien, la sous-location est libre
B: Mettre en demeure, agir en résiliation et réclamer la restitution des sous-loyers perçus
C: Changer les serrures
D: Augmenter le loyer du montant des sous-loyers
R: B
E: La sous-location est interdite sans accord écrit du bailleur, y compris sur le prix : mise en demeure, action en résiliation et restitution des sous-loyers.
```

## Module 1.11

```exercices
T: nombre
Q: Loyer de 900 € HC. L'état des lieux de sortie, qui révèle des différences, a lieu le 10 février. Le dépôt est restitué le 20 mai. Quelle pénalité de retard le bailleur doit-il ?
R: 180
U: €
E: Avec des différences, le délai est de deux mois : jusqu'au 10 avril. Du 10 avril au 20 mai, le retard entame un second mois. Pénalité : 10 % × 900 × 2 mois commencés = 180 €.

T: nombre
Q: Loyer de 650 € HC. État des lieux de sortie conforme le 1er juin. Dépôt restitué le 15 juillet. Quelle pénalité ?
R: 65
U: €
E: Délai d'un mois (état des lieux conforme) : jusqu'au 1er juillet. Retard de 14 jours : un mois commencé, soit 10 % × 650 = 65 €.

T: qcm
Q: Location vide hors zone tendue : le locataire est muté et le justifie dans son congé. Quel est son préavis ?
A: 3 mois
B: 1 mois
C: 2 mois
D: Aucun
R: B
E: La mutation fait partie des cas de préavis réduit à un mois, à condition de préciser le motif et de le justifier lors de l'envoi du congé.

T: qcm
Q: Location vide hors zone tendue, cas général. Le congé du locataire est reçu le 10 mars. Jusqu'à quand le loyer est-il dû ?
A: 10 avril
B: 10 juin
C: 31 mars
D: 10 septembre
R: B
E: Préavis de trois mois à compter de la réception : jusqu'au 10 juin, sauf si un nouveau locataire entre plus tôt avec l'accord du bailleur.

T: qcm
Q: En location vide, le congé pour vente vaut offre de vente au locataire. De combien de temps dispose-t-il pour accepter ?
A: 15 jours
B: 1 mois
C: 2 mois
D: 6 mois
R: C
E: Deux mois pour accepter, puis deux mois pour signer (quatre s'il emprunte).

T: qcm
Q: Le locataire a 70 ans et des ressources inférieures au plafond PLUS. Le bailleur a 50 ans et des revenus élevés. Pour donner congé, le bailleur doit…
A: simplement respecter le délai de six mois
B: proposer un relogement correspondant aux besoins et possibilités du locataire, à proximité
C: obtenir l'accord du juge
D: verser une indemnité d'un an de loyer
R: B
E: Protection des locataires de plus de 65 ans aux ressources modestes, sauf si le bailleur a lui-même plus de 65 ans ou des ressources inférieures au plafond.

T: qcm
Q: Un investisseur achète un logement occupé ; le bail en cours se termine un an après l'achat. Quand peut-il donner congé pour vendre ?
A: Au terme du bail en cours
B: Au terme du premier renouvellement ou de la première reconduction
C: Immédiatement
D: Jamais
R: B
E: Article 15 : le congé pour vente n'est possible au terme du bail en cours que s'il intervient plus de trois ans après l'acquisition ; sinon, au terme du premier renouvellement ou de la première reconduction.

T: qcm
Q: Quelle amende pénale encourt un bailleur personne physique qui délivre un congé frauduleux ?
A: 1 500 €
B: 6 000 €
C: 30 000 €
D: 45 000 €
R: B
E: Jusqu'à 6 000 € pour une personne physique et 30 000 € pour une personne morale, plus les dommages et intérêts.

T: nombre
Q: Logement en copropriété, dépôt de garantie de 1 000 €. Quelle provision maximale le bailleur peut-il conserver jusqu'à l'approbation des comptes ?
R: 200
U: €
E: Au plus 20 % du dépôt : 0,20 × 1 000 = 200 €, puis régularisation dans le mois qui suit l'approbation des comptes.

T: vf
Q: En location vide, un congé pour vente délivré cinq mois avant l'échéance du bail est valable.
R: F
E: Faux. Le congé doit être délivré au moins six mois avant l'échéance en location vide (trois mois en meublé).
```

## Module 1.12

```exercices
T: nombre
Q: Appartement acheté 150 000 €, frais d'acquisition 11 000 €, travaux 9 000 €, sans mobilier. Quel est le coût total de l'opération ?
R: 170000
U: €
E: Coût total = prix + frais d'acquisition + travaux + mobilier : 150 000 + 11 000 + 9 000 = 170 000 €. On raisonne toujours sur le coût total, pas sur le prix affiché.

T: nombre
L: suite
Q: Ce bien se loue 750 € HC par mois. Quelle est sa rentabilité brute (en %, deux décimales) ?
R: 5,29
U: %
P: 0,01
E: Loyers annuels : 750 × 12 = 9 000 €. Rentabilité brute = 9 000 / 170 000 × 100 = 5,29 %.

T: nombre
Q: Les charges non récupérables, provision pour vacance comprise, s'élèvent à 2 400 € par an. Quelle est la rentabilité nette de charges (en %, deux décimales) ?
R: 3,88
U: %
P: 0,01
E: (9 000 − 2 400) / 170 000 × 100 = 3,88 %.

T: nombre
Q: Prêt de 150 000 € sur 20 ans (240 mois) à 3,6 % par an. Quelle est la mensualité hors assurance (au centime près) ?
R: 877,67
U: €
P: 0,05
E: Mensualité = C × t / (1 − (1 + t)^(−n)), avec t = 0,036 / 12 = 0,003 et n = 240 : 150 000 × 0,003 / (1 − 1,003^(−240)) ≈ 877,67 €.

T: nombre
Q: L'assurance emprunteur coûte 0,25 % du capital de 150 000 € par an. Combien par mois ?
R: 31,25
U: €
P: 0,01
E: 150 000 × 0,25 % = 375 € par an, soit 375 / 12 = 31,25 € par mois.

T: nombre
L: suite
Q: Avec les chiffres précédents (loyers 9 000 €, charges 2 400 € par an, mensualité 877,67 €, assurance 31,25 €), quel est le cash-flow mensuel avant impôt ?
R: -358,92
U: €
P: 0,1
E: (9 000 − 2 400) / 12 − 877,67 − 31,25 = 550 − 908,92 = −358,92 € : l'investisseur épargne environ 359 € par mois, tout en remboursant du capital.

T: multi
Q: Lesquelles de ces dépenses sont des charges non récupérables, qui réduisent la rentabilité nette ?
A: La taxe foncière (hors ordures ménagères)
B: L'assurance propriétaire non occupant (PNO)
C: L'assurance loyers impayés
D: La taxe d'enlèvement des ordures ménagères
E: L'électricité des parties communes
R: A, B, C
E: Taxe foncière hors ordures ménagères, PNO et assurance loyers impayés restent à la charge du bailleur. La taxe d'ordures ménagères et l'électricité des parties communes sont récupérables sur le locataire.

T: qcm
Q: Quelle provision pour vacance retient-on souvent en location meublée ?
A: Aucune
B: 1 mois par an
C: 3 mois par an
D: 6 mois par an
R: B
E: Souvent un mois par an en meublé, deux à quatre semaines en location vide.

T: qcm
Q: Quel ordre de grandeur de frais d'acquisition (« frais de notaire ») retenir dans l'ancien ?
A: 2 à 3 %
B: 7 à 8,5 %
C: 12 à 15 %
D: 0 %
R: B
E: Environ 7 à 8,5 % dans l'ancien et 2 à 3 % dans le neuf.

T: vf
Q: La règle « le loyer mensuel doit représenter 1 % du prix » suffit pour décider d'un achat.
R: F
E: Faux. Ce raccourci donne une première idée mais ne remplace pas un calcul complet (charges, vacance, crédit, impôt).
```

## Examen de fin de niveau 1

```exercices
C: 1
T: qcm
Q: Le DPE de Léa a été réalisé en mai 2021. Peut-elle l'annexer au nouveau bail ?
A: Oui, un DPE est valable dix ans
B: Non : réalisé avant le 1er juillet 2021, il n'est plus valable depuis le 1er janvier 2025
C: Oui, si elle télécharge l'attestation 2026
D: Oui, car la classe E reste décente
R: B
E: Les DPE réalisés du 1er janvier 2018 au 30 juin 2021 ne sont plus valables depuis le 1er janvier 2025 : il faut en commander un nouveau.

C: 1
T: nombre
Q: Quel est le plafond de loyer de base imposé par l'encadrement pour les 38 m² de Léa (loyer de référence majoré : 22,40 € par m²) ?
R: 851,2
U: €
P: 0,01
E: 22,40 × 38 = 851,20 €.

C: 1
T: nombre
Q: En zone tendue, le loyer du précédent locataire (820 €, non révisé depuis 14 mois) peut être augmenté de la variation annuelle de l'IRL, +1,15 % au 2e trimestre 2026. Quel est le loyer maximal à la relocation ?
R: 829,43
U: €
P: 1
E: 820 × 1,0115 ≈ 829,43 €, soit environ 829 €, sous le plafond d'encadrement de 851,20 € : c'est la limite applicable.

C: 1
T: vf
Q: Léa peut relouer 900 € HC sans justifier d'exception.
R: F
E: Faux. 900 € dépasse le loyer bloqué (environ 829 €) et le plafond d'encadrement (851,20 €), sauf exception comme des travaux importants justifiés.

C: 1
T: multi
Q: Que doit mentionner le bail de Léa ?
A: Le dernier loyer appliqué au précédent locataire
B: Le loyer de référence
C: Le loyer de référence majoré
D: Les revenus du nouveau locataire
E: La classe du DPE
R: A, B, C, E
E: Zone tendue : dernier loyer du précédent locataire ; encadrement : loyer de référence et loyer de référence majoré ; la classe DPE figure dans tout bail depuis 2025. Les revenus du locataire n'ont pas à y figurer.

C: 2
T: vf
Q: Le bailleur, assuré contre les loyers impayés, peut aussi exiger une caution de Nathan et Samir.
R: V
E: Vrai, exceptionnellement : le cumul est autorisé parce que les locataires sont étudiants.

C: 2
T: qcm
Q: Le bailleur demande les relevés bancaires des cautions. C'est…
A: autorisé pour les cautions
B: interdit : il doit se limiter aux pièces du décret de 2015
C: obligatoire avec une assurance loyers impayés
D: autorisé si les cautions sont d'accord
R: B
E: Les relevés bancaires figurent parmi les pièces interdites, pour le candidat comme pour sa caution.

C: 2
T: qcm
Q: Le bailleur peut-il refuser la caution du parent de Samir, qui habite au Maroc ?
A: Oui, une caution doit résider en France
B: Non : l'article 22-1 interdit ce motif de refus
C: Oui, si l'assureur le demande
D: Oui, pour un meublé
R: B
E: Refuser une caution parce qu'elle réside à l'étranger est interdit ; le bailleur doit seulement vérifier que son assureur accepte ce profil pour rester couvert.

C: 3
T: qcm
Q: Le dépôt de garantie de Marc (1 300 € pour un meublé loué 650 € HC) est-il conforme ?
A: Non, il dépasse un mois de loyer
B: Oui : deux mois de loyer hors charges, plafond du meublé
C: Non, un meublé n'a pas de dépôt de garantie
D: Oui, car le dépôt est libre en meublé
R: B
E: En meublé, le plafond est de deux mois de loyer hors charges : 2 × 650 = 1 300 €.

C: 3
T: nombre
Q: Quel montant le bailleur peut-il retenir au plus sur le dépôt de Marc, avant tout abattement pour vétusté du plan de travail ?
R: 380
U: €
E: Seule la brûlure du plan de travail est une dégradation imputable (devis de 380 €). La peinture relève de l'usure normale : aucune retenue.

C: 3
T: qcm
Q: Dans quel délai le bailleur doit-il restituer le solde ?
A: 1 mois
B: 2 mois, car l'état des lieux révèle des différences
C: 3 mois
D: À l'approbation des comptes de copropriété
R: B
E: Deux mois quand l'état des lieux de sortie révèle des différences ; les trois mois envisagés par le bailleur sont trop longs.

C: 3
T: nombre
Q: Quelle pénalité le bailleur devra-t-il par mois de retard commencé ?
R: 65
U: €
E: 10 % du loyer mensuel hors charges : 10 % × 650 = 65 € par mois de retard commencé.
```

## Module 2.1

```exercices
T: nombre
Q: Loyer de 650 € HC, trimestre de référence : 2e trimestre. IRL du 2e trimestre 2025 : 146,68 ; du 2e trimestre 2026 : 148,37. Quel est le loyer révisé maximal (au centime) ?
R: 657,49
U: €
P: 0,02
E: 650 × 148,37 / 146,68 = 657,49 €.

T: nombre
L: suite
Q: Même calcul pour un loyer de 950 € HC.
R: 960,95
U: €
P: 0,02
E: 950 × 148,37 / 146,68 = 960,95 €.

T: qcm
Q: La date de révision est le 1er septembre 2026. Le bailleur n'écrit au locataire que le 15 novembre 2026. À partir de quand le loyer révisé s'applique-t-il ?
A: Au 1er septembre 2026, avec un rappel pour septembre et octobre
B: Au 15 novembre 2026, sans rétroactivité
C: Au 1er janvier 2027
D: Jamais : la révision est perdue
R: B
E: La révision prend effet à compter de la demande, sans rétroactivité.

T: qcm
Q: Le bailleur laisse passer plus d'un an après la date de révision sans la demander. Que se passe-t-il ?
A: Il peut réclamer tous les arriérés
B: La révision de l'année est perdue
C: Il peut réviser deux fois l'année suivante
D: Le loyer est révisé automatiquement
R: B
E: Le bailleur dispose d'un an à compter de la date de révision ; passé ce délai, la révision de l'année est perdue.

T: vf
Q: En métropole, un logement classé F dont le bail a été tacitement reconduit en 2024 peut voir son loyer révisé selon l'IRL.
R: F
E: Faux. Aucune révision n'est possible pour un logement F ou G si le bail a été conclu, renouvelé ou reconduit depuis le 24 août 2022.

T: nombre
Q: Zone tendue. Dernier loyer : 800 € par mois (9 600 € sur la dernière année). Le bailleur a réalisé 6 000 € TTC de travaux d'amélioration depuis le dernier bail. Quel loyer mensuel maximal peut-il demander au nouveau locataire ?
R: 875
U: €
E: Les travaux (6 000 €) atteignent la moitié de la dernière année de loyer (4 800 €) : hausse annuelle limitée à 15 % × 6 000 = 900 €, soit 75 € par mois. 800 + 75 = 875 €.

T: nombre
Q: Zone tendue. Dernier loyer : 700 €, manifestement sous-évalué ; le loyer de référence du voisinage est de 800 €. Quel loyer maximal pour le nouveau bail ?
R: 750
U: €
E: La hausse est limitée à la moitié de l'écart : (800 − 700) / 2 = 50 €, soit 750 €.

T: nombre
Q: Encadrement : le loyer de référence est de 20 € par m². Quel loyer de base maximal pour 30 m² ?
R: 720
U: €
E: Loyer de référence majoré = 20 × 1,2 = 24 € par m² ; 24 × 30 = 720 €.

T: multi
Q: Dans quels cas un complément de loyer est-il interdit ?
A: Logement classé F ou G
B: Vis-à-vis à moins de dix mètres
C: Signes d'humidité
D: Vue exceptionnelle
E: Sanitaires sur le palier
R: A, B, C, E
E: La loi interdit le complément en présence de ces défauts. Une vue exceptionnelle est au contraire un exemple de caractéristique qui peut le justifier.

T: qcm
Q: Au renouvellement d'un bail vide, une réévaluation acceptée représente une hausse de 12 %. Comment s'applique-t-elle ?
A: En une fois
B: Par tiers sur trois ans
C: Par sixièmes annuels sur six ans
D: Par moitié sur deux ans
R: C
E: Par tiers sur trois ans si la hausse est inférieure ou égale à 10 %, par sixièmes annuels sur six ans au-delà.
```

## Module 2.2

```exercices
T: nombre
Q: Provisions de 60 € par mois ; dépenses récupérables réelles de l'année : 810 €. Quel complément le locataire doit-il ?
R: 90
U: €
E: Provisions versées : 60 × 12 = 720 €. Complément : 810 − 720 = 90 €.

T: nombre
Q: Provisions de 45 € par mois ; dépenses réelles : 480 €. Combien le bailleur doit-il rembourser ?
R: 60
U: €
E: Provisions versées : 540 €. Trop-perçu : 540 − 480 = 60 €, à rembourser.

T: nombre
Q: Le gardien assure l'entretien des parties communes et l'élimination des rejets ; sa rémunération et ses charges sociales coûtent 18 000 € par an. Quelle part est récupérable ?
R: 13500
U: €
E: 75 % quand il assure les deux tâches : 0,75 × 18 000 = 13 500 €.

T: nombre
L: suite
Q: Même gardien, mais qui n'assure que l'entretien des parties communes. Quelle part est récupérable ?
R: 7200
U: €
E: 40 % s'il n'assure qu'une des deux tâches : 0,40 × 18 000 = 7 200 €.

T: multi
Q: Lesquelles de ces dépenses ne sont jamais récupérables ?
A: La taxe foncière (hors ordures ménagères)
B: Les honoraires du syndic
C: L'assurance de l'immeuble
D: La taxe d'enlèvement des ordures ménagères
E: Le fonds de travaux
R: A, B, C, E
E: Taxe foncière, honoraires du syndic, assurance et fonds de travaux ne sont jamais récupérables. La taxe d'enlèvement des ordures ménagères l'est.

T: qcm
Q: Combien de temps avant la régularisation le bailleur doit-il communiquer le décompte des charges ?
A: 8 jours
B: 1 mois
C: 3 mois
D: Le jour même
R: B
E: Un mois avant la régularisation : décompte par nature de charges, mode de répartition et, en chauffage collectif, note d'information.

T: nombre
Q: Pendant combien de mois les pièces justificatives sont-elles tenues à la disposition du locataire ?
R: 6
U: mois
E: Six mois, éventuellement par voie dématérialisée.

T: qcm
Q: Le bailleur régularise les charges de 2024 seulement en mars 2026. Que peut exiger le locataire ?
A: L'annulation de la dette
B: Un paiement échelonné sur douze mois
C: Des intérêts de retard
D: Rien
R: B
E: Si la régularisation n'est pas faite avant la fin de l'année civile suivant l'année d'exigibilité, le locataire peut exiger un paiement échelonné sur douze mois.

T: qcm
Q: Quel est le délai de prescription pour réclamer des charges ?
A: 1 an
B: 3 ans
C: 5 ans
D: 10 ans
R: B
E: La prescription est de trois ans.

T: qcm
Q: Dans quel bail le forfait de charges est-il obligatoire ?
A: La location vide
B: Le bail mobilité
C: La location meublée
D: La colocation à baux individuels
R: B
E: Le forfait est obligatoire en bail mobilité (article 25-18), possible en meublé et en colocation à bail unique.
```

## Module 2.3

```exercices
T: multi
Q: Parmi ces dépenses, lesquelles sont à la charge du locataire ?
A: Le débouchage d'un évier
B: Le remplacement des ampoules
C: L'entretien annuel de la chaudière
D: Le remplacement de la chaudière vétuste
E: Le remplacement de fenêtres vétustes
R: A, B, C
E: Débouchage, ampoules et entretien annuel sont des réparations locatives ; les remplacements dus à la vétusté incombent au bailleur.

T: vf
Q: Le remplacement d'un chauffe-eau en fin de vie est à la charge du locataire.
R: F
E: Faux. Le chauffe-eau en fin de vie relève du bailleur (vétusté).

T: qcm
Q: À qui incombent les grosses réparations (gros murs, couvertures entières, poutres) ?
A: Au locataire
B: Toujours au propriétaire (article 606 du Code civil)
C: Au syndic
D: À parts égales
R: B
E: Les grosses réparations incombent toujours au propriétaire.

T: qcm
Q: Le locataire abat une cloison sans accord écrit. Que peut faire le bailleur ?
A: Rien, c'est un simple aménagement
B: Exiger la remise en état aux frais du locataire ou conserver la transformation sans indemnité
C: Seulement retenir le dépôt de garantie
D: Résilier le bail sans juge
R: B
E: Les transformations exigent l'accord écrit du bailleur ; à défaut, il choisit entre la remise en état aux frais du locataire et la conservation sans indemnité.

T: qcm
Q: Le locataire demande par lettre recommandée à réaliser à ses frais des travaux d'adaptation au handicap. Le bailleur ne répond pas pendant deux mois. Conséquence ?
A: La demande est refusée
B: Le silence vaut accord, et le bailleur ne pourra pas exiger la remise en état au départ
C: Le locataire doit saisir le juge
D: Le bailleur doit payer les travaux
R: B
E: Pour l'adaptation au handicap et la rénovation énergétique listée par décret, le silence du bailleur pendant deux mois vaut accord.

T: nombre
Q: Dans combien de jours ouvrés faut-il déclarer un sinistre à son assureur ?
R: 5
U: jours ouvrés
E: Déclarez tout sinistre dans les cinq jours ouvrés.

T: qcm
Q: Quel taux de TVA s'applique à des travaux d'entretien dans un logement achevé depuis plus de deux ans ?
A: 5,5 %
B: 10 %
C: 20 %
D: 0 %
R: B
E: 10 % pour l'amélioration et l'entretien ; 5,5 % pour la rénovation énergétique éligible ; 20 % pour les travaux assimilés à du neuf ou un agrandissement.

T: nombre
Q: Des travaux de rénovation énergétique éligibles coûtent 10 000 € HT. Quel est leur prix TTC ?
R: 10550
U: €
E: TVA à 5,5 % : 10 000 × 1,055 = 10 550 €.

T: nombre
Q: Selon l'astuce du module, quelle somme provisionner chaque année pour l'entretien d'un bien valant 200 000 € ?
R: 2000
U: €
E: Environ 1 % de la valeur du bien par an : 2 000 €.

T: qcm
Q: Des travaux du bailleur durent 30 jours et privent le locataire d'une pièce. Que prévoit la loi ?
A: Rien
B: Une réduction de loyer proportionnelle, car ils dépassent 21 jours
C: Le relogement aux frais du bailleur
D: La suspension totale du loyer
R: B
E: Au-delà de 21 jours de travaux, le loyer est réduit à proportion du temps et de la partie du logement dont le locataire a été privé.
```

## Module 2.4

```exercices
T: nombre
Q: Dans combien de jours, après sa signification au locataire, le commandement de payer doit-il être signifié à la caution pour qu'elle réponde des pénalités et intérêts de retard ?
R: 15
U: jours
E: Dans les quinze jours ; à défaut, la caution ne peut être tenue des pénalités ou intérêts de retard.

T: qcm
Q: Une caution à durée indéterminée résilie son engagement en cours de bail. Jusqu'à quand reste-t-elle tenue ?
A: Jusqu'à la date de sa lettre
B: Jusqu'au terme du bail en cours
C: Pendant trois mois
D: Jusqu'au départ du locataire, quelle qu'en soit la date
R: B
E: Une caution à durée indéterminée peut résilier à tout moment, mais reste tenue jusqu'au terme du bail en cours.

T: qcm
Q: Quel est l'intérêt d'une caution solidaire pour le bailleur ?
A: Elle ne peut jamais résilier
B: Elle peut être poursuivie directement, sans agir d'abord contre le locataire
C: Elle paie aussi les travaux du bailleur
D: Elle dispense de l'état des lieux
R: B
E: La caution solidaire peut être poursuivie directement.

T: qcm
Q: En colocation, un colocataire garanti par une caution quitte le logement et n'est pas remplacé. Quand l'engagement de sa caution prend-il fin au plus tard ?
A: Le jour de son départ
B: Six mois après la fin de son préavis
C: Au terme du bail
D: Un an après son départ
R: B
E: L'engagement prend fin avec la solidarité du colocataire, au plus tard six mois après son départ.

T: nombre
Q: Pour un travailleur saisonnier hors Île-de-France, quel loyer mensuel maximal Visale couvre-t-elle ?
R: 600
U: €
E: 600 € par mois hors Île-de-France, 800 € en Île-de-France, pour une occupation de 1 à 9 mois.

T: qcm
Q: Contrat Visale signé en mars 2026. Le locataire cesse de payer au cours de sa quatrième année d'occupation. Les impayés sont-ils couverts ?
A: Oui, jusqu'à 36 mensualités
B: Non : seuls les impayés survenus pendant les trois premières années d'occupation sont couverts
C: Oui, sans limite
D: Oui, pour 12 mensualités
R: B
E: Pour les contrats signés depuis le 6 janvier 2026, les impayés sont couverts jusqu'à 36 mensualités, mais seulement s'ils surviennent pendant les trois premières années.

T: nombre
Q: Loyer charges comprises de 750 €. Quel montant maximal Visale couvre-t-elle pour les dégradations locatives ?
R: 1500
U: €
E: Deux mois de loyer charges comprises : 2 × 750 = 1 500 €, sans franchise ni délai de carence.

T: nombre
Q: Une assurance loyers impayés coûte 3 % des loyers charges comprises. Loyers annuels : 9 600 €. Quel est son coût annuel (déductible) ?
R: 288
U: €
E: 3 % × 9 600 = 288 €, déductible des revenus fonciers ou des recettes BIC.

T: multi
Q: Quelles conditions faut-il remplir pour bénéficier de Visale ?
A: Un bail de résidence principale conforme à la loi de 1989
B: Un logement décent
C: Aucune autre caution
D: Une assurance loyers impayés en complément
E: Un locataire membre de la famille du bailleur
R: A, B, C
E: Visale exige un bail loi de 1989, un logement décent, un loyer dans les plafonds, et exclut la location à un membre de la famille, une autre caution ou une assurance loyers impayés.

T: qcm
Q: Pour qui l'assurance propriétaire non occupant (PNO) est-elle obligatoire ?
A: Pour personne
B: Pour tout copropriétaire, depuis la loi ALUR
C: Seulement en location meublée
D: Seulement pour les SCI
R: B
E: Elle est obligatoire pour tout copropriétaire (article 9-1 de la loi du 10 juillet 1965) et fortement recommandée dans tous les cas.
```

## Module 2.5

```exercices
T: vf
Q: Deux époux qui louent ensemble un appartement sont colocataires au sens de l'article 8-1.
R: F
E: Faux. Les époux et partenaires de PACS ne sont pas des colocataires entre eux.

T: qcm
Q: En colocation à baux individuels, quelle règle chaque chambre doit-elle respecter ?
A: Aucune, les parties communes suffisent
B: Les critères d'une pièce décente : 9 m² et 2,20 m sous plafond, ou 20 m³
C: 14 m² minimum
D: Une salle d'eau privative
R: B
E: Chaque chambre doit respecter les critères de surface d'une pièce décente.

T: qcm
Q: Dans une zone d'encadrement, un bailleur loue un appartement en baux individuels. Qu'est-ce qui est plafonné ?
A: Rien, les baux individuels y échappent
B: La somme des loyers des chambres
C: Seulement la plus grande chambre
D: Seulement les charges
R: B
E: La somme des loyers de la colocation reste soumise aux plafonds d'encadrement (piège cité).

T: qcm
Q: Un bail mobilité de 6 mois peut-il être prolongé par avenant jusqu'à 12 mois ?
A: Oui, une fois
B: Non : la durée peut être modifiée une fois, sans dépasser dix mois au total
C: Oui, sans limite
D: Oui, s'il devient un bail étudiant
R: B
E: La durée peut être modifiée une fois par avenant sans dépasser dix mois au total ; au-delà, il faut signer un bail meublé classique.

T: qcm
Q: Le bailleur peut-il donner congé au locataire en bail mobilité ?
A: Oui, avec trois mois de préavis
B: Non, aucune possibilité de congé pour le bailleur
C: Oui, avec un mois de préavis
D: Oui, pour vendre
R: B
E: Le locataire a un préavis d'un mois ; le bailleur n'a aucune possibilité de congé.

T: vf
Q: Un parent qui loue un logement à son fils permet à celui-ci de toucher l'aide au logement.
R: F
E: Faux. Les aides au logement ne sont pas versées si le logement appartient à un ascendant ou descendant du locataire (ou de son conjoint).

T: nombre
Q: Le locataire loue 60 m² pour 900 € par mois et sous-loue, avec l'accord écrit du bailleur, une chambre de 12 m². Quel sous-loyer maximal peut-il demander ?
R: 180
U: €
E: Le sous-loyer au m² ne peut excéder le loyer principal au m² : 900 / 60 = 15 € par m², soit 15 × 12 = 180 €.

T: qcm
Q: À qui reviennent les sous-loyers perçus par un locataire qui sous-loue sans autorisation sur une plateforme ?
A: Au locataire
B: Au bailleur, car ce sont des fruits civils
C: Au Trésor public
D: À la plateforme
R: B
E: Cour de cassation, 3e chambre civile, 12 septembre 2019 : les sous-loyers sont des fruits civils qui reviennent au bailleur.

T: qcm
Q: La cohabitation intergénérationnelle solidaire associe…
A: une personne de 60 ans et plus et une personne de moins de 30 ans
B: une personne de 65 ans et plus et un étudiant
C: deux personnes de plus de 60 ans
D: un bailleur et un apprenti
R: A
E: Une personne de 60 ans et plus loue ou sous-loue une partie de son logement à une personne de moins de 30 ans (article L. 118-1 du CASF).

T: qcm
Q: Le bail mobilité ne mentionne ni « bail mobilité », ni le motif. Conséquence ?
A: Il reste valable
B: Il est requalifié en bail meublé d'un an
C: Il est requalifié en location vide de trois ans
D: Il est nul
R: B
E: Le bail doit mentionner expressément « bail mobilité », le motif et la durée, faute de quoi il est requalifié en bail meublé d'un an.
```

## Module 2.6

```exercices
T: nombre
Q: Au micro-foncier, un foyer perçoit 10 000 € de loyers bruts. Quel est son revenu foncier imposable ?
R: 7000
U: €
E: Abattement forfaitaire de 30 % : 10 000 × 0,70 = 7 000 €.

T: nombre
L: suite
Q: Même foyer, tranche à 30 %. Combien paie-t-il d'impôt et de prélèvements sociaux sur ces loyers ?
R: 3304
U: €
E: 7 000 × (30 % + 17,2 %) = 7 000 × 47,2 % = 3 304 €.

T: qcm
Q: Pendant combien de temps l'option pour le régime réel est-elle irrévocable ?
A: 1 an
B: 3 ans
C: 5 ans
D: 9 ans
R: B
E: L'option est irrévocable pendant trois ans, puis reconduite tacitement d'année en année.

T: multi
Q: Au régime réel, lesquelles de ces dépenses sont déductibles ?
A: Les intérêts d'emprunt
B: La taxe foncière (hors ordures ménagères récupérées)
C: L'assurance PNO
D: Le remboursement du capital de l'emprunt
E: Des travaux d'agrandissement
R: A, B, C
E: Intérêts, taxe foncière et assurances sont déductibles. Le capital remboursé et les travaux d'agrandissement ne le sont jamais.

T: nombre
Q: Loyers 6 000 €, intérêts d'emprunt 2 000 €, autres charges (travaux d'entretien) 18 000 €. Quel montant du déficit s'impute sur le revenu global cette année (plafond de droit commun) ?
R: 10700
U: €
E: Les intérêts s'imputent d'abord sur les loyers : reste 4 000 €. Les autres charges créent un déficit de 18 000 − 4 000 = 14 000 €, imputable sur le revenu global dans la limite de 10 700 €.

T: nombre
L: suite
Q: Dans cet exemple, quelle part du déficit est reportée sur les revenus fonciers des dix années suivantes ?
R: 3300
U: €
E: 14 000 − 10 700 = 3 300 €.

T: nombre
Q: Pour un contribuable dans la tranche à 30 %, quelle économie d'impôt sur le revenu représente l'imputation de 10 700 € ?
R: 3210
U: €
E: 10 700 × 30 % = 3 210 €.

T: nombre
L: suite
Q: Même situation, mais les 18 000 € de charges sont des travaux de rénovation énergétique payés en 2026, qui font passer le logement de F à C. Quel montant du déficit de 14 000 € s'impute sur le revenu global ?
R: 14000
U: €
E: Pour une rénovation énergétique passant de E, F ou G à A-D, le plafond est porté à 21 400 € (dépenses payées jusqu'au 31 décembre 2027) : les 14 000 € s'imputent en totalité.

T: qcm
L: suite
Q: Déficit imputé en 2026. Jusqu'à quand le bien doit-il rester loué nu ?
A: 31 décembre 2026
B: 31 décembre 2029
C: 31 décembre 2027
D: Aucune condition
R: B
E: Jusqu'au 31 décembre de la troisième année suivant l'imputation, soit 2029 ; sinon l'avantage est repris.

T: qcm
Q: Quel taux de prélèvements sociaux s'applique aux revenus fonciers en 2026 ?
A: 17,2 %
B: 18,6 %
C: 9,2 %
D: 30 %
R: A
E: 17,2 % : la hausse de CSG de la LFSS pour 2026 (18,6 %) ne s'applique pas aux revenus fonciers.
```

## Module 2.7

```exercices
T: qcm
Q: Un foyer perçoit 30 000 € de recettes de location meublée et 25 000 € de salaires. Quel est son statut ?
A: LMNP
B: LMP : recettes supérieures à 23 000 € et aux autres revenus d'activité
C: Aucun, il faut un bail commercial
D: LMNP, car il a un salaire
R: B
E: Les deux conditions sont remplies : 30 000 € > 23 000 € et 30 000 € > 25 000 € de salaires.

T: qcm
L: suite
Q: Même foyer, mais avec 45 000 € de salaires. Quel est son statut ?
A: LMP
B: LMNP, car les recettes ne dépassent pas les autres revenus d'activité
C: LMP, car les recettes dépassent 23 000 €
D: Micro-entrepreneur
R: B
E: Les recettes (30 000 €) dépassent 23 000 € mais pas les salaires (45 000 €) : le loueur est non professionnel.

T: nombre
Q: Location meublée de longue durée au micro-BIC : 12 000 € de recettes. Quel est le résultat imposable ?
R: 6000
U: €
E: Abattement de 50 % : 12 000 × 0,5 = 6 000 €.

T: nombre
Q: Meublé de tourisme non classé au micro-BIC : 12 000 € de recettes. Quel est le résultat imposable ?
R: 8400
U: €
E: Abattement de 30 % seulement (plafond 15 000 €) : 12 000 × 0,7 = 8 400 €.

T: qcm
Q: Quel est le plafond de recettes du micro-BIC pour une location meublée de longue durée (2026-2028) ?
A: 15 000 €
B: 77 700 €
C: 83 600 €
D: 23 000 €
R: C
E: 83 600 € (77 700 € pour les revenus 2025).

T: nombre
Q: Appartement meublé acheté 200 000 €, terrain estimé à 15 % du prix. Quelle est la valeur du bâti amortissable ?
R: 170000
U: €
E: Le terrain n'est pas amortissable : 200 000 × 0,85 = 170 000 €.

T: qcm
Q: Recettes 8 000 €, charges 5 000 €, amortissements disponibles 4 000 €. Que devient l'amortissement ?
A: Il crée un déficit de 1 000 € imputable sur le salaire
B: 3 000 € sont déduits (résultat nul) et 1 000 € sont reportés sans limite de durée
C: Il est perdu au-delà de 3 000 €
D: Il est entièrement déduit l'année suivante
R: B
E: L'amortissement ne peut ni créer ni augmenter un déficit (article 39 C) : il ramène le résultat à zéro et la fraction non utilisée est reportée sans limite.

T: vf
Q: En LMNP, un déficit provenant des charges peut s'imputer sur les salaires du foyer.
R: F
E: Faux. Il ne s'impute que sur des bénéfices de location meublée non professionnelle de la même année ou des dix années suivantes.

T: qcm
Q: Dans quel délai et où déclarer le début d'une activité de location meublée ?
A: Dans l'année, au centre des impôts
B: Dans les quinze jours, sur le guichet unique des formalités d'entreprises (INPI)
C: Avant le 1er juillet, sur impots.gouv.fr
D: Aucune déclaration n'est nécessaire
R: B
E: Déclaration de début d'activité dans les quinze jours sur le guichet unique, qui attribue un numéro SIREN/SIRET.

T: qcm
Q: Un LMP vend son bien après plus de cinq ans d'activité. Ses recettes sont de 60 000 € par an. Quel régime de plus-value ?
A: Imposition totale au barème
B: Exonération totale (recettes inférieures à 90 000 €, article 151 septies)
C: Plus-value des particuliers
D: Exonération partielle
R: B
E: Exonération totale après cinq ans d'activité si les recettes sont inférieures à 90 000 € ; partielle entre 90 000 € et 126 000 €.
```

## Module 2.8

```exercices
T: nombre
Q: Loyers nus de 7 800 € par an au micro-foncier. Quelle est la base imposable ?
R: 5460
U: €
E: 7 800 × 0,70 = 5 460 €.

T: nombre
Q: Au réel foncier : taxe foncière 900 €, copropriété non récupérable 400 €, PNO 150 €, entretien 300 €, intérêts 3 500 €, assurance emprunteur 300 €, plus le forfait de 20 €. Quelle est la base imposable pour 7 800 € de loyers ?
R: 2230
U: €
E: Charges : 5 550 € + 20 € de forfait = 5 570 €. Base : 7 800 − 5 570 = 2 230 €.

T: nombre
L: suite
Q: Quel est l'impôt sur le revenu correspondant, dans la tranche à 30 % ?
R: 669
U: €
E: 2 230 × 30 % = 669 €, auxquels s'ajoutent 384 € de prélèvements sociaux (17,2 %).

T: nombre
Q: Loyers meublés de 9 000 € au micro-BIC, tranche à 30 %. Quel est le total impôt et prélèvements sociaux ?
R: 2187
U: €
E: Base : 9 000 × 50 % = 4 500 €. Imposition : 4 500 × (30 % + 18,6 %) = 2 187 €.

T: nombre
Q: LMNP au réel : loyers 9 000 €, charges 6 050 €, amortissements disponibles 4 964 €. Quel montant d'amortissement est reporté ?
R: 2014
U: €
E: Résultat avant amortissement : 9 000 − 6 050 = 2 950 €. On n'en déduit que 2 950 € (pas de déficit) ; il reste 4 964 − 2 950 = 2 014 € reportés.

T: qcm
L: suite
Q: Dans l'exemple du module, quel régime aboutit à l'imposition la plus faible ?
A: Micro-foncier
B: Réel foncier
C: Micro-BIC
D: LMNP au réel
R: D
E: Le LMNP au réel ramène l'imposition à 0 € grâce à l'amortissement.

T: qcm
Q: Quel régime permet d'imputer un déficit sur le revenu global ?
A: La location nue au réel
B: La location meublée au réel
C: Le micro-BIC
D: Aucun
R: A
E: Le déficit foncier (location nue) s'impute sur le revenu global jusqu'à 10 700 € (21 400 € en rénovation énergétique). Pas en meublé.

T: qcm
Q: Un bien nécessite de gros travaux. Quelle stratégie classique le module décrit-il ?
A: Le louer tout de suite en meublé
B: Le louer d'abord nu (déficit foncier), puis en meublé une fois le déficit consommé et la durée de trois ans respectée
C: Le laisser vacant pendant les travaux puis le vendre
D: Le louer en meublé de tourisme
R: B
E: C'est la stratégie décrite : déficit foncier d'abord, meublé ensuite, en respectant l'engagement de location nue.

T: multi
Q: Quels critères, absents du tableau fiscal, faut-il aussi comparer ?
A: La stabilité du locataire
B: La vacance et les frais de relocation
C: Les obligations administratives
D: Le coût de la réintégration des amortissements à la revente
E: La couleur des murs
R: A, B, C, D
E: Stabilité, vacance, récupération du logement, revente et obligations administratives font partie des critères non fiscaux.

T: vf
Q: Pour choisir un régime, il suffit de comparer l'imposition d'une seule année.
R: F
E: Faux. On compare les impositions sur plusieurs années, la gestion, la revente et la situation fiscale globale du foyer.
```

## Module 2.9

```exercices
T: qcm
Q: Au 1er janvier, un studio meublé est loué en meublé de tourisme (pas en résidence principale). Quelle taxe locale le propriétaire doit-il en plus de la taxe foncière ?
A: Aucune
B: La taxe d'habitation sur les résidences secondaires (THRS)
C: La taxe d'habitation sur la résidence principale
D: La taxe de balayage
R: B
E: La THRS subsiste pour les meublés non affectés à l'habitation principale au 1er janvier, au nom du propriétaire.

T: nombre
Q: Zone tendue, logement vide depuis plus d'un an au 1er janvier 2026, valeur locative de 3 000 €. Quel montant de taxe sur les logements vacants la première année ?
R: 510
U: €
E: 17 % de la valeur locative la première année : 0,17 × 3 000 = 510 € (34 % ensuite).

T: nombre
L: suite
Q: Même logement, toujours vide l'année suivante au taux de 34 %. Quel montant ?
R: 1020
U: €
E: 0,34 × 3 000 = 1 020 €.

T: nombre
Q: Un bailleur oublie de mettre à jour la déclaration d'occupation de trois logements dont les occupants ont changé. Quelle amende encourt-il ?
R: 450
U: €
E: 150 € par local : 3 × 150 = 450 €.

T: qcm
Q: Avant quelle date mettre à jour la déclaration d'occupation des biens après un changement de locataire ?
A: 1er janvier
B: 1er juillet
C: 31 décembre
D: 15 octobre
R: B
E: La déclaration n'est à refaire qu'en cas de changement, avant le 1er juillet.

T: qcm
Q: Un loueur commence une activité meublée en mars 2026. Avant quand doit-il déposer sa déclaration initiale de CFE ?
A: 15 jours après le début
B: 31 décembre 2026
C: 1er juillet 2027
D: Elle n'est pas nécessaire la première année
R: B
E: Déclaration initiale avant le 31 décembre de l'année de début ; paiement mi-décembre les années suivantes.

T: vf
Q: Un particulier qui loue un appartement nu doit pouvoir recevoir des factures électroniques depuis le 1er septembre 2026.
R: F
E: Faux. L'obligation vise les loueurs en meublé (LMNP, LMP) ; les bailleurs particuliers en location nue ne sont pas concernés.

T: qcm
Q: À partir de quel patrimoine immobilier net au 1er janvier faut-il déclarer l'IFI ?
A: 800 000 €
B: 1 million d'euros
C: 1,3 million d'euros
D: 2 millions d'euros
R: C
E: Au-delà de 1,3 million d'euros de patrimoine immobilier net, avec la déclaration de revenus.

T: qcm
Q: Pendant combien d'années une construction nouvelle bénéficie-t-elle en principe d'une exonération temporaire de taxe foncière ?
A: 1 an
B: 2 ans
C: 5 ans
D: 15 ans
R: B
E: Exonération temporaire de deux ans, que les communes peuvent réduire.

T: qcm
Q: À partir des impositions de 2027, jusqu'à quels taux une commune en zone tendue pourra-t-elle relever la taxe unique sur la vacance ?
A: 17 % puis 34 %
B: 30 % puis 60 %
C: 50 %
D: 100 %
R: B
E: Les taux de base restent 17 % puis 34 %, relevables jusqu'à 30 % puis 60 % ; ailleurs, le taux voté est plafonné à 50 %.
```

## Module 2.10

```exercices
T: nombre
Q: Revenus nets de 2 800 € par mois, sans autre crédit ; futur loyer de 600 €. Quelle mensualité maximale (assurance comprise) la banque acceptera-t-elle ?
R: 1127
U: €
E: Revenus retenus : 2 800 + 70 % × 600 = 3 220 €. Mensualité maximale : 3 220 × 35 % = 1 127 €.

T: nombre
L: suite
Q: Même situation, mais avec un crédit auto de 200 € par mois. Quelle mensualité reste disponible pour le prêt immobilier ?
R: 927
U: €
E: 1 127 − 200 = 927 €, assurance comprise.

T: qcm
Q: Quelle est la durée maximale d'un prêt immobilier selon les normes du HCSF, sans différé ?
A: 20 ans
B: 25 ans
C: 27 ans
D: 30 ans
R: B
E: 25 ans, portés à 27 ans lorsqu'un différé d'amortissement est justifié (neuf, travaux importants).

T: qcm
Q: Au 3e trimestre 2026, une banque propose un prêt à taux fixe sur 15 ans avec un TAEG de 4,70 %. Est-il possible ?
A: Oui
B: Non : il dépasse le taux d'usure de 4,57 % (10 à moins de 20 ans)
C: Oui, car le seuil est de 5,29 %
D: Oui, si l'emprunteur l'accepte
R: B
E: Le seuil des prêts à taux fixe de 10 à moins de 20 ans est de 4,57 % ; aucun prêt ne peut le dépasser.

T: qcm
L: suite
Q: Et un prêt à taux fixe sur 22 ans avec un TAEG de 5,10 % ?
A: Possible : sous le seuil de 5,29 % des prêts de 20 ans et plus
B: Impossible : au-dessus de 4,57 %
C: Impossible : au-dessus de 4,07 %
D: Possible seulement en taux variable
R: A
E: Pour 20 ans et plus, le seuil est de 5,29 % : 5,10 % est en dessous.

T: nombre
Q: Remboursement anticipé de 100 000 € de capital restant dû, prêt à 3,5 %. Quelle indemnité maximale la banque peut-elle exiger ?
R: 1750
U: €
E: Plafond légal : six mois d'intérêts (100 000 × 3,5 % / 2 = 1 750 €) sans dépasser 3 % du capital restant dû (3 000 €). Le plafond est ici de 1 750 €.

T: qcm
Q: Jusqu'à quel montant l'éco-prêt à taux zéro finance-t-il des travaux de rénovation énergétique ?
A: 15 000 €
B: 30 000 €
C: 50 000 €
D: 100 000 €
R: C
E: Jusqu'à 50 000 € sans intérêts, ouvert aux bailleurs pour un logement de plus de deux ans loué en résidence principale, distribué jusqu'au 31 décembre 2027.

T: vf
Q: Le prêt à taux zéro (PTZ) peut financer un investissement locatif.
R: F
E: Faux. Il est réservé à l'achat de la résidence principale par les primo-accédants.

T: qcm
Q: Dans quel cas aucun questionnaire de santé n'est-il demandé pour l'assurance emprunteur ?
A: Jamais
B: Part assurée d'au plus 200 000 € par personne et prêt terminé avant 60 ans
C: Emprunteur de moins de 40 ans
D: Prêt inférieur à 500 000 €
R: B
E: Pas de questionnaire si la part assurée n'excède pas 200 000 € par personne et que le prêt se termine avant 60 ans.

T: qcm
Q: Depuis la loi Lemoine, quand peut-on changer d'assurance emprunteur ?
A: Seulement à la date anniversaire
B: À tout moment, à garanties équivalentes
C: Uniquement la première année
D: Jamais
R: B
E: Depuis la loi du 28 février 2022, l'emprunteur peut changer d'assurance à tout moment, à garanties équivalentes.
```

## Module 2.11

```exercices
T: nombre
Q: Appartement ancien de 150 000 € dans un département au taux de 5 %. Quel est le montant des DMTO (taxe départementale, taxe communale et frais d'assiette) ?
R: 9477,75
U: €
P: 1
E: 5 % + 1,20 % + 2,37 % × 5 % (0,1185 %) = 6,3185 % ; 150 000 × 6,3185 % = 9 477,75 €.

T: qcm
Q: De combien de jours de rétractation dispose l'acquéreur non professionnel d'un logement après la notification de l'avant-contrat ?
A: 7 jours
B: 10 jours
C: 14 jours
D: 30 jours
R: B
E: Dix jours après la notification de l'avant-contrat (CCH, article L. 271-1).

T: qcm
Q: Quelle est la durée minimale légale de la condition suspensive d'obtention du prêt ?
A: 15 jours
B: 1 mois
C: 45 jours
D: 3 mois
R: B
E: Un mois au minimum ; en pratique, prévoyez 45 à 60 jours et des caractéristiques de prêt réalistes.

T: qcm
Q: VEFA : la vente doit être conclue dans l'année. Quel dépôt de garantie maximal pour le contrat de réservation ?
A: 2 %
B: 5 %
C: 10 %
D: Aucun
R: B
E: 5 % au plus si la vente doit être conclue dans l'année, 2 % entre un et deux ans, aucun au-delà.

T: nombre
Q: Appartement en VEFA à 250 000 €. Quelle somme maximale peut avoir été appelée à la mise hors d'eau ?
R: 175000
U: €
E: 70 % du prix à la mise hors d'eau : 0,70 × 250 000 = 175 000 €.

T: qcm
Q: Combien de temps dure la garantie biennale de bon fonctionnement ?
A: 1 an
B: 2 ans
C: 5 ans
D: 10 ans
R: B
E: Parfait achèvement : un an ; biennale : deux ans ; décennale : dix ans.

T: nombre
Q: L'acte de vente mentionne 50 m² Carrez pour 200 000 € ; la surface réelle est de 47 m². Quelle diminution de prix l'acquéreur peut-il obtenir ?
R: 12000
U: €
E: L'écart (6 %) dépasse 5 % : diminution proportionnelle, soit 200 000 × 3 / 50 = 12 000 €, à demander dans l'année qui suit l'acte.

T: vf
Q: Le mobilier vendu avec le bien, évalué de façon réaliste et listé à l'acte, n'est pas soumis aux DMTO.
R: V
E: Vrai. Il faut toutefois l'évaluer de façon réaliste : surévaluer le mobilier pour réduire les droits est un piège.

T: multi
Q: Quels documents demander avant d'acheter un lot de copropriété ?
A: Les trois derniers procès-verbaux d'assemblée générale
B: Le carnet d'entretien
C: Le plan pluriannuel de travaux
D: L'avis d'imposition du vendeur
E: La fiche synthétique de la copropriété
R: A, B, C, E
E: PV d'AG, règlement, carnet d'entretien, plan de travaux, DPE collectif, fiche synthétique, appels de charges, fonds de travaux… L'avis d'imposition du vendeur est sans intérêt.

T: qcm
Q: Quel est le taux de la contribution de sécurité immobilière ?
A: 0,10 %
B: 1,20 %
C: 2,37 %
D: 5 %
R: A
E: 0,10 % du prix ; elle s'ajoute aux DMTO, aux émoluments et aux débours.
```

## Module 2.12

```exercices
T: qcm
Q: Au moins combien de jours à l'avance l'assemblée générale doit-elle être convoquée ?
A: 8 jours
B: 15 jours
C: 21 jours
D: 30 jours
R: C
E: Convocation au moins 21 jours à l'avance.

T: qcm
Q: À quelle majorité désigne-t-on le syndic ?
A: Article 24
B: Article 25 (majorité des voix de tous les copropriétaires)
C: Article 26
D: Unanimité
R: B
E: La désignation ou la révocation du syndic relève de l'article 25.

T: qcm
Q: Un projet relevant de l'article 25 n'obtient pas la majorité mais recueille au moins le tiers des voix. Que se passe-t-il ?
A: Il est rejeté définitivement
B: Un nouveau vote peut avoir lieu immédiatement à la majorité de l'article 24 (passerelle)
C: Il passe à l'article 26
D: Il faut une nouvelle AG dans un an
R: B
E: C'est la « passerelle » : nouveau vote immédiat à l'article 24.

T: qcm
Q: À quelle majorité approuve-t-on les comptes et le budget ?
A: Article 24
B: Article 25
C: Article 26
D: Unanimité
R: A
E: Approbation des comptes et du budget, travaux d'entretien et travaux obligatoires : article 24.

T: qcm
Q: Dans une copropriété à clause d'habitation bourgeoise, à quelle majorité peut-on interdire les meublés de tourisme depuis la loi Le Meur ?
A: Article 24
B: Article 25
C: Deux tiers des voix (article 26)
D: Unanimité
R: C
E: L'interdiction peut être votée à la majorité de l'article 26 (deux tiers des voix) dans ces copropriétés.

T: nombre
Q: Budget prévisionnel de 60 000 €, sans plan pluriannuel adopté. Quelle cotisation annuelle minimale au fonds de travaux ?
R: 3000
U: €
E: Au moins 5 % du budget prévisionnel : 0,05 × 60 000 = 3 000 €.

T: nombre
Q: Un plan pluriannuel prévoit 400 000 € de travaux. Quelle cotisation annuelle minimale au fonds de travaux en découle ?
R: 10000
U: €
E: Au moins 2,5 % du montant des travaux prévus : 0,025 × 400 000 = 10 000 €.

T: vf
Q: À la vente du lot, le fonds de travaux attaché au lot est remboursé au vendeur.
R: F
E: Faux. Il reste attaché au lot et n'est pas remboursé au vendeur ; le prix peut en tenir compte.

T: nombre
Q: Quel est le coût maximal de l'état daté établi par le syndic lors d'une vente ?
R: 380
U: € TTC
E: Le coût de l'état daté est plafonné à 380 € TTC.

T: qcm
Q: Copropriété de 30 lots, permis de construire de 1985. Depuis quand le DPE collectif est-il obligatoire ?
A: 2024
B: 2025
C: 1er janvier 2026
D: Jamais, en dessous de 50 lots
R: C
E: Depuis le 1er janvier 2026 pour les copropriétés de moins de 50 lots dont le permis est antérieur au 1er janvier 2013.
```

## Module 2.13

```exercices
T: qcm
Q: Bail signé en mars 2022, avec une clause résolutoire à deux mois. Quel délai indiquer dans le commandement de payer ?
A: Six semaines, comme la loi de 2023
B: Deux mois, comme le prévoit le bail
C: Un mois
D: Huit jours
R: B
E: Pour un bail antérieur au 29 juillet 2023 qui prévoit deux mois, c'est ce délai (avis de la Cour de cassation du 13 juin 2024). Mentionner six semaines est un piège.

T: nombre
Q: Au moins combien de semaines avant l'audience l'assignation doit-elle être notifiée au préfet ?
R: 6
U: semaines
E: Au moins six semaines avant l'audience, pour permettre le diagnostic social et financier.

T: qcm
Q: Quels délais de paiement le juge peut-il accorder au locataire ?
A: 3 mois au plus
B: 1 an au plus
C: Jusqu'à 3 ans
D: Aucun
R: C
E: Jusqu'à trois ans, avec suspension de la clause résolutoire si le locataire a repris le paiement du loyer courant.

T: qcm
Q: Quel délai laisse le commandement de quitter les lieux ?
A: 8 jours
B: 1 mois
C: 2 mois
D: 6 mois
R: C
E: Deux mois ; le juge de l'exécution peut accorder des délais d'un mois à un an.

T: qcm
Q: Un jugement d'expulsion est définitif le 15 octobre 2026. L'expulsion peut-elle être exécutée le 10 décembre 2026 ?
A: Oui
B: Non : trêve hivernale du 1er novembre au 31 mars
C: Oui, avec l'accord du maire
D: Non, il faut attendre un an
R: B
E: Aucune expulsion pendant la trêve hivernale (1er novembre - 31 mars).

T: qcm
Q: Le préfet ne répond pas pendant deux mois à la demande de concours de la force publique. Conséquence ?
A: L'expulsion est annulée
B: L'État engage sa responsabilité et indemnise le bailleur
C: Le bailleur peut expulser lui-même
D: Il faut recommencer la procédure
R: B
E: Refus ou silence de deux mois : l'État engage sa responsabilité (demande préalable puis tribunal administratif).

T: qcm
Q: Un bailleur change les serrures pour forcer un locataire en impayé à partir. Qu'encourt-il ?
A: Rien, le locataire ne paie pas
B: Trois ans d'emprisonnement et 30 000 € d'amende
C: Une amende de 150 €
D: La perte de la dette
R: B
E: Article 226-4-2 du Code pénal : trois ans d'emprisonnement et 30 000 € d'amende.

T: qcm
Q: Par combien de temps se prescrit la dette de loyers ?
A: 1 an
B: 3 ans
C: 5 ans
D: 10 ans
R: B
E: Trois ans pour les loyers ; un jugement se prescrit par dix ans.

T: qcm
Q: Quel bailleur doit saisir la CCAPEX au moins deux mois avant d'assigner ?
A: Tout bailleur
B: Les bailleurs personnes morales, hors SCI familiales
C: Les seuls bailleurs sociaux
D: Aucun
R: B
E: La saisine préalable de la CCAPEX s'impose aux bailleurs personnes morales, hors SCI familiales.

T: nombre
Q: Jusqu'à quel montant la procédure simplifiée de recouvrement des petites créances est-elle possible ?
R: 5000
U: €
E: Jusqu'à 5 000 €, par commissaire de justice, avec l'accord du débiteur.
```

## Module 2.14

```exercices
T: nombre
Q: Un gestionnaire facture 8 % HT des sommes encaissées. Loyers encaissés dans l'année : 12 000 €. Quel est son honoraire HT ?
R: 960
U: € HT
E: 0,08 × 12 000 = 960 € HT, déductibles des revenus fonciers ou des recettes BIC.

T: nombre
Q: Une conciergerie prend 20 % de 18 000 € de revenus de courte durée. Combien coûte-t-elle ?
R: 3600
U: €
E: 0,20 × 18 000 = 3 600 € (les conciergeries prennent en général 15 à 25 %).

T: qcm
Q: Quelle carte professionnelle doit détenir un administrateur de biens qui gère votre location ?
A: Carte T
B: Carte G
C: Carte S
D: Aucune
R: B
E: La carte G (gestion), délivrée sous la loi Hoguet ; la carte T concerne la transaction, la carte S le syndic.

T: multi
Q: Que vérifier avant de confier la gestion à un professionnel ?
A: Sa carte G
B: Sa garantie financière
C: Son assurance de responsabilité civile professionnelle
D: Son nombre d'abonnés sur les réseaux sociaux
E: Le seuil d'autorisation préalable des travaux dans le mandat
R: A, B, C, E
E: Carte, garantie financière, assurance, mandat écrit (missions, honoraires, résiliation, reporting, seuil de travaux) : ce sont les points à contrôler.

T: qcm
Q: Combien de temps conserver les factures de travaux ?
A: 3 ans
B: 5 ans
C: Jusqu'à la revente et au moins 10 ans
D: 1 an
R: C
E: Jusqu'à la revente (calcul de la plus-value) et au moins dix ans (garantie décennale).

T: qcm
Q: Combien de temps conserver le bail, les états des lieux et les correspondances ?
A: Durée du bail
B: Durée du bail + 3 ans
C: 1 an après le départ
D: 30 ans
R: B
E: Durée du bail plus trois ans, délai de prescription.

T: qcm
Q: Un bailleur reporte un déficit foncier. Combien de temps garder les justificatifs fiscaux ?
A: 3 ans après l'année d'imposition
B: Jusqu'à l'épuisement du report, plus 3 ans
C: 1 an
D: Inutile de les garder
R: B
E: Au moins trois ans en principe, plus longtemps en cas de déficit reporté ou d'amortissements : jusqu'à l'épuisement du report plus trois ans.

T: vf
Q: Les honoraires de gestion locative sont déductibles des revenus fonciers ou des recettes BIC.
R: V
E: Vrai (CGI, article 31 pour les revenus fonciers).

T: qcm
Q: Combien la gestion autonome fait-elle économiser en moyenne ?
A: 1 à 2 % des loyers
B: 6 à 10 % des loyers
C: 25 % des loyers
D: Rien
R: B
E: Elle économise 6 à 10 % des loyers, au prix de disponibilité et de veille juridique.

T: qcm
Q: Lequel de ces pièges le module cite-t-il pour la gestion déléguée ?
A: Demander un compte rendu de gestion
B: Signer un mandat sans plafond d'engagement de travaux
C: Vérifier la garantie financière
D: Utiliser un compte bancaire dédié
R: B
E: Un mandat sans plafond d'engagement de travaux laisse le gestionnaire engager des dépenses sans votre accord.
```

## Examen de fin de niveau 2

```exercices
C: 1
T: nombre
Q: Calculez le loyer au 1er juillet 2025 : 900 € révisés avec l'IRL du 1er trimestre 2025 (145,47) au lieu de celui du 1er trimestre 2024 (143,46).
R: 912,61
U: €
P: 0,02
E: 900 × 145,47 / 143,46 = 912,61 €.

C: 1
T: nombre
Q: Calculez le loyer au 1er juillet 2026 avec l'IRL du 1er trimestre 2026 (146,60).
R: 919,7
U: €
P: 0,02
E: 912,61 × 146,60 / 145,47 = 919,70 €.

C: 1
T: nombre
Q: Provisions de 80 € par mois, charges récupérables réelles 2025 de 1 020 €. Quelle somme la régularisation fait-elle apparaître au profit du bailleur ?
R: 60
U: €
E: Provisions : 80 × 12 = 960 €. Complément : 1 020 − 960 = 60 €, réclamé avec le décompte détaillé transmis un mois avant.

C: 1
T: vf
Q: Si le logement avait été classé F, le bailleur aurait tout de même pu réviser le loyer en 2025 et 2026.
R: F
E: Faux. Aucune révision n'est possible pour un logement F ou G dont le bail a été conclu depuis le 24 août 2022.

C: 2
T: qcm
Q: Quel régime pour la première année de Julie ?
A: Micro-foncier
B: Location nue au régime réel, pour créer un déficit foncier
C: Micro-BIC
D: Meublé de tourisme
R: B
E: Les 35 000 € de travaux créent un déficit foncier au réel, en location nue.

C: 2
T: nombre
Q: Jusqu'à quel montant le déficit hors intérêts s'impute-t-il sur son revenu global ?
R: 21400
U: €
E: Les travaux font passer le logement de F à C et sont payés avant le 31 décembre 2027 : plafond doublé à 21 400 €, le solde étant reporté dix ans.

C: 2
T: qcm
Q: Le déficit est imputé en 2026. Jusqu'à quand Julie doit-elle louer nu ?
A: 31 décembre 2026
B: 31 décembre 2029
C: 31 décembre 2027
D: Elle peut passer en meublé dès 2027
R: B
E: Jusqu'au 31 décembre de la troisième année suivant l'imputation ; ensuite, le passage en meublé au réel peut être étudié.

C: 3
T: qcm
Q: Bail de mars 2022 avec clause résolutoire à deux mois. Quel délai viser dans le commandement de payer ?
A: Six semaines
B: Deux mois
C: Un mois
D: Quinze jours
R: B
E: Le bail est antérieur au 29 juillet 2023 et prévoit deux mois : c'est le délai à viser.

C: 3
T: nombre
Q: Dans combien de jours le commandement doit-il être signifié à la caution ?
R: 15
U: jours
E: Dans les quinze jours de sa signification au locataire.

C: 3
T: qcm
Q: Pendant quelle période l'expulsion ne pourra-t-elle pas être exécutée ?
A: Du 1er novembre 2026 au 31 mars 2027
B: Du 1er décembre 2026 au 28 février 2027
C: Du 1er juillet au 31 août 2026
D: Aucune
R: A
E: Trêve hivernale du 1er novembre au 31 mars ; anticipez une demande de concours de la force publique au printemps 2027.

C: 4
T: nombre
Q: Quels revenus mensuels la banque retient-elle pour le couple (4 200 € nets, loyer futur 800 €) ?
R: 4760
U: €
E: 4 200 + 70 % × 800 = 4 760 €.

C: 4
T: nombre
Q: Quelle charge mensuelle maximale de crédits à 35 % ?
R: 1666
U: €
E: 4 760 × 35 % = 1 666 €.

C: 4
T: nombre
Q: Combien reste-t-il pour la mensualité du nouveau prêt (crédit auto de 250 € en cours) ?
R: 1416
U: €
E: 1 666 − 250 = 1 416 €, assurance comprise ; solder le crédit auto augmenterait la capacité.
```

## Module 3.1

```exercices
T: qcm
Q: Dans quel ordre le module recommande-t-il de raisonner ?
A: Le bien, puis le marché, puis l'objectif
B: L'objectif et l'horizon, puis le marché, puis le bien
C: La fiscalité d'abord
D: Le prix au m² le plus bas d'abord
R: B
E: « Objectif et horizon d'abord, marché ensuite, bien en dernier. »

T: nombre
Q: Mensualités de crédit de 900 € et charges de 300 € par mois. Quelle épargne de précaution minimale constituer selon le module ?
R: 7200
U: €
E: Au moins six mois de mensualités et de charges : 6 × (900 + 300) = 7 200 €.

T: qcm
Q: Une division de logement peut-elle créer un lot de 12 m² ?
A: Oui, si la hauteur dépasse 2,20 m
B: Non : il est interdit de créer des logements de moins de 14 m² et 33 m³
C: Oui, en meublé
D: Oui, avec l'accord de la copropriété
R: B
E: La division ne peut créer de logements de moins de 14 m² et 33 m³ (CCH, article L. 111-6-1).

T: qcm
Q: Quel ordre de grandeur de rendement brut le module donne-t-il pour les villes moyennes dynamiques ?
A: Moins de 4 %
B: 6 à 9 %
C: 12 à 15 %
D: Plus de 20 %
R: B
E: Souvent 6 à 9 % bruts dans les villes moyennes dynamiques, contre souvent moins de 4 % dans les grandes métropoles.

T: multi
Q: Quelles caractéristiques de l'achat en nue-propriété le module cite-t-il ?
A: Achat décoté pour 15 à 20 ans
B: Pas de gestion ni d'impôt sur le revenu
C: Hors IFI
D: Des revenus élevés dès la première année
E: Aucun revenu pendant la durée du démembrement
R: A, B, C, E
E: La nue-propriété ne procure aucun revenu pendant la durée ; sa liquidité est faible.

T: qcm
Q: Quelle stratégie repose sur un bail commercial avec un exploitant (étudiants, seniors, tourisme) ?
A: La colocation meublée
B: La résidence services (LMNP géré)
C: Le parking
D: La nue-propriété
R: B
E: Aucune gestion et TVA récupérable dans le neuf, mais dépendance à l'exploitant et revente difficile.

T: qcm
Q: Un parking loué relève en principe…
A: de la loi de 1989 et des règles de décence
B: d'un bail civil, sans règle de décence
C: d'un bail mobilité
D: d'un bail commercial obligatoire
R: B
E: Les parkings, box et caves se louent sous bail civil, sans règle de décence.

T: qcm
Q: Quelle est la durée d'engagement de location du dispositif Jeanbrun ?
A: 3 ans
B: 6 ans
C: 9 ans
D: 15 ans
R: C
E: Neuf ans de location nue à loyer plafonné.

T: vf
Q: Un prix au m² bas est le signe d'une bonne affaire.
R: F
E: Faux. Confondre prix au m² bas et bonne affaire est l'un des pièges du module : il faut regarder la demande, la liquidité et le risque.

T: qcm
Q: Quelle question la grille de décision pose-t-elle sur la demande locative ?
A: Quel est le prix au m² ?
B: Combien de jours pour relouer un bien comparable ?
C: Quelle est la TMI du vendeur ?
D: Combien d'étages a l'immeuble ?
R: B
E: La demande se mesure au délai de relocation d'un bien comparable.
```

## Module 3.2

```exercices
T: nombre
Q: Loyers 12 000 €, charges non récupérables 3 000 €, vacance 600 €, impôts liés au bien 900 €, coût total 180 000 €. Quelle est la rentabilité nette-nette (en %, deux décimales) ?
R: 4,17
U: %
P: 0,01
E: (12 000 − 3 000 − 600 − 900) / 180 000 × 100 = 4,17 %.

T: nombre
Q: Loyers 12 000 €, charges 3 000 €, mensualités annuelles (capital, intérêts et assurance) 9 600 €, impôts 400 €. Quel est le cash-flow net-net annuel ?
R: -1000
U: €
E: 12 000 − 3 000 − 9 600 − 400 = −1 000 € par an.

T: nombre
Q: Sur la période : capital remboursé 90 000 €, plus-value nette de revente 30 000 €, efforts d'épargne cumulés 15 000 €. Quel est l'enrichissement ?
R: 105000
U: €
E: 90 000 + 30 000 − 15 000 = 105 000 €.

T: nombre
Q: Effet de levier (approximation) : rentabilité de l'actif 5 %, coût de la dette 3 %, dette 180 000 €, fonds propres 20 000 €. Quelle est la rentabilité des fonds propres (en %) ?
R: 23
U: %
E: rA + (rA − i) × D / FP = 5 + (5 − 3) × 180 000 / 20 000 = 5 + 18 = 23 %.

T: qcm
Q: Un investisseur apporte 20 000 € et récupère 22 000 € un an plus tard. Quel est son TRI ?
A: 2 %
B: 10 %
C: 20 %
D: 22 %
R: B
E: Le TRI annule la VAN : −20 000 + 22 000 / (1 + k) = 0 donne k = 10 %.

T: qcm
L: suite
Q: Dans le cas d'étude de la colocation, quel est le TRI si le projet est payé comptant, sans crédit ?
A: Environ 11,9 %
B: Environ 4,1 %
C: Environ 9,6 %
D: Environ 0 %
R: B
E: Environ 4,1 % comptant contre 11,9 % avec crédit : c'est l'effet de levier.

T: qcm
Q: Dans le tableau de sensibilité, quelle variation dégrade le plus le TRI ?
A: Vacance de 10 %
B: Taux du crédit à 4,20 %
C: Prix de revente en baisse de 1 % par an
D: Prix de revente stable
R: C
E: Baisse de 1 % par an du prix : TRI de 7,9 % ; vacance de 10 % : 9,6 % ; taux à 4,20 % : 9,4 % ; prix stable : 10,0 %.

T: nombre
Q: Dans le cas d'étude, les loyers de 16 200 € la première année progressent de 1 % par an. Quels loyers en deuxième année ?
R: 16362
U: €
E: 16 200 × 1,01 = 16 362 €. Les hypothèses d'évolution (loyers +1 %, charges +2 %, prix +1 %) sont celles du cas d'étude.

T: vf
Q: Les résultats du cas d'étude (TRI de 11,9 %) sont une promesse de rendement.
R: F
E: Faux. Ils reposent sur des hypothèses simplificatrices et illustrent une méthode ; le levier amplifie aussi les pertes.

T: multi
Q: Quels pièges le module cite-t-il ?
A: Juger un projet sur sa seule rentabilité brute
B: Oublier la fiscalité de sortie
C: Retenir des hypothèses de valorisation optimistes
D: Tester plusieurs scénarios de sensibilité
E: Ignorer la hausse des charges
R: A, B, C, E
E: Tester la sensibilité est au contraire la bonne pratique recommandée.
```

## Module 3.3

```exercices
T: qcm
Q: Deux indivisaires détenant ensemble 70 % des droits veulent conclure un bail d'habitation. Le peuvent-ils sans le troisième ?
A: Non, l'unanimité est requise
B: Oui : les actes d'administration exigent une majorité des deux tiers des droits indivis
C: Oui, un seul indivisaire suffit
D: Seulement avec l'accord du juge
R: B
E: Conclure un bail d'habitation est un acte d'administration : majorité des deux tiers des droits indivis.

T: qcm
Q: Une SCI à l'IR tire 15 % de ses recettes de location meublée. Conséquence ?
A: Aucune
B: Elle devient passible de l'impôt sur les sociétés (recettes commerciales supérieures à 10 %)
C: Elle devient LMP
D: Elle doit être dissoute
R: B
E: Au-delà d'une activité accessoire (plus de 10 % des recettes), la SCI devient passible de l'IS.

T: nombre
Q: Une SCI à l'IS réalise un bénéfice de 60 000 € et remplit les conditions du taux réduit. Quel est l'impôt sur les sociétés ?
R: 10750
U: €
E: 15 % × 42 500 = 6 375 € ; 25 % × 17 500 = 4 375 € ; total 10 750 €.

T: nombre
Q: La SCI à l'IS distribue 10 000 € de dividendes, imposés au prélèvement forfaitaire unique de 2026. Combien d'impôt et de prélèvements ?
R: 3140
U: €
E: PFU de 31,4 % (12,8 % + 18,6 %) : 3 140 €.

T: qcm
Q: Jusqu'à quand l'option pour l'IS d'une SCI est-elle révocable ?
A: Jamais
B: Jusqu'à la fin du cinquième exercice, puis définitive
C: À tout moment
D: Pendant un an
R: B
E: Révocable jusqu'à la fin du cinquième exercice, puis définitive.

T: qcm
Q: Quel véhicule permet d'exercer la location meublée à plusieurs membres d'une famille en conservant le régime LMNP au niveau de chacun ?
A: La SCI à l'IR
B: La SARL de famille à l'IR
C: L'indivision
D: La SCPI
R: B
E: La SARL de famille (article 239 bis AA du CGI) peut opter pour l'IR.

T: nombre
Q: Une société à l'IS perçoit 20 000 € de loyers de locaux achevés depuis plus de quinze ans. Quelle contribution sur les revenus locatifs peut-elle devoir ?
R: 500
U: €
E: 2,5 % des loyers : 0,025 × 20 000 = 500 €.

T: qcm
Q: Comment se calcule la plus-value de cession d'un bien détenu par une SCI à l'IS ?
A: Comme celle d'un particulier, avec abattements
B: Sur la valeur nette comptable (prix diminué des amortissements), sans abattement pour durée de détention
C: Elle est exonérée après 22 ans
D: Elle n'est pas imposée
R: B
E: Plus-value professionnelle calculée sur la valeur nette comptable et taxée à l'IS : pénalisant pour une revente.

T: vf
Q: Les associés d'une SCI répondent des dettes sociales dans la limite de leurs apports.
R: F
E: Faux. Ils en répondent indéfiniment, à proportion de leurs parts.

T: qcm
Q: Quelle durée maximale une convention d'indivision à durée déterminée peut-elle avoir ?
A: 1 an
B: 5 ans, renouvelable
C: 10 ans
D: 99 ans
R: B
E: Cinq ans au plus, renouvelable ; elle peut aussi être à durée indéterminée.
```

## Module 3.4

```exercices
T: nombre
Q: Jeanbrun neuf : appartement acheté 250 000 € hors frais, location intermédiaire. Quelle déduction annuelle ?
R: 7000
U: €
E: Base : 80 % × 250 000 = 200 000 €. Taux intermédiaire neuf : 3,5 %, soit 7 000 € par an (sous le plafond de 8 000 €).

T: nombre
L: suite
Q: Même appartement en location sociale (seul logement Jeanbrun du foyer). Quelle déduction annuelle ?
R: 9000
U: €
E: 4,5 % × 200 000 = 9 000 €. Plus de 50 % des loyers concernés relèvent du social : le plafond est de 10 000 €, la déduction est donc entière.

T: nombre
Q: Jeanbrun ancien : bien acheté 180 000 € avec 60 000 € de travaux conduisant à la classe B, location intermédiaire. Quelle déduction annuelle ?
R: 5760
U: €
E: Travaux ≥ 30 % du prix (60 000 ≥ 54 000). Base : 80 % × (180 000 + 60 000) = 192 000 €. Taux ancien intermédiaire : 3 %, soit 5 760 €.

T: qcm
Q: Une maison individuelle neuve peut-elle bénéficier du dispositif Jeanbrun (loi de finances pour 2026) ?
A: Oui
B: Non : le logement doit être situé dans un bâtiment d'habitation collectif
C: Oui, en zone tendue
D: Oui, si elle est classée A
R: B
E: Le texte en vigueur exige un bâtiment d'habitation collectif ; l'ouverture aux maisons n'est qu'un projet de loi.

T: nombre
Q: Denormandie : prix de revient de 200 000 € (60 m²), engagement de location de 9 ans. Quelle réduction d'impôt totale ?
R: 36000
U: €
E: 18 % pour 9 ans ; le prix de revient respecte les plafonds (300 000 € et 5 500 € × 60 = 330 000 €) : 0,18 × 200 000 = 36 000 €.

T: nombre
Q: Loc'Avantages, convention Loc2 sans intermédiation locative, loyers bruts annuels de 7 200 €. Quelle réduction d'impôt annuelle ?
R: 2520
U: €
E: 35 % des loyers bruts en Loc2 (40 % avec intermédiation) : 0,35 × 7 200 = 2 520 €.

T: nombre
Q: Malraux : 100 000 € de travaux dans un site patrimonial remarquable doté d'un plan de sauvegarde et de mise en valeur approuvé. Quelle réduction d'impôt ?
R: 30000
U: €
E: 30 % des travaux (22 % sous plan de valorisation) : 30 000 €.

T: multi
Q: Lesquels entrent dans le plafonnement global de 10 000 € par an ?
A: Denormandie
B: Loc'Avantages
C: Pinel (engagements en cours)
D: Malraux
E: Déduction Jeanbrun
R: A, B, C
E: Malraux, monuments historiques, déficit foncier et déduction Jeanbrun n'entrent pas dans le plafond.

T: qcm
Q: Le propriétaire Jeanbrun rompt son engagement en cinquième année, sans invalidité, licenciement ni décès. Conséquence ?
A: Aucune
B: Les amortissements déduits sont réintégrés au revenu foncier de l'année
C: Une amende de 10 000 €
D: La perte du bien
R: B
E: Les amortissements déduits sont réintégrés (avec un système de quotient).

T: vf
Q: Un investisseur peut encore acquérir en 2026 un logement neuf sous le dispositif Pinel.
R: F
E: Faux. Le Pinel est fermé aux nouveaux investissements depuis le 1er janvier 2025 ; seuls les engagements en cours continuent.
```

## Module 3.5

```exercices
T: nombre
Q: Appartement acheté 120 000 €, détenu 13 années pleines, revendu 200 000 € sans frais de cession. Avec les forfaits de 7,5 % et 15 %, quelle est la plus-value brute ?
R: 53000
U: €
E: Prix d'acquisition majoré : 120 000 + 9 000 + 18 000 = 147 000 €. Plus-value brute : 200 000 − 147 000 = 53 000 €.

T: nombre
L: suite
Q: Quel abattement pour l'impôt sur le revenu (en %) après 13 années pleines ?
R: 48
U: %
E: De la 6e à la 13e année : 8 années × 6 % = 48 %.

T: nombre
L: suite
Q: Quel est l'impôt sur le revenu dû (19 %) sur cette plus-value de 53 000 € ?
R: 5236,4
U: €
P: 1
E: Base : 53 000 × (1 − 0,48) = 27 560 €. Impôt : 27 560 × 19 % = 5 236,40 €.

T: nombre
L: suite
Q: Quels prélèvements sociaux (17,2 %) sont dus, avec un abattement de 8 × 1,65 % ?
R: 7912,69
U: €
P: 1
E: Abattement de 13,2 % : base 46 004 €. Prélèvements : 46 004 × 17,2 % = 7 912,69 €.

T: nombre
L: suite
Q: Même bien, mais loué en LMNP (hors résidence services) avec 30 000 € d'amortissements déduits, cédé après le 15 février 2025. Quelle est la plus-value brute ?
R: 83000
U: €
E: Les amortissements minorent le prix d'acquisition majoré : 147 000 − 30 000 = 117 000 €. Plus-value : 200 000 − 117 000 = 83 000 €.

T: qcm
Q: Au bout de combien d'années de détention la plus-value est-elle exonérée d'impôt sur le revenu ?
A: 15 ans
B: Au-delà de 22 ans
C: Au-delà de 30 ans
D: Jamais
R: B
E: Exonération d'IR au-delà de 22 ans ; de prélèvements sociaux au-delà de 30 ans.

T: nombre
Q: Quel abattement pour les prélèvements sociaux (en %) après 25 années pleines ?
R: 55
U: %
E: 16 années × 1,65 % (6e à 21e) = 26,4 % ; 22e année : 1,60 % ; 23e à 25e : 3 × 9 % = 27 %. Total : 55 %.

T: qcm
Q: Un bien détenu 4 ans : peut-on appliquer le forfait travaux de 15 % ?
A: Oui, toujours
B: Non : le forfait de 15 % n'est possible qu'après 5 ans de détention
C: Oui, si les travaux sont justifiés
D: Oui, à 7,5 %
R: B
E: Le forfait travaux de 15 % s'applique après cinq ans de détention ; avant, seuls les travaux réels non déduits comptent.

T: qcm
Q: À partir de quel montant de plus-value nette imposable à l'IR une surtaxe s'applique-t-elle ?
A: 15 000 €
B: 50 000 €
C: 100 000 €
D: 260 000 €
R: B
E: Surtaxe de 2 à 6 % au-delà de 50 000 € (hors terrains à bâtir).

T: vf
Q: En location nue, des travaux déjà déduits des revenus fonciers peuvent aussi majorer le prix d'acquisition.
R: F
E: Faux. Seuls les travaux non déduits peuvent majorer le prix : c'est un piège cité par le module.
```

## Module 3.6

```exercices
T: nombre
Q: Patrimoine immobilier net taxable de 1 500 000 €. Quel est l'IFI dû ?
R: 3900
U: €
E: 0,50 % × 500 000 = 2 500 € ; 0,70 % × 200 000 = 1 400 € ; total 3 900 €. Pas de décote au-delà de 1 400 000 €.

T: nombre
Q: Patrimoine net taxable de 1 350 000 €. Quel est l'IFI avant décote ?
R: 2850
U: €
E: 0,50 % × 500 000 = 2 500 € ; 0,70 % × 50 000 = 350 € ; total 2 850 €.

T: nombre
Q: Quelle est la décote pour ce patrimoine de 1 350 000 € ?
R: 625
U: €
E: 17 500 − 1,25 % × 1 350 000 = 17 500 − 16 875 = 625 €, soit un IFI de 2 225 €.

T: nombre
Q: La résidence principale vaut 1 000 000 €. Pour quelle valeur entre-t-elle dans l'assiette de l'IFI (sans dette) ?
R: 700000
U: €
E: Abattement de 30 % sur la résidence principale : 700 000 €.

T: nombre
Q: Un redevable fait 2 000 € de dons à un organisme éligible. Quelle réduction d'IFI obtient-il ?
R: 1500
U: €
E: 75 % des dons, dans la limite de 50 000 € : 1 500 €.

T: multi
Q: Que comprend l'assiette de l'IFI ?
A: Les biens immobiliers détenus directement
B: Les parts de SCI, pour leur fraction immobilière
C: La fraction immobilière des SCPI
D: Les comptes courants bancaires
E: Les biens loués en LMNP
R: A, B, C, E
E: Biens détenus directement et indirectement (SCI, SCPI, OPCI, certaines unités de compte). Les liquidités n'y entrent pas ; les biens LMNP y entrent.

T: qcm
Q: Comment un LMP remplissant les conditions traite-t-il ses locations meublées à l'IFI ?
A: Il les déclare pour leur valeur totale
B: Elles peuvent être exonérées au titre des biens professionnels
C: Il applique un abattement de 30 %
D: Il les déclare pour moitié
R: B
E: Les biens professionnels sont exonérés, dont les locations meublées d'un LMP remplissant les conditions.

T: qcm
Q: En cas de démembrement, qui déclare en principe le bien à l'IFI ?
A: Le nu-propriétaire
B: L'usufruitier, pour la valeur en pleine propriété
C: Les deux, pour moitié
D: Personne
R: B
E: L'usufruitier est en principe imposé sur la valeur en pleine propriété.

T: qcm
Q: Quel plafonnement limite l'IFI ?
A: L'IFI ne peut dépasser 10 000 €
B: IFI, impôt sur le revenu et prélèvements sociaux ne peuvent excéder 75 % des revenus de l'année précédente
C: L'IFI ne peut dépasser 1 % du patrimoine
D: Aucun
R: B
E: Plafonnement à 75 % des revenus de l'année précédente.

T: vf
Q: La transformation de l'IFI en « impôt sur la fortune improductive » s'applique en 2026.
R: F
E: Faux. Elle n'a pas été retenue dans la loi de finances promulguée : le régime est inchangé en 2026.
```

## Module 3.7

```exercices
T: nombre
Q: Un parent de 58 ans donne à son enfant la nue-propriété d'un appartement de 400 000 €. Quelle est la valeur taxable de la nue-propriété ?
R: 200000
U: €
E: Usufruitier de 51 à 60 ans : nue-propriété à 50 %, soit 200 000 €.

T: nombre
L: suite
Q: Après l'abattement de 100 000 €, quels droits de donation sont dus sur ces 200 000 € (barème en ligne directe) ?
R: 18194,35
U: €
P: 1
E: Base 100 000 € : 5 % × 8 072 = 403,60 ; 10 % × 4 037 = 403,70 ; 15 % × 3 823 = 573,45 ; 20 % × 84 068 = 16 813,60 ; total 18 194,35 €.

T: qcm
Q: Un parent a trois enfants. Quelle part de son patrimoine leur est réservée ?
A: La moitié
B: Les deux tiers
C: Les trois quarts
D: La totalité
R: C
E: La moitié avec un enfant, les deux tiers avec deux, les trois quarts à partir de trois ; le reste est la quotité disponible.

T: nombre
Q: Quelle est la valeur fiscale d'un usufruit temporaire de 20 ans, en % de la pleine propriété ?
R: 46
U: %
E: 23 % par période de dix ans, sans fraction : 2 × 23 % = 46 %.

T: qcm
Q: Tous les combien de temps l'abattement de 100 000 € par parent et par enfant se reconstitue-t-il ?
A: 6 ans
B: 10 ans
C: 15 ans
D: Jamais
R: C
E: Tous les quinze ans ; les donations de moins de quinze ans sont rappelées au décès.

T: nombre
Q: Quel abattement s'applique à une donation d'un grand-parent à un petit-enfant ?
R: 31865
U: €
E: 31 865 € par grand-parent et par petit-enfant.

T: qcm
Q: Au décès de l'usufruitier (usufruit viager), que doit payer le nu-propriétaire pour devenir plein propriétaire ?
A: Des droits sur la valeur de l'usufruit
B: Rien : la pleine propriété se reconstitue sans droits supplémentaires
C: 20 % de la valeur du bien
D: Les frais de notaire d'une vente
R: B
E: La nue-propriété redevient pleine propriété à l'extinction de l'usufruit viager, sans droits supplémentaires.

T: qcm
Q: L'usufruitier d'un local veut signer seul un bail commercial. Le peut-il ?
A: Oui
B: Non : un bail commercial exige l'accord du nu-propriétaire (article 595 du Code civil)
C: Oui, pour moins de neuf ans
D: Seulement avec l'accord du syndic
R: B
E: L'usufruitier peut consentir seul un bail d'habitation, mais pas un bail de plus de neuf ans ni un bail commercial.

T: qcm
Q: En démembrement, qui paie les grosses réparations de l'article 606, sauf convention contraire ?
A: L'usufruitier
B: Le nu-propriétaire
C: Le locataire
D: À parts égales
R: B
E: L'usufruitier paie la taxe foncière et l'entretien ; le nu-propriétaire assume les grosses réparations.

T: qcm
Q: Jusqu'à quand les dons d'argent affectés à l'achat d'un logement neuf loué nu cinq ans sont-ils exonérés (dans la limite de 100 000 € par donateur) ?
A: 31 décembre 2025
B: 31 décembre 2026
C: 31 décembre 2027
D: Sans limite
R: B
E: Jusqu'au 31 décembre 2026 (article 790 A bis du CGI), dans la limite de 100 000 € par donateur et 300 000 € par donataire.
```

## Module 3.8

```exercices
T: qcm
Q: Combien de jours par an peut-on louer sa résidence principale en meublé de tourisme, au plus ?
A: 90 jours, toujours
B: 120 jours, que la commune peut abaisser à 90 jours
C: 180 jours
D: Sans limite
R: B
E: 120 jours par an, que la commune peut abaisser à 90 jours ; pas d'autorisation de changement d'usage.

T: qcm
Q: Dans une ville de plus de 200 000 habitants, un propriétaire veut louer toute l'année en courte durée sa résidence secondaire. Que lui faut-il ?
A: Rien de plus que l'enregistrement
B: Une autorisation préalable de changement d'usage du maire
C: Un bail mobilité
D: L'accord de la CAF
R: B
E: La location répétée de courte durée d'un logement qui n'est pas la résidence principale exige une autorisation de changement d'usage dans ces communes.

T: qcm
Q: Quelle classe DPE faut-il pour obtenir une nouvelle autorisation de changement d'usage ?
A: A à G
B: A à E
C: A à D
D: A ou B
R: B
E: Une nouvelle autorisation exige un DPE de A à E ; en 2034, tous les meublés de tourisme hors résidence principale devront être classés de A à D.

T: nombre
Q: Quelle amende civile maximale encourt un loueur qui ne fait pas enregistrer son meublé de tourisme ?
R: 10000
U: €
E: Jusqu'à 10 000 € ; jusqu'à 20 000 € en cas de fausse déclaration ou de faux numéro.

T: nombre
Q: Un studio se loue 150 € la nuit avec 60 % d'occupation sur 365 jours. Quelles recettes brutes annuelles ?
R: 32850
U: €
E: 365 × 60 % = 219 nuits ; 219 × 150 = 32 850 €.

T: nombre
Q: Meublé de tourisme non classé au micro-BIC : 14 000 € de recettes. Quel résultat imposable ?
R: 9800
U: €
E: Abattement de 30 % seulement : 14 000 × 0,70 = 9 800 €.

T: qcm
Q: Combien de temps vaut le classement d'un meublé de tourisme ?
A: 1 an
B: 3 ans
C: 5 ans
D: 10 ans
R: C
E: Le classement, délivré après visite d'un organisme accrédité, vaut cinq ans.

T: qcm
Q: Depuis le 20 mai 2026, sur quel téléservice déclare-t-on un meublé de tourisme ?
A: Le guichet unique de l'INPI
B: Déclaloc, qui délivre un numéro à 13 caractères
C: impots.gouv.fr
D: La CAF
R: B
E: Décret n° 2026-196 du 19 mars 2026 : téléservice national Déclaloc, numéro d'enregistrement à 13 caractères.

T: qcm
Q: À partir de quel montant de recettes un loueur de meublé de tourisme est-il affilié à la sécurité sociale des indépendants ?
A: 15 000 €
B: 23 000 €
C: 77 700 €
D: 83 600 €
R: B
E: Au-delà de 23 000 € de recettes, même s'il n'est pas LMP.

T: multi
Q: Quelles vérifications faire avant d'acheter pour louer en meublé de tourisme ?
A: Les règles de changement d'usage de la commune
B: Le règlement de copropriété
C: Le DPE du logement
D: Les quotas éventuels de la commune
E: Le taux de l'IRL
R: A, B, C, D
E: Commune (changement d'usage, quotas, zonage), copropriété et DPE conditionnent le projet ; l'IRL concerne la location de longue durée.
```

## Module 3.9

```exercices
T: qcm
Q: Dans une maison non isolée, quelle paroi représente la plus grande part des déperditions ?
A: Les fenêtres
B: La toiture (25 à 30 %)
C: Les planchers bas
D: Les ponts thermiques
R: B
E: Toiture 25 à 30 %, murs 20 à 25 %, air et fuites 20 à 25 %, fenêtres 10 à 15 %, planchers bas 7 à 10 %, ponts thermiques 5 à 10 %.

T: qcm
Q: Dans quel ordre mener les travaux ?
A: Changer le chauffage, puis isoler
B: Isoler, traiter la ventilation, puis changer le chauffage et installer la régulation
C: Commencer par la régulation
D: L'ordre est indifférent
R: B
E: Isoler d'abord, ventiler, puis chauffer et réguler ; changer le chauffage avant d'isoler est un piège.

T: qcm
Q: Une maison classée E est mise en vente en 2026. L'audit énergétique réglementaire est-il obligatoire ?
A: Non, seulement pour F et G
B: Oui, depuis le 1er janvier 2025 pour la classe E
C: Non, seulement à partir de 2034
D: Oui, pour tout logement
R: B
E: Audit obligatoire pour les maisons et immeubles en monopropriété F ou G (2023), E (2025), D (2034) ; pas pour un lot de copropriété.

T: vf
Q: Depuis le 1er septembre 2026, l'isolation des combles seule reste finançable par MaPrimeRénov' par geste.
R: F
E: Faux. L'aide par geste est réservée aux pompes à chaleur air-eau ou géothermiques, au raccordement à un réseau de chaleur et à la dépose des cuves à fioul ; l'isolation n'est plus financée que dans une rénovation d'ampleur.

T: qcm
Q: Quelle condition est exigée pour la plupart des aides à la rénovation ?
A: Des travaux réalisés par des professionnels labellisés RGE
B: Un bail commercial
C: Un logement de moins de dix ans
D: Aucune
R: A
E: Pour être éligibles, les travaux doivent en général être réalisés par des professionnels RGE, avec une demande préalable.

T: qcm
Q: Quel gain énergétique minimal exige MaPrimeRénov' Copropriété ?
A: 15 %
B: 35 %
C: 50 %
D: 70 %
R: B
E: Une rénovation d'au moins 35 % de gain énergétique, avec des bonus.

T: qcm
Q: Pourquoi générer l'attestation de l'ADEME avant des travaux sur un logement chauffé à l'électricité ?
A: Elle est obligatoire pour louer
B: Le coefficient de 1,9 (1,7 pour les DPE de 2027) peut faire gagner une classe sans travaux
C: Elle donne droit à une prime
D: Elle remplace l'état des risques
R: B
E: La baisse du coefficient de l'électricité peut suffire à changer de classe : la vérifier avant d'engager des travaux.

T: qcm
Q: À partir de quand la régulation de chauffage (thermostat programmable) sera-t-elle obligatoire dans les logements existants ?
A: 1er janvier 2026
B: 1er janvier 2028
C: 1er janvier 2030
D: 1er janvier 2034
R: C
E: Obligation reportée au 1er janvier 2030 (décret n° 2025-1343).

T: qcm
Q: Après des travaux faisant passer un logement loué de F à D, que devient le loyer ?
A: Il reste gelé définitivement
B: La révision redevient possible, et une clause de travaux avec majoration peut avoir été convenue
C: Il doit baisser
D: Il est fixé par le préfet
R: B
E: Après travaux, la révision redevient possible si le logement quitte les classes F et G.

T: vf
Q: Un bailleur peut compter sur le projet de loi relance logement pour relouer dès maintenant un logement G.
R: F
E: Faux. Ce n'est pas le droit en vigueur ; y compter est un piège cité par le module.
```

## Module 3.10

```exercices
T: qcm
Q: Dans quel délai la commission départementale de conciliation rend-elle son avis ?
A: 15 jours
B: 2 mois
C: 6 mois
D: 1 an
R: B
E: La CDC, paritaire et gratuite, rend un avis dans les deux mois.

T: qcm
Q: Un bailleur réclame 3 500 € de réparations locatives. Doit-il tenter une solution amiable avant de saisir le tribunal ?
A: Non, jamais
B: Oui, en principe : conciliation, médiation ou procédure participative sont obligatoires jusqu'à 5 000 €
C: Seulement au-delà de 10 000 €
D: Oui, mais seulement devant la CAF
R: B
E: Article 750-1 du Code de procédure civile, sauf exceptions (urgence, motif légitime).

T: qcm
Q: Un jugement du juge des contentieux de la protection porte sur 4 000 €. Peut-on faire appel ?
A: Oui, dans le mois
B: Non : jusqu'à 5 000 €, il est rendu en dernier ressort (seulement un pourvoi en cassation)
C: Oui, dans les deux mois
D: Oui, devant la CDC
R: B
E: Les demandes jusqu'à 5 000 € sont jugées en dernier ressort.

T: qcm
Q: Face à un squat, sous quel délai le préfet statue-t-il sur la demande de mise en demeure ?
A: 24 heures
B: 48 heures
C: 8 jours
D: 2 mois
R: B
E: Le préfet statue sous 48 heures ; le délai laissé aux occupants est d'au moins 24 heures.

T: vf
Q: La trêve hivernale protège les squatteurs d'un logement.
R: F
E: Faux. La trêve hivernale ne s'applique pas à la procédure administrative contre le squat.

T: qcm
Q: Quelle peine punit la violation de domicile ?
A: 1 an et 15 000 €
B: 3 ans et 45 000 €
C: 5 ans et 75 000 €
D: Une amende de 3 750 €
R: B
E: Article 226-4 du Code pénal : trois ans d'emprisonnement et 45 000 € d'amende.

T: qcm
Q: Dans quel délai contester un complément de loyer ?
A: 1 mois après la signature
B: 3 mois après la signature du bail
C: 1 an
D: 3 ans
R: B
E: Trois mois après la signature, devant la CDC puis le juge.

T: qcm
Q: Quelle est la prescription des actions dérivant d'un bail d'habitation (loyers, charges, dépôt de garantie) ?
A: 1 an
B: 3 ans
C: 5 ans
D: 10 ans
R: B
E: Trois ans (article 7-1 de la loi de 1989).

T: nombre
Q: Quel droit de timbre est dû depuis 2026 pour la plupart des instances civiles ?
R: 50
U: €
E: 50 €, sauf injonction de payer et bénéficiaires de l'aide juridictionnelle.

T: qcm
Q: Qui peut-on saisir en cas de discrimination au logement ?
A: Le syndic
B: Le Défenseur des droits
C: La CAF
D: Le notaire
R: B
E: Le Défenseur des droits peut être saisi ; les testings sont admis comme preuve.
```

## Module 3.11

```exercices
T: qcm
Q: Quelle est la durée minimale d'un bail commercial ?
A: 3 ans
B: 6 ans
C: 9 ans
D: 12 ans
R: C
E: Au moins 9 ans, avec une faculté de congé triennale pour le locataire (« 3-6-9 »).

T: qcm
Q: Avec quel préavis le locataire commercial donne-t-il congé à la fin d'une période triennale ?
A: 1 mois
B: 3 mois
C: 6 mois
D: 1 an
R: C
E: Six mois de préavis, par lettre recommandée ou acte de commissaire de justice.

T: qcm
Q: Le bailleur refuse le renouvellement d'un bail commercial sans motif grave et légitime. Que doit-il ?
A: Rien
B: Une indemnité d'éviction
C: Trois mois de loyer
D: Le remboursement du dépôt
R: B
E: Le locataire a droit au renouvellement ; le refus oblige à verser une indemnité d'éviction, sauf motif grave et légitime.

T: vf
Q: Un bail commercial peut mettre les grosses réparations de l'article 606 à la charge du locataire.
R: F
E: Faux. Elles ne peuvent pas être imputées au locataire, pas plus que les travaux liés à la vétusté.

T: qcm
Q: Un bail dérogatoire a duré trois ans ; le locataire reste en place plus d'un mois au-delà. Conséquence ?
A: Rien
B: Il bénéficie d'un bail commercial de neuf ans
C: Il doit partir immédiatement
D: Un nouveau bail dérogatoire commence
R: B
E: Au-delà de trois ans, le locataire maintenu plus d'un mois bénéficie d'un bail commercial de neuf ans.

T: qcm
Q: Quelle est la durée minimale d'un bail professionnel ?
A: 3 ans
B: 6 ans
C: 9 ans
D: Libre
R: B
E: Au moins six ans ; le locataire peut partir à tout moment avec six mois de préavis.

T: qcm
Q: Une place de parking est louée avec l'appartement, comme accessoire du logement. Quel régime s'applique ?
A: Le Code civil, librement
B: Le bail d'habitation, qu'elle suit
C: Le bail commercial
D: Le bail professionnel
R: B
E: L'emplacement accessoire d'un logement loué suit le bail d'habitation ; seul, il relève du Code civil.

T: qcm
Q: Le loyer de renouvellement d'un bail commercial est déplafonné. Comment s'appliquent les hausses ?
A: En une fois
B: Avec un lissage de 10 % par an
C: Par tiers sur trois ans
D: Elles sont interdites
R: B
E: Lissage des hausses de 10 % par an.

T: qcm
Q: Quelle durée peut avoir un bail emphytéotique ?
A: 3 à 9 ans
B: 18 à 99 ans
C: 9 à 12 ans
D: Illimitée
R: B
E: De 18 à 99 ans, avec un droit réel ; même fourchette pour le bail à construction.

T: qcm
Q: Au-delà de combien de termes le dépôt de garantie d'un bail commercial produit-il des intérêts ?
A: 1 terme
B: 2 termes
C: 3 termes
D: Jamais
R: B
E: Le dépôt de garantie est productif d'intérêts au-delà de deux termes.
```

## Module 3.12

```exercices
T: vf
Q: Un logement loué 340 jours sur 365 déclenche l'alerte « taux d'occupation » du tableau de bord.
R: F
E: Faux. 340 / 365 = 93,2 %, au-dessus du seuil d'alerte de 92 % en location longue durée.

T: nombre
Q: Charges non récupérables de 4 000 € pour 10 000 € de loyers. Quel est le ratio charges sur loyers (en %) ?
R: 40
U: %
E: 4 000 / 10 000 = 40 %, au-dessus du seuil d'alerte de 35 %.

T: nombre
Q: 300 € impayés sur 12 000 € de loyers appelés. Quel est le taux d'impayés (en %) ?
R: 2,5
U: %
P: 0,01
E: 300 / 12 000 = 2,5 %, au-dessus du seuil d'alerte de 2 %.

T: qcm
Q: Quand l'IRL est-il publié ?
A: Une fois par an, en janvier
B: Mi-janvier, mi-avril, mi-juillet et mi-octobre
C: Chaque mois
D: À la fin de chaque trimestre par la Banque de France
R: B
E: L'IRL est publié chaque trimestre par l'INSEE ; les taux d'usure le sont en fin de trimestre par la Banque de France.

T: nombre
Q: Capital restant dû de 170 000 € pour des biens valant 200 000 €. Quel est le ratio d'endettement (en %) ?
R: 85
U: %
E: 170 000 / 200 000 = 85 % : alerte au-delà de 80 % sans épargne de précaution.

T: qcm
Q: Quel délai de relocation déclenche une alerte ?
A: Plus d'une semaine
B: Plus d'un mois
C: Plus de trois mois
D: Plus d'un an
R: B
E: Alerte si le délai entre deux locataires dépasse un mois.

T: qcm
Q: Quelle est la bonne pratique face à un texte annoncé dans la presse ?
A: L'appliquer dès l'annonce
B: Vérifier à la source officielle s'il est projet, adopté ou promulgué, et sa date d'entrée en vigueur
C: Attendre un an
D: Suivre un réseau social spécialisé
R: B
E: Distinguer projet, texte adopté et texte promulgué, et vérifier sur Légifrance ou le BOFiP.

T: qcm
Q: Quel professionnel consulter gratuitement et de façon neutre avant une décision importante ?
A: L'agent immobilier
B: L'ADIL
C: Le promoteur
D: Le syndic
R: B
E: L'ADIL donne un conseil juridique, financier et fiscal gratuit et neutre.

T: qcm
Q: Quand faire la revue annuelle complète de sa situation ?
A: En juillet
B: En décembre-janvier
C: À chaque IRL
D: Jamais
R: B
E: Une revue hebdomadaire, un point trimestriel et une revue annuelle complète en décembre-janvier.

T: qcm
Q: Pour un LMNP au réel ou une SCI à l'IS, quel professionnel le module recommande-t-il ?
A: Le notaire
B: L'expert-comptable
C: Le géomètre-expert
D: Le diagnostiqueur
R: B
E: L'expert-comptable pour le LMNP ou LMP au réel, la SCI à l'IS et le choix de structure.
```

## Examen final

```exercices
C: 1
T: qcm
Q: Quelle structure le corrigé recommande-t-il à Claire et Marc pour louer nu puis transmettre ?
A: Une SCI à l'IS
B: Une SCI à l'IR familiale
C: Une SARL de famille
D: L'indivision
R: B
E: Location nue, déficit foncier transparent pour les associés, plus-value des particuliers et donations de parts facilitées.

C: 1
T: nombre
Q: Claire a 52 ans, Marc 55 : pour quel pourcentage de la pleine propriété la nue-propriété des parts donnée aux enfants est-elle évaluée ?
R: 50
U: %
E: Usufruitier de 51 à 60 ans : nue-propriété à 50 %.

C: 1
T: nombre
Q: Quel montant total d'abattements en ligne directe les deux parents peuvent-ils utiliser pour leurs deux enfants sur une période de quinze ans ?
R: 400000
U: €
E: 100 000 € par parent et par enfant : 2 parents × 2 enfants × 100 000 € = 400 000 €.

C: 1
T: vf
Q: Les 160 000 € de travaux atteignent le seuil de travaux du Jeanbrun ancien (30 % du prix de 480 000 €).
R: V
E: Vrai : 30 % × 480 000 = 144 000 €, inférieur à 160 000 €. Il faut aussi atteindre la classe A ou B après travaux dans l'état actuel du droit.

C: 2
T: nombre
Q: Quel est le prix d'acquisition majoré de Sophie (forfaits et réintégration des 45 000 € d'amortissements) ?
R: 138750
U: €
E: 150 000 + 11 250 (7,5 %, supérieur aux frais réels de 11 000 €) + 22 500 (15 %) − 45 000 = 138 750 €.

C: 2
T: nombre
Q: Quelle est la plus-value brute ?
R: 61250
U: €
E: 200 000 − 138 750 = 61 250 €.

C: 2
T: nombre
Q: Détention de 12 années pleines : quel abattement pour l'impôt sur le revenu (en %) ?
R: 42
U: %
E: De la 6e à la 12e année : 7 × 6 % = 42 %.

C: 2
T: nombre
Q: Quel est le total de l'impôt et des prélèvements sociaux (à l'euro près) ?
R: 16068
U: €
P: 2
E: IR : 61 250 × 58 % × 19 % ≈ 6 750 € ; prélèvements : 61 250 × 88,45 % × 17,2 % ≈ 9 318 € ; total ≈ 16 068 €.

C: 2
T: nombre
Q: Sans réintégration des amortissements, l'imposition serait d'environ 4 263 €. Combien la réintégration coûte-t-elle en plus (à 10 € près) ?
R: 11805
U: €
P: 10
E: 16 068 − 4 263 ≈ 11 805 €, soit environ 11 800 € de plus.

C: 3
T: qcm
Q: Que faut-il à Paul pour louer toute l'année aux touristes sa résidence secondaire ?
A: Seulement le numéro d'enregistrement
B: Une autorisation préalable de changement d'usage du maire, avec un DPE de A à E
C: Un bail mobilité
D: Rien, c'est sa propriété
R: B
E: Ville de plus de 200 000 habitants, logement qui n'est pas la résidence principale : autorisation de changement d'usage, qui exige un DPE de A à E.

C: 3
T: qcm
Q: Son studio est classé F. Que doit-il faire en premier ?
A: Demander l'autorisation tout de suite
B: Réaliser des travaux, ou vérifier si l'attestation 2026 le fait changer de classe s'il est chauffé à l'électricité
C: Le louer en bail mobilité
D: Le faire classer en meublé de tourisme
R: B
E: Avec un F, l'autorisation est impossible : travaux ou attestation liée au coefficient 1,9.

C: 3
T: nombre
Q: Sans classement, jusqu'à quel montant de recettes le micro-BIC reste-t-il possible pour Paul ?
R: 15000
U: €
E: 15 000 € avec 30 % d'abattement : le classement ou le régime réel s'impose.

C: 4
T: vf
Q: Nadia peut réviser le loyer de 750 € selon l'IRL en 2026.
R: F
E: Faux. Aucune révision n'est possible pour un logement F ou G (gel des loyers).

C: 4
T: qcm
Q: Que devient le bail de Nadia, reconduit en 2024 ?
A: Il est annulé depuis 2025
B: Il se poursuit jusqu'à son terme de 2027, mais le locataire peut exiger la mise en conformité à tout moment
C: Il est transformé en bail mobilité
D: Nadia doit donner congé immédiatement
R: B
E: Le bail en cours se poursuit ; toute reconduction ou tout nouveau bail est impossible tant que le logement reste G.

C: 4
T: qcm
Q: Peut-elle donner congé en cours de bail pour faire les travaux ?
A: Oui, avec six mois de préavis
B: Non
C: Oui, si le locataire est d'accord sur le prix
D: Oui, pendant la trêve hivernale
R: B
E: Elle ne peut pas donner congé pour cause de travaux en cours de bail ; elle notifie les travaux et réduit le loyer s'ils durent plus de 21 jours.

C: 5
T: qcm
Q: Dans le premier logement de Karim, occupé par des inconnus, quelle procédure suivre ?
A: Changer lui-même la serrure
B: Plainte, preuve de propriété, constat par un officier de police judiciaire et demande au préfet (article 38 de la loi DALO)
C: Assigner devant le juge et attendre la fin de la trêve hivernale
D: Un commandement de payer
R: B
E: C'est un squat : procédure administrative accélérée, mise en demeure sous 48 heures, départ sous au moins 24 heures, pas de trêve hivernale.

C: 5
T: qcm
Q: Dans le second logement, le locataire ne paie plus depuis trois mois. Quelle voie ?
A: La procédure préfectorale en 48 heures
B: La procédure judiciaire : commandement de payer, caution, juge, trêve hivernale applicable à l'exécution
C: Couper l'électricité
D: Vider le logement
R: B
E: Le locataire est entré régulièrement : c'est un impayé, traité par la procédure judiciaire.

C: 5
T: vf
Q: Dans l'un ou l'autre cas, Karim peut forcer lui-même les occupants à partir.
R: F
E: Faux. Aucune action de force personnelle : c'est un délit (trois ans d'emprisonnement et 30 000 € d'amende, article 226-4-2 du Code pénal).
```
