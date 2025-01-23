<?php

namespace ACPT_Lite\Core\Shortcodes\ACPT\Fields;

use ACPT_Lite\Utils\PHP\Country;

class CountryField extends AbstractField
{
	public function render()
	{
		if(!$this->isFieldVisible()){
			return null;
		}

		$rawData = $this->fetchRawData();

		if(!isset($rawData['value'])){
			return null;
		}

		return $this->addBeforeAndAfter($this->renderCountry($rawData));
	}

	/**
	 * @param $rawData
	 *
	 * @return string
	 */
	private function renderCountry($rawData)
	{
		$countryIsoCode = $rawData['country'] !== '' ? $rawData['country'] : $this->fetchMeta($this->getKey());
		
		if($this->payload->render === 'flag' and !empty($countryIsoCode)){
			return Country::getFlag($countryIsoCode);
		}

		if($this->payload->render === 'full' and !empty($countryIsoCode)){
			return Country::fullFormat($countryIsoCode, $rawData['value']);
		}

		return $rawData['value'];
	}
}