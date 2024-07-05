<?php

use ACPT_Lite\Includes\ACPT_Lite_DB;
use ACPT_Lite\Includes\ACPT_Lite_Schema_Migration;

class ChangeIconLiteMigration extends ACPT_Lite_Schema_Migration
{
	/**
	 * @return array
	 */
	public function up(): array
	{
		$queries = [];

		if($this->existsTable(ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE))){
			$queries[] = "ALTER TABLE `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE)."` CHANGE COLUMN `icon` `icon` VARCHAR(255) NOT NULL ";
		} else {
			$queries[] = "ALTER TABLE `".ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE."` CHANGE COLUMN `icon` `icon` VARCHAR(255) NOT NULL ";
		}

		return $queries;
	}

	/**
	 * @return array
	 */
	public function down(): array
	{
		return [
			"ALTER TABLE `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE)."` CHANGE COLUMN `icon` `icon` VARCHAR(50) NOT NULL ",
			"ALTER TABLE `".ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE."` CHANGE COLUMN `icon` `icon` VARCHAR(50) NOT NULL ",
		];
	}

	/**
	 * @inheritDoc
	 */
	public function version(): string
	{
		return '1.0.17';
	}
}