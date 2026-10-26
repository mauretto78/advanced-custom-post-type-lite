<?php

namespace ACPT_Lite\Core\Generators\Taxonomy;

use ACPT_Lite\Constants\MetaGroupDisplay;
use ACPT_Lite\Core\Generators\AbstractGenerator;
use ACPT_Lite\Core\Helper\Fields;
use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Meta\MetaBoxModel;
use ACPT_Lite\Core\Models\Meta\MetaGroupModel;
use ACPT_Lite\Utils\PHP\Cookie;

class TaxonomyMetaGroupGenerator extends AbstractGenerator
{
    /**
     * @var MetaGroupModel
     */
    private MetaGroupModel $groupModel;

    /**
     * @var mixed
     */
    private $termId;

    /**
     * OptionPageMetaBoxGenerator constructor.
     *
     * @param MetaGroupModel $groupModel
     * @param int|null $termId
     */
    public function __construct(MetaGroupModel $groupModel, ?int $termId = null)
    {
        $this->groupModel = $groupModel;
        $this->termId = $termId;
    }

    /**
     * @return string|null
     */
    public function render()
    {
        if (empty($this->groupModel->getBoxes())) {
            return null;
        }

        switch ($this->groupModel->getDisplay()) {
            default:
            case MetaGroupDisplay::STANDARD:
                return $this->standardView();

            case MetaGroupDisplay::ACCORDION:
                return $this->accordion();

            case MetaGroupDisplay::VERTICAL_TABS:
                return $this->verticalTabs();

            case MetaGroupDisplay::HORIZONTAL_TABS:
                return $this->horizontalTabs();
        }
    }

    /**
     * @param MetaBoxModel $boxModel
     *
     * @return string
     */
    protected function getIdName(MetaBoxModel $boxModel)
    {
        $idName = Strings::toDBFormat($boxModel->getName()).'_'.$boxModel->getId();

        return esc_html($idName);
    }

    /**
     * @return string
     */
    private function standardView()
    {
        $return = '<div class="acpt-metabox meta-box-sortables taxonomy-meta-box-group" id="'.$this->groupModel->getId().'">';

        wp_editor('', 'no-show');

        foreach ($this->groupModel->getBoxes() as $index => $metaBoxModel) {
            $rows = $this->fieldRows($metaBoxModel->getFields());
            $hideTitle = $metaBoxModel->getSetting("hide_title") ? true : false;
            $hideToggle = $metaBoxModel->getSetting("hide_toggle") ? true : false;
            if (!empty($rows)) {

                // COOKIES
                $tagId = $_GET['tag_ID'] ?? null;
                $className = 'acpt-metabox acpt-tax-meta-box term-'.$tagId.' postbox';
                $cookieName = 'acpt-metabox_acpt-tax-meta-box_term-'.$tagId.'_postbox_closed';
                if (isset($_COOKIE[$cookieName]) && $_COOKIE[$cookieName] == 1) {
                    $className .= ' closed';
                }

                $return .= '<div class="'.$className.'" id="'.$this->getIdName($metaBoxModel).'" data-conditional-rules-box-id="'.esc_attr($metaBoxModel->getId()).'">';
                $return .= '<div class="postbox-header">';

                if ($hideTitle === false) {
                    $return .= '<h2 class="hndle ui-sortable-handle">'. $this->metaBoxHeading($metaBoxModel) . '</h2>';
                }

                if ($hideToggle === false) {
                    $return .= '<div class="handle-actions hide-if-no-js">';
                    $return .= '<button type="button" class="handlediv" aria-expanded="true">';
                    $return .= '<span class="screen-reader-text">'.__('Activate/deactivate the panel', ACPT_LITE_PLUGIN_NAME).':</span>';
                    $return .= '<span class="toggle-indicator acpt-toggle-indicator" data-target="'.$this->getIdName($metaBoxModel).'" aria-hidden="true"></span>';
                    $return .= '</button>';
                    $return .= '</div>';
                }

                $return .= "</div>";
                $return .= '<div class="taxonomy-meta-fields inside no-margin">';

                foreach ($rows as $row) {
                    $return .= "<div class='acpt-admin-meta-row ".($row['isVisible'] == 0 ? ' hidden' : '')."'>";

                    foreach ($row['fields'] as $field) {
                        $return .= $field;
                    }

                    $return .= "</div>";
                }

                $return .= '</div>';
                $return .= '</div>';
            }
        }

        $return .= '</div>';

        return $return;
    }

