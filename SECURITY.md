# Politique de sécurité

## Signaler une vulnérabilité

Ne publiez pas publiquement une vulnérabilité susceptible d’exposer des données de mineurs, des rapports individuels ou des secrets. Utilisez les fonctions privées de signalement de sécurité du dépôt lorsqu’elles sont disponibles, ou contactez directement le responsable du dépôt.

Le signalement doit indiquer, sans donnée personnelle réelle :

- composant et version ;
- scénario de reproduction ;
- impact potentiel ;
- correctif suggéré si disponible.

## Données sensibles

La version de développement ne doit contenir aucune donnée personnelle réelle. Les démonstrations et tests doivent utiliser des données entièrement fictives.

## Principes techniques prévus

- collecte minimale ;
- stockage local par défaut lorsque possible ;
- chiffrement adapté au contexte ;
- aucune clé secrète dans le code ;
- séparation des données individuelles et d’étude ;
- journalisation sans contenu sensible ;
- dépendances contrôlées ;
- suppression et export maîtrisés.
