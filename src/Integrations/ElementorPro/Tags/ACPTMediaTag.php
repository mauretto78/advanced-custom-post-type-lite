<?php

namespace ACPT_Lite\Integrations\ElementorPro\Tags;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Utils\Wordpress\WPAttachment;
use Elementor\Modules\DynamicTags\Module;

class ACPTMediaTag extends ACPTAbstractDataTag
{
	/**
	 * @inheritDoc
	 */
	public function get_categories()
	{
		return [
			Module::MEDIA_CATEGORY,
		];
	}

	/**
	 * @inheritDoc
	 */
	public function get_name()
	{
		return 'acpt-media';
	}

	/**
	 * @inheritDoc
	 */
	public function get_title()
	{
		return esc_html__( "ACPT media field", ACPT_LITE_PLUGIN_NAME );
	}

	public function get_value( array $options = array() )
	{
		$field = $this->extractField();

		if(!empty($field)){
			if(
				isset($field['find']) and
				isset($field['belongsTo']) and
				isset($field['boxName']) and
				isset($field['fieldName']) and
				isset($field['fieldType'])
			){
				$find = $field['find'];
				$belongsTo = $field['belongsTo'];
				$boxName = $field['boxName'];
				$fieldName = $field['fieldName'];

				$context = null;
				$contextId = null;

				if($belongsTo === MetaTypes::CUSTOM_POST_TYPE){
					$context = 'post_id';
					$contextId = (isset($field['postId']) and !empty($field['postId'])) ? (int)$field['postId'] : $this->getCurrentPostId();
				} elseif($belongsTo === MetaTypes::OPTION_PAGE){
					$context = 'option_page';
					$contextId = $find;
				}

				if($context === null or $contextId === null){
					echo '';
					exit();
				}

				$rawData = get_acpt_field([
					$context => $contextId,
					'box_name' => $boxName,
					'field_name' => $fieldName,
				]);

				if($rawData instanceof WPAttachment){
					return [
						'id' => $rawData->getId(),
						'url' => $rawData->getSrc(),
					];
				}

				return $this->emptyFile();
			}

			return $this->emptyFile();
		}

		return $this->emptyFile();
	}

	/**
	 * @return array
	 */
	private function emptyFile()
	{
		return [
			'id' => 0,
			'url' => null,
		];
	}
}