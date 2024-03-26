<?php

use ACPT_Lite\Includes\ACPT_Lite_DB;
use ACPT_Lite\Includes\ACPT_Lite_Schema_Migration;

class AlterMetaOptionLiteMigration extends ACPT_Lite_Schema_Migration
{
	/**
	 * @inheritDoc
	 * @throws Exception
	 */
	public function up(): array
	{
		return [
			"ALTER TABLE `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_OPTION)."` ADD COLUMN `is_default` TINYINT(1) NOT NULL DEFAULT 0",
		];
	}

	/**
	 * @inheritDoc
	 */
	public function down(): array
	{
		return [
			"ALTER TABLE `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_OPTION)."` DROP COLUMN `is_default`",
		];
	}
}




