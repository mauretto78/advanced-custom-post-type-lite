<?php

namespace ACPT_Lite\Core\Generators;

use ACPT_Lite\Core\Helper\Strings;

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
	 * Creates a new custom meta box in the $postTypeName page.
	 *
	 * @param string $id
	 * @param string $title
	 * @param string $postTypeName
	 * @param array  $formFields
	 */
	public function addMetaBox($id, $title, $postTypeName, $formFields = []) {

		// end update_edit_form
		add_action('post_edit_form_tag', function() {
			echo ' enctype="multipart/form-data"';
		});

		$this->adminInit(function() use( $id, $title, $formFields, $postTypeName ) {
			add_meta_box(
				Strings::toDBFormat($title),
				$title,
				function($post, $data) {
					global $post;

					// add nonce here
					wp_nonce_field($this->generateNonce(), self::NONCE_FIELD_NAME);

					// List of all the specified form fields
					$inputs = $data['args'][0];

					foreach ($inputs as $input) {
						CustomPostTypeMetaBoxFieldGenerator::generate($post->ID, $data['id'], $input);
					}
				},
				strtolower($postTypeName),
				'advanced',
				'high',
				[$formFields]
			);
		});
	}
}

