<?php

namespace ACPT_Lite\Core\API\V1\Controllers;

use ACPT_Lite\Core\CQRS\Command\AssocTaxonomyToCustomPostTypeCommand;
use ACPT_Lite\Core\CQRS\Command\SaveTaxonomyCommand;
use ACPT_Lite\Core\Helper\Uuid;
use ACPT_Lite\Core\JSON\TaxonomySchema;
use ACPT_Lite\Core\Repository\CustomPostTypeRepository;
use ACPT_Lite\Core\Repository\TaxonomyRepository;
use ACPT_Lite\Utils\Data\Sanitizer;

class TaxonomyController extends AbstractController
{
    /**
     * @param \WP_REST_Request $request
     *
     * @return mixed
     */
    public function getAll(\WP_REST_Request $request)
    {
        try {
            $count = TaxonomyRepository::count();
            $page = isset($request['page']) ? $request['page'] : 1;
            $perPage = isset($request['per_page']) ? $request['per_page'] : 20;
            $maxPages = ceil($count / $perPage);

            if($perPage > 100){
                $perPage = 100;
            }

            $records = TaxonomyRepository::get([
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
     * @return array
     */
    public function get(\WP_REST_Request $request)
    {
        try {
            $taxonomy = TaxonomyRepository::get([
                'taxonomy' => $request['slug']
            ]);

            if(count($taxonomy) === 1){
                return $this->jsonResponse($taxonomy[0]);
            }

            return $this->jsonNotFoundResponse('No records found');

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
            $this->validateJSONSchema($data, new TaxonomySchema());

            // sanitize data
            $data = Sanitizer::recursiveSanitizeRawData($data);

            if(TaxonomyRepository::exists($data["slug"])){
                return $this->jsonResponse([
                    'message' => $data["slug"] . ' already exists'
                ], 500);
            }

            $id = Uuid::v4();
            $data = [
	            'id' => $id,
	            'slug' => $data["slug"],
	            'singular_label' => $data["singular"],
	            'plural_label' => $data["plural"],
	            'labels' =>  $data['labels'],
	            'settings' =>  $data['settings'],
            ];

	        $command = new SaveTaxonomyCommand($data);
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

        if(!TaxonomyRepository::exists($slug)){
            return $this->jsonResponse([
                'message' => $slug . ' taxonomy does not exists'
            ], 500);
        }

        try {
            // validate data
            $this->validateJSONSchema($data, new TaxonomySchema());

            // sanitize data
            $data = Sanitizer::recursiveSanitizeRawData($data);

            $id = TaxonomyRepository::getId($data["slug"]);
	        $data = [
                'id' => $id,
                'slug' => $slug,
                'singular_label' => $data["singular"],
                'plural_label' => $data["plural"],
                'labels' =>  $data['labels'],
                'settings' =>  $data['settings'],
            ];

	        $command = new SaveTaxonomyCommand($data);
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
     * @return mixed
     */
    public function delete(\WP_REST_Request $request)
    {
        $slug = $request['slug'];

        try {
            $taxonomy = TaxonomyRepository::get([
                'taxonomy' => $request['slug']
            ]);

            if(count($taxonomy) === 1){

                $taxonomyModel = $taxonomy[0];

                TaxonomyRepository::delete($slug);

                return $this->jsonResponse([
                    'id' => $taxonomyModel->getId()
                ], 200);
            }

            return $this->jsonNotFoundResponse('No records found');

        } catch (\Exception $exception){
            return $this->jsonErrorResponse($exception);
        }
    }

    /**
     * @param \WP_REST_Request $request
     * @return mixed
     */
    public function assocToPostType(\WP_REST_Request $request)
    {
        $slug = $request['slug'];
        $cptSlug = $request['cpt'];
        
        try {
            $cptId = CustomPostTypeRepository::getId($cptSlug);
            $taxonomyId = TaxonomyRepository::getId($slug);
            
            if(null === $cptId or null === $taxonomyId){
                return $this->jsonNotFoundResponse('No records found');
            }

	        $command = new AssocTaxonomyToCustomPostTypeCommand($cptId, $taxonomyId);
	        $command->execute();

            return $this->jsonResponse([
                'cptId' => $cptId,
                'taxonomyId' => $taxonomyId,
            ], 200);
        } catch (\Exception $exception) {
            return $this->jsonErrorResponse($exception);
        }
    }
}