    /**
     * @return string
     */
    private function accordion()
    {
        $return = '<div class="acpt-metabox acpt-admin-accordion-wrapper" id="'.$this->groupModel->getId().'">';

        foreach ($this->groupModel->getBoxes() as $index => $metaBoxModel) {
            $rows = $this->fieldRows($metaBoxModel->getFields());

            if (!empty($rows)) {
                $itemClass = 'acpt-admin-accordion-item '.$this->isActiveTab($metaBoxModel->getId(), $index, $this->termId).('');
                $return .= '<div data-id="acpt_term_'.$this->termId.'_active_tab" class="'.$itemClass.'" data-target="'.$metaBoxModel->getId().'" data-conditional-rules-box-id="'.esc_attr($metaBoxModel->getId()).'">';
                $return .= '<div class="acpt-admin-accordion-title">';
                $return .= $this->metaBoxHeading($metaBoxModel);
                $return .= '</div>';

                $return .= '<div id="'.$metaBoxModel->getId().'" class="acpt-admin-accordion-content">';
                $return .= '<div class="taxonomy-meta-fields">';

                foreach ($rows as $row) {
                    $return .= "<div class='acpt-admin-meta-row ".$this->isActiveTab($metaBoxModel->getId(), $index, $this->termId)."'>";

                    foreach ($row['fields'] as $field) {
                        $return .= $field;
                    }

                    $return .= "</div>";
                }

                $return .= '</div>';
                $return .= '</div>';
                $return .= '</div>';
            }
        }

        $return .= '</div>';

        return $return;
    }

    /**
     * @return string
     */
    private function horizontalTabs()
    {
        $return = '<div class="acpt-metabox acpt-admin-horizontal-tabs-wrapper" id="'.$this->groupModel->getId().'">';
        $return .= '<div class="acpt-admin-horizontal-tabs-btn-wrapper">';
        $return .= '<div class="acpt-admin-horizontal-tabs">';

        foreach ($this->groupModel->getBoxes() as $index => $metaBoxModel) {
            $isVisible = true;

            if ($isVisible) {
                $rows = $this->fieldRows($metaBoxModel->getFields());

                if (!empty($rows)) {
                    $tabClass = 'acpt-admin-horizontal-tab '.$this->isActiveTab($metaBoxModel->getId(), $index, $this->termId).($isVisible ? '' : ' hidden');
                    $return .= '<div data-id="acpt_term_'.$this->termId.'_active_tab" class="'.$tabClass.'" data-target="'.$metaBoxModel->getId().'" data-conditional-rules-box-id="'.esc_attr($metaBoxModel->getId()).'">';
                    $return .= $metaBoxModel->getUiName();
                    $return .= '</div>';
                }
            }
        }

        $return .= '</div>';
        $return .= $this->metaBoxEditLinkButtonOrEmpty($this->groupModel->getBoxById($this->activeTabId($this->termId)) ?? ($this->groupModel->getBoxes()[0] ?? null));
        $return .= '</div>';
        $return .= '<div class="acpt-admin-horizontal-panels">';

        foreach ($this->groupModel->getBoxes() as $index => $metaBoxModel) {
            $isVisible = true;

            if ($isVisible) {
                $rows = $this->fieldRows($metaBoxModel->getFields());

                if (!empty($rows)) {
                    $panelClass = 'acpt-admin-horizontal-panel '.$this->isActiveTab($metaBoxModel->getId(), $index, $this->termId).($isVisible ? '' : ' hidden');
                    $return .= '<div id="'.$metaBoxModel->getId().'" class="'.$panelClass.'" data-conditional-rules-box-id="'.esc_attr($metaBoxModel->getId()).'">';

                    foreach ($rows as $row) {
                        $return .= "<div class='acpt-admin-meta-row ".($row['isVisible'] == 0 ? ' hidden' : '')."'>";

                        foreach ($row['fields'] as $field) {
                            $return .= $field;
                        }

                        $return .= "</div>";
                    }

                    $return .= '</div>';
                }
            }
        }

        $return .= '</div>';
        $return .= '</div>';

        return $return;
    }

