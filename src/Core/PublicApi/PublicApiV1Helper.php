<?php

namespace ACPT_Lite\Core\PublicApi;

use ACPT_Lite\Constants\ExtraFields;
use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Constants\Operator;
use ACPT_Lite\Core\Models\Meta\MetaBoxModel;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Core\Models\Meta\MetaGroupModel;
use ACPT_Lite\Includes\ACPT_Lite_DB;

/**
 * Internals of the public API, level 1 (functions/_inc/public_api/v1.php).
 * Not part of the contract: callers use the five functions only.
 *
 * @internal
 */
class PublicApiV1Helper
{
    /**
     * @internal
     * @return string[]
     */
    public static function fieldTypes(): array
    {
        return [
            MetaFieldModel::DATE_TYPE,
            MetaFieldModel::EMAIL_TYPE,
            MetaFieldModel::SELECT_TYPE,
            MetaFieldModel::TEXT_TYPE,
            MetaFieldModel::TEXTAREA_TYPE,
        ];
    }

    /**
     * @internal
     * @return string[]
     */
    public static function choiceTypes(): array
    {
        return [
            MetaFieldModel::SELECT_TYPE,
        ];
    }

    /**
     * @internal
     * @param mixed $value
     * @return bool
     */
    public static function isValidName($value): bool
    {
        return is_string($value) && preg_match('/^[a-z0-9_-]{1,64}$/', $value) === 1;
    }

    /**
     * Trimmed, then 1 to 255 characters (multibyte counted as characters).
     *
     * @internal
     * @param mixed $value
     * @return bool
     */
    public static function isValidLabel($value): bool
    {
        if (!is_string($value)) {
            return false;
        }

        $length = mb_strlen(trim($value), 'UTF-8');

        return $length >= 1 && $length <= 255;
    }

    /**
     * The first broken rule, in document order, as acpt_invalid_definition with data.path.
     *
     * @internal
     * @param array<string, mixed> $definition
     * @return \WP_Error|null
     */
    public static function validateGroupDefinition(array $definition): ?\WP_Error
    {
        $invalid = static function (string $path): \WP_Error {
            return new \WP_Error('acpt_invalid_definition', 'Invalid definition at ' . $path . '.', ['path' => $path]);
        };

        if (!self::isValidName($definition['name'] ?? null)) {
            return $invalid('name');
        }

        if (!self::isValidLabel($definition['label'] ?? null)) {
            return $invalid('label');
        }

        if (!isset($definition['belongs_to']) || !is_array($definition['belongs_to']) || empty($definition['belongs_to'])) {
            return $invalid('belongs_to');
        }

        foreach (array_values($definition['belongs_to']) as $i => $belong) {
            if (!is_array($belong) || !isset($belong['post_type']) || !is_string($belong['post_type']) || !post_type_exists($belong['post_type'])) {
                return $invalid("belongs_to[$i].post_type");
            }
        }

        if (!isset($definition['boxes']) || !is_array($definition['boxes']) || empty($definition['boxes'])) {
            return $invalid('boxes');
        }

        $fieldNames = [];

        foreach (array_values($definition['boxes']) as $i => $box) {
            if (!is_array($box)) {
                return $invalid("boxes[$i]");
            }

            if (!self::isValidName($box['name'] ?? null)) {
                return $invalid("boxes[$i].name");
            }

            if (!self::isValidLabel($box['label'] ?? null)) {
                return $invalid("boxes[$i].label");
            }

            if (!isset($box['fields']) || !is_array($box['fields']) || empty($box['fields'])) {
                return $invalid("boxes[$i].fields");
            }

            foreach (array_values($box['fields']) as $j => $field) {
                $path = "boxes[$i].fields[$j]";

                if (!is_array($field)) {
                    return $invalid($path);
                }

                // unique across the whole group: meta keys are built from box and field names
                if (!self::isValidName($field['name'] ?? null) || in_array($field['name'], $fieldNames, true)) {
                    return $invalid("$path.name");
                }

                $fieldNames[] = $field['name'];

                if (!self::isValidLabel($field['label'] ?? null)) {
                    return $invalid("$path.label");
                }

                if (!isset($field['type']) || !in_array($field['type'], self::fieldTypes(), true)) {
                    return $invalid("$path.type");
                }

                if (!in_array($field['type'], self::choiceTypes(), true)) {
                    continue;
                }

                if (!isset($field['choices']) || !is_array($field['choices']) || empty($field['choices'])) {
                    return $invalid("$path.choices");
                }

                $values = [];

                foreach (array_values($field['choices']) as $k => $choice) {
                    // stored in varchar(255) columns
                    if (!is_array($choice) || !isset($choice['value']) || !is_string($choice['value']) || mb_strlen($choice['value'], 'UTF-8') > 255 || in_array($choice['value'], $values, true)) {
                        return $invalid("$path.choices[$k].value");
                    }

                    $values[] = $choice['value'];

                    if (!isset($choice['label']) || !is_string($choice['label']) || mb_strlen($choice['label'], 'UTF-8') > 255) {
                        return $invalid("$path.choices[$k].label");
                    }
                }
            }
        }

        return null;
    }

