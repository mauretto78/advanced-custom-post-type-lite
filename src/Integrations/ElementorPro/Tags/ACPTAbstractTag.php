<?php

namespace ACPT_Lite\Integrations\ElementorPro\Tags;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Integrations\ElementorPro\Constants\TagsConstants;
use ACPT_Lite\Integrations\ElementorPro\DynamicDataProvider;
use Elementor\Controls_Manager;
use Elementor\Core\DynamicTags\Tag;

abstract class ACPTAbstractTag extends Tag
{
	/**
	 * Get dynamic tag name.
	 *
	 * @since 1.0.0
	 * @access public
	 * @return string Dynamic tag name.
	 */
	abstract public function get_name();

	/**
	 * Get dynamic tag title.
	 *
	 * @since 1.0.0
	 * @access public
	 * @return string Dynamic tag title.
	 */
	abstract public function get_title();

	/**
	 * Get dynamic tag groups.
	 *
	 * @since 1.0.0
	 * @access public
	 * @return array Dynamic tag groups.
	 */
	public function get_group()
	{
		return [ TagsConstants::GROUP_NAME ];
	}

	/**
	 * Get dynamic tag categories.
	 *
	 * @since 1.0.0
	 * @access public
	 * @return array Dynamic tag categories.
	 */
	abstract public function get_categories();

	/**
	 * Register controls
	 */
	protected function register_controls()
	{
		$fields = DynamicDataProvider::getInstance()->getFields();
		$options = [
			'default' => esc_html__( 'Default', ACPT_LITE_PLUGIN_NAME )
		];

		if(isset($fields[static::class])){

			/** @var MetaFieldModel $field */
			foreach ($fields[static::class] as $field){
				$key = $field->getBelongsToLabel() . TagsConstants::KEY_SEPARATOR . $field->getFindLabel() . TagsConstants::KEY_SEPARATOR . $field->getBox()->getName() . TagsConstants::KEY_SEPARATOR . $field->getName() . TagsConstants::KEY_SEPARATOR . $field->getType();
				$label = '['.$field->getFindLabel().'] ' . $field->getUiName();
				$options[$key] = $label;
			}

			$this->add_control(
				'field',
				[
					'label' => esc_html__( 'Field', ACPT_LITE_PLUGIN_NAME ),
					'type' => Controls_Manager::SELECT,
					'options' => $options,
				]
			);

			if($field->getBelongsToLabel() === MetaTypes::CUSTOM_POST_TYPE){
				$this->add_control(
					'postId',
					[
						'label' => esc_html__( 'Post ID', ACPT_LITE_PLUGIN_NAME ),
						'type' => Controls_Manager::TEXT,
						'description' => esc_html__('It is possible to change the default behavior and make data retrieval from a certain post ID.', ACPT_LITE_PLUGIN_NAME ),
					]
				);
			}
		}
	}

	/**
	 * @return array
	 */
	protected function extractField()
	{
		$postId = null;
		$field = $this->get_settings( 'field' );
		$field = explode(TagsConstants::KEY_SEPARATOR, $field);

		if(empty($field)){
			return [];
		}

		if($field[0] === MetaTypes::CUSTOM_POST_TYPE){
			$postId = $this->get_settings('postId');
		}

		return [
			'belongsTo' => $field[0],
			'find' => $field[1],
			'boxName' => $field[2],
			'fieldName' => $field[3],
			'fieldType' => $field[4],
			'postId' => $postId,
		];
	}

	/**
	 * @return int|mixed
	 */
	protected function getCurrentPostId()
	{
		global $post;

		return (isset($_GET['post']) and get_post_type($_GET['post']) !== 'elementor_library') ? (int)$_GET['post'] : (int)$post->ID;
	}
}