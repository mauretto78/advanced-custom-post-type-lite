<?php

namespace ACPT_Lite\Core\Shortcodes\ACPT\Fields;

class PostObjectField extends AbstractField
{
	public function render()
	{
		if($this->payload->preview){

			$rawData = $this->fetchRawData();

			if(!isset($rawData['value'])){
				return null;
			}

			$postId = $rawData['value'];

			return $this->addBeforeAndAfter($this->renderPost($postId));
		}

		return null;
	}
}