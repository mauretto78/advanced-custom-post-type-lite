<?php

namespace ACPT_Lite\Utils\PHP;

class Browser
{
	/**
	 * @param $browser
	 *
	 * @return bool
	 */
	public static function isBrowser($browser)
	{
		$currentBrowser = self::getBrowser();

		if($currentBrowser['ub'] === null){
			return false;
		}

		return $currentBrowser['ub'] === $browser;
	}

	/**
	 * @return array
	 */
	public static function getBrowser()
	{
		if(!isset($_SERVER[ 'HTTP_USER_AGENT' ])){
			return [
				'userAgent' => null,
				'ub'        => null,
				'name'      => null,
				'version'   => null,
				'platform'  => null
			];
		}

		$u_agent = $_SERVER[ 'HTTP_USER_AGENT' ];

		//First get the platform?
		if ( preg_match( '/linux/i', $u_agent ) ) {
			$platform = 'linux';
		} elseif ( preg_match( '/macintosh|mac os x/i', $u_agent ) ) {
			$platform = 'mac';
		} elseif ( preg_match( '/windows|win32/i', $u_agent ) ) {
			$platform = 'windows';
		} else {
			$platform = 'Unknown';
		}

		// Next get the name of the useragent, yes separately and for good reason
		if ( preg_match( '/MSIE|Trident|Edge/i', $u_agent ) && !preg_match( '/Opera/i', $u_agent ) ) {
			$bname = 'Internet Explorer';
			$ub    = "MSIE";
		} elseif ( preg_match( '/Firefox/i', $u_agent ) ) {
			$bname = 'Mozilla Firefox';
			$ub    = "Firefox";
		} elseif ( preg_match( '/Chrome/i', $u_agent ) and !preg_match( '/OPR/i', $u_agent ) ) {
			$bname = 'Google Chrome';
			$ub    = "Chrome";
		} elseif ( preg_match( '/Opera|OPR/i', $u_agent ) ) {
			$bname = 'Opera';
			$ub    = "Opera";
		} elseif ( preg_match( '/Safari/i', $u_agent ) ) {
			$bname = 'Apple Safari';
			$ub    = "Safari";
		} elseif ( preg_match( '/AppleWebKit/i', $u_agent ) ) {
			$bname = 'Apple Safari';
			$ub    = "Safari";
		} elseif ( preg_match( '/Netscape/i', $u_agent ) ) {
			$bname = 'Netscape';
			$ub    = "Netscape";
		} elseif ( preg_match( '/Mozilla/i', $u_agent ) ) {
			$bname = 'Mozilla Generic';
			$ub    = "Mozillageneric";
		} else {
			$bname = 'Unknown';
			$ub    = "Unknown";
		}
		// finally get the correct version number
		$known   = [ 'Version', $ub, 'other' ];
		$pattern = '#(?<browser>' . join( '|', $known ) . ')[/ ]+(?<version>[0-9.|a-zA-Z.]*)#';
		if ( !preg_match_all( $pattern, $u_agent, $matches ) ) {
			// we have no matching number just continue
		}

		// see how many we have
		$i = count( $matches[ 'browser' ] );
		if ( $i != 1 ) {
			//we will have two since we are not using 'other' argument yet
			//see if version is before or after the name
			if ( strripos( $u_agent, "Version" ) < strripos( $u_agent, $ub ) ) {
				$version = $matches[ 'version' ][ 0 ];
			} else {
				$version = @$matches[ 'version' ][ 1 ];
			}
		} else {
			$version = $matches[ 'version' ][ 0 ];
		}

		// check if we have a number
		if ( $version == null || $version == "" ) {
			$version = "?";
		}

		return [
			'userAgent' => $u_agent,
			'name'      => $bname,
			'ub'        => $ub,
			'version'   => $version,
			'platform'  => $platform
		];
	}
}