<?php

namespace ACPT_Lite\Integrations\Gutenberg\Generators\ACPTBlocks\Blocks;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Utils\PHP\Date;
use ACPT_Lite\Utils\PHP\Email;
use ACPT_Lite\Utils\Wordpress\WPAttachment;
use ACPT_Lite\Utils\Wordpress\WPUtils;

class BasicBlockRenderer
{
    /**
     * @param mixed $attributes
     * @param mixed $content
     *
     * @return string|null
     */
    public function render($attributes, $content)
    {
        if (isset($attributes['field'])) {
            $closingDiv = '</div>';
            $openingDiv = str_replace($closingDiv, '', $content);

            $field = json_decode($attributes['field'], true);
            $className = $attributes['className'] ?? null;
            $align = $attributes['align'] ?? 'left';
            $prefix = $attributes['prefix'] ?? null;
            $suffix = $attributes['suffix'] ?? null;

            if (!is_array($field) || empty($field)) {
                return null;
            }

            $rawData = $prefix;
            $rawData .= $this->getRawData($field, $attributes);
            $rawData .= $suffix;

            return $openingDiv.'<p style="text-align: '.$align.';" class="'.$className.'">'.$rawData.'</p>'.$closingDiv;
        }

        return null;
    }

    /**
     * @param array<string, mixed> $field
     * @param array<string, mixed> $attributes
     *
     * @return mixed|string|null
     */
    private function getRawData(array $field, array $attributes = [])
    {
        $findValue = null;

        // try to calculate $find and $findValue
        if (isset($field['belongsTo']) && $field['belongsTo'] === MetaTypes::TAXONOMY) {
            $find = 'term_id';
            $termId = null;
            // Front-end rendering
            $queriedObject = get_queried_object();
            if ($queriedObject instanceof \WP_Term) {
                $termId = $queriedObject->term_id;
            }
            // try to calculate $termId from HTTP_REFERER (AJAX request)
            if ($termId === null) {
                $referer = $_SERVER['HTTP_REFERER'] ?? '';
                $parsedReferer = parse_url($referer);

                if (is_array($parsedReferer) && isset($parsedReferer['query'])) {
                    parse_str($parsedReferer['query'], $parsedRefererArray);

                    $prefix = wp_get_theme()->get_stylesheet()."//".$field['find']."-";
                    $taxonomySlug = str_replace($prefix, "", $parsedRefererArray['postId'] ?? '');

                    if (!is_string($taxonomySlug)) {
                        return null;
                    }

                    $term = get_term_by('slug', $taxonomySlug, $field['find']);
                    if ($term instanceof \WP_Term) {
                        $termId = $term->term_id;
                    }
                }
            }
            $findValue = (isset($attributes['postId']) && $attributes['postId'] < 99999999999999999) ? $attributes['postId'] : $termId;
        } else {
            global $post;

            $find = 'post_id';
            $findValue = (isset($attributes['postId']) && $attributes['postId'] < 99999999999999999) ? $attributes['postId'] : ($post instanceof \WP_Post ? $post->ID : null);
        }

        // static preview if no context is available
        if (empty($findValue)) {
            return '{acpt_'.$field['box'].'_'.$field['field'].'}';
        }

        $args = [
            $find => $findValue,
            'box_name' => $field['box'],
            'field_name' => $field['field'],
            'with_context' => true,
        ];
        
        $rawData = get_acpt_field($args);

        if (empty($rawData)) {
            return null;
        }

        if (!isset($rawData['value'])) {
            return null;
        }

        $value = $rawData['value'];
        $after = $rawData['after'] ?? null;
        $before = $rawData['before'] ?? null;

        switch ($field['type']) {
            // DATE_TYPE
            case MetaFieldModel::DATE_TYPE:

                if (!isset($value['value'])) {
                    return null;
                }

                if (!isset($value['object'])) {
                    return null;
                }

                /** @var \DateTime $dateTimeObject */
                $dateTimeObject = $value['object'];
                $val = $value['value'];

                if (!empty($attributes['dateFormat']) && Date::isDateFormatValid($attributes['dateFormat'])) {
                    return $before . Date::format($attributes['dateFormat'], $dateTimeObject) . $after;
                }

                return $before . $val . $after;

                // EMAIL_TYPE
            case MetaFieldModel::EMAIL_TYPE:

                if (!is_string($value)) {
                    return null;
                }

                if (isset($attributes['display']) && $attributes['display'] === 'link') {
                    return '<a href="mailto:'.Email::sanitize($value).'">'.$before . $value . $after.'</a>';
                }

                return $before . $value . $after;

                // TEXTAREA_TYPE
            case MetaFieldModel::TEXTAREA_TYPE:

                if (!is_string($value)) {
                    return null;
                }

                return $before . WPUtils::renderShortCode($value, true) . $after;

            default:

                if (is_string($value)) {
                    return $before . do_shortcode($value) . $after;
                }

                return null;
        }

        return null;
    }

