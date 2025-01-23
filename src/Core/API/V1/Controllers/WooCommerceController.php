<?php

namespace ACPT_Lite\Core\API\V1\Controllers;

use ACPT_Lite\Core\Helper\Uuid;
use ACPT_Lite\Core\JSON\WooCommerceProductDataFieldOptionSchema;
use ACPT_Lite\Core\JSON\WooCommerceProductDataFieldSchema;
use ACPT_Lite\Core\JSON\WooCommerceProductDataSchema;
use ACPT_Lite\Core\Models\WooCommerce\WooCommerceProductDataFieldModel;
use ACPT_Lite\Core\Models\WooCommerce\WooCommerceProductDataFieldOptionModel;
use ACPT_Lite\Core\Models\WooCommerce\WooCommerceProductDataModel;
use ACPT_Lite\Core\Repository\WooCommerceProductDataRepository;
use ACPT_Lite\Utils\Data\Sanitizer;

class WooCommerceController extends AbstractController
{
    /**
     * @param \WP_REST_Request $request
     *
     * @return mixed
     */
    public function getAll(\WP_REST_Request $request)
    {
        try {
            $count = count(WooCommerceProductDataRepository::get([]));
            $page = isset($request['page']) ? $request['page'] : 1;
            $perPage = isset($request['per_page']) ? $request['per_page'] : 20;
            $maxPages = ceil($count / $perPage);

            if($perPage > 100){
                $perPage = 100;
            }

            $records = WooCommerceProductDataRepository::get([
                'page' => $page,
                'perPage' => $perPage,
            ]);

            return $this->jsonPaginatedResponse($page, $maxPages, $perPage, $count, $records);

        } catch (\Exception $exception){
            return $this->jsonErrorResponse($exception);
        }
    }

    /**
     * @param \WP_REST_Request $request
     *
     * @return mixed
     */
    public function get(\WP_REST_Request $request)
    {
        $id = $request['id'];

        try {
            $count = count(WooCommerceProductDataRepository::get([
                    'id' => $id
            ]));
            $page = isset($request['page']) ? $request['page'] : 1;
            $perPage = isset($request['per_page']) ? $request['per_page'] : 20;
            $maxPages = ceil($count / $perPage);

            if($perPage > 100){
                $perPage = 100;
            }

            $records = WooCommerceProductDataRepository::get([
                'id' => $id,
            ]);

            return $this->jsonResponse($records[0]);

        } catch (\Exception $exception){
            return $this->jsonErrorResponse($exception);
        }
    }

    /**
     * @param \WP_REST_Request $request
     *
     * @return mixed
     */
    public function create(\WP_REST_Request $request)
    {
        $data = $this->getDecodedRequest($request);

        if(empty($data)){
            return $this->jsonResponse([
                    'message' => 'empty request body'
            ], 500);
        }

        try {
            // validate data
            $this->validateJSONSchema($data, new WooCommerceProductDataSchema());

            // sanitize data
            $data = Sanitizer::recursiveSanitizeRawData($data);

            $id = Uuid::v4();

            $model = WooCommerceProductDataModel::hydrateFromArray([
                'id' => $id,
                'name' => $data["name"],
                'icon' => $data["icon"],
                'visibility' => $data["visibility"],
                'showInUI' => $data["showInUI"],
            ]);

            WooCommerceProductDataRepository::save($model);

            return $this->jsonResponse([
                    'id' => $id
            ], 201);

        } catch (\Exception $exception){
            return $this->jsonErrorResponse($exception);
        }
    }

    /**
     * @param \WP_REST_Request $request
     *
     * @return mixed
     */
    public function delete(\WP_REST_Request $request)
    {
        $id = $request['id'];

        try {
            WooCommerceProductDataRepository::delete($id);

            return $this->jsonResponse([
                    'id' => $id
            ], 200);

        } catch (\Exception $exception){
            return $this->jsonErrorResponse($exception);
        }
    }

