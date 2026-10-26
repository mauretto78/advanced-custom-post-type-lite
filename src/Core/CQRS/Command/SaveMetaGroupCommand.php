<?php

namespace ACPT_Lite\Core\CQRS\Command;

use ACPT_Lite\Constants\MetaGroupDisplay;
use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Helper\Uuid;
use ACPT_Lite\Core\Models\Belong\BelongModel;
use ACPT_Lite\Core\Models\Meta\MetaBoxModel;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Core\Models\Meta\MetaGroupModel;
use ACPT_Lite\Core\Repository\MetaRepository;
use ACPT_Lite\Core\Validators\ArgumentsArrayValidator;
use ACPT_Lite\Utils\PHP\Arrays;
use ACPT_Lite\Utils\PHP\Sluggify;

class SaveMetaGroupCommand implements CommandInterface, LogFormatInterface
{
    /**
     * @var array<string, mixed>
     */
    private array $data;

    /**
     * SaveMetaGroupCommand constructor.
     *
     * @param array<string, mixed> $data
     */
    public function __construct(array $data)
    {
        $this->data = $data;
    }

    /**
     * @return string
     * @throws \Exception
     */
    public function execute(): string
    {
        $validator = new ArgumentsArrayValidator();

        if (!$validator->validate(MetaGroupModel::validationRules(), $this->data)) {
            throw new \InvalidArgumentException($validator->errorMessage());
        }

        // Every box needs a name: without one the save used to die with a TypeError
        // (Sluggify::slug(null)) and a 500. Checked before anything is written, so a
        // rejected save leaves the group untouched.
        foreach ($this->data['boxes'] ?? [] as $boxIndex => $box) {
            if (!is_array($box) || !isset($box['name']) || !is_string($box['name']) || trim($box['name']) === '') {
                throw new \InvalidArgumentException("Meta box #" . ($boxIndex + 1) . " has no name");
            }
        }

        // Avoid any name duplicate
        $allNames = MetaRepository::getNames();

        $data = $this->data;
        $arrayOfGroupNames = [];
        $arrayOfBoxNames = [];
        $arrayOfFieldNames = [];
        $arrayOfBlockNames = [];
        $ids = [];

        foreach ($allNames['groups'] as $group) {
            if (!isset($data['id']) || $group['id'] !== $data['id']) {
                $arrayOfGroupNames[] = $group['name'];
            }
        }

        $groupName  = Sluggify::slug($data['name']);

        if (isset($data['id'])) {
            $groupId = $data['id'];

            if (isset($data['new_name'])) {
                $groupName  = Sluggify::slug($data['new_name']);
            }

            if (isset($data['newName'])) {
                $groupName  = Sluggify::slug($data['newName']);
            }
        } else {
            $groupId = Uuid::v4();
        }

        $groupLabel  = isset($data['label']) ? $data['label'] : null;
        $boxes  = isset($data['boxes']) ? $data['boxes'] : [];
        $belongs = isset($data['belongs']) ? $data['belongs'] : [];

        // Site-wide uniqueness seed for box/field names (mirrors $arrayOfGroupNames above):
        // collect the ids of every box/field already present in this payload (i.e. existing
        // records being updated in place), then seed the exclusion list with every OTHER
        // box/field name already in the DB. A brand-new box/field (no id yet) excludes
        // nothing here, so it's correctly checked against every existing name — fixing the
        // previous bug where a save containing only brand-new boxes/fields (the common
        // "create a new group from scratch" flow) skipped this check entirely.
        //
        // A box/top-level-field resent WITHOUT an id (resolved further below by a
        // name-within-group/name-within-box lookup, mirroring save_acpt_meta_box()/
        // save_acpt_meta_field()'s own id-less resend path) still needs its real DB id
        // excluded here too, or it would incorrectly appear to collide with itself.
        $incomingBoxIds = [];
        foreach ($boxes as $b) {
            if (isset($b['id'])) {
                $incomingBoxIds[$b['id']] = true;
            } elseif (isset($b['name']) && ($existingBox = MetaRepository::getMetaBoxByName(Sluggify::slug($b['name']), $groupId))) {
                $incomingBoxIds[$existingBox->getId()] = true;
            }
        }

        foreach ($allNames['boxes'] as $box) {
            if (!isset($incomingBoxIds[$box['id']])) {
                $arrayOfBoxNames[] = $box['name'];
            }
        }

        $incomingFieldIds = [];
        foreach ($boxes as &$b) {
            if (!isset($b['fields']) || !is_array($b['fields'])) {
                continue;
            }

            $bBoxName = isset($b['name']) ? Sluggify::slug($b['name']) : null;

            foreach ($b['fields'] as &$field) {
                if (!isset($field['id']) && $bBoxName !== null && isset($field['name'])) {
                    $existingField = MetaRepository::getMetaFieldByName([
                        'fieldName' => Sluggify::slug($field['name']),
                        'boxName' => $bBoxName,
                    ]);

                    if ($existingField) {
                        $incomingFieldIds[$existingField->getId()] = true;
                    }
                }

                $this->collectIncomingFieldIds($field, $incomingFieldIds);
            }
            unset($field);
        }
        unset($b);

        // Field names only need to be unique within their own box: the stored meta key is
        // <box>_<field> and box names are already unique site-wide, so the same field name
        // in two different boxes never collides (#1421/#1422). Seed one list per box with
        // the names of that box's stored fields that are not in this payload.
        // $persistedFields lets hydration leave an existing field's name alone when it
        // hasn't changed, so a save never renames a field the user didn't touch.
        $fieldNamesByBox = [];
        $persistedFields = [];
        foreach ($allNames['fields'] as $fieldRow) {
            $persistedFields[$fieldRow['id']] = [
                'name' => $fieldRow['name'],
                'box_id' => $fieldRow['box_id'],
            ];

            if (!isset($incomingFieldIds[$fieldRow['id']])) {
                $fieldNamesByBox[$fieldRow['box_id']][] = $fieldRow['name'];
            }
        }

        foreach ($boxes as $b) {
            if (isset($b['fields']) && is_array($b['fields'])) {
                $this->recursiveSetArrayOfBlockNames($b['fields'], $allNames, $arrayOfBlockNames);
            }
        }

        $ids[$groupId] = [
            'belongs' => [],
            'boxes' => [],
            'fields' => [],
            'options' => [],
            'boxVisibilityConditions' => [],
            'visibilityConditions' => [],
            'validationRules' => [],
            'relations' => [],
            'blocks' => [],
        ];

        $groupModel = MetaGroupModel::hydrateFromArray([
            'id' => $groupId,
            'name' => $groupName,
            'label' => $groupLabel,
            'display' => ($data['display'] ?? MetaGroupDisplay::STANDARD),
        ]);

        if (isset($data['priority']) && !empty($data['priority'])) {
            $groupModel->setPriority($data['priority']);
        }

        if (isset($data['context']) && !empty($data['context'])) {
            $groupModel->setContext($data['context']);
        }

        if (empty($groupModel->getContext())) {
            $groupModel->setContext('advanced');
        }

        if (empty($groupModel->getPriority())) {
            $groupModel->setPriority('default');
        }

        $groupModel->changeName(Strings::getTheFirstAvailableName($groupModel->getName(), $arrayOfGroupNames));

        // belongs
        foreach ($belongs as $belongIndex => $belong) {
            // @TODO saving in cache

            $belongsTo = $belong['belongsTo'] ?? $belong['belongs_to'];

            if (!empty($belongsTo)) {
                $find = $belong['find'] ?? null;

                // the admin UI always sends an array (an empty one for valueless rules
                // like "All users"/"All comments"), BelongModel::$find is ?string
                if (is_array($find)) {
                    $find = !empty($find) ? implode(",", $find) : null;
                }

                $operator = $belong['operator'] ?? null;
                $operatorRequired = ($belongsTo !== MetaTypes::USER && $belongsTo !== MetaTypes::COMMENT);

                // reject up front: an empty operator on a type that requires one would otherwise
                // hydrate silently (BelongModel::setOperator() no-ops on empty) and crash later,
                // at visibility-evaluation time, instead of failing loudly here at save time.
                if ($operatorRequired && empty($operator)) {
                    do_action("acpt/error", new \DomainException(
                        'Skipped invalid belongs rule: operator is required for belongsTo "' . $belongsTo . '"'
                    ));

                    continue;
                }

                try {
                    $belongModel = BelongModel::hydrateFromArray([
                        'id' => (isset($belong['id']) ? $belong['id'] : Uuid::v4()),
                        'belongsTo' => @$belongsTo,
                        'operator' => $operator,
                        'find' => $find,
                        'logic' => (isset($belong['logic']) ? $belong['logic'] : null),
                        'sort' => ($belongIndex+1),
                    ]);

                    $groupModel->addBelong($belongModel);
                    $ids[$groupId]['belongs'][] = $belongModel->getId();
                } catch (\Throwable $exception) {
                    do_action("acpt/error", $exception);
                }
            }
        }

        // boxes
        foreach ($boxes as $boxIndex => $box) {
            $boxName = Sluggify::slug($box['name']);

            if (isset($box['id'])) {
                $boxId = $box['id'];
            } elseif ($savedBox = MetaRepository::getMetaBoxByName($boxName, $groupId)) {
                $boxId = $savedBox->getId();
            } else {
                $boxId = Uuid::v4();
            }

            // A box with an id is an existing box being updated, regardless of
            // whether that id came from the caller directly or (as with
            // save_acpt_meta_box()'s merge-with-existing fix) from a lookup by
            // name performed before this command ever ran — either way, a
            // `new_name` here means "rename it", not just "this happens to also
            // be a fresh box that shares the current name".
            if ((isset($savedBox) || isset($box['id'])) && isset($box['new_name'])) {
                $boxName = Sluggify::slug($box['new_name']);
            }

            if ((isset($savedBox) || isset($box['id'])) && isset($box['newName'])) {
                $boxName = Sluggify::slug($box['newName']);
            }

            $boxModel = MetaBoxModel::hydrateFromArray([
                'id' => $boxId,
                'group' => $groupModel,
                'name' => $boxName,
                'sort' => ($boxIndex+1),
                'label' => @$box['label'],
            ]);

            if (!empty($box['settings'])) {
                $settings = isset($box['settings'][0]) ? $box['settings'][0] : $box['settings'];
                $boxModel->setSettings($settings);
            }

            $ids[$groupId]['boxes'][] = $boxModel->getId();

            // fields
            $arrayOfFieldNames = $fieldNamesByBox[$boxId] ?? [];

            foreach ($box['fields'] as $fieldIndex => $field) {
                // if hasManyRelation is set and is an array, convert it to bool
                if (isset($field['hasManyRelation']) && is_array($field['hasManyRelation'])) {
                    $field['hasManyRelation'] = !empty($field['hasManyRelation']);
                }

                if (is_array($field) && $validator->validate(MetaFieldModel::validationRules(), $field)) { // discard malformed fields
                    $fieldName = Sluggify::slug($field['name']);

                    if (isset($field['id'])) {
                        $fieldId = $field['id'];
                    } elseif ($savedField = MetaRepository::getMetaFieldByName([
                            'fieldName' => $fieldName,
                            'boxName' => $boxName,
                    ])) {
                        $fieldId = $savedField->getId();
                    } else {
                        $fieldId = Uuid::v4();
                    }

                    // A field with an id is an existing field being updated,
                    // regardless of whether that id came from the caller directly
                    // or (as with save_acpt_meta_field()'s merge-with-existing fix)
                    // from a lookup by name performed before this command ever ran.
                    if ((isset($savedField) || isset($field['id'])) && isset($field['new_name'])) {
                        $fieldName = Sluggify::slug($field['new_name']);
                    }

                    if ((isset($savedField) || isset($field['id'])) && isset($field['newName'])) {
                        $fieldName = Sluggify::slug($field['newName']);
                    }

                    $field['id'] = $fieldId;
                    $field['sort'] = ($fieldIndex+1);
                    $field['name'] = $fieldName;

                    $fieldModel = MetaFieldModel::fullHydrateFromArray($boxModel, $fieldIndex, $field, $arrayOfFieldNames, $arrayOfBlockNames, $persistedFields);
                    $this->appendIdsOfFieldModel($groupId, $fieldModel, $ids);
                    $boxModel->addField($fieldModel);

                    $ids[$groupId]['fields'][] = $fieldModel->getId();
                }
            }

            // $arrayOfBoxNames was already seeded, above, with every DB box name except
            // this box's own (excluded by id, including a name-resolved id) — so no
            // further self-exclusion is needed here. (A name-based filter used to run
            // at this point, but it stripped out ANY matching name, not just this box's
            // own, silently defeating collision detection against a genuinely different
            // box/group sharing the same target name.)
            $boxModel->changeName(Strings::getTheFirstAvailableName($boxModel->getName(), $arrayOfBoxNames));
            $arrayOfBoxNames[] = $boxModel->getName();

            $groupModel->addBox($boxModel);
        }

        MetaRepository::saveMetaGroup($groupModel);

        // remove orphans
        MetaRepository::removeMetaOrphans([
            'groupId' => $groupModel->getId(),
            'ids' => $ids[$groupId]
        ]);

        do_action("acpt/meta_group/save", $this, $groupModel);

        return $groupId;
    }

