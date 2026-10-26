<?php

namespace ACPT_Lite\Core\Generators\Meta;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Generators\AbstractGenerator;
use ACPT_Lite\Core\Models\WooCommerce\WooCommerceProductDataFieldModel;
use ACPT_Lite\Core\Models\WooCommerce\WooCommerceProductDataFieldOptionModel;
use ACPT_Lite\Core\Models\WooCommerce\WooCommerceProductDataModel;
use ACPT_Lite\Utils\Data\Meta;
use ACPT_Lite\Utils\PHP\Arrays;
use ACPT_Lite\Utils\PHP\Request;
use ACPT_Lite\Utils\Wordpress\Posts;
use ACPT_Lite\Utils\Wordpress\Terms;
use ACPT_Lite\Utils\Wordpress\Translator;
use ACPT_Lite\Utils\Wordpress\Users;

class WooCommerceProductDataGenerator extends AbstractGenerator
{
    /**
     * @var WooCommerceProductDataModel[]
     */
    private array $productDataModelArray = [];

    /**
     * @var Request
     */
    private Request $request;

    /**
     * WooCommerceProductDataGenerator constructor.
     *
     * @param Request $request
     * @param WooCommerceProductDataModel[] $WooCommerceProductData
     */
    public function __construct(Request $request, array $WooCommerceProductData)
    {
        $this->productDataModelArray = $WooCommerceProductData;
        $this->request = $request;
    }

    /**
     * generate product data from $productDataModel
     *
     * @return void
     */
    public function generate(): void
    {
        $this->woocommerceProductDataTabs([$this, 'generateWooCommerceProductDataTabs']);
        $this->adminHead([$this, 'addWooCommerceIcons']);
        $this->woocommerceProductDataPanels([$this, 'generateWooCommerceProductDataPanels']);
        $this->woocommerceProcessProductMeta([$this, 'saveData']);
        $this->woocommerceProductTabs([$this, 'generateWooCommerceProductTabs']);
    }

    /**
     * Add a custom product tab on backend.
     *
     * @param array<string, mixed> $original_tabs
     *
     * @return array<string, mixed>
     */
    public function generateWooCommerceProductDataTabs(array $original_tabs = []): array
    {
        foreach ($this->productDataModelArray as $productDataModel) {
            $sluggedName = $productDataModel->getSluggedName();
            $original_tabs[$sluggedName] = array(
                    'label'		=> __($productDataModel->getName(), 'woocommerce'),
                    'target'	=> $sluggedName.'_options',
                    'priority'	=> 45,
                    'class'		=> $productDataModel->getVisibility(),
            );
        }

        return $original_tabs;
    }

    /**
     * Generates and outputs CSS rules for adding WooCommerce tab icons
     * based on the product data models.
     *
     * @return void
     */
    public function addWooCommerceIcons(): void
    {
        $style = '';

        foreach ($this->productDataModelArray as $productDataModel) {
            $iconObj = $productDataModel->getIcon();
            $icon = $iconObj['value'] ?? '';
            $sluggedName = $productDataModel->getSluggedName();
            $style .= "#woocommerce-product-data ul.wc-tabs li.".$sluggedName."_options a:before { font-family: WooCommerce; content: '". $icon. "'; }";
        } ?>
        <style>
            <?php echo $style; ?>
        </style>
        <?php
    }

