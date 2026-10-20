# Cotation, indicateurs et règles de restitution

**Statut : spécification fonctionnelle figée pour la production**
**Principe :** BCN calcule des indicateurs descriptifs reproductibles. Il ne produit ni note globale, ni diagnostic, ni seuil normatif avant validation.

## 1. Unités et conventions

- durées stockées en millisecondes entières ;
- durées affichées en secondes avec deux décimales lorsque nécessaire ;
- distances stockées en pixels et converties en millimètres avec la calibration active ;
- débits calculés avec la durée active uniquement ;
- pourcentages affichés avec un chiffre après la virgule ;
- compteurs toujours entiers ;
- valeur absente distincte de zéro ;
- formule, version de règle et données sources conservées avec chaque résultat calculé.

Une valeur calculée n’écrase jamais les événements bruts.

## 2. Statuts

### Item

- réussi ;
- erreur ;
- délai dépassé ;
- assisté ;
- incident annulé ;
- remplacé ;
- incompatible ;
- abandonné ;
- non présenté.

### Tâche ou sous-épreuve

- complète autonome ;
- complète avec aide ;
- partielle interprétable ;
- partielle non comparable ;
- incompatible ;
- abandonnée ;
- invalidée puis recommencée.

Une tâche est complète lorsque tous les items valides attendus possèdent un résultat final. Un item annulé puis remplacé n’entre pas dans le dénominateur ; son incident reste conservé.

## 3. Comparabilité

Un résultat reçoit un statut :

- **standard comparable** : protocole, matériel et règles respectés ;
- **adapté non comparable** : adaptation susceptible de modifier la mesure ;
- **brut non comparable** : dispositif ou variante sans référence validée ;
- **partiel comparable sous réserve** : durée minimale et portion équivalente validées ;
- **non interprétable** : données insuffisantes ou protocole rompu.

Aucune interface ne transforme automatiquement ces statuts en jugement de niveau.

## 4. Données manquantes

Les motifs sont codés séparément :

- non sélectionné ;
- non présenté ;
- refus ;
- fatigue ;
- manque de temps de séance ;
- incompatibilité matérielle ;
- incident technique ;
- abandon ;
- donnée corrompue ;
- autre motif documenté.

Une donnée manquante ne vaut jamais zéro et n’entre pas dans un dénominateur.

## 5. Frappe — copie et dictée

### 5.1 Durée

Durée active en minutes :

[
D_{min} = rac{t_{fin}-t_{début}-t_{pauses exclues}}{60000}
]

Le début correspond à l’activation de la zone de saisie après validation du départ pour la copie, et au démarrage de l’audio pour la dictée.

### 5.2 Mots saisis par minute

Un mot saisi est un groupe non vide séparé par un ou plusieurs espaces dans le texte final normalisé uniquement pour les séparateurs.

[
MPM = rac{N_{mots saisis}}{D_{min}}
]

### 5.3 Mots corrects par minute

Les mots sont alignés au texte modèle. Un mot correct respecte le mode choisi avant l’épreuve.

[
MCPM = rac{N_{mots corrects}}{D_{min}}
]

Modes :

- tolérant : accents, casse et ponctuation neutralisés ;
- strict intégral : chaîne identique ;
- orthographique : lettres, orthographe et accents exacts ; casse et ponctuation comptées séparément.

Les transformations Unicode et règles d’espace sont versionnées. L’algorithme privilégie l’alignement minimisant les opérations, puis applique des règles déterministes en cas d’égalité.

### 5.4 Exactitude descriptive

[
Exactitude mots = rac{N_{mots corrects}}{N_{mots du modèle alignés ou tentés}} 	imes 100
]

Elle n’est affichée que si le dénominateur est supérieur à zéro. Elle complète les débits mais ne les remplace pas.

### 5.5 Erreurs finales

Les différences observables sont comptées séparément :

- omission ;
- ajout ;
- substitution ;
- inversion ou transposition ;
- accent ;
- majuscule ;
- ponctuation.

Une même différence ne peut alimenter deux catégories principales. Accent, majuscule et ponctuation sont des sous-types prioritaires lorsqu’ils expliquent entièrement la différence.

### 5.6 Corrections

Sont affichés séparément :

- Retour arrière ;
- Supprimer ;
- autres événements détectés mais non validés comme corrections.

