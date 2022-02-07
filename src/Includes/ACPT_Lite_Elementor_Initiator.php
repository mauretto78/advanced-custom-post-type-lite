<?php

namespace ACPT_Lite\Includes;

use ACPT_Lite\Core\Generators\Elementor\Controls\ShortcodeControl;
use ACPT_Lite\Core\Generators\Elementor\Widgets\WidgetGenerator;

class ACPT_Lite_Elementor_Initiator
{
    const MINIMUM_ELEMENTOR_VERSION = '2.0.0';

    /**
     * Run Elementor Widgets
     */
    public function run()
    {
        if($this->checkIfElementorIsInstalled() and $this->checkIfElementorVersionIsCompatible()){
            add_action( 'elementor/controls/register', [$this, 'registerElementorControls'] );
            add_action( 'elementor/elements/categories_registered', [$this, 'addElementorWidgetCategory'] );
            add_action( 'elementor/widgets/register', [$this, 'registerElementorWidgets'] );
        }
    }

    /**
     * Register Elementor controls
     *
     * @param $controls_manager
     */
    function registerElementorControls( $controls_manager )
    {
        $controls_manager->register( new ShortcodeControl() );
    }

    /**
     * Add ACPT category to Elementor
     *
     * @param $elements_manager
     */
    public function addElementorWidgetCategory( $elements_manager )
    {
        $elements_manager->add_category(
            'acpt',
            [
                'title' => esc_html__( 'ACPT Lite', ACPT_LITE_PLUGIN_NAME ),
                'icon' => 'fa fa-plug',
            ]
        );
    }

    /**
     * https://github.com/wpacademy/wpac-material-cards-elementor
     *
     * @param $widgets_manager
     * @throws \Exception
     * @since 1.0.3
     */
    public function registerElementorWidgets($widgets_manager)
    {
        $postType = (isset($_GET['post'])) ? get_post_type($_GET['post']) : null;
        $customPostTypeModels = ACPT_Lite_DB::get([
                'postType' => $postType
        ]);

        foreach ($customPostTypeModels as $customPostTypeModel){
            $metaBoxes = ACPT_Lite_DB::getMeta($customPostTypeModel->getName());

            foreach ($metaBoxes as $metaBox){
                foreach ($metaBox->getFields() as $boxFieldModel){
                    $widgets_manager->register( new WidgetGenerator([], [
                            'boxFieldModel' => $boxFieldModel
                    ]));
                }
            }
        }
    }

    /**
     * @return bool
     */
    private function checkIfElementorIsInstalled()
    {
        return is_plugin_active( 'elementor/elementor.php' );
    }

    /**
     * @return bool
     */
    private function checkIfElementorVersionIsCompatible()
    {
        $elementorPlugin = __DIR__.'/../../../elementor/elementor.php';

        if( !file_exists($elementorPlugin) ){
            return false;
        }

        $pluginData = get_plugin_data( $elementorPlugin );

        return version_compare( $pluginData['Version'], self::MINIMUM_ELEMENTOR_VERSION, '>=' );
    }
}