    /**
     * @param \WP_REST_Request $request
     *
     * @return mixed
     * @throws \Exception
     */
    public function update(\WP_REST_Request $request)
    {
        $id = $request['id'];
        $data = $this->getDecodedRequest($request);

        if(empty($data)){
            return $this->jsonResponse([
                    'message' => 'empty request body'
            ], 500);
        }

        $productData = WooCommerceProductDataRepository::get([
                'id' => $id
        ]);

        if(empty($productData)){
            return $this->jsonResponse([
                    'message' => 'No product data found'
            ], 500);
        }

        try {
            // validate data
            $this->validateJSONSchema($data, new WooCommerceProductDataSchema());

            // sanitize data
            $data = Sanitizer::recursiveSanitizeRawData($data);

            $id = $productData[0]->getId();

            $model = WooCommerceProductDataModel::hydrateFromArray([
                'id' => $id,
                'name' => $data["name"],
                'icon' => $data["icon"],
                'visibility' => $data["visibility"],
                'showInUI' => $data["showInUI"],
            ]);

            WooCommerceProductDataRepository::save($model);

            return $this->jsonResponse([
                'id' => $id
            ], 200);

        } catch (\Exception $exception){
            return $this->jsonErrorResponse($exception);
        }
    }

    /**
     * @param \WP_REST_Request $request
     *
     * @return mixed
     */
    public function getFields(\WP_REST_Request $request)
    {
        $id = $request['id'];

        try {
            $wooCommerceProductDataFields = WooCommerceProductDataRepository::getFields($id);

            return $this->jsonResponse($wooCommerceProductDataFields, 200);

        } catch (\Exception $exception){
            return $this->jsonErrorResponse($exception);
        }
    }

    /**
     * @param \WP_REST_Request $request
     *
     * @return mixed
     * @throws \Exception
     */
    public function createFields(\WP_REST_Request $request)
    {
        $id = $request['id'];
        $fields = [];
        $ids = [];
        $data = $this->getDecodedRequest($request);

        $productData = WooCommerceProductDataRepository::get([
            'id' => $id
        ]);

        if(empty($productData)){
            return $this->jsonResponse([
                    'message' => 'No product data found'
            ], 500);
        }

        if(!empty($productData[0]->getFields())){
            return $this->jsonResponse([
                    'message' => 'Product data has already associated fields'
            ], 500);
        }

        if(!is_array($data)){
            return $this->jsonResponse([
                    'message' => 'data is not an array'
            ], 500);
        }

        try {

            foreach ($data as $index => $datum){

                // validate data
                $this->validateJSONSchema($datum, new WooCommerceProductDataFieldSchema());

                // sanitize data
                $datum = Sanitizer::recursiveSanitizeRawData($datum);

                $newId = Uuid::v4();

                $fieldModel = WooCommerceProductDataFieldModel::hydrateFromArray([
                    'id' => $newId,
                    'productDataModel' => $productData[0],
                    'name' => $datum['name'],
                    'type' => $datum['type'],
                    'defaultValue' => $datum['defaultValue'],
                    'description' => $datum['description'],
                    'required' => $datum['isRequired'],
                    'sort' => ($index+1),
                ]);

                $optionsIds = [];

                $allowedOptionTypes = [
                        WooCommerceProductDataFieldModel::SELECT_TYPE,
                        WooCommerceProductDataFieldModel::RADIO_TYPE,
                ];

                if(isset($datum['options']) and in_array($datum['type'], $allowedOptionTypes) ){
                    foreach ($datum['options'] as $optionIndex => $option){

                        // validate data
                        $this->validateJSONSchema($option, new WooCommerceProductDataFieldOptionSchema());

                        // sanitize data
                        $option = Sanitizer::recursiveSanitizeRawData($option);

                        $newOptionId = Uuid::v4();

                        $optionModel = WooCommerceProductDataFieldOptionModel::hydrateFromArray([
                            'id' => $newOptionId,
                            'productDataField' => $fieldModel,
                            'label' => $option['label'],
                            'value' => $option['value'],
                            'sort' => ($optionIndex+1),
                        ]);

                        $fieldModel->addOption($optionModel);
                        $optionsIds[] = $optionModel->getId();
                    }
                }

                $fields[] = $fieldModel;
                $ids[] = [
                    'product_data_id' => $fieldModel->getProductData()->getId(),
                    'field' => $fieldModel->getId(),
                    'options' => $optionsIds
                ];
            }

            WooCommerceProductDataRepository::saveFields($fields);

            // remove orphans
            WooCommerceProductDataRepository::removeFieldsOrphans($ids);

            return $this->jsonResponse([
                    'ids' => $ids
            ], 201);

        } catch (\Exception $exception){
            return $this->jsonErrorResponse($exception);
        }
    }

