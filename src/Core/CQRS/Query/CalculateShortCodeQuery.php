<?php

namespace ACPT_Lite\Core\CQRS\Query;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Core\Repository\MetaRepository;

class CalculateShortCodeQuery implements QueryInterface
{
	/**
	 * @var array
	 */
	private array $data;

	/**
	 * @var MetaFieldModel
	 */
	private $metaField;

	/**
	 * CalculateShortCodeQuery constructor.
	 *
	 * @param array $data
	 *
	 * @throws \Exception
	 */
	public function __construct($data = [])
	{
		$this->data = $data;

		if(isset($data['fieldId'])){
			$this->metaField = MetaRepository::getMetaFieldById($data['fieldId']);
		}
	}

	/**
	 * @inheritDoc
	 */
	public function execute()
	{
		return [
			"metaKey" => $this->calculateMetaKey(),
			"shortcodes" => $this->calculateShortCodes()
		];
	}

	/**
	 * It's always the root field (if exists)
	 *
	 * @return string
	 */
	private function calculateMetaKey()
	{
		if(!isset($this->data['boxName'])){
			return null;
		}

		if(isset($this->data['fieldRootName'])){
			return $this->data['boxName'].'_'.$this->data['fieldRootName'];
		}

		if(!isset($this->data['fieldName'])){
			return null;
		}

		return $this->data['boxName'].'_'.$this->data['fieldName'];
	}

	/**
	 * @return array
	 */
	private function calculateShortCodes()
	{
		if(!isset($this->data['belongsTo'])){
			return [];
		}

		if(!is_array($this->data['belongsTo'])){
			return [];
		}

		$shortCodes = [];

		if(!empty($this->data['belongsTo'])){
			foreach ($this->data['belongsTo'] as $belongsTo){

				$base = null;

				if(
					$belongsTo['belongsTo'] === MetaTypes::CUSTOM_POST_TYPE or
					$belongsTo['belongsTo'] === 'POST_ID' or
					$belongsTo['belongsTo'] === 'POST_CAT' or
					$belongsTo['belongsTo'] === 'POST_TAX' or
					$belongsTo['belongsTo'] === 'POST_TEMPLATE'
				){
					$base = 'acpt';
				} else if($belongsTo['belongsTo'] === MetaTypes::TAXONOMY or $belongsTo['belongsTo'] === 'TERM_ID'){
					$base = 'acpt_tax';
				} else if($belongsTo['belongsTo'] === MetaTypes::USER or $belongsTo['belongsTo'] === 'USER_ID'){
					$base = 'acpt_user';
				}

				if($base !== null){
					$shortCodes[] = '['.$base.' box="'.$this->data['boxName'].'" field="'.$this->data['fieldName'].'"]';
				}
			}
		}

		return $shortCodes;
	}
}
