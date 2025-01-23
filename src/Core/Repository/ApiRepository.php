<?php

namespace ACPT_Lite\Core\Repository;

use ACPT_Lite\Core\Models\ApiKey\ApiKeyModel;
use ACPT_Lite\Includes\ACPT_Lite_DB;

class ApiRepository extends AbstractRepository
{
    /**
     * Delete an API Key
     *
     * @param $id
     *
     * @throws \Exception
     */
    public static function delete($id)
    {
        ACPT_Lite_DB::executeQueryOrThrowException("DELETE FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_API_KEYS)."` WHERE id = %s;", [$id]);
	    ACPT_Lite_DB::invalidateCacheTag(self::class);
    }

    /**
     * Get single API key
     *
     * @param array $meta
     *
     * @return ApiKeyModel|null
     * @throws \Exception
     */
    public static function get(array $meta = [])
    {
        $args = [];
        $baseQuery = "
            SELECT 
                id ,
                uid,
                api_key,
                api_secret,
                created_at
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_API_KEYS)."`
            WHERE 1 = 1
        ";

        if(isset($meta['uid'])){
            $baseQuery .= " AND uid = %d";
            $args[] = (int)$meta['uid'];
        }

        if(isset($meta['key']) and isset($meta['secret'])){
            $baseQuery .= " AND api_key = %s ";
            $baseQuery .= " AND api_secret = %s ";
            $args[] = $meta['key'];
            $args[] = $meta['secret'];
        }

        $apiKeys = ACPT_Lite_DB::getResults($baseQuery, $args);

        if(count($apiKeys) !== 1){
            return null;
        }

        $apiKey = $apiKeys[0];

        return ApiKeyModel::hydrateFromArray( [
                'id'     => $apiKey->id,
                'uid'    => (int)$apiKey->uid,
                'key'    => $apiKey->api_key,
                'secret' => $apiKey->api_secret,
                'createdAt' => new \DateTime($apiKey->created_at),
        ] );
    }

    /**
     * Get the registered API keys
     *
     * @param array $meta
     *
     * @return ApiKeyModel[]
     * @throws \Exception
     * @since    1.0.5
     */
    public static function getPaginated(array $meta = [])
    {
        $results = [];
        $args = [];

        $baseQuery = "
            SELECT 
                id ,
                uid,
                api_key,
                api_secret,
                created_at
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_API_KEYS)."`
            WHERE 1 = 1
            ";

        if(isset($meta['uid'])){
            $baseQuery .= " AND uid = %d";
            $args[] = (int)$meta['uid'];
        }

        if(isset($meta['page']) and isset($meta['perPage'])){
            $baseQuery .= " LIMIT ".$meta['perPage']." OFFSET " . ($meta['perPage'] * ($meta['page'] - 1));
        }

        $baseQuery .= ';';
        $apiKeys = ACPT_Lite_DB::getResults($baseQuery, $args);

        foreach ($apiKeys as $apiKey){
            $apiKeyModel = ApiKeyModel::hydrateFromArray( [
                    'id'     => $apiKey->id,
                    'uid'    => (int)$apiKey->uid,
                    'key'    => $apiKey->api_key,
                    'secret' => $apiKey->api_secret,
                    'createdAt' => new \DateTime($apiKey->created_at),
            ]);

            $results[] = $apiKeyModel;
        }

        return $results;
    }

    /**
     * @param array $meta
     *
     * @return int
     */
    public static function count(array $meta)
    {
        $results = [];
        $args = [];

        $baseQuery = "
            SELECT 
                count(id) as count
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_API_KEYS)."`
            WHERE 1 = 1
            ";

        if(isset($meta['uid'])){
            $baseQuery .= " AND uid = %d";
            $args[] = (int)$meta['uid'];
        }

        $results = ACPT_Lite_DB::getResults($baseQuery, $args);

        return (int)$results[0]->count;
    }
    
    /**
     * Save API key
     *
     * @param ApiKeyModel $model
     *
     * @throws \Exception
     */
    public static function save(ApiKeyModel $model)
    {
        $sql = "
            INSERT INTO `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_API_KEYS)."` 
            (`id`,
            `uid` ,
            `api_key`,
            `api_secret`
            ) VALUES (
                %s,
                %d,
                %s,
                %s
            ) ON DUPLICATE KEY UPDATE 
                `api_key` = %s,
                `api_secret` = %s
        ;";

        ACPT_Lite_DB::executeQueryOrThrowException($sql, [
                $model->getId(),
                $model->getUid(),
                $model->getKey(),
                $model->getSecret(),
                $model->getKey(),
                $model->getSecret(),
        ]);
	    ACPT_Lite_DB::invalidateCacheTag(self::class);
    }
}