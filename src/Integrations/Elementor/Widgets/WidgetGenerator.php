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

            case MetaFieldModel::DATE_TYPE:
                return 'eicon-date';

            case MetaFieldModel::SELECT_TYPE:
                return 'eicon-select';

            default:
            case MetaFieldModel::TEXTAREA_TYPE:
            case MetaFieldModel::TEXT_TYPE:
                return 'eicon-t-letter';
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
		    'group3' => [MetaFieldModel::DATE_TYPE],
		    'group7' => [MetaFieldModel::EMAIL_TYPE,],
	    ];
    }
}
