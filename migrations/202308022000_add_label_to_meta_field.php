<?php

use ACPT_Lite\Includes\ACPT_Lite_DB;
use ACPT_Lite\Includes\ACPT_Lite_Schema_Migration;

class AddLabelToMetaFieldLiteMigration extends ACPT_Lite_Schema_Migration
{
	/**
	 * @inheritDoc
	 */
	public function up(): array
	{
		$queries = [];

		if($this->existsTable(ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_FIELD))){
			if(false === ACPT_Lite_DB::checkIfColumnExistsInTable(ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_FIELD), 'field_label')){
				$queries[] = "ALTER TABLE `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_FIELD)."` ADD `field_label` VARCHAR(255) DEFAULT NULL ";
			}
		} else {
			if(false === ACPT_Lite_DB::checkIfColumnExistsInTable(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_FIELD, 'field_label')){
				$queries[] = "ALTER TABLE `".ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_FIELD."` ADD `field_label` VARCHAR(255) DEFAULT NULL ";
			}
		}

		return $queries;
	}


	/**
	 * @inheritDoc
	 */
	public function down(): array
	{
		return [
			"ALTER TABLE `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_FIELD)."` DROP COLUMN `field_label` ",
			"ALTER TABLE `".ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_FIELD."` DROP COLUMN `field_label` ",
		];
	}

	/**
	 * @inheritDoc
	 */
	public function version(): string
	{
		return '2.0.0';
	}
}




