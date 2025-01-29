<?php

namespace ACPT_Lite\Core\Generators\Meta;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Generators\AbstractGenerator;
use ACPT_Lite\Core\Models\WooCommerce\WooCommerceProductDataFieldModel;
use ACPT_Lite\Core\Models\WooCommerce\WooCommerceProductDataFieldOptionModel;
use ACPT_Lite\Core\Models\WooCommerce\WooCommerceProductDataModel;
use ACPT_Lite\Utils\Data\Meta;
use ACPT_Lite\Utils\Wordpress\Posts;
use ACPT_Lite\Utils\Wordpress\Terms;
use ACPT_Lite\Utils\Wordpress\Translator;
use ACPT_Lite\Utils\Wordpress\Users;

class WooCommerceProductDataGenerator extends AbstractGenerator
{
    /**
     * @var WooCommerceProductDataModel[]
     */
    private $productDataModelArray;

    /**
     * WooCommerceProductDataGenerator constructor.
     *
     * @param WooCommerceProductDataModel[]
     */
    public function __construct(array $WooCommerceProductData)
    {
        $this->productDataModelArray = $WooCommerceProductData;
    }

    /**
     * generate product data from $productDataModel
     */
    public function generate()
    {
        $this->woocommerceProductDataTabs([$this, 'generateWooCommerceProductDataTabs']);
        $this->adminHead([$this, 'addWooCommerceIcons']);
        $this->woocommerceProductDataPanels([$this, 'generateWooCommerceProductDataPanels']);
        $this->woocommerceProcessProductMeta([$this, 'saveData']);
        $this->woocommerceProductTabs([$this, 'generateWooCommerceProductTabs']);
    }

    /**
     * Add a custom product tab on backend.
     */
    public function generateWooCommerceProductDataTabs($original_tabs)
    {
        foreach ($this->productDataModelArray as $productDataModel){
            $sluggedName = $productDataModel->getSluggedName();
            $original_tabs[$sluggedName] = array(
                    'label'		=> __( $productDataModel->getName(), 'woocommerce' ),
                    'target'	=> $sluggedName.'_options',
                    'priority'	=> 45,
                    'class'		=> $productDataModel->getVisibility(),
            );
        }

        return $original_tabs;
    }

    public function addWooCommerceIcons()
    {
        $style = '';

        foreach ($this->productDataModelArray as $productDataModel){
            $icon = (isset($productDataModel->getIcon()->value)) ? $productDataModel->getIcon()->value : $productDataModel->getIcon();
            $sluggedName = $productDataModel->getSluggedName();
            $style .= "#woocommerce-product-data ul.wc-tabs li.".$sluggedName."_options a:before { font-family: WooCommerce; content: '". $icon. "'; }";
        }

        ?>
        <style>
            <?php echo $style; ?>
        </style>
        <?php
    }

