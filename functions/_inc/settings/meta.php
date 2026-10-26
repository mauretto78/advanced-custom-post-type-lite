<?php

use ACPT_Lite\Core\CQRS\Command\DeleteMetaGroupCommand;
use ACPT_Lite\Core\CQRS\Command\SaveMetaGroupCommand;
use ACPT_Lite\Core\CQRS\Query\FetchMetaGroupsQuery;
use ACPT_Lite\Core\Repository\MetaRepository;
use ACPT_Lite\Utils\Data\Normalizer;
use ACPT_Lite\Utils\PHP\Arrays;

if (!function_exists('save_acpt_meta_group')) {
    /**
     * @param array<string, mixed> $args
     *
     * @return bool
     */
    function save_acpt_meta_group(array $args): bool
    {
        try {
            // No id supplied: resolve identity by name so a partial update (e.g. belongs-only,
            // boxes-only) merges onto the existing group instead of creating an orphan duplicate
            // or wiping fields the caller didn't include.
            if (!isset($args['id']) && !empty($args['name'])) {
                $existingGroup = MetaRepository::get([
                    'groupName' => $args['name'],
                ]);

                if (count($existingGroup) === 1) {
                    $args = array_merge($existingGroup[0]->toArray(), $args);
                }
            }

            $command = new SaveMetaGroupCommand($args);
            $command->execute();

            return true;
        } catch (\Exception $exception) {
            do_action("acpt/error", $exception);

            return false;
        }
    }
}

if (!function_exists('delete_acpt_meta_group')) {
    /**
     * @param string $groupName
     *
     * @return bool
     */
    function delete_acpt_meta_group(string $groupName): bool
    {
        try {
            $group = MetaRepository::get([
                'groupName' => $groupName
            ]);

            if (count($group) !== 1) {
                return false;
            }

            $command = new DeleteMetaGroupCommand($group[0]->getId());
            $command->execute();

            return true;
        } catch (\Exception $exception) {
            do_action("acpt/error", $exception);

            return false;
        }
    }
}

if (!function_exists('get_acpt_meta_group_objects')) {
    /**
     * @param array<string, mixed> $args
     * @return array<int, mixed>
     */
    function get_acpt_meta_group_objects(array $args = []): array
    {
        try {
            $groups = (new FetchMetaGroupsQuery(array_merge($args, ['cct' => true])))->execute();

            if (empty($groups)) {
                return [];
            }

            $groupObjects = [];

            foreach ($groups as $group) {
                $groupObjects[] = $group->toStdObject();
            }

            return $groupObjects;
        } catch (\Exception $exception) {
            do_action("acpt/error", $exception);

            return [];
        }
    }
}

if (!function_exists('get_acpt_meta_group_object')) {
    /**
     * @param string $groupName
     *
     * @return mixed|null
     */
    function get_acpt_meta_group_object(string $groupName)
    {
        try {
            $group = MetaRepository::get([
                'groupName' => $groupName,
            ]);

            if (count($group) !== 1) {
                return null;
            }

            return $group[0]->toStdObject();
        } catch (\Exception $exception) {
            do_action("acpt/error", $exception);

            return null;
        }
    }
}

if (!function_exists('save_acpt_meta_box')) {
    /**
     * Add or update meta box settings. This function replaces:
     *
     * - add_acpt_meta_box
     *
     * @param array<string, mixed> $args
     *
     * @return bool
     */
    function save_acpt_meta_box(array $args): bool
    {
        try {
            $group = MetaRepository::get([
                'groupName' => @$args['groupName']
            ]);

            if (count($group) !== 1) {
                return false;
            }

            $box = [
                'name' => $args['name'],
                'new_name' => isset($args['new_name']) ? $args['new_name'] : null,
            ];

            if (isset($args['label'])) {
                $box['label'] = $args['label'];
            }

            if (isset($args['fields'])) {
                $box['fields'] = $args['fields'];
            }

            $data = $group[0]->toArray();

            // Prefer an explicit box id when given — two boxes in one group can
            // share the same internal `name`, and a name-only lookup always
            // resolves to the first match (see save_acpt_meta_field()).
            $boxId = $args['boxId'] ?? $args['box_id'] ?? null;
            $foundIndex = false;

            if ($boxId !== null) {
                $foundIndex = Arrays::findIndex($data['boxes'], 'id', $boxId);
            }

            if ($foundIndex === false) {
                $foundIndex = Arrays::findIndex($data['boxes'], 'name', $args['name']);
            }

            if ($foundIndex !== false) {
                // Merge onto the existing box's full stored state so a partial
                // update (e.g. just changing `label`) doesn't wipe settings/
                // visibilityConditions/fields that weren't resent — previously
                // this was a full replace with only 4 hardcoded keys, silently
                // deleting every box-level visibility rule and settings override
                // on every single save_acpt_meta_box() call.
                $box = array_merge($data['boxes'][$foundIndex], $box);
                $data['boxes'][$foundIndex] = $box;
            } else {
                $box['label'] = $box['label'] ?? null;
                $box['fields'] = $box['fields'] ?? [];
                $data['boxes'][] = $box;
            }

            $command = new SaveMetaGroupCommand($data);
            $command->execute();

            return true;
        } catch (\Exception $exception) {
            do_action("acpt/error", $exception);

            return false;
        }
    }
}

