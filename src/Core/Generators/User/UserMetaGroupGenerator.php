<?php

namespace ACPT_Lite\Core\Generators\User;

use ACPT_Lite\Constants\MetaGroupDisplay;
use ACPT_Lite\Core\Generators\AbstractGenerator;
use ACPT_Lite\Core\Helper\Fields;
use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Meta\MetaBoxModel;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Core\Models\Meta\MetaGroupModel;
use ACPT_Lite\Utils\PHP\Cookie;

/**
 * *************************************************
 * UserMetaBoxGenerator class
 * *************************************************
 *
 * @author Mauro Cassani
 * @link https://github.com/mauretto78/
 */
class UserMetaGroupGenerator extends AbstractGenerator
{
    /**
     * @var MetaGroupModel
     */
    private MetaGroupModel $groupModel;

    /**
     * @var \WP_User
     */
    private \WP_User $user;

    /**
     * UserMetaGroupGenerator constructor.
     *
     * @param MetaGroupModel $groupModel
     * @param \WP_User $user
     */
    public function __construct(MetaGroupModel $groupModel, \WP_User $user)
    {
        $this->groupModel = $groupModel;
        $this->user = $user;
    }

    /**
     * @return string
     */
    public function render(): string
    {
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
    protected function getIdName(MetaBoxModel $boxModel): string
    {
        $idName = Strings::toDBFormat($boxModel->getName()).'_'.$boxModel->getId();

        return esc_html($idName);
    }

    /**
     * @return string
     */
    private function standardView(): string
    {
        $return = '<div class="meta-box-sortables">';
        $return .= '<div class="metabox-holder">';

        foreach ($this->groupModel->getBoxes() as $boxModel) {
            $userId = $this->user->ID;
            $rows = $this->fieldRows($boxModel->getFields());
            $hideTitle = $boxModel->getSetting("hide_title") ? true : false;
            $hideToggle = $boxModel->getSetting("hide_toggle") ? true : false;
            if (!empty($rows)) {

                // COOKIES
                $className = 'acpt-metabox acpt-user-meta-box user-'.$userId.' postbox';
                $cookieName = 'acpt-metabox_acpt-user-meta-box_user-'.$userId.'_postbox_closed';
                if (isset($_COOKIE[$cookieName]) && $_COOKIE[$cookieName] == 1) {
                    $className .= ' closed';
                }

                $return .= '<div class="'.$className.'" id="'.$this->getIdName($boxModel).'" data-conditional-rules-box-id="'.esc_attr($boxModel->getId()).'">';
                $return .= '<div class="postbox-header">';

                if ($hideTitle === false) {
                    $return .= '<h3 class="hndle ui-sortable-handle">'. $this->metaBoxHeading($boxModel) . '</h3>';
                }

                if ($hideToggle === false) {
                    $return .= '<div class="handle-actions hide-if-no-js">';
                    $return .= '<button type="button" class="handlediv" aria-expanded="true">';
                    $return .= '<span class="screen-reader-text">'.__('Activate/deactivate the panel', ACPT_LITE_PLUGIN_NAME).':</span>';
                    $return .= '<span class="toggle-indicator acpt-toggle-indicator" data-target="'.$this->getIdName($boxModel).'" aria-hidden="true"></span>';
                    $return .= '</button>';
                    $return .= '</div>';
                }

                $return .= "</div>";
                $return .= '<div class="acpt-user-meta-box-wrapper inside no-margin" id="user-meta-box-'. $boxModel->getId().'">';

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
        $return .= '</div>';

        return $return;
    }

    /**
     * @return string
     */
    private function accordion(): string
    {
        $return = '<div class="acpt-admin-accordion-wrapper" style="max-width: 1400px;" id="'.$this->groupModel->getId().'">';

        foreach ($this->groupModel->getBoxes() as $index => $metaBoxModel) {
            $userId = $this->user->ID;
            $rows = $this->fieldRows($metaBoxModel->getFields());

            if (!empty($rows)) {
                $itemClass = 'acpt-metabox acpt-admin-accordion-item '.$this->isActiveTab($metaBoxModel->getId(), $index, $userId).('');
                $return .= '<div data-id="acpt_user_'.$userId.'_active_tab" class="'.$itemClass.'" data-target="'.$metaBoxModel->getId().'" data-conditional-rules-box-id="'.esc_attr($metaBoxModel->getId()).'">';
                $return .= '<div class="acpt-admin-accordion-title">';
                $return .= $this->metaBoxHeading($metaBoxModel);
                $return .= '</div>';

                $return .= '<div id="'.$metaBoxModel->getId().'" class="acpt-admin-accordion-content">';
                $return .= '<div class="acpt-user-meta-box-wrapper" id="user-meta-box-'. $metaBoxModel->getId().'">';

                foreach ($rows as $row) {
                    $return .= "<div class='acpt-admin-meta-row ".$this->isActiveTab($metaBoxModel->getId(), $index, $userId)."'>";

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
    private function verticalTabs(): string
    {
        $userId = $this->user->ID;

        $return = '<div class="acpt-admin-vertical-tabs-btn-wrapper" style="max-width: 1400px;">';
        $return .= $this->metaBoxEditLinkButtonOrEmpty($this->groupModel->getBoxById($this->activeTabId($userId)) ?? ($this->groupModel->getBoxes()[0] ?? null));
        $return .= '</div>';
        $return .= '<div class="acpt-metabox acpt-admin-vertical-tabs-wrapper" id="'.$this->groupModel->getId().'" style="max-width: 1400px;">';
        $return .= '<div class="acpt-admin-vertical-tabs">';

        foreach ($this->groupModel->getBoxes() as $index => $metaBoxModel) {
            $isVisible = true;

            if ($isVisible) {
                $rows = $this->fieldRows($metaBoxModel->getFields());

                if (!empty($rows)) {
                    $tabClass = 'acpt-admin-vertical-tab '.$this->isActiveTab($metaBoxModel->getId(), $index, $userId).($isVisible ? '' : ' hidden');
                    $return .= '<div data-id="acpt_user_'.$userId.'_active_tab" class="'.$tabClass.'" data-target="'.$metaBoxModel->getId().'" data-conditional-rules-box-id="'.esc_attr($metaBoxModel->getId()).'">';
                    $return .= $metaBoxModel->getUiName();
                    $return .= '</div>';
                }
            }
        }

        $return .= '</div>';
        $return .= '<div class="acpt-admin-vertical-panels">';

        foreach ($this->groupModel->getBoxes() as $index => $metaBoxModel) {
            $userId = $this->user->ID;
            $isVisible = true;

            if ($isVisible) {
                $rows = $this->fieldRows($metaBoxModel->getFields());

                if (!empty($rows)) {
                    $panelClass = 'acpt-admin-vertical-panel '.($index === 0 ? 'active' : '').($isVisible ? '' : ' hidden');
                    $return .= '<div id="'.$metaBoxModel->getId().'" class="'.$panelClass.'" data-conditional-rules-box-id="'.esc_attr($metaBoxModel->getId()).'">';

                    foreach ($rows as $row) {
                        $return .= "<div class='acpt-admin-meta-row ".$this->isActiveTab($metaBoxModel->getId(), $index, $userId)."'>";

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
    private function horizontalTabs(): string
    {
        $userId = $this->user->ID;

        $return = '<div class="acpt-metabox acpt-admin-horizontal-tabs-wrapper" id="'.$this->groupModel->getId().'">';
        $return .= '<div class="acpt-admin-horizontal-tabs-btn-wrapper" style="max-width: 1400px;">';
        $return .= '<div class="acpt-admin-horizontal-tabs">';

        foreach ($this->groupModel->getBoxes() as $index => $metaBoxModel) {
            $userId = $this->user->ID;
            $isVisible = true;

            if ($isVisible) {
                $rows = $this->fieldRows($metaBoxModel->getFields());

                if (!empty($rows)) {
                    $tabClass = 'acpt-admin-horizontal-tab '.$this->isActiveTab($metaBoxModel->getId(), $index, $userId).($isVisible ? '' : ' hidden');
                    $return .= '<div data-id="acpt_user_'.$userId.'_active_tab" class="'.$tabClass.'" data-target="'.$metaBoxModel->getId().'" data-conditional-rules-box-id="'.esc_attr($metaBoxModel->getId()).'">';
                    $return .= $metaBoxModel->getUiName();
                    $return .= '</div>';
                }
            }
        }

        $return .= '</div>';
        $return .= $this->metaBoxEditLinkButtonOrEmpty($this->groupModel->getBoxById($this->activeTabId($userId)) ?? ($this->groupModel->getBoxes()[0] ?? null));
        $return .= '</div>';
        $return .= '<div class="acpt-admin-horizontal-panels" style="max-width: 1400px;">';

        foreach ($this->groupModel->getBoxes() as $index => $metaBoxModel) {
            $isVisible = true;

            if ($isVisible) {
                $rows = $this->fieldRows($metaBoxModel->getFields());

                if (!empty($rows)) {
                    $panelClass = 'acpt-admin-horizontal-panel '.($index === 0 ? 'active' : '').($isVisible ? '' : ' hidden');
                    $return .= '<div id="'.$metaBoxModel->getId().'" class="'.$panelClass.'" data-conditional-rules-box-id="'.esc_attr($metaBoxModel->getId()).'">';

                    foreach ($rows as $row) {
                        $return .= "<div class='acpt-admin-meta-row ".$this->isActiveTab($metaBoxModel->getId(), $index, $userId)."'>";

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
     * @param array<int, MetaFieldModel> $fields
     *
     * @return array<int, mixed>
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
                $userFieldGenerator = new UserMetaFieldGenerator($field, $this->user);
                $userField = $userFieldGenerator->generate();

                if ($userField) {
                    if ($userField->isVisible()) {
                        $visibleFieldsTotalCount++;
                        $visibleFieldsRowCount++;
                    }

                    $fieldRows[$index]['fields'][] = $userField->render();
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
     * @param int $index
     * @param int|null $userId
     *
     * @return string
     */
    private function isActiveTab(string $id, int $index, ?int $userId = null): string
    {
        if (empty($userId)) {
            return ($index === 0 ? 'active' : '');
        }

        $activeTabId = $this->activeTabId($userId);

        if ($activeTabId !== null) {
            return ($activeTabId === $id) ? 'active' : '';
        }

        return ($index === 0 ? 'active' : '');
    }

    /**
     * @param int|null $userId
     * @return string|null
     */
    private function activeTabId(?int $userId = null): ?string
    {
        $activeTabId = 'acpt_user_'.$userId.'_active_tab';

        return Cookie::get($activeTabId);
    }
}
