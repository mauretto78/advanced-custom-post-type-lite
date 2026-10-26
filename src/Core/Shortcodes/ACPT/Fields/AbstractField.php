<?php

namespace ACPT_Lite\Core\Shortcodes\ACPT\Fields;

use ACPT_Lite\Constants\ExtraFields;
use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Core\Repository\MetaRepository;
use ACPT_Lite\Core\Shortcodes\ACPT\DTO\ShortcodePayload;
use ACPT_Lite\Utils\Data\Meta;
use ACPT_Lite\Utils\PHP\Arrays;
use ACPT_Lite\Utils\PHP\Url;
use ACPT_Lite\Utils\Wordpress\Users;
use ACPT_Lite\Utils\Wordpress\WPAttachment;

abstract class AbstractField
{
    /**
     * @var mixed
     */
    protected $data;

    /**
     * @var ShortcodePayload
     */
    protected ShortcodePayload $payload;

    /**
     * @var MetaFieldModel|null
     */
    protected ?MetaFieldModel $metaBoxFieldModel;

    /**
     * AbstractField constructor.
     * @param ShortcodePayload $payload
     * @throws \Exception
     */
    public function __construct(ShortcodePayload $payload)
    {
        $this->payload = $payload;

        $this->metaBoxFieldModel = MetaRepository::getMetaFieldByName([
            'boxName' => $this->payload->box,
            'fieldName' => $this->payload->field,
        ]);
    }

    /**
     * @return mixed
     */
    public function getData()
    {
        return $this->data;
    }

    /**
     * @param mixed $data
     */
    public function setData($data): void
    {
        $this->data = $data;
    }

    /**
     * @return MetaFieldModel|null
     */
    public function getMetaBoxFieldModel(): ?MetaFieldModel
    {
        return $this->metaBoxFieldModel;
    }

    public function setMetaBoxFieldModel(MetaFieldModel $model): void
    {
        $this->metaBoxFieldModel = $model;
    }

    /**
     * Returns true when the field is rendered in the context of a custom table record.
     * In CCT mode the field name is just the column name and WordPress meta hidden
     * inputs are not needed (CCT has its own schema and validation layer).
     *
     * @return bool
     */
    protected function isCCTMode(): bool
    {
        return false;
    }

    /**
     * @return string
     */
    protected function getKey(): string
    {
        // WP Product attributes
        if ($this->payload->isProductAttr === true) {
            if ($this->payload->parent) {
                return "wc_attribute_" . Strings::toDBFormat($this->payload->box) . '_' . Strings::toDBFormat($this->payload->parent) . "_" . $this->payload->productAttrId;
            }

            return (string)$this->payload->id;
        }

        if ($this->payload->parent) {
            return $this->formatKey(Strings::toDBFormat($this->payload->box).'_'.Strings::toDBFormat($this->payload->parent));
        }

        return $this->formatKey(Strings::toDBFormat($this->payload->box).'_'.Strings::toDBFormat($this->payload->field));
    }

    /**
     * @param string $key
     * @return string
     */
    protected function formatKey(string $key): string
    {
        return $key;
    }

    /**
     * @return bool
     */
    protected function isAChildElement(): bool
    {
        return $this->payload->parent !== null && $this->payload->index !== null;
    }

    /**
     * @return bool
     */
    protected function isABlockElement(): bool
    {
        return $this->isAChildElement() && $this->payload->blockName !== null && $this->payload->blockIndex !== null;
    }

    /**
     * @param mixed $groupRawValue
     * @param string $field
     * @return mixed|null
     */
    protected function getBlockElementValue($groupRawValue, string $field)
    {
        if (empty($groupRawValue)) {
            return null;
        }

        if (isset($groupRawValue['blocks']) &&
           isset($groupRawValue['blocks'][$this->payload->blockIndex]) &&
           isset($groupRawValue['blocks'][$this->payload->blockIndex][$this->payload->blockName]) &&
           isset($groupRawValue['blocks'][$this->payload->blockIndex][$this->payload->blockName][Strings::toDBFormat($field)]) &&
           isset($groupRawValue['blocks'][$this->payload->blockIndex][$this->payload->blockName][Strings::toDBFormat($field)][$this->payload->index])
        ) {
            return $groupRawValue['blocks'][$this->payload->blockIndex][$this->payload->blockName][Strings::toDBFormat($field)][$this->payload->index];
        }

        return null;
    }

