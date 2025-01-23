<?php

namespace ACPT_Lite\Integrations\Elementor\Widgets;

use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Integrations\Elementor\Constants\WidgetConstants;
use ACPT_Lite\Utils\Wordpress\Translator;
use Elementor\Controls_Manager;

class WidgetGenerator extends \Elementor\Widget_Base
{
    /**
     * @var MetaFieldModel
     */
    private $boxFieldModel;

	/**
	 * WidgetGenerator constructor.
	 *
	 * @param array $data
	 * @param null $args
	 *
	 * @throws \Exception
	 */
    public function __construct( $data = [], $args = null )
    {
        parent::__construct( $data, $args );

        if(!isset($args['boxFieldModel'])){
            throw new \Exception('A boxFieldModel instance required to run this widget.');
        }

        $this->boxFieldModel = $args['boxFieldModel'];
    }

    /**
     * Get the widget name
     *
     * @return string
     */
    public function get_name()
    {
    	if($this->boxFieldModel){
		    return $this->boxFieldModel->getDbName();
	    }

        return 'undefined';
    }

	/**
	 * get the UI title
	 *
	 * @return string
	 */
	public function get_title()
	{
		$title = $this->boxFieldModel ? '['.$this->boxFieldModel->getFindLabel().'] ' . $this->boxFieldModel->getUiName() : 'undefined';

		return esc_html__( $title, 'elementor-addon' );
	}

    /**
     * get UI icon
     *
     * @return string
     */
    public function get_icon()
    {
        if( !$this->boxFieldModel ){
            return 'eicon-editor-code';
        }

        switch ($this->boxFieldModel->getType()){
            case MetaFieldModel::ADDRESS_TYPE:
                return ' eicon-map-pin';

            case MetaFieldModel::COLOR_TYPE:
                return 'eicon-paint-brush';

	        case MetaFieldModel::COUNTRY_TYPE:
		        return 'eicon-globe';

            case MetaFieldModel::CURRENCY_TYPE:
                return ' eicon-bag-light';

            case MetaFieldModel::DATE_TYPE:
            case MetaFieldModel::DATE_TIME_TYPE:
            case MetaFieldModel::DATE_RANGE_TYPE:
                return 'eicon-date';

            case MetaFieldModel::EDITOR_TYPE:
                return 'eicon-text-area';

            case MetaFieldModel::EMAIL_TYPE:
                return 'eicon-mail';

            case MetaFieldModel::EMBED_TYPE:
                return 'eicon-gallery-grid';

            case MetaFieldModel::FILE_TYPE:
                return 'eicon-save-o';

            case MetaFieldModel::HTML_TYPE:
                return 'eicon-editor-code';

            case MetaFieldModel::GALLERY_TYPE:
                return 'eicon-photo-library';

            case MetaFieldModel::IMAGE_TYPE:
                return 'eicon-image';

            case MetaFieldModel::LENGTH_TYPE:
                return 'eicon-cursor-move';

            case MetaFieldModel::LIST_TYPE:
                return 'eicon-bullet-list';

            case MetaFieldModel::NUMBER_TYPE:
                return 'eicon-number-field';

            case MetaFieldModel::POST_TYPE:
                return 'eicon-sync';

            case MetaFieldModel::PHONE_TYPE:
                return 'eicon-tel-field';

	        case MetaFieldModel::FLEXIBLE_CONTENT_TYPE:
	        	return 'eicon-lightbox';

	        case MetaFieldModel::REPEATER_TYPE:
		        return 'eicon-post-list';

            case MetaFieldModel::SELECT_TYPE:
            case MetaFieldModel::SELECT_MULTI_TYPE:
                return 'eicon-select';

	        case MetaFieldModel::TABLE_TYPE:
		        return 'eicon-table';

            default:
            case MetaFieldModel::TEXTAREA_TYPE:
            case MetaFieldModel::TEXT_TYPE:
                return 'eicon-t-letter';

            case MetaFieldModel::TIME_TYPE:
                return 'eicon-clock-o';

            case MetaFieldModel::TOGGLE_TYPE:
                return 'eicon-toggle';

            case MetaFieldModel::VIDEO_TYPE:
                return 'eicon-play';

            case MetaFieldModel::WEIGHT_TYPE:
                return 'eicon-basket-medium';

            case MetaFieldModel::URL_TYPE:
                return 'eicon-url';
        }
    }

    /**
     * widget categories
     *
     * @return array
     */
    public function get_categories()
    {
        return [ WidgetConstants::GROUP_NAME ];
    }

