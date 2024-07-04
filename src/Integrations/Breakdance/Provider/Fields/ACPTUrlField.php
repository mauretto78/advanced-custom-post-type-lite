<?php

namespace ACPT_Lite\Integrations\Breakdance\Provider\Fields;

use ACPT_Lite\Utils\Wordpress\Translator;
use Breakdance\DynamicData\StringData;

class ACPTUrlField extends ACPTStringField
{
	/**
	 * @return array
	 */
	public function controls()
	{
		return [
			\Breakdance\Elements\control('render',  Translator::translate('Render as'), [
				'type' => 'dropdown',
				'layout' => 'vertical',
				'items' => [
					['text' =>  Translator::translate('Plain text'), 'value' => 'text'],
					['text' =>  Translator::translate('Link'), 'value' => 'link'],
				]
			]),
			\Breakdance\Elements\control('id', 'ID', [
				'type' => 'text',
				'layout' => 'vertical',
				'condition' => [
					'path' => 'attributes.render',
					'operand' => 'equals',
					'value' => 'link'
				]
			]),
			\Breakdance\Elements\control('classes', Translator::translate('Classes (separated by space)'), [
				'type' => 'text',
				'layout' => 'vertical',
				'condition' => [
					'path' => 'attributes.render',
					'operand' => 'equals',
					'value' => 'link'
				]
			]),
			\Breakdance\Elements\control('target', Translator::translate('Target link'), [
				'type' => 'dropdown',
				'layout' => 'vertical',
				'items' => [
					['text' => Translator::translate('Opens in a new window or tab '), 'value' => '_blank'],
					['text' => Translator::translate('Opens in the full body of the window'), 'value' => '_self'],
					['text' => Translator::translate('Opens in the parent frame'), 'value' => '_parent'],
					['text' => Translator::translate('Opens in the same frame as it was clicked'), 'value' => '_top'],
				],
				'condition' => [
					'path' => 'attributes.render',
					'operand' => 'equals',
					'value' => 'link'
				]
			]),
		];
	}



	/**
	 * @inheritDoc
	 */
	public function defaultAttributes()
	{
		return [
			'id' => '',
			'classes' => '',
			'render' => 'text',
			'target' => '_blank',
		];
	}

	/**
	 * @param mixed $attributes
	 *
	 * @return StringData
	 * @throws \Exception
	 */
	public function handler($attributes): StringData
	{
		$id = $attributes['id'] ?? '';
		$classes = $attributes['classes'] ?? '';
		$format = $attributes['render'] ?? null;
		$target = $attributes['target'] ?? '_blank';
		$value = ACPTField::getValue($this->fieldModel, $attributes);

		if(!isset($value['url']) or empty($value['url'])){
			return StringData::emptyString();
		}

		$href = $value['url'];
		$anchorText = (!empty($value['label'])) ? $value['label'] : $value['url'];

		if($format === 'link'){
			$value = '<a id="'.$id.'" class="'.$classes.'" href="'.strip_tags($href).'" target="'.$target.'">'.$anchorText.'</a>';

			return StringData::fromString($value);
		}

		return StringData::fromString($href);
	}
}
