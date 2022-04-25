<?php

namespace ACPT_Lite\Core\Repository;

use ACPT_Lite\Core\Models\CustomPostTypeTemplateModel;
use ACPT_Lite\Includes\ACPT_Lite_DB;

class TemplateRepository
{
    /**
     * Delete template
     *
     * @param $postType
     * @param $templateType
     *
     * @throws \Exception
     */
    public static function delete($postType, $templateType)
    {
        ACPT_Lite_DB::executeQueryOrThrowException("DELETE FROM `".ACPT_Lite_DB::TABLE_CUSTOM_POST_TEMPLATE."` WHERE post_type = %s AND template_type = %s;", [$postType,  $templateType]);
    }

    /**
     * Delete templates
     *
     * @param $postType
     *
     * @throws \Exception
     */
    public static function deleteByType($postType)
    {
        ACPT_Lite_DB::executeQueryOrThrowException("DELETE FROM `".ACPT_Lite_DB::TABLE_CUSTOM_POST_TEMPLATE."` WHERE post_type = %s;", [$postType]);
    }

    /**
     * @param $postType
     * @param $templateType
     *
     * @return bool
     */
    public static function exists($postType, $templateType)
    {
        $baseQuery = "
            SELECT 
                id
            FROM `".ACPT_Lite_DB::TABLE_CUSTOM_POST_TEMPLATE."`
            WHERE 
                post_type = %s AND
                template_type = %s
            ";

        $results = ACPT_Lite_DB::getResults($baseQuery, [$postType, $templateType]);

        return count($results) === 1;
    }

    /**
     * @param string $postType
     * @param string $templateType
     *
     * @return CustomPostTypeTemplateModel|null
     * @throws \Exception
     */
    public static function get($postType, $templateType)
    {
        $baseQuery = "
            SELECT 
                *
            FROM `".ACPT_Lite_DB::TABLE_CUSTOM_POST_TEMPLATE."`
            WHERE 
                post_type = %s AND
                template_type = %s
            ";

        $results = ACPT_Lite_DB::getResults($baseQuery, [$postType, $templateType]);

        if(count($results) === 1){
            return CustomPostTypeTemplateModel::hydrateFromArray([
                    'id' => $results[0]->id,
                    'postType' => $results[0]->post_type,
                    'templateType' =>  $results[0]->template_type,
                    'json' =>  $results[0]->json,
                    'html' =>  $results[0]->html,
                    'meta' =>  ($results[0]->meta) ? json_decode($results[0]->meta, true) : [],
            ]);
        }

        return null;
    }

    /**
     * @return CustomPostTypeTemplateModel[]
     * @throws \Exception
     */
    public static function getAll()
    {
        $results = ACPT_Lite_DB::getResults("
            SELECT 
                id, 
                post_type,
                template_type,
                json,
                html,
                meta
            FROM `".ACPT_Lite_DB::TABLE_CUSTOM_POST_TEMPLATE."`
        ;", []);

        $templates = [];

        foreach ($templates as $template) {
            $results[] = CustomPostTypeTemplateModel::hydrateFromArray( [
                    'id' => $template->id,
                    'postType' => $template->postType,
                    'templateType' => $template->templateType,
                    'json' => $template->json,
                    'html' => $template->html,
                    'meta' => json_decode($template->meta, true),
            ] );
        }

        return $templates;
    }

    /**
     * Save template
     *
     * @param CustomPostTypeTemplateModel $model
     *
     * @throws \Exception
     */
    public static function save(CustomPostTypeTemplateModel $model)
    {
        $sql = "
            INSERT INTO `".ACPT_Lite_DB::TABLE_CUSTOM_POST_TEMPLATE."` 
            (`id`,
            `post_type` ,
            `template_type`,
            `json`,
            `html`,
            `meta`
            ) VALUES (
                %s,
                %s,
                %s,
                %s,
                %s,
                %s
            ) ON DUPLICATE KEY UPDATE 
                `post_type` = %s,
                `template_type` = %s,
                `json` = %s,
                `html` = %s,
                `meta` = %s
        ;";

        ACPT_Lite_DB::executeQueryOrThrowException($sql, [
                $model->getId(),
                $model->getPostType(),
                $model->getTemplateType(),
                $model->getJson(),
                $model->getHtml(),
                json_encode($model->getMeta()),
                $model->getPostType(),
                $model->getTemplateType(),
                $model->getJson(),
                $model->getHtml(),
                json_encode($model->getMeta()),
        ]);
    }
}