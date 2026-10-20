# Dictionnaire des données et format interne

**Statut : spécification fonctionnelle figée pour la production**
**Version de schéma initiale :** 1
**Règle :** aucune identité civile dans BCN v1.

## 1. Conventions

- identifiants : UUID v4 générés localement ;
- dates et heures : ISO 8601/RFC 3339 avec fuseau ;
- durées : millisecondes entières ;
- versions applicatives : version sémantique ;
- chaînes : Unicode NFC ;
- booléens : true ou false ;
- absence : null uniquement lorsque le champ est explicitement nullable ;
- listes : tableau vide plutôt que null ;
- nombres décimaux : point décimal dans les exports techniques ;
- énumérations : valeurs stables en anglais technique, libellés français dans l’interface.

Chaque enregistrement possède au minimum id, created_at, updated_at, schema_version et record_version.

## 2. Champs interdits en v1

Aucune table ne contient :

- nom ;
- prénom ;
- date de naissance complète ;
- photographie ;
- adresse ;
- téléphone ;
- courriel personnel ;
- identifiant national ou scolaire ;
- diagnostic ;
- document médical ;
- coordonnées familiales ;
- contenu de messagerie ;
- identifiant de service tiers.

Les textes libres affichent un rappel de ne pas ajouter ces informations.

## 3. Workspace local

| Champ | Type | Obligatoire | Règle |
|---|---|---:|---|
| id | UUID | oui | identifiant du coffre |
| label | chaîne 1–80 | oui | nom local non sensible |
| schema_version | entier | oui | version du format |
| app_version | semver | oui | version ayant créé l’état |
| created_at | date-heure | oui | création locale |
| last_opened_at | date-heure | oui | dernière ouverture |
| retention_policy_version | chaîne | oui | politique active |
| encryption_profile | objet | oui | algorithmes et paramètres non secrets |
| storage_persistence | enum | oui | granted, denied, unknown |
| last_backup_at | date-heure nullable | non | dernière sauvegarde vérifiée |
| last_backup_hash | chaîne nullable | non | empreinte, jamais le contenu |

## 4. Profil professionnel

| Champ | Type | Obligatoire | Règle |
|---|---|---:|---|
| id | UUID | oui | stable |
| display_name | chaîne 1–80 | oui | nom d’affichage professionnel |
| role | enum | oui | professional, local_admin |
| active | booléen | oui | désactivation sans suppression |
| credential_verifier | binaire chiffré | oui | jamais le secret |
| credential_params | objet | oui | sel et paramètres |
| created_at | date-heure | oui | audit |
| last_login_at | date-heure nullable | non | audit |
| accessibility_settings | objet | oui | préférences professionnelles |

Le pilote initial utilise un seul profil administrateur-professionnel, mais le format reste compatible avec plusieurs profils.

## 5. Dossier jeune pseudonymisé

| Champ | Type | Obligatoire | Règle |
|---|---|---:|---|
| id | UUID | oui | identifiant interne |
| participant_code | chaîne 3–32 | oui | ne dérive pas de l’identité |
| school_level | enum | oui | CM1, CM2, 6E, 5E, 4E, 3E pour le pilote |
| age_years | entier 8–18 | oui | âge à la première passation |
| age_months_remainder | entier 0–11 | oui | mois supplémentaires |
| age_reference_date | date | oui | date du calcul fourni |
| age_band | enum | oui | age_8_10, age_11_14, age_15_18 |
| active | booléen | oui | archivage logique |
| retention_due_at | date | oui | échéance calculée |
| created_by | UUID | oui | profil |
| notes | chaîne nullable | non | 1 000 caractères, rappel de minimisation |

L’âge est saisi directement en années et mois. BCN n’a pas besoin de conserver la date de naissance.

## 6. Passation

| Champ | Type | Obligatoire | Règle |
|---|---|---:|---|
| id | UUID | oui | stable |
| participant_id | UUID | oui | référence pseudonymisée |
| created_by | UUID | oui | propriétaire fonctionnel |
| status | enum | oui | draft, ready, active, paused, completed, partial, abandoned, trashed |
| condition | enum | oui | standard, adapted |
| selected_tasks | tableau d’identifiants | oui | au moins une |
| app_version | semver | oui | figée |
| rules_version | chaîne | oui | figée |
| content_package_versions | objet | oui | une version par banque |
| started_at | date-heure nullable | non | premier démarrage |
| closed_at | date-heure nullable | non | clôture |
| retention_due_at | date | oui | héritée de la politique |
| previous_condition_id | UUID nullable | non | comparaison adaptation |
| interpretation_reserve | booléen | oui | réserve globale |
| reserve_reasons | tableau enum | oui | vide si aucune |

## 7. Séance

