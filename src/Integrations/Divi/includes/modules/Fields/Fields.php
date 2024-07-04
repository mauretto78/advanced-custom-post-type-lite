<?php

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Core\Repository\MetaRepository;

class ACPT_Fields_Divi_Module extends ET_Builder_Module {


    /**
     * @var string
     */
	public $slug       = 'acpt_fields';

    /**
     * @var string
     */
	public $vb_support = 'on';

    /**
     * @var array
     */
	protected $module_credits = [
        'module_uri' => 'https://acpt.io',
        'author'     => 'Mauro Cassani',
        'author_uri' => 'https://github.com/mauretto78',
    ];

    /**
     * init the module
     */
    public function init()
    {
        $this->name = esc_html__( 'ACPT meta fields', ACPT_EXT_TEXT_DOMAIN );
        $this->icon_path =  plugin_dir_path( __FILE__ ) . 'assets/img/acpt-icon.svg';
        $this->block = "ACPT";

        $this->enqueue_scripts();
        add_action( 'et_fb_enqueue_assets', [$this, 'enqueue_scripts'], 99 );

        $this->settings_modal_toggles = [
            'general' => [
                'toggles' => [
                    'main_content' => esc_html__( 'Select field', ACPT_EXT_TEXT_DOMAIN ),
                    'main_options' => esc_html__( 'Main options', ACPT_EXT_TEXT_DOMAIN ),
                    'specific_settings' => esc_html__( 'Specific settings', ACPT_EXT_TEXT_DOMAIN ),
                    'image_and_icons' => esc_html__( 'Image and icon fields', ACPT_EXT_TEXT_DOMAIN ),
                ],
            ],
        ];
	}

    /**
     * @param array $args
     * @param array $conditional_tags
     * @param array $current_page
     */
    public function enqueue_scripts($args = array(), $conditional_tags = array(), $current_page = array() )
    {
        wp_register_style( 'acpt-divi-module-css', plugin_dir_url( __FILE__ ) . 'assets/css/fields.css', [], ACPT_LITE_PLUGIN_VERSION );
        wp_enqueue_style( 'acpt-divi-module-css' );
    }

    /**
     * Get ACPT registered fields
     *
     * @return array
     * @throws Exception
     */
	public function get_fields()
    {
        return array_merge(
            $this->getLayoutFields(),
            $this->getMainOptionFields(),
            $this->getSpecificSettingsFields(),
            $this->getImageAndIconFields()
        );
	}

    /**
     * @return string
     */
	private function selectMessage()
    {
        return esc_html__( 'Select from the list', ACPT_EXT_TEXT_DOMAIN );
    }

    /**
     * @return array
     * @throws Exception
     */
    private function getLayoutFields()
    {
        $postId = ET_Builder_Element::get_current_post_id();
        $field_options = [ null =>  $this->selectMessage() ];

        if($postId){
            $postType = get_post_type($postId);
            $metaGroups = MetaRepository::get([
            	'belongsTo' => MetaTypes::CUSTOM_POST_TYPE,
            	'find' => $postType,
            ]);

            foreach ($metaGroups as $group){
	            foreach ($group->getBoxes() as $boxModel){
		            $fields = [];
		            foreach ($boxModel->getFields() as $fieldModel){
			            $fields[$fieldModel->getId()] = $fieldModel->getName() . ' ['.$fieldModel->getType().']';
		            }

		            $field_options[$boxModel->getName()] = $fields;
	            }
            }
        }

        return [
            'fields' => [
                'label'           => esc_html__( 'Select the field', ACPT_EXT_TEXT_DOMAIN ),
                'type'            => 'select',
                'options'         => $field_options,
                'option_category' => 'main_content',
                'default'          => null,
                'description'     => esc_html__( 'Display the registered ACPT meta fields for this post type.', ACPT_EXT_TEXT_DOMAIN ),
                'toggle_slug'     => 'main_content',
                'computed_affects' => [
                    '__render',
                ],
            ],
            '__render'  => [
                'type'                => 'computed',
                'computed_callback'   => ['ACPT_Fields_Divi_Module', 'get_rendered_fields'],
                'computed_depends_on' => [
                    'fields',
                    'width',
                    'height',
                    'target',
                    'date_format',
                    'elements',
                    'show_label',
                    'prefix',
                    'suffix',
                    'text_before',
                    'empty_value',
                    'use_icon',
                    'icon',
                    'icon_color',
                    'icon_width',
                    'icon_placement',
                    'use_image',
                    'image',
                    'image_max_width',
                    'image_placement',
                    'fullwidth',
                    'orientation',
	                'render',
                ],
                'computed_minimum' => [
                    'fields',
                ],
                'option_category' => 'main_content',
                'toggle_slug' => 'main_content',
            ],
        ];
    }

