<?php

namespace ACPT_Lite\Core\Generators\CustomPostType;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\CQRS\Command\SaveMetaFieldValueCommand;
use ACPT_Lite\Core\Generators\AbstractGenerator;
use ACPT_Lite\Core\Helper\Id;
use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\CustomPostType\CustomPostTypeModel;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Core\Models\Meta\MetaGroupModel;
use ACPT_Lite\Core\Models\Taxonomy\TaxonomyModel;
use ACPT_Lite\Core\Repository\MetaRepository;
use ACPT_Lite\Utils\Data\Meta;
use ACPT_Lite\Utils\PHP\Arrays;
use ACPT_Lite\Utils\Wordpress\Nonce;
use ACPT_Lite\Utils\Wordpress\Translator;

class CustomPostTypeAdminColumnsGenerator extends AbstractGenerator
{
    /**
     * Add meta fields to the posts table
     *
     * @param string|CustomPostTypeModel $postTypeModel
     *
     * @throws \Exception
     *
     * @return void
     */
    public static function addColumns($postTypeModel): void
    {
        $postTypeName = ($postTypeModel instanceof CustomPostTypeModel) ? $postTypeModel->getName() : $postTypeModel;

        $manageEditAction = 'manage_edit-'.$postTypeName.'_columns';
        $manageEditSortAction = 'manage_edit-'.$postTypeName.'_sortable_columns';
        $customColumnsAction = 'manage_'.$postTypeName.'_posts_custom_column';
        $bulkActionsAction = 'bulk_actions-edit-'.$postTypeName;

        // Specific fix for Media attachments
        if ($postTypeName === "attachment") {
            $manageEditAction = "manage_media_columns";
            $customColumnsAction = "manage_media_custom_column";
        }

        $metaGroups = MetaRepository::get([
            'belongsTo' => MetaTypes::CUSTOM_POST_TYPE,
            'find' => $postTypeName,
            'clonedFields' => true
        ]);

        $idFields = [];

        foreach ($metaGroups as $metaGroup) {
            foreach ($metaGroup->getBoxes() as $metaBoxModel) {
                foreach ($metaBoxModel->getFields() as $metaBoxFieldModel) {
                }
            }
        }

        $tableGroups = [];

        // add options to bulk actions
        add_filter($bulkActionsAction, function ($bulk_actions) use ($idFields) {
            /**
             * @var string $label
             * @var MetaFieldModel $field
             */
            foreach ($idFields as $label => $field) {
                $bulk_actions[$label] = "Generate ID for ".$field->getLabel(). " field";
            }

            return $bulk_actions;
        });

        // apply bulk actions
        add_action('init', function () use ($postTypeName, $idFields) {
            /**
             * @var string $label
             * @var MetaFieldModel $field
             */
            foreach ($idFields as $label => $field) {
                if (isset($_GET['action']) && $_GET['action'] === $label && $_GET['post_type'] === $postTypeName) {
                    $postIds = $_GET['post'];
                    $paged = $_GET['paged'] ?? 1;
                    $perPage = (int)get_user_option("edit_".$postTypeName."_per_page");
                    $index = ($paged-1) * $perPage;

                    foreach ($postIds as $postId) {
                        $strategy = $field->getAdvancedOption('id_strategy') ?? Id::UUID_V1;
                        $command = new SaveMetaFieldValueCommand($field, [
                                'post_id' => $postId,
                                'box_name' => $field->getBox()->getName(),
                                'field_name' => $field->getName(),
                                'value' => Id::generate($strategy, $index),
                        ]);

                        $command->execute();
                        $index++;
                    }
                }
            }
        });

        // add columns to show
        add_filter($manageEditAction, function ($columns) use ($metaGroups, $tableGroups) {
            // meta fields
            foreach ($metaGroups as $metaGroup) {
                foreach ($metaGroup->getBoxes() as $metaBoxModel) {
                    foreach ($metaBoxModel->getFields() as $metaBoxFieldModel) {
                        if ($metaBoxFieldModel->isShowInArchive()) {
                            $key = Strings::toDBFormat($metaBoxModel->getName()).'_'.Strings::toDBFormat($metaBoxFieldModel->getName());
                            $value = Strings::toHumanReadableFormat($metaBoxFieldModel->getName());
                            $columns[$key] = $value;
                        }
                    }
                }
            }

            return $columns;
        });

        // display value on columns to show
        add_action($customColumnsAction, function ($name) use ($metaGroups, $tableGroups) {
            global $post;

            foreach ($metaGroups as $metaGroup) {
                foreach ($metaGroup->getBoxes() as $metaBoxModel) {
                    foreach ($metaBoxModel->getFields() as $metaBoxFieldModel) {
                        if ($metaBoxFieldModel->isShowInArchive()) {
                            $boxName = Strings::toDBFormat($metaBoxModel->getName());
                            $fieldName  = Strings::toDBFormat($metaBoxFieldModel->getName());
                            $key = $boxName.'_'.$fieldName;

                            if ($key === $name) {
                                echo do_shortcode('[acpt admin_view="true" preview="true" pid="'.$post->ID.'" box="'.Strings::esc_attr($boxName).'" field="'.Strings::esc_attr($fieldName).'"]');
                            }
                        }
                    }
                }
            }

        });

        // add sortable columns
        add_filter($manageEditSortAction, function ($columns) use ($metaGroups) {
            foreach ($metaGroups as $metaGroup) {
                foreach ($metaGroup->getBoxes() as $metaBoxModel) {
                    foreach ($metaBoxModel->getFields() as $metaBoxFieldModel) {
                        if (
                            $metaBoxFieldModel->isShowInArchive() &&
                            $metaBoxFieldModel->isFilterable() &&
                            $metaBoxFieldModel->isFilterableInAdmin()
                        ) {
                            $key = Strings::toDBFormat($metaBoxModel->getName()).'_'.Strings::toDBFormat($metaBoxFieldModel->getName());
                            $columns[$key] = $key;
                        }
                    }
                }
            }

            return $columns;
        });

        // modify the main posts query
        add_action('pre_get_posts', function (\WP_Query $query) use ($postTypeModel, $metaGroups) {
            global $wpdb;

            if (!$query->is_main_query()) {
                return;
            }

            // filter queries on back-end
            if (is_admin()) {
                // get_current_screen() is only defined once wp-admin/includes/screen.php is loaded:
                // a plugin running wp() early in an admin request (e.g. a custom login URL redirect)
                // fires pre_get_posts before that
                if (!function_exists('get_current_screen')) {
                    return;
                }

                $scr = get_current_screen();

                if ($scr === null || $scr->base !== 'edit') {
                    return;
                }

                //  modify tax_query (excluding WooCommerce product page)
                if (
                    $postTypeModel instanceof CustomPostTypeModel &&
                    !$postTypeModel->isNative() &&
                    !$postTypeModel->isWooCommerce()
                ) {
                    foreach ($postTypeModel->getTaxonomies() as $taxonomy) {
                        if (!$taxonomy->isNative() && isset($_GET[$taxonomy->getSlug()]) && $_GET[$taxonomy->getSlug()] != 0) {
                            $display = self::displayTaxonomy($postTypeModel, $taxonomy);

                            if ($display) {
                                $term = sanitize_text_field($_GET[$taxonomy->getSlug()]);
                                $query->set('tax_query', [
                                    [
                                        'taxonomy' => $taxonomy->getSlug(),
                                        'field' => 'slug',
                                        'terms' => $term
                                    ]
                                ]);
                            }
                        }
                    }
                }

                // apply sorting based on user preferences
                if ($postTypeModel instanceof CustomPostTypeModel && !$postTypeModel->isNative()) {
                    self::applySortingBasedOnUserPreferences($postTypeModel, $query);
                }

                // sorting and filtering posts by meta fields in backend
                $metaQuery = [];

                foreach ($metaGroups as $metaGroup) {
                    foreach ($metaGroup->getBoxes() as $metaBoxModel) {
                        foreach ($metaBoxModel->getFields() as $metaBoxFieldModel) {
                            if (
                                $metaBoxFieldModel->isShowInArchive() &&
                                $metaBoxFieldModel->isFilterable() &&
                                $metaBoxFieldModel->isFilterableInAdmin()
                            ) {
                                $metaKey = Strings::toDBFormat($metaBoxModel->getName()).'_'.Strings::toDBFormat($metaBoxFieldModel->getName());

                                // 1. filter
                                // regular fields
                                if (isset($_GET[$metaKey]) && !empty($_GET[$metaKey])) {
                                    $metaQuery[] = [
                                        'key' => $metaKey,
                                        'value' => esc_html($_GET[$metaKey])
                                    ];
                                }

                                // 2. order
                                $orderBy = $query->get('orderby');
                                $order = $query->get('order') ?? 'asc';

                                if ($orderBy === $metaKey) {
                                    $metaQuery['relation'] = 'OR';
                                    $metaQuery[$metaKey.'_clause'] = [
                                        'key'     => $metaKey,
                                        'compare' => 'EXISTS',
                                    ];
                                    $metaQuery[] = [
                                        'key'     => $metaKey,
                                        'compare' => 'NOT EXISTS',
                                    ];
                                    $query->set('orderby', [$metaKey.'_clause' => $order]);
                                    $query->set('order', $order);
                                }
                            }
                        }
                    }
                }

                if (!empty($metaQuery)) {
                    $query->set('meta_query', $metaQuery);
                }
            } else {
                // alter frontend URL prefixes
                if (!$postTypeModel instanceof CustomPostTypeModel) {
                    return;
                }

                $frontEndUrlPrefix = $postTypeModel->getSettings()['front_url_prefix'] ?? null;

                if ($frontEndUrlPrefix === null) {
                    return;
                }

                if ($frontEndUrlPrefix !== "") {
                    $urlArr = explode("/", $_SERVER['REQUEST_URI']);
                    $frontEndUrlPrefixArr = explode("/", $frontEndUrlPrefix);
                    $check = array_values(array_intersect($urlArr, $frontEndUrlPrefixArr));

                    if ($frontEndUrlPrefixArr == $check) {
                        $postName = $query->get("attachment");

                        $postType = $wpdb->get_var(
                            $wpdb->prepare(
                                'SELECT post_type FROM ' . $wpdb->posts . ' WHERE post_name = %s LIMIT 1',
                                $postName
                            )
                        );

                        if ($postTypeModel->getName() === $postType) {
                            $query->set($postTypeModel->getName(), $postName);
                            $query->set('post_type', $postType);
                            $query->is_single = true;
                            $query->is_page = false;
                        }
                    }
                } else {
                    // remove frontend URL prefix
                    if (Arrays::count($query->query) === 2 && isset($query->query['page']) && !empty($query->query['name'])) {
                        $postTypes = get_post_types([
                            'public' => true,
                            '_builtin' => false,
                        ]);

                        $query->set('post_type', array_merge(['page', 'post'], $postTypes));
                    }
                }
            }
        });

        // add filterable columns
        add_action('restrict_manage_posts', function ($post_type) use ($postTypeModel, $postTypeName, $metaGroups) {
            if ($post_type !== $postTypeName) {
                return;
            }

            if ($postTypeModel instanceof CustomPostTypeModel && !$postTypeModel->isNative()) {
                foreach ($postTypeModel->getTaxonomies() as $taxonomy) {
                    $display = self::displayTaxonomy($postTypeModel, $taxonomy);

                    if (!$taxonomy->isNative() && $display) {
                        $metaKey = $taxonomy->getSlug();
                        $selected = '';
                        if (isset($_REQUEST[$metaKey])) {
                            $selected = $_REQUEST[$metaKey];
                        }

                        echo '<select id="'.esc_attr($metaKey).'" name="'.esc_attr($metaKey).'">';
                        echo '<option value="0">' . esc_html(Translator::translate('Select') . ' ' . $taxonomy->getSingular()) .'</option>';

                        $terms = get_terms([
                            'taxonomy'   => $taxonomy->getSlug(),
                            'hide_empty' => false,
                        ]);

                        if (!is_wp_error($terms)) {
                            foreach ($terms as $term) {
                                $isSelected = ($term->slug == $selected) ? ' selected="selected"' : '';
                                echo '<option value="'.esc_attr($term->slug).'"'.$isSelected.'>' . esc_html($term->name) . '</option>';
                            }
                        }

                        echo '</select>';
                    }
                }
            }

            foreach ($metaGroups as $metaGroup) {
                foreach ($metaGroup->getBoxes() as $metaBoxModel) {
                    foreach ($metaBoxModel->getFields() as $metaBoxFieldModel) {
                        if (
                            $metaBoxFieldModel->isShowInArchive() &&
                            $metaBoxFieldModel->isFilterable() &&
                            $metaBoxFieldModel->isFilterableInAdmin()
                        ) {
                            //get unique values of the meta field to filer by.
                            $metaKey = Strings::toDBFormat($metaBoxModel->getName()).'_'.Strings::toDBFormat($metaBoxFieldModel->getName());
                            $metaLabel = $metaBoxFieldModel->getLabelOrName();

                            $selected = '';
                            if (isset($_REQUEST[$metaKey])) {
                                $selected = $_REQUEST[$metaKey];
                            }

                            global $wpdb;

                            $results = $wpdb->get_results(
                                $wpdb->prepare(
                                    "
                                    SELECT DISTINCT pm.meta_value, pm.meta_id FROM {$wpdb->postmeta} pm
                                    LEFT JOIN {$wpdb->posts} p ON p.ID = pm.post_id
                                    WHERE pm.meta_key = '%s' 
                                    AND p.post_status IN ('publish', 'draft')
                                    ORDER BY pm.meta_value",
                                    $metaKey
                                )
                            );

                            echo '<select id="'.esc_attr($metaKey).'" name="'.esc_attr($metaKey).'">';
                            echo '<option value="">' . esc_html(Translator::translate('Select') . ' ' . $metaLabel) .'</option>';

                            $unique = [];

                            foreach ($results as $result) {
                                if (!in_array($result->meta_value, $unique) && !empty($result->meta_value)) {
                                    $isSelected = ($result->meta_value == $selected) ? ' selected="selected"' : '';
                                    $unique[] = $result->meta_value;
                                    $label = $result->meta_value;
                                    echo '<option value="'.esc_attr($result->meta_value).'"'.$isSelected.'>' . esc_html($label) . '</option>';
                                }
                            }

                            echo '</select>';
                        }
                    }
                }
            }
        });

        // quick edit
        $quickEditTags = [];
        add_action('quick_edit_custom_box', function ($columnName) use ($postTypeName, $metaGroups, $tableGroups, &$quickEditTags) {
            global $post;

            if ($post !== null && $post->post_type === $postTypeName) {
                self::generateQuickEditFields($metaGroups, $columnName, $post->ID, $quickEditTags);
            }
        });

        // bulk edit
        $quickBuckEditTags = [];
        add_action('bulk_edit_custom_box', function ($columnName, $postType) use ($postTypeName, $metaGroups, $tableGroups, &$quickBuckEditTags) {
            if ($postType === $postTypeName) {
                self::generateQuickEditFields($metaGroups, $columnName, null, $quickBuckEditTags);
            }
        }, 10, 2);

    }

