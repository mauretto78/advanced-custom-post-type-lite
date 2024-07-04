<?php

namespace ACPT_Lite\Integrations\Elementor;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Models\Meta\MetaGroupModel;
use ACPT_Lite\Core\Repository\CustomPostTypeRepository;
use ACPT_Lite\Core\Repository\MetaRepository;
use ACPT_Lite\Core\Repository\OptionPageRepository;
use ACPT_Lite\Integrations\AbstractIntegration;
use ACPT_Lite\Integrations\Elementor\Controls\CssControl;
use ACPT_Lite\Integrations\Elementor\Controls\DateFormatControl;
use ACPT_Lite\Integrations\Elementor\Controls\ElementsControl;
use ACPT_Lite\Integrations\Elementor\Controls\HeightControl;
use ACPT_Lite\Integrations\Elementor\Controls\RenderControl;
use ACPT_Lite\Integrations\Elementor\Controls\ShortcodeControl;
use ACPT_Lite\Integrations\Elementor\Controls\TargetControl;
use ACPT_Lite\Integrations\Elementor\Controls\WidthControl;
use ACPT_Lite\Integrations\Elementor\Controls\WrapperControl;
use ACPT_Lite\Integrations\Elementor\Widgets\WidgetGenerator;
use Elementor\Widgets_Manager;

class ACPT_Elementor extends AbstractIntegration
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
    public function registerElementorControls( $controls_manager )
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
                'title' => esc_html__( 'ACPT', ACPT_LITE_PLUGIN_NAME ),
                'icon' => 'fa fa-plug',
            ]
        );
    }

    /**
     * https://github.com/wpacademy/wpac-material-cards-elementor
     *
     * @param Widgets_Manager $widgetsManager
     * @throws \Exception
     * @since 1.0.3
     */
    public function registerElementorWidgets(Widgets_Manager $widgetsManager)
    {
    	try {
		    // OP fields
		    $optionPageModels = OptionPageRepository::get();

		    foreach ($optionPageModels as $optionPageModel){
			    $metaGroups = MetaRepository::get([
				    'belongsTo' => MetaTypes::OPTION_PAGE,
				    'find' => $optionPageModel->getMenuSlug(),
			    ]);

			    if(!empty($metaGroups)){
				    $this->registerFields($metaGroups, $widgetsManager, MetaTypes::OPTION_PAGE, $optionPageModel->getMenuSlug());
			    }

			    foreach ($optionPageModel->getChildren() as $childOptionPageModel){
				    $metaGroups = MetaRepository::get([
					    'belongsTo' => MetaTypes::OPTION_PAGE,
					    'find' => $childOptionPageModel->getMenuSlug(),
				    ]);

				    if(!empty($metaGroups)){
					    $this->registerFields($metaGroups, $widgetsManager, MetaTypes::OPTION_PAGE, $childOptionPageModel->getMenuSlug());
				    }
			    }
		    }

		    // CPT fields
		    $args = [];
		    $postType = (isset($_GET['post'])) ? get_post_type($_GET['post']) : null;

		    if($postType !== null and $postType !== 'elementor_library'){
			    $args = [
				    'postType' => $postType
			    ];
		    }

		    $customPostTypeModels = CustomPostTypeRepository::get($args);

		    foreach ($customPostTypeModels as $customPostTypeModel){
			    $metaGroups = MetaRepository::get([
				    'belongsTo' => MetaTypes::CUSTOM_POST_TYPE,
				    'find' => $customPostTypeModel->getName(),
			    ]);

			    if(!empty($metaGroups)){
				    $this->registerFields($metaGroups, $widgetsManager, MetaTypes::CUSTOM_POST_TYPE, $customPostTypeModel->getName());
			    }
		    }
	    } catch (\Exception $exception){}
    }

	/**
	 * @param MetaGroupModel[] $metaGroups
	 * @param Widgets_Manager $widgetsManager
	 * @param $belongsTo
	 * @param $find
	 *
	 * @throws \Exception
	 */
    private function registerFields($metaGroups, Widgets_Manager $widgetsManager, $belongsTo, $find)
    {
	    foreach ($metaGroups as $group){
		    foreach ($group->getBoxes() as $metaBox){
			    foreach ($metaBox->getFields() as $boxFieldModel){

				    $boxFieldModel->setBelongsToLabel($belongsTo);
				    $boxFieldModel->setFindLabel($find);

				    $widgetsManager->register( new WidgetGenerator([], [
					    'boxFieldModel' => $boxFieldModel,
					    'find' => $find,
				    ]));
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
