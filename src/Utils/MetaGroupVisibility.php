<?php

namespace ACPT_Lite\Utils;

use ACPT_Lite\Constants\BelongsTo;
use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Constants\Operator;
use ACPT_Lite\Core\Models\Meta\MetaGroupModel;

class MetaGroupVisibility
{
	/**
	 * @param MetaGroupModel $group
	 * @param string $belongsTo
	 * @param null $find
	 *
	 * @return bool
	 */
	public static function isVisible(MetaGroupModel $group, $belongsTo, $find = null): bool
	{
		if($find !== null){
			if($group->belongsTo($belongsTo, Operator::EQUALS, $find)){
				return true;
			}

			if($belongsTo === MetaTypes::CUSTOM_POST_TYPE){

				// 2. POST_ID
				$postIds = get_posts([
					'fields'         => 'ids',
					'post_type'      => $find,
					'posts_per_page' => -1,
				]);

				if(!empty($postIds)){
					foreach ($postIds as $postId){
						if($group->belongsTo(BelongsTo::POST_ID, Operator::EQUALS, $postId)){
							return true;
						}
					}
				}

				// 3. POST_TEMPLATE
				$templates =  get_pages([
					'meta_key' => '_wp_page_template',
				]);

				if(!empty($templates)){
					foreach ($templates as $template){
						$file = get_post_meta($template->ID, '_wp_page_template', true);
						if($group->belongsTo(BelongsTo::POST_TEMPLATE, Operator::EQUALS, $file)){
							return true;
						}
					}
				}

				// 4. POST_TAX
				$termIds = [];
				$taxonomies = get_taxonomies([
					'public' => true,
					'_builtin' => true,
				]);

				foreach ($taxonomies as $taxonomy){
					$queriedTerms = get_terms([
						'taxonomy'   => $taxonomy,
						'hide_empty' => false,
						'fields' => 'ids',
					]);

					$termIds[] = [
						'taxonomy' => $taxonomy,
						'terms'    => $queriedTerms,
					];
				}

				if(!empty($termIds)){
					foreach ($termIds as $termId){
						$taxonomy = $termId['taxonomy'];
						$terms    = $termId['terms'];

						foreach ($terms as $term){
							if($group->belongsTo(BelongsTo::POST_TAX, Operator::EQUALS, $term)){
								return true;
							}
						}
					}
				}

				// 5. POST_CAT
				$categoryIds = get_terms([
					'taxonomy'   => 'category',
					'hide_empty' => false,
					'fields' => 'ids',
				]);

				if(!empty($categoryIds)){
					foreach ($categoryIds as $categoryId){
						if($group->belongsTo(BelongsTo::POST_CAT, Operator::EQUALS, $categoryId)){
							return true;
						}
					}
				}
			}

			return false;
		}

		return $group->belongsTo($belongsTo);
	}
}