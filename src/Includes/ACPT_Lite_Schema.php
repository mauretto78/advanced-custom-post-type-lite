<?php

namespace ACPT_Lite\Includes;

class ACPT_Lite_Schema
{
	const COLUMN_INT = 'INT';
	const COLUMN_TINYINT = 'TINYINT';
	const COLUMN_TEXT = 'TEXT';
	const COLUMN_VARCHAR = 'VARCHAR';
	const COLUMN_TIMESTAMP = 'TIMESTAMP';

	/**
	 * This array describes the actual schema structure.
	 * It can be used to check and repair wrong/missing DB migrations
	 *
	 * @return array
	 */
    public static function get()
    {
    	return [
		    ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_BELONG )                          => [
			    'create' => "CREATE TABLE `" . ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_BELONG ) . "` (
					  `field_id` varchar(36) NOT NULL,
					  `rule_id` varchar(36)  NOT NULL,
					  PRIMARY KEY (`field_id`,`rule_id`)
					) " . ACPT_Lite_DB::getCharsetCollation() . ";",
			    'columns' => [
				    'field_id' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 36,
					    'unique' => false,
					    'nullable' => false,
					    'default' => null
				    ],
				    'rule_id' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 36,
					    'unique' => false,
					    'nullable' => false,
					    'default' => null
				    ],
			    ],
		    ],
		    ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE)                 => [
			    'create' => "CREATE TABLE `" . ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE) . "` (
					  `id` varchar(36) NOT NULL,
					  `post_name` varchar(20) NOT NULL,
					  `singular` varchar(255)  NOT NULL,
					  `plural` varchar(255) NOT NULL,
					  `icon` text NOT NULL,
					  `native` tinyint(1) DEFAULT '0',
					  `supports` text,
					  `labels` text,
					  `settings` text,
					  PRIMARY KEY (`id`),
					  UNIQUE KEY `id` (`id`),
					  UNIQUE KEY `post_name` (`post_name`)
					) " . ACPT_Lite_DB::getCharsetCollation() . ";",
			    'columns' => [
				    'id' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 36,
					    'unique' => true,
					    'nullable' => false,
					    'default' => null
				    ],
				    'post_name' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 20,
					    'unique' => false,
					    'nullable' => false,
					    'default' => null
				    ],
				    'singular' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 255,
					    'unique' => false,
					    'nullable' => false,
					    'default' => null
				    ],
				    'plural' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 255,
					    'unique' => false,
					    'nullable' => false,
					    'default' => null
				    ],
				    'icon' => [
					    'type' => self::COLUMN_TEXT,
					    'length' => null,
					    'unique' => false,
					    'nullable' => false,
					    'default' => null
				    ],
				    'native' => [
					    'type' => self::COLUMN_TINYINT,
					    'length' => 1,
					    'unique' => false,
					    'nullable' => true,
					    'default' => '0'
				    ],
				    'supports' => [
					    'type' => self::COLUMN_TEXT,
					    'length' => null,
					    'unique' => false,
					    'nullable' => true,
					    'default' => null
				    ],
				    'labels' => [
					    'type' => self::COLUMN_TEXT,
					    'length' => null,
					    'unique' => false,
					    'nullable' => true,
					    'default' => null
				    ],
				    'settings' => [
					    'type' => self::COLUMN_TEXT,
					    'length' => null,
					    'unique' => false,
					    'nullable' => true,
					    'default' => null
				    ],
			    ],
		    ],
		    ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_GROUP_BELONG)                => [
		    	'create' => "CREATE TABLE `" . ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_GROUP_BELONG) . "` (
					  `group_id` varchar(36)  NOT NULL,
					  `belong_id` varchar(36) NOT NULL,
					  PRIMARY KEY (`group_id`,`belong_id`)
					) " . ACPT_Lite_DB::getCharsetCollation() . ";",
			    'columns' => [
				    'group_id' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 36,
					    'unique' => false,
					    'nullable' => false,
					    'default' => null
				    ],
				    'belong_id' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 36,
					    'unique' => false,
					    'nullable' => false,
					    'default' => null
				    ],
			    ],
		    ],
		    ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_BOX)                         => [
		    	'create' => "CREATE TABLE `" . ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_BOX) . "` (
					  `id` varchar(36)  NOT NULL,
					  `meta_box_name` varchar(50) NOT NULL,
					  `sort` int DEFAULT NULL,
					  `meta_box_label` varchar(255) DEFAULT NULL,
					  `group_id` varchar(36) DEFAULT NULL,
					  PRIMARY KEY (`id`),
					  UNIQUE KEY `id` (`id`)
					) " . ACPT_Lite_DB::getCharsetCollation() . ";",
			    'columns' => [
				    'id' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 36,
					    'unique' => true,
					    'nullable' => false,
					    'default' => null
				    ],
				    'group_id' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 36,
					    'unique' => false,
					    'nullable' => false,
					    'default' => null
				    ],
				    'meta_box_name' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 50,
					    'unique' => false,
					    'nullable' => false,
					    'default' => null
				    ],
				    'meta_box_label' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 255,
					    'unique' => false,
					    'nullable' => true,
					    'default' => 'NULL'
				    ],
				    'sort'  => [
					    'type' => self::COLUMN_INT,
					    'length' => 11,
					    'unique' => false,
					    'nullable' => true,
					    'default' => 'NULL'
				    ],
			    ],
		    ],
		    ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_FIELD)                       => [
		    	'create' => "CREATE TABLE `" . ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_FIELD) . "` (
					  `id` varchar(36) NOT NULL,
					  `meta_box_id` varchar(36) NOT NULL,
					  `field_name` varchar(50) NOT NULL,
					  `field_type` varchar(50) NOT NULL,
					  `field_default_value` varchar(50) DEFAULT NULL,
					  `field_description` text,
					  `showInArchive` tinyint(1) NOT NULL,
					  `required` tinyint(1) NOT NULL,
					  `sort` int DEFAULT NULL,
					  `parent_id` varchar(36) DEFAULT NULL,
					  `block_id` varchar(36)  DEFAULT NULL,
					  `quick_edit` tinyint(1) DEFAULT NULL,
					  `filter_in_admin` tinyint(1) DEFAULT NULL,
					  `field_label` varchar(255) DEFAULT NULL,
					  PRIMARY KEY (`id`),
					  UNIQUE KEY `id` (`id`)
					) " . ACPT_Lite_DB::getCharsetCollation() . ";",
			    'columns' => [
				    'id' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 36,
					    'unique' => true,
					    'nullable' => false,
					    'default' => null
				    ],
				    'meta_box_id' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 36,
					    'unique' => false,
					    'nullable' => false,
					    'default' => null
				    ],
				    'field_name' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 50,
					    'unique' => false,
					    'nullable' => false,
					    'default' => null
				    ],
				    'field_type' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 50,
					    'unique' => false,
					    'nullable' => false,
					    'default' => null
				    ],
				    'field_default_value' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 50,
					    'unique' => false,
					    'nullable' => true,
					    'default' => 'NULL'
				    ],
				    'field_label' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 255,
					    'unique' => false,
					    'nullable' => true,
					    'default' => 'NULL'
				    ],
				    'field_description' => [
					    'type' => self::COLUMN_TEXT,
					    'length' => null,
					    'unique' => false,
					    'nullable' => true,
					    'default' => 'NULL'
				    ],
				    'showInArchive' => [
					    'type' => self::COLUMN_TINYINT,
					    'length' => 1,
					    'unique' => false,
					    'nullable' => false,
					    'default' => null
				    ],
				    'required' => [
					    'type' => self::COLUMN_TINYINT,
					    'length' => 1,
					    'unique' => false,
					    'nullable' => false,
					    'default' => null
				    ],
				    'quick_edit' => [
					    'type' => self::COLUMN_TINYINT,
					    'length' => 1,
					    'unique' => false,
					    'nullable' => true,
					    'default' => 'NULL'
				    ],
				    'filter_in_admin' => [
					    'type' => self::COLUMN_TINYINT,
					    'length' => 1,
					    'unique' => false,
					    'nullable' => true,
					    'default' => 'NULL'
				    ],
				    'sort'  => [
					    'type' => self::COLUMN_INT,
					    'length' => 11,
					    'unique' => false,
					    'nullable' => true,
					    'default' => 'NULL'
				    ],
				    'parent_id' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 36,
					    'unique' => false,
					    'nullable' => true,
					    'default' => 'NULL'
				    ],
				    'block_id' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 36,
					    'unique' => false,
					    'nullable' => true,
					    'default' => 'NULL'
				    ],
			    ],
		    ],
		    ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_GROUP)                       => [
		    	'create' => "CREATE TABLE `" . ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_GROUP) . "` (
					  `id` varchar(36) NOT NULL,
					  `group_name` varchar(255) NOT NULL,
					  `label` varchar(255) DEFAULT NULL,
					  `display` varchar(55) DEFAULT NULL,
					  PRIMARY KEY (`id`),
					  UNIQUE KEY `id` (`id`),
					  UNIQUE KEY `group_name` (`group_name`)
					) " . ACPT_Lite_DB::getCharsetCollation() . ";",
			    'columns' => [
				    'id' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 36,
					    'unique' => true,
					    'nullable' => false,
					    'default' => null
				    ],
				    'group_name' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 255,
					    'unique' => false,
					    'nullable' => false,
					    'default' => null
				    ],
				    'label' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 255,
					    'unique' => false,
					    'nullable' => true,
					    'default' => 'NULL'
				    ],
				    'display' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 55,
					    'unique' => false,
					    'nullable' => true,
					    'default' => 'NULL'
				    ],
			    ],
		    ],
		    ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_OPTION)                      => [
		    	'create' => "CREATE TABLE `" . ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_OPTION) . "` (
					  `id` varchar(36) NOT NULL,
					  `meta_box_id` varchar(36) NOT NULL,
					  `meta_field_id` varchar(36) NOT NULL,
					  `option_label` varchar(50) NOT NULL,
					  `option_value` varchar(50) NOT NULL,
					  `sort` int DEFAULT NULL,
					  `is_default` tinyint(1) NOT NULL DEFAULT '0',
					  PRIMARY KEY (`id`),
					  UNIQUE KEY `id` (`id`)
					) " . ACPT_Lite_DB::getCharsetCollation() . ";",
			    'columns' => [
				    'id' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 36,
					    'unique' => true,
					    'nullable' => false,
					    'default' => null
				    ],
				    'meta_box_id' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 36,
					    'unique' => false,
					    'nullable' => false,
					    'default' => null
				    ],
				    'meta_field_id' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 36,
					    'unique' => false,
					    'nullable' => false,
					    'default' => null
				    ],
				    'option_label' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 50,
					    'unique' => false,
					    'nullable' => false,
					    'default' => null
				    ],
				    'option_value' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 50,
					    'unique' => false,
					    'nullable' => true,
					    'default' => 'NULL'
				    ],
				    'is_default'  => [
					    'type' => self::COLUMN_TINYINT,
					    'length' => 1,
					    'unique' => false,
					    'nullable' => false,
					    'default' => '0'
				    ],
				    'sort'  => [
					    'type' => self::COLUMN_INT,
					    'length' => 11,
					    'unique' => false,
					    'nullable' => true,
					    'default' => 'NULL'
				    ],
			    ],
		    ],
		    ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_SETTINGS)                         => [
			    'create' => "CREATE TABLE `" . ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_SETTINGS) . "` (
					  `id` varchar(36)  NOT NULL,
					  `meta_key` varchar(32) NOT NULL,
					  `meta_value` varchar(255) NOT NULL,
					  PRIMARY KEY (`id`),
					  UNIQUE KEY `id` (`id`),
					  UNIQUE KEY `meta_key` (`meta_key`)
					) " . ACPT_Lite_DB::getCharsetCollation() . ";",
			    'columns' => [
				    'id' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 36,
					    'unique' => true,
					    'nullable' => false,
					    'default' => null
				    ],
				    'meta_key' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 32,
					    'unique' => false,
					    'nullable' => false,
					    'default' => null
				    ],
				    'meta_value' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 255,
					    'unique' => false,
					    'nullable' => false,
					    'default' => null
				    ],
			    ],
		    ],
		    ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_TAXONOMY)                         => [
		    	'create' => "CREATE TABLE `" . ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_TAXONOMY) . "` (
					  `id` varchar(36) NOT NULL,
					  `slug` varchar(32) NOT NULL,
					  `singular` varchar(255) NOT NULL,
					  `plural` varchar(255) NOT NULL,
					  `labels` text,
					  `settings` text,
					  `native` tinyint(1) DEFAULT NULL,
					  PRIMARY KEY (`id`),
					  UNIQUE KEY `id` (`id`),
					  UNIQUE KEY `slug` (`slug`)
					) " . ACPT_Lite_DB::getCharsetCollation() . ";",
			    'columns' => [
				    'id' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 36,
					    'unique' => true,
					    'nullable' => false,
					    'default' => null
				    ],
				    'slug' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 32,
					    'unique' => false,
					    'nullable' => false,
					    'default' => null
				    ],
				    'singular' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 255,
					    'unique' => false,
					    'nullable' => false,
					    'default' => null
				    ],
				    'plural' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 255,
					    'unique' => false,
					    'nullable' => false,
					    'default' => null
				    ],
				    'native' => [
					    'type' => self::COLUMN_TINYINT,
					    'length' => 1,
					    'unique' => false,
					    'nullable' => true,
					    'default' => '0'
				    ],
				    'supports' => [
					    'type' => self::COLUMN_TEXT,
					    'length' => null,
					    'unique' => false,
					    'nullable' => true,
					    'default' => null
				    ],
				    'labels' => [
					    'type' => self::COLUMN_TEXT,
					    'length' => null,
					    'unique' => false,
					    'nullable' => true,
					    'default' => null
				    ],
			    ],
		    ],
		    ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_TAXONOMY_PIVOT)                   => [
			    'create' => "CREATE TABLE `" . ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_TAXONOMY_PIVOT) . "` (
					  `custom_post_type_id` varchar(36) NOT NULL,
					  `taxonomy_id` varchar(36) NOT NULL,
					  PRIMARY KEY (`custom_post_type_id`,`taxonomy_id`)
					) " . ACPT_Lite_DB::getCharsetCollation() . ";",
			    'columns' => [
				    'custom_post_type_id' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 36,
					    'unique' => false,
					    'nullable' => false,
					    'default' => null
				    ],
				    'taxonomy_id' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 36,
					    'unique' => false,
					    'nullable' => false,
					    'default' => null
				    ],
			    ],
		    ],
		    ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_WOOCOMMERCE_PRODUCT_DATA)         => [
		    	'create' => "CREATE TABLE `" . ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_WOOCOMMERCE_PRODUCT_DATA) . "` (
					  `id` varchar(36) NOT NULL,
					  `product_data_name` varchar(32) NOT NULL,
					  `icon` varchar(255) NOT NULL,
					  `visibility` text NOT NULL,
					  `show_in_ui` tinyint(1) NOT NULL,
					  `content` text,
					  PRIMARY KEY (`id`),
					  UNIQUE KEY `id` (`id`)
					) " . ACPT_Lite_DB::getCharsetCollation() . ";",
			    'columns' => [
				    'id' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 36,
					    'unique' => true,
					    'nullable' => false,
					    'default' => null
				    ],
				    'product_data_name' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 32,
					    'unique' => false,
					    'nullable' => false,
					    'default' => null
				    ],
				    'icon' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 255,
					    'unique' => false,
					    'nullable' => false,
					    'default' => null
				    ],
				    'text' => [
					    'type' => self::COLUMN_TEXT,
					    'length' => null,
					    'unique' => false,
					    'nullable' => false,
					    'default' => null
				    ],
				    'show_in_ui' => [
					    'type' => self::COLUMN_TINYINT,
					    'length' => null,
					    'unique' => false,
					    'nullable' => false,
					    'default' => "1"
				    ],
				    'content' => [
					    'type' => self::COLUMN_TEXT,
					    'length' => null,
					    'unique' => false,
					    'nullable' => true,
					    'default' => 'NULL'
				    ],
			    ],
		    ],
		    ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_WOOCOMMERCE_PRODUCT_DATA_FIELD)   => [
		    	'create' => "CREATE TABLE `" . ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_WOOCOMMERCE_PRODUCT_DATA_FIELD) . "` (
					  `id` varchar(36) NOT NULL,
					  `product_data_id` varchar(36) NOT NULL,
					  `field_name` varchar(50) NOT NULL,
					  `field_type` varchar(50) NOT NULL,
					  `field_default_value` varchar(50) DEFAULT NULL,
					  `field_description` text,
					  `required` tinyint(1) NOT NULL,
					  `sort` int DEFAULT NULL,
					  PRIMARY KEY (`id`),
					  UNIQUE KEY `id` (`id`)
					) " . ACPT_Lite_DB::getCharsetCollation() . ";",
			    'columns' => [
				    'id' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 36,
					    'unique' => true,
					    'nullable' => false,
					    'default' => null
				    ],
				    'product_data_id' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 36,
					    'unique' => false,
					    'nullable' => false,
					    'default' => null
				    ],
				    'field_name' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 50,
					    'unique' => false,
					    'nullable' => false,
					    'default' => null
				    ],
				    'field_type' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 50,
					    'unique' => false,
					    'nullable' => false,
					    'default' => null
				    ],
				    'field_default_value' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 50,
					    'unique' => false,
					    'nullable' => false,
					    'default' => null
				    ],
				    'field_description' => [
					    'type' => self::COLUMN_TEXT,
					    'length' => null,
					    'unique' => false,
					    'nullable' => true,
					    'default' => 'NULL'
				    ],
				    'required' => [
					    'type' => self::COLUMN_TINYINT,
					    'length' => 1,
					    'unique' => false,
					    'nullable' => true,
					    'default' => '1'
				    ],
				    'sort' => [
					    'type' => self::COLUMN_INT,
					    'length' => 11,
					    'unique' => false,
					    'nullable' => true,
					    'default' => 'NULL'
				    ],
			    ],
		    ],
		    ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_WOOCOMMERCE_PRODUCT_DATA_OPTION)  => [
		    	'create' => "CREATE TABLE `" . ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_WOOCOMMERCE_PRODUCT_DATA_OPTION) . "` (
					  `id` varchar(36) NOT NULL,
					  `product_data_id` varchar(36) NOT NULL,
					  `product_data_field_id` varchar(36) NOT NULL,
					  `option_label` varchar(50) NOT NULL,
					  `option_value` varchar(50) NOT NULL,
					  `sort` int DEFAULT NULL,
					  PRIMARY KEY (`id`),
					  UNIQUE KEY `id` (`id`)
					) " . ACPT_Lite_DB::getCharsetCollation() . ";",
			    'columns' => [
				    'id' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 36,
					    'unique' => true,
					    'nullable' => false,
					    'default' => null
				    ],
				    'product_data_id' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 36,
					    'unique' => false,
					    'nullable' => false,
					    'default' => null
				    ],
				    'product_data_field_id' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 36,
					    'unique' => false,
					    'nullable' => false,
					    'default' => null
				    ],
				    'option_label' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 50,
					    'unique' => false,
					    'nullable' => false,
					    'default' => null
				    ],
				    'option_value' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 50,
					    'unique' => false,
					    'nullable' => false,
					    'default' => null
				    ],
				    'sort' => [
					    'type' => self::COLUMN_INT,
					    'length' => 11,
					    'unique' => false,
					    'nullable' => true,
					    'default' => 'NULL'
				    ],
			    ],
		    ],
	    ];
    }
}