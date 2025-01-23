<?php

namespace ACPT_Lite\Core\Shortcodes\ACPT\Fields;

use ACPT_Lite\Core\Helper\Strings;

class RatingField extends AbstractField
{
	public function render()
	{
		if(!$this->isFieldVisible()){
			return null;
		}

		$rawData = $this->fetchRawData();

		if(!isset($rawData['value'])){
			return null;
		}

		return $this->addBeforeAndAfter(Strings::renderStars($rawData['value']));
	}
}


