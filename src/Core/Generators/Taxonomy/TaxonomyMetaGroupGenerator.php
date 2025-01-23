<?php

namespace ACPT_Lite\Core\Generators\Taxonomy;

use ACPT_Lite\Constants\MetaGroupDisplay;
use ACPT_Lite\Core\Generators\AbstractGenerator;
use ACPT_Lite\Core\Helper\Fields;
use ACPT_Lite\Core\Models\Meta\MetaGroupModel;

class TaxonomyMetaGroupGenerator extends AbstractGenerator
{
	/**
	 * @var MetaGroupModel
	 */
	private MetaGroupModel $groupModel;

	/**
	 * @var string
	 */
	private $taxonomy;

	/**
	 * @var mixed
	 */
	private $termId;

	/**
	 * OptionPageMetaBoxGenerator constructor.
	 *
	 * @param MetaGroupModel $groupModel
	 * @param $taxonomy
	 * @param null $termId
	 */
	public function __construct(MetaGroupModel $groupModel, $taxonomy, $termId = null)
	{
		$this->groupModel = $groupModel;
		$this->taxonomy = $taxonomy;
		$this->termId = $termId;
	}

	/**
	 * @return string
	 */
	public function render()
	{
		if(empty($this->groupModel->getBoxes())){
			return null;
		}

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
		$return = '<div class="acpt-metabox taxonomy-meta-box-group" id="'.$this->groupModel->getId().'">';

		wp_editor('', 'no-show'); // Hack for enqueuing WP Editor

		foreach ($this->groupModel->getBoxes() as $index => $metaBoxModel){

			$rows = $this->fieldRows($metaBoxModel->getFields());

			if(!empty($rows)){
				$return .= '<h3 class="taxonomy-meta-box-group-title">'.$metaBoxModel->getUiName().'</h3>';
				$return .= '<div class="taxonomy-meta-fields">';

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

		return $return;
	}

	/**
	 * @return string
	 */
	private function accordion()
	{
		$return = '<div class="acpt-metabox acpt-admin-accordion-wrapper" id="'.$this->groupModel->getId().'">';

		foreach ($this->groupModel->getBoxes() as $index => $metaBoxModel){

			$rows = $this->fieldRows($metaBoxModel->getFields());

			if(!empty($rows)){
				$return .= '<div class="acpt-admin-accordion-item '.($index === 0 ? 'active' : '').'" data-target="'.$metaBoxModel->getId().'">';
				$return .= '<div class="acpt-admin-accordion-title">';
				$return .= $metaBoxModel->getUiName();
				$return .= '</div>';

				$return .= '<div id="'.$metaBoxModel->getId().'" class="acpt-admin-accordion-content">';
				$return .= '<div class="taxonomy-meta-fields">';

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

		$return .= '<div class="acpt-admin-horizontal-panels">';
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
	 * @return string
	 */
	private function verticalTabs()
	{
		$return = '<div class="acpt-metabox acpt-admin-vertical-tabs-wrapper" id="'.$this->groupModel->getId().'">';

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
				$fieldGenerator = new TaxonomyMetaBoxFieldGenerator($field, $this->termId);
				$taxonomyField = $fieldGenerator->generate();

				if($taxonomyField){
					if($taxonomyField->isVisible()){
						$visibleFieldsTotalCount++;
						$visibleFieldsRowCount++;
					}

					$fieldRows[$index]['fields'][] = $taxonomyField->render();
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