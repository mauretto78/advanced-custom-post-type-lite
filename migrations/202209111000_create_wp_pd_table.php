<?php

use ACPT_Lite\Includes\ACPT_Lite_DB;
use ACPT_Lite\Includes\ACPT_Lite_Schema_Migration;

class CreateWooCommerceProductDataTableLiteMigration extends ACPT_Lite_Schema_Migration
{
	/**
	 * @return array
	 */
	public function up(): array
	{
		return [
			"CREATE TABLE IF NOT EXISTS `".ACPT_Lite_DB::TABLE_WOOCOMMERCE_PRODUCT_DATA."` (
	            id VARCHAR(36) UNIQUE NOT NULL,
	            product_data_name VARCHAR(32) NOT NULL,
	            icon VARCHAR(255) NOT NULL,
	            visibility TEXT NOT NULL,
	            show_in_ui TINYINT(1) NOT NULL,
	            content TEXT DEFAULT NULL,
	            PRIMARY KEY(id)
	        ) $this->charsetCollation;",
			$this->renameTableQuery(ACPT_Lite_DB::TABLE_WOOCOMMERCE_PRODUCT_DATA),
		];
	}

	/**
	 * @return array
	 */
	public function down(): array
	{
		return [
			$this->deleteTableQuery(ACPT_Lite_DB::TABLE_WOOCOMMERCE_PRODUCT_DATA),
			$this->deleteTableQuery(ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_WOOCOMMERCE_PRODUCT_DATA)),
		];
	}

	public function version(): string
	{
		return '1.0.17';
	}
}