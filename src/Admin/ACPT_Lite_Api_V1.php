<?php

namespace ACPT_Lite\Admin;

use ACPT_Lite\Core\API\V1\Controllers\CustomPostTypeController;
use ACPT_Lite\Core\API\V1\Controllers\MetaBoxController;
use ACPT_Lite\Core\API\V1\Controllers\TaxonomyController;

class ACPT_Lite_Api_V1
{
    const BASE_V1 = 'acpt/v1';

    /**
     * Register REST routes
     */
    public function registerRestRoutes()
    {
        $this->registerRestRoute('cpt/search', 'GET', [new CustomPostTypeController(), 'search']);
        $this->registerRestRoute('cpt', 'GET', [new CustomPostTypeController(), 'getAll']);
        $this->registerRestRoute('cpt/(?P<slug>[a-zA-Z0-9-]+)', 'GET', [new CustomPostTypeController(), 'get']);
        $this->registerRestRoute('cpt', 'POST', [new CustomPostTypeController(), 'create']);
        $this->registerRestRoute('cpt/(?P<slug>[a-zA-Z0-9-]+)', 'DELETE', [new CustomPostTypeController(), 'delete']);
        $this->registerRestRoute('cpt/(?P<slug>[a-zA-Z0-9-]+)', 'PUT', [new CustomPostTypeController(), 'update']);

        $this->registerRestRoute('meta/(?P<slug>[a-zA-Z0-9-]+)', 'GET', [new MetaBoxController(), 'getByPostSlug']);
        $this->registerRestRoute('meta/(?P<id>[a-zA-Z0-9-]+)', 'GET', [new MetaBoxController(), 'get']);
        $this->registerRestRoute('meta', 'POST', [new MetaBoxController(), 'create']);
        $this->registerRestRoute('meta/(?P<id>[a-zA-Z0-9-]+)', 'DELETE', [new MetaBoxController(), 'delete']);
        $this->registerRestRoute('meta/(?P<id>[a-zA-Z0-9-]+)', 'PUT', [new MetaBoxController(), 'update']);

        $this->registerRestRoute('taxonomy', 'GET', [new TaxonomyController(), 'getAll']);
        $this->registerRestRoute('taxonomy/(?P<slug>[a-zA-Z0-9-]+)', 'GET', [new TaxonomyController(), 'get']);
        $this->registerRestRoute('taxonomy', 'POST', [new TaxonomyController(), 'create']);
        $this->registerRestRoute('taxonomy/(?P<slug>[a-zA-Z0-9-]+)', 'DELETE', [new TaxonomyController(), 'delete']);
        $this->registerRestRoute('taxonomy/(?P<slug>[a-zA-Z0-9-]+)', 'PUT', [new TaxonomyController(), 'update']);
        $this->registerRestRoute('taxonomy/(?P<slug>[a-zA-Z0-9-]+)/assoc', 'PUT', [new TaxonomyController(), 'assocToPostType']);
    }

    /**
     * @param $route
     * @param $methods
     * @param $callback
     */
    private function registerRestRoute( $route, $methods, $callback)
    {
        register_rest_route( self::BASE_V1 , $route, [
            'methods' => $methods,
            'callback' => $callback
        ] );
    }
}