if (!function_exists('delete_acpt_meta_box')) {
    /**
     * @param string $groupName
     * @param string $boxName
     *
     * @return bool
     */
    function delete_acpt_meta_box(string $groupName, string $boxName): bool
    {
        try {
            $group = MetaRepository::get([
                'groupName' => $groupName
            ]);

            if (count($group) !== 1) {
                return false;
            }

            $data = $group[0]->toArray();

            foreach ($data['boxes'] as $boxIndex => $box) {
                if ($box['name'] === $boxName) {
                    unset($data['boxes'][$boxIndex]);
                }
            }

            $command = new SaveMetaGroupCommand($data);
            $command->execute();

            return true;
        } catch (\Exception $exception) {
            do_action("acpt/error", $exception);

            return false;
        }
    }
}

if (!function_exists('get_acpt_box_object')) {
    /**
     * @param string $boxName
     *
     * @return \stdClass|null
     */
    function get_acpt_box_object(string $boxName): ?\stdClass
    {
        try {
            $box = MetaRepository::getMetaBoxByName($boxName);

            if ($box === null) {
                return null;
            }

            return $box->toStdObject();
        } catch (\Exception $exception) {
            do_action("acpt/error", $exception);

            return null;
        }
    }
}

if (!function_exists('_acpt_remove_field_by_id_recursive')) {
    /**
     * Removes a field with the given id from a (possibly nested, via `children`)
     * array of raw field arrays, in place. Used by save_acpt_meta_field() to strip
     * a stale copy of a field being edited before re-appending its updated version
     * as a flat entry, regardless of whether the stale copy lived at the top level
     * or nested inside a parent's `children`.
     *
     * @param array<int, array<string, mixed>> $fields
     * @param string $id
     *
     * @return bool True if a field was removed.
     */
    function _acpt_remove_field_by_id_recursive(array &$fields, string $id): bool
    {
        foreach ($fields as $index => &$field) {
            if (($field['id'] ?? null) === $id) {
                unset($fields[$index]);
                $fields = array_values($fields);
                return true;
            }

            if (!empty($field['children']) && is_array($field['children'])) {
                if (_acpt_remove_field_by_id_recursive($field['children'], $id)) {
                    return true;
                }
            }
        }

        return false;
    }
}

if (!function_exists('_acpt_replace_field_by_id_recursive')) {
    /**
     * Replaces the field with the given id, at whatever depth it lives (via `children`),
     * keeping its position. Used by save_acpt_meta_field() to update a field in place.
     *
     * @param array<int, array<string, mixed>> $fields
     * @param string $id
     * @param array<string, mixed> $newField
     *
     * @return bool True if a field was replaced.
     */
    function _acpt_replace_field_by_id_recursive(array &$fields, string $id, array $newField): bool
    {
        foreach ($fields as $index => &$field) {
            if (($field['id'] ?? null) === $id) {
                $fields[$index] = $newField;

                return true;
            }

            if (!empty($field['children']) && is_array($field['children'])) {
                if (_acpt_replace_field_by_id_recursive($field['children'], $id, $newField)) {
                    return true;
                }
            }
        }

        return false;
    }
}

