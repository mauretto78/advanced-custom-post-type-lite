<?php

namespace ACPT_Lite\Core\CQRS\Query;

use ACPT_Lite\Constants\TableField;

class FetchTableTemplatesQuery implements QueryInterface
{
	/**
	 * @return array
	 */
	public function execute()
	{
		global $wpdb;

		$templates = [];
		$query = "SELECT * FROM `{$wpdb->prefix}options` where option_name like '".TableField::DB_KEY."%' ORDER BY option_name ASC;";

		$results = $wpdb->get_results(
			$wpdb->prepare($query)
		);

		if(empty($results)){
			return $templates;
		}

		foreach ($results as $result) {
			$templates[] = [
				'id' => (int)$result->option_id,
				'name' => str_replace(TableField::DB_KEY."_","", $result->option_name),
				'json' => unserialize($result->option_value),
			];
		}

		return $templates;
	}
}