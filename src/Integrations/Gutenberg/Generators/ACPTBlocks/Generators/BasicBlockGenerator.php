<?php

namespace ACPT_Lite\Integrations\Gutenberg\Generators\ACPTBlocks\Generators;

use ACPT_Lite\Integrations\Gutenberg\Generators\ACPTBlocks\Blocks\BasicBlockRenderer;

class BasicBlockGenerator extends AbstractACPTBlockGenerator
{
    /**
     * Generate the ACPT Basic block
     */
    public function generate(): void
    {
        $this->registerBlock();
        $this->enqueueScript();
    }

    /**
     * Register the block calling register_block_type
     *
     * @return void
     */
    private function registerBlock(): void
    {
        register_block_type('advanced-custom-post-type/basic-block', [
            'api_version' => '3',
            'editor_script' => 'block_js',
            'editor_style' => 'block_css',
            'keywords' => [
                'acpt',
                'meta field'
            ],
            'render_callback' => [new BasicBlockRenderer(), 'render'],
            'attributes'      => [
                'postId'      => [
                    'default' => 99999999999999999,
                    'type'    => 'integer'
                ],
                'field'            => [
                    'default' => null,
                    'type'    => ['string', 'null']
                ],
                'gradient' => [
                    'default' => null,
                    'type'    => ['string', 'null']
                ],
                'backgroundColor' => [
                    'default' => null,
                    'type'    => ['string', 'null']
                ],
                'textColor' => [
                    'default' => null,
                    'type'    => ['string', 'null']
                ],
                'style' => [
                    'default' => [],
                    'type'    => 'object'
                ],
                'align' => [
                    'default' => 'left',
                    'type'    => 'string'
                ],
                'display' => [
                    'default' => null,
                    'type'    => ['string', 'null']
                ],
                "color" => [
                    "type" => ['string', 'null'],
                    "default" => null
                ],
                "target" => [
                    "type" => ['string', 'null'],
                    "default" => null
                ],
                "fontSize" => [
                    "type" => ['string', 'null'],
                    "default" => null
                ],
                "width" => [
                    "type" => ['string', 'null'],
                    "default" => null
                ],
                "height" => [
                    "type" => ['string', 'null'],
                    "default" => null
                ],
                "uomFormatDecimalPoints" => [
                    "type" => ['string', 'null'],
                    "default" => null
                ],
                "uomFormatDecimalSeparator" => [
                    "type" => ['string', 'null'],
                    "default" => null
                ],
                "uomFormatThousandsSeparator" => [
                    "type" => ['string', 'null'],
                    "default" => null
                ],
                "uomFormat" => [
                    "type" => ['string', 'null'],
                    "default" => null
                ],
                "uomPosition" => [
                    "type" => ['string', 'null'],
                    "default" => null
                ],
                "phoneFormat" => [
                    "type" => ['string', 'null'],
                    "default" => null
                ],
                "dateFormat" => [
                    "type" => ['string', 'null'],
                    "default" => null
                ],
                "timeFormat" => [
                    "type" => ['string', 'null'],
                    "default" => null
                ],
                "audioStyle" => [
                    "type" => ['string', 'null'],
                    "default" => null
                ],
                "zoom" => [
                    "type" => 'integer',
                    "default" => 14
                ],
                "gap" => [
                    "type" => 'integer',
                    "default" => 20
                ],
                "elements" => [
                    "type" => 'integer',
                    "default" => 3
                ],
                "uniformHeight" => [
                    "type" => 'bool',
                    "default" => false
                ],
                "lightbox" => [
                    "type" => 'bool',
                    "default" => false
                ],
                "customHeight" => [
                    "type" => 'integer',
                    "default" => 250
                ],
                "carouselSpeed" => [
                    "type" => 'integer',
                    "default" => 5000
                ],
                "sort" => [
                    "type" => ['string', 'null'],
                    "default" => null
                ],
                "border" => [
                    "type" => 'object',
                    "default" => []
                ],
                "borderRadius" => [
                    "type" => 'object',
                    "default" => []
                ],
                "prefix" => [
                    "type" => ['string', 'null'],
                    "default" => ''
                ],
                "suffix" => [
                    "type" => ['string', 'null'],
                    "default" => ''
                ],
                "padding" => [
                    "type" => 'object',
                    "default" => []
                ],
            ]
        ]);
    }

    /**
     * Enqueue scripts
     *
     * @return void
     */
    private function enqueueScript(): void
    {
        wp_enqueue_block_style("advanced-custom-post-type/basic-block", [
            'handle' => "advanced-custom-post-type/basic-block",
            'src'    => plugins_url(ACPT_LITE_DEV_MODE ? 'acpt-lite/assets/static/css/gallery.css' : 'acpt-lite/assets/static/css/gallery.min.css')
        ]);
    }
}