    /**
     * Generate product data panels (admin side)
     *
     * @return void
     */
    public function generateWooCommerceProductDataPanels(): void
    {
        global $post;

        foreach ($this->productDataModelArray as $productDataModel) {
            $sluggedName = $productDataModel->getSluggedName(); ?>
            <div id="<?php echo $sluggedName; ?>_options" class="panel woocommerce_options_panel">
                <?php
                foreach ($productDataModel->getFields() as $fieldModel) {
                    $fieldSluggedName = $sluggedName . '_' . $fieldModel->getSluggedName();
                    $field_value = metadata_exists('post', $post->ID, '_' .$fieldSluggedName) ? Meta::fetch($post->ID, MetaTypes::CUSTOM_POST_TYPE, '_' .$fieldSluggedName, true) : $fieldModel->getDefaultValue();

                    $options = [];

                    foreach ($fieldModel->getOptions() as $option) {
                        $options[Translator::translateString($option->getValue())] = Translator::translateString($option->getLabel());
                    }

                    switch ($fieldModel->getType()) {

                        case WooCommerceProductDataFieldModel::EMAIL_TYPE:
                        case WooCommerceProductDataFieldModel::TEXT_TYPE:
                        case WooCommerceProductDataFieldModel::PHONE_TYPE:
                        case WooCommerceProductDataFieldModel::NUMBER_TYPE:
                        case WooCommerceProductDataFieldModel::URL_TYPE:
                        case WooCommerceProductDataFieldModel::COLOR_TYPE:
                        case WooCommerceProductDataFieldModel::DATE_TYPE:
                        case WooCommerceProductDataFieldModel::DATE_TIME_TYPE:

                            $type = $this->getTextInputType($fieldModel->getType());

                            if (!function_exists("woocommerce_wp_text_input")) {
                                return;
                            }

                            woocommerce_wp_text_input([
                                'id' => $fieldSluggedName,
                                'name' => $fieldSluggedName,
                                'type' => $type,
                                'value' => $field_value,
                                'label' => __($fieldModel->getName(), 'woocommerce'),
                                'description' => __($fieldModel->getDescription(), 'woocommerce'),
                                'desc_tip' => true,
                            ]);
                            break;

                        case WooCommerceProductDataFieldModel::TEXTAREA_TYPE:

                            if (!function_exists("woocommerce_wp_textarea_input")) {
                                return;
                            }

                            woocommerce_wp_textarea_input([
                                'id' => $fieldSluggedName,
                                'name' => $fieldSluggedName,
                                'value' => $field_value,
                                'label' => __($fieldModel->getName(), 'woocommerce'),
                                'description' => __($fieldModel->getDescription(), 'woocommerce'),
                                'desc_tip' => true,
                            ]);
                            break;

                        case WooCommerceProductDataFieldModel::SELECT_TYPE:

                            if (!function_exists("woocommerce_wp_select")) {
                                return;
                            }

                            woocommerce_wp_select([
                                'id' => $fieldSluggedName,
                                'name' => $fieldSluggedName,
                                'value' => $field_value,
                                'label' => __($fieldModel->getName(), 'woocommerce'),
                                'description' => __($fieldModel->getDescription(), 'woocommerce'),
                                'options' => $options,
                                'desc_tip' => true,
                            ]);
                            break;

                        case WooCommerceProductDataFieldModel::SELECT_MULTI_TYPE:

                            if (!function_exists("woocommerce_wp_select")) {
                                return;
                            }

                            woocommerce_wp_select([
                                'id' => $fieldSluggedName,
                                'name' => $fieldSluggedName.'[]',
                                'value' => $field_value,
                                'label' => __($fieldModel->getName(), 'woocommerce'),
                                'description' => __($fieldModel->getDescription(), 'woocommerce'),
                                'options' => $options,
                                'desc_tip' => true,
                                'class' => 'wc-enhanced-select',
                                'custom_attributes' => array('multiple' => 'multiple')
                            ]);
                            break;

                        case WooCommerceProductDataFieldModel::RADIO_TYPE:

                            if (!function_exists("woocommerce_wp_radio")) {
                                return;
                            }

                            woocommerce_wp_radio([
                                'id' => $fieldSluggedName,
                                'name' => $fieldSluggedName,
                                'value' => $field_value,
                                'label' => __($fieldModel->getName(), 'woocommerce'),
                                'description' => __($fieldModel->getDescription(), 'woocommerce'),
                                'options' => $options,
                                'desc_tip' => true,
                            ]);
                            break;

                        case WooCommerceProductDataFieldModel::CHECKBOX_TYPE:

                            if (!function_exists("woocommerce_wp_checkbox")) {
                                return;
                            }

                            woocommerce_wp_checkbox([
                                'id' => $fieldSluggedName,
                                'name' => $fieldSluggedName,
                                'value' => $field_value,
                                'label' => __($fieldModel->getName(), 'woocommerce'),
                                'description' => __($fieldModel->getDescription(), 'woocommerce'),
                                'desc_tip' => true,
                            ]);
                            break;

                        case WooCommerceProductDataFieldModel::POST_OBJECT_TYPE:

                            if (!function_exists("woocommerce_wp_select")) {
                                return;
                            }

                            woocommerce_wp_select([
                                'id' => $fieldSluggedName,
                                'name' => $fieldSluggedName,
                                'value' => $field_value,
                                'label' => __($fieldModel->getName(), 'woocommerce'),
                                'description' => __($fieldModel->getDescription(), 'woocommerce'),
                                'options' => $this->getPostList(),
                                'desc_tip' => true,
                            ]);
                            break;

                        case WooCommerceProductDataFieldModel::POST_OBJECT_MULTI_TYPE:

                            if (!function_exists("woocommerce_wp_select")) {
                                return;
                            }

                            woocommerce_wp_select([
                                'id' => $fieldSluggedName,
                                'name' => $fieldSluggedName.'[]',
                                'value' => $field_value,
                                'label' => __($fieldModel->getName(), 'woocommerce'),
                                'description' => __($fieldModel->getDescription(), 'woocommerce'),
                                'options' => $this->getPostList(),
                                'desc_tip' => true,
                                'class' => 'wc-enhanced-select',
                                'custom_attributes' => array('multiple' => 'multiple')
                            ]);
                            break;

                        case WooCommerceProductDataFieldModel::TERM_OBJECT_TYPE:

                            if (!function_exists("woocommerce_wp_select")) {
                                return;
                            }

                            woocommerce_wp_select([
                                'id' => $fieldSluggedName,
                                'name' => $fieldSluggedName,
                                'value' => $field_value,
                                'label' => __($fieldModel->getName(), 'woocommerce'),
                                'description' => __($fieldModel->getDescription(), 'woocommerce'),
                                'options' => $this->getTermsList(),
                                'desc_tip' => true,
                            ]);
                            break;

                        case WooCommerceProductDataFieldModel::TERM_OBJECT_MULTI_TYPE:

                            if (!function_exists("woocommerce_wp_select")) {
                                return;
                            }

                            woocommerce_wp_select([
                                'id' => $fieldSluggedName,
                                'name' => $fieldSluggedName.'[]',
                                'value' => $field_value,
                                'label' => __($fieldModel->getName(), 'woocommerce'),
                                'description' => __($fieldModel->getDescription(), 'woocommerce'),
                                'options' => $this->getTermsList(),
                                'desc_tip' => true,
                                'class' => 'wc-enhanced-select',
                                'custom_attributes' => array('multiple' => 'multiple')
                            ]);
                            break;

                        case WooCommerceProductDataFieldModel::USER_TYPE:

                            if (!function_exists("woocommerce_wp_select")) {
                                return;
                            }

                            woocommerce_wp_select([
                                'id' => $fieldSluggedName,
                                'name' => $fieldSluggedName,
                                'value' => $field_value,
                                'label' => __($fieldModel->getName(), 'woocommerce'),
                                'description' => __($fieldModel->getDescription(), 'woocommerce'),
                                'options' => $this->getUserList(),
                                'desc_tip' => true,
                            ]);
                            break;

                        case WooCommerceProductDataFieldModel::USER_MULTI_TYPE:

                            if (!function_exists("woocommerce_wp_select")) {
                                return;
                            }

                            woocommerce_wp_select([
                                'id' => $fieldSluggedName,
                                'name' => $fieldSluggedName.'[]',
                                'value' => $field_value,
                                'label' => __($fieldModel->getName(), 'woocommerce'),
                                'description' => __($fieldModel->getDescription(), 'woocommerce'),
                                'options' => $this->getUserList(),
                                'desc_tip' => true,
                                'class' => 'wc-enhanced-select',
                                'custom_attributes' => array('multiple' => 'multiple')
                            ]);
                            break;
                    }
                } ?>
            </div>
            <?php
        }
    }

