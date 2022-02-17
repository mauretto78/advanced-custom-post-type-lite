<?php

namespace ACPT_Lite\Includes;

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
        $charset_collate = $wpdb->get_charset_collate();

        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');

        // custom_post_type
        $sql1 = "CREATE TABLE IF NOT EXISTS  `".ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE."` (
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
        $sql2 = "CREATE TABLE IF NOT EXISTS  `".ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_META_BOX."` (
            id VARCHAR(36) UNIQUE NOT NULL,
            post_type VARCHAR(20) NOT NULL,
            meta_box_name VARCHAR(50) NOT NULL,
            sort INT(11),
            PRIMARY KEY(id)
        ) $charset_collate;";

        // field
        $sql3 = "CREATE TABLE IF NOT EXISTS  `".ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_FIELD."` (
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
        $sql4 = "CREATE TABLE IF NOT EXISTS  `".ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_OPTION."` (
            id VARCHAR(36) UNIQUE NOT NULL,
            meta_box_id VARCHAR(36) NOT NULL,
            meta_field_id VARCHAR(36) NOT NULL,
            option_label VARCHAR(50) NOT NULL,
            option_value VARCHAR(50) NOT NULL,
            sort INT(11),
            PRIMARY KEY(id)
        ) $charset_collate;";

        // relations
        $sql5 = "CREATE TABLE IF NOT EXISTS  `".ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_RELATION."` (
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
        $sql6 = "CREATE TABLE IF NOT EXISTS  `".ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_IMPORT."` (
            id VARCHAR(36) UNIQUE NOT NULL,
            file VARCHAR(255) NOT NULL,
            url VARCHAR(255) NOT NULL,
            file_type VARCHAR(36) DEFAULT NULL,
            user_id INT(11),
            content TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY(id)
        ) $charset_collate;";

        // taxonomy
        $sql7 = "CREATE TABLE IF NOT EXISTS  `".ACPT_Lite_DB::TABLE_TAXONOMY."` (
            id VARCHAR(36) UNIQUE NOT NULL,
            slug VARCHAR(32) UNIQUE NOT NULL,
            singular VARCHAR(255) NOT NULL,
            plural VARCHAR(255) NOT NULL,
            labels TEXT,
            settings TEXT,
            PRIMARY KEY(id)
        ) $charset_collate;";

        // taxonomy pivot
        $sql8 = "CREATE TABLE IF NOT EXISTS  `".ACPT_Lite_DB::TABLE_TAXONOMY_PIVOT."` (
            custom_post_type_id VARCHAR(36) NOT NULL,
            taxonomy_id VARCHAR(36) NOT NULL,
            PRIMARY KEY( `custom_post_type_id`, `taxonomy_id`)
        ) $charset_collate;";

        // acpt_custom_post_template
        $sql9 = "CREATE TABLE IF NOT EXISTS  `".ACPT_Lite_DB::TABLE_CUSTOM_POST_TEMPLATE."` (
            id VARCHAR(36) UNIQUE NOT NULL,
            post_type VARCHAR(20) NOT NULL,
            template_type VARCHAR(36) DEFAULT NULL,
            json TEXT,
            html TEXT,
            meta TEXT,
            PRIMARY KEY(id)
        ) $charset_collate;";

        // acpt_settings
        $sql10 = "CREATE TABLE IF NOT EXISTS  `".ACPT_Lite_DB::TABLE_SETTINGS."` (
            id VARCHAR(36) UNIQUE NOT NULL,
            meta_key VARCHAR(32) UNIQUE NOT NULL,
            meta_value VARCHAR(255) NOT NULL,
            PRIMARY KEY(id)
        ) $charset_collate;";

        // woocommerce productdata
        $sql11 = "CREATE TABLE IF NOT EXISTS  `".ACPT_Lite_DB::TABLE_WOOCOMMERCE_PRODUCT_DATA."` (
            id VARCHAR(36) UNIQUE NOT NULL,
            product_data_name VARCHAR(32) NOT NULL,
            icon VARCHAR(255) NOT NULL,
            visibility TEXT NOT NULL,
            show_in_ui TINYINT(1) NOT NULL,
            content TEXT DEFAULT NULL,
            PRIMARY KEY(id)
        ) $charset_collate;";

        // woocommerce productdata field
        $sql12 = "CREATE TABLE IF NOT EXISTS  `".ACPT_Lite_DB::TABLE_WOOCOMMERCE_PRODUCT_DATA_FIELD."` (
            id VARCHAR(36) UNIQUE NOT NULL,
            product_data_id VARCHAR(36) NOT NULL,
            field_name VARCHAR(50) NOT NULL,
            field_type VARCHAR(50) NOT NULL,
            field_default_value VARCHAR(50) DEFAULT NULL,
            field_description TEXT DEFAULT NULL,
            required TINYINT(1) NOT NULL,
            sort INT(11),
            PRIMARY KEY(id)
        ) $charset_collate;";

        // woocommerce productdata field option
        $sql13 = "CREATE TABLE IF NOT EXISTS  `".ACPT_Lite_DB::TABLE_WOOCOMMERCE_PRODUCT_DATA_OPTION."` (
            id VARCHAR(36) UNIQUE NOT NULL,
            product_data_id VARCHAR(36) NOT NULL,
            product_data_field_id VARCHAR(36) NOT NULL,
            option_label VARCHAR(50) NOT NULL,
            option_value VARCHAR(50) NOT NULL,
            sort INT(11),
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
        dbDelta($sql11);
        dbDelta($sql12);
        dbDelta($sql13);

        // alter tables
        if(!ACPT_Lite_DB::checkIfColumnExistsInTable(ACPT_Lite_DB::TABLE_TAXONOMY, 'native')){
            $wpdb->query("ALTER TABLE `".ACPT_Lite_DB::TABLE_TAXONOMY."` ADD  `native` TINYINT(1) NULL DEFAULT NULL ");
        }

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

        $wpdb->query("DROP TABLE IF EXISTS `".ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE."`;");
        $wpdb->query("DROP TABLE IF EXISTS `".ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_META_BOX."`;");
        $wpdb->query("DROP TABLE IF EXISTS `".ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_FIELD."`;");
        $wpdb->query("DROP TABLE IF EXISTS `".ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_OPTION."`;");
        $wpdb->query("DROP TABLE IF EXISTS `".ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_RELATION."`;");
        $wpdb->query("DROP TABLE IF EXISTS `".ACPT_Lite_DB::TABLE_CUSTOM_POST_TEMPLATE."`;");
        $wpdb->query("DROP TABLE IF EXISTS `".ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_IMPORT."`;");
        $wpdb->query("DROP TABLE IF EXISTS `".ACPT_Lite_DB::TABLE_TAXONOMY."`;");
        $wpdb->query("DROP TABLE IF EXISTS `".ACPT_Lite_DB::TABLE_TAXONOMY_PIVOT."`;");
        $wpdb->query("DROP TABLE IF EXISTS `".ACPT_Lite_DB::TABLE_SETTINGS."`;");
        $wpdb->query("DROP TABLE IF EXISTS `".ACPT_Lite_DB::TABLE_WOOCOMMERCE_PRODUCT_DATA."`;");
        $wpdb->query("DROP TABLE IF EXISTS `".ACPT_Lite_DB::TABLE_WOOCOMMERCE_PRODUCT_DATA_FIELD."`;");
        $wpdb->query("DROP TABLE IF EXISTS `".ACPT_Lite_DB::TABLE_WOOCOMMERCE_PRODUCT_DATA_OPTION."`;");

        return empty($wpdb->last_error);
    }
}