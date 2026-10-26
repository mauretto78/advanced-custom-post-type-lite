<?php

namespace ACPT_Lite\Core\Models\Meta;

use ACPT_Lite\Core\Repository\MetaRepository;

/**
 * Factory that creates a synthetic MetaFieldModel from a TableColumnModel
 * so that existing Meta/Fields/*Field rendering classes can be reused
 * without modification for custom table record pages.
 *
 * The produced MetaFieldModel is transient — it is never persisted.
 */
class MetaFieldModelFactory
{
    /**
     * Resolve a MetaFieldModel by ID, with a CCT column fallback.
     * Tries MetaRepository first; if not found and CCT is enabled, tries TableRepository
     * and converts the column to a synthetic MetaFieldModel via fromMetaBoxModel().
     *
     * @param string $id
     * @return MetaFieldModel|null
     * @throws \Exception
     */
    public static function resolveFromId(string $id): ?MetaFieldModel
    {
        $metaField = MetaRepository::getMetaFieldById($id);

        return $metaField;
    }

    /**
     * Resolves and retrieves a MetaFieldModel object using the provided box name and field name.
     *
     * @param string $boxName The name of the box to search within.
     * @param string $fieldName The name of the specific field to resolve.
     *
     * @return MetaFieldModel|null Returns the resolved MetaFieldModel object if found, or null if not found.
     */
    public static function resolveFromBoxAndName(string $boxName, string $fieldName): ?MetaFieldModel
    {
        $metaField = MetaRepository::getMetaFieldByName([
            'boxName' => $boxName,
            'fieldName' => $fieldName,
        ]);

        return $metaField;
    }
}
