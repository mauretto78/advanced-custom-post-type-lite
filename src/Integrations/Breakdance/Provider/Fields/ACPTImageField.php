<?php

namespace ACPT_Lite\Integrations\Breakdance\Provider\Fields;

use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Utils\Wordpress\WPAttachment;
use Breakdance\DynamicData\ImageData;
use Breakdance\DynamicData\ImageField;

class ACPTImageField extends ImageField implements ACPTFieldInterface
{
	/**
	 * @var MetaFieldModel
	 */
	protected MetaFieldModel $fieldModel;

	/**
	 * AbstractACPTField constructor.
	 *
	 * @param MetaFieldModel $fieldModel
	 */
	public function __construct(MetaFieldModel $fieldModel)
	{
		$this->fieldModel = $fieldModel;
	}

	/**
	 * @return string
	 */
	public function label()
	{
		return ACPTField::label($this->fieldModel);
	}

	/**
	 * @return string
	 */
	public function category()
	{
		return ACPTField::category();
	}

	/**
	 *@return string
	 */
	public function subcategory()
	{
		return ACPTField::subcategory($this->fieldModel);
	}

	/**
	 * @return string
	 */
	public function slug()
	{
		return ACPTField::slug($this->fieldModel);
	}

	/**
	 * @param mixed $attributes
	 *
	 * @return ImageData
	 * @throws \Exception
	 */
	public function handler($attributes): ImageData
	{
		$value = ACPTField::getValue($this->fieldModel, $attributes);

		if(empty($value)){
			return ImageData::emptyImage();
		}

		if(!$value instanceof WPAttachment){
			return ImageData::emptyImage();
		}

		return ImageData::fromAttachmentId($value->getId());
	}
}