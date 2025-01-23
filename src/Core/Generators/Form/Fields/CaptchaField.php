<?php

namespace ACPT_Lite\Core\Generators\Form\Fields;

use ACPT_Lite\Core\Models\Settings\SettingsModel;
use ACPT_Lite\Utils\Settings\Settings;

class CaptchaField extends AbstractField
{
	/**
	 * @inheritDoc
	 */
	public function render()
	{
		$googleRecaptchaSiteKey = (isset($this->fieldModel->getExtra()['googleSiteKey']) and !empty($this->fieldModel->getExtra()['googleSiteKey'])) ? $this->fieldModel->getExtra()['googleSiteKey'] :  (Settings::get(SettingsModel::GOOGLE_RECAPTCHA_SITE_KEY));
		$googleRecaptchaSecretKey = (isset($this->fieldModel->getExtra()['googleSecretKey']) and !empty($this->fieldModel->getExtra()['googleSecretKey'])) ? $this->fieldModel->getExtra()['googleSecretKey'] : (Settings::get(SettingsModel::GOOGLE_RECAPTCHA_SECRET_KEY));

		if(empty($googleRecaptchaSiteKey) or empty($googleRecaptchaSecretKey)){
			return null;
		}

		return '<div class="g-recaptcha" data-sitekey="'.$googleRecaptchaSiteKey.'"></div>';
	}

	public function enqueueFieldAssets()
	{
		wp_enqueue_script( 'recaptcha', 'https://www.google.com/recaptcha/api.js', [], '2.2.0', true);
	}
}
