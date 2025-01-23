<?php

namespace ACPT_Lite\Core\Generators\OptionPage;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Generators\AbstractGenerator;
use ACPT_Lite\Core\Generators\Meta\Fields\AbstractField;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;

/**
 * *************************************************
 * OptionPageMetaBoxGenerator class
 * *************************************************
 *
 * @author Mauro Cassani
 * @link https://github.com/mauretto78/
 */
class OptionPageMetaBoxFieldGenerator extends AbstractGenerator
{
	/**
	 * @var MetaFieldModel
	 */
	private MetaFieldModel $fieldModel;

	/**
	 * @var string
	 */
	private $optionPageSlug;

	/**
	 * @var array
	 */
	private array $permissions;

	/**
	 * OptionPageMetaBoxFieldGenerator constructor.
	 *
	 * @param MetaFieldModel $fieldModel
	 * @param $optionPageSlug
	 * @param array $permissions
	 */
	public function __construct(MetaFieldModel $fieldModel, $optionPageSlug, $permissions = [])
	{
		$this->fieldModel = $fieldModel;
		$this->optionPageSlug = $optionPageSlug;
		$this->permissions = $permissions;
	}

	/**
	 * @return AbstractField|null
	 */
	public function generate()
	{
		return $this->getOptionPageField();
	}

	/**
	 * @return AbstractField|null
	 */
	private function getOptionPageField()
	{
		$className = 'ACPT\\Core\\Generators\\Meta\\Fields\\'.$this->fieldModel->getType().'Field';

		if(class_exists($className)){
			/** @var AbstractField $instance */
			$instance = new $className($this->fieldModel, MetaTypes::OPTION_PAGE, $this->optionPageSlug);
			$instance->setExternalPermissions($this->permissions);

			return $instance;
		}

		return null;
	}
}