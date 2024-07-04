<?php

namespace ACPT_Lite\Constants;

class FormatterFormat
{
	const ACPT_FORMAT = 'acpt';
	const CSV_FORMAT = 'csv';
	const JSON_FORMAT = 'json';
	const XML_FORMAT = 'xml';
	const YAML_FORMAT = 'yaml';

	const ALLOWED_FORMATS = [
		self::ACPT_FORMAT,
		self::CSV_FORMAT,
		self::JSON_FORMAT,
		self::XML_FORMAT,
		self::YAML_FORMAT,
	];
}