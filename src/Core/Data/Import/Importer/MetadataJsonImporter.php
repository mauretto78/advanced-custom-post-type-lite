<?php

namespace ACPT_Lite\Core\Data\Import\Importer;

use ACPT_Lite\Constants\FormatterFormat;
use ACPT_Lite\Utils\Wordpress\Translator;

class MetadataJsonImporter extends AbstractImporter implements MetadataImporterInterface
{
	/**
	 * @param $newItemId
	 * @param $data
	 *
	 * @return mixed
	 * @throws \Exception
	 */
	public function importItem($newItemId, $data)
	{
		$parsed = json_decode($data, true);

		$this->importParserItem($newItemId, $parsed);
	}

	/**
	 * @param $newItemId
	 * @param $parsed
	 *
	 * @throws \Exception
	 */
	protected function importParserItem($newItemId, $parsed)
	{
		if(!isset($parsed['acpt_meta'])){
			throw new \Exception(Translator::translate('Malformed data provided, no `acpt_meta` node found'));
		}

		foreach ($parsed['acpt_meta'] as $acpt){

			$belongsTo = $acpt['belongsTo'];

			foreach ($acpt['groups'] as $group){

				$groupName = $group['name'];
				$groupLabel = $group['label'];
				$belongs = $group['belongs'];

				$this->importGroupSettings($groupName, $groupLabel, $belongs);

				foreach($group['boxes'] as $box){
					$boxName = $box['name'];
					$boxLabel = $box['label'];

					$this->importBoxSettings($groupName, $boxName, $boxLabel);

					foreach ($box['fields'] as $field){
						$fieldName = $field['name'];
						$fieldType = $field['type'];

						$props = $field['props'];
						$blocks = $field['blocks'];
						$children = $field['children'];
						$advancedOptions = $field['advanced_options'];
						$visibilityConditions = $field['visibility_conditions'];
						$relations = $field['relations'];
						$options = $field['options'];
						$values = $field['values'];

						$this->importFieldSettings(FormatterFormat::JSON_FORMAT, $groupName, $boxName, $fieldName, $fieldType, $props, $advancedOptions, $visibilityConditions, $relations, $options, $children, $blocks);
						$this->importFieldMetadata(FormatterFormat::JSON_FORMAT, $belongsTo, $newItemId, $boxName, $fieldName, $values);
					}
				}
			}
		}
	}
}