    /**
     * Recursively collects the `id` of every field already present in the incoming
     * payload — top-level, repeater/flexible children, and block-nested fields — keyed
     * by id for O(1) exclusion lookups. A field with no `id` (brand-new, unsaved) is
     * simply not added, so it never excludes anything from the site-wide name seed.
     *
     * @param array<string, mixed> $field
     * @param array<string, bool>  &$ids
     */
    private function collectIncomingFieldIds(array &$field, array &$ids): void
    {
        if (isset($field['id'])) {
            $ids[(string) $field['id']] = true;
        }

        // A block/child resent without its own id (the normal shape for a partial
        // update via save_acpt_meta_field(), which round-trips a block/field
        // definition by name only) is the SAME block/child the caller already
        // knows about - resolve it by name against what's actually stored and
        // write its real id back (by reference, into the array hydration uses
        // further down) instead of letting it look brand-new. Without this, the
        // existing block/field is orphaned as an empty duplicate (a fresh id is
        // minted for the "new" one) and its name spuriously collides with the
        // not-yet-excluded existing name, forcing an unwanted _1 suffix.
        $existingBlocksByName = [];
        $existingChildrenByName = [];

        if (isset($field['id'])) {
            try {
                $existingField = MetaRepository::getMetaFieldById($field['id']);

                if ($existingField !== null) {
                    foreach ($existingField->getBlocks() as $existingBlock) {
                        $existingBlocksByName[$existingBlock->getName()] = $existingBlock;
                    }

                    foreach ($existingField->getChildren() as $existingChild) {
                        $existingChildrenByName[$existingChild->getName()] = $existingChild;
                    }
                }
            } catch (\Exception $exception) {
                do_action("acpt/error", $exception);
            }
        }

        if (!empty($field['children'])) {
            foreach ($field['children'] as &$child) {
                if (!isset($child['id']) && isset($child['name']) && isset($existingChildrenByName[$child['name']])) {
                    $child['id'] = $existingChildrenByName[$child['name']]->getId();
                }

                $this->collectIncomingFieldIds($child, $ids);
            }
            unset($child);
        }

        if (!empty($field['blocks'])) {
            foreach ($field['blocks'] as &$block) {
                if (!isset($block['id']) && isset($block['name']) && isset($existingBlocksByName[$block['name']])) {
                    $block['id'] = $existingBlocksByName[$block['name']]->getId();
                }

                $existingBlockFieldsByName = [];

                if (isset($block['name']) && isset($existingBlocksByName[$block['name']])) {
                    foreach ($existingBlocksByName[$block['name']]->getFields() as $existingBlockField) {
                        $existingBlockFieldsByName[$existingBlockField->getName()] = $existingBlockField;
                    }
                }

                if (!empty($block['fields'])) {
                    foreach ($block['fields'] as &$child) {
                        if (!isset($child['id']) && isset($child['name']) && isset($existingBlockFieldsByName[$child['name']])) {
                            $child['id'] = $existingBlockFieldsByName[$child['name']]->getId();
                        }

                        $this->collectIncomingFieldIds($child, $ids);
                    }
                    unset($child);
                }
            }
            unset($block);
        }
    }