    /**
     * Generate product data panels (admin side)
     */
    public function generateWooCommerceProductDataPanels()
    {
        global $post;

        foreach ($this->productDataModelArray as $productDataModel){
            $sluggedName = $productDataModel->getSluggedName();
            ?>
            <div id="<?php echo $sluggedName; ?>_options" class="panel woocommerce_options_panel">
                <?php
                /** @var WooCommerceProductDataFieldModel $fieldModel */
                foreach ($productDataModel->getFields() as $fieldModel){

                    $fieldSluggedName = $sluggedName . '_' . $fieldModel->getSluggedName();
                    $field_value = metadata_exists( 'post', $post->ID, '_' .$fieldSluggedName ) ? Meta::fetch( $post->ID, MetaTypes::CUSTOM_POST_TYPE, '_' .$fieldSluggedName, true ) : $fieldModel->getDefaultValue();

                    $options = [];

                    /** @var WooCommerceProductDataFieldOptionModel $option */
                    foreach($fieldModel->getOptions() as $option){
                        $options[Translator::translateString($option->getValue())] = Translator::translateString($option->getLabel());
                    }

                    switch ($fieldModel->getType()){

                        case WooCommerceProductDataFieldModel::EMAIL_TYPE:
                        case WooCommerceProductDataFieldModel::TEXT_TYPE:
                        case WooCommerceProductDataFieldModel::PHONE_TYPE:
                        case WooCommerceProductDataFieldModel::NUMBER_TYPE:
                        case WooCommerceProductDataFieldModel::URL_TYPE:
                        case WooCommerceProductDataFieldModel::COLOR_TYPE:
                        case WooCommerceProductDataFieldModel::DATE_TYPE:
                        case WooCommerceProductDataFieldModel::DATE_TIME_TYPE:

                            $type = $this->getTextInputType($fieldModel->getType());

                            woocommerce_wp_text_input( [
                                'id' => $fieldSluggedName,
                                'name' => $fieldSluggedName,
                                'type' => $type,
                                'value' => $field_value,
                                'label' => __($fieldModel->getName(), 'woocommerce'),
                                'description' => __($fieldModel->getDescription(), 'woocommerce'),
                                'desc_tip' => true,
                            ] );
                            break;

                        case WooCommerceProductDataFieldModel::TEXTAREA_TYPE:
                            woocommerce_wp_textarea_input( [
                                'id' => $fieldSluggedName,
                                'name' => $fieldSluggedName,
                                'value' => $field_value,
                                'label' => __($fieldModel->getName(), 'woocommerce'),
                                'description' => __($fieldModel->getDescription(), 'woocommerce'),
                                'desc_tip' => true,
                            ] );
                            break;

                        case WooCommerceProductDataFieldModel::SELECT_TYPE:
                            woocommerce_wp_select( [
                                'id' => $fieldSluggedName,
                                'name' => $fieldSluggedName,
                                'value' => $field_value,
                                'label' => __($fieldModel->getName(), 'woocommerce'),
                                'description' => __($fieldModel->getDescription(), 'woocommerce'),
                                'options' => $options,
                                'desc_tip' => true,
                            ] );
                            break;

	                    case WooCommerceProductDataFieldModel::SELECT_MULTI_TYPE:
		                    woocommerce_wp_select( [
			                    'id' => $fieldSluggedName,
			                    'name' => $fieldSluggedName.'[]',
			                    'value' => $field_value,
			                    'label' => __($fieldModel->getName(), 'woocommerce'),
			                    'description' => __($fieldModel->getDescription(), 'woocommerce'),
			                    'options' => $options,
			                    'desc_tip' => true,
			                    'class' => 'wc-enhanced-select',
			                    'custom_attributes' => array('multiple' => 'multiple')
                            ] );
		                    break;

                        case WooCommerceProductDataFieldModel::RADIO_TYPE:
                            woocommerce_wp_radio( [
                                'id' => $fieldSluggedName,
                                'name' => $fieldSluggedName,
                                'value' => $field_value,
                                'label' => __($fieldModel->getName(), 'woocommerce'),
                                'description' => __($fieldModel->getDescription(), 'woocommerce'),
                                'options' => $options,
                                'desc_tip' => true,
                            ] );
                            break;

                        case WooCommerceProductDataFieldModel::CHECKBOX_TYPE:
                            woocommerce_wp_checkbox( [
                                'id' => $fieldSluggedName,
                                'name' => $fieldSluggedName,
                                'value' => $field_value,
                                'label' => __($fieldModel->getName(), 'woocommerce'),
                                'description' => __($fieldModel->getDescription(), 'woocommerce'),
                                'desc_tip' => true,
                            ] );
                            break;

	                    case WooCommerceProductDataFieldModel::POST_OBJECT_TYPE:
		                    woocommerce_wp_select( [
			                    'id' => $fieldSluggedName,
			                    'name' => $fieldSluggedName,
			                    'value' => $field_value,
			                    'label' => __($fieldModel->getName(), 'woocommerce'),
			                    'description' => __($fieldModel->getDescription(), 'woocommerce'),
			                    'options' => $this->getPostList(),
			                    'desc_tip' => true,
		                    ] );
		                    break;

	                    case WooCommerceProductDataFieldModel::POST_OBJECT_MULTI_TYPE:
		                    woocommerce_wp_select( [
			                    'id' => $fieldSluggedName,
			                    'name' => $fieldSluggedName.'[]',
			                    'value' => $field_value,
			                    'label' => __($fieldModel->getName(), 'woocommerce'),
			                    'description' => __($fieldModel->getDescription(), 'woocommerce'),
			                    'options' => $this->getPostList(),
			                    'desc_tip' => true,
			                    'class' => 'wc-enhanced-select',
			                    'custom_attributes' => array('multiple' => 'multiple')
		                    ] );
		                    break;

	                    case WooCommerceProductDataFieldModel::TERM_OBJECT_TYPE:
		                    woocommerce_wp_select( [
			                    'id' => $fieldSluggedName,
			                    'name' => $fieldSluggedName,
			                    'value' => $field_value,
			                    'label' => __($fieldModel->getName(), 'woocommerce'),
			                    'description' => __($fieldModel->getDescription(), 'woocommerce'),
			                    'options' => $this->getTermsList(),
			                    'desc_tip' => true,
		                    ] );
		                    break;

	                    case WooCommerceProductDataFieldModel::TERM_OBJECT_MULTI_TYPE:
		                    woocommerce_wp_select( [
			                    'id' => $fieldSluggedName,
			                    'name' => $fieldSluggedName.'[]',
			                    'value' => $field_value,
			                    'label' => __($fieldModel->getName(), 'woocommerce'),
			                    'description' => __($fieldModel->getDescription(), 'woocommerce'),
			                    'options' => $this->getTermsList(),
			                    'desc_tip' => true,
			                    'class' => 'wc-enhanced-select',
			                    'custom_attributes' => array('multiple' => 'multiple')
		                    ] );
		                    break;

	                    case WooCommerceProductDataFieldModel::USER_TYPE:
		                    woocommerce_wp_select( [
			                    'id' => $fieldSluggedName,
			                    'name' => $fieldSluggedName,
			                    'value' => $field_value,
			                    'label' => __($fieldModel->getName(), 'woocommerce'),
			                    'description' => __($fieldModel->getDescription(), 'woocommerce'),
			                    'options' => $this->getUserList(),
			                    'desc_tip' => true,
		                    ] );
		                    break;

	                    case WooCommerceProductDataFieldModel::USER_MULTI_TYPE:
		                    woocommerce_wp_select( [
			                    'id' => $fieldSluggedName,
			                    'name' => $fieldSluggedName.'[]',
			                    'value' => $field_value,
			                    'label' => __($fieldModel->getName(), 'woocommerce'),
			                    'description' => __($fieldModel->getDescription(), 'woocommerce'),
			                    'options' => $this->getUserList(),
			                    'desc_tip' => true,
			                    'class' => 'wc-enhanced-select',
			                    'custom_attributes' => array('multiple' => 'multiple')
		                    ] );
		                    break;
                    }
                }
                ?>
            </div>
            <?php
        }
    }

