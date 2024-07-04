<?php

namespace ACPT_Lite\Integrations\Zion\Provider\Fields;

use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Integrations\Zion\Provider\Utils\FieldSettings;
use ACPT_Lite\Integrations\Zion\Provider\Utils\FieldValue;
use ACPT_Lite\Utils\Wordpress\Translator;
use ACPT_Lite\Utils\Wordpress\WPAttachment;

class AcptFieldTypeVideo extends AcptFieldBase
{
	/**
	 * Retrieve the list of all supported field types
	 * @return array
	 */
	public static function getSupportedFieldTypes()
	{
		return [
			MetaFieldModel::VIDEO_TYPE,
		];
	}

	/**
	 * @return string
	 */
	public function get_category()
	{
		return self::CATEGORY_TEXT;
	}

	/**
	 * @return string
	 */
	public function get_id()
	{
		return 'acpt-field-video';
	}

	/**
	 * @return string
	 */
	public function get_name()
	{
		return Translator::translate( 'ACPT Video field');
	}

	/**
	 * @return array
	 * @throws \Exception
	 */
	public function get_options()
	{
		return array_merge(
			parent::get_options(),
			[
				'controls' => [
					'type'        => 'checkbox_switch',
					'title'       => Translator::translate('Controls'),
					'description' => Translator::translate('Allow video controls.'),
					'default'     => true,
				],
				'autoplay' => [
					'type'        => 'checkbox_switch',
					'title'       => Translator::translate('Autoplay'),
					'description' => Translator::translate('Autoplay player.'),
					'default'     => true,
				],
				'width' => [
					'type'        => 'text',
					'title'       => Translator::translate('Video width'),
					'description' => Translator::translate('Video width (% is allowed).'),
					'default'     => '100%',
				],
				'height' => [
					'type'        => 'text',
					'title'       => Translator::translate('Video height'),
					'description' => Translator::translate('Video height (% is allowed).'),
					'default'     => '',
				],
			]
		);
	}

	/**
	 * @param mixed $fieldObject
	 *
	 * @throws \Exception
	 */
	public function render($fieldObject)
	{
		//#! Invalid entry, nothing to do here
		if (empty($fieldObject[ 'field_name' ])) {
			return;
		}

		$fieldSettings = FieldSettings::get($fieldObject[ 'field_name' ]);

		if($fieldSettings === false or empty($fieldSettings)){
			return;
		}

		/** @var MetaFieldModel $metaFieldModel */
		$metaFieldModel = $fieldSettings['model'];
		$belongsTo = $fieldSettings['belongsTo'];

		if(!$this->isSupportedFieldType($metaFieldModel->getType())){
			return;
		}

		$rawValue = FieldValue::raw($belongsTo, $metaFieldModel);

		if(empty($rawValue)){
			return;
		}

		if(!$rawValue instanceof WPAttachment){
			return;
		}

		if(!$rawValue->isVideo()){
			return;
		}

		$controls = $fieldObject['controls'] ?? true;
		$autoplay = $fieldObject['autoplay'] ?? ',';
		$width = $fieldObject['width'] ?? '100%';
		$height = $fieldObject['height'] ?? null;

		echo $this->renderVideoPlayer($rawValue, $controls, $autoplay, $width, $height);
	}

	/**
	 * @param WPAttachment $attachment
	 * @param bool $controls
	 * @param bool $autoplay
	 * @param string $width
	 * @param null $height
	 *
	 * @return string
	 */
	private function renderVideoPlayer(WPAttachment $attachment, $controls = true, $autoplay = true, $width = '100%', $height = null)
	{
		$video = '<video';

		if($controls){
			$video .= ' controls';
		}

		if($autoplay){
			$video .= ' autoplay';
		}

		$video .= ' style="width:'.$width.';';

		if($height){
			$video .= 'height:'.$height.';';
		}

		$video .= '">';

		$video .= '<source src="'.esc_url($attachment->getSrc()).'" type="'.$attachment->getType().'">';
		$video .= 'Your browser does not support the video tag.';
		$video .= '</video>';

		return $video;
	}
}