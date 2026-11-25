<?php

/**
 * ACPT public API, level 1 (ACPT_PUBLIC_API_VERSION = 1).
 *
 * The contract lives in docs/public-api.md (written by ACPT Migrate, spec 0011).
 * Rules every function here keeps:
 * - no transaction, no DDL, nothing that commits implicitly: the caller owns the transaction;
 * - never throws, never returns a bare false: an unexpected failure is WP_Error acpt_db_error;
 * - no hooks and no cache writes in the three write functions (flush_acpt_caches() does
 *   the side effects after the caller's commit);
 * - reads go straight to the database, never through ACPT's cache, so rows the caller
 *   wrote earlier in the same transaction are visible;
 * - no field value in any error message.
 */

use ACPT_Lite\Constants\Logic;
use ACPT_Lite\Constants\MetaGroupDisplay;
use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Constants\Operator;
use ACPT_Lite\Core\Helper\Uuid;
use ACPT_Lite\Core\PublicApi\PublicApiV1Helper;
use ACPT_Lite\Includes\ACPT_Lite_DB;

if (!function_exists('save_acpt_meta_group_definition')) {
    /**
     * Creates one meta group with its boxes and fields, under exactly the names sent.
     *
     * @param array<string, mixed> $definition
     * @return array{group_id: string, boxes: array<string, array{box_id: string, fields: array<string, string>}>}|WP_Error
     */
    function save_acpt_meta_group_definition(array $definition)
    {
        try {
            $error = PublicApiV1Helper::validateGroupDefinition($definition);

            if ($error instanceof WP_Error) {
                return $error;
            }

            if (acpt_meta_group_exists($definition['name'])) {
                return new WP_Error('acpt_group_name_taken', 'A meta group with this name already exists.', ['name' => $definition['name']]);
            }

            $boxNames = [];

            foreach ($definition['boxes'] as $box) {
                if (in_array($box['name'], $boxNames, true)) {
                    return new WP_Error('acpt_box_name_taken', 'Two boxes have the same name.', ['name' => $box['name']]);
                }

                $boxNames[] = $box['name'];
            }

            $groupId = Uuid::v4();

            // display, context and priority as a group saved from the editor gets them
            // (MetaGroupModel: standard display, WordPress' default context and priority)
            ACPT_Lite_DB::executeQueryOrThrowException(
                "INSERT INTO `" . ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_GROUP) . "` (`id`, `group_name`, `label`, `display`, `priority`, `context`) VALUES (%s, %s, %s, %s, NULL, NULL)",
                [$groupId, $definition['name'], trim($definition['label']), MetaGroupDisplay::STANDARD]
            );

            $postTypes = array_values(array_unique(array_column($definition['belongs_to'], 'post_type')));

            foreach ($postTypes as $sort => $postType) {
                $belongId = Uuid::v4();

                ACPT_Lite_DB::executeQueryOrThrowException(
                    "INSERT INTO `" . ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_BELONG) . "` (`id`, `belongs`, `operator`, `find`, `logic`, `sort`) VALUES (%s, %s, %s, %s, %s, %d)",
                    [$belongId, MetaTypes::CUSTOM_POST_TYPE, Operator::EQUALS, $postType, Logic::OR, $sort]
                );

                ACPT_Lite_DB::executeQueryOrThrowException(
                    "INSERT INTO `" . ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_GROUP_BELONG) . "` (`group_id`, `belong_id`) VALUES (%s, %s)",
                    [$groupId, $belongId]
                );
            }

            $resultBoxes = [];
            $fieldIds = [];
            $pendingConditions = [];

            foreach (array_values($definition['boxes']) as $boxIndex => $box) {
                $boxId = PublicApiV1Helper::insertBox($groupId, $box, $boxIndex);
                $resultFields = PublicApiV1Helper::insertFields($boxId, $box['fields'], 0, $pendingConditions);
                $fieldIds = array_merge($fieldIds, $resultFields);

                $resultBoxes[$box['name']] = [
                    'box_id' => $boxId,
                    'fields' => $resultFields,
                ];
            }

            // Saved once every field has its id: a condition may name a field of a later box
            PublicApiV1Helper::insertConditions($pendingConditions, $fieldIds);

            return [
                'group_id' => $groupId,
                'boxes' => $resultBoxes,
            ];
        } catch (\Throwable $exception) {
            do_action("acpt/error", $exception);

            return new WP_Error('acpt_db_error', 'The meta group could not be saved.');
        }
    }
}

