<?php

namespace ACPT_Lite\Utils\PHP;

class Url
{
	/**
	 * @return string
	 */
    public static function host()
    {
        if(isset($_SERVER['HTTPS'])){
            $protocol = ($_SERVER['HTTPS'] && $_SERVER['HTTPS'] != "off") ? "https" : "http";
        }
        else{
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
}
