<?php

namespace ACPT_Lite\Integrations\Elementor\Widgets;

use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Core\Shortcodes\PostMetaShortcode;

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
        return $this->boxFieldModel ? $this->boxFieldModel->getDbName() : 'undefined';
    }

    /**
     * get the UI title
     *
     * @return string
     */
    public function get_title()
    {
        $title = $this->boxFieldModel ? $this->boxFieldModel->getUiName() : 'undefined';

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

            case MetaFieldModel::EMAIL_TYPE:
                return 'eicon-mail';

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
        return [ 'acpt' ];
    }

    /**
     * get widget keywords
     *
     * @return array
     */
    public function get_keywords()
    {
        return [ 'acpt', strtolower($this->boxFieldModel->getType()) ];
    }

    protected function register_controls() {

        $this->start_controls_section(
            'section_title',
            [
                'label' => esc_html__( 'ACPT shortcode generator', 'elementor' ),
            ]
        );

        $this->add_control(
            'acpt_shortcode',
            [
                'type' => 'acpt_shortcode',
                'description' => esc_html__( 'Here you can see the base ACPT shortcode.', 'elementor' ),
                'default' => $this->boxFieldModel ? '[acpt box="'.esc_attr($this->boxFieldModel->getBox()->getName()).'" field="'.esc_attr($this->boxFieldModel->getName()).'"]' : null,
                'placeholder' => esc_html__( 'Enter your code', 'elementor' ),
            ]
        );

        $group3 = [MetaFieldModel::DATE_TYPE];
        $group7 = [MetaFieldModel::EMAIL_TYPE];


        // Group 3
        if(in_array($this->boxFieldModel->getType(), $group3)){
            $this->add_control(
                'acpt_dateformat',
                [
                    'type' => 'acpt_dateformat',
                    'description' => esc_html__( 'Date format.', 'elementor' ),
                    'default' => 'd/m/Y',
                    'placeholder' => esc_html__( 'Select the date format', 'elementor' ),
                ]
            );
        }

	    // Group 7
	    if(in_array($this->boxFieldModel->getType(), $group7)){
		    $this->add_control(
			    'acpt_render',
			    [
				    'type' => 'acpt_render',
				    'description' => esc_html__( 'Display as.', 'elementor' ),
				    'default' => 'H:i:s',
				    'placeholder' => esc_html__( 'Render this field as', 'elementor' ),
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
    	global $post;

        $settings = $this->get_controls_settings();
        $box = esc_attr($this->boxFieldModel->getBox()->getName());
        $field = esc_attr($this->boxFieldModel->getName());
        $width = (isset($settings['acpt_width'])) ? $settings['acpt_width'] : null;
        $height = (isset($settings['acpt_height'])) ? $settings['acpt_height'] : null;
        $elements = (isset($settings['acpt_elements'])) ? $settings['acpt_elements'] : null;
        $target = (isset($settings['acpt_target'])) ? $settings['acpt_target'] : null;
        $dateFormat = (isset($settings['acpt_dateformat'])) ? $settings['acpt_dateformat'] : null;
        $timeFormat = (isset($settings['acpt_timeformat'])) ? $settings['acpt_timeformat'] : null;
        $render = (isset($settings['acpt_render'])) ? $settings['acpt_render'] : null;

        if ($_SERVER['PHP_SELF'] === '/wp-admin/post.php' or $_SERVER['PHP_SELF'] === '/wp-admin/admin-ajax.php'){
            echo $this->renderShortcode(
	            $post->ID,
                $box,
                $field,
                $width,
                $height,
                $target,
                $dateFormat,
	            $timeFormat,
                $elements,
	            $render
            );
        } else {
            echo $this->renderField(
	            $post->ID,
	            $box,
	            $field,
	            $width,
	            $height,
	            $target,
	            $dateFormat,
	            $timeFormat,
	            $elements,
	            $render
            );
        }
    }

	/**
	 * @param $postId
	 * @param $box
	 * @param $field
	 * @param null $width
	 * @param null $height
	 * @param null $target
	 * @param null $dateFormat
	 * @param null $timeFormat
	 * @param null $elements
	 * @param null $render
	 *
	 * @return mixed|null
	 */
    private function renderField($postId, $box, $field, $width = null, $height = null, $target = null, $dateFormat = null, $timeFormat = null, $elements = null, $render = null)
    {
        $payload = [
	        'post_id' => $postId,
	        'box_name' => $box,
	        'field_name' => $field,
        ];

        if($target){
	        $payload['target'] = $target;
        }

        if($width){
	        $payload['width'] = $width;
        }

        if($height){
	        $payload['height'] = $height;
        }

        if($dateFormat){
	        $payload['date-format'] = $dateFormat;
        }

	    if($timeFormat){
		    $payload['time-format'] = $timeFormat;
	    }

        if($elements){
	        $payload['elements'] = $elements;
        }

	    if($render){
		    $payload['render'] = $render;
	    }

        return acpt_field($payload);
    }

	/**
	 * @param $postId
	 * @param $box
	 * @param $field
	 * @param null $width
	 * @param null $height
	 * @param null $target
	 * @param null $dateFormat
	 * @param null $timeFormat
	 * @param null $elements
	 * @param null $render
	 *
	 * @return string
	 * @throws \Exception
	 */
    private function renderShortcode($postId, $box, $field, $width = null, $height = null, $target = null, $dateFormat = null, $timeFormat = null, $elements = null, $render = null)
    {
        $postMetaShortcode = new PostMetaShortcode();
        $attr = [
            'pid' => isset($_GET['post']) ? $_GET['post'] : null,
            'box' => esc_attr($box),
            'field' => esc_attr($field),
            'width' => $width ? $width  : null,
            'height' => $height ? $height  : null,
            'target' => $target ? $target  : null,
            'date-format' => $dateFormat ? $dateFormat  : null,
            'time-format' => $timeFormat ? $timeFormat  : null,
            'elements' => $elements ? $elements  : null,
            'render' => $render ? $render  : null,
        ];

        return $postMetaShortcode->render($attr);
    }
}
