<?php

namespace ACPT_Lite\Includes;

use ACPT_Lite\Utils\PHP\FS;

class ACPT_Lite_Schema_Manager
{
    /**
     * @param string      $newVersion
     * @param string|null $oldVersion
     * @return bool
     */
    public static function up(string $newVersion, ?string $oldVersion = null): bool
    {
        global $wpdb;
        $migrations = self::getMigrations();

        // Captured once, before any migration in this batch runs. Migrations
        // earlier in the loop (e.g. a table's original CREATE) can make
        // checkIfSchemaExists() flip from false to true mid-loop; if it were
        // re-queried per iteration, every migration after that point would
        // wrongly fall through to the stricter version-range check below
        // instead of the "schema is missing, apply everything" escape hatch.
        $schemaExistedBefore = ACPT_Lite_DB::checkIfSchemaExists();

        foreach ($migrations as $migration) {
            if (self::isTheMigrationNeeded($migration->version(), $newVersion, $oldVersion, $schemaExistedBefore)) {
                $up = $migration->up();

                foreach ($up as $query) {
                    $wpdb->query($query);
                }
            }
        }

        self::removeLegacyTables();

        return empty($wpdb->last_error);
    }

    /**
     * Run a migration only when it is required
     *
     * @param string $migrationVersion
     * @param string $newVersion
     * @param string|null $oldVersion
     * @param bool $schemaExistedBefore
     *
     * @return bool
     */
    private static function isTheMigrationNeeded(string $migrationVersion, string $newVersion, ?string $oldVersion = null, bool $schemaExistedBefore = true): bool
    {
        if (!$schemaExistedBefore) {
            return true;
        }

        return (
            ($oldVersion === null || version_compare($migrationVersion, $oldVersion, ">=") == true) &&
            version_compare($migrationVersion, $newVersion, "<=") == true
        );
    }

    /**
     * Destroy the schema
     *
     * @return bool
     * @throws \Exception
     */
    public static function down(): bool
    {
        global $wpdb;

        $tables = [
            ACPT_Lite_DB::TABLE_BELONG,
            ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE,
            ACPT_Lite_DB::TABLE_META_GROUP_BELONG,
            ACPT_Lite_DB::TABLE_META_BOX,
            ACPT_Lite_DB::TABLE_META_FIELD,
            ACPT_Lite_DB::TABLE_META_GROUP,
            ACPT_Lite_DB::TABLE_META_OPTION,
            ACPT_Lite_DB::TABLE_SETTINGS,
            ACPT_Lite_DB::TABLE_TAXONOMY,
            ACPT_Lite_DB::TABLE_TAXONOMY_PIVOT,
            ACPT_Lite_DB::TABLE_WOOCOMMERCE_PRODUCT_DATA,
            ACPT_Lite_DB::TABLE_WOOCOMMERCE_PRODUCT_DATA_FIELD,
            ACPT_Lite_DB::TABLE_WOOCOMMERCE_PRODUCT_DATA_OPTION,
        ];

        try {
            ACPT_Lite_DB::startTransaction();

            foreach ($tables as $table) {
                ACPT_Lite_DB::dropTable($table);
            }

            ACPT_Lite_DB::commitTransaction();

            return empty($wpdb->last_error);
        } catch (\Exception $exception) {
            do_action("acpt/error", $exception);
            ACPT_Lite_DB::rollbackTransaction();

            return false;
        }
    }

    private static function removeLegacyTables(): void
    {
        global $wpdb;

        $tables = [
            ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_ADVANCED_OPTION,
            ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE,
            ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_META_BOX,
            ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_FIELD,
            ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_OPTION,
            ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_VISIBILITY,
            ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_RELATION,
            ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_BLOCK,
            ACPT_Lite_DB::TABLE_CUSTOM_POST_TEMPLATE,
            ACPT_Lite_DB::TABLE_TAXONOMY,
            ACPT_Lite_DB::TABLE_TAXONOMY_META_BOX,
            ACPT_Lite_DB::TABLE_TAXONOMY_PIVOT,
            ACPT_Lite_DB::TABLE_SETTINGS,
            ACPT_Lite_DB::TABLE_WOOCOMMERCE_PRODUCT_DATA,
            ACPT_Lite_DB::TABLE_WOOCOMMERCE_PRODUCT_DATA_FIELD,
            ACPT_Lite_DB::TABLE_WOOCOMMERCE_PRODUCT_DATA_OPTION,
            ACPT_Lite_DB::TABLE_USER_META_BOX,
            ACPT_Lite_DB::TABLE_USER_META_FIELD,
            ACPT_Lite_DB::TABLE_USER_META_FIELD_OPTION
        ];

        foreach ($tables as $table) {
            $wpdb->query("DROP TABLE IF EXISTS `".$table."`;");
        }
    }

    /**
     * @return ACPT_Lite_Schema_Migration[]|array
     */
    private static function getMigrations(): array
    {
        $migrationsDir = plugin_dir_path(__FILE__) . '/../../migrations';
        $migrations = [];
        $classes = FS::getDirClasses($migrationsDir);

        foreach ($classes as $class) {
            if (is_subclass_of($class, ACPT_Lite_Schema_Migration::class)) {

                /** @var ACPT_Lite_Schema_Migration $migrationInstance */
                $migrationInstance = new $class();
                $migrations[] = $migrationInstance;
            }
        }

        return $migrations;
    }
}