    /**
     * Main Options
     * ====================
     *
     * show label
     * prefix
     * suffix
     * text before
     * what to do with empty value
     * fullwidth
     * orientation
     *
     * @return array
     */
    private function getMainOptionFields()
    {
        return [
            'show_label' => [
                'label'           => esc_html__( 'Show label', ACPT_EXT_TEXT_DOMAIN ),
                'type'            => 'yes_no_button',
                'option_category' => 'main_options',
                'options'         => [
                    'on'  => et_builder_i18n( 'Yes' ),
                    'off' => et_builder_i18n( 'No' ),
                ],
                'toggle_slug'     => 'main_options',
                'description'     => esc_html__( 'Show the field label?', ACPT_EXT_TEXT_DOMAIN ),
                'default'         => 'off',
            ],
            'prefix' => [
                'label'           => esc_html__( 'Prefix', ACPT_EXT_TEXT_DOMAIN ),
                'type'            => 'text',
                'default'          => null,
                'option_category' => 'main_options',
                'description'     => esc_html__( 'Prefix for the meta field text', ACPT_EXT_TEXT_DOMAIN ),
                'toggle_slug'     => 'main_options',
            ],
            'suffix' => [
                'label'           => esc_html__( 'Suffix', ACPT_EXT_TEXT_DOMAIN ),
                'type'            => 'text',
                'default'          => null,
                'option_category' => 'main_options',
                'description'     => esc_html__( 'Suffix for the meta field text', ACPT_EXT_TEXT_DOMAIN ),
                'toggle_slug'     => 'main_options',
            ],
            'text_before' => [
                'label'           => esc_html__( 'Text before', ACPT_EXT_TEXT_DOMAIN ),
                'type'            => 'text',
                'default'          => null,
                'option_category' => 'main_options',
                'description'     => esc_html__( 'Text before for the meta field text', ACPT_EXT_TEXT_DOMAIN ),
                'toggle_slug'     => 'main_options',
            ],
            'fullwidth' => [
               'label'            => esc_html__( 'Layout (only for gallery field).', ACPT_EXT_TEXT_DOMAIN ),
               'type'             => 'select',
               'option_category'  => 'main_options',
               'options'          => [
                   'off' => esc_html__( 'Grid', 'et_builder' ),
                   'on'  => esc_html__( 'Slider', 'et_builder' ),
               ],
               'default_on_front' => 'off',
               'description'      => esc_html__( 'Toggle between the various gallery layout types.', 'et_builder' ),
               'toggle_slug'      => 'main_options',
               'affects'          => [
                   'orientation',
               ],
            ],
            'orientation' => [
                'label'            => esc_html__( 'Thumbnail orientation (only for gallery field).', ACPT_EXT_TEXT_DOMAIN ),
                'type'             => 'select',
                'options_category' => 'main_options',
                'options'          => [
                    'landscape' => esc_html__( 'Landscape', 'et_builder' ),
                    'portrait'  => esc_html__( 'Portrait', 'et_builder' ),
                ],
                'default_on_front' => 'landscape',
                'description'      => sprintf(
                    '%1$s<br><small><em><strong>%2$s:</strong> %3$s <a href="//wordpress.org/plugins/force-regenerate-thumbnails" target="_blank">%4$s</a>.</em></small>',
                    esc_html__( 'Choose the orientation of the gallery thumbnails.', 'et_builder' ),
                    esc_html__( 'Note', 'et_builder' ),
                    esc_html__( 'If this option appears to have no effect, you might need to', 'et_builder' ),
                    esc_html__( 'regenerate your thumbnails', 'et_builder' )
                ),
                'depends_show_if'  => 'off',
                'toggle_slug'      => 'main_options',
            ],
            'empty_value' => [
                'label'           => esc_html__( 'What to do with empty value', ACPT_EXT_TEXT_DOMAIN ),
                'type'            => 'select',
                'options'         => [
                    "null" => esc_html__("Display nothing"),
                    "no_content" => esc_html__("Display the message 'No content'"),
                ],
                'option_category' => 'main_options',
                'default'          => "null",
                'description'     => esc_html__( 'What to do with empty value?', ACPT_EXT_TEXT_DOMAIN ),
                'toggle_slug'     => 'main_options',
            ],
        ];
    }