if (!function_exists('_acpt_find_field_by_name_recursive')) {
    /**
     * Finds a field with the given name in a (possibly nested, via `children`)
     * array of raw field arrays and returns it by reference-free copy, or null.
     * Used by save_acpt_meta_field() to resolve the field being edited from
     * within a single, already-disambiguated box's `fields` sub-array, instead
     * of a group-wide `MetaRepository::getMetaFieldByName()` lookup that keys
     * only on the (possibly non-unique) box name.
     *
     * @param array<int, array<string, mixed>> $fields
     * @param string $name
     *
     * @return array<string, mixed>|null
     */
    function _acpt_find_field_by_name_recursive(array $fields, string $name): ?array
    {
        foreach ($fields as $field) {
            if (($field['name'] ?? null) === $name) {
                return $field;
            }

            if (!empty($field['children']) && is_array($field['children'])) {
                $found = _acpt_find_field_by_name_recursive($field['children'], $name);

                if ($found !== null) {
                    return $found;
                }
            }
        }

        return null;
    }
}

if (!function_exists('save_acpt_meta_field')) {
    /**
     * Add or update meta field settings. This function replaces:
     *
     * - add_acpt_meta_field
     *
     * @param array<string, mixed> $args
     *
     * @return bool
     */
    function save_acpt_meta_field(array $args): bool
    {
        try {
            $groupName = $args['groupName'] ?? $args['group_name'];
            $boxName = $args['boxName'] ?? $args['box_name'];
            $boxId = $args['boxId'] ?? $args['box_id'] ?? null;

            $group = MetaRepository::get([
                'groupName' => @$groupName
            ]);

            if (count($group) !== 1) {
                return false;
            }

            $field = $args;
            unset($field['groupName']);
            unset($field['group_name']);
            unset($field['boxName']);
            unset($field['box_name']);
            unset($field['boxId']);
            unset($field['box_id']);

            $data = $group[0]->toArray();

            // Resolve the target box by id first when one is given: a meta group
            // can hold two boxes that share the same internal `name`, and a plain
            // name lookup (array_search over array_column) only ever returns the
            // first match — so naming the second box for a field that lives there
            // would silently write into the first box, corrupting its schema rows.
            $foundBoxIndex = false;

            if ($boxId !== null) {
                $foundBoxIndex = Arrays::findIndex($data['boxes'], 'id', $boxId);
            }

            if ($foundBoxIndex === false) {
                $foundBoxIndex = Arrays::findIndex($data['boxes'], 'name', $boxName);
            }

            if ($foundBoxIndex === false) {
                return false;
            }

            if (
                isset($args['parentName']) ||
                isset($args['parent_name'])
            ) {
                $parentFieldName = (isset($args['parentName'])) ? $args['parentName'] : $args['parent_name'];
                $parentFieldArray = _acpt_find_field_by_name_recursive($data['boxes'][$foundBoxIndex]['fields'], $parentFieldName);

                if (is_array($parentFieldArray) && isset($parentFieldArray['id'])) {
                    $field['parentId'] = $parentFieldArray['id'];
                } else {
                    $parentFieldModel = MetaRepository::getMetaFieldByName([
                        'boxName' => @$boxName,
                        'fieldName' => $parentFieldName,
                    ]);

                    if ($parentFieldModel === null) {
                        return false;
                    }

                    $field['parentId'] = $parentFieldModel->getId();
                }

                unset($field['parentName']);
                unset($field['parent_name']);
            }

            if (
                isset($args['newName']) ||
                isset($args['new_name'])
            ) {
                $field['name'] = isset($args['newName']) ? $args['newName'] : $args['new_name'];
                unset($field['newName']);
                unset($field['new_name']);
            }

            // Bug: this used to search $data['boxes'][$foundBoxIndex] (the box dict
            // itself — keys id/name/label/settings/sort/visibilityConditions/fields,
            // none of which is a per-field 'name') instead of its 'fields' sub-array.
            // array_column() over the wrong shape never matched anything, so every
            // update silently fell through to the "append as new" branch below:
            // editing a field without renaming it appended a truncated duplicate
            // that MetaBoxModel::addField()'s dedup-by-id then discarded (the edit
            // was silently dropped), and renaming a field created a genuine orphan
            // duplicate (old name kept its original data, new name got a fresh id).
            //
            // A plain array search over $data['boxes'][$foundBoxIndex]['fields'] only
            // looks at TOP-LEVEL fields — a child field (edited via `parentName`)
            // lives nested inside its parent's own `children` array in this same
            // $data structure (that's how toArray()/jsonSerialize() represent the
            // tree), so it would never be found there either, and would get
            // appended as a redundant duplicate flat sibling instead of replacing
            // the existing nested entry. MetaRepository::getMetaFieldByName() finds
            // a field regardless of nesting depth, so use that instead, and
            // explicitly strip the stale nested copy before re-appending the
            // updated field as a flat entry (which is already how parentId-linked
            // children are correctly wired up on create).
            // Resolve the field being edited from within the already-resolved box
            // first — a group-wide getMetaFieldByName() keys only on the box name,
            // which is not guaranteed unique, so under a box-name collision it
            // could merge onto (and strip) a same-named field in the *other* box.
            // Fall back to the repository lookup only when the field isn't found
            // locally (preserves the forgedBy/cloned-field path).
            $existingFieldArray = _acpt_find_field_by_name_recursive($data['boxes'][$foundBoxIndex]['fields'], $args['name']);

            if ($existingFieldArray === null) {
                $existingFieldModel = MetaRepository::getMetaFieldByName([
                    'boxName' => $boxName,
                    'fieldName' => $args['name'],
                ]);

                if ($existingFieldModel !== null) {
                    $existingFieldArray = $existingFieldModel->toArray();
                }
            }

            if (is_array($existingFieldArray) && isset($existingFieldArray['id'])) {
                // Merge onto the existing field's full stored state so a partial
                // update (e.g. just changing `label`) doesn't wipe options/
                // validationRules/visibilityConditions/permissions/children/blocks/
                // relations/advancedOptions that weren't resent.
                $field = array_merge($existingFieldArray, $field);

                // Update in place so the field keeps its position (ticket #1347: it used
                // to be moved to the bottom of the box). Only a field moved under another
                // parent is stripped and re-appended.
                $sameParent = ($field['parentId'] ?? null) === ($existingFieldArray['parentId'] ?? null);

                if (!$sameParent || !_acpt_replace_field_by_id_recursive($data['boxes'][$foundBoxIndex]['fields'], $existingFieldArray['id'], $field)) {
                    _acpt_remove_field_by_id_recursive($data['boxes'][$foundBoxIndex]['fields'], $existingFieldArray['id']);
                    $data['boxes'][$foundBoxIndex]['fields'][] = $field;
                }
            } else {
                $data['boxes'][$foundBoxIndex]['fields'][] = $field;
            }

            $command = new SaveMetaGroupCommand($data);
            $command->execute();

            return true;
        } catch (\Exception $exception) {
            do_action("acpt/error", $exception);

            return false;
        }
    }
}

