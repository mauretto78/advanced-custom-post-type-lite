<?php

namespace ACPT_Lite\Integrations\Breakdance\Provider\Fields;

use ACPT_Lite\Core\Models\Meta\MetaFieldModel;

interface ACPTFieldInterface
{
	/**
	 * ACPTFieldInterface constructor.
	 *
	 * @param MetaFieldModel $fieldModel
	 */
	public function __construct(MetaFieldModel $fieldModel);
}