    /**
     * Specific settings fields
     * ====================
     * data format
     * number decimal
     * width
     * height
     * target
     * elements
     * render
     *
     * @return array
     */
    private function getSpecificSettingsFields()
    {
        return [
            'target' => [
                'label'           => esc_html__( 'Target', ACPT_EXT_TEXT_DOMAIN ),
                'type'            => 'select',
                'options'         => [
                        "_blank" => "Opens in a new window or tab",
                        "_self" => "Opens in the same frame as it was clicked",
                        "_parent" => "Opens in the parent frame",
                        "_top" => "Opens in the full body of the window",
                ],
                'option_category' => 'specific_settings',
                'default'          => null,
                'description'     => esc_html__( 'Select target (only for Url type field).', ACPT_EXT_TEXT_DOMAIN ),
                'toggle_slug'     => 'specific_settings',
            ],
            'date_format' => [
                    'label'           => esc_html__( 'Date format', ACPT_EXT_TEXT_DOMAIN ),
                    'type'            => 'select',
                    'options'         => [
                            "d-M-y" => "dd-mmm-yy (ex. 28-OCT-90)",
                            "d-M-Y" => "dd-mmm-yyyy (ex. 28-OCT-1990)",
                            "d M y" => "mmm yy (ex. 28 OCT 90)",
                            "d M Y" => "mmm yyyy (ex. 28 OCT 1990)",
                            "d/m/y" => "dd/mm/yy (ex. 28/10/90)",
                            "d/m/Y" => "dd/mm/yyyy (ex. 28/10/1990)",
                            "m/d/y" => "mm/dd/yy (ex. 10/28/90)",
                            "m/d/Y" => "mm/dd/yyyy (ex. 10/28/1990)",
                            "d.m.y" => "dd.mm.yy (ex. 28.10.90)",
                            "d.m.Y" => "dd.mm.yyyy (ex. 28.10.1990)",
                    ],
                    'option_category' => 'specific_settings',
                    'default'          => null,
                    'description'     => esc_html__( 'Date format (only for Date type field).', ACPT_EXT_TEXT_DOMAIN ),
                    'toggle_slug'     => 'specific_settings',
            ],
            'number_decimal' => [
                    'label'           => esc_html__( 'Number of decimals', ACPT_EXT_TEXT_DOMAIN ),
                    'type'            => 'number',
                    'default'          => null,
                    'option_category' => 'specific_settings',
                    'description'     => esc_html__( 'Number of decimal digits (only for numeric fields).', ACPT_EXT_TEXT_DOMAIN ),
                    'toggle_slug'     => 'specific_settings',
            ],
            'width' => [
                    'label'           => esc_html__( 'Width (px)', ACPT_EXT_TEXT_DOMAIN ),
                    'type'            => 'number',
                    'default'          => null,
                    'option_category' => 'specific_settings',
                    'description'     => esc_html__( 'Width in pixels (only for Address, Image, Video and Gallery type fields).', ACPT_EXT_TEXT_DOMAIN ),
                    'toggle_slug'     => 'specific_settings',
            ],
            'height' => [
                    'label'           => esc_html__( 'Height (px)', ACPT_EXT_TEXT_DOMAIN ),
                    'type'            => 'number',
                    'default'          => null,
                    'option_category' => 'specific_settings',
                    'description'     => esc_html__( 'Height in pixels (only for Address, Image, Video and Gallery type fields).', ACPT_EXT_TEXT_DOMAIN ),
                    'toggle_slug'     => 'specific_settings',
            ],
            'elements' => [
                    'label'           => esc_html__( 'Number of elements per row', ACPT_EXT_TEXT_DOMAIN ),
                    'type'            => 'select',
                    'options'         => [
                        null =>  $this->selectMessage(),
                        1 => esc_html__("1 element"),
                        2 => esc_html__("2 elements"),
                        3 => esc_html__("3 elements"),
                        4 => esc_html__("4 elements"),
                        6 => esc_html__("6 elements")
                    ],
                    'option_category' => 'specific_settings',
                    'default'          => null,
                    'description'     => esc_html__( 'Number of elements per row (only for Gallery, Related Posts, and Repeater type fields).', ACPT_EXT_TEXT_DOMAIN ),
                    'toggle_slug'     => 'specific_settings',
            ],
            'render' => [
	            'label'           => esc_html__( 'What you want to display?', ACPT_EXT_TEXT_DOMAIN ),
	            'type'            => 'select',
	            'options'         => [
		            null =>  $this->selectMessage(),
		            "value" => esc_html__("Value"),
		            "label" => esc_html__("Label"),
	            ],
	            'option_category' => 'specific_settings',
	            'default'          => "value",
	            'description'     => esc_html__( 'What you want to display?', ACPT_EXT_TEXT_DOMAIN ),
	            'toggle_slug'     => 'specific_settings',
            ],
            'country_render' => [
	            'label'           => esc_html__( 'What you want to display?', ACPT_EXT_TEXT_DOMAIN ),
	            'type'            => 'select',
	            'options'         => [
		            null =>  $this->selectMessage(),
		            "text" => esc_html__("Plain text"),
		            "flag" => esc_html__("Flag"),
		            "full" => esc_html__("Flag and text"),
	            ],
	            'option_category' => 'specific_settings',
	            'default'          => "value",
	            'description'     => esc_html__( 'What you want to display?', ACPT_EXT_TEXT_DOMAIN ),
	            'toggle_slug'     => 'specific_settings',
            ],
        ];
    }

