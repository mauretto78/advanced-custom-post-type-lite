<?php

namespace ACPT_Lite\Core\API\AJAX\Controllers;

use ACPT_Lite\Core\CQRS\Command\SaveSettingsCommand;
use ACPT_Lite\Core\Repository\SettingsRepository;

class PermissionController extends AbstractController
{
    /**
     * @throws \Exception
     */
    public function fetchSettingsAction(): void
    {
        wp_send_json(SettingsRepository::get());
    }

    /**
     * Save settings
     */
    public function saveSettingsAction(): void
    {
        $data = $this->sanitizeJsonData($this->request->post('data'));

        // persist $model on DB
        try {
            $command = new SaveSettingsCommand($data);
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
}
