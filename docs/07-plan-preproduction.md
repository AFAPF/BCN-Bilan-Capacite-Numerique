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

- [x] Finalité, limites d’usage et vocabulaire stabilisés.
- [x] Public, utilisateur initial et prérequis définis.
- [x] Périmètre exact de la première version fixé.
- [x] Éléments explicitement exclus de la première version listés.
- [x] Critères de succès et d’échec de la première version définis.

### B. Parcours utilisateurs

- [x] Création et administration des profils décrites.
- [x] Création, préparation, démarrage, pause, reprise et clôture d’une passation décrits.
- [x] Consultation, modification, suppression et archivage d’un bilan décrits.
- [x] Parcours et formats détaillés des exports PDF et CSV définis.
- [x] Tous les cas d’interruption, d’abandon, d’incident et de changement de matériel traités.
- [x] Droits de chaque rôle définis dans une matrice d’autorisations.

### C. Épreuves et modules

Pour les quatre modules — frappe, pointage, repérage visuel, compréhension et navigation :

- [x] capacité observée définie ;
- [x] population et variantes d’âge définies ;
- [x] matériel et variantes matérielles définis ;
- [x] supports et banque d’items initiale définis ;
- [x] consigne exacte initiale définie ;
- [x] entraînement défini ;
- [x] durée, pauses, arrêt et reprise définis ;
- [x] aides autorisées et interdites définies ;
- [x] événements et mesures enregistrés définis ;
- [x] règles de réussite, d’erreur et de cotation définies ;
- [x] incidents et limites d’interprétation définis ;
- [x] contenu du rapport défini ;
- [x] éléments restant à confirmer pendant le pilote identifiés.

### D. Cotation et restitution

- [x] Formule exacte de chaque indicateur documentée.
- [x] Jeux d’exemples avec résultats attendus préparés.
- [x] Traitement des données manquantes et résultats partiels défini.
- [x] Comparaisons autorisées et interdites définies.
- [x] Séparation entre mesure, observation et interprétation garantie.
- [x] Règles de génération du rapport PDF nominatif définies.
- [x] Colonnes et types du CSV nominatif, ainsi que l’export d’étude distinct, définis.
- [x] Aucune référence ou norme non validée intégrée.

### E. Données et protection des mineurs

- [x] Dictionnaire complet des données rédigé.
- [x] Données obligatoires, facultatives, calculées et interdites distinguées.
- [x] Modèle de données logique validé au niveau fonctionnel.
- [x] Durées de conservation recommandées définies, sous réserve de validation par l’organisme et son DPO.
- [x] Suppression, restauration et sauvegarde définies.
- [x] Journalisation et historique définis.
- [ ] Information des jeunes et représentants légaux préparée.
- [x] Base légale, responsabilités et besoin éventuel d’AIPD examinés ; validation locale encore requise.
- [x] Séparation entre bilan individuel et données d’étude spécifiée.

### F. Sécurité

- [x] Modèle de menaces réalisé.
- [x] Règles relatives aux codes d’accès définies.
- [x] Gestion des administrateurs et récupération d’accès définie.
- [x] Protection des exports et avertissements définis.
- [x] Comportement en cas de perte ou compromission de l’appareil défini.
- [x] Limites du stockage local et garanties du chiffrement applicatif explicitées.
- [x] Procédure de signalement et de correction des vulnérabilités spécifiée ; canal privé à configurer.

### G. Architecture technique

- [x] Modes d’installation et de fonctionnement hors connexion décidés.
- [x] Systèmes, navigateurs et appareils cibles listés ; versions minimales à qualifier.
- [x] Architecture applicative choisie et justifiée.
- [x] Stratégie de stockage local choisie.
- [x] Gestion des versions, migrations et compatibilité décidée.
- [x] Format interne des sessions et résultats défini.
- [x] Gestion des contenus versionnés et fichiers audio définie.
- [x] Dépendances externes cibles et politique de mise à jour définies ; versions à auditer au lancement.
- [x] Sauvegarde, restauration et portabilité décidées.

### H. Interface et accessibilité

- [x] Arborescence des écrans définie.
- [x] Maquettes fonctionnelles basse fidélité des parcours principaux validées.
- [x] États d’erreur, de chargement, de verrouillage et de reprise prévus.
- [x] Niveau d’accessibilité cible défini : RGAA 4.1.2 et WCAG 2.2 AA.
- [x] Navigation clavier, lecteur d’écran, contraste, zoom et tactile spécifiés.
- [x] Adaptations susceptibles de modifier une mesure identifiées et séparées des conditions standard.
- [x] Langage et lisibilité spécifiés ; compréhension classée à vérifier au pilote.

### I. Qualité et tests

- [x] Critères d’acceptation de chaque fonction rédigés.
- [x] Stratégie de tests unitaires, d’intégration et de bout en bout définie.
- [x] Matrice appareils–systèmes–navigateurs préparée.
- [x] Tolérances de chronométrage et de précision définies.
- [x] Tests de reprise après interruption et perte d’énergie prévus.
- [x] Tests de calcul fondés sur des cas connus préparés.
- [x] Procédure de qualification d’une version candidate définie.

### J. Cadre scientifique, juridique et gouvernance

- [ ] Comité de suivi constitué.
- [x] Responsabilités de décision produit et de validation technique définies pour la version personnelle.
- [ ] Licence du projet choisie.
- [ ] Droits de tous les textes, sons, visuels et contenus vérifiés.
- [ ] Protocole pilote et documents d’information préparés.
- [x] Méthode d’analyse et critères de modification après pilote définis.
- [x] Conditions d’emploi des termes « standardisé », « étalonné » et « normé » définies et respectées.

### K. Préparation de la production

- [x] Backlog de production découpé en tâches vérifiables.
- [x] Ordre de développement et dépendances définis.
- [x] Chaque tâche possède des critères d’acceptation.
- [x] Risques techniques et fonctionnels prioritaires documentés.
- [x] Stratégie de versionnement et de publication expérimentale décidée.
- [x] Documentation à produire pendant le développement planifiée.
- [x] Revue finale de la porte d’entrée effectuée et consignée ; lancement volontairement non autorisé.

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
