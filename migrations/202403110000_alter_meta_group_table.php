<?php

use ACPT_Lite\Includes\ACPT_Lite_DB;
use ACPT_Lite\Includes\ACPT_Lite_Schema_Migration;

class AlterMetaGroupLiteMigration extends ACPT_Lite_Schema_Migration
{
	/**
	 * @inheritDoc
	 * @throws Exception
	 */
	public function up(): array
	{
		return [
			"ALTER TABLE `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_GROUP)."` ADD COLUMN `display` VARCHAR(55) DEFAULT NULL",
		];
	}

	/**
	 * @inheritDoc
	 */
	public function down(): array
	{
		return [
			"ALTER TABLE `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_GROUP)."` DROP COLUMN `display`",
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




