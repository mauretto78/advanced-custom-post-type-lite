<?php

namespace ACPT_Lite\Core\Generators;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Models\Meta\MetaBoxModel;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Utils\PHP\Url;
use ACPT_Lite\Utils\Wordpress\Posts;
use ACPT_Lite\Utils\Wordpress\Terms;
use ACPT_Lite\Utils\Wordpress\Translator;
use ACPT_Lite\Utils\Wordpress\Users;

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
    public const NONCE_FIELD_NAME = 'acpt_nonce';

    /**
     * Helper method, that attaches a passed function to the 'init' WP action
     * @param callable $cb callback function.
     */
    protected function init(callable $cb): void
    {
        add_action("init", $cb);
    }

    /**
     * @param callable $cb
     */
    protected function postTypeLink(callable $cb): void
    {
        add_filter("post_type_link", $cb, 10, 2);
    }

    /**
     * Helper method, that attaches a passed function to the 'admin_init' WP action
     * @param callable $cb callback function.
     */
    protected function adminInit(callable $cb): void
    {
        add_action("admin_init", $cb);
    }

    /**
     * @param callable $cb
     */
    protected function woocommerceProductDataTabs(callable $cb): void
    {
        add_filter('woocommerce_product_data_tabs', $cb);
    }

    /**
     * @param callable $cb
     */
    protected function woocommerceProductDataPanels(callable $cb): void
    {
        add_filter('woocommerce_product_data_panels', $cb);
    }

    /**
     * @param callable $cb
     */
    protected function woocommerceProcessProductMeta(callable $cb): void
    {
        add_filter('woocommerce_process_product_meta', $cb);
    }

    /**
     * @param callable $cb
     */
    protected function woocommerceProductTabs(callable $cb): void
    {
        add_filter('woocommerce_product_tabs', $cb);
    }

    /**
     * @param callable $cb
     */
    protected function adminHead(callable $cb): void
    {
        add_action('admin_head', $cb);
    }

    /**
     * Enqueue JS scripts
     *
     * @param string $action
     */
    public function enqueueScripts(string $action): void
    {
        $pagenow = Url::pagenow();

        $belongsTo = null;
        $elementId = null;

        switch ($pagenow) {
            case "profile.php":
                if (function_exists('wp_get_current_user')) {
                    $elementId = wp_get_current_user()->ID;
                }
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

        // validation rules and conditional rendering are not part of ACPT Lite
    }

    /**
     * This method is used by CPT and Comment meta field generators
     *
     * @param MetaFieldModel $fieldModel
     *
     * @return array<string, mixed>
     */
    protected function generateMetaBoxFieldArray(MetaFieldModel $fieldModel): array
    {
        $options = [];

        foreach ($fieldModel->getOptions() as $optionModel) {
            $options[] = [
                'label' => $optionModel->getLabel(),
                'value' => $optionModel->getValue(),
            ];
        }

        $relations = [];
        $children = [];

        $advancedOptions = [];

        foreach ($fieldModel->getAdvancedOptions() as $advancedOptionModel) {
            if ($advancedOptionModel->isPlaceholder()) {
                continue;
            }

            $advancedOptions[] = [
                'key' => $advancedOptionModel->getKey(),
                'value' => $advancedOptionModel->getValue(),
            ];
        }

        $validationRules = [];

        foreach ($fieldModel->getValidationRules() as $validationRuleModel) {
            $validationRules[] = [
                'condition' => $validationRuleModel->getCondition(),
                'value' => $validationRuleModel->getValue(),
            ];
        }

        $blocks = [];

        foreach ($fieldModel->getBlocks() as $blockModel) {
            $nestedFields = [];

            foreach ($blockModel->getFields() as $nestedFieldModel) {
                $nestedFields[] = $this->generateMetaBoxFieldArray($nestedFieldModel);
            }

            $blocks[] = [
                'id' => $blockModel->getId(),
                'name' => $blockModel->getName(),
                'label' => $blockModel->getLabel(),
                'fields' => $nestedFields
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
            'relations' => $relations,
            'children' => $children,
            'advancedOptions' => $advancedOptions,
            'validationRules' => $validationRules,
            'blocks' => $blocks,
        ];
    }

    /**
     * This method is used to generate quick edit fields
     *
     * @param string $key
     * @param string $label
     * @param mixed $value
     * @param MetaFieldModel $metaBoxFieldModel
     *
     * @return string
     */
    protected static function generateQuickEditField(string $key, string $label, $value, MetaFieldModel $metaBoxFieldModel): string
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

        switch ($metaBoxFieldModel->getType()) {
            // DATE_TYPE
            case MetaFieldModel::DATE_TYPE:
                $return .= '<input type="date" name="'. $key. '" data-acpt-column="column-'. $key. '" class="" value="'. $value.'">';
                break;

                // EMAIL_TYPE
            case MetaFieldModel::EMAIL_TYPE:
                $return .= '<input type="email" name="'. $key. '" data-acpt-column="column-'. $key. '" class="" value="'. $value.'">';
                break;

                // SELECT_TYPE
                // SELECT_MULTI_TYPE
            case MetaFieldModel::SELECT_TYPE:
                if ($metaBoxFieldModel->getType() === MetaFieldModel::SELECT_TYPE) {
                    $fieldName = $key;
                } else {
                    $fieldName = $key."[]";
                }
                $multiple = '';
                $style = '';
                $select = '<select name="'. $fieldName. '" data-acpt-column="column-'. $key. '" class="" '.$multiple.' style="'.$style.'">';
                if (!$multiple) {
                    $select .= '<option value="">'.Translator::translate("--Select--").'</option>';
                }
                $selected = '';
                foreach ($metaBoxFieldModel->getOptions() as $option) {
                    if ($metaBoxFieldModel->getType() === MetaFieldModel::SELECT_TYPE) {
                        $selected = selected($value, $option->getValue(), false);
                    } else {
                        if (is_array($value)) {
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
                $return .= '<textarea name="'. $key. '" data-acpt-column="column-'. $key. '" class="" rows="5">'. $value.'</textarea>';
                break;

            default:
                if (!is_string($value)) {
                    $value = null;
                }

                $return .= '<input type="text" name="'. $key .'" data-acpt-column="column-'. $key.'" class="" value="'. $value .'">';
        }

        $return .= '</span>';
        $return .= '</label>';
        $return .= '</div>';
        $return .= '</fieldset>';

        return $return;
    }

    /**
     * @param MetaFieldModel $fieldModel
     *
     * @return array<mixed>
     */
    private static function postTypeList(MetaFieldModel $fieldModel): array
    {
        $postQuery = [];

        if ($fieldModel->getAdvancedOption('filter_post_type')) {
            $postQuery['post_type'] = $fieldModel->getAdvancedOption('filter_post_type');
        }

        if ($fieldModel->getAdvancedOption('filter_post_status')) {
            $postQuery['post_status'] = $fieldModel->getAdvancedOption('filter_post_status');
        }

        if ($fieldModel->getAdvancedOption('filter_taxonomy')) {
            $postQuery['taxonomy'] = $fieldModel->getAdvancedOption('filter_taxonomy');
        }

        return Posts::getList($postQuery);
    }

    /**
     * @param MetaFieldModel $fieldModel
     *
     * @return array<mixed>
     */
    private static function termList(MetaFieldModel $fieldModel): array
    {
        $termQuery = [];

        if ($fieldModel->getAdvancedOption('filter_taxonomy')) {
            $termQuery['taxonomy'] = $fieldModel->getAdvancedOption('filter_taxonomy');
        }

        return Terms::getList($termQuery);
    }

    /**
     * @param MetaFieldModel $fieldModel
     *
     * @return array<mixed>
     */
    private static function userList(MetaFieldModel $fieldModel): array
    {
        $userQuery = [];

        if ($fieldModel->getAdvancedOption('filter_role')) {
            $userQuery['role'] = $fieldModel->getAdvancedOption('filter_role');
        }

        return Users::getList($userQuery);
    }

    /**
     * @param string $postTypeName
     * @return string
     */
    protected function getPostTypeName(string $postTypeName): string
    {
        try {
            return apply_filters("modify_post_type_name", $postTypeName);
        } catch (\Exception $exception) {
            do_action("acpt/error", $exception);

            return $postTypeName;
        }
    }

    /**
     * @param MetaBoxModel $metaBoxModel
     * @return string
     */
    protected function metaBoxEditLinkButton(MetaBoxModel $metaBoxModel): string
    {
        // check admin permission
        if (!current_user_can('manage_options')) {
            return "";
        }

        $url = $this->generateEditMetaBoxLink($metaBoxModel);

        return "<a class='acpt-edit-field-group' target='_blank' href='".$url."'>".Translator::translate("Edit meta box")."</a>";
    }

    /**
     * Same as metaBoxEditLinkButton(), but tolerates a null box — the tab-display
     * generators resolve the "active" box via getBoxById(...) ?? getBoxes()[0],
     * both of which can be null (no/stale active-tab cookie, or a group with zero
     * boxes) — render nothing instead of fataling on the non-nullable param above.
     *
     * @param MetaBoxModel|null $metaBoxModel
     * @return string
     */
    protected function metaBoxEditLinkButtonOrEmpty(?MetaBoxModel $metaBoxModel): string
    {
        return $metaBoxModel !== null ? $this->metaBoxEditLinkButton($metaBoxModel) : '';
    }

    /**
     * @param MetaBoxModel $metaBoxModel
     * @return string
     */
    protected function metaBoxLabel(MetaBoxModel $metaBoxModel): string
    {
        return (!empty($metaBoxModel->getLabel())) ? $metaBoxModel->getLabel() : $metaBoxModel->getName();
    }

    /**
     * Returns a hidden element containing the edit URL for the meta box.
     * JS will pick this up and inject the edit button into the appropriate header.
     *
     * @param MetaBoxModel $metaBoxModel
     * @return string
     */
    protected function metaBoxEditButtonPlaceholder(MetaBoxModel $metaBoxModel): string
    {
        if (!current_user_can('manage_options')) {
            return "";
        }

        $url = $this->generateEditMetaBoxLink($metaBoxModel);
        $label = Translator::translate("Edit meta box");

        return "<span class='acpt-edit-button-placeholder' data-acpt-edit-url='".$url."' data-acpt-edit-label='".$label."' style='display:none;'></span>";
    }

    /**
     * @param MetaBoxModel $metaBoxModel
     * @return string
     */
    protected function metaBoxHeading(MetaBoxModel $metaBoxModel): string
    {
        $boxLabel = "<div class='acpt-heading-wrapper'>";
        $boxLabel .= "<span class='acpt-heading-text'>";
        $boxLabel .= $this->metaBoxLabel($metaBoxModel);
        $boxLabel .= "</span>";
        $boxLabel .= $this->metaBoxEditLinkButton($metaBoxModel);
        $boxLabel .= "</div>";

        return $boxLabel;
    }

    /**
        * Generates an admin URL link for editing a meta box based on its group association.
     *
     * @param MetaBoxModel $metaBoxModel The model representing the meta box.
     * @return string The generated admin URL link.
     */
    private function generateEditMetaBoxLink(MetaBoxModel $metaBoxModel): string
    {
        return admin_url('admin.php?page='.ACPT_LITE_PLUGIN_NAME.'#/edit_meta/'.$metaBoxModel->getGroup()->getId().'#'.$metaBoxModel->getId());
    }
}
