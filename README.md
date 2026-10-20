# BCN — Bilan de Capacité Numérique

> Projet public de conception d’un bilan fonctionnel standardisé des capacités numériques scolaires pour les jeunes de 8 à 18 ans.

## Statut du projet

**Phase : préproduction technique finalisée — production non lancée.**

BCN est actuellement un **projet personnel expérimental**. Son périmètre, son architecture, ses règles, ses contenus initiaux, ses maquettes, ses tests et son backlog sont définis. Les données et bilans restent localement sur l’appareil. Aucune diffusion à d’autres utilisateurs n’est encore décidée.

BCN est en cours de développement. Il ne s’agit actuellement ni d’un test étalonné, ni d’un outil diagnostique, ni d’un dispositif médical. Les scores, seuils et interprétations ne devront être présentés comme « normés » qu’après une validation méthodologique, une étude pilote et un étalonnage sur un échantillon approprié.

## Objectif

BCN vise à aider les professionnels à observer, de façon structurée et reproductible, la manière dont un jeune utilise un outil numérique dans un contexte scolaire :

- accès et prise en main du poste ;
- frappe au clavier ;
- pointage et manipulation ;
- repérage visuel dans une interface ;
- navigation et organisation des fichiers ;
- compréhension et exécution de consignes ;
- production scolaire numérique ;
- autonomie, stratégies, fatigue et confort ;
- bénéfice d’éventuelles adaptations.

L’outil distinguera les **mesures objectives** (temps, précision, erreurs, corrections, aides) des **observations professionnelles** (posture, stratégie, effort, autonomie).

## Public concerné

- Jeunes de 8 à 18 ans ;
- professionnels de l’éducation et de l’accompagnement ;
- ergothérapeutes et autres professionnels contribuant à l’évaluation fonctionnelle ;
- équipes participant aux futures études pilote et d’étalonnage.

Les contenus devront être adaptés aux tranches 8–10 ans, 11–14 ans et 15–18 ans. Les futures normes, si elles sont validées, seront définies selon des groupes plus fins et des conditions matérielles documentées.

## Principes

1. Consignes et conditions de passation explicites.
2. Résultats descriptifs, traçables et prudents.
3. Aucune conclusion psychologique ou diagnostique automatique.
4. Comparaison possible sans adaptation / avec adaptation.
5. Protection des données dès la conception.
6. Accessibilité et fonctionnement local sans cloud.
7. Validation scientifique progressive et transparente.

## Architecture prévue

- **Application de passation** : épreuves et chronométrage.
- **Espace professionnel** : contexte, matériel, aides et observations.
- **Moteur de cotation** : mesures brutes puis scores validés.
- **Rapport** : résultats, points d’appui, obstacles et préconisations.
- **Collecte de recherche** : export anonymisé distinct des bilans individuels.
- **Documentation** : manuel de passation, cotation et validation.

## Documentation

- [Cadrage scientifique et fonctionnel](docs/01-cadrage.md)
- [Domaines d’évaluation](docs/02-domaines-evaluation.md)
- [Protocole de validation](docs/03-protocole-validation.md)
- [Matrice capacités–épreuves–mesures](docs/05-matrice-capacites-epreuves.md)
- [Plan de préproduction](docs/07-plan-preproduction.md)
- [Règles transversales de passation](docs/08-regles-transversales-passation.md)
- [Profils professionnels et matrice des droits](docs/09-profils-droits.md)
- [Données et protection des mineurs](docs/10-donnees-protection-mineurs.md)
- [Sécurité et modèle de menaces](docs/11-securite-modele-menaces.md)
- [Architecture technique](docs/12-architecture-technique.md)
- [Interface, ergonomie et accessibilité](docs/13-interface-accessibilite.md)
- [Arborescence des écrans et parcours](docs/14-arborescence-parcours.md)
- [Stratégie d’essai personnel et d’expérimentation](docs/15-strategie-experimentation.md)
- [Cotation et indicateurs](docs/16-cotation-indicateurs.md)
- [Dictionnaire des données](docs/17-dictionnaire-donnees.md)
- [Rapport PDF et exports CSV](docs/18-rapports-exports.md)
- [Maquettes fonctionnelles](docs/19-maquettes-fonctionnelles.md)
- [Stratégie de tests et qualification](docs/20-strategie-tests-qualification.md)
- [Consignes et banques d’items](docs/21-consignes-banques-items.md)
- [Périmètre v1 et registre des risques](docs/22-perimetre-v1-risques.md)
- [Backlog de production](docs/23-backlog-production.md)
- [Revue de la porte d’entrée](docs/24-revue-porte-entree.md)
- [Feuille de route](ROADMAP.md)
- [Contribuer au projet](CONTRIBUTING.md)
- [Politique de sécurité](SECURITY.md)

## Mention d’usage

> BCN est un outil d’observation standardisé et d’aide à la préconisation en cours de validation. Il ne constitue pas un diagnostic médical ou paramédical et ne remplace pas une évaluation spécialisée.

## Indépendance du projet

BCN est un projet distinct d’EViC-Adapt. Son dépôt, son code, ses versions et sa documentation sont indépendants.

## Licence

Aucune licence de réutilisation n’est encore attribuée. En l’absence de fichier de licence, tous les droits restent réservés au titulaire du projet. Ce choix est volontairement différé : il sera réexaminé seulement après plusieurs mois d’usage personnel autorisé et une décision sur l’éventuelle diffusion.
