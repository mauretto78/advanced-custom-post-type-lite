<?php

namespace ACPT_Lite\Utils\Http;

class ACPTApiClient
{
	const BASE_ACPT_URL = 'https://acpt.io/wp-json/api/v1';

	/**
	 * @param string $url
	 * @param array $data
	 *
	 * @return mixed
	 * @throws \Exception
	 */
	public static function call($url, $data = [])
	{
		$args = [
			'method'     => 'POST',
			'headers'    => [
				'Content-Type' => 'application/json',
			],
			'timeout'   => 60,
			'body'      => wp_json_encode($data),
			'sslverify' => false,
		];

		$finalUrl = self::BASE_ACPT_URL . $url;
		$response = wp_remote_post($finalUrl, $args);

		if (!is_wp_error($response)) {
			return json_decode(wp_remote_retrieve_body( $response), true);
		}

		throw new \Exception($response->get_error_message());
	}
}
