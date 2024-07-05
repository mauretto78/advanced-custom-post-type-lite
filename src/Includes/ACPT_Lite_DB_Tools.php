<?php

namespace ACPT_Lite\Includes;

use ACPT_Lite\Utils\Wordpress\Transient;

abstract class ACPT_Lite_DB_Tools
{
	const HEALTH_CHECK_TRANSIENT_KEY = 'acpt_health_check';
	const HEALTH_CHECK_TRANSIENT_TTL = 86400; // 1 day

	/**
	 * Run health check and repair DB
	 * (once a day)
	 */
	public static function runHealthCheck()
	{
		if(!Transient::has(self::HEALTH_CHECK_TRANSIENT_KEY)){
			$healthCheckIssues = ACPT_Lite_DB_Tools::healthCheck();

			if(!empty($healthCheckIssues)){
				$repair = ACPT_Lite_DB_Tools::repair($healthCheckIssues);
				Transient::set(self::HEALTH_CHECK_TRANSIENT_KEY, $repair, self::HEALTH_CHECK_TRANSIENT_TTL );
			} else {
				Transient::set(self::HEALTH_CHECK_TRANSIENT_KEY, true, self::HEALTH_CHECK_TRANSIENT_TTL );
			}
		}
	}

	/**
	 * @return mixed
	 */
	private static function deleteTransient()
	{
		return delete_transient( self::HEALTH_CHECK_TRANSIENT_KEY);
	}

	/**
	 * @return array
	 */
	private static function healthCheck()
	{
		$issues = [];

		foreach (ACPT_Lite_Schema::get() as $tableName => $specs){

			$create = $specs['create'];
			$columns = $specs['columns'];

			if( false === ACPT_Lite_DB::tableExists($tableName)){
				$issues[$tableName] = [
					'create' => $create,
				];
			} else {
				foreach ($columns as $column => $desc){
					if( false === ACPT_Lite_DB::checkIfColumnExistsInTable($tableName, $column)){
						$issues[$tableName]['columns'][$column] = $desc;
					}
				}
			}
		}

		return $issues;
	}

	/**
	 * @param array $issues
	 *
	 * @return bool
	 */
	private static function repair($issues)
	{
		if(empty($issues)){
			return true;
		}

		try {
			foreach ($issues as $table => $issue){
				if(isset($issue['create'])){
					self::repairTable($table, $issue['create']);
				} elseif(isset($issue['columns'])){
					self::repairColumns($table, $issue['columns']);
				}
			}

			return true;
		} catch (\Exception $exception){
			return false;
		}
	}

	/**
	 * @param $table
	 * @param $create
	 *
	 * @throws \Exception
	 */
	private static function repairTable($table, $create)
	{
		global $wpdb;

		if(!$wpdb->query($create)){
			throw new \Exception("Repairing table ".$table." failed");
		}
	}

	/**
	 * @param $table
	 * @param $columns
	 *
	 * @throws \Exception
	 */
	private static function repairColumns($table, $columns)
	{
		if(empty($columns)){
			return;
		}

		global $wpdb;

		foreach ($columns as $column => $specs){
			$query = self::alterTableQuery($table, $column, $specs);

			if(!$wpdb->query($query)){
				throw new \Exception("Repairing column ".$column." in table ".$table." failed");
			}
		}
	}

	/**
	 * @param $table
	 * @param $column
	 * @param $specs
	 *
	 * @return string
	 */
	private static function alterTableQuery($table, $column, $specs)
	{
		$type = $specs['type'];
		$unique = $specs['unique'];
		$length = $specs['length'];
		$nullable = $specs['nullable'];
		$default = $specs['default'];

		$query = "ALTER TABLE `".$table."` ADD COLUMN `".$column."` " . $type;

		if($length){
			$query .= "(".$length.") ";
		}

		if($unique){
			$query .= "UNIQUE ";
		}

		if($nullable === false){
			$query .= " NOT NULL";
		}

		if(!empty($default)){
			$query .= " DEFAULT " . $default;
		}

		return $query;
	}
}