    /**
     * @param \WP_REST_Request $request
     *
     * @return mixed
     * @throws \Exception
     */
    public function updateFields(\WP_REST_Request $request)
    {
        $id = $request['id'];
        $fields = [];
        $ids = [];
        $data = $this->getDecodedRequest($request);

        $productData = WooCommerceProductDataRepository::get([
                'id' => $id
        ]);

        if(empty($productData)){
            return $this->jsonResponse([
                    'message' => 'No product data found'
            ], 500);
        }

        if(empty($productData[0]->getFields())){
            return $this->jsonResponse([
                    'message' => 'Product data has not already associated fields'
            ], 500);
        }

        if(!is_array($data)){
            return $this->jsonResponse([
                    'message' => 'data is not an array'
            ], 500);
        }

        try {

            foreach ($data as $index => $datum){

                // validate data
                $this->validateJSONSchema($datum, new WooCommerceProductDataFieldSchema());

                // sanitize data
                $datum = Sanitizer::recursiveSanitizeRawData($datum);

                $newId = (isset($datum['id'])) ? $datum['id'] : Uuid::v4();

                $fieldModel = WooCommerceProductDataFieldModel::hydrateFromArray([
                    'id' => $newId,
                    'productDataModel' => $productData[0],
                    'name' => $datum['name'],
                    'type' => $datum['type'],
                    'defaultValue' => $datum['defaultValue'],
                    'description' => $datum['description'],
                    'required' => $datum['isRequired'],
                    'sort' => ($index+1),
                ]);

                $optionsIds = [];

                if(isset($datum['options'])){
                    foreach ($datum['options'] as $optionIndex => $option){


                        // validate data
                        $this->validateJSONSchema($option, new WooCommerceProductDataFieldOptionSchema());

                        // sanitize data
                        $option = Sanitizer::recursiveSanitizeRawData($option);

                        $optionId = (isset($option['id'])) ? $option['id'] : Uuid::v4();

                        $optionModel = WooCommerceProductDataFieldOptionModel::hydrateFromArray([
                            'id' => $optionId,
                            'productDataField' => $fieldModel,
                            'label' => $option['label'],
                            'value' => $option['value'],
                            'sort' => ($optionIndex+1),
                        ]);

                        $fieldModel->addOption($optionModel);
                        $optionsIds[] = $optionModel->getId();
                    }
                }

                $fields[] = $fieldModel;
                $ids[] = [
                        'product_data_id' => $fieldModel->getProductData()->getId(),
                        'field' => $fieldModel->getId(),
                        'options' => $optionsIds
                ];
            }

            WooCommerceProductDataRepository::saveFields($fields);

            // remove orphans
            WooCommerceProductDataRepository::removeFieldsOrphans($ids);

            return $this->jsonResponse([
                    'ids' => $ids
            ], 200);

        } catch (\Exception $exception){
            return $this->jsonErrorResponse($exception);
        }
    }

    /**
     * @param \WP_REST_Request $request
     *
     * @return mixed
     */
    public function deleteFields(\WP_REST_Request $request)
    {
        $id = $request['id'];

        try {
            WooCommerceProductDataRepository::deleteFields($id);

            return $this->jsonResponse([
                    'id' => $id
            ], 200);

        } catch (\Exception $exception){
            return $this->jsonErrorResponse($exception);
        }
    }

    /**
     * @param \WP_REST_Request $request
     *
     * @return mixed
     */
    public function getField(\WP_REST_Request $request)
    {
        $id = $request['id'];
        $field = $request['field'];

        try {
            $wooCommerceProductDataField = WooCommerceProductDataRepository::getField($id, $field);

            return $this->jsonResponse($wooCommerceProductDataField, 200);

        } catch (\Exception $exception){
            return $this->jsonErrorResponse($exception);
        }
    }

    /**
     * @param \WP_REST_Request $request
     *
     * @return mixed
     */
    public function deleteField(\WP_REST_Request $request)
    {
        $id = $request['id'];
        $field = $request['field'];

        try {
            WooCommerceProductDataRepository::deleteField($id, $field);

            return $this->jsonResponse([
                    'id' => $field
            ], 200);

        } catch (\Exception $exception){
            return $this->jsonErrorResponse($exception);
        }
    }
}