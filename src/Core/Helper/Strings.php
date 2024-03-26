<?php

namespace ACPT_Lite\Core\Helper;

/**
 * Strings
 *
 * @since      1.0.0
 * @package    advanced-custom-post-type-lite
 * @subpackage advanced-custom-post-type/core
 * @author     Mauro Cassani <maurocassani1978@gmail.com>
 */
class Strings
{
	/**
	 * @param $string
	 *
	 * @return bool
	 */
	public static function exists($string)
	{
		return isset($string) and null !== $string and !empty($string);
	}

    /**
     * @param string $string
     *
     * @return string
     */
    public static function toDBFormat($string)
    {
        return strtolower(str_replace(' ', '_', $string));
    }

    /**
     * @param string $string
     *
     * @return string
     */
    public static function toHumanReadableFormat($string)
    {
        $string = strtolower($string);
        $string = str_replace('_', ' ', $string);
        $string = ucwords($string);

        return $string;
    }

	/**
	 * @param $name
	 * @param array $arrayOfNames
	 *
	 * @return mixed
	 */
	public static function getTheFirstAvailableName($name, array $arrayOfNames = [])
	{
		if(!in_array( $name, $arrayOfNames  )){
			return $name;
		}

		$newName = Strings::getUniqueName($name);

		return self::getTheFirstAvailableName($newName, $arrayOfNames);
	}

    /**
     * @param string $string
     *
     * @return string
     */
    public static function getUniqueName($string){

        $a = explode("_", $string);
        $end = (int)end($a);

        if(  ($end > 0) and count($a)>1 ){
            array_pop($a);
        }

        $name = implode('_', $a);

        $return = $name;
        $return .= '_'.($end+1);

        return $return;
    }

    /**
     * @param $needle
     * @param $haystack
     *
     * @return bool
     */
    public static function contains($needle, $haystack)
    {
        return strpos($haystack, $needle) !== false;
    }

	/**
	 * @param int  $maxlength
	 * @param bool $moreEntropy
	 *
	 * @return false|string
	 */
	public static function randomString( $maxlength = 12, $moreEntropy = false )
	{
		$_pwd = md5( uniqid( '', true ) );

		// we want more characters not only [0-9a-f]
		if ( $moreEntropy ) {
			$_pwd = base64_encode( $_pwd );
		}

		// exclude last 2 char2 because they can be == sign
		$pwd = substr( $_pwd, 0, 6 ) . substr( $_pwd, -8, 6 );
		$pwd = substr( $pwd, 0, $maxlength );

		if ( $maxlength > 12 ) {
			while ( strlen( $pwd ) < $maxlength ) {
				$pwd .= self::randomString();
			}

			$pwd = substr( $pwd, 0, $maxlength );
		}

		return $pwd;
	}

	/**
	 * @param $string
	 *
	 * @return string
	 */
	public static function toSnakeCase($string)
	{
		return strtolower(preg_replace('/(?<!^)[A-Z]/', '_$0', $string));
	}

	/**
	 * @param $string
	 *
	 * @return string
	 */
	public static function toCamelCase( $string)
	{
		$str = str_replace('-', '', ucwords($string, '-'));
		$str = str_replace('_', '', ucwords($str, '_'));
		$str = str_replace(' ', '', ucwords($str, ' '));

		return $str;
	}

	/**
	 * SQL Like operator in PHP.
	 * Returns TRUE if match else FALSE.
	 * @param string $pattern
	 * @param string $subject
	 * @return bool
	 */
	public static function likeMatch($pattern, $subject)
	{
		$pattern = str_replace('%', '.*', preg_quote($pattern, '/'));
		return (bool) preg_match("/^{$pattern}$/i", $subject);
	}

	/**
	 * @param string $string
	 *
	 * @return bool
	 */
	public static function alphanumericallyValid($string)
	{
		$regex = '/^[0-9a-zA-Z_-]+$/iu';

		preg_match_all($regex, $string, $matches);

		return !empty($matches[0]);
	}

	/**
	 * @param $string
	 *
	 * @return bool
	 */
	public static function isJson($string)
	{
		json_decode($string);

		return json_last_error() === JSON_ERROR_NONE;
	}

	/**
	 * @param $number
	 *
	 * @return float|int
	 */
	public static function convertStringToNumber($number)
	{
		if(is_numeric($number)){
			if(self::contains('.', $number) or self::contains(',', $number)){
				return floatval($number);
			}

			return (int)$number;
		}

		return $number;
	}

	/**
	 * @param string $a
	 * @param string $b
	 *
	 * @return array
	 */
	public static function matches(string $a, string $b): array
	{
		$value = trim($a);
		$value = preg_replace('/\s+/', '', $value);
		$value = explode(',', $value);

		$value2 = trim($b);
		$value2 = preg_replace('/\s+/', '', $value2);
		$value2 = explode(',', $value2);

		return array_intersect($value2, $value);
	}
}