    /**
     * @return array{after: string|null, before: string|null}
     */
    protected function getBeforeAndAfter(): array
    {
        $before = null;
        $after  = null;

        if ($this->metaBoxFieldModel !== null) {
            $advanced_options =  $this->metaBoxFieldModel->getAdvancedOptions();

            foreach ($advanced_options as $advanced_option) {
                if ($advanced_option->getKey() === 'after') {
                    $after = $advanced_option->getValue();
                }

                if ($advanced_option->getKey() === 'before') {
                    $before = $advanced_option->getValue();
                }
            }
        }

        return [
            'after' => $after,
            'before' => $before,
        ];
    }

    /**
     * @return bool
     */
    protected function isFieldVisible()
    {
        if ($this->metaBoxFieldModel !== null && $this->payload->id !== null) {
            if (true === false) {
                return false;
            }

            return true;
        }

        return true;
    }

    /**
     * @param string $value
     * @return string
     */
    protected function addBeforeAndAfter(string $value): string
    {
        // Display only the value in preview mode
        if ($this->payload->preview) {
            return $value;
        }

        $beforeAndAfter = $this->getBeforeAndAfter();

        return $beforeAndAfter['before'].$value.$beforeAndAfter['after'];
    }

    /**
     * @param string $key
     * @param bool $single
     * @return array<string, mixed>|string|null
     */
    protected function fetchMeta(string $key, bool $single = true)
    {
        return Meta::fetch($this->payload->id, $this->payload->belongsTo, $key, $single);
    }

    /**
     * @param array<int, string> $data
     * @return string
     */
    protected function renderList(array $data = []): string
    {
        $render = $this->payload->render;
        $separator = $this->payload->separator;
        $classes = $this->payload->classes;
        $list = $this->payload->list;

        if ($this->payload->preview) {
            return implode(", ", $data);
        }

        $renderedList = [];

        foreach ($data as $item) {
            $item = ($render === 'label' && $this->metaBoxFieldModel !== null) ? $this->metaBoxFieldModel->getOptionLabel($item) : $item;
            $renderedList[] = $this->addBeforeAndAfter($item);
        }

        if ($list === 'ul') {
            $return = '<ul>';

            foreach ($renderedList as $element) {
                $return .= '<li class="'.$classes.'">'.esc_html($element).'</li>';
            }

            $return .= '</ul>';

            return $return;
        }

        if ($list === 'ol') {
            $return = '<ol>';

            foreach ($renderedList as $element) {
                $return .= '<li class="'.$classes.'">'.esc_html($element).'</li>';
            }

            $return .= '</ol>';

            return $return;
        }

        $separator = $separator ?? ',';

        return implode($separator, $renderedList);
    }

    /**
     * @param string|int $postId
     * @return string|null
     */
    protected function renderPost($postId): ?string
    {
        if (!is_numeric($postId)) {
            return null;
        }

        $postId = (int)$postId;

        return '<a href="'.get_the_permalink($postId).'" target="_blank">'.get_the_title($postId).'</a>';
    }

    /**
     * @param string|int $termId
     * @return string|null
     */
    protected function renderTerm($termId): ?string
    {
        if (!is_numeric($termId)) {
            return null;
        }

        $termId = (int)$termId;
        $term = get_term($termId);

        if ($term instanceof \WP_Term) {
            $link = get_term_link($termId);

            if (is_string($link)) {
                return '<a href="'.$link.'" target="_blank">'.$term->name.'</a>';
            }
        }

        return null;
    }

    /**
     * @param string|int $userId
     * @return string|null
     */
    protected function renderUser($userId): ?string
    {
        if (!is_numeric($userId)) {
            return null;
        }

        if (!function_exists('get_user_by')) {
            include_once(ABSPATH . 'wp-includes/pluggable.php');
        }

        $userId = (int)$userId;
        $user = get_user_by('id', $userId);

        if ($user instanceof \WP_User) {
            $link = get_edit_user_link($userId);

            return '<a href="'.$link.'" target="_blank">'.Users::getUserLabel($user).'</a>';
        }

        return null;
    }