    /**
     * @param mixed $fields
     * @param mixed $allNames
     * @param mixed $arrayOfBlockNames
     */
    private function recursiveSetArrayOfBlockNames($fields, $allNames, &$arrayOfBlockNames): void
    {
        if (is_array($fields) && !empty($fields)) {
            foreach ($fields as $field) {
                $fieldNamesCopy = [];
                $this->getAllFieldNames($field, $fieldNamesCopy);

                $blockNamesCopy = [];
                $this->getAllBlockNames($field, $blockNamesCopy);

                if (isset($allNames['blocks']) && !empty($allNames['blocks']) && !empty($fieldNamesCopy)) {
                    $diff = [];
                    foreach ($allNames['blocks'] as $index => $allNamesField) {
                        if (isset($fieldNamesCopy[$index])) {
                            $diff[] = array_diff($allNames['blocks'][$index], $fieldNamesCopy[$index]);
                        }
                    }

                    $diff = Arrays::reindex($diff);
                    $arrayOfBlockNames = array_merge($arrayOfBlockNames, $diff);
                }
            }
        }
    }

    /**
     * @param array<string, mixed> $field
     * @param array<int, mixed>   &$fieldNames
     */
    private function getAllFieldNames(array $field, array &$fieldNames): void
    {
        if (isset($field['id'])) {
            $fieldNames[] = [
                'id' => $field['id'],
                'name' => $field['name'],
            ];
        }

        if (!empty($field['children'])) {
            foreach ($field['children'] as $child) {
                $this->getAllFieldNames($child, $fieldNames);
            }
        }

        if (!empty($field['blocks'])) {
            foreach ($field['blocks'] as $block) {
                if (!empty($block['fields'])) {
                    foreach ($block['fields'] as $child) {
                        $this->getAllFieldNames($child, $fieldNames);
                    }
                }
            }
        }
    }

