# Plan de préproduction et porte d’entrée en production

**Statut :** document de pilotage  
**Décision :** aucune phase de production de BCN ne commence avant validation de cette porte d’entrée.

## 1. Principe

La phase actuelle est une phase de **préproduction**. Elle sert à rendre explicites, cohérents et vérifiables les choix fonctionnels, méthodologiques, techniques, juridiques et organisationnels avant d’écrire le code de production.

Les documents, schémas, maquettes non fonctionnelles et analyses de faisabilité appartiennent à la préproduction. Aucun prototype codé, même partiel, ne doit être présenté comme une version de BCN tant que la porte d’entrée n’est pas validée.

Une expérimentation technique jetable ne pourra être réalisée que si elle est nécessaire pour lever une incertitude précise, explicitement autorisée et clairement séparée du futur code de production.

## 2. Règle de décision

Chaque sujet suit les états suivants :

1. **À étudier** — le besoin ou le problème est identifié.
2. **Proposé** — une ou plusieurs options et leurs conséquences sont décrites.
3. **Validé** — le porteur du projet a choisi explicitement une option.
4. **À vérifier au pilote** — la décision est retenue, mais une donnée empirique reste nécessaire.
5. **Figé pour la production** — la règle est suffisamment précise pour être développée et testée.

Une décision ayant un effet sur l’utilisateur, les données, les mesures, l’interprétation ou la sécurité ne peut pas être considérée comme implicite.

## 3. Blocs à finaliser avant la production

### A. Finalité et périmètre

- [ ] Finalité, limites d’usage et vocabulaire stabilisés.
- [ ] Public, professionnels autorisés et prérequis de formation définis.
- [ ] Périmètre exact de la première version fixé.
- [ ] Éléments explicitement exclus de la première version listés.
- [ ] Critères de succès et d’échec de la première version définis.

### B. Parcours utilisateurs

- [ ] Création et administration des profils décrites.
- [ ] Création, préparation, démarrage, pause, reprise et clôture d’une passation décrits.
- [ ] Consultation, modification, suppression et archivage d’un bilan décrits.
- [ ] Export PDF et CSV décrit de bout en bout.
- [ ] Tous les cas d’interruption, d’abandon, d’incident et de changement de matériel traités.
- [ ] Droits de chaque rôle définis dans une matrice d’autorisations.

### C. Épreuves et modules

Pour les quatre modules — frappe, pointage, repérage visuel, compréhension et navigation :

- [ ] capacité observée définie ;
- [ ] population et variantes d’âge définies ;
- [ ] matériel et variantes matérielles définis ;
- [ ] supports et banque d’items définis ;
- [ ] consigne exacte définie ;
- [ ] entraînement éventuel défini ;
- [ ] durée, pauses, arrêt et reprise définis ;
- [ ] aides autorisées et interdites définies ;
- [ ] événements et mesures enregistrés définis ;
- [ ] règles de réussite, d’erreur et de cotation définies ;
- [ ] incidents et limites d’interprétation définis ;
- [ ] contenu du rapport défini ;
- [ ] éléments restant à confirmer pendant le pilote identifiés.

### D. Cotation et restitution

- [ ] Formule exacte de chaque indicateur documentée.
- [ ] Jeux d’exemples avec résultats attendus préparés.
- [ ] Traitement des données manquantes et résultats partiels défini.
- [ ] Comparaisons autorisées et interdites définies.
- [ ] Séparation entre mesure, observation et interprétation garantie.
- [ ] Règles de génération du rapport PDF définies.
- [ ] Colonnes, types et règles d’anonymisation du CSV définis.
- [ ] Aucune référence ou norme non validée intégrée.

### E. Données et protection des mineurs

- [ ] Dictionnaire complet des données rédigé.
- [ ] Données obligatoires, facultatives, calculées et interdites distinguées.
- [ ] Modèle de données logique validé.
- [ ] Durées de conservation définies.
- [ ] Suppression, restauration et sauvegarde définies.
- [ ] Journalisation et historique définis.
- [ ] Information des jeunes et représentants légaux préparée.
- [ ] Base légale, responsabilités et besoin éventuel d’AIPD examinés.
- [ ] Séparation entre bilan individuel et données d’étude garantie.

### F. Sécurité

