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
     * @param $cb
     */
    protected function postTypeLink( $cb)
    {
        add_filter("post_type_link", $cb, 10, 2);
    }

    /**
     * Helper method, that attaches a passed function to the 'admin_init' WP action
     * @param $cb callback function.
     */
    protected function adminInit( $cb)
    {
        add_action("admin_init", $cb);
    }

    /**
     * @param $cb
     */
    protected function woocommerceProductDataTabs($cb)
    {
        add_filter( 'woocommerce_product_data_tabs', $cb );
    }

    /**
     * @param $cb
     */
    protected function woocommerceProductDataPanels($cb)
    {
        add_filter( 'woocommerce_product_data_panels', $cb );
    }

    /**
     * @param $cb
     */
    protected function woocommerceProcessProductMeta($cb)
    {
        add_filter('woocommerce_process_product_meta', $cb);
    }

    /**
     * @param $cb
     */
    protected function woocommerceProductTabs($cb)
    {
        add_filter('woocommerce_product_tabs', $cb);
    }

    /**
     * @param $cb
     */
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
        $pagenow = Url::pagenow();

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

			case "comment.php":
				$elementId = $_GET['c'] ?? null;
				$belongsTo = MetaTypes::COMMENT;
				break;

			case "admin.php":
				$elementId = $_GET['page'] ?? null;
				$belongsTo = MetaTypes::OPTION_PAGE;
				break;

			case "post-new.php":
			case "post.php":
				$elementId = $_GET['post'] ?? 'post-new';
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
			'options' => $options,
		];
	}

	/**
	 * This method is used to generate quick edit fields
	 *
	 * @param $key
	 * @param $label
	 * @param $value
	 * @param MetaFieldModel $metaBoxFieldModel
	 *
	 * @return string
	 */
	protected static function generateQuickEditField($key, $label, $value, MetaFieldModel $metaBoxFieldModel)
	{
		$return = '<fieldset class="inline-edit-col-right" id="#edit-'. $key.'">';
		$return .= '<input type="hidden" name="meta_fields[]" value="'. $key.'">';
		$return .= '<input type="hidden" name="meta_fields[]" value="'. $key.'_type">';
		$return .= '<input type="hidden" name="meta_fields[]" value="'. $key.'_id">';
		$return .= '<input type="hidden" name="'. $key.'_type" value="'. $metaBoxFieldModel->getType().'">';
		$return .= '<input type="hidden" name="'. $key.'_required" value="'. $metaBoxFieldModel->isRequired() .'">';
		$return .= '<input type="hidden" name="'. $key.'_id" value="'. $metaBoxFieldModel->getId() .'">';
		$return .= '<div class="inline-edit-col">';
		$return .= '<label>';
		$return .= '<span class="title">'.$label.'</span>';
		$return .= '<span class="input-text-wrap">';

		switch ($metaBoxFieldModel->getType()){

            // DATE_TYPE
            case MetaFieldModel::DATE_TYPE:
                $return .= '<input type="date" name="'. $key. '" data-acpt-column="column-'. $key. '" class="inline-edit-menu-order-input" value="'. $value.'">';
                break;

			// EMAIL_TYPE
			case MetaFieldModel::EMAIL_TYPE:
				$return .= '<input type="email" name="'. $key. '" data-acpt-column="column-'. $key. '" class="inline-edit-menu-order-input" value="'. $value.'">';
				break;

			// SELECT_TYPE
			case MetaFieldModel::SELECT_TYPE:

				if($metaBoxFieldModel->getType() === MetaFieldModel::SELECT_TYPE){
					$fieldName = $key;
				} else {
					$fieldName = $key."[]";
				}

				$multiple = '';
				$style = '';
				$select = '<select name="'. $fieldName. '" data-acpt-column="column-'. $key. '" class="inline-edit-menu-order-input" '.$multiple.' style="'.$style.'">';
				$selected = '';

				foreach ($metaBoxFieldModel->getOptions() as $option){
					if($metaBoxFieldModel->getType() === MetaFieldModel::SELECT_TYPE){
						$selected = selected( $value, $option->getValue(), false );
					} else {
						if(is_array($value)){
							$selected = selected(in_array($option->getValue(), $value), true, false);
						}
					}

					$select .= '<option '.$selected.' value="'.$option->getValue().'">'.$option->getLabel().'</option>';
				}

				$select .= '</select>';
				$return .= $select;
				break;

			// TEXTAREA_TYPE
			case MetaFieldModel::TEXTAREA_TYPE:
				$return .= '<textarea name="'. $key. '" data-acpt-column="column-'. $key. '" class="inline-edit-menu-order-input" rows="5">'. $value.'</textarea>';
				break;

			default:
				if(!is_string($value)){
					$value = null;
				}

				$return .= '<input type="text" name="'. $key .'" data-acpt-column="column-'. $key.'" class="inline-edit-menu-order-input" value="'. $value .'">';
		}

		$return .= '</span>';
		$return .= '</label>';
		$return .= '</div>';
		$return .= '</fieldset>';

		return $return;
	}

    /**
     * @param $postTypeName
     * @return string
     */
    protected function getPostTypeName($postTypeName)
    {
        try {
            return apply_filters("modify_post_type_name", $postTypeName);
        } catch (\Exception $exception){
            return $postTypeName;
        }
    }
}

