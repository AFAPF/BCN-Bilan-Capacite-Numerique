# BCN — Bilan de Connaissance Numérique

> Projet personnel expérimental d’évaluation structurée des connaissances numériques scolaires pour les jeunes de 8 à 18 ans.

## Statut du projet

**Phase : production — version expérimentale interactive 1.0.**

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

## Version actuellement disponible

- application React + TypeScript + Vite en mode strict ;
- PWA installable et interface mise en cache hors connexion ;
- stockage IndexedDB local sur l’appareil ;
- accès direct sans écran de verrouillage pendant la phase expérimentale ;
- migration unique proposée aux appareils utilisant encore l’ancien mot de passe ;
- pipeline GitHub Actions : lint, tests, build et GitHub Pages.
- création de dossiers fictifs ;
- sélection indépendante de huit modules de connaissances ;
- quarante missions de reconnaissance de commandes dans des interfaces simulées Windows, Android, Chrome, traitement de texte, Gmail et Outlook ;
- dix situations de traitement de texte couvrant enregistrer, gras, listes, annuler, rétablir, copier, couper, coller, souligner et imprimer ;
- icônes cohérentes avec chaque environnement grâce à Material Symbols et Fluent UI System Icons ;
- cinq recherches de documents à partir d’un chemin dans un explorateur simulé ;
- ouverture réaliste des dossiers par double-clic ou double-toucher et fichiers distracteurs ;
- mêmes questions et mêmes commandes au clic ou au toucher ;
- aucun clavier, double-clic, glisser-déposer ou appui long obligatoire ;
- grandes zones de réponse adaptées aux ordinateurs, tablettes et smartphones ;
- bilan descriptif local imprimable en PDF.
- téléchargement PDF et suppression confirmée directement depuis chaque dossier ;
- accueil compact et tableau de bord responsive dans la nouvelle identité BCN.
- historique complet des passations avec bilans individuels et courbe de progression ;
- consignes écrites et synthèse vocale française dans toutes les missions actives ;
- épreuves en plein écran sans barre de défilement interne.

Cette version permet de tester le parcours complet mais n’est pas encore une version pilote qualifiée. Elle doit être utilisée uniquement avec des données fictives jusqu’à la recette prévue au backlog.

### Développement local

```bash
npm ci
npm run dev
```

Contrôle complet avant intégration :

```bash
npm run check
```

## Architecture cible

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
- [Journal de production](docs/25-journal-production.md)
- [Modules complémentaires proposés](docs/26-modules-complementaires.md)
- [Feuille de route](ROADMAP.md)
- [Contribuer au projet](CONTRIBUTING.md)
- [Politique de sécurité](SECURITY.md)
- [Mentions des composants tiers](THIRD_PARTY_NOTICES.md)

## Mention d’usage

> BCN est un outil d’observation standardisé et d’aide à la préconisation en cours de validation. Il ne constitue pas un diagnostic médical ou paramédical et ne remplace pas une évaluation spécialisée.

## Indépendance du projet

BCN est un projet distinct d’EViC-Adapt. Son dépôt, son code, ses versions et sa documentation sont indépendants.

## Licence

Aucune licence de réutilisation n’est encore attribuée. En l’absence de fichier de licence, tous les droits restent réservés au titulaire du projet. Ce choix est volontairement différé : il sera réexaminé seulement après plusieurs mois d’usage personnel autorisé et une décision sur l’éventuelle diffusion.
