# Revue de la porte d’entrée en production

**Date de revue :** 20 octobre 2026
**Décision :** préproduction technique complète ; démarrage de la production non encore autorisé.
**Prochaine action unique :** décision explicite du porteur « lancer la production ».

## 1. Conclusion

BCN possède désormais un périmètre v1, des modules, des règles transversales, une architecture, un modèle de données, une cotation, des contenus initiaux, des maquettes, une stratégie de tests et un backlog suffisamment précis pour commencer le développement sans inventer les règles principales pendant le code.

Aucune ambiguïté fonctionnelle bloquante n’a été identifiée.

Le projet s’arrête volontairement à ce point conformément à la demande du porteur. Aucun code de production n’est lancé par cette revue.

## 2. Éléments prêts

- finalité et limites ;
- public et variantes d’âge ;
- périmètre inclus et exclu ;
- quatre modules ;
- tâches indépendantes ;
- consignes initiales ;
- banques initiales ;
- aides, incidents, pauses et reprises ;
- formules ;
- données manquantes et résultats partiels ;
- comparabilité ;
- absence de note globale ;
- bilan nominatif ;
- PDF ;
- CSV professionnel ;
- export d’étude séparé ;
- dictionnaire de données ;
- chiffrement local ;
- aucune donnée cloud ;
- architecture PWA ;
- compatibilité cible ;
- arborescence et maquettes ;
- accessibilité ;
- tests et tolérances ;
- risques ;
- backlog ordonné ;
- critères d’acceptation.

## 3. Décisions à vérifier pendant le pilote

Ces points ne bloquent pas le développement parce que leur valeur initiale et leur méthode de validation sont définies :

- délai exact des items ;
- rythme et pauses des dictées ;
- équivalence des banques d’âge ;
- effets plancher et plafond ;
- effet du matériel ;
- fiabilité du double-toucher ;
- compréhension des consignes ;
- durée et fatigue ;
- palette et densité finale ;
- indicateur de progression ;
- durée minimale d’une dictée partielle comparable.

Toute modification issue du pilote crée une nouvelle version de contenu ou de règle.

## 4. Décisions techniques à qualifier pendant la production

Elles possèdent un critère d’acceptation et ne nécessitent pas de choix fonctionnel supplémentaire :

- versions exactes des dépendances maintenues ;
- paramètres Argon2id ou repli PBKDF2 après mesure ;
- bibliothèque IndexedDB ;
- format binaire exact du conteneur de sauvegarde ;
- seuil d’espace libre ;
- comportement du navigateur en arrière-plan ;
- versions minimales finales ;
- signature et intégrité des publications.

## 5. Décisions volontairement différées

Elles ne bloquent pas la version personnelle expérimentale :

- licence de diffusion ;
- comité scientifique complet ;
- ouverture aux contributeurs ;
- diffusion à d’autres professionnels ;
- modèle économique ;
- synchronisation ou serveur, actuellement exclus ;
- normes et percentiles ;
- version professionnelle publique.

## 6. Risques résiduels acceptés pour commencer le développement

- la sauvegarde actuellement prévue sur le même appareil ne protège pas d’une perte physique ; la fonction d’export local chiffré est néanmoins incluse ;
- certaines mesures physiques nécessitent une qualification sur appareil réel ;
- GitHub Pages distribue le code mais ne reçoit pas les données ;
- les contenus restent expérimentaux jusqu’au pilote ;
- le navigateur limite certains accès aux réglages système.

Aucun de ces risques n’autorise une passation réelle avant qualification de la version candidate.

## 7. Conditions du premier incrément

Le premier incrément de production doit uniquement couvrir :

1. socle TypeScript–React–Vite ;
2. PWA installable et hors connexion ;
3. dictionnaire de données validé ;
4. coffre chiffré minimal ;
5. persistance transactionnelle ;
6. tests automatiques du socle ;
7. aucune donnée réelle.

Il ne comprend encore aucune épreuve utilisée avec un jeune.

## 8. Conditions de lancement

Le développement peut démarrer lorsque le porteur donne explicitement l’ordre de lancer la production.

Après cet ordre :

- une branche de production est créée selon la stratégie retenue ;
- le backlog commence par P0 ;
- seules des données fictives sont utilisées ;
- chaque lot doit satisfaire ses critères avant le suivant ;
- aucune expérimentation réelle n’a lieu avant P7-05.

## 9. Verdict

| Domaine | Verdict |
|---|---|
| fonctionnel | prêt |
| cotation | prêt |
| données | prêt |
| sécurité conçue | prêt pour implémentation |
| architecture | prête |
| interface | prête en basse fidélité |
| contenus | prêts pour pilote |
| tests | prêts |
| backlog | prêt |
| diffusion publique | différée |
| autorisation de produire | en attente du porteur |

**État final : PRÊT À LANCER LA PRODUCTION, MAIS PRODUCTION NON LANCÉE.**
