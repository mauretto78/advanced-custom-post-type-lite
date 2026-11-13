<?php

/**
 * ACPT public API, level 1 (ACPT_PUBLIC_API_VERSION = 1).
 *
 * The contract lives in docs/public-api.md (written by ACPT Migrate, spec 0011).
 * Rules every function here keeps:
 * - no transaction, no DDL, nothing that commits implicitly: the caller owns the transaction;
 * - never throws, never returns a bare false: an unexpected failure is WP_Error acpt_db_error;
 * - no hooks and no cache writes in the two write functions (flush_acpt_caches() does
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

            foreach ($definition['boxes'] as $boxIndex => $box) {
                $boxId = Uuid::v4();

                ACPT_Lite_DB::executeQueryOrThrowException(
                    "INSERT INTO `" . ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_BOX) . "` (`id`, `group_id`, `meta_box_name`, `meta_box_label`, `settings`, `sort`) VALUES (%s, %s, %s, %s, %s, %d)",
                    [$boxId, $groupId, $box['name'], trim($box['label']), '[]', $boxIndex]
                );

                $resultFields = [];

                foreach ($box['fields'] as $fieldIndex => $field) {
                    $fieldId = Uuid::v4();

                    ACPT_Lite_DB::executeQueryOrThrowException(
                        "INSERT INTO `" . ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_FIELD) . "` (`id`, `meta_box_id`, `field_name`, `field_label`, `field_type`, `sort`, `showInArchive`, `required`, `quick_edit`, `filter_in_admin`, `field_description`, `field_default_value`) VALUES (%s, %s, %s, %s, %s, %d, %d, %d, %d, %d, %s, %s)",
                        [$fieldId, $boxId, $field['name'], trim($field['label']), $field['type'], $fieldIndex, 0, 0, 0, 0, '', '']
                    );

                    if (in_array($field['type'], PublicApiV1Helper::choiceTypes(), true)) {
                        foreach ($field['choices'] as $choiceIndex => $choice) {
                            ACPT_Lite_DB::executeQueryOrThrowException(
                                "INSERT INTO `" . ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_OPTION) . "` (`id`, `meta_box_id`, `meta_field_id`, `option_label`, `option_value`, `sort`, `is_default`) VALUES (%s, %s, %s, %s, %s, %d, %d)",
                                [Uuid::v4(), $boxId, $fieldId, $choice['label'], $choice['value'], $choiceIndex, 0]
                            );
                        }
                    }

                    $resultFields[$field['name']] = $fieldId;
                }

                $resultBoxes[$box['name']] = [
                    'box_id' => $boxId,
                    'fields' => $resultFields,
                ];
            }

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
