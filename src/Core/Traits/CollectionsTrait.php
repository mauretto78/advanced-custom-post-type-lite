<?php

namespace ACPT_Lite\Core\Traits;

use ACPT_Lite\Core\Models\Abstracts\AbstractModel;
use ACPT_Lite\Utils\PHP\Arrays;

trait CollectionsTrait
{
	/**
	 * @param $id
	 * @param $collection
	 *
	 * @return bool
	 */
	public function existsInCollection($id, $collection): bool
	{
		/** @var AbstractModel $item */
		foreach ($collection as $item){
			if ($item->getId() === $id) {
				return true;
			}
		}

		return false;
	}

	/**
	 * @param $id
	 * @param $collection
	 *
	 * @return mixed
	 */
	public function removeFromCollection($id, $collection)
	{
		if($this->existsInCollection($id, $collection)){
			/** @var AbstractModel $item */
			foreach ($collection as $index => $item){
				if ($id === $item->getId()) {
					unset($collection[$index]);
				}
			}
		}

		return Arrays::reindex($collection);
	}
}