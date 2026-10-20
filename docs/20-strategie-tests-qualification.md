# Stratégie de tests et qualification

**Statut : stratégie figée pour préparer la production**
**Objectif :** aucune version expérimentale avec de vrais élèves sans qualification documentée.

## 1. Niveaux de tests

### Tests unitaires

Couvrent :

- formules ;
- alignement de texte ;
- normalisation ;
- statuts ;
- comparabilité ;
- anonymisation ;
- validation du schéma ;
- migrations ;
- chiffrement et intégrité ;
- génération de phrases descriptives.

### Tests d’intégration

Couvrent :

- événement vers état ;
- écriture atomique ;
- reprise ;
- calcul depuis événements bruts ;
- export ;
- verrouillage ;
- droits ;
- contenus versionnés ;
- service worker ;
- absence de réseau.

### Tests de composants

Couvrent :

- clavier ;
- focus ;
- nom accessible ;
- erreurs ;
- tactile ;
- zoom ;
- contraste ;
- lecteurs d’écran ;
- états chargement et verrouillage.

### Tests de bout en bout

Couvrent chaque parcours complet avec données fictives :

- création du coffre ;
- création du dossier ;
- passation de chaque tâche ;
- pause et reprise ;
- incident ;
- clôture ;
- rapport ;
- CSV ;
- sauvegarde ;
- restauration ;
- migration ;
- suppression.

## 2. Principe de reproductibilité

Chaque anomalie possède :

- identifiant ;
- version ;
- plateforme ;
- étapes ;
- résultat attendu ;
- résultat obtenu ;
- données fictives minimales ;
- sévérité ;
- correction ;
- test empêchant la régression.

Aucune donnée réelle n’entre dans un ticket ou une capture.

## 3. Matrice minimale

| Appareil | Système | Navigateur | Entrées | Usage |
|---|---|---|---|---|
| ordinateur professionnel principal | Windows 11 | Edge courant | clavier, souris | obligatoire |
| ordinateur secondaire | Windows 11 | Chrome courant | clavier, pavé ou souris | obligatoire |
| ordinateur portable | Windows 11 | Edge courant | clavier, pavé tactile | obligatoire |
| iPad qualifié | iPadOS courant | Safari | tactile, clavier externe | si disponible |
| tablette Android | Android courant | Chrome | tactile, clavier externe | si disponible |

La première expérimentation peut être limitée à Windows 11 Edge/Chrome si c’est le matériel réellement disponible. Toute autre plateforme est marquée non qualifiée.

## 4. Navigateurs

Une version candidate est testée sur :

- version courante ;
- version précédente encore maintenue ;
- mode installé PWA ;
- mode onglet lorsque autorisé ;
- démarrage connecté ;
- redémarrage hors connexion ;
- mise à jour disponible ;
- stockage persistant accordé et refusé.

Un navigateur non qualifié ne démarre pas une passation comparable.

## 5. Tolérances temporelles

### Chronomètre interne

Sur un scénario automatisé de référence :

- erreur absolue médiane ≤ 10 ms ;
- erreur au 95e percentile ≤ 20 ms ;
- aucune durée négative ;
- aucune dépendance à l’horloge civile ;
- pause exclue à 100 % de la durée active.

### Affichage

Les délais imposés par contenu acceptent une erreur de programmation de ±20 ms. La latence matérielle de l’écran ou du dispositif est documentée mais n’est pas corrigée sans mesure fiable.

### Arrière-plan

Tout passage en arrière-plan pendant un item chronométré produit un incident. L’item ne reste pas comparable.

## 6. Tolérances géométriques

Après calibration manuelle :

- erreur de largeur du gabarit ≤ 2 % ;
- erreur de hauteur ≤ 2 % ;
- différence entre deux vérifications successives ≤ 2 % ;
- taille affichée d’une cible : erreur ≤ 0,5 mm ;
- distance centre à centre : erreur ≤ 1 mm.

Si ces valeurs ne sont pas atteintes, la tâche calibrée est incompatible.

## 7. Pointage

Tests :

- cible 8, 16 et 24 mm ;
- distance 50, 100 et 150 mm ;
- quatre directions ;
- cinq zones de départ ;
- clic sur bord intérieur et extérieur ;
- pointerup hors cible ;
- double-clic reconnu et non reconnu ;
- double-toucher ;
- glisser avec sortie puis retour ;
- dépôt au bord ;
- changement d’orientation ;
- zoom ;
- souris, pavé et tactile.

La réussite du dépôt est vérifiée sur le centre de l’objet avec des cas à ±0,1 mm de la frontière calculée.

## 8. Frappe

Jeux d’or couvrant :

- texte identique ;
- espaces multiples ;
- accent ;
- casse ;
- ponctuation ;
- ajout ;
- omission ;
- substitution ;
- transposition ;
- mot collé ;
- mot séparé ;
- caractères composés Unicode ;
- Retour arrière ;
- Supprimer ;
- clavier virtuel ;
- interruption ;
- alignement ambigu corrigé manuellement.

Chaque mode de cotation possède des résultats attendus écrits avant implémentation.

## 9. Repérage, compréhension et navigation

Tests :

