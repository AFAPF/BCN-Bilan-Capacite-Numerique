# Règles transversales de passation

**Statut : cadrage fonctionnel validé**  
**Portée :** règles communes aux quatre modules BCN avant développement.

## 1. Principes

BCN organise une observation fonctionnelle standardisée. Il ne produit aucun diagnostic et ne transforme pas automatiquement une mesure isolée en conclusion sur le jeune.

Les mesures automatiques, les observations professionnelles, les aides, les incidents et les interprétations restent séparés.

Une passation complète vise une durée totale de **45 à 60 minutes**, hors pauses. Le professionnel peut sélectionner uniquement les modules et épreuves utiles. L’absence d’une épreuve ne constitue ni un échec ni une donnée manquante imputable au jeune.

## 2. Identification minimale

### Professionnel

Chaque action est associée au profil professionnel actif et à son identifiant interne.

### Jeune

Données obligatoires :

- code jeune pseudonymisé ;
- âge en années et mois à la date de chaque module ;
- niveau scolaire ;
- tranche d’âge BCN utilisée.

Données facultatives :

- nom ;
- prénom ;
- date de naissance complète.

L’application doit fonctionner sans identité civile lorsque le code jeune, l’âge et le niveau scolaire sont renseignés.

## 3. Création d’une passation

Le professionnel :

1. ouvre son profil ;
2. sélectionne ou crée le dossier pseudonymisé du jeune ;
3. vérifie l’âge et le niveau scolaire ;
4. choisit les modules et épreuves ;
5. indique le matériel habituel ou non ;
6. effectue les vérifications techniques ;
7. confirme les adaptations actives ;
8. démarre la passation.

BCN crée un identifiant unique de passation et conserve la version de l’application, des banques d’items, des consignes, des fichiers audio et des règles de cotation.

## 4. Vérification préalable obligatoire

Avant la première épreuve, BCN vérifie ou demande de confirmer :

- appareil, système et navigateur ;
- taille utile, résolution, orientation et niveau de zoom ;
- calibration physique de l’écran lorsqu’elle est nécessaire ;
- clavier, disposition et langue ;
- souris, pavé tactile, écran tactile ou dispositif adapté ;
- fonctionnement du son et volume compréhensible ;
- disponibilité des contenus hors connexion ;
- désactivation des outils interdits pour l’épreuve ;
- présence des adaptations déclarées ;
- espace de stockage suffisant pour la sauvegarde.

Une vérification échouée bloque uniquement les épreuves concernées. BCN explique le motif sans présenter ce blocage comme une difficulté du jeune.

## 5. Ordre recommandé

Lorsqu’une passation comprend les quatre modules, l’ordre recommandé est :

1. Pointage et manipulation ;
2. Frappe au clavier ;
3. Repérage visuel ;
4. Compréhension et navigation.

Le pointage est placé en premier afin de documenter le dispositif et les éventuelles difficultés motrices susceptibles d’influencer les réponses suivantes. La frappe est réalisée avant une fatigue trop importante.

Le professionnel peut modifier cet ordre. Il doit alors choisir un motif ou saisir une justification. L’ordre réellement suivi apparaît dans les données de passation.

## 6. États d’une épreuve

Chaque épreuve possède un seul état courant parmi :

- non commencée ;
- prête ;
- en cours ;
- en pause entre deux items ;
- interrompue ;
- reprise ;
- terminée ;
- arrêtée par le professionnel ;
- abandonnée ;
- invalide techniquement ;
- non comparable.

L’historique des changements d’état, leur date, leur heure et leur auteur est conservé.

## 7. Chronométrage

BCN distingue :

- temps actif de l’épreuve ;
- temps de pause ;
- temps d’interruption technique ;
- durée totale entre ouverture et clôture.

Seul le temps actif entre dans les indicateurs chronométrés.

Le chronométrage utilise une horloge monotone adaptée aux mesures de durée. L’heure civile sert uniquement à dater les événements.

Le passage de l’application en arrière-plan, la perte de visibilité de la fenêtre, la veille ou le verrouillage déclenchent une interruption technique, sauf lorsqu’aucun item chronométré n’est actif.

## 8. Pauses

Les pauses sont libres entre les modules, les épreuves et les items lorsque la fiche d’épreuve l’autorise.

Une pause n’est jamais comptée dans le temps actif. BCN enregistre :

- début et fin ;
- durée ;
- moment dans le parcours ;
- motif facultatif.

Une demande de pause pendant un item actif suit la règle d’interruption propre à l’épreuve. Le chronomètre ne doit pas simplement être suspendu si cela rend la condition non comparable.

## 9. Passation sur plusieurs jours

Une passation peut être répartie sur plusieurs jours.

Règles :

- un item chronométré n’est jamais partagé entre deux séances ;
- chaque module conserve sa date et ses heures de début et de fin ;
- le matériel et les adaptations sont vérifiés à chaque nouvelle séance ;
- tout changement de matériel, système, dispositif ou configuration est enregistré ;
- BCN avertit lorsque des résultats issus de configurations différentes ne doivent pas être comparés directement ;
- la reprise s’effectue au prochain item ou à la prochaine épreuve valide.

L’âge en années et mois est recalculé à la date de chaque module.

## 10. Sauvegarde automatique

BCN enregistre automatiquement :

- après chaque réponse ;
- après chaque observation ;
- à chaque changement d’état ;
- avant et après une pause ;
- lors d’une interruption détectée ;
- à la clôture d’une épreuve.

