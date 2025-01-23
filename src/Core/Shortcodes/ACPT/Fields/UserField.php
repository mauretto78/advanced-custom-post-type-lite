<?php

namespace ACPT_Lite\Core\Shortcodes\ACPT\Fields;

class UserField extends AbstractField
{
	public function render()
	{
		if($this->payload->preview){

			$rawData = $this->fetchRawData();

			if(!isset($rawData['value'])){
				return null;
			}

			$userId = $rawData['value'];

			return $this->addBeforeAndAfter($this->renderUser($userId));
		}

		return null;
	}
}