    /**
     * @param $type
     * @return string
     */
    private function getTextInputType($type)
    {
        switch ($type){
            case WooCommerceProductDataFieldModel::EMAIL_TYPE:
                return 'email';

            case WooCommerceProductDataFieldModel::PHONE_TYPE:
                return 'tel';

            case WooCommerceProductDataFieldModel::NUMBER_TYPE:
                return 'number';

            case WooCommerceProductDataFieldModel::URL_TYPE:
                return 'url';

            case WooCommerceProductDataFieldModel::COLOR_TYPE:
                return 'color';

            case WooCommerceProductDataFieldModel::DATE_TYPE:
                return 'date';

            case WooCommerceProductDataFieldModel::DATE_TIME_TYPE:
                return 'datetime-local';

            default:
            case WooCommerceProductDataFieldModel::TEXT_TYPE:
                return 'text';
        }
    }

	/**
	 * @return array
	 */
    private function getPostList()
    {
        $items = [];
        $posts = Posts::getList([]);

	    foreach($posts as $element){
		    foreach ($element['posts'] as $id => $post){
			    $items[$id] = $element['postType'] . ' - ' . $post;
		    }
	    }

    	return $items;
    }

	/**
	 * @return array
	 */
	private function getTermsList()
	{
		$items = [];
		$posts = Terms::getList([]);

		foreach($posts as $element){
			foreach ($element['terms'] as $id => $term){
				$items[$id] = $element['taxonomy'] . ' - ' . $term;
			}
		}

		return $items;
	}

