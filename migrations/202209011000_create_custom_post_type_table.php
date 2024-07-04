<?php

use ACPT_Lite\Includes\ACPT_Lite_DB;
use ACPT_Lite\Includes\ACPT_Lite_Schema_Migration;

class CreateCustomPostTypeTableLiteMigration extends ACPT_Lite_Schema_Migration
{
	/**
	 * @return array
	 */
	public function up(): array
	{
		return [
			"CREATE TABLE IF NOT EXISTS `".ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE."` (
	            id VARCHAR(36) UNIQUE NOT NULL,
	            post_name VARCHAR(20) UNIQUE NOT NULL,
	            singular VARCHAR(255) NOT NULL,
	            plural VARCHAR(255) NOT NULL,
	            icon VARCHAR(50) NOT NULL,
	            native TINYINT(1) DEFAULT 0,
	            supports TEXT,
	            labels TEXT,
	            settings TEXT,
	            PRIMARY KEY(id)
	        ) $this->charsetCollation;",
			$this->renameTableQuery(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE),
		];
	}

	/**
	 * @return array
	 */
	public function down(): array
	{
		return [
			$this->deleteTableQuery(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE),
			$this->deleteTableQuery(ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE)),
		];
	}

	public function version(): string
	{
		return '1.0.17';
	}
}