Aucun ratio psychologique ou interprétation de stratégie n’est déduit du nombre de corrections.

### 5.7 Dictée arrêtée

Les données brutes sont toujours affichées. La comparaison n’est autorisée que si la durée minimale et l’équivalence de la portion ont été validées au pilote. Avant cela, le statut est « partiel non comparable ».

## 6. Frappe — manipulation de texte

Pour chacune des trois tâches :

- réussite autonome : 1 ;
- échec ou délai : 0 ;
- réussite avec aide : réussite assistée, exclue du total autonome ;
- incompatible ou annulée : absente du dénominateur.

[
Réussites autonomes = sum réussite_i
]

Le rapport affiche « x sur n tâches valides », le temps de chaque tâche réussie ou échouée, le temps actif total, les actions incorrectes et les aides. Aucun score pondéré n’est produit.

## 7. Pointage

### 7.1 Temps de réponse

[
TR_i = t_{activation finale}-t_{apparition cible}
]

Le résultat principal de temps est la médiane des items réussis. La moyenne, le minimum et le maximum restent disponibles dans l’export, accompagnés du nombre d’items.

### 7.2 Réussite

Pour chaque série :

[
Réussites = sum réussite_i
]

Le rapport affiche « x sur 10 » lorsque dix items valides ont été présentés, sinon « x sur n items valides ».

Motifs d’échec :

- activation terminée hors cible ;
- délai dépassé ;
- geste non reconnu ;
- abandon ;
- aide ;
- incident non remplacé.

### 7.3 Activation incorrecte

Toute activation terminée hors cible incrémente le compteur. L’item se termine après la première activation lorsque la règle de la tâche le prévoit.

### 7.4 Précision

Pour le clic ou toucher, l’écart au centre est conservé comme mesure exploratoire :

[
Ecart_{mm} = distance(position_{activation}, centre_{cible})
]

Pour le glisser-déposer :

[
EcartDepot_{mm} = distance(centre_{objet déposé}, centre_{cible})
]

Le dépôt est réussi si le centre de l’objet se trouve dans la cible. L’écart est affiché même en cas d’échec, sauf absence de dépôt.

### 7.5 Double activation

Sont conservés :

- reconnaissance ou non par le navigateur et le dispositif ;
- intervalle brut entre les deux activations ;
- positions des deux activations ;
- motif d’échec.

Un appareil ne reconnaissant pas correctement le double-toucher reçoit le statut incompatible et n’est pas noté.

### 7.6 Regroupements

Les résultats sont regroupés sans fusion par :

- tâche ;
- dispositif ;
- taille 8, 16 ou 24 mm ;
- distance 50, 100 ou 150 mm ;
- direction principale.

Aucun indice unique de pointage n’est calculé dans la première version.

## 8. Repérage visuel

Sur dix items valides :

[
Réussites = sum réussite_i
]

[
Erreurs = N_{sélections incorrectes}+N_{délais}
]

Une seule sélection est autorisée. Un incident de pointage justifié annule et remplace l’item ; il ne compte ni comme réussite ni comme erreur.

Le rapport sépare :

- réussites sur n ;
- sélections incorrectes ;
- délais dépassés ;
- répétitions audio ;
- aides ;
- incidents ;
- résultats par interface ;
- résultats par densité visuelle.

Les temps bruts peuvent être conservés pour l’étude pilote, mais ne sont pas affichés dans le bilan principal tant que leur interprétation n’est pas validée.

## 9. Compréhension de consignes numériques

Pour les six items :

[
RéussitesAutonomes = sum réussite_i sans aide
]

Le rapport affiche :

- réussites autonomes sur n items valides ;
- réussites assistées séparément ;
- erreurs par notion ;
- répétitions audio autorisées ;
- aides et incidents ;
- réserve issue de l’entraînement.

Aucun temps de réponse n’est affiché.

## 10. Parcours de navigation

Pour chacun des quatre scénarios :

- réussite finale autonome ;
- réussite finale assistée ;
- échec ;
- délai ;
- abandon ;
- incompatible.

### 10.1 Étapes autonomes

[
TauxEtapesAutonomes = rac{N_{étapes validées sans aide}}{N_{étapes attendues valides}}	imes100
]

Le nombre brut « x sur n » reste l’affichage principal.

### 10.2 Actions incorrectes et retours

