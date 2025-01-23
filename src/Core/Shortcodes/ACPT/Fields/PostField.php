<?php

namespace ACPT_Lite\Core\Shortcodes\ACPT\Fields;

use ACPT_Lite\Constants\MetaTypes;

class PostField extends AbstractField
{
    public function render()
    {
		if($this->payload->preview){

			if(empty($this->metaBoxFieldModel->getRelations())){
				return null;
			}

			$relation = $this->metaBoxFieldModel->getRelations()[0];

			$rawData = $this->fetchRawData();

			if(!isset($rawData['value'])){
				return null;
			}

			if(empty($rawData['value'])){
				return null;
			}

			return $this->renderElements($relation->to()->getType(), $rawData['value']);

		}

		return null;
    }

	/**
	 * @param $objectType
	 * @param $data
	 *
	 * @return string|null
	 */
    private function renderElements($objectType, $data)
    {
	    if(empty($data)){
		    return null;
	    }

    	if(is_string($data)){
		    $data = [$data];
	    }

    	$objectsArray = [];

    	foreach ($data as $item){
    		switch ($objectType){
			    case MetaTypes::CUSTOM_POST_TYPE:
				    $objectsArray[] = $this->renderPost($item);
				    break;

			    case MetaTypes::TAXONOMY:
				    $objectsArray[] = $this->renderTerm($item);
				    break;

			    case MetaTypes::OPTION_PAGE:
				    $objectsArray[] = $this->renderOptionPage($item);
			    	break;

			    case MetaTypes::USER:
				    $objectsArray[] = $this->renderUser($item);
				    break;
		    }
	    }

		return implode(", ", $objectsArray);
    }
}