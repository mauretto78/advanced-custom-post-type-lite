<?php

namespace ACPT_Lite\Integrations\Breakdance\Provider\Fields;

use ACPT_Lite\Utils\Wordpress\Translator;
use ACPT_Lite\Utils\Wordpress\WPAttachment;
use Breakdance\DynamicData\StringData;

class ACPTFileField extends ACPTStringField
{
	/**
	 * @return array
	 */
	public function controls()
	{
		return [
			\Breakdance\Elements\control('render', Translator::translate('Render as'), [
				'type' => 'dropdown',
				'layout' => 'vertical',
				'items' => [
					['text' => Translator::translate('Plain text'), 'value' => 'text'],
					['text' => Translator::translate('Link'), 'value' => 'link'],
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
		$format = $attributes['render'] ?? null;
		$target = $attributes['target'] ?? '_blank';
		$value = ACPTField::getValue($this->fieldModel, $attributes);

		if(!isset($value['file']) or !$value['file'] instanceof WPAttachment){
			return StringData::emptyString();
		}

		/** @var WPAttachment $file */
		$file = $value['file'];
		$src = $file->getSrc();
		$label = (isset($value['label'])) ? $value['label'] : $src;

		if($format === 'link'){
			$value = '<a href="'.$src.'" target="'.$target.'">'.$label.'</a>';

			return StringData::fromString($value);
		}

		return StringData::fromString($label);
	}
}
