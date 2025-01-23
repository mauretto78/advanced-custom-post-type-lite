<?php

namespace ACPT_Lite\Core\API\V1\Controllers;

use ACPT_Lite\Core\CQRS\Command\DeleteFormCommand;
use ACPT_Lite\Core\CQRS\Command\SaveFormCommand;
use ACPT_Lite\Core\Helper\Uuid;
use ACPT_Lite\Core\JSON\FormSchema;
use ACPT_Lite\Core\Repository\FormRepository;
use ACPT_Lite\Core\Repository\MetaRepository;
use ACPT_Lite\Utils\Data\Sanitizer;

class FormController extends AbstractController
{
	/**
	 * @param \WP_REST_Request $request
	 *
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

			$records = FormRepository::get([
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
			$form = FormRepository::getById($id);

			if(null === $form){
				return $this->jsonNotFoundResponse('Not records found');
			}

			return $this->jsonResponse($form);

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
		return $this->createOrSaveForm($request, 201);
	}

	/**
	 * @param \WP_REST_Request $request
	 *
	 * @return mixed
	 */
	public function update(\WP_REST_Request $request)
	{
		return $this->createOrSaveForm($request, 200, $request['id']);
	}

	/**
	 * @param \WP_REST_Request $request
	 * @param int $httpStatus
	 * @param null $id
	 *
	 * @return mixed
	 */
	private function createOrSaveForm(\WP_REST_Request $request, $httpStatus = 200, $id = null)
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
			$id = $this->saveForm($data, $id);

			return $this->jsonResponse([
				'id' => $id
			], $httpStatus);

		} catch (\Exception $exception){
			return $this->jsonErrorResponse($exception);
		}
	}

	/**
	 * @param $data
	 * @param null $id
	 *
	 * @return string
	 * @throws \Exception
	 */
	private function saveForm($data, $id = null)
	{
		// validate data
		$this->validateJSONSchema($data, new FormSchema());

		// sanitize data
		$data = Sanitizer::recursiveSanitizeRawData($data);

		$data['id'] = $id ? $id : Uuid::v4();
		$command = new SaveFormCommand($data);

		return $command->execute();
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
			$command = new DeleteFormCommand($id);
			$command->execute();

			return $this->jsonResponse([
				'id' => $id
			], 200);

		} catch (\Exception $exception){
			return $this->jsonErrorResponse($exception);
		}
	}
}