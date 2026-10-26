<?php

namespace ACPT_Lite\Core\CQRS\Query;

use ACPT_Lite\Core\CQRS\Command\AbstractMetaFieldValueCommand;
use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Utils\PHP\Date;
use ACPT_Lite\Utils\Wordpress\WPAttachment;
use ACPT_Lite\Utils\Wordpress\WPUtils;

class FetchMetaFieldValueQuery extends AbstractMetaFieldValueCommand implements QueryInterface
{
    /**
     * @return mixed
     * @throws \Exception
     */
    public function execute()
    {
        // Prevent any error if one of those functions is undefined:
        if (!function_exists('get_user_by')) {
            include_once(ABSPATH . 'wp-includes/pluggable.php');
        }

        if (!function_exists('get_term')) {
            include_once(ABSPATH . 'wp-includes/taxonomy.php');
        }

        $saved_field_type = $this->getData('_type') ?? $this->fieldModel->getType();
        $saved_field_value = $this->getData();

        if ($saved_field_value === null || $saved_field_value === '') {
            return null;
        }

        $before = null;
        $after  = null;

        $advanced_options = $this->fieldModel->getAdvancedOptions();

        // @phpstan-ignore-next-line function.alreadyNarrowedType
        if (is_array($advanced_options)) {
            foreach ($advanced_options as $advanced_option) {
                if ($advanced_option->getKey() === 'after') {
                    $after = $advanced_option->getValue();
                }

                if ($advanced_option->getKey() === 'before') {
                    $before = $advanced_option->getValue();
                }
            }
        }

        if ($this->return === "string") {
            return $before . Strings::intoString($saved_field_value) . $after;
        }

        switch ($saved_field_type) {
            // DATE_TYPE
            case MetaFieldModel::DATE_TYPE:

                $defaultFormat = 'Y-m-d';
                $dateFormat = $this->fieldModel->getAdvancedOption('date_format') ?? get_option('date_format');
                $savedFormat =  $this->getData('_format') ?? $defaultFormat;
                $saved_date = \DateTime::createFromFormat($savedFormat, $saved_field_value);

                if (!$saved_date instanceof \DateTime) {
                    $saved_date = \DateTime::createFromFormat($dateFormat, $saved_field_value);
                }

                if (!$saved_date instanceof \DateTime) {
                    $saved_date = \DateTime::createFromFormat($defaultFormat, $saved_field_value);
                }

                if (!$saved_date instanceof \DateTime) {
                    return null;
                }

                $date = Date::format($dateFormat, $saved_date);

                return $this->formatRawValue([
                    'format' => $dateFormat,
                    'object' => $saved_date,
                    'value'  => $this->formatNestedRawValue($date, $after, $before),
                ], $after, $before);

                // DEFAULT VALUE
            default:

                $allowHtml = $this->fieldModel->getAdvancedOption("allow_html");

                if ($allowHtml == 1) {
                    $saved_field_value = html_entity_decode($saved_field_value);
                }

                if (!is_string($saved_field_value)) {
                    $saved_field_value = (string)$saved_field_value;
                }

                return $this->formatRawValue(WPUtils::renderShortCode($saved_field_value), $after, $before);
        }
    }

    /**
     * @return string|null
     */
    private function getAttachmentId(): ?string
    {
        // legacy format
        if (!empty($this->getData('_id')) && is_numeric($this->getData('_id'))) {
            return (string)$this->getData('_id');
        }

        // current format
        $attachmentId = $this->getData('_attachment_id');

        return $attachmentId ? (string)$attachmentId : null;
    }

    /**
     * @param mixed $value
     * @param mixed $after
     * @param mixed $before
     * @return array<string, mixed>|string
     */
    private function formatRawValue($value, $after = null, $before = null)
    {
        if ($this->withContext) {
            return [
                'before' => $before,
                'value' => $value,
                'after' => $after,
            ];
        }

        if (is_string($value)) {
            $value = $before.$value.$after;

            // @phpstan-ignore-next-line function.impossibleType
            if (is_int($value)) {
                return (int)$value;
            }

            // @phpstan-ignore-next-line function.impossibleType
            if (is_float($value)) {
                return (floatval($value));
            }

            return $value;
        }

        return $value;
    }

    /**
     * @param mixed $value
     * @param mixed $after
     * @param mixed $before
     * @return mixed
     */
    private function formatNestedRawValue($value, $after = null, $before = null)
    {
        if ($this->withContext) {
            return $value;
        }

        if (is_string($value)) {
            return $before.$value.$after;
        }

        return $value;
    }

    /**
     * @param int    $postId
     * @param string $return
     * @return int|\WP_Post|null
     */
    private function getPost(int $postId, string $return = 'object')
    {
        if ($return === 'raw') {
            return (int)$postId;
        }

        return get_post($postId);
    }

    /**
     * @param int    $termId
     * @param string $return
     * @return int|\WP_Term|null
     */
    private function getTerm(int $termId, string $return = 'object')
    {
        if ($return === 'raw') {
            return (int)$termId;
        }

        $term = get_term($termId);

        if (empty($term)) {
            return null;
        }

        if ($term instanceof \WP_Term) {
            return $term;
        }

        return null;
    }

    /**
     * @param int    $userId
     * @param string $return
     * @return int|\WP_User
     */
    private function getUser(int $userId, string $return = 'object')
    {
        if ($return === 'raw') {
            return (int)$userId;
        }

        $user = get_user_by('id', $userId);

        if ($user instanceof \WP_User) {
            return $user;
        }

        return 0;
    }

    /**
     * @param mixed  $id
     * @param string $return
     * @return WPAttachment|int|null
     */
    private function getAttachment($id, string $return = 'object')
    {
        // if $id is the media ID
        if (is_numeric($id)) {
            if ($return === 'raw') {
                return (int)$id;
            }

            $wpAttachment = WPAttachment::fromId((int)$id);

            if ($wpAttachment->isEmpty()) {
                return null;
            }

            return $wpAttachment;
        }

        // if $id is the media URL
        $wpAttachment = WPAttachment::fromUrl($id);

        if ($wpAttachment->isEmpty()) {
            return null;
        }

        if ($return === 'raw') {
            return (int)$wpAttachment->getId();
        }

        return $wpAttachment;
    }

}