- [ ] Modèle de menaces réalisé.
- [ ] Règles relatives aux codes d’accès définies.
- [ ] Gestion des administrateurs et récupération d’accès définie.
- [ ] Protection des exports et avertissements définis.
- [ ] Comportement en cas de perte ou compromission de l’appareil défini.
- [ ] Limites du stockage local sans chiffrement explicitement acceptées.
- [ ] Procédure de signalement et de correction des vulnérabilités définie.

### G. Architecture technique

- [ ] Modes d’installation et de fonctionnement hors connexion décidés.
- [ ] Systèmes, navigateurs et appareils pris en charge listés.
- [ ] Architecture applicative choisie et justifiée.
- [ ] Stratégie de stockage local choisie.
- [ ] Gestion des versions, migrations et compatibilité décidée.
- [ ] Format interne des sessions et résultats défini.
- [ ] Gestion des contenus versionnés et fichiers audio définie.
- [ ] Dépendances externes et politique de mise à jour définies.
- [ ] Sauvegarde, restauration et portabilité décidées.

### H. Interface et accessibilité

- [ ] Arborescence des écrans définie.
- [ ] Maquettes des parcours principaux validées.
- [ ] États d’erreur, de chargement, de verrouillage et de reprise prévus.
- [ ] Niveau d’accessibilité cible défini.
- [ ] Navigation clavier, lecteur d’écran, contraste, zoom et tactile spécifiés.
- [ ] Adaptations susceptibles de modifier une mesure identifiées.
- [ ] Langage, lisibilité et compréhension des consignes vérifiés.

### I. Qualité et tests

- [ ] Critères d’acceptation de chaque fonction rédigés.
- [ ] Stratégie de tests unitaires, d’intégration et de bout en bout définie.
- [ ] Matrice appareils–systèmes–navigateurs préparée.
- [ ] Tolérances de chronométrage et de précision définies.
- [ ] Tests de reprise après interruption et perte d’énergie prévus.
- [ ] Tests de calcul fondés sur des cas connus préparés.
- [ ] Procédure de qualification d’une version candidate définie.

### J. Cadre scientifique, juridique et gouvernance

- [ ] Comité de suivi constitué.
- [ ] Responsabilités de décision et de validation définies.
- [ ] Licence du projet choisie.
- [ ] Droits de tous les textes, sons, visuels et contenus vérifiés.
- [ ] Protocole pilote et documents d’information préparés.
- [ ] Méthode d’analyse et critères de modification après pilote définis.
- [ ] Conditions d’emploi des termes « standardisé », « étalonné » et « normé » respectées.

### K. Préparation de la production

- [ ] Backlog de production découpé en tâches vérifiables.
- [ ] Ordre de développement et dépendances définis.
- [ ] Chaque tâche possède des critères d’acceptation.
- [ ] Risques techniques et fonctionnels prioritaires documentés.
- [ ] Stratégie de versionnement et de publication décidée.
- [ ] Documentation à produire pendant le développement planifiée.
- [ ] Revue finale de la porte d’entrée effectuée et consignée.

## 4. Conditions d’ouverture de la phase de production

La production peut commencer uniquement lorsque :

1. tous les points indispensables ci-dessus sont validés ou explicitement classés « à vérifier au pilote » ;
2. aucune ambiguïté bloquante ne subsiste sur les quatre modules, les données, la sécurité, les parcours et l’architecture ;
3. les critères d’acceptation du premier incrément sont écrits ;
4. le backlog de production correspond exactement au périmètre validé ;
5. l’autorisation de passage en production est inscrite dans GitHub.

## 5. Ordre de travail retenu

Les décisions seront prises dans cet ordre :

1. terminer Pointage et manipulation ;
2. concevoir Repérage visuel ;
3. concevoir Compréhension et navigation ;
4. finaliser les règles transversales de passation ;
5. définir le modèle de données et la protection ;
6. définir l’architecture technique ;
7. définir l’interface et l’accessibilité ;
8. finaliser les exports et la restitution ;
9. définir les tests et critères d’acceptation ;
10. finaliser le cadre juridique, scientifique et la gouvernance ;
11. effectuer la revue de préparation à la production.

Chaque groupe de décisions validées est reporté dans le cahier des charges, la matrice des épreuves ou le présent plan.
