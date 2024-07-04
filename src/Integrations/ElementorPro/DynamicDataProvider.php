<?php

namespace ACPT_Lite\Integrations\ElementorPro;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Core\Models\Meta\MetaGroupModel;
use ACPT_Lite\Core\Repository\CustomPostTypeRepository;
use ACPT_Lite\Core\Repository\MetaRepository;
use ACPT_Lite\Core\Repository\OptionPageRepository;
use ACPT_Lite\Integrations\ElementorPro\Tags\ACPTColorTag;
use ACPT_Lite\Integrations\ElementorPro\Tags\ACPTDateTimeTag;
use ACPT_Lite\Integrations\ElementorPro\Tags\ACPTGalleryTag;
use ACPT_Lite\Integrations\ElementorPro\Tags\ACPTImageTag;
use ACPT_Lite\Integrations\ElementorPro\Tags\ACPTMediaTag;
use ACPT_Lite\Integrations\ElementorPro\Tags\ACPTNumberTag;
use ACPT_Lite\Integrations\ElementorPro\Tags\ACPTTextTag;
use ACPT_Lite\Integrations\ElementorPro\Tags\ACPTUnitOfMeasureTag;
use ACPT_Lite\Integrations\ElementorPro\Tags\ACPTUrlTag;

class DynamicDataProvider
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
	 * @return DynamicDataProvider
	 */
	public static function getInstance()
	{
		if(self::$instance == null){
			self::$instance = new DynamicDataProvider();
			self::$instance->setFields();
		}

		return self::$instance;
	}

	/**
	 * DynamicDataProvider constructor.
	 */
	private function __construct(){}

	/**
	 * @return MetaFieldModel[]
	 */
	public function getFields()
	{
		return $this->fields;
	}

	/**
	 * Register fields
	 */
	private function setFields()
	{
		try {
			// OP fields
			$optionPageModels = OptionPageRepository::get([]);

			foreach ($optionPageModels as $optionPageModel){
				$metaGroups = MetaRepository::get([
					'belongsTo' => MetaTypes::OPTION_PAGE,
					'find' => $optionPageModel->getMenuSlug(),
				]);

				if(!empty($metaGroups)){
					$this->registerFields(
						$metaGroups,
						MetaTypes::OPTION_PAGE,
						$optionPageModel->getMenuSlug(),
					);
				}

				foreach ($optionPageModel->getChildren() as $childOptionPageModel){
					$metaGroups = MetaRepository::get([
						'belongsTo' => MetaTypes::OPTION_PAGE,
						'find' => $childOptionPageModel->getMenuSlug(),
					]);

					if(!empty($metaGroups)){
						$this->registerFields(
							$metaGroups,
							MetaTypes::OPTION_PAGE,
							$childOptionPageModel->getMenuSlug(),
							);
					}
				}
			}

			// CPT fields
			$args = [];
			if(isset($_GET['post']) and get_post_type($_GET['post']) !== 'elementor_library'){
				$postType = get_post_type($_GET['post']);
				$args = [
					'postType' => $postType
				];
			}

			$customPostTypeModels = CustomPostTypeRepository::get($args);

			foreach ($customPostTypeModels as $customPostTypeModel){
				$metaGroups = MetaRepository::get([
					'belongsTo' => MetaTypes::CUSTOM_POST_TYPE,
					'find' => $customPostTypeModel->getName(),
				]);

				if(!empty($metaGroups)){
					$this->registerFields(
						$metaGroups,
						MetaTypes::CUSTOM_POST_TYPE,
						$customPostTypeModel->getName()
					);
				}
			}
		} catch (\Exception $exception){
			$this->fields = [];
		}
	}

	/**
	 * @param MetaGroupModel[] $metaGroups
	 * @param $belongsTo
	 * @param $find
	 */
	private function registerFields($metaGroups, $belongsTo, $find)
	{
		$contextGroups = $this->contextGroups();

		foreach ($metaGroups as $group){
			foreach ($group->getBoxes() as $metaBox){
				foreach ($metaBox->getFields() as $boxFieldModel){
					foreach ($contextGroups as $tag => $fieldTypes){
						if(in_array($boxFieldModel->getType(), $fieldTypes)){
							$boxFieldModel->setBelongsToLabel($belongsTo);
							$boxFieldModel->setFindLabel($find);
							$this->fields[$tag][] = $boxFieldModel;
						}
					}
				}
			}
		}
	}

	/**
	 * @return array
	 */
	private function contextGroups()
	{
		return [
			ACPTColorTag::class => [
				MetaFieldModel::COLOR_TYPE,
			],
			ACPTDateTimeTag::class => [
				MetaFieldModel::DATE_RANGE_TYPE,
				MetaFieldModel::DATE_TIME_TYPE,
				MetaFieldModel::DATE_TYPE,
				MetaFieldModel::TIME_TYPE,
			],
			ACPTGalleryTag::class => [
				MetaFieldModel::GALLERY_TYPE,
			],
			ACPTImageTag::class => [
				MetaFieldModel::IMAGE_TYPE,
			],
			ACPTMediaTag::class => [
				MetaFieldModel::FILE_TYPE,
				MetaFieldModel::VIDEO_TYPE,
			],
			ACPTNumberTag::class => [
				MetaFieldModel::NUMBER_TYPE,
				MetaFieldModel::RATING_TYPE,
			],
			ACPTTextTag::class => [
				MetaFieldModel::ADDRESS_TYPE,
				MetaFieldModel::CHECKBOX_TYPE,
				MetaFieldModel::COUNTRY_TYPE,
				MetaFieldModel::EDITOR_TYPE,
				MetaFieldModel::EMAIL_TYPE,
				MetaFieldModel::HTML_TYPE,
				MetaFieldModel::PHONE_TYPE,
				MetaFieldModel::RADIO_TYPE,
				MetaFieldModel::RANGE_TYPE,
				MetaFieldModel::SELECT_TYPE,
				MetaFieldModel::SELECT_MULTI_TYPE,
				MetaFieldModel::TEXT_TYPE,
				MetaFieldModel::TEXTAREA_TYPE,
				MetaFieldModel::URL_TYPE,
			],
			ACPTUrlTag::class => [
				MetaFieldModel::EMAIL_TYPE,
				MetaFieldModel::EMBED_TYPE,
				MetaFieldModel::PHONE_TYPE,
				MetaFieldModel::URL_TYPE
			],
			ACPTUnitOfMeasureTag::class => [
				MetaFieldModel::CURRENCY_TYPE,
				MetaFieldModel::LENGTH_TYPE,
				MetaFieldModel::WEIGHT_TYPE,
			],
		];
	}
}
