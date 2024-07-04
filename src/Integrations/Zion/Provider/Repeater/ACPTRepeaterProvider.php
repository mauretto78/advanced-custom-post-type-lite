<?php

namespace ACPT_Lite\Integrations\Zion\Provider\Repeater;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Core\Models\Meta\MetaGroupModel;
use ACPT_Lite\Core\Repository\MetaRepository;
use ACPT_Lite\Core\Repository\OptionPageRepository;
use ACPT_Lite\Core\Repository\TaxonomyRepository;
use ACPT_Lite\Integrations\Zion\Provider\Constants\ZionConstants;
use ACPT_Lite\Integrations\Zion\Provider\Utils\FieldSettings;
use ACPT_Lite\Integrations\Zion\Provider\Utils\FieldValue;
use ZionBuilder\Options\Option;
use ZionBuilder\Options\Options;
use ZionBuilderPro\Repeater\RepeaterProvider;

class ACPTRepeaterProvider extends RepeaterProvider
{
	/**
	 * @return string
	 */
	public static function get_id()
	{
		return 'acpt_repeater';
	}

	/**
	 * @return string
	 */
	public static function get_name()
	{
		return esc_html__( 'ACPT Repeater', 'zionbuilder-pro' );
	}

	/**
	 * @param null $index
	 */
	public function the_item($index = null)
	{
		$current_item = $this->get_active_item();
		$config = isset( $this->config['config'] ) ? $this->config['config'] : [];

		if($current_item and isset($config['repeater_field'])) {
			$real_index = null === $index ? $this->get_real_index() : $index;
			// @TODO update loop index????
		}
	}

	/**
	 * @return array|void
	 * @throws \Exception
	 */
	public function perform_query()
	{
		$config = isset( $this->config['config'] ) ? $this->config['config'] : [];

		$this->query = [
			'query' => null,
			'items' => [],
		];

		if (isset( $config['repeater_field'])) {

			$fieldSettings = FieldSettings::get($config[ 'repeater_field' ]);

			if($fieldSettings === false or empty($fieldSettings)){
				return;
			}

			/** @var MetaFieldModel $metaFieldModel */
			$metaFieldModel = $fieldSettings['model'];
			$belongsTo = $fieldSettings['belongsTo'];

			$rawValue = FieldValue::raw($belongsTo, $metaFieldModel);

			$this->query = [
				'query' => [],
				'items' => is_array($rawValue) ? $rawValue : [],
			];

			return;
		}
	}

	public function reset_query()
	{
//		\acf_remove_loop('active');
	}

	/**
	 * @return array|Option[]
	 * @throws \Exception
	 */
	public function get_schema()
	{
		$optionsSchema = new Options( 'zionbuilderpro/repeater_provider/acpt_repeater' );
		$optionsSchema->add_option(
			'repeater_field',
			[
				'type'        => 'select',
				'title'       => esc_html__( 'Repeater field', 'zionbuilder-pro' ),
				'placeholder' => esc_html__( 'Select repeater field', 'zionbuilder-pro' ),
				'options' => $this->getRepeaterOptionsForSelect(),
				'filterable'  => true,
				'filter_id' => 'zionbuilderpro/repeater/acpt/fields'
			]
		);

		return $optionsSchema->get_schema();
	}

	/**
	 * @return array
	 * @throws \Exception
	 */
	public function getRepeaterOptionsForSelect()
	{
		$repeaterOptions = [];

		// loop all cpts
		$postTypes = get_post_types(['_builtin' => false]);

		foreach ($postTypes as $postType){
			$cptMetaGroups = MetaRepository::get([
				'belongsTo' => MetaTypes::CUSTOM_POST_TYPE,
				'find' => $postType
			]);

			$repeaterOptions = array_merge($repeaterOptions, $this->getAcptRepeaterGroup($cptMetaGroups, MetaTypes::CUSTOM_POST_TYPE, $postType));
		}

		// loop all tax
		$taxonomies = TaxonomyRepository::get();

		foreach ($taxonomies as $taxonomy){
			$taxMetaGroups = MetaRepository::get([
				'belongsTo' => MetaTypes::TAXONOMY,
				'find' => $taxonomy->getSlug()
			]);

			$repeaterOptions = array_merge($repeaterOptions, $this->getAcptRepeaterGroup($taxMetaGroups, MetaTypes::TAXONOMY, $taxonomy->getSlug()));
		}

		// loop all OPs
		$optionPages = OptionPageRepository::get([]);

		foreach ($optionPages as $optionPage){
			$optionPageMetaGroups = MetaRepository::get([
				'belongsTo' => MetaTypes::OPTION_PAGE,
				'find' => $optionPage->getMenuSlug()
			]);

			$repeaterOptions = array_merge($repeaterOptions, $this->getAcptRepeaterGroup($optionPageMetaGroups, MetaTypes::OPTION_PAGE, $optionPage->getMenuSlug()));
		}

		return $repeaterOptions;
	}

	/**
	 * @param MetaGroupModel[] $metaGroups
	 * @param string $belongsTo
	 * @param string $find
	 * @param bool $parent
	 *
	 * @return array
	 */
	private function getAcptRepeaterGroup($metaGroups, $belongsTo, $find, $parent = false)
	{
		$options = [];
		$belongsToLabel = MetaTypes::label($belongsTo);

		foreach ($metaGroups as $group){
			foreach ($group->getBoxes() as $metaBox){

				$metaBoxOptions = array_merge([], $this->getAcptRepeaterGroupFields($metaBox->getFields(), $belongsTo, $find, $parent));

				if(!empty($metaBoxOptions)){
					$options[] = [
						'name'     => '['.$belongsToLabel.'] - ' . $metaBox->getName(),
						'is_label' => true,
					];

					$options = array_merge($options, $metaBoxOptions);
				}
			}
		}

		return $options;
	}

	/**
	 * @param MetaFieldModel[] $metaFields
	 * @param string $belongsTo
	 * @param string $find
	 * @param bool $parent
	 *
	 * @return array
	 */
	private function getAcptRepeaterGroupFields($metaFields, $belongsTo, $find, $parent = false)
	{
		$options = [];

		foreach ($metaFields as $field){

			// @TODO FLEXIBLE ?????

			if($field->getType() === MetaFieldModel::REPEATER_TYPE ){
				$options = array_merge( $options, $this->getRepeaterChilds($field, $belongsTo, $find, $parent));
			}
		}

		return $options;
	}

	/**
	 * @param MetaFieldModel $field
	 * @param $belongsTo
	 * @param $find
	 * @param bool $parent
	 *
	 * @return array
	 */
	private function getRepeaterChilds(MetaFieldModel $field, $belongsTo, $find, $parent = false)
	{
		$options = [];

		if($field->hasChildren()) {
			$options = array_merge($options, $this->getAcptRepeaterGroupFields($field->getChildren(), $belongsTo, $find, $field->getId()));
		}

		$id = ($field->hasChildren()) ?  $belongsTo.ZionConstants::FIELD_KEY_SEPARATOR.$find.ZionConstants::FIELD_KEY_SEPARATOR.$field->getId() :  $belongsTo.ZionConstants::FIELD_KEY_SEPARATOR.$find.ZionConstants::FIELD_KEY_SEPARATOR.$field->getParentId().ZionConstants::FIELD_KEY_SEPARATOR.$field->getId();
		$name = ($field->hasChildren()) ? '['.$field->getBox()->getName().'] - '.$field->getName() : '['.$field->getParentField()->getName().'] - '.$field->getName();

		$options[] = [
			'id'          => $id,
			'name'        => $name,
			'acpt_parent' => $parent,
		];

		return $options;
	}
}