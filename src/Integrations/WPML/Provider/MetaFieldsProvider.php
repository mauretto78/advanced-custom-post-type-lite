<?php

namespace ACPT_Lite\Integrations\WPML\Provider;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Core\Models\Meta\MetaGroupModel;
use ACPT_Lite\Core\Repository\MetaRepository;
use ACPT_Lite\Core\Repository\OptionPageRepository;
use ACPT_Lite\Integrations\WPML\Constants\WPMLConstants;

class MetaFieldsProvider
{
	/**
	 * @var self
	 */
	private static $instance;

	/**
	 * @var array
	 */
	private array $fields = [];

	/**
	 * @return MetaFieldsProvider
	 */
	public static function getInstance()
	{
		if(self::$instance == null){
			self::$instance = new MetaFieldsProvider();
			self::$instance->setFields();
		}

		return self::$instance;
	}

	/**
	 * DynamicDataProvider constructor.
	 */
	private function __construct(){}

	/**
	 * @return array
	 */
	public function getFields(): array
	{
		return $this->fields;
	}

	/**
	 * Load groups
	 */
	public function setFields()
	{
		try {
			$this->fields = [
				'custom-fields' => $this->postTypeFields(),
				'custom-term-fields' => $this->taxonomyFields(),
				'admin-texts' => $this->optionPageFields(),
			];
		} catch (\Exception $exception){
			$this->fields = [];
		}
	}

	/**
	 * @return array
	 * @throws \Exception
	 */
	private function postTypeFields()
	{
		$metaGroups = MetaRepository::get([
			'belongsTo' => MetaTypes::CUSTOM_POST_TYPE
		]);

		return $this->formatFields($metaGroups, MetaTypes::CUSTOM_POST_TYPE);
	}

	/**
	 * @return array
	 * @throws \Exception
	 */
	private function taxonomyFields()
	{
		$metaGroups = MetaRepository::get([
			'belongsTo' => MetaTypes::TAXONOMY
		]);

		return $this->formatFields($metaGroups, MetaTypes::TAXONOMY);
	}

	/**
	 * @return array
	 * @throws \Exception
	 */
	private function optionPageFields()
	{
		$fields = [];
		$pages = OptionPageRepository::get([]);

		foreach ($pages as $page){
			$metaGroups = MetaRepository::get([
				'belongsTo' => MetaTypes::OPTION_PAGE,
				'find' => $page->getMenuSlug()
			]);

			$fields = array_merge($fields, $this->formatFields($metaGroups, MetaTypes::OPTION_PAGE, $page->getMenuSlug()));

			foreach ($page->getChildren() as $child){
				$metaGroups = MetaRepository::get([
					'belongsTo' => MetaTypes::OPTION_PAGE,
					'find' => $child->getMenuSlug()
				]);

				$fields = array_merge($fields, $this->formatFields($metaGroups, MetaTypes::OPTION_PAGE, $child->getMenuSlug()));
			}
		}

		return $fields;
	}

	/**
	 * @param MetaGroupModel[] $metaGroups
	 * @param $belongsTo
	 * @param null $find
	 *
	 * @return array
	 */
	private function formatFields(array $metaGroups, $belongsTo, $find = null)
	{
		$fields = [];

		foreach ($metaGroups as $metaGroup){
			foreach ($metaGroup->getBoxes() as $box){
				foreach ($box->getFields() as $field){
					$field->setBelongsToLabel($belongsTo);
					$field->setFindLabel($find);
					$fields[$field->getDbName()] = $this->formatField($field);
				}
			}
		}

		return $fields;
	}

	/**
	 * @param MetaFieldModel $fieldModel
	 *
	 * @return array
	 */
	private function formatField(MetaFieldModel $fieldModel)
	{
		switch ($fieldModel->getType()){

			case MetaFieldModel::TEXT_TYPE:
				$action = WPMLConstants::ACTION_TRANSLATE;
				$style = WPMLConstants::TYPE_LINE;
				break;

			case MetaFieldModel::EDITOR_TYPE:
			case MetaFieldModel::TEXTAREA_TYPE:
				$action = WPMLConstants::ACTION_TRANSLATE;
				$style = WPMLConstants::TYPE_AREA;
				break;

			default:
				$action = WPMLConstants::ACTION_COPY;
				$style = WPMLConstants::TYPE_LINE;
		}

		return [
			'action' => $action,
			'style' => $style,
			'label' => $fieldModel->getUiName()
		];
	}
}