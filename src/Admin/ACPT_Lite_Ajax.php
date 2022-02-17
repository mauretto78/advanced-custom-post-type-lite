<?php

namespace ACPT_Lite\Admin;

use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Helper\Uuid;
use ACPT_Lite\Core\Models\CustomPostTypeModel;
use ACPT_Lite\Core\Models\CustomPostTypeTemplateModel;
use ACPT_Lite\Core\Models\FileImportModel;
use ACPT_Lite\Core\Models\MetaBoxFieldModel;
use ACPT_Lite\Core\Models\MetaBoxFieldOptionModel;
use ACPT_Lite\Core\Models\MetaBoxFieldRelationshipModel;
use ACPT_Lite\Core\Models\MetaBoxModel;
use ACPT_Lite\Core\Models\SettingsModel;
use ACPT_Lite\Core\Models\TaxonomyModel;
use ACPT_Lite\Core\Models\WooCommerceProductDataFieldModel;
use ACPT_Lite\Core\Models\WooCommerceProductDataFieldOptionModel;
use ACPT_Lite\Core\Models\WooCommerceProductDataModel;
use ACPT_Lite\Includes\ACPT_Lite_DB;
use ACPT_Lite\Utils\Sanitizer;
use ACPT_Lite\Utils\Sluggify;
use ACPT_Lite\Utils\WPLinks;

/**
 * The admin ajax handler
 *
 * @since      1.0.0
 * @package    advanced-custom-post-type-lite
 * @subpackage advanced-custom-post-type/admin
 * @author     Mauro Cassani <maurocassani1978@gmail.com>
 */
class ACPT_Lite_Ajax
{
    public function assocTaxonomyToPostTypeAction()
    {
        if(isset($_POST['data'])) {
            $data = $this->sanitizeJsonData($_POST['data']);

            try {
                $postId = ACPT_Lite_DB::getId($data['postType']);

                foreach ($data['taxonomies'] as $taxonomy){
                    if($taxonomy['checked']){
                        ACPT_Lite_DB::assocPostToTaxonomy($postId, $taxonomy['id']);
                    } else {
                        ACPT_Lite_DB::removeAssocPostToTaxonomy($postId, $taxonomy['id']);
                    }
                }

                $return = [
                        'success' => true,
                ];
            } catch (\Exception $exception){
                $return = [
                        'success' => false,
                        'error' => $exception->getMessage()
                ];
            }

            return wp_send_json($return);
        }
    }

    /**
     * Delete custom post type
     *
     * @return mixed
     */
    public function deleteCustomPostTypeAction()
    {
        if(isset($_POST['data'])){
            $data = $this->sanitizeJsonData($_POST['data']);

            if(!isset($data['postType'])){
                return wp_send_json([
                    'success' => false,
                    'error' => 'Missing postType'
                ]);
            }

            $postType = $data['postType'];

            try {
                ACPT_Lite_DB::delete($postType);

                $return = [
                    'success' => true,
                ];
            } catch (\Exception $exception){
                $return = [
                    'success' => false,
                    'error' => $exception->getMessage()
                ];
            }

            return wp_send_json($return);
        }

        return wp_send_json([
            'success' => false,
            'error' => 'no postType was sent'
        ]);
    }

    /**
     * Delete all meta for a custom post type
     *
     * @return mixed
     */
    public function deleteCustomPostTypeMetaAction()
    {
        if(isset($_POST['data'])){
            $data = $this->sanitizeJsonData($_POST['data']);

            if(!isset($data['postType'])){
                return wp_send_json([
                        'success' => false,
                        'error' => 'Missing postType'
                ]);
            }

            $postType = $data['postType'];

            try {
                ACPT_Lite_DB::deleteMeta($postType);
                ACPT_Lite_DB::removeOrphanRelationships();

                $return = [
                        'success' => true,
                ];
            } catch (\Exception $exception){
                $return = [
                        'success' => false,
                        'error' => $exception->getMessage()
                ];
            }

            return wp_send_json($return);
        }

        return wp_send_json([
                'success' => false,
                'error' => 'no postType was sent'
        ]);
    }

