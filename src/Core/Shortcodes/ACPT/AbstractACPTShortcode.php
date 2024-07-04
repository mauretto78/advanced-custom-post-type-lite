<?php

namespace ACPT_Lite\Core\Shortcodes\ACPT;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Repository\MetaRepository;
use ACPT_Lite\Core\Shortcodes\ACPT\DTO\ShortcodePayload;
use ACPT_Lite\Core\Shortcodes\ACPT\Fields\AbstractField;
use ACPT_Lite\Utils\Data\Meta;

abstract class AbstractACPTShortcode
{
    /**
     * @param string $type
     * @param ShortcodePayload $payload
     * @return null|AbstractField
     */
    protected function getField($type, ShortcodePayload $payload)
    {
        $className = 'ACPT\\Core\\Shortcodes\\ACPT\\Fields\\'.$type.'Field';

        if(class_exists($className)){
	        return new $className($payload);
        }

        return null;
    }

	/**
	 * Render the shortcode
	 *
	 * @param $atts
	 *
	 * @return mixed
	 */
	public abstract function render($atts);

	/**
	 * @param $elementId
	 * @param $belongsTo
	 * @param $find
	 * @param $atts
	 *
	 * @return mixed|string|null
	 */
	protected function renderShortcode($elementId, $belongsTo, $find = null, array $atts = [])
	{
		try {
			$box = $atts['box'];
			$field = $atts['field'];
			$blockName = isset ($atts['block_name'] ) ? $atts['block_name'] : null;
			$blockIndex = isset ($atts['block_index'] ) ? $atts['block_index'] : null;
			$width = isset ($atts['width'] ) ? $atts['width'] : null;
			$height = isset ($atts['height'] ) ? $atts['height'] : null;
			$target = isset ($atts['target'] ) ? $atts['target'] : null;
			$dateFormat = isset ($atts['date-format'] ) ? $atts['date-format'] : null;
			$timeFormat = isset ($atts['time-format'] ) ? $atts['time-format'] : null;
			$elements = isset ($atts['elements'] ) ? $atts['elements'] : null;
			$preview = (isset($atts['preview']) and $atts['preview'] === 'true') ? true : false;
			$parent = (isset($atts['parent'])) ? $atts['parent'] : null;
			$index = (isset($atts['index'])) ? $atts['index'] : null;
			$render = (isset($atts['render'])) ? $atts['render'] : null;
			$list = (isset($atts['list'])) ? $atts['list'] : null;
			$separator = (isset($atts['separator'])) ? $atts['separator'] : null;
			$classes = (isset($atts['classes'])) ? $atts['classes'] : null;

			if($parent){
				$key = $this->fieldKey($belongsTo, $find, $box, $parent);
				@$groupRawValue = Meta::fetch($elementId, $belongsTo, $key, true);

				if($groupRawValue === null or $groupRawValue === ''){

					// check if is a repeater nested inside a repeater
					$parentField = MetaRepository::getMetaFieldByName([
						'boxName' => $box,
						'fieldName' => $parent,
					]);

					if($parentField === null){
						return '';
					}

					$key = $this->fieldKey($belongsTo, $find, $box, $parentField->getRootParentField()->getName());
					@$groupRawValue = Meta::fetch($elementId, $belongsTo, $key, true);

					if($groupRawValue === null or $groupRawValue === ''){
						return '';
					}

					$realIndex = explode(".", $index);

					if(count($realIndex) !== 2){
						return null;
					}

					if(
						isset($groupRawValue[$parent]) and
						isset($groupRawValue[$parent][$realIndex[0]]) and
						isset($groupRawValue[$parent][$realIndex[0]][$field]) and
						isset($groupRawValue[$parent][$realIndex[0]][$field][$realIndex[1]])
					){
						$data = $groupRawValue[$parent][$realIndex[0]][$field][$realIndex[1]];
						$type = $data['type'];
					}

					if(!isset($data) and !isset($type)){
						return '';
					}
				}

				if($index !== null and isset($groupRawValue[Strings::toDBFormat($field)][$index])){
					$data = $groupRawValue[Strings::toDBFormat($field)][$index];
					$type = $data['type'];
				}

				if($blockName !== null and $blockIndex !== null){
					if(isset($groupRawValue['blocks']) and
					   isset($groupRawValue['blocks'][$blockIndex]) and
					   isset($groupRawValue['blocks'][$blockIndex][$blockName]) and
					   isset($groupRawValue['blocks'][$blockIndex][$blockName][Strings::toDBFormat($field)]) and
					   isset($groupRawValue['blocks'][$blockIndex][$blockName][Strings::toDBFormat($field)][$index])
					){
						$data = $groupRawValue['blocks'][$blockIndex][$blockName][Strings::toDBFormat($field)][$index];
						$type = $data['type'];
					}
				}

			} else {
				$key = $this->fieldKey($belongsTo, $find, $box, $field);
				$type = Meta::fetch($elementId, $belongsTo, $key.'_type', true);
				$data = Meta::fetch($elementId, $belongsTo, $key, true);

				if($data === null or $data === ''){
					return '';
				}
			}

			if(!empty($type)){
				$payload             = new ShortcodePayload();
				$payload->id         = $elementId;
				$payload->box        = $box;
				$payload->field      = $field;
				$payload->belongsTo  = $belongsTo;
				$payload->find       = $find;
				$payload->width      = $width;
				$payload->height     = $height;
				$payload->target     = $target;
				$payload->dateFormat = $dateFormat;
				$payload->timeFormat = $timeFormat;
				$payload->elements   = $elements;
				$payload->preview    = $preview;
				$payload->parent     = $parent;
				$payload->index      = $index;
				$payload->blockIndex = $blockIndex;
				$payload->blockName  = $blockName;
				$payload->render     = $render;
				$payload->classes    = $classes;
				$payload->list       = $list;
				$payload->separator  = $separator;

				$field = self::getField($type, $payload);

				if($field){
					return $field->render();
				}

				return null;
			}

			return null;
		} catch (\Exception $exception){
			return null;
		}
	}

	/**
	 * @param $belongsTo
	 * @param $find
	 * @param $box
	 * @param $field
	 *
	 * @return string
	 */
	private function fieldKey($belongsTo, $find, $box, $field)
	{
		$key = '';
		if($belongsTo === MetaTypes::OPTION_PAGE){
			$key .= Strings::toDBFormat($find).'_';
		}
		$key .= Strings::toDBFormat($box).'_'.Strings::toDBFormat($field);

		return $key;
	}
}