<?php

namespace ACPT_Lite\Core\CQRS\Command;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Utils\Data\Meta;

abstract class AbstractMetaFieldValueCommand
{
	/**
	 * @var MetaFieldModel
	 */
	protected MetaFieldModel $fieldModel;

	/**
	 * @var string
	 */
	protected $belongsTo;

	/**
	 * @var string
	 */
	protected $location;

	/**
	 * @var string
	 */
	protected $identifier;

	/**
	 * @var array
	 */
	protected $args;

	/**
	 * SaveMetaFieldValueCommand constructor.
	 *
	 * @param MetaFieldModel $fieldModel
	 * @param array $args
	 *
	 * @throws \Exception
	 */
	public function __construct(MetaFieldModel $fieldModel, $args = [])
	{
		$this->buildFromArgs($args);
		$this->args = $args;
		$this->fieldModel = $fieldModel;
	}

	/**
	 * @param $args
	 *
	 * @throws \Exception
	 */
	protected function buildFromArgs($args)
	{
		if(isset($args['post_id'])){
			$this->belongsTo = MetaTypes::CUSTOM_POST_TYPE;
			$this->location = $args['post_id'];
			$this->identifier = 'post_id';
		} elseif (isset($args['term_id'])){
			$this->belongsTo = MetaTypes::TAXONOMY;
			$this->location = $args['term_id'];
			$this->identifier = 'term_id';
		} elseif (isset($args['user_id'])){
			$this->belongsTo = MetaTypes::USER;
			$this->location = $args['user_id'];
			$this->identifier = 'user_id';
		}

		if($this->belongsTo === null and $this->location === null){
			throw new \Exception("BelongsTo and location are null. Invalid args provided");
		}
	}

	/**
	 * @param $key
	 * @param null $location
	 *
	 * @return mixed|void
	 */
	protected function get($key, $location = null)
	{
		$loc = $location ? $location : $this->location;

		return Meta::fetch($loc, $this->belongsTo, $key);
	}

	/**
	 * @param string $key
	 *
	 * @return mixed|void
	 */
	protected function getData($key = '')
	{
		return $this->get($this->fieldModel->getDbName().$key);
	}

	/**
	 * @param $key
	 * @param $value
	 * @param null $location
	 *
	 * @return bool|int|\WP_Error
	 */
	protected function set($key, $value, $location = null)
	{
		$loc = $location ? $location : $this->location;

		return Meta::save($loc, $this->belongsTo, $key, $value);
	}
}