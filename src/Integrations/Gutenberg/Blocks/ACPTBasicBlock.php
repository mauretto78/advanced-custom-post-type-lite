<?php

namespace ACPT_Lite\Integrations\Gutenberg\Blocks;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Helper\Currencies;
use ACPT_Lite\Core\Helper\Lengths;
use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Helper\Weights;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Utils\PHP\Country;
use ACPT_Lite\Utils\PHP\Maps;
use ACPT_Lite\Utils\PHP\Phone;
use ACPT_Lite\Utils\Wordpress\WPAttachment;
use ACPT_Lite\Utils\Wordpress\WPUtils;

class ACPTBasicBlock
{
	/**
	 * @param $attributes
	 * @param $content
	 *
	 * @return string
	 */
	public function render($attributes, $content)
	{
		if(isset($attributes['field'])){

			$closingDiv = '</div>';
			$openingDiv = str_replace($closingDiv, '', $content);

			$field = json_decode($attributes['field'], true);
			$className = $attributes['className'] ?? null;
			$align = $attributes['align'] ?? 'left';

			if(!is_array($field) or empty($field)){
				return null;
			}

			$rawData = $this->getRawData($field, $attributes);

			if($rawData === null){
				return null;
			}

			return $openingDiv.'<p style="text-align: '.$align.';" class="'.$className.'">'.$rawData.'</p>'.$closingDiv;
		}

		return null;
	}

