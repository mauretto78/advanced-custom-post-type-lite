<?php

namespace ACPT_Lite\Core\CQRS\Query;

use ACPT_Lite\Utils\Language;
use Sepia\PoParser\Parser;
use Sepia\PoParser\SourceHandler\FileSystem;

class FetchLanguagesQuery implements QueryInterface
{
	/**
	 * @inheritDoc
	 */
	public function execute()
	{
		$fileHandler = new FileSystem(__DIR__.'/../../../../i18n/languages/advanced-custom-post-type.pot');
		$poParser = new Parser($fileHandler);
		$catalog  = $poParser->parse();
		$entries = [
			'languages' => [],
			'translations' => [],
		];

		$languageDir = __DIR__.'/../../../../i18n/languages';
		foreach (new \DirectoryIterator($languageDir) as $file){
			if($file->getExtension() === 'po'){
				$languageCode = str_replace('.po','', $file->getFilename());
				$entries['languages'][] = [
					'value' => $languageCode,
					'label' => Language::getLabel($languageCode),
				];
			}
		}

		usort($entries['languages'], function ($a, $b) {
			return strcmp($a['label'], $b['label']);
		});

		foreach($catalog->getEntries() as $entry){
			$entries['translations'][$entry->getMsgId()] = esc_html__($entry->getMsgId(), ACPT_PLUGIN_NAME);
		}

		return $entries;
	}
}