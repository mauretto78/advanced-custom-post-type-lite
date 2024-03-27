<?php

namespace ACPT_Lite\Core\Generators\User;

use ACPT_Lite\Constants\MetaGroupDisplay;
use ACPT_Lite\Core\CQRS\Command\SaveUserMetaCommand;
use ACPT_Lite\Core\Generators\AbstractGenerator;
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
			$return .= '<div class="acpt-user-meta-box">';
			$return .= '<h3>'. ((!empty($boxModel->getLabel())) ? $boxModel->getLabel() : $boxModel->getName()) . '</h3>';
			$return .= '<table class="form-table" id="user-meta-box-'. $boxModel->getId().'">';

			foreach ($boxModel->getFields() as $fieldModel) {
				$userFieldGenerator = new UserMetaFieldGenerator($fieldModel, $this->user);
				$return .= $userFieldGenerator->generate();
			}

			$return .= '</table>';
			$return .= '</div>';
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
			$return .= '<div class="acpt-admin-accordion-item '.($index === 0 ? 'active' : '').'" data-target="'.$metaBoxModel->getId().'">';
			$return .= '<div class="acpt-admin-accordion-title">';
			$return .= $metaBoxModel->getUiName();
			$return .= '</div>';

			$return .= '<div id="'.$metaBoxModel->getId().'" class="acpt-admin-accordion-content">';

			$return .= '<div class="acpt-user-meta-box no-borders">';
			$return .= '<table class="form-table" id="user-meta-box-'. $metaBoxModel->getId().'">';

			foreach ($metaBoxModel->getFields() as $fieldModel){
				$taxonomyMetaBoxFieldGenerator = new UserMetaFieldGenerator($fieldModel, $this->user);
				$return .= $taxonomyMetaBoxFieldGenerator->generate();
			}

			$return .= '</table>';
			$return .= '</div>';

			$return .= '</div>';
			$return .= '</div>';
		}

		$return .= '</div>';


		return $return;
	}

	/**
	 * @return string
	 */
	private function verticalTabs()
	{
		$return = '<div class="acpt-admin-vertical-tabs-wrapper" id="'.$this->groupModel->getId().'">';

		$return .= '<div class="acpt-admin-vertical-tabs">';
		foreach ($this->groupModel->getBoxes() as $index => $metaBoxModel){
			$return .= '<div class="acpt-admin-vertical-tab '.($index === 0 ? 'active' : '').'" data-target="'.$metaBoxModel->getId().'">';
			$return .= $metaBoxModel->getUiName();
			$return .= '</div>';
		}
		$return .= '</div>';

		$return .= '<div class="acpt-admin-vertical-panels" style="max-width: 1400px;">';
		foreach ($this->groupModel->getBoxes() as $index => $metaBoxModel){
			$return .= '<div id="'.$metaBoxModel->getId().'" class="acpt-admin-vertical-panel '.($index === 0 ? 'active' : '').'">';
			$return .= '<div class="acpt-user-meta-box no-borders">';
			$return .= '<table class="form-table" id="user-meta-box-'. $metaBoxModel->getId().'">';

			foreach ($metaBoxModel->getFields() as $fieldModel){
				$taxonomyMetaBoxFieldGenerator = new UserMetaFieldGenerator($fieldModel, $this->user);
				$return .= $taxonomyMetaBoxFieldGenerator->generate();
			}

			$return .= '</table>';
			$return .= '</div>';
			$return .= '</div>';
		}

		$return .= '</div>';
		$return .= '</div>';

		return $return;
	}

	private function horizontalTabs()
	{
		$return = '<div class="acpt-admin-horizontal-tabs-wrapper" id="'.$this->groupModel->getId().'">';

		$return .= '<div class="acpt-admin-horizontal-tabs">';
		foreach ($this->groupModel->getBoxes() as $index => $metaBoxModel){
			$return .= '<div class="acpt-admin-horizontal-tab '.($index === 0 ? 'active' : '').'" data-target="'.$metaBoxModel->getId().'">';
			$return .= $metaBoxModel->getUiName();
			$return .= '</div>';
		}
		$return .= '</div>';

		$return .= '<div class="acpt-admin-horizontal-panels" style="max-width: 1400px;">';
		foreach ($this->groupModel->getBoxes() as $index => $metaBoxModel){
			$return .= '<div id="'.$metaBoxModel->getId().'" class="acpt-admin-horizontal-panel '.($index === 0 ? 'active' : '').'">';
			$return .= '<div class="acpt-user-meta-box no-borders">';
			$return .= '<table class="form-table" id="user-meta-box-'. $metaBoxModel->getId().'">';

			foreach ($metaBoxModel->getFields() as $fieldModel) {
				$userFieldGenerator = new UserMetaFieldGenerator($fieldModel, $this->user);
				$return .= $userFieldGenerator->generate();
			}

			$return .= '</table>';
			$return .= '</div>';
			$return .= '</div>';
		}

		$return .= '</div>';
		$return .= '</div>';

		return $return;
	}


}