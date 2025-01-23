<?php

namespace ACPT_Lite\Core\Generators\OptionPage;

use ACPT_Lite\Core\Generators\AbstractGenerator;
use ACPT_Lite\Core\Helper\Fields;
use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Meta\MetaBoxModel;

/**
 * *************************************************
 * OptionPageMetaBoxGenerator class
 * *************************************************
 *
 * @author Mauro Cassani
 * @link https://github.com/mauretto78/
 */
class OptionPageMetaBoxGenerator extends AbstractGenerator
{
	/**
	 * @var MetaBoxModel
	 */
	private MetaBoxModel $boxModel;

	/**
	 * @var string
	 */
	private $optionPageSlug;

	/**
	 * @var array
	 */
	private array $permissions;

	/**
	 * OptionPageMetaBoxGenerator constructor.
	 *
	 * @param MetaBoxModel $boxModel
	 * @param $optionPageSlug
	 * @param array $permissions
	 */
	public function __construct(MetaBoxModel $boxModel, $optionPageSlug, $permissions = [])
	{
		$this->boxModel = $boxModel;
		$this->optionPageSlug = $optionPageSlug;
		$this->permissions = $permissions;
	}

	/**
	 * @return string
	 */
	public function render()
	{
		$rows = $this->fieldRows($this->boxModel->getFields());

		if(empty($rows)){
			return null;
		}

		$boxLabel = (!empty($this->boxModel->getLabel())) ? $this->boxModel->getLabel() : $this->boxModel->getName();

		$return = '<div class="acpt-metabox acpt-postbox postbox" id="'.$this->getIdName().'">';
		$return .= '<div class="postbox-header">';
		$return .= '<h2 class="hnadle ui-sortable-handle">'.$boxLabel.'</h2>';
		$return .= '<div class="handle-actions hide-if-no-js">';
		$return .= '<button type="button" class="handlediv" aria-expanded="true">';
		$return .= '<span class="screen-reader-text">'.__('Activate/deactivate the panel', ACPT_PLUGIN_NAME).':</span>';
		$return .= '<span class="toggle-indicator acpt-toggle-indicator" data-target="'.$this->getIdName().'" aria-hidden="true"></span>';
		$return .= '</button>';
		$return .= '</div>';
		$return .= '</div>';
		$return .= '<div class="inside no-margin">';

		if(count($this->boxModel->getFields()) > 0) {
			$return .= '<div class="option-page-meta-fields-wrapper">';

			foreach ($rows as $row){
				$return .= "<div class='acpt-admin-meta-row ".($row['isVisible'] == 0 ? ' hidden' : '')."'>";

				foreach ($row['fields'] as $field){
					$return .= $field;
				}

				$return .= "</div>";
			}

			$return .= '</div>';
		}

		$return .= '</div>';
		$return .= '</div>';

		return $return;
	}

	/**
	 * @return string
	 */
	protected function getIdName()
	{
		$idName = Strings::toDBFormat($this->boxModel->getName()).'_'.$this->boxModel->getId();

		return esc_html($idName);
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
				$fieldGenerator = new OptionPageMetaBoxFieldGenerator($field, $this->optionPageSlug, $this->permissions);
				$optionPageField = $fieldGenerator->generate();

				if($optionPageField){
					if($optionPageField->isVisible()){
						$visibleFieldsTotalCount++;
						$visibleFieldsRowCount++;
					}

					$fieldRows[$index]['fields'][] = $optionPageField->render();
					$fieldRows[$index]['isVisible'] = $visibleFieldsRowCount;
				}
			}
		}

		return $fieldRows;
	}
}