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
