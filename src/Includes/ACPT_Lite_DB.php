<?php

namespace ACPT_Lite\Includes;

use ACPT_Lite\Core\Helper\Uuid;
use ACPT_Lite\Core\Models\CustomPostTypeModel;
use ACPT_Lite\Core\Models\TaxonomyModel;
use ACPT_Lite\Core\Repository\CustomPostTypeRepository;
use ACPT_Lite\Core\Repository\TaxonomyRepository;

/**
 * This class handles DB interactions.
 *
 * @since      1.0.0
 * @package    advanced-custom-post-type-lite
 * @subpackage advanced-custom-post-type/includes
 * @author     Mauro Cassani <maurocassani1978@gmail.com>
 */
class ACPT_Lite_DB
{
    /**
     * Table names
     */
    const TABLE_CUSTOM_POST_TYPE = 'acpt_custom_post_type';
    const TABLE_CUSTOM_POST_TYPE_META_BOX = 'acpt_custom_post_type_meta_box';
    const TABLE_CUSTOM_POST_TYPE_FIELD = 'acpt_custom_post_type_field';
    const TABLE_CUSTOM_POST_TYPE_OPTION = 'acpt_custom_post_type_option';
    const TABLE_CUSTOM_POST_TYPE_RELATION = 'acpt_custom_post_type_relation';
    const TABLE_CUSTOM_POST_TYPE_IMPORT = 'acpt_custom_post_type_import';
    const TABLE_CUSTOM_POST_TEMPLATE = 'acpt_custom_post_template';
    const TABLE_TAXONOMY = 'acpt_taxonomy';
    const TABLE_TAXONOMY_PIVOT = 'acpt_taxonomy_pivot';
    const TABLE_SETTINGS = 'acpt_settings';
    const TABLE_WOOCOMMERCE_PRODUCT_DATA = 'acpt_woocommerce_product_data';
    const TABLE_WOOCOMMERCE_PRODUCT_DATA_FIELD = 'acpt_woocommerce_product_data_field';
    const TABLE_WOOCOMMERCE_PRODUCT_DATA_OPTION = 'acpt_woocommerce_product_data_option';
    const TABLE_USER_META_BOX     = 'acpt_user_meta_box';
    const TABLE_USER_META_FIELD        = 'acpt_user_field';
    const TABLE_USER_META_FIELD_OPTION = 'acpt_user_field_option';

    /**
     * @var self
     */
    private static $instance;

    /**
     * @var \mysqli
     */
    private $dbConn;

    /**
     *
     * @return ACPT_Lite_DB
     */
    private static function getInstance()
    {
        if (self::$instance == null){
            $className = __CLASS__;
            self::$instance = new $className;
        }

        return self::$instance;
    }

    /**
     *
     * @return ACPT_Lite_DB
     */
    private static function initConnection()
    {
        $db = self::getInstance();
        $db->dbConn = new \mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
        $db->dbConn->set_charset(DB_CHARSET);

        return $db;
    }

    /**
     * @return \mysqli|null
     */
    public static function getDbConn() {
        try {
            $db = self::initConnection();

            return $db->dbConn;
        } catch (\Exception $ex) {
            echo "I was unable to open a connection to the database. " . $ex->getMessage();
            return null;
        }
    }

    /**
     * check if schema exists
     *
     * @since    1.0.1
     * @return bool
     */
    public static function checkIfSchemaExists()
    {
        try {
            $sql = "SELECT id FROM `".self::prefixedTableName(self::TABLE_CUSTOM_POST_TYPE)."` LIMIT 1;";
            self::executeQueryOrThrowException($sql);

            return true;
        } catch (\Exception $exception){
            return false;
        }

        return false;
    }

    /**
     * create schema
     *
     * @since    1.0.0
     */
    public static function createSchema()
    {
        $createSchema = ACPT_Lite_Schema_Manager::up();

        if(!$createSchema){
            echo esc_html($createSchema);
            die();
        }
    }

    /**
     * destroy schema
     *
     * @since    1.0.0
     */
    public static function destroySchema()
    {
        $destroySchema = ACPT_Lite_Schema_Manager::down();

        if(!$destroySchema){
            echo esc_html($destroySchema);
            die();
        }
    }

    /**
     * Sync data with already registered custom post types
     *
     * @throws \Exception
     * @since    1.0.0
     */
    public static function sync()
    {
        self::createCustomPostTypes();
        self::createNativePostTypes();
        self::createCustomTaxonomies();
        self::createNativeTaxonomies();
    }

