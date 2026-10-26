<?php

namespace ACPT_Lite\Core\API\AJAX\Controllers;

use ACPT_Lite\Core\CQRS\Query\FetchLanguagesQuery;

class LicenseController extends AbstractController
{
    /**
     * Return the string translations
     * @throws \Exception
     *
     * @return void
     */
    public function languagesAction(): void
    {
        $query = new FetchLanguagesQuery();

        wp_send_json($query->execute());
    }
}
