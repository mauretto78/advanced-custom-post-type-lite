<?php

namespace ACPT_Lite\Integrations\Zion\Provider\Fields;

use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Integrations\Zion\Provider\Utils\FieldSettings;
use ACPT_Lite\Integrations\Zion\Provider\Utils\FieldValue;
use ACPT_Lite\Utils\Wordpress\Translator;

class AcptFieldTypeListValues extends AcptFieldBase
{
	/**
	 * Retrieve the list of all supported field types
	 * @return array
	 */
	public static function getSupportedFieldTypes()
	{
		return [
			MetaFieldModel::CHECKBOX_TYPE,
			MetaFieldModel::SELECT_MULTI_TYPE,
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
		return 'acpt-field-type-list-values';
	}

	/**
	 * @return string
	 */
	public function get_name()
	{
		return Translator::translate( 'ACPT List values field');
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
				'list' => [
					'type'        => 'select',
					'title'       => Translator::translate('List format'),
					'description' => Translator::translate('Select the list format'),
					'placeholder' => Translator::translate('--Select--'),
					'default'     => 'list',
					'options'     => [
						['name' => 'list', 'id' => 'list'],
						['name' => 'string', 'id' => 'string'],
					]
				],
				'separator' => [
					'type'        => 'text',
					'title'       => Translator::translate('Separator'),
					'description' => Translator::translate('Select the separator'),
					'default'     => ',',
				],
				'classes' => [
					'type'        => 'text',
					'title'       => Translator::translate('Classes (separated by space)'),
					'description' => Translator::translate('Classes (separated by space)'),
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

		$format = $fieldObject['format'] ?? 'value';
		$separator = $fieldObject['separator'] ?? ',';
		$list = $fieldObject['list'] ?? 'string';
		$classes = $fieldObject['classes'] ?? '';

		echo $this->renderList($metaFieldModel, $rawValue, $separator, $format, $list, $classes);
	}

	/**
	 * @param MetaFieldModel $metaFieldModel
	 * @param array $list
	 * @param string $separator
	 * @param null $render
	 * @param null $listFormat
	 * @param null $classes
	 *
	 * @return string
	 */
	private function renderList(MetaFieldModel $metaFieldModel, array $list, $separator = ',', $render = null, $listFormat = null, $classes = null)
	{
		$renderedList = [];

		foreach ($list as $item){
			$item = ($render === 'label') ? $metaFieldModel->getOptionLabel($item) : $item;
			$renderedList[] = $item;
		}

		if($listFormat === 'list'){
			$return = '<ul>';

			foreach ($renderedList as $item){
				$return .= '<li class="'.$classes.'">'.$item.'</li>';
			}

			$return .= '</ul>';

			return $return;
		}

		return implode($separator, $renderedList);
	}
}