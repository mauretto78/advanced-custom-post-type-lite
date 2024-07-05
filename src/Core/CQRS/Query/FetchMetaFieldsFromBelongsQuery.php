<?php

namespace ACPT_Lite\Core\CQRS\Query;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Repository\MetaRepository;

class FetchMetaFieldsFromBelongsQuery implements QueryInterface
{
	/**
	 * @var string
	 */
	private $belongsTo;

	/**
	 * @var string
	 */
	private $find;

	/**
	 * FetchMetaFieldsFromBelongsQuery constructor.
	 *
	 * @param $belongsTo
	 * @param $find
	 */
	public function __construct($belongsTo, $find) {
		$this->belongsTo = $belongsTo;
		$this->find = $find;
	}

	/**
	 * @return array|mixed
	 * @throws \Exception
	 */
	public function execute()
	{
		$data = [
			[
				"name" => "--Select--",
				"id" => null,
			]
		];

		switch ($this->belongsTo){
			case MetaTypes::CUSTOM_POST_TYPE:
				$data[] = ['name' => 'ID', 'id' => 'ID'];
				$data[] = ['name' => 'date', 'id' => 'date'];
				$data[] = ['name' => 'title', 'id' => 'title'];

				// fetch cpt meta fields
				$metaFields = MetaRepository::getMetaFields([
					'belongsTo' => $this->belongsTo,
					'find' => $this->find,
					'lazy' => true,
				]);

				foreach ($metaFields as $metaField){
					$data[]  = [
						'id' => $metaField->getId(),
						'name' => '['.$metaField->getMetaBox()->getPostType().']' . $metaField->getUiName(),
					];
				}

				break;

			case MetaTypes::TAXONOMY:
				$data[] = ['name' => 'ID', 'id' => 'ID'];
				$data[] = ['name' => 'name', 'id' => 'name'];
				$data[] = ['name' => 'slug', 'id' => 'slug'];

				// fetch tax meta fields
				$metaFields = MetaRepository::getMetaFields([
					'lazy' => true,
				]);

				foreach ($metaFields as $metaField){
					$data[]  = [
						'id' => $metaField->getId(),
						'name' => '['.$metaField->getMetaBox()->getTaxonomy().']' . $metaField->getUiName(),
					];
				}

				break;
		}
		
		return $data;
	}
}