    /**
     * Loads fields straight from the database (never through ACPT's cache, so fields the
     * caller created in the same transaction are found).
     *
     * @internal
     * @param string[] $fieldIds
     * @return array<string, array{id: string, type: string, storage_keys: list<string>, choices: string[], post_types: string[], supported: bool}>
     * @throws \Exception
     */
    public static function loadFields(array $fieldIds): array
    {
        global $wpdb;

        $fieldIds = array_values(array_filter($fieldIds, 'is_string'));

        if (empty($fieldIds)) {
            return [];
        }

        $placeholders = implode(',', array_fill(0, count($fieldIds), '%s'));

        $rows = $wpdb->get_results($wpdb->prepare(
            "SELECT f.id, f.field_name, f.field_type, f.parent_id, f.block_id, b.id AS box_id, b.meta_box_name, b.group_id
             FROM `" . ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_FIELD) . "` f
             JOIN `" . ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_BOX) . "` b ON b.id = f.meta_box_id
             WHERE f.id IN ($placeholders)",
            $fieldIds
        ));

        if (!is_array($rows)) {
            throw new \Exception('Fields query failed: ' . $wpdb->last_error);
        }

        if (empty($rows)) {
            return [];
        }

        $ids = array_column($rows, 'id');
        $groupIds = array_values(array_unique(array_column($rows, 'group_id')));

        $choices = [];
        $optionRows = $wpdb->get_results($wpdb->prepare(
            "SELECT meta_field_id, option_value FROM `" . ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_OPTION) . "` WHERE meta_field_id IN (" . implode(',', array_fill(0, count($ids), '%s')) . ")",
            $ids
        ));

        foreach ((array)$optionRows as $optionRow) {
            /** @var \stdClass $optionRow */
            $choices[$optionRow->meta_field_id][] = (string)$optionRow->option_value;
        }

        // level 1: post type rules only ("=" or "in" a list of post types)
        $postTypes = [];
        $belongRows = $wpdb->get_results($wpdb->prepare(
            "SELECT gb.group_id, bl.belongs, bl.operator, bl.find
             FROM `" . ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_GROUP_BELONG) . "` gb
             JOIN `" . ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_BELONG) . "` bl ON bl.id = gb.belong_id
             WHERE gb.group_id IN (" . implode(',', array_fill(0, count($groupIds), '%s')) . ")",
            $groupIds
        ));

        foreach ((array)$belongRows as $belongRow) {
            /** @var \stdClass $belongRow */
            if ($belongRow->belongs !== MetaTypes::CUSTOM_POST_TYPE || !is_string($belongRow->find)) {
                continue;
            }

            if ($belongRow->operator === Operator::EQUALS) {
                $postTypes[$belongRow->group_id][] = $belongRow->find;
            } elseif ($belongRow->operator === Operator::IN) {
                foreach (explode(',', $belongRow->find) as $postType) {
                    $postTypes[$belongRow->group_id][] = trim($postType);
                }
            }
        }

        $fields = [];

        foreach ($rows as $row) {
            /** @var \stdClass $row */
            // the group name doesn't take part in the storage keys
            $group = new MetaGroupModel((string)$row->group_id, 'public_api');
            $box = new MetaBoxModel((string)$row->box_id, $group, (string)$row->meta_box_name, 0);
            $model = new MetaFieldModel((string)$row->id, $box, (string)$row->field_name, (string)$row->field_type, false, false, 0);

            $fields[(string)$row->id] = [
                'id' => (string)$row->id,
                'type' => (string)$row->field_type,
                'storage_keys' => $model->getStorageKeys(),
                'choices' => $choices[$row->id] ?? [],
                'post_types' => $postTypes[$row->group_id] ?? [],
                // nested fields (Repeater/Flexible children) are stored inside their parent's value
                'supported' => empty($row->parent_id) && empty($row->block_id) && in_array((string)$row->field_type, self::fieldTypes(), true),
            ];
        }

