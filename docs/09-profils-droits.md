# Profils professionnels et matrice des droits

**Statut : cadrage fonctionnel validé**  
**Portée :** gestion locale des utilisateurs et des autorisations dans la première version de BCN.

## 1. Principes

BCN utilise des profils professionnels individuels. Les comptes partagés sont interdits.

La première version comporte deux rôles :

1. **professionnel** ;
2. **administrateur local**.

Un administrateur local est aussi un professionnel et peut réaliser des passations.

BCN ne nécessite pas de compte en ligne obligatoire. Les profils et autorisations sont associés à l’installation locale.

## 2. Premier démarrage

Au premier démarrage, BCN impose la création d’un administrateur local.

L’administrateur définit :

- nom d’affichage professionnel ;
- identifiant interne généré par BCN ;
- code d’accès ou phrase secrète ;
- moyen local de récupération ;
- acceptation des responsabilités liées aux données de mineurs.

BCN génère un code de récupération à conserver hors de l’appareil. Il n’est pas affiché de nouveau après confirmation.

## 3. Profil professionnel

Données minimales :

- identifiant interne non modifiable ;
- nom d’affichage ;
- rôle ;
- état actif ou désactivé ;
- date de création ;
- date de dernière utilisation ;
- paramètres d’accessibilité de l’interface professionnelle.

Données facultatives :

- fonction ;
- service ou structure ;
- coordonnées professionnelles destinées au rapport.

Aucun profil ne doit contenir un mot de passe ou un code en clair.

## 4. Code d’accès

Le code professionnel sert à ouvrir ou changer de profil uniquement lorsque le coffre chiffré de l’appareil est déjà ouvert. Il ne sert jamais seul à dériver la clé de chiffrement générale.

Le professionnel utilise au choix :

- un code numérique d’au moins six chiffres ;
- une phrase secrète d’au moins huit caractères.

BCN refuse les codes manifestement faibles ou séquentiels. Le secret est stocké sous une forme dérivée et salée, jamais réversible.

Après cinq tentatives échouées, BCN applique un délai progressif avant un nouvel essai. Aucun échec de connexion ne déclenche l’effacement automatique des bilans.

L’administrateur peut réinitialiser l’accès d’un professionnel sans connaître son ancien secret. Cette action est historisée.

Le coffre de l’appareil utilise séparément une phrase maîtresse d’au moins seize caractères ou cinq mots aléatoires, ainsi qu’une clé de récupération conservée hors appareil. Après une fermeture complète, un redémarrage ou un verrouillage cryptographique, cette phrase maîtresse est nécessaire avant l’accès aux profils.

## 5. Session et verrouillage

Une seule session professionnelle est active à la fois.

BCN se verrouille après **30 minutes d’inactivité**, sauf pendant une épreuve active. Une épreuve active suit ses règles d’interruption.

Le changement de profil exige :

1. la fermeture ou la mise en pause cohérente de l’action en cours ;
2. le verrouillage de la session ;
3. l’authentification du nouveau professionnel.

Chaque action reste attribuée au profil qui l’a réalisée.

## 6. Matrice des droits

| Action | Professionnel | Administrateur local |
|---|---:|---:|
| Consulter la liste des bilans de l’appareil | Oui | Oui |
| Consulter un bilan créé par un autre professionnel | Oui | Oui |
| Créer une passation | Oui | Oui |
| Reprendre sa propre passation | Oui | Oui |
| Reprendre la passation d’un autre professionnel | Non | Oui, avec motif |
| Modifier les données administratives de sa passation | Oui | Oui |
| Modifier les données administratives d’une autre passation | Non | Oui, avec motif |
| Modifier une mesure brute automatique | Non | Non |
| Corriger un alignement lorsqu’il est autorisé | Créateur uniquement | Oui, avec motif |
| Ajouter une observation à son bilan | Oui | Oui |
| Ajouter une observation au bilan d’un autre | Non | Oui, avec attribution |
| Clôturer sa passation | Oui | Oui |
| Réouvrir un bilan clôturé | Non | Oui, avec motif |
| Générer un PDF identifiable de son bilan | Oui | Oui |
| Générer un PDF identifiable d’un autre bilan | Non | Oui |
| Exporter un CSV professionnel nominatif | Ses passations | Toutes les passations |
| Exporter des données identifiantes | Ses passations, après avertissement | Toutes, après avertissement |
| Archiver sa passation | Oui | Oui |
| Placer un bilan à la corbeille | Créateur uniquement | Oui |
| Restaurer un bilan de la corbeille | Non | Oui |
| Supprimer définitivement un bilan | Non | Oui |
| Créer, désactiver ou réactiver un profil | Non | Oui |
| Attribuer ou retirer le rôle administrateur | Non | Oui, sous conditions |
| Consulter le journal d’audit complet | Non | Oui |
| Modifier la configuration générale | Non | Oui |
| Restaurer une sauvegarde globale | Non | Oui |

## 7. Consultation partagée

Tous les professionnels actifs de l’installation peuvent consulter les bilans présents sur l’appareil.

La consultation seule ne permet pas :

