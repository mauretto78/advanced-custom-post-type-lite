<?php

namespace ACPT_Lite\Core\CQRS\Command;

use ACPT_Lite\Constants\FormatterFormat;
use ACPT_Lite\Core\Models\Dataset\DatasetModel;
use ACPT_Lite\Core\Models\Dataset\DatasetModelItem;
use ACPT_Lite\Core\Repository\DatasetRepository;
use ACPT_Lite\Utils\Data\Formatter\Formatter;
use ACPT_Lite\Utils\Wordpress\Translator;

class ImportDatasetCommand implements CommandInterface
{
	const MAX_SIZE = 2097152;

	/**
	 * @var
	 */
	private $file;

	/**
	 * @var string
	 */
	private $id;

	/**
	 * ImportDatasetCommand constructor.
	 *
	 * @param $id
	 * @param array $file
	 */
	public function __construct($id, array $file)
	{
		$this->file = $file;
		$this->id = $id;
	}

	/**
	 * @return DatasetModel|null
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
			FormatterFormat::JSON_FORMAT,
			FormatterFormat::CSV_FORMAT,
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

		$exceptionMessage = 'An error has occurred during the parsing of the file. Please read the <a href="https://docs.acpt.io" target="_blank">documentation</a>, then check your file and retry. If the error persists, contact the <a href="mailto:info@acpt.io">support</a>';
		$contentFile = file_get_contents($contentFileInfo['file']);

		try {
			$content = Formatter::toArray($extension, $contentFile);
			$datasetModel = DatasetRepository::getById($this->id);
			$datasetModel->clearItems();

			foreach($content as $index => $item){

				$label = null;
				$value = null;

				switch ($extension){
					case "csv":

						if(!isset($item[0]) and !isset($item[1])){
							throw new \Exception($exceptionMessage);
						}

						$label = (string)$item[0];
						$value = (string)$item[1];
						break;

					case "yaml":
					case "json":

						if(!isset($item['label']) and !isset($item['value'])){
							throw new \Exception($exceptionMessage);
						}

						$label = (string)$item['label'];
						$value = (string)$item['value'];
						break;
				}

				$datasetItemModel = DatasetModelItem::hydrateFromArray([
					'dataset' => $datasetModel,
					'label' => sanitize_text_field($label),
					'value' => sanitize_text_field($value),
					'isDefault' => false,
					'sort' => (int)$index+1,
				]);

				$datasetModel->addItem($datasetItemModel);
			}

			DatasetRepository::save($datasetModel);

			return $datasetModel;
		} catch (\Exception $exception){
			throw new \Exception($exception->getMessage());
		}
	}
}