	/**
	 * @param $field
	 * @param array $attributes
	 *
	 * @return mixed|string|null
	 */
	private function getRawData($field, $attributes = [])
	{
		$findValue = null;

		// try to calculate $find and $findValue
		if(isset($field['belongsTo']) and $field['belongsTo'] === MetaTypes::OPTION_PAGE){
			$findValue = $field['find'];
			$find = 'option_page';
		} elseif(isset($field['belongsTo']) and $field['belongsTo'] === MetaTypes::TAXONOMY){
			$find = 'term_id';
			$termId = null;

			// Front-end rendering
			$queriedObject = get_queried_object();
			if($queriedObject instanceof \WP_Term){
				$termId = $queriedObject->term_id;
			}

			// try to calculate $termId from HTTP_REFERER (AJAX request)
			if($termId === null){
				$referer = $_SERVER['HTTP_REFERER'];
				$parsedReferer = parse_url($referer);
				parse_str(  $parsedReferer['query'], $parsedRefererArray );

				$prefix = wp_get_theme()->get_stylesheet()."//".$field['find']."-";
				$taxonomySlug = str_replace($prefix, "", $parsedRefererArray['postId']);

				$term = get_term_by('slug', $taxonomySlug, $field['find'] );
				$termId = $term->term_id;
			}

			$findValue = (isset($attributes['postId']) and $attributes['postId'] < 99999999999999999) ? $attributes['postId'] : $termId;
		} else {
			global $post;

			$find = 'post_id';
			$findValue = (isset($attributes['postId']) and $attributes['postId'] < 99999999999999999) ? $attributes['postId'] : $post->ID;
		}

		// static preview if no context is available
		if(empty($findValue)){
			return '{acpt_'.$field['box'].'_'.$field['field'].'}';
		}

		if(isset($field['block_name'])){
			$args = [
				$find => $findValue,
				'box_name' => $field['box'],
				'field_name' => $field['field'],
				'parent_field_name' => $field['parent_field'],
				'index' => $field['index'],
				'block_name' => $field['block_name'],
				'block_index' => $field['block_index'],
			];

			$rawData = get_acpt_block_child_field($args);
		} elseif(isset($field['parent_field'])){
			$args = [
				$find => $findValue,
				'box_name' => $field['box'],
				'field_name' => $field['field'],
				'parent_field_name' => $field['parent_field'],
				'index' => $field['index'],
			];

			$rawData = get_acpt_child_field($args);
		} else {
			$args = [
				$find => $findValue,
				'box_name' => $field['box'],
				'field_name' => $field['field'],
			];

			$rawData = get_acpt_field($args);
		}

		if(!is_acpt_field_visible($args)){
			return null;
		}

		if(empty($rawData)){
			return null;
		}

		switch ($field['type']){

			case MetaFieldModel::ADDRESS_TYPE:

				if(!isset($rawData['address']) or empty($rawData['lat']) or empty($rawData['lng'])){
					return null;
				}

				$display = !empty($attributes['display']) ? $attributes['display'] : 'text';
				$zoom = !empty($attributes['zoom']) ? $attributes['zoom'] : 14;
				$width = !empty($attributes['width']) ? $attributes['width'] : "100%";
				$height = !empty($attributes['height']) ? $attributes['height'] : 500;

				if($display === 'text'){
					return $rawData['address'];
				}

				return Maps::render($width, $height, $rawData['address'], $zoom, $rawData['lat'], $rawData['lng'] );

			// COUNTRY_TYPE
			case MetaFieldModel::COUNTRY_TYPE:
				$value = null;
				if(is_array($rawData) and !empty($rawData) and isset($rawData['value'])){
					$display = $attributes['display'] ?? "text";

					if($display === 'flag' and isset($rawData['country'])){
						return Country::getFlag($rawData['country']);
					}

					if($display === 'full' and isset($rawData['country'])){
						return Country::fullFormat($rawData['country'], $rawData['value']);
					}

					return $rawData['value'];
				}

				break;

			// CURRENCY_TYPE
			case MetaFieldModel::CURRENCY_TYPE:

				if(!isset($rawData['amount']) or empty($rawData['amount'])){
					return null;
				}

				if(!isset($rawData['unit'])){
					return null;
				}

				$decimalPoints = $attributes['uomFormatDecimalPoints'] ?? 0;

				if($decimalPoints < 0){
					$decimalPoints = 0;
				}

				$decimalSeparator = $attributes['uomFormatDecimalSeparator'] ?? ".";
				$thousandsSeparator = $attributes['uomFormatThousandsSeparator'] ?? ",";
				$currencyFormat = $attributes['uomFormat'] ?? "full";
				$currencyPosition = $attributes['uomPosition'] ?? "after";

				$amount = $rawData['amount'];
				$unit = $rawData['unit'];

				$amount = number_format($amount, (int)$decimalPoints, $decimalSeparator, $thousandsSeparator);
				$unit = ($currencyFormat === 'abbreviation') ? Currencies::getSymbol($unit) : $unit;

				if($currencyPosition === 'none'){
					if($amount === null){
						return null;
					}

					return $amount;
				}

				if($currencyPosition === 'prepend'){
					if($unit === null or $amount === null){
						return null;
					}

					return $unit . ' ' . $amount;
				}

				if($unit === null or $amount === null){
					return null;
				}

				return $amount . ' ' . $unit;

			// DATE_RANGE_TYPE
			case MetaFieldModel::DATE_RANGE_TYPE:
				$value = null;
				if(is_array($rawData) and !empty($rawData) and count($rawData) === 2){
					$format = !empty($attributes['dateFormat']) ? $attributes['dateFormat'] : get_option( 'date_format' ) ?? 'Y-m-d';

					$value = date_i18n($format, strtotime($rawData[0]));
					$value .= ' - ';
					$value .= date_i18n($format, strtotime($rawData[1]));

					return $value;
				}

				break;

			// DATE_TIME_TYPE
			case MetaFieldModel::DATE_TIME_TYPE:
				$dateFormat = !empty($attributes['dateFormat']) ? $attributes['dateFormat'] : get_option( 'date_format' ) ?? 'Y-m-d';
				$timeFormat = !empty($attributes['timeFormat']) ? $attributes['timeFormat'] : get_option( 'time_format' ) ?? 'G:i';
				$format = $dateFormat . ' ' . $timeFormat;

				return  date_i18n($format, strtotime($rawData));

			// DATE_TYPE
			case MetaFieldModel::DATE_TYPE:
				$format = !empty($attributes['dateFormat']) ? $attributes['dateFormat'] : get_option( 'date_format' ) ?? 'Y-m-d';

				return  date_i18n($format, strtotime($rawData));

			// EMAIL_TYPE
			case MetaFieldModel::EMAIL_TYPE:

				if(isset($attributes['display']) and $attributes['display'] === 'link'){
					return '<a href="mailto:'.sanitize_email(strip_tags($rawData)).'">'.$rawData.'</a>';
				}

				return $rawData;

			// EMBED_TYPE
			case MetaFieldModel::EMBED_TYPE:

				$width = !empty($attributes['width']) ? $attributes['width'] : 180;
				$height = !empty($attributes['height']) ? $attributes['height'] : 135;

				return (new \WP_Embed())->shortcode([
					'width' => $width,
					'height' => $height,
				], $rawData);

			// FILE_TYPE
			case MetaFieldModel::FILE_TYPE:

				if(!isset($rawData['file'])){
					return null;
				}

				if(!$rawData['file'] instanceof WPAttachment){
					return null;
				}

				$label = '';

				if(!empty($rawData['before'])){
					$label .= $rawData['before'];
				}

				$label .= (!empty($rawData['label'])) ? $rawData['label'] : $rawData['file']->getTitle();

				if(!empty($rawData['after'])){
					$label .= $rawData['after'];
				}

				return '<a href="'.$rawData['file']->getSrc().'" target="_blank">'.$label.'</a>';

			// CURRENCY_TYPE
			case MetaFieldModel::GALLERY_TYPE:

				add_action( 'wp_enqueue_scripts', [new ACPTBasicBlock(), 'enqueueStyle'] );

				if(!is_array($rawData)){
					return null;
				}

				if(empty($rawData)){
					return null;
				}

				$display = !empty($attributes['display']) ? $attributes['display'] : 'mosaic';
				$gap = !empty($attributes['gap']) ? $attributes['gap'] : 20;
				$elementsPerRow = !empty($attributes['elements']) ? $attributes['elements'] : 3;

				// Carousel
				if($display === 'carousel'){
					$carousel = '<div class="acpt-gallery carousel per-row-'.$elementsPerRow.'">';

					for ($i = 1; $i <= count($rawData); $i++){
						$carousel .= '<input type="radio" name="slides" '. ($i === 1 ? 'checked="checked"' : '') .' id="slide-'.$i.'">';
					}

					$carousel .= '<ul class="carousel__slides">';

					/** @var WPAttachment $image */
					foreach ($rawData as $index => $image){
						if(!$image instanceof WPAttachment){
							return null;
						}

						$marginLeft = $index*100;

						$carousel .= ' <li class="carousel__slide" style="--slide-margin: -'.$marginLeft.'%;" >'.$this->renderImage('carousel', $image, $attributes).'</li>';
					}

					$carousel .= '</ul>';
					$carousel .= '<ul class="carousel__thumbnails">';

					/** @var WPAttachment $image */
					foreach ($rawData as $index => $image){
						if(!$image instanceof WPAttachment){
							return null;
						}

						$borderRadius = !empty($attributes['borderRadius']) ? $attributes['borderRadius'] : null;
						$imageAttributes = wp_get_attachment_image_src( $image->getId(), 'medium' );
						$imgStyle = '';

						if($borderRadius !== null){
							$imgStyle .= 'border-radius: '.$borderRadius['top'].' '.$borderRadius['right'].' '.$borderRadius['bottom'].' '.$borderRadius['left'].';';
						}

						$carousel .= '<li>
                    		<label for="slide-'.($index+1).'">
                    			<img 
                    			    style="'.$imgStyle.'"
                    			    src="'.(!empty($imageAttributes) ? $imageAttributes[0] : $image->getSrc()).'" 
                    			    alt="'.$image->getAlt().'" 
                    			    title="'.$image->getTitle().'"
                    			/>
                    		</label>
                		</li>';
					}

                    $carousel .= '</ul>';
					$carousel .= '</div>';

					return $carousel;
				}

				// Masonry
				if($display === 'masonry'){
					$masonry = '<div style="column-gap:'.$gap.'px;" class="acpt-gallery masonry per-row-'.$elementsPerRow.'">';

					/** @var WPAttachment $image */
					foreach ($rawData as $image){
						if(!$image instanceof WPAttachment){
							return null;
						}

						$masonry .= $this->renderImage('masonry', $image, $attributes);
					}

					$masonry .= '</div>';

					return $masonry;
				}

				// Mosaic
				$mosaic = '<div style="gap:'.$gap.'px;" class="acpt-gallery mosaic per-row-'.$elementsPerRow.'">';

				/** @var WPAttachment $image */
				foreach ($rawData as $image){
					if(!$image instanceof WPAttachment){
						return null;
					}

					$mosaic .= $this->renderImage('mosaic', $image, $attributes);
				}

				$mosaic .= '</div>';

				return $mosaic;

			// ICON_TYPE
			case MetaFieldModel::ICON_TYPE:

				$fontSize = $attributes['fontSize'] ?? null;
				$color = $attributes['color'] ?? null;

				$styles = '';

				if($color !== null){
					$styles .= 'color: ' . $color . ';';
				}

				if($fontSize !== null and is_numeric($fontSize)){
					$styles .= 'font-size: ' . $fontSize . 'px;';
				}

				return '<span style="'.$styles.'">' . $rawData . '</span>';

			// IMAGE_TYPE
			case MetaFieldModel::IMAGE_TYPE:

				if(!$rawData instanceof WPAttachment){
					return null;
				}

				return $this->renderImage('single', $rawData, $attributes);

			// LENGTH_TYPE
			case MetaFieldModel::LENGTH_TYPE:

				if(!isset($rawData['length']) or empty($rawData['length'])){
					return null;
				}

				if(!isset($rawData['unit'])){
					return null;
				}

				$decimalPoints = $attributes['uomFormatDecimalPoints'] ?? 0;

				if($decimalPoints < 0){
					$decimalPoints = 0;
				}

				$decimalSeparator = $attributes['uomFormatDecimalSeparator'] ?? ".";
				$thousandsSeparator = $attributes['uomFormatThousandsSeparator'] ?? ",";
				$currencyFormat = $attributes['uomFormat'] ?? "full";
				$currencyPosition = $attributes['uomPosition'] ?? "after";

				$length = $rawData['length'];
				$unit = $rawData['unit'];

				$length = number_format($length, (int)$decimalPoints, $decimalSeparator, $thousandsSeparator);
				$unit = ($currencyFormat === 'abbreviation') ? Lengths::getSymbol($unit) : $unit;

				if($currencyPosition === 'none'){
					if($length === null){
						return null;
					}

					return $length;
				}

				if($currencyPosition === 'prepend'){
					if($unit === null or $length === null){
						return null;
					}

					return $unit . ' ' . $length;
				}

				if($unit === null or $length === null){
					return null;
				}

				return $length . ' ' . $unit;

			// CURRENCY_TYPE
			case MetaFieldModel::LIST_TYPE:
				$display = !empty($attributes['display']) ? $attributes['display'] : 'ul';

				if($display === 'ul'){
					$ul = '<ul>';

					foreach ($rawData as $item){
						$ul .= '<li>'.$item.'</li>';
					}

					$ul .= '</ul>';

					return $ul;
				}

				if($display === 'ol'){
					$ol = '<ol>';

					foreach ($rawData as $item){
						$ol .= '<li>'.$item.'</li>';
					}

					$ol .= '</ol>';

					return $ol;
				}

				if(!is_array($rawData)){
					return null;
				}

				return implode(", ", $rawData);

			// PHONE_TYPE
			case MetaFieldModel::PHONE_TYPE:
				if(isset($attributes['display']) and $attributes['display'] === 'link'){
					return '<a href="tel:'.Phone::url($rawData).'">'.$rawData.'</a>';
				}

				return $rawData;

			// RATING_TYPE
			case MetaFieldModel::RATING_TYPE:

				$display = $attributes['display'] ?? 'star';
				$color = $attributes['color'] ?? null;
				$styles = '';

				if($color !== null){
					$styles .= 'color: ' . $color . ';';
				}

				$rating = ($display === 'star') ? Strings::renderStars($rawData) : Strings::renderRatingAsString($rawData);

				return '<span style="'.$styles.'">' . $rating . '</span>';

			// SELECT_MULTI_TYPE
			case MetaFieldModel::CHECKBOX_TYPE:
			case MetaFieldModel::SELECT_MULTI_TYPE:
				$display = $attributes['display'] ?? 'list';

				if($display === 'list'){
					$ul = '<ul>';

					foreach ($rawData as $item){
						$ul .= '<li>'.$item.'</li>';
					}

					$ul .= '</ul>';

					return $ul;
				}

				if(!is_array($rawData)){
					return null;
				}

				return implode(", ", $rawData);

			// TEXTAREA_TYPE
			case MetaFieldModel::TEXTAREA_TYPE:

				if(!is_string($rawData)){
					return null;
				}

				return WPUtils::renderShortCode($rawData, true);

			// TIME_TYPE
			case MetaFieldModel::TIME_TYPE:
				$format = !empty($attributes['timeFormat']) ? $attributes['timeFormat'] : get_option( 'time_format' ) ?? 'G:i';

				return  date_i18n($format, strtotime($rawData));

			// URL_TYPE
			case MetaFieldModel::URL_TYPE:

				if(!isset($rawData['url'])){
					return null;
				}

				$url = $rawData['url'];
				$label = $rawData['label'] ?? $url;
				$target = $attributes['target'] ?? '_self';
				$gradient = $attributes['gradient'] ?? null;
				$textColor = $attributes['textColor'] ?? null;
				$backgroundColor = $attributes['backgroundColor'] ?? null;
				$border = $attributes['border'] ?? [];
				$borderRadius = $attributes['borderRadius'] ?? [];
				$padding = $attributes['padding'] ?? [];

				$style = '';

				if($backgroundColor !== null){
					$style .= 'background-color: '.$backgroundColor.';';
				}

				if($gradient !== null){
					$style .= 'background-image: '.$gradient.';';
				}

				if($textColor !== null){
					$style .= 'color: '.$textColor.';';
				}

				if($border !== null){
					$borderWidth = $border['width'] ?? '1px';
					$borderColor = $border['color'] ?? 'inherit';
					$borderStyle = $border['style'] ?? 'solid';

					$style .= 'border: '.$borderWidth.' '.$borderStyle.' '.$borderColor.';';
				}

				if(!empty($padding)){
					$style .= 'padding: '.implode(' ', $padding).';';
				}

				if(!empty($borderRadius)){
					$style .= 'border-radius: '.implode(' ', $borderRadius).';';
				}

				return '<a style="'.$style.'" href="'.esc_url(strip_tags($url)).'" target="'.$target.'">'.$label.'</a>';

			// VIDEO_TYPE
			case MetaFieldModel::VIDEO_TYPE:

				if(!$rawData instanceof WPAttachment){
					return null;
				}

				$width = $attributes['width'] ?? "100%";
				$height = $attributes['height'] ?? null;

				return '<video width="'.$width.'" height="'.$height.'" controls>
	                    <source src="'.$rawData->getSrc().'" type="video/mp4">
	                    Your browser does not support the video tag.
	                </video>';

			// WEIGHT_TYPE
			case MetaFieldModel::WEIGHT_TYPE:

				if(!isset($rawData['weight']) or empty($rawData['weight'])){
					return null;
				}

				if(!isset($rawData['unit'])){
					return null;
				}

				$decimalPoints = $attributes['uomFormatDecimalPoints'] ?? 0;

				if($decimalPoints < 0){
					$decimalPoints = 0;
				}

				$decimalSeparator = $attributes['uomFormatDecimalSeparator'] ?? ".";
				$thousandsSeparator = $attributes['uomFormatThousandsSeparator'] ?? ",";
				$currencyFormat = $attributes['uomFormat'] ?? "full";
				$currencyPosition = $attributes['uomPosition'] ?? "after";

				$weight = $rawData['weight'];
				$unit = $rawData['unit'];

				$weight = number_format($weight, (int)$decimalPoints, $decimalSeparator, $thousandsSeparator);
				$unit = ($currencyFormat === 'abbreviation') ? Weights::getSymbol($unit) : $unit;

				if($currencyPosition === 'none'){
					if($weight === null){
						return null;
					}

					return $weight;
				}

				if($currencyPosition === 'prepend'){
					if($unit === null or $weight === null){
						return null;
					}

					return $unit . ' ' . $weight;
				}

				if($unit === null or $weight === null){
					return null;
				}

				return $weight . ' ' . $unit;

			default:
				return do_shortcode($rawData);
		}
	}

