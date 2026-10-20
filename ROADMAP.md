# Feuille de route BCN

Cette feuille de route est complétée par le [plan de préproduction et la porte d’entrée en production](docs/07-plan-preproduction.md) et par la [stratégie d’essai personnel et d’expérimentation](docs/15-strategie-experimentation.md).

BCN est actuellement un projet personnel. Une éventuelle licence et une diffusion à d’autres utilisateurs seront étudiées seulement après qualification, autorisation d’une expérimentation professionnelle et plusieurs mois d’usage par le porteur.

## Règle de passage en production

**Aucun code de production BCN ne doit être développé tant que la porte d’entrée en production n’a pas été validée.**

La phase actuelle est une phase de préproduction : décisions, cahier des charges, matrice des épreuves, parcours, architecture, données, sécurité, accessibilité, maquettes, critères d’acceptation et préparation de la validation.

Une expérimentation technique jetable ne peut être envisagée que pour lever une incertitude précise, après autorisation explicite, et ne devient pas automatiquement du code de production.

## Phase 0 — Socle du projet

- [x] Créer un dépôt indépendant et public.
- [x] Définir le nom et le positionnement.
- [x] Publier le cadrage initial et les limites d’usage.
- [ ] Constituer le comité de suivi.
- [ ] Choisir la gouvernance et la licence — décision volontairement différée jusqu’au retour d’usage.

## Phase 1 — Préproduction et cahier des charges

- [x] Définir complètement les profils utilisateurs et leurs droits.
- [x] Définir les parcours de passation et de gestion des bilans.
- [x] Établir la matrice complète des capacités évaluées.
- [x] Spécifier les quatre modules du premier prototype.
- [x] Définir les exigences d’accessibilité.
- [x] Définir le modèle de données et la protection des données.
- [x] Définir l’architecture technique et le fonctionnement hors connexion.
- [x] Définir les rapports PDF et exports CSV.
- [x] Rédiger les critères d’acceptation de la version pilote.
- [x] Découper le backlog de production.
- [x] Effectuer la revue de la porte d’entrée en production.
- [ ] Autoriser explicitement le démarrage de la production.

Ordre de conception des modules :

1. terminer frappe au clavier ;
2. terminer pointage et manipulation ;
3. concevoir repérage visuel ;
4. concevoir compréhension et navigation.

## Phase 2 — Production du prototype minimal

Cette phase est préparée mais reste fermée jusqu’à l’ordre explicite du porteur.

Modules initiaux :

1. frappe au clavier ;
2. pointage et manipulation ;
3. repérage visuel ;
4. compréhension et navigation.

Fonctions transversales :

- contexte de passation ;
- profils, droits et verrouillage ;
- mesures brutes traçables ;
- observations séparées ;
- sauvegarde locale et reprise ;
- rapport PDF ;
- export CSV professionnel nominatif ;
- historique des modifications ;
- tests automatiques.

## Phase 3 — Standardisation

- [x] Rédiger les spécifications de toutes les épreuves.
- [x] Fixer les consignes verbatim initiales.
- [x] Définir les règles de cotation et les incidents.
- [ ] Produire le manuel de passation.
- [ ] Former plusieurs évaluateurs pour les essais.

## Phase 4 — Expérimentation personnelle autorisée et étude pilote

- [ ] Finaliser le protocole et les documents d’information.
- [ ] Obtenir l’accord de la structure, identifier le responsable du traitement et obtenir les validations nécessaires.
- [ ] Tester d’abord avec des données fictives, puis tester compréhension, faisabilité et stabilité dans le périmètre autorisé.
- [ ] Analyser les retours et modifier les épreuves.
- [ ] Geler une version candidate.

## Phase 5 — Validation et étalonnage

- [ ] Préenregistrer le plan d’analyse.
- [ ] Recruter l’échantillon défini.
- [ ] Contrôler la qualité des données.
- [ ] Étudier les propriétés de mesure.
- [ ] Construire et valider les références.
- [ ] Publier méthodes, résultats et limites.

## Phase 6 — Version professionnelle

- [ ] Intégrer uniquement les scores validés.
- [ ] Finaliser le manuel et la formation.
- [ ] Effectuer les revues d’accessibilité, sécurité et conformité.
- [ ] Publier une version stable clairement identifiée.
