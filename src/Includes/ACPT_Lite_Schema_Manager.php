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
        $conn = ACPT_Lite_DB::getDbConn();
        $charset_collate = self::getCharsetCollation();

        ///////////////////////////////////////////////////
        /// 1. CREATE TABLES
        ///////////////////////////////////////////////////

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
        $sql2 = "CREATE TABLE IF NOT EXISTS `".ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_META_BOX."` (
            id VARCHAR(36) UNIQUE NOT NULL,
            post_type VARCHAR(20) NOT NULL,
            meta_box_name VARCHAR(50) NOT NULL,
            sort INT(11),
            PRIMARY KEY(id)
        ) $charset_collate;";

        // field
        $sql3 = "CREATE TABLE IF NOT EXISTS `".ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_FIELD."` (
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
        $sql4 = "CREATE TABLE IF NOT EXISTS `".ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_OPTION."` (
            id VARCHAR(36) UNIQUE NOT NULL,
            meta_box_id VARCHAR(36) NOT NULL,
            meta_field_id VARCHAR(36) NOT NULL,
            option_label VARCHAR(50) NOT NULL,
            option_value VARCHAR(50) NOT NULL,
            sort INT(11),
            PRIMARY KEY(id)
        ) $charset_collate;";

        // relations
        $sql5 = "CREATE TABLE IF NOT EXISTS `".ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_RELATION."` (
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
        $sql6 = "CREATE TABLE IF NOT EXISTS `".ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_IMPORT."` (
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
        $sql7 = "CREATE TABLE IF NOT EXISTS `".ACPT_Lite_DB::TABLE_TAXONOMY."` (
            id VARCHAR(36) UNIQUE NOT NULL,
            slug VARCHAR(32) UNIQUE NOT NULL,
            singular VARCHAR(255) NOT NULL,
            plural VARCHAR(255) NOT NULL,
            labels TEXT,
            settings TEXT,
            PRIMARY KEY(id)
        ) $charset_collate;";

        // taxonomy pivot
        $sql8 = "CREATE TABLE IF NOT EXISTS `".ACPT_Lite_DB::TABLE_TAXONOMY_PIVOT."` (
            custom_post_type_id VARCHAR(36) NOT NULL,
            taxonomy_id VARCHAR(36) NOT NULL,
            PRIMARY KEY( `custom_post_type_id`, `taxonomy_id`)
        ) $charset_collate;";

        // acpt_custom_post_template
        $sql9 = "CREATE TABLE IF NOT EXISTS `".ACPT_Lite_DB::TABLE_CUSTOM_POST_TEMPLATE."` (
            id VARCHAR(36) UNIQUE NOT NULL,
            post_type VARCHAR(20) NOT NULL,
            template_type VARCHAR(36) DEFAULT NULL,
            json TEXT,
            html TEXT,
            meta TEXT,
            PRIMARY KEY(id)
        ) $charset_collate;";

        // acpt_settings
        $sql10 = "CREATE TABLE IF NOT EXISTS `".ACPT_Lite_DB::TABLE_SETTINGS."` (
            id VARCHAR(36) UNIQUE NOT NULL,
            meta_key VARCHAR(32) UNIQUE NOT NULL,
            meta_value VARCHAR(255) NOT NULL,
            PRIMARY KEY(id)
        ) $charset_collate;";

        // WooCommerce product data
        $sql11 = "CREATE TABLE IF NOT EXISTS `".ACPT_Lite_DB::TABLE_WOOCOMMERCE_PRODUCT_DATA."` (
            id VARCHAR(36) UNIQUE NOT NULL,
            product_data_name VARCHAR(32) NOT NULL,
            icon VARCHAR(255) NOT NULL,
            visibility TEXT NOT NULL,
            show_in_ui TINYINT(1) NOT NULL,
            content TEXT DEFAULT NULL,
            PRIMARY KEY(id)
        ) $charset_collate;";

        // WooCommerce product data field
        $sql12 = "CREATE TABLE IF NOT EXISTS `".ACPT_Lite_DB::TABLE_WOOCOMMERCE_PRODUCT_DATA_FIELD."` (
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

        // WooCommerce product data field option
        $sql13 = "CREATE TABLE IF NOT EXISTS `".ACPT_Lite_DB::TABLE_WOOCOMMERCE_PRODUCT_DATA_OPTION."` (
            id VARCHAR(36) UNIQUE NOT NULL,
            product_data_id VARCHAR(36) NOT NULL,
            product_data_field_id VARCHAR(36) NOT NULL,
            option_label VARCHAR(50) NOT NULL,
            option_value VARCHAR(50) NOT NULL,
            sort INT(11),
            PRIMARY KEY(id)
        ) $charset_collate;";

        // user meta box
        $sql14 = "CREATE TABLE IF NOT EXISTS `".ACPT_Lite_DB::TABLE_USER_META_BOX."` (
            id VARCHAR(36) UNIQUE NOT NULL,
            meta_box_name VARCHAR(50) NOT NULL,
            sort INT(11),
            PRIMARY KEY(id)
        ) $charset_collate;";

        // user meta field
        $sql15 = "CREATE TABLE IF NOT EXISTS `".ACPT_Lite_DB::TABLE_USER_META_FIELD."` (
            id VARCHAR(36) UNIQUE NOT NULL,
            user_meta_box_id VARCHAR(36) NOT NULL,
            field_name VARCHAR(50) NOT NULL,
            field_type VARCHAR(50) NOT NULL,
            field_default_value VARCHAR(50) DEFAULT NULL,
            field_description TEXT DEFAULT NULL,
            showInArchive TINYINT(1) NOT NULL,
            required TINYINT(1) NOT NULL,
            sort INT(11),
            PRIMARY KEY(id)
        ) $charset_collate;";

        // user meta field option
        $sql16 = "CREATE TABLE IF NOT EXISTS `".ACPT_Lite_DB::TABLE_USER_META_FIELD_OPTION."` (
            id VARCHAR(36) UNIQUE NOT NULL,
            user_meta_box_id VARCHAR(36) NOT NULL,
            user_meta_field_id VARCHAR(36) NOT NULL,
            option_label VARCHAR(50) NOT NULL,
            option_value VARCHAR(50) NOT NULL,
            sort INT(11),
            PRIMARY KEY(id)
        ) $charset_collate;";
        
        $conn->query($sql1);
        $conn->query($sql2);
        $conn->query($sql3);
        $conn->query($sql4);
        $conn->query($sql5);
        $conn->query($sql6);
        $conn->query($sql7);
        $conn->query($sql8);
        $conn->query($sql9);
        $conn->query($sql10);
        $conn->query($sql11);
        $conn->query($sql12);
        $conn->query($sql13);
        $conn->query($sql14);
        $conn->query($sql15);
        $conn->query($sql16);

        ///////////////////////////////////////////////////
        /// 2. ALTER TABLES
        ///////////////////////////////////////////////////

        if(!ACPT_Lite_DB::checkIfColumnExistsInTable(ACPT_Lite_DB::TABLE_TAXONOMY, 'native')){
            $conn->query("ALTER TABLE `".ACPT_Lite_DB::TABLE_TAXONOMY."` ADD  `native` TINYINT(1) NULL DEFAULT NULL ");
        }

        ///////////////////////////////////////////////////
        /// 3. ADD PREFIX TO TABLES
        ///////////////////////////////////////////////////

        foreach (self::getAllUnprefixedTables() as $table){
            if ($result = $conn->query("SHOW TABLES LIKE '".ACPT_Lite_DB::prefixedTableName($table)."'")) {
                if($result->num_rows !== 1) {
                    $conn->query("RENAME TABLE `".$table."` TO `".ACPT_Lite_DB::prefixedTableName($table)."`;");
                }
            }
        }

        ///////////////////////////////////////////////////
        /// 4. REMOVE LEGACY TABLES
        ///////////////////////////////////////////////////

        foreach (self::getAllUnprefixedTables() as $table){
            $conn->query("DROP TABLE IF EXISTS `".$table."`;");
        }

        return empty($conn->last_error);
    }

    /**
     * Return the correct charset collation
     *
     * @return string
     */
    private static function getCharsetCollation()
    {
        global $wpdb;

        $charset_collate = "";
        $collation = $wpdb->get_row("SHOW FULL COLUMNS FROM {$wpdb->posts} WHERE field = 'post_content'");

        if(isset($collation->Collation)) {
            $charset = explode('_', $collation->Collation);

            if(is_array($charset) && count($charset) > 1) {
                $charset = $charset[0];
                $charset_collate = "DEFAULT CHARACTER SET {$charset} COLLATE {$collation->Collation}";
            }
        }

        if(empty($charset_collate)) { $charset_collate = $wpdb->get_charset_collate(); }

        return $charset_collate;
    }

    /**
     * Destroy the schema
     * (both legacy and prefixed tables)
     *
     * @return bool
     */
    public static function down()
    {
        $conn = ACPT_Lite_DB::getDbConn();

        foreach (self::getAllUnprefixedTables() as $table){
            $conn->query("DROP TABLE IF EXISTS `".$table."`;");
            $conn->query("DROP TABLE IF EXISTS `".ACPT_Lite_DB::prefixedTableName($table)."`;");
        }

        return empty($conn->last_error);
    }

    /**
     * @return array
     */
    private static function getAllUnprefixedTables()
    {
        return [
            ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE,
            ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_META_BOX,
            ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_FIELD,
            ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_OPTION,
            ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_RELATION,
            ACPT_Lite_DB::TABLE_CUSTOM_POST_TEMPLATE,
            ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_IMPORT,
            ACPT_Lite_DB::TABLE_TAXONOMY,
            ACPT_Lite_DB::TABLE_TAXONOMY_PIVOT,
            ACPT_Lite_DB::TABLE_SETTINGS,
            ACPT_Lite_DB::TABLE_WOOCOMMERCE_PRODUCT_DATA,
            ACPT_Lite_DB::TABLE_WOOCOMMERCE_PRODUCT_DATA_FIELD,
            ACPT_Lite_DB::TABLE_WOOCOMMERCE_PRODUCT_DATA_OPTION,
            ACPT_Lite_DB::TABLE_USER_META_BOX,
            ACPT_Lite_DB::TABLE_USER_META_FIELD,
            ACPT_Lite_DB::TABLE_USER_META_FIELD_OPTION,
        ];
    }
}