if (!function_exists('delete_acpt_meta_field')) {
    /**
     * Deletes a specific meta field from a given meta box within a group.
     *
     * @param string $groupName The name of the meta group containing the box.
     * @param string $boxName The name of the meta box from which the field will be removed.
     * @param string $fieldName The name of the meta field to be deleted.
     *
     * @return bool Returns true if the field was successfully deleted, false otherwise.
     */
    function delete_acpt_meta_field(string $groupName, string $boxName, string $fieldName): bool
    {
        try {
            $group = MetaRepository::get([
                'groupName' => $groupName
            ]);

            if (count($group) !== 1) {
                return false;
            }

            $groupModel = $group[0];
            foreach ($groupModel->getBoxes() as $index => $boxModel) {
                $boxModel->removeAField($fieldName);
            }

            $data = $groupModel->toArray();

            $command = new SaveMetaGroupCommand($data);
            $command->execute();

            return true;
        } catch (\Exception $exception) {
            do_action("acpt/error", $exception);

            return false;
        }
    }
}

if (!function_exists('get_acpt_meta_field_object')) {
    /**
     * @param string $boxName Name of the meta box containing the field.
     * @param string $fieldName Name of the meta field to retrieve.
     *
     * @return \stdClass|null Returns the meta field object as a standard object, or null if the field does not exist or an error occurs.
     */
    function get_acpt_meta_field_object(string $boxName, string $fieldName): ?\stdClass
    {
        try {
            $field = MetaRepository::getMetaFieldByName([
                'boxName' => $boxName,
                'fieldName' => $fieldName,
            ]);

            if ($field === null) {
                return null;
            }

            return $field->toStdObject();
        } catch (\Exception $exception) {
            do_action("acpt/error", $exception);

            return null;
        }
    }
}

