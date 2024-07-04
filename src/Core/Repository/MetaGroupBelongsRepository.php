<?php

namespace ACPT_Lite\Core\Repository;

use ACPT_Lite\Constants\BelongsTo;
use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Models\Belong\BelongModel;
use ACPT_Lite\Includes\ACPT_Lite_DB;

class MetaGroupBelongsRepository extends AbstractRepository
{
	/**
	 * @param array $args
	 *
	 * @return BelongModel[]
	 * @throws \Exception
	 */
	public static function get(array $args = [])
	{
		$mandatoryKeys = [
			'groupId'  => [
				'required' => false,
				'type' => 'string',
			],
			'belongs'  => [
				'required' => false,
				'type' => 'string',
				'enum' => [
					BelongsTo::POST_ID,
					BelongsTo::POST_CAT,
					BelongsTo::POST_TAX,
					BelongsTo::POST_TEMPLATE,
					BelongsTo::USER_ID,
					BelongsTo::TERM_ID,
					MetaTypes::CUSTOM_POST_TYPE,
					MetaTypes::TAXONOMY,
					MetaTypes::OPTION_PAGE,
					MetaTypes::USER,
				],
			],
		];

		self::validateArgs($mandatoryKeys, $args);

		$return = [];
		$sqlArgs = [];

		$groupId = (isset($args['groupId'])) ? $args['groupId'] : null;
		$belongs = (isset($args['belongs'])) ? $args['belongs'] : null;

		$sql = "
	        SELECT 
	        	g.id,
	        	g.belongs, 
	        	g.operator,
	        	g.find,
	        	g.logic,
	        	g.sort,
	        	b.id_group
	        FROM 
				`" . ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_GROUP) . "` g
				JOIN `" . ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_GROUP_BELONG) . "` b on b.id_belong = g.id
			WHERE  1 = 1
	    ";

		if($belongs !== null){
			$sql .= ' AND g.belongs = %s';
			$sqlArgs[] = $belongs;
		}

		if($groupId !== null){
			$sql .= ' AND b.group_id = %s';
			$sqlArgs[] = $groupId;
		}

		$sql .= ';';
		$belongs = ACPT_Lite_DB::getResults($sql, $sqlArgs);

		foreach ($belongs as $belong){
			$belongModel = BelongModel::hydrateFromArray([
				'id' => $belong->id,
				'belongsTo' => $belong->belongs,
				'operator' => $belong->operator,
				'find' => $belong->find,
				'logic' => $belong->logic,
				'sort' => $belong->sort,
			]);

			$return[] = $belongModel;
		}

		return $return;
	}
}