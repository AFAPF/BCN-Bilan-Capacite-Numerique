# Interface, ergonomie et accessibilité

**Statut : cadrage fonctionnel recommandé**
**Portée :** interface professionnelle, interface de passation et rapports de BCN v1.

## 1. Référentiels et niveau cible

BCN vise :

- la conformité au RGAA 4.1.2, référentiel français en vigueur au moment du cadrage ;
- WCAG 2.2 niveau AA comme cible complémentaire ;
- une vérification du RGAA 5 avant la publication si celui-ci est alors disponible ;
- des tests avec des utilisateurs, en complément des contrôles automatiques et manuels.

Références :

- [RGAA 4.1.2](https://accessibilite.numerique.gouv.fr/) ;
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/) ;
- [Contenus utilisables pour les personnes ayant des difficultés cognitives — W3C](https://www.w3.org/TR/coga-usable/).

## 2. Deux contextes d’interface

### Interface professionnelle

Elle permet de préparer, administrer, observer, reprendre, analyser et exporter. Elle doit être utilisable au clavier, au tactile, au pointeur, au zoom et avec les principales technologies d’assistance.

### Interface de passation

Elle est volontairement épurée afin de ne pas détourner l’attention ni révéler la réussite. Elle ne montre que :

- la consigne ;
- l’espace de tâche ;
- les commandes autorisées ;
- un indicateur de progression neutre lorsque celui-ci ne modifie pas la mesure ;
- une commande professionnelle protégée pour interrompre l’item.

Les menus administratifs, résultats, notifications et commandes système sont masqués pendant un item noté.

## 3. Accessibilité et validité de la mesure

L’accessibilité de l’application et la validité d’une épreuve ne doivent pas être confondues.

- les commandes générales restent accessibles ;
- une adaptation sans effet sur la capacité mesurée est autorisée normalement ;
- une adaptation susceptible de modifier la mesure crée une condition adaptée distincte ;
- une adaptation qui rend l’épreuve non interprétable entraîne le statut « incompatible » ;
- aucun résultat adapté n’est comparé silencieusement à un résultat standard ;
- le rapport indique dispositif, réglages, adaptations et limites.

Exemples :

| Situation | Décision |
|---|---|
| lecteur d’écran dans l’espace professionnel | autorisé |
| lecteur d’écran pendant une recherche visuelle | épreuve non comparable ou incompatible |
| clavier pour remplir les données administratives | autorisé |
| clavier à la place du pointeur pendant une épreuve de pointage | condition adaptée distincte |
| zoom avant une tâche non calibrée | autorisé |
| zoom modifié pendant une tâche calibrée physiquement | calibration invalidée et tâche recommencée |
| réduction des animations | autorisée partout |
| délai supplémentaire | condition adaptée et durée brute conservée |

## 4. Principes visuels

- fond uni et calme ;
- contraste texte–fond d’au moins 4,5:1 pour le texte courant ;
- contraste d’au moins 3:1 pour grands textes et éléments graphiques indispensables ;
- aucune information donnée uniquement par la couleur ;
- police système sans empattement, lisible et non condensée ;
- corps de base professionnel d’au moins 16 px ;
- consignes destinées au jeune d’au moins 20 px par défaut ;
- interligne minimal de 1,5 pour les textes continus ;
- largeur des paragraphes limitée ;
- animations décoratives absentes ;
- respect de la préférence de réduction des mouvements ;
- thème clair par défaut, thème sombre uniquement après qualification complète.

Les couleurs des cibles expérimentales restent identiques entre items d’une même tâche et ne codent pas la réussite.

## 5. Commandes

Les commandes ordinaires visent une zone activable minimale de 44 × 44 pixels CSS. Cette règle ne s’applique pas aux cibles dont la taille physique constitue la variable mesurée.

Chaque commande possède :

- un libellé visible explicite ;
- un nom accessible cohérent avec le libellé ;
- un état de focus très visible ;
- des états repos, survol, focus, actif et désactivé ;
- une raison compréhensible lorsqu’elle est désactivée ;
- aucune activation au simple passage du pointeur ;
- aucune action irréversible déclenchée par un geste unique.

Les icônes ne remplacent pas seules un texte, sauf convention universelle accompagnée d’un nom accessible et testée auprès des utilisateurs.

## 6. Clavier et focus

Dans l’interface professionnelle :

- toutes les fonctions sont accessibles sans souris ;
- l’ordre de tabulation suit l’ordre visuel et logique ;
- le focus n’est jamais masqué ;
- l’ouverture d’une fenêtre place le focus dans celle-ci ;
- sa fermeture rend le focus à l’élément déclencheur ;
- Échap ferme les fenêtres non critiques ;
- aucun piège clavier ;
- les raccourcis à une touche sont désactivables ;
- un lien d’évitement mène au contenu principal.

Pendant une épreuve mesurant le pointeur, la navigation clavier des cibles n’est pas proposée comme résultat standard. Les commandes professionnelles hors tâche restent néanmoins accessibles selon un mécanisme protégé.

## 7. Tactile, pointeur et glisser-déposer

- l’interface ne dépend pas d’un survol ;
- l’activation est validée à la fin du geste ;
- les éléments interactifs sont suffisamment espacés ;
- le défilement de la page est désactivé seulement dans la zone et pendant le geste qui l’exigent ;
- une alternative au glisser-déposer est disponible dans l’interface générale ;
- l’épreuve de glisser-déposer conserve le geste comme objet mesuré ;
- les annulations accidentelles et sorties de zone sont enregistrées sans bloquer l’application.

## 8. Consignes et compréhension

Les consignes utilisent :

- une phrase courte par action ;
- des mots courants et littéraux ;
- la voix active ;
- aucune métaphore, double négation ou jargon inutile ;
- un exemple distinct de l’item noté ;
- le même contenu essentiel à l’écrit et à l’audio ;
- un vocabulaire stable dans toute l’application.

Les nombres, unités et noms des commandes sont écrits de façon constante. Pour les 8–10 ans, une consigne ne contient qu’une action principale, éventuellement suivie d’une seconde étape visuellement séparée.

## 9. Audio

- aucune lecture automatique hors consigne prévue ;
- bouton Réécouter explicite lorsque la répétition est autorisée ;
- texte affiché identique sur le fond à la consigne audio ;
- volume contrôlé par l’appareil ;
- test audio obligatoire avant les tâches concernées ;
- fichier audio préproduit et versionné ;
- aucun son ne sert seul à signaler un état ;
- interruption ou échec de lecture consigné comme incident.

## 10. Temps, progression et retour

Pendant un item noté :

- aucun compte à rebours anxiogène ;
- aucun changement de couleur lié au temps ;
- aucune indication réussite/échec ;
- transition neutre vers l’item suivant ;
- progression sous forme « item 3 sur 10 » seulement si elle ne modifie pas la tâche ;
- minuterie visible uniquement pour le professionnel lorsqu’elle est nécessaire.

Pendant l’entraînement, le résultat est expliqué et un second essai est possible selon les règles du module.

## 11. Formulaires professionnels

- libellé permanent au-dessus ou à côté de chaque champ ;
- champs obligatoires clairement indiqués avant validation ;
- exemples sans utiliser le texte indicatif comme seul libellé ;
- erreurs reliées au champ et résumées en tête de page ;
- saisie conservée après erreur ;
- formats attendus précisés ;
- autocomplétion désactivée pour les identités si elle risque de mélanger les dossiers ;
- confirmation récapitulative avant clôture, export identifiable ou suppression ;
- zones libres accompagnées d’un rappel de minimisation des données.

## 12. États et messages

Chaque écran prévoit au minimum :

| État | Comportement |
|---|---|
| chargement | message textuel, aucune animation agressive |
| vide | explication et action suivante |
| hors connexion | état normal de passation, non présenté comme erreur |
| sauvegarde en cours | indicateur discret |
| sauvegarde réussie | confirmation non intrusive |
| erreur récupérable | cause simple et action possible |
| erreur bloquante | arrêt sûr, identifiant d’incident et reprise |
| verrouillé | aucune donnée du jeune visible |
| incompatible | raison précise et solution éventuelle |
| mise à jour disponible | reportée hors passation |
| espace insuffisant | nouvelle passation bloquée, sauvegarde proposée |

Les messages techniques ne révèlent aucune donnée sensible.

## 13. Personnalisation

Réglages professionnels mémorisables :

- taille de texte ;
- thème qualifié ;
- réduction des mouvements ;
- volume de l’interface ;
- préférences du lecteur d’écran lorsque nécessaires.

Réglages de passation enregistrés dans la séance :

- zoom ;
- contraste ou thème ;
- dispositif d’entrée ;
- clavier physique ou virtuel ;
- lecteur d’écran ;
- aides techniques ;
- orientation ;
- calibration.

Toute modification affectant la comparabilité déclenche un avertissement avant la tâche.

## 14. Rapports et documents

Le PDF doit :

- respecter une structure de titres ;
- conserver du texte sélectionnable ;
- fournir un ordre de lecture logique ;
- utiliser des tableaux simples avec en-têtes ;
- ne pas transmettre une information uniquement par couleur ;
- afficher les motifs d’échec en texte ;
- distinguer mesure, observation et interprétation ;
- inclure les adaptations et limites ;
- être vérifié avec lecteur d’écran et à l’impression en niveaux de gris.

Le CSV est accompagné d’un dictionnaire de colonnes accessible.

## 15. Tests d’acceptation

La version candidate devra réussir :

- navigation complète au clavier de l’espace professionnel ;
- contrôle de focus et de nom accessible ;
- zoom à 200 % sans perte de fonction sur les écrans professionnels ;
- redistribution à 320 pixels CSS pour les parcours qui ne sont pas des épreuves calibrées ;
- contrastes automatisés puis vérifiés manuellement ;
- lecteur d’écran sur les parcours professionnels critiques ;
- tactile sans survol ;
- réduction des mouvements ;
- compréhension des consignes avec chaque tranche d’âge ;
- vérification que les adaptations influençant une mesure sont tracées ;
- audit RGAA représentatif avant publication.

## 16. À confirmer par les essais

- palettes finales ;
- police et tailles exactes par appareil ;
- compréhension des libellés par tranche d’âge ;
- effet de l’indicateur de progression sur les performances ;
- compatibilité des technologies d’assistance ;
- réglages qui modifient effectivement chaque mesure ;
- mise à jour vers le RGAA 5 lorsqu’il sera publié.
