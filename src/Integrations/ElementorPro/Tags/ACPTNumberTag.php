<?php

namespace ACPT_Lite\Integrations\ElementorPro\Tags;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use Elementor\Modules\DynamicTags\Module;

class ACPTNumberTag extends ACPTAbstractTag
{
	/**
	 * @inheritDoc
	 */
	public function get_categories()
	{
		return [
			Module::NUMBER_CATEGORY,
		];
	}

	/**
	 * @inheritDoc
	 */
	public function get_name()
	{
		return 'acpt-number';
	}

	/**
	 * @inheritDoc
	 */
	public function get_title()
	{
		return esc_html__( "ACPT number field", ACPT_LITE_PLUGIN_NAME );
	}

	public function render()
	{
		$render = '';
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
				$fieldType = $field['fieldType'];

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

				switch ($fieldType){
					case MetaFieldModel::RATING_TYPE:
						$render .= $rawData/2;
						break;

					default:
						$render .= (int)$rawData;
						break;
				}
			}
		}

		echo $render;
	}
}