if (!function_exists('get_acpt_meta_group_structure')) {
    /**
     * Read only. One meta group's boxes and top level fields, in ACPT's order, without values.
     *
     * @param string $groupId
     * @return array{id: string, name: string, boxes: list<array{id: string, name: string, fields: list<array{id: string, name: string, type: string, label: string}>}>}|WP_Error
     *         WP_Error codes: acpt_group_not_found, acpt_db_error.
     */
    function get_acpt_meta_group_structure(string $groupId)
    {
        try {
            $structure = PublicApiV1Helper::readGroupStructure($groupId);

            if ($structure === null) {
                return new WP_Error('acpt_group_not_found', 'No meta group has this id.');
            }

            $boxes = [];

            foreach ($structure['boxes'] as $box) {
                $fields = [];

                foreach ($box['fields'] as $field) {
                    $fields[] = ['id' => $field['id'], 'name' => $field['name'], 'type' => $field['type'], 'label' => $field['label']];
                }

                $boxes[] = ['id' => $box['id'], 'name' => $box['name'], 'fields' => $fields];
            }

            return ['id' => $structure['id'], 'name' => $structure['name'], 'boxes' => $boxes];
        } catch (\Throwable $exception) {
            do_action("acpt/error", $exception);

            return new WP_Error('acpt_db_error', 'The meta group could not be read.');
        }
    }
}

if (!function_exists('add_acpt_meta_fields')) {
    /**
     * Adds fields to an existing meta group. A box whose name the group already has receives
     * the fields after its own; a new box name creates the box after the group's boxes.
     * The whole input is checked before anything is written, and existing boxes and fields
     * are never changed.
     *
     * @param string $groupId
     * @param array<int, array<string, mixed>> $boxes the shape of a definition's boxes
     * @return array{boxes: array<string, array{id: string, fields: array<string, string>}>}|WP_Error
     *         the boxes and fields sent, box name => id and field name => id.
     *         WP_Error codes: acpt_group_not_found, acpt_invalid_definition (data: {path: string}),
     *         acpt_field_name_taken (data: {name: string}), acpt_db_error. After any WP_Error the caller rolls back.
     */
    function add_acpt_meta_fields(string $groupId, array $boxes)
    {
        try {
            $structure = PublicApiV1Helper::readGroupStructure($groupId);

            if ($structure === null) {
                return new WP_Error('acpt_group_not_found', 'No meta group has this id.');
            }

            $existingBoxes = [];
            $existingFieldIds = [];
            $nextBoxSort = 0;

            foreach ($structure['boxes'] as $box) {
                $nextFieldSort = 0;

                foreach ($box['fields'] as $field) {
                    $existingFieldIds[$field['name']] = $field['id'];
                    $nextFieldSort = max($nextFieldSort, $field['sort'] + 1);
                }

                $existingBoxes[$box['name']] = ['id' => $box['id'], 'next_sort' => $nextFieldSort];
                $nextBoxSort = max($nextBoxSort, $box['sort'] + 1);
            }

            $error = PublicApiV1Helper::validateBoxes($boxes, array_keys($existingFieldIds));

            if ($error instanceof WP_Error) {
                return $error;
            }

            $boxNames = [];

            foreach (array_values($boxes) as $i => $box) {
                if (in_array($box['name'], $boxNames, true)) {
                    return new WP_Error('acpt_invalid_definition', "Invalid definition at boxes[$i].name.", ['path' => "boxes[$i].name"]);
                }

                $boxNames[] = $box['name'];
            }

            // unique across the whole group, existing fields included: meta keys are built from names
            foreach (PublicApiV1Helper::sentFieldNames($boxes) as $name) {
                if (isset($existingFieldIds[$name])) {
                    return new WP_Error('acpt_field_name_taken', 'A field of this group already has this name.', ['name' => $name]);
                }
            }

            $result = [];
            $fieldIds = $existingFieldIds;
            $pendingConditions = [];

            foreach (array_values($boxes) as $box) {
                if (isset($existingBoxes[$box['name']])) {
                    $boxId = $existingBoxes[$box['name']]['id'];
                    $firstSort = $existingBoxes[$box['name']]['next_sort'];
                } else {
                    $boxId = PublicApiV1Helper::insertBox($groupId, $box, $nextBoxSort++);
                    $firstSort = 0;
                }

                $added = PublicApiV1Helper::insertFields($boxId, $box['fields'], $firstSort, $pendingConditions);
                $fieldIds = array_merge($fieldIds, $added);

                $result[$box['name']] = ['id' => $boxId, 'fields' => $added];
            }

            // a condition may name a field sent in a later box, or one the group already had
            PublicApiV1Helper::insertConditions($pendingConditions, $fieldIds);

            return ['boxes' => $result];
        } catch (\Throwable $exception) {
            do_action("acpt/error", $exception);

            return new WP_Error('acpt_db_error', 'The fields could not be added.');
        }
    }
}

