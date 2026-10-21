# Journal de production

## 20 octobre 2026 — lancement autorisé

Le porteur a donné l’ordre explicite de créer le code. La production est donc lancée conformément à la porte d’entrée décrite dans `24-revue-porte-entree.md`.

### Incrément 01 — socle local sécurisé

État : implémenté et contrôlé automatiquement.

- React, TypeScript strict et Vite ;
- PWA installable, cache applicatif et démarrage hors connexion après une première ouverture ;
- aucun service applicatif, outil de suivi ou appel réseau de données ;
- coffre IndexedDB transactionnel ;
- AES-256-GCM pour les données ;
- PBKDF2-SHA-256 à 600 000 itérations pour envelopper la clé de données ;
- phrase secrète jamais enregistrée ;
- verrouillage automatique après 30 minutes ;
- ralentissement progressif après cinq échecs ;
- sauvegarde chiffrée avec empreinte SHA-256 ;
- restauration après contrôle d’intégrité, déchiffrement et confirmation explicite ;
- journal d’audit local minimal ;
- interface clavier, responsive, zoomable et compatible avec la réduction des animations ;
- pipeline de qualité et publication GitHub Pages.

### Limites volontaires

Conformément au découpage validé, cet incrément ne crée aucun dossier jeune et ne propose aucune épreuve. Seules des données fictives doivent être utilisées jusqu’à la qualification des lots concernés.

### Contrôles

La commande de référence est `npm run check`. Elle exécute successivement le lint, les tests automatisés et le build de production.

## 20 octobre 2026 — version d’essai interactive 0.2

À la demande du porteur, un parcours testable de bout en bout est ajouté :

- migration automatique du coffre de schéma 1 vers le schéma 2 ;
- dossiers nominatifs locaux — données fictives imposées à ce stade ;
- création et reprise d’une passation ;
- sélection indépendante des tâches ;
- copie chronométrée et premiers calculs de débit ;
- dix cibles pour le clic simple, le double-clic et le glisser-déposer ;
- dix items de repérage visuel avec consigne vocale locale ;
- six items de compréhension ;
- quatre scénarios simulés de navigation ;
- bilan descriptif par tâche et impression PDF par le navigateur.

Cette version sert à éprouver l’ergonomie et le fonctionnement général. Elle ne remplace pas la qualification des protocoles, contenus, mesures physiques, délais et règles de cotation prévue dans les lots suivants.

## 21 octobre 2026 — correction du repérage visuel

Après le premier essai complet du porteur :

- la zone de réponse n’affiche plus aucun nom sous les icônes ;
- seules les icônes constituent les réponses visibles ;
- chaque consigne décrit précisément la fonction de l’icône attendue ;
- les dix cibles sont dossier, imprimer, enregistrer, message, rechercher, pièce jointe, corbeille, réglages, calendrier et verrouiller ;
- les densités sont réparties en trois faibles, quatre moyennes et trois fortes ;
- les interfaces alternent entre « Bureau et fichiers » et « Document et barre d’outils ».

## 21 octobre 2026 — repérage en trois phases et raccourcis

À la suite du deuxième essai du porteur :

- le repérage visuel passe à quinze items ;
- phase 1 : navigation Windows ;
- phase 2 : icônes de traitement de texte ;
- phase 3 : fichiers et actions courantes ;
- une barre de progression distingue clairement les trois phases ;
- une nouvelle tâche indépendante simule deux fenêtres ;
- les actions évaluées sont tout sélectionner, copier, changer de fenêtre, coller, couper, annuler et rétablir ;
- chaque étape est guidée et les actions incorrectes sont comptées sans bloquer l’élève ;
- les raccourcis sont évalués séparément de la capacité à réaliser la même action par les menus.

## 21 octobre 2026 — gestion des fichiers et dossiers 0.4

Le premier module fonctionnel d’autonomie informatique est ajouté :

- explorateur de fichiers entièrement simulé et utilisable hors connexion ;
- sept actions guidées : ouvrir, créer, renommer, déplacer, rechercher, supprimer et enregistrer ;
- sélection et double-clic distincts, barre d’actions, recherche et boîtes de dialogue ;
- comptage séparé des actions autonomes, erreurs d’action, aides et durée totale ;
- bouton professionnel « Signaler une aide » : l’étape est enregistrée avec aide puis le scénario continue dans un état cohérent ;
- aucune modification n’est effectuée sur les véritables fichiers de l’appareil.

## 21 octobre 2026 — recentrage théorique et universel 0.5

À la demande du porteur, les nouvelles passations ne contiennent plus d’épreuves pratiques dépendantes du matériel :

- une seule version est utilisée sur ordinateur, tablette et smartphone ;
- les réponses reposent uniquement sur de grands boutons activables au clic ou au toucher ;
- huit modules : interface, fichiers, traitement de texte, Internet, communication, sécurité, résolution de problèmes et outils d’adaptation ;
- cinq situations théoriques par module, soit quarante items lorsque tout est sélectionné ;
- aucun clavier, double-clic, glisser-déposer, appui long ou raccourci n’est obligatoire ;
- l’ordre visuel des réponses varie pour éviter que la première proposition soit systématiquement correcte ;
- le bilan décrit des connaissances numériques et ne prétend plus mesurer une maîtrise pratique ou gestuelle ;
- les anciennes passations restent lisibles dans l’historique local mais les anciennes épreuves ne sont plus proposées.

## 21 octobre 2026 — missions visuelles et explorateur 0.6

Après l’essai de la version 0.5, les questionnaires textuels jugés trop simples sont remplacés par des activités plus visuelles :

- trente-cinq missions demandent de reconnaître une icône à partir d’une fonction ou d’une situation ;
- les réponses utilisent des icônes SVG intégrées à l’application, identiques sur tous les systèmes ;
- les catégories couvrent interface, traitement de texte, navigateur, messagerie, sécurité, dépannage et outils d’adaptation ;
- une progression ludique affiche mission, contexte et avancement sans révéler la réussite pendant la passation ;
- le module fichiers propose cinq chemins à suivre dans un explorateur simulé ;
- l’élève ouvre les dossiers, sélectionne le document demandé puis utilise le bouton « Ouvrir » ;
- les erreurs de navigation, chemins trouvés sans erreur et durées sont conservés dans le bilan ;
- toutes les commandes restent réalisables par un toucher simple ou un clic.
