<?php

namespace ACPT_Lite\Core\CQRS\Query;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Core\Repository\CustomPostTypeRepository;
use ACPT_Lite\Core\Repository\MetaRepository;
use ACPT_Lite\Core\Repository\TaxonomyRepository;

class FetchFindFromBelongsToQuery implements QueryInterface
{
    /**
     * @var string
     */
    private string $belongsTo;

    /**
     * @var string
     */
    private string $format;

    /**
     * @param string      $belongsTo
     * @param string|null $format
     */
    public function __construct(string $belongsTo, ?string $format = null)
    {
        $this->belongsTo = $belongsTo;
        $this->format = $format ?? 'default';
    }

    /**
     * @return array<int, mixed>
     * @throws \Exception
     */
    public function execute(): array
    {
        $id = 'id';
        $name = 'name';
        $data = [];

        if ($this->format === 'react-select') {
            $id = 'value';
            $name = 'label';
        }

        switch ($this->belongsTo) {

            // return all cpts
            case MetaTypes::CUSTOM_POST_TYPE:
                $customPostTypes = CustomPostTypeRepository::get([]);
                foreach ($customPostTypes as $customPostType) {
                    $data[]  = [
                        $id => $customPostType->getName(),
                        $name => $customPostType->getName(),
                    ];
                }

                break;

                // return all taxonomies
            case MetaTypes::TAXONOMY:
                $taxonomies = TaxonomyRepository::get([]);
                foreach ($taxonomies as $taxonomy) {
                    $data[]  = [
                        $id => $taxonomy->getSlug(),
                        $name => $taxonomy->getSlug(),
                    ];
                }
                break;

                // return all blocks here
            case 'flex_block':
                $meta = MetaRepository::getMetaFields([
                    'types' => [],
                    'lazy' => false,
                ]);

                foreach ($meta as $field) {
                    if (!empty($field->getBlocks())) {
                        foreach ($field->getBlocks() as $block) {
                            $data[]  = [
                                $id => $block->getId(),
                                $name => '['.$field->getBox()->getGroup()->getUIName().']' . $block->getUiName(),
                            ];
                        }
                    }
                }

                $meta = MetaRepository::getMetaFields([
                    'types' => [],
                    'lazy' => false,
                ]);

                foreach ($meta as $field) {
                    if (!empty($field->getBlocks())) {
                        foreach ($field->getBlocks() as $block) {
                            $data[]  = [
                                $id => $block->getId(),
                                $name => '['.$field->getBox()->getGroup()->getUIName().']' . $block->getUiName(),
                            ];
                        }
                    }
                }

                break;

                // return meta field
            case 'meta_field':
                $meta = MetaRepository::getMetaFields([
                    'types' => [],
                    'lazy' => true,
                ]);

                foreach ($meta as $field) {
                    $data[]  = [
                        $id => $field->getId(),
                        $name => '['.$field->getBox()->getGroup()->getUIName().']' . $field->getUiName(),
                    ];
                }

                // @TODO is possible this?
                //			    $meta = MetaRepository::getMetaFields([
                //				    'belongsTo' => MetaTypes::OPTION_PAGE,
                //				    'types' => [
                //					    MetaFieldModel::REPEATER_TYPE,
                //				    ],
                //				    'lazy' => false,
                //			    ]);
//
                //			    foreach ($meta as $field){
                //				    $data[]  = [
                //					    'id' => $field->getId(),
                //					    'name' => '['.$field->getMetaBox()->getOptionPage().']' . $field->getUiName(),
                //				    ];
                //			    }

                break;
        }

        return $data;
    }
}