    /**
     * Delete post type template
     *
     * @return mixed
     */
    public function deletePostTypeTemplateAction()
    {
        $data = $this->sanitizeJsonData($_POST['data']);

        if(!isset($data['postType']) and !isset($data['templateType'])){
            return wp_send_json([
                    'success' => false,
                    'error' => 'Missing postType and/or templateType'
            ]);
        }

        $postType = $data['postType'];
        $templateType = $data['templateType'];

        try {
            ACPT_Lite_DB::deleteTemplate($postType, $templateType);

            $return = [
                    'success' => true,
            ];
        } catch (\Exception $exception){
            $return = [
                    'success' => false,
                    'error' => $exception->getMessage()
            ];
        }

        return wp_send_json($return);
    }

    /**
     * Delete a taxonomy
     *
     * @return mixed
     */
    public function deleteTaxonomyAction()
    {
        if(isset($_POST['data'])){
            $data = $this->sanitizeJsonData($_POST['data']);

            if(!isset($data['taxonomy'])){
                return wp_send_json([
                        'success' => false,
                        'error' => 'Missing taxonomy'
                ]);
            }

            $taxonomy = $data['taxonomy'];

            try {
                ACPT_Lite_DB::deleteTaxonomy($taxonomy);

                $return = [
                        'success' => true,
                ];
            } catch (\Exception $exception){
                $return = [
                        'success' => false,
                        'error' => $exception->getMessage()
                ];
            }

            return wp_send_json($return);
        }

        return wp_send_json([
                'success' => false,
                'error' => 'no taxonomy was sent'
        ]);
    }

    public function deleteWooCommerceProductDataAction()
    {
        if(isset($_POST['data'])){
            $data = $this->sanitizeJsonData($_POST['data']);

            if(!isset($data['id'])){
                return wp_send_json([
                    'success' => false,
                    'error' => 'Missing id'
                ]);
            }

            $id = $data['id'];

            try {
                ACPT_Lite_DB::deleteWooCommerceProductData($id);

                $return = [
                    'success' => true,
                ];
            } catch (\Exception $exception){
                $return = [
                    'success' => false,
                    'error' => $exception->getMessage()
                ];
            }

            return wp_send_json($return);
        }

        return wp_send_json([
            'success' => false,
            'error' => 'no WooCommerce product data was sent'
        ]);
    }

    public function deleteWooCommerceProductDataFieldsAction()
    {
        if(isset($_POST['data'])){
            $data = $this->sanitizeJsonData($_POST['data']);

            if(!isset($data['id'])){
                return wp_send_json([
                    'success' => false,
                    'error' => 'Missing id'
                ]);
            }
            $id = $data['id'];

            try {
                ACPT_Lite_DB::deleteWooCommerceProductDataFields($id);

                $return = [
                    'success' => true,
                ];
            } catch (\Exception $exception){
                $return = [
                    'success' => false,
                    'error' => $exception->getMessage()
                ];
            }

            return wp_send_json($return);
        }

        return wp_send_json([
            'success' => false,
            'error' => 'no WooCommerce product data was sent'
        ]);
    }

    public function doShortcodeAction()
    {
        $data = $this->sanitizeJsonData($_POST['data']);

        if(!isset($data['shortcode'])){
            return wp_send_json([
                    'success' => false,
                    'error' => 'Missing taxonomy'
            ]);
        }

        $shortcode = $data['shortcode'];

        return wp_send_json([
            'success' => true,
            'data' => do_shortcode($shortcode)
        ]);
    }

    /**
     * @return mixed
     * @throws \Exception
     */
    public function exportFileAction()
    {
        $data = $this->sanitizeJsonData($_POST['data']);
        $customPostTypes = [];

        foreach ($data as $datum){
            $item = [];

            if($datum['structure']){

                /** @var CustomPostTypeModel $customPostTypeModel */
                $customPostTypeModel = ACPT_Lite_DB::get([
                    'postType' => $datum['id']
                ])[0];

                $item['structure'] = $customPostTypeModel->arrayRepresentation();

                if($datum['data']){
                    $item['data'] = [];
                }
            }

            if(!empty($item)){
                $customPostTypes[] = $item;
            }
        }

        return wp_send_json([
            'success' => true,
            'data' => $customPostTypes
        ]);
    }

