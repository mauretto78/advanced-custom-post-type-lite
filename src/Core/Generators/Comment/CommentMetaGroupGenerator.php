<?php

namespace ACPT_Lite\Core\Generators\Comment;

use ACPT_Lite\Constants\MetaGroupDisplay;
use ACPT_Lite\Core\Generators\AbstractGenerator;
use ACPT_Lite\Core\Helper\Fields;
use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Meta\MetaBoxModel;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Core\Models\Meta\MetaGroupModel;

class CommentMetaGroupGenerator extends AbstractGenerator
{
    /**
     * @var MetaGroupModel $groupModel
     */
    private MetaGroupModel $groupModel;

    /**
     * CommentMetaGroupGenerator constructor.
     *
     * @param MetaGroupModel $groupModel
     */
    public function __construct(MetaGroupModel $groupModel)
    {
        $this->groupModel = $groupModel;
    }

    /**
     * Generate the front-end form
     *
     * @return void
     */
    public function generateFrontEndForm(): void
    {
        if (!empty($this->groupModel->getBoxes())) {
            if (!is_admin()) {
                $this->enqueueAssets();
            }

            foreach ($this->groupModel->getBoxes() as $box) {
                $generator = new CommentMetaBoxGenerator($box);
                $generator->generate();
            }
        }
    }

    /**
     * Generate the back-end form
     *
     * @void
     */
    public function generateBackEndForm(): void
    {
        switch ($this->groupModel->getDisplay()) {
            default:
            case MetaGroupDisplay::STANDARD:
            case MetaGroupDisplay::ACCORDION:
                $this->standardView();
                break;

            case MetaGroupDisplay::VERTICAL_TABS:
                $this->verticalTabs();
                break;

            case MetaGroupDisplay::HORIZONTAL_TABS:
                $this->horizontalTabs();
                break;
        }
    }

    /**
     * Standard view
     *
     * @return void
     */
    private function standardView(): void
    {
        $this->adminInit(function () {
            if (isset($_GET['c'])) {
                $commentId = filter_input(INPUT_GET, 'c', FILTER_VALIDATE_INT) ?: null;
                $boxLabel = (!empty($this->groupModel->getLabel())) ? $this->groupModel->getLabel() : $this->groupModel->getName();
                $idBox = 'acpt_metabox_'. Strings::toDBFormat($this->groupModel->getName());

                $metaFields = [];

                foreach ($this->groupModel->getBoxes() as $metaBoxModel) {
                    $metaFields = $this->fieldRows($metaBoxModel->getFields(), $commentId);
                }

                if (!empty($metaFields)) {
                    add_meta_box(
                        $idBox,
                        $boxLabel,
                        function ($comment) use ($metaFields) {
                            foreach ($metaFields as $row) {
                                echo "<div class='acpt-admin-meta-row ".($row['isVisible'] == 0 ? ' hidden' : '')."'>";

                                foreach ($row['fields'] as $field) {
                                    echo $field;
                                }

                                echo "</div>";
                            }
                        },
                        'comment',
                        'normal',
                        'high',
                    );
                }
            }
        });
    }

    /**
     * Vertical tabs
     *
     * @return void
     */
    private function verticalTabs(): void
    {
        $this->adminInit(function () {
            if (isset($_GET['c'])) {
                $commentId = filter_input(INPUT_GET, 'c', FILTER_VALIDATE_INT) ?: null;
                $boxLabel = (!empty($this->groupModel->getLabel())) ? $this->groupModel->getLabel() : $this->groupModel->getName();
                $idBox = 'acpt_metabox_'. Strings::toDBFormat($this->groupModel->getName());
                $boxRows = $this->boxRows($this->groupModel->getBoxes(), $commentId);

                if (!empty($boxRows)) {
                    $metaFields = [];

                    foreach ($this->groupModel->getBoxes() as $metaBoxModel) {
                        foreach ($metaBoxModel->getFields() as $fieldModel) {
                            $metaFields[] = $this->generateMetaBoxFieldArray($fieldModel);
                        }
                    }

                    if (!empty($metaFields)) {
                        add_meta_box(
                            $idBox,
                            $boxLabel,
                            function ($comment) use ($boxRows) {
                                ?>
                                    <div class="acpt-admin-vertical-tabs-wrapper" style="margin: 24px;" id="<?php echo $this->groupModel->getId(); ?>">
                                        <div class="acpt-admin-vertical-tabs">
                                            <?php
                                        $index = 0;
                                foreach ($boxRows as $boxId => $row):  ?>
                                                <div class="acpt-admin-vertical-tab with-borders <?php echo $index === 0 ? 'active' : ''; ?>" data-target="<?php echo $boxId; ?>">
                                                    <?php echo $row['boxName'];
                                    $index++; ?>
                                                </div>
                                            <?php endforeach; ?>
                                        </div>
                                        <div class="acpt-admin-vertical-panels">
                                            <?php
                                            $index = 0;
                                foreach ($boxRows as $boxId => $row): ?>
                                                <div id="<?php echo $boxId; ?>" class="acpt-admin-vertical-panel with-borders <?php echo $index === 0 ? 'active' : ''; ?>">
                                                    <?php
                                                foreach ($row['rows'] as $fields) {
                                                    echo "<div class='acpt-admin-meta-row ".($row['isVisible'] == 0 ? ' hidden' : '')."'>";

                                                    foreach ($fields as $field) {
                                                        echo $field;
                                                    }

                                                    echo "</div>";
                                                }

                                $index++; ?>
                                                </div>
                                            <?php endforeach; ?>
                                        </div>
                                    </div>
                                    <?php
                            },
                            'comment',
                            'normal',
                            'high',
                            [$metaFields]
                        );
                    }
                }
            }
        });
    }

