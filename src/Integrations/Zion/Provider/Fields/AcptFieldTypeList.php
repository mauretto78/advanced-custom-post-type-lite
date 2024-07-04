<?php

namespace ACPT_Lite\Integrations\Zion\Provider\Fields;

use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Integrations\Zion\Provider\Utils\FieldSettings;
use ACPT_Lite\Integrations\Zion\Provider\Utils\FieldValue;
use ACPT_Lite\Utils\Wordpress\Translator;

class AcptFieldTypeList extends AcptFieldBase
{
	/**
	 * Retrieve the list of all supported field types
	 * @return array
	 */
	public static function getSupportedFieldTypes()
	{
		return [
			MetaFieldModel::LIST_TYPE
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
		return 'acpt-field-list';
	}

	/**
	 * @return string
	 */
	public function get_name()
	{
		return Translator::translate( 'ACPT List field');
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
					'title'       => Translator::translate('List format'),
					'description' => Translator::translate('Select the list format'),
					'placeholder' => Translator::translate('--Select--'),
					'default'     => 'li',
					'options'     => [
						['name' =>  Translator::translate('Unordered list'), 'id' => 'li'],
						['name' =>  Translator::translate('Ordered list'), 'id' => 'ol'],
						['name' =>  Translator::translate('Strings'), 'id' => 'string'],
					]
				],
				'separator' => [
					'type'        => 'text',
					'title'       => Translator::translate('String separator'),
					'description' => Translator::translate('Select the string separator'),
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

		$format = $fieldObject['format'] ?? 'li';
		$separator = $fieldObject['separator'] ?? ',';
		$classes = $fieldObject['classes'] ?? '';

		if(empty($rawValue)){
			return;
		}

		if(!is_array($rawValue)){
			return;
		}

		echo ($format === 'li' or $format === 'ol') ? $this->renderList($rawValue, $format, $classes) : $this->renderString($rawValue, $separator);
	}

	/**
	 * @param array $rawValue
	 * @param string $format
	 * @param string $classes
	 *
	 * @return string
	 */
	private function renderList($rawValue = [], $format = 'ul', $classes = '')
	{
		$list = ($format === 'ol') ? '<ol>' : '<ul>';

		foreach ($rawValue as $item) {
			$list .= '<li class="'.$classes.'">'.$item.'</li>';
		}

		$list .= ($format === 'ol') ? '</ol>' : '</ul>';

		return $list;
	}

	/**
	 * @param array $rawValue
	 * @param string $separator
	 *
	 * @return string
	 */
	private function renderString($rawValue = [], $separator = ',')
	{
		return implode($separator, $rawValue);
	}
}