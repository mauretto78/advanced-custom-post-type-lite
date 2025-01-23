<?php

namespace ACPT_Lite\Core\Shortcodes\ACPT\Fields;

class UserMultiField extends AbstractField
{
	public function render()
	{
		if($this->payload->preview){

			$rawData = $this->fetchRawData();

			if(!isset($rawData['value'])){
				return null;
			}

			$userIds = $rawData['value'];

			return $this->renderUsers($userIds);
		}

		return null;
	}

	/**
	 * @param $userIds
	 *
	 * @return string
	 */
	private function renderUsers($userIds)
	{
		if(!is_array($userIds)){
			return null;
		}

		if(!empty($userIds)){
			$usersArray = [];

			foreach ($userIds as $userId){
				$usersArray[] = $this->addBeforeAndAfter($this->renderUser($userId));
			}

			return implode(", ", $usersArray);
		}

		return null;
	}
}