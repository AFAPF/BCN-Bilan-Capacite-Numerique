# Rapport PDF et exports CSV

**Statut : spécification fonctionnelle figée pour la production**
**Règle :** export local uniquement. Aucun fichier n’est envoyé ou partagé automatiquement.

## 1. Principes

Le rapport distingue visuellement :

1. contexte et conditions ;
2. mesures objectives ;
3. aides et incidents ;
4. observations professionnelles ;
5. interprétation et préconisations rédigées par le professionnel.

Aucune note globale, couleur de classement, diagnostic ou norme non validée.

## 2. Types de restitution

### Bilan à l’écran

Vue détaillée et interactive, source de vérité pour le professionnel.

### PDF individuel

Document lisible destiné à être conservé ou communiqué selon les règles du professionnel.

### CSV de travail

Données structurées nominatives d’une ou plusieurs passations.

### CSV d’étude

Sous-ensemble séparé, sans texte libre, identifiant direct ou information inutile.

### Sauvegarde BCN

Conteneur chiffré destiné à la restauration ; ce n’est pas un export d’analyse.

## 3. En-tête du PDF

L’en-tête contient :

- titre « BCN — Bilan de Connaissance Numérique » ;
- mention « version expérimentale non étalonnée » ;
- nom et prénom du jeune ;
- âge en années et mois ;
- niveau scolaire ;
- date ou période de passation ;
- professionnel ;
- version BCN ;
- statut : complet, partiel ou interrompu.

Le bilan professionnel est nominatif. Le nom et le prénom proviennent du dossier local chiffré.

## 4. Structure du PDF

### Page 1 — Synthèse descriptive

- objectif et limites ;
- tâches réalisées ;
- tâches non réalisées et motifs ;
- conditions standard ou adaptées ;
- points d’appui observés ;
- difficultés observées ;
- aides nécessaires ;
- réserves principales ;
- préconisations du professionnel.

La synthèse est rédigée ou validée par le professionnel. BCN peut proposer des phrases descriptives fondées sur les données, mais jamais une conclusion automatique causale.

### Pages suivantes — Résultats

Un tableau compact par tâche :

| Élément | Contenu |
|---|---|
| tâche | nom et variante |
| statut | complet, partiel, assisté, incompatible |
| matériel | appareil et dispositif |
| résultats | indicateurs propres à la tâche |
| erreurs | nombres et motifs |
| aides | catégories et items concernés |
| incidents | nature et effet |
| réserve | limite de comparaison |
| observation | texte professionnel distinct |

### Fin du rapport

- adaptations ;
- incidents transversaux ;
- observations ;
- préconisations ;
- versions des contenus et règles ;
- limites d’interprétation ;
- date de génération ;
- mention légale ;
- historique des avenants.

## 5. Tableaux par module

### Frappe

Copie et dictée :

- durée active ;
- mode de cotation ;
- MPM ;
- MCPM ;
- exactitude descriptive ;
- Retour arrière ;
- Supprimer ;
- erreurs finales par catégorie ;
- arrêt éventuel ;
- alignement automatique, vérifié ou corrigé.

Manipulation :

- réussites autonomes sur tâches valides ;
- réussite assistée ;
- temps par tâche ;
- actions incorrectes ;
- aides.

### Pointage

Pour chaque tâche :

- réussites sur items valides ;
- médiane des temps réussis ;
- activations incorrectes ;
- délais ;
- précision du dépôt ;
- intervalle brut de double activation ;
- résultats regroupés par taille, distance et direction ;
- dispositif et calibration.

### Repérage visuel

- réussites sur items valides ;
- sélections incorrectes ;
- délais ;
- résultats par interface ;
- résultats par densité ;
- répétitions audio ;
- aides ;
- incidents remplacés.

### Compréhension

- réussites autonomes sur 6 items valides ;
- réussites assistées ;
- erreurs par notion ;
- répétitions audio ;
- réserve d’entraînement.

### Navigation

- scénarios autonomes, assistés et échoués ;
- étapes autonomes sur étapes attendues ;
- actions incorrectes ;
- retours en arrière ;
- délais et abandons ;
- aides et incidents.

## 6. Comparaison avec adaptation

Une section côte à côte est générée seulement si les conditions sont comparables selon les règles de cotation.

Elle affiche :

- valeur de référence ;
- valeur adaptée ;
- différence absolue ;
- variation relative lorsqu’elle est calculable ;
- coût éventuel sur une autre mesure ;
- limites.

Le texte utilise « variation observée sur cette tâche » et non « amélioration générale ».

## 7. Phrases automatiques autorisées

Exemples :

- « 8 cibles réussies sur 10. »
- « Deux échecs ont été enregistrés : une activation hors cible et un délai dépassé. »
- « La tâche a été réalisée avec une aide de repérage visuel. »
- « Les résultats ont été obtenus avec un pavé tactile et ne sont pas comparés à une référence souris. »

Sont interdites :

- « niveau faible » ;
- « retard numérique » ;
- « manque d’attention » ;
- « trouble moteur » ;
- « résultat normal » ;
- toute recommandation clinique automatique.

## 8. Accessibilité du PDF

Le PDF doit comporter :

- titre de document ;
- langue française ;
- structure de titres ;
- ordre de lecture ;
- texte réel sélectionnable ;
- tableaux avec en-têtes ;
- signification indépendante de la couleur ;
- contraste conforme ;
- liens explicites ;
- métadonnées ;
- pagination ;
- vérification au lecteur d’écran ;
- impression lisible en niveaux de gris.

