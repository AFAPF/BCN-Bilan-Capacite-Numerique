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
