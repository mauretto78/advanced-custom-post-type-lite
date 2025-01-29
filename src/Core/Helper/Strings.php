<?php

namespace ACPT_Lite\Core\Helper;

/**
 * Strings
 *
 * @since      1.0.0
 * @package    advanced-custom-post-type
 * @subpackage advanced-custom-post-type/core
 * @author     Mauro Cassani <maurocassani1978@gmail.com>
 */
class Strings
{
	/**
	 * @param $string
	 *
	 * @return string|string[]
	 */
	public static function escapeForJSON($string)
	{
		$string = str_replace('\"', '\\\\\\\\\"', $string);

		return $string;
	}

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
     * This function appends _{x} to a string.
     *
     * Example: house   ---> house_1
     *          house_1 ---> house_2
     *
     * @param string $string
     *
     * @return string
     */
    public static function getUniqueName($string){

        $a = explode("_", $string);
        $end = (int)end($a);

        if(($end > 0) and count($a)>1 ){
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
        if(empty($haystack)){
            return false;
        }

        return strpos($haystack, $needle) !== false;
    }

    /**
     * @param string $css
     *
     * @return string
     */
    public static function minifyCss($css)
    {
        $css = preg_replace('/\/\*((?!\*\/).)*\*\//', '', $css);
        $css = preg_replace('/\s{2,}/', ' ', $css);
        $css = preg_replace('/\s*([:;{}])\s*/', '$1', $css);
        $css = preg_replace('/;}/', '}', $css);

        return $css;
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
	 * @param $string_name
	 * @param int $rand_no
	 *
	 * @return string
	 */
    public static function generateUsername($string_name, $rand_no = 200)
    {
	    $username_parts = array_filter(explode(" ", strtolower($string_name)));
	    $username_parts = array_slice($username_parts, 0, 2);

	    $part1 = (!empty($username_parts[0]))?substr($username_parts[0], 0,8):"";
	    $part2 = (!empty($username_parts[1]))?substr($username_parts[1], 0,5):"";
	    $part3 = ($rand_no)?rand(0, $rand_no):"";

	    $username = $part1. str_shuffle($part2). $part3;

	    return str_replace(" ","_", $username);
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
	 * @param array $strings
	 *
	 * @return string
	 */
	public static function convertKeyValueArrayToString(array $strings)
	{
		$return = '';

		foreach ($strings as $key => $value){

			if(is_array($value)){
				if(is_numeric($key)){
					$return .= self::convertKeyValueArrayToString($value) . PHP_EOL;
				} else {
					$return .= '        \''.$key.'\' => ['. PHP_EOL;
					$return .= self::convertKeyValueArrayToString($value);
					$return .= '        ],' . PHP_EOL;
				}
			}

			if(is_string($value)){
				if(is_numeric($key)){
					$return .= '           \''.addslashes($value).'\',' . PHP_EOL;
				} else {
					$return .= '           \''.$key.'\' => \''.addslashes($value).'\',' . PHP_EOL;
				}
			}

			if(is_bool($value)){
				$value = ($value === true) ? 'true' : 'false';

				if(is_numeric($key)){
					$return .= '           '.$value.',' . PHP_EOL;
				} else {
					$return .= '           \''.$key.'\' => '.$value.',' . PHP_EOL;
				}
			}

			if($value === null){
				if(is_numeric($key)){
					$return .= '           null,' . PHP_EOL;
				} else {
					$return .= '           \''.$key.'\' => null,' . PHP_EOL;
				}
			}
		}

		return $return;
	}

	/**
	 * @param string $string
	 *
	 * @return bool
	 */
	public static function alphanumericallyValid($string): bool
	{
		if(!is_string($string)){
			return false;
		}

		$regex = '/^[0-9a-zA-Z_-]+$/iu';

		preg_match_all($regex, $string, $matches);

		return !empty($matches[0]);
	}

	/**
	 * @param $string
	 *
	 * @return bool
	 */
	public static function isJson($string): bool
	{
		if(!is_string($string)){
			return false;
		}

		json_decode($string);

		return json_last_error() === JSON_ERROR_NONE;
	}

	/**
	 * @param $string
	 *
	 * @return bool
	 */
	public static function isUrl($string): bool
	{
		if(!is_string($string)){
			return false;
		}

		return (filter_var($string, FILTER_VALIDATE_URL) ? true : false);
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
	 * @param $value
	 *
	 * @return mixed|null
	 */
	public static function renderRatingAsString($value)
	{
		if(!is_numeric($value)){
			return null;
		}

		$ratings = [
			10 => '5/5',
			9 => '4.5/5',
			8 => '4/5',
			7 => '3.5/5',
			6 => '3/5',
			5 => '2.5/5',
			4 => '2/5',
			3 => '1.5/5',
			2 => '1/5',
			1 => '0.5/5',
		];

		if(!isset($ratings[$value])){
			return null;
		}

		return $ratings[$value];
	}

	/**
	 * @param $value
	 * @param int $size
	 *
	 * @return string|null
	 */
	public static function renderStars($value, $size = 24)
	{
		if(!is_numeric($value)){
			return null;
		}

		$starsMap = [];
		$halfStar = '<svg xmlns="http://www.w3.org/2000/svg" width="'.$size.'" height="'.$size.'" viewBox="0 0 20 20"><path fill="currentColor" d="M10 1L7 7l-6 .75l4.13 4.62L4 19l6-3l6 3l-1.12-6.63L19 7.75L13 7zm0 2.24l2.34 4.69l4.65.58l-3.18 3.56l.87 5.15L10 14.88V3.24z"/></svg>';
		$fullStar = '<svg xmlns="http://www.w3.org/2000/svg" width="'.$size.'" height="'.$size.'" viewBox="0 0 20 20"><path fill="currentColor" d="m10 1l3 6l6 .75l-4.12 4.62L16 19l-6-3l-6 3l1.13-6.63L1 7.75L7 7z"/></svg>';
		$emptyStar = '<svg xmlns="http://www.w3.org/2000/svg" width="'.$size.'" height="'.$size.'" viewBox="0 0 20 20"><path fill="currentColor" d="M10 1L7 7l-6 .75l4.13 4.62L4 19l6-3l6 3l-1.12-6.63L19 7.75L13 7zm0 2.24l2.34 4.69l4.65.58l-3.18 3.56l.87 5.15L10 14.88l-4.68 2.34l.87-5.15l-3.18-3.56l4.65-.58z"/></svg>';

		switch ($value){
			case 10:
				$starsMap = ['full','full','full','full','full'];
				break;

			case 9:
				$starsMap = ['full','full','full','full','half'];
				break;

			case 8:
				$starsMap = ['full','full','full','full', 'empty'];
				break;

			case 7:
				$starsMap = ['full','full','full','half', 'empty'];
				break;

			case 6:
				$starsMap = ['full','full','full', 'empty', 'empty'];
				break;

			case 5:
				$starsMap = ['full','full','half', 'empty', 'empty'];
				break;

			case 4:
				$starsMap = ['full','full', 'empty', 'empty', 'empty'];
				break;

			case 3:
				$starsMap = ['full','half', 'empty', 'empty', 'empty'];
				break;

			case 2:
				$starsMap = ['full', 'empty', 'empty', 'empty', 'empty'];
				break;

			case 1:
				$starsMap = ['half', 'empty', 'empty', 'empty', 'empty'];
				break;
		}

		if(empty($starsMap)){
			return null;
		}

		$render = '';

		foreach ($starsMap as $value){
			if($value === 'full'){
				$render .= $fullStar;
			} elseif($value === 'empty'){
				$render .= $emptyStar;
			} elseif($value === 'half'){
				$render .= $halfStar;
			}
		}

		return $render;
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

	/**
	 * @param $string
	 *
	 * @return string
	 */
	public static function formatForInStatement($string)
	{
		$array = explode(",", $string);

		foreach ($array as $i => $el){
			$array[$i] = trim($el);
		}

		return "'" . implode("','", $array) . "'";
	}

	/**
	 * @return string
	 */
	public static function generateRandomId()
	{
		return 'id_'.rand(999999,111111);
	}

	/**
	 * @param $from
	 *
	 * @return int|null
	 */
	public static function convertToBytes($from)
	{
		try {
			return (int)preg_replace_callback('/^\s*(\d+)\s*(?:([kmgt]?)b?)?\s*$/i', function ($m) {
				switch (strtolower($m[2])) {
					case 't': $m[1] *= 1024;
					case 'g': $m[1] *= 1024;
					case 'm': $m[1] *= 1024;
					case 'k': $m[1] *= 1024;
				}

				return $m[1];
			}, $from);
		} catch(\Exception $e){
			return $from;
		}
	}

	/**
	 * @param string $str
	 * @param string $substr
	 *
	 * @return bool
	 */
	public static function endsWith($str, $substr)
	{
		return strrpos($str, $substr) === strlen($str) - strlen($substr);
	}

	/**
	 * This function adds _$b to $a.
	 *
	 * If $a ends with _s, like this example:
	 *
	 * $a = access_private_s
	 * $b = movie
	 *
	 * returns access_private_movie_s
	 *
	 * @param string $a
	 * @param string $b
	 *
	 * @return string
	 */
	public static function pluralize($a, $b)
	{
		if(self::endsWith($a, "_s")){

			$a = substr($a, 0, -2) . '';

			return $a."_".$b."_s";
		}

		return $a."_".$b;
	}

	/**
	 * @param $string
	 *
	 * @return string
	 */
	public static function removeAllExtraSpaces($string)
	{
		return preg_replace('/\s+/', ' ', $string);
	}
}

