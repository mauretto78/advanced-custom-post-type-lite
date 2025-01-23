<?php

namespace ACPT_Lite\Core\Generators\Meta\Fields;

use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Utils\Wordpress\Translator;

class ListField extends AbstractField
{
	/**
	 * @return mixed|string
	 * @throws \Exception
	 */
	public function render()
	{
		$this->enqueueAssets();
		$id = Strings::generateRandomId();

		if ( $this->isChild() or $this->isNestedInABlock() ) {
			$field = '<input type="hidden" name="' . esc_attr( $this->getIdName() ) . '[type]" value="' . MetaFieldModel::LIST_TYPE . '">';
			$field .= '<input type="hidden" name="' . esc_attr( $this->getIdName() ) . '[original_name]" value="' . $this->metaField->getName() . '">';
			$field .= $this->renderList($id, $this->getIdName().'[value]');
		} else {
			$field = '<input type="hidden" name="' . esc_attr( $this->getIdName() ) . '_type" value="' . MetaFieldModel::LIST_TYPE . '">';
			$field .= $this->renderList($id, $this->getIdName());
		}

		return $this->renderField( $field );
	}

	/**
	 * @param $id
	 * @param $fieldName
	 *
	 * @return string
	 */
	private function renderList($id, $fieldName)
	{
		$field = '<div class="acpt-table-responsive">';
		$field .= '<table class="acpt-table">';
		$field .= '<tbody id="acpt-sortable-'.$id.'" class="acpt-sortable list-wrapper">';

		if ( is_array( $this->getDefaultValue() ) and ! empty( $this->getDefaultValue() ) ) {
			foreach ( $this->getDefaultValue() as $i => $value ) {

				$field .= '<tr id="'.esc_attr( $fieldName ).'_'.$i.'" class="list-element sortable-li sortable-li-'.$id.'">';
				$field .= '<td width="20">
							<div class="handle">
			                    .<br/>.<br/>.
			                </div>
	                	</td>';
				$field .= '<td><input ' . $this->required() . ' id="' . esc_attr( $fieldName ) . '_' . $i . '" name="' . esc_attr( $fieldName ) . '[]" type="text" class="acpt-form-control list-element" value="' . esc_attr( $value ) . '"></td>';
				$field .= '<td width="100"><a class="list-remove-element button-danger" data-target-id="' . esc_attr( $fieldName ) . '_' . $i . '" href="#">' . Translator::translate( "Remove element" ) . '</a></td>';
				$field .= '</tr>';
			}
		}

		$field .= '</tbody>';
		$field .= '</table>';
		$field .= '<a 
					class="list-add-element button small" 
					data-target-id="'.$id.'"
					data-parent-name="'.$fieldName.'"
					href="#"
				>
					' . Translator::translate( 'Add element' ) . '
				</a>';

		$field .= '</div>';

		return $field;
	}



	/**
	 * Enqueue necessary assets
	 * @throws \Exception
	 */
	private function enqueueAssets()
	{
		wp_enqueue_script( 'html5sortable', plugins_url( 'advanced-custom-post-type/assets/vendor/html5sortable/dist/html5sortable.min.js'), [], '2.2.0', true );
	}
}

