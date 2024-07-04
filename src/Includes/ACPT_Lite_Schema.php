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
		    ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_API_KEYS)                         => [
			    'create' => "CREATE TABLE IF NOT EXISTS `" . ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_API_KEYS) . "` (
			            id VARCHAR(36) UNIQUE NOT NULL,
			            uid INT(11) UNIQUE NOT NULL,
			            api_key VARCHAR(36) NOT NULL,
			            api_secret VARCHAR(36) NOT NULL,
			            created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
			            PRIMARY KEY(`id`, `uid`),
			            UNIQUE KEY `api_key_and_secret` (`api_key`, `api_secret`) USING BTREE
			        ) " . ACPT_Lite_DB::getCharsetCollation() . ";",
			    'columns' => [
				    'id' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 36,
					    'unique' => true,
					    'nullable' => false,
					    'default' => null
				    ],
				    'uid' => [
					    'type' => self::COLUMN_INT,
					    'length' => 11,
					    'unique' => true,
					    'nullable' => false,
					    'default' => null
				    ],
				    'api_key' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 36,
					    'unique' => false,
					    'nullable' => false,
					    'default' => null
				    ],
				    'api_secret' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 36,
					    'unique' => false,
					    'nullable' => false,
					    'default' => null
				    ],
				    'created_at' => [
					    'type' => self::COLUMN_TIMESTAMP,
					    'length' => null,
					    'unique' => false,
					    'nullable' => false,
					    'default' => 'CURRENT_TIMESTAMP'
				    ],
			    ]
		    ],
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
		    ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_IMPORT)          => [
			    'create' => "CREATE TABLE `" . ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_IMPORT) . "` (
					  `id` varchar(36) NOT NULL,
					  `file` varchar(255) NOT NULL,
					  `url` varchar(255) NOT NULL,
					  `file_type` varchar(36) DEFAULT NULL,
					  `user_id` int DEFAULT NULL,
					  `content` text ,
					  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
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
				    'file' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 255,
					    'unique' => false,
					    'nullable' => false,
					    'default' => null
				    ],
				    'url' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 255,
					    'unique' => false,
					    'nullable' => false,
					    'default' => null
				    ],
				    'file_type' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 36,
					    'unique' => false,
					    'nullable' => true,
					    'default' => "NULL"
				    ],
				    'user_id' => [
					    'type' => self::COLUMN_INT,
					    'length' => 11,
					    'unique' => false,
					    'nullable' => true,
					    'default' => "NULL"
				    ],
				    'content' => [
					    'type' => self::COLUMN_TEXT,
					    'length' => null,
					    'unique' => false,
					    'nullable' => true,
					    'default' => "NULL"
				    ],
				    'created_at' => [
					    'type' => self::COLUMN_TIMESTAMP,
					    'length' => null,
					    'unique' => false,
					    'nullable' => true,
					    'default' => 'CURRENT_TIMESTAMP'
				    ],
			    ],
		    ],
		    ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_DATASET)                          => [
		    	'create' => "CREATE TABLE `" . ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_DATASET) . "` (
					  `id` varchar(36) NOT NULL,
					  `dataset_name` varchar(255) NOT NULL,
					  `label` varchar(255) DEFAULT NULL,
					  PRIMARY KEY (`id`),
					  UNIQUE KEY `id` (`id`),
					  UNIQUE KEY `dataset_name` (`dataset_name`)
					) " . ACPT_Lite_DB::getCharsetCollation() . ";",
			    'columns' => [
				    'id' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 36,
					    'unique' => true,
					    'nullable' => false,
					    'default' => null
				    ],
				    'dataset_name' => [
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
			    ],
		    ],
		    ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_DATASET_ITEM)                     => [
		    	'create' => "CREATE TABLE `" . ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_DATASET_ITEM) . "` (
					  `id` varchar(36) NOT NULL,
					  `dataset_id` varchar(36)  NOT NULL,
					  `item_label` varchar(50) NOT NULL,
					  `item_value` varchar(50) NOT NULL,
					  `is_default` tinyint(1) NOT NULL DEFAULT '0',
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
				    'dataset_id' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 36,
					    'unique' => false,
					    'nullable' => false,
					    'default' => null
				    ],
				    'item_label' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 50,
					    'unique' => false,
					    'nullable' => false,
					    'default' => null
				    ],
				    'item_value' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 50,
					    'unique' => false,
					    'nullable' => false,
					    'default' => null
				    ],
				    'is_default' => [
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
		    ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_FORM)                             => [
		    	'create' => "CREATE TABLE `" . ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_FORM) . "` (
					  `id` varchar(36)   NOT NULL,
					  `form_name` varchar(255) NOT NULL,
					  `label` varchar(255) DEFAULT NULL,
					  `form_action` varchar(12) NOT NULL,
					  `form_key` varchar(12) NOT NULL,
					  PRIMARY KEY (`id`),
					  UNIQUE KEY `id` (`id`),
					  UNIQUE KEY `form_name` (`form_name`),
					  UNIQUE KEY `form_key` (`form_key`)
					) " . ACPT_Lite_DB::getCharsetCollation() . ";",
			    'columns' => [
				    'id' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 36,
					    'unique' => true,
					    'nullable' => false,
					    'default' => null
				    ],
				    'form_name' => [
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
				    'form_action' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 12,
					    'unique' => false,
					    'nullable' => false,
					    'default' => null
				    ],
				    'form_key' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 12,
					    'unique' => false,
					    'nullable' => false,
					    'default' => null
				    ],
			    ],
		    ],
		    ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_FORM_FIELD)                       => [
		    	'create' => "CREATE TABLE `" . ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_FORM_FIELD) . "` (
					  `id` varchar(36) NOT NULL,
					  `form_id` varchar(36) NOT NULL,
					  `meta_field_id` varchar(36) DEFAULT NULL,
					  `field_group` varchar(36) NOT NULL,
					  `field_type` varchar(36) NOT NULL,
					  `field_key` varchar(12) NOT NULL,
					  `field_name` varchar(255) NOT NULL,
					  `field_label` varchar(255) DEFAULT NULL,
					  `description` text,
					  `extra` text,
					  `settings` text,
					  `required` tinyint(1) NOT NULL,
					  `sort` int DEFAULT NULL,
					  PRIMARY KEY (`id`),
					  UNIQUE KEY `id` (`id`),
					  UNIQUE KEY `field_key` (`field_key`)
					) " . ACPT_Lite_DB::getCharsetCollation() . ";",
			    'columns' => [
				    'id' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 36,
					    'unique' => true,
					    'nullable' => false,
					    'default' => null
				    ],
				    'form_id' => [
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
					    'nullable' => true,
					    'default' => 'NULL'
				    ],
				    'field_group' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 36,
					    'unique' => false,
					    'nullable' => false,
					    'default' => null
				    ],
				    'field_type' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 36,
					    'unique' => false,
					    'nullable' => false,
					    'default' => null
				    ],
				    'field_key' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 12,
					    'unique' => false,
					    'nullable' => false,
					    'default' => null
				    ],
				    'field_name' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 255,
					    'unique' => false,
					    'nullable' => false,
					    'default' => null
				    ],
				    'field_label' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 255,
					    'unique' => false,
					    'nullable' => true,
					    'default' => 'NULL'
				    ],
				    'description' => [
					    'type' => self::COLUMN_TEXT,
					    'length' => null,
					    'unique' => false,
					    'nullable' => true,
					    'default' => 'NULL'
				    ],
				    'extra' => [
					    'type' => self::COLUMN_TEXT,
					    'length' => null,
					    'unique' => false,
					    'nullable' => true,
					    'default' => 'NULL'
				    ],
				    'settings' => [
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
					    'nullable' => false,
					    'default' => null
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
		    ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_FORM_METADATA)                    => [
		    	'create' => "CREATE TABLE `" . ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_FORM_METADATA) . "` (
					  `id` varchar(36) NOT NULL,
					  `form_id` varchar(36)  NOT NULL,
					  `meta_key` varchar(255) DEFAULT NULL,
					  `meta_value` text NOT NULL,
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
				    'form_id' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 36,
					    'unique' => false,
					    'nullable' => false,
					    'default' => null
				    ],
				    'meta_key' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 255,
					    'unique' => false,
					    'nullable' => true,
					    'default' => 'NULL'
				    ],
				    'meta_value' => [
					    'type' => self::COLUMN_TEXT,
					    'length' => null,
					    'unique' => false,
					    'nullable' => false,
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
		    ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_ADVANCED_OPTION)             => [
		    	'create' => "CREATE TABLE `" . ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_ADVANCED_OPTION) . "` (
					  `id` varchar(36) NOT NULL,
					  `meta_box_id` varchar(36) NOT NULL,
					  `meta_field_id` varchar(36) NOT NULL,
					  `option_key` varchar(50) NOT NULL,
					  `option_value` varchar(50) NOT NULL,
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
				    'option_key' => [
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
			    ],
		    ],
		    ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_BLOCK)                       => [
		    	'create' => "CREATE TABLE `wp_acpt_meta_block` (
					  `id` varchar(36) NOT NULL,
					  `meta_box_id` varchar(36) NOT NULL,
					  `meta_field_id` varchar(36) NOT NULL,
					  `block_name` varchar(50) NOT NULL,
					  `block_label` varchar(255) DEFAULT NULL,
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
				    'block_name' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 50,
					    'unique' => false,
					    'nullable' => false,
					    'default' => null
				    ],
				    'block_label' => [
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
		    ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_RELATION)                    => [
		    	'create' => "CREATE TABLE `" . ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_RELATION) . "` (
					  `id` varchar(36) NOT NULL,
					  `meta_box_id` varchar(36) NOT NULL,
					  `meta_field_id` varchar(36) NOT NULL,
					  `relationship` varchar(50) NOT NULL,
					  `relation_from` varchar(255) NOT NULL,
					  `inversed_meta_box_id` varchar(36) DEFAULT NULL,
					  `inversed_meta_box_name` varchar(50) DEFAULT NULL,
					  `inversed_meta_field_id` varchar(36) DEFAULT NULL,
					  `inversed_meta_field_name` varchar(50) DEFAULT NULL,
					  `relation_to` varchar(255) NOT NULL,
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
				    'relationship' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 50,
					    'unique' => false,
					    'nullable' => false,
					    'default' => null
				    ],
				    'relation_from' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 255,
					    'unique' => false,
					    'nullable' => false,
					    'default' => null
				    ],
				    'relation_to' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 255,
					    'unique' => false,
					    'nullable' => false,
					    'default' => null
				    ],
				    'inversed_meta_box_id' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 36,
					    'unique' => false,
					    'nullable' => true,
					    'default' => 'NULL'
				    ],
				    'inversed_meta_box_name' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 36,
					    'unique' => false,
					    'nullable' => true,
					    'default' => 'NULL'
				    ],
				    'inversed_meta_field_id' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 36,
					    'unique' => false,
					    'nullable' => true,
					    'default' => 'NULL'
				    ],
				    'inversed_meta_field_name' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 36,
					    'unique' => false,
					    'nullable' => true,
					    'default' => 'NULL'
				    ],
			    ],
		    ],
		    ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_VISIBILITY)                  => [
		    	'create' => "CREATE TABLE `wp_acpt_meta_visibility` (
						  `id` varchar(36) NOT NULL,
						  `meta_box_id` varchar(36)  NOT NULL,
						  `meta_field_id` varchar(36) NOT NULL,
						  `visibility_type` text NOT NULL,
						  `operator` varchar(20) NOT NULL,
						  `visibility_value` varchar(255) NOT NULL,
						  `logic` varchar(3) DEFAULT NULL,
						  `sort` int DEFAULT NULL,
						  `back_end` tinyint(1) NOT NULL DEFAULT '1',
						  `front_end` tinyint(1) NOT NULL DEFAULT '1',
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
				    'visibility_type' => [
					    'type' => self::COLUMN_TEXT,
					    'length' => null,
					    'unique' => false,
					    'nullable' => false,
					    'default' => null
				    ],
				    'operator' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 20,
					    'unique' => false,
					    'nullable' => false,
					    'default' => null
				    ],
				    'visibility_value' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 255,
					    'unique' => false,
					    'nullable' => false,
					    'default' => null
				    ],
				    'logic' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 3,
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
				    'back_end' => [
					    'type' => self::COLUMN_TINYINT,
					    'length' => 1,
					    'unique' => false,
					    'nullable' => false,
					    'default' => "1"
				    ],
				    'front_end' => [
					    'type' => self::COLUMN_TINYINT,
					    'length' => 1,
					    'unique' => false,
					    'nullable' => false,
					    'default' => "1"
				    ],
			    ],
		    ],
		    ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_OPTION_PAGE)                      => [
			    'create' => "CREATE TABLE `" . ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_OPTION_PAGE) . "` (
					  `id` varchar(36) NOT NULL,
					  `page_title` varchar(64) NOT NULL,
					  `menu_title` varchar(64) NOT NULL,
					  `capability` varchar(64) NOT NULL,
					  `menu_slug` varchar(64) NOT NULL,
					  `icon` varchar(255) NOT NULL,
					  `description` text,
					  `parent_id` varchar(36) DEFAULT NULL,
					  `sort` int DEFAULT NULL,
					  `page_position` int DEFAULT NULL,
					  PRIMARY KEY (`id`),
					  UNIQUE KEY `id` (`id`),
					  UNIQUE KEY `menu_slug` (`menu_slug`)
					) " . ACPT_Lite_DB::getCharsetCollation() . ";",
			    'columns' => [
				    'id' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 36,
					    'unique' => true,
					    'nullable' => false,
					    'default' => null
				    ],
				    'page_title'  => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 64,
					    'unique' => false,
					    'nullable' => false,
					    'default' => null
				    ],
				    'menu_title'  => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 64,
					    'unique' => false,
					    'nullable' => false,
					    'default' => null
				    ],
				    'capability'  => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 64,
					    'unique' => false,
					    'nullable' => false,
					    'default' => null
				    ],
				    'menu_slug'  => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 64,
					    'unique' => false,
					    'nullable' => false,
					    'default' => null
				    ],
				    'icon'  => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 255,
					    'unique' => false,
					    'nullable' => false,
					    'default' => null
				    ],
				    'description'  => [
					    'type' => self::COLUMN_TEXT,
					    'length' => null,
					    'unique' => false,
					    'nullable' => true,
					    'default' => 'NULL'
				    ],
				    'parent_id'  => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 36,
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
				    'page_position'  => [
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
		    ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_VALIDATION_RULE)                  => [
			    'create' => "CREATE TABLE `" . ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_VALIDATION_RULE) . "` (
					  `id` varchar(36) NOT NULL,
					  `rule_condition` varchar(50) NOT NULL,
					  `rule_value` varchar(255) DEFAULT NULL,
					  `message` text,
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
				    'rule_condition' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 50,
					    'unique' => false,
					    'nullable' => false,
					    'default' => null
				    ],
				    'rule_value' => [
					    'type' => self::COLUMN_VARCHAR,
					    'length' => 255,
					    'unique' => false,
					    'nullable' => false,
					    'default' => null
				    ],
				    'message' => [
					    'type' => self::COLUMN_TEXT,
					    'length' => null,
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
		    ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_VALIDATION_RULE_FIELD_PIVOT)      => [
			    'create' => "CREATE TABLE `" . ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_VALIDATION_RULE_FIELD_PIVOT) . "` (
					  `field_id` varchar(36) NOT NULL,
					  `rule_id` varchar(36) NOT NULL,
					  PRIMARY KEY (`rule_id`,`rule_id`)
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
		    ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_VALIDATION_RULE_FORM_FIELD_PIVOT) => [
		    	'create' => "CREATE TABLE `" . ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_VALIDATION_RULE_FORM_FIELD_PIVOT) . "` (
					  `field_id` varchar(36) NOT NULL,
					  `rule_id` varchar(36) NOT NULL,
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