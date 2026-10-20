# Périmètre v1 et registre des risques

**Statut : périmètre figé pour préparer la production**
**Nom de version :** BCN 1.0 expérimental

## 1. Finalité de la v1

Permettre à un professionnel de réaliser localement un bilan nominatif et descriptif des capacités numériques scolaires d’un jeune, avec quatre modules, mesures brutes traçables, observations séparées et rapport PDF.

## 2. Utilisateur initial

- un professionnel unique ;
- rôle administrateur local et professionnel ;
- ordinateur professionnel ;
- élèves du CM1 à la 3e pour le premier pilote ;
- conception extensible aux trois tranches 8–10, 11–14 et 15–18 ans.

## 3. Fonctions incluses

- coffre local chiffré ;
- dossier nominatif ;
- sélection indépendante des tâches ;
- passation sur plusieurs séances ;
- frappe : copie, dictée, manipulation ;
- pointage : clic/toucher, double activation, glisser-déposer ;
- repérage visuel ;
- compréhension et navigation ;
- entraînements ;
- pauses, incidents, aides et reprise ;
- mesures brutes et calculs versionnés ;
- bilan professionnel ;
- PDF nominatif ;
- CSV professionnel nominatif ;
- éventuel export d’étude distinct ;
- sauvegarde et restauration locales ;
- historique et audit ;
- fonctionnement hors connexion ;
- accessibilité de l’espace professionnel.

## 4. Éléments exclus

- serveur de données ;
- cloud et synchronisation ;
- compte en ligne ;
- partage automatique ;
- télémétrie ;
- application mobile native ;
- passation complète sur téléphone ;
- diagnostic ;
- note globale ;
- normes ou percentiles ;
- intelligence artificielle ;
- reconnaissance vocale ;
- enregistrement audio ou vidéo du jeune ;
- import d’un dossier scolaire ;
- messagerie ;
- signature électronique ;
- intégration à un ENT ;
- multi-établissement ;
- collaboration simultanée ;
- mise à jour silencieuse pendant une passation.

## 5. Critères de succès de la v1

- les quatre modules fonctionnent hors connexion ;
- aucune donnée réelle ne quitte l’appareil ;
- aucun calcul erroné dans les jeux d’or ;
- aucune perte après interruption testée ;
- PDF nominatif exact ;
- sauvegarde restaurable ;
- parcours utilisable par le professionnel ;
- consignes comprises par les groupes pilotes ;
- durée totale proche de 45 à 60 minutes selon les tâches choisies ;
- aucune anomalie critique ou majeure ;
- résultats descriptifs utiles au professionnel.

## 6. Critères d’échec

La v1 est arrêtée ou profondément revue si :

- perte ou fuite de données ;
- résultats non reproductibles ;
- consignes durablement incomprises ;
- mesures fortement dépendantes du navigateur sans contrôle ;
- calibration insuffisante ;
- durée ou fatigue incompatibles ;
- rapport inutilisable ;
- sauvegarde non fiable ;
- risque critique sans mesure raisonnable.

## 7. Registre des risques

| ID | Risque | Probabilité | Impact | Traitement |
|---|---|---:|---:|---|
| R01 | effacement du stockage navigateur | moyenne | critique | persistance, avertissement, sauvegarde |
| R02 | sauvegarde sur le même appareil | élevée | critique | recommander support externe local chiffré |
| R03 | mise à jour GitHub Pages compromise | faible | critique | CSP, versions figées, contrôle d’intégrité, mise à jour hors passation |
| R04 | phrase maîtresse perdue | moyenne | critique | clé de récupération testée |
| R05 | calibration physique inexacte | moyenne | majeure | carte ID-1, tolérances, incompatibilité |
| R06 | chronométrage perturbé | moyenne | majeure | performance.now, arrière-plan invalidant, tests |
| R07 | double-toucher variable | élevée | modérée | qualification par appareil, incompatible si instable |
| R08 | clavier virtuel différent | élevée | majeure | variantes séparées, pas de comparaison |
| R09 | banque trop facile ou difficile | moyenne | majeure | pilote, analyse plafond/plancher |
| R10 | consigne ambiguë | moyenne | majeure | entraînement, verbalisation, révision versionnée |
| R11 | alignement de frappe erroné | moyenne | majeure | jeux d’or, vérification professionnelle |
| R12 | résultat assisté interprété autonome | faible | majeure | statuts séparés et tests |
| R13 | identité affichée à l’élève | faible | majeure | séparation d’espaces, tests E2E |
| R14 | export local copié ensuite | moyenne | majeure | avertissement, journalisation |
| R15 | dépendance compromise | faible | critique | versions verrouillées, SBOM, analyse |
| R16 | incompatibilité d’un appareil | élevée | modérée | préflight, matrice, statut incompatible |
| R17 | portée fonctionnelle trop large | moyenne | majeure | exclusions figées, contrôle des changements |
| R18 | interprétation comme test normé | moyenne | majeure | mentions partout, absence de seuil |
| R19 | fatigue liée à la durée | moyenne | majeure | tâches indépendantes, pauses, plusieurs jours |
| R20 | données réelles dans un ticket | faible | critique | diagnostics sans données, règle documentaire |

## 8. Priorités

Bloquants avant toute passation réelle :

- R01, R02, R03, R04 ;
- R05 et R06 pour les mesures ;
- R11 et R12 pour la cotation ;
- R13 et R15 pour la sécurité.

À vérifier au pilote :

- R07 à R10 ;
- R16, R18 et R19.

## 9. Contrôle des changements

Toute demande après gel est classée :

- correction sans effet sur la mesure ;
- changement fonctionnel ;
- changement de mesure ;
- changement de contenu ;
- changement de sécurité ;
- changement de format.

Un changement de mesure ou contenu crée une nouvelle version et réexamine la comparabilité. Une fonction exclue ne peut entrer en v1 sans révision de la porte d’entrée.

## 10. Gouvernance minimale

Avant une éventuelle diffusion :

- le porteur décide du périmètre et accepte les versions ;
- les décisions sont consignées dans GitHub ;
- aucune contribution externe n’est intégrée sans vérification des droits ;
- la licence reste différée ;
- la version expérimentale porte une mention explicite ;
- chaque version candidate possède une fiche de qualification.