- de modifier le bilan ;
- de générer un export identifiable d’un bilan créé par un autre professionnel ;
- de réouvrir une passation ;
- de supprimer ou restaurer le bilan.

BCN affiche le créateur, le statut et la date de dernière modification.

## 8. Modification d’un bilan

Les mesures automatiques brutes sont immuables.

Le créateur peut modifier avant clôture :

- données administratives autorisées ;
- observations professionnelles ;
- conclusion ;
- préconisations ;
- classification professionnelle d’une erreur ;
- alignement manuel lorsqu’il est prévu par l’épreuve.

Après clôture, toute correction crée une nouvelle version ou un avenant. La valeur précédente, l’auteur, la date, le motif et la nouvelle valeur restent consultables.

L’administrateur peut intervenir sur un bilan créé par un autre professionnel uniquement avec un motif obligatoire.

## 9. Clôture et réouverture

Le créateur clôture son bilan après vérification de la synthèse.

La réouverture d’un bilan clôturé est réservée à l’administrateur. Elle exige :

- un motif ;
- une confirmation ;
- la création d’une nouvelle version ;
- la conservation du rapport et de l’état antérieurs.

Une réouverture ne permet jamais de modifier rétroactivement les mesures brutes.

## 10. Export

Les bilans et exports de travail ne sont ni pseudonymisés ni anonymisés.

Le PDF et le CSV professionnels sont nominatifs. Un export anonymisé n’existe que comme export d’étude distinct, déclenché explicitement.

Un export identifiable exige :

1. un avertissement sur les données personnelles ;
2. la confirmation du professionnel ;
3. le choix explicite de l’emplacement ;
4. une entrée dans le journal d’audit.

Un professionnel n’exporte les données identifiantes que pour ses propres passations. L’administrateur peut exporter tout bilan, avec traçabilité.

L’ouverture d’un fichier exporté n’est plus contrôlée par BCN. Cet avertissement apparaît avant la création du fichier identifiable.

## 11. Corbeille et suppression

La suppression ordinaire place le bilan dans une corbeille locale pendant **30 jours**.

Pendant cette période :

- le bilan n’apparaît plus dans les listes courantes ;
- seul un administrateur peut le restaurer ;
- son historique est conservé.

La suppression définitive est réservée à l’administrateur. Elle exige le code administrateur, l’identification exacte du bilan et une double confirmation.

BCN indique clairement que cette action est irréversible, sauf présence d’une sauvegarde externe antérieure.

## 12. Profils désactivés

Un profil ayant créé des bilans n’est pas supprimé de l’historique. Il est désactivé.

La désactivation :

- interdit toute nouvelle connexion ;
- conserve l’auteur des actions passées ;
- ne transfère pas automatiquement la propriété des bilans ;
- permet à l’administrateur de gérer les dossiers selon la matrice des droits.

Le dernier administrateur actif ne peut pas se désactiver ni perdre son rôle tant qu’un autre administrateur n’est pas confirmé.

## 13. Récupération d’accès

Ordre recommandé :

1. récupération avec le code conservé hors appareil ;
2. intervention d’un autre administrateur local ;
3. restauration d’une sauvegarde de configuration autorisée.

BCN ne propose aucune question secrète fondée sur des informations personnelles.

Une récupération ne révèle jamais les anciens codes. Elle invalide le secret précédent et est historisée.

## 14. Journal d’audit

Le journal conserve au minimum :

- connexion réussie ou échouée ;
- verrouillage et déverrouillage ;
- création, reprise, clôture et réouverture ;
- modification ou correction ;
- changement de rôle ;
- réinitialisation d’accès ;
- export ;
- placement à la corbeille, restauration et suppression définitive ;
- sauvegarde et restauration globale ;
- changement de configuration sensible.

Chaque entrée contient :

- date et heure ;
- identifiant du professionnel ;
- type d’action ;
- objet concerné ;
- résultat de l’action ;
- motif lorsque requis.

Le journal ne duplique pas le contenu sensible des bilans. Il est protégé contre la modification depuis l’interface.

## 15. Critères d’acceptation

La future application devra démontrer que :

- un professionnel ne peut pas modifier le bilan d’un autre ;
- un professionnel ne peut pas exporter un bilan identifiable créé par un autre ;
- une mesure brute ne peut pas être modifiée par l’interface ;
- toute intervention administrateur sur un autre bilan exige un motif ;
- le dernier administrateur ne peut pas être désactivé ;
- cinq échecs d’accès déclenchent le ralentissement prévu sans effacer de données ;
- le verrouillage de trente minutes conserve un état cohérent ;
- une réouverture crée une nouvelle version ;
- seul l’administrateur peut restaurer ou supprimer définitivement ;
- chaque action sensible crée une entrée d’audit.

## 16. Éléments restant à qualifier techniquement

Les principes sont fixés dans les documents de sécurité et d’architecture. Restent à qualifier avant production :

- paramètres de dérivation sur le matériel minimal ;
- ergonomie de la phrase maîtresse et de la récupération ;
- résistance du journal d’audit aux altérations ;
- interface détaillée de gestion des profils ;
- procédure de test de récupération et de transfert.
