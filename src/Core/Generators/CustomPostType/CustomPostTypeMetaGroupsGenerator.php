<?php

namespace ACPT_Lite\Core\Generators\CustomPostType;

use ACPT_Lite\Constants\BelongsTo;
use ACPT_Lite\Constants\Logic;
use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Constants\Operator;
use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Belong\BelongModel;
use ACPT_Lite\Core\Models\Meta\MetaGroupModel;
use ACPT_Lite\Includes\ACPT_Lite_DB;

class CustomPostTypeMetaGroupsGenerator
{
	/**
	 * @var MetaGroupModel[]
	 */
	private $metaGroupModels;

    /**
     * @var string
     */
    private $postType;

    /**
     * CustomPostTypeMetaGroupsGenerator constructor.
     *
     * @param $postType
     * @param $metaGroupModels
     */
	public function __construct($postType, $metaGroupModels)
	{
		$this->metaGroupModels = $metaGroupModels;
        $this->postType = $postType;
    }

	/**
	 * Generate meta boxes related to post types
	 *
	 * @return array
	 */
	public function generate()
	{
		$groups = [];

		foreach ($this->metaGroupModels as $metaGroupModel){

			$cptBelongs = [];
			$otherAndConditions = false;
			$allowedConditions = [
				MetaTypes::CUSTOM_POST_TYPE,
				BelongsTo::PARENT_POST_ID,
				BelongsTo::POST_ID,
				BelongsTo::POST_TEMPLATE,
				BelongsTo::POST_TAX,
				BelongsTo::POST_CAT,
			];

			foreach ($metaGroupModel->getBelongs() as $index => $belong){

				// allow only cpt belongs
				if(in_array($belong->getBelongsTo(), $allowedConditions)){
					$cptBelongs[] = $belong;
				} else {

					if($belong->getLogic() === Logic::AND){
						$otherAndConditions = true;
					}

					if(isset($metaGroupModel->getBelongs()[$index-1]) and $metaGroupModel->getBelongs()[$index-1]->getLogic() === Logic::AND ){
						$otherAndConditions = true;
					}
				}
			}

			if($otherAndConditions === false){
                $groups[] = $metaGroupModel;
                $generator = new CustomPostTypeMetaGroupGenerator($metaGroupModel, $this->postType);
                $generator->render();
			}
		}

		return $groups;
	}

	/**
	 * @param $postType
	 * @param array $logicBlocks
	 *
	 * @return bool
	 */
	private function showBoxesOnCurrentPostType($postType, $logicBlocks = [])
	{
		$logics = [];

		foreach ($logicBlocks as $logicBlocksConditions){
			$logics[] = $this->returnTrueOrFalseForALogicBlock($postType, $logicBlocksConditions);
		}

		return !in_array(false, $logics );
	}

	/**
	 * @param $postType
	 * @param BelongModel[] $logicBlocksConditions
	 *
	 * @return bool
	 */
	private function returnTrueOrFalseForALogicBlock($postType, $logicBlocksConditions)
	{
		$matches = 0;

		foreach ($logicBlocksConditions as $logicBlocksCondition){

			$value = $logicBlocksCondition->getFind();

			switch ($logicBlocksCondition->getOperator()){
				case Operator::EQUALS:
					if($postType === $value ){
						$matches++;
					}
					break;

				case Operator::NOT_EQUALS:
					if($postType !== $value ){
						$matches++;
					}
					break;

				case Operator::IN:
					$value = trim($value);
					$value = explode(',', $value);

					if(!is_array($postType)){
						$postType = [$postType];
					}

					$check = array_intersect($postType, $value);

					if(count($check) > 0){
						$matches++;
					}
					break;

				case Operator::NOT_IN:
					$value = trim($value);
					$value = explode(',', $value);

					if(!is_array($postType)){
						$postType = [$postType];
					}

					$check = array_intersect($postType, $value);

					if(empty($check)){
						$matches++;
					}
					break;
			}
		}

		return $matches > 0;;
	}