    /**
     * @param MetaGroupModel[] $metaGroups
     * @param string $columnName
     * @param int|null $postId
     * @param array<string> $quickEditTags
     *
     * @return void
     */
    private static function generateQuickEditFields(array $metaGroups, string $columnName, ?int $postId = null, array &$quickEditTags = []): void
    {
        foreach ($metaGroups as $metaGroup) {
            foreach ($metaGroup->getBoxes() as $metaBoxModel) {
                foreach ($metaBoxModel->getFields() as $metaBoxFieldModel) {
                    if (
                        $metaBoxFieldModel->isForQuickEdit() &&
                        $metaBoxFieldModel->canBeQuickEdited()
                    ) {
                        $key = Strings::toDBFormat($metaBoxModel->getName()).'_'.Strings::toDBFormat($metaBoxFieldModel->getName());
                        $key = esc_html($key);
                        $label = Strings::toHumanReadableFormat($metaBoxFieldModel->getName());
                        $value = "";

                        if (!empty($postId)) {
                            $value = Meta::fetch($postId, MetaTypes::CUSTOM_POST_TYPE, $key, true);
                        }

                        // check if field is already rendered
                        if (!in_array($key, $quickEditTags)) {
                            Nonce::field();
                            echo self::generateQuickEditField($key, $label, $value, $metaBoxFieldModel);
                            $quickEditTags[] = $key;
                        }
                    }
                }
            }
        }
    }