    /**
     * Image & icon fields
     * ====================
     * Use Icon
     * Icon
     * Image/Icon Placement
     * Select Image
     * Custom Image Max Width
     *
     * @return array
     */
    private function getImageAndIconFields()
    {
        return [
            'use_icon' => [
                'label'           => esc_html__( 'Use icon', ACPT_EXT_TEXT_DOMAIN ),
                'type'            => 'yes_no_button',
                'option_category' => 'image_and_icons',
                'options'         => [
                    'on'  => et_builder_i18n( 'Yes' ),
                    'off' => et_builder_i18n( 'No' ),
                ],
                'toggle_slug'     => 'image_and_icons',
                'description'     => esc_html__( 'Display an icon after/before the field value?', ACPT_EXT_TEXT_DOMAIN ),
                'default'         => 'off',
                'affects'            => array(
                        'icon',
                        'icon_color',
                        'icon_width',
                        'icon_placement',
                ),
            ],
            'icon' => [
                    'label'           => esc_html__( 'Choose icon', ACPT_EXT_TEXT_DOMAIN ),
                    'type'            => 'select_icon',
                    'option_category' => 'image_and_icons',
                    'toggle_slug'     => 'image_and_icons',
                    'description'     => esc_html__( 'Choose the icon to display after/before the field value.', ACPT_EXT_TEXT_DOMAIN ),
                    'default'         => null,
                    'depends_on'      => [
                            'use_icon',
                    ],
            ],
            'icon_color'     => [
                    'default'        => et_builder_accent_color(),
                    'label'          => esc_html__( 'Icon Color', ACPT_EXT_TEXT_DOMAIN ),
                    'type'           => 'color-alpha',
                    'description'    => esc_html__( 'Here you can define a custom color for your icon.', ACPT_EXT_TEXT_DOMAIN ),
                    'toggle_slug'    => 'image_and_icons',
                    'depends_on'      => [
                            'use_icon',
                    ],
            ],
            'icon_width'     => [
                    'label'           => esc_html__( 'Icon Size', ACPT_EXT_TEXT_DOMAIN ),
                    'default'         => '96px',
                    'range_settings'  => [
                            'min'  => '1',
                            'max'  => '200',
                            'step' => '1',
                    ],
                    'option_category' => 'image_and_icons',
                    'toggle_slug'     => 'image_and_icons',
                    'description'     => esc_html__( 'Here you can choose icon width.', ACPT_EXT_TEXT_DOMAIN ),
                    'type'            => 'range',
                    'validate_unit'   => true,
                    'allowed_units'   => ['%', 'em', 'rem', 'px', 'cm', 'mm', 'in', 'pt', 'pc', 'ex', 'vh', 'vw'],
                    'responsive'      => true,
                    'depends_on'      => [
                            'use_icon',
                    ],
            ],
            'icon_placement' => [
                    'label'           => esc_html__( 'Icon Placement', ACPT_EXT_TEXT_DOMAIN ),
                    'type'            => 'select',
                    'option_category' => 'image_and_icons',
                    'options'         => [
                            'above'  => esc_html__( 'Above' ),
                            'below' => esc_html__( 'Below' ),
                            'left'  => esc_html__( 'Left' ),
                            'right' => esc_html__( 'Right' ),
                    ],
                    'toggle_slug'     => 'image_and_icons',
                    'description'     => esc_html__( 'Choose the icon Placement (display after/before the field value).', ACPT_EXT_TEXT_DOMAIN ),
                    'default'         => 'left',
                    'depends_on'      => [
                            'use_icon',
                    ],
            ],
            'use_image' => [
                    'label'           => esc_html__( 'Use image', ACPT_EXT_TEXT_DOMAIN ),
                    'type'            => 'yes_no_button',
                    'option_category' => 'image_and_icons',
                    'options'         => [
                            'on'  => et_builder_i18n( 'Yes' ),
                            'off' => et_builder_i18n( 'No' ),
                    ],
                    'toggle_slug'     => 'image_and_icons',
                    'description'     => esc_html__( 'Display an icon after/before the field value?', ACPT_EXT_TEXT_DOMAIN ),
                    'default'         => 'off',
                    'affects'            => [
                        'image',
                        'image_max_width',
                        'image_placement',
                    ],
            ],
            'image' => [
                    'default'        => null,
                    'label'          => esc_html__( 'Select Image', ACPT_EXT_TEXT_DOMAIN ),
                    'type'           => 'upload',
                    'description'    => esc_html__( 'Select an image to display after/before the field value.', ACPT_EXT_TEXT_DOMAIN ),
                    'toggle_slug'    => 'image_and_icons',
                    'upload_button_text' => et_builder_i18n( 'Upload an image' ),
                    'choose_text'        => esc_attr__( 'Choose an Image', 'et_builder' ),
                    'update_text'        => esc_attr__( 'Set As Image', 'et_builder' ),
                    'hide_metadata'      => true,
                    'depends_on'      => [
                            'use_image',
                    ],
            ],
            'image_max_width' => [
                    'label'           => esc_html__( 'Custom image max width', ACPT_EXT_TEXT_DOMAIN ),
                    'default'         => '100%',
                    'range_settings'  => [
                        'min'  => '1',
                        'max'  => '1980',
                        'step' => '1',
                    ],
                    'option_category' => 'image_and_icons',
                    'toggle_slug'     => 'image_and_icons',
                    'description'     => esc_html__( 'Here you can choose icon width.', ACPT_EXT_TEXT_DOMAIN ),
                    'type'            => 'range',
                    'validate_unit'   => true,
                    'allowed_units'   => ['%', 'em', 'rem', 'px', 'cm', 'mm', 'in', 'pt', 'pc', 'ex', 'vh', 'vw'],
                    'responsive'      => true,
                    'depends_on'      => [
                            'use_image',
                    ],
            ],
            'image_placement' => [
                    'label'           => esc_html__( 'Image Placement', ACPT_EXT_TEXT_DOMAIN ),
                    'type'            => 'select',
                    'option_category' => 'image_and_icons',
                    'options'         => [
                        'above'  => esc_html__( 'Above' ),
                        'below' => esc_html__( 'Below' ),
                        'left'  => esc_html__( 'Left' ),
                        'right' => esc_html__( 'Right' ),
                    ],
                    'toggle_slug'     => 'image_and_icons',
                    'description'     => esc_html__( 'Choose the image Placement (display after/before the field value).', ACPT_EXT_TEXT_DOMAIN ),
                    'default'         => 'left',
                    'depends_on'      => [
                            'use_image',
                    ],
            ],
        ];
    }