if (!function_exists('get_acpt_meta_field_objects')) {
    /**
     * Retrieves meta field objects associated with a specific entity, optionally including cloned fields and filtered by a search term.
     *
     * @param string $belongsTo The entity to which the meta fields belong.
     * @param bool $clonedFields Whether to include cloned fields in the results. Defaults to false.
     * @param string|null $find An optional search term to filter the meta fields. Defaults to null.
     *
     * @return array<int, mixed> An array of meta field objects. Returns an empty array in case of an exception.
     */
    function get_acpt_meta_field_objects(string $belongsTo, bool $clonedFields = false, ?string $find = null): array
    {
        $fields = [];

        try {
            $args = [
                'belongsTo' => $belongsTo,
            ];

            if ($find !== null) {
                $args['find'] = $find;
            }

            if ($clonedFields === true) {
                $args['clonedFields'] = true;
            }

            $groups = MetaRepository::get($args);

            foreach ($groups as $group) {
                foreach ($group->getBoxes() as $box) {
                    foreach ($box->getFields() as $field) {
                        $field->setBelongsToLabel($belongsTo);
                        $field->setFindLabel($find);
                        $fields[] = $field->toStdObject();
                    }
                }
            }

            return $fields;
        } catch (\Exception $exception) {
            do_action("acpt/error", $exception);

            return [];
        }
    }
}

if (!function_exists('get_acpt_meta_field_advanced_option')) {
    /**
     * @param string $box_name The name of the meta box containing the field.
     * @param string $field_name The name of the meta field whose advanced option needs to be retrieved.
     * @param string $key The key of the advanced option to retrieve.
     *
     * @return mixed|null Returns the value of the advanced option if found, or null otherwise.
     */
    function get_acpt_meta_field_advanced_option(string $box_name, string $field_name, string $key)
    {
        $field_object = get_acpt_meta_field_object($box_name, $field_name);

        if ($field_object === null) {
            return null;
        }

        foreach ($field_object->advancedOptions as $index => $advancedOption) {
            if ($advancedOption->key === $key) {
                return $advancedOption->value;
            }
        }

        return null;
    }
}

if (!function_exists('acpt_get_field_options')) {
    /**
     * @param string $box_name The name of the meta box containing the field.
     * @param string $field_name The name of the field for which options are retrieved.
     *
     * @return array<int, mixed> Returns an array of options for the specified field. Each option is an associative array with keys 'label' and 'value'.
     */
    function acpt_get_field_options(string $box_name, string $field_name): array
    {
        $field_object = get_acpt_meta_field_object($box_name, $field_name);

        if (empty($field_object)) {
            return [];
        }

        $field_object_array = Normalizer::objectToArray($field_object);

        $options = [];

        if (empty($field_object_array['options'])) {
            return $options;
        }

        foreach ($field_object_array['options'] as $option) {
            $options[] = [
                'label' => $option['label'],
                'value' => $option['value'],
            ];
        }

        return $options;
    }
}

if (!function_exists('get_acpt_meta_field_before_and_after')) {
    /**
     * @param string $box_name The name of the meta box.
     * @param string $field_name The name of the meta field within the meta box.
     *
     * @return array<string, mixed> An associative array containing the 'before' and 'after' values:
     *               - 'before': The value corresponding to the 'before' key in the advanced options, or null if not set.
     *               - 'after': The value corresponding to the 'after' key in the advanced options, or null if not set.
     */
    function get_acpt_meta_field_before_and_after(string $box_name, string $field_name): array
    {
        $before = null;
        $after = null;
        $field_object = get_acpt_meta_field_object($box_name, $field_name);

        if ($field_object === null) {
            return [
                'before' => $before,
                'after' => $after,
            ];
        }

        $field_object_array = Normalizer::objectToArray($field_object);

        foreach ($field_object_array['advancedOptions'] as $index => $advancedOption) {
            if ($advancedOption['key'] === 'after') {
                $after = $advancedOption['value'];
            }

            if ($advancedOption['key'] === 'before') {
                $before = $advancedOption['value'];
            }
        }

        return [
            'before' => $before,
            'after' => $after,
        ];
    }
}
