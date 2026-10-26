<?php

namespace ACPT_Lite\Core\Generators\Taxonomy;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Generators\Meta\Fields\AbstractField;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Utils\Data\Meta;

/**
 * *************************************************
 * TaxonomyMetaBoxFieldGenerator class
 * *************************************************
 *
 * @author Mauro Cassani
 * @link https://github.com/mauretto78/
 */
class TaxonomyMetaBoxFieldGenerator
{
    /**
     * @var MetaFieldModel
     */
    private MetaFieldModel $metaFieldModel;

    /**
     * @var mixed
     */
    private $termId;

    /**
     * TaxonomyMetaBoxFieldGenerator constructor.
     * @param MetaFieldModel $metaFieldModel
     * @param int|string|null $termId null on the "Add term" screen
     */
    public function __construct(MetaFieldModel $metaFieldModel, $termId)
    {
        $this->metaFieldModel = $metaFieldModel;
        $this->termId = $termId;
    }

    /**
     * @return AbstractField|null
     */
    public function generate(): ?AbstractField
    {
        return self::getTaxonomyField();
    }

    /**
     * @return AbstractField|null
     */
    private function getTaxonomyField(): ?AbstractField
    {
        $className = 'ACPT_Lite\\Core\\Generators\\Meta\\Fields\\'.$this->metaFieldModel->getType().'Field';
        $value = null;

        if (class_exists($className)) {
            $belongs = MetaTypes::TAXONOMY;
            // The term id, as the post generator passes the post id: the field reads its
            // saved sub-values (e.g. a phone's country) and runs its visibility check by it (#1426)
            $termId = !empty($this->termId) ? (string)$this->termId : null;
            $find = $termId;

            if (!empty($this->termId)) {
                $value = Meta::fetch($this->termId, $belongs, $this->metaFieldModel->getDbName());
            }

            /** @var AbstractField $instance */
            $instance = new $className($this->metaFieldModel, $belongs, $find);

            if ($value !== '' && $value !== null) {
                $instance->setValue($value);
            }

            return $instance;
        }

        return null;
    }
}
