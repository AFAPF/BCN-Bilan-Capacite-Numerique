# Données, protection des mineurs et durées de conservation

**Statut : cadrage fonctionnel recommandé — validation juridique et DPO requise avant déploiement réel**  
**Portée :** première version locale de BCN.

## 1. Principes

BCN applique dès la conception :

- finalité déterminée ;
- minimisation ;
- exactitude ;
- limitation de la conservation ;
- confidentialité et intégrité ;
- traçabilité ;
- information adaptée aux mineurs ;
- séparation entre bilan individuel et données d’étude.

Références officielles :

- [Règlement général sur la protection des données](https://eur-lex.europa.eu/eli/reg/2016/679/oj?locale=fr) ;
- [Principes du RGPD — CNIL](https://www.cnil.fr/fr/comprendre-le-rgpd/les-six-grands-principes-du-rgpd) ;
- [Référentiel CNIL relatif à la protection de l’enfance](https://www.cnil.fr/sites/default/files/atoms/files/referentiel_relatif_a_la_protection_de_lenfance.pdf) ;
- [Information et droits des mineurs par le design](https://www.cnil.fr/fr/recommandation-6-renforcer-linformation-et-les-droits-des-mineurs-par-le-design) ;
- [Analyse d’impact relative à la protection des données](https://www.cnil.fr/fr/ce-quil-faut-savoir-sur-lanalyse-dimpact-relative-la-protection-des-donnees-aipd).

## 2. Responsabilités

Dans un fonctionnement entièrement local sans transmission au projet BCN :

- l’organisme qui décide d’utiliser BCN détermine les finalités et moyens du traitement et doit identifier son rôle juridique ;
- les professionnels sont des utilisateurs autorisés agissant selon ses instructions ;
- le développeur de BCN ne reçoit aucune donnée individuelle par défaut.

Si une synchronisation, une assistance distante, une collecte de télémétrie ou un hébergement est ajouté ultérieurement, les rôles de responsable de traitement, responsables conjoints ou sous-traitants devront être réexaminés et contractualisés.

BCN ne choisit pas automatiquement la base légale. Avant utilisation réelle, l’organisme documente :

- la finalité ;
- la base de l’article 6 du RGPD ;
- lorsqu’une donnée relevant de l’article 9 est traitée, la condition supplémentaire applicable ;
- les destinataires ;
- la durée ;
- les droits ;
- la nécessité d’une AIPD.

Le consentement ne doit pas être présenté comme base automatique ou universelle.

## 3. Modèle logique

Les entités sont séparées :

1. **Profil professionnel** ;
2. **Dossier pseudonymisé du jeune** ;
3. **Passation** ;
4. **Séance** ;
5. **Module et épreuve** ;
6. **Item et événement brut** ;
7. **Observation professionnelle** ;
8. **Aide ou incident** ;
9. **Résultat calculé** ;
10. **Rapport versionné** ;
11. **Export** ;
12. **Journal d’audit** ;
13. **Jeu de données d’étude séparé**.

Un dossier jeune peut contenir plusieurs passations. Une passation contient une ou plusieurs séances datées. Les données brutes ne sont jamais remplacées par les résultats calculés.

## 4. Données obligatoires

### Dossier jeune

- identifiant interne aléatoire ;
- nom ;
- prénom ;
- code technique interne ;
- âge en années et mois à la date du module ;
- niveau scolaire ;
- tranche d’âge BCN.

### Passation

- identifiant unique ;
- professionnel créateur ;
- dates et heures ;
- état ;
- modules et épreuves sélectionnés ;
- versions de l’application, des règles et des contenus ;
- matériel, configuration et adaptations nécessaires à l’interprétation.

### Mesures

- réponses ;
- événements nécessaires au calcul ;
- temps actifs lorsque prévu ;
- erreurs ;
- corrections ;
- aides ;
- incidents ;
- statuts de comparabilité ;
- résultats calculés et formule versionnée.

## 5. Données facultatives

- date de naissance complète ;
- langue de scolarisation ;
- contexte scolaire utile ;
- expérience numérique déclarée ;
- fonction et structure du professionnel ;
- observations libres pertinentes ;
- ressenti exprimé par le jeune.

L’application exige le nom et le prénom pour produire le bilan professionnel nominatif. La date de naissance complète reste facultative et non recommandée ; l’âge en années et mois suffit.

## 6. Données calculées

- tranche d’âge ;
- âge en années et mois ;
- débits ;
- nombres et catégories d’erreurs ;
- réussites ;
- précisions ;
- statuts de complétion et comparabilité ;
- résultats par module ;
- indicateurs de gain entre conditions comparables.

Chaque donnée calculée conserve la version de sa formule et les identifiants des données sources.

## 7. Données interdites par défaut

BCN ne collecte pas par défaut :

- photographie ;
- enregistrement audio ou vidéo du jeune ;
- adresse personnelle ;
- téléphone ou courriel personnel ;
- identifiant national ;
- dossier scolaire complet ;
- document médical ou paramédical joint ;
- diagnostic médical ;
- coordonnées des représentants légaux ;
- mot de passe d’un service tiers ;
- géolocalisation ;
- historique de navigation réel ;
- contenu réel d’une messagerie ;
- télémétrie transmise automatiquement.

Une zone libre affiche un rappel interdisant d’y inscrire des informations médicales ou identifiantes non nécessaires.

## 8. Données potentiellement sensibles

Une observation, une adaptation ou une préconisation peut révéler indirectement une situation de handicap, de santé ou de difficulté scolaire.

BCN :

- limite les catégories ;
- évite les diagnostics ;
- sépare mesure et interprétation ;
- restreint les exports identifiables ;
- chiffre la base locale selon l’architecture de sécurité retenue ;
- journalise les accès sensibles sans recopier leur contenu.

## 9. Identité et passation

Le nom et le prénom sont conservés dans une table chiffrée séparée des événements bruts. La passation référence l’identifiant interne du jeune, tandis que l’écran professionnel et le bilan résolvent cette référence pour afficher l’identité.

Le bilan courant et le CSV de travail sont nominatifs. Seul un éventuel export d’étude, créé séparément et explicitement, retire l’identité. Le code technique ne doit pas être construit à partir du nom, de la date de naissance ou d’un identifiant scolaire.

## 10. Bilan individuel et étude

Aucune passation individuelle n’est automatiquement versée dans une étude.

La création d’un jeu d’étude est une action distincte :

1. sélection explicite des passations ;
2. information et cadre juridique propres à l’étude ;
3. contrôle des champs ;
4. suppression des identifiants directs ;
5. création d’un nouvel identifiant d’étude ;
6. export séparé ;
7. journalisation.

Une donnée pseudonymisée reste une donnée personnelle. BCN ne la qualifie d’anonyme que si la réidentification est raisonnablement exclue selon une analyse documentée.

## 11. Durées recommandées

Les durées définitives sont configurées et validées par l’organisme responsable avant utilisation.

Réglages recommandés :

| Catégorie | Durée recommandée |
|---|---|
| Dossier et bilans actifs | 2 ans après la dernière activité ou le dernier contact |
| Corbeille locale | 30 jours |
| Rapports générés conservés dans BCN | Même durée que le bilan source |
| Journal d’audit lié à un bilan | Durée du bilan puis 6 mois |
| Journaux techniques sans contenu de bilan | 6 mois |
| Sauvegardes roulantes chiffrées | 90 jours maximum |
| Profil professionnel désactivé | Durée nécessaire à l’audit des bilans associés |
| Données d’étude pseudonymisées | Selon protocole, base légale et calendrier de l’étude |
| Données réellement anonymes | Selon finalité scientifique documentée |

Avant échéance, BCN peut avertir l’administrateur. À l’échéance, il propose suppression, anonymisation irréversible ou archivage légal lorsqu’une obligation le justifie. Aucune prolongation silencieuse n’est autorisée.

## 12. Information des jeunes et représentants

Avant la première passation réelle, l’organisme fournit :

- une notice courte pour 8–10 ans ;
- une notice adaptée pour 11–14 ans ;
- une notice adaptée pour 15–18 ans ;
- une notice complète pour les représentants légaux.

Les notices précisent avec des mots compréhensibles :

- qui utilise les données ;
- pourquoi ;
- quelles données ;
- qui peut les voir ;
- combien de temps ;
- si la participation à une étude est distincte ;
- comment exercer les droits ;
- qui contacter ;
- comment signaler une erreur ou un problème.

L’information est accessible avant, pendant et après la passation. BCN enregistre la version de la notice présentée et la date, sans déduire que cette trace constitue à elle seule un consentement juridiquement valable.

## 13. Exercice des droits

L’administrateur dispose d’un parcours pour :

- rechercher les données d’un jeune ;
- produire une copie intelligible ;
- rectifier les données administratives ;
- ajouter un rectificatif aux observations ;
- limiter temporairement l’utilisation ;
- exporter ;
- supprimer lorsque le droit est applicable ;
- documenter un refus juridiquement justifié.

Les mesures brutes ne sont pas réécrites : une rectification crée une nouvelle version ou une annotation reliée à la donnée originale.

## 14. Sauvegarde, restauration et suppression

Les sauvegardes sont chiffrées et protégées par un secret distinct de l’accès quotidien.

Une restauration :

- exige un administrateur ;
- vérifie l’intégrité et la version ;
- affiche la date de la sauvegarde ;
- empêche l’écrasement silencieux ;
- crée une entrée d’audit.

La suppression définitive retire les données de la base active. Les sauvegardes roulantes expirent selon leur calendrier et ne sont pas réinjectées sauf restauration explicitement autorisée.

## 15. AIPD

Avant un déploiement réel, l’organisme réalise au minimum un examen formel de la nécessité d’une AIPD avec son DPO ou référent.

Une AIPD complète est fortement recommandée lorsque le déploiement combine notamment :

- personnes mineures ;
- observations de difficultés ou adaptations ;
- suivi dans le temps ;
- plusieurs professionnels ;
- données susceptibles de révéler la santé ou le handicap ;
- étude ou étalonnage ;
- volume important ou centralisation.

Le projet BCN peut fournir un modèle produit, mais chaque organisme reste responsable de l’analyse correspondant à son usage réel.

## 16. Violation de données

BCN prévoit une procédure permettant de :

- isoler l’appareil ou la sauvegarde concernée ;
- préserver les journaux ;
- identifier les catégories et volumes touchés ;
- informer le responsable de traitement ;
- documenter les faits, effets et mesures ;
- préparer les notifications réglementaires lorsque nécessaires ;
- informer les personnes lorsque le risque l’exige.

L’application ne décide pas seule si une notification est juridiquement obligatoire.

## 17. Critères d’acceptation

La future application devra démontrer que :

- le nom et le prénom sont obligatoires pour le bilan nominatif et restent chiffrés localement ;
- un export anonymisé ne contient aucun champ d’identité ;
- les données d’étude sont physiquement ou logiquement séparées ;
- aucune donnée n’est transmise automatiquement ;
- chaque champ possède une finalité et un statut ;
- une échéance de conservation est calculable ;
- une restauration ne réactive pas silencieusement une donnée supprimée ;
- une rectification conserve l’historique ;
- les notices sont versionnées ;
- l’administrateur peut traiter une demande de droits ;
- les zones libres rappellent la minimisation ;
- les données et sauvegardes sont chiffrables selon l’architecture retenue.

## 18. Validations encore nécessaires

- identification du responsable de traitement dans chaque organisme ;
- base légale et condition éventuelle de l’article 9 ;
- validation des durées par le DPO et les règles d’archives applicables ;
- décision formelle sur l’AIPD ;
- rédaction juridique des notices ;
- procédure organisationnelle d’exercice des droits ;
- architecture de chiffrement et gestion des clés ;
- protocole précis d’anonymisation des données d’étude.
