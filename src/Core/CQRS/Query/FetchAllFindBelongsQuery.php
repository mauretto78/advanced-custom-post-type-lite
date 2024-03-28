<?php

namespace ACPT_Lite\Core\CQRS\Query;

use ACPT_Lite\Constants\BelongsTo;
use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Repository\CustomPostTypeRepository;
use ACPT_Lite\Core\Repository\MetaRepository;
use ACPT_Lite\Core\Repository\TaxonomyRepository;
use ACPT_Lite\Utils\Translator;

class FetchAllFindBelongsQuery implements QueryInterface
{
	/**
	 * @return array|mixed
	 * @throws \Exception
	 */
	public function execute()
	{
		$nullValue = [
			'value' => null,
			'label' => Translator::translate("Select"),
		];

		$data = [
			BelongsTo::POST_ID => [$nullValue],
			BelongsTo::POST_CAT => [$nullValue],
			BelongsTo::POST_TAX => [$nullValue],
			BelongsTo::POST_TEMPLATE => [$nullValue],
			BelongsTo::TERM_ID => [$nullValue],
			BelongsTo::USER_ID => [$nullValue],
			MetaTypes::CUSTOM_POST_TYPE => [$nullValue],
			MetaTypes::TAXONOMY => [$nullValue],
			MetaTypes::META => [$nullValue],
			MetaTypes::USER => [$nullValue],
		];

		$templates = wp_get_theme()->get_page_templates();
		foreach ($templates as $file => $template){
			$data[BelongsTo::POST_TEMPLATE][]  = [
				'value' => $file,
				'label' => $template,
			];
		}

		$categories = $categories = get_categories([
			"orderby" => "name",
			"hide_empty" => false
		]);
		foreach ($categories as $category){
			$data[BelongsTo::POST_CAT][]  = [
				'value' => $category->term_id,
				'label' => $category->name,
			];
		}

		$users = get_users([
			'fields' => [
				'ID',
				'display_name',
			]
		]);
		foreach ($users as $user){
			$data[BelongsTo::USER_ID][]  = [
				'value' => $user->id,
				'label' => $user->display_name,
			];
		}

		$customPostTypes = CustomPostTypeRepository::get([]);
		foreach ($customPostTypes as $customPostType){
			$data[MetaTypes::CUSTOM_POST_TYPE][]  = [
				'value' => $customPostType->getName(),
				'label' => $customPostType->getName(),
			];

			$posts = [];
			$queriesPosts = get_posts([
				'numberposts' => -1,
				'orderby' => 'title',
				'order' => 'ASC',
				'post_type' => $customPostType->getName(),
			]);

			foreach ($queriesPosts as $queriesPost){
				$posts[] = [
					'label' => $queriesPost->post_title,
					'value' => $queriesPost->ID,
				];
			}

			if(!empty($posts)){
				$data[BelongsTo::POST_ID][] = [
					'label' => $customPostType->getName(),
					'options' => $posts
				];
			}
		}

		$taxonomies = TaxonomyRepository::get([]);
		foreach ($taxonomies as $taxonomy){
			$data[MetaTypes::TAXONOMY][]  = [
				'value' => $taxonomy->getSlug(),
				'label' => $taxonomy->getSlug(),
			];

			$terms = [];
			$queriedTerms = get_terms([
				'taxonomy'   => $taxonomy->getSlug(),
				'hide_empty' => false,
				'fields' => 'id=>name',
			]);

			foreach ($queriedTerms as $termId => $queriedTerm){
				if(is_string($queriedTerm)) {
					$terms[] = [
						'label' => $queriedTerm,
						'value' => $termId,
					];
				}
			}

			if(!empty($terms)){
				$taxGroup = [
					'label' => $taxonomy->getSlug(),
					'options' => $terms
				];

				$data[BelongsTo::POST_TAX][] = $taxGroup;
				$data[BelongsTo::TERM_ID][] = $taxGroup;
			}
		}

		$metaGroups = MetaRepository::get(['lazy' => true]);
		foreach ($metaGroups as $metaGroup){
			$data[MetaTypes::META][]  = [
				'value' => $metaGroup->getId(),
				'label' => $metaGroup->getUIName(),
			];
		}

		$data[MetaTypes::USER][]  = [
			'value' => null,
			'label' => Translator::translate('User'),
		];

		return $data;
	}
}