    /**
     * Save post and page native CPT
     *
     * @throws \Exception
     */
    private static function createNativePostTypes()
    {
        $postModel =  CustomPostTypeModel::hydrateFromArray([
                'id' => Uuid::v4(),
                'name' => 'post',
                'singular' => 'Post',
                'plural' => 'Posts',
                'icon' => 'admin-post',
                'native' => true,
                'supports' => [],
                'labels' => [],
                'settings' => [],
        ]);

        $pageModel =  CustomPostTypeModel::hydrateFromArray([
                'id' => Uuid::v4(),
                'name' => 'page',
                'singular' => 'Page',
                'plural' => 'Pages',
                'icon' => 'admin-page',
                'native' => true,
                'supports' => [],
                'labels' => [],
                'settings' => [],
        ]);

        CustomPostTypeRepository::save($postModel);
        CustomPostTypeRepository::save($pageModel);
    }

    /**
     * Save CPT already registered
     *
     * @throws \Exception
     */
    private static function createCustomPostTypes()
    {
        $postTypes = get_post_types();

        foreach ($postTypes as $postType) {
            if(self::isACustomPostType($postType)){
                $postTypeObject = get_post_type_object($postType);
                $postTypeSupports = get_all_post_type_supports($postType);

                if($postTypeObject->show_ui === true and is_string($postTypeObject->menu_icon) ){
                    $postModel =  CustomPostTypeModel::hydrateFromArray([
                            'id' => Uuid::v4(),
                            'name' => $postTypeObject->name,
                            'singular' => $postTypeObject->label,
                            'plural' => $postTypeObject->label,
                            'icon' => str_replace('dashicons-','', $postTypeObject->menu_icon),
                            'native' => false,
                            'supports' => array_keys($postTypeSupports),
                            'labels' => json_decode(json_encode($postTypeObject->labels), true),
                            'settings' => [
                                    'public' => $postTypeObject->public,
                                    'publicly_queryable' => $postTypeObject->publicly_queryable,
                                    'show_ui' => $postTypeObject->show_ui,
                                    'show_in_menu' => $postTypeObject->show_in_menu,
                                    'show_in_nav_menus' => $postTypeObject->show_in_nav_menus,
                                    'show_in_admin_bar' => $postTypeObject->show_in_admin_bar,
                                    'show_in_rest' => $postTypeObject->show_in_rest,
                                    'rest_base' => $postTypeObject->rest_base,
                                    'menu_position' => $postTypeObject->menu_position,
                                    'capability_type' => $postTypeObject->capability_type,
                                    'has_archive' => $postTypeObject->has_archive,
                                    'rewrite' => $postTypeObject->rewrite,
                                    'custom_rewrite' => $postTypeObject->custom_rewrite,
                                    'query_var' => $postTypeObject->query_var,
                                    'custom_query_var' => $postTypeObject->custom_query_var,
                            ],
                    ]);

                    CustomPostTypeRepository::save($postModel);
                }
            }
        }
    }

