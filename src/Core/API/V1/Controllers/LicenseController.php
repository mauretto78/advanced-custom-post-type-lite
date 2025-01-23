<?php

namespace ACPT_Lite\Core\API\V1\Controllers;

use ACPT_Lite\Admin\ACPT_Key_Value_Storage;
use ACPT_Lite\Admin\ACPT_License_Manager;

class LicenseController extends AbstractController
{
	public function deactivate(\WP_REST_Request $request)
	{
		$id = @$request['id'];

		if(!isset($id)){
			return [
				'message' => 'Missing id',
				'success' => false
			];
		}

		$license = ACPT_License_Manager::getLicense();

		if(isset($license['activation_id']) and $license['activation_id'] != $id){
			return [
				'message' => 'Saved activation ID ' .$license['activation_id'] . ' does not correspond to ID: ' . $id,
				'success' => false
			];
		}

		$delete = ACPT_Key_Value_Storage::delete(ACPT_License_Manager::PRIVATE_KEY_NAME);

		return [
			'message' => 'ok',
			'success' => $delete
		];
	}
}