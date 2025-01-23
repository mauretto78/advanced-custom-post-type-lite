<?php

namespace ACPT\Core\Generators\Comment;

use ACPT_Lite\Constants\MetaGroupDisplay;
use ACPT_Lite\Core\Generators\AbstractGenerator;
use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Core\Models\Meta\MetaGroupModel;

class CommentMetaGroupGenerator extends AbstractGenerator
{
	/**
	 * @var MetaGroupModel $groupModel
	 */
	private $groupModel;

	/**
	 * CommentMetaGroupGenerator constructor.
	 *
	 * @param MetaGroupModel $groupModel
	 */
	public function __construct(MetaGroupModel $groupModel)
	{
		$this->groupModel = $groupModel;
	}

	/**
	 * Generate the front-end form
	 */
	public function generateFrontEndForm()
	{
	    if(!empty($this->groupModel->getBoxes())){

		    if (!is_admin()) {
			    $this->enqueueAssets();
		    }

		    foreach ($this->groupModel->getBoxes() as $box){
			    $generator = new CommentMetaBoxGenerator($box);
			    $generator->generate();
		    }
        }
	}

	/**
     * Render the back-end form
     *
	 * @return string
	 */
	public function generateBackEndForm()
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
	    $this->adminInit(function() {
		    if(isset($_GET['c'])){
			    $boxLabel = (!empty($this->groupModel->getLabel())) ? $this->groupModel->getLabel() : $this->groupModel->getName();
			    $idBox = 'acpt_metabox_'. Strings::toDBFormat($this->groupModel->getName());

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
					    function($comment) {
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
										        $this->renderMetaField($fieldModel, $comment->comment_ID);
										    }
										    ?>
                                        </div>
								    <?php endforeach; ?>
                                </div>
                            </div>
						    <?php
					    },
                       'comment',
					    ($this->groupModel->getContext() !== null ? $this->groupModel->getContext() : 'normal'),
					    ($this->groupModel->getPriority() !== null ? $this->groupModel->getPriority() : 'high'),
				    );
			    }
		    }
	    });
    }

	/**
	 * Vertical tabs
	 */
	private function verticalTabs() {
		$this->adminInit( function () {
            if(isset($_GET['c'])){
	            $boxLabel = (!empty($this->groupModel->getLabel())) ? $this->groupModel->getLabel() : $this->groupModel->getName();
	            $idBox = 'acpt_metabox_'. Strings::toDBFormat($this->groupModel->getName());

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
			            function($comment) {
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
									            $this->renderMetaField($fieldModel, $comment->comment_ID);
								            }
								            ?>
                                        </div>
						            <?php endforeach; ?>
                                </div>
                            </div>
				            <?php
			            },
			            'comment',
			            ($this->groupModel->getContext() !== null ? $this->groupModel->getContext() : 'normal'),
			            ($this->groupModel->getPriority() !== null ? $this->groupModel->getPriority() : 'high'),
			            [$metaFields]
		            );
	            }
            }
		});
	}

	/**
	 * Horizontal
	}tabs
	 */
	private function horizontalTabs()
	{
	    $this->adminInit(function() {
            if(isset($_GET['c'])){
	            $boxLabel = (!empty($this->groupModel->getLabel())) ? $this->groupModel->getLabel() : $this->groupModel->getName();
	            $idBox = 'acpt_metabox_'. Strings::toDBFormat($this->groupModel->getName());

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
			            function($comment) {
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
                                                $this->renderMetaField($fieldModel, $comment->comment_ID);
								            }
								            ?>
                                        </div>
						            <?php endforeach; ?>
                                </div>
                            </div>
				            <?php
			            },
			            'comment',
			            ($this->groupModel->getContext() !== null ? $this->groupModel->getContext() : 'normal'),
			            ($this->groupModel->getPriority() !== null ? $this->groupModel->getPriority() : 'high'),
			            [$metaFields]
		            );
	            }
            }
	    });
	}

	/**
	 * @param MetaFieldModel $fieldModel
	 * @param $commentId
	 */
	private function renderMetaField(MetaFieldModel $fieldModel, $commentId)
    {
	    $commentFieldGenerator = new CommentMetaFieldGenerator($fieldModel);
	    $field = $commentFieldGenerator->getCommentMetaField($commentId);

	    if($field !== null){
		    echo $field->render();
	    }
    }

	private function enqueueAssets()
	{
		wp_enqueue_script( 'acpt_admin_js', plugins_url( 'advanced-custom-post-type/assets/static/js/admin.js'), ['jquery'], ACPT_PLUGIN_VERSION, true);
		wp_enqueue_style( 'acpt_comments_css', plugins_url( 'advanced-custom-post-type/assets/static/css/comments.css'), [], ACPT_PLUGIN_VERSION, 'all');
	}
}
