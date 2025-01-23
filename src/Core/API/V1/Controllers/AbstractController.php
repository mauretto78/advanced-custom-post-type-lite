<?php

namespace ACPT_Lite\Core\API\V1\Controllers;

use ACPT_Lite\Core\JSON\AbstractJSONSchema;
use ACPT_Lite\Utils\Data\JSONSchemaValidator;
use ACPT_Lite\Utils\PHP\Url;

abstract class AbstractController
{
    /**
     * @param \WP_REST_Request $request
     *
     * @return mixed|null
     */
    protected function getDecodedRequest( \WP_REST_Request $request)
    {
        $body = $request->get_body();

        if(empty($body)){
            return null;
        }

        return json_decode($body, true);
    }

    /**
     * @param mixed $data
     * @param int $code
     *
     * @return mixed
     */
    protected function jsonResponse($data, $code = 200)
    {
        return new \WP_REST_Response($data, $code);
    }

    /**
     * @param $page
     * @param $maxPages
     * @param $perPage
     * @param $count
     * @param $records
     *
     * @return mixed
     */
    protected function jsonPaginatedResponse($page, $maxPages, $perPage, $count, $records)
    {
        return $this->jsonResponse([
            'currentPage' => $page,
            'prev' => ($page > 1) ? Url::baseUri(['page' => $page - 1, 'per_page' => $perPage]) : null,
            'next' => ($page < $maxPages) ? Url::baseUri(['page' => $page + 1, 'per_page' => $perPage]) : null,
            'total' => $count,
            'records' => $records,
        ]);
    }

    /**
     * @param string $message
     * @return mixed
     */
    protected function jsonNotFoundResponse($message)
    {
        return $this->jsonResponse([
            'message' => $message
        ], 404);
    }

    /**
     * @param \Exception $exception
     * @param int $code
     *
     * @return mixed
     */
    protected function jsonErrorResponse(\Exception $exception, $code = 500)
    {
        return $this->jsonResponse([
            'message' => $exception->getMessage(),
            'code' => ($exception->getCode() !== 0 ? $exception->getCode() : $code),
        ], $code);
    }

    /**
     * @param array              $queryFilter
     * @param AbstractJSONSchema $jsonSchema
     *
     * @throws \Exception
     */
    protected function validateJSONSchema( array $queryFilter, AbstractJSONSchema $jsonSchema)
    {
        $validation = new JSONSchemaValidator( $jsonSchema );

        $validation->validate($queryFilter);
    }
}