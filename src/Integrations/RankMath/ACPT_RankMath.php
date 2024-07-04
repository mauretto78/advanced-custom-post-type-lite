<?php

namespace ACPT_Lite\Integrations\RankMath;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Core\Repository\MetaRepository;
use ACPT_Lite\Integrations\AbstractIntegration;
use ACPT_Lite\Integrations\RankMath\Provider\FieldProvider;


class ACPT_RankMath extends AbstractIntegration
{
	/**
	 * @inheritDoc
	 */
	protected function isActive()
	{
		if(is_plugin_active('rank-math-pro/rank-math.php')){
			return true;
		}

		return is_plugin_active( 'seo-by-rank-math-pro/rank-math-pro.php' );
	}

	/**
	 * @inheritDoc
	 */
	protected function runIntegration()
	{
		add_action( 'init', [new ACPT_RankMath(), 'enqueueScripts'] );
		add_action('rank_math/vars/register_extra_replacements', [new ACPT_RankMath(), 'registerFields']);
	}

	/**
	 * Enqueue JS scripts
	 */
	public function enqueueScripts()
	{
		wp_enqueue_script( 'rank-math-integration', plugin_dir_url( __FILE__ ) . '/assets/js/rank-math-integration.js', [ 'wp-hooks', 'rank-math-analyzer' ], false, true );
	}

	/**
	 * Register fields in Rank Math
	 */
	public function registerFields()
	{
		global $post;

		// CPT meta fields
		if($post !== null){
			foreach ($this->getFields(MetaTypes::CUSTOM_POST_TYPE, $post->post_type) as $field){

				$fieldInstance = new FieldProvider($post->ID, MetaTypes::CUSTOM_POST_TYPE, $field);

				if(!empty($fieldInstance)){
					rank_math_register_var_replacement(
						$fieldInstance->getSlug(),
						[
							'name'        => $fieldInstance->getName(),
							'description' => $fieldInstance->getDescription(),
							'variable'    => $fieldInstance->getSlug(),
							'example'     => $fieldInstance->getData()
						],
						function ($args) use ($fieldInstance) {
							return $fieldInstance->getData(@$args);
						}
					);
				}
			}
		}

		$tagId = null;
		$taxonomy = null;

		$term = get_queried_object();

		if($term instanceof \WP_Term){
			$tagId = $term->term_id;
			$taxonomy = $term->taxonomy;
		} elseif(isset($_GET['tag_ID']) and $_GET['taxonomy']) {
			$tagId    = $_GET['tag_ID'];
			$taxonomy = $_GET['taxonomy'];
		}

		// Taxonomies meta fields
		if($tagId !== null and $taxonomy !== null){
			foreach ($this->getFields(MetaTypes::TAXONOMY, $taxonomy) as $field){

				$fieldInstance = new FieldProvider($tagId, MetaTypes::TAXONOMY, $field);

				if(!empty($fieldInstance)){
					rank_math_register_var_replacement(
						$fieldInstance->getSlug(),
						[
							'name'        => $fieldInstance->getName(),
							'description' => $fieldInstance->getDescription(),
							'variable'    => $fieldInstance->getSlug(),
							'example'     => $fieldInstance->getData()
						],
						function ($args) use ($fieldInstance) {
							return $fieldInstance->getData(@$args);
						}
					);
				}
			}
		}
	}

	/**
	 * @param $belongsTo
	 * @param $find
	 *
	 * @return array
	 */
	private function getFields($belongsTo, $find)
	{
		$fields = [];

		try {
			$groups = MetaRepository::get([
				'belongsTo' => $belongsTo,
				'find' => $find
			]);

			foreach ($groups as $group){
				foreach ($group->getBoxes() as $box){
					foreach ($box->getFields() as $field){
						if(in_array($field->getType(), $this->allowedFieldTypes())){
							$fields[] = $field;
						}
					}
				}
			}

			return $fields;
		} catch (\Exception $exception){
			return [];
		}
	}

	/**
	 * @return array
	 */
	private function allowedFieldTypes()
	{
		return [
			MetaFieldModel::CHECKBOX_TYPE,
			MetaFieldModel::CURRENCY_TYPE,
			MetaFieldModel::DATE_TYPE,
			MetaFieldModel::DATE_RANGE_TYPE,
			MetaFieldModel::DATE_TIME_TYPE,
			MetaFieldModel::EMAIL_TYPE,
			MetaFieldModel::LENGTH_TYPE,
			MetaFieldModel::LIST_TYPE,
			MetaFieldModel::PHONE_TYPE,
			MetaFieldModel::POST_TYPE,
			MetaFieldModel::POST_OBJECT_TYPE,
			MetaFieldModel::POST_OBJECT_MULTI_TYPE,
			MetaFieldModel::RADIO_TYPE,
			MetaFieldModel::RATING_TYPE,
			MetaFieldModel::SELECT_TYPE,
			MetaFieldModel::SELECT_MULTI_TYPE,
			MetaFieldModel::TERM_OBJECT_TYPE,
			MetaFieldModel::TERM_OBJECT_MULTI_TYPE,
			MetaFieldModel::TEXT_TYPE,
			MetaFieldModel::TEXTAREA_TYPE,
			MetaFieldModel::TIME_TYPE,
			MetaFieldModel::WEIGHT_TYPE,
			MetaFieldModel::URL_TYPE,
			MetaFieldModel::USER_TYPE,
			MetaFieldModel::USER_MULTI_TYPE,
		];
	}
}
