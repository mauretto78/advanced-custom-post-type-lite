<?php

namespace Bricks\Integrations\Dynamic_Data\Providers;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Helper\Currencies;
use ACPT_Lite\Core\Helper\Lengths;
use ACPT_Lite\Core\Helper\Weights;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Core\Models\OptionPage\OptionPageModel;
use ACPT_Lite\Core\Models\Taxonomy\TaxonomyModel;
use ACPT_Lite\Core\Repository\OptionPageRepository;
use ACPT_Lite\Core\Repository\TaxonomyRepository;
use ACPT_Lite\Utils\PHP\Date;
use ACPT_Lite\Utils\PHP\Phone;
use ACPT_Lite\Utils\Wordpress\Translator;
use ACPT_Lite\Utils\Wordpress\WPAttachment;
use ACPT_Lite\Utils\Wordpress\WPUtils;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Provider_ACPT extends Base
{
	/**
	 * @return bool
	 */
	public static function load_me()
	{
		return class_exists( 'ACPT' );
	}

	/**
	 * Register tags
	 */
	public function register_tags()
	{
		$fields = self::get_fields();

		foreach ( $fields as $field ) {
			if(!empty($field)){
				$this->register_tag( $field );
			}
		}
	}

	/**
	 * @param       $field
	 * @param array $parent_field
	 */
	private function register_tag( $field, $parent_field = [] )
	{
		$type = $field['type'];
		$contexts = self::get_fields_by_context();

		if ( ! isset( $contexts[ $type ] ) ) {
			return;
		}

		$contextsByType = $contexts[ $type ];
		$belongsTo = $field['belongsTo'];

		switch ($belongsTo){
			case MetaTypes::TAXONOMY:
				$prefixName = 'acpt_tax_';
				break;

			case MetaTypes::OPTION_PAGE:
				$prefixName = 'acpt_option_';
				break;

			default:
			case MetaTypes::CUSTOM_POST_TYPE:
				$prefixName = 'acpt_';
				break;
		}

		$name = $prefixName . $field['slug'];
		$label = $field['name'];

		$tag = [
			'name'     => '{' . $name . '}',
			'label'    => $label,
			'group'    => $field['group_name'],
			'field'    => $field,
			'provider' => $this->name,
			'contexts' => $contextsByType,
		];

		if ( ! empty( $parent_field ) ) {

			// Add the parent field attributes to the child tag so we could retrieve the value of group sub-fields
			$tag['parent'] = [
				'slug'        => $parent_field['slug'],
				'name'        => $parent_field['name'],
				'type'        => $parent_field['type'],
				'box_name'    => $parent_field['box_name'],
				'field_name'  => ((isset($parent_field['parent_field_name'])) ? $parent_field['parent_field_name'] : $parent_field['field_name'] ),
				'block_name'  => ((isset($parent_field['block_name'])) ? $parent_field['block_name'] : null),
			];
		}

		// List/Repeater field (loop)
		if ( in_array ( $type, [ MetaFieldModel::REPEATER_TYPE, MetaFieldModel::LIST_TYPE ] )   ) {
			$this->loop_tags[ $name ] = $tag;

			// Check for sub-fields (including group field sub-fields)
			if ( ! empty( $field['children'] ) ) {
				foreach ( $field['children'] as $sub_field ) {
					$this->register_tag( $sub_field, $field ); // Recursive
				}
			}
		}
		// Flexible field blocks (loop)
		elseif($type === MetaFieldModel::FLEXIBLE_CONTENT_TYPE){

			if(isset($tag['field']) and isset($tag['field']['children']) and is_array($tag['field']['children'])){
				foreach ($tag['field']['children'] as $block){
					$block['label'] =  $block['name'];
					$this->loop_tags[ $block['slug'] ] = $block;

					if(isset($block['children']) and is_array($block['children'])){
						foreach ( $block['children'] as $sub_field ) {
							$this->register_tag( $sub_field, $block ); // Recursive
						}
					}
				}
			}

		} else {
			// Regular fields
			$this->tags[ $name ] = $tag;
		}
	}

	/**
	 * @return array
	 */
	public static function get_fields() {

		if ( ! function_exists( 'get_acpt_meta_field_objects' ) or
		     ! function_exists( 'get_acpt_meta_field_object' ) or
		     ! function_exists('get_acpt_field')
		) {
			return [];
		}

		$fields = [];
		$post_types = self::get_post_types();
		$taxonomies = self::get_taxonomies();
		$option_pages = self::get_option_pages();

		// CPT meta
		foreach ($post_types as $post_type){
			$fields = array_merge($fields, self::get_field_group(MetaTypes::CUSTOM_POST_TYPE, $post_type));
		}

		// Taxonomies
		foreach ($taxonomies as $taxonomy){
			$fields = array_merge($fields, self::get_field_group(MetaTypes::TAXONOMY, $taxonomy->getSlug()));
		}

		// Options page meta
		foreach ($option_pages as $option_page){

			$fields = array_merge($fields, self::get_field_group(MetaTypes::OPTION_PAGE, $option_page->getMenuSlug()));

			foreach ($option_page->getChildren() as $child_option_page){
				$fields = array_merge($fields, self::get_field_group(MetaTypes::OPTION_PAGE, $child_option_page->getMenuSlug()));
			}
		}

		return $fields;
	}

	/**
	 * @param $belongs_to
	 * @param $find
	 *
	 * @return array
	 */
	private static function get_field_group($belongs_to, $find)
	{
		$fields = [];
		$acpt_meta_object = get_acpt_meta_field_objects($belongs_to, $find);

		foreach ($acpt_meta_object as $acpt_meta_field) {
			$field_slug = $find . ' ' . $acpt_meta_field->boxName . ' ' . $acpt_meta_field->name;
			$field_slug = strtolower(str_replace(' ', '_', $field_slug));
			$field_type = $acpt_meta_field->type;
			$group_name = 'ACPT';
			$display_field_name = '['.Translator::translate($find) . '] - ' . $acpt_meta_field->boxName . ' ' . $acpt_meta_field->name;

			$children = [];

			// Repeater fields
			if( isset($acpt_meta_field->children) and ! empty( $acpt_meta_field->children ) ){
				foreach ($acpt_meta_field->children as $child_field){
					$child_field_slug = $field_slug . ' ' . $child_field->name;
					$child_field_slug = strtolower(str_replace(' ', '_', $child_field_slug));
					$child_field_type = $child_field->type;
					$child_display_field_name = $display_field_name . ' ' . $child_field->name;

					$nestedChildren = [];

					// nested repeaters inside a repeater
					if( isset($child_field->children) and ! empty( $child_field->children ) ){
						foreach ($child_field->children as $nested_child_field){
							$nested_child_field_slug = $field_slug . ' ' . $nested_child_field->name;
							$nested_child_field_slug = strtolower(str_replace(' ', '_', $nested_child_field_slug));
							$nested_child_field_type = $nested_child_field->type;
							$nested_child_display_field_name = $display_field_name . ' ' . $nested_child_field->name;

							$nestedChildren[] = [
								'belongsTo' => $belongs_to,
								'find' => $find,
								'slug' => $nested_child_field_slug,
								'type' => $nested_child_field_type,
								'group_name' => $group_name,
								'name' => $nested_child_display_field_name,
								'box_name' => $acpt_meta_field->boxName,
								'field_name' => $nested_child_field->name,
								'parent_field_name' => $child_field->name,
							];
						}
					}

					$children[] = [
						'belongsTo' => $belongs_to,
						'find' => $find,
						'slug' => $child_field_slug,
						'type' => $child_field_type,
						'group_name' => $group_name,
						'name' => $child_display_field_name,
						'box_name' => $acpt_meta_field->boxName,
						'field_name' => $child_field->name,
						'parent_field_name' => $acpt_meta_field->name,
						'children' => $nestedChildren,
					];
				}
			}

			// Flexible fields
			if( isset($acpt_meta_field->blocks) and ! empty( $acpt_meta_field->blocks ) ){
				foreach ($acpt_meta_field->blocks as $child_block){

					$block_slug = $field_slug . ' ' . $child_block->name;
					$block_slug = strtolower(str_replace(' ', '_', $block_slug));
					$block_display_name = $display_field_name . ' ' . $child_block->name;

					$nested_fields = [];
					$nested_blocks = [];
					$nested_block_fields = [];

					if(isset($child_block->fields) and is_array($child_block->fields) and !empty($child_block->fields)){
						foreach ($child_block->fields as $nested_field){
							$nested_field_slug = $field_slug . ' ' . $child_block->name . ' ' . $nested_field->name;
							$nested_field_slug = strtolower(str_replace(' ', '_', $nested_field_slug));
							$nested_field_type = $nested_field->type;
							$nested_display_field_name = $display_field_name . ' ' . $child_block->name . ' ' . $nested_field->name;

							// nested blocks inside a flexible
							if( isset($nested_field->blocks) and ! empty( $nested_field->blocks ) ){
								foreach ($nested_field->blocks as $nested_block){

									$nested_block_slug = $nested_field_slug . ' ' . $nested_block->name;
									$nested_block_slug = strtolower(str_replace(' ', '_', $nested_block_slug));
									$nested_block_display_name = $nested_display_field_name . ' ' . $nested_block->name;

									if(isset($nested_block->fields) and is_array($nested_block->fields) and !empty($nested_block->fields)){
										foreach ($nested_block->fields as $nested_block_field){
											$nested_block_field_slug = $field_slug . ' ' . $nested_block->name . ' ' . $nested_block_field->name;
											$nested_block_field_slug = strtolower(str_replace(' ', '_', $nested_block_field_slug));
											$nested_block_field_type = $nested_block_field->type;
											$nested_block_display_field_name = $display_field_name . ' ' . $nested_block->name . ' ' . $nested_block_field->name;

											$nested_block_fields[] =  [
												'belongsTo' => $belongs_to,
												'find' => $find,
												'slug' => $nested_block_field_slug,
												'type' => $nested_block_field_type,
												'group_name' => $group_name,
												'name' => $nested_block_display_field_name,
												'box_name' => $acpt_meta_field->boxName,
												'field_name' => $nested_block_field->name,
												'parent_field_name' => $nested_field->name,
												'parent_block_name' => $nested_block_slug->name,
											];
										}
									}

									$nested_blocks[] = [
										'belongsTo' => $belongs_to,
										'find' => $find,
										'slug' => $nested_block_slug,
										'type' => 'Block',
										'group_name' => $group_name,
										'name' => $nested_block_display_name,
										'box_name' => $acpt_meta_field->boxName,
										'parent_field_name' => $acpt_meta_field->name,
										'block_name' => $nested_block->name,
										'children' => $nested_block_fields,
									];

								}
							}

							$nested_fields[] = [
								'belongsTo' => $belongs_to,
								'find' => $find,
								'slug' => $nested_field_slug,
								'type' => $nested_field_type,
								'group_name' => $group_name,
								'name' => $nested_display_field_name,
								'box_name' => $acpt_meta_field->boxName,
								'field_name' => $nested_field->name,
								'parent_field_name' => $acpt_meta_field->name,
								'parent_block_name' => $child_block->name,
								'children' => $nested_blocks,
							];
						}
					}

					$children[] = [
						'belongsTo' => $belongs_to,
						'find' => $find,
						'slug' => $block_slug,
						'type' => 'Block',
						'group_name' => $group_name,
						'name' => $block_display_name,
						'box_name' => $acpt_meta_field->boxName,
						'parent_field_name' => $acpt_meta_field->name,
						'block_name' => $child_block->name,
						'children' => $nested_fields,
					];
				}
			}

			// Add List fields children
			if($acpt_meta_field->type === MetaFieldModel::LIST_TYPE){

				$child_field_slug = $field_slug . '_value';
				$child_field_slug = strtolower(str_replace(' ', '_', $child_field_slug));
				$child_field_type = MetaFieldModel::TEXT_TYPE;
				$child_display_field_name = $display_field_name . ' value';

				$children[] = [
					'belongsTo' => $belongs_to,
					'find' => $find,
					'slug' => $child_field_slug,
					'type' => $child_field_type,
					'group_name' => $group_name,
					'name' => $child_display_field_name,
					'box_name' => $acpt_meta_field->boxName,
					'field_name' => $acpt_meta_field->name,
					'parent_field_name' => $acpt_meta_field->name,
				];
			}

			$fields[] = [
				'belongsTo' => $belongs_to,
				'find' => $find,
				'slug' => $field_slug,
				'type' => $field_type,
				'group_name' => $group_name,
				'name' => $display_field_name,
				'box_name' => $acpt_meta_field->boxName,
				'field_name' => $acpt_meta_field->name,
				'children' => $children,
			];
		}

		return $fields;
	}

	/**
	 * @return array
	 */
	private static function get_post_types()
	{
		return get_post_types( [
			'public'  => true,
			'show_ui' => true,
		], 'names', 'and' );
	}

	/**
	 * @return TaxonomyModel[]
	 */
	private static function get_taxonomies()
	{
		try {
			return TaxonomyRepository::get();
		} catch (\Exception $exception){
			return [];
		}
	}

	/**
	 * @return OptionPageModel[]
	 */
	private static function get_option_pages()
	{
		try {
			return OptionPageRepository::get();
		} catch (\Exception $exception){
			return [];
		}
	}

	/**
	 * Get tag value main function
	 *
	 * @param string $tag
	 * @param \WP_Post $post
	 * @param array $args
	 * @param string $context
	 *
	 * @return array|string|void
	 * @throws \Exception
	 */
	public function get_tag_value( $tag, $post, $args, $context )
	{
		try {
			$post_id = isset( $post->ID ) ? $post->ID : '';

			$field = $this->tags[ $tag ]['field'];
			$contexts = $this->tags[ $tag ]['contexts'];

			if( ! in_array( $context, $contexts )){
				return;
			}

			// STEP: Check for filter args
			$filters = $this->get_filters_from_args( $args );

			// STEP: Get the value
			$raw_acpt_value = $this->get_raw_value( $tag, $post_id );

			// render tag depending on its type
			switch ($field['type']){

				case MetaFieldModel::ADDRESS_TYPE:

					$value = null;
					if(is_array($raw_acpt_value) and  isset($raw_acpt_value['address'])){
						$value = $raw_acpt_value['address'];

						if(!empty($args)){
							foreach ($args as $arg){
								switch ($arg){
									case "lat":
										if(isset($raw_acpt_value['lat'])){
											$value = $raw_acpt_value['lat'];
										}
										break;

									case "lng":
										if(isset($raw_acpt_value['lng'])){
											$value = $raw_acpt_value['lng'];
										}
										break;
										
									case "city":
										if(isset($raw_acpt_value['city'])){
											$value = $raw_acpt_value['city'];
										}
										break;
								}
							}
						}
					}

					break;

				case MetaFieldModel::COUNTRY_TYPE:

					$value = null;
					if(is_array($raw_acpt_value) and isset($raw_acpt_value['value'])){
						$value = $raw_acpt_value['value'];
					}

					break;

				case MetaFieldModel::RATING_TYPE:

					if(!empty($raw_acpt_value)){
						$value = ($raw_acpt_value/2) . "/5";
					} else {
						$value = $raw_acpt_value;
					}

					break;

				case MetaFieldModel::CURRENCY_TYPE:

					$value = null;
					if(is_array($raw_acpt_value)){
						$value = $this->render_amount_field($raw_acpt_value['amount'], $raw_acpt_value['unit'],'currency', $args);
					}

					break;

				case MetaFieldModel::DATE_RANGE_TYPE:
					$value = null;
					if(is_array($raw_acpt_value) and !empty($raw_acpt_value) and count($raw_acpt_value) === 2){
						$format = get_option( 'date_format' ) ? get_option( 'date_format' ) : 'Y-m-d';
						if(!empty($args)){
							foreach ($args as $arg){
								if(Date::isDateFormatValid($arg)){
									$format = $arg;
									break;
								}
							}
						}

						$value = Date::format($format, $raw_acpt_value[0]);
						$value .= ' - ';
						$value .= Date::format($format, $raw_acpt_value[1]);
					}

					break;

				case MetaFieldModel::DATE_TYPE:

					$value = null;
					if($raw_acpt_value !== null and is_string($raw_acpt_value) and $raw_acpt_value !== ''){

						$format = get_option( 'date_format' ) ? get_option( 'date_format' ) : 'Y-m-d';
						if(!empty($args)){
							foreach ($args as $arg){
								if(Date::isDateFormatValid($arg)){
									$format = $arg;
									break;
								}
							}
						}

						$value = Date::format($format, $raw_acpt_value);
					}

					break;

				case MetaFieldModel::DATE_TIME_TYPE:

					$value = null;
					if($raw_acpt_value !== null and is_string($raw_acpt_value) and $raw_acpt_value !== ''){

						$dateFormat = get_option( 'date_format' ) ? get_option( 'date_format' ) : 'Y-m-d';
						$timeFormat = get_option( 'time_format' ) ? get_option( 'time_format' ) : "G:i";
						$format = $dateFormat . ' ' . $timeFormat;

						if(!empty($args)){
							$formats = [];

							foreach ($args as $arg){
								if(Date::isDateFormatValid($arg)){
									$formats[] = $arg;
								}
							}

							$format = implode(" ", $formats);
						}

						$value = Date::format($format, $raw_acpt_value);
					}

					break;

				case MetaFieldModel::TIME_TYPE:

					$format = get_option( 'time_format' ) ? get_option( 'time_format' ) : "G:i";
					if(!empty($args)){
						foreach ($args as $arg){
							if(Date::isDateFormatValid($arg)){
								$format = $arg;
								break;
							}
						}
					}

					$value = ($raw_acpt_value) ? Date::format($format, $raw_acpt_value) : null;
					break;

				case MetaFieldModel::EMAIL_TYPE:

					if(!empty($args) and $args[0] === 'string'){
						$value = $raw_acpt_value;
					} else {
						$filters['link'] = true;

						if($context === 'link'){
							$value = 'mailto:'.sanitize_email(strip_tags($raw_acpt_value));
						} else {
							$value = '<a href="mailto:'.sanitize_email(strip_tags($raw_acpt_value)).'">'.$raw_acpt_value.'</a>';
						}
					}

					break;

				case MetaFieldModel::LENGTH_TYPE:

					$value = null;
					if(is_array($raw_acpt_value)){
						$value = $this->render_amount_field($raw_acpt_value['length'], $raw_acpt_value['unit'],'length', $args);
					}

					break;

				case MetaFieldModel::SELECT_MULTI_TYPE:
				case MetaFieldModel::CHECKBOX_TYPE:

					$value = $this->render_list_item($raw_acpt_value, $args);
					break;

				case MetaFieldModel::FILE_TYPE:

					$value = '';

					// File field can belong to 4 different contexts: text, link, media or video
					switch ($context){
						case "text":
							if(isset($raw_acpt_value['file']) and $this->isAnAttachment($raw_acpt_value['file'])){
								if(isset($raw_acpt_value['label'])){
									$value = $raw_acpt_value['label'];
								} else {
									$value = $raw_acpt_value['file']->getTitle();
								}
							}

							break;

						case "link":
							$filters['link'] = true;
							$value = "url";

							if(isset($raw_acpt_value['file']) and $this->isAnAttachment($raw_acpt_value['file'])){
								$value = $raw_acpt_value['file']->getSrc();
							}

							break;

						case "video":
						case "media":

							if($context === 'video'){
								$filters['video']   = true;
							}

							if($context === 'media'){
								$filters['link']   = true;
							}

							$filters['link'] = true;
							$filters['object_type'] = 'media';

							if(isset($raw_acpt_value['file']) and $this->isAnAttachment($raw_acpt_value['file'])){
								$wpAttachment = $raw_acpt_value['file'];
								$value = [$wpAttachment->getId()];
							} elseif(isset($raw_acpt_value['file']) and !empty($raw_acpt_value['file']) and $this->isAnAttachment($raw_acpt_value['file'])){
								$value = [$raw_acpt_value['file']->getId()];
							} else {
								$value = [];
							}

							break;
					}

					break;

				case MetaFieldModel::VIDEO_TYPE:

					$filters['video']   = true;
					$filters['object_type'] = 'media';

					if(is_array($raw_acpt_value)){
						$value = [];

						foreach ($raw_acpt_value as $img){
							if($this->isAnAttachment($img)){
								$value[] = $img->getId();
							}
						}
					} else {
						if($this->isAnAttachment($raw_acpt_value)){
							$value = [$raw_acpt_value->getId()];
						}
					}

					break;

				case MetaFieldModel::GALLERY_TYPE:
				case MetaFieldModel::IMAGE_TYPE:

					$filters['object_type'] = 'media';
					$filters['image']   = true;
					$filters['separator']   = '';

					$index = isset($args[0]) ? $args[0] : null;

					// check is a single WPAttachment or not
					if($this->isAnAttachment($raw_acpt_value)){
						$value = [$raw_acpt_value->getId()];
					} else {
						$value = [];

						if(is_array($raw_acpt_value)){
							foreach ($raw_acpt_value as $img){
								if($this->isAnAttachment($img)){
									$value[] = $img->getId();
								} else {
									if(is_array($img)){
										foreach ($img as $nested_img){
											if($this->isAnAttachment($nested_img)){
												$value[] = $nested_img->getId();
											}
										}
									}
								}
							}
						}

						if($index !== null and isset($value[$index])){
							$value = [$value[$index]];
						}
					}

					break;

				case MetaFieldModel::PHONE_TYPE:

					if(!empty($args) and $args[0] === 'string'){
						$value = $raw_acpt_value;
					} else {
						$filters['link'] = true;

						if($context === 'link'){
							$value = 'tel:'.Phone::url($raw_acpt_value);
						} else {
							$value = '<a href="tel:'.Phone::url($raw_acpt_value).'" target="_blank">'.$raw_acpt_value.'</a>';
						}
					}

					break;

				case MetaFieldModel::TEXTAREA_TYPE:

					$value = null;
					if(is_string($raw_acpt_value)){
						$value = WPUtils::renderShortCode($raw_acpt_value, true);
					}

					break;

				case MetaFieldModel::TOGGLE_TYPE:
					$value = $raw_acpt_value ? esc_html__( 'True', 'bricks' ) : esc_html__( 'False', 'bricks' );
					break;

				case MetaFieldModel::WEIGHT_TYPE:

					$value = null;
					if(is_array($raw_acpt_value)){
						$value = $this->render_amount_field($raw_acpt_value['weight'], $raw_acpt_value['unit'], 'weight', $args);
					}

					break;

				case MetaFieldModel::POST_TYPE:

					$filters['link'] = true;

					if(is_array($raw_acpt_value)){
						$value = [];

						foreach ($raw_acpt_value as $obj){
							if($obj instanceof \WP_Post){
								$filters['object_type'] = 'post';
								$value[] = $obj->ID;
							}

							if($obj instanceof \WP_Term){
								$filters['object_type'] = 'term';
								$value[] = $obj->term_id;
							}

							if($raw_acpt_value instanceof \WP_User){
								$filters['object_type'] = 'user';
								$value[] = $obj->ID;
							}
						}

					} else {
						if($raw_acpt_value instanceof \WP_Post){
							$filters['object_type'] = 'post';
							$value = $raw_acpt_value->ID;
						}

						if($raw_acpt_value instanceof \WP_Term){
							$filters['object_type'] = 'term';
							$value = $raw_acpt_value->term_id;
						}

						if($raw_acpt_value instanceof \WP_User){
							$filters['object_type'] = 'user';
							$value = $raw_acpt_value->ID;
						}

						// @TODO OP object?
					}

					break;

				case MetaFieldModel::POST_OBJECT_TYPE:

					$filters['object_type'] = 'post';
					$filters['link']        = true;
					$value = $raw_acpt_value;

					if($raw_acpt_value instanceof \WP_Post){
						$value = $raw_acpt_value->ID;
					}

					break;

				case MetaFieldModel::POST_OBJECT_MULTI_TYPE:

					$filters['object_type'] = 'post';
					$filters['link']        = true;
					$value = [];

					if(is_array($raw_acpt_value)){
						foreach ($raw_acpt_value as $post){
							if($post instanceof \WP_Post){
								$value[] = $post->ID;
							}
						}
					}

					break;

				case MetaFieldModel::USER_TYPE:

					$filters['object_type'] = 'user';
					$filters['link']        = true;
					$value = $raw_acpt_value;

					if($raw_acpt_value instanceof \WP_User){
						$value = $raw_acpt_value->ID;
					}

					break;

				case MetaFieldModel::USER_MULTI_TYPE:

					$filters['object_type'] = 'user';
					$filters['link']        = true;
					$value = [];

					if(is_array($raw_acpt_value)){
						foreach ($raw_acpt_value as $user){
							if($user instanceof \WP_User){
								$value[] = $user->ID;
							}
						}
					}

					break;

				case MetaFieldModel::TERM_OBJECT_TYPE:

					$filters['object_type'] = 'term';
					$filters['link']        = true;
					$filters['taxonomy']    = $field['find'];
					$value = $raw_acpt_value;

					if($raw_acpt_value instanceof \WP_Term){
						$value = $raw_acpt_value->term_id;
					}

					break;

				case MetaFieldModel::TERM_OBJECT_MULTI_TYPE:

					$filters['object_type'] = 'term';
					$filters['link']        = true;
					$filters['taxonomy']    = $field['find'];
					$value = [];

					if(is_array($raw_acpt_value)){
						foreach ($raw_acpt_value as $term){
							if($term instanceof \WP_Term){
								$value[] = $term->term_id;
							}
						}
					}

					break;

				case MetaFieldModel::URL_TYPE:

					if(empty($raw_acpt_value)){
						return null;
					}

					if(!isset($raw_acpt_value['url'])){
						return null;
					}

					if(!empty($args) and $args[0] === 'string'){
						$value = $raw_acpt_value;
					} else {
						$filters['link'] = true;

						if($context === 'link'){
							$value = strip_tags($raw_acpt_value['url']);
						} else {
							if(!empty($raw_acpt_value['label'])){
								$value = '<a href="'.esc_url(strip_tags($raw_acpt_value['url'])).'">'.$raw_acpt_value['label'].'</a>';
							} else {
								$value = $raw_acpt_value['url'];
							}
						}
					}

					break;

				default:

					$value = $raw_acpt_value;

					// truncate text
					if(!empty($args)){
						foreach ($args as $arg){
							if(is_numeric($arg)){
								$value = substr($value,0, (int)$arg);
							}
						}
					}
			}

			$value = $this->format_value_for_context( $value, $tag, $post_id, $filters, $context );

			return $value;
		} catch (\Exception $exception){
			return null;
		}
	}

	/**
	 * @param string $imgUrl
	 *
	 * @return int
	 */
	private function attachment_url_to_postID($imgUrl)
	{
		$postId = attachment_url_to_postid($imgUrl);

		// try to find a scaled version
		if($postId === 0){
			$path = pathinfo($imgUrl);

			if(!is_array($path)){
				return 0;
			}

			$newFilename = $path['filename'] . '-scaled';
			$postId = attachment_url_to_postid($path['dirname'] . '/' . $newFilename . '.' . $path['extension']);
		}

		return $postId;
	}

	/**
	 * @param $amount
	 * @param $unit
	 * @param $context
	 * @param array $args
	 *
	 * @return string|null
	 */
	private function render_amount_field($amount, $unit, $context, $args = [])
	{
		if(!is_numeric($amount)){
			return null;
		}

		$format = (!empty($args) and isset($args[0])) ? $args[0] : 'full';
		$decimalSeparator = (!empty($args) and isset($args[1])) ? $args[1] : ".";
		$thousandsSeparator = (!empty($args) and isset($args[2])) ? $args[2] : ",";
		$position = (!empty($args) and isset($args[3])) ? $args[3] : "after";
		$amount = number_format($amount, 2, $decimalSeparator, $thousandsSeparator);

		if($format === 'value'){
			return $amount;
		}

		if($format === 'symbol'){
			switch ($context){
				case "currency":
					$unit = Currencies::getSymbol($unit);
					break;

				case "length":
					$unit = Lengths::getSymbol($unit);
					break;

				case "weight":
					$unit = Weights::getSymbol($unit);
					break;
			}
		}

		if($position === 'before'){
			return $unit .' '. $amount;
		}

		return $amount . ' ' . $unit;
	}

	/**
	 * @param $raw_acpt_value
	 * @param array $args
	 *
	 * @return string|null
	 */
	private function render_list_item($raw_acpt_value, $args = [])
	{
		if(!is_array($raw_acpt_value)){
			return null;
		}

		if(isset($args[0]) and $args[0] === 'string'){
			$separator = (isset($args[1])) ? $args[1] : ",";

			return implode($separator, $raw_acpt_value);
		}

		if(isset($args[0]) and $args[0] === 'ol'){
			$classes = (isset($args[1])) ? $args[1] : null;
			$value = '<ol>';

			foreach ($raw_acpt_value as $item){
				$value .= '<li class="'.$classes.'">' . $item . '</li>';
			}

			$value .= '</ol>';

			return $value;
		}

		$classes = (isset($args[0]) and $args[0] === 'li' and isset($args[1])) ? $args[1] : null;
		$value = '<ul>';

		foreach ($raw_acpt_value as $item){
			$value .= '<li class="'.$classes.'">' . $item . '</li>';
		}

		$value .= '</ul>';

		return $value;
	}

	/**
	 * @param $tag
	 * @param $post_id
	 *
	 * @return array|mixed|string|null
	 * @throws \Exception
	 */
	private function get_raw_value( $tag, $post_id )
	{
		$tag_object = $this->tags[ $tag ];
		$field      = $tag_object['field'];

		if ( \Bricks\Query::is_looping() ) {

			// Check if this loop belongs to this provider
			$query_type = \Bricks\Query::get_query_object_type(); // post or term

			// Flexible/Repeater/List fields
			if ( array_key_exists( $query_type, $this->loop_tags ) ) {

				$parent_tag = $this->loop_tags[ $query_type ];
				$query_loop_object = \Bricks\Query::get_loop_object();

				// Render a field nested in List or Repeater field
				if (
					isset( $parent_tag['field']['slug'] ) &&
					isset( $tag_object['parent']['slug'] ) &&
					$parent_tag['field']['slug'] == $tag_object['parent']['slug']
				) {

					// For List field
					if($parent_tag['field']['type'] === MetaFieldModel::LIST_TYPE){
						return $query_loop_object;
					}

					// For Repeater field: sub-field not found in the loop object (array)
					if($parent_tag['field']['type'] === MetaFieldModel::REPEATER_TYPE){
						if ( ! is_array( $query_loop_object ) || ! array_key_exists( $field['field_name'], $query_loop_object ) ) {
							return '';
						}
					}

					return $query_loop_object[ $field['field_name'] ];
				}

				// Render a field nested in a block
				if($parent_tag['type'] === 'Block'){

					// calculate the numeric index of $query_loop_object
					$nested_child_index = 0;

					if(isset($parent_tag['children']) and is_array($parent_tag['children'])){
						foreach ($parent_tag['children'] as $nested_field_index => $nested_field){
							if($nested_field['slug'] === $field['slug']){
								$nested_child_index = $nested_field['field_name'];
							}
						}
					}

					if(isset($query_loop_object[$nested_child_index])){
						return $query_loop_object[$nested_child_index];
					}

					return null;
				}

			} elseif($query_type === 'term' and $field['belongsTo'] === MetaTypes::TAXONOMY){
				// Loop of taxonomies
				$query_loop_object = \Bricks\Query::get_loop_object();
				$field['term_id'] = $query_loop_object->term_id;

				return $this->get_acpt_value($field);
			}
		}

		// Display taxonomy meta for the current post
		if($field['belongsTo'] === MetaTypes::TAXONOMY and isset($field['taxonomy'])) {
			global $post;
			$terms = get_the_terms($post->ID, $field['taxonomy']);

			$acpt_values = [];

			if(!empty($terms)){
				foreach ($terms as $term){
					$field['term_id'] = $term->term_id;
					$acpt_values[] = $this->get_acpt_value($field);
				}
			}

			return $acpt_values;
		}

		// STEP: Still here, get the regular value for this field
		$field['post_id'] = $post_id;

		return $this->get_acpt_value($field);
	}

	/**
	 * @param $field
	 *
	 * @return mixed|null
	 * @throws \Exception
	 */
	private function get_acpt_value($field)
	{
		switch ($field['belongsTo']){
			case MetaTypes::OPTION_PAGE:
				return $this->get_option_page_meta_value($field);

			case MetaTypes::TAXONOMY:
				return $this->get_tax_meta_value($field);

			default:
			case MetaTypes::CUSTOM_POST_TYPE:
				return $this->get_post_meta_value($field);
		}
	}

	/**
	 * @param $post_id
	 * @param $field
	 *
	 * @return array|mixed|null
	 * @throws \Exception
	 */
	private function get_post_meta_value($field)
	{
		if(!isset($field['post_id']) or !isset($field['box_name']) or !isset($field['field_name'])){
			return null;
		}

		// flexible field block nested element
		if(isset($field['parent_field_name'])){
			$acpt_value = get_acpt_field([
				'post_id' => $field['post_id'],
				'box_name' => $field['box_name'],
				'field_name' => $field['parent_field_name'],
			]);

			$nested_values = [];

			if(is_array($acpt_value)){
				foreach ($acpt_value as $index => $nested_value){
					if(is_acpt_field_visible([
						'post_id' => $field['post_id'],
						'box_name' => $field['box_name'],
						'parent_field_name' => $field['parent_field_name'],
						'field_name' => $field['field_name'],
						'index' => $index,
					])){
						$nested_values[] = get_acpt_child_field([
							'post_id' => $field['post_id'],
							'box_name' => $field['box_name'],
							'parent_field_name' => $field['parent_field_name'],
							'field_name' => $field['field_name'],
							'index' => $index,
						]);
					}
				}
			}

			return $nested_values;
		}

		// repeater field nested element
		if(isset($field['children']) and !empty($field['children'])){

			// Example:
			//
			// 0 => [fancy => ciao]
			// 1 => [fancy => dsgffds fdsfddsf]
			// 2 => [fancy => dfsdfs]
			//
			$get_acpt_field = get_acpt_field([
				'post_id' => $field['post_id'],
				'box_name' => $field['box_name'],
				'field_name' => $field['field_name'],
			]);

			if(is_array($get_acpt_field)){

				foreach ($field['children'] as $child_field){

					for($i = 0; $i < count($get_acpt_field); $i++){
						$is_acpt_field_visible = is_acpt_field_visible([
							'post_id' => $field['post_id'],
							'box_name' => $child_field['box_name'],
							'parent_field_name' => $child_field['parent_field_name'],
							'field_name' => $child_field['field_name'],
							'index' => $i,
						]);

						if(!$is_acpt_field_visible){
							if(isset($get_acpt_field[$i][$child_field['field_name']])){
								unset($get_acpt_field[$i][$child_field['field_name']]);
							}
						}
					}
				}
			}

			return $get_acpt_field;
		}

		if(!is_acpt_field_visible([
			'post_id' => $field['post_id'],
			'box_name' => $field['box_name'],
			'field_name' => $field['field_name'],
		])){
			return null;
		}

		return get_acpt_field([
			'post_id' => $field['post_id'],
			'box_name' => $field['box_name'],
			'field_name' => $field['field_name'],
		]);
	}

	/**
	 * @param $field
	 *
	 * @return array|mixed|null
	 * @throws \Exception
	 */
	private function get_tax_meta_value($field)
	{
		if(!isset($field['term_id']) or !isset($field['box_name']) or !isset($field['field_name'])){
			return null;
		}

		// if child element
		if(isset($field['parent_field_name'])){
			$acpt_value = get_acpt_field([
				'term_id' => $field['term_id'],
				'box_name' => $field['box_name'],
				'field_name' => $field['parent_field_name'],
			]);

			$nested_values = [];

			if(is_array($acpt_value)){
				foreach ($acpt_value as $index => $nested_value){
					$nested_values[] = get_acpt_child_field([
						'term_id' => $field['term_id'],
						'box_name' => $field['box_name'],
						'parent_field_name' => $field['parent_field_name'],
						'field_name' => $field['field_name'],
						'index' => $index,
					]);
				}
			}

			return $nested_values;
		}

		if(!is_acpt_field_visible([
			'term_id' => $field['term_id'],
			'box_name' => $field['box_name'],
			'field_name' => $field['field_name'],
		])){
			return null;
		}

		return get_acpt_field([
			'term_id' => $field['term_id'],
			'box_name' => $field['box_name'],
			'field_name' => $field['field_name'],
		]);
	}

	/**
	 * @param $field
	 *
	 * @return array|mixed|null
	 * @throws \Exception
	 */
	private function get_option_page_meta_value($field)
	{
		if(!isset($field['find']) or !isset($field['box_name']) or !isset($field['field_name'])){
			return null;
		}

		// flexible field block nested element
		if(isset($field['parent_field_name'])){
			$acpt_value = get_acpt_field([
				'option_page' => $field['find'],
				'box_name' => $field['box_name'],
				'field_name' => $field['parent_field_name'],
			]);

			$nested_values = [];

			if(is_array($acpt_value)){
				foreach ($acpt_value as $index => $nested_value){
					if(is_acpt_field_visible([
						'option_page' => $field['find'],
						'box_name' => $field['box_name'],
						'parent_field_name' => $field['parent_field_name'],
						'field_name' => $field['field_name'],
						'index' => $index,
					])){
						$nested_values[] = get_acpt_child_field([
							'option_page' => $field['find'],
							'box_name' => $field['box_name'],
							'parent_field_name' => $field['parent_field_name'],
							'field_name' => $field['field_name'],
							'index' => $index,
						]);
					}
				}
			}

			return $nested_values;
		}

		// repeater field nested element
		if(isset($field['children']) and !empty($field['children'])){

			// Example:
			//
			// 0 => [fancy => ciao]
			// 1 => [fancy => dsgffds fdsfddsf]
			// 2 => [fancy => dfsdfs]
			//
			$get_acpt_field = get_acpt_field([
				'option_page' => $field['find'],
				'box_name' => $field['box_name'],
				'field_name' => $field['field_name'],
			]);

			if(is_array($get_acpt_field)){

				foreach ($field['children'] as $child_field){

					for($i = 0; $i < count($get_acpt_field); $i++){
						$is_acpt_field_visible = is_acpt_field_visible([
							'option_page' => $field['find'],
							'box_name' => $child_field['box_name'],
							'parent_field_name' => $child_field['parent_field_name'],
							'field_name' => $child_field['field_name'],
							'index' => $i,
						]);

						if(!$is_acpt_field_visible){
							if(isset($get_acpt_field[$i][$child_field['field_name']])){
								unset($get_acpt_field[$i][$child_field['field_name']]);
							}
						}
					}
				}
			}

			return $get_acpt_field;
		}

		if(!is_acpt_field_visible([
			'option_page' => $field['find'],
			'box_name' => $field['box_name'],
			'field_name' => $field['field_name'],
		])){
			return null;
		}

		return get_acpt_field([
			'option_page' => $field['find'],
			'box_name' => $field['box_name'],
			'field_name' => $field['field_name'],
		]);
	}

	/**
	 * @param $block
	 *
	 * @return array
	 * @throws \Exception
	 */
	private function get_acpt_block($block)
	{
		switch ($block['belongsTo']){
			case MetaTypes::OPTION_PAGE:
				return $this->get_option_page_meta_block_values($block);

			default:
			case MetaTypes::CUSTOM_POST_TYPE:
				return $this->get_post_meta_block_values($block);
		}
	}

	/**
	 * @param $block
	 *
	 * @return array
	 * @throws \Exception
	 */
	private function get_post_meta_block_values($block)
	{
		if(!isset($block['post_id']) and !isset($block['box_name']) and !isset($block['parent_field_name'])){
			return null;
		}

		$acpt_parent_field_value = get_acpt_field([
			'post_id' => $block['post_id'],
			'box_name' => $block['box_name'],
			'field_name' => $block['parent_field_name'],
		]);

		$nested_values = [];

		if(is_array($acpt_parent_field_value) and isset($acpt_parent_field_value['blocks'])){
			foreach ($acpt_parent_field_value['blocks'] as $block_index => $block_values){
				foreach ($block_values as $block_name => $block_value){

					if($block_name === $block['block_name']){
						if(is_array($block_value)){
							foreach ($block_value as $nested_child_field_name => $nested_child_field_values){
								foreach ($nested_child_field_values as $nested_child_field_index => $nested_child_field_value){

									$is_acpt_field_visible = is_acpt_field_visible([
										'post_id' => $block['post_id'],
										'box_name' => $block['box_name'],
										'field_name' => $nested_child_field_name,
										'parent_field_name' => $block['parent_field_name'],
										'block_name' => $block_name,
										'block_index' => $block_index,
										'index' => $nested_child_field_index,
									]);

									if($is_acpt_field_visible){

										// This is a map like this:
										//
										// 0_0 => [
										//     'email_testo' => 'mauro@email.com',
										//     'testo' => 'value2',
										// ]
										//
										// An aggregate index is needed to aggregate data from blocks with same name
										// avoiding data override
										//
										$aggregate_index = $block_index . '_' . $nested_child_field_index;
										$nested_values[$aggregate_index][$nested_child_field_name] = get_acpt_block_child_field([
											'post_id' => $block['post_id'],
											'box_name' => $block['box_name'],
											'field_name' => $nested_child_field_name,
											'parent_field_name' => $block['parent_field_name'],
											'block_name' => $block_name,
											'block_index' => $block_index,
											'index' => $nested_child_field_index,
										]);
									}
								}
							}
						}

					} elseif(isset($block['children']) and is_array($block['children']) and !empty($block['children'])){ // nested flexible fields
						if(is_array($block_value)){
							foreach ($block_value as $nested_block_value){
								if(is_array($nested_block_value) and isset($nested_block_value['blocks'])) {
									foreach ( $nested_block_value['blocks'] as $nested_block_index => $nested_block_values ) {
										if(isset($nested_block_values[ $block['block_name'] ]) and is_array($nested_block_values[ $block['block_name'] ])){
											foreach ($nested_block_values[ $block['block_name'] ] as $deep_nested_blocks){
												if(isset($deep_nested_blocks['blocks']) and is_array($deep_nested_blocks['blocks'])){
													foreach ($deep_nested_blocks['blocks'] as $deep_nested_block_index => $deep_nested_block){
														if(isset($deep_nested_block[ $block['block_name'] ]) and is_array($deep_nested_block[ $block['block_name'] ])){
															foreach ($deep_nested_block[ $block['block_name'] ] as $deep_nested_block_name_value => $deep_nested_block_value){
																foreach ($deep_nested_block_value as $deep_nested_block_field_value_index => $deep_nested_block_field_value){
																	$aggregate_index = $deep_nested_block_index . '_' . $deep_nested_block_field_value_index;
																	$nested_values[$aggregate_index][$deep_nested_block_name_value] = $deep_nested_block_field_value;
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}

		return $nested_values;
	}

	/**
	 * @param $block
	 *
	 * @return array|null
	 * @throws \Exception
	 */
	private function get_option_page_meta_block_values($block)
	{
		if(!isset($block['find']) or !isset($block['box_name']) or !isset($block['parent_field_name'])){
			return null;
		}

		$acpt_parent_field_value = get_acpt_field([
			'option_page' => $block['find'],
			'box_name' => $block['box_name'],
			'field_name' => $block['parent_field_name'],
		]);

		$nested_values = [];

		if(is_array($acpt_parent_field_value) and isset($acpt_parent_field_value['blocks'])){
			foreach ($acpt_parent_field_value['blocks'] as $block_index => $block_values){
				foreach ($block_values as $block_name => $block_value){
					if($block_name === $block['block_name']){
						if(is_array($block_value)){
							foreach ($block_value as $nested_child_field_name => $nested_child_field_values){
								foreach ($nested_child_field_values as $nested_child_field_index => $nested_child_field_value){

									$is_acpt_option_page_field_visible = is_acpt_field_visible([
										'option_page' => $block['find'],
										'box_name' => $block['box_name'],
										'field_name' => $nested_child_field_name,
										'parent_field_name' => $block['parent_field_name'],
										'block_name' => $block_name,
										'block_index' => $block_index,
										'index' => $nested_child_field_index,
									]);

									if($is_acpt_option_page_field_visible){
										// This is a map like this:
										//
										// 0_0 => [
										//     'email_testo' => 'mauro@email.com',
										//     'testo' => 'value2',
										// ]
										//
										// An aggregate index is needed to aggregate data from blocks with same name
										// avoiding data override
										//
										$aggregate_index = $block_index . '_' . $nested_child_field_index;
										$nested_values[$aggregate_index][$nested_child_field_name] = get_acpt_block_child_field([
											'option_page' => $block['find'],
											'box_name' => $block['box_name'],
											'field_name' => $nested_child_field_name,
											'parent_field_name' => $block['parent_field_name'],
											'block_name' => $block_name,
											'block_index' => $block_index,
											'index' => $nested_child_field_index,
										]);
									}
								}
							}
						}
					} elseif(isset($block['children']) and is_array($block['children']) and !empty($block['children'])){ // nested flexible fields
						if(is_array($block_value)){
							foreach ($block_value as $nested_block_value){
								if(is_array($nested_block_value) and isset($nested_block_value['blocks'])) {
									foreach ( $nested_block_value['blocks'] as $nested_block_index => $nested_block_values ) {
										if(isset($nested_block_values[ $block['block_name'] ]) and is_array($nested_block_values[ $block['block_name'] ])){
											foreach ($nested_block_values[ $block['block_name'] ] as $deep_nested_blocks){
												if(isset($deep_nested_blocks['blocks']) and is_array($deep_nested_blocks['blocks'])){
													foreach ($deep_nested_blocks['blocks'] as $deep_nested_block_index => $deep_nested_block){
														if(isset($deep_nested_block[ $block['block_name'] ]) and is_array($deep_nested_block[ $block['block_name'] ])){
															foreach ($deep_nested_block[ $block['block_name'] ] as $deep_nested_block_name_value => $deep_nested_block_value){
																foreach ($deep_nested_block_value as $deep_nested_block_field_value_index => $deep_nested_block_field_value){
																	$aggregate_index = $deep_nested_block_index . '_' . $deep_nested_block_field_value_index;
																	$nested_values[$aggregate_index][$deep_nested_block_name_value] = $deep_nested_block_field_value;
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}

		return $nested_values;
	}

	/**
	 * Get all fields supported and their contexts
	 *
	 * @return array
	 */
	private static function get_fields_by_context()
	{
		return [

			// Basic
			MetaFieldModel::TEXT_TYPE              => [ self::CONTEXT_TEXT ],
			MetaFieldModel::TEXTAREA_TYPE          => [ self::CONTEXT_TEXT ],
			MetaFieldModel::NUMBER_TYPE            => [ self::CONTEXT_TEXT ],
			MetaFieldModel::RANGE_TYPE             => [ self::CONTEXT_TEXT ],
			MetaFieldModel::EMAIL_TYPE             => [ self::CONTEXT_TEXT, self::CONTEXT_LINK ],
			MetaFieldModel::PHONE_TYPE             => [ self::CONTEXT_TEXT, self::CONTEXT_LINK ],
			MetaFieldModel::URL_TYPE               => [ self::CONTEXT_TEXT, self::CONTEXT_LINK ],

			// Content
			MetaFieldModel::IMAGE_TYPE             => [ self::CONTEXT_TEXT, self::CONTEXT_IMAGE ],
			MetaFieldModel::GALLERY_TYPE           => [ self::CONTEXT_TEXT, self::CONTEXT_IMAGE ],
			MetaFieldModel::FILE_TYPE              => [ self::CONTEXT_TEXT, self::CONTEXT_LINK, self::CONTEXT_VIDEO, self::CONTEXT_MEDIA ],
			MetaFieldModel::EDITOR_TYPE            => [ self::CONTEXT_TEXT ],
			MetaFieldModel::HTML_TYPE              => [ self::CONTEXT_TEXT ],
			MetaFieldModel::EMBED_TYPE             => [ self::CONTEXT_TEXT, self::CONTEXT_LINK, self::CONTEXT_VIDEO, self::CONTEXT_MEDIA ],
			MetaFieldModel::VIDEO_TYPE             => [ self::CONTEXT_TEXT, self::CONTEXT_LINK, self::CONTEXT_VIDEO, self::CONTEXT_MEDIA ],

			// Specialized fields
			MetaFieldModel::ADDRESS_TYPE           => [ self::CONTEXT_TEXT ],
			MetaFieldModel::COUNTRY_TYPE           => [ self::CONTEXT_TEXT ],
			MetaFieldModel::WEIGHT_TYPE            => [ self::CONTEXT_TEXT ],
			MetaFieldModel::LENGTH_TYPE            => [ self::CONTEXT_TEXT ],
			MetaFieldModel::DATE_TYPE              => [ self::CONTEXT_TEXT ],
			MetaFieldModel::DATE_TIME_TYPE         => [ self::CONTEXT_TEXT ],
			MetaFieldModel::DATE_RANGE_TYPE        => [ self::CONTEXT_TEXT ],
			MetaFieldModel::TIME_TYPE              => [ self::CONTEXT_TEXT ],
			MetaFieldModel::CURRENCY_TYPE          => [ self::CONTEXT_TEXT ],
			MetaFieldModel::COLOR_TYPE             => [ self::CONTEXT_TEXT ],
			MetaFieldModel::RATING_TYPE            => [ self::CONTEXT_TEXT ],

			// Choice
			MetaFieldModel::SELECT_TYPE            => [ self::CONTEXT_TEXT ],
			MetaFieldModel::SELECT_MULTI_TYPE      => [ self::CONTEXT_TEXT ],
			MetaFieldModel::CHECKBOX_TYPE          => [ self::CONTEXT_TEXT ],
			MetaFieldModel::RADIO_TYPE             => [ self::CONTEXT_TEXT ],
			MetaFieldModel::TOGGLE_TYPE            => [ self::CONTEXT_TEXT ],

			// Loop
			MetaFieldModel::LIST_TYPE              => [ self::CONTEXT_LOOP, self::CONTEXT_TEXT ],
			MetaFieldModel::REPEATER_TYPE          => [ self::CONTEXT_LOOP ],
			MetaFieldModel::FLEXIBLE_CONTENT_TYPE  => [ self::CONTEXT_LOOP ],

			// Relational
			MetaFieldModel::POST_TYPE              => [ self::CONTEXT_TEXT, self::CONTEXT_LINK, self::CONTEXT_LOOP ],
			MetaFieldModel::POST_OBJECT_TYPE       => [ self::CONTEXT_TEXT, self::CONTEXT_LINK, self::CONTEXT_LOOP ],
			MetaFieldModel::POST_OBJECT_MULTI_TYPE => [ self::CONTEXT_TEXT, self::CONTEXT_LINK, self::CONTEXT_LOOP ],
			MetaFieldModel::TERM_OBJECT_TYPE       => [ self::CONTEXT_TEXT, self::CONTEXT_LINK, self::CONTEXT_LOOP ],
			MetaFieldModel::TERM_OBJECT_MULTI_TYPE => [ self::CONTEXT_TEXT, self::CONTEXT_LINK, self::CONTEXT_LOOP ],
			MetaFieldModel::USER_TYPE              => [ self::CONTEXT_TEXT, self::CONTEXT_LINK, self::CONTEXT_LOOP ],
			MetaFieldModel::USER_MULTI_TYPE        => [ self::CONTEXT_TEXT, self::CONTEXT_LINK, self::CONTEXT_LOOP ],
		];
	}

	/**
	 * Set the loop query if exists
	 * This function is triggered on frontend when a loop tag (like a List, Flexible or Repeater field) is rendered
	 *
	 * @param array $results
	 * @param \Bricks\Query $query
	 *
	 * @return array
	 * @throws \Exception
	 */
	public function set_loop_query( $results, $query )
	{
		if ( ! array_key_exists( $query->object_type, $this->loop_tags ) ) {
			return $results;
		}

		$tag_object = $this->loop_tags[ $query->object_type ];
		$looping_query_id = \Bricks\Query::is_any_looping();
		$field = isset($tag_object['field']) ? $tag_object['field'] : null;

		if ( $looping_query_id ) {

			$loop_query_object_type = \Bricks\Query::get_query_object_type( $looping_query_id );

			// Maybe it is a nested repeater
			if ( array_key_exists( $loop_query_object_type, $this->loop_tags ) ) {

				$loop_object = \Bricks\Query::get_loop_object( $looping_query_id );

				if ( is_array( $loop_object ) && array_key_exists( $field['name'], $loop_object ) ) {
					return $loop_object[ $field['name'] ];
				}

				if ( is_object( $loop_object ) && is_a( $loop_object, 'WP_Post' ) ) {
					$acpt_object_id = get_the_ID();
				}

				// @TODO term and users?
			}

			// Or maybe it is a post loop
			elseif ( $loop_query_object_type === 'post' ) {
				$acpt_object_id = get_the_ID();
			}
		}

		if ( ! isset( $acpt_object_id ) and $field !== null ) {
			// Get the $post_id or the template preview ID
			$post_id = \Bricks\Database::$page_data['preview_or_post_id'];
			$acpt_object_id = $this->get_object_id( $field, $post_id );
		}

		// Render blocks
		if(isset($tag_object['type']) and $tag_object['type'] === 'Block'){

			$post_id = isset( $loop_query_object_type ) && $loop_query_object_type === 'post' ? get_the_ID() : \Bricks\Database::$page_data['preview_or_post_id'];
			$tag_object['post_id'] = $post_id;

			return $this->get_acpt_block($tag_object);
		}

		// Check if it is a subfield of a group field (Repeater inside of a Group)
		if ( isset( $tag_object['parent']['type'] ) and $tag_object['parent']['type'] === MetaFieldModel::REPEATER_TYPE ) {

			$post_id = isset( $loop_query_object_type ) && $loop_query_object_type === 'post' ? get_the_ID() : \Bricks\Database::$page_data['preview_or_post_id'];

			$group_value = get_acpt_field( [
				'box_name' => $tag_object['field']['box_name'],
				'field_name' => $tag_object['field']['parent_field_name'],
				'post_id' => $post_id,
			] );

			// nested repeaters
			if(
				isset($tag_object['field']['type']) and
				$tag_object['field']['type'] === MetaFieldModel::REPEATER_TYPE and
				!empty($group_value)
			){
				$results = [];

				foreach ($group_value as $nested_group_value){
					if( isset($nested_group_value[ $tag_object['field']['field_name'] ]) and is_array($nested_group_value[ $tag_object['field']['field_name'] ]) ){
						foreach ($nested_group_value[ $tag_object['field']['field_name'] ] as $nested_block){

							// remove unnecessary info
							foreach ($nested_block as $nested_block_item_index => $nested_block_item){
								unset($nested_block[$nested_block_item_index]['original_name']);
								unset($nested_block[$nested_block_item_index]['type']);
							}

							$results = array_merge($results, $nested_block);
						}
					}
				}

				return $results;
			}

			// one-level repeaters
			return isset( $group_value[ $tag_object['field']['field_name'] ] ) ? $group_value[ $tag_object['field']['field_name'] ] : [];

		} else {
			$field['post_id'] = $acpt_object_id;

			$results = $this->get_acpt_value($field);
		}

		return ! empty( $results ) ? $results : [];
	}

	/**
	 * Calculate the object ID to be used when fetching the field value
	 *
	 * @param $field
	 * @param $post_id
	 *
	 * @return mixed
	 */
	public function get_object_id( $field, $post_id )
	{
		$locations = isset( $field['_bricks_locations'] ) ? $field['_bricks_locations'] : [];

		if ( isset($field['object_type']) and \Bricks\Query::is_looping() ) {
			$object_type = $field['object_type'];
			$loop_type = \Bricks\Query::get_loop_object_type();
			$object_id = \Bricks\Query::get_loop_object_id();

//			// Terms loop
//			if ( $object_type == 'term' && in_array( $object_type, $locations ) ) {
//				$object = \Bricks\Query::get_loop_object();
//
//				return isset( $object->taxonomy ) ? $object->taxonomy . '_' . $object_id : $post_id;
//			}
//
//			// Users loop
//			if ( $object_type == 'user' && in_array( $object_type, $locations ) ) {
//				return 'user_' . $object_id;
//			}

			// loop type is the same as the field object type (term, user, post)
			if ( $loop_type == $object_type ) {
				return $object_id;
			}
		}

		return $post_id;
	}

	/**
	 * @param $attachment
	 *
	 * @return bool
	 */
	private function isAnAttachment($attachment)
	{
		return $attachment instanceof WPAttachment;
	}
}
