<?php

namespace ACPT_Lite\Core\Shortcodes\ACPT;

use ACPT_Lite\Core\Helper\Features;
use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Meta\MetaFieldModelFactory;
use ACPT_Lite\Core\Repository\MetaRepository;
use ACPT_Lite\Core\Shortcodes\ACPT\DTO\ShortcodePayload;
use ACPT_Lite\Core\Shortcodes\ACPT\Fields\AbstractField;
use ACPT_Lite\Utils\Data\Meta;
use ACPT_Lite\Utils\PHP\Arrays;

abstract class AbstractACPTShortcode
{
    /**
     * @param string $type
     * @param ShortcodePayload $payload
     * @return null|AbstractField
     */
    protected function getField($type, ShortcodePayload $payload)
    {
        $className = 'ACPT_Lite\\Core\\Shortcodes\\ACPT\\Fields\\'.$type.'Field';

        if (class_exists($className)) {
            $field = new $className($payload);

            if ($field instanceof AbstractField) {
                return $field;
            }
        }

        return null;
    }

    /**
     * Render the shortcode
     *
     * @param array<string, mixed> $atts
     * @return string|null
     */
    abstract public function render(array $atts);

    /**
     * @param string|int $elementId
     * @param string $belongsTo
     * @param string|null $find
     * @param array<string, mixed> $atts
     * @return string|null
     */
    protected function renderShortcode($elementId, string $belongsTo, ?string $find = null, array $atts = []): ?string
    {
        if (!Features::hasMeta()) {
            return null;
        }

        try {
            $box = $atts['box'];
            $field = $atts['field'];

            // Single lookup: WP meta first, CCT column fallback (same pattern as MetaFieldModelFactory::resolveFromId)
            $fieldModel = MetaFieldModelFactory::resolveFromBoxAndName($box, $field);

            // Field not found in meta or CCT
            if ($fieldModel === null) {
                return null;
            }

            $blockName = isset($atts['block_name']) ? $atts['block_name'] : null;
            $blockIndex = isset($atts['block_index']) ? $atts['block_index'] : null;
            $width = isset($atts['width']) ? $atts['width'] : null;
            $height = isset($atts['height']) ? $atts['height'] : null;
            $target = isset($atts['target']) ? $atts['target'] : null;
            $phoneFormat = isset($atts['phone-format']) ? $atts['phone-format'] : null;
            $dateFormat = isset($atts['date-format']) ? $atts['date-format'] : null;
            $timeFormat = isset($atts['time-format']) ? $atts['time-format'] : null;
            $elements = isset($atts['elements']) ? $atts['elements'] : null;
            $preview = (isset($atts['preview']) && $atts['preview'] === 'true') ? true : false;
            $parent = (isset($atts['parent'])) ? $atts['parent'] : null;
            $index = (isset($atts['index'])) ? $atts['index'] : null;
            $render = (isset($atts['render'])) ? $atts['render'] : null;
            $list = (isset($atts['list'])) ? $atts['list'] : null;
            $separator = (isset($atts['separator'])) ? $atts['separator'] : null;
            $classes = (isset($atts['classes'])) ? $atts['classes'] : null;
            $adminView = (isset($atts['admin_view'])) ? $atts['admin_view'] : null;
            $sort = (isset($atts['sort'])) ? $atts['sort'] : null;
            $productAttr = (isset($atts['attr'])) ? $atts['attr'] : null;

            if ($parent) {
                if (empty($productAttr)) {
                    $key = $this->fieldKey($belongsTo, $find, $box, $parent);
                } else {
                    $key = (string)$elementId;
                }

                @$groupRawValue = Meta::fetch($elementId, $belongsTo, $key, true);

                if ($groupRawValue === null || $groupRawValue === '') {
                    // check if is a repeater nested inside a repeater
                    $parentField = MetaRepository::getMetaFieldByName([
                        'boxName' => $box,
                        'fieldName' => $parent,
                    ]);

                    if ($parentField === null) {
                        return '';
                    }

                    if (empty($productAttr)) {
                        $key = $this->fieldKey($belongsTo, $find, $box, $parentField->getRootParentField()->getName());
                    } else {
                        $key = (string)$elementId;
                    }

                    @$groupRawValue = Meta::fetch($elementId, $belongsTo, $key, true);

                    if ($groupRawValue === null || $groupRawValue === '') {
                        return '';
                    }

                    $realIndex = explode(".", $index);

                    if (Arrays::count($realIndex) !== 2) {
                        return null;
                    }

                    if (
                        isset($groupRawValue[$parent]) &&
                        isset($groupRawValue[$parent][$realIndex[0]]) &&
                        isset($groupRawValue[$parent][$realIndex[0]][$field]) &&
                        isset($groupRawValue[$parent][$realIndex[0]][$field][$realIndex[1]])
                    ) {
                        $data = $groupRawValue[$parent][$realIndex[0]][$field][$realIndex[1]];
                        $type = $data['type'];
                    }

                    if (!isset($data) && !isset($type)) {
                        return '';
                    }
                }

                if ($index !== null && isset($groupRawValue[Strings::toDBFormat($field)][$index])) {
                    $data = $groupRawValue[Strings::toDBFormat($field)][$index];
                    $type = $data['type'];
                }

                if ($blockName !== null && $blockIndex !== null) {
                    if (isset($groupRawValue['blocks']) &&
                       isset($groupRawValue['blocks'][$blockIndex]) &&
                       isset($groupRawValue['blocks'][$blockIndex][$blockName]) &&
                       isset($groupRawValue['blocks'][$blockIndex][$blockName][Strings::toDBFormat($field)]) &&
                       isset($groupRawValue['blocks'][$blockIndex][$blockName][Strings::toDBFormat($field)][$index])
                    ) {
                        $data = $groupRawValue['blocks'][$blockIndex][$blockName][Strings::toDBFormat($field)][$index];
                        $type = $data['type'];
                    }
                }
            } else {
                if (empty($productAttr)) {
                    $key = $this->fieldKey($belongsTo, $find, $box, $field);
                } else {
                    $key = (string)$elementId;
                }

                $type = Meta::fetch($elementId, $belongsTo, $key.'_type', true);
                $data = Meta::fetch($elementId, $belongsTo, $key, true);

                if ($data === null || $data === '') {
                    return '';
                }
            }

            if (!empty($type)) {
                $payload                = new ShortcodePayload();
                $payload->id            = $elementId;
                $payload->box           = $box;
                $payload->field         = $field;
                $payload->belongsTo     = $belongsTo;
                $payload->find          = $find;
                $payload->width         = $width;
                $payload->height        = $height;
                $payload->target        = $target;
                $payload->phoneFormat   = $phoneFormat;
                $payload->dateFormat    = $dateFormat;
                $payload->timeFormat    = $timeFormat;
                $payload->elements      = $elements;
                $payload->preview       = $preview;
                $payload->parent        = $parent;
                $payload->index         = $index;
                $payload->blockIndex    = $blockIndex;
                $payload->blockName     = $blockName;
                $payload->render        = $render;
                $payload->classes       = $classes;
                $payload->list          = $list;
                $payload->separator     = $separator;
                $payload->adminView     = $adminView;
                $payload->sort          = $sort;
                $payload->isProductAttr = !empty($productAttr);
                $payload->productAttrId = $productAttr;

                $field = self::getField($type, $payload);

                if (!empty($data)) {
                    $field->setData($data);
                }

                if ($field && !empty($field->getMetaBoxFieldModel())) {
                    return $field->render();
                }

                return null;
            }

            return null;
        } catch (\Exception $exception) {
            do_action("acpt/error", $exception);

            return null;
        }
    }

    /**
     * @param string $belongsTo
     * @param string|null $find
     * @param string $box
     * @param string $field
     * @return string
     */
    private function fieldKey(string $belongsTo, ?string $find, string $box, string $field): string
    {
        $key = '';
        $key .= Strings::toDBFormat($box).'_'.Strings::toDBFormat($field);

        return $key;
    }

}
