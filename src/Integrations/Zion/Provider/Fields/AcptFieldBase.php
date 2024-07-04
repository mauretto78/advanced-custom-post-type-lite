<?php

namespace ACPT_Lite\Integrations\Zion\Provider\Fields;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Models\Meta\MetaGroupModel;
use ACPT_Lite\Core\Repository\MetaRepository;
use ACPT_Lite\Core\Repository\OptionPageRepository;
use ACPT_Lite\Core\Repository\TaxonomyRepository;
use ACPT_Lite\Integrations\Zion\Provider\Constants\ZionConstants;
use ACPT_Lite\Utils\Wordpress\Translator;
use ZionBuilderPro\DynamicContent\BaseField;

class AcptFieldBase extends BaseField
{
	/**
	 * @inheritDoc
	 */
	public function get_category()
	{
		return self::CATEGORY_TEXT;
	}

	/**
	 * @inheritDoc
	 */
	public function get_group()
	{
		return ZionConstants::GROUP_NAME;
	}

	/**
	 * @return string
	 */
	public function get_id()
	{
		return 'acpt-field';
	}

	/**
	 * @return string
	 */
	public function get_name()
	{
		return Translator::translate( 'ACPT Field');
	}

	/**
	 * All derived classes MUST implement this method in order to register their supported types
	 * @return array
	 */
	public static function getSupportedFieldTypes()
	{
		return [];
	}

	/**
	 * @return array
	 * @throws \Exception
	 */
	public function get_options()
	{
		return [
			'field_name' => [
				'type'        => 'select',
				'title'       => esc_html__( 'Field to display', 'zionbuilder-pro' ),
				'description' => esc_html__( 'Select the desired field you want to display.', 'zionbuilder-pro' ),
				'placeholder' => esc_html__( 'Field to display', 'zionbuilder-pro' ),
				'filterable'  => true,
				'options'     => $this->getAcptFieldsOptionByType(),
				'filter_id'   => 'zionbuilderpro/dynamic_data/acpt/options',
			]
		];
	}

	/**
	 * @return array
	 * @throws \Exception
	 */
	public function getAcptFieldsOptionByType()
	{
		$options = [];

		// loop all cpts
		$postTypes = get_post_types(['_builtin' => false]);

		foreach ($postTypes as $postType){
			$cptMetaGroups = MetaRepository::get([
				'belongsTo' => MetaTypes::CUSTOM_POST_TYPE,
				'find' => $postType
			]);

			$options = array_merge($options, $this->getAcptMetaGroup($cptMetaGroups, MetaTypes::CUSTOM_POST_TYPE, $postType));
		}

		// loop all tax
		$taxonomies = TaxonomyRepository::get();

		foreach ($taxonomies as $taxonomy){
			$taxMetaGroups = MetaRepository::get([
				'belongsTo' => MetaTypes::TAXONOMY,
				'find' => $taxonomy->getSlug()
			]);

			$options = array_merge($options, $this->getAcptMetaGroup($taxMetaGroups, MetaTypes::TAXONOMY, $taxonomy->getSlug()));
		}

		// loop all OPs
		$optionPages = OptionPageRepository::get([]);

		foreach ($optionPages as $optionPage){
			$optionPageMetaGroups = MetaRepository::get([
				'belongsTo' => MetaTypes::OPTION_PAGE,
				'find' => $optionPage->getMenuSlug()
			]);

			$options = array_merge($options, $this->getAcptMetaGroup($optionPageMetaGroups, MetaTypes::OPTION_PAGE, $optionPage->getMenuSlug()));
		}

		return $options;
	}

	/**
	 * @param MetaGroupModel[] $metaGroups
	 * @param $belongsTo
	 * @param $find
	 *
	 * @return array
	 */
	private function getAcptMetaGroup($metaGroups, $belongsTo, $find)
	{
		$options = [];
		$belongsToLabel = MetaTypes::label($belongsTo);

		foreach ($metaGroups as $group){
			foreach ($group->getBoxes() as $metaBox) {
				$metaBoxOptions = [];

				foreach ($metaBox->getFields() as $field){
					if(in_array($field->getType(), static::getSupportedFieldTypes())){
						$metaBoxOptions[] = [
							'id'            => $belongsTo.ZionConstants::FIELD_KEY_SEPARATOR.$find.ZionConstants::FIELD_KEY_SEPARATOR.$field->getId(),
							'name'          => '['.$field->getBox()->getUiName().'] - '.$field->getLabelOrName(),
							'is_group_item' => true,
						];
					}
				}

				if(!empty($metaBoxOptions)){
					$options[] = [
						'name'     => '['.$belongsToLabel.'] - ' . $metaBox->getUiName(),
						'is_label' => true,
					];

					$options = array_merge($options, $metaBoxOptions);
				}
			}
		}

		return $options;
	}

	/**
	 * Make sure the provided type is supported
	 *
	 * @param string $type
	 *
	 * @return bool
	 */
	protected function isSupportedFieldType(string $type)
	{
		return in_array($type, $this->getSupportedFieldTypes());
	}

	/**
	 * Will load the field only if it passes the check
	 * @TODO is working for OP and TAX meta?????
	 *
	 * @return boolean
	 */
	public function can_load()
	{
		global $post;

		return ( $post ? true : false );
	}
}