    /**
     * @param array<string, mixed> $field
     * @param array<int, mixed>   &$blockNames
     */
    private function getAllBlockNames(array $field, array &$blockNames): void
    {
        if (!empty($field['blocks'])) {
            foreach ($field['blocks'] as $block) {
                if (isset($block['id'])) {
                    $blockNames[] = [
                        'id' => $block['id'],
                        'name' => $block['name'],
                    ];
                }

                if (!empty($block['fields'])) {
                    foreach ($block['fields'] as $child) {
                        $this->getAllBlockNames($child, $blockNames);
                    }
                }
            }
        }
    }

    /**
     * @param string         $groupId
     * @param MetaFieldModel $fieldModel
     * @param array<string, mixed> &$ids
     *
     * @throws \Exception
     */
    private function appendIdsOfFieldModel(string $groupId, MetaFieldModel $fieldModel, array &$ids): void
    {
        foreach ($fieldModel->getOptions() as $option) {
            $ids[$groupId]['options'][] = $option->getId();
        }

        foreach ($fieldModel->getVisibilityConditions() as $condition) {
            $ids[$groupId]['visibilityConditions'][] = $condition->getId();
        }

        foreach ($fieldModel->getValidationRules() as $rule) {
            $ids[$groupId]['validationRules'][] = $rule->getId();
        }

        foreach ($fieldModel->getChildren() as $child) {
            $ids[$groupId]['fields'][] = $child->getId();
            $this->appendIdsOfFieldModel($groupId, $child, $ids);
        }

    }

    /**
     * @inheritDoc
     */
    public function logFormat(): array
    {
        return [
            "class"  => SaveMetaGroupCommand::class,
            'data' => $this->data
        ];
    }
}
