<?php

namespace ACPT_Lite\Core\Shortcodes\ACPT\Fields;

class TermObjectField extends AbstractField
{
	public function render()
	{
		if($this->payload->preview){

			$rawData = $this->fetchRawData();

			if(!isset($rawData['value'])){
				return null;
			}

			if(empty($rawData['value'])){
				return null;
			}

			$termId = $rawData['value'];

			return $this->addBeforeAndAfter($this->renderTerm($termId));
		}

		return null;
	}
}