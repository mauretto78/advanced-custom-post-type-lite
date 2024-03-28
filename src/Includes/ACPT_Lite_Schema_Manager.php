<?php

namespace ACPT_Lite\Includes;

use ACPT_Lite\Includes\ACPT_Lite_DB;
use ACPT_Lite\Utils\FS;

class ACPT_Lite_Schema_Manager
{
	/**
	 * Creates the schema
	 *
	 * @return bool
	 */
	public static function up()
	{
		global $wpdb;
		$migrations = self::getMigrations();

		foreach ($migrations as $migration){
			if($migration instanceof ACPT_Lite_Schema_Migration){
				$up = $migration->up();

				foreach ($up as $query){
					$wpdb->query($query);
				}
			}
		}

		self::removeLegacyTables();

		return empty($wpdb->last_error);
	}

	/**
	 * Destroy the schema
	 *
	 * @return bool
	 */
	public static function down()
	{
		global $wpdb;
		$migrations = self::getMigrations();

		foreach ($migrations as $migration){
			$down = $migration->down();

			foreach ($down as $query){
				$wpdb->query($query);
			}
		}

		return empty($wpdb->last_error);
	}

	/**
	 * Remove legacy tables
	 */
	private static function removeLegacyTables()
	{
		global $wpdb;

		$tables = [
			ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE,
			ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_META_BOX,
			ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_FIELD,
			ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_OPTION,
			ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_RELATION,
			ACPT_Lite_DB::TABLE_CUSTOM_POST_TEMPLATE,
			ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_IMPORT,
			ACPT_Lite_DB::TABLE_TAXONOMY,
			ACPT_Lite_DB::TABLE_TAXONOMY_META_BOX,
			ACPT_Lite_DB::TABLE_TAXONOMY_PIVOT,
			ACPT_Lite_DB::TABLE_SETTINGS,
			ACPT_Lite_DB::TABLE_WOOCOMMERCE_PRODUCT_DATA,
			ACPT_Lite_DB::TABLE_WOOCOMMERCE_PRODUCT_DATA_FIELD,
			ACPT_Lite_DB::TABLE_WOOCOMMERCE_PRODUCT_DATA_OPTION,
			ACPT_Lite_DB::TABLE_USER_META_BOX,
			ACPT_Lite_DB::TABLE_USER_META_FIELD,
			ACPT_Lite_DB::TABLE_USER_META_FIELD_OPTION,
		];

		foreach ($tables as $table){
			$wpdb->query("DROP TABLE IF EXISTS `".$table."`;");
		}
	}

	/**
	 * @return ACPT_Lite_Schema_Migration[]
	 */
	private static function getMigrations()
	{
		$migrationsDir = plugin_dir_path(__FILE__) . '/../../migrations';
		$migrations = [];
		$classes = FS::getDirClasses($migrationsDir);

		foreach ($classes as $class){
			if(is_subclass_of($class, ACPT_Lite_Schema_Migration::class)){

				/** @var ACPT_Lite_Schema_Migration $migrationInstance */
				$migrationInstance = new $class;
				$migrations[] = $migrationInstance;
			}
		}

		return $migrations;
	}
}