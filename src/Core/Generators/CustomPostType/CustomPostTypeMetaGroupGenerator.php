<?php

namespace ACPT_Lite\Core\Generators\CustomPostType;

use ACPT_Lite\Constants\MetaGroupDisplay;
use ACPT_Lite\Core\Generators\AbstractGenerator;
use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Core\Models\Meta\MetaGroupModel;

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
	private $postTypeName;

	/**
	 * @var null
	 */
	private $postId;

	/**
	 * CustomPostTypeMetaGroupGenerator constructor.
	 *
	 * @param MetaGroupModel $groupModel
	 * @param $postTypeName
	 * @param $postId
	 */
	public function __construct( MetaGroupModel $groupModel, $postTypeName, $postId = null )
	{
		$this->groupModel   = $groupModel;
		$this->postTypeName = $postTypeName;
		$this->postId       = $postId;
	}

	/**
	 * @return string
	 */
	public function render()
	{
		switch ($this->groupModel->getDisplay()){
			default:
			case MetaGroupDisplay::STANDARD:
			case MetaGroupDisplay::ACCORDION:
				$this->standardView();
				break;

			case MetaGroupDisplay::VERTICAL_TABS:
				return $this->verticalTabs();
				break;

			case MetaGroupDisplay::HORIZONTAL_TABS:
				return $this->horizontalTabs();
				break;
		}
	}

	/**
	 * Standard view
	 */
	private function standardView()
	{
		$metaBoxGenerator = new CustomPostTypeMetaBoxGenerator();

		foreach ($this->groupModel->getBoxes() as $metaBoxModel){

			$metaFields = [];

			foreach ($metaBoxModel->getFields() as $fieldModel){
				$metaFields[] = $this->generateMetaBoxFieldArray($fieldModel);
			}

			$metaBoxGenerator->addMetaBox($metaBoxModel, $this->postTypeName, $metaFields, $this->postId);
		}
	}

	private function verticalTabs()
	{
// end update_edit_form
		add_action('post_edit_form_tag', function() {
			echo ' enctype="multipart/form-data"';
		});

		$this->adminInit(function() {

			if(
				$this->postId === null or
				(isset($_GET['post']) and $_GET['post'] == $this->postId)
			){
				$boxLabel = (!empty($this->groupModel->getLabel())) ? $this->groupModel->getLabel() : $this->groupModel->getName();
				$idBox = 'acpt_metabox_'. Strings::toDBFormat($this->groupModel->getName());

				$metaFields = [];

				foreach ($this->groupModel->getBoxes() as $metaBoxModel){
					foreach ($metaBoxModel->getFields() as $fieldModel){
						$metaFields[] = $this->generateMetaBoxFieldArray($fieldModel);
					}
				}

				add_meta_box(
					$idBox,
					$boxLabel,
					function($post, $data) {
						?>
                        <div class="acpt-admin-vertical-tabs-wrapper" id="<?php echo $this->groupModel->getId(); ?>">
                            <div class="acpt-admin-vertical-tabs">
								<?php foreach ($this->groupModel->getBoxes() as $index => $metaBoxModel): ?>
                                    <div class="acpt-admin-vertical-tab  with-borders <?php echo $index === 0 ? 'active' : ''; ?>" data-target="<?php echo $metaBoxModel->getId(); ?>">
										<?php echo $metaBoxModel->getUiName(); ?>
                                    </div>
								<?php endforeach; ?>
                            </div>
                            <div class="acpt-admin-vertical-panels">
								<?php foreach ($this->groupModel->getBoxes() as $index => $metaBoxModel): ?>
                                    <div id="<?php echo $metaBoxModel->getId(); ?>" class="acpt-admin-vertical-panel with-borders <?php echo $index === 0 ? 'active' : ''; ?>">
										<?php
										foreach ($metaBoxModel->getFields() as $fieldModel){
											CustomPostTypeMetaBoxFieldGenerator::generate($post->ID, $fieldModel);
										}
										?>
                                    </div>
								<?php endforeach; ?>
                            </div>
                        </div>
						<?php
					},
					strtolower($this->postTypeName),
					'advanced',
					'high',
					[$metaFields]
				);
			}
		});
	}

	/**
	 * Horizontal tabs
	 */
	private function horizontalTabs()
	{
		// end update_edit_form
		add_action('post_edit_form_tag', function() {
			echo ' enctype="multipart/form-data"';
		});

		$this->adminInit(function() {

			if(
				$this->postId === null or
				(isset($_GET['post']) and $_GET['post'] == $this->postId)
			){
				$boxLabel = (!empty($this->groupModel->getLabel())) ? $this->groupModel->getLabel() : $this->groupModel->getName();
				$idBox = 'acpt_metabox_'. Strings::toDBFormat($this->groupModel->getName());

				$metaFields = [];

				foreach ($this->groupModel->getBoxes() as $metaBoxModel){
					foreach ($metaBoxModel->getFields() as $fieldModel){
						$metaFields[] = $this->generateMetaBoxFieldArray($fieldModel);
					}
				}

				add_meta_box(
					$idBox,
					$boxLabel,
					function($post, $data) {
						?>
							<div class="acpt-admin-horizontal-tabs-wrapper" id="<?php echo $this->groupModel->getId(); ?>">
								<div class="acpt-admin-horizontal-tabs">
									<?php foreach ($this->groupModel->getBoxes() as $index => $metaBoxModel): ?>
										<div class="acpt-admin-horizontal-tab  with-borders <?php echo $index === 0 ? 'active' : ''; ?>" data-target="<?php echo $metaBoxModel->getId(); ?>">
											<?php echo $metaBoxModel->getUiName(); ?>
										</div>
									<?php endforeach; ?>
								</div>
								<div class="acpt-admin-horizontal-panels">
									<?php foreach ($this->groupModel->getBoxes() as $index => $metaBoxModel): ?>
										<div id="<?php echo $metaBoxModel->getId(); ?>" class="acpt-admin-horizontal-panel  with-borders <?php echo $index === 0 ? 'active' : ''; ?>">
											<?php
											foreach ($metaBoxModel->getFields() as $fieldModel){
												CustomPostTypeMetaBoxFieldGenerator::generate($post->ID, $fieldModel);
											}
											?>
										</div>
									<?php endforeach; ?>
								</div>
							</div>
						<?php
					},
					strtolower($this->postTypeName),
					'advanced',
					'high',
					[$metaFields]
				);
			}
		});
	}

	/**
	 * @param MetaFieldModel $fieldModel
	 *
	 * @return array
	 */
	private function generateMetaBoxFieldArray(MetaFieldModel $fieldModel)
	{
		$options = [];

		foreach ($fieldModel->getOptions() as $optionModel){
			$options[] = [
				'label' => $optionModel->getLabel(),
				'value' => $optionModel->getValue(),
			];
		}

		$relations = [];
		$children = [];

		if($fieldModel->hasChildren()){
			foreach ($fieldModel->getChildren() as $childFieldModel){
				$children[] = $this->generateMetaBoxFieldArray($childFieldModel);
			}
		}

		return [
			'id' => $fieldModel->getId(),
			'type' => $fieldModel->getType(),
			'name' => $fieldModel->getName(),
			'defaultValue' => $fieldModel->getDefaultValue(),
			'description' => $fieldModel->getDescription(),
			'isRequired' => $fieldModel->isRequired(),
			'isShowInArchive' => $fieldModel->isShowInArchive(),
			'sort' => $fieldModel->getSort(),
			'options' => $options,
			'relations' => $relations,
			'children' => $children,
		];
	}
}