    public function fetchPreviewLinkAction()
    {
        $data = $this->sanitizeJsonData($_POST['data']);
        if(!isset($data['id']) and !isset($data['type']) ){
            return wp_send_json([
                    'success' => false,
                    'error' => 'Missing id and/or post type'
            ]);
        }

        $postId = $data['id'];
        $type = $data['type'];

        if($type === 'post'){
            $category = get_the_category($postId);
            $archiveLink = get_category_link($category);
        } else {
            $archiveLink = get_post_type_archive_link($type);
        }

        return wp_send_json([
            'success' => true,
            'data' => [
                'single_link' => get_the_permalink($postId),
                'archive_link' => $archiveLink
            ]
        ]);
    }

    /**
     * Fetch custom post type meta
     *
     * @return mixed
     * @throws \Exception
     */
    public function fetchCustomPostTypeMetaAction()
    {
        $data = $this->sanitizeJsonData($_POST['data']);
        if(!isset($data['postType'])){
            return wp_send_json([
                    'success' => false,
                    'error' => 'Missing postType'
            ]);
        }

        $postType = $data['postType'];
        $options = [];

        if(isset($data['excludeField'])){
            $options['excludeFields'][] = $data['excludeField'];
        }

        return wp_send_json(ACPT_Lite_DB::getMeta($postType, $options));
    }

    /**
     * @return mixed
     * @throws \Exception
     */
    public function fetchCustomPostTypeTemplateAction()
    {
        $data = $this->sanitizeJsonData($_POST['data']);

        // json, postType, templateType
        if(!isset($data['postType']) and !isset($data['templateType'])){
            return wp_send_json([
                    'success' => false,
                    'error' => 'Missing required arguments: [postType, templateType]'
            ]);
        }

        return wp_send_json(ACPT_Lite_DB::getTemplate($data['postType'], $data['templateType']));
    }

    /**
     * Fetch custom post types
     *
     * @return mixed
     * @throws \Exception
     */
    public function fetchCustomPostTypesAction()
    {
        $postType = null;
        if(isset($_POST['data'])){
            $data = $this->sanitizeJsonData($_POST['data']);
            $postType = isset($data['postType']) ? $data['postType'] : null;
            $page = isset($data['page']) ? $data['page'] : null;
            $perPage = isset($data['perPage']) ? $data['perPage'] : null;
        }

        if($postType){
            return wp_send_json(ACPT_Lite_DB::get([
                'postType' => $postType
            ]));
        }

        return wp_send_json(ACPT_Lite_DB::get([
            'page' => isset($page) ? $page : 1,
            'perPage' => isset($perPage) ? $perPage : 20,
        ]));
    }

    /**
     * Fetch custom post types total count
     *
     * @return mixed
     */
    public function fetchCustomPostTypesCountAction()
    {
        return wp_send_json(ACPT_Lite_DB::count());
    }

    public function fetchHeadersAndFootersAction()
    {
        $directory = get_template_directory();

        $headers = array_merge(glob($directory."/header.php"), glob($directory."/header-*.php"));
        $footers = array_merge(glob($directory."/footer.php"), glob($directory."/footer-*.php"));

        foreach ($headers as $index => $header){
            $headers[$index] = $this->cleanHeadersAndFootersName($header);
        }

        foreach ($footers as $index => $footer){
            $footers[$index] = $this->cleanHeadersAndFootersName($footer);
        }

        return wp_send_json([
                'headers' => $headers,
                'footers' => $footers,
        ]);
    }

    /**
     * @param $string
     *
     * @return string|string[]
     */
    private function cleanHeadersAndFootersName( $string)
    {
        $directory = get_template_directory();

        return str_replace([$directory, '/', '.php'],'', $string);
    }

    /**
     * @return mixed
     * @throws \Exception
     */
    public function fetchSettingsAction()
    {
        return wp_send_json(ACPT_Lite_DB::getSettings());
    }

    /**
     * @return mixed
     * @throws \Exception
     */
    public function fetchWooCommerceProductDataAction()
    {
        if(isset($_POST['data'])){
            $data = $this->sanitizeJsonData($_POST['data']);

            return wp_send_json(ACPT_Lite_DB::getWooCommerceProductData($data));
        }

        return wp_send_json([]);
    }

