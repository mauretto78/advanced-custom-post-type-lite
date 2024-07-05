<?php

namespace ACPT_Lite\Core\CQRS\Query;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Repository\CustomPostTypeRepository;
use ACPT_Lite\Core\Repository\TaxonomyRepository;

class FetchFindFromBelongsToQuery implements QueryInterface
{
	/**
	 * @var mixed
	 */
	private $belongsTo;

	/**
	 * @var string
	 */
	private $format;

	/**
	 * FetchFindFromBelongsToQuery constructor.
	 *
	 * @param $belongsTo
	 * @param null $format
	 */
	public function __construct($belongsTo, $format = null)
	{
		$this->belongsTo = $belongsTo;
		$this->format = $format ? $format : 'default';
	}

	/**
	 * @return array|mixed
	 * @throws \Exception
	 */
	public function execute()
	{
		$id = 'id';
		$name = 'name';
		$data = [];

		if($this->format === 'react-select'){
			$id = 'value';
			$name = 'label';
		}

		switch ($this->belongsTo){

			// return all cpts
			case MetaTypes::CUSTOM_POST_TYPE:
				$customPostTypes = CustomPostTypeRepository::get([]);
				foreach ($customPostTypes as $customPostType){
					$data[]  = [
						$id => $customPostType->getName(),
						$name => $customPostType->getName(),
					];
				}

				break;

			// return all taxonomies
			case MetaTypes::TAXONOMY:
				$taxonomies = TaxonomyRepository::get([]);
				foreach ($taxonomies as $taxonomy){
					$data[]  = [
						$id => $taxonomy->getSlug(),
						$name => $taxonomy->getSlug(),
					];
				}
				break;
		}

		return $data;
	}
}