    /**
     * @return string
     */
    private function verticalTabs()
    {
        $return = '<div class="acpt-admin-vertical-tabs-btn-wrapper">';
        $return .= $this->metaBoxEditLinkButtonOrEmpty($this->groupModel->getBoxById($this->activeTabId($this->termId)) ?? ($this->groupModel->getBoxes()[0] ?? null));
        $return .= '</div>';
        $return .= '<div class="acpt-metabox acpt-admin-vertical-tabs-wrapper" id="'.$this->groupModel->getId().'">';
        $return .= '<div class="acpt-admin-vertical-tabs">';

        foreach ($this->groupModel->getBoxes() as $index => $metaBoxModel) {
            $isVisible = true;

            if ($isVisible) {
                $rows = $this->fieldRows($metaBoxModel->getFields());

                if (!empty($rows)) {
                    $tabClass = 'acpt-admin-vertical-tab '.$this->isActiveTab($metaBoxModel->getId(), $index, $this->termId).($isVisible ? '' : ' hidden');
                    $return .= '<div data-id="acpt_term_'.$this->termId.'_active_tab" class="'.$tabClass.'" data-target="'.$metaBoxModel->getId().'" data-conditional-rules-box-id="'.esc_attr($metaBoxModel->getId()).'">';
                    $return .= $metaBoxModel->getUiName();
                    $return .= '</div>';
                }
            }
        }

        $return .= '</div>';
        $return .= '<div class="acpt-admin-vertical-panels">';

        foreach ($this->groupModel->getBoxes() as $index => $metaBoxModel) {
            $isVisible = true;

            if ($isVisible) {
                $rows = $this->fieldRows($metaBoxModel->getFields());

                if (!empty($rows)) {
                    $panelClass = 'acpt-admin-vertical-panel '.($index === 0 ? 'active' : '').($isVisible ? '' : ' hidden');
                    $return .= '<div id="'.$metaBoxModel->getId().'" class="'.$panelClass.'" data-conditional-rules-box-id="'.esc_attr($metaBoxModel->getId()).'">';

                    foreach ($rows as $row) {
                        $return .= "<div class='acpt-admin-meta-row ".$this->isActiveTab($metaBoxModel->getId(), $index, $this->termId)."'>";

                        foreach ($row['fields'] as $field) {
                            $return .= $field;
                        }

                        $return .= "</div>";
                    }

                    $return .= '</div>';
                }
            }
        }

        $return .= '</div>';
        $return .= '</div>';

        return $return;
    }

    /**
     * @param array<int, \ACPT_Lite\Core\Models\Meta\MetaFieldModel> $fields
     *
     * @return array<int|string, array<string, mixed>>
     */
    private function fieldRows(array $fields): array
    {
        $rows = Fields::extractFieldRows($fields);
        $fieldRows = [];
        $visibleFieldsTotalCount = 0;

        // build the field rows array
        foreach ($rows as $index => $row) {
            $visibleFieldsRowCount = 0;

            foreach ($row as $field) {
                $fieldGenerator = new TaxonomyMetaBoxFieldGenerator($field, $this->termId);
                $taxonomyField = $fieldGenerator->generate();

                if ($taxonomyField) {
                    if ($taxonomyField->isVisible()) {
                        $visibleFieldsTotalCount++;
                        $visibleFieldsRowCount++;
                    }

                    $fieldRows[$index]['fields'][] = $taxonomyField->render();
                    $fieldRows[$index]['isVisible'] = $visibleFieldsRowCount;
                }
            }
        }

        if ($visibleFieldsTotalCount > 0) {
            return $fieldRows;
        }

        return [];
    }

    /**
     * @param string $id
     * @param int    $index
     * @param int|null $termId
     *
     * @return string
     */
    private function isActiveTab(string $id, int $index, ?int $termId = null): string
    {
        if (empty($termId)) {
            return ($index === 0 ? 'active' : '');
        }

        $activeTabId = $this->activeTabId($termId);

        if ($activeTabId !== null) {
            return ($activeTabId === $id) ? 'active' : '';
        }

        return ($index === 0 ? 'active' : '');
    }

    /**
     * @param int|null $termId
     * @return string|null
     */
    private function activeTabId(?int $termId = null): ?string
    {
        $activeTabId = 'acpt_term_'.$termId.'_active_tab';

        return Cookie::get($activeTabId);
    }
}