    public function fetchWooCommerceProductDataFieldsAction()
    {
        if(isset($_POST['data'])){
            $data = $this->sanitizeJsonData($_POST['data']);

            if(!isset($data['id'])){
                return wp_send_json([
                    'success' => false,
                    'error' => 'Missing post id'
                ]);
            }

            $id = $data['id'];

            try {
                $return = ACPT_Lite_DB::getWooCommerceProductDataFields($id);
            } catch (\Exception $exception){
                $return = [
                    'success' => false,
                    'error' => $exception->getMessage()
                ];
            }

            return wp_send_json($return);
        }

        return wp_send_json([
            'success' => false,
            'error' => 'no id was sent'
        ]);
    }

    /**
     * Fetch theme's registered sidebars
     *
     * @return mixed
     */
    public function fetchSidebarsAction()
    {
        global $wp_registered_sidebars;

        $sidebars = [];

        foreach ($wp_registered_sidebars as $sidebar){
            $sidebars[] = $sidebar;
        }

        return wp_send_json($sidebars);
    }

    /**
     * Fetch taxonomies
     *
     * @return mixed
     * @throws \Exception
     */
    public function fetchTaxonomiesAction()
    {
        $taxonomy = null;
        if(isset($_POST['data'])){
            $data = $this->sanitizeJsonData($_POST['data']);
            $taxonomy = isset($data['taxonomy']) ? $data['taxonomy'] : null;
            $page = isset($data['page']) ? $data['page'] : null;
            $perPage = isset($data['perPage']) ? $data['perPage'] : null;
        }

        if($taxonomy){
            return wp_send_json(ACPT_Lite_DB::getTaxonomies([
                    'taxonomy' => $taxonomy
            ]));
        }

        return wp_send_json(ACPT_Lite_DB::getTaxonomies([
                'page' => isset($page) ? $page : 1,
                'perPage' => isset($perPage) ? $perPage : 20,
        ]));
    }

    /**
     * fetch post data from id
     *
     * @return mixed
     */
    public function fetchPostDataAction()
    {
        if(isset($_POST['data'])){
            $data = $this->sanitizeJsonData($_POST['data']);

            if(!isset($data['id'])){
                return wp_send_json([
                        'success' => false,
                        'error' => 'Missing post id'
                ]);
            }

            $postId = $data['id'];
            $post = get_post($postId, "ARRAY_A");
            $post['thumbnail'] = [
                'id' => get_post_thumbnail_id($postId),
                'title' => get_post(get_post_thumbnail_id($postId))->post_title,
                'excerpt' => get_post(get_post_thumbnail_id($postId))->post_excerpt,
                'description' => get_post(get_post_thumbnail_id($postId))->post_content,
                'url' => get_the_post_thumbnail_url($postId),
            ];
            $post['author'] = get_userdata($post['post_author']);
            $post['links'] =  [
                    'prev' => WPLinks::getPrevLink($postId),
                    'next' => WPLinks::getNextLink($postId),
            ];

            $post['taxonomies'] = WPLinks::getTaxonomiesLinks($postId, $post['post_type']);

            return wp_send_json($post);
        }

        return wp_send_json([
            'success' => false,
            'error' => 'no postType was sent'
        ]);
    }

    /**
     * Fetch posts
     *
     * @return mixed
     * @throws \Exception
     */
    public function fetchPostsAction()
    {
        if(isset($_POST['data'])){
            $data = $this->sanitizeJsonData($_POST['data']);

            if(!isset($data['postType'])){
                return wp_send_json([
                    'success' => false,
                    'error' => 'Missing postType'
                ]);
            }

            $loop = (new ACPT_Lite_Hooks())->loop([
                'postType' => $data['postType'],
                'perPage' => isset($data['perPage']) ? $data['perPage'] : -1,
                'sortOrder' => (isset($data['sortOrder'])) ? $data['sortOrder']: 'ASC',
                'sortBy' => (isset($data['sortBy'])) ? $data['sortBy']: null,
            ]);

            while ( $loop->have_posts() ) : $loop->the_post();
                $return[] = [
                    'id' => get_the_ID(),
                    'title' => get_the_title(),
                ];
            endwhile;

            wp_reset_postdata();

            return wp_send_json($return);
        }

        return wp_send_json([
                'success' => false,
                'error' => 'no postType was sent'
        ]);
    }

    /**
     * @return mixed
     */
    public function fetchTaxonomiesCountAction()
    {
        return wp_send_json(ACPT_Lite_DB::taxonomyCount());
    }

