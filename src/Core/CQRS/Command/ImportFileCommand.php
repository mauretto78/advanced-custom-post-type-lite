<?php

namespace ACPT_Lite\Core\CQRS\Command;

use ACPT_Lite\Constants\FormatterFormat;
use ACPT_Lite\Core\Repository\ImportRepository;
use ACPT_Lite\Utils\Data\Formatter\Formatter;
use ACPT_Lite\Utils\Wordpress\Translator;

class ImportFileCommand implements CommandInterface
{
	const MAX_SIZE = 2097152;

	/**
	 * @var
	 */
	private $file;

	/**
	 * ImportFileCommand constructor.
	 *
	 * @param array $file
	 */
	public function __construct(array $file)
	{
		$this->file = $file;
	}

	/**
	 * @return array|mixed
	 * @throws \Exception
	 */
	public function execute()
	{
		$file = $this->file;

		if($file['size'] > self::MAX_SIZE){
			throw new \Exception(Translator::translate('File too large. Max size: 2Mb'));
		}

		// validate extension
		$path_parts = pathinfo($file["name"]);
		$extension = $path_parts['extension'];

		$allowedExtensions = [
			FormatterFormat::ACPT_FORMAT,
			FormatterFormat::JSON_FORMAT,
			FormatterFormat::XML_FORMAT,
			FormatterFormat::YAML_FORMAT,
		];

		if(!in_array($extension, $allowedExtensions)){
			throw new \Exception($extension . ' format is not allowed');
		}

		// upload file
		$contentFileInfo = wp_handle_upload( $file, [
			'test_form' => false,
			'test_type' => false,
		]);

		$contentFile = file_get_contents($contentFileInfo['file']);
		$content = Formatter::toArray($extension, $contentFile);

		// import content
		ImportRepository::import($content);

		return $content;
	}
}