<?php

namespace ACPT_Lite\Core\Generators\CustomPostType;

use ACPT_Lite\Core\Generators\AbstractGenerator;
use ACPT_Lite\Core\Helper\Fields;
use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Meta\MetaBoxModel;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;

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
	 * @param $postTypeName
	 * @param array $formFields
	 * @param null $postId
	 */
    public function addMetaBox(MetaBoxModel $metaBoxModel, $postTypeName, $formFields = [], $postId = null)
    {
        // end update_edit_form
        add_action('post_edit_form_tag', function() {
            echo ' enctype="multipart/form-data"';
        });

        $this->adminInit(function() use($metaBoxModel, $formFields, $postTypeName, $postId) {

			if(
				$postId === null or
				(isset($_GET['post']) and $_GET['post'] == $postId) or
				(isset($_GET['id']) and $_GET['id'] == $postId)
			){
				$boxLabel = (!empty($metaBoxModel->getLabel())) ? $metaBoxModel->getLabel() : $metaBoxModel->getName();
				$idBox = 'acpt_metabox_'. Strings::toDBFormat($metaBoxModel->getName());
				$rows = $this->fieldRows($metaBoxModel->getFields(), $postId);
                $postTypeName = $this->getPostTypeName($postTypeName);

				if(!empty($rows)){
					add_meta_box(
						$idBox,
						$boxLabel,
						function($post, $data) use ($rows) {

							foreach ($rows as $row){
								echo "<div class='acpt-admin-meta-row ".($row['isVisible'] == 0 ? ' hidden' : '')."'>";

								foreach ($row['fields'] as $field){
									echo $field;
								}

								echo "</div>";
							}
						},
						strtolower($postTypeName),
						($metaBoxModel->getGroup()->getContext() !== null ? $metaBoxModel->getGroup()->getContext() : 'normal'),
						($metaBoxModel->getGroup()->getPriority() !== null ? $metaBoxModel->getGroup()->getPriority() : 'high'),
						[$formFields]
					);

					add_filter('postbox_classes_'.strtolower($postTypeName).'_'.$idBox, function($classes) {

						array_push($classes,'acpt-metabox');

						return $classes;
					});
				}
			}
        });
    }

	/**
	 * @param $fields
	 * @param $postId
	 *
	 * @return array
	 * @throws \Exception
	 */
	private function fieldRows($fields, $postId = null)
	{
		$rows = Fields::extractFieldRows($fields);
		$fieldRows = [];
		$visibleFieldsTotalCount = 0;

		// build the field rows array
		foreach ($rows as $index => $row){

			$visibleFieldsRowCount = 0;

			foreach ($row as $field){
			    if($field instanceof MetaFieldModel){
                    $fieldGenerator = CustomPostTypeMetaBoxFieldGenerator::generate($field, $postId);

                    if($fieldGenerator){
                        if($fieldGenerator->isVisible()){
                            $visibleFieldsTotalCount++;
                            $visibleFieldsRowCount++;
                        }

                        $fieldRows[$index]['fields'][] = $fieldGenerator->render();
                        $fieldRows[$index]['isVisible'] = $visibleFieldsRowCount;
                    }
                }
			}
		}

		if($visibleFieldsTotalCount > 0){
			return $fieldRows;
		}

		return [];
	}
}

