<?php

namespace ACPT_Lite\Core\Repository;

use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\CustomPostTypeModel;
use ACPT_Lite\Core\Models\CustomPostTypeTemplateModel;
use ACPT_Lite\Core\Models\MetaBoxFieldModel;
use ACPT_Lite\Core\Models\MetaBoxFieldOptionModel;
use ACPT_Lite\Core\Models\MetaBoxFieldRelationshipModel;
use ACPT_Lite\Core\Models\MetaBoxModel;
use ACPT_Lite\Core\Models\TaxonomyModel;
use ACPT_Lite\Core\Models\WooCommerceProductDataFieldModel;
use ACPT_Lite\Core\Models\WooCommerceProductDataModel;
use ACPT_Lite\Includes\ACPT_Lite_DB;
use ACPT_Lite\Utils\PostMetaSync;
use ACPT_Lite\Utils\WPUtils;

class CustomPostTypeRepository
{
    /**
     * @return int
     */
    public static function count()
    {
        $baseQuery = "
            SELECT 
                count(id) as count
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE)."`
            ";

        $results = ACPT_Lite_DB::getResults($baseQuery);

        return (int)$results[0]->count;
    }

    /**
     * Delete a custom post type
     *
     * @param $postType
     * @param $mode
     *
     * @return string|null
     * @throws \Exception
     * @since    1.0.0
     */
    public static function delete($postType)
    {
        if($postType === 'post' or $postType === 'page'){
            throw new \Exception('You cannot delete page or post CPT.');
        }

        if(self::exists($postType)) {

            $postModel = self::get([
                    'postType' => $postType
            ])[0];

            ACPT_Lite_DB::startTransaction();

            try {
                $sql = "
                    DELETE
                        FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE)."`
                        WHERE id = %s
                    ";

                self::deleteMeta($postType);
                TaxonomyRepository::deleteAssociations($postModel->getId());

                if($postModel->isWooCommerce()){
                    WooCommerceProductDataRepository::clear();
                }

                self::removeOrphanRelationships();
                ACPT_Lite_DB::executeQueryOrThrowException($sql, [$postModel->getId()]);
                ACPT_Lite_DB::commitTransaction();
            } catch (\Exception $exception){
                ACPT_Lite_DB::rollbackTransaction();
                throw new \Exception($exception->getMessage());
            }

            // Delete post type data
            $deletePostType = SettingsRepository::getSingle('delete_posts');

            if($deletePostType !== null and $deletePostType->getValue() == 1){
                self::deletePostType($postType);
            }

            return true;
        }

        return false;
    }

    /**
     * Delete all meta for a custom post type
     *
     * @param $postType
     *
     * @return string|null
     * @throws \Exception
     * @since    1.0.0
     */
    public static function deleteMeta($postType)
    {
        if(self::exists($postType)) {

            $meta = CustomPostTypeRepository::getMeta($postType);

            ACPT_Lite_DB::startTransaction();

            foreach ($meta as $metaBoxModel){
                self::deleteMetaBox($metaBoxModel);
            }

            ACPT_Lite_DB::commitTransaction();

            return true;
        }

        return false;
    }

    /**
     * @param $postType
     * @param $id
     * @return bool
     * @throws \Exception
     */
    public static function deleteMetaById($postType, $id)
    {
        if(self::exists($postType) and null !== $metaBoxModel = self::getMetaBox($id)) {
            self::deleteMetaBox($metaBoxModel);
        }

        return false;
    }

    /**
     * Delete a meta box
     *
     * @param MetaBoxModel $metaBoxModel
     * @throws \Exception
     */
    private static function deleteMetaBox(MetaBoxModel $metaBoxModel)
    {
        ACPT_Lite_DB::startTransaction();

        $sql = "
                    DELETE
                        FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_META_BOX)."`
                        WHERE id = %s
                    ";

        try {
            ACPT_Lite_DB::executeQueryOrThrowException($sql, [$metaBoxModel->getId()]);
        } catch (\Exception $exception){
            ACPT_Lite_DB::rollbackTransaction();
            throw new \Exception($exception->getMessage());
        }

        foreach ($metaBoxModel->getFields() as $fieldModel){
            $sql = "
                    DELETE
                        FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_FIELD)."`
                        WHERE id = %s
                    ";

            try {
                ACPT_Lite_DB::executeQueryOrThrowException($sql, [$fieldModel->getId()]);
            } catch (\Exception $exception){
                ACPT_Lite_DB::rollbackTransaction();
                throw new \Exception($exception->getMessage());
            }

            foreach ($fieldModel->getOptions() as $optionModel){
                $sql = "
                        DELETE
                            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_OPTION)."`
                            WHERE id = %s
                        ";

                try {
                    ACPT_Lite_DB::executeQueryOrThrowException($sql, [$optionModel->getId()]);
                } catch (\Exception $exception){
                    ACPT_Lite_DB::rollbackTransaction();
                    throw new \Exception($exception->getMessage());
                }
            }

            foreach ($fieldModel->getRelations() as $relationModel){
                $sql = "
                        DELETE
                            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_RELATION)."`
                            WHERE id = %s
                        ";

                try {
                    ACPT_Lite_DB::executeQueryOrThrowException($sql, [$relationModel->getId()]);
                } catch (\Exception $exception){
                    ACPT_Lite_DB::rollbackTransaction();
                    throw new \Exception($exception->getMessage());
                }
            }
        }

        ACPT_Lite_DB::commitTransaction();
    }

    /**
     * Check if a post type exists
     *
     * @since    1.0.0
     * @param $postType
     *
     * @return bool
     */
    public static function exists($postType)
    {
        $baseQuery = "
            SELECT 
                id
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE)."`
            WHERE post_name = %s
            ";

        $posts = ACPT_Lite_DB::getResults($baseQuery, [$postType]);

        return count($posts) === 1;
    }

    /**
     * Get the registered custom post types
     *
     * @param array $meta
     * @param bool  $lazy
     *
     * @return CustomPostTypeModel[]
     * @throws \Exception
     * @since    1.0.0
     */
    public static function get(array $meta = [], $lazy = false)
    {
        $results = [];
        $args = [];

        $baseQuery = "
            SELECT 
                cp.id, 
                cp.post_name as name,
                cp.singular,
                cp.plural,
                cp.icon,
                cp.native,
                cp.supports,
                cp.labels,
                cp.settings,
                COUNT(p.id) as post_count
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE)."` cp
            LEFT JOIN `".ACPT_Lite_DB::prefix()."posts` p ON p.post_type = cp.post_name AND p.`post_status` = %s
            WHERE 1=1
            ";

        $args[] = 'publish';

        if(isset($meta['id'])){
            $baseQuery .= " AND cp.id = %s";
            $args[] = $meta['id'];
        }

        if(isset($meta['postType'])){
            $baseQuery .= " AND cp.post_name = %s ";
            $args[] = $meta['postType'];
        }

        $baseQuery .= " GROUP BY cp.id";
        $baseQuery .= " ORDER BY cp.native DESC";

        if(isset($meta['page']) and isset($meta['perPage'])){
            $baseQuery .= " LIMIT ".$meta['perPage']." OFFSET " . ($meta['perPage'] * ($meta['page'] - 1));
        }

        $baseQuery .= ';';
        $posts = ACPT_Lite_DB::getResults($baseQuery, $args);

        foreach ($posts as $post){
            $postModel = CustomPostTypeModel::hydrateFromArray([
                    'id' => $post->id,
                    'name' => $post->name,
                    'singular' => $post->singular,
                    'plural' => $post->plural,
                    'icon' => $post->icon,
                    'native' => $post->native == '0' ? false : true,
                    'supports' => json_decode($post->supports),
                    'labels' => json_decode($post->labels, true),
                    'settings' => json_decode($post->settings, true),
            ]);
            $postModel->setPostCount($post->post_count);

            if(!$lazy){
                $boxes = ACPT_Lite_DB::getResults("
                SELECT 
                    id, 
                    meta_box_name as name,
                    sort
                FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_META_BOX)."`
                WHERE post_type = %s
                ORDER BY sort
            ;", [$post->name]);

                foreach ($boxes as $boxIndex => $box){
                    $boxModel = MetaBoxModel::hydrateFromArray([
                            'id' => $box->id,
                            'postType' => $postModel->getName(),
                            'name' => $box->name,
                            'sort' => $box->sort
                    ]);

                    $sql = "
                        SELECT
                            id,
                            field_name as name,
                            field_type,
                            field_default_value,
                            field_description,
                            required,
                            showInArchive,
                            sort
                        FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_FIELD)."`
                        WHERE meta_box_id = %s
                    ";

                    if(isset($meta['excludeFields'])){
                        $sql .= " AND id NOT IN ('".implode("','", $meta['excludeFields'])."')";
                    }

                    $sql .= " ORDER BY sort;";


                    $fields = ACPT_Lite_DB::getResults($sql, [$box->id]);

                    foreach ($fields as $fieldIndex => $field){
                        $fieldModel = MetaBoxFieldModel::hydrateFromArray([
                                'id' => $field->id,
                                'metaBox' => $boxModel,
                                'title' => $field->name,
                                'type' => $field->field_type,
                                'required' => $field->required,
                                'defaultValue' => $field->field_default_value,
                                'description' => $field->field_description,
                                'showInArchive' => $field->showInArchive,
                                'sort' => $field->sort
                        ]);

                        $options = ACPT_Lite_DB::getResults("
                            SELECT
                                id,
                                meta_box_id as boxId,
                                meta_field_id as fieldId,
                                option_label as label,
                                option_value as value,
                                sort
                            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_OPTION)."`
                            WHERE meta_field_id = %s
                            ORDER BY sort
                        ;", [$field->id]);

                        foreach ($options as $option){
                            $optionModel = MetaBoxFieldOptionModel::hydrateFromArray([
                                    'id' => $option->id,
                                    'metaBoxField' => $fieldModel,
                                    'label' => $option->label,
                                    'value' => $option->value,
                                    'sort' => $option->sort,
                            ]);

                            $fieldModel->addOption($optionModel);
                        }

                        $relations = ACPT_Lite_DB::getResults("
                            SELECT
                                id,
                                meta_box_id as boxId,
                                meta_field_id as fieldId,
                                relationship as type,
                                related_post_type,
                                inversed_meta_box_id as inversedBoxId,
                                inversed_meta_box_name as inversedBoxName,
                                inversed_meta_field_id as inversedFieldId,
                                inversed_meta_field_name as inversedFieldName
                            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_RELATION)."`
                            WHERE meta_field_id = %s
                        ;", [$field->id]);

                        foreach ($relations as $relation){
                            $relatedCustomPostType = self::get([
                                    'postType' => $relation->related_post_type
                            ], true)[0];

                            $relationModel = MetaBoxFieldRelationshipModel::hydrateFromArray([
                                    'id' => $relation->id,
                                    'relationship' => $relation->type,
                                    'relatedCustomPostType' => $relatedCustomPostType,
                                    'metaBoxField' => $fieldModel,
                            ]);

                            if(isset($relation->inversedFieldId) and null !== $relation->inversedFieldId){
                                $inversedBy = self::getMetaField($relation->inversedFieldId);
                                if(null !== $inversedBy){
                                    $relationModel->setInversedBy($inversedBy);
                                }
                            }

                            $fieldModel->addRelation($relationModel);
                        }

                        $boxModel->addField($fieldModel);
                    }

                    $postModel->addMetaBox($boxModel);
                }

                $taxonomies = ACPT_Lite_DB::getResults("
                    SELECT
                        t.id,
                        t.slug ,
                        t.singular,
                        t.plural,
                        t.labels,
                        t.settings
                    FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_TAXONOMY)."` t
                    JOIN `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_TAXONOMY_PIVOT)."` p ON p.taxonomy_id = t.id
                    WHERE p.custom_post_type_id = %s
                ;", [$postModel->getId()]);

                foreach ($taxonomies as $taxonomy) {
                    $taxonomyModel = TaxonomyModel::hydrateFromArray([
                            'id' => $taxonomy->id,
                            'slug' => $taxonomy->slug,
                            'singular' => $taxonomy->singular,
                            'plural' => $taxonomy->plural,
                            'native' => (isset($taxonomy->native) and $taxonomy->native == '1') ? true : false,
                            'labels' => json_decode($taxonomy->labels, true),
                            'settings' => json_decode($taxonomy->settings, true),
                    ]);

                    $postModel->addTaxonomy($taxonomyModel);
                }

                $templates = ACPT_Lite_DB::getResults("
                        SELECT 
                            id, 
                            post_type as postType,
                            template_type as templateType,
                            json,
                            html,
                            meta
                        FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TEMPLATE)."`
                        WHERE post_type = %s
                ;", [$post->name]);

                foreach ($templates as $template) {
                    $taxonomyModel = CustomPostTypeTemplateModel::hydrateFromArray([
                            'id' => $template->id,
                            'postType' => $template->postType,
                            'templateType' => $template->templateType,
                            'json' => $template->json,
                            'html' => $template->html,
                            'meta' => json_decode($template->meta, true),
                    ]);

                    $postModel->addTemplate($taxonomyModel);
                }

                if($postModel->isWooCommerce()){
                    $productData = ACPT_Lite_DB::getResults("
                        SELECT 
                            id,
                            product_data_name,
                            icon,
                            visibility,
                            show_in_ui
                        FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_WOOCOMMERCE_PRODUCT_DATA)."`
                    ;", []);

                    foreach ($productData as $productDatum){
                        $wooCommerceProductDataModel = WooCommerceProductDataModel::hydrateFromArray([
                                'id' => $productDatum->id,
                                'name' => $productDatum->product_data_name,
                                'icon' => json_decode($productDatum->icon, true),
                                'visibility' => $productDatum->visibility,
                                'showInUI' => $productDatum->show_in_ui == '0' ? false : true,
                        ]);

                        $productDataFields = ACPT_Lite_DB::getResults("
                            SELECT 
                                id,
                                product_data_id,
                                field_name,
                                field_type,
                                required,
                                sort
                            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_WOOCOMMERCE_PRODUCT_DATA_FIELD)."`
                            WHERE product_data_id = %s ORDER BY sort DESC
                        ;", [$productDatum->id]);

                        foreach ($productDataFields as $productDataField){
                            $wooCommerceProductDataFieldModel = WooCommerceProductDataFieldModel::hydrateFromArray([
                                    'id' => $productDataField->id,
                                    'productDataModel' => $wooCommerceProductDataModel,
                                    'name' => $productDataField->field_name,
                                    'type' => $productDataField->field_type,
                                    'required' => $productDataField->required == '1',
                                    'sort' => $productDataField->sort,
                                    'defaultValue' => null,
                                    'description' => null,
                            ]);

                            $wooCommerceProductDataModel->addField($wooCommerceProductDataFieldModel);
                        }

                        $postModel->addWoocommerceProductData($wooCommerceProductDataModel);
                    }
                }
            }

            if($postModel->getName() === 'post'){
                $themeFiles = ['single.php', 'acpt/single.php'];
                $existsInTheme = WPUtils::locateTemplate($themeFiles, false);
                $postModel->setExistsSinglePageInTheme($existsInTheme != '');

                $themeFiles = ['category.php', 'acpt/category.php'];
                $existsInTheme = WPUtils::locateTemplate($themeFiles, false);
                $postModel->setExistsArchivePageInTheme($existsInTheme != '');

            } elseif ($postModel->getName() === 'page') {
                $themeFiles = ['page.php', 'acpt/page.php'];
                $existsInTheme = WPUtils::locateTemplate($themeFiles, false);
                $postModel->setExistsSinglePageInTheme($existsInTheme != '');
            } else {
                $themeFiles = ['single-'.$postModel->getName().'.php', 'acpt/single-'.$postModel->getName().'.php'];
                $existsInTheme = WPUtils::locateTemplate($themeFiles, false);
                $postModel->setExistsSinglePageInTheme($existsInTheme != '');

                $themeFiles = ['archive-'.$postModel->getName().'.php', 'acpt/archive-'.$postModel->getName().'.php'];
                $existsInTheme = WPUtils::locateTemplate($themeFiles, false);
                $postModel->setExistsArchivePageInTheme($existsInTheme != '');
            }

            $results[] = $postModel;
        }

        return $results;
    }

    /**
     * Get the id of a post type by registered name
     *
     * @since    1.0.0
     * @param $postType
     *
     * @return string|null
     */
    public static function getId($postType)
    {
        $baseQuery = "
            SELECT 
                id
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE)."`
            WHERE post_name = %s
            ";

        $posts = ACPT_Lite_DB::getResults($baseQuery, [
                $postType
        ]);

        if(count($posts) === 1){
            return $posts[0]->id;
        }

        return null;
    }

    /**
     * @param $postType
     * @param array $options
     *
     * @return MetaBoxModel[]
     * @throws \Exception
     */
    public static function getMeta($postType, array $options = [])
    {
        $postTypeModels = self::get(array_merge([
                'postType' => $postType
        ], $options));

        if(!isset($postTypeModels[0])){
            return [];
        }

        return $postTypeModels[0]->getMetaBoxes();
    }

    /**
     * @param $postType
     * @param $box
     * @param $field
     *
     * @return MetaBoxFieldModel|null
     * @throws \Exception
     */
    public static function getSingleMeta($postType, $box, $field)
    {
        $metaBoxes = self::getMeta($postType);

        foreach ($metaBoxes as $boxModel){
            if($boxModel->getName() === $box){
                foreach ($boxModel->getFields() as $fieldModel){
                    if($fieldModel->getName() === $field){
                        return $fieldModel;
                    }
                }
            }
        }

        return null;
    }

    /**
     * @param $id
     *
     * @return MetaBoxModel
     * @throws \Exception
     */
    public static function getMetaBox($id)
    {
        $boxes = ACPT_Lite_DB::getResults("
            SELECT 
                id, 
                post_type,
                meta_box_name as name,
                sort
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_META_BOX)."`
            WHERE id = %s
        ;", [$id]);

        foreach ($boxes as $boxIndex => $box) {
            return MetaBoxModel::hydrateFromArray( [
                    'id'       => $box->id,
                    'postType' => $box->post_type,
                    'name'     => $box->name,
                    'sort'     => $box->sort
            ] );
        }
    }

    /**
     * @param $id
     *
     * @return MetaBoxFieldModel
     * @throws \Exception
     */
    public static function getMetaField($id)
    {
        $sql = "
            SELECT
                id,
                meta_box_id,
                field_name as name,
                field_default_value as default_value,
                field_description as description,
                field_type,
                required,
                showInArchive,
                sort
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_FIELD)."`
            WHERE id = %s
        ;";

        $fields = ACPT_Lite_DB::getResults($sql, [$id]);

        foreach ($fields as $fieldIndex => $field) {
            return MetaBoxFieldModel::hydrateFromArray( [
                    'id'            => $field->id,
                    'metaBox'       => CustomPostTypeRepository::getMetaBox($field->meta_box_id),
                    'title'         => $field->name,
                    'type'          => $field->field_type,
                    'required'      => $field->required,
                    'defaultValue'  => $field->default_value,
                    'description'   => $field->description,
                    'showInArchive' => $field->showInArchive,
                    'sort'          => $field->sort
            ] );
        }

        return null;
    }

    /**
     * Save custom post type data
     *
     * @param CustomPostTypeModel $model
     *
     * @throws \Exception
     */
    public static function save(CustomPostTypeModel $model)
    {
        $sql = "
            INSERT INTO `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE)."` 
            (`id`,
            `post_name` ,
            `singular` ,
            `plural`,
            `icon`,
            `native`,
            `supports`,
            `labels`,
            `settings`
            ) VALUES (
                %s,
                %s,
                %s,
                %s,
                %s,
                %s,
                %s,
                %s,
                %s
            ) ON DUPLICATE KEY UPDATE 
                `post_name` = %s,
                `singular` = %s,
                `plural` = %s,
                `icon` = %s,
                `native` = %s,
                `supports` = %s,
                `labels` = %s,
                `settings` = %s
        ;";

        ACPT_Lite_DB::executeQueryOrThrowException($sql, [
                $model->getId(),
                $model->getName(),
                $model->getSingular(),
                $model->getPlural(),
                $model->getIcon(),
                $model->isNative(),
                json_encode($model->getSupports()),
                json_encode($model->getLabels()),
                json_encode($model->getSettings()),
                $model->getName(),
                $model->getSingular(),
                $model->getPlural(),
                $model->getIcon(),
                $model->isNative(),
                json_encode($model->getSupports()),
                json_encode($model->getLabels()),
                json_encode($model->getSettings())
        ]);
    }

    /**
     * Save meta box
     *
     * @param MetaBoxModel $metaBoxModel
     * @param              $ids
     *
     * @throws \Exception
     */
    public static function saveMetaBox(MetaBoxModel $metaBoxModel, &$ids)
    {
        ACPT_Lite_DB::startTransaction();

        try {

            PostMetaSync::updatePostMetaWhenBoxNameChanges($metaBoxModel);

            $sql = "
                INSERT INTO `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_META_BOX)."` 
                (
                    `id`,
                    `post_type`,
                    `meta_box_name`,
                    `sort`
                ) VALUES (
                    %s,
                    %s,
                    %s,
                    %d
                ) ON DUPLICATE KEY UPDATE 
                    `post_type` = %s,
                    `meta_box_name` = %s,
                    `sort` = %d
            ;";

            ACPT_Lite_DB::executeQueryOrThrowException($sql, [
                    $metaBoxModel->getId(),
                    $metaBoxModel->getPostType(),
                    $metaBoxModel->getName(),
                    $metaBoxModel->getSort(),
                    $metaBoxModel->getPostType(),
                    $metaBoxModel->getName(),
                    $metaBoxModel->getSort()
            ]);

            foreach ($metaBoxModel->getFields() as $fieldModel){
                self::saveMetaField($fieldModel);
            }

        } catch (\Exception $exception){
            ACPT_Lite_DB::rollbackTransaction();
        }

        ACPT_Lite_DB::commitTransaction();
    }

    /**
     * @param MetaBoxFieldModel $fieldModel
     *
     * @throws \Exception
     */
    public static function saveMetaField(MetaBoxFieldModel $fieldModel)
    {
        $showInArchive = $fieldModel->isShowInArchive() ? '1' : '0';
        $isRequired = $fieldModel->isRequired() ? '1' : '0';
        $metaBoxModel = $fieldModel->getMetaBox();

        PostMetaSync::updatePostMetaWhenFieldNameChanges($fieldModel);

        $sql = "
            INSERT INTO `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_FIELD)."` 
            (
                `id`,
                `meta_box_id`,
                `field_name`,
                `field_type`,
                `field_default_value`,
                `field_description`,
                `showInArchive`,
                `required`,
                `sort`
            ) VALUES (
                %s,
                %s,
                %s,
                %s,
                %s,
                %s,
                %s,
                %s,
                %d
            ) ON DUPLICATE KEY UPDATE 
                `meta_box_id` = %s,
                `field_name` = %s,
                `field_type` = %s,
                `field_default_value` = %s,
                `field_description` = %s,
                `showInArchive` = %s,
                `required` = %s,
                `sort` = %d
        ;";

        $params = [
                $fieldModel->getId(),
                $metaBoxModel->getId(),
                $fieldModel->getName(),
                $fieldModel->getType(),
                $fieldModel->getDefaultValue(),
                $fieldModel->getDescription(),
                $showInArchive,
                $isRequired,
                $fieldModel->getSort(),
                $metaBoxModel->getId(),
                $fieldModel->getName(),
                $fieldModel->getType(),
                $fieldModel->getDefaultValue(),
                $fieldModel->getDescription(),
                $showInArchive,
                $isRequired,
                $fieldModel->getSort(),
        ];

        ACPT_Lite_DB::executeQueryOrThrowException($sql, $params);

        foreach ($fieldModel->getOptions() as $optionModel){
            $sql = "
                    INSERT INTO `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_OPTION)."` 
                    (`id`,
                    `meta_box_id` ,
                    `meta_field_id` ,
                    `option_label` ,
                    `option_value` ,
                    `sort`
                    ) VALUES (
                        %s,
                        %s,
                        %s,
                        %s,
                        %s,
                        %d
                    ) ON DUPLICATE KEY UPDATE 
                        `meta_box_id` = %s,
                        `meta_field_id` = %s,
                        `option_label` = %s,
                        `option_value` = %s,
                        `sort` = %d
                ;";

            ACPT_Lite_DB::executeQueryOrThrowException($sql, [
                    $optionModel->getId(),
                    $metaBoxModel->getId(),
                    $fieldModel->getId(),
                    $optionModel->getLabel(),
                    $optionModel->getValue(),
                    $optionModel->getSort(),
                    $metaBoxModel->getId(),
                    $fieldModel->getId(),
                    $optionModel->getLabel(),
                    $optionModel->getValue(),
                    $optionModel->getSort()
            ]);
        }
    }

    /**
     * @throws \Exception
     */
    public static function removeOrphanRelationships()
    {
        $query = "
            SELECT f.`id`, r.`inversed_meta_field_id`, r.`relationship`
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_FIELD)."` f
            JOIN `" . ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_RELATION) . "` r ON r.meta_field_id = f.id
            WHERE f.`field_type` = %s
            AND r.`relationship` LIKE '%Bi'
        ";

        // set all orphan fields with a orphan relationship to TEXT
        $results = ACPT_Lite_DB::getResults($query, [
                MetaBoxFieldModel::POST_TYPE
        ]);

        if(count($results) > 0) {
            foreach ( $results as $result ) {

                $subquery = "
                    SELECT f.id
                    FROM `" . ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_FIELD) . "` f
                    WHERE f.`id` = %s
                ";

                $subResults = ACPT_Lite_DB::getResults( $subquery, [$result->inversed_meta_field_id] );

                if ( count( $subResults ) === 0 ) {
                    $sql = "DELETE FROM `" . ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_RELATION) . "` WHERE meta_field_id = %s;";
                    self::executeQueryOrThrowException( $sql, [
                            $result->id
                    ] );

                    $sql = "UPDATE `" . ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_FIELD) . "` SET `field_type` = %s WHERE id = %s;";
                    self::executeQueryOrThrowException( $sql, [
                            MetaBoxFieldModel::TEXT_TYPE,
                            $result->id
                    ] );
                }
            }
        }

        // check if there are persisted relationship on a NON POST type field
        $query = "
            SELECT r.id
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_RELATION)."` r
            JOIN `" . ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_FIELD) . "` f ON f.id = r.meta_field_id 
            WHERE f.`field_type` != %s
        ";

        $results = ACPT_Lite_DB::getResults($query, [
                MetaBoxFieldModel::POST_TYPE
        ]);

        if(count($results) > 0) {
            foreach ( $results as $result ) {
                $sql = "DELETE FROM `" . ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_RELATION) . "` WHERE id = %s;";
                self::executeQueryOrThrowException( $sql, [
                        $result->id
                ] );
            }
        }
    }

    /**
     * @param $postType
     * @param $ids
     *
     * @throws \Exception
     */
    public static function removeMetaOrphans($postType, $ids)
    {
        if(isset($ids['fields'])){
            ACPT_Lite_DB::executeQueryOrThrowException("DELETE f FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_FIELD)."` f LEFT JOIN `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_META_BOX)."` b on b.id=f.meta_box_id WHERE b.post_type = '".$postType."' AND f.id NOT IN ('".implode("','",$ids['fields'])."');");
        }

        if(isset($ids['options'])){
            ACPT_Lite_DB::executeQueryOrThrowException("DELETE o FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_OPTION)."` o LEFT JOIN `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_META_BOX)."` b on b.id=o.meta_box_id WHERE b.post_type = '".$postType."' AND o.id NOT IN ('".implode("','",$ids['options'])."');");
        }

        if(isset($ids['boxes'])){
            ACPT_Lite_DB::executeQueryOrThrowException("DELETE FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_META_BOX)."` WHERE post_type = '".$postType."' AND id NOT IN ('".implode("','",$ids['boxes'])."');");
        }

        if(!empty($fieldIds)){
            self::deletePostMetaData($fieldIds);
        }
    }

    /**
     * Delete all posts by post type
     *
     * @param $postType
     *
     * @throws \Exception
     */
    private static function deletePostType($postType)
    {
        global $wpdb;

        $query = "DELETE a,b,c
            FROM `{$wpdb->prefix}posts` a
            LEFT JOIN `{$wpdb->prefix}term_relationships` b
                ON (a.ID = b.object_id)
            LEFT JOIN `{$wpdb->prefix}postmeta` c
                ON (a.ID = c.post_id)
            WHERE a.post_type = %s";

        ACPT_Lite_DB::executeQueryOrThrowException($query, [$postType]);
    }

    /**
     * Delete all post meta data for a given fieldIds list
     *
     * @param $fieldIds
     *
     * @throws \Exception
     */
    private static function deletePostMetaData($fieldIds)
    {
        global $wpdb;

        foreach ($fieldIds as $fieldId){

            $baseQuery = "
                    SELECT 
                        b.meta_box_name,
                        f.field_name,
                        f.field_type
                    FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_FIELD)."` f
                    JOIN `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_META_BOX)."` b on b.id = f.meta_box_id
                    WHERE f.id = %s AND parent_id IS NULL
                ";

            $field = ACPT_Lite_DB::getResults($baseQuery, [$fieldId])[0];

            if($field->meta_box_name !== null and $field->field_name !== null){
                $metaFieldName = Strings::toDBFormat($field->meta_box_name).'_'.Strings::toDBFormat($field->field_name);

                $sql = "DELETE FROM `{$wpdb->prefix}postmeta` WHERE meta_key=%s";

                ACPT_Lite_DB::executeQueryOrThrowException($sql, [
                        $metaFieldName
                ]);

                ACPT_Lite_DB::executeQueryOrThrowException($sql, [
                        $metaFieldName.'_type'
                ]);
            }
        }
    }
}