<?php

namespace ACPT_Lite\Integrations\Elementor\Widgets;

use ACPT_Lite\Constants\BelongsTo;
use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Generators\Meta\TableFieldGenerator;
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

        $belongsTo = $fieldModel->getBelongsToLabel();

        switch ($belongsTo){
            case BelongsTo::PARENT_POST_ID:
            case BelongsTo::POST_ID:
            case MetaTypes::CUSTOM_POST_TYPE:
            case BelongsTo::POST_TAX:
            case BelongsTo::POST_CAT:
            case BelongsTo::POST_TEMPLATE:
                $context = 'post_id';
                $contextId = (isset($_GET['post']) and get_post_type($_GET['post']) !== 'elementor_library') ? $_GET['post'] : null;

                if($contextId === null){
                    global $post;
                    $contextId = $post->ID;
                }

                break;

            case MetaTypes::OPTION_PAGE:
                $context = 'option_page';
                $contextId = $fieldModel->getFindLabel();
                break;
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
		$repeaterTemplate = (isset($settings['acpt_repeater'])) ? $settings['acpt_repeater'] : null;
		$repeaterWrapper = (isset($settings['acpt_wrapper'])) ? $settings['acpt_wrapper'] : 'div';
		$cssRepeaterWrapper = (isset($settings['acpt_css'])) ? $settings['acpt_css'] : '';
		$block = (isset($settings['acpt_block'])) ? $settings['acpt_block'] : null;

		if($fieldModel->getType() === MetaFieldModel::REPEATER_TYPE){
			return self::renderRepeater(
				$context,
				$contextId,
				$box,
				$field,
				$repeaterWrapper,
				$cssRepeaterWrapper,
				$repeaterTemplate
			);
		}

		if($fieldModel->getType() === MetaFieldModel::FLEXIBLE_CONTENT_TYPE){
			return self::renderFlexible(
				$context,
				$contextId,
				$box,
				$field,
				$repeaterWrapper,
				$cssRepeaterWrapper,
				$repeaterTemplate,
				$block
			);
		}

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

		if ($context === 'option_page'){
			$attr['page'] = $contextId;
			$optionPageMetaShortcode = new OptionPageMetaShortcode();

			return $optionPageMetaShortcode->render($attr);
		}

		return null;
	}

	/**
	 * @param $context
	 * @param $contextId
	 * @param $boxName
	 * @param $fieldName
	 * @param $wrapper
	 * @param $css
	 * @param $template
	 *
	 * @return string|null
	 */
	private static function renderRepeater(
		$context,
		$contextId,
		$boxName,
		$fieldName,
		$wrapper,
		$css,
		$template
	)
	{
		$rawData = get_acpt_field([
			$context => $contextId,
			'box_name' => $boxName,
			'field_name' => $fieldName,
		]);

		if (empty($rawData)){
			return null;
		}

		$settings = get_acpt_meta_field_object($boxName, $fieldName);
		$render = '<'.$wrapper.' class="'.$css.'">';

		// Extract tags.Allowed syntax:
		// %email:arg1,arg2%
		preg_match_all('/%[a-zA-Z0-9_ \:\,\-\/]+%/', $template, $variables);

		foreach ($rawData as $index => $item) {

			$replace = $template;

			foreach ($variables[0] as $variable){
				$var = self::extractVars($variable);
				$key = $var['key'];
				$args = $var['args'];

				if(isset($item[$key]) and !empty($item[$key])){
					$fieldSettings = array_filter($settings->children, function ($s) use ($key){
						return $s->name === $key;
					});

					if(!empty($fieldSettings)){
						$fieldSettings = array_values($fieldSettings)[0];
						$replace = str_replace($variable, self::replacingValue($item[$key], $fieldSettings->type, $args), $replace);
					}
				}
			}

			$render .= $replace;
		}

		$render .= '</'.$wrapper.'>';

		return $render;
	}

	/**
	 * @param $context
	 * @param $contextId
	 * @param $boxName
	 * @param $fieldName
	 * @param $wrapper
	 * @param $css
	 * @param $template
	 * @param $block
	 *
	 * @return string
	 */
	private static function renderFlexible(
		$context,
		$contextId,
		$boxName,
		$fieldName,
		$wrapper,
		$css,
		$template,
		$block = null
	)
	{
		if($block === null){
			return null;
		}

		$rawData = get_acpt_block([
			$context => $contextId,
			'box_name' => $boxName,
			'parent_field_name' => $fieldName,
			'block_name' => $block
		]);

		if (empty($rawData)){
			return null;
		}

		$settings = get_acpt_meta_field_object($boxName, $fieldName);
		$render = '<'.$wrapper.' class="'.$css.'">';

		// Extract tags.Allowed syntax:
		// %email:arg1,arg2%
		preg_match_all('/%[a-zA-Z0-9_ \:\,\-\/]+%/', $template, $variables);

		foreach ($rawData as $index => $items) {
			$numberOfFields = count(array_values($items[$block])[0]);

			for($i=0; $i < $numberOfFields; $i++){

				$replace = $template;

				foreach ($variables[0] as $variable){
					$var = self::extractVars($variable);
					$key = $var['key'];
					$args = $var['args'];

					$fieldSettings = array_filter($settings->blocks, function ($b) use ($key){

						$match = 0;

						foreach ($b->fields as $f){
							if($f->name === $key){
								$match++;
							}
						}

						return $match > 0;
					});

					if(!empty($fieldSettings)){
						$fieldSettings = array_values($fieldSettings)[0];
						$fieldSettings = array_filter($fieldSettings->fields, function ($s) use ($key){
							return $s->name === $key;
						});
					}

					if(!empty($fieldSettings)) {
						$fieldSettings = array_values( $fieldSettings )[0];
						$field = $items[$block][$key][$i];
						$replace = str_replace($variable, self::replacingValue($field, $fieldSettings->type, $args), $replace);
					}
				}

				$render .= $replace;
			}
		}

		$render .= '</'.$wrapper.'>';

		return $render;
	}

	/**
	 * @param string $variable
	 *
	 * @return array
	 */
	private static function extractVars($variable)
	{
		$var = str_replace("%", "", $variable);
		$pos = strpos($var,":");

		if($pos === false){
			return [
				'key' => $var,
				'args' => [],
			];
		}

		$varLen = strlen($var);

		$key = '';
		$vars = '';

		for($i = 0; $i < $pos; $i++){
			$key .= $var[$i];
		}

		for($i = ($pos+1); $i < $varLen; $i++){
			$vars .= $var[$i];
		}

		$args = explode(",", $vars);

		return [
			'key' => $key,
			'args' => $args,
		];
	}

	/**
	 * @param string $rawValue
	 * @param string $fieldType
	 * @param array $args
	 *
	 * @return string
	 */
	private static function replacingValue($rawValue, $fieldType, $args = [])
	{
		try {
			switch ($fieldType){

				// RATING_TYPE
				case MetaFieldModel::RATING_TYPE:
					if(!empty($args) and $args[0] === 'stars'){
						return Strings::renderStars($rawValue);
					}

					return ($rawValue/2)."/5";

				// CURRENCY_TYPE
				case MetaFieldModel::CURRENCY_TYPE:
					if(!is_array($rawValue)){
						return null;
					}

					if(!isset($rawValue['amount'])){
						return null;
					}

					if(!isset($rawValue['unit'])){
						return null;
					}

					$symbol = (isset(Currencies::getList()[$rawValue['unit']])) ? Currencies::getList()[$rawValue['unit']]['symbol'] : $rawValue['unit'];

					return $rawValue['amount'] . " ". $symbol;

				// DATE_RANGE_TYPE
				case MetaFieldModel::DATE_RANGE_TYPE:
					if(is_string($rawValue)){
						$rawValue = explode(" - ", $rawValue);
					}

					if(is_array($rawValue) and !empty($rawValue) and count($rawValue) === 2){
						$format = get_option( 'date_format' ) ? get_option( 'date_format' ) : 'Y-m-d';

						if(!empty($args)){
							foreach ($args as $arg){
								if(Date::isDateFormatValid($arg)){
									$format = $arg;
									break;
								}
							}
						}

						$value = date_i18n($format, strtotime($rawValue[0]));
						$value .= ' - ';
						$value .= date_i18n($format, strtotime($rawValue[1]));

						return $value;
					}

					return null;

				// DATE_TYPE
				case MetaFieldModel::DATE_TYPE:
					$format = get_option( 'date_format' ) ? get_option( 'date_format' ) : 'Y-m-d';
					if(!empty($args)){
						foreach ($args as $arg){
							if(Date::isDateFormatValid($arg)){
								$format = $arg;
								break;
							}
						}
					}

					return date_i18n($format, strtotime($rawValue));

				// DATE_TIME_TYPE
				case MetaFieldModel::DATE_TIME_TYPE:
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

						if(!is_array($formats)){
							return null;
						}

						$format = implode(" ", $formats);
					}

					return date_i18n($format, strtotime($rawValue));

				// TIME_TYPE
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

					return date_i18n($format, strtotime($rawValue));

				// EMAIL_TYPE
				case MetaFieldModel::EMAIL_TYPE:
					if(!empty($args) and $args[0] === 'link'){
						return '<a href="mailto:'.$rawValue.'">'.$rawValue.'</a>';
					}

					return $rawValue;

				// EMBED_TYPE
				case MetaFieldModel::EMBED_TYPE:

					$width = 2000;
					$height = 700;

					if(!empty($args)){
						$width = (isset($args[0])) ? $args[0] : $width;
						$height = (isset($args[1])) ? $args[1] : $height;
					}

					return (new \WP_Embed())->shortcode([
						'width' => $width,
						'height' => $height,
					], esc_attr($rawValue));

				// LENGTH_TYPE
				case MetaFieldModel::LENGTH_TYPE:

					if(!is_array($rawValue)){
						return null;
					}

					if(!isset($rawValue['length'])){
						return null;
					}

					if(!isset($rawValue['unit'])){
						return null;
					}

					$symbol = (isset(Lengths::getList()[$rawValue['unit']])) ? Lengths::getList()[$rawValue['unit']]['symbol'] : $rawValue['unit'];

					return $rawValue['length'] . " ". $symbol;

				// IMAGE_TYPE
				case MetaFieldModel::IMAGE_TYPE:
					if($rawValue instanceof WPAttachment and $rawValue->isImage()){
						return '<img src="'.$rawValue->getSrc().'" alt="'.$rawValue->getTitle().'"/>';
					}

					return $rawValue;

				// CHECKBOX_TYPE
				// SELECT_MULTI_TYPE
				case MetaFieldModel::SELECT_MULTI_TYPE:
				case MetaFieldModel::CHECKBOX_TYPE:
					if(!is_array($rawValue)){
						return null;
					}

					$separator = ", ";
					if(!empty($args) and !empty($args[0])){
						$separator = $args[0];
					}

					if(!is_array($rawValue)){
						return null;
					}

					return implode($separator, $rawValue);

				// VIDEO_TYPE
				case MetaFieldModel::VIDEO_TYPE:
					if($rawValue instanceof WPAttachment and $rawValue->isVideo()){

						$width = "100%";
						$height = null;

						if(!empty($args)){
							$width = (isset($args[0])) ? $args[0] : $width;
							$height = (isset($args[1])) ? $args[1] : $height;
						}

						return '<video width="'.$width.'" height="'.$height.'" controls>
	                            <source src="'.$rawValue->getSrc().'" type="'.$rawValue->getType().'">
	                            Your browser does not support the video tag.
	                        </video>';
					}

					return $rawValue;

				// GALLERY_TYPE
				case MetaFieldModel::GALLERY_TYPE:

					if(!is_array($rawValue)){
						return null;
					}

					if(empty($rawValue)){
						return null;
					}

					$columns = 4;
					if(!empty($args) and is_numeric($args[0])){
						$columns = $args[0];
					}

					$gallery = "<div class='acpt-gallery mosaic per-row-".$columns."'>";

					foreach ($rawValue as $image){
						if($image instanceof WPAttachment and $image->isImage()){
							$gallery .= '<img src="'.$image->getSrc().'" alt="'.$image->getTitle().'"/>';
						}
					}

					$gallery .= "</div>";

					return $gallery;

				// PHONE_TYPE
				case MetaFieldModel::PHONE_TYPE:
					if(!empty($args) and $args[0] === 'link'){
						return '<a href="tel:'.$rawValue.'">'.$rawValue.'</a>';
					}

					return $rawValue;

				// TABLE_TYPE
				case MetaFieldModel::TABLE_TYPE:

					if(is_string($rawValue) and Strings::isJson($rawValue)){
						$generator = new TableFieldGenerator($rawValue);

						return $generator->generate();
					}

					return null;

				// TEXTAREA_TYPE
				case MetaFieldModel::TEXTAREA_TYPE:

					if(!is_string($rawValue)){
						return null;
					}

					return WPUtils::renderShortCode($rawValue, true);

				// WEIGHT_TYPE
				case MetaFieldModel::WEIGHT_TYPE:
					if(!is_array($rawValue)){
						return null;
					}

					if(!isset($rawValue['weight'])){
						return null;
					}

					if(!isset($rawValue['unit'])){
						return null;
					}

					$symbol = (isset(Weights::getList()[$rawValue['unit']])) ? Weights::getList()[$rawValue['unit']]['symbol'] : $rawValue['unit'];

					return $rawValue['weight'] . " ". $symbol;

				// URL_TYPE
				case MetaFieldModel::URL_TYPE:
					if(!is_array($rawValue)){
						return null;
					}

					if(!isset($rawValue['url'])){
						return null;
					}

					$url = $rawValue['url'];
					$label = (isset($rawValue['label'])) ? $rawValue['label'] : $url;

					if(!empty($args) and $args[0] === 'link'){
						return '<a href="'.$url.'">'.$label.'</a>';
					}

					return $url;

				default:
					return $rawValue;
			}
		} catch (\Exception $exception){
			return $rawValue;
		}
	}
}