    /**
     * @param string $display
     * @param WPAttachment $image
     * @param mixed $attributes
     * @param bool $lightbox
     *
     * @return string
     */
    private function renderImage(string $display, WPAttachment $image, $attributes, bool $lightbox = false): string
    {
        $gap = !empty($attributes['gap']) ? $attributes['gap'] : 20;
        $width = $attributes['width'] ?? null;
        $height = $attributes['height'] ?? null;
        $border = !empty($attributes['border']) ? $attributes['border'] : null;
        $borderRadius = !empty($attributes['borderRadius']) ? $attributes['borderRadius'] : null;
        $imgStyle = '';
        $figureStyle = '';

        if ($border !== null) {
            $imgStyle .= 'border: '.$border['width'].' '. ((isset($border['style'])) ? $border['style'] : 'solid').' '.$border['color'].';';
        }

        if ($borderRadius !== null) {
            $imgStyle .= 'border-radius: '.$borderRadius['top'].' '.$borderRadius['right'].' '.$borderRadius['bottom'].' '.$borderRadius['left'].';';
        }

        if ($display === 'masonry') {
            $figureStyle .= "margin: 0 0 ".$gap."px;";
        }

        $renderedImg = $image->render([
            'w' => $width,
            'h' => $height,
            'style' => $imgStyle,
        ]);

        if ($lightbox) {
            $fullSrc = $image->getSrc();
            $alt = esc_attr($image->getAlt() ?: $image->getTitle() ?: '');
            $renderedImg = '<a href="'.$fullSrc.'" class="glightbox" data-gallery="acpt-gallery" data-alt="'.$alt.'">'.$renderedImg.'</a>';
        }

        return '<figure style="'.$figureStyle.'">'.$renderedImg.'</figure>';
    }

    /**
     * Enqueue CSS scripts
     *
     * @return void
     */
    public function enqueueStyle(): void
    {
        wp_register_style('gallery-css', plugins_url(ACPT_LITE_DEV_MODE ? 'acpt-lite/assets/static/css/gallery.css' : 'acpt-lite/assets/static/css/gallery.min.css'), [], ACPT_LITE_PLUGIN_VERSION);
        wp_enqueue_style('gallery-css');

        wp_register_script('gallery-js', plugins_url(ACPT_LITE_DEV_MODE ? 'acpt-lite/assets/static/js/gallery.js' : 'acpt-lite/assets/static/js/gallery.min.js'));
        wp_enqueue_script('gallery-js');

        wp_register_style('glightbox-css', plugins_url('acpt-lite/assets/vendor/glightbox/glightbox.min.css'), [], '3.3.0');
        wp_enqueue_style('glightbox-css');

        wp_register_script('glightbox-js', plugins_url('acpt-lite/assets/vendor/glightbox/glightbox.min.js'), [], '3.3.0', true);
        wp_enqueue_script('glightbox-js');
    }
}