    /**
     * Horizontal tabs
     *
     * @return void
     */
    private function horizontalTabs(): void
    {
        $this->adminInit(function () {
            if (isset($_GET['c'])) {
                $commentId = filter_input(INPUT_GET, 'c', FILTER_VALIDATE_INT) ?: null;
                $boxLabel = (!empty($this->groupModel->getLabel())) ? $this->groupModel->getLabel() : $this->groupModel->getName();
                $idBox = 'acpt_metabox_'. Strings::toDBFormat($this->groupModel->getName());
                $boxRows = $this->boxRows($this->groupModel->getBoxes(), $commentId);

                if (!empty($commentId) && !empty($boxRows)) {
                    $metaFields = [];

                    foreach ($this->groupModel->getBoxes() as $metaBoxModel) {
                        foreach ($metaBoxModel->getFields() as $fieldModel) {
                            $metaFields[] = $this->generateMetaBoxFieldArray($fieldModel);
                        }
                    }

                    if (!empty($metaFields)) {
                        add_meta_box(
                            $idBox,
                            $boxLabel,
                            function ($comment) use ($boxRows) {
                                ?>
                                    <div class="acpt-admin-horizontal-tabs-wrapper" style="margin: 24px;" id="<?php echo $this->groupModel->getId(); ?>">
                                        <div class="acpt-admin-horizontal-tabs">
                                            <?php
                                        $index = 0;
                                foreach ($boxRows as $boxId => $row): if ($row['isVisible']):  ?>
                                                <div class="acpt-admin-horizontal-tab with-borders <?php echo $index === 0 ? 'active' : ''; ?>" data-target="<?php echo $boxId; ?>">
                                                    <?php echo $row['boxName'];
                                    $index++; ?>
                                                </div>
                                            <?php endif;
                                endforeach; ?>
                                        </div>
                                        <div class="acpt-admin-horizontal-panels">
                                            <?php
                                        $index = 0;
                                foreach ($boxRows as $boxId => $row): if ($row['isVisible']): ?>
                                                <div id="<?php echo $boxId; ?>" class="acpt-admin-horizontal-panel no-margin <?php echo $index === 0 ? 'active' : ''; ?>">
                                                    <?php
                                                foreach ($row['rows'] as $fields) {
                                                    echo "<div class='acpt-admin-meta-row ".($row['isVisible'] == 0 ? ' hidden' : '')."'>";

                                                    foreach ($fields as $field) {
                                                        echo $field;
                                                    }

                                                    echo "</div>";
                                                }

                                $index++; ?>
                                                </div>
                                            <?php endif;
                                endforeach; ?>
                                        </div>
                                    </div>
                                    <?php
                            },
                            'comment',
                            'normal',
                            'high',
                            [$metaFields]
                        );
                    }
                }
            }
        });
    }

    /**
      * @param array<int, MetaFieldModel> $fields
     * @param int|null $commentId
     *
     * @return array<int, mixed>
     * @throws \Exception
     */
    private function fieldRows(array $fields, ?int $commentId = null): array
    {
        $rows = Fields::extractFieldRows($fields);
        $fieldRows = [];

        // build the field rows array
        foreach ($rows as $index => $row) {
            foreach ($row as $field) {
                if ($field instanceof MetaFieldModel) {
                    $fieldGenerator = new CommentMetaFieldGenerator($field, $commentId);
                    $fieldRows[$index]['fields'][] = $fieldGenerator->render('backEnd');
                    $fieldRows[$index]['isVisible'] = true;
                }
            }
        }

        return $fieldRows;
    }

    /**
     * @param MetaBoxModel[] $boxes
     * @param int|null $commentId
     *
     * @return array<string, mixed>
     * @throws \Exception
     */
    private function boxRows(array $boxes, ?int $commentId = null): array
    {
        $boxRows = [];

        foreach ($boxes as $boxIndex => $box) {
            $rows = Fields::extractFieldRows($box->getFields());
            $rowFields = [];

            foreach ($rows as $index => $row) {
                foreach ($row as $field) {
                    $fieldGenerator = new CommentMetaFieldGenerator($field, $commentId);
                    $boxRows[$box->getId()]['isVisible'] = true;
                    $rowFields[$index][] = $fieldGenerator->render('backEnd');
                }
            }

            $boxRows[$box->getId()]['boxName'] = $box->getUiName();
            $boxRows[$box->getId()]['rows'] = $rowFields;
        }

        return $boxRows;
    }

    /**
     * @return void
     */
    private function enqueueAssets(): void
    {
        // Back-end
        add_action('admin_enqueue_scripts', function () {
            // @phpstan-ignore-next-line ternary.alwaysFalse
            wp_enqueue_script('acpt_admin_js', plugins_url(ACPT_LITE_DEV_MODE ? 'acpt-lite/assets/static/js/admin.js' : 'acpt-lite/assets/static/js/admin.min.js'), [], ACPT_LITE_PLUGIN_VERSION, true);
        });

        // Front-end
        add_action('wp_enqueue_scripts', function () {
            // @phpstan-ignore-next-line ternary.alwaysFalse
            wp_enqueue_style('acpt_comments_css', plugins_url(ACPT_LITE_DEV_MODE ? 'acpt-lite/assets/static/css/comments.css' : 'acpt-lite/assets/static/css/comments.min.css'), [], ACPT_LITE_PLUGIN_VERSION, 'all');
        });
    }
}
