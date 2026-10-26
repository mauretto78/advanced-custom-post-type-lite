<?php

namespace ACPT_Lite\Core\Generators\CustomPostType;

use ACPT_Lite\Constants\MetaGroupDisplay;
use ACPT_Lite\Core\Generators\AbstractGenerator;
use ACPT_Lite\Core\Helper\Fields;
use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Meta\MetaBoxModel;
use ACPT_Lite\Core\Models\Meta\MetaGroupModel;
use ACPT_Lite\Utils\PHP\Cookie;
use ACPT_Lite\Utils\PHP\Url;

/**
 * *************************************************
 * MetaBoxGenerator class
 * *************************************************
 *
 * @author Mauro Cassani
 * @link https://github.com/mauretto78/
 */
class CustomPostTypeMetaGroupGenerator extends AbstractGenerator
{
    /**
     * @var MetaGroupModel
     */
    private MetaGroupModel $groupModel;

    /**
     * @var string
     */
    private string $postTypeName;

    /**
     * @var int|null
     */
    private ?int $postId;

    /**
     * CustomPostTypeMetaGroupGenerator constructor.
     *
     * @param MetaGroupModel $groupModel
     * @param string $postTypeName
     */
    public function __construct(MetaGroupModel $groupModel, string $postTypeName)
    {
        $this->groupModel         = $groupModel;
        $this->postTypeName       = $postTypeName;
        $this->postId             = $_GET['post'] ?? $_GET['id'] ?? null;

        if ($this->postId !== null) {
            $this->postId = (int) $this->postId;
        }
    }

