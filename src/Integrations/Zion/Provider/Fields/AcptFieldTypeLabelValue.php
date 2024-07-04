<?php

namespace ACPT_Lite\Integrations\Zion\Provider\Fields;

use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Integrations\Zion\Provider\Utils\FieldSettings;
use ACPT_Lite\Integrations\Zion\Provider\Utils\FieldValue;
use ACPT_Lite\Utils\Wordpress\Translator;

class AcptFieldTypeLabelValue extends AcptFieldBase
{
	/**
	 * Retrieve the list of all supported field types
	 * @return array
	 */
	public static function getSupportedFieldTypes()
	{
		return [
			MetaFieldModel::RADIO_TYPE,
			MetaFieldModel::SELECT_TYPE,
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
		return 'acpt-field-label-value';
	}

	/**
	 * @return string
	 */
	public function get_name()
	{
		return Translator::translate( 'ACPT Label-value field');
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
				'format' => [
					'type'        => 'select',
					'title'       => Translator::translate('What you want to display?'),
					'description' => Translator::translate('What you want to display?'),
					'placeholder' => Translator::translate('--Select--'),
					'default'     => 'value',
					'options'     => [
						['name' => Translator::translate('Value'), 'id' => 'value'],
						['name' => Translator::translate('Label'), 'id' => 'label'],
					]
				],
				'separator' => [
					'type'        => 'text',
					'title'       => Translator::translate('Separator'),
					'description' => Translator::translate('Select the separator'),
					'default'     => ',',
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

		$format = $fieldObject['format'] ?? 'value';
		$separator = $fieldObject['separator'] ?? ',';

		echo $this->renderItem($metaFieldModel, $rawValue, $format);
	}

	/**
	 * @param MetaFieldModel $metaFieldModel
	 * @param $value
	 * @param null $render
	 *
	 * @return string|null
	 */
	private function renderItem(MetaFieldModel $metaFieldModel, $value, $render = null)
	{
		if($render === 'label'){
			return $metaFieldModel->getOptionLabel($value);
		}

		return $value;
	}
}