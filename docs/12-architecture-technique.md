# Architecture technique de la première version

**Statut : architecture cible recommandée — aucun code de production autorisé avant validation de la porte d’entrée**
**Décision structurante :** application web progressive locale, installable et hors connexion, sans serveur dans la première version.

## 1. Choix retenu

BCN v1 est une application web progressive responsive :

- interface exécutée localement dans un navigateur compatible ;
- installation possible lorsque la plateforme le permet ;
- ressources applicatives mises en cache pour le fonctionnement hors connexion ;
- données conservées uniquement sur l’appareil ;
- aucune API distante nécessaire à la passation ;
- aucune synchronisation, télémétrie ou compte en ligne ;
- sauvegardes et exports déclenchés par un utilisateur autorisé.

Ce choix maximise la compatibilité ordinateur–tablette et limite l’infrastructure. Il impose en contrepartie une sauvegarde explicite : le stockage d’un site peut être effacé par l’utilisateur, le navigateur ou la gestion de l’appareil.

Références :

- [IndexedDB — MDN](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) ;
- [Quotas et éviction — MDN](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria) ;
- [Demande de stockage persistant — MDN](https://developer.mozilla.org/en-US/docs/Web/API/StorageManager/persist) ;
- [Web Cryptography Level 2 — W3C](https://www.w3.org/TR/webcrypto-2/).

## 2. Périmètre des appareils

### Passation notée

Support cible :

- ordinateur portable ou fixe avec clavier et dispositif de pointage ;
- tablette avec écran tactile et, pour la frappe physique, clavier connecté ;
- écran dont la calibration physique est validée ;
- orientation verrouillée pendant une tâche.

Les téléphones ne sont pas pris en charge pour une passation notée complète : les distances physiques prévues jusqu’à 150 mm, la densité visuelle et les tâches document–barre d’outils ne peuvent pas y être garanties.

### Administration et consultation

La consultation ou la préparation peut être responsive sur téléphone, mais elle n’est pas qualifiée dans la première version pour créer un résultat comparable.

## 3. Systèmes et navigateurs

Politique recommandée au lancement :

| Plateforme | Navigateur qualifié | Usage |
|---|---|---|
| Windows 11 | Chrome ou Edge, version courante et précédente | complet |
| macOS maintenu | Safari ou Chrome, version courante et précédente | complet |
| ChromeOS maintenu | Chrome courant | complet |
| iPadOS maintenu | Safari courant et précédent | tactile et clavier externe |
| Android maintenu, tablette | Chrome courant et précédent | tactile et clavier externe |
| Linux | Chrome/Chromium ou Firefox ESR après qualification | pilote, sans garantie initiale |

Firefox desktop reste utilisable dans le navigateur si les tests passent ; son installation PWA n’est pas une exigence. Chaque version candidate est testée sur une matrice réelle. Une plateforme non qualifiée peut être utilisée seulement avec le statut « résultats bruts, sans comparaison ».

## 4. Architecture logique

Les couches sont séparées :

1. présentation accessible ;
2. orchestration des parcours et machine d’état ;
3. moteur d’épreuves ;
4. domaine métier et règles de cotation ;
5. journal d’événements ;
6. stockage, chiffrement et migrations ;
7. génération de rapports et exports ;
8. gestion des contenus versionnés ;
9. service worker et mise à jour.

Les règles de cotation ne dépendent pas des composants visuels. Les événements bruts précèdent toujours les agrégats calculés.

## 5. Socle technique

Choix recommandés :

- TypeScript strict ;
- React pour les écrans et composants ;
- Vite pour la construction ;
- service worker généré et contrôlé, sans logique métier ;
- IndexedDB derrière un adaptateur de persistance unique ;
- Web Crypto pour le chiffrement ;
- schémas de validation exécutables pour imports, stockage et migrations ;
- tests unitaires avec Vitest ;
- tests de composants accessibles ;
- tests de bout en bout avec Playwright.

Les versions ne seront épinglées qu’au démarrage autorisé de la production, après audit des versions maintenues. Toute dépendance doit avoir une finalité documentée, une licence compatible et une solution de retrait.

## 6. Stockage

IndexedDB contient :

- un en-tête minimal non sensible : version de format, paramètres cryptographiques et identifiant aléatoire du coffre ;
- des enregistrements chiffrés pour profils, identités, passations, observations et audit ;
- les contenus d’épreuve versionnés nécessaires hors connexion ;
- les files d’opérations locales, sans synchronisation réseau.

localStorage est interdit pour toute donnée personnelle, secret, résultat ou état de passation. Il peut au plus contenir une préférence d’interface non sensible.

Au premier usage réel, l’application :

1. demande le stockage persistant ;
2. affiche si la demande est refusée ;
3. exige la création et la vérification d’une sauvegarde chiffrée ;
4. estime périodiquement l’espace disponible ;
5. bloque une nouvelle passation si l’intégrité ou l’espace minimal ne sont pas garantis.

## 7. Écriture atomique et reprise

Chaque action produit un événement immuable identifié de façon aléatoire. Un lot transactionnel écrit ensemble :

- l’événement ;
- l’état courant dérivé ;
- le point de reprise ;
- l’entrée d’audit nécessaire.

Après interruption, l’application vérifie le dernier lot complet. Aucun item partiel ne devient silencieusement réussi ou échoué. La règle du module décide s’il doit être repris, annulé ou conservé comme incident.

## 8. Temps et horodatage

- performance.now() mesure les durées à l’intérieur d’un item ;
- l’horloge civile date les séances et événements ;
- les durées ne sont jamais calculées par différence entre deux dates civiles ;
- pause, arrière-plan, verrouillage et changement de visibilité sont enregistrés ;
- un item noté passant en arrière-plan est interrompu et traité selon sa règle ;
- résolution et dérive du chronomètre sont qualifiées sur chaque plateforme.

Les mesures brutes conservent l’unité, la résolution observée et la version du moteur.

## 9. Calibration physique

Les dimensions CSS ne prouvent pas la taille physique réelle de l’écran.

Ordre retenu :

1. utiliser une donnée matérielle fiable seulement si la plateforme la fournit et si elle est cohérente ;
2. sinon lancer la calibration manuelle avec une carte bancaire au format ID-1 ;
3. enregistrer méthode, facteur, date, appareil, écran, zoom, orientation et résolution ;
4. invalider la calibration si écran, zoom, résolution ou orientation change ;
5. recommencer toute tâche affectée.

Si la surface disponible ne permet pas la taille de cible et la distance demandées avec les marges prévues, l’item n’est pas compressé : la configuration est déclarée incompatible.

## 10. Souris, tactile et événements

Chaque épreuve conserve le type de pointeur fourni par la plateforme.

- clic simple : fin de l’activation dans la cible ;
- double-clic souris ou pavé tactile : événement double-clic reconnu par le navigateur, intervalle brut conservé ;
- double-toucher : qualification spécifique de l’appareil ; s’il n’est pas reconnu de façon fiable, épreuve incompatible ;
- glisser-déposer : capture du pointeur, trajectoire brute limitée aux points utiles, position finale du centre.

Le réglage système de double-clic n’est généralement pas lisible directement par une application web. BCN s’appuie donc sur la reconnaissance effective navigateur–système et enregistre l’intervalle observé. Cette limite figure dans le rapport technique.

## 11. Contenus et audio

Les banques d’items, consignes, audios et règles forment des paquets versionnés et signés dans le processus de publication.

Un paquet contient :

- identifiant et version ;
- tranche d’âge ;
- fichiers et empreintes ;
- règles de compatibilité ;
- date et statut ;
- historique de correction.

Une passation référence définitivement la version utilisée. Une mise à jour ne remplace jamais le contenu d’une passation passée.

Les consignes audio utilisent des fichiers préproduits avec une voix synthétique fixe. La synthèse du navigateur n’est pas utilisée pour un item noté, car voix et rythme varient selon l’appareil.

## 12. Versions et migrations

Le format interne utilise un numéro de schéma entier et une version sémantique de l’application.

- migration unidirectionnelle, transactionnelle et testée ;
- sauvegarde obligatoire avant migration majeure ;
- contrôle d’intégrité après migration ;
- refus explicite d’un fichier provenant d’une version plus récente inconnue ;
- conservation des règles anciennes nécessaires à la lecture des bilans ;
- jamais de recalcul silencieux avec une nouvelle formule.

Un rapport indique versions de l’application, du contenu, du schéma et des règles.

## 13. Sauvegarde et portabilité

La sauvegarde BCN est un conteneur chiffré comprenant :

- manifeste ;
- version de schéma ;
- données chiffrées ;
- contenus nécessaires ;
- journal d’intégrité ;
- empreintes.

La restauration se fait dans un nouveau coffre ou après comparaison explicite. L’écrasement direct est interdit.

Rythme recommandé :

- rappel après toute journée contenant une nouvelle passation ;
- sauvegarde obligatoire avant mise à jour majeure ;
- test de restauration trimestriel ;
- au moins deux copies chiffrées sur supports ou emplacements distincts selon la politique de l’organisme.

## 14. Mises à jour hors connexion

Le service worker télécharge une version en attente sans remplacer l’application active pendant une passation. L’activation nécessite :

- aucune passation active ;
- sauvegarde compatible disponible lorsque migration requise ;
- information sur la version ;
- confirmation d’un administrateur pour une migration majeure.

En cas d’échec, l’ancienne version fonctionnelle reste active.

## 15. Réseau et confidentialité

En mode de passation, la politique attendue est zéro requête réseau. Les seules connexions admises hors passation sont :

- téléchargement explicite d’une mise à jour ;
- ouverture volontaire d’un lien documentaire ;
- futur service distinct, non inclus dans v1 et soumis à nouvelle décision.

Aucune police, icône, audio, analyse d’usage ou bibliothèque ne dépend d’un CDN à l’exécution.

## 16. Critères d’acceptation

- une installation préparée termine une passation complète sans réseau ;
- aucune requête réseau n’est observée pendant la passation ;
- un rechargement ou une coupure restaure le dernier état atomique ;
- le changement d’orientation invalide la tâche concernée ;
- un écran trop petit refuse l’item plutôt que de le redimensionner ;
- une mise à jour n’interrompt jamais un item ;
- une ancienne passation reste lisible avec ses versions ;
- une sauvegarde corrompue est refusée ;
- un navigateur refusant le stockage persistant déclenche l’avertissement et la sauvegarde obligatoire ;
- les données du site supprimées sont récupérables depuis la sauvegarde chiffrée testée.

## 17. Décisions restant à qualifier avant production

- versions minimales exactes après tests sur appareils réels ;
- dépendance IndexedDB et solution Argon2id retenues après audit ;
- format binaire précis de sauvegarde ;
- seuil minimal d’espace libre ;
- tolérances de chronométrage ;
- comportement exact en arrière-plan selon chaque plateforme ;
- test de la reconnaissance du double-toucher ;
- faisabilité d’une installation administrée dans les établissements ;
- stratégie de signature et de distribution des versions.