Chaque action sans effet attendu ou menant à un état non pertinent est comptée comme action incorrecte. Un retour arrière est compté séparément, même s’il corrige spontanément l’action.

### 10.3 Efficience descriptive

[
RatioParcours = rac{N_{actions minimales du chemin valide le plus court}}{N_{actions effectivement réalisées}}
]

Ce ratio, compris entre 0 et 1, est exploratoire et disponible dans l’export. Il n’est pas affiché comme score tant que les chemins valides n’ont pas été vérifiés.

## 11. Aides

Une aide reçoit :

- catégorie ;
- moment ;
- item ou étape ;
- auteur ;
- durée éventuelle ;
- texte libre facultatif.

Les résultats assistés ne sont jamais ajoutés aux réussites autonomes. Le rapport peut afficher simultanément « réussite finale » et « avec aide », sans transformer l’aide en pénalité numérique.

## 12. Comparaison avec adaptation

Une comparaison n’est calculée que lorsque :

- même capacité ;
- support équivalent ;
- même règle de cotation ;
- matériel compatible ;
- ordre et effet d’apprentissage documentés ;
- deux résultats complets ou partiels comparables.

Pour une mesure où une valeur élevée est favorable :

[
VariationRelative = rac{Valeur_{adaptée}-Valeur_{référence}}{Valeur_{référence}}	imes100
]

Pour une mesure où une valeur faible est favorable :

[
VariationRelative = rac{Valeur_{référence}-Valeur_{adaptée}}{Valeur_{référence}}	imes100
]

Si la valeur de référence est zéro, seule la différence absolue est affichée. Le terme « gain » n’est utilisé qu’au niveau de la tâche observée, jamais comme bénéfice général.

## 13. Agrégation interdite

La première version ne calcule pas :

- moyenne générale BCN ;
- note sur 10 globale ;
- classement entre jeunes ;
- âge numérique ;
- profil diagnostic automatique ;
- seuil rouge, orange ou vert ;
- percentile sans étalonnage ;
- conclusion causale.

## 14. Arrondis

Les calculs utilisent les valeurs non arrondies. L’affichage applique :

- débits : une décimale ;
- temps inférieur à 60 s : deux décimales ;
- temps supérieur ou égal à 60 s : minutes et secondes ;
- pourcentages : une décimale ;
- distances : un dixième de millimètre ;
- intervalles de double activation : millisecondes entières.

## 15. Exemples de référence

### Exemple A — Copie

- durée : 120 000 ms, soit 2 min ;
- 40 mots saisis ;
- 34 mots corrects ;
- 6 différences finales ;
- 8 Retours arrière et 2 Supprimer.

Résultats attendus :

- MPM = 20,0 ;
- MCPM = 17,0 ;
- exactitude = 85,0 % ;
- corrections validées affichées séparément : 8 et 2.

### Exemple B — Pointage

- 10 items valides ;
- 8 réussites ;
- 1 activation hors cible ;
- 1 délai ;
- temps réussis : 800, 900, 950, 1000, 1050, 1100, 1200 et 1400 ms.

Résultats attendus :

- réussites : 8/10 ;
- erreurs : une activation hors cible et un délai ;
- médiane des réussites : 1 025 ms.

### Exemple C — Repérage

- 10 items valides ;
- 7 réussites ;
- 2 sélections incorrectes ;
- 1 délai ;
- 1 incident annulé remplacé, non inclus dans les dix.

Résultats attendus :

- réussites : 7/10 ;
- erreurs : 3 ;
- incident : 1, affiché séparément.

### Exemple D — Navigation

- scénario de 4 étapes ;
- 3 étapes sans aide ;
- réussite finale avec une aide ;
- 6 actions réalisées pour un chemin minimal de 4.

Résultats attendus :

- réussite assistée ;
- étapes autonomes : 3/4, soit 75,0 % ;
- ratio exploratoire de parcours : 0,67.

## 16. Tests obligatoires des calculs

Chaque formule possède des tests couvrant :

- valeur nominale ;
- durée nulle ;
- dénominateur nul ;
- donnée manquante ;
- item annulé et remplacé ;
- aide ;
- incompatibilité ;
- résultat partiel ;
- arrondi ;
- migration depuis une version antérieure ;
- recalcul identique à partir des événements bruts.
