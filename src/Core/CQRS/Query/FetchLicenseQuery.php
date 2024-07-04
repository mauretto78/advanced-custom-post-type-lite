<?php

namespace ACPT_Lite\Core\CQRS\Query;

use ACPT_Lite\Admin\ACPT_License_Manager;
use ACPT_Lite\Utils\Http\ACPTApiClient;

class FetchLicenseQuery implements QueryInterface
{
	/**
	 * @return array|mixed|void
	 * @throws \Exception
	 */
	public function execute()
	{
		$currentVersion = ACPT_PLUGIN_VERSION;
		$licenseActivation = ACPT_License_Manager::getLicense();
		$activation = ACPTApiClient::call('/license/activation/fetch', [
			'id' => $licenseActivation['activation_id'],
		]);

		unset($licenseActivation['license']);

		$versionInfo = [
			'currentVersion' => $currentVersion,
			'licenseActivation' => $licenseActivation,
		];

		return array_merge($activation, $versionInfo);
	}
}