    /**
     * Render the meta box
     * @return void
     * @throws \Exception
     */
    public function render(): void
    {
        if (empty($this->groupModel->getBoxes())) {
            return;
        }

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
     */
    private function standardView(): void
    {
        $metaBoxGenerator = new CustomPostTypeMetaBoxGenerator();

        foreach ($this->groupModel->getBoxes() as $metaBoxModel) {
            $metaFields = [];

            foreach ($metaBoxModel->getFields() as $fieldModel) {
                $metaFields[] = $this->generateMetaBoxFieldArray($fieldModel);
            }

            if (!empty($metaFields)) {
                $metaBoxGenerator->addMetaBox(
                    $metaBoxModel,
                    $this->postTypeName,
                    $metaFields,
                    $this->postId
                );
            }
        }
    }

    /**
     * Vertical tabs
     */
    private function verticalTabs(): void
    {
        // end update_edit_form
        add_action('post_edit_form_tag', function () {
            echo ' enctype="multipart/form-data"';
        });

        $this->adminInit(function () {
            if (
                ($this->postId === null && Url::pagenow() === 'post-new.php') ||
                (isset($_GET['post']) && $_GET['post'] == $this->postId) ||
                (isset($_GET['id']) && $_GET['id'] == $this->postId)
            ) {
                $boxLabel = (!empty($this->groupModel->getLabel())) ? $this->groupModel->getLabel() : $this->groupModel->getName();
                $randomId = Strings::generateRandomId();
                $idBox = 'acpt_metabox_'. $randomId;
                $boxRows = $this->boxRows($this->groupModel->getBoxes(), $this->postId);
                $postTypeName = $this->getPostTypeName($this->postTypeName);

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
                            function ($post, $data) use ($boxRows) {
                                echo $this->cctRecordIdInput();
                                ?>
                                <div class="acpt-admin-vertical-tabs-btn-wrapper with-margins">
                                    <?php echo $this->metaBoxEditLinkButtonOrEmpty($this->groupModel->getBoxById($this->activeTabId($this->postId)) ?? ($this->groupModel->getBoxes()[0] ?? null)); ?>
                                </div>
								<div class="acpt-admin-vertical-tabs-wrapper" style="margin: 24px;" id="<?php echo $this->groupModel->getId(); ?>">
									<div class="acpt-admin-vertical-tabs">
										<?php
                                        $index = 0;
                                foreach ($boxRows as $boxId => $row):  ?>
											<div data-id="acpt_post_<?php echo $this->postId; ?>_active_tab" class="acpt-admin-vertical-tab with-borders <?php echo $this->isActiveTab($boxId, $index, $this->postId); ?>" data-target="<?php echo $boxId; ?>">
												<?php echo $row['boxName'];
                                    $index++; ?>
											</div>
										<?php endforeach; ?>
									</div>
									<div class="acpt-admin-vertical-panels">
										<?php
                                            $index = 0;
                                foreach ($boxRows as $boxId => $row): ?>
											<div id="<?php echo $boxId; ?>" class="acpt-admin-vertical-panel with-borders <?php echo $this->isActiveTab($boxId, $index, $this->postId); ?>">
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
                            strtolower($postTypeName),
                            // @phpstan-ignore-next-line notIdentical.alwaysTrue
                            ($this->groupModel->getContext() !== null ? $this->groupModel->getContext() : 'normal'),
                            // @phpstan-ignore-next-line notIdentical.alwaysTrue
                            ($this->groupModel->getPriority() !== null ? $this->groupModel->getPriority() : 'high'),
                            [$metaFields]
                        );

                        add_filter('postbox_classes_'.strtolower($this->postTypeName).'_'.$idBox, function ($classes) {
                            array_push($classes, 'acpt-metabox');

                            return $classes;
                        });
                    }
                }
            }
        });
    }

    /**
     * Horizontal tabs
     */
    private function horizontalTabs(): void
    {
        // end update_edit_form
        add_action('post_edit_form_tag', function () {
            echo ' enctype="multipart/form-data"';
        });

        $this->adminInit(function () {
            if (
                ($this->postId === null && Url::pagenow() === 'post-new.php') ||
                (isset($_GET['post']) && $_GET['post'] == $this->postId) ||
                (isset($_GET['id']) && $_GET['id'] == $this->postId)
            ) {
                $boxLabel = (!empty($this->groupModel->getLabel())) ? $this->groupModel->getLabel() : $this->groupModel->getName();
                $randomId = Strings::generateRandomId();
                $idBox = 'acpt_metabox_'. $randomId;
                $boxRows = $this->boxRows($this->groupModel->getBoxes(), $this->postId);
                $postTypeName = $this->getPostTypeName($this->postTypeName);

                if (!empty($postTypeName) && !empty($boxRows)) {
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
                            function ($post, $data) use ($boxRows) {
                                echo $this->cctRecordIdInput();
                                ?>
                                <div class="acpt-admin-horizontal-tabs-wrapper" style="margin: 24px;" id="<?php echo $this->groupModel->getId(); ?>">
                                    <div class="acpt-admin-horizontal-tabs-btn-wrapper">
                                        <div class="acpt-admin-horizontal-tabs">
                                            <?php
                                            $index = 0;
                                foreach ($boxRows as $boxId => $row): if ($row['isVisible']):  ?>
                                                <div data-id="acpt_post_<?php echo $this->postId; ?>_active_tab" class="acpt-admin-horizontal-tab with-borders <?php echo $this->isActiveTab($boxId, $index, $this->postId); ?>" data-target="<?php echo $boxId; ?>">
                                                    <?php echo $row['boxName'];
                                    $index++; ?>
                                                </div>
                                            <?php endif;
                                endforeach; ?>
                                        </div>
                                        <?php echo $this->metaBoxEditLinkButtonOrEmpty($this->groupModel->getBoxById($this->activeTabId($this->postId)) ?? ($this->groupModel->getBoxes()[0] ?? null)); ?>
                                    </div>
                                    <div class="acpt-admin-horizontal-panels">
										<?php
                                        $index = 0;
                                foreach ($boxRows as $boxId => $row): if ($row['isVisible']): ?>
                                            <div id="<?php echo $boxId; ?>" class="acpt-admin-horizontal-panel no-margin <?php echo $this->isActiveTab($boxId, $index, $this->postId); ?>">
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
                            strtolower($postTypeName),
                            // @phpstan-ignore-next-line notIdentical.alwaysTrue
                            ($this->groupModel->getContext() !== null ? $this->groupModel->getContext() : 'normal'),
                            // @phpstan-ignore-next-line notIdentical.alwaysTrue
                            ($this->groupModel->getPriority() !== null ? $this->groupModel->getPriority() : 'high'),
                            [$metaFields]
                        );

                        add_filter('postbox_classes_'.strtolower($this->postTypeName).'_'.$idBox, function ($classes) {
                            array_push($classes, 'acpt-metabox');

                            return $classes;
                        });
                    }
                }
            }
        });
    }

    /**
     * @param MetaBoxModel[] $boxes
     * @param int|null $postId
     *
     * @return array<string, array<string, mixed>>
     * @throws \Exception
     */
    private function boxRows(array $boxes, ?int $postId = null)
    {
        $boxRows = [];
        $visibleFieldsTotalCount = 0;

        foreach ($boxes as $boxIndex => $box) {
            $rows = Fields::extractFieldRows($box->getFields());
            $rowFields = [];

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

                        $boxRows[$box->getId()]['isVisible'] = $visibleFieldsRowCount;
                        $rowFields[$index][] = $fieldGenerator->render();
                    }
                }
            }

            $boxRows[$box->getId()]['boxName'] = $box->getUiName();
            $boxRows[$box->getId()]['rows'] = $rowFields;
        }

        if ($visibleFieldsTotalCount > 0) {
            return $boxRows;
        }

        return [];
    }

    /**
     * @param      string $id
     * @param      int $index
     * @param int|null $postId
     *
     * @return string
     */
    private function isActiveTab(string $id, int $index, ?int $postId = null)
    {
        if (empty($postId)) {
            return ($index === 0 ? 'active' : '');
        }

        $activeTab = $this->activeTabId($postId);

        if ($activeTab !== null) {
            return ($activeTab === $id) ? 'active' : '';
        }

        return ($index === 0 ? 'active' : '');
    }

    /**
     * @param int|null $postId
     * @return mixed|null
     */
    private function activeTabId(?int $postId = null)
    {
        $activeTabId = 'acpt_post_'.$postId.'_active_tab';

        return Cookie::get($activeTabId);
    }

    /**
     * The id of the CCT record linked to the post.
     * Without it the save creates a new record on every update, and the post
     * keeps showing the first one: the data looks never saved (#1416).
     * The standard view prints it in CustomPostTypeMetaBoxGenerator.
     *
     * @return string
     */
    private function cctRecordIdInput(): string
    {
        return '';
    }
}
