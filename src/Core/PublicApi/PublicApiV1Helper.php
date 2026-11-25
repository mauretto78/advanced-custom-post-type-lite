<?php

namespace ACPT_Lite\Core\PublicApi;

use ACPT_Lite\Constants\ExtraFields;
use ACPT_Lite\Constants\Logic;
use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Constants\Operator;
use ACPT_Lite\Core\Models\Meta\MetaBoxModel;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Core\Models\Meta\MetaGroupModel;
use ACPT_Lite\Core\Helper\Uuid;
use ACPT_Lite\Includes\ACPT_Lite_DB;

/**
 * Internals of the public API, level 1 (functions/_inc/public_api/v1.php).
 * Not part of the contract: callers use the level 1 functions only.
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
     * Every optional field setting key the level 1 contract knows, in the order the
     * definition is checked (docs/public-api.md, "Field settings").
     */
    public const FIELD_SETTINGS = ['required', 'description', 'default', 'advanced_options', 'validation_rules', 'conditions'];

    /** Longest `description`, in bytes: it is stored in a TEXT column. */
    public const DESCRIPTION_MAX_BYTES = 65535;

    /** Longest `default` (its string, or its items joined with `,`), advanced option and rule value, in characters: varchar(255) columns. */
    public const VALUE_MAX_CHARS = 255;

    /** The `advanced_options` keys the public API takes. */
    public const ADVANCED_OPTION_KEYS = ['before', 'after', 'min', 'max', 'step', 'rows'];

    /** The validation rule conditions the public API takes. */
    public const RULE_CONDITIONS = ['BLANK', 'NOT_BLANK', '=', '!=', '>', '>=', '<', '<=', 'MAX', 'MIN', 'REGEX', 'MAX_SIZE', 'MIN_SIZE'];

    /** The condition operators that ignore `value` (it is stored empty). */
    public const VALUELESS_OPERATORS = [Operator::BLANK, Operator::NOT_BLANK, Operator::CHECKED, Operator::NOT_CHECKED];

    /**
     * The optional field setting keys this edition saves (acpt_supported_field_settings()).
     *
     * @internal
     * @return string[]
     */
    public static function supportedFieldSettings(): array
    {
        return ['required', 'description', 'default'];
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

        return self::validateBoxes($definition['boxes'] ?? null);
    }

    /**
     * The first broken rule in a list of boxes, in document order, as acpt_invalid_definition
     * with data.path (boxes[i]...). Field names must be unique across the boxes sent; a
     * condition may name any field sent or any name in $existingFieldNames (the fields a
     * group already holds, for add_acpt_meta_fields()).
     *
     * @internal
     * @param mixed $boxes
     * @param string[] $existingFieldNames
     * @return \WP_Error|null
     */
    public static function validateBoxes($boxes, array $existingFieldNames = []): ?\WP_Error
    {
        $invalid = static function (string $path): \WP_Error {
            return new \WP_Error('acpt_invalid_definition', 'Invalid definition at ' . $path . '.', ['path' => $path]);
        };

        if (!is_array($boxes) || empty($boxes)) {
            return $invalid('boxes');
        }

        $fieldNames = [];
        // every field name sent, so a condition may name a field of a later box
        $allNames = array_merge(self::sentFieldNames($boxes), $existingFieldNames);

        foreach (array_values($boxes) as $i => $box) {
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

                if (in_array($field['type'], self::choiceTypes(), true)) {
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

                $settingKey = self::invalidFieldSetting($field, $allNames);

                if ($settingKey !== null) {
                    return $invalid("$path.$settingKey");
                }
            }
        }

        return null;
    }

    /**
     * The path, below the field, of the first optional setting that breaks its rule
     * (for example `default` or `validation_rules[1].condition`), or null. A key this
     * edition doesn't save is refused when its value isn't empty (null, false, '' and
     * [] are empty), so a caller never loses a setting without knowing. Called once
     * the field's type and choices are checked.
     *
     * @internal
     * @param array<string, mixed> $field
     * @param string[]             $allNames every field name of the definition (conditions name one of them)
     * @return string|null
     */
    public static function invalidFieldSetting(array $field, array $allNames = []): ?string
    {
        $supported = self::supportedFieldSettings();
        $type = (string) $field['type'];
        $choices = in_array($type, self::choiceTypes(), true) ? array_column($field['choices'], 'value') : [];

        foreach (self::FIELD_SETTINGS as $key) {
            if (!array_key_exists($key, $field) || $field[$key] === null) {
                continue;
            }

            $value = $field[$key];

            if (!in_array($key, $supported, true)) {
                if ($value === false || $value === '' || $value === []) {
                    continue;
                }

                return $key;
            }

            switch ($key) {
                case 'required':
                    if (!is_bool($value)) {
                        return $key;
                    }
                    break;

                case 'description':
                    if (!is_string($value) || strlen($value) > self::DESCRIPTION_MAX_BYTES) {
                        return $key;
                    }
                    break;

                case 'default':
                    if (!self::isValidDefault($type, $choices, $value)) {
                        return $key;
                    }
                    break;

                case 'advanced_options':
                    $option = self::invalidAdvancedOption($type, $value);

                    if ($option !== null) {
                        return $option;
                    }
                    break;

                case 'validation_rules':
                    $rule = self::invalidValidationRule($value);

                    if ($rule !== null) {
                        return $rule;
                    }
                    break;

                case 'conditions':
                    $condition = self::invalidCondition($value, (string)$field['name'], $allNames);

                    if ($condition !== null) {
                        return $condition;
                    }
                    break;
            }
        }

        return null;
    }

    /**
     * A `default` passes the field type's value check (the value table, list types
     * within the choices), and its string, or its items joined with `,`, is at most
     * 255 characters, with no item holding a comma.
     *
     * @internal
     * @param string   $type
     * @param string[] $choices
     * @param mixed    $value
     * @return bool
     */
    public static function isValidDefault(string $type, array $choices, $value): bool
    {
        if (self::validateValue(['type' => $type, 'choices' => $choices, 'supported' => true], $value) !== null) {
            return false;
        }

        if (is_array($value)) {
            foreach ($value as $item) {
                if (strpos($item, ',') !== false) {
                    return false;
                }
            }

            return mb_strlen(implode(',', $value), 'UTF-8') <= self::VALUE_MAX_CHARS;
        }

        return mb_strlen(self::defaultValueAsString($value), 'UTF-8') <= self::VALUE_MAX_CHARS;
    }

    /**
     * A default as `field_default_value` stores it (MetaFieldModel::getDefaultValueAsString()):
     * a list as JSON, a bool as '1'/'0', anything else as its string.
     *
     * @internal
     * @param mixed $value
     * @return string
     */
    public static function defaultValueAsString($value): string
    {
        if ($value === null) {
            return '';
        }

        if (is_array($value)) {
            return (string) json_encode(array_values($value));
        }

        if (is_bool($value)) {
            return $value ? '1' : '0';
        }

        return (string) $value;
    }

    /**
     * The path of the first broken `advanced_options` rule, or null: a map of known keys
     * to strings of at most 255 characters; `min`, `max` and `step` numeric and only on
     * a Number, `min` not above `max`; `rows` a positive integer and only on a Textarea.
     *
     * @internal
     * @param string $type
     * @param mixed  $value
     * @return string|null
     */
    public static function invalidAdvancedOption(string $type, $value): ?string
    {
        $key = 'advanced_options';

        if (!is_array($value) || ($value !== [] && array_values($value) === $value)) {
            return $key;
        }

        foreach ($value as $option => $text) {
            if (!is_string($option) || !in_array($option, self::ADVANCED_OPTION_KEYS, true) || !is_string($text) || mb_strlen($text, 'UTF-8') > self::VALUE_MAX_CHARS) {
                return "$key.$option";
            }

            if (in_array($option, ['min', 'max', 'step'], true)) {
                return "$key.$option";
            }

            if ($option === 'rows' && ($type !== MetaFieldModel::TEXTAREA_TYPE || !ctype_digit($text) || (int)$text < 1)) {
                return "$key.$option";
            }
        }

        if (isset($value['min'], $value['max']) && (float)$value['min'] > (float)$value['max']) {
            return "$key.min";
        }

        return null;
    }

    /**
     * The path of the first broken `validation_rules` rule, or null: a list of
     * `{condition, value, message?}`, `condition` one of RULE_CONDITIONS, `value` a
     * string of at most 255 characters, `message` a string of at most 255 characters
     * (the editor's cap) when present.
     *
     * @internal
     * @param mixed $value
     * @return string|null
     */
    public static function invalidValidationRule($value): ?string
    {
        $key = 'validation_rules';

        if (!is_array($value) || array_values($value) !== $value) {
            return $key;
        }

        foreach ($value as $i => $rule) {
            if (!is_array($rule) || !isset($rule['condition']) || !is_string($rule['condition']) || !in_array($rule['condition'], self::RULE_CONDITIONS, true)) {
                return "{$key}[$i].condition";
            }

            if (!isset($rule['value']) || !is_string($rule['value']) || mb_strlen($rule['value'], 'UTF-8') > self::VALUE_MAX_CHARS) {
                return "{$key}[$i].value";
            }

            if (isset($rule['message']) && (!is_string($rule['message']) || mb_strlen($rule['message'], 'UTF-8') > self::VALUE_MAX_CHARS)) {
                return "{$key}[$i].message";
            }
        }

        return null;
    }

    /**
     * Reads one group straight from the database (never through ACPT's cache, so rows the
     * caller wrote earlier in its transaction are visible): its boxes in sort order, each
     * with its top level fields in sort order. Child fields of a repeater or flexible
     * block are not listed. Null when no group has this id.
     *
     * @internal
     * @param string $groupId
     * @return array{id: string, name: string, boxes: list<array{id: string, name: string, sort: int, fields: list<array{id: string, name: string, type: string, label: string, sort: int}>}>}|null
     */
    public static function readGroupStructure(string $groupId): ?array
    {
        $groups = self::selectRows(
            "SELECT `id`, `group_name` FROM `" . ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_GROUP) . "` WHERE `id` = %s",
            [$groupId]
        );

        if (empty($groups)) {
            return null;
        }

        $boxRows = self::selectRows(
            "SELECT `id`, `meta_box_name`, `sort` FROM `" . ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_BOX) . "` WHERE `group_id` = %s ORDER BY `sort` ASC, `id` ASC",
            [$groupId]
        );

        $fieldsByBox = [];

        foreach ($boxRows as $row) {
            $fieldsByBox[(string) $row['id']] = [];
        }

        if (!empty($fieldsByBox)) {
            $placeholders = implode(', ', array_fill(0, count($fieldsByBox), '%s'));
            $fieldRows = self::selectRows(
                "SELECT `id`, `meta_box_id`, `field_name`, `field_label`, `field_type`, `sort` FROM `" . ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_FIELD) . "` WHERE `meta_box_id` IN ({$placeholders}) AND (`parent_id` IS NULL OR `parent_id` = '') AND (`block_id` IS NULL OR `block_id` = '') ORDER BY `sort` ASC, `id` ASC",
                array_map('strval', array_keys($fieldsByBox))
            );

            foreach ($fieldRows as $row) {
                $fieldsByBox[(string) $row['meta_box_id']][] = [
                    'id' => (string) $row['id'],
                    'name' => (string) $row['field_name'],
                    'type' => (string) $row['field_type'],
                    'label' => (string) $row['field_label'],
                    'sort' => (int) $row['sort'],
                ];
            }
        }

        $boxes = [];

        foreach ($boxRows as $row) {
            $boxes[] = [
                'id' => (string) $row['id'],
                'name' => (string) $row['meta_box_name'],
                'sort' => (int) $row['sort'],
                'fields' => $fieldsByBox[(string) $row['id']],
            ];
        }

        return ['id' => (string) $groups[0]['id'], 'name' => (string) $groups[0]['group_name'], 'boxes' => $boxes];
    }

    /**
     * Runs one SELECT straight against the database.
     *
     * @param string $query
     * @param array<int, string> $args
     * @return list<array<string, mixed>>
     * @throws \RuntimeException on a database error
     */
    private static function selectRows(string $query, array $args): array
    {
        global $wpdb;

        $rows = $wpdb->get_results($wpdb->prepare($query, $args), ARRAY_A);

        if (!is_array($rows) || $wpdb->last_error !== '') {
            throw new \RuntimeException('The meta group could not be read.');
        }

        return array_values($rows);
    }

    /**
     * Inserts one box of a validated definition into a group.
     *
     * @internal
     * @param string $groupId
     * @param array<string, mixed> $box
     * @param int $sort
     * @return string the new box id
     * @throws \Exception
     */
    public static function insertBox(string $groupId, array $box, int $sort): string
    {
        $boxId = Uuid::v4();

        ACPT_Lite_DB::executeQueryOrThrowException(
            "INSERT INTO `" . ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_BOX) . "` (`id`, `group_id`, `meta_box_name`, `meta_box_label`, `settings`, `sort`) VALUES (%s, %s, %s, %s, %s, %d)",
            [$boxId, $groupId, $box['name'], trim($box['label']), '[]', $sort]
        );

        return $boxId;
    }

    /**
     * Inserts the validated fields of one box, with their settings and choices, sorted from
     * $firstSort on. Conditions are not saved here: each one goes into $pendingConditions,
     * for insertConditions() once every field has its id.
     *
     * @internal
     * @param string $boxId
     * @param array<int, array<string, mixed>> $fields
     * @param int $firstSort
     * @param array<int, array{0: string, 1: string, 2: array<mixed>}> $pendingConditions
     * @return array<string, string> field name => new field id
     * @throws \Exception
     */
    public static function insertFields(string $boxId, array $fields, int $firstSort, array &$pendingConditions): array
    {
        $fieldIds = [];

        foreach (array_values($fields) as $fieldIndex => $field) {
            $fieldId = Uuid::v4();

            ACPT_Lite_DB::executeQueryOrThrowException(
                "INSERT INTO `" . ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_FIELD) . "` (`id`, `meta_box_id`, `field_name`, `field_label`, `field_type`, `sort`, `showInArchive`, `required`, `quick_edit`, `filter_in_admin`, `field_description`, `field_default_value`) VALUES (%s, %s, %s, %s, %s, %d, %d, %d, %d, %d, %s, %s)",
                [$fieldId, $boxId, $field['name'], trim($field['label']), $field['type'], $firstSort + $fieldIndex, 0, (($field['required'] ?? false) === true) ? 1 : 0, 0, 0, (string)($field['description'] ?? ''), self::defaultValueAsString($field['default'] ?? null)]
            );

            // Empty on an edition that doesn't save them: validation refused any other value
            foreach (($field['advanced_options'] ?? null) ?: [] as $optionKey => $optionValue) {
            }

            foreach (($field['validation_rules'] ?? null) ?: [] as $ruleIndex => $rule) {
                $ruleId = Uuid::v4();
            }

            if (in_array($field['type'], self::choiceTypes(), true)) {
                foreach ($field['choices'] as $choiceIndex => $choice) {
                    ACPT_Lite_DB::executeQueryOrThrowException(
                        "INSERT INTO `" . ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_OPTION) . "` (`id`, `meta_box_id`, `meta_field_id`, `option_label`, `option_value`, `sort`, `is_default`) VALUES (%s, %s, %s, %s, %s, %d, %d)",
                        [Uuid::v4(), $boxId, $fieldId, $choice['label'], $choice['value'], $choiceIndex, 0]
                    );
                }
            }

            $fieldIds[$field['name']] = $fieldId;

            if (is_array($field['conditions'] ?? null) && !empty($field['conditions'])) {
                $pendingConditions[] = [$boxId, $fieldId, $field['conditions']];
            }
        }

        return $fieldIds;
    }

    /**
     * Saves the conditions insertFields() set aside. Each condition names its field by
     * name, resolved through $fieldIds (every field of the group the condition may name).
     *
     * @internal
     * @param array<int, array{0: string, 1: string, 2: array<mixed>}> $pendingConditions
     * @param array<string, string> $fieldIds field name => field id
     * @throws \Exception
     */
    public static function insertConditions(array $pendingConditions, array $fieldIds): void
    {
        // Empty on an edition that doesn't save them: validation refused any other value
        foreach ($pendingConditions as [$boxId, $fieldId, $conditions]) {
            foreach (array_values($conditions) as $sort => $condition) {
                $valueless = in_array($condition['operator'], self::VALUELESS_OPERATORS, true);
            }
        }
    }

    /**
     * The names of every field in the sent boxes (whatever their other keys hold).
     *
     * @internal
     * @param array<mixed> $boxes
     * @return string[]
     */
    public static function sentFieldNames(array $boxes): array
    {
        $names = [];

        foreach ($boxes as $box) {
            foreach ((is_array($box) && is_array($box['fields'] ?? null)) ? $box['fields'] : [] as $field) {
                if (is_array($field) && is_string($field['name'] ?? null)) {
                    $names[] = $field['name'];
                }
            }
        }

        return $names;
    }

    /**
     * The path of the first broken `conditions` entry, or null: a list of
     * `{field, operator, value, logic, back_end?, front_end?}`, `field` the name of
     * another field of the same definition (any box), `operator` one of ACPT's
     * operators, `value` a string of at most 255 characters (it may be left out for
     * BLANK, NOT_BLANK, CHECKED and NOT_CHECKED, which ignore it), `logic` AND or OR,
     * `back_end` and `front_end` bools when present.
     *
     * @internal
     * @param mixed    $value
     * @param string   $selfName the field carrying the conditions
     * @param string[] $allNames
     * @return string|null
     */
    public static function invalidCondition($value, string $selfName, array $allNames): ?string
    {
        $key = 'conditions';

        if (!is_array($value) || array_values($value) !== $value) {
            return $key;
        }

        foreach ($value as $i => $condition) {
            if (!is_array($condition) || !isset($condition['field']) || !is_string($condition['field']) || $condition['field'] === $selfName || !in_array($condition['field'], $allNames, true)) {
                return "{$key}[$i].field";
            }

            if (!isset($condition['operator']) || !is_string($condition['operator']) || !in_array($condition['operator'], Operator::ALLOWED_VALUES, true)) {
                return "{$key}[$i].operator";
            }

            $valueless = in_array($condition['operator'], self::VALUELESS_OPERATORS, true);

            if ((!$valueless || isset($condition['value'])) && (!isset($condition['value']) || !is_string($condition['value']) || mb_strlen($condition['value'], 'UTF-8') > self::VALUE_MAX_CHARS)) {
                return "{$key}[$i].value";
            }

            if (!isset($condition['logic']) || !in_array($condition['logic'], [Logic::AND, Logic::OR], true)) {
                return "{$key}[$i].logic";
            }

            foreach (['back_end', 'front_end'] as $flag) {
                if (array_key_exists($flag, $condition) && !is_bool($condition[$flag])) {
                    return "{$key}[$i].$flag";
                }
            }
        }

        return null;
    }

    /**
     * The message to store for a valid `validation_rules` rule: the sent message as
     * sent, or, when it is missing, null or only whitespace, ACPT's default message for
     * the rule's condition, translated in the site language now (`{{v}}` kept).
     *
     * @internal
     * @param array{condition: string, value: string, message?: string|null} $rule
     * @return string
     */
    public static function ruleMessage(array $rule): string
    {
        $message = $rule['message'] ?? null;

        if (is_string($message) && trim($message) !== '') {
            return $message;
        }

        return '';
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
