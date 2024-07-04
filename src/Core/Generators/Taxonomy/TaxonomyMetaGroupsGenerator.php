<?php

namespace ACPT_Lite\Core\Generators\Taxonomy;

use ACPT_Lite\Core\Generators\AbstractGenerator;
use ACPT_Lite\Core\Repository\TaxonomyRepository;

class TaxonomyMetaGroupsGenerator extends AbstractGenerator
{
	/**
	 * Generate meta boxes related to taxonomies
	 */
	public function generate()
	{
		try {
			foreach (TaxonomyRepository::get() as $taxonomyModel){
				$taxonomyMetaBoxGenerator = new TaxonomyMetaBoxGenerator($taxonomyModel);
				$taxonomyMetaBoxGenerator->generate();
			}
		} catch (\Exception $exception){
			// do nothing
		}
	}
}