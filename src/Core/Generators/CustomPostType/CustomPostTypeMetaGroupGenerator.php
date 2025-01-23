<?php

namespace ACPT_Lite\Core\Generators\CustomPostType;

use ACPT_Lite\Constants\MetaGroupDisplay;
use ACPT_Lite\Core\Generators\AbstractGenerator;
use ACPT_Lite\Core\Helper\Fields;
use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Meta\MetaBoxModel;
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
	 */
	public function __construct( MetaGroupModel $groupModel, $postTypeName)
	{
		$this->groupModel         = $groupModel;
		$this->postTypeName       = $postTypeName;
		$this->postId             = $_GET['post'] ?? $_GET['id'] ?? null;
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

			if(!empty($metaFields)){
				$metaBoxGenerator->addMetaBox(
			        $metaBoxModel,
                    $this->postTypeName,
			        $metaFields,
			        $this->postId
				);
			}
		}
	}

	/**
	 * Vertical tabs
	 */
	private function verticalTabs()
	{
        // end update_edit_form
		add_action('post_edit_form_tag', function() {
			echo ' enctype="multipart/form-data"';
		});

		$this->adminInit(function() {

            if(
                $this->postId === null or
                (isset($_GET['post']) and $_GET['post'] == $this->postId) or
                (isset($_GET['id']) and $_GET['id'] == $this->postId)
            ){
				$boxLabel = (!empty($this->groupModel->getLabel())) ? $this->groupModel->getLabel() : $this->groupModel->getName();
				$idBox = 'acpt_metabox_'. Strings::toDBFormat($this->groupModel->getName());
				$boxRows = $this->boxRows($this->groupModel->getBoxes(), $this->postId);
                $postTypeName = $this->getPostTypeName($this->postTypeName);

				if(!empty($boxRows)){
					$metaFields = [];

					foreach ($this->groupModel->getBoxes() as $metaBoxModel){
						foreach ($metaBoxModel->getFields() as $fieldModel){
							$metaFields[] = $this->generateMetaBoxFieldArray($fieldModel);
						}
					}

					if(!empty($metaFields)){
						add_meta_box(
							$idBox,
							$boxLabel,
							function($post, $data) use($boxRows) {
								?>
								<div class="acpt-admin-vertical-tabs-wrapper" style="margin: 24px;" id="<?php echo $this->groupModel->getId(); ?>">
									<div class="acpt-admin-vertical-tabs">
										<?php
										$index = 0;
										foreach ($boxRows as $boxId => $row):  ?>
											<div class="acpt-admin-vertical-tab with-borders <?php echo $index === 0 ? 'active' : ''; ?>" data-target="<?php echo $boxId; ?>">
												<?php echo $row['boxName']; $index++; ?>
											</div>
										<?php endforeach; ?>
									</div>
									<div class="acpt-admin-vertical-panels">
										<?php
										$index = 0;
										foreach ($boxRows as $boxId => $row): ?>
											<div id="<?php echo $boxId; ?>" class="acpt-admin-vertical-panel with-borders <?php echo $index === 0 ? 'active' : ''; ?>">
												<?php
                                                foreach ($row['rows'] as $fields){
                                                    echo "<div class='acpt-admin-meta-row ".($row['isVisible'] == 0 ? ' hidden' : '')."'>";

                                                    foreach ($fields as $field){
                                                        echo $field;
                                                    }

                                                    echo "</div>";
                                                }

												$index++;
												?>
											</div>
										<?php endforeach; ?>
									</div>
								</div>
								<?php
							},
							strtolower($postTypeName),
							($this->groupModel->getContext() !== null ? $this->groupModel->getContext() : 'normal'),
							($this->groupModel->getPriority() !== null ? $this->groupModel->getPriority() : 'high'),
							[$metaFields]
						);

						add_filter('postbox_classes_'.strtolower($this->postTypeName).'_'.$idBox, function($classes) {

							array_push($classes,'acpt-metabox');

							return $classes;
						});
					}
                }
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
				(isset($_GET['post']) and $_GET['post'] == $this->postId) or
				(isset($_GET['id']) and $_GET['id'] == $this->postId)
			){
				$boxLabel = (!empty($this->groupModel->getLabel())) ? $this->groupModel->getLabel() : $this->groupModel->getName();
				$idBox = 'acpt_metabox_'. Strings::toDBFormat($this->groupModel->getName());
				$boxRows = $this->boxRows($this->groupModel->getBoxes(), $this->postId);
                $postTypeName = $this->getPostTypeName($this->postTypeName);

				if(!empty($boxRows)){
					$metaFields = [];

					foreach ($this->groupModel->getBoxes() as $metaBoxModel){
						foreach ($metaBoxModel->getFields() as $fieldModel){
							$metaFields[] = $this->generateMetaBoxFieldArray($fieldModel);
						}
					}

					if(!empty($metaFields)){
						add_meta_box(
							$idBox,
							$boxLabel,
							function($post, $data) use($boxRows) {
								?>
                                <div class="acpt-admin-horizontal-tabs-wrapper" style="margin: 24px;" id="<?php echo $this->groupModel->getId(); ?>">
                                    <div class="acpt-admin-horizontal-tabs">
										<?php
										$index = 0;
										foreach ($boxRows as $boxId => $row): if($row['isVisible']):  ?>
                                            <div class="acpt-admin-horizontal-tab with-borders <?php echo $index === 0 ? 'active' : ''; ?>" data-target="<?php echo $boxId; ?>">
												<?php echo $row['boxName']; $index++; ?>
                                            </div>
										<?php endif; endforeach; ?>
                                    </div>
                                    <div class="acpt-admin-horizontal-panels">
										<?php
										$index = 0;
										foreach ($boxRows as $boxId => $row): if($row['isVisible']): ?>
                                            <div id="<?php echo $boxId; ?>" class="acpt-admin-horizontal-panel no-margin <?php echo $index === 0 ? 'active' : ''; ?>">
												<?php
                                                foreach ($row['rows'] as $fields){
                                                    echo "<div class='acpt-admin-meta-row ".($row['isVisible'] == 0 ? ' hidden' : '')."'>";

                                                    foreach ($fields as $field){
                                                        echo $field;
                                                    }

                                                    echo "</div>";
                                                }

												$index++;
												?>
                                            </div>
										<?php endif; endforeach; ?>
                                    </div>
                                </div>
								<?php
							},
							strtolower($postTypeName),
							($this->groupModel->getContext() !== null ? $this->groupModel->getContext() : 'normal'),
							($this->groupModel->getPriority() !== null ? $this->groupModel->getPriority() : 'high'),
							[$metaFields]
						);

						add_filter('postbox_classes_'.strtolower($this->postTypeName).'_'.$idBox, function($classes) {

							array_push($classes,'acpt-metabox');

							return $classes;
						});
					}
				}
			}
		});
	}

	/**
	 * @param MetaBoxModel[] $boxes
	 * @param $postId
	 *
	 * @return array
	 * @throws \Exception
	 */
	private function boxRows($boxes, $postId = null)
	{
		$boxRows = [];
		$visibleFieldsTotalCount = 0;

		foreach ($boxes as $boxIndex => $box){
			$rows = Fields::extractFieldRows($box->getFields());
			$rowFields = [];

			foreach ($rows as $index => $row){

				$visibleFieldsRowCount = 0;

				foreach ($row as $field){
					$fieldGenerator = CustomPostTypeMetaBoxFieldGenerator::generate($field, $postId);

					if($fieldGenerator){

						if($fieldGenerator->isVisible()){
							$visibleFieldsTotalCount++;
							$visibleFieldsRowCount++;
						}

                        $boxRows[$box->getId()]['isVisible'] = $visibleFieldsRowCount;
                        $rowFields[$index][] = $fieldGenerator->render();
					}
				}
			}

            $boxRows[$box->getId()]['boxName'] = $box->getUiName();
            $boxRows[$box->getId()]['rows'] = $rowFields;
        }

		if($visibleFieldsTotalCount > 0){
			return $boxRows;
		}

		return [];
	}
}