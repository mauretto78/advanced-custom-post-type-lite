<?php

namespace ACPT_Lite\Utils\PHP;

use ACPT_Lite\Constants\Visibility;
use ACPT_Lite\Core\Models\Belong\BelongModel;
use ACPT_Lite\Core\Models\Meta\MetaFieldVisibilityModel;

class Logics
{
	/**
	 * @param $elements
	 * @param null $visibility
	 *
	 * @return array
	 */
	public static function extractLogicBlocks($elements, $visibility = null)
	{
		if(empty($elements)){
			return [];
		}

		if(!is_array($elements)){
			return [];
		}

		$logicBlocks = [];
		$storedLogicBlocks = [];

		foreach ($elements as $index => $element){

			if(
				($element instanceof MetaFieldVisibilityModel and self::hasConditionToBeConsidered($visibility, $element)) or
				$element instanceof BelongModel
			){
				$isLast = $index === (count($elements)-1);
				$logic = $element->getLogic();

				// AND
				if($logic === 'AND' and !$isLast){
					if(!empty($storedLogicBlocks)){
						$storedLogicBlocks[] = $element;
						$logicBlocks[] = $storedLogicBlocks;
						$storedLogicBlocks = [];
					} else {
						$logicBlocks[] = [$element];
					}
				}

				// OR
				if($logic === 'OR' and !$isLast){
					$storedLogicBlocks[] = $element;
				}

				// Last element
				if($isLast){
					if(!empty($storedLogicBlocks)){
						$storedLogicBlocks[] = $element;
						$logicBlocks[] = $storedLogicBlocks;
						$storedLogicBlocks = [];
					} else {
						$logicBlocks[] = [$element];
					}
				}
			}
		}

		return $logicBlocks;
	}

	/**
	 * @param $visibility
	 * @param MetaFieldVisibilityModel $visibilityCondition
	 *
	 * @return bool
	 */
	private static function hasConditionToBeConsidered($visibility, MetaFieldVisibilityModel $visibilityCondition): bool
	{
		if($visibility === Visibility::IS_BACKEND and $visibilityCondition->isBackEnd()){
			return true;
		}

		if($visibility === Visibility::IS_FRONTEND and $visibilityCondition->isFrontEnd()){
			return true;
		}

		return false;
	}
}