<?php


namespace ACPT_Lite\Utils\Wordpress;


use ACPT_Lite\Core\Repository\TaxonomyRepository;

class Terms
{
	/**
	 * @return array
	 */
	public static function getList(): array
	{
		try {
			$terms = [];
			$taxonomies = TaxonomyRepository::get();

			foreach ($taxonomies as $taxonomy){
				$queriedTerms = get_terms([
					'taxonomy'   => $taxonomy->getSlug(),
					'hide_empty' => false,
					'fields' => 'id=>name',
				]);

				$terms[] = [
					'taxonomy' => $taxonomy->getSlug(),
					'terms'    => $queriedTerms,
				];
			}

			return $terms;
		} catch (\Exception $exception){
			return [];
		}
	}
}