    /**
     * This function exclude WooCommerce default taxonomies (like `product_brand`) from back-end search
     *
     * @param CustomPostTypeModel $postTypeModel
     * @param TaxonomyModel $taxonomy
     *
     * @return bool
     */
    private static function displayTaxonomy(CustomPostTypeModel $postTypeModel, TaxonomyModel $taxonomy): bool
    {
        return ($postTypeModel->isWooCommerce() && $taxonomy->isWooCommerceNative()) ? false : true;
    }

    /**
     * Adjusts the sorting of query results based on user-defined preferences or default settings
     * of the custom post type. Skips modification if the post type is native or the 'orderby'
     * parameter is provided in the request.
     *
     * @param CustomPostTypeModel $postTypeModel The custom post type model providing sorting settings.
     * @param \WP_Query $query The query object to modify with sorting preferences.
     *
     * @return void
     */
    private static function applySortingBasedOnUserPreferences(CustomPostTypeModel $postTypeModel, \WP_Query $query): void
    {
        if ($postTypeModel->isNative()) {
            return;
        }

        if (!empty($_GET['orderby'])) {
            return;
        }

        if (empty($postTypeModel->getSettings()['sorting'])) {
            return;
        }

        $orderBy = $postTypeModel->getSettings()['sorting']['orderBy'] ?? "date";
        $direction = $postTypeModel->getSettings()['sorting']['direction'] ?? "DESC";

        $query->set('orderby', $orderBy);
        $query->set('order', $direction);
    }
}
