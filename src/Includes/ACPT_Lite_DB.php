<?php

namespace ACPT_Lite\Includes;

use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Helper\Uuid;
use ACPT_Lite\Core\Models\CustomPostType\CustomPostTypeModel;
use ACPT_Lite\Core\Models\Settings\SettingsModel;
use ACPT_Lite\Core\Models\Taxonomy\TaxonomyModel;
use ACPT_Lite\Core\Repository\CustomPostTypeRepository;
use ACPT_Lite\Core\Repository\MetaRepository;
use ACPT_Lite\Core\Repository\TaxonomyRepository;
use ACPT_Lite\Core\Repository\WooCommerceProductDataRepository;
use ACPT_Lite\Utils\Data\Normalizer;
use ACPT_Lite\Utils\PHP\Arrays;
use ACPT_Lite\Utils\PHP\CallingClass;
use ACPT_Lite\Vendor\Phpfastcache\Core\Pool\ExtendedCacheItemPoolInterface;

/**
 * This class handles DB interactions.
 *
 * @since      1.0.0
 * @package    acpt-lite
 * @subpackage acpt-lite/includes
 * @author     Mauro Cassani <maurocassani1978@gmail.com>
 */
class ACPT_Lite_DB
{
    // Custom post type
    public const TABLE_CUSTOM_POST_TYPE = 'acpt_lite_custom_post_type';
    public const TABLE_CUSTOM_POST_TYPE_META_BOX = 'acpt_lite_custom_post_type_meta_box'; // not is use
    public const TABLE_CUSTOM_POST_TYPE_FIELD = 'acpt_lite_custom_post_type_field'; // not is use
    public const TABLE_CUSTOM_POST_TYPE_ADVANCED_OPTION = 'acpt_lite_custom_post_type_advanced_option'; // not is use
    public const TABLE_CUSTOM_POST_TYPE_OPTION = 'acpt_lite_custom_post_type_option'; // not is use
    public const TABLE_CUSTOM_POST_TYPE_VISIBILITY = 'acpt_lite_custom_post_type_visibility'; // not is use
    public const TABLE_CUSTOM_POST_TYPE_RELATION = 'acpt_lite_custom_post_type_relation'; // not is use
    public const TABLE_CUSTOM_POST_TYPE_BLOCK = 'acpt_lite_custom_post_type_block';
    public const TABLE_CUSTOM_POST_TEMPLATE = 'acpt_lite_custom_post_template'; // not is use

    // Taxonomy
    public const TABLE_TAXONOMY = 'acpt_lite_taxonomy';
    public const TABLE_TAXONOMY_META_BOX = 'acpt_lite_taxonomy_meta_box'; // not is use
    public const TABLE_TAXONOMY_PIVOT = 'acpt_lite_taxonomy_pivot';

    public const TABLE_SETTINGS = 'acpt_lite_settings';

    // WooCommerce
    public const TABLE_WOOCOMMERCE_PRODUCT_DATA = 'acpt_lite_woocommerce_product_data';
    public const TABLE_WOOCOMMERCE_PRODUCT_DATA_FIELD = 'acpt_lite_woocommerce_product_data_field';
    public const TABLE_WOOCOMMERCE_PRODUCT_DATA_OPTION = 'acpt_lite_woocommerce_product_data_option';

    // not in use
    public const TABLE_USER_META_BOX     = 'acpt_lite_user_meta_box';
    public const TABLE_USER_META_FIELD        = 'acpt_lite_user_field';
    public const TABLE_USER_META_FIELD_OPTION = 'acpt_lite_user_field_option';

    public const TABLE_BELONG = 'acpt_lite_belong';

    // Meta
    public const TABLE_META_GROUP_BELONG = 'acpt_lite_group_belong';
    public const TABLE_META_GROUP = 'acpt_lite_meta_group';
    public const TABLE_META_BOX = 'acpt_lite_meta_box';
    public const TABLE_META_FIELD = 'acpt_lite_meta_field';
    public const TABLE_META_OPTION = 'acpt_lite_meta_option';

