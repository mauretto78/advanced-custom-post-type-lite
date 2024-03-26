<?php

namespace ACPT_Lite\Core\CQRS\Query;

use ACPT_Lite\Constants\BelongsTo;

class FetchFindQuery implements QueryInterface
{
	/**
	 * @var
	 */
	private $id;

	/**
	 * @var
	 */
	private $belongsTo;

	/**
	 * FetchFindQuery constructor.
	 *
	 * @param $id
	 * @param $belongsTo
	 */
	public function __construct($id, $belongsTo)
	{
		$this->id = $id;
		$this->belongsTo = $belongsTo;
	}

	/**
	 * @return array|mixed
	 * @throws \Exception
	 */
	public function execute()
	{
		$return = '';

		switch ($this->belongsTo){
			case BelongsTo::POST_ID:
				$return = get_the_title($this->id);
				break;

			case BelongsTo::POST_TAX:
				$return = get_term($this->id)->name;
				break;

			case BelongsTo::POST_CAT:
				$return = get_cat_name($this->id);
				break;

			case BelongsTo::POST_TEMPLATE:
				$templates = wp_get_theme()->get_page_templates();
				$return = $templates[$this->id];
				break;

			case BelongsTo::TERM_ID:
				$term = get_term($this->id);
				$return = $term->name;
				break;

			case BelongsTo::USER_ID:
				$user = get_user_by('id', $this->id);
				$return = $user->display_name;
				break;
		}

		return $return;
	}
}