## 9. Mise en page

- format A4 portrait ;
- marges de 15 mm minimum ;
- corps de texte équivalent à 10,5 points minimum ;
- tableaux sans coupure de ligne d’en-tête ;
- nouvelle page si un tableau ne peut pas rester lisible ;
- pied de page avec code jeune, version et pagination ;
- aucune donnée dans le nom du fichier sauf code pseudonymisé.

Nom recommandé :

`BCN_<code>_<date>_v<rapport>.pdf`

## 10. Export CSV de travail

L’export recommandé est un dossier local contenant quatre fichiers UTF-8 avec séparateur point-virgule et en-tête.

### assessments.csv

Une ligne par passation :

- assessment_id ;
- participant_code ;
- last_name ;
- first_name ;
- age_years ;
- age_months_remainder ;
- age_band ;
- school_level ;
- condition ;
- assessment_status ;
- started_at ;
- closed_at ;
- app_version ;
- rules_version ;
- interpretation_reserve.

### tasks.csv

Une ligne par tâche :

- assessment_id ;
- session_id ;
- task_instance_id ;
- module_code ;
- task_code ;
- age_variant ;
- device_variant ;
- content_version ;
- scoring_mode ;
- task_status ;
- comparability ;
- active_duration_ms ;
- training_attempts ;
- training_reserve ;
- primary_result_code ;
- primary_result_value ;
- primary_result_unit.

Les tâches ayant plusieurs indicateurs génèrent plusieurs lignes distinguées par primary_result_code ou sont complétées par metrics.csv.

### metrics.csv

Une ligne par indicateur :

- assessment_id ;
- task_instance_id ;
- item_id ;
- metric_code ;
- metric_value_number ;
- metric_value_text ;
- unit ;
- numerator ;
- denominator ;
- formula_version ;
- comparability.

### items.csv

Une ligne par item :

- assessment_id ;
- task_instance_id ;
- item_id ;
- content_item_id ;
- sequence_number ;
- replacement_for ;
- item_status ;
- success ;
- failure_reason ;
- response_duration_ms ;
- audio_repeat_count ;
- help_count ;
- incident_count.

Les charges utiles détaillées propres aux tâches restent dans la sauvegarde ou dans un export technique explicitement choisi ; elles ne sont pas aplaties arbitrairement dans le CSV principal.

## 11. observations.csv facultatif

Fichier distinct, jamais inclus par défaut :

- assessment_id ;
- task_instance_id ;
- observation_category ;
- observation_value_code ;
- observation_note ;
- author_code ;
- created_at.

Un avertissement rappelle que le texte libre peut contenir des informations indirectement identifiantes.

## 12. Export d’étude distinct

Le paquet d’étude contient uniquement :

- identifiant d’étude nouvellement généré ;
- tranche d’âge ;
- niveau scolaire ;
- variante matérielle ;
- versions ;
- indicateurs nécessaires ;
- statuts de qualité et comparabilité ;
- incidents codés utiles.

Il exclut :

- participant_code local ;
- identifiant de dossier ;
- profil professionnel ;
- date et heure précises, remplacées si nécessaire par une période ;
- textes libres ;
- chemins locaux ;
- audit ;
- notes ;
- données non nécessaires au protocole.

Aucun export d’étude n’est créé automatiquement.

## 13. Types CSV

- identifiant : chaîne ;
- date : AAAA-MM-JJ ;
- date-heure : ISO 8601 ;
- entier : chiffres sans séparateur ;
- décimal : point dans la valeur brute ;
- booléen : true ou false ;
- enum : code stable ;
- valeur absente : cellule vide ;
- listes : interdites dans une cellule principale ; table séparée ;
- texte : guillemets RFC 4180 et échappement doublé.

Le séparateur point-virgule facilite l’ouverture en environnement francophone. Un manifeste indique séparateur, encodage et version.

## 14. Manifeste d’export

Chaque export inclut ou journalise :

- type ;
- date ;
- version ;
- périmètre ;
- nombre de lignes par fichier ;
- empreinte SHA-256 ;
- profil d’anonymisation ;
- succès ou échec ;
- destination locale non sensible.

## 15. Contrôles avant export

L’écran récapitule :

- fichiers produits ;
- passations incluses ;
- présence éventuelle de texte libre ;
- statut pseudonymisé ;
- emplacement local ;
- protection du fichier ;
- avertissement sur la copie ultérieure.

Le bouton final indique l’action exacte : « Enregistrer le PDF » ou « Enregistrer les CSV ».

## 16. Échec et reprise

- génération dans un fichier temporaire local ;
- validation de la structure ;
- calcul de l’empreinte ;
- déplacement atomique vers la destination ;
- suppression du temporaire ;
- journalisation du succès seulement après validation ;
- message clair et aucune trace de succès en cas d’échec.

## 17. Critères d’acceptation

- le PDF contient le nom et le prénom exacts du dossier local ;
- chaque chiffre du PDF est reproductible depuis les données brutes ;
- une tâche incompatible n’affiche pas zéro ;
- les aides restent séparées des réussites autonomes ;
- aucun classement ou seuil non validé ;
- le PDF reste lisible sans couleur ;
- les CSV respectent les types et en-têtes définis ;
- le CSV de travail est nominatif ;
- l’export d’étude distinct ne contient aucun identifiant local ni texte libre ;
- l’export reste local ;
- l’empreinte enregistrée correspond au fichier produit.