    /**
     * Save native taxonomies
     *
     * @throws \Exception
     */
    private static function createNativeTaxonomies()
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
                'hierarchical' => true
            ],
        ]);

        TaxonomyRepository::save($categoryModel);
        TaxonomyRepository::save($tagModel);

        $post = CustomPostTypeRepository::get([
            'postType' => 'post'
        ], true)[0];

        if($post !== null and $idCat !== null and $idTag !== null){
            TaxonomyRepository::assocToPostType($post->getId(), $idCat);
            TaxonomyRepository::assocToPostType($post->getId(), $idTag);
        }

        return null;
    }

    /**
     * Save custom taxonomies
     *
     * @throws \Exception
     */
    private static function createCustomTaxonomies()
    {
        $args = [
                'public' => true,
                '_builtin' => false,
        ];
        $output = 'objects';
        $operator = 'and';
        $taxonomies = get_taxonomies($args, $output, $operator);

        foreach ($taxonomies as $taxonomy){

            $idTax = Uuid::v4();
            $taxModel =  TaxonomyModel::hydrateFromArray([
                    'id' => $idTax,
                    'slug' => $taxonomy->name,
                    'singular' => $taxonomy->labels->singular_name,
                    'plural' => $taxonomy->label,
                    'native' => false,
                    'labels' => (array)$taxonomy->labels,
                    'settings' => [
                            'description' => $taxonomy->description,
                            'public' => $taxonomy->public,
                            'publicly_queryable' => $taxonomy->publicly_queryable,
                            'hierarchical' => $taxonomy->hierarchical,
                            'show_ui' => $taxonomy->show_ui,
                            'show_in_menu' => $taxonomy->show_in_menu,
                            'show_in_nav_menus' => $taxonomy->show_in_nav_menus,
                            'show_tagcloud' => $taxonomy->show_tagcloud,
                            'show_in_quick_edit' => $taxonomy->show_in_quick_edit,
                            'show_admin_column' => $taxonomy->show_admin_column,
                            'meta_box_cb' => $taxonomy->meta_box_cb,
                            'cap' => (array)$taxonomy->cap,
                            'rewrite' => $taxonomy->rewrite,
                            'query_var' => $taxonomy->query_var,
                            'update_count_callback' => $taxonomy->update_count_callback,
                            'show_in_rest' => $taxonomy->show_in_rest,
                            'rest_base' => $taxonomy->rest_base,
                            'rest_namespace' => $taxonomy->rest_namespace,
                            'rest_controller_class' => $taxonomy->rest_controller_class,
                            'rest_controller' => $taxonomy->rest_controller,
                            'default_term' => $taxonomy->default_term,
                            'sort' => $taxonomy->sort,
                    ],
            ]);

            TaxonomyRepository::save($taxModel);

            foreach ($taxonomy->object_type as $postType){
                $postTypeModel = CustomPostTypeRepository::get([
                        'postType' => $postType
                ], true)[0];

                if($postTypeModel !== null){
                    TaxonomyRepository::assocToPostType($postTypeModel->getId(), $idTax);
                }
            }
        }
    }

    /**
     * @param $postType
     *
     * @return bool
     */
    private static function isACustomPostType($postType)
    {
        $notAllowed = [
            "post",
            "page",
            "attachment",
            "revision",
            "nav_menu_item",
            "custom_css",
            "customize_changeset",
            "oembed_cache",
            "user_request",
            "wp_block",
            "wp_template",
        ];

        // exclude WooCommerce CPT
        if ( class_exists( 'woocommerce' ) ) {
            $notAllowed[] = 'shop_order';
            $notAllowed[] = 'scheduled-action';
            $notAllowed[] = 'shop_coupon';
            $notAllowed[] = 'product_variation';
            $notAllowed[] = 'shop_order_refund';
        }

        if(in_array($postType, $notAllowed)){
            return false;
        }

        return true;
    }

    /**
     * =============================================================
     * GENERAL PURPOSE METHODS
     * =============================================================
     */

    /**
     * @throws \Exception
     */
    public static function startTransaction()
    {
        self::executeQueryOrThrowException('START TRANSACTION');
    }

    /**
     * @throws \Exception
     */
    public static function rollbackTransaction()
    {
        self::executeQueryOrThrowException('ROLLBACK');
    }

    /**
     * @throws \Exception
     */
    public static function commitTransaction()
    {
        self::executeQueryOrThrowException('COMMIT');
    }

    /**
     * @param string $sql
     *
     * @throws \Exception
     */
    public static function executeQueryOrThrowException($sql, array $args = [])
    {
        global $wpdb;

        if ( false === $wpdb->query(self::prepare($sql, $args))) {
            throw new \Exception($wpdb->last_error);
        }
    }

    /**
     * @param $sql
     *
     * @return mixed
     */
    public static function getResults($sql, array $args = [])
    {
        global $wpdb;

        return $wpdb->get_results(self::prepare($sql, $args));
    }

    /**
     * Get the prepared sql query
     *
     * For more info refer to:
     * https://developer.wordpress.org/reference/classes/wpdb/prepare/
     *
     * @param $query
     * @param $args
     *
     * @return string
     */
    private static function prepare($query, array $args = [])
    {
        global $wpdb;

        $preparedQuery = (!empty($args)) ? $wpdb->prepare( $query, $args ) : $query;

        return str_ireplace( "'NULL'", "NULL", $preparedQuery );
    }

    /**
     * Get the table prefix
     *
     * @return mixed
     */
    public static function prefix()
    {
        global $wpdb;

        return $wpdb->prefix;
    }

    /**
     * @param $table
     *
     * @return string
     */
    public static function prefixedTableName($table)
    {
        return self::prefix().$table;
    }

    /**
     * @param $table
     * @param $column
     *
     * @return bool
     */
    public static function checkIfColumnExistsInTable($table, $column)
    {
        global $wpdb;

        $exists = false;
        $rows = $wpdb->get_results(  "SHOW COLUMNS FROM `".$table."`  "  );

        foreach ($rows as $row){
            if($column === $row->Field){
                return true;
            }
        }

        return $exists;
    }
}