    /**
     * Render field for React view
     *
     * @param array $args
     * @param array $conditional_tags
     * @param array $current_page
     *
     * @return string|void
     */
    public static function get_rendered_fields($args = array(), $conditional_tags = array(), $current_page = array() )
    {
        return self::render_the_field($args);
    }

    /**
     * Render field for the UI
     *
     * @param array  $attrs
     * @param null   $content
     * @param string $render_slug
     *
     * @return string
     */
	public function render($attrs, $content = null, $render_slug)
    {
        return $this->render_the_field($this->props);
	}

    /**
     * Render the field from given props
     *
     * @param array $props
     *
     * @return string|void
     */
	private static function render_the_field(array $props)
    {
        if(!isset($props['fields'])){
            return __( 'No ID provided, sorry.', ACPT_EXT_TEXT_DOMAIN );
        }

        try {
            $fieldId = $props['fields'];
            $postId = ET_Builder_Element::get_current_post_id();
            $metaField = MetaRepository::getMetaFieldById($fieldId, true);

            if($metaField === null){
                return null;
            }

            if($metaField->getType() === MetaFieldModel::LIST_TYPE){
                return self::render_the_list_field($postId, $metaField, $props);
            }

            if($metaField->getType() === MetaFieldModel::GALLERY_TYPE){
                return self::render_the_gallery_field($postId, $metaField, $props);
            }

            return self::default_field_render($postId, $metaField, $props);
        } catch (\Exception $exception){
            return __( 'Sorry, something goes wrong.', ACPT_EXT_TEXT_DOMAIN );
        }
    }

