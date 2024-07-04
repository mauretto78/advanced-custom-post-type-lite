<?php

namespace ACPT_Lite\Utils\Data\Formatter\Driver;

use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Utils\Data\Formatter\FormatterInterface;

class XMLFormatter implements FormatterInterface
{
	const XML_CHILD_NODE_PREFIX = 'item_';
	const NULL = 'NULL';

	/**
	 * @inheritDoc
	 */
	public static function format( array $data = [], $rootElement = null ): string
	{
		if($rootElement === null){
			$rootElement = '<acpt/>';
		}

		$xml = self::arrayToXml($data, $rootElement);

		return self::beautify($xml);
	}

	/**
	 * @param array $data
	 * @param null $rootElement
	 * @param null $xml
	 *
	 * @return mixed
	 */
	private static function arrayToXml($data, $rootElement = null, $xml = null)
	{
		$_xml = $xml;

		if ($_xml === null) {
			$_xml = new \SimpleXMLElement($rootElement !== null ? $rootElement : '<root/>');
		}

		foreach ($data as $k => $v) {

			if (is_array($v)) {
				if(is_numeric($k)){
					$k = self::XML_CHILD_NODE_PREFIX.$k;
				}

				self::arrayToXml($v, $k, $_xml->addChild($k));

			} else {

				if(is_null($v)){
					$v = 'NULL';
				}

				if(is_numeric($k)){
					$k = self::XML_CHILD_NODE_PREFIX.$k;
				}

				$node = $_xml->addChild($k, $v);

				if(is_bool($v)){
					$boolAsString = ($v == true) ? 'true' : 'false';
					$node->addAttribute("value", $boolAsString);
				}
			}
		}

		return $_xml->asXML();
	}

	/**
	 * @param $xml
	 *
	 * @return mixed
	 */
	public static function beautify($xml)
	{
		$dom = new \DOMDocument;
		$dom->preserveWhiteSpace = false;
		$dom->loadXML(html_entity_decode($xml));
		$dom->formatOutput = true;

		return $dom->saveXML();
	}

	/**
	 * @inheritDoc
	 */
	public static function toArray( string $string ): array
	{
		$xmlObject = simplexml_load_string($string);
		$out = [];

		return self::xmlToArray($xmlObject, $out);
	}

	/**
	 * @param $xmlObject
	 * @param array $out
	 *
	 * @return array
	 */
	private static function xmlToArray($xmlObject, $out = [])
	{
		foreach ( (array)$xmlObject as $index => $node) {

			// handle boolean values
			$nodeObject = $xmlObject->$index;
			if(is_object($nodeObject) and @$nodeObject->attributes()){
				$node = $nodeObject->attributes()->value == 'true';
			}

			if(is_string($node)){
				$node = htmlentities($node);
			}

			if($node === self::NULL){
				$node = null;
			}

			if(is_numeric($node)){
				$node = Strings::convertStringToNumber($node);
			}

			preg_match('/item_[0-9]+/', $index, $check);

			if(!empty($check)){
				$index = str_replace(self::XML_CHILD_NODE_PREFIX, '', $index);
				$index = (int)$index;
			}

			$out[$index] = (is_object($node)) ? self::xmlToArray($node) : $node;
		}

		return $out;
	}
}