Une sauvegarde validée est atomique : l’état précédent reste utilisable tant que le nouvel état n’est pas entièrement enregistré.

Après une fermeture inattendue, BCN propose une reprise depuis le dernier état cohérent. Il affiche les éléments récupérés et les éventuelles données perdues. Il ne recalcule ou ne complète jamais silencieusement une réponse absente.

## 11. Interruption et reprise

BCN distingue au minimum :

- interruption technique ;
- interruption environnementale ;
- pause demandée ;
- arrêt professionnel ;
- abandon du jeune ;
- verrouillage de sécurité.

Pour reprendre une épreuve, BCN vérifie que le contenu, le chronométrage, le matériel, la configuration et la version des règles peuvent être restaurés exactement.

Si cette restauration est impossible :

- l’item actif est invalidé ;
- les données brutes restent dans l’historique ;
- un item équivalent est proposé lorsque la fiche le permet ;
- sinon l’épreuve recommence ou reste non comparable.

## 12. Arrêt professionnel

Le professionnel peut arrêter une épreuve pour :

- incompréhension persistante ;
- fatigue ou inconfort ;
- retard important prévu par le protocole ;
- difficulté de pointage ;
- incident matériel ;
- perturbation de l’environnement ;
- refus ou souhait d’arrêter ;
- autre motif décrit.

BCN conserve le moment de l’arrêt, l’auteur, le motif, les résultats obtenus et le statut de comparabilité prévu par la fiche d’épreuve.

## 13. Aides

Toute aide autre que celles explicitement autorisées dans une fiche d’épreuve est enregistrée.

Catégories transversales :

1. lecture supplémentaire ;
2. reformulation ;
3. rappel de l’objectif ;
4. repérage visuel ;
5. indication de l’action ou de la commande ;
6. initiation ou maintien du geste ;
7. guidance physique ;
8. aide technique liée au dispositif ;
9. attention ou fatigue ;
10. autre.

Pour chaque aide, BCN conserve :

- catégorie ;
- item ou étape ;
- auteur ;
- moment ;
- texte libre facultatif ;
- effet sur la cotation et la comparabilité.

Un résultat assisté n’est jamais présenté comme une réussite autonome.

## 14. Adaptations et conditions comparées

La condition standard et la condition avec adaptation sont deux conditions distinctes.

BCN ne mélange pas dans un même indicateur :

- une partie réalisée sans adaptation ;
- une partie réalisée avec adaptation ;
- deux matériels non validés comme équivalents.

Lorsqu’un bénéfice d’adaptation doit être observé, BCN utilise deux tâches ou formes équivalentes, enregistre leur ordre et conserve la liste exacte des adaptations.

Les résultats sont décrits comme un gain, une absence de gain ou un coût observé dans la tâche. Aucune généralisation automatique n’est produite.

## 15. Observations professionnelles

Les observations sont organisées en trois moments :

### Avant

- état général observable ;
- matériel habituel ou non ;
- adaptations déjà utilisées ;
- compréhension du contexte ;
- remarque libre.

### Pendant

- posture ;
- stratégie ;
- orientation du regard ;
- autonomie ;
- demandes d’aide ;
- fatigue ou inconfort ;
- incidents.

### Après

- ressenti exprimé par le jeune ;
- fatigue ou inconfort ;
- stratégie jugée efficace ;
- limite de la passation ;
- remarque libre.

Ces observations restent séparées des mesures automatiques.

## 16. Verrouillage de sécurité

Après **30 minutes d’inactivité**, BCN verrouille l’espace professionnel.

Le verrouillage automatique ne se déclenche pas pendant une épreuve active. Une épreuve active possède ses propres règles d’interruption.

La reprise après verrouillage exige le code du professionnel. Elle ne modifie ni le temps actif ni les réponses déjà enregistrées.

## 17. Clôture

Avant la clôture, BCN affiche une synthèse des modules :

- terminés ;
- incomplets ;
- arrêtés ;
- invalides ;
- non comparables ;
- comportant des aides ou réserves.

Le professionnel doit examiner cette synthèse, compléter les observations obligatoires et confirmer la clôture.

Après clôture :

- les mesures brutes sont figées ;
- toute modification professionnelle est historisée ;
- le rapport indique sa date de génération et les versions utilisées ;
- une nouvelle génération de rapport n’efface pas les versions précédentes ;
- la suppression définitive reste réservée à l’administrateur selon la matrice des droits.

## 18. Critères d’acceptation transversaux

La future application devra démontrer que :

- aucune pause n’augmente ou ne réduit le temps actif ;
- une fermeture inattendue permet une reprise cohérente ;
- aucun changement de matériel ou d’adaptation n’est silencieux ;
- une aide modifie correctement le statut d’autonomie ;
- un item invalide n’entre pas dans la cotation ;
- les données de plusieurs jours restent datées séparément ;
- toutes les actions professionnelles sensibles sont historisées ;
- le rapport correspond exactement aux données et versions de la passation clôturée.

## 19. Éléments encore à traiter

- parcours détaillé de création et administration des profils ;
- matrice complète des droits ;
- dictionnaire des données ;
- durées de conservation et sauvegardes externes ;
- modèle de menaces et chiffrement ;
- architecture hors connexion ;
- maquettes des écrans ;
- règles détaillées des exports PDF et CSV ;
- critères d’accessibilité ;
- tests techniques et scénarios de récupération.