    /**
     * @var ExtendedCacheItemPoolInterface|null
     */
    private static ?ExtendedCacheItemPoolInterface $cache = null;

    private function __construct()
    {
    }

    public static function injectCache(ExtendedCacheItemPoolInterface $cache): void
    {
        self::$cache = $cache;
    }

    /**
     * @return array<string, string>
     */
    public static function getCharsetCollationArray(): array
    {
        if (self::isLegacyDB()) {
            return [
                'charset' => 'utf8',
                'collate' => 'utf8_unicode_ci',
            ];
        }

        global $wpdb;

        return [
            'charset' => $wpdb->charset,
            'collate' => $wpdb->collate,
        ];
    }

    /**
     * Return the correct charset collation
     *
     * @return string
     */
    public static function getCharsetCollation()
    {
        // old DB doesn't support modern collations for keys
        if (self::isLegacyDB()) {
            return "DEFAULT CHARSET utf8 COLLATE utf8_unicode_ci";
        }

        global $wpdb;

        $charset_collate = "";
        $collation = $wpdb->get_row("SHOW FULL COLUMNS FROM {$wpdb->posts} WHERE field = 'post_content'");

        if (isset($collation->Collation)) {
            $charset = explode('_', $collation->Collation);

            if (Arrays::count($charset) > 1) {
                $charset = $charset[0];
                $charset_collate = "DEFAULT CHARACTER SET {$charset} COLLATE {$collation->Collation}";
            }
        }

        if (empty($charset_collate)) {
            $charset_collate = $wpdb->get_charset_collate();
        }

        return $charset_collate;
    }

    /**
     * =============================================================
     * SCHEMA
     * =============================================================
     */

    /**
     * check if schema exists
     *
     * @since    1.0.1
     * @return bool
     */
    public static function checkIfSchemaExists()
    {
        try {
            $tables = ACPT_Lite_Schema::get();

            foreach (array_keys($tables) as $table) {
                if (!ACPT_Lite_DB::tableExists($table)) {
                    return false;
                }
            }

            return true;
        } catch (\Exception $exception) {
            return false;
        }
    }

    /**
     * @return bool
     */
    public static function checkIfNativePostsExists()
    {
        $nativePosts = [
            'post',
            'page',
            'attachment',
        ];

        foreach ($nativePosts as $nativePost) {
            $sql = "SELECT id FROM `".self::prefixedTableName(self::TABLE_CUSTOM_POST_TYPE)."` where post_name = %s;";
            $check = ACPT_Lite_DB::getResults($sql, [$nativePost]);

            if (Arrays::count($check) !== 1) {
                return false;
            }
        }

        return true;
    }

    /**
     * @param string      $newVersion
     * @param string|null $oldVersion
     * @throws \Exception
     */
    public static function createSchema(string $newVersion, ?string $oldVersion = null): void
    {
        $createSchema = ACPT_Lite_Schema_Manager::up($newVersion, $oldVersion);

        if (!$createSchema) {
            // in case of failure, try to repair
            $issues = ACPT_Lite_DB_Tools::healthCheck();

            if (!empty($issues)) {
                ACPT_Lite_DB_Tools::repair($issues);
            }

            $issuesAfterRepair = ACPT_Lite_DB_Tools::healthCheck();

            if (!empty($issuesAfterRepair)) {
                echo esc_html("Error during creation of schema");
                die();
            }
        }
    }

    public static function destroySchema(): void
    {
        $destroySchema = ACPT_Lite_Schema_Manager::down();

        if (!$destroySchema) {
            echo esc_html((string)$destroySchema);
            die();
        }
    }

    /**
     * @throws \Exception
     */
    public static function sync(): void
    {
        if (ACPT_Lite_DB::tableExists(ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE))) {
            self::createNativePostTypes();
        }