    /**
     * @param int            $postId
     * @param MetaFieldModel $metaField
     * @param array          $props
     *
     * @return string
     */
    private static function default_field_render($postId, MetaFieldModel $metaField, array $props)
    {
        $value = self::get_acpt_field($metaField, $postId, $props);

        $output = '<div class="acpt-meta-field">';
        $output .= self::render_value_formatted_with_props($value, $metaField->getName(), $props);
        $output .= '</div>';

        return $output;
    }

    /**
     * Special render for gallery field
     *
     * @param int            $postId
     * @param MetaFieldModel $metaField
     * @param array          $props
     *
     * @return string
     */
    private static function render_the_gallery_field($postId, MetaFieldModel $metaField, array $props)
    {
        $orientation = $props['orientation'];
        $fullwidth = $props['fullwidth'];
        $itemsPerPage = (isset($props['elements']) and $props['elements'] !== '') ? $props['elements'] : 4;
        $galleryUniqueIndex = rand(1111,9999);

        if ( 'on' === $fullwidth ) {
            $width  = 1080;
            $height = 9999;
        } else {
            $width  = 400;
            $height = ( 'landscape' === $orientation ) ? 284 : 516;
        }

        $values = get_acpt_field([
                'post_id' => $postId,
                'box_name' => $metaField->getBox()->getName(),
                'field_name' => $metaField->getName(),
        ]);

        if(empty($values)){
            if(isset($props['empty_value']) and $props['empty_value'] !== null and $props['empty_value'] !== ''){
                return esc_html__("Display the message 'No content'" , ACPT_EXT_TEXT_DOMAIN);
            }

            return null;
        }

        $output = sprintf('<div class="et_pb_module et_pb_gallery et_pb_gallery_'.$galleryUniqueIndex.' et_pb_bg_layout_light%1$s">',
                ( 'on' !== $fullwidth ? ' et_pb_gallery_grid' : ' et_pb_slider et_pb_gallery_fullwidth' )
        );
        $output .= '<div class="et_pb_gallery_items et_post_gallery clearfix" data-per_page="'.$itemsPerPage.'">';

        foreach ($values as $index => $image){

            $imageSrc = (isset($image['id'])) ? wp_get_attachment_image_src( $image['id'], array( $width, $height ) )[0] : $image['src'];
            $renderedImage = (new self)->render_image(
                $imageSrc,
                [
                    'alt'    => $image['alt'],
                    'title'  => $image['title'],
                    'width'  => $width,
                    'height'  => $height,
                ],
                false
            );

            $output .= sprintf(
                    '<div class="et_pb_gallery_item%1$s">',
                    ( 'on' !== $fullwidth ? ' et_pb_grid_item et_pb_gallery_item_'.$galleryUniqueIndex.'_'.$index : '' )
            );
            $output .= "<div class='et_pb_gallery_image {$orientation}'>";
            $output .= sprintf(
        '<a href="%1$s" title="%2$s">
					'.$renderedImage.'
					<span class="et_overlay"></span>
				</a>',
                esc_url( $image['src'] ),
                esc_attr( $image['title'] )
            );
            $output .= '</div>';
            $output .= '</div>';
        }

        $output .= '<div class="et_pb_gallery_pagination"></div>';
        $output .= '</div>';
        $output .= '</div>';

        return $output;
    }

