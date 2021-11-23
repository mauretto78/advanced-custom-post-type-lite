<?php

namespace ACPT_Lite\Includes;

/**
 * Fired during plugin deactivation.
 *
 * This class defines all code necessary to run during the plugin's deactivation.
 *
 * @since      1.0.0
 * @package    advanced-custom-post-type-lite
 * @subpackage advanced-custom-post-type/includes
 * @author     Mauro Cassani <maurocassani1978@gmail.com>
 */
class Deactivator
{
    /**
     * Deactivate
     *
     * @since    1.0.0
     */
    public static function deactivate()
    {
        if(!class_exists(\ACPT::class)){
            DB::destroySchema();
        }
    }
}