    /**
     * get widget keywords
     *
     * @return array
     */
    public function get_keywords()
    {
        return [ WidgetConstants::GROUP_NAME, strtolower($this->boxFieldModel->getType()) ];
    }

    protected function register_controls() {

        $this->start_controls_section(
            'section_title',
            [
                'label' => esc_html__( 'ACPT field', 'elementor' ),
            ]
        );

        $this->add_control(
            'acpt_shortcode',
            [
                'type' => 'acpt_shortcode',
                'default' => $this->boxFieldModel ? '['.$this->boxFieldModel->getFindLabel().'] ' . $this->boxFieldModel->getUiName() : null,
                'placeholder' => esc_html__( 'Enter your code', 'elementor' ),
            ]
        );

        $contexts = $this->getContexts();

	    // Group 1
        if(in_array($this->boxFieldModel->getType(), $contexts['group1'])){
            $this->add_control(
            'acpt_width',
                [
                    'type' => Controls_Manager::TEXT,
                    'label' => esc_html__( 'Width.', 'elementor' ),
                    'default' => '100%',
                    'description' => esc_html__( 'Set the width (in pixels)', 'elementor' ),
                ]
            );

            $this->add_control(
            'acpt_height',
                [
	                'type' => Controls_Manager::TEXT,
                    'label' => esc_html__( 'Height.', 'elementor' ),
                    'default' => '300',
                    'description' => esc_html__( 'Set the height (in pixels)', 'elementor' ),
                ]
            );
        }

        // Group 2
        if(in_array($this->boxFieldModel->getType(), $contexts['group2'])){
            $this->add_control(
                'acpt_target',
                [
	                'type' => Controls_Manager::SELECT,
                    'label' => esc_html__( 'Link target.', 'elementor' ),
                    'default' => '_self',
                    'options' => [
                    	'' => Translator::translate("--Select--"),
                    	'_blank' => 'Opens in the same frame as it was clicked',
                    	'_self' => 'Opens in the parent frame',
                    	'_parent' => 'Opens in the full body of the window',
                    	'_top' => '',
                    ],
                    'description' => esc_html__( 'Select the link target', 'elementor' ),
                ]
            );
        }

        // Group 3
        if(in_array($this->boxFieldModel->getType(), $contexts['group3'])){
            $this->add_control(
                'acpt_dateformat',
                [
	                'type' => Controls_Manager::SELECT,
                    'label' => esc_html__( 'Date format.', 'elementor' ),
                    'default' => 'd/m/Y',
                    'options' => [
	                    '' => Translator::translate("--Select--"),
						"d-M-y" => "dd-mmm-yy (ex. 28-OCT-90)",
						"d-M-Y" => "dd-mmm-yyyy (ex. 28-OCT-1990)",
						"d M y" => "mmm yy (ex. 28 OCT 90)",
						"d M Y" => "mmm yyyy (ex. 28 OCT 1990)",
						"d/m/Y" => "dd/mm/yy (ex. 28/10/90)",
						"m/d/y" => "mm/dd/yy (ex. 10/28/90)",
						"m/d/Y" => "mm/dd/yyyy (ex. 10/28/1990)",
						"d.m.y" => "dd.mm.yy (ex. 28.10.90)",
						"d.m.Y" => "dd.mm.yyyy (ex. 28.10.1990)",
                    ],
                    'description' => esc_html__( 'Select the date format', 'elementor' ),
                ]
            );
        }

        // Group 4
        if(in_array($this->boxFieldModel->getType(), $contexts['group4'])){
            $this->add_control(
            'acpt_width',
                [
                    'type' => Controls_Manager::TEXT,
                    'label' => esc_html__( 'Width (px).', 'elementor' ),
                    'default' => '100%',
                    'description' => esc_html__( 'Set the width (in pixels)', 'elementor' ),
                ]
            );

            $this->add_control(
            'acpt_height',
                [
                    'type' => Controls_Manager::TEXT,
                    'label' => esc_html__( 'Height (px).', 'elementor' ),
                    'default' => '300',
                    'description' => esc_html__( 'Set the height (in pixels)', 'elementor' ),
                ]
            );

            $this->add_control(
            'acpt_elements',
                [
	                'type' => Controls_Manager::SELECT,
                    'label' => esc_html__( 'Number of elements.', 'elementor' ),
                    'default' => '2',
                    'options' => [
                        '' => Translator::translate("--Select--"),
                    	"1" => "One element",
		                "2" => "Two elements",
		                "3" => "Three elements",
		                "4" => "Four elements",
		                "6" => "Six elements",
                    ],
                    'description' => esc_html__( 'Select the number of elements', 'elementor' ),
                ]
            );
        }

	    // Group 5
	    if(in_array($this->boxFieldModel->getType(), $contexts['group5'])){
		    $this->add_control(
			    'acpt_dateformat',
			    [
				    'type' => Controls_Manager::SELECT,
				    'label' => esc_html__( 'Date format.', 'elementor' ),
				    'default' => 'd/m/Y',
				    'options' => [
					    '' => Translator::translate("--Select--"),
					    "d-M-y" => "dd-mmm-yy (ex. 28-OCT-90)",
					    "d-M-Y" => "dd-mmm-yyyy (ex. 28-OCT-1990)",
					    "d M y" => "mmm yy (ex. 28 OCT 90)",
					    "d M Y" => "mmm yyyy (ex. 28 OCT 1990)",
					    "d/m/Y" => "dd/mm/yy (ex. 28/10/90)",
					    "m/d/y" => "mm/dd/yy (ex. 10/28/90)",
					    "m/d/Y" => "mm/dd/yyyy (ex. 10/28/1990)",
					    "d.m.y" => "dd.mm.yy (ex. 28.10.90)",
					    "d.m.Y" => "dd.mm.yyyy (ex. 28.10.1990)",
				    ],
				    'description' => esc_html__( 'Select the date format', 'elementor' ),
			    ]
		    );

		    $this->add_control(
			    'acpt_timeformat',
			    [
				    'type' => Controls_Manager::SELECT,
				    'label' => esc_html__( 'Time format.', 'elementor' ),
				    'default' => 'H:i:s',
				    'options' => [
					    '' => Translator::translate("--Select--"),
					    "d-M-y" => "dd-mmm-yy (ex. 28-OCT-90)",
					    "d-M-Y" => "dd-mmm-yyyy (ex. 28-OCT-1990)",
					    "d M y" => "mmm yy (ex. 28 OCT 90)",
					    "d M Y" => "mmm yyyy (ex. 28 OCT 1990)",
					    "d/m/Y" => "dd/mm/yy (ex. 28/10/90)",
					    "m/d/y" => "mm/dd/yy (ex. 10/28/90)",
					    "m/d/Y" => "mm/dd/yyyy (ex. 10/28/1990)",
					    "d.m.y" => "dd.mm.yy (ex. 28.10.90)",
					    "d.m.Y" => "dd.mm.yyyy (ex. 28.10.1990)",
				    ],
				    'description' => esc_html__( 'Select the time format', 'elementor' ),
			    ]
		    );
	    }

	    // Group 6
	    if(in_array($this->boxFieldModel->getType(), $contexts['group6'])){
		    $this->add_control(
			    'acpt_timeformat',
			    [
				    'type' => Controls_Manager::SELECT,
				    'label' => esc_html__( 'Time format.', 'elementor' ),
				    'default' => 'H:i:s',
				    'options' => [
					    'H:i'=> 'H:i (ex. 13:45)',
					    'g:i a' => 'g:i a (ex. 13:45)',
					    'g:i A' => 'g:i A (ex. 1:45 PM)',
				    ],
				    'description' => esc_html__( 'Select the time format', 'elementor' ),
			    ]
		    );
	    }

	    // Group 7
	    if(in_array($this->boxFieldModel->getType(), $contexts['group7'])){
		    $this->add_control(
			    'acpt_render',
			    [
				    'type' => Controls_Manager::SELECT,
				    'label' => esc_html__( 'Display as.', 'elementor' ),
				    'default' => 'H:i:s',
				    'options' => [
				    	'' => Translator::translate("--Select--"),
				    	'text' => 'Plain text',
				    	'link' => 'Link',
				    ],
				    'description' => esc_html__( 'Render this field as', 'elementor' ),
			    ]
		    );
	    }

	    // Group 8
	    if(in_array($this->boxFieldModel->getType(), $contexts['group8'])){
		    $this->add_control(
			    'acpt_repeater',
			    [
				    'label' => 'Element template',
				    'type' => Controls_Manager::WYSIWYG,
				    'default' => '<div>' . esc_html__( 'Repeater elements template' ) . '</div>',
			    ]
		    );

		    $this->add_control(
			    'acpt_wrapper',
			    [
				    'type' => Controls_Manager::TEXT,
				    'label' => 'Element wrapper',
				    'description' => esc_html__( 'The HTML tag of the wrapper element', 'elementor' ),
				    'default' => 'div',
				    'placeholder' => esc_html__( 'The HTML tag of the wrapper element', 'elementor' ),
			    ]
		    );

		    $this->add_control(
			    'acpt_css',
			    [
				    'type' => Controls_Manager::TEXT,
				    'label' => 'Element wrapper CSS class(es)',
				    'description' => esc_html__( 'The CSS class(es) of the wrapper element', 'elementor' ),
				    'default' => '',
				    'placeholder' => esc_html__( 'Example: acpt-wrapper active', 'elementor' ),
			    ]
		    );
	    }

	    // Group 9
	    if(in_array($this->boxFieldModel->getType(), $contexts['group9'])){
		    $this->add_control(
			    'acpt_repeater',
			    [
				    'label' => 'Element template',
				    'type' => Controls_Manager::WYSIWYG,
				    'default' => '<div>' . esc_html__( 'Flexible elements template' ) . '</div>',
			    ]
		    );

		    $blocks = [
			    '' => Translator::translate("--Select--"),
		    ];

		    foreach ($this->boxFieldModel->getBlocks() as $block){
			    $blocks[$block->getName()] = $block->getName();
		    }

		    $this->add_control(
			    'acpt_block',
			    [
				    'label' => 'Block',
				    'type' => Controls_Manager::SELECT,
				    'options' => $blocks,
				    'default' => '<div>' . esc_html__( 'Flexible elements template' ) . '</div>',
			    ]
		    );

		    $this->add_control(
			    'acpt_wrapper',
			    [
				    'type' => Controls_Manager::SELECT,
				    'label' => 'Element wrapper',
				    'description' => esc_html__( 'The HTML tag of the wrapper element', 'elementor' ),
				    'default' => 'div',
				    'options' => [
					    'div' => 'Div',
					    'p' => 'Paragraph',
					    'span' => 'Span',
					    'ol' => 'Ordered list',
					    'ul' => 'Unordered list',
				    ],
				    'placeholder' => esc_html__( 'The HTML tag of the wrapper element', 'elementor' ),
			    ]
		    );

		    $this->add_control(
			    'acpt_css',
			    [
				    'type' => Controls_Manager::TEXT,
				    'label' => 'Element wrapper CSS class(es)',
				    'description' => esc_html__( 'The CSS class(es) of the wrapper element', 'elementor' ),
				    'default' => '',
				    'placeholder' => esc_html__( 'Example: acpt-wrapper active', 'elementor' ),
			    ]
		    );
	    }

	    // Group 10
	    if(in_array($this->boxFieldModel->getType(), $contexts['group10'])){
		    $this->add_control(
			    'acpt_render',
			    [
				    'type' => Controls_Manager::SELECT,
				    'label' => esc_html__( 'Display as.', 'elementor' ),
				    'default' => 'text',
				    'options' => [
					    '' => Translator::translate("--Select--"),
					    'text' => 'Plain text',
					    'flag' => 'Flag',
					    'full' => 'Flag and text',
				    ],
				    'description' => esc_html__( 'Render this field as', 'elementor' ),
			    ]
		    );
	    }

        $this->end_controls_section();
    }

