<?php

use ACPT_Lite\Includes\ACPT_Lite_DB;
use ACPT_Lite\Includes\ACPT_Lite_Schema_Migration;

class CreateMetaGroupsTableLiteMigration extends ACPT_Lite_Schema_Migration
{
	/**
	 * @inheritDoc
	 */
	public function up(): array
	{
		return [
			"CREATE TABLE IF NOT EXISTS `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_GROUP)."` (
	            id VARCHAR(36) UNIQUE NOT NULL,
	            group_name VARCHAR(255) UNIQUE NOT NULL,
	            label VARCHAR(255) NULL,
	            PRIMARY KEY(id)
	        ) $this->charsetCollation;",
			"CREATE TABLE IF NOT EXISTS `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_BELONG)."` (
	            id VARCHAR(36) UNIQUE NOT NULL,
	            belongs VARCHAR(36) NOT NULL,
	            operator VARCHAR(20) NULL,
	            find VARCHAR(255) NULL,
	            logic VARCHAR(3) DEFAULT NULL,
	            sort INT(11),
	            PRIMARY KEY(id)
	        ) $this->charsetCollation;",
			"CREATE TABLE IF NOT EXISTS `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_GROUP_BELONG)."` (
	            group_id VARCHAR(36) NOT NULL,
	            belong_id VARCHAR(36) NOT NULL,
	             PRIMARY KEY( `group_id`, `belong_id`)
	        ) $this->charsetCollation;",
		];
	}

	/**
	 * @inheritDoc
	 */
	public function down(): array
	{
		return [
			$this->deleteTableQuery(ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_GROUP)),
			$this->deleteTableQuery(ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_BELONG)),
			$this->deleteTableQuery(ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_GROUP_BELONG)),
		];
	}
}