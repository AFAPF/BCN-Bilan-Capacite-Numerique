# Cahier des charges fonctionnel — décisions validées

**Statut :** document de travail évolutif  
**Dernière mise à jour :** 23 septembre 2026

Ce document ne contient que les décisions explicitement validées. Les points non tranchés restent signalés comme ouverts.

## 1. Utilisateurs de la première version

La première version doit pouvoir être utilisée par :

- les équipes des Pôles d’Appui à la Scolarité (PAS) ;
- les ergothérapeutes ;
- plus largement, tout professionnel formé à l’utilisation de BCN.

### Conséquences fonctionnelles

- l’interface ne doit pas dépendre du vocabulaire d’un seul métier ;
- la fonction du professionnel doit être enregistrable dans le contexte de passation ;
- le rapport doit distinguer les mesures automatiques des observations rédigées par le professionnel ;
- le futur manuel devra définir ce que recouvre la notion de « professionnel formé ».

### Point restant à définir

Les prérequis, le contenu et les modalités de cette formation ne sont pas encore décidés.

## 2. Matériel pris en charge

La première version doit être conçue pour **tous les appareils dès le départ**.

### Conséquences fonctionnelles et techniques

- interface adaptative ;
- prise en compte de plusieurs méthodes de saisie et de pointage ;
- enregistrement du matériel et du dispositif utilisés ;
- résultats interprétés en tenant compte des conditions matérielles ;
- épreuves susceptibles de varier selon les capacités de l’appareil ;
- tests de compatibilité sur plusieurs formats d’écran et méthodes d’interaction.

### Points restant à définir

- appareils inclus exactement dans « tous les appareils » ;
- systèmes et navigateurs prioritaires ;
- fonctionnement avec ou sans connexion ;
- installation éventuelle sous forme d’application ;
- comparabilité des résultats entre appareils.

Aucune liste d’appareils n’est considérée comme validée à ce stade.

## 3. Sélection des épreuves

Les épreuves sont **entièrement choisies par le professionnel**.

### Conséquences fonctionnelles

- catalogue d’épreuves consultable avant la passation ;
- création d’une session personnalisée ;
- ajout, retrait et réorganisation des épreuves ;
- possibilité d’enregistrer des sélections réutilisables à définir ;
- rapport indiquant clairement les épreuves réalisées et non réalisées ;
- absence de note globale calculée comme si toutes les épreuves avaient été passées.

### Garde-fous à prévoir

Le libre choix ne doit pas permettre une interprétation abusive. L’outil devra afficher :

- la population visée par chaque épreuve ;
- le matériel compatible ;
- la durée estimée ;
- la capacité observée ;
- les conditions nécessaires ;
- les limites d’interprétation.

### Points restant à définir

- présence ou non de recommandations selon l’âge ;
- possibilité de créer des modèles de passation ;
- épreuves obligatoires avant certaines interprétations ;
- règles de comparaison entre deux passations différentes.

## 4. Variantes selon le matériel

Lorsqu’une épreuve ne peut pas être identique sur tous les appareils, BCN doit proposer des **variantes distinctes selon le matériel**.

### Règles

- chaque variante possède un identifiant et une version propres ;
- le matériel et la méthode d’interaction sont enregistrés avec le résultat ;
- les mesures de variantes différentes restent distinguées ;
- aucune équivalence entre variantes ne doit être affirmée sans étude spécifique ;
- le rapport nomme la variante effectivement utilisée.

### Points restant à définir

- liste exacte des familles de matériel ;
- critères déterminant la création d’une variante ;
- possibilité de comparer deux passations effectuées avec des matériels différents ;
- méthode de validation de l’équivalence éventuelle.

## 5. Conservation et export

Dans la première version, les bilans sont **conservés sur l’appareil**, avec un **export manuel** décidé par le professionnel.

### Conséquences

- aucun compte en ligne n’est nécessaire pour le fonctionnement initial ;
- aucune synchronisation distante n’est présumée ;
- le professionnel garde la maîtrise du déclenchement de l’export ;
- l’application doit permettre de retrouver, exporter et supprimer un bilan local ;
- la perte, le changement ou la panne de l’appareil doivent être pris en compte dans l’information utilisateur.

### Points restant à définir

- données identifiantes ou pseudonymisées ;
- formats d’export ;
- chiffrement ou protection locale ;
- emplacement choisi ou imposé ;
- sauvegarde et restauration ;
- durée de conservation ;
- procédure d’effacement.

## 6. Recommandations sans blocage

BCN recommande des épreuves pertinentes, mais **ne bloque jamais le choix du professionnel**.

### Règles

- la recommandation doit être explicitée ;
- le professionnel peut sélectionner ou écarter toute épreuve ;
- une alerte peut signaler une limite liée à l’âge, au matériel ou aux conditions ;
- le choix final appartient au professionnel ;
- les recommandations ne doivent pas être confondues avec une prescription ou un diagnostic.

### Points restant à définir

- critères précis de recommandation ;
- informations utilisées pour les proposer ;
- traçabilité éventuelle d’un choix contraire à une recommandation ;
- personnalisation de modèles de passation.

## 7. Identification du jeune

Chaque dossier comporte un **code obligatoire**. L’identité est **facultative**.

### Règles

- le code permet d’utiliser BCN sans saisir de nom ou de prénom ;
- les champs d’identité ne doivent jamais être nécessaires au calcul ;
- l’application doit distinguer clairement le code des données d’identité ;
- les doublons de code doivent être détectés ou signalés localement ;
- la suppression des informations facultatives ne doit pas altérer les résultats.

### Points restant à définir

- composition ou génération du code ;
- champs d’identité proposés ;
- affichage de l’identité dans le PDF ;
- présence éventuelle de l’identité dans le CSV ;
- données d’âge et de scolarité nécessaires.

## 8. Exports de la première version

Deux exports sont validés :

1. un **rapport PDF lisible** ;
2. un **tableau CSV destiné aux statistiques**.

Aucun export JSON réimportable ni archive complète protégée n’est retenu pour la première version à ce stade.

### Rapport PDF

Le rapport devra distinguer les mesures, les observations professionnelles, les conditions de passation et les limites d’interprétation.

### Tableau CSV

Les colonnes, le niveau d’anonymisation et l’export d’une ou plusieurs passations restent à définir. Le CSV ne doit pas transformer une observation libre en mesure quantitative ni mélanger des variantes matérielles non comparables.

## 9. Sauvegarde automatique et reprise

BCN sauvegarde automatiquement la passation et permet sa reprise après interruption.

### Règles

- l’état de progression est conservé localement ;
- une épreuve interrompue est identifiée comme telle ;
- un résultat incomplet ne doit pas être présenté comme terminé ;
- le professionnel choisit le moment de la reprise ;
- la date, l’heure et la durée réelle de l’interruption doivent pouvoir être tracées si elles influencent l’interprétation.

### Points restant à définir

- fréquence de sauvegarde ;
- reprise à l’étape exacte ou au début de l’épreuve ;
- délai maximal avant reprise ;
- conduite à tenir si le matériel change ;
- distinction entre pause volontaire, incident et abandon.

## 10. Principe de non-invention

Toute décision ayant un effet sur les objectifs, les utilisateurs, les données, les épreuves, la cotation, la restitution ou l’architecture doit être :

1. explicitement proposée ;
2. accompagnée de ses conséquences ;
3. validée avant d’être considérée comme définitive ;
4. enregistrée dans ce document.

Les choix purement techniques, réversibles et sans effet fonctionnel pourront être documentés puis proposés à la validation avant publication d’une version stable.
