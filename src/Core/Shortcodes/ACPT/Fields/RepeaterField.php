<?php

namespace ACPT_Lite\Core\Shortcodes\ACPT\Fields;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Utils\Wordpress\WPUtils;

class RepeaterField extends AbstractField
{
    public function render()
    {
	    if($this->payload->preview){

	    	$isAdminView = $this->payload->adminView;

		    $rawData = $this->fetchMeta($this->getKey());

		    if(empty($rawData)){
		    	return null;
		    }

		    if($this->metaBoxFieldModel === null){
			    return null;
		    }

		    if(!$this->metaBoxFieldModel->hasChildren()){
		    	return null;
		    }

		    $children = [];

			foreach ($this->metaBoxFieldModel->getChildren() as $childFieldModel){
				if($isAdminView and $childFieldModel->isShowInArchive()){
					$children[] = [
						'name' => $childFieldModel->getName(),
						'parent' => $this->metaBoxFieldModel->getName(),
						'nestedParent' => $this->metaBoxFieldModel->hasParent(),
						'length' => $this->childrenLength($rawData, $this->metaBoxFieldModel, $childFieldModel),
					];
				} else {
					$children[] = [
						'name' => $childFieldModel->getName(),
						'parent' => $this->metaBoxFieldModel->getName(),
						'nestedParent' => $this->metaBoxFieldModel->hasParent(),
						'length' => $this->childrenLength($rawData, $this->metaBoxFieldModel, $childFieldModel),
					];
				}
			}

		    if(empty($children)){
			    return null;
		    }

		    $return = '<ul>';

		    for($i = 0; $i < $children[0]['length']; $i++){
			    foreach ($children as $child){

			    	$shortCode = $this->childShortCode($child['name'], $child['parent'], $i, $child['nestedParent']);

				    $return .= '<li>';
				    $return .= '<strong>'.$child['name'].'</strong>: '.WPUtils::renderShortCode($shortCode);
				    $return .= '</li>';
			    }
		    }

		    $return .= '</ul>';

		    return $return;
	    }

	    return null;
	}

	/**
	 * @param $rawData
	 * @param MetaFieldModel $parentFieldModel
	 * @param MetaFieldModel $childFieldModel
	 *
	 * @return int
	 */
	private function childrenLength($rawData, MetaFieldModel $parentFieldModel, MetaFieldModel $childFieldModel)
	{
		if(isset($rawData[$childFieldModel->getName()])){
			return count($rawData[$childFieldModel->getName()]);
		}

		// nested repeaters
		$parentFieldName = $parentFieldModel->getName();

		if(
			isset($rawData[$parentFieldName]) and
			isset($rawData[$parentFieldName][$this->payload->index]) and
			isset($rawData[$parentFieldName][$this->payload->index][$childFieldModel->getName()])
		)
		{
			return count($rawData[$parentFieldModel->getName()][$this->payload->index][$childFieldModel->getName()]);
		}

		return 0;
	}

	/**
	 * @param $childName
	 * @param $parentName
	 * @param $index
	 * @param $nestedParent
	 *
	 * @return string
	 */
	private function childShortCode($childName, $parentName, $index, $nestedParent = false)
	{
		$shortCode = '[';

		switch ($this->payload->belongsTo){
			case MetaTypes::CUSTOM_POST_TYPE:
				$shortCode.= 'acpt pid="'.$this->payload->id.'"';
				break;

			case MetaTypes::MEDIA:
				$shortCode.= 'acpt_media pid="'.$this->payload->id.'"';
				break;

			case MetaTypes::TAXONOMY:
				$shortCode.= 'acpt_tax tid="'.$this->payload->id.'"';
				break;

			case MetaTypes::COMMENT:
				$shortCode.= 'acpt_comm cid="'.$this->payload->id.'"';
				break;

			case MetaTypes::USER:
				$shortCode.= 'acpt_user uid="'.$this->payload->id.'"';
				break;

			case MetaTypes::OPTION_PAGE:
				$shortCode.= 'acpt_option page="'.$this->payload->id.'"';
				break;
		}

		// support double index syntax, example:
		// 0.0
		// 1.2
		//
		if($nestedParent){
			$index = $this->payload->index.".".$index;
		}

		$shortCode .= ' box="'.$this->payload->box.'" parent="'.$parentName.'" field="'.$childName.'" index="'.$index.'" preview="true" ]';

		return $shortCode;
	}
}