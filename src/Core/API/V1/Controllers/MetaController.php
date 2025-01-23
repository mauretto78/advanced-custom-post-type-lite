<?php

namespace ACPT_Lite\Core\API\V1\Controllers;

use ACPT_Lite\Core\CQRS\Command\DeleteMetaGroupCommand;
use ACPT_Lite\Core\CQRS\Command\SaveMetaGroupCommand;
use ACPT_Lite\Core\Helper\Uuid;
use ACPT_Lite\Core\JSON\MetaGroupSchema;
use ACPT_Lite\Core\Repository\MetaRepository;
use ACPT_Lite\Utils\Data\Sanitizer;

class MetaController extends AbstractController
{
    /**
     * @param \WP_REST_Request $request
     * @return mixed
     */
    public function getAll(\WP_REST_Request $request)
    {
        try {
	        $count = MetaRepository::count();
	        $page = isset($request['page']) ? $request['page'] : 1;
	        $perPage = isset($request['per_page']) ? $request['per_page'] : 20;
	        $maxPages = ceil($count / $perPage);

	        if($perPage > 100){
		        $perPage = 100;
	        }

	        $records = MetaRepository::get([
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
     * @return array|mixed
     */
    public function get(\WP_REST_Request $request)
    {
        $id = $request['id'];

        try {
            $meta = MetaRepository::get([
                'id' => $id,
            ]);

            if(null === $meta){
                return $this->jsonNotFoundResponse('Not records found');
            }

            return $this->jsonResponse($meta[0]);

        } catch (\Exception $exception){
            return $this->jsonErrorResponse($exception);
        }
    }

    /**
     * Create meta boxes
     *
     * @param \WP_REST_Request $request
     * @return mixed
     */
    public function create(\WP_REST_Request $request)
    {
	    return $this->createOrUpdateMetaGroup($request, 201);
    }

    /**
     * Save meta boxes
     *
     * @param \WP_REST_Request $request
     * @return mixed
     */
    public function update(\WP_REST_Request $request)
    {
        return $this->createOrUpdateMetaGroup($request, 200, $request['id']);
    }

	/**
	 * @param \WP_REST_Request $request
	 * @param int $httpStatus
	 * @param null $groupId
	 *
	 * @return mixed
	 */
    private function createOrUpdateMetaGroup(\WP_REST_Request $request, $httpStatus = 200, $groupId = null)
    {
	    $data = $this->getDecodedRequest($request);

	    if(empty($data)){
		    return $this->jsonResponse([
			    'message' => 'empty request body'
		    ], 500);
	    }

	    if(!is_array($data)){
		    return $this->jsonResponse([
			    'message' => 'data is not an array'
		    ], 500);
	    }

	    try {
		    $id = $this->saveMetaGroup($data, $groupId);

		    return $this->jsonResponse([
			    'id' => $id
		    ], $httpStatus);

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
        	$command = new DeleteMetaGroupCommand($id);
        	$command->execute();

            return $this->jsonResponse([
                'id' => $id
            ], 200);

        } catch (\Exception $exception){
            return $this->jsonErrorResponse($exception);
        }
    }

	/**
	 * @param $data
	 * @param null $groupId
	 *
	 * @return string
	 * @throws \Exception
	 */
	private function saveMetaGroup($data, $groupId = null)
	{
		// validate data
		$this->validateJSONSchema($data, new MetaGroupSchema());

		// sanitize data
		$data = Sanitizer::recursiveSanitizeRawData($data);

		$data['id'] = $groupId ? $groupId : Uuid::v4();
		$command = new SaveMetaGroupCommand($data);

		return $command->execute();
	}
}