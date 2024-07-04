<?php

namespace ACPT_Lite\Integrations\Breakdance\Provider\Fields;

use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Utils\Wordpress\Translator;
use Breakdance\DynamicData\StringData;
use function Breakdance\DynamicData\breakdanceDoShortcode;

class ACPTIconField extends ACPTStringField
{
	/**
	 * @return array
	 */
	public function controls()
	{
		return [
			\Breakdance\Elements\control('id', 'ID', [
				'type' => 'text',
				'layout' => 'vertical',
			]),
			\Breakdance\Elements\control('classes', Translator::translate('Classes (separated by space)'), [
				'type' => 'text',
				'layout' => 'vertical',
			]),
			\Breakdance\Elements\control('size', Translator::translate('Size (px)'), [
				'type' => 'number',
				'layout' => 'vertical',
			]),
			\Breakdance\Elements\control('color', Translator::translate('Color'), [
				'type' => 'color',
				'layout' => 'vertical',
			]),
			\Breakdance\Elements\control('spacing', Translator::translate('Spacing (px)'), [
				'type' => 'number',
				'layout' => 'vertical',
			]),
			\Breakdance\Elements\control('clickable', Translator::translate('Is clickable?'), [
				'type' => 'dropdown',
				'layout' => 'vertical',
				'items' => [
					['text' => Translator::translate('No'), 'value' => "0"],
					['text' => Translator::translate('Yes'), 'value' => "1"],
				],
			]),
			\Breakdance\Elements\control('url', 'URL', [
				'type' => 'link',
				'layout' => 'vertical',
				'condition' => [
					'path' => 'attributes.clickable',
					'operand' => 'equals',
					'value' => '1'
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
					'path' => 'attributes.clickable',
					'operand' => 'equals',
					'value' => '1'
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
			'size' => '18',
			'spacing' => '',
			'color' => '',
			'clickable' => '0',
			'target' => '_blank',
			'url' => '',
		];
	}

	public function handler($attributes): StringData
	{
		$id = $attributes['id'] ?? '';
		$classes = $attributes['classes'] ?? '';
		$size = $attributes['size'] ?? '18';
		$spacing = $attributes['spacing'] ?? null;
		$color = $attributes['color'] ?? null;
		$clickable = $attributes['clickable'] ?? "0";
		$target = $attributes['target'] ?? "_blank";
		$url = $attributes['url'] ? $this->convertUrl($attributes['url']) : null;
		$value = ACPTField::getValue($this->fieldModel, $attributes);

		if($value === null){
			return StringData::emptyString();
		}

		$value = '<span id="'.$id.'" class="'.$classes.'" style="'.$this->styleAttributes($size, $spacing, $color).'">' . $value . '</span>';

		if($clickable == "1" and $url !== null){
			$value = '<a href="'.$url.'" target="'.$target.'">' . $value . '</a>';
		}

		return StringData::fromString($value);
	}

	/**
	 * @param $url
	 *
	 * @return array|string
	 */
	private function convertUrl($url)
	{
		if(Strings::contains('breakdance_dynamic', $url)){
			$shortcode = html_entity_decode($url, ENT_QUOTES | ENT_HTML5);

			try {
				return breakdanceDoShortcode($shortcode);
			} catch ( \Exception $e ) {
				return $url;
			}
		}

		return $url;
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