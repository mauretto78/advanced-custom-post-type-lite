<?php

namespace ACPT_Lite\Core\API\V1\Controllers;

class CustomPostTypeController extends AbstractController
{
    public function search(\WP_REST_Request $request)
    {
        return [
                'fdsfds' => 'search'
        ];
    }

    public function getAll(\WP_REST_Request $request)
    {
        return [
            'fdsfds' => 'fds'
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