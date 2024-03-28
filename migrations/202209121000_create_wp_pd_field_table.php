<?php

use ACPT_Lite\Includes\ACPT_Lite_DB;
use ACPT_Lite\Includes\ACPT_Lite_Schema_Migration;

class CreateWooCommerceProductDataFieldTableLiteMigration extends ACPT_Lite_Schema_Migration
{
	/**
	 * @return array
	 */
	public function up(): array
	{
		return [
			"CREATE TABLE IF NOT EXISTS `".ACPT_Lite_DB::TABLE_WOOCOMMERCE_PRODUCT_DATA_FIELD."` (
	            id VARCHAR(36) UNIQUE NOT NULL,
	            product_data_id VARCHAR(36) NOT NULL,
	            field_name VARCHAR(50) NOT NULL,
	            field_type VARCHAR(50) NOT NULL,
	            field_default_value VARCHAR(50) DEFAULT NULL,
	            field_description TEXT DEFAULT NULL,
	            required TINYINT(1) NOT NULL,
	            sort INT(11),
	            PRIMARY KEY(id)
	        ) $this->charsetCollation;",
			$this->renameTableQuery(ACPT_Lite_DB::TABLE_WOOCOMMERCE_PRODUCT_DATA_FIELD),
		];
	}

	/**
	 * @return array
	 */
	public function down(): array
	{
		return [
			$this->deleteTableQuery(ACPT_Lite_DB::TABLE_WOOCOMMERCE_PRODUCT_DATA_FIELD),
			$this->deleteTableQuery(ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_WOOCOMMERCE_PRODUCT_DATA_FIELD)),
		];
	}
}