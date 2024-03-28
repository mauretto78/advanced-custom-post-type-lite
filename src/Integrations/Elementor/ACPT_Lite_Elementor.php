<?php

namespace ACPT_Lite\Integrations\Elementor;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Repository\CustomPostTypeRepository;
use ACPT_Lite\Core\Repository\MetaRepository;
use ACPT_Lite\Integrations\AbstractIntegration;
use ACPT_Lite\Integrations\Elementor\Controls\DateFormatControl;
use ACPT_Lite\Integrations\Elementor\Controls\ElementsControl;
use ACPT_Lite\Integrations\Elementor\Controls\HeightControl;
use ACPT_Lite\Integrations\Elementor\Controls\ShortcodeControl;
use ACPT_Lite\Integrations\Elementor\Controls\TargetControl;
use ACPT_Lite\Integrations\Elementor\Controls\RenderControl;
use ACPT_Lite\Integrations\Elementor\Controls\WidthControl;
use ACPT_Lite\Integrations\Elementor\Widgets\WidgetGenerator;

class ACPT_Lite_Elementor extends AbstractIntegration
{
    const MINIMUM_ELEMENTOR_VERSION = '2.0.0';

    /**
     * @inheritDoc
     */
    protected function isActive()
    {
        return is_plugin_active( 'elementor/elementor.php' );
    }

    /**
     * @inheritDoc
     */
    protected function runIntegration()
    {
        if($this->checkIfElementorVersionIsCompatible()){
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
        $controls_manager->register( new DateFormatControl() );
        $controls_manager->register( new ElementsControl() );
        $controls_manager->register( new WidthControl() );
        $controls_manager->register( new HeightControl() );
        $controls_manager->register( new TargetControl() );
        $controls_manager->register( new RenderControl() );
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
                'title' => esc_html__( 'ACPT', ACPT_LITE_PLUGIN_NAME ),
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
        $customPostTypeModels = CustomPostTypeRepository::get([
            'postType' => $postType
        ]);

        foreach ($customPostTypeModels as $customPostTypeModel){
            $metaGroups = MetaRepository::get([
                'belongsTo' => MetaTypes::CUSTOM_POST_TYPE,
                'find' => $customPostTypeModel->getName(),
            ]);

            foreach ($metaGroups as $group){
	            foreach ($group->getBoxes() as $metaBox){
		            foreach ($metaBox->getFields() as $boxFieldModel){

			            $boxFieldModel->setBelongsToLabel(MetaTypes::CUSTOM_POST_TYPE);
			            $boxFieldModel->setFindLabel($postType);

			            $widgets_manager->register( new WidgetGenerator([], [
				            'boxFieldModel' => $boxFieldModel
			            ]));
		            }
	            }
            }
        }
    }

    /**
     * @return bool
     */
    private function checkIfElementorVersionIsCompatible()
    {
        $elementorPlugin = __DIR__.'/../../../../elementor/elementor.php';

        if( !file_exists($elementorPlugin) ){
            return false;
        }

        $pluginData = get_plugin_data( $elementorPlugin );

        return version_compare( $pluginData['Version'], self::MINIMUM_ELEMENTOR_VERSION, '>=' );
    }
}
