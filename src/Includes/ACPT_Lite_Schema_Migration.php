<?php

namespace ACPT_Lite\Includes;

abstract class ACPT_Lite_Schema_Migration
{
	/**
	 * @var string
	 */
	protected string $charsetCollation;

	/**
	 * ACPT_Schema_Migration constructor.
	 */
	public function __construct()
	{
		$this->charsetCollation = ACPT_Lite_DB::getCharsetCollation();
	}

	/**
	 * @return string
	 */
	public abstract function version(): string;

	/**
     * Up query
     *
     * @return array
     */
    public abstract function up(): array;

    /**
     * Down query
     *
     * @return array
     */
    public abstract function down(): array;

	/**
	 * @param $table
	 *
	 * @return string
	 */
    protected function renameTableQuery($table): string
    {
        if(ACPT_Lite_DB::prefix() == ''){
            return '';
        }

    	if(ACPT_Lite_DB::tableExists(ACPT_Lite_DB::prefixedTableName($table))){
    		return '';
	    }

    	return "RENAME TABLE `".$table."` TO `".ACPT_Lite_DB::prefixedTableName($table)."`;";
    }

	/**
	 * @param $table
	 *
	 * @return string
	 */
    protected function deleteTableQuery($table): string
    {
	    return "DROP TABLE IF EXISTS `".$table."`";
    }

	/**
	 * @param string $table
	 *
	 * @return bool
	 */
    protected function existsTable($table): bool
    {
    	global $wpdb;
	    $wpdb->query("SHOW TABLES LIKE '".$table."'");

	    return $wpdb->num_rows == 1;
    }
}