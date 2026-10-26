<?php

namespace ACPT_Lite\Core\CQRS\Command;

use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Utils\Data\Sanitizer;

class SaveMetaFieldValueCommand extends AbstractMetaFieldValueCommand implements CommandInterface
{
    /**
     * Relational values come back from get_acpt_field() as WP_Post / WP_User /
     * WP_Term objects, but are stored as IDs: turn the objects into their IDs so
     * a value that was read can be saved back (#1371). Re-indexes lists, so a
     * value with a gap left by unset() is saved as a plain list.
     *
     * @param mixed $value
     *
     * @return mixed
     */
    public static function objectsToIds($value)
    {
        if ($value instanceof \WP_Post || $value instanceof \WP_User) {
            return $value->ID;
        }

        if ($value instanceof \WP_Term) {
            return $value->term_id;
        }

        if (!is_array($value)) {
            return $value;
        }

        $isList = array_keys($value) === array_filter(array_keys($value), 'is_int');
        $hasObjects = false;

        foreach ($value as $item) {
            if ($item instanceof \WP_Post || $item instanceof \WP_User || $item instanceof \WP_Term) {
                $hasObjects = true;
                break;
            }
        }

        if (!$hasObjects) {
            return $value;
        }

        $ids = array_map([self::class, 'objectsToIds'], $value);

        return $isList ? array_values($ids) : $ids;
    }

    /**
     * @throws \Exception
     *
     * @return bool
     */
    public function execute(): bool
    {
        $metaFieldModelType = $this->fieldModel->getType();
        $savedFieldValue = $this->get($this->fieldModel->getDbName());
        $savedFieldType = $this->get($this->fieldModel->getDbName().'_type');
        $savedFieldId = $this->get($this->fieldModel->getDbName().'_id');
        $value = self::objectsToIds($this->args['value'] ?? null);

        // check is value is changed, if not, do nothing and return true
        if ($savedFieldValue == $value) {
            return true;
        }

        // save _type
        if ($metaFieldModelType != $savedFieldType) {
            if (!$this->set($this->fieldModel->getDbName().'_type', $metaFieldModelType)) {
                return false;
            }
        }

        // save _id
        if ($savedFieldId != $this->fieldModel->getId()) {
            if (!$this->set($this->fieldModel->getDbName().'_id', $this->fieldModel->getId())) {
                return false;
            }
        }

        switch ($metaFieldModelType) {

            case MetaFieldModel::SELECT_TYPE:

                if (in_array($value, $this->fieldModel->getOptionValues())) {
                    $savedFieldValue = $this->get($this->fieldModel->getDbName());
                    if ($savedFieldValue != $value) {
                        if (!$this->set($this->fieldModel->getDbName(), Sanitizer::sanitizeRawData($metaFieldModelType, $value))) {
                            return false;
                        }
                    }

                    return true;
                }

                return false;

                // Default behaviour
            default:
                $savedFieldValue = $this->get($this->fieldModel->getDbName());
                if ($savedFieldValue != $value) {
                    if (!$this->set($this->fieldModel->getDbName(), Sanitizer::sanitizeRawData($metaFieldModelType, $value))) {
                        return false;
                    }
                }
        }

        return true;
    }
}
