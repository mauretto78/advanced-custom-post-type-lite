<?php

namespace ACPT_Lite\Integrations\Elementor\Widgets;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Helper\Currencies;
use ACPT_Lite\Core\Helper\Lengths;
use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Helper\Weights;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Core\Shortcodes\ACPT\OptionPageMetaShortcode;
use ACPT_Lite\Core\Shortcodes\ACPT\PostMetaShortcode;
use ACPT_Lite\Utils\PHP\Date;
use ACPT_Lite\Utils\Wordpress\WPAttachment;
use ACPT_Lite\Utils\Wordpress\WPUtils;

class WidgetRender
{
	/**
	 * @param MetaFieldModel $fieldModel
	 * @param $settings
	 *
	 * @return mixed|string|null
	 * @throws \Exception
	 */
	public static function render(MetaFieldModel $fieldModel, $settings)
	{
		$context = null;
		$contextId = null;

		if($fieldModel->getBelongsToLabel() === MetaTypes::CUSTOM_POST_TYPE){
			$context = 'post_id';
			$contextId = (isset($_GET['post']) and get_post_type($_GET['post']) !== 'elementor_library') ? $_GET['post'] : null;
			if($contextId === null){
				global $post;
				$contextId = $post->ID;
			}
		}

		if($context === null and $contextId === null){
			return null;
		}

		$box = esc_attr($fieldModel->getBox()->getName());
		$field = esc_attr($fieldModel->getName());
		$width = (isset($settings['acpt_width'])) ? $settings['acpt_width'] : null;
		$height = (isset($settings['acpt_height'])) ? $settings['acpt_height'] : null;
		$elements = (isset($settings['acpt_elements'])) ? $settings['acpt_elements'] : null;
		$target = (isset($settings['acpt_target'])) ? $settings['acpt_target'] : null;
		$dateFormat = (isset($settings['acpt_dateformat'])) ? $settings['acpt_dateformat'] : null;
		$timeFormat = (isset($settings['acpt_timeformat'])) ? $settings['acpt_timeformat'] : null;
		$render = (isset($settings['acpt_render'])) ? $settings['acpt_render'] : null;

		if (
			$_SERVER['PHP_SELF'] === '/wp-admin/post.php' or
			$_SERVER['PHP_SELF'] === '/wp-admin/admin-ajax.php'
		){
			return self::renderShortcode(
				$context,
				$contextId,
				$box,
				$field,
				$width,
				$height,
				$target,
				$dateFormat,
				$timeFormat,
				$elements,
				$render
			);
		}

		return self::renderField(
			$context,
			$contextId,
			$box,
			$field,
			$width,
			$height,
			$target,
			$dateFormat,
			$timeFormat,
			$elements,
			$render
		);
	}

	/**
	 * @param $contextId
	 * @param $context
	 * @param $box
	 * @param $field
	 * @param null $width
	 * @param null $height
	 * @param null $target
	 * @param null $dateFormat
	 * @param null $timeFormat
	 * @param null $elements
	 * @param null $render
	 *
	 * @return mixed|null
	 */
	private static function renderField(
		$context,
		$contextId,
		$box,
		$field,
		$width = null,
		$height = null,
		$target = null,
		$dateFormat = null,
		$timeFormat = null,
		$elements = null,
		$render = null
	)
	{
		$payload = [
			$context => $contextId,
			'box_name' => $box,
			'field_name' => $field,
		];

		if($target){
			$payload['target'] = $target;
		}

		if($width){
			$payload['width'] = $width;
		}

		if($height){
			$payload['height'] = $height;
		}

		if($dateFormat){
			$payload['date-format'] = $dateFormat;
		}

		if($timeFormat){
			$payload['time-format'] = $timeFormat;
		}

		if($elements){
			$payload['elements'] = $elements;
		}

		if($render){
			$payload['render'] = $render;
		}

		return acpt_field($payload);
	}

	/**
	 * @param $context
	 * @param $contextId
	 * @param $box
	 * @param $field
	 * @param null $width
	 * @param null $height
	 * @param null $target
	 * @param null $dateFormat
	 * @param null $timeFormat
	 * @param null $elements
	 * @param null $render
	 *
	 * @return string
	 * @throws \Exception
	 */
	private static  function renderShortcode(
		$context,
		$contextId,
		$box,
		$field,
		$width = null,
		$height = null,
		$target = null,
		$dateFormat = null,
		$timeFormat = null,
		$elements = null,
		$render = null
	)
	{
		$attr = [
			'box' => esc_attr($box),
			'field' => esc_attr($field),
			'width' => $width ? $width  : null,
			'height' => $height ? $height  : null,
			'target' => $target ? $target  : null,
			'date-format' => $dateFormat ? $dateFormat  : null,
			'time-format' => $timeFormat ? $timeFormat  : null,
			'elements' => $elements ? $elements  : null,
			'render' => $render ? $render  : null,
		];

		if($context === 'post_id'){
			$attr['pid'] = $contextId;
			$postMetaShortcode = new PostMetaShortcode();

			return $postMetaShortcode->render($attr);
		}

		return null;
	}
}
