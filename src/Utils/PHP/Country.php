<?php

namespace ACPT_Lite\Utils\PHP;

class Country
{
	/**
	 * @param string $iso2Code
	 *
	 * @return string
	 */
	public static function getFlag($iso2Code)
	{
		$image = ACPT_PLUGIN_DIR_PATH . '/assets/static/img/flags/'.$iso2Code.'.png';

		if(file_exists($image)){
			$imgData = base64_encode(file_get_contents($image));
			$style = '
				display: inline-flex;
			    background: url(data:image/png;base64,'.$imgData.');
			    background-size: cover;
			    width: 24px;
			    height: 16px;
			';

			return '<span style="'.$style.'"></span>';
		}

		return null;
	}

	/**
	 * @param string $iso2Code
	 * @param string $language
	 *
	 * @return string
	 */
	public static function fullFormat($iso2Code, $language)
	{
		$style = '
			display: flex;
		    gap: 5px;
		    align-items: center;
		';

		return '<div style="'.$style.'">'.Country::getFlag($iso2Code) . " <span>". $language.'</span></div>';
	}
}