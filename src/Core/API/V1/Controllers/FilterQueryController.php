<?php

namespace ACPT_Lite\Core\API\V1\Controllers;

use ACPT_Lite\Core\JSON\QueryFilterSchema;
use ACPT_Lite\Utils\Data\Sanitizer;
use ACPT_Lite\Utils\Wordpress\WPSearch;

class FilterQueryController extends AbstractController
{
    /**
     * @param \WP_REST_Request $request
     *
     * @return mixed
     */
    public function search(\WP_REST_Request $request)
    {
        $postType = $request['slug'];
        $page = isset($request['page']) ? $request['page'] : 1;
        $perPage = isset($request['per_page']) ? $request['per_page'] : 20;
        $queryFilter = $this->getDecodedRequest($request);

        if(!$queryFilter){
            $queryFilter = [];
        }

        try {
            // validate data
            if(!empty($queryFilter)){
                $this->validateJSONSchema($queryFilter, new QueryFilterSchema());
            }

            // sanitize data
            $queryFilter = Sanitizer::recursiveSanitizeRawData($queryFilter);
            $wpSearch = new WPSearch($postType, $queryFilter, $page, $perPage);
            $results = $wpSearch->results();
            $count = $wpSearch->totalCount();

            $maxPages = ceil($count / $perPage);

            return $this->jsonPaginatedResponse($page, $maxPages, $perPage, $count, $results);

        } catch (\Exception $exception){
            return $this->jsonErrorResponse($exception);
        }
    }


}