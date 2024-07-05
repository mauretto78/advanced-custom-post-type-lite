<?php

use ACPT_Lite\Includes\ACPT_Lite_DB;
use ACPT_Lite\Includes\ACPT_Lite_Schema_Migration;

class CreateMetaBoxTableLiteMigration extends ACPT_Lite_Schema_Migration
{
	/**
	 * @return array
	 */
	public function up(): array
	{
		return [
			"CREATE TABLE IF NOT EXISTS `".ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_META_BOX."` (
	            id VARCHAR(36) UNIQUE NOT NULL,
	            post_type VARCHAR(20) NOT NULL,
	            meta_box_name VARCHAR(50) NOT NULL,
	            sort INT(11),
	            PRIMARY KEY(id)
	        ) $this->charsetCollation;",
			$this->renameTableQuery(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_META_BOX),
		];
	}

	/**
	 * @return array
	 */
	public function down(): array
	{
		return [
			$this->deleteTableQuery(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_META_BOX),
			$this->deleteTableQuery(ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_META_BOX)),
		];
	}

	public function version(): string
	{
		return '1.0.17';
	}
}