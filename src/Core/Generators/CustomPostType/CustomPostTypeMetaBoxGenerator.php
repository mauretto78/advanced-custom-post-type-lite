<?php

namespace ACPT_Lite\Core\Generators\CustomPostType;

use ACPT_Lite\Core\Generators\AbstractGenerator;
use ACPT_Lite\Core\Helper\Fields;
use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Meta\MetaBoxModel;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Utils\PHP\Url;

/**
 * *************************************************
 * MetaBoxGenerator class
 * *************************************************
 *
 * @author Mauro Cassani
 * @link https://github.com/mauretto78/
 */
class CustomPostTypeMetaBoxGenerator extends AbstractGenerator
{
    /**
     * @param MetaBoxModel $metaBoxModel
     * @param string $postTypeName
     * @param array<int, mixed> $formFields
     * @param int|null $postId
     */
    public function addMetaBox(MetaBoxModel $metaBoxModel, string $postTypeName, array $formFields = [], ?int $postId = null): void
    {
        // end update_edit_form
        add_action('post_edit_form_tag', function () {
            echo ' enctype="multipart/form-data"';
        });

        $this->adminInit(function () use ($metaBoxModel, $formFields, $postTypeName, $postId) {
            $isVisible = true;

            if (!$isVisible) {
                return;
            }

            // A null $postId is only legitimate on the "new post" screen. On any other
            // post-less admin screen (upload.php, edit.php, …) this generator must not
            // build field HTML: the meta box would never render there anyway, and a
            // single throwing field (see FileField) would take the whole page down.
            if (
                ($postId === null && Url::pagenow() === 'post-new.php') ||
                (isset($_GET['post']) && $_GET['post'] == $postId) ||
                (isset($_GET['id']) && $_GET['id'] == $postId)
            ) {
                $boxLabel = $this->metaBoxLabel($metaBoxModel);
                $editButtonPlaceholder = $this->metaBoxEditButtonPlaceholder($metaBoxModel);
                $randomId = Strings::generateRandomId();
                $idBox = 'acpt_metabox_'. $randomId;
                $rows = $this->fieldRows($metaBoxModel->getFields(), $postId);
                $postTypeName = $this->getPostTypeName($postTypeName);

                if (!empty($rows)) {
                    add_meta_box(
                        $idBox,
                        $boxLabel,
                        function ($post, $data) use ($rows, $metaBoxModel, $postId, $editButtonPlaceholder) {
                            echo '<span class="acpt-conditional-rules-box-marker" data-conditional-rules-box-id="'.esc_attr($metaBoxModel->getId()).'" style="display:none"></span>';
                            echo $editButtonPlaceholder;

                            foreach ($rows as $row) {
                                echo "<div class='acpt-admin-meta-row ".($row['isVisible'] == 0 ? ' hidden' : '')."'>";

                                foreach ($row['fields'] as $field) {
                                    echo $field;
                                }

                                echo "</div>";
                            }
                        },
                        strtolower($postTypeName),
                        $metaBoxModel->getContext(),
                        in_array($metaBoxModel->getPriority(), ['core', 'default', 'high', 'low'], true) ? $metaBoxModel->getPriority() : 'default',
                        [$formFields]
                    );

                    add_filter('postbox_classes_'.strtolower($postTypeName).'_'.$idBox, function ($classes) use ($metaBoxModel, $isVisible) {
                        array_push($classes, 'acpt-metabox');
                        array_push($classes, $metaBoxModel->getUiName());

                        if (isset($_GET['post'])) {
                            array_push($classes, 'post-id-' . $_GET['post']);
                        }

                        // COOKIES
                        if (isset($_GET['post'])) {
                            $cookieName = 'postbox_acpt-metabox_'.$metaBoxModel->getUiName().'_post-id-'.$_GET['post'].'_closed';
                            if (isset($_COOKIE[$cookieName]) && $_COOKIE[$cookieName] == 1) {
                                array_push($classes, 'closed');
                            }
                        }

                        if ($metaBoxModel->getSetting("hide_title")) {
                            array_push($classes, 'hide-title');
                        }

                        if ($metaBoxModel->getSetting("hide_toggle")) {
                            array_push($classes, 'hide-toggle');
                        }

                        // Box failed its static visibility check but has a live-reactive
                        // (OTHER_FIELDS/OTHER_COLUMNS) condition — still registered via
                        // add_meta_box() above so JS can reveal it without a reload, but
                        // marked hidden until then.
                        if (!$isVisible) {
                            array_push($classes, 'hidden');
                        }

                        return $classes;
                    });
                }
            }
        });
    }

    /**
     * @param MetaFieldModel[] $fields
     * @param int|null $postId
     *
     * @return array<int, array<string, mixed>>
     * @throws \Exception
     */
    private function fieldRows(array $fields, ?int $postId = null): array
    {
        $rows = Fields::extractFieldRows($fields);
        $fieldRows = [];
        $visibleFieldsTotalCount = 0;

        // build the field rows array
        foreach ($rows as $index => $row) {
            $visibleFieldsRowCount = 0;

            foreach ($row as $field) {
                $fieldGenerator = CustomPostTypeMetaBoxFieldGenerator::generate($field, $postId);

                // @phpstan-ignore-next-line if.alwaysTrue
                if ($fieldGenerator) {
                    if ($fieldGenerator->isVisible()) {
                        $visibleFieldsTotalCount++;
                        $visibleFieldsRowCount++;
                    }

                    $fieldRows[$index]['fields'][] = $fieldGenerator->render();
                    $fieldRows[$index]['isVisible'] = $visibleFieldsRowCount;
                }
            }
        }

        if ($visibleFieldsTotalCount > 0) {
            return $fieldRows;
        }

        return [];
    }
}
