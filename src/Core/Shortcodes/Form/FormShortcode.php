<?php

namespace ACPT_Lite\Core\Shortcodes\Form;

use ACPT_Lite\Core\Generators\Form\FormGenerator;
use ACPT_Lite\Core\Models\Settings\SettingsModel;
use ACPT_Lite\Core\Repository\FormRepository;
use ACPT_Lite\Utils\Settings\Settings;
use ACPT_Lite\Utils\Wordpress\WPUtils;

class FormShortcode
{
	/**
	 * @param $atts
	 *
	 * @return string
	 * @throws \Exception
	 */
	public function render($atts)
	{
		if(Settings::get(SettingsModel::ENABLE_FORMS,0) != 1){
			return null;
		}

		if(!isset($atts['id'])){
			return null;
		}

		$formModel = FormRepository::getByKey($atts['id']);

		if($formModel === null){
			return null;
		}

		if(isset($atts['pid']) and !WPUtils::postExists($atts['pid'])){
			return "The post ID is not valid.";
		}

		if(isset($atts['tid']) and !WPUtils::termExists($atts['tid'])){
			return "The term ID is not valid.";
		}

		if(isset($atts['uid']) and !WPUtils::userExists($atts['uid'])){
			return "The user ID is not valid.";
		}

		$pid = $atts['pid'] ?? null;
		$tid = $atts['tid'] ?? null;
		$uid = $atts['uid'] ?? null;

		$formBuilder = new FormGenerator($formModel, $pid, $tid, $uid);

		return $formBuilder->render();
	}
}