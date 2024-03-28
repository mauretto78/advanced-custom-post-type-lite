<?php

use ACPT_Lite\Core\Models\Belong\BelongModel;
use ACPT_Lite\Core\Models\Meta\MetaGroupModel;
use ACPT_Lite\Constants\Operator;
use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Includes\ACPT_Lite_DB;
use ACPT_Lite\Includes\ACPT_Lite_Schema_Migration;

class MigrateMetaLiteMigration extends ACPT_Lite_Schema_Migration
{
	/**
	 * @inheritDoc
	 * @throws Exception
	 */
	public function up(): array
	{
		ACPT_Lite_DB::startTransaction();

		try {
			$this->migrateMetaBoxes();
		} catch (\Exception $exception){
			ACPT_Lite_DB::rollbackTransaction();

			return [];
		}

		ACPT_Lite_DB::commitTransaction();

		return [
			"RENAME TABLE `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_META_BOX)."` TO `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_BOX)."`;",
			"RENAME TABLE `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_FIELD)."` TO `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_FIELD)."`;",
			"RENAME TABLE `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_OPTION)."` TO `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_OPTION)."`;",
			"ALTER TABLE `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_BOX)."` DROP COLUMN `post_type` ",
			"DROP TABLE `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_TAXONOMY_META_BOX)."`",
			"DROP TABLE `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_USER_META_BOX)."`",
			"DROP TABLE `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_META_BOX)."`;",
			"DROP TABLE `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_FIELD)."`;",
			"DROP TABLE `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_OPTION)."`;",
			"DROP TABLE `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_RELATION)."`;",
			"DROP TABLE `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_USER_META_FIELD)."`;",
			"DROP TABLE `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_USER_META_FIELD_OPTION)."`;",
			"DROP TABLE `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TEMPLATE)."`;",

			// legacy tables
			"DROP TABLE IF EXISTS `".ACPT_Lite_DB::TABLE_TAXONOMY_META_BOX."`",
			"DROP TABLE IF EXISTS `".ACPT_Lite_DB::TABLE_USER_META_BOX."`",
			"DROP TABLE IF EXISTS `".ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_META_BOX."`;",
			"DROP TABLE IF EXISTS `".ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_FIELD."`;",
			"DROP TABLE IF EXISTS `".ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_OPTION."`;",
			"DROP TABLE IF EXISTS `".ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_RELATION."`;",
			"DROP TABLE IF EXISTS `".ACPT_Lite_DB::TABLE_USER_META_FIELD."`;",
			"DROP TABLE IF EXISTS `".ACPT_Lite_DB::TABLE_USER_META_FIELD_OPTION."`;",
			"DROP TABLE IF EXISTS `".ACPT_Lite_DB::TABLE_CUSTOM_POST_TEMPLATE."`;",
		];
	}

	/**
	 * @throws Exception
	 */
	private function migrateMetaBoxes()
	{
		ACPT_Lite_DB::flushCache();

		// CPTs
		$sql = "SELECT post_name FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE)."`";
		foreach (ACPT_Lite_DB::getResults($sql) as $result){
			$this->copyCustomPostTypeBoxes($result->post_name);
		}

		// Taxonomies
		$sql = "SELECT slug FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_TAXONOMY)."`";
		foreach (ACPT_Lite_DB::getResults($sql) as $taxonomy){
			$this->copyTaxonomyBoxes($taxonomy->slug);
		}

		// User
		$this->copyUserBoxes();
	}

	/**
	 * @param string $postName
	 *
	 * @throws Exception
	 */
	private function copyCustomPostTypeBoxes(string $postName)
	{
		$group = MetaGroupModel::hydrateFromArray([
			'name' => $postName.'-meta-group',
		]);

		$belong = BelongModel::hydrateFromArray([
			'belongsTo' => MetaTypes::CUSTOM_POST_TYPE,
			'operator' => Operator::EQUALS,
			'find' => $postName,
			'logic' => null,
			'sort' => 1
		]);

		$group->addBelong($belong);
		$this->saveMetaGroup($group);

		$sql = "UPDATE `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_META_BOX)."` SET group_id = %s WHERE post_type = %s;";
		ACPT_Lite_DB::executeQueryOrThrowException($sql, [
			$group->getId(),
			$postName
		]);
	}

	/**
	 * @param string $taxonomySlug
	 *
	 * @throws Exception
	 */
	private function copyTaxonomyBoxes(string $taxonomySlug)
	{
		$group = MetaGroupModel::hydrateFromArray([
			'name' => $taxonomySlug.'-meta-group',
		]);

		$belong = BelongModel::hydrateFromArray([
			'belongsTo' => MetaTypes::TAXONOMY,
			'operator' => Operator::EQUALS,
			'find' => $taxonomySlug,
			'logic' => null,
			'sort' => 1
		]);

		$group->addBelong($belong);
		$this->saveMetaGroup($group);

		$sql = "SELECT * FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_TAXONOMY_META_BOX)."` WHERE taxonomy = %s";

		$taxonomyBoxes = ACPT_Lite_DB::getResults($sql, [
			$taxonomySlug
		]);

		foreach ($taxonomyBoxes as $taxonomyBox){

			$sql = "
                INSERT INTO `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_META_BOX)."`
                (
                    `id`,
                    `group_id`,
                    `post_type`,
                    `meta_box_name`,
                    `meta_box_label`,
                    `sort`
                ) VALUES (
                    %s,
                    %s,
                    %s,
                    %s,
                    %s,
                    %d
                ) ON DUPLICATE KEY UPDATE
                    `group_id` = %s,
                    `post_type` = %s,
                    `meta_box_name` = %s,
                    `meta_box_label` = %s,
                    `sort` = %d
            ;";

			ACPT_Lite_DB::executeQueryOrThrowException($sql, [
				$taxonomyBox->id,
				$group->getId(),
				'tax',
				$taxonomyBox->meta_box_name,
				$taxonomyBox->meta_box_label,
				$taxonomyBox->sort,
				$group->getId(),
				'tax',
				$taxonomyBox->meta_box_name,
				$taxonomyBox->meta_box_label,
				$taxonomyBox->sort
			]);
		}
	}

	/**
	 * @throws Exception
	 */
	private function copyUserBoxes()
	{
		$group = MetaGroupModel::hydrateFromArray([
			'name' => 'user-meta-group',
		]);

		$belong = BelongModel::hydrateFromArray([
			'belongsTo' => MetaTypes::USER,
			'sort' => 1
		]);

		$group->addBelong($belong);
		$this->saveMetaGroup($group);

		$sql = "SELECT * FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_USER_META_BOX)."`";

		$userBoxes = ACPT_Lite_DB::getResults($sql, []);

		foreach ($userBoxes as $userBox){

			$sql = "
                INSERT INTO `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_META_BOX)."`
                (
                    `id`,
                    `group_id`,
                    `post_type`,
                    `meta_box_name`,
                    `meta_box_label`,
                    `sort`
                ) VALUES (
                    %s,
                    %s,
                    %s,
                    %s,
                    %s,
                    %d
                ) ON DUPLICATE KEY UPDATE
                    `group_id` = %s,
                    `post_type` = %s,
                    `meta_box_name` = %s,
                    `meta_box_label` = %s,
                    `sort` = %d
            ;";

			ACPT_Lite_DB::executeQueryOrThrowException($sql, [
				$userBox->id,
				$group->getId(),
				'user',
				$userBox->meta_box_name,
				$userBox->meta_box_label,
				$userBox->sort,
				$group->getId(),
				'user',
				$userBox->meta_box_name,
				$userBox->meta_box_label,
				$userBox->sort
			]);
		}
	}

	/**
	 * @param MetaGroupModel $group
	 *
	 * @throws Exception
	 */
	private function saveMetaGroup(MetaGroupModel $group)
	{
		$sql = "
            INSERT INTO `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_GROUP)."` 
            (
				`id`,
				`group_name`,
				`label`
            ) VALUES (
                %s,
                %s,
                %s
            ) ON DUPLICATE KEY UPDATE 
                `group_name` = %s,
                `label` = %s
        ;";

		ACPT_Lite_DB::executeQueryOrThrowException($sql, [
			$group->getId(),
			$group->getName(),
			$group->getLabel(),
			$group->getName(),
			$group->getLabel(),
		]);

		foreach($group->getBelongs() as $belong){

			// check if group exists
			$sql = "SELECT * FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_GROUP)."` WHERE id = %s";
			$check = ACPT_Lite_DB::getResults($sql, [$group->getId()]);

			if(count($check) == 1){
				$sql = "
	                INSERT INTO `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_BELONG)."`
	                (
	                    `id`,
	                    `belongs`,
	                    `operator`,
	                    `find`,
	                    `sort`
	                ) VALUES (
	                    %s,
	                    %s,
	                    %s,
	                    %s,
	                    %d
	                ) ON DUPLICATE KEY UPDATE
	                    `belongs` = %s,
	                    `operator` = %s,
	                    `find` = %s,
	                    `sort` = %d
	                ;";

				ACPT_Lite_DB::executeQueryOrThrowException($sql, [
					$belong->getId(),
					$belong->getBelongsTo(),
					$belong->getOperator(),
					$belong->getFind(),
					$belong->getSort(),
					$belong->getBelongsTo(),
					$belong->getOperator(),
					$belong->getFind(),
					$belong->getSort(),
				]);

				$sql = "
	                INSERT INTO `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_GROUP_BELONG)."`
	                (
	                    `group_id`,
	                    `belong_id`
	                ) VALUES (
	                    %s,
	                    %s
	                ) ON DUPLICATE KEY UPDATE
	                    `group_id` = %s,
	                    `belong_id` = %s
	                ;";

				ACPT_Lite_DB::executeQueryOrThrowException($sql, [
					$group->getId(),
					$belong->getId(),
					$group->getId(),
					$belong->getId(),
				]);
			}
		}
	}

	/**
	 * @inheritDoc
	 */
	public function down(): array
	{
		return [
			"ALTER TABLE `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_BOX)."` ADD `post_type` VARCHAR(20) DEFAULT NULL ",
			"RENAME TABLE `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_BOX)."` TO `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_META_BOX)."`;",
			"RENAME TABLE `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_FIELD)."` TO `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_FIELD)."`;",
			"RENAME TABLE `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_OPTION)."` TO `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_OPTION)."`;",
		];
	}
}