| Champ | Type | Obligatoire | Règle |
|---|---|---:|---|
| id | UUID | oui | stable |
| assessment_id | UUID | oui | passation |
| sequence_number | entier ≥1 | oui | ordre |
| opened_at | date-heure | oui | début |
| closed_at | date-heure nullable | non | fin |
| operator_id | UUID | oui | professionnel |
| device_context_id | UUID | oui | matériel |
| active_duration_ms | entier ≥0 | oui | hors pauses |
| pause_duration_ms | entier ≥0 | oui | total |
| interruption_count | entier ≥0 | oui | total |
| status | enum | oui | active, paused, completed, interrupted |

## 8. Contexte matériel

| Champ | Type | Obligatoire | Règle |
|---|---|---:|---|
| id | UUID | oui | instantané de configuration |
| device_class | enum | oui | desktop, laptop, tablet |
| os_family | chaîne | oui | valeur normalisée |
| os_version | chaîne | oui | valeur détectée ou déclarée |
| browser_family | chaîne | oui | valeur normalisée |
| browser_version | chaîne | oui | complète |
| viewport_width_px | entier | oui | au contrôle |
| viewport_height_px | entier | oui | au contrôle |
| screen_width_px | entier | oui | au contrôle |
| screen_height_px | entier | oui | au contrôle |
| device_pixel_ratio | décimal | oui | au contrôle |
| orientation | enum | oui | landscape, portrait |
| zoom_factor | décimal | oui | si détectable, sinon confirmé |
| input_devices | tableau enum | oui | mouse, touchpad, touch, adapted |
| keyboard_type | enum nullable | non | physical, virtual, none |
| keyboard_layout | chaîne nullable | non | exemple fr-FR AZERTY |
| familiar_device | booléen | oui | déclaré |
| audio_check | enum | oui | passed, failed, not_required |
| offline_check | enum | oui | passed, failed |
| persistent_storage | enum | oui | granted, denied, unknown |

## 9. Calibration

| Champ | Type | Obligatoire | Règle |
|---|---|---:|---|
| id | UUID | oui | stable |
| device_context_id | UUID | oui | configuration concernée |
| method | enum | oui | trusted_metadata, card_id1 |
| mm_per_css_px | décimal >0 | oui | facteur |
| reference_width_mm | décimal | oui | 85,60 pour ID-1 |
| reference_height_mm | décimal | oui | 53,98 pour ID-1 |
| validated_by | UUID | oui | professionnel |
| validated_at | date-heure | oui | date |
| tolerance_status | enum | oui | passed, failed |
| invalidated_at | date-heure nullable | non | changement |
| invalidation_reason | enum nullable | non | orientation, zoom, screen, resolution, manual |

## 10. Instance de tâche

| Champ | Type | Obligatoire | Règle |
|---|---|---:|---|
| id | UUID | oui | stable |
| session_id | UUID | oui | séance |
| module_code | enum | oui | typing, pointing, visual_search, comprehension_navigation |
| task_code | chaîne enum | oui | catalogue versionné |
| variant_age | enum | oui | trois tranches |
| variant_device | chaîne enum | oui | variante matérielle |
| content_version | chaîne | oui | banque |
| scoring_mode | enum nullable | non | typing_tolerant, typing_strict, typing_orthographic |
| status | enum | oui | état défini par la cotation |
| started_at | date-heure nullable | non | début |
| ended_at | date-heure nullable | non | fin |
| active_duration_ms | entier ≥0 | oui | hors pauses |
| comparable_status | enum | oui | cinq statuts de cotation |
| training_attempts | entier 0–2 | oui | non notés |
| training_reserve | booléen | oui | difficulté persistante |
| restart_of | UUID nullable | non | tâche invalidée précédente |

## 11. Item

| Champ | Type | Obligatoire | Règle |
|---|---|---:|---|
| id | UUID | oui | présentation unique |
| task_instance_id | UUID | oui | parent |
| content_item_id | chaîne | oui | banque versionnée |
| sequence_number | entier ≥1 | oui | ordre réel |
| replacement_for | UUID nullable | non | incident remplacé |
| status | enum | oui | statut item |
| appeared_at_monotonic_ms | décimal nullable | non | temps relatif |
| ended_at_monotonic_ms | décimal nullable | non | temps relatif |
| response_duration_ms | entier nullable | non | calculé |
| response_payload | objet chiffré | non | schéma propre à la tâche |
| success | booléen nullable | non | null si annulé/incompatible |
| failure_reason | enum nullable | non | motif |
| audio_repeat_count | entier ≥0 | oui | règle par tâche |
| help_count | entier ≥0 | oui | dérivé |
| incident_count | entier ≥0 | oui | dérivé |

## 12. Événement brut

| Champ | Type | Obligatoire | Règle |
|---|---|---:|---|
| id | UUID | oui | immuable |
| session_id | UUID | oui | séance |
| task_instance_id | UUID nullable | non | contexte |
| item_id | UUID nullable | non | contexte |
| event_type | enum | oui | catalogue versionné |
| monotonic_time_ms | décimal | oui | ordre et durée |
| wall_time | date-heure | oui | audit |
| sequence_number | entier | oui | strictement croissant dans la séance |
| payload | objet chiffré | oui | minimum nécessaire |
| source | enum | oui | participant, professional, system |
| app_version | semver | oui | reproductibilité |

