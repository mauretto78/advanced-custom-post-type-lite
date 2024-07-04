<?php

namespace ACPT_Lite\Integrations\WPML\Helper;

use ACPT_Lite\Utils\Data\Formatter\Driver\XMLFormatter;
use ACPT_Lite\Utils\Wordpress\Transient;

/**
 * Correct settings
 * @see https://wpml.org/documentation/related-projects/translate-sites-built-with-acf/recommended-custom-fields-translation-preferences-for-acf-and-wpml/
 */
class WPMLConfig
{
	const ACPT_WPML_CONFIG_TRANSIENT_KEY = 'acpt_wpml_config';
	const ACPT_WPML_CONFIG_TRANSIENT_TTL = 7200; // 2 hours

	/**
	 * @return string
	 */
	private static function filePath()
	{
		return ACPT_PLUGIN_DIR_PATH .'wpml-config.xml';
	}

	/**
	 * Delete the wpml-config.xml file
	 */
	public static function destroy()
	{
		if(file_exists(self::filePath())){
			unlink(self::filePath());
		}
	}

	/**
	 * @return bool
	 */
	public static function fileExists()
	{
		return file_exists(self::filePath());
	}

	/**
	 * Generate wpml-config.xml file
	 * (every 2 hours)
	 *
	 * @param array $data
	 *
	 * @return bool
	 */
	public static function generate(array $data = [])
	{
		if(Transient::has(self::ACPT_WPML_CONFIG_TRANSIENT_KEY)){
			return false;
		}

		try {
			Transient::set(self::ACPT_WPML_CONFIG_TRANSIENT_KEY, true, self::ACPT_WPML_CONFIG_TRANSIENT_TTL);

			$fileExists = file_exists(self::filePath());

			if(!$fileExists){
				$fileExists = touch(self::filePath());
			}

			if($fileExists === true){
				if(file_put_contents(self::filePath(), self::xml($data))){
					return true;
				}

				return false;
			}

			return false;
		} catch (\Exception $exception){
			return false;
		}
	}

	/**
	 * Generate the xml
	 *
	 * @param array $data
	 *
	 * @return string
	 */
	public static function xml(array $data = [])
	{
		$_xml = new \SimpleXMLElement( '<wpml-config/>');

		// <custom-fields>
		if(isset($data['custom-fields'])){
			$fieldsNode = $_xml->addChild('custom-fields');

			foreach ($data['custom-fields'] as $fieldName => $attrs){
				$fieldNode = $fieldsNode->addChild("custom-field", $fieldName);

				foreach ($attrs as $label => $value){
					$fieldNode->addAttribute($label, $value);
				}
			}
		}

		// <custom-term-fields>
		if(isset($data['custom-term-fields']) and !empty($data['custom-term-fields'])){
			$fieldsNode = $_xml->addChild('custom-term-fields');

			foreach ($data['custom-term-fields'] as $fieldName => $attrs){
				$fieldNode = $fieldsNode->addChild("custom-term-field", $fieldName);

				foreach ($attrs as $label => $value){
					$fieldNode->addAttribute($label, $value);
				}
			}
		}

		// <admin-texts>
		if(isset($data['admin-texts']) and !empty($data['admin-texts'])){
			$fieldsNode = $_xml->addChild('admin-texts');

			foreach ($data['admin-texts'] as $fieldName => $attrs){
				$fieldNode = $fieldsNode->addChild("key");
				$fieldNode->addAttribute('name', $fieldName);

				foreach ($attrs as $label => $value){
					$fieldNode->addAttribute($label, $value);
				}
			}
		}

		$xml = $_xml->asXML();

		return XMLFormatter::beautify($xml);
	}
}
