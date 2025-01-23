<?php

namespace ACPT_Lite\Core\Generators\User;

use ACPT_Lite\Constants\MetaGroupDisplay;
use ACPT_Lite\Core\Generators\AbstractGenerator;
use ACPT_Lite\Core\Helper\Fields;
use ACPT_Lite\Core\Models\Meta\MetaGroupModel;

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
	public function render()
	{
		switch ($this->groupModel->getDisplay()){
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
	 * @return string
	 */
	private function standardView()
	{
		$return = '';

		foreach ($this->groupModel->getBoxes() as $boxModel){

			$rows = $this->fieldRows($boxModel->getFields());

			if(!empty($rows)){
				$return .= '<div class="acpt-metabox acpt-user-meta-box">';
				$return .= '<h3>'. ((!empty($boxModel->getLabel())) ? $boxModel->getLabel() : $boxModel->getName()) . '</h3>';
				$return .= '<div class="acpt-user-meta-box-wrapper" id="user-meta-box-'. $boxModel->getId().'">';

				foreach ($rows as $row){
					$return .= "<div class='acpt-admin-meta-row ".($row['isVisible'] == 0 ? ' hidden' : '')."'>";

					foreach ($row['fields'] as $field){
						$return .= $field;
					}

					$return .= "</div>";
				}

				$return .= '</div>';
				$return .= '</div>';
			}
		}

		return $return;
	}

	/**
	 * @return string
	 */
	private function accordion()
	{
		$return = '<div class="acpt-admin-accordion-wrapper" style="max-width: 1400px;" id="'.$this->groupModel->getId().'">';

		foreach ($this->groupModel->getBoxes() as $index => $metaBoxModel){

			$rows = $this->fieldRows($metaBoxModel->getFields());

			if(!empty($rows)){
				$return .= '<div class="acpt-metabox acpt-admin-accordion-item '.($index === 0 ? 'active' : '').'" data-target="'.$metaBoxModel->getId().'">';
				$return .= '<div class="acpt-admin-accordion-title">';
				$return .= $metaBoxModel->getUiName();
				$return .= '</div>';

				$return .= '<div id="'.$metaBoxModel->getId().'" class="acpt-admin-accordion-content">';
				$return .= '<div class="acpt-user-meta-box-wrapper" id="user-meta-box-'. $metaBoxModel->getId().'">';

				foreach ($rows as $row){
					$return .= "<div class='acpt-admin-meta-row ".($row['isVisible'] == 0 ? ' hidden' : '')."'>";

					foreach ($row['fields'] as $field){
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
	private function verticalTabs()
	{
		$return = '<div class="acpt-metabox acpt-admin-vertical-tabs-wrapper" id="'.$this->groupModel->getId().'" style="max-width: 1400px;">';
		$return .= '<div class="acpt-admin-vertical-tabs">';

		foreach ($this->groupModel->getBoxes() as $index => $metaBoxModel){
			$rows = $this->fieldRows($metaBoxModel->getFields());

			if(!empty($rows)){
				$return .= '<div class="acpt-admin-vertical-tab '.($index === 0 ? 'active' : '').'" data-target="'.$metaBoxModel->getId().'">';
				$return .= $metaBoxModel->getUiName();
				$return .= '</div>';
			}
		}

		$return .= '</div>';
		$return .= '<div class="acpt-admin-vertical-panels">';

		foreach ($this->groupModel->getBoxes() as $index => $metaBoxModel){

			$rows = $this->fieldRows($metaBoxModel->getFields());

			if(!empty($rows)){
				$return .= '<div id="'.$metaBoxModel->getId().'" class="acpt-admin-vertical-panel '.($index === 0 ? 'active' : '').'">';

				foreach ($rows as $row){
					$return .= "<div class='acpt-admin-meta-row ".($row['isVisible'] == 0 ? ' hidden' : '')."'>";

					foreach ($row['fields'] as $field){
						$return .= $field;
					}

					$return .= "</div>";
				}

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
	private function horizontalTabs()
	{
		$return = '<div class="acpt-metabox acpt-admin-horizontal-tabs-wrapper" id="'.$this->groupModel->getId().'">';
		$return .= '<div class="acpt-admin-horizontal-tabs">';

		foreach ($this->groupModel->getBoxes() as $index => $metaBoxModel){
			$rows = $this->fieldRows($metaBoxModel->getFields());

			if(!empty($rows)){
				$return .= '<div class="acpt-admin-horizontal-tab '.($index === 0 ? 'active' : '').'" data-target="'.$metaBoxModel->getId().'">';
				$return .= $metaBoxModel->getUiName();
				$return .= '</div>';
			}
		}

		$return .= '</div>';
		$return .= '<div class="acpt-admin-horizontal-panels" style="max-width: 1400px;">';

		foreach ($this->groupModel->getBoxes() as $index => $metaBoxModel){
			$rows = $this->fieldRows($metaBoxModel->getFields());

			if(!empty($rows)){
				$return .= '<div id="'.$metaBoxModel->getId().'" class="acpt-admin-horizontal-panel '.($index === 0 ? 'active' : '').'">';

				foreach ($rows as $row){
					$return .= "<div class='acpt-admin-meta-row ".($row['isVisible'] == 0 ? ' hidden' : '')."'>";

					foreach ($row['fields'] as $field){
						$return .= $field;
					}

					$return .= "</div>";
				}

				$return .= '</div>';
			}
		}

		$return .= '</div>';
		$return .= '</div>';

		return $return;
	}

	/**
	 * @param $fields
	 *
	 * @return array
	 */
	private function fieldRows($fields)
	{
		$rows = Fields::extractFieldRows($fields);
		$fieldRows = [];
		$visibleFieldsTotalCount = 0;

		// build the field rows array
		foreach ($rows as $index => $row){

			$visibleFieldsRowCount = 0;

			foreach ($row as $field){
				$userFieldGenerator = new UserMetaFieldGenerator($field, $this->user);
				$userField = $userFieldGenerator->generate();

				if($userField){
					if($userField->isVisible()){
						$visibleFieldsTotalCount++;
						$visibleFieldsRowCount++;
					}

					$fieldRows[$index]['fields'][] = $userField->render();
					$fieldRows[$index]['isVisible'] = $visibleFieldsRowCount;
				}
			}
		}

		if($visibleFieldsTotalCount > 0){
			return $fieldRows;
		}

		return [];
	}
}
