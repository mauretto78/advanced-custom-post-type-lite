<?php

use ACPT_Lite\Includes\ACPT_Lite_DB;
use ACPT_Lite\Includes\ACPT_Lite_Schema_Migration;

class AddNativeToTaxonomyTableLiteMigration extends ACPT_Lite_Schema_Migration
{
	/**
	 * @return array
	 */
	public function up(): array
	{
		if($this->existsTable(ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_TAXONOMY))){
			if(false === ACPT_Lite_DB::checkIfColumnExistsInTable(ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_TAXONOMY), 'native') ) {
				return [
					"ALTER TABLE `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_TAXONOMY)."` ADD `native` TINYINT(1) NULL DEFAULT NULL ",
				];
			}
		}

		if(false === ACPT_Lite_DB::checkIfColumnExistsInTable(ACPT_Lite_DB::TABLE_TAXONOMY, 'native') ) {
			return [
				"ALTER TABLE `".ACPT_Lite_DB::TABLE_TAXONOMY."` ADD `native` TINYINT(1) NULL DEFAULT NULL ",
			];
		}

		return [];
	}

	/**
	 * @return array
	 */
	public function down(): array
	{
		return [
			"ALTER TABLE `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_TAXONOMY)."` DROP COLUMN `native` ",
			"ALTER TABLE `".ACPT_Lite_DB::TABLE_TAXONOMY."` DROP COLUMN `native` ",
		];
	}

	public function version(): string
	{
		return '1.0.17';
	}
}