    /**
     * @return mixed
     */
    public function importFileAction()
    {
        if(empty($_FILES)){
            return wp_send_json([
                'error' => 'No files uploaded'
            ]);
        }

        $file = $_FILES['file'];

        // validate size
        if($file['size'] > 2097152){
            return wp_send_json([
                'error' => 'File too large. Max size: 2Mb'
            ]);
        }

        // upload file
        $contentFileInfo = wp_handle_upload( $file, [
            'test_form' => false,
            'test_type' => false,
        ] );

        $content = json_decode(file_get_contents($contentFileInfo['file']), true);

        // validate content
        if(!self::validateImportContent($content)){
            return wp_send_json([
                    'error' => 'Wrong data, not suitable for import'
            ]);
        }

        try {
            // import content
            foreach ($content as $item){
                if(isset($item['structure'])){
                    ACPT_Lite_DB::import($item['structure']);
                }
            }

            // save import
            $contentFileInfo['content'] = $content;

            return wp_send_json([
                    'success' => true,
                    'data' => $contentFileInfo
            ]);

        } catch (\Exception $exception){
            return wp_send_json([
                    'error' => (!empty($exception->getMessage())) ? $exception->getMessage() : 'Error during import occurred'
            ]);
        }
    }

    /**
     * @param array $content
     *
     * @return bool
     */
    private static function validateImportContent( array $content )
    {
        if(empty($content)){
            return false;
        }

        foreach ($content as $item){
            if(!isset($item['structure']) or !isset($item['data']) ){
                return false;
            }

            if(isset($item['structure'])){
                return (
                    isset($item['structure']['id']) and
                    isset($item['structure']['name']) and
                    isset($item['structure']['singular']) and
                    isset($item['structure']['plural']) and
                    isset($item['structure']['icon']) and
                    isset($item['structure']['postCount']) and
                    isset($item['structure']['supports']) and
                    isset($item['structure']['labels']) and
                    isset($item['structure']['settings']) and
                    isset($item['structure']['meta'])
                );
            }
        }

        return true;
    }

    /**
     * Reset all custom post type meta
     *
     * @return mixed
     */
    public function resetCustomPostTypesAction()
    {
        return wp_send_json([]);
    }

    /**
     * Reset all taxonomies
     *
     * @return mixed
     */
    public function resetTaxonomiesAction()
    {
        return wp_send_json([]);
    }

    /**
     * Reset all taxonomies
     *
     * @return mixed
     */
    public function resetWooCommerceProductDataAction()
    {
        return wp_send_json([]);
    }

    /**
     * Creates a custom post type
     */
    public function saveCustomPostTypeAction()
    {
        $data = $this->sanitizeJsonData($_POST['data']);

        $supports = [];

        if($data[1]["support_0"] !== false){ $supports[] = $data[1]["support_0"]; }
        if($data[1]["support_1"] !== false){ $supports[] = $data[1]["support_1"]; }
        if($data[1]["support_2"] !== false){ $supports[] = $data[1]["support_2"]; }
        if($data[1]["support_3"] !== false){ $supports[] = $data[1]["support_3"]; }
        if($data[1]["support_4"] !== false){ $supports[] = $data[1]["support_4"]; }
        if($data[1]["support_5"] !== false){ $supports[] = $data[1]["support_5"]; }
        if($data[1]["support_6"] !== false){ $supports[] = $data[1]["support_6"]; }
        if($data[1]["support_7"] !== false){ $supports[] = $data[1]["support_7"]; }
        if($data[1]["support_8"] !== false){ $supports[] = $data[1]["support_8"]; }
        if($data[1]["support_9"] !== false){ $supports[] = $data[1]["support_9"]; }
        if($data[1]["support_10"] !== false){ $supports[] = $data[1]["support_10"]; }

        // persist $model on DB
        try {
            $id = (ACPT_Lite_DB::exists($data[1]["post_name"])) ? ACPT_Lite_DB::getId($data[1]["post_name"]) : Uuid::v4();
            $model = CustomPostTypeModel::hydrateFromArray([
                    'id' => $id,
                    'name' => $data[1]["post_name"],
                    'singular' => $data[1]["singular_label"],
                    'plural' => $data[1]["plural_label"],
                    'icon' => (isset($data[1]["icon"]['value'])) ? $data[1]["icon"]['value']: $data[1]["icon"],
                    'native' => false,
                    'supports' => $supports,
                    'labels' => $data[2],
                    'settings' => $data[3]
            ]);

            ACPT_Lite_DB::save($model);
            $return = [
                    'success' => true
            ];
        } catch (\Exception $exception){
            $return = [
                    'success' => false,
                    'error' => $exception->getMessage()
            ];
        }

        return wp_send_json($return);
    }

