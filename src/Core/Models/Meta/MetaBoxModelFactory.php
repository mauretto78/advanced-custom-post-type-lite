<?php

namespace ACPT_Lite\Core\Models\Meta;

use ACPT_Lite\Core\Repository\MetaRepository;

class MetaBoxModelFactory
{
    /**
     * @param string $id
     * @return MetaBoxModel|null
     */
    public static function resolveFromId(string $id): ?MetaBoxModel
    {
        $metaBox = MetaRepository::getMetaBoxById($id);

        return $metaBox;
    }

    /**
     * @param string $boxName
     * @return MetaBoxModel|null
     */
    public static function fromName(string $boxName): ?MetaBoxModel
    {
        $metaBoxModel = MetaRepository::getMetaBoxByName($boxName);

        return $metaBoxModel;
    }

}
