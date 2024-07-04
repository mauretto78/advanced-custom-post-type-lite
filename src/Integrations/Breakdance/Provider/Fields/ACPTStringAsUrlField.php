<?php

namespace ACPT_Lite\Integrations\Breakdance\Provider\Fields;

class ACPTStringAsUrlField extends ACPTStringField
{
	/**
	 * @inheritDoc
	 */
	public function returnTypes()
	{
		return ['url'];
	}

	/**
	 * @return string
	 */
	public function slug()
	{
		return ACPTField::slug($this->fieldModel).'_as_url';
	}

	/**
	 * @return string
	 */
	public function label()
	{
		return ACPTField::label($this->fieldModel).' (URL)';
	}
}