<?php

namespace ACPT_Lite\Includes;

use ACPT_Lite\Utils\PHP\FS;

class ACPT_Lite_Schema_Manager
{
    /**
     * Creates the schema
     *
     * @param $newVersion
     * @param null $oldVersion
     *
     * @return bool
     */
    public static function up($newVersion, $oldVersion = null)
    {
	    global $wpdb;
        $migrations = self::getMigrations();

        foreach ($migrations as $migration){
        	if($migration instanceof ACPT_Lite_Schema_Migration){
                if(self::isTheMigrationNeeded($migration->version(), $newVersion, $oldVersion)){
	                $up = $migration->up();

	                foreach ($up as $query){
		                $wpdb->query($query);
	                }
                }
	        }
        }

        self::removeLegacyTables();

	    return empty($wpdb->last_error);
    }

	/**
	 * Run a migration only when it is required
	 *
	 * @param $migrationVersion
	 * @param $newVersion
	 * @param null $oldVersion
	 *
	 * @return bool
	 */
    private static function isTheMigrationNeeded($migrationVersion, $newVersion, $oldVersion = null)
    {
    	if(!ACPT_Lite_DB::checkIfSchemaExists()){
    		return true;
	    }

    	return (
		    version_compare($migrationVersion, $oldVersion, ">=") == true and
		    version_compare($migrationVersion, $newVersion, "<=") == true
	    );
    }

	/**
	 * Destroy the schema
	 *
	 * @return bool
	 * @throws \Exception
	 */
    public static function down()
    {
	    global $wpdb;

	    $tables = [
            ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE,
            ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_META_BOX,
            ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_FIELD,
            ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_OPTION,
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
            ACPT_Lite_DB::TABLE_BELONG,
            ACPT_Lite_DB::TABLE_META_GROUP_BELONG,
            ACPT_Lite_DB::TABLE_META_GROUP,
            ACPT_Lite_DB::TABLE_META_BOX,
            ACPT_Lite_DB::TABLE_META_FIELD,
            ACPT_Lite_DB::TABLE_META_OPTION,
	    ];

	    try {
	    	ACPT_Lite_DB::startTransaction();

		    foreach ($tables as $table){
			    ACPT_Lite_DB::executeQueryOrThrowException("DROP TABLE IF EXISTS `".ACPT_Lite_DB::prefixedTableName($table)."`;");
		    }

		    ACPT_Lite_DB::commitTransaction();

		    return empty($wpdb->last_error);
	    } catch (\Exception $exception){
	    	ACPT_Lite_DB::rollbackTransaction();

	    	return false;
	    }
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
            ACPT_Lite_DB::TABLE_BELONG,
            ACPT_Lite_DB::TABLE_META_GROUP_BELONG,
            ACPT_Lite_DB::TABLE_META_GROUP,
            ACPT_Lite_DB::TABLE_META_BOX,
            ACPT_Lite_DB::TABLE_META_FIELD,
            ACPT_Lite_DB::TABLE_META_OPTION,
	    ];

	    foreach ($tables as $table){
		    $wpdb->query("DROP TABLE IF EXISTS `".$table."`;");
	    }
    }

	/**
	 * @return ACPT_Lite_Schema_Migration[]|array
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