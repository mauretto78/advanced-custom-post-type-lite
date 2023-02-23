<?php

namespace ACPT_Lite\Core\Generators\Elementor\Widgets;

use ACPT_Lite\Core\Models\CustomPostTypeMetaBoxFieldModel;
use ACPT_Lite\Core\Shortcodes\PostMetaShortcode;

class WidgetGenerator extends \Elementor\Widget_Base
{
    /**
     * @var CustomPostTypeMetaBoxFieldModel
     */
    private $boxFieldModel;

    public function __construct( $data = [], $args = null ) {
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

            case CustomPostTypeMetaBoxFieldModel::EMAIL_TYPE:
                return 'eicon-mail';

            case CustomPostTypeMetaBoxFieldModel::SELECT_TYPE:
                return 'eicon-select';

            default:
            case CustomPostTypeMetaBoxFieldModel::TEXT_TYPE:
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
                'default' => $this->boxFieldModel ? '[acpt box="'.esc_attr($this->boxFieldModel->getMetaBox()->getName()).'" field="'.esc_attr($this->boxFieldModel->getName()).'"]' : null,
                'placeholder' => esc_html__( 'Enter your code', 'elementor' ),
            ]
        );

        $this->end_controls_section();
    }

    /**
     * Render the widget
     */
    protected function render() {

        $settings = $this->get_controls_settings();
        $box = esc_attr($this->boxFieldModel->getMetaBox()->getName());
        $field = esc_attr($this->boxFieldModel->getName());
        $width = (isset($settings['acpt_width'])) ? $settings['acpt_width'] : null;
        $height = (isset($settings['acpt_height'])) ? $settings['acpt_height'] : null;
        $elements = (isset($settings['acpt_elements'])) ? $settings['acpt_elements'] : null;
        $target = (isset($settings['acpt_target'])) ? $settings['acpt_target'] : null;
        $dateFormat = (isset($settings['acpt_dateformat'])) ? $settings['acpt_dateformat'] : null;

        $shortcodeString = $this->generateShortcodeString(
            $box,
            $field,
            $width,
            $height,
            $target,
            $dateFormat,
            $elements);

        if ($_SERVER['PHP_SELF'] === '/wp-admin/post.php' || $_SERVER['PHP_SELF'] === '/wp-admin/admin-ajax.php'){
            echo $this->renderShortcode(
                $box,
                $field,
                $width,
                $height,
                $target,
                $dateFormat,
                $elements
            );
        } else {
            echo $shortcodeString;
        }
    }

    /**
     * @param string $box
     * @param string $field
     * @param null   $width
     * @param null   $height
     * @param null   $target
     * @param null   $dateFormat
     * @param null   $elements
     *
     * @return string
     */
    private function generateShortcodeString($box, $field, $width = null, $height = null, $target = null, $dateFormat = null, $elements = null)
    {
        $shortcode = '[acpt box="'.$box.'" field="'.$field.'"';

        if($target){
            $shortcode .= ' target="'.$target.'"';
        }

        if($width){
            $shortcode .= ' width="'.$width.'"';
        }

        if($height){
            $shortcode .= ' height="'.$height.'"';
        }

        if($dateFormat){
            $shortcode .= ' date-format="'.$dateFormat.'"';
        }

        if($elements){
            $shortcode .= ' elements="'.$elements.'"';
        }

        $shortcode .= ']';

        return $shortcode;
    }

    /**
     * @param string $box
     * @param string $field
     * @param null   $width
     * @param null   $height
     * @param null   $target
     * @param null   $dateFormat
     * @param null   $elements
     *
     * @return string
     * @throws \Exception
     */
    private function renderShortcode($box, $field, $width = null, $height = null, $target = null, $dateFormat = null, $elements = null)
    {
        $postMetaShortcode = new PostMetaShortcode();
        $attr = [
            'pid' => isset($_GET['post']) ? $_GET['post'] : null,
            'box' => esc_attr($box),
            'field' => esc_attr($field),
            'width' => $width ? $width  : null,
            'height' => $height ? $height  : null,
            'target' => $target ? $target  : null,
            'dateFormat' => $dateFormat ? $dateFormat  : null,
            'elements' => $elements ? $elements  : null,
        ];

        return $postMetaShortcode->render($attr);
    }
}