	/**
	 * @param array $logicBlocks
	 *
	 * @return array
	 */
	private function getPostsIdsFromBelongs($logicBlocks = [])
	{
		if(empty($logicBlocks)){
			return [];
		}

		global $wpdb;
		$query = "
            SELECT p.ID FROM $wpdb->posts p 
                LEFT JOIN `{$wpdb->prefix}term_relationships` b  ON (p.ID = b.object_id) 
                LEFT JOIN `{$wpdb->prefix}postmeta` c ON (p.ID = c.post_id) 
                WHERE 1=1 ";
		$args = [];

		foreach ($logicBlocks as $index => $logicBlock){

			$isLast = $index === (count($logicBlock)-1);
			$query .= ' AND ( ';

			/** @var BelongModel[] $logicBlock */
			foreach ($logicBlock as $logicBlockElement){

				switch ($logicBlockElement->getBelongsTo()){

					// 1. POST_TYPE
					case MetaTypes::CUSTOM_POST_TYPE:
						switch ($logicBlockElement->getOperator()){
							case Operator::EQUALS:
								$query .= ' p.post_type = %s ';
								$args[] = $logicBlockElement->getFind();
								break;

							case Operator::NOT_EQUALS:
								$query .= ' p.post_type != %s ';
								$args[] = $logicBlockElement->getFind();
								break;

							case Operator::IN:
								$query .= ' p.post_type IN ('.Strings::formatForInStatement($logicBlockElement->getFind()).') ';
								break;

							case Operator::NOT_IN:
								$query .= ' p.post_type NOT IN ('.Strings::formatForInStatement($logicBlockElement->getFind()).') ';
								break;
						}

						break;

                    // 2. PARENT_POST_ID
                    case BelongsTo::PARENT_POST_ID:
                        switch ($logicBlockElement->getOperator()){
                            case Operator::EQUALS:
                                $query .= ' (p.ID = %s or p.post_parent = %s) ';
                                $args[] = $logicBlockElement->getFind();
                                $args[] = $logicBlockElement->getFind();
                                break;

                            case Operator::NOT_EQUALS:
                                $query .= ' (p.ID != %s or p.post_parent != %s) ';
                                $args[] = $logicBlockElement->getFind();
                                $args[] = $logicBlockElement->getFind();
                                break;

                            case Operator::IN:
                                $query .= ' (p.ID IN ('.Strings::formatForInStatement($logicBlockElement->getFind()).') or p.post_parent IN ('.Strings::formatForInStatement($logicBlockElement->getFind()).')) ';
                                break;

                            case Operator::NOT_IN:
                                $query .= ' (p.ID NOT IN ('.Strings::formatForInStatement($logicBlockElement->getFind()).') or p.post_parent NOT IN ('.Strings::formatForInStatement($logicBlockElement->getFind()).')) ';
                                break;
                        }
                        break;

					// 3. POST_ID
					case BelongsTo::POST_ID:
						switch ($logicBlockElement->getOperator()){
							case Operator::EQUALS:
								$query .= ' p.ID = %s ';
								$args[] = $logicBlockElement->getFind();
								break;

							case Operator::NOT_EQUALS:
								$query .= ' p.ID != %s ';
								$args[] = $logicBlockElement->getFind();
								break;

							case Operator::IN:
								$query .= ' p.ID IN ('.Strings::formatForInStatement($logicBlockElement->getFind()).') ';
								break;

							case Operator::NOT_IN:
								$query .= ' p.ID NOT IN ('.Strings::formatForInStatement($logicBlockElement->getFind()).') ';
								break;
						}

						break;

					// 4. POST_TEMPLATE
					case BelongsTo::POST_TEMPLATE:
						switch ($logicBlockElement->getOperator()){
							case Operator::EQUALS:
								$query .= " c.meta_key LIKE '_wp_page_template' AND meta_value = %s ";
								$args[] = $logicBlockElement->getFind();
								break;

							case Operator::NOT_EQUALS:
								$query .= " c.meta_key LIKE '_wp_page_template' AND meta_value != %s ";
								$args[] = $logicBlockElement->getFind();
								break;

							case Operator::IN:
								$query .= " c.meta_key LIKE '_wp_page_template' AND meta_value IN (".Strings::formatForInStatement($logicBlockElement->getFind()).") ";
								break;

							case Operator::NOT_IN:
								$query .= " c.meta_key LIKE '_wp_page_template' AND meta_value NOT IN (".Strings::formatForInStatement($logicBlockElement->getFind()).") ";
								break;
						}

						break;

					// 5. POST_TAX
					// 6. POST_CAT
					case BelongsTo::POST_TAX:
					case BelongsTo::POST_CAT:
						switch ($logicBlockElement->getOperator()){
							case Operator::EQUALS:
								$query .= " b.term_taxonomy_id = %s ";
								$args[] = $logicBlockElement->getFind();
								break;

							case Operator::NOT_EQUALS:
								$query .= " b.term_taxonomy_id != %s ";
								$args[] = $logicBlockElement->getFind();
								break;

							case Operator::IN:
								$query .= 'b.term_taxonomy_id IN ('.Strings::formatForInStatement($logicBlockElement->getFind()).') ';
								break;

							case Operator::NOT_IN:
								$query .= 'b.term_taxonomy_id NOT IN ('.Strings::formatForInStatement($logicBlockElement->getFind()).') ';
								break;
						}

						break;
				}

				if($logicBlockElement->getLogic() and !$isLast){
					$query .= $logicBlockElement->getLogic();
				}
			}

			$query .= ' ) ';
		}

		// fix any wrong closed query
		$query = str_replace([' OR ) ', ' AND ) '],' ) ', $query);

		// close the query
		$query .= "AND p.post_status IN ('publish', 'draft', 'private', 'auto-draft', 'inherit') GROUP BY p.ID ORDER BY p.ID";

		// fetch data
		$postIds = [];

		$rawData = ACPT_Lite_DB::getResults($query, $args);
		foreach ($rawData as $result){
			$postIds[] = (int)$result->ID;
		}

		return $postIds;
	}
}