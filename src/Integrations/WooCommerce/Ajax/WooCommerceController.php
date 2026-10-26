<?php

namespace ACPT_Lite\Integrations\WooCommerce\Ajax;

use ACPT_Lite\Core\API\AJAX\Controllers\AbstractController;
use ACPT_Lite\Core\CQRS\Command\DeleteWooCommerceProductDataCommand;
use ACPT_Lite\Core\CQRS\Command\SaveWooCommerceProductDataCommand;
use ACPT_Lite\Core\CQRS\Command\SaveWooCommerceProductDataFieldsCommand;
use ACPT_Lite\Core\Repository\WooCommerceProductDataRepository;

class WooCommerceController extends AbstractController
{
    /**
     * Delete WC product data
     */
    public function deleteWooCommerceProductDataAction(): void
    {
        if (!empty($this->request->post('data'))) {
            $data = $this->sanitizeJsonData($this->request->post('data'));

            if (!isset($data['id'])) {
                wp_send_json([
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
            } catch (\Exception $exception) {
                do_action("acpt/error", $exception);

                $return = [
                    'success' => false,
                    'error' => $exception->getMessage()
                ];
            }

            wp_send_json($return);
        }

        wp_send_json([
            'success' => false,
            'error' => 'no WooCommerce product data was sent'
        ]);
    }

    /**
     * Delete WC product data fields
     *
     * @return void
     */
    public function deleteWooCommerceProductDataFieldsAction(): void
    {
        if (!empty($this->request->post('data'))) {
            $data = $this->sanitizeJsonData($this->request->post('data'));

            if (!isset($data['id'])) {
                wp_send_json([
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
            } catch (\Exception $exception) {
                do_action("acpt/error", $exception);

                $return = [
                    'success' => false,
                    'error' => $exception->getMessage()
                ];
            }

            wp_send_json($return);
        }

        wp_send_json([
            'success' => false,
            'error' => 'no WooCommerce product data was sent'
        ]);
    }

    /**
     * @return void
     * @throws \Exception
     */
    public function fetchWooCommerceProductDataAction(): void
    {
        if (!empty($this->request->post('data'))) {
            $data = $this->sanitizeJsonData($this->request->post('data'));

            if (isset($data['id'])) {
                wp_send_json(WooCommerceProductDataRepository::get($data)[0]);
            }

            wp_send_json([
                'count' => WooCommerceProductDataRepository::count(),
                'records' => WooCommerceProductDataRepository::get($data),
            ]);
        }

        wp_send_json([]);
    }

    /**
     * @return void
     */
    public function fetchWooCommerceProductDataFieldsAction(): void
    {
        if (!empty($this->request->post('data'))) {
            $data = $this->sanitizeJsonData($this->request->post('data'));

            if (!isset($data['id'])) {
                wp_send_json([
                    'success' => false,
                    'error' => 'Missing post id'
                ], 500);
            }

            $id = $data['id'];

            try {
                $statusHttp = 200;
                $return = WooCommerceProductDataRepository::getFields($id);
            } catch (\Exception $exception) {
                do_action("acpt/error", $exception);

                $statusHttp = 500;
                $return = [
                    'success' => false,
                    'error' => $exception->getMessage()
                ];
            }

            wp_send_json($return, $statusHttp);
        }

        wp_send_json([
            'success' => false,
            'error' => 'no id was sent'
        ], 500);
    }

    /**
     * Reset product data
     *
     * @return void
     */
    public function resetWooCommerceProductDataAction(): void
    {
        wp_send_json([]);
    }

    /**
     * Creates a product data
     *
     * @return void
     */
    public function saveWooCommerceProductDataAction(): void
    {
        $data = $this->sanitizeJsonData($this->request->post('data'));

        try {
            $command = new SaveWooCommerceProductDataCommand($data);
            $command->execute();
            $httpStatus = 200;

            $return = [
                'success' => true
            ];
        } catch (\Exception $exception) {
            do_action("acpt/error", $exception);

            $httpStatus = 500;
            $return = [
                'success' => false,
                'error' => $exception->getMessage()
            ];
        }

        wp_send_json($return, $httpStatus);
    }

    /**
     * Save product data fields
     *
     * @return void
     */
    public function saveWooCommerceProductDataFieldsAction(): void
    {
        try {
            $data = $this->sanitizeJsonData($this->request->post('data'));
            $command = new SaveWooCommerceProductDataFieldsCommand($data);
            $httpStatus = 200;

            $return = [
                'ids' => $command->execute(),
                'success' => true
            ];
        } catch (\Exception $exception) {
            do_action("acpt/error", $exception);

            $httpStatus = 500;
            $return = [
                'success' => false,
                'error' => $exception->getMessage()
            ];
        }

        wp_send_json($return, $httpStatus);
    }
}