        return $fields;
    }

    /**
     * Post id => post type, for the ids that exist (any status).
     *
     * @internal
     * @param int[] $postIds
     * @return array<int, string>
     * @throws \Exception
     */
    public static function postTypes(array $postIds): array
    {
        global $wpdb;

        $types = [];

        foreach (array_chunk($postIds, 1000) as $chunk) {
            $rows = $wpdb->get_results($wpdb->prepare(
                "SELECT ID, post_type FROM `{$wpdb->posts}` WHERE ID IN (" . implode(',', array_fill(0, count($chunk), '%d')) . ")",
                $chunk
            ));

            if (!is_array($rows)) {
                throw new \Exception('Posts query failed: ' . $wpdb->last_error);
            }

            foreach ($rows as $row) {
                /** @var \stdClass $row */
                $types[(int)$row->ID] = (string)$row->post_type;
            }
        }

        return $types;
    }

    /**
     * Every storage key of a field on a post => its raw stored string, null when absent.
     *
     * @internal
     * @param int      $postId
     * @param string[] $keys
     * @return array<string, string|null>
     * @throws \Exception
     */
    public static function previousValues(int $postId, array $keys): array
    {
        global $wpdb;

        $previous = array_fill_keys($keys, null);

        $rows = $wpdb->get_results($wpdb->prepare(
            "SELECT meta_key, meta_value FROM `{$wpdb->postmeta}` WHERE post_id = %d AND meta_key IN (" . implode(',', array_fill(0, count($keys), '%s')) . ") ORDER BY meta_id ASC",
            array_merge([$postId], $keys)
        ));

        if (!is_array($rows)) {
            throw new \Exception('Previous values query failed: ' . $wpdb->last_error);
        }

        foreach ($rows as $row) {
            /** @var \stdClass $row */
            if ($previous[$row->meta_key] === null) {
                $previous[$row->meta_key] = (string)$row->meta_value;
            }
        }

        return $previous;
    }

    /**
     * @internal
     * @param mixed $value
     * @return bool
     */
    public static function isIntLike($value): bool
    {
        return is_int($value) || (is_string($value) && ctype_digit($value));
    }

    /**
     * Null when the value has the shape its type takes, otherwise why not (never the value itself).
     *
     * @internal
     * @param array{type: string, choices: string[], supported: bool} $field
     * @param mixed $value
     * @return string|null
     */
    public static function validateValue(array $field, $value): ?string
    {
        if (!$field['supported']) {
            return 'The field type is not supported at level 1.';
        }

        if ($value === null) {
            return null;
        }

        switch ($field['type']) {
            case MetaFieldModel::TEXT_TYPE:
            case MetaFieldModel::TEXTAREA_TYPE:
                return is_string($value) ? null : 'Expected a string.';

            case MetaFieldModel::EMAIL_TYPE:
                return (is_string($value) && is_email(trim($value))) ? null : 'Expected an email address.';

            case MetaFieldModel::SELECT_TYPE:
                return (is_string($value) && in_array($value, $field['choices'], true)) ? null : "Expected one of the field's choice values.";

            case MetaFieldModel::DATE_TYPE:
                return self::isDate($value, 'Y-m-d') ? null : 'Expected a date as Y-m-d.';
        }

        return 'The field type is not supported at level 1.';
    }

    /**
     * @internal
     * @param mixed  $value
     * @param string $format
     * @return bool
     */
    public static function isDate($value, string $format): bool
    {
        if (!is_string($value)) {
            return false;
        }

        $date = \DateTime::createFromFormat('!' . $format, $value);

        return $date instanceof \DateTime && $date->format($format) === $value;
    }

    /**
     * The meta rows a value is stored as, in ACPT's own format (what a save from the
     * post editor writes): the main key, `_type`, `_id`, and the `_label` of a Url.
     * Null writes nothing: the field's storage keys are only deleted.
     *
     * @internal
     * @param array{id: string, type: string, storage_keys: list<string>} $field
     * @param mixed $value
     * @return array<string, string>
     */
    public static function metaRows(array $field, $value): array
    {
        if ($value === null) {
            return [];
        }

        $mainKey = $field['storage_keys'][0];

        switch ($field['type']) {
            case MetaFieldModel::EMAIL_TYPE:
                $stored = trim($value);
                break;

            default:
                $stored = is_string($value) ? maybe_serialize($value) : (string)$value;
        }

        $rows = [
            $mainKey => (string)$stored,
            $mainKey . '_' . ExtraFields::TYPE => $field['type'],
            $mainKey . '_' . ExtraFields::ID => $field['id'],
        ];

        return $rows;
    }
}
