<?php

namespace ACPT_Lite\Core\API\V1\Controllers;

use ACPT_Lite\Core\CQRS\Command\SaveOptionPageCommand;
use ACPT_Lite\Core\Helper\Uuid;
use ACPT_Lite\Core\JSON\OptionPageSchema;
use ACPT_Lite\Core\Repository\OptionPageRepository;
use ACPT_Lite\Utils\Data\Sanitizer;

class OptionPageController extends AbstractController
{
	/**
	 * @param \WP_REST_Request $request
	 *
	 * @return mixed
	 */
	public function getAll(\WP_REST_Request $request)
	{
		try {
			$count = OptionPageRepository::count();
			$page = isset($request['page']) ? $request['page'] : 1;
			$perPage = isset($request['per_page']) ? $request['per_page'] : 20;
			$maxPages = ceil($count / $perPage);

			if($perPage > 100){
				$perPage = 100;
			}

			$records = OptionPageRepository::get([
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
			$optionPage = OptionPageRepository::get([
				'menuSlug' => $request['slug']
			]);

			if(count($optionPage) === 1){
				return $this->jsonResponse($optionPage[0]);
			}

			return $this->jsonNotFoundResponse('No records found');

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
			$this->validateJSONSchema($data, new OptionPageSchema());

			// sanitize data
			$data = Sanitizer::recursiveSanitizeRawData($data);

			if(OptionPageRepository::exists($data["menuSlug"])){
				return $this->jsonResponse([
					'message' => $data["menuSlug"] . ' already exists'
				], 500);
			}

			$id = Uuid::v4();
			$count = OptionPageRepository::count();

			$command = new SaveOptionPageCommand([
				'id' => $id,
				'parentId' => (isset($data["parentId"])) ? $data["parentId"] : null,
				'pageTitle' => $data["pageTitle"],
				'menuTitle' => $data["menuTitle"],
				'capability' => $data["capability"],
				'menuSlug' => $data["menuSlug"],
				'position' => $data["position"],
				'icon' => (isset($data["icon"]) ? $data["icon"] : null),
				'description' => (isset($data["description"])) ? $data["description"] : null,
				'children' => [],
				'sort' => $count + 1,
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
		$slug = $request['menuSlug'];
		$data = $this->getDecodedRequest($request);

		if(empty($data)){
			return $this->jsonResponse([
				'message' => 'empty request body'
			], 500);
		}

		if(!OptionPageRepository::exists($slug)){
			return $this->jsonResponse([
				'message' => 'Option page with slug '.$slug.' does not exists'
			], 500);
		}

		try {
			// validate data
			$this->validateJSONSchema($data, new OptionPageSchema());

			// sanitize data
			$data = Sanitizer::recursiveSanitizeRawData($data);

			$savedOptionPage = OptionPageRepository::get([
				'menuSlug' => $data["menuSlug"],
			])[0];

			$command = new SaveOptionPageCommand([
				'id' => $savedOptionPage->getId(),
				'parentId' => (isset($data["parentId"])) ? $data["parentId"] : null,
				'pageTitle' => $data["pageTitle"],
				'menuTitle' => $data["menuTitle"],
				'capability' => $data["capability"],
				'menuSlug' => $data["menuSlug"],
				'position' => $data["position"],
				'icon' => (isset($data["icon"]) ? $data["icon"] : null),
				'description' => (isset($data["description"])) ? $data["description"] : null,
				'children' => [],
				'sort' => $savedOptionPage->getSort(),
			]);
			$command->execute();

			return $this->jsonResponse([
				'id' => $savedOptionPage->getId()
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
		try {
			$optionPage = OptionPageRepository::get([
				'menuSlug' => $request['slug']
			]);

			if(count($optionPage) === 1){

				$optionPageModel = $optionPage[0];

				OptionPageRepository::delete($optionPageModel);

				return $this->jsonResponse([
					'id' => $optionPageModel->getId()
				], 200);
			}

			return $this->jsonNotFoundResponse('No records found');

		} catch (\Exception $exception){
			return $this->jsonErrorResponse($exception);
		}
	}
}