Événements principaux : task_started, item_appeared, pointer_down, pointer_up, click, double_activation, drag_started, drag_ended, key_input, text_changed, audio_started, audio_repeated, help_added, incident_added, pause_started, pause_ended, task_ended, task_invalidated.

La trajectoire de pointeur n’est échantillonnée que si elle répond à une mesure explicitement prévue ; sinon seules les positions utiles sont conservées.

## 13. Aide

| Champ | Type | Obligatoire |
|---|---|---:|
| id | UUID | oui |
| task_instance_id | UUID | oui |
| item_id | UUID nullable | non |
| category | enum | oui |
| provided_by | UUID | oui |
| created_at | date-heure | oui |
| duration_ms | entier nullable | non |
| note | chaîne nullable, 500 caractères | non |

Catégories transversales : comprehension, visual_location, gesture, device, attention_fatigue. Les sous-épreuves peuvent ajouter leurs catégories versionnées.

## 14. Incident

| Champ | Type | Obligatoire |
|---|---|---:|
| id | UUID | oui |
| scope | enum | oui |
| scope_id | UUID | oui |
| category | enum | oui |
| severity | enum | oui |
| occurred_at | date-heure | oui |
| invalidates_item | booléen | oui |
| replacement_required | booléen | oui |
| resolved | booléen | oui |
| note | chaîne nullable, 1 000 caractères | non |

Catégories : pointing, audio, display, orientation, calibration, keyboard, browser, storage, interruption, misunderstanding, fatigue, other.

## 15. Résultat calculé

| Champ | Type | Obligatoire |
|---|---|---:|
| id | UUID | oui |
| scope_type | enum | oui |
| scope_id | UUID | oui |
| metric_code | chaîne versionnée | oui |
| value_number | décimal nullable | non |
| value_text | chaîne nullable | non |
| unit | enum nullable | non |
| numerator | décimal nullable | non |
| denominator | décimal nullable | non |
| formula_version | chaîne | oui |
| source_event_ids | tableau UUID | oui |
| calculated_at | date-heure | oui |
| comparability | enum | oui |

Un résultat possède soit value_number, soit value_text, jamais les deux.

## 16. Observation professionnelle

| Champ | Type | Obligatoire |
|---|---|---:|
| id | UUID | oui |
| assessment_id | UUID | oui |
| task_instance_id | UUID nullable | non |
| category | enum | oui |
| value_code | chaîne nullable | non |
| note | chaîne nullable, 2 000 caractères | non |
| author_id | UUID | oui |
| created_at | date-heure | oui |
| amended_from | UUID nullable | non |

Catégories : typing_method, gaze, posture, fatigue, strategy, comfort, autonomy, other. Elles restent séparées des résultats calculés.

## 17. Rapport et export

Rapport :

- id ;
- assessment_id ;
- version_number ;
- template_version ;
- generated_at ;
- generated_by ;
- content_hash ;
- status ;
- local_file_reference facultative ;
- supersedes_report_id facultatif.

Export :

- id ;
- export_type : pdf, csv_work, csv_study, backup ;
- scope ;
- generated_at ;
- generated_by ;
- anonymization_profile ;
- encryption_status ;
- local_destination_label non sensible ;
- content_hash ;
- success.

Aucun contenu de fichier n’est copié dans le journal d’audit.

## 18. Journal d’audit

| Champ | Type | Obligatoire |
|---|---|---:|
| id | UUID | oui |
| actor_id | UUID nullable | non |
| action | enum | oui |
| object_type | enum | oui |
| object_id | UUID nullable | non |
| occurred_at | date-heure | oui |
| result | enum | oui |
| reason_code | enum nullable | non |
| app_version | semver | oui |
| previous_hash | chaîne | oui |
| entry_hash | chaîne | oui |

Le chaînage d’empreintes détecte une altération mais ne remplace pas une signature externe.

## 19. Conteneur de sauvegarde

Le manifeste non sensible contient :

- format : BCN_BACKUP ;
- container_version ;
- created_at ;
- app_version ;
- schema_version ;
- encryption_profile ;
- encrypted_payload_hash ;
- required_content_versions.

La charge utile chiffrée contient les tables, contenus nécessaires et journaux. Aucun enregistrement personnel n’apparaît dans le manifeste en clair.

## 20. Migration

Chaque migration possède :

- identifiant ;
- version source ;
- version cible ;
- préconditions ;
- transformation ;
- validations ;
- stratégie d’échec ;
- tests ;
- possibilité ou non de retour.

Une migration ne supprime aucune mesure brute sans règle de conservation explicitement déclenchée.

## 21. Validation du schéma

Avant écriture ou import :

- champs inconnus rejetés ou conservés dans une zone d’extension explicitement versionnée ;
- types stricts ;
- bornes contrôlées ;
- références vérifiées ;
- énumérations validées ;
- ordre des événements contrôlé ;
- duplication d’identifiant refusée ;
- données en clair sensibles refusées ;
- fichier incompatible rejeté sans modifier le coffre.
