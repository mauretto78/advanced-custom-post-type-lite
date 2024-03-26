<?php

namespace ACPT_Lite\Core\CQRS\Query;

use ACPT_Lite\Constants\BelongsTo;
use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Validators\ArgumentsArrayValidator;

class FetchPreviewLinkQuery implements QueryInterface
{
	/**
	 * @var array
	 */
	private array $data;

	/**
	 * FetchPreviewLinkQuery constructor.
	 *
	 * @param array $data
	 */
	public function __construct(array $data = [])
	{
		$this->data = $data;
	}

	/**
	 * @inheritDoc
	 */
	public function execute()
	{
		$mandatory_keys = [
			'id' => [
				'required' => true,
				'type' => 'string|integer',
			],
			'type' => [
				'required' => true,
				'type' => 'string',
			],
			'belongsTo' => [
				'required' => true,
				'type' => 'string',
			],
			'find' => [
				'required' => true,
				'type' => 'string',
			]
		];

		$validator = new ArgumentsArrayValidator();

		if(!$validator->validate($mandatory_keys, $this->data)){
			throw new \InvalidArgumentException($validator->errorMessage());
		}

		$id = $this->data['id'];
		$type = $this->data['type'];
		$find = $this->data['find'];
		$belongsTo = $this->data['belongsTo'];

		if($type === 'single'){

			if($belongsTo === BelongsTo::TERM_ID){
				return get_term_link($id);
			}

			return get_the_permalink($id);
		}

		if($belongsTo === MetaTypes::CUSTOM_POST_TYPE){
			if($find === 'post'){
				$category = get_the_category($id);
				$archiveLink = get_category_link($category);
			} else {
				$archiveLink = get_post_type_archive_link($find);
			}

			return $archiveLink;
		}

		if($belongsTo === MetaTypes::TAXONOMY){
			return get_term_link($id);
		}
	}
}