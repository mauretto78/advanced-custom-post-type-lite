<?php

namespace ACPT_Lite\Core\CQRS\Command;

use ACPT_Lite\Core\Helper\Uuid;
use ACPT_Lite\Core\Models\Settings\SettingsModel;
use ACPT_Lite\Core\Repository\SettingsRepository;

class SaveSettingsCommand implements CommandInterface
{
	/**
	 * @var array
	 */
	private array $settings;

	/**
	 * SaveOptionPagesCommand constructor.
	 *
	 * @param array $settings
	 */
	public function __construct(array $settings = [])
	{
		$this->settings = $settings;
	}

	/**
	 * @return array|mixed
	 * @throws \Exception
	 */
	public function execute()
	{
		foreach ($this->settings as $key => $value){
			$id = (SettingsRepository::getSingle($key) !== null) ? SettingsRepository::getSingle($key)->getId() : Uuid::v4();
			$model = SettingsModel::hydrateFromArray([
				'id' => $id,
				'key' => $key,
				'value' => $value
			]);

			SettingsRepository::save($model);
		}
	}
}