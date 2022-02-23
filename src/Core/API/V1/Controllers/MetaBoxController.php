<?php

namespace ACPT_Lite\Core\API\V1\Controllers;

class MetaBoxController extends AbstractController
{
    // http://localhost:83/wp-json/acpt/v1/cpt/ggd
    public function getByPostSlug(\WP_REST_Request $request)
    {
        return [
                'data' => $request['slug']
        ];
    }

    // http://localhost:83/wp-json/acpt/v1/cpt/ggd
    public function get(\WP_REST_Request $request)
    {
        return [
                'data' => $request['slug']
        ];
    }

    public function create(\WP_REST_Request $request)
    {
        return [
                'create' => 'create'
        ];
    }

    public function update(\WP_REST_Request $request)
    {
        return [
                'update' => $request['slug']
        ];
    }

    public function delete(\WP_REST_Request $request)
    {
        return [
                'delete' => $request['slug']
        ];
    }
}