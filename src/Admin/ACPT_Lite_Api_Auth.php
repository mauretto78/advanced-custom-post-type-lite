<?php

namespace ACPT_Lite\Admin;

use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Repository\ApiRepository;

class ACPT_Lite_Api_Auth
{
    /**
     * Authorization process
     *
     * @return bool
     * @throws \Exception
     */
    public function authenticate(\WP_REST_Request $request)
    {
        // Basic
        if(isset($_SERVER['HTTP_AUTHORIZATION']) and $_SERVER['HTTP_AUTHORIZATION'] !== ''){
            $basicAuthorization = $_SERVER['HTTP_AUTHORIZATION'];
            if(Strings::contains('Basic ', $basicAuthorization)){
                $basic = base64_decode(str_replace('Basic ', '', $basicAuthorization));
                $basic = explode(':', $basic);
                $check = wp_authenticate_username_password( null, $basic[0], $basic[1] );

                return $check instanceof \WP_User;
            }
        }

        // API keys pair
        $credentials = $this->getTheCredentials($request);

        if(empty($credentials) or count($credentials) !== 2){
            return false;
        }

        $key = $credentials[0];
        $secret = $credentials[1];

        $apiKeyModel = ApiRepository::get([
            'key' => $key,
            'secret' => $secret,
        ]);

        return $apiKeyModel !== null;
    }

    /**
     * @param \WP_REST_Request $request
     *
     * @return array
     */
    private function getTheCredentials(\WP_REST_Request $request)
    {
        if(isset($_SERVER['HTTP_ACPT_API_KEY']) and $_SERVER['HTTP_ACPT_API_KEY'] !== ''){
            return explode('-', $_SERVER['HTTP_ACPT_API_KEY']);
        }

        $headers = $request->get_headers();

        if(isset($headers['acpt_api_key'])){
            $credentials = (is_array($headers['acpt_api_key'])) ? $headers['acpt_api_key'][0] : $headers['acpt_api_key'];

            return explode('-', $credentials);
        }

        return [];
    }
}