<?php

namespace ACPT_Lite\Core\Data\Import\Importer;

use ACPT_Lite\Constants\FormatterFormat;
use ACPT_Lite\Utils\Wordpress\Translator;

class MetadataXMLImporter extends AbstractImporter implements MetadataImporterInterface
{
	/**
	 * @param $newItemId
	 * @param $data
	 *
	 * @return mixed|void
	 * @throws \Exception
	 */
	public function importItem($newItemId, $data)
	{
		$xml = simplexml_load_string($data);

		if(!$xml){
			throw new \Exception(Translator::translate('Wrong XML provided, exit'));
		}

		if(!$xml instanceof \SimpleXMLElement){
			throw new \Exception(Translator::translate('Wrong XML provided, exit'));
		}

		if($xml->getName() !== 'acpt_meta'){
			throw new \Exception(Translator::translate('Malformed XML provided, no <acpt_meta> tag found'));
		}

		foreach ($xml as $acpt){
			$find = (isset($acpt->attributes()['find'])) ? $acpt->attributes()['find'][0]->__toString() : null;
			$belongsTo = $acpt->attributes()['belongsTo'][0]->__toString();

			foreach($acpt->groups[0] as $group){
				$groupName = $group->attributes()['name'][0]->__toString();
				$groupLabel = $group->attributes()['label'][0]->__toString();

				$belongs = [];

				foreach($group->belongs[0] as $belong){
					$belongs[] = [
						'belongsTo' => $belong->belongs_to[0]->__toString(),
						'find' => $belong->find[0]->__toString(),
						'logic' => $belong->logic[0]->__toString(),
						'operator' => $belong->operator[0]->__toString(),
					];
				}

				$this->importGroupSettings($groupName, $groupLabel, $belongs);

				foreach($group->boxes[0] as $box){
					$boxName = $box->attributes()['name'][0]->__toString();
					$boxLabel = $box->attributes()['label'][0]->__toString();

					$this->importBoxSettings($groupName, $boxName, $boxLabel);

					foreach ($box->fields[0] as $field){
						$fieldName = $field->attributes()['name'][0]->__toString();
						$fieldType = $field->attributes()['type'][0]->__toString();

						$props = $field->props[0];
						$blocks = $field->blocks[0];
						$children = $field->children[0];
						$advancedOptions = $field->advanced_options[0];
						$visibilityConditions = $field->visibility_conditions[0];
						$relations = $field->relations[0];
						$options = $field->options[0];
						$values = $field->values[0];

						$this->importFieldSettings(FormatterFormat::XML_FORMAT, $groupName, $boxName, $fieldName, $fieldType, $props, $advancedOptions, $visibilityConditions, $relations, $options, $children, $blocks);
						$this->importFieldMetadata(FormatterFormat::XML_FORMAT, $belongsTo, $newItemId, $boxName, $fieldName, $values);
					}
				}
			}
		}
	}
}