<?php

namespace ACPT_Lite\Core\Generators;

/**
 * *************************************************
 * AbstractGenerator class
 * *************************************************
 *
 * @author Mauro Cassani
 * @link https://github.com/mauretto78/
 */
abstract class AbstractGenerator
{
    const NONCE_FIELD_NAME = 'acpt_nonce';

    /**
     * Helper method, that attaches a passed function to the 'init' WP action
     * @param $cb callback function.
     */
    protected function init($cb)
    {
        add_action("init", $cb);
    }

    /**
     * Helper method, that attaches a passed function to the 'admin_init' WP action
     * @param $cb callback function.
     */
    protected function adminInit( $cb)
    {
        add_action("admin_init", $cb);
    }

    /**
     * @return string
     */
    protected function generateNonce()
    {
        return  plugin_basename(__FILE__) . '/src/Core/Generators/CustomPostTypeGenerator.php';
    }
}

