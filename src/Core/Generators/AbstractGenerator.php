<?php

namespace ACPT_Lite\Core\Generators;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Utils\PHP\Url;

/**
 * *************************************************
 * AbstractGenerator class
 * *************************************************
 *
 * @author Mauro Cassani
 * @link https://github.com/mauretto78/
 */
abstract class AbstractGenerator
{
    const NONCE_FIELD_NAME = 'acpt_nonce';

    /**
     * Helper method, that attaches a passed function to the 'init' WP action
     * @param $cb callback function.
     */
    protected function init($cb)
    {
        add_action("init", $cb);
    }

    /**
     * Helper method, that attaches a passed function to the 'admin_init' WP action
     * @param $cb callback function.
     */
    protected function adminInit( $cb)
    {
        add_action("admin_init", $cb);
    }

    protected function woocommerceProductDataTabs($cb)
    {
        add_filter( 'woocommerce_product_data_tabs', $cb );
    }

    protected function woocommerceProductDataPanels($cb)
    {
        add_filter( 'woocommerce_product_data_panels', $cb );
    }

    protected function woocommerceProcessProductMeta($cb)
    {
        add_filter('woocommerce_process_product_meta', $cb);
    }

    protected function woocommerceProductTabs($cb)
    {
        add_filter('woocommerce_product_tabs', $cb);
    }

    protected function adminHead($cb)
    {
        add_action( 'admin_head', $cb );
    }

	/**
	 * Enqueue JS scripts
	 *
	 * @param $action
	 */
	public function enqueueScripts($action)
	{
		global $pagenow;

		$belongsTo = null;
		$elementId = null;

		switch ($pagenow){
			case "profile.php":
				$elementId = wp_get_current_user()->ID;
				$belongsTo = MetaTypes::USER;
				break;

			case "user-edit.php":
				$elementId = $_GET['user_id'] ?? null;
				$belongsTo = MetaTypes::USER;
				break;

			case "post-new.php":
			case "post.php":
				$elementId = $_GET['post'] ?? null;
				$belongsTo = MetaTypes::CUSTOM_POST_TYPE;
				break;

			case "edit-tags.php":
				$elementId = $_GET['taxonomy'] ?? null;
				$belongsTo = MetaTypes::TAXONOMY;
				break;

			case "term.php":
				$elementId = $_GET['tag_ID'] ?? null;
				$belongsTo = MetaTypes::TAXONOMY;
				break;

		}

		// validation
		wp_register_script('ACPTFormValidator',  plugin_dir_url( dirname( __FILE__ ) ) . '../../assets/static/js/ACPTFormValidator.js' );
		wp_enqueue_script('ACPTFormValidator');

		wp_register_script( 'ACPTFormValidator-run', '', [], '', true );
		wp_enqueue_script('ACPTFormValidator-run');
		wp_add_inline_script( 'ACPTFormValidator-run', '
			window.addEventListener("load", () => {
				const validator = new ACPTFormValidator("'.$action.'");
				validator.run();
			});
		');

		if($elementId !== null and $belongsTo !== null){

			// conditional rules
			wp_register_script('ACPTConditionalRules',  plugin_dir_url( dirname( __FILE__ ) ) . '../../assets/static/js/ACPTConditionalRules.js' );
			wp_enqueue_script('ACPTConditionalRules');

			wp_register_script( 'ACPTConditionalRules-run', '', [], '', true );
			wp_enqueue_script('ACPTConditionalRules-run');
			wp_add_inline_script( 'ACPTConditionalRules-run', '
				const conditionalRules = new ACPTConditionalRules("'.Url::fullUrl().'", "'.$belongsTo.'", "'.$elementId.'");
				conditionalRules.run();
			');
		}
	}

	/**
	 * This method is used by CPT and Comment meta field generators
	 *
	 * @param MetaFieldModel $fieldModel
	 *
	 * @return array
	 */
	protected function generateMetaBoxFieldArray(MetaFieldModel $fieldModel)
	{
		$options = [];

		foreach ($fieldModel->getOptions() as $optionModel){
			$options[] = [
				'label' => $optionModel->getLabel(),
				'value' => $optionModel->getValue(),
			];
		}

		return [
			'id' => $fieldModel->getId(),
			'type' => $fieldModel->getType(),
			'name' => $fieldModel->getName(),
			'defaultValue' => $fieldModel->getDefaultValue(),
			'description' => $fieldModel->getDescription(),
			'isRequired' => $fieldModel->isRequired(),
			'isShowInArchive' => $fieldModel->isShowInArchive(),
			'sort' => $fieldModel->getSort(),
		];
	}
}