if (!function_exists('acpt_supported_field_types')) {
    /**
     * Read only. The field types this edition accepts in save_acpt_meta_group_definition().
     *
     * @return list<string>
     */
    function acpt_supported_field_types(): array
    {
        return array_values(PublicApiV1Helper::fieldTypes());
    }
}

if (!function_exists('acpt_supported_field_settings')) {
    /**
     * Read only. The optional field setting keys this edition accepts in
     * save_acpt_meta_group_definition() (docs/public-api.md, "Field settings").
     *
     * @return list<string>
     */
    function acpt_supported_field_settings(): array
    {
        return array_values(PublicApiV1Helper::supportedFieldSettings());
    }
}

if (!function_exists('acpt_meta_group_exists')) {
    /**
     * Read only. True exactly when save_acpt_meta_group_definition() would answer acpt_group_name_taken.
     *
     * A name the definition rules refuse (uppercase, too long...) is never "taken": the save
     * stops at acpt_invalid_definition first, so "RULE" is not taken when "rule" exists.
     * A valid name is taken when the group_name UNIQUE key would reject the insert, so it is
     * compared with the column's own collation.
     *
     * @param string $name
     * @return bool
     */
    function acpt_meta_group_exists(string $name): bool
    {
        global $wpdb;

        if (!PublicApiV1Helper::isValidName($name)) {
            return false;
        }

        $table = ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_GROUP);

        return (int)$wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM `{$table}` WHERE group_name = %s", $name)) > 0;
    }
}

if (!function_exists('bulk_save_acpt_meta_field_values')) {
    /**
     * @param array<int, mixed>    $rows
     * @param array<string, mixed> $options
     * @return array{saved: int, errors: array<int, array{code: string, message: string}>, previous: array<int, array<string, string|null>>}|WP_Error
     */
    function bulk_save_acpt_meta_field_values(array $rows, array $options = [])
    {
        global $wpdb;

        $result = [
            'saved' => 0,
            'errors' => [],
            'previous' => [],
        ];

        if (empty($rows)) {
            return $result;
        }

        $rowsPerInsert = isset($options['rows_per_insert']) ? max(1, (int)$options['rows_per_insert']) : 500;
        $returnPrevious = !empty($options['return_previous']);
        $maxPreviousBytes = isset($options['max_previous_bytes']) ? max(0, (int)$options['max_previous_bytes']) : 0;

        try {
            // 1. every field id must exist, checked before anything is written
            $fieldIds = [];

            foreach ($rows as $row) {
                if (is_array($row) && isset($row['field_id']) && is_string($row['field_id'])) {
                    $fieldIds[$row['field_id']] = true;
                }
            }

            $fields = PublicApiV1Helper::loadFields(array_keys($fieldIds));
            $unknown = array_values(array_diff(array_keys($fieldIds), array_keys($fields)));

            if (!empty($unknown)) {
                return new WP_Error('acpt_unknown_field', 'Unknown field ids.', ['field_ids' => array_map('strval', $unknown)]);
            }

            // 2. posts, in one query
            $postIds = [];

            foreach ($rows as $row) {
                if (is_array($row) && isset($row['object_id']) && PublicApiV1Helper::isIntLike($row['object_id'])) {
                    $postIds[(int)$row['object_id']] = true;
                }
            }

            $postTypes = PublicApiV1Helper::postTypes(array_keys($postIds));

            // 3. row checks, previous values read before anything is written
            $toWrite = [];
            $seen = [];

            foreach ($rows as $i => $row) {
                if (
                    !is_array($row) ||
                    !isset($row['object_type'], $row['object_id'], $row['field_id']) ||
                    !array_key_exists('value', $row) ||
                    !is_string($row['object_type']) ||
                    !is_string($row['field_id']) ||
                    !PublicApiV1Helper::isIntLike($row['object_id'])
                ) {
                    $result['errors'][$i] = ['code' => 'acpt_validation_failed', 'message' => 'Malformed row.'];
                    continue;
                }

                if ($row['object_type'] !== 'post') {
                    $result['errors'][$i] = ['code' => 'acpt_object_type_unsupported', 'message' => 'Only post rows are supported at level 1.'];
                    continue;
                }

                $postId = (int)$row['object_id'];
                $field = $fields[$row['field_id']];

                $repeatKey = $postId . ':' . $row['field_id'];

                if (isset($seen[$repeatKey])) {
                    $result['errors'][$i] = ['code' => 'acpt_validation_failed', 'message' => 'Repeats an earlier row for the same post and field.'];
                    continue;
                }

                $seen[$repeatKey] = true;

                if (!isset($postTypes[$postId])) {
                    $result['errors'][$i] = ['code' => 'acpt_object_not_found', 'message' => 'Post not found.'];
                    continue;
                }

                if (!in_array($postTypes[$postId], $field['post_types'], true)) {
                    $result['errors'][$i] = ['code' => 'acpt_validation_failed', 'message' => "The post type is not in the field's group."];
                    continue;
                }

                $shapeError = PublicApiV1Helper::validateValue($field, $row['value']);

                if ($shapeError !== null) {
                    $result['errors'][$i] = ['code' => 'acpt_validation_failed', 'message' => $shapeError];
                    continue;
                }

                $previous = [];

                if ($returnPrevious || $maxPreviousBytes > 0) {
                    $previous = PublicApiV1Helper::previousValues($postId, $field['storage_keys']);

                    if ($maxPreviousBytes > 0) {
                        $bytes = 0;

                        foreach ($previous as $value) {
                            $bytes += ($value === null) ? 0 : strlen($value);
                        }

                        if ($bytes > $maxPreviousBytes) {
                            $result['errors'][$i] = ['code' => 'acpt_previous_too_large', 'message' => 'The previous values are larger than max_previous_bytes.'];
                            continue;
                        }
                    }
                }

                if ($returnPrevious) {
                    $result['previous'][$i] = $previous;
                }

                $toWrite[$i] = [
                    'post_id' => $postId,
                    'field' => $field,
                    'value' => $row['value'],
                ];
            }

            // 4. write: one DELETE and one INSERT per chunk
            foreach (array_chunk($toWrite, $rowsPerInsert, true) as $chunk) {
                $deletes = [];
                $inserts = [];

                foreach ($chunk as $item) {
                    foreach ($item['field']['storage_keys'] as $key) {
                        $deletes[] = $wpdb->prepare("(post_id = %d AND meta_key = %s)", $item['post_id'], $key);
                    }

                    foreach (PublicApiV1Helper::metaRows($item['field'], $item['value']) as $key => $value) {
                        $inserts[] = $wpdb->prepare("(%d, %s, %s)", $item['post_id'], $key, $value);
                    }
                }

                if (!empty($deletes)) {
                    ACPT_Lite_DB::executeQueryOrThrowException("DELETE FROM `{$wpdb->postmeta}` WHERE " . implode(' OR ', $deletes));
                }

                if (!empty($inserts)) {
                    ACPT_Lite_DB::executeQueryOrThrowException("INSERT INTO `{$wpdb->postmeta}` (post_id, meta_key, meta_value) VALUES " . implode(', ', $inserts));
                }

                $result['saved'] += count($chunk);
            }

            ksort($result['errors']);

            return $result;
        } catch (\Throwable $exception) {
            do_action("acpt/error", $exception);

            return new WP_Error('acpt_db_error', 'The values could not be saved.');
        }
    }
}

