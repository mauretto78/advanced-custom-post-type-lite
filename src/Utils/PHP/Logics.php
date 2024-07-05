<?php

namespace ACPT_Lite\Utils\PHP;

use ACPT_Lite\Constants\Visibility;
use ACPT_Lite\Core\Models\Belong\BelongModel;

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
}