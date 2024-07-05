<?php

namespace ACPT_Lite\Core\Models\Query;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Repository\MetaRepository;
use ACPT_Lite\Core\Repository\WooCommerceProductDataRepository;
use ACPT_Lite\Utils\Data\Meta;
use ACPT_Lite\Utils\Data\Normalizer;

class QueryResultModel implements \JsonSerializable
{
    /**
     * @var array
     */
    private $post;

    /**
     * @var array
     */
    private $meta;

    /**
     * QueryResultModel constructor.
     *
     * @param \WP_Post $post
     *
     * @throws \Exception
     */
    public function __construct(\WP_Post $post)
    {
        $this->post = Normalizer::objectToArray($post);
        $this->setMeta();
    }

    /**
     * @return array
     */
    public function getPost()
    {
        return $this->post;
    }

    /**
     * @throws \Exception
     */
    private function setMeta()
    {
        $pid = $this->post['ID'];
	    $pid = (int)$pid;
        $postType = $this->post['post_type'];

        $meta = [
            'meta' => [],
        ];

        $metaGroups = MetaRepository::get([
            'belongsTo' => MetaTypes::CUSTOM_POST_TYPE,
            'find' => $postType,
        ]);

        foreach ($metaGroups as $groupModel){
	        foreach ($groupModel->getBoxes() as $metaBox){

		        $metaFields = [];

		        foreach ($metaBox->getFields() as $field){

			        $options = [];

			        foreach ($field->getOptions() as $option){
				        $options[] = [
					        'label' => $option->getLabel(),
					        'value' => $option->getValue(),
				        ];
			        }

			        $metaFields[] = [
				        "name" => $field->getName(),
				        "type" => $field->getType(),
				        "options" => $options,
				        "value" => Meta::fetch($pid, MetaTypes::CUSTOM_POST_TYPE, $field->getDbName(), true),
				        "default" => $field->getDefaultValue(),
				        "required" => $field->isRequired() === '1',
				        "showInAdmin" => $field->isShowInArchive() === '1',
			        ];
		        }

		        $meta['meta'][] = [
			        "meta_box" => $metaBox->getName(),
			        "meta_fields" => $metaFields,
		        ];
	        }
        }

        if( $postType === 'product' and class_exists( 'woocommerce' )  ){
            $meta['wc_product_data'] = [];
            $productData = WooCommerceProductDataRepository::get();

            foreach ($productData as $productDatum) {

                $productDataFields = [];

                foreach ($productDatum->getFields() as $field){

                    $options = [];

                    foreach ($field->getOptions() as $option){
                        $options[] = [
                                'label' => $option->getLabel(),
                                'value' => $option->getValue(),
                        ];
                    }

                    $productDataFields[] = [
                            'name' => $field->getName(),
                            'type' => $field->getType(),
                            "options" => $options,
                            'value' => Meta::fetch($pid, MetaTypes::CUSTOM_POST_TYPE, $field->getDbName(), true),
                            'default' => $field->getDefaultValue(),
                            'required' => $field->isRequired() === '1',
                    ];
                }

                $meta['wc_product_data'][] = [
                        'name' => $productDatum->getName(),
                        'icon' => $productDatum->getIcon(),
                        'visibility' => $productDatum->getVisibility(),
                        'fields' => $productDataFields,
                ];
            }
        }

        $this->meta = $meta;
    }

    /**
     * @return array
     */
    public function getMeta()
    {
        return $this->meta;
    }

	#[\ReturnTypeWillChange]
    public function jsonSerialize()
    {
        return array_merge($this->getPost(), $this->getMeta());
    }
}