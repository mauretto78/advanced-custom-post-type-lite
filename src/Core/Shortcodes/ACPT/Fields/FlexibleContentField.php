<?php

namespace ACPT_Lite\Core\Shortcodes\ACPT\Fields;

class FlexibleContentField extends AbstractField
{
	/**
	 * @inheritDoc
	 */
	public function render()
	{
		if($this->payload->preview){
			return 'Can\'t preview a flexible field';
		}

		return null;
	}
}