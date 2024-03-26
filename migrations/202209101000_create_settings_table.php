<?php

use ACPT_Lite\Includes\ACPT_Lite_DB;
use ACPT_Lite\Includes\ACPT_Lite_Schema_Migration;

class CreateSettingsTableLiteMigration extends ACPT_Lite_Schema_Migration
{
	/**
	 * @return array
	 */
	public function up(): array
	{
		return [
			"CREATE TABLE IF NOT EXISTS `".ACPT_Lite_DB::TABLE_SETTINGS."` (
	            id VARCHAR(36) UNIQUE NOT NULL,
	            meta_key VARCHAR(32) UNIQUE NOT NULL,
	            meta_value VARCHAR(255) NOT NULL,
	            PRIMARY KEY(id)
	        ) $this->charsetCollation;",
			$this->renameTableQuery(ACPT_Lite_DB::TABLE_SETTINGS),
		];
	}

	/**
	 * @return array
	 */
	public function down(): array
	{
		return [
			$this->deleteTableQuery(ACPT_Lite_DB::TABLE_SETTINGS),
			$this->deleteTableQuery(ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_SETTINGS)),
		];
	}
}