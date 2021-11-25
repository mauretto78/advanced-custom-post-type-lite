<?php

namespace ACPT_Lite\Includes;

use ACPT_Lite\Core\Helper\Uuid;
use ACPT_Lite\Core\Models\CustomPostTypeModel;
use ACPT_Lite\Core\Models\CustomPostTypeTemplateModel;
use ACPT_Lite\Core\Models\FileImportModel;
use ACPT_Lite\Core\Models\MetaBoxFieldModel;
use ACPT_Lite\Core\Models\MetaBoxFieldOptionModel;
use ACPT_Lite\Core\Models\MetaBoxFieldRelationshipModel;
use ACPT_Lite\Core\Models\MetaBoxModel;
use ACPT_Lite\Core\Models\SettingsModel;
use ACPT_Lite\Core\Models\TaxonomyModel;

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

    /**
     * create schema
     *
     * @since    1.0.0
     */
    public static function createSchema()
    {
        global $wpdb;
        $charset_collate = $wpdb->get_charset_collate();

        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');

        // custom_post_type
        $sql1 = "CREATE TABLE IF NOT EXISTS  `".self::TABLE_CUSTOM_POST_TYPE."` (
            id VARCHAR(36) UNIQUE NOT NULL,
            post_name VARCHAR(20) UNIQUE NOT NULL,
            singular VARCHAR(255) NOT NULL,
            plural VARCHAR(255) NOT NULL,
            icon VARCHAR(50) NOT NULL,
            native TINYINT(1) DEFAULT 0,
            supports TEXT,
            labels TEXT,
            settings TEXT,
            PRIMARY KEY(id)
        ) $charset_collate;";

        // meta box
        $sql2 = "CREATE TABLE IF NOT EXISTS  `".self::TABLE_CUSTOM_POST_TYPE_META_BOX."` (
            id VARCHAR(36) UNIQUE NOT NULL,
            post_type VARCHAR(20) NOT NULL,
            meta_box_name VARCHAR(50) NOT NULL,
            sort INT(11),
            PRIMARY KEY(id)
        ) $charset_collate;";

        // field
        $sql3 = "CREATE TABLE IF NOT EXISTS  `".self::TABLE_CUSTOM_POST_TYPE_FIELD."` (
            id VARCHAR(36) UNIQUE NOT NULL,
            meta_box_id VARCHAR(36) NOT NULL,
            field_name VARCHAR(50) NOT NULL,
            field_type VARCHAR(50) NOT NULL,
            field_default_value VARCHAR(50) DEFAULT NULL,
            field_description TEXT DEFAULT NULL,
            showInArchive TINYINT(1) NOT NULL,
            required TINYINT(1) NOT NULL,
            sort INT(11),
            PRIMARY KEY(id)
        ) $charset_collate;";

        // options
        $sql4 = "CREATE TABLE IF NOT EXISTS  `".self::TABLE_CUSTOM_POST_TYPE_OPTION."` (
            id VARCHAR(36) UNIQUE NOT NULL,
            meta_box_id VARCHAR(36) NOT NULL,
            meta_field_id VARCHAR(36) NOT NULL,
            option_label VARCHAR(50) NOT NULL,
            option_value VARCHAR(50) NOT NULL,
            sort INT(11),
            PRIMARY KEY(id)
        ) $charset_collate;";

        // relations
        $sql5 = "CREATE TABLE IF NOT EXISTS  `".self::TABLE_CUSTOM_POST_TYPE_RELATION."` (
            id VARCHAR(36) UNIQUE NOT NULL,
            meta_box_id VARCHAR(36) NOT NULL,
            meta_field_id VARCHAR(36) NOT NULL,
            relationship VARCHAR(50) NOT NULL,
            related_post_type VARCHAR(20) NOT NULL,
            inversed_meta_box_id VARCHAR(36) DEFAULT NULL,
            inversed_meta_box_name VARCHAR(50) DEFAULT NULL,
            inversed_meta_field_id VARCHAR(36) DEFAULT NULL,
            inversed_meta_field_name VARCHAR(50) DEFAULT NULL,
            PRIMARY KEY(id)
        ) $charset_collate;";

        // custom_post_type_import
        $sql6 = "CREATE TABLE IF NOT EXISTS  `".self::TABLE_CUSTOM_POST_TYPE_IMPORT."` (
            id VARCHAR(36) UNIQUE NOT NULL,
            file VARCHAR(255) NOT NULL,
            url VARCHAR(255) NOT NULL,
            file_type VARCHAR(36) DEFAULT NULL,
            user_id INT(11),
            content TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            PRIMARY KEY(id)
        ) $charset_collate;";

        // taxonomy
        $sql7 = "CREATE TABLE IF NOT EXISTS  `".self::TABLE_TAXONOMY."` (
            id VARCHAR(36) UNIQUE NOT NULL,
            slug VARCHAR(32) UNIQUE NOT NULL,
            singular VARCHAR(255) NOT NULL,
            plural VARCHAR(255) NOT NULL,
            labels TEXT,
            settings TEXT,
            PRIMARY KEY(id)
        ) $charset_collate;";

        // taxonomy pivot
        $sql8 = "CREATE TABLE IF NOT EXISTS  `".self::TABLE_TAXONOMY_PIVOT."` (
            custom_post_type_id VARCHAR(36) NOT NULL,
            taxonomy_id VARCHAR(36) NOT NULL,
            PRIMARY KEY( `custom_post_type_id`, `taxonomy_id`)
        ) $charset_collate;";

        // acpt_custom_post_template
        $sql9 = "CREATE TABLE IF NOT EXISTS  `".self::TABLE_CUSTOM_POST_TEMPLATE."` (
            id VARCHAR(36) UNIQUE NOT NULL,
            post_type VARCHAR(20) NOT NULL,
            template_type VARCHAR(36) DEFAULT NULL,
            json TEXT,
            html TEXT,
            meta TEXT,
            PRIMARY KEY(id)
        ) $charset_collate;";

        // acpt_settings
        $sql10 = "CREATE TABLE IF NOT EXISTS  `".self::TABLE_SETTINGS."` (
            id VARCHAR(36) UNIQUE NOT NULL,
            meta_key VARCHAR(32) UNIQUE NOT NULL,
            meta_value VARCHAR(255) NOT NULL,
            PRIMARY KEY(id)
        ) $charset_collate;";

        dbDelta($sql1);
        dbDelta($sql2);
        dbDelta($sql3);
        dbDelta($sql4);
        dbDelta($sql5);
        dbDelta($sql6);
        dbDelta($sql7);
        dbDelta($sql8);
        dbDelta($sql9);
        dbDelta($sql10);

        $success = empty($wpdb->last_error);

        if(!$success){
            echo $success;
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
        global $wpdb;

        $wpdb->query("DROP TABLE IF EXISTS `".self::TABLE_CUSTOM_POST_TYPE."`;");
        $wpdb->query("DROP TABLE IF EXISTS `".self::TABLE_CUSTOM_POST_TYPE_META_BOX."`;");
        $wpdb->query("DROP TABLE IF EXISTS `".self::TABLE_CUSTOM_POST_TYPE_FIELD."`;");
        $wpdb->query("DROP TABLE IF EXISTS `".self::TABLE_CUSTOM_POST_TYPE_OPTION."`;");
        $wpdb->query("DROP TABLE IF EXISTS `".self::TABLE_CUSTOM_POST_TYPE_RELATION."`;");
        $wpdb->query("DROP TABLE IF EXISTS `".self::TABLE_CUSTOM_POST_TEMPLATE."`;");
        $wpdb->query("DROP TABLE IF EXISTS `".self::TABLE_CUSTOM_POST_TYPE_IMPORT."`;");
        $wpdb->query("DROP TABLE IF EXISTS `".self::TABLE_TAXONOMY."`;");
        $wpdb->query("DROP TABLE IF EXISTS `".self::TABLE_TAXONOMY_PIVOT."`;");
        $wpdb->query("DROP TABLE IF EXISTS `".self::TABLE_SETTINGS."`;");

        $success = empty($wpdb->last_error);

        if(!$success){
            echo $success;
            die();
        }
    }

    /**
     * Sync data with already registered custom post types
     *
     * @since    1.0.0
     */
    public static function sync()
    {
        self::createCustomPostTypes();
        self::createNativePostTypes();
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

        ACPT_Lite_DB::save($postModel);
        ACPT_Lite_DB::save($pageModel);
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

                ACPT_Lite_DB::save($postModel);
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

        if(in_array($postType, $notAllowed)){
            return false;
        }

        // exclude WooCommerce for now
        if($postType === 'product' and function_exists( 'is_woocommerce_activated' )){
            return false;
        }

        return true;
    }

    /**
     * Associate a post with a taxonomy
     *
     * @param $postId
     * @param $taxonomyId
     *
     * @throws \Exception
     */
    public static function assocPostToTaxonomy($postId, $taxonomyId)
    {
        $sql = "
            INSERT INTO
                `".self::TABLE_TAXONOMY_PIVOT."`
                (
                    `custom_post_type_id`, 
                    `taxonomy_id` 
                ) VALUES (
                    %s,
                    %s
                ) ON DUPLICATE KEY UPDATE 
                    `custom_post_type_id` = %s,
                    `taxonomy_id` = %s
            ;";

        self::executeQueryOrThrowException($sql, [
            $postId,
            $taxonomyId,
            $postId,
            $taxonomyId
        ]);
    }

    /**
     * @return int
     */
    public static function count()
    {
        $baseQuery = "
            SELECT 
                count(id) as count
            FROM `".self::TABLE_CUSTOM_POST_TYPE."`
            ";

        $results = self::getResults($baseQuery);

        return (int)$results[0]->count;
    }

    /**
     * Delete a custom post type
     *
     * @param $postType
     * @param $mode
     *
     * @return string|null
     * @throws \Exception
     * @since    1.0.0
     */
    public static function delete($postType)
    {
        if(self::exists($postType)) {

            $postModel = self::get([
                'postType' => $postType
            ])[0];

            self::startTransaction();
            
            try {
                $sql = "
                    DELETE
                        FROM `".self::TABLE_CUSTOM_POST_TYPE."`
                        WHERE id = %s
                    ";

                self::deleteMeta($postType);
                self::deleteTemplates($postType);
                self::deleteTaxonomyAssociations($postModel->getId());
                self::removeOrphanRelationships();
                self::executeQueryOrThrowException($sql, [$postModel->getId()]);
                self::commitTransaction();
            } catch (\Exception $exception){
                self::rollbackTransaction();
                throw new \Exception($exception->getMessage());
            }

            return true;
        }

        return false;
    }

    /**
     * Delete all meta for a custom post type
     *
     * @param $postType
     *
     * @return string|null
     * @throws \Exception
     * @since    1.0.0
     */
    public static function deleteMeta($postType)
    {
        if(self::exists($postType)) {

            $meta = self::getMeta($postType);

            foreach ($meta as $boxModel){

                $sql = "
                    DELETE
                        FROM `".self::TABLE_CUSTOM_POST_TYPE_META_BOX."`
                        WHERE id = %s
                    ";

                try {
                    self::executeQueryOrThrowException($sql, [$boxModel->getId()]);
                } catch (\Exception $exception){
                    self::rollbackTransaction();
                    throw new \Exception($exception->getMessage());
                }

                foreach ($boxModel->getFields() as $fieldModel){
                    $sql = "
                    DELETE
                        FROM `".self::TABLE_CUSTOM_POST_TYPE_FIELD."`
                        WHERE id = %s
                    ";

                    try {
                        self::executeQueryOrThrowException($sql, [$fieldModel->getId()]);
                    } catch (\Exception $exception){
                        self::rollbackTransaction();
                        throw new \Exception($exception->getMessage());
                    }

                    foreach ($fieldModel->getOptions() as $optionModel){
                        $sql = "
                        DELETE
                            FROM `".self::TABLE_CUSTOM_POST_TYPE_OPTION."`
                            WHERE id = %s
                        ";

                        try {
                            self::executeQueryOrThrowException($sql, [$optionModel->getId()]);
                        } catch (\Exception $exception){
                            self::rollbackTransaction();
                            throw new \Exception($exception->getMessage());
                        }
                    }

                    foreach ($fieldModel->getRelations() as $relationModel){
                        $sql = "
                        DELETE
                            FROM `".self::TABLE_CUSTOM_POST_TYPE_RELATION."`
                            WHERE id = %s
                        ";

                        try {
                            self::executeQueryOrThrowException($sql, [$relationModel->getId()]);
                        } catch (\Exception $exception){
                            self::rollbackTransaction();
                            throw new \Exception($exception->getMessage());
                        }
                    }
                }
            }

            self::commitTransaction();

            return true;
        }

        return false;
    }

    /**
     * Delete template
     *
     * @param $postType
     * @param $templateType
     *
     * @throws \Exception
     */
    public static function deleteTemplate($postType, $templateType)
    {
        self::executeQueryOrThrowException("DELETE FROM `".self::TABLE_CUSTOM_POST_TEMPLATE."` WHERE post_type = %s AND template_type = %s;", [$postType,  $templateType]);
    }

    /**
     * Delete templates
     *
     * @param $postType
     *
     * @throws \Exception
     */
    public static function deleteTemplates($postType)
    {
        self::executeQueryOrThrowException("DELETE FROM `".self::TABLE_CUSTOM_POST_TEMPLATE."` WHERE post_type = %s;", [$postType]);
    }

    /**
     * Delete taxonomy
     *
     * @param $taxonomy
     *
     * @throws \Exception
     */
    public static function deleteTaxonomy($taxonomy)
    {
        $taxonomyId = self::getTaxonomyId($taxonomy);

        if($taxonomyId){
            self::executeQueryOrThrowException("DELETE FROM `".self::TABLE_TAXONOMY."` WHERE id = %s;", [$taxonomyId]);
            self::executeQueryOrThrowException("DELETE FROM `".self::TABLE_TAXONOMY_PIVOT."` WHERE taxonomy_id = %s;", [$taxonomyId]);
        }
    }

    /**
     * Delete all post's associations with taxonomies
     *
     * @param $postId
     *
     * @throws \Exception
     */
    public static function deleteTaxonomyAssociations($postId)
    {
        $sql = "
            DELETE
                FROM `".self::TABLE_TAXONOMY_PIVOT."`
                WHERE custom_post_type_id = %s
            ";

        self::executeQueryOrThrowException($sql, [$postId]);
    }

    /**
     * Check if a post type exists
     *
     * @since    1.0.0
     * @param $postType
     *
     * @return bool
     */
    public static function exists($postType)
    {
        $baseQuery = "
            SELECT 
                id
            FROM `".self::TABLE_CUSTOM_POST_TYPE."`
            WHERE post_name = %s
            ";

        $posts = self::getResults($baseQuery, [$postType]);

        return count($posts) === 1;
    }

    /**
     * @param $postType
     * @param $templateType
     *
     * @return bool
     */
    public static function existsTemplate($postType, $templateType)
    {
        $baseQuery = "
            SELECT 
                id
            FROM `".self::TABLE_CUSTOM_POST_TEMPLATE."`
            WHERE 
                post_type = %s AND
                template_type = %s
            ";

        $results = self::getResults($baseQuery, [$postType, $templateType]);

        return count($results) === 1;
    }

    /**
     * Import data from array $structure
     * from imported json file
     *
     * @param array $structure
     *
     * @throws \Exception
     * @since    1.0.0
     */
    public static function import(array $structure)
    {
        $sql = "
            INSERT INTO `".self::TABLE_CUSTOM_POST_TYPE."` 
            (`id`,
            `post_name` ,
            `singular` ,
            `plural`,
            `icon`,
            `supports`,
            `labels`,
            `settings`
            ) VALUES (
                %s, 
                %s, 
                %s, 
                %s, 
                %s, 
                %s, 
                %s, 
                %s 
            ) ON DUPLICATE KEY UPDATE 
                `post_name` = %s,
                `singular` = %s, 
                `plural` = %s, 
                `icon` = %s, 
                `supports` = %s, 
                `labels` = %s, 
                `settings` = %s 
        ;";

        self::executeQueryOrThrowException($sql, [
            $structure['id'],
            $structure['name'],
            $structure['singular'],
            $structure['plural'],
            $structure['icon'],
            json_encode($structure['supports']),
            json_encode($structure['labels']),
            json_encode($structure['settings']),
            $structure['name'],
            $structure['singular'],
            $structure['plural'],
            $structure['icon'],
            json_encode($structure['supports']),
            json_encode($structure['labels']),
            json_encode($structure['settings']),
        ]);

        foreach ($structure['taxonomies'] as $taxonomy) {
            $sql = "
                INSERT INTO `".self::TABLE_TAXONOMY."` 
                (`id`,
                `slug`,
                `singular`,
                `plural`,
                `labels`,
                `settings`
                ) VALUES (
                    %s,
                    %s,
                    %s,
                    %s,
                    %s,
                    %s
                ) ON DUPLICATE KEY UPDATE 
                    `slug` = %s,
                    `singular` = %s, 
                    `plural` = %s, 
                    `labels` = %s, 
                    `settings` = %s 
            ;";

            self::executeQueryOrThrowException($sql, [
                $taxonomy['id'],
                $taxonomy['slug'],
                $taxonomy['singular'],
                $taxonomy['plural'],
                json_encode($taxonomy['labels']),
                json_encode($taxonomy['settings']),
                $taxonomy['slug'],
                $taxonomy['singular'],
                $taxonomy['plural'],
                json_encode($taxonomy['labels']),
                json_encode($taxonomy['settings']),
            ]);

            $sql = "
                INSERT INTO
                    `".self::TABLE_TAXONOMY_PIVOT."`
                    (
                        `custom_post_type_id`, 
                        `taxonomy_id` 
                    ) VALUES (
                        %s, 
                        %s
                    ) ON DUPLICATE KEY UPDATE 
                        `custom_post_type_id` = %s,
                        `taxonomy_id` = %s
                ;";

            self::executeQueryOrThrowException($sql, [
                $structure['id'],
                $taxonomy['id'],
                $structure['id'],
                $taxonomy['id']
            ]);
        }

        foreach ($structure['meta'] as $box) {
            $sql = "
                INSERT INTO `".self::TABLE_CUSTOM_POST_TYPE_META_BOX."` 
                (`id`,
                `post_type` ,
                `meta_box_name` ,
                `sort`
                ) VALUES (
                    %s,
                    %s,
                    %s,
                    %s
                ) ON DUPLICATE KEY UPDATE 
                    `post_type` = %s,
                    `meta_box_name` = %s,
                    `sort` = %s
            ;";

            self::executeQueryOrThrowException($sql, [
                $box['id'],
                $box['postType'],
                $box['name'],
                $box['sort'],
                $box['postType'],
                $box['name'],
                $box['sort'],
            ]);

            foreach ($box['fields'] as $field) {

                $showInArchive = $field[ 'showInArchive' ] ? '1' : '0';
                $isRequired = $field[ 'required' ] ? '1' : '0';

                $sql = "
                    INSERT INTO `" . self::TABLE_CUSTOM_POST_TYPE_FIELD . "` 
                    (`id`,
                    `meta_box_id` ,
                    `field_name` ,
                    `field_type` ,
                    `field_default_value` ,
                    `field_description` ,
                    `showInArchive` ,
                    `required` ,
                    `sort`
                    ) VALUES (
                        %s,
                        %s,
                        %s,
                        %s,
                        %s,
                        %s,
                        %s,
                        %s,
                        %s
                    ) ON DUPLICATE KEY UPDATE 
                        `meta_box_id` = %s,
                        `field_name` = %s,
                        `field_type` = %s,
                        `field_default_value` = %s,
                        `field_description` = %s,
                        `showInArchive` = %s,
                        `required` = %s,
                        `sort` = %s
                ;";

                self::executeQueryOrThrowException( $sql, [
                    $field[ 'id' ],
                    $box[ 'id' ],
                    $field[ 'name' ],
                    $field[ 'type' ],
                    $field[ 'defaultValue' ],
                    $field[ 'description' ],
                    $showInArchive,
                    $isRequired,
                    $field[ 'sort'] ,
                    $box[ 'id' ],
                    $field[ 'name' ],
                    $field[ 'type' ],
                    $field[ 'defaultValue' ],
                    $field[ 'description' ],
                    $showInArchive,
                    $isRequired,
                    $field[ 'sort'] ,
                ] );

                foreach ( $field[ 'options' ] as $option ) {
                    $sql = "
                        INSERT INTO `" . self::TABLE_CUSTOM_POST_TYPE_OPTION . "` 
                        (`id`,
                        `meta_box_id` ,
                        `meta_field_id` ,
                        `option_label` ,
                        `option_value` ,
                        `sort`
                        ) VALUES (
                            %s,
                            %s,
                            %s,
                            %s,
                            %s,
                            %s
                        ) ON DUPLICATE KEY UPDATE 
                            `meta_box_id` = %s,
                            `meta_field_id` = %s,
                            `option_label` = %s,
                            `option_value` = %s,
                            `sort` = %s 
                    ;";

                    self::executeQueryOrThrowException( $sql, [
                        $option[ 'id' ],
                        $box[ 'id' ],
                        $field[ 'id' ],
                        $option[ 'label' ],
                        $option[ 'value' ],
                        $option[ 'sort'] ,
                        $box[ 'id' ],
                        $field[ 'id' ],
                        $option[ 'label' ],
                        $option[ 'value' ],
                        $option[ 'sort'] ,
                    ] );
                }

                foreach ( $field[ 'relations' ] as $relation ) {

                    $a = ($relation['inversedBoxId'] !== null) ? "'".$relation['inversedBoxId']."'"  : 'NULL';
                    $b = ($relation['inversedBoxName'] !== null) ? "'".$relation['inversedBoxName']."'"  : 'NULL';
                    $c = ($relation['inversedFieldId'] !== null) ? "'".$relation['inversedFieldId']."'"  : 'NULL';
                    $d = ($relation['inversedFieldName'] !== null) ? "'".$relation['inversedFieldName']."'"  : 'NULL';

                    $sql = "
                    INSERT INTO `".self::TABLE_CUSTOM_POST_TYPE_RELATION."` 
                        (`id`,
                        `meta_box_id` ,
                        `meta_field_id` ,
                        `relationship` ,
                        `related_post_type` ,
                        `inversed_meta_box_id` ,
                        `inversed_meta_box_name`,
                        `inversed_meta_field_id` ,
                        `inversed_meta_field_name`
                        ) VALUES (
                            %s,
                            %s,
                            %s,
                            %s,
                            %s,
                            %s,
                            %s,
                            %s,
                            %s
                        ) ON DUPLICATE KEY UPDATE 
                            `meta_box_id` = %s,
                            `meta_field_id` = %s,
                            `relationship` = %s,
                            `related_post_type` = %s,
                            `inversed_meta_box_id` = %s,
                            `inversed_meta_box_name` = %s,
                            `inversed_meta_field_id` = %s,
                            `inversed_meta_field_name` = %s
                    ;";

                    self::executeQueryOrThrowException($sql, [
                        $relation['id'],
                        $relation['boxId'],
                        $relation['fieldId'],
                        $relation['type'],
                        $relation['relatedPostType'],
                        $a,
                        $b,
                        $c,
                        $d
                    ]);
                }
            }
        }

        foreach ($structure['templates'] as $template) {
            $sql = "
                INSERT INTO `".self::TABLE_CUSTOM_POST_TEMPLATE."` 
                (`id`,
                `post_type` ,
                `template_type` ,
                `json` ,
                `html` ,
                `meta`
                ) VALUES (
                    %s,
                    %s,
                    %s,
                    %s,
                    %s,
                    %s
                ) ON DUPLICATE KEY UPDATE 
                    `post_type` = %s,
                    `template_type` = %s,
                    `json` = %s,
                    `html` = %s,
                    `meta` = %s
            ;";

            self::executeQueryOrThrowException($sql, [
                    $template['id'],
                    $template['postType'],
                    $template['templateType'],
                    $template['json'],
                    $template['html'],
                    (isset($template['meta']) and !empty($template['meta'])) ? json_encode($template['meta']) : json_encode([]),
                    $template['postType'],
                    $template['templateType'],
                    $template['json'],
                    $template['html'],
                    (isset($template['meta']) and !empty($template['meta'])) ? json_encode($template['meta']) : json_encode([]),
            ]);
        }
    }

    /**
     * Get the registered custom post types
     *
     * @param array $meta
     * @param bool  $lazy
     *
     * @return CustomPostTypeModel[]
     * @throws \Exception
     * @since    1.0.0
     */
    public static function get(array $meta = [], $lazy = false)
    {
        $results = [];
        $args = [];

        $baseQuery = "
            SELECT 
                cp.id, 
                cp.post_name as name,
                cp.singular,
                cp.plural,
                cp.icon,
                cp.native,
                cp.supports,
                cp.labels,
                cp.settings,
                COUNT(p.id) as post_count
            FROM `".self::TABLE_CUSTOM_POST_TYPE."` cp
            LEFT JOIN `".self::prefix()."posts` p ON p.post_type = cp.post_name AND p.`post_status` = %s
            WHERE 1=1
            ";

        $args[] = 'publish';

        if(isset($meta['id'])){
            $baseQuery .= " AND cp.id = %s";
            $args[] = $meta['id'];
        }

        if(isset($meta['postType'])){
            $baseQuery .= " AND cp.post_name = %s ";
            $args[] = $meta['postType'];
        }

        $baseQuery .= " GROUP BY cp.id";
        $baseQuery .= " ORDER BY cp.native DESC";

        if(isset($meta['page']) and isset($meta['perPage'])){
            $baseQuery .= " LIMIT ".$meta['perPage']." OFFSET " . ($meta['perPage'] * ($meta['page'] - 1));
        }

        $baseQuery .= ';';
        $posts = self::getResults($baseQuery, $args);

        foreach ($posts as $post){
            $postModel = CustomPostTypeModel::hydrateFromArray([
                'id' => $post->id,
                'name' => $post->name,
                'singular' => $post->singular,
                'plural' => $post->plural,
                'icon' => $post->icon,
                'native' => $post->native == '0' ? false : true,
                'supports' => json_decode($post->supports),
                'labels' => json_decode($post->labels, true),
                'settings' => json_decode($post->settings, true),
            ]);
            $postModel->setPostCount($post->post_count);

            if(!$lazy){
                $boxes = self::getResults("
                SELECT 
                    id, 
                    meta_box_name as name,
                    sort
                FROM `".self::TABLE_CUSTOM_POST_TYPE_META_BOX."`
                WHERE post_type = %s
                ORDER BY sort
            ;", [$post->name]);

                foreach ($boxes as $boxIndex => $box){
                    $boxModel = MetaBoxModel::hydrateFromArray([
                        'id' => $box->id,
                        'postType' => $postModel->getName(),
                        'name' => $box->name,
                        'sort' => $box->sort
                    ]);

                    $sql = "
                        SELECT
                            id,
                            field_name as name,
                            field_type,
                            field_default_value,
                            field_description,
                            required,
                            showInArchive,
                            sort
                        FROM `".self::TABLE_CUSTOM_POST_TYPE_FIELD."`
                        WHERE meta_box_id = %s
                    ";

                    if(isset($meta['excludeFields'])){
                        $sql .= " AND id NOT IN ('".implode("','", $meta['excludeFields'])."')";
                    }

                    $sql .= " ORDER BY sort;";


                    $fields = self::getResults($sql, [$box->id]);

                    foreach ($fields as $fieldIndex => $field){
                        $fieldModel = MetaBoxFieldModel::hydrateFromArray([
                            'id' => $field->id,
                            'metaBox' => $boxModel,
                            'title' => $field->name,
                            'type' => $field->field_type,
                            'required' => $field->required,
                            'defaultValue' => $field->field_default_value,
                            'description' => $field->field_description,
                            'showInArchive' => $field->showInArchive,
                            'sort' => $field->sort
                        ]);

                        $options = self::getResults("
                            SELECT
                                id,
                                meta_box_id as boxId,
                                meta_field_id as fieldId,
                                option_label as label,
                                option_value as value,
                                sort
                            FROM `".self::TABLE_CUSTOM_POST_TYPE_OPTION."`
                            WHERE meta_field_id = %s
                            ORDER BY sort
                        ;", [$field->id]);

                        foreach ($options as $option){
                            $optionModel = MetaBoxFieldOptionModel::hydrateFromArray([
                                'id' => $option->id,
                                'metaBoxField' => $fieldModel,
                                'label' => $option->label,
                                'value' => $option->value,
                                'sort' => $option->sort,
                            ]);

                            $fieldModel->addOption($optionModel);
                        }

                        $relations = self::getResults("
                            SELECT
                                id,
                                meta_box_id as boxId,
                                meta_field_id as fieldId,
                                relationship as type,
                                related_post_type,
                                inversed_meta_box_id as inversedBoxId,
                                inversed_meta_box_name as inversedBoxName,
                                inversed_meta_field_id as inversedFieldId,
                                inversed_meta_field_name as inversedFieldName
                            FROM `".self::TABLE_CUSTOM_POST_TYPE_RELATION."`
                            WHERE meta_field_id = %s
                        ;", [$field->id]);

                        foreach ($relations as $relation){
                            $relatedCustomPostType = self::get([
                                'postType' => $relation->related_post_type
                            ], true)[0];

                            $relationModel = MetaBoxFieldRelationshipModel::hydrateFromArray([
                                'id' => $relation->id,
                                'relationship' => $relation->type,
                                'relatedCustomPostType' => $relatedCustomPostType,
                                'metaBoxField' => $fieldModel,
                            ]);

                            if(isset($relation->inversedFieldId) and null !== $relation->inversedFieldId){
                                $inversedBy = ACPT_Lite_DB::getMetaField($relation->inversedFieldId);
                                if(null !== $inversedBy){
                                    $relationModel->setInversedBy($inversedBy);
                                }
                            }

                            $fieldModel->addRelation($relationModel);
                        }

                        $boxModel->addField($fieldModel);
                    }

                    $postModel->addMetaBox($boxModel);
                }

                $taxonomies = self::getResults("
                    SELECT
                        t.id,
                        t.slug ,
                        t.singular,
                        t.plural,
                        t.labels,
                        t.settings
                    FROM `".self::TABLE_TAXONOMY."` t
                    JOIN `".self::TABLE_TAXONOMY_PIVOT."` p ON p.taxonomy_id = t.id
                    WHERE p.custom_post_type_id = %s
                ;", [$postModel->getId()]);

                foreach ($taxonomies as $taxonomy) {
                    $taxonomyModel = TaxonomyModel::hydrateFromArray([
                        'id' => $taxonomy->id,
                        'slug' => $taxonomy->slug,
                        'singular' => $taxonomy->singular,
                        'plural' => $taxonomy->plural,
                        'labels' => json_decode($taxonomy->labels, true),
                        'settings' => json_decode($taxonomy->settings, true),
                    ]);

                    $postModel->addTaxonomy($taxonomyModel);
                }

                $templates = self::getResults("
                        SELECT 
                            id, 
                            post_type as postType,
                            template_type as templateType,
                            json,
                            html,
                            meta
                        FROM `".self::TABLE_CUSTOM_POST_TEMPLATE."`
                        WHERE post_type = %s
                ;", [$post->name]);

                foreach ($templates as $template) {
                    $taxonomyModel = CustomPostTypeTemplateModel::hydrateFromArray([
                        'id' => $template->id,
                        'postType' => $template->postType,
                        'templateType' => $template->templateType,
                        'json' => $template->json,
                        'html' => $template->html,
                        'meta' => json_decode($template->meta, true),
                    ]);

                    $postModel->addTemplate($taxonomyModel);
                }
            }

            if($postModel->getName() === 'post'){
                $themeFiles = ['single.php', 'acpt/single.php'];
                $existsInTheme = locate_template($themeFiles, false);
                $postModel->setExistsSinglePageInTheme($existsInTheme != '');

                $themeFiles = ['category.php', 'acpt/category.php'];
                $existsInTheme = locate_template($themeFiles, false);
                $postModel->setExistsArchivePageInTheme($existsInTheme != '');

            } elseif ($postModel->getName() === 'page') {
                $themeFiles = ['page.php', 'acpt/page.php'];
                $existsInTheme = locate_template($themeFiles, false);
                $postModel->setExistsSinglePageInTheme($existsInTheme != '');
            } else {
                $themeFiles = ['single-'.$postModel->getName().'.php', 'acpt/single-'.$postModel->getName().'.php'];
                $existsInTheme = locate_template($themeFiles, false);
                $postModel->setExistsSinglePageInTheme($existsInTheme != '');

                $themeFiles = ['archive-'.$postModel->getName().'.php', 'acpt/archive-'.$postModel->getName().'.php'];
                $existsInTheme = locate_template($themeFiles, false);
                $postModel->setExistsArchivePageInTheme($existsInTheme != '');
            }

            $results[] = $postModel;
        }

        return $results;
    }

    /**
     * Get the id of a post type by registed name
     *
     * @since    1.0.0
     * @param $postType
     *
     * @return string|null
     */
    public static function getId($postType)
    {
        $baseQuery = "
            SELECT 
                id
            FROM `".self::TABLE_CUSTOM_POST_TYPE."`
            WHERE post_name = %s
            ";

        $posts = self::getResults($baseQuery, [
            $postType
        ]);

        if(count($posts) === 1){
            return $posts[0]->id;
        }

        return null;
    }

    /**
     * @param $postType
     * @param array $options
     *
     * @return MetaBoxModel[]
     * @throws \Exception
     */
    public static function getMeta($postType, array $options = [])
    {
        $postTypeModels = self::get(array_merge([
            'postType' => $postType
        ], $options));

        if(!isset($postTypeModels[0])){
            return [];
        }

        return $postTypeModels[0]->getMetaBoxes();
    }

    /**
     * @param $id
     *
     * @return MetaBoxModel
     * @throws \Exception
     */
    public static function getMetaBox($id)
    {
        $boxes = self::getResults("
            SELECT 
                id, 
                post_type,
                meta_box_name as name,
                sort
            FROM `".self::TABLE_CUSTOM_POST_TYPE_META_BOX."`
            WHERE id = %s
        ;", [$id]);

        foreach ($boxes as $boxIndex => $box) {
            return MetaBoxModel::hydrateFromArray( [
                'id'       => $box->id,
                'postType' => $box->post_type,
                'name'     => $box->name,
                'sort'     => $box->sort
            ] );
        }
    }

    /**
     * @param $id
     *
     * @return MetaBoxFieldModel
     * @throws \Exception
     */
    public static function getMetaField($id)
    {
        $sql = "
            SELECT
                id,
                meta_box_id,
                field_name as name,
                field_default_value as default_value,
                field_description as description,
                field_type,
                required,
                showInArchive,
                sort
            FROM `".self::TABLE_CUSTOM_POST_TYPE_FIELD."`
            WHERE id = %s
        ;";

        $fields = self::getResults($sql, [$id]);

        foreach ($fields as $fieldIndex => $field) {
            return MetaBoxFieldModel::hydrateFromArray( [
                'id'            => $field->id,
                'metaBox'       => self::getMetaBox($field->meta_box_id),
                'title'         => $field->name,
                'type'          => $field->field_type,
                'required'      => $field->required,
                'defaultValue'  => $field->default_value,
                'description'   => $field->description,
                'showInArchive' => $field->showInArchive,
                'sort'          => $field->sort
            ] );
        }

        return null;
    }

    /**
     * @param null $key
     *
     * @return SettingsModel[]
     * @throws \Exception
     */
    public static function getSettings($key = null)
    {
        $results = [];
        $args = [];

        $baseQuery = "
            SELECT 
                id, 
                meta_key,
                meta_value
            FROM `".self::TABLE_SETTINGS."`
            ";

        if($key){
            $baseQuery .= ' WHERE meta_key = %s';
            $args[] = $key;
        }

        $settings = self::getResults($baseQuery, $args);

        foreach ($settings as $setting){
            $results[] = SettingsModel::hydrateFromArray([
                'id' => $setting->id,
                'key' => $setting->meta_key,
                'value' => $setting->meta_value,
            ]);
        }

        return $results;
    }

    /**
     * Get the registered taxonomies
     *
     * @param array $meta
     *
     * @return TaxonomyModel[]
     * @throws \Exception
     * @since    1.0.0
     */
    public static function getTaxonomies(array $meta = [])
    {
        $results = [];
        $args = [];

        $baseQuery = "
            SELECT 
                t.id, 
                t.slug,
                t.singular,
                t.plural,
                t.labels,
                t.settings
            FROM `".self::TABLE_TAXONOMY."` t
            WHERE 1=1
            ";

        if(isset($meta['id'])){
            $baseQuery .= " AND t.id = %s";
            $args[] = $meta['id'];
        }

        if(isset($meta['taxonomy'])){
            $baseQuery .= " AND t.slug = %s";
            $args[] = $meta['taxonomy'];
        }

        $baseQuery .= " GROUP BY t.id";

        if(isset($meta['page']) and isset($meta['perPage'])){
            $baseQuery .= " LIMIT ".$meta['perPage']." OFFSET " . ($meta['perPage'] * ($meta['page'] - 1));
        }

        $baseQuery .= ';';
        $taxonomies = self::getResults($baseQuery, $args);


        foreach ($taxonomies as $taxonomy){
            $taxonomyModel = TaxonomyModel::hydrateFromArray([
                'id' => $taxonomy->id,
                'slug' => $taxonomy->slug,
                'singular' => $taxonomy->singular,
                'plural' => $taxonomy->plural,
                'labels' => json_decode($taxonomy->labels, true),
                'settings' => json_decode($taxonomy->settings, true),
            ]);

            $sql = "
                SELECT 
                    SUM(count) as count
                FROM `".self::prefix()."term_taxonomy` 
                WHERE `taxonomy` = %s 
            ";

            $res = self::getResults($sql, [
                $taxonomy->slug
            ]);

            $count = (count($res) > 0 and isset($res[0]->count) ) ? $res[0]->count : 0;
            $taxonomyModel->setPostCount($count);

            $customPostTypes = self::getResults("
                SELECT
                    c.id,
                    c.post_name,
                    c.singular,
                    c.plural,
                    c.icon,
                    c.native,
                    c.supports,
                    c.labels,
                    c.settings
                FROM `".self::TABLE_CUSTOM_POST_TYPE."` c
                JOIN `".self::TABLE_TAXONOMY_PIVOT."` p ON p.custom_post_type_id = c.id
                WHERE p.taxonomy_id = %s
            ;", [$taxonomyModel->getId()]);

            foreach ($customPostTypes as $post){
                $postModel = CustomPostTypeModel::hydrateFromArray([
                    'id' => $post->id,
                    'name' => $post->post_name,
                    'singular' => $post->singular,
                    'plural' => $post->plural,
                    'icon' => $post->icon,
                    'native' => $post->native == '0' ? false : true,
                    'supports' => json_decode($post->supports),
                    'labels' => json_decode($post->labels, true),
                    'settings' => json_decode($post->settings, true),
                ]);

                $taxonomyModel->addCustomPostType($postModel);
            }

            $results[] = $taxonomyModel;
        }

        return $results;
    }

    /**
     * Get the id of a post type by registed name
     *
     * @since    1.0.0
     * @param $taxonomy
     *
     * @return string|null
     */
    public static function getTaxonomyId($taxonomy)
    {
        $baseQuery = "
            SELECT 
                id
            FROM `".self::TABLE_TAXONOMY."`
            WHERE slug = %s
            ";

        $posts = self::getResults($baseQuery, [$taxonomy]);

        if(count($posts) === 1){
            return $posts[0]->id;
        }

        return null;
    }

    /**
     * @param string $postType
     * @param string $templateType
     *
     * @return CustomPostTypeTemplateModel|null
     * @throws \Exception
     */
    public static function getTemplate($postType, $templateType)
    {
        $baseQuery = "
            SELECT 
                *
            FROM `".self::TABLE_CUSTOM_POST_TEMPLATE."`
            WHERE 
                post_type = %s AND
                template_type = %s
            ";

        $results = self::getResults($baseQuery, [$postType, $templateType]);

        if(count($results) === 1){
            return CustomPostTypeTemplateModel::hydrateFromArray([
                'id' => $results[0]->id,
                'postType' => $results[0]->post_type,
                'templateType' =>  $results[0]->template_type,
                'json' =>  $results[0]->json,
                'html' =>  $results[0]->html,
                'meta' =>  ($results[0]->meta) ? json_decode($results[0]->meta, true) : [],
            ]);
        }

        return null;
    }

    /**
     * @return CustomPostTypeTemplateModel[]
     * @throws \Exception
     */
    public static function getTemplates()
    {
        $results = self::getResults("
            SELECT 
                id, 
                post_type,
                template_type,
                json,
                html,
                meta
            FROM `".self::TABLE_CUSTOM_POST_TEMPLATE."`
        ;", []);

        $templates = [];

        foreach ($templates as $template) {
            $results[] = CustomPostTypeTemplateModel::hydrateFromArray( [
                'id' => $template->id,
                'postType' => $template->postType,
                'templateType' => $template->templateType,
                'json' => $template->json,
                'html' => $template->html,
                'meta' => json_decode($template->meta, true),
            ] );
        }

        return $templates;
    }



    /**
     * @param $postType
     * @param $ids
     *
     * @throws \Exception
     */
    public static function removeMetaOrphans($postType, $ids)
    {
        self::executeQueryOrThrowException("DELETE f FROM `".self::TABLE_CUSTOM_POST_TYPE_FIELD."` f LEFT JOIN `".self::TABLE_CUSTOM_POST_TYPE_META_BOX."` b on b.id=f.meta_box_id WHERE b.post_type = '".$postType."' AND f.id NOT IN ('".implode("','",$ids['fields'])."');");
        self::executeQueryOrThrowException("DELETE o FROM `".self::TABLE_CUSTOM_POST_TYPE_OPTION."` o LEFT JOIN `".self::TABLE_CUSTOM_POST_TYPE_META_BOX."` b on b.id=o.meta_box_id WHERE b.post_type = '".$postType."' AND o.id NOT IN ('".implode("','",$ids['options'])."');");
        self::executeQueryOrThrowException("DELETE r FROM `".self::TABLE_CUSTOM_POST_TYPE_RELATION."` r LEFT JOIN `".self::TABLE_CUSTOM_POST_TYPE_META_BOX."` b on b.id=r.meta_box_id WHERE b.post_type = '".$postType."' AND r.id NOT IN ('".implode("','",$ids['relations'])."');");
        self::executeQueryOrThrowException("DELETE FROM `".self::TABLE_CUSTOM_POST_TYPE_META_BOX."` WHERE post_type = '".$postType."' AND id NOT IN ('".implode("','",$ids['boxes'])."');");
    }

    /**
     * @throws \Exception
     */
    public static function removeOrphanRelationships()
    {
        $query = "
            SELECT f.`id`, r.`inversed_meta_field_id`, r.`relationship`
            FROM `".self::TABLE_CUSTOM_POST_TYPE_FIELD."` f
            JOIN `" . self::TABLE_CUSTOM_POST_TYPE_RELATION . "` r ON r.meta_field_id = f.id
            WHERE f.`field_type` = %s
            AND r.`relationship` LIKE '%Bi'
        ";

        // set all orphan fields with a orphan relationship to TEXT
        $results = self::getResults($query, [
            MetaBoxFieldModel::POST_TYPE
        ]);

        if(count($results) > 0) {
            foreach ( $results as $result ) {

                $subquery = "
                    SELECT f.id
                    FROM `" . self::TABLE_CUSTOM_POST_TYPE_FIELD . "` f
                    WHERE f.`id` = %s
                ";

                $subResults = self::getResults( $subquery, [$result->inversed_meta_field_id] );

                if ( count( $subResults ) === 0 ) {
                    $sql = "DELETE FROM `" . self::TABLE_CUSTOM_POST_TYPE_RELATION . "` WHERE meta_field_id = %s;";
                    self::executeQueryOrThrowException( $sql, [
                        $result->id
                    ] );

                    $sql = "UPDATE `" . self::TABLE_CUSTOM_POST_TYPE_FIELD . "` SET `field_type` = %s WHERE id = %s;";
                    self::executeQueryOrThrowException( $sql, [
                        MetaBoxFieldModel::TEXT_TYPE,
                        $result->id
                    ] );
                }
            }
        }

        // check if there are persisted relationship on a NON POST type field
        $query = "
            SELECT r.id
            FROM `".self::TABLE_CUSTOM_POST_TYPE_RELATION."` r
            JOIN `" . self::TABLE_CUSTOM_POST_TYPE_FIELD . "` f ON f.id = r.meta_field_id 
            WHERE f.`field_type` != %s
        ";

        $results = self::getResults($query, [
                MetaBoxFieldModel::POST_TYPE
        ]);

        if(count($results) > 0) {
            foreach ( $results as $result ) {
                $sql = "DELETE FROM `" . self::TABLE_CUSTOM_POST_TYPE_RELATION . "` WHERE id = %s;";
                self::executeQueryOrThrowException( $sql, [
                        $result->id
                ] );
            }
        }
    }

    /**
     * Remove an association with a taxonomy
     *
     * @param $postId
     * @param $taxonomyId
     *
     * @throws \Exception
     */
    public static function removeAssocPostToTaxonomy( $postId, $taxonomyId)
    {
        $sql = "
            DELETE FROM
                `".self::TABLE_TAXONOMY_PIVOT."`
                WHERE
                   `custom_post_type_id` = %s AND `taxonomy_id` = %s
            ";

        self::executeQueryOrThrowException($sql, [
            $postId,
            $taxonomyId
        ]);
    }

    /**
     * Save custom post type data
     *
     * @param CustomPostTypeModel $model
     *
     * @throws \Exception
     */
    public static function save(CustomPostTypeModel $model)
    {
        $sql = "
            INSERT INTO `".self::TABLE_CUSTOM_POST_TYPE."` 
            (`id`,
            `post_name` ,
            `singular` ,
            `plural`,
            `icon`,
            `native`,
            `supports`,
            `labels`,
            `settings`
            ) VALUES (
                %s,
                %s,
                %s,
                %s,
                %s,
                %s,
                %s,
                %s,
                %s
            ) ON DUPLICATE KEY UPDATE 
                `post_name` = %s,
                `singular` = %s,
                `plural` = %s,
                `icon` = %s,
                `native` = %s,
                `supports` = %s,
                `labels` = %s,
                `settings` = %s
        ;";

        self::executeQueryOrThrowException($sql, [
            $model->getId(),
            $model->getName(),
            $model->getSingular(),
            $model->getPlural(),
            $model->getIcon(),
            $model->isNative(),
            json_encode($model->getSupports()),
            json_encode($model->getLabels()),
            json_encode($model->getSettings()),
            $model->getName(),
            $model->getSingular(),
            $model->getPlural(),
            $model->getIcon(),
            $model->isNative(),
            json_encode($model->getSupports()),
            json_encode($model->getLabels()),
            json_encode($model->getSettings())
        ]);
    }

    /**
     * Save template
     *
     * @param CustomPostTypeTemplateModel $model
     *
     * @throws \Exception
     */
    public static function saveTemplate(CustomPostTypeTemplateModel $model)
    {
        $sql = "
            INSERT INTO `".self::TABLE_CUSTOM_POST_TEMPLATE."` 
            (`id`,
            `post_type` ,
            `template_type`,
            `json`,
            `html`,
            `meta`
            ) VALUES (
                %s,
                %s,
                %s,
                %s,
                %s,
                %s
            ) ON DUPLICATE KEY UPDATE 
                `post_type` = %s,
                `template_type` = %s,
                `json` = %s,
                `html` = %s,
                `meta` = %s
        ;";

        self::executeQueryOrThrowException($sql, [
            $model->getId(),
            $model->getPostType(),
            $model->getTemplateType(),
            $model->getJson(),
            $model->getHtml(),
            json_encode($model->getMeta()),
            $model->getPostType(),
            $model->getTemplateType(),
            $model->getJson(),
            $model->getHtml(),
            json_encode($model->getMeta()),
        ]);
    }

    /**
     * Save file import
     *
     * @param FileImportModel $fileImportModel
     *
     * @throws \Exception
     */
    public static function saveImport(FileImportModel $fileImportModel)
    {
        $sql = "
            INSERT INTO `".self::TABLE_CUSTOM_POST_TYPE_IMPORT."` 
            (`id`,
            `user_id`,
            `file` ,
            `url` ,
            `file_type`,
            `content`
            ) VALUES (
                %s,
                %s,
                %s,
                %s,
                %s,
                %s
            );";

        self::executeQueryOrThrowException($sql, [
            $fileImportModel->getId(),
            $fileImportModel->getUserId(),
            $fileImportModel->getFile(),
            $fileImportModel->getUrl(),
            $fileImportModel->getType(),
            json_encode($fileImportModel->getContent())
        ]);
    }

    /**
     * Save meta box
     *
     * @param MetaBoxModel $metaBoxModel
     * @param              $ids
     *
     * @throws \Exception
     */
    public static function saveMetaBox(MetaBoxModel $metaBoxModel, &$ids)
    {
        $sql = "
            INSERT INTO `".self::TABLE_CUSTOM_POST_TYPE_META_BOX."` 
            (
                `id`,
                `post_type`,
                `meta_box_name`,
                `sort`
            ) VALUES (
                %s,
                %s,
                %s,
                %d
            ) ON DUPLICATE KEY UPDATE 
                `post_type` = %s,
                `meta_box_name` = %s,
                `sort` = %d
        ;";

        self::executeQueryOrThrowException($sql, [
            $metaBoxModel->getId(),
            $metaBoxModel->getPostType(),
            $metaBoxModel->getName(),
            $metaBoxModel->getSort(),
            $metaBoxModel->getPostType(),
            $metaBoxModel->getName(),
            $metaBoxModel->getSort()
        ]);

        foreach ($metaBoxModel->getFields() as $fieldModel){

            $showInArchive = $fieldModel->isShowInArchive() ? '1' : '0';
            $isRequired = $fieldModel->isRequired() ? '1' : '0';

            $sql = "
                INSERT INTO `".self::TABLE_CUSTOM_POST_TYPE_FIELD."` 
                (
                    `id`,
                    `meta_box_id`,
                    `field_name`,
                    `field_type`,
                    `field_default_value`,
                    `field_description`,
                    `showInArchive`,
                    `required`,
                    `sort`
                ) VALUES (
                    %s,
                    %s,
                    %s,
                    %s,
                    %s,
                    %s,
                    %s,
                    %s,
                    %d
                ) ON DUPLICATE KEY UPDATE 
                    `meta_box_id` = %s,
                    `field_name` = %s,
                    `field_type` = %s,
                    `field_default_value` = %s,
                    `field_description` = %s,
                    `showInArchive` = %s,
                    `required` = %s,
                    `sort` = %d
            ;";

            self::executeQueryOrThrowException($sql, [
                $fieldModel->getId(),
                $metaBoxModel->getId(),
                $fieldModel->getName(),
                $fieldModel->getType(),
                $fieldModel->getDefaultValue(),
                $fieldModel->getDescription(),
                $showInArchive,
                $isRequired,
                $fieldModel->getSort(),
                $metaBoxModel->getId(),
                $fieldModel->getName(),
                $fieldModel->getType(),
                $fieldModel->getDefaultValue(),
                $fieldModel->getDescription(),
                $showInArchive,
                $isRequired,
                $fieldModel->getSort(),
            ]);

            foreach ($fieldModel->getOptions() as $optionModel){
                $sql = "
                    INSERT INTO `".self::TABLE_CUSTOM_POST_TYPE_OPTION."` 
                    (`id`,
                    `meta_box_id` ,
                    `meta_field_id` ,
                    `option_label` ,
                    `option_value` ,
                    `sort`
                    ) VALUES (
                        %s,
                        %s,
                        %s,
                        %s,
                        %s,
                        %d
                    ) ON DUPLICATE KEY UPDATE 
                        `meta_box_id` = %s,
                        `meta_field_id` = %s,
                        `option_label` = %s,
                        `option_value` = %s,
                        `sort` = %d
                ;";

                self::executeQueryOrThrowException($sql, [
                    $optionModel->getId(),
                    $metaBoxModel->getId(),
                    $fieldModel->getId(),
                    $optionModel->getLabel(),
                    $optionModel->getValue(),
                    $optionModel->getSort(),
                    $metaBoxModel->getId(),
                    $fieldModel->getId(),
                    $optionModel->getLabel(),
                    $optionModel->getValue(),
                    $optionModel->getSort()
                ]);
            }

            foreach ($fieldModel->getRelations() as $relationModel){

                $a = ($relationModel->getInversedBy() !== null) ? $relationModel->getInversedBy()->getMetaBox()->getId()  : 'NULL';
                $b = ($relationModel->getInversedBy() !== null) ? $relationModel->getInversedBy()->getMetaBox()->getName()  : 'NULL';
                $c = ($relationModel->getInversedBy() !== null) ? $relationModel->getInversedBy()->getId() : 'NULL';
                $d = ($relationModel->getInversedBy() !== null) ? $relationModel->getInversedBy()->getName() : 'NULL';

                $sql = "
                    INSERT INTO `".self::TABLE_CUSTOM_POST_TYPE_RELATION."`
                    (
                        `id`,
                        `meta_box_id`,
                        `meta_field_id`,
                        `relationship`,
                        `related_post_type`,
                        `inversed_meta_box_id`,
                        `inversed_meta_box_name`,
                        `inversed_meta_field_id`,
                        `inversed_meta_field_name`
                    ) VALUES (
                        %s,
                        %s,
                        %s,
                        %s,
                        %s,
                        %s,
                        %s,
                        %s,
                        %s
                    ) ON DUPLICATE KEY UPDATE
                        `meta_box_id` = %s,
                        `meta_field_id` = %s,
                        `relationship` = %s,
                        `related_post_type` = %s,
                        `inversed_meta_box_id` = %s,
                        `inversed_meta_box_name` = %s,
                        `inversed_meta_field_id` = %s,
                        `inversed_meta_field_name` = %s
                ;";

                self::executeQueryOrThrowException($sql, [
                    $relationModel->getId(),
                    $metaBoxModel->getId(),
                    $fieldModel->getId(),
                    $relationModel->getRelationship(),
                    $relationModel->getRelatedCustomPostType()->getName(),
                    $a,
                    $b,
                    $c,
                    $d,
                    $metaBoxModel->getId(),
                    $fieldModel->getId(),
                    $relationModel->getRelationship(),
                    $relationModel->getRelatedCustomPostType()->getName(),
                    $a,
                    $b,
                    $c,
                    $d,
                ]);

                if($relationModel->getInversedBy() !== null){

                    // check if there are already persisted inversed by
                    $sql = 'SELECT id FROM `'.self::TABLE_CUSTOM_POST_TYPE_RELATION.'` WHERE 
                        `meta_box_id` = %s AND
                        `meta_field_id` = %s AND
                        `related_post_type` = %s
                    ';

                    $check = self::getResults($sql, [
                        $relationModel->getInversedBy()->getMetaBox()->getId(),
                        $relationModel->getInversedBy()->getId(),
                        $metaBoxModel->getPostType(),
                    ]);

                    if(count($check) === 0){
                        $id = Uuid::v4();
                    } else {
                        $id = $check[0]->id;
                    }

                    $sql = "
                        INSERT INTO `".self::TABLE_CUSTOM_POST_TYPE_RELATION."`
                            (`id`,
                            `meta_box_id` ,
                            `meta_field_id` ,
                            `relationship` ,
                            `related_post_type` ,
                            `inversed_meta_box_id` ,
                            `inversed_meta_box_name`,
                            `inversed_meta_field_id` ,
                            `inversed_meta_field_name`
                            ) VALUES (
                                %s,
                                %s,
                                %s,
                                %s,
                                %s,
                                %s,
                                %s,
                                %s,
                                %s
                            ) ON DUPLICATE KEY UPDATE
                                `meta_box_id` = %s,
                                `meta_field_id` = %s,
                                `relationship` = %s,
                                `related_post_type` = %s,
                                `inversed_meta_box_id` = %s,
                                `inversed_meta_box_name` = %s,
                                `inversed_meta_field_id` = %s,
                                `inversed_meta_field_name` = %s
                        ;";

                    $ids[$metaBoxModel->getPostType()]['relations'][] = $id;

                    self::executeQueryOrThrowException($sql, [
                        $id,
                        $relationModel->getInversedBy()->getMetaBox()->getId(),
                        $relationModel->getInversedBy()->getId(),
                        $relationModel->getOppositeRelationship(),
                        $metaBoxModel->getPostType(),
                        $metaBoxModel->getId(),
                        $metaBoxModel->getName(),
                        $fieldModel->getId(),
                        $fieldModel->getName(),
                        $relationModel->getInversedBy()->getMetaBox()->getId(),
                        $relationModel->getInversedBy()->getId(),
                        $relationModel->getOppositeRelationship(),
                        $metaBoxModel->getPostType(),
                        $metaBoxModel->getId(),
                        $metaBoxModel->getName(),
                        $fieldModel->getId(),
                        $fieldModel->getName()
                    ]);

                    $sql = "UPDATE `".self::TABLE_CUSTOM_POST_TYPE_FIELD."`
                        SET `field_type` = %s
                        WHERE id = %s
                    ;";

                    self::executeQueryOrThrowException($sql, [
                            MetaBoxFieldModel::POST_TYPE,
                            $relationModel->getInversedBy()->getId()
                    ]);
                }
            }

            // loop all fields that have relations and have set this field as inversed field
            if($fieldModel->getType() !== MetaBoxFieldModel::POST_TYPE or !$fieldModel->getRelations()[0]->isBidirectional()){
                $query = "
                    SELECT *
                    FROM `".self::TABLE_CUSTOM_POST_TYPE_FIELD."` f
                    JOIN `".self::TABLE_CUSTOM_POST_TYPE_RELATION."` r ON r.meta_field_id = f.id
                    WHERE f.`field_type` = %s
                    AND f.id != %s
                    AND r.inversed_meta_field_id = %s
                    GROUP BY f.id
                ";

                $results = self::getResults($query, [
                    MetaBoxFieldModel::POST_TYPE,
                    $fieldModel->getId(),
                    $fieldModel->getId()
                ]);

                foreach ($results as $result){
                    $sql = "UPDATE `".self::TABLE_CUSTOM_POST_TYPE_RELATION."`
                        SET
                            `relationship` = '".str_replace("Bi", "Uni", $result->relationship)."',
                            `inversed_meta_box_id` = NULL,
                            `inversed_meta_box_name` = NULL,
                            `inversed_meta_field_id` = NULL,
                            `inversed_meta_field_name` = NULL
                        WHERE inversed_meta_field_id = %s
                    ;";
                    self::executeQueryOrThrowException($sql, [
                        $result->inversed_meta_field_id
                    ]);
                }
            }
        }
    }

    /**
     * @param SettingsModel $settingsModel
     *
     * @throws \Exception
     */
    public static function saveSettings(SettingsModel $settingsModel)
    {
        $sql = "
            INSERT INTO `".self::TABLE_SETTINGS."` 
            (`id`,
            `meta_key`,
            `meta_value`
            ) VALUES (
                %s,
                %s,
                %s
            ) ON DUPLICATE KEY UPDATE 
                `meta_key` = %s,
                `meta_value` = %s
        ;";

        self::executeQueryOrThrowException($sql, [
            $settingsModel->getId(),
            $settingsModel->getKey(),
            $settingsModel->getValue(),
            $settingsModel->getKey(),
            $settingsModel->getValue(),
        ]);
    }

    /**
     * @param TaxonomyModel $taxonomyModel
     *
     * @throws \Exception
     */
    public static function saveTaxonomy(TaxonomyModel $taxonomyModel)
    {
        $sql = "
            INSERT INTO `".self::TABLE_TAXONOMY."` 
            (`id`,
            `slug`,
            `singular`,
            `plural`,
            `labels`,
            `settings`
            ) VALUES (
                %s,
                %s,
                %s,
                %s,
                %s,
                %s
            ) ON DUPLICATE KEY UPDATE 
                `slug` = %s,
                `singular` = %s,
                `plural` = %s,
                `labels` = %s,
                `settings` = %s
        ;";

        self::executeQueryOrThrowException($sql, [
            $taxonomyModel->getId(),
            $taxonomyModel->getSlug(),
            $taxonomyModel->getSingular(),
            $taxonomyModel->getPlural(),
            json_encode($taxonomyModel->getLabels()),
            json_encode($taxonomyModel->getSettings()),
            $taxonomyModel->getSlug(),
            $taxonomyModel->getSingular(),
            $taxonomyModel->getPlural(),
            json_encode($taxonomyModel->getLabels()),
            json_encode($taxonomyModel->getSettings())
        ]);
    }

    /**
     * @return int
     */
    public static function taxonomyCount()
    {
        $baseQuery = "
            SELECT 
                count(id) as count
            FROM `".self::TABLE_TAXONOMY."`
            ";

        $results = self::getResults($baseQuery);

        return (int)$results[0]->count;
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

        $preparedQuery = $wpdb->prepare( $query, $args );

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
}