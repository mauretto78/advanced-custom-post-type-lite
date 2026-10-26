<?php

namespace ACPT_Lite\Includes;

use ACPT_Lite\Core\Helper\Features;
use ACPT_Lite\Core\Repository\CustomPostTypeRepository;
use ACPT_Lite\Core\Repository\TaxonomyRepository;
use ACPT_Lite\Integrations\WooCommerce\ACPT_Lite_WooCommerce;
use ACPT_Lite\Utils\Wordpress\Transient;

abstract class ACPT_Lite_DB_Tools
{
    public const HEALTH_CHECK_TRANSIENT_KEY = 'acpt_lite_health_check';
    public const HEALTH_CHECK_TRANSIENT_TTL = 86400; // 1 day

    /**
     * Run health check and repair DB
     * (once a day)
     *
     * @return bool
     * @throws \Exception
     */
    public static function runHealthCheck()
    {
        if (!Transient::has(self::HEALTH_CHECK_TRANSIENT_KEY)) {
            $healthCheckIssues = ACPT_Lite_DB_Tools::healthCheck();

            if (!empty($healthCheckIssues)) {
                $repair = ACPT_Lite_DB_Tools::repair($healthCheckIssues);
                Transient::set(self::HEALTH_CHECK_TRANSIENT_KEY, $repair, self::HEALTH_CHECK_TRANSIENT_TTL);

                return $repair;
            }

            Transient::set(self::HEALTH_CHECK_TRANSIENT_KEY, true, self::HEALTH_CHECK_TRANSIENT_TTL);

            return true;
        }

        return true;
    }

    /**
     * @return array<string, mixed>
     * @throws \Exception
     */
    public static function healthCheck(): array
    {
        $issues = [];

        // check schema
        foreach (ACPT_Lite_Schema::get() as $tableName => $specs) {
            if (self::tableShouldBeIncludedInHealthCheck($tableName)) {
                $create = $specs['create'];
                $columns = $specs['columns'];

                if (false === ACPT_Lite_DB::tableExists($tableName)) {
                    $issues[$tableName] = [
                            'create' => $create,
                    ];
                } else {
                    foreach ($columns as $column => $desc) {
                        if (false === ACPT_Lite_DB::checkIfColumnExistsInTable($tableName, $column)) {
                            $desc['reason'] = "add_column";
                            $issues[$tableName]['columns'][$column] = $desc;
                        } elseif (false === ACPT_Lite_DB::checkColumnType($tableName, $column, $desc['type'])) {
                            $desc['reason'] = "change_column_type";
                            $issues[$tableName]['columns'][$column] = $desc;
                        }
                    }
                }
            }
        }

        // check native post types
        $postTypes = [
            'page',
            'post',
            'attachment'
        ];

        foreach ($postTypes as $postType) {
            $postTypeModel = CustomPostTypeRepository::get(['postType' => $postType]);

            if (!isset($postTypeModel[0])) {
                $issues['sync'] = true;
            }
        }

        // check native taxonomies
        $taxonomies = [
            'category',
            'post_tag',
        ];

        foreach ($taxonomies as $taxonomy) {
            $taxonomyModel = TaxonomyRepository::get(['taxonomy' => $taxonomy]);

            if (!isset($taxonomyModel[0])) {
                $issues['sync'] = true;
            }
        }

        return $issues;
    }

    private static function tableShouldBeIncludedInHealthCheck(string $tableName): bool
    {
        if (!Features::deleteUnusedTables()) {
            return true;
        }

        switch ($tableName) {
            case ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_FIELD):
            case ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_BOX):
            case ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_GROUP):
            case ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_GROUP_BELONG):
            case ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_OPTION):
                return Features::hasMeta();

            case ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE):
                return Features::hasCpt();

            case ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_TAXONOMY):
            case ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_TAXONOMY_PIVOT):
                return Features::hasTax();

            case ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_WOOCOMMERCE_PRODUCT_DATA):
            case ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_WOOCOMMERCE_PRODUCT_DATA_FIELD):
            case ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_WOOCOMMERCE_PRODUCT_DATA_OPTION):
                return ACPT_Lite_WooCommerce::active();
        }

        return true;
    }

    /**
     * @param array<string, mixed> $issues
     * @return bool
     */
    public static function repair(array $issues): bool
    {
        if (empty($issues)) {
            return true;
        }

        try {
            foreach ($issues as $table => $issue) {
                if (isset($issue['create'])) {
                    self::repairTable($table, $issue['create']);
                } elseif (isset($issue['columns'])) {
                    self::repairColumns($table, $issue['columns']);
                }
            }

            if (isset($issues['sync']) && $issues['sync'] === true) {
                ACPT_Lite_DB::sync();
                unset($issues['sync']);
            }

            return true;
        } catch (\Exception $exception) {
            do_action("acpt/error", $exception);

            return false;
        }
    }

    /**
     * @param string $table
     * @param string $create
     * @throws \Exception
     */
    private static function repairTable(string $table, string $create): void
    {
        global $wpdb;

        if (!$wpdb->query($create)) {
            throw new \Exception("Repairing table ".$table." failed");
        }
    }

    /**
     * @param string               $table
     * @param array<string, mixed> $columns
     * @throws \Exception
     */
    private static function repairColumns(string $table, array $columns): void
    {
        if (empty($columns)) {
            return;
        }

        global $wpdb;

        foreach ($columns as $column => $specs) {
            $query = self::alterTableQuery($table, $column, $specs);

            if (!$wpdb->query($query)) {
                throw new \Exception("Repairing column ".$column." in table ".$table." failed");
            }
        }
    }

    /**
     * @param string               $table
     * @param string               $column
     * @param array<string, mixed> $specs
     * @return string
     */
    private static function alterTableQuery(string $table, string $column, array $specs): string
    {
        $type = $specs['type'] ?? null;
        ;
        $unique = $specs['unique'] ?? null;
        ;
        $length = $specs['length'] ?? null;
        ;
        $nullable = $specs['nullable'] ?? null;
        ;
        $default = $specs['default'] ?? null;
        ;
        $reason = $specs['reason'] ?? null;
        ;
        $unsigned = $specs['unsigned'] ?? null;
        $autoIncrement = $specs['auto_increment'] ?? null;
        $primaryKey = $specs['primary_key'] ?? null;

        switch ($reason) {
            default:
            case "add_column":
                $query = "ALTER TABLE `".$table."` ADD COLUMN `".$column."` " . $type;

                if ($length) {
                    $query .= "(".$length.") ";
                }

                break;

            case "change_column_type":
                $query = "ALTER TABLE `".$table."` CHANGE COLUMN `".$column."` `".$column."` " . $type;
                break;
        }

        if ($unsigned) {
            $query .= " UNSIGNED";
        }

        if ($autoIncrement) {
            $query .= " AUTO_INCREMENT";
        }

        if ($primaryKey) {
            $query .= " PRIMARY KEY";
        }

        if ($unique) {
            $query .= "UNIQUE ";
        }

        if ($nullable === false) {
            $query .= " NOT NULL";
        }

        if (!empty($default)) {
            $query .= " DEFAULT " . $default;
        }

        return $query;
    }
}