    /**
     * Save custom post type template
     *
     * @return mixed
     */
    public function saveCustomPostTypeTemplateAction()
    {
        $data = $this->sanitizeJsonData($_POST['data']);

        // json, postType, templateType
        if(!isset($data['html']) and !isset($data['json']) and  !isset($data['postType']) and !isset($data['templateType'])){
            return wp_send_json([
                    'success' => false,
                    'error' => 'Missing required arguments: [html, json, postType, templateType]'
            ]);
        }

        // persist $model on DB
        try {
            $template = ACPT_Lite_DB::getTemplate($data['postType'], $data['templateType']);

            $newTemplate = CustomPostTypeTemplateModel::hydrateFromArray([
                'id' => $template ? $template->getId() : Uuid::v4(),
                'postType' => $data['postType'],
                'templateType' =>  $data['templateType'],
                'json' =>  $data['json'],
                'html' =>  $data['html'],
                'meta' =>  isset($data['meta']) ? $data['meta'] : [],
            ]);

            ACPT_Lite_DB::saveTemplate($newTemplate);

            $return = [
                'success' => true
            ];

        } catch (\Exception $exception){
            $return = [
                    'success' => false,
                    'error' => $exception->getMessage()
            ];
        }

        return wp_send_json($return);
    }

    /**
     * Creates a custom post type
     */
    public function saveCustomPostTypeMetaAction()
    {
        $data = $this->sanitizeJsonData($_POST['data']);
        $ids = [];
        $arrayOfBoxNames = [];

        // persist $model on DB
        try {
            foreach ($data as $boxIndex => $box ) {

                $boxModel = MetaBoxModel::hydrateFromArray([
                        'id' => $box['id'],
                        'postType' => $box['postType'],
                        'name' =>  $box['title'],
                        'sort' =>  ($boxIndex+1)
                ]);

                $ids[$box['postType']]['boxes'][] = $box['id'];

                if(isset($box['fields'])){
                    $arrayOfFieldNames = [];

                    foreach ($box['fields'] as $fieldIndex => $field) {
                        $fieldModel = MetaBoxFieldModel::hydrateFromArray([
                                'id' => $field['id'],
                                'title' => $field['name'],
                                'type' => $field['type'],
                                'defaultValue' => isset($field['defaultValue']) ? $field['defaultValue'] : null,
                                'description' => isset($field['description']) ? $field['description'] : null,
                                'showInArchive' => isset($field['showInArchive']) ? $field['showInArchive'] : false,
                                'required' => isset($field['isRequired']) ? $field['isRequired'] : false,
                                'metaBox' => $boxModel,
                                'sort' =>  ($fieldIndex+1)
                        ]);

                        $ids[$box['postType']]['fields'][] = $field['id'];

                        $fieldModel->changeName($this->getTheFirstAvailableName($fieldModel->getName(), $arrayOfFieldNames));
                        $arrayOfFieldNames[] = $fieldModel->getName();

                        if(isset($field['options'])){
                            foreach ($field['options'] as $optionIndex => $option) {
                                $optionModel = MetaBoxFieldOptionModel::hydrateFromArray([
                                        'id' => $option['id'],
                                        'label' => $option['label'],
                                        'value' => $option['value'],
                                        'metaBoxField' => $fieldModel,
                                        'sort' =>  ($optionIndex+1)
                                ]);

                                $ids[$box['postType']]['options'][] = $option['id'];

                                $fieldModel->addOption($optionModel);
                            }
                        }

                        if(isset($field['relations'])){
                            foreach ($field['relations'] as $relationIndex => $relation) {

                                $relatedCustomPostType = ACPT_Lite_DB::get([
                                        'postType' => $relation['relatedPostType']
                                ], true)[0];

                                $relationModel = MetaBoxFieldRelationshipModel::hydrateFromArray([
                                        'id' => $relation['id'],
                                        'relationship' => $relation['type'],
                                        'relatedCustomPostType' => $relatedCustomPostType,
                                        'metaBoxField' => $fieldModel,
                                ]);

                                if(isset($relation['inversedFieldId'])){
                                    $inversedBy = ACPT_Lite_DB::getMetaField($relation['inversedFieldId']);
                                    $relationModel->setInversedBy($inversedBy);
                                }

                                $ids[$box['postType']]['relations'][] = $relation['id'];

                                $fieldModel->removeRelation($relationModel);
                                $fieldModel->addRelation($relationModel);
                            }
                        }

                        $boxModel->addField($fieldModel);
                    }
                }

                $boxModel->changeName($this->getTheFirstAvailableName($boxModel->getName(), $arrayOfBoxNames));
                $arrayOfBoxNames[] = $boxModel->getName();
                
                ACPT_Lite_DB::saveMetaBox($boxModel, $ids);
            }

            // remove orphans
            foreach ($ids as $postType => $childrenIds){
               ACPT_Lite_DB::removeMetaOrphans($postType, $childrenIds);
            }

            // remove orphan relationships
            ACPT_Lite_DB::removeOrphanRelationships();

            $return = [
                    'ids' => $ids,
                    'success' => true
            ];
        } catch (\Exception $exception){
            $return = [
                    'success' => false,
                    'error' => $exception->getMessage()
            ];
        }

        return wp_send_json($return);
    }

