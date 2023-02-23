<?php

namespace ACPT_Lite\Core\Models\Abstracts;

/**
 * AbstractModel
 *
 * @since      1.0.14
 * @package    advanced-custom-post-type
 * @subpackage advanced-custom-post-type/core
 * @author     Mauro Cassani <maurocassani1978@gmail.com>
 */
abstract class AbstractMetaWrapperModel extends AbstractModel
{
    /**
     * @var AbstractMetaBoxModel[]
     */
    protected $metaBoxes = [];

    /**
     * @return AbstractMetaBoxModel[]
     */
    public function getMetaBoxes()
    {
        return $this->metaBoxes;
    }

    /**
     * @param AbstractMetaBoxModel $metaBox
     */
    public function addMetaBox(AbstractMetaBoxModel $metaBox)
    {
        if(!$this->existsInCollection($metaBox->getId(), $this->metaBoxes)){
            $this->metaBoxes[] = $metaBox;
        }
    }

    /**
     * @param AbstractMetaBoxModel $metaBox
     */
    public function removeMetaBox(AbstractMetaBoxModel $metaBox)
    {
        $this->removeFromCollection($metaBox->getId(), $this->metaBoxes);
    }

	/**
	 * Used by export function
	 *
	 * @return array
	 */
    public abstract function arrayRepresentation();

    /**
     * @param string $format
     * @return array
     */
    protected function metaArrayRepresentation($format = 'full')
    {
        $metaArray = [];
        foreach ($this->getMetaBoxes() as $metaBoxModel){

            if($format === 'mini'){
                $metaArray[] = [
                    "name" => $metaBoxModel->getName(),
                    "count" => count($metaBoxModel->getFields()),
                ];
            }

            if($format === 'full'){
                $fieldsArray = [];

                foreach ($metaBoxModel->getFields() as $fieldModel){

                    $optionsArray = [];

                    foreach ($fieldModel->getOptions() as $optionModel){
                        $optionsArray[] = [
                            'id' => $optionModel->getId(),
                            'label' => $optionModel->getLabel(),
                            'value' => $optionModel->getValue(),
                            'sort' => (int)$optionModel->getSort(),
                        ];
                    }

                    $fieldsArray[] = [
                        'id' => $fieldModel->getId(),
                        'name' => $fieldModel->getName(),
                        'type' => $fieldModel->getType(),
                        'defaultValue' => $fieldModel->getDefaultValue(),
                        'description' => $fieldModel->getDescription(),
                        'showInArchive' => (bool)$fieldModel->isShowInArchive(),
                        'required' => (bool)$fieldModel->isRequired(),
                        'sort' => (int)$fieldModel->getSort(),
                        'options' => $optionsArray,
                    ];
                }

                if($metaBoxModel->belongsToTaxonomy()){
	                $metaArray[] = [
		                "id" => $metaBoxModel->getId(),
		                "taxonomy" => $metaBoxModel->getTaxonomy(),
		                "name" => $metaBoxModel->getName(),
		                "sort" => (int)$metaBoxModel->getSort(),
		                "fields" => $fieldsArray
	                ];
                }

	            if($metaBoxModel->belongsToCustomPostType()){
		            $metaArray[] = [
			            "id" => $metaBoxModel->getId(),
			            "postType" => $metaBoxModel->getPostType(),
			            "name" => $metaBoxModel->getName(),
			            "sort" => (int)$metaBoxModel->getSort(),
			            "fields" => $fieldsArray
		            ];
	            }

	            if($metaBoxModel->belongsToUser()){
		            $metaArray[] = [
			            "id" => $metaBoxModel->getId(),
			            "name" => $metaBoxModel->getName(),
			            "sort" => (int)$metaBoxModel->getSort(),
			            "fields" => $fieldsArray
		            ];
	            }
            }
        }

        return $metaArray;
    }
}