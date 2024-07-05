<?php

namespace ACPT_Lite\Core\Generators\CustomPostType;

use ACPT_Lite\Core\Generators\AbstractGenerator;
use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Meta\MetaBoxModel;

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
				(isset($_GET['post']) and $_GET['post'] == $postId)
			){
				$boxLabel = (!empty($metaBoxModel->getLabel())) ? $metaBoxModel->getLabel() : $metaBoxModel->getName();
				$idBox = 'acpt_metabox_'. Strings::toDBFormat($metaBoxModel->getName());

				add_meta_box(
					$idBox,
					$boxLabel,
					function($post, $data) use ($metaBoxModel) {
						foreach ($metaBoxModel->getFields() as $field) {
							CustomPostTypeMetaBoxFieldGenerator::generate($post->ID, $field);
						}
					},
					strtolower($postTypeName),
					'advanced',
					'high',
					[$formFields]
				);
			}
        });
    }
}

