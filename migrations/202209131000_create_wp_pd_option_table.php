<?php

use ACPT_Lite\Includes\ACPT_Lite_DB;
use ACPT_Lite\Includes\ACPT_Lite_Schema_Migration;

class CreateWooCommerceProductDataOptionTableLiteMigration extends ACPT_Lite_Schema_Migration
{
	/**
	 * @return array
	 */
	public function up(): array
	{
		return [
			"CREATE TABLE IF NOT EXISTS `".ACPT_Lite_DB::TABLE_WOOCOMMERCE_PRODUCT_DATA_OPTION."` (
	            id VARCHAR(36) UNIQUE NOT NULL,
	            product_data_id VARCHAR(36) NOT NULL,
	            product_data_field_id VARCHAR(36) NOT NULL,
	            option_label VARCHAR(50) NOT NULL,
	            option_value VARCHAR(50) NOT NULL,
	            sort INT(11),
	            PRIMARY KEY(id)
	        ) $this->charsetCollation;",
			$this->renameTableQuery(ACPT_Lite_DB::TABLE_WOOCOMMERCE_PRODUCT_DATA_OPTION),
		];
	}

	/**
	 * @return array
	 */
	public function down(): array
	{
		return [
			$this->deleteTableQuery(ACPT_Lite_DB::TABLE_WOOCOMMERCE_PRODUCT_DATA_OPTION),
			$this->deleteTableQuery(ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_WOOCOMMERCE_PRODUCT_DATA_OPTION)),
		];
	}
}