    /**
     * @param string $name
     * @param array $arrayOfBoxNames
     *
     * @return string
     */
    private function getTheFirstAvailableName($name, array $arrayOfBoxNames = [])
    {
        if(!in_array( $name, $arrayOfBoxNames  )){
            return $name;
        }

        $newName = Strings::getUniqueName($name);

        return $this->getTheFirstAvailableName($newName, $arrayOfBoxNames);
    }

    public function saveSettingsAction()
    {
        $data = $this->sanitizeJsonData($_POST['data']);

        // persist $model on DB
        try {
            foreach ($data as $key => $value){
                $id = (!empty(ACPT_Lite_DB::getSettings($key))) ? ACPT_Lite_DB::getSettings($key)[0]->getId() : Uuid::v4();
                $model = SettingsModel::hydrateFromArray([
                    'id' => $id,
                    'key' => $key,
                    'value' => $value
                ]);
                ACPT_Lite_DB::saveSettings($model);
            }

            $return = [
                    'success' => true
            ];
        } catch (\Exception $exception){
            $return = [
                'success' => false,
                'error' => $exception->getMessage()
            ];
        }

        return wp_send_json($return);
    }

    /**
     * Creates a taxonomy
     */
    public function saveTaxonomyAction()
    {
        $data = $this->sanitizeJsonData($_POST['data']);

        // persist $model on DB
        try {
            $settings = $data[3];

            $settings["rewrite"]["slug"] = (isset($settings["custom_rewrite"]) and null !== $settings["custom_rewrite"]) ? strtolower($settings["custom_rewrite"]) : strtolower($data[1]["slug"]) ;
            $settings['capabilities'] = [];

            if($settings['capabilities_0'] === 'manage_terms') { $settings['capabilities'][] = 'manage_terms'; }
            if($settings['capabilities_1'] === 'edit_terms') { $settings['capabilities'][] = 'edit_terms'; }
            if($settings['capabilities_2'] === 'delete_terms') { $settings['capabilities'][] = 'delete_terms'; }
            if($settings['capabilities_3'] === 'assign_terms') { $settings['capabilities'][] = 'assign_terms'; }

            unset($settings['capabilities_0']);
            unset($settings['capabilities_1']);
            unset($settings['capabilities_2']);
            unset($settings['capabilities_3']);

            $id = (ACPT_Lite_DB::exists($data[1]["slug"])) ? ACPT_Lite_DB::getId($data[1]["slug"]) : Uuid::v4();
            $model = TaxonomyModel::hydrateFromArray([
                'id' => $id,
                'slug' => $data[1]["slug"],
                'singular' => $data[1]["singular_label"],
                'plural' => $data[1]["plural_label"],
                'labels' => $data[2],
                'native' => false,
                'settings' => $settings
            ]);

            ACPT_Lite_DB::saveTaxonomy($model);
            $return = [
                    'success' => true
            ];
        } catch (\Exception $exception){
            $return = [
                    'success' => false,
                    'error' => $exception->getMessage()
            ];
        }

        return wp_send_json($return);
    }

