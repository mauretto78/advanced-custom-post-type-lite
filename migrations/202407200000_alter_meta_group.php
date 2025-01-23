<?php

use ACPT_Lite\Includes\ACPT_Lite_DB;
use ACPT_Lite\Includes\ACPT_Schema_Migration;

class AddContextAndPriorityToMetaBox extends ACPT_Schema_Migration
{
	/**
	 * @return array
	 */
	public function up(): array
	{
		$queries = [];

		if(!ACPT_Lite_DB::checkIfColumnExistsInTable(ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_GROUP), 'priority')){
			$queries[] = "ALTER TABLE `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_GROUP)."` ADD `priority` VARCHAR(36) DEFAULT NULL";
		}

		if(!ACPT_Lite_DB::checkIfColumnExistsInTable(ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_GROUP), 'context')){
			$queries[] = "ALTER TABLE `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_GROUP)."` ADD `context` VARCHAR(36) DEFAULT NULL";
		}

		return $queries;
	}

	/**
	 * @inheritDoc
	 */
	public function down(): array
	{
		return [
			"ALTER TABLE `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_GROUP)."` DROP COLUMN `priority` ",
			"ALTER TABLE `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_GROUP)."` DROP COLUMN `context` ",
		];
	}

	/**
	 * @inheritDoc
	 */
	public function version(): string
	{
		return '2.0.8';
	}
}