    /**
     * Special render for list field
     *
     * @param int            $postId
     * @param MetaFieldModel $metaField
     * @param array          $props
     *
     * @return string
     */
    private static function render_the_list_field($postId, MetaFieldModel $metaField, array $props)
    {
        $args = [
            'post_id' => $postId,
            'box_name' => $metaField->getBox()->getName(),
            'field_name' => $metaField->getName(),
        ];

        $values = get_acpt_field($args);

        if(empty($values)){
            if(isset($props['empty_value']) and $props['empty_value'] !== null and $props['empty_value'] !== ''){
                return esc_html__("Display the message 'No content'" , ACPT_EXT_TEXT_DOMAIN);
            }

            return null;
        }

        $output = '<div class="acpt-meta-field">';
        $output .= '<ul class="acpt-meta-field-list">';

        foreach ($values as $value){
            $output .= '<li>';
            $output .= self::render_value_formatted_with_props($value, $metaField->getName(), $props);
            $output .= '</li>';
        }

        $output .= '</ul>';
        $output .= '</div>';

        return $output;
    }

    /**
     * Render a well formatted value from props
     *
     * @param       $value
     * @param       $label
     * @param array $props
     *
     * @return string
     */
    private static function render_value_formatted_with_props($value, $label, array $props)
    {
        $output = '';

        $hasIcon = (isset($props['use_icon']) and $props['use_icon'] === 'on' and isset($props['icon']) and $props['icon'] !== null and $props['icon'] !== '');
        $hasImage = (isset($props['use_image']) and $props['use_image'] === 'on' and isset($props['image']) and $props['image'] !== null and $props['image'] !== '');

        if($hasIcon and isset($props['icon_placement']) and $props['icon_placement'] === 'left' or $props['icon_placement'] === 'above'){
            $output .= self::render_an_icon($props);
        }

        if($hasImage and isset($props['image_placement']) and ($props['image_placement'] === 'left' or $props['image_placement'] === 'above')){
            $output .= self::render_an_image($props);
        }

        if(isset($props['show_label']) and $props['show_label'] === 'on'){
            $output .= '<div class="label">'. $label . "</div>";
        }

        if(isset($props['prefix']) and $props['prefix'] !== null and $props['prefix'] !== ''){
            $output .= '<div class="prefix">'.$props['prefix'].'</div>';
        }

        if(isset($props['text_before']) and $props['text_before'] !== null and $props['text_before'] !== ''){
            $output .= '<div class="text_before">'.$props['text_before'].'</div>';
        }

        $output .= '<div class="value">'.$value.'</div>';

        if(isset($props['suffix']) and $props['suffix'] !== null and $props['suffix'] !== ''){
            $output .= '<div class="suffix">'.$props['suffix'].'</div>';
        }

        if($hasImage and isset($props['image_placement']) and ($props['image_placement'] === 'right' or $props['image_placement'] === 'below')){
            $output .= self::render_an_image($props);
        }

        if($hasIcon and isset($props['icon_placement']) and $props['icon_placement'] === 'right' or $props['icon_placement'] === 'below'){
            $output .= self::render_an_icon($props);
        }

        return $output;
    }