	/**
	 * @param string $display
	 * @param WPAttachment $image
	 * @param $attributes
	 *
	 * @return string
	 */
	private function renderImage($display, WPAttachment $image, $attributes)
	{
		$gap = !empty($attributes['gap']) ? $attributes['gap'] : 20;
		$width = $attributes['width'] ?? null;
		$height = $attributes['height'] ?? null;
		$border = !empty($attributes['border']) ? $attributes['border'] : null;
		$borderRadius = !empty($attributes['borderRadius']) ? $attributes['borderRadius'] : null;
		$imgStyle = '';
		$figureStyle = '';

		if($border !== null){
			$imgStyle .= 'border: '.$border['width'].' '. ((isset($border['style'])) ? $border['style'] : 'solid').' '.$border['color'].';';
		}

		if($borderRadius !== null){
			$imgStyle .= 'border-radius: '.$borderRadius['top'].' '.$borderRadius['right'].' '.$borderRadius['bottom'].' '.$borderRadius['left'].';';
		}

		if($display === 'masonry'){
			$figureStyle .= "margin: 0 0 ".$gap."px;";
		}

		return '<figure style="'.$figureStyle.'"><img style="'.$imgStyle.'" src="'.$image->getSrc().'" alt="'.$image->getAlt().'" title="'.$image->getTitle().'" width="'.$width.'" height="'.$height.'" /></figure>';
	}

	/**
	 * Enqueue CSS scripts
	 */
	public function enqueueStyle()
	{
		wp_register_style( 'gallery-css', plugin_dir_url( __FILE__ ) . '../../../../assets/static/css/gallery.css', [], ACPT_PLUGIN_VERSION );
		wp_enqueue_style( 'gallery-css' );
	}
}