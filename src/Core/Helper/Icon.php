<?php

namespace ACPT_Lite\Core\Helper;

class Icon
{
	/**
	 * Icon can be rendered in three ways:
	 *
	 * - ‘dashicons-video-alt’ (Uses the video icon from Dashicons[2])
	 * - ‘get_template_directory_uri() . “/images/cutom-posttype-icon.png”‘ (Use a image located in the current theme)
	 * - ‘data:image/svg+xml;base64,’ . base64_encode( “<svg version=”1.1″ xmlns=”http://www.w3.org/2000/svg” xmlns:xlink=”http://www.w3.org/1999/xlink” x=”0px” y=”0px” width=”20px” height=”20px” viewBox=”0 0 459 459″> <path fill=”black” d=”POINTS”/></svg>” )’ (directly embedding a svg with ‘fill=”black”‘ will allow correct colors. Also see [3])
	 *
	 * @param $icon
	 *
	 * @return string
	 */
	public static function render($icon)
	{
		// render image if values starts by http / https
		if(Strings::contains('http://', $icon) or Strings::contains('https://', $icon)){
			return $icon;
		}

		// add dashicons: for retro-compatibility
		if(!Strings::contains('dashicons', $icon)){
			return 'dashicons-'.$icon;
		}

		return str_replace('dashicons:','dashicons-', $icon);
	}
}