<?php

namespace ACPT_Lite\Core\API\V1\Controllers;

use ACPT_Lite\Core\CQRS\Command\SaveCustomPostTypeCommand;
use ACPT_Lite\Core\Helper\Uuid;
use ACPT_Lite\Core\JSON\CustomPostTypeSchema;
use ACPT_Lite\Core\Repository\CustomPostTypeRepository;
use ACPT_Lite\Utils\Data\Sanitizer;
use ACPT_Lite\Utils\Settings\Settings;

class CustomPostTypeController extends AbstractController
{
    /**
     * @param \WP_REST_Request $request
     *
     * @return mixed
     */
    public function getAll(\WP_REST_Request $request)
    {
        try {
            $count = CustomPostTypeRepository::count();
            $page = isset($request['page']) ? $request['page'] : 1;
            $perPage = isset($request['per_page']) ? $request['per_page'] : 20;
            $maxPages = ceil($count / $perPage);

            if($perPage > 100){
                $perPage = 100;
            }

            $records = CustomPostTypeRepository::get([
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
        try {
            $cpt = CustomPostTypeRepository::get([
                    'postType' => $request['slug']
            ]);

            if(count($cpt) === 1){
                return $this->jsonResponse($cpt[0]);
            }

            return $this->jsonNotFoundResponse('Not records found');

        } catch (\Exception $exception){
            return $this->jsonErrorResponse($exception);
        }
    }

    /**
     * @param \WP_REST_Request $request
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
            $this->validateJSONSchema($data, new CustomPostTypeSchema());

            // sanitize data
            $data = Sanitizer::recursiveSanitizeRawData($data);

            if(CustomPostTypeRepository::exists($data["post_name"])){
                return $this->jsonResponse([
                    'message' => $data["post_name"] . ' already exists'
                ], 500);
            }

            $id = Uuid::v4();
            $command = new SaveCustomPostTypeCommand([
	            'id' => $id,
	            'name' => $data["post_name"],
	            'singular_label' => $data["singular_label"],
	            'plural_label' => $data["plural_label"],
	            'icon' => $data["icon"],
	            'supports' => $data['supports'],
	            'labels' =>  $data['labels'],
	            'settings' =>  $data['settings'],
            ]);

	        $command->execute();

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
    public function update(\WP_REST_Request $request)
    {
        $slug = $request['slug'];
        $data = $this->getDecodedRequest($request);

        if(empty($data)){
            return $this->jsonResponse([
                    'message' => 'empty request body'
            ], 500);
        }

        if(!CustomPostTypeRepository::exists($slug)){
            return $this->jsonResponse([
                    'message' => $slug . ' does not exists'
            ], 500);
        }

        try {
            // validate data
            $this->validateJSONSchema($data, new CustomPostTypeSchema());

            // sanitize data
            $data = Sanitizer::recursiveSanitizeRawData($data);
            $id = CustomPostTypeRepository::getId($data["post_name"]);

	        $command = new SaveCustomPostTypeCommand([
		        'id' => $id,
		        'name' => $slug,
		        'singular_label' => $data["singular_label"],
		        'plural_label' => $data["plural_label"],
		        'icon' => $data["icon"],
		        'supports' => $data['supports'],
		        'labels' =>  $data['labels'],
		        'settings' =>  $data['settings'],
	        ]);
	        $command->execute();

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
    public function delete(\WP_REST_Request $request)
    {
        $slug = $request['slug'];

        try {
            $cpt = CustomPostTypeRepository::get([
                    'postType' => $slug
            ], true);

            if(count($cpt) === 1){

                $customPostTypeModel = $cpt[0];

                // Delete posts option
                $deletePosts = false;
                $deletePostsOption = Settings::get($slug, 0);

                if($deletePostsOption == 1){
                    $deletePosts = true;
                }

                CustomPostTypeRepository::delete($slug, $deletePosts);

                return $this->jsonResponse([
                    'id' => $customPostTypeModel->getId()
                ], 200);
            }

            return $this->jsonNotFoundResponse('Not records found');

        } catch (\Exception $exception){
            return $this->jsonErrorResponse($exception);
        }
    }
}