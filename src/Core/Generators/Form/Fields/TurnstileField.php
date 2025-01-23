<?php

namespace ACPT_Lite\Core\Generators\Form\Fields;

use ACPT_Lite\Core\Models\Settings\SettingsModel;
use ACPT_Lite\Utils\Settings\Settings;

/**
 * Cloudflare Turnstile docs
 *
 * @see https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/
 * @see https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
 */
class TurnstileField extends AbstractField
{
	/**
	 * @inheritDoc
	 */
	public function render()
	{
		$cloudflareTurnstileSiteKey = (isset($this->fieldModel->getExtra()['turnstileSiteKey']) and !empty($this->fieldModel->getExtra()['turnstileSiteKey'])) ? $this->fieldModel->getExtra()['turnstileSiteKey'] :  (Settings::get(SettingsModel::CLOUDFLARE_TURNSTILE_SITE_KEY));
		$cloudflareTurnstileSecretKey = (isset($this->fieldModel->getExtra()['turnstileSecretKey']) and !empty($this->fieldModel->getExtra()['turnstileSecretKey'])) ? $this->fieldModel->getExtra()['turnstileSecretKey'] : (Settings::get(SettingsModel::CLOUDFLARE_TURNSTILE_SECRET_KEY));

		if(empty($cloudflareTurnstileSiteKey) or empty($cloudflareTurnstileSecretKey)){
			return null;
		}

		return '<div class="cf-turnstile" data-sitekey="'.$cloudflareTurnstileSiteKey.'"></div>';
	}

	/**
	 * @inheritDoc
	 */
	public function enqueueFieldAssets()
	{
		wp_enqueue_script( 'turnstile', 'https://challenges.cloudflare.com/turnstile/v0/api.js', [], ACPT_PLUGIN_VERSION, true);
	}
}