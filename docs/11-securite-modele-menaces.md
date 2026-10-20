# Sécurité et modèle de menaces

**Statut : décision d’architecture recommandée — revue spécialisée requise avant diffusion**
**Portée :** première version locale de BCN, sans serveur ni transmission automatique.

## 1. Objectifs de sécurité

BCN doit préserver :

- la confidentialité des identités, observations et résultats ;
- l’intégrité des mesures brutes et des rapports ;
- la disponibilité des dossiers malgré une panne ou un effacement local ;
- la traçabilité des opérations sensibles ;
- la séparation entre usage professionnel, administration et étude ;
- la possibilité de corriger une erreur sans réécrire l’historique.

Références principales :

- [Guide de la sécurité des données personnelles 2024 — CNIL](https://www.cnil.fr/fr/guide-de-la-securite-des-donnees-personnelles-nouvelle-edition-2024) ;
- [Authentifier les utilisateurs — CNIL](https://www.cnil.fr/fr/securite-authentifier-les-utilisateurs) ;
- [Chiffrement, hachage, signature — CNIL](https://www.cnil.fr/fr/securite-chiffrement-hachage-signature) ;
- [Web Cryptography Level 2 — W3C](https://www.w3.org/TR/webcrypto-2/) ;
- [Password Storage Cheat Sheet — OWASP](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html).

## 2. Hypothèses et limites

La première version fonctionne sur un appareil administré par l’organisme et peut rester hors connexion. Elle ne remplace pas la sécurité du poste.

Prérequis organisationnels :

- session du système d’exploitation individuelle ;
- chiffrement complet du disque activé ;
- verrouillage automatique du poste ;
- système et navigateur maintenus ;
- protection physique de l’appareil ;
- sauvegardes conservées séparément ;
- absence de poste public ou partagé sans contrôle.

Le chiffrement applicatif protège principalement les données lorsque le coffre BCN est verrouillé. Il ne protège pas contre un système d’exploitation compromis, une extension malveillante, un administrateur système hostile, une capture d’écran ou un utilisateur autorisé pendant que le coffre est ouvert.

## 3. Actifs à protéger

- clé maîtresse du coffre ;
- secrets et codes des profils ;
- table d’identité facultative ;
- passations et événements bruts ;
- observations, aides et incidents ;
- rapports et exports ;
- sauvegardes ;
- contenus et règles versionnés ;
- journal d’audit.

## 4. Menaces retenues

| Menace | Effet principal | Réponse minimale |
|---|---|---|
| perte ou vol de l’appareil | divulgation | chiffrement du disque, coffre chiffré, verrouillage |
| accès d’un collègue non autorisé | consultation ou export | profils individuels, droits, journalisation |
| essai répété de codes | prise de profil | ralentissement progressif et verrouillage |
| copie d’un export | fuite hors BCN | export chiffré par défaut et avertissement |
| effacement des données du navigateur | perte de dossiers | stockage persistant demandé et sauvegarde obligatoire |
| corruption ou panne pendant l’écriture | perte ou incohérence | transactions atomiques et contrôle d’intégrité |
| restauration d’une ancienne sauvegarde | écrasement ou résurrection | aperçu, contrôle de version et restauration non silencieuse |
| modification des résultats | bilan inexact | mesures brutes immuables, calcul versionné, audit |
| injection de script | lecture du coffre ouvert | CSP stricte, aucun HTML non fiable, dépendances contrôlées |
| dépendance compromise | compromission générale | verrouillage des versions, inventaire et revue |
| récupération frauduleuse | prise de contrôle | procédure administrateur tracée et secret de récupération |
| observation de l’écran | divulgation | masquage, verrouillage rapide et règles de poste |

## 5. Coffre local et chiffrement

Les données personnelles et les passations sont stockées sous forme de charges utiles chiffrées.

Décisions :

- clé de données aléatoire de 256 bits générée sur l’appareil ;
- chiffrement authentifié AES-GCM par l’API Web Crypto ;
- vecteur d’initialisation unique pour chaque chiffrement ;
- clé de données enveloppée par une clé dérivée d’une phrase maîtresse ;
- sel aléatoire distinct et paramètres de dérivation enregistrés ;
- authentification des métadonnées indispensables ;
- clé déchiffrée uniquement en mémoire pendant l’ouverture du coffre ;
- effacement des références aux clés lors du verrouillage, de la fermeture ou de l’expiration de session ;
- aucune clé, phrase maîtresse ou donnée en clair dans localStorage, les journaux ou les erreurs.

Le choix définitif de la fonction de dérivation et de ses paramètres sera fondé sur un étalonnage de performance sur les appareils minimaux et une revue cryptographique. L’option recommandée est Argon2id via une dépendance WASM auditée ; PBKDF2-HMAC-SHA-256 de Web Crypto reste le repli compatible. Aucun algorithme maison n’est autorisé.

## 6. Deux niveaux d’accès

### Coffre de l’appareil

Après redémarrage du navigateur, fermeture complète ou verrouillage cryptographique, une phrase maîtresse est nécessaire :

- au moins 16 caractères, ou cinq mots aléatoires ;
- distincte des codes professionnels ;
- non transmise ni récupérable par le projet BCN ;
- changement possible avec ré-enveloppement de la clé, sans rechiffrer toutes les données.

### Profil professionnel

Dans un coffre déjà ouvert, le professionnel utilise :

- un PIN local de six chiffres, ou
- une phrase d’au moins huit caractères.

Ce code sert à attribuer les actions et appliquer les droits. Il ne constitue jamais, seul, la clé de chiffrement du coffre. Son vérificateur est dérivé avec une fonction lente et un sel propre.

Après cinq échecs, un délai progressif est imposé. Les tentatives et déverrouillages administratifs sont audités sans enregistrer le secret.

## 7. Verrouillage et sessions

- verrouillage du profil après 30 minutes d’inactivité ;
- verrouillage immédiat disponible sur chaque écran professionnel ;
- aucune expiration pendant un item noté ;
- à la fin de l’item, verrouillage avant toute nouvelle action ;
- fermeture ou mise en arrière-plan prolongée : coffre verrouillé selon les possibilités de la plateforme ;
- changement de profil sans exposition du profil précédent ;
- données du jeune masquées dans le sélecteur récent.

Une passation active conserve son état atomique. Le chronomètre ne continue jamais pendant un verrouillage imposé.

## 8. Administration et récupération

Il existe au moins deux administrateurs lorsque l’organisation le permet.

La récupération repose sur une clé de récupération aléatoire créée à l’installation, exportée ou imprimée une seule fois, conservée hors de l’appareil et testée. BCN ne possède aucune porte dérobée.

Une récupération :

1. exige la clé de récupération ;
2. affiche le coffre et la sauvegarde visés ;
3. crée un nouvel accès administrateur ;
4. invalide les anciens secrets compromis ;
5. ajoute une trace d’audit ;
6. ne modifie pas les mesures brutes.

Sans phrase maîtresse, clé de récupération ou sauvegarde exploitable, les données chiffrées sont irrécupérables. Cette conséquence est affichée avant la première passation réelle.

## 9. Exports

- PDF identifiable : autorisé selon les droits définis ;
- CSV d’étude : séparé et pseudonymisé ;
- sauvegarde BCN : toujours chiffrée ;
- export nominatif : avertissement visible, destination choisie explicitement ;
- nom de fichier sans nom du jeune par défaut ;
- aucun envoi automatique, partage natif automatique ou téléversement ;
- fichier temporaire supprimé après téléchargement lorsque la plateforme le permet ;
- empreinte, date, auteur, type et périmètre de l’export inscrits au journal.

Le mot de passe d’un export chiffré n’est jamais transmis dans le même canal que le fichier.

## 10. Journal d’audit

Sont journalisés :

- ouverture et verrouillage du coffre ;
- connexions, échecs et récupération ;
- création, consultation sensible, modification administrative et suppression ;
- clôture ou réouverture d’un bilan ;
- export et restauration ;
- changement de rôle, de règle ou de durée de conservation.

Le journal ne copie ni réponses, ni observations, ni secrets. Chaque entrée contient horodatage, profil, action, objet, résultat et version. Il est protégé contre la modification ordinaire et exportable pour contrôle.

## 11. Développement et chaîne de fourniture

- TypeScript en mode strict ;
- validation de toutes les données à l’entrée et à la restauration ;
- Content Security Policy sans script en ligne ;
- aucune exécution de contenu saisi ;
- dépendances minimales, versions verrouillées et inventaire SBOM ;
- analyse automatique des dépendances et du code ;
- tests des autorisations et migrations ;
- secrets absents du dépôt et des journaux ;
- versions publiées reproductibles et signées lorsque la chaîne le permet ;
- procédure de mise à jour avec retour arrière documenté.

## 12. Perte ou compromission

En cas de perte ou suspicion :

1. ne plus utiliser l’appareil ;
2. informer le responsable désigné ;
3. préserver les journaux disponibles ;
4. inventorier les dossiers, exports et sauvegardes concernés ;
5. révoquer ou remplacer les secrets réutilisables ;
6. analyser la nécessité d’une notification ;
7. restaurer sur un appareil sain depuis une sauvegarde vérifiée ;
8. documenter les mesures correctives.

La première version sans serveur ne permet pas d’effacement distant. Cette limite est explicite.

## 13. Vulnérabilités

La politique SECURITY.md doit préciser :

- canal privé de signalement ;
- versions supportées ;
- informations attendues ;
- accusé de réception cible ;
- règles de divulgation coordonnée ;
- processus de qualification, correction, publication et notification.

Aucune donnée réelle de mineur ne doit être jointe à un signalement.

## 14. Critères d’acceptation

La future version devra démontrer que :

- un fichier de base copié depuis un appareil verrouillé ne révèle pas les données ;
- un PIN seul ne déchiffre pas un coffre fermé ;
- cinq échecs déclenchent le ralentissement prévu ;
- le verrouillage retire l’accès aux clés ;
- les mesures brutes ne sont pas modifiables par l’interface ;
- une restauration corrompue ou incompatible est refusée ;
- un export est audité et ne contient pas d’identité par défaut ;
- aucune requête réseau n’est émise pendant une passation hors mise à jour explicitement demandée ;
- une coupure pendant l’écriture laisse soit l’ancien état, soit le nouvel état complet ;
- les attaques XSS prévues par les tests ne permettent pas d’exécuter du contenu saisi.

## 15. Points restant à valider

- audit spécialisé du schéma de chiffrement ;
- performance Argon2id ou réglage PBKDF2 sur le matériel minimal ;
- politique institutionnelle sur phrase maîtresse et conservation de la récupération ;
- canal de signalement privé GitHub ;
- durée de conservation exacte du journal ;
- test de sécurité avant pilote avec données fictives.