	/**
	 * Render the widget
	 * @throws \Exception
	 */
    protected function render()
    {
        $settings = $this->get_controls_settings();

        echo WidgetRender::render($this->boxFieldModel, $settings);
    }

	/**
	 * @return array
	 */
    private function getContexts()
    {
    	return [
		    'group1' => [MetaFieldModel::ADDRESS_TYPE, MetaFieldModel::IMAGE_TYPE, MetaFieldModel::VIDEO_TYPE, MetaFieldModel::COLOR_TYPE, MetaFieldModel::TOGGLE_TYPE],
		    'group2' => [MetaFieldModel::URL_TYPE],
		    'group3' => [MetaFieldModel::DATE_TYPE, MetaFieldModel::DATE_RANGE_TYPE],
		    'group4' => [MetaFieldModel::GALLERY_TYPE],
		    'group5' => [MetaFieldModel::DATE_TIME_TYPE],
		    'group6' => [MetaFieldModel::TIME_TYPE],
		    'group7' => [MetaFieldModel::EMAIL_TYPE, MetaFieldModel::PHONE_TYPE],
		    'group8' => [MetaFieldModel::REPEATER_TYPE],
		    'group9' => [MetaFieldModel::FLEXIBLE_CONTENT_TYPE],
		    'group10' => [MetaFieldModel::COUNTRY_TYPE],
	    ];
    }
}
