<?php

namespace ACPT_Lite\Integrations\Zion\Provider\Fields;

use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Integrations\Zion\Provider\Utils\FieldSettings;
use ACPT_Lite\Integrations\Zion\Provider\Utils\FieldValue;
use ACPT_Lite\Utils\Wordpress\Translator;

class AcptFieldTypeIcon extends AcptFieldBase
{
	/**
	 * Retrieve the list of all supported field types
	 * @return array
	 */
	public static function getSupportedFieldTypes()
	{
		return [
			MetaFieldModel::ICON_TYPE,
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
		return 'acpt-field-icon';
	}

	/**
	 * @return string
	 */
	public function get_name()
	{
		return Translator::translate( 'ACPT Icon field');
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
				'size' => [
					'type'        => 'number',
					'title'       => Translator::translate('Size (px)'),
					'description' => Translator::translate('Set the icon size.'),
					'default'     => '24',
				],
				'color' => [
					'type'        => 'colorpicker',
					'title'       => Translator::translate('Color'),
					'description' => Translator::translate('Select the icon color.'),
					'default'     => '#000000',
				],
				'spacing' => [
					'type'        => 'number',
					'title'       => Translator::translate('Spacing (px)'),
					'description' => Translator::translate('Select the icon spacing.'),
					'default'     => '0',
				]
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
		if(empty($fieldObject['field_name'])) {
			return;
		}

		$fieldSettings = FieldSettings::get($fieldObject['field_name']);

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

		$size = $fieldObject['size'] ?? 24;
		$color = $fieldObject['color'] ?? '#000000';
		$spacing = $fieldObject['spacing'] ?? 0;

		echo '<span style="'.$this->styleAttributes($size, $spacing, $color).'">'.$rawValue.'</span>';
	}

	/**
	 * @param string $size
	 * @param null $spacing
	 * @param null $color
	 *
	 * @return string
	 */
	private function styleAttributes($size = '18', $spacing = null, $color = null)
	{
		$attributes = 'font-size: '.$size.'px;';

		if($spacing){
			$attributes .= 'padding: '.$spacing.'px;';
		}

		if($color){
			$attributes .= 'color: '.$color.';';
		}

		return $attributes;
	}
}