<?php

namespace ACPT_Lite\Admin;

use ACPT_Lite\Utils\PHP\KeyEcrypt;

class ACPT_Lite_Key_Value_Storage
{
    /**
     * @param $key
     * @return bool
     */
    public static function delete($key)
    {
        $key = KeyEcrypt::ecrypt($key);

        $deleteOption = delete_option($key);
	    $deleteCache = (wp_cache_get($key)) ? wp_cache_delete($key) : true;

        if($deleteOption and $deleteCache){
            return true;
        }

        return false;
    }

    /**
     * @param $key
     * @return mixed
     */
    public static function get($key)
    {
        $key = KeyEcrypt::ecrypt($key);

        if(wp_cache_get($key)){
            return wp_cache_get($key);
        }

        return get_option($key);
    }

    /**
     * @param $key
     * @param $value
     * @return bool
     */
    public static function set($key, $value)
    {
        $key = KeyEcrypt::ecrypt($key);

        if(get_option($key)){
            $saveOption = update_option($key, $value);
        } else {
            $deprecated = '';
            $autoload = 'no';
            $saveOption = add_option($key, $value, $deprecated, $autoload);
        }

        if($saveOption and wp_cache_set($key, $value)){
            return true;
        }

        return false;
    }
}