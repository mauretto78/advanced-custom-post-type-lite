<?php

namespace ACPT_Lite\Core\Generators\Attachment;

use ACPT_Lite\Core\CQRS\Command\SaveCustomPostTypeMetaCommand;
use ACPT_Lite\Core\Generators\AbstractGenerator;
use ACPT_Lite\Core\Helper\Fields;
use ACPT_Lite\Core\Models\Meta\MetaBoxModel;

class AttachmentMetaBoxGenerator extends AbstractGenerator
{
	/**
	 * @var MetaBoxModel
	 */
	private MetaBoxModel $boxModel;

	/**
	 * @var array
	 */
	private $attachmentIds;

	/**
	 * AttachmentMetaGroupGenerator constructor.
	 *
	 * @param MetaBoxModel $boxModel
	 * @param $attachmentIds
	 */
	public function __construct(MetaBoxModel $boxModel, $attachmentIds)
	{
		$this->boxModel = $boxModel;
		$this->attachmentIds = $attachmentIds;
	}

	/**
	 * Generate meta boxes related to attachments
	 */
	public function generate()
	{
		add_filter( 'attachment_fields_to_edit', [$this, 'render'], 10, 2 );
		add_action( 'edit_attachment', [$this, 'save'] );
	}

	/**
	 * @param $form_fields
	 * @param $post
	 *
	 * @return mixed
	 * @throws \Exception
	 */
	public function render($form_fields, $post)
	{
		if(in_array($post->ID, $this->attachmentIds)){

			$rows = $this->fieldRows($this->boxModel->getFields(), $post->ID);

			if(!empty($rows)){
				$html = '<div data-box-label="'.$this->boxModel->getUiName().'" class="acpt-metabox attachment-meta-fields">';

				foreach ($rows as $row){
                    $html .= "<div class='acpt-admin-meta-row ".($row['isVisible'] == 0 ? ' hidden' : '')."'>";

                    foreach ($row['fields'] as $field){
                        $html .= $field;
                    }

                    $html .= "</div>";
				}

				$html .= '</div>';

				$form_fields[$this->boxModel->getName()] = [
					'label' => $this->boxModel->getUiName(),
					'input' => 'html',
					'html'  => $html,
				];
			}

			return $form_fields;
		}
	}

	/**
	 * @param $attachmentId
	 *
	 * @throws \Exception
	 */
	public function save($attachmentId)
	{
		if(!empty($_POST)){
			$command = new SaveCustomPostTypeMetaCommand($attachmentId, [$this->boxModel->getGroup()], $_POST);
			$command->execute();
		}
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
				$fieldGenerator = new AttachmentMetaFieldGenerator($field, $postId);
				$attachmentField = $fieldGenerator->generate();

				if($attachmentField){
					if($attachmentField->isVisible() and $attachmentField->render() !== null){
						$visibleFieldsTotalCount++;
						$visibleFieldsRowCount++;
					}

					$fieldRows[$index]['fields'][] = $attachmentField->render();
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