    /**
     * @return mixed|null
     */
    protected function fetchRawData()
    {
        $value = [];

        if ($this->data !== null) {
            if (is_array($this->data) && array_key_exists('value', $this->data)) {
                $value = $this->data;
            } else {
                $value['value'] = $this->data;
            }
        }

        if (empty($value)) {
            if ($this->isABlockElement()) {
                @$groupRawValue = $this->fetchMeta($this->getKey());
                $field = Strings::toDBFormat($this->payload->field);
                $data = $this->getBlockElementValue($groupRawValue, $field);

                if ($data !== null && isset($data['value'])) {
                    return $data;
                }

                return null;
            }

            if ($this->isAChildElement()) {
                @$groupRawValue = $this->fetchMeta($this->getKey());

                if ($groupRawValue === null || $groupRawValue === '') {
                    // check if is a repeater nested inside a repeater
                    $key = $this->formatKey(Strings::toDBFormat($this->payload->box) . '_' . Strings::toDBFormat($this->metaBoxFieldModel->getRootParentField()->getName()));
                    @$groupRawValue = $this->fetchMeta($key);

                    if ($groupRawValue === null || $groupRawValue === '') {
                        return null;
                    }

                    $parent = $this->payload->parent;
                    $index = explode(".", $this->payload->index);
                    $field = $this->payload->field;

                    if (Arrays::count($index) !== 2) {
                        return null;
                    }

                    if (
                        isset($groupRawValue[$parent]) &&
                        isset($groupRawValue[$parent][$index[0]]) &&
                        isset($groupRawValue[$parent][$index[0]][$field]) &&
                        isset($groupRawValue[$parent][$index[0]][$field][$index[1]])
                    ) {
                        $data = $groupRawValue[$parent][$index[0]][$field][$index[1]];

                        return $data;
                    }
                }

                $field = Strings::toDBFormat($this->payload->field);

                if (isset($groupRawValue[$field]) && isset($groupRawValue[$field][$this->payload->index])) {
                    $data = $groupRawValue[$field][$this->payload->index];

                    return $data;
                }

                return null;
            }

            $value['value'] = $this->fetchMeta($this->getKey());
        }

        foreach (ExtraFields::ALLOWED_VALUES as $extra) {
            if (!isset($value[$extra]) && $this->fetchMeta($this->getKey() . '_' . $extra)) {
                $value[$extra] = $this->fetchMeta($this->getKey() . '_' . $extra);
            }
        }

        return $value;
    }

    /**
     * @param array<string, mixed> $rawData
     * @return WPAttachment[]
     */
    protected function getAttachments(array $rawData)
    {
        $attachments = [];

        if (!isset($rawData['value'])) {
            return $attachments;
        }

        if (empty($rawData['value'])) {
            return $attachments;
        }

        if (isset($rawData['attachment_id'])) {
            $attachmentIds = explode(",", $rawData['attachment_id']);
        }

        if (!empty($attachmentIds)) {
            foreach ($attachmentIds as $attachmentId) {
                $attachment = WPAttachment::fromId($attachmentId);

                if (!$attachment->isEmpty()) {
                    $attachments[] = $attachment;
                }
            }
        } else {
            $urls = is_array($rawData['value']) ? $rawData['value'] : explode(",", (string)$rawData['value']);

            foreach ($urls as $url) {
                $attachment = WPAttachment::fromUrl($url);

                if (!$attachment->isEmpty()) {
                    $attachments[] = WPAttachment::fromUrl($url);
                }
            }
        }

        return $attachments;
    }

    /**
     * @param array<string, mixed> $rawData
     * @return WPAttachment|null
     */
    protected function getAttachment(array $rawData): ?WPAttachment
    {
        if (isset($rawData['attachment_id']) && is_numeric($rawData['attachment_id'])) {
            return WPAttachment::fromId((int)$rawData['attachment_id']);
        }

        if (isset($rawData['value']) && Url::isValid($rawData['value'])) {
            return WPAttachment::fromUrl($rawData['value']);
        }

        return null;
    }

    /**
     * Method for rendering the shortcode
     *
     * @return string|null
     */
    abstract public function render(): ?string;
}