	/**
	 * @return array
	 */
	private function getUserList()
	{
		$items = [];

		foreach(Users::getList() as $id => $user){
			$items[$id] = $user;
		}

		return $items;
	}

    /**
     * Save data
     * 
     * @param $post_id
     */
    public function saveData($post_id)
    {
        $product = wc_get_product( $post_id );

        foreach ($this->productDataModelArray as $productDataModel){
            foreach ($productDataModel->getFields() as $fieldModel){
                $sluggedName = $productDataModel->getSluggedName();
                $fieldSluggedName = $sluggedName . '_' . $fieldModel->getSluggedName();

                $fieldValue = isset($_POST[$fieldSluggedName]) && !empty($_POST[$fieldSluggedName]) ? $this->sanitizeData($_POST[$fieldSluggedName]) : '';
                $product->update_meta_data('_'.$fieldSluggedName, $fieldValue );
            }
        }

        $product->save();
    }

	/**
	 * @param $data
	 *
	 * @return array|string
	 */
    private function sanitizeData($data)
    {
        if(is_array($data)){
            $sanitized = [];

            foreach ($data as $datum){
	            $sanitized[] = sanitize_text_field($datum);
            }

            return $sanitized;
        }

        return sanitize_text_field($data);
    }

    /**
     * Add product data tab on theme UI
     */
    public function generateWooCommerceProductTabs()
    {
        $tabs = [];

        // Adds the new tab
        foreach ($this->productDataModelArray as $productDataModel){
            $tabs[$productDataModel->getSluggedName().'_tab'] = array(
                'title' 	=> __( $productDataModel->getName(), 'woocommerce' ),
                'priority' 	=> 50,
                'callback' 	=> [$this, 'generateWooCommerceProductTabsContent']
            );
        }

        return $tabs;
    }

    /**
     * Display the content inside the tab in the theme UI
     */
    public function generateWooCommerceProductTabsContent($activeTab) {

        global $post;

        foreach ($this->productDataModelArray as $productDataModel){

            $fields = [];

            foreach ($productDataModel->getFields() as $fieldModel){
                $sluggedName = $productDataModel->getSluggedName();
                $fieldSluggedName = $sluggedName . '_' . $fieldModel->getSluggedName();
                $fields[$fieldModel->getName()] = metadata_exists( 'post', $post->ID, '_'.$fieldSluggedName ) ? Meta::fetch( $post->ID, MetaTypes::CUSTOM_POST_TYPE, '_'.$fieldSluggedName, true ) : '';
            }

            if($activeTab  === $productDataModel->getSluggedName().'_tab'){
                echo '<h2>'.$productDataModel->getName().'</h2>';

                if(count($fields) > 0){
                    echo '<table class="woocommerce_product_data_table">';
                }

                foreach ($fields as $label => $field){
                    if($field and $field !== ''){

                        $field = (is_array($field)) ? (implode(", ", $field)) : $field;

                        echo '<tr>';
                        echo '<th align="left">'.$label.'</th>';
                        echo '<td>'.$field.'</td>';
                        echo '</tr>';
                    }
                }

                if(count($fields) > 0){
                    echo '</table>';
                }
            }
        }
    }
}