<?php

namespace ACPT_Lite\Core\Generators\Comment;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Generators\AbstractGenerator;
use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Repository\MetaRepository;
use ACPT_Lite\Utils\PHP\Url;
use ACPT_Lite\Utils\Wordpress\Translator;

class CommentAdminColumnsGenerator extends AbstractGenerator
{
    /**
     * Add meta fields to the comments table
     * @return void
     * @throws \Exception
     */
    public static function addColumns(): void
    {
        $metaGroups = MetaRepository::get([
            'belongsTo' => MetaTypes::COMMENT,
            'clonedFields' => true
        ]);

        // add columns to show
        add_filter('manage_edit-comments_columns', function ($columns) use ($metaGroups) {
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

        // add sortable columns
        add_filter('manage_edit-comments_sortable_columns', function ($columns) use ($metaGroups) {
            foreach ($metaGroups as $metaGroup) {
                foreach ($metaGroup->getBoxes() as $metaBoxModel) {
                    foreach ($metaBoxModel->getFields() as $metaBoxFieldModel) {
                        if ($metaBoxFieldModel->isShowInArchive() && $metaBoxFieldModel->isFilterable() && $metaBoxFieldModel->isFilterableInAdmin()) {
                            $key = Strings::toDBFormat($metaBoxModel->getName()).'_'.Strings::toDBFormat($metaBoxFieldModel->getName());
                            $columns[$key] = $key;
                        }
                    }
                }
            }

            return $columns;
        });

        // display value on columns to show
        add_action('manage_comments_custom_column', function ($name) use ($metaGroups) {
            global $comment;

            foreach ($metaGroups as $metaGroup) {
                foreach ($metaGroup->getBoxes() as $metaBoxModel) {
                    foreach ($metaBoxModel->getFields() as $metaBoxFieldModel) {
                        if ($metaBoxFieldModel->isShowInArchive()) {
                            $key = Strings::toDBFormat($metaBoxModel->getName()).'_'.Strings::toDBFormat($metaBoxFieldModel->getName());

                            if ($key === $name) {
                                echo do_shortcode('[acpt_comm admin_view="true" preview="true" cid="'.$comment->comment_ID.'" box="'.Strings::esc_attr($metaBoxModel->getName()).'" field="'.esc_attr($metaBoxFieldModel->getName()).'"]');
                            }
                        }
                    }
                }
            }
        });

        // modify the main comments query
        add_action('pre_get_comments', function (\WP_Comment_Query $query) use ($metaGroups) {
            if (!self::isAdminEditCommentPage()) {
                return;
            }

            foreach ($metaGroups as $metaGroup) {
                foreach ($metaGroup->getBoxes() as $metaBoxModel) {
                    foreach ($metaBoxModel->getFields() as $metaBoxFieldModel) {
                        if ($metaBoxFieldModel->isShowInArchive() && $metaBoxFieldModel->isFilterable() && $metaBoxFieldModel->isFilterableInAdmin()) {
                            $metaKey = Strings::toDBFormat($metaBoxModel->getName()).'_'.Strings::toDBFormat($metaBoxFieldModel->getName());
                            $orderBy = $query->query_vars['orderby'] ?? null;
                            $order = $query->query_vars['order'] ?? 'asc'; // can be: sort/asc

                            if ($orderBy === $metaKey) {
                                $query->query_vars['meta_key'] = $metaKey;
                                $query->query_vars['orderby'] = 'meta_value';
                                $query->query_vars['order'] = $order;
                            }
                        }
                    }
                }
            }
        });

        // add filterable columns
        add_action('restrict_manage_comments', function () use ($metaGroups) {
            foreach ($metaGroups as $metaGroup) {
                foreach ($metaGroup->getBoxes() as $metaBoxModel) {
                    foreach ($metaBoxModel->getFields() as $metaBoxFieldModel) {
                        if ($metaBoxFieldModel->isShowInArchive() && $metaBoxFieldModel->isFilterable() && $metaBoxFieldModel->isFilterableInAdmin()) {

                            //get unique values of the meta field to filer by.
                            $metaKey = Strings::toDBFormat($metaBoxModel->getName()).'_'.Strings::toDBFormat($metaBoxFieldModel->getName());
                            $metaLabel = ($metaBoxFieldModel->getAdvancedOption('label')) ? $metaBoxFieldModel->getAdvancedOption('label') : $metaBoxFieldModel->getName();

                            $selected = '';
                            if (isset($_REQUEST[$metaKey])) {
                                $selected = $_REQUEST[$metaKey];
                            }

                            global $wpdb;

                            $results = $wpdb->get_results(
                                $wpdb->prepare(
                                    "
                                    SELECT DISTINCT cm.meta_value, cm.meta_id FROM {$wpdb->commentmeta} cm
                                    LEFT JOIN {$wpdb->comments} c ON c.comment_ID = cm.comment_id
                                    WHERE cm.meta_key = '%s'
                                    AND c.comment_approved = '1'
                                    ORDER BY cm.meta_value",
                                    $metaKey
                                )
                            );

                            echo '<select id="'.$metaKey.'" name="'.$metaKey.'">';
                            echo '<option value="0">' . Translator::translate('Select') . ' ' . $metaLabel .' </option>';

                            $unique = [];

                            foreach ($results as $result) {
                                if (!in_array($result->meta_value, $unique)) {
                                    $isSelected = ($result->meta_id == $selected) ? ' selected="selected"' : '';
                                    $unique[] = $result->meta_value;
                                    echo '<option value="'.$result->meta_value.'"'.$isSelected.'>' . $result->meta_value . ' </option>';
                                }
                            }

                            echo '</select>';
                        }
                    }
                }
            }
        });

        // quick edit
        // @note this is an hook taken from here:
        // https://wordpress.stackexchange.com/questions/232401/add-comments-meta-fields-to-comments-metabox-on-post-edit-screen
        //
        $quickEditTags = [];
        add_filter('the_editor', function ($html) use ($metaGroups, &$quickEditTags) {
            if (self::isAdminEditCommentPage() && false !== strpos($html, 'id="replycontent"')) {
                foreach ($metaGroups as $metaGroup) {
                    foreach ($metaGroup->getBoxes() as $metaBoxModel) {
                        foreach ($metaBoxModel->getFields() as $metaBoxFieldModel) {
                            if (
                                $metaBoxFieldModel->isForQuickEdit() &&
                                $metaBoxFieldModel->canBeQuickEdited()
                            ) {
                                $key   = Strings::toDBFormat($metaBoxModel->getName()) . '_' . Strings::toDBFormat($metaBoxFieldModel->getName());
                                $key   = esc_html($key);
                                $label = Strings::toHumanReadableFormat($metaBoxFieldModel->getName());
                                $value = '';

                                // check if field is already rendered
                                if (!in_array($key, $quickEditTags)) {
                                    $html .= self::generateQuickEditField($key, $label, $value, $metaBoxFieldModel);
                                    $quickEditTags[] = $key;
                                }
                            }
                        }
                    }
                }

                return $html;
            }

            return $html;
        });
    }

    /**
     * @return bool
     */
    private static function isAdminEditCommentPage()
    {
        $pagenow = Url::pagenow();

        return (is_admin() && $pagenow === 'edit-comments.php');
    }
}