    /**
     * Render an icon from props
     *
     * @param array $props
     *
     * @return string
     */
    private static function render_an_icon(array $props)
    {
        $style = '';
        $placement = $props['icon_placement'];

        if(isset($props['icon_color']) and $props['icon_color'] !== null and $props['icon_color'] !== ''){
            $style .= 'color: '.$props['icon_color'].';';
        }

        if(isset($props['icon_width']) and $props['icon_width'] !== null and $props['icon_width'] !== ''){
            $style .= 'font-size: '.$props['icon_width'].';';
        }

        $renderedIcon = '';

        if($placement === 'below'){
            $renderedIcon .= '<break></break>';
        }

        $decodedIcon = et_pb_get_extended_font_icon_value( $props['icon'], true );
        $renderedIcon .= '<span class="et_pb_icon_wrap"><span class="et-pb-icon" style="'.$style.'">'.$decodedIcon.'</span></span>';

        if($placement === 'above'){
            $renderedIcon .= '<break></break>';
        }

        return $renderedIcon;
    }

    /**
     * Render an image from props
     *
     * @param array  $props
     *
     * @return string
     */
    private static function render_an_image(array $props)
    {
        $imageSrc = $props['image'];
        $placement = $props['image_placement'];
        $maxWidth = (isset($props['image_max_width']) and $props['image_max_width'] !== null and $props['image_max_width'] !== '') ? $props['image_max_width'] : '100%';
        $image = (new self)->render_image(
            $imageSrc,
            [
                'alt'    => get_the_title(),
                'width'  => $maxWidth,
            ],
            false
        );

        $renderedImage = '';

        if($placement === 'below'){
            $renderedImage .= '<break></break>';
        }

        $renderedImage .= '<div class="image '.$placement.'" style="max-width: '.$maxWidth.' !important;">'.$image.'</div>';

        if($placement === 'above'){
            $renderedImage .= '<break></break>';
        }

        return $renderedImage;
    }

    /**
     * @param MetaFieldModel $metaField
     * @param int            $postId
     * @param array          $props
     *
     * @return mixed|string|void
     */
    private static function get_acpt_field(MetaFieldModel $metaField, $postId, array $props = [])
    {
        if($metaField === null){
            return __( 'No post meta field found, sorry.', ACPT_EXT_TEXT_DOMAIN );
        }

        $args = [
            'post_id' => $postId,
            'box_name' => $metaField->getBox()->getName(),
            'field_name' => $metaField->getName(),
        ];

        $value = get_acpt_field($args);

        if($value === null){
            if(isset($props['empty_value']) and $props['empty_value'] !== null and $props['empty_value'] !== ''){
                return esc_html__("Display the message 'No content'" , ACPT_EXT_TEXT_DOMAIN);
            }

            return null;
        }

        if(isset($props['date_format']) and $props['date_format'] !== null and $props['date_format'] !== ''){
            $args['date_format'] = $props['date_format'];
        }

        if(isset($props['number_decimal']) and $props['number_decimal'] !== null and $props['number_decimal'] !== ''){
            $args['number_decimal'] = $props['number_decimal'];
        }

        if(isset($props['width']) and $props['width'] !== null and $props['width'] !== ''){
            $args['width'] = $props['width'];
        }

        if(isset($props['height']) and $props['height'] !== null and $props['height'] !== ''){
            $args['height'] = $props['height'];
        }

        if(isset($props['target']) and $props['target'] !== null and $props['target'] !== ''){
            $args['target'] = $props['target'];
        }

        if(isset($props['elements']) and $props['elements'] !== null and $props['elements'] !== ''){
            $args['elements'] = $props['elements'];
        }

	    if(isset($props['render']) and $props['render'] !== null and $props['render'] !== ''){
		    $args['render'] = $props['render'];
	    }

	    if(isset($props['country_render']) and $props['country_render'] !== null and $props['country_render'] !== ''){
		    $args['render'] = $props['country_render'];
	    }

        return acpt_field($args);
    }
}

/******************************
 * Call ACPT_Fields class
 ******************************/

new ACPT_Fields_Divi_Module();