    /**
     * Creates a product data
     */
    public function saveWooCommerceProductDataAction()
    {
        $data = $this->sanitizeJsonData($_POST['data']);
        $id = (isset($data['id']) and ACPT_Lite_DB::existsWooCommerceProductData($data['id'])) ? $data['id'] : Uuid::v4();

        $model = new WooCommerceProductDataModel(
            $id,
            $data['product_data_name'],
            $data['icon'],
            $data['visibility'],
            $data['show_ui']
        );

        try {
            ACPT_Lite_DB::saveWooCommerceProductData($model);

            $return = [
                'success' => true
            ];
        } catch (\Exception $exception){
            $return = [
                'success' => false,
                'error' => $exception->getMessage()
            ];
        }

        return wp_send_json($return);
    }

    /**
     * @return mixed
     */
    public function saveWooCommerceProductDataFieldsAction()
    {
        $data = $this->sanitizeJsonData($_POST['data']);
        $fields = [];
        $ids = [];

        // persist $model on DB
        try {
            foreach ($data as $fieldIndex => $field ) {

                $productData = ACPT_Lite_DB::getWooCommerceProductData([
                    'id' => $field['postDataId']
                ])[0];

                $fieldModel = WooCommerceProductDataFieldModel::hydrateFromArray([
                    'id' => $field['id'],
                    'productDataModel' => $productData,
                    'name' => $field['name'],
                    'type' => $field['type'],
                    'defaultValue' => $field['defaultValue'],
                    'description' => $field['description'],
                    'required' => $field['isRequired'],
                    'sort' => ($fieldIndex+1),
                ]);

                $optionsIds = [];

                if(isset($field['options'])){
                    foreach ($field['options'] as $optionIndex => $option){
                        $optionModel = WooCommerceProductDataFieldOptionModel::hydrateFromArray([
                            'id' => $option['id'],
                            'productDataField' => $fieldModel,
                            'label' => $option['label'],
                            'value' => $option['value'],
                            'sort' => ($optionIndex+1),
                        ]);

                        $fieldModel->addOption($optionModel);
                        $optionsIds[] = $optionModel->getId();
                    }
                }

                $fields[] = $fieldModel;
                $ids[] = [
                    'product_data_id' => $fieldModel->getProductData()->getId(),
                    'field' => $fieldModel->getId(),
                    'options' => $optionsIds
                ];
            }

            ACPT_Lite_DB::saveWooCommerceProductDataFields($fields);

            // remove orphans
            ACPT_Lite_DB::removeWooCommerceProductDataFieldsOrphans($ids);

            $return = [
                'ids' => $ids,
                'success' => true
            ];
        } catch (\Exception $exception) {
            $return = [
                'success' => false,
                'error' => $exception->getMessage()
            ];
        }

        return wp_send_json($return);
    }

    public function syncPostsAction()
    {
        try {
            ACPT_Lite_DB::sync();
            $return = [
                    'success' => true
            ];
        } catch (\Exception $exception){
            $return = [
                    'success' => false,
                    'error' => $exception->getMessage()
            ];
        }

        return wp_send_json($return);
    }

    /**
     * Sluggify a string
     *
     * @return mixed
     * @throws \Exception
     */
    public function sluggifyAction()
    {
        $string = null;
        $maxLength = 20;
        if(isset($_POST['data'])){
            $data = $this->sanitizeJsonData($_POST['data']);
            $string = isset($data['string']) ? $data['string'] : null;
            $maxLength = isset($data['maxLength']) ? $data['maxLength'] : 20;
        }

        if($string){
            return wp_send_json([
                'string' => Sluggify::slug($string, $maxLength)
            ]);
        }

        return wp_send_json([
                'success' => false,
                'error' => 'no string was sent'
        ]);
    }

    /**
     * @param $data
     *
     * @return mixed
     */
    private function sanitizeJsonData($data)
    {
        $jsonDecoded = json_decode(wp_unslash($data), true);

        return Sanitizer::recursiveSanitizeRawData($jsonDecoded);
    }
}