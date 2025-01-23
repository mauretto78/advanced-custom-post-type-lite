<?php

namespace ACPT_Lite\Integrations\WooCommerce\Ajax;

use ACPT_Lite\Admin\ACPT_Lite_Ajax;
use ACPT_Lite\Core\CQRS\Command\DeleteWooCommerceProductDataCommand;
use ACPT_Lite\Core\CQRS\Command\SaveWooCommerceProductDataCommand;
use ACPT_Lite\Core\CQRS\Command\SaveWooCommerceProductDataFieldsCommand;
use ACPT_Lite\Core\Repository\WooCommerceProductDataRepository;

class WooCommerceLiteAjax extends ACPT_Lite_Ajax
{
    /**
     * Register AJAX routes
     */
    public function routes()
    {
        $routes = [
            'wp_ajax_deleteWooCommerceProductDataAction' => 'deleteWooCommerceProductDataAction',
            'wp_ajax_deleteWooCommerceProductDataFieldsAction' => 'deleteWooCommerceProductDataFieldsAction',
            'wp_ajax_fetchWooCommerceProductDataAction' => 'fetchWooCommerceProductDataAction',
            'wp_ajax_fetchWooCommerceProductDataFieldsAction' => 'fetchWooCommerceProductDataFieldsAction',
            'wp_ajax_resetWooCommerceProductDataAction' => 'resetWooCommerceProductDataAction',
            'wp_ajax_saveWooCommerceProductDataAction' => 'saveWooCommerceProductDataAction',
            'wp_ajax_saveWooCommerceProductDataFieldsAction' => 'saveWooCommerceProductDataFieldsAction',
        ];

        foreach ($routes as $route => $callback){
            if(method_exists( WooCommerceLiteAjax::class, $callback )){
                add_action($route, [$this, $callback]);
            }
        }
    }

    /**
     * Delete WC product data
     */
    public function deleteWooCommerceProductDataAction()
    {
        if(isset($_POST['data'])){
            $data = $this->sanitizeJsonData($_POST['data']);

            if(!isset($data['id'])){
                return wp_send_json([
                    'success' => false,
                    'error' => 'Missing id'
                ]);
            }

            $id = $data['id'];

            try {
                $command = new DeleteWooCommerceProductDataCommand($id);
                $command->execute();

                $return = [
                    'success' => true,
                ];
            } catch (\Exception $exception){
                $return = [
                    'success' => false,
                    'error' => $exception->getMessage()
                ];
            }

            return wp_send_json($return);
        }

        return wp_send_json([
            'success' => false,
            'error' => 'no WooCommerce product data was sent'
        ]);
    }

    /**
     * Delete WC product data fields
     */
    public function deleteWooCommerceProductDataFieldsAction()
    {
        if(isset($_POST['data'])){
            $data = $this->sanitizeJsonData($_POST['data']);

            if(!isset($data['id'])){
                return wp_send_json([
                    'success' => false,
                    'error' => 'Missing id'
                ]);
            }
            $id = $data['id'];

            try {
                WooCommerceProductDataRepository::deleteFields($id);

                $return = [
                    'success' => true,
                ];
            } catch (\Exception $exception){
                $return = [
                    'success' => false,
                    'error' => $exception->getMessage()
                ];
            }

            return wp_send_json($return);
        }

        return wp_send_json([
            'success' => false,
            'error' => 'no WooCommerce product data was sent'
        ]);
    }

    /**
     * @return mixed
     * @throws \Exception
     */
    public function fetchWooCommerceProductDataAction()
    {
        if(isset($_POST['data'])){
            $data = $this->sanitizeJsonData($_POST['data']);

            if(isset($data['id'])){
                return wp_send_json(WooCommerceProductDataRepository::get($data)[0]);
            }

            return wp_send_json([
                'count' => WooCommerceProductDataRepository::count(),
                'records' => WooCommerceProductDataRepository::get($data),
            ]);
        }

        return wp_send_json([]);
    }

    /**
     * @return mixed
     */
    public function fetchWooCommerceProductDataFieldsAction()
    {
        if(isset($_POST['data'])){
            $data = $this->sanitizeJsonData($_POST['data']);

            if(!isset($data['id'])){
                return wp_send_json([
                    'success' => false,
                    'error' => 'Missing post id'
                ], 500);
            }

            $id = $data['id'];

            try {
                $statusHttp = 200;
                $return = WooCommerceProductDataRepository::getFields($id);
            } catch (\Exception $exception){
                $statusHttp = 500;
                $return = [
                    'success' => false,
                    'error' => $exception->getMessage()
                ];
            }

            return wp_send_json($return, $statusHttp);
        }

        return wp_send_json([
            'success' => false,
            'error' => 'no id was sent'
        ], 500);
    }

    /**
     * Reset product data
     *
     * @return mixed
     */
    public function resetWooCommerceProductDataAction()
    {
        return wp_send_json([]);
    }

    /**
     * Creates a product data
     */
    public function saveWooCommerceProductDataAction()
    {
        $data = $this->sanitizeJsonData($_POST['data']);

        try {
            $command = new SaveWooCommerceProductDataCommand($data);
            $command->execute();
            $httpStatus = 200;

            $return = [
                'success' => true
            ];
        } catch (\Exception $exception){
            $httpStatus = 500;
            $return = [
                'success' => false,
                'error' => $exception->getMessage()
            ];
        }

        return wp_send_json($return, $httpStatus);
    }

    /**
     * Save product data fields
     *
     * @return mixed
     */
    public function saveWooCommerceProductDataFieldsAction()
    {
        try {
            $data = $this->sanitizeJsonData($_POST['data']);
            $command = new SaveWooCommerceProductDataFieldsCommand($data);
            $httpStatus = 200;

            $return = [
                'ids' => $command->execute(),
                'success' => true
            ];
        } catch (\Exception $exception) {
            $httpStatus = 500;
            $return = [
                'success' => false,
                'error' => $exception->getMessage()
            ];
        }

        return wp_send_json($return, $httpStatus);
    }
}
