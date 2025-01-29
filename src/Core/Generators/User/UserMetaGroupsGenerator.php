<?php

namespace ACPT_Lite\Core\Generators\User;

use ACPT_Lite\Constants\BelongsTo;
use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Constants\Operator;
use ACPT_Lite\Core\Generators\AbstractGenerator;
use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Belong\BelongModel;
use ACPT_Lite\Core\Repository\MetaRepository;
use ACPT_Lite\Includes\ACPT_Lite_DB;
use ACPT_Lite\Utils\PHP\Logics;

class UserMetaGroupsGenerator extends AbstractGenerator
{
	/**
	 * Generate meta boxes related to users
	 */
	public function generate()
	{
		try {
			$metaGroups = MetaRepository::get([
				'belongsTo' => MetaTypes::USER,
                'clonedFields' => true,
			]);

			if(!empty($metaGroups)){
				$generator = new UserMetaBoxGenerator($metaGroups);
				$generator->generate();
			}
		} catch (\Exception $exception) {
			// do nothing
		}

		add_action( 'plugins_loaded', [new UserMetaGroupsGenerator(), 'generateForSingleUsers']);
	}

	/**
	 * Generate meta boxes related to single users
	 */
	public function generateForSingleUsers()
	{
		try {
			$metaGroups = MetaRepository::get([
				'belongsTo' => BelongsTo::USER_ID,
                'clonedFields' => true
			]);

			foreach ($metaGroups as $metaGroup){
				$userIds = $this->getUserIdsFromBelongs($metaGroup->getBelongs());
				foreach ($userIds as $userId){
					$generator = new UserMetaBoxGenerator([$metaGroup], $userId);
					$generator->generate();
				}
			}
		} catch (\Exception $exception){
			// do nothing
		}
	}

	/**
	 * @param BelongModel[] $belongs
	 *
	 * @return array
	 */
	private function getUserIdsFromBelongs($belongs = [])
	{
		if(empty($belongs)){
			return [];
		}

		global $wpdb;
		$query = "SELECT u.ID FROM $wpdb->users u  WHERE 1=1 ";
		$args = [];

		$logicBlocks = Logics::extractLogicBlocks($belongs);

		if(!empty($logicBlocks)){
            foreach ($logicBlocks as $index => $logicBlock){

                // consider only USER_ID conditions
                $filteredLogicBlockElement = array_filter($logicBlock, function (BelongModel $logicBlockElement){
                    $belongsTo = $logicBlockElement->getBelongsTo();

                    return $belongsTo === BelongsTo::USER_ID;
                });

                $isLast = $index === (count($filteredLogicBlockElement)-1);
                $query .= ' AND ( ';

                /** @var BelongModel[] $filteredLogicBlockElement */
                foreach ($filteredLogicBlockElement as $logicBlockElement){
                    switch ($logicBlockElement->getOperator()){
                        case Operator::EQUALS:
                            $query .= " u.ID = %s ";
                            $args[] = $logicBlockElement->getFind();
                            break;

                        case Operator::NOT_EQUALS:
                            $query .= " u.ID != %s ";
                            $args[] = $logicBlockElement->getFind();
                            break;

                        case Operator::IN:
                            $query .= ' u.ID IN ('.Strings::formatForInStatement($logicBlockElement->getFind()).') ';
                            break;

                        case Operator::NOT_IN:
                            $query .= ' u.ID NOT IN ('.Strings::formatForInStatement($logicBlockElement->getFind()).') ';
                            break;
                    }

                    if($logicBlockElement->getLogic() and !$isLast){
                        $query .= $logicBlockElement->getLogic();
                    }
                }

                $query .= ' ) ';
            }
        }

		// fetch data
		$userIds = [];

		$rawData = ACPT_Lite_DB::getResults($query, $args);
		foreach ($rawData as $result){
			$userIds[] = (int)$result->ID;
		}

		return $userIds;
	}
}