        if (ACPT_Lite_DB::tableExists(ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_TAXONOMY))) {
            self::createNativeTaxonomies();
        }
    }

    /**
     * @throws \Exception
     */
    private static function createNativePostTypes(): void
    {
        $pageSettings = [];
        $postSettings = [];

        // WPGraphQL
        if (is_plugin_active('wp-graphql/wp-graphql.php')) {
            $pageSettings['show_in_graphql'] = true;
            $pageSettings['graphql_single_name'] = 'page';
            $pageSettings['graphql_plural_name'] = 'pages';

            $postSettings['show_in_graphql'] = true;
            $postSettings['graphql_single_name'] = 'post';
            $postSettings['graphql_plural_name'] = 'posts';
        }

        $postModel = CustomPostTypeModel::hydrateFromArray([
                'id' => Uuid::v4(),
                'name' => 'post',
                'singular' => 'Post',
                'plural' => 'Posts',
                'icon' => 'admin-post',
                'native' => true,
                'supports' => [],
                'labels' => [],
                'settings' => $postSettings,
        ]);

        $pageModel = CustomPostTypeModel::hydrateFromArray([
                'id' => Uuid::v4(),
                'name' => 'page',
                'singular' => 'Page',
                'plural' => 'Pages',
                'icon' => 'admin-page',
                'native' => true,
                'supports' => [],
                'labels' => [],
                'settings' => $pageSettings,
        ]);

        $attachmentModel =  CustomPostTypeModel::hydrateFromArray([
            'id' => Uuid::v4(),
            'name' => 'attachment',
            'singular' => 'Attachment',
            'plural' => 'Attachments',
            'icon' => 'admin-media',
            'native' => true,
            'supports' => [],
            'labels' => [],
            'settings' => [],
        ]);

        CustomPostTypeRepository::save($postModel);
        CustomPostTypeRepository::save($pageModel);
        CustomPostTypeRepository::save($attachmentModel);
    }

    /**
     * @throws \Exception
     */
    private static function createNativeTaxonomies(): void
    {
        $idCat = Uuid::v4();
        $categoryModel =  TaxonomyModel::hydrateFromArray([
            'id' => $idCat,
            'slug' => 'category',
            'singular' => 'Category',
            'plural' => 'Categories',
            'native' => true,
            'labels' => [],
            'settings' => [
                'hierarchical' => true
            ],
        ]);

        $idTag = Uuid::v4();
        $tagModel =  TaxonomyModel::hydrateFromArray([
            'id' => $idTag,
            'slug' => 'post_tag',
            'singular' => 'Tag',
            'plural' => 'Tags',
            'native' => true,
            'labels' => [],
            'settings' => [
                'hierarchical' => false
            ],
        ]);

        TaxonomyRepository::save($categoryModel);
        TaxonomyRepository::save($tagModel);

        $post = CustomPostTypeRepository::get([
            'postType' => 'post'
        ])[0];

        TaxonomyRepository::assocToPostType($post->getId(), $idCat);
        TaxonomyRepository::assocToPostType($post->getId(), $idTag);
    }

    /**
     * @param string $feature
     * @param string $action
     * @throws \Exception
     */
    public static function removeOrCreateFeatureTables(string $feature, string $action = "create"): void
    {
        $allowedActions = [
            "create",
            "delete",
        ];

        if (!in_array($action, $allowedActions)) {
            return;
        }

        // create tables
        if ($action === "create") {
            $schema = ACPT_Lite_Schema::get();

            switch ($feature) {
                case SettingsModel::ENABLE_META:
                    ACPT_Lite_DB::executeQueryOrThrowException($schema[ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_FIELD)]['create']);
                    ACPT_Lite_DB::executeQueryOrThrowException($schema[ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_BOX)]['create']);
                    ACPT_Lite_DB::executeQueryOrThrowException($schema[ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_GROUP)]['create']);
                    ACPT_Lite_DB::executeQueryOrThrowException($schema[ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_GROUP_BELONG)]['create']);
                    ACPT_Lite_DB::executeQueryOrThrowException($schema[ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_OPTION)]['create']);
                    ACPT_Lite_DB::invalidateCacheTag(MetaRepository::class);
                    break;

                case SettingsModel::ENABLE_CPT:
                    ACPT_Lite_DB::executeQueryOrThrowException($schema[ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE)]['create']);
                    ACPT_Lite_DB::invalidateCacheTag(CustomPostTypeRepository::class);
                    break;

                case SettingsModel::ENABLE_TAX:
                    ACPT_Lite_DB::executeQueryOrThrowException($schema[ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_TAXONOMY)]['create']);
                    ACPT_Lite_DB::executeQueryOrThrowException($schema[ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_TAXONOMY_PIVOT)]['create']);
                    ACPT_Lite_DB::invalidateCacheTag(TaxonomyRepository::class);
                    break;

                case "woocommerce":
                    ACPT_Lite_DB::executeQueryOrThrowException($schema[ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_WOOCOMMERCE_PRODUCT_DATA)]['create']);
                    ACPT_Lite_DB::executeQueryOrThrowException($schema[ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_WOOCOMMERCE_PRODUCT_DATA_FIELD)]['create']);
                    ACPT_Lite_DB::executeQueryOrThrowException($schema[ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_WOOCOMMERCE_PRODUCT_DATA_OPTION)]['create']);
                    ACPT_Lite_DB::invalidateCacheTag(WooCommerceProductDataRepository::class);
                    break;
            }
        }

        // delete tables
        if ($action === "delete") {
            switch ($feature) {
                case SettingsModel::ENABLE_META:
                    self::dropTable(ACPT_Lite_DB::TABLE_META_FIELD);
                    self::dropTable(ACPT_Lite_DB::TABLE_META_BOX);
                    self::dropTable(ACPT_Lite_DB::TABLE_META_GROUP);
                    self::dropTable(ACPT_Lite_DB::TABLE_META_GROUP_BELONG);
                    self::dropTable(ACPT_Lite_DB::TABLE_META_OPTION);
                    ACPT_Lite_DB::invalidateCacheTag(MetaRepository::class);
                    break;

                case SettingsModel::ENABLE_CPT:
                    self::dropTable(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE);
                    ACPT_Lite_DB::invalidateCacheTag(CustomPostTypeRepository::class);
                    break;

                case SettingsModel::ENABLE_TAX:
                    self::dropTable(ACPT_Lite_DB::TABLE_TAXONOMY);
                    self::dropTable(ACPT_Lite_DB::TABLE_TAXONOMY_PIVOT);
                    ACPT_Lite_DB::invalidateCacheTag(TaxonomyRepository::class);
                    break;

                case "woocommerce":
                    self::dropTable(ACPT_Lite_DB::TABLE_WOOCOMMERCE_PRODUCT_DATA);
                    self::dropTable(ACPT_Lite_DB::TABLE_WOOCOMMERCE_PRODUCT_DATA_FIELD);
                    self::dropTable(ACPT_Lite_DB::TABLE_WOOCOMMERCE_PRODUCT_DATA_OPTION);
                    ACPT_Lite_DB::invalidateCacheTag(WooCommerceProductDataRepository::class);
                    break;
            }
        }
    }

    /**
     * =============================================================
     * GENERAL PURPOSE METHODS
     * =============================================================
     */

    /**
     * @throws \Exception
     */
    public static function startTransaction(): void
    {
        self::executeQueryOrThrowException('START TRANSACTION');
    }

    /**
     * @throws \Exception
     */
    public static function rollbackTransaction(): void
    {
        self::executeQueryOrThrowException('ROLLBACK');
    }

    /**
     * @throws \Exception
     */
    public static function commitTransaction(): void
    {
        self::executeQueryOrThrowException('COMMIT');
    }

    /**
     * @param string            $sql
     * @param array<int, mixed> $args
     * @throws \Exception
     */
    public static function executeQueryOrThrowException(string $sql, array $args = []): void
    {
        global $wpdb;

        if (false === $wpdb->query(self::prepare($sql, $args))) {
            // the MySQL error number lets callers explain the error (SchemaErrorExplainer)
            $errorCode = ($wpdb->dbh instanceof \mysqli) ? (int)mysqli_errno($wpdb->dbh) : 0;

            throw new \Exception($wpdb->last_error, $errorCode);
        }
    }

    /**
     * Retrieves the ID of the last row inserted into the database.
     *
     * @return int|null The ID of the last inserted row, or null if no insert has occurred.
     */
    public static function getTheLastInsertedId()
    {
        global $wpdb;
        return $wpdb->insert_id;
    }

    /**
     * @param string            $sql
     * @param array<int, mixed> $args
     * @param int               $cacheTtl
     * @param string|null       $cacheTag
     * @param bool              $skipCache Bypass this cache layer entirely (read straight from $wpdb, no read or write against it). Callers that need guaranteed-fresh data (e.g. registering admin menu pages right after a create/delete) must set this — invalidateCacheTag() alone isn't enough to guarantee it, see that method's docblock.
     * @return mixed
     * @throws \Exception
     */
    public static function getResults(string $sql, array $args = [], int $cacheTtl = 7200, ?string $cacheTag = null, bool $skipCache = false)
    {
        global $wpdb;
        $preparedQuery = self::prepare($sql, $args);

        if (self::$cache && !$skipCache) {
            try {
                $cacheKey = md5(Strings::removeAllExtraSpaces($preparedQuery));

                // Option 1: suppress file_get_contents warnings from phpfastcache
                ACPT_Lite_Cache::suppressWarnings();

                try {
                    $cachedElement = self::$cache->getItem($cacheKey);
                } finally {
                    ACPT_Lite_Cache::restoreWarnings();
                }

                // Option 2: treat missing file as a cache miss, clean up stale entry
                if (!$cachedElement->isHit()) {
                    try {
                        self::$cache->deleteItem($cacheKey);
                    } catch (\Exception $ignored) {
                    }

                    $tag = $cacheTag ? md5($cacheTag) : md5(CallingClass::get());
                    $data = $wpdb->get_results($preparedQuery);
                    $cachedElement->addTag($tag)->set($data)->expiresAfter($cacheTtl);
                    self::$cache->save($cachedElement);
                }

                return $cachedElement->get();
            } catch (\InvalidArgumentException $exception) {
                do_action("acpt/error", $exception);

                return $wpdb->get_results($preparedQuery);
            } catch (\Exception $exception) {
                // Catch any unexpected phpfastcache filesystem errors,
                // fall back to a direct DB query without polluting error logs
                do_action("acpt/error", $exception);

                return $wpdb->get_results($preparedQuery);
            }
        }

        return $wpdb->get_results($preparedQuery);
    }

    public static function invalidateCacheKey(string $key): void
    {
        if (self::$cache) {
            try {
                $cacheKey = md5(Strings::removeAllExtraSpaces($key));

                ACPT_Lite_Cache::suppressWarnings();
                try {
                    self::$cache->deleteItem($cacheKey);
                } finally {
                    ACPT_Lite_Cache::restoreWarnings();
                }
            } catch (\Exception $exception) {
                // A phpfastcache filesystem hiccup here must never bubble up:
                // this runs right after a commit()'d write in callers like
                // TableRepository::save()/delete(), whose surrounding
                // try/catch would otherwise roll back an already-committed
                // transaction and re-throw, turning a successful DB write
                // into an apparent failure for the caller.
                do_action("acpt/error", $exception);
            }
        }
    }

    /**
     * Best-effort: deleteItemsByTag() only removes the items it can currently
     * enumerate through the tag's own index item. If that index item can't be
     * read/written (filesystem hiccup, concurrent writers under real traffic),
     * this silently leaves the stale, tagged item(s) in place for up to their
     * own TTL — callers that need a guaranteed-fresh read right after a write
     * (e.g. registering admin menu pages for a just-created/deleted row) must
     * pass $skipCache=true to getResults() instead of relying on this alone.
     */
    public static function invalidateCacheTag(string $tag): void
    {
        if (self::$cache) {
            try {
                ACPT_Lite_Cache::suppressWarnings();
                try {
                    self::$cache->deleteItemsByTag(md5($tag));
                } finally {
                    ACPT_Lite_Cache::restoreWarnings();
                }
            } catch (\Exception $exception) {
                // Same rationale as invalidateCacheKey() above: never let a
                // cache-layer error masquerade as the write itself failing.
                do_action("acpt/error", $exception);
            }
        }
    }

    /**
     * Clears the whole phpfastcache pool.
     *
     * Note: the `files` driver's clear() returns `false` when the cache
     * directory simply does not exist yet (nothing cached this deploy) --
     * that is not a failure, the desired end state (empty cache) is reached.
     * Callers cannot rely on the return value to mean "something went wrong".
     *
     * @param bool $throwOnError when true, a real cache-layer exception is
     *                           rethrown instead of swallowed. Default false so
     *                           post-write callers (TableRepository::save(), …)
     *                           never turn a committed write into an apparent
     *                           failure via their surrounding try/catch.
     * @return bool
     * @throws \Exception
     */
    public static function flushCache(bool $throwOnError = false)
    {
        if (self::$cache) {
            try {
                return self::$cache->clear();
            } catch (\Exception $e) {
                if ($throwOnError) {
                    throw $e;
                }

                do_action("acpt/error", $e);

                return false;
            }
        }

        return false;
    }

    /**
     * @param string            $query
     * @param array<int, mixed> $args
     * @return string
     */
    private static function prepare(string $query, array $args = []): string
    {
        global $wpdb;

        $preparedQuery = (!empty($args)) ? $wpdb->prepare($query, $args) : $query;

        return str_ireplace("'NULL'", "NULL", $preparedQuery);
    }

    /**
     * Get the table prefix
     *
     * @return string
     */
    public static function prefix(): string
    {
        global $wpdb;

        return $wpdb->prefix;
    }

    /**
     * Get the DB version
     *
     * @return string|null
     */
    public static function version()
    {
        global $wpdb;

        return $wpdb->db_version();
    }

    /**
     * @return bool
     */
    public static function isLegacyDB(): bool
    {
        return version_compare(self::version(), "5.7.0") === -1;
    }

    /**
     * @return int
     */
    public static function keyLength(): int
    {
        if (self::isLegacyDB()) {
            return 191;
        }

        return 248;
    }

    /**
     * Returns true when the current server is MariaDB.
     *
     * $wpdb->db_version() strips "MariaDB" from the version banner; SELECT VERSION()
     * preserves the full string (e.g. "10.5.25-MariaDB-cll-lve"), so we use that.
     *
     * @return bool
     */
    public static function isMariaDB(): bool
    {
        static $result = null;
        if ($result === null) {
            global $wpdb;
            $version = $wpdb->get_var('SELECT VERSION()');
            $result = $version !== null && stripos($version, 'mariadb') !== false;
        }
        return $result;
    }

    /**
     * Returns true if INVISIBLE column syntax is supported by the current DB.
     *
     * MariaDB: supported since 10.3.2
     * MySQL:   supported since 8.0.23
     *
     * @return bool
     */
    public static function supportsInvisibleColumns(): bool
    {
        if (self::isMariaDB()) {
            return version_compare(self::version(), '10.3.2') >= 0;
        }
        return version_compare(self::version(), '8.0.23') >= 0;
    }

    /**
     * Returns true if the VISIBLE column keyword is supported by the current DB.
     *
     * VISIBLE is MySQL 8.0.23+ only. MariaDB does not recognise it as a column
     * option keyword — column visibility is implied by the absence of INVISIBLE.
     *
     * @return bool
     */
    public static function supportsVisibleKeyword(): bool
    {
        if (self::isMariaDB()) {
            return false;
        }
        return version_compare(self::version(), '8.0.23') >= 0;
    }

    /**
     * @param string $table
     * @return string
     */
    public static function prefixedTableName(string $table): string
    {
        if (self::prefix() == '') {
            return $table;
        }

        // check if the prefix is already present
        if (Strings::startsWith($table, self::prefix())) {
            return $table;
        }

        return self::prefix().$table;
    }

    /**
     * @param string $table
     * @return bool
     */
    public static function tableIsEmpty(string $table): bool
    {
        $table = ACPT_Lite_DB::prefixedTableName($table);

        if (!self::tableExists($table)) {
            return false;
        }

        global $wpdb;

        $results =  $wpdb->get_results('SELECT count(id) as c from '.  $table);

        if (empty($results)) {
            return false;
        }

        return $results[0]->c == 0;
    }

    /**
     * @param string $table
     * @return bool
     */
    public static function tableExists(string $table): bool
    {
        global $wpdb;

        $table = ACPT_Lite_DB::prefixedTableName($table);
        $query = $wpdb->prepare('SHOW TABLES LIKE %s', $table);

        if (! $wpdb->get_var($query) == $table) {
            return false;
        }

        return true;
    }

    /**
     * @param string $table
     * @param string $column
     * @param string $type
     * @return bool
     */
    public static function checkColumnType(string $table, string $column, string $type): bool
    {
        if (!ACPT_Lite_DB::tableExists($table)) {
            return false;
        }

        global $wpdb;

        $rows = $wpdb->get_results("SELECT COLUMN_NAME, DATA_TYPE
                    FROM INFORMATION_SCHEMA.COLUMNS
                    WHERE TABLE_NAME = '".$table."' AND COLUMN_NAME = '".$column."' ");

        if (empty($rows)) {
            return false;
        }

        return self::columnTypeMatches($type, $rows[0]->DATA_TYPE, self::isMariaDB());
    }

    /**
     * MariaDB aliases JSON to LONGTEXT plus an auto-added CHECK(json_valid(...)) constraint,
     * so INFORMATION_SCHEMA.COLUMNS.DATA_TYPE reports 'longtext', never 'json', for a column
     * the schema correctly declares as JSON. Without this, every JSON column (e.g.
     * acpt_table_group.location, acpt_table_column.ui/validation_rules/visibility_rules/
     * permission_rules) is endlessly flagged by the health check on MariaDB, and "repair" is
     * a permanent no-op (ticket #1330).
     *
     * @param string $expectedType Type declared in ACPT_Lite_Schema (e.g. 'JSON').
     * @param string $actualDataType INFORMATION_SCHEMA.COLUMNS.DATA_TYPE for the live column.
     * @param bool $isMariaDb
     * @return bool
     */
    public static function columnTypeMatches(string $expectedType, string $actualDataType, bool $isMariaDb): bool
    {
        $expectedType = strtoupper($expectedType);
        $actualDataType = strtoupper($actualDataType);

        if ($actualDataType === $expectedType) {
            return true;
        }

        return $isMariaDb && $expectedType === 'JSON' && $actualDataType === 'LONGTEXT';
    }

    /**
     * @param string $table
     * @param string $column
     * @return bool
     */
    public static function checkIfColumnExistsInTable(string $table, string $column): bool
    {
        if (!ACPT_Lite_DB::tableExists($table)) {
            return false;
        }

        global $wpdb;
        $rows = $wpdb->get_results("SHOW COLUMNS FROM `".$table."`  ");

        foreach ($rows as $row) {
            if ($column === $row->Field) {
                return true;
            }
        }

        return false;
    }

    /**
     * Retrieves the CREATE TABLE statement of a given table, excluding the AUTO_INCREMENT clause.
     *
     * @param string $table The name of the table to retrieve the CREATE TABLE statement for.
     * @return string|null The CREATE TABLE statement of the specified table without the AUTO_INCREMENT clause, or null if the table does not exist or the statement cannot be retrieved.
     */
    public static function showCreate(string $table): ?string
    {
        if (!ACPT_Lite_DB::tableExists($table)) {
            return null;
        }

        global $wpdb;

        $rows = $wpdb->get_results("SHOW CREATE TABLE `".ACPT_Lite_DB::prefixedTableName($table)."`;");

        if (empty($rows)) {
            return null;
        }

        $schema = $rows[0];
        $schema = Normalizer::objectToArray($schema);

        if (!isset($schema['Create Table'])) {
            return null;
        }

        // strip AUTO_INCREMENT from the CREATE TABLE statement
        $schema['Create Table'] = preg_replace('/AUTO_INCREMENT=\d+/', '', $schema['Create Table']);

        return $schema['Create Table'];
    }

    /**
     * @param string $table
     * @throws \Exception
     */
    public static function dropTable(string $table): void
    {
        if (!ACPT_Lite_DB::tableExists($table)) {
            return;
        }

        ACPT_Lite_DB::executeQueryOrThrowException("DROP TABLE IF EXISTS `".ACPT_Lite_DB::prefixedTableName($table)."`;");
    }

    /**
     * Validates the syntax of a MySQL query by analyzing it with EXPLAIN statements.
     *
     * This method processes a raw SQL query, removes comments, handles string literals,
     * and constructs modified EXPLAIN statements to verify the query's syntax. It uses
     * the WordPress database global object for execution.
     *
     * @param string $query The raw SQL query string to be validated.
     *
     * @return string|false Returns an error message as a string if the SQL query has syntax errors,
     *                      or false if the query syntax is valid.
     */
    public static function MySqlSyntaxError(string $query)
    {
        if (trim($query)) {
            // Replace characters within string literals that may *** up the process
            $query = Strings::replaceCharacterWithinQuotes($query, '#', '%') ;
            $query = Strings::replaceCharacterWithinQuotes($query, ';', ':') ;
            // Prepare the query to make a valid EXPLAIN query
            // Remove comments # comment ; or  # comment newline
            // Remove SET @var=val;
            // Remove empty statements
            // Remove last ;
            // Put EXPLAIN in front of every MySQL statement (separated by ;)
            $query = "EXPLAIN " .
                preg_replace(
                    array("/#[^\n\r;]*([\n\r;]|$)/",
                    "/[Ss][Ee][Tt]\s+\@[A-Za-z0-9_]+\s*:?=\s*[^;]+(;|$)/",
                    "/;\s*;/",
                    "/;\s*$/",
                    "/;/"),
                    array("","", ";","", "; EXPLAIN "),
                    $query
                ) ;

            foreach (explode(';', $query) as $q) {
                global $wpdb;

                if (stripos(trim($q), 'EXPLAIN CREATE TABLE') === 0) {
                    $q = str_ireplace('EXPLAIN CREATE TABLE', 'CREATE TABLE', $q);
                    // We don't want to actually create the table, so we use a transaction and rollback.
                    // Suppress $wpdb error output so invalid SQL (bad charset, syntax errors, etc.)
                    // doesn't print HTML to stdout during tests or API responses.
                    $suppress = $wpdb->suppress_errors(true);
                    $wpdb->query('START TRANSACTION');
                    $result = $wpdb->query($q);
                    $err = $wpdb->last_error;
                    $wpdb->query('ROLLBACK');
                    $wpdb->suppress_errors($suppress);
                } else {
                    $suppress = $wpdb->suppress_errors(true);
                    $result = $wpdb->query($q);
                    $err = !$result ? $wpdb->last_error : false;
                    $wpdb->suppress_errors($suppress);
                }

                if ($err) {
                    return $err ;
                }
            }

            return false ;
        }

        return false ;
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public static function getEngineList(): array
    {
        global $wpdb;

        $engines = $wpdb->get_results("SHOW ENGINES");

        $available = array_filter($engines, function ($e) {
            return in_array($e->Support, [ 'YES', 'DEFAULT' ]);
        });

        $return = [];

        foreach ($available as $engine) {
            $return[] = [
                'name' => $engine->Engine,
                'default' => $engine->Support === 'DEFAULT',
            ];
        }

        return $return;
    }
}