if (!function_exists('get_acpt_field_storage_keys')) {
    /**
     * The meta keys a field stores its value under: main key first, then sidecar keys.
     *
     * @param string $fieldId
     * @return list<string>|WP_Error
     */
    function get_acpt_field_storage_keys(string $fieldId)
    {
        try {
            $fields = PublicApiV1Helper::loadFields([$fieldId]);
        } catch (\Throwable $exception) {
            do_action("acpt/error", $exception);

            return new WP_Error('acpt_db_error', 'The field could not be read.');
        }

        if (!isset($fields[$fieldId])) {
            return new WP_Error('acpt_unknown_field', 'Unknown field id.', ['field_ids' => [$fieldId]]);
        }

        return $fields[$fieldId]['storage_keys'];
    }
}

if (!function_exists('flush_acpt_caches')) {
    /**
     * The side effects of a bulk save, after the caller's commit: cleans the object cache
     * of each touched post, flushes ACPT's caches, and fires acpt/bulk_saved_meta_values
     * once when any id remains. Safe to call again.
     *
     * @param array<string, mixed> $touched
     * @return void
     */
    function flush_acpt_caches(array $touched = []): void
    {
        $postIds = [];

        if (isset($touched['post']) && is_array($touched['post'])) {
            foreach ($touched['post'] as $postId) {
                if (is_scalar($postId) && (int)$postId > 0) {
                    $postIds[(int)$postId] = (int)$postId;
                }
            }
        }

        $postIds = array_values($postIds);

        foreach ($postIds as $postId) {
            clean_post_cache($postId);
        }

        try {
            ACPT_Lite_DB::flushCache();
        } catch (\Throwable $exception) {
            do_action("acpt/error", $exception);
        }

        if (!empty($postIds)) {
            do_action('acpt/bulk_saved_meta_values', ['post' => $postIds]);
        }
    }
}
