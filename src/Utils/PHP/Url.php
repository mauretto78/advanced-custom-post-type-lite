<?php

namespace ACPT_Lite\Utils\PHP;

class Url
{
    /**
     * This functions is used instead of global $pagenow
     * bacause in some Multisite installations $pagenow does not work as expected
     * (it returns NULL)
     *
     * @return string
     */
    public static function pagenow()
    {
        $uri = $_SERVER['PHP_SELF'];
        $lastLetter = substr($uri, -1);

        if($lastLetter === "/"){
            $uri = rtrim($uri, "/");
        }

        $uri = explode('/', $uri);

        return end($uri);
    }

	/**
	 * @return string
	 */
    public static function host()
    {
        if(isset($_SERVER['HTTPS'])){
            $protocol = ($_SERVER['HTTPS'] and $_SERVER['HTTPS'] != "off") ? "https" : "http";
        } else{
            $protocol = 'http';
        }

        return $protocol . "://" . $_SERVER['HTTP_HOST'];
    }

	/**
	 * @param array $queryString
	 *
	 * @return string
	 */
    public static function baseUri($queryString = [])
    {
    	if(php_sapi_name() === 'cli'){
    		return 'http://localhost:8000';
	    }

        $baseUri = str_replace( '?'.$_SERVER['QUERY_STRING'], '', $_SERVER['REQUEST_URI'] );

        $uri = self::host() . $baseUri;

        if(!empty($queryString)){
            $uri = $uri . '?' . http_build_query($queryString);
        }

        return $uri;
    }

	/**
	 * @param $url
	 *
	 * @return string|string[]
	 */
    public static function secureUrl($url)
    {
	    return str_ireplace( 'http://', 'https://', $url );
    }

	/**
	 * @param $url
	 *
	 * @return mixed
	 */
    public static function getLastPartOfUrl($url)
    {
	    if(!filter_var($url, FILTER_VALIDATE_URL)){
	    	return '';
	    }

	    return basename(parse_url($url, PHP_URL_PATH));
    }

	/**
	 * @return string
	 */
    public static function fullUrl()
    {
	    $pageURL = 'http';

	    if(isset($_SERVER["HTTPS"]) and $_SERVER["HTTPS"] == "on"){
		    $pageURL .= "s";
	    }

	    $pageURL .= "://";

	    if ($_SERVER["SERVER_PORT"] != "80") {
		    $pageURL .= $_SERVER["SERVER_NAME"] . ":" . $_SERVER["SERVER_PORT"] . $_SERVER["REQUEST_URI"];
	    } else {
		    $pageURL .= $_SERVER["SERVER_NAME"] . $_SERVER["REQUEST_URI"];
	    }

	    return $pageURL;
    }

	/**
	 * @param $url
	 *
	 * @return string|null
	 */
	public static function sanitize($url)
	{
		if($url === null){
			return null;
		}

		if(!is_string($url)){
			return null;
		}

		return esc_url(strip_tags($url));
	}
}