- première réponse correcte ;
- première réponse incorrecte ;
- délai ;
- répétition autorisée ;
- répétition supplémentaire interdite ;
- incident de pointage annulé et remplacé ;
- aide ;
- entraînement réussi au premier ou second essai ;
- réserve persistante ;
- chemin minimal ;
- chemin alternatif valide ;
- retour arrière ;
- reprise exacte ;
- reprise impossible et nouveau scénario.

## 10. Données et calculs

Tests obligatoires :

- zéro distinct d’une valeur absente ;
- item annulé exclu du dénominateur ;
- remplacement inclus une seule fois ;
- aide exclue des réussites autonomes ;
- tâche incompatible sans score zéro ;
- arrondis ;
- recalcul identique ;
- ordre des événements ;
- doublon rejeté ;
- référence inexistante rejetée ;
- migration sans perte ;
- version plus récente refusée.

## 11. Stockage et résilience

Scénarios :

- fermeture d’onglet après chaque étape sensible ;
- rechargement ;
- arrêt du navigateur ;
- redémarrage de l’appareil ;
- coupure simulée pendant une transaction ;
- quota faible ;
- stockage persistant refusé ;
- données du site effacées ;
- sauvegarde valide ;
- sauvegarde corrompue ;
- mauvaise phrase ;
- restauration d’une ancienne version ;
- restauration sans écrasement ;
- espace disque insuffisant.

Critère : après interruption, l’état correspond entièrement à l’ancien ou au nouveau lot, jamais à un mélange.

## 12. Réseau

Avec un observateur réseau :

- aucune requête pendant une passation ;
- aucune donnée de dossier dans URL, en-tête, journal ou corps ;
- aucun CDN ;
- aucune télémétrie ;
- aucune police distante ;
- aucun rapport d’erreur automatique ;
- mise à jour téléchargée seulement hors passation ;
- fonctionnement complet après installation hors connexion.

Une requête imprévue est bloquante.

## 13. Sécurité

Avant expérimentation :

- revue du modèle de menaces ;
- analyse des dépendances ;
- contrôle des secrets ;
- CSP ;
- injection de texte ;
- XSS ;
- manipulation d’import ;
- force brute ;
- verrouillage ;
- changement de profil ;
- droits ;
- export ;
- corruption ;
- clé absente de localStorage ;
- données illisibles coffre fermé ;
- journal sans contenu sensible.

Toute vulnérabilité permettant lecture ou modification non autorisée est bloquante.

## 14. Accessibilité

Tests manuels et automatiques :

- clavier seul ;
- focus ;
- zoom 200 % ;
- redistribution à 320 CSS px hors tâches calibrées ;
- contraste ;
- niveaux de titres ;
- nom, rôle, valeur ;
- messages d’erreur ;
- tactile ;
- réduction de mouvement ;
- lecteur d’écran NVDA avec Edge ou Chrome ;
- VoiceOver avec Safari si iPad qualifié ;
- PDF balisé ;
- niveaux de gris.

Aucune réussite automatique ne remplace l’audit manuel.

## 15. Compréhension utilisateur

Avant la vague principale :

- au moins un élève par grande tranche disponible ;
- méthode « dis-moi ce que tu penses devoir faire » ;
- aucune aide orientant la réponse notée ;
- observation des mots incompris ;
- réussite de l’entraînement ;
- charge et fatigue ;
- entretien bref après la tâche.

Une consigne est révisée si plusieurs participants l’interprètent différemment de l’action attendue.

## 16. Sévérité des anomalies

| Niveau | Définition | Décision |
|---|---|---|
| critique | perte, fuite, calcul faux, mauvais jeune | interdit toute passation |
| majeure | tâche impossible, reprise fausse, accessibilité bloquante | interdit la version |
| modérée | contournement possible sans modifier la mesure | correction planifiée avant vague principale |
| mineure | cosmétique sans effet fonctionnel | peut être différée |

Aucune anomalie critique ou majeure ouverte dans une version candidate.

## 17. Qualification d’une version

Une version candidate est qualifiée si :

- compilation reproductible ;
- tous les tests automatisés passent ;
- couverture des règles critiques à 100 % ;
- aucune anomalie critique ou majeure ;
- migrations et restauration testées ;
- matrice minimale passée ;
- calculs confrontés aux jeux d’or ;
- PDF et CSV contrôlés ;
- audit réseau réussi ;
- audit accessibilité représentatif réussi ;
- sauvegarde réalisée et restaurée ;
- versions et empreintes consignées ;
- décision de qualification signée dans GitHub.

## 18. Critères de sortie de la première vague

Après trois premières passations :

- aucune perte de données ;
- aucun calcul incohérent ;
- aucune consigne bloquante ;
- durée supportable ;
- aucune fuite réseau ;
- incidents documentés ;
- corrections critiques effectuées avant poursuite.

## 19. Critères de sortie du pilote initial

Après environ douze élèves :

- taux de complétion par tâche documenté ;
- motifs d’échec analysés ;
- effets plancher ou plafond repérés ;
- durée et fatigue décrites ;
- compatibilité matérielle recensée ;
- consignes problématiques révisées ;
- aucune anomalie critique ouverte ;
- décision explicite : continuer, modifier fortement ou arrêter.

Ces critères ne transforment pas le pilote en étalonnage.