    /**
     * @param string $type
     * @return string
     */
    private function getTextInputType(string $type): string
    {
        switch ($type) {
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
     * @return array<string, mixed>
     */
    private function getPostList(): array
    {
        $items = [];
        $posts = Posts::getList([]);

        foreach ($posts as $element) {
            foreach ($element['posts'] as $id => $post) {
                $items[(string)$id] = $element['postType'] . ' - ' . $post;
            }
        }

        return $items;
    }

    /**
     * @return array<string, mixed>
     */
    private function getTermsList(): array
    {
        $items = [];
        $posts = Terms::getList([]);

        foreach ($posts as $element) {
            foreach ($element['terms'] as $id => $term) {
                $items[$id] = $element['taxonomy'] . ' - ' . $term;
            }
        }

        return $items;
    }

    /**
     * @return array<int, string>
     */
    private function getUserList(): array
    {
        $items = [];

        foreach (Users::getList() as $id => $user) {
            $items[$id] = $user;
        }

        return $items;
    }

    /**
     * Save data
     *
     * @param int $post_id
     *
     * @return void
     */
    public function saveData(int $post_id): void
    {
        if (!function_exists("wc_get_product")) {
            return;
        }

        $product = wc_get_product($post_id);

        foreach ($this->productDataModelArray as $productDataModel) {
            foreach ($productDataModel->getFields() as $fieldModel) {
                $sluggedName = $productDataModel->getSluggedName();
                $fieldSluggedName = $sluggedName . '_' . $fieldModel->getSluggedName();

                $fieldValue = !empty($this->request->post($fieldSluggedName)) ? $this->sanitizeData($this->request->post($fieldSluggedName)) : '';
                $product->update_meta_data('_'.$fieldSluggedName, $fieldValue);
            }
        }

        $product->save();
    }

    /**
     * @param array<int|string, mixed>|string $data
     *
     * @return array<string>|string
     */
    private function sanitizeData($data)
    {
        if (is_array($data)) {
            $sanitized = [];

            foreach ($data as $datum) {
                $sanitized[] = sanitize_text_field($datum);
            }

            return $sanitized;
        }

        return sanitize_text_field($data);
    }

    /**
     * Add product data tab on theme UI
     *
     * @return array<string, mixed>
     */
    public function generateWooCommerceProductTabs(): array
    {
        $tabs = [];

        // Adds the new tab
        foreach ($this->productDataModelArray as $productDataModel) {
            $tabs[$productDataModel->getSluggedName().'_tab'] = array(
                'title' 	=> __($productDataModel->getName(), 'woocommerce'),
                'priority' 	=> 50,
                'callback' 	=> [$this, 'generateWooCommerceProductTabsContent']
            );
        }

        return $tabs;
    }

    /**
     * Display the content inside the tab in the theme UI
     *
     * @param string $activeTab
     *
     * @return void
     */
    public function generateWooCommerceProductTabsContent($activeTab): void
    {
        global $post;

        foreach ($this->productDataModelArray as $productDataModel) {
            $fields = [];

            foreach ($productDataModel->getFields() as $fieldModel) {
                $sluggedName = $productDataModel->getSluggedName();
                $fieldSluggedName = $sluggedName . '_' . $fieldModel->getSluggedName();
                $fields[$fieldModel->getName()] = metadata_exists('post', $post->ID, '_'.$fieldSluggedName) ? Meta::fetch($post->ID, MetaTypes::CUSTOM_POST_TYPE, '_'.$fieldSluggedName, true) : '';
            }

            if ($activeTab  === $productDataModel->getSluggedName().'_tab') {
                echo '<h2>'.$productDataModel->getName().'</h2>';

                if (Arrays::count($fields) > 0) {
                    echo '<table class="woocommerce_product_data_table">';
                }

                foreach ($fields as $label => $field) {
                    if ($field) {
                        $field = (is_array($field)) ? (implode(", ", $field)) : $field;

                        echo '<tr>';
                        echo '<th align="left">'.$label.'</th>';
                        echo '<td>'.$field.'</td>';
                        echo '</tr>';
                    }
                }

                if (Arrays::count($fields) > 0) {
                    echo '</table>';
                }
            }
        }
    }
}
