<?php

namespace ACPT_Lite\Admin;

use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Helper\Uuid;
use ACPT_Lite\Core\Models\CustomPostType\CustomPostTypeMetaBoxFieldModel;
use ACPT_Lite\Core\Models\CustomPostType\CustomPostTypeMetaBoxModel;
use ACPT_Lite\Core\Models\CustomPostType\CustomPostTypeModel;
use ACPT_Lite\Core\Models\MetaField\MetaBoxFieldOptionModel;
use ACPT_Lite\Core\Models\Settings\SettingsModel;
use ACPT_Lite\Core\Models\Taxonomy\TaxonomyMetaBoxFieldModel;
use ACPT_Lite\Core\Models\Taxonomy\TaxonomyMetaBoxModel;
use ACPT_Lite\Core\Models\Taxonomy\TaxonomyModel;
use ACPT_Lite\Core\Models\User\UserMetaBoxFieldModel;
use ACPT_Lite\Core\Models\User\UserMetaBoxModel;
use ACPT_Lite\Core\Models\WooCommerce\WooCommerceProductDataFieldModel;
use ACPT_Lite\Core\Models\WooCommerce\WooCommerceProductDataFieldOptionModel;
use ACPT_Lite\Core\Models\WooCommerce\WooCommerceProductDataModel;
use ACPT_Lite\Core\Repository\CustomPostTypeRepository;
use ACPT_Lite\Core\Repository\MetaRepository;
use ACPT_Lite\Core\Repository\SettingsRepository;
use ACPT_Lite\Core\Repository\TaxonomyRepository;
use ACPT_Lite\Core\Repository\WooCommerceProductDataRepository;
use ACPT_Lite\Costants\MetaTypes;
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
	public function assocPostTypeToTaxonomyAction()
	{
		if(isset($_POST['data'])) {
			$data = $this->sanitizeJsonData($_POST['data']);

			try {
				$taxonomyId = TaxonomyRepository::getId($data['taxonomy']);

				foreach ($data['postTypes'] as $customPostType){
					if($customPostType['checked']){
						TaxonomyRepository::assocToPostType($customPostType['id'], $taxonomyId);
					} else {
						TaxonomyRepository::removeAssocPost($customPostType['id'], $taxonomyId);
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

    public function assocTaxonomyToPostTypeAction()
    {
        if(isset($_POST['data'])) {
            $data = $this->sanitizeJsonData($_POST['data']);

            try {
                $postId = CustomPostTypeRepository::getId($data['postType']);

                foreach ($data['taxonomies'] as $taxonomy){
                    if($taxonomy['checked']){
                        TaxonomyRepository::assocToPostType($postId, $taxonomy['id']);
                    } else {
                        TaxonomyRepository::removeAssocPost($postId, $taxonomy['id']);
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
     * Check if a Custom post type exists
     *
     * @return mixed
     */
    public function checkPostTypeNameAction()
    {
        if(isset($_POST['data'])) {
            $data = $this->sanitizeJsonData($_POST['data']);

            if (!isset($data['postType'])) {
                return wp_send_json([
                    'success' => false,
                    'error' => 'Missing postType'
                ]);
            }

            $postType = $data['postType'];

            return wp_send_json([
                'exists' => CustomPostTypeRepository::exists($postType)
            ]);
        }
    }

    public function checkTaxonomySlugAction()
    {
        if(isset($_POST['data'])) {
            $data = $this->sanitizeJsonData($_POST['data']);

            if (!isset($data['slug'])) {
                return wp_send_json([
                    'success' => false,
                    'error' => 'Missing slug'
                ]);
            }

            $slug = $data['slug'];

            return wp_send_json([
                'exists' => TaxonomyRepository::exists($slug)
            ]);
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
	            // Delete posts option
	            $deletePosts = false;
	            $deletePostsOption = SettingsRepository::getSingle('delete_posts');

	            if($deletePostsOption !== null and $deletePostsOption->getValue() == 1){
		            $deletePosts = true;
	            }

                CustomPostTypeRepository::delete($postType, $deletePosts);
	            unregister_post_type($postType);

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
     * Delete all meta
     *
     * @return mixed
     */
    public function deleteMetaAction()
    {
	    if(isset($_POST['data'])){
		    $data = $this->sanitizeJsonData($_POST['data']);

		    $find = isset($data['find']) ? $data['find'] : $data['postType'];
		    $belongsTo = isset($data['belongsTo']) ? $data['belongsTo'] : MetaTypes::CUSTOM_POST_TYPE;

		    try {
			    MetaRepository::deleteAll([
				    'belongsTo' => $belongsTo,
				    'find' => $find,
			    ]);

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
			    TaxonomyRepository::delete($taxonomy);
			    unregister_taxonomy($taxonomy);

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
                WooCommerceProductDataRepository::delete($id);

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
                WooCommerceProductDataRepository::deleteFields($id);

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

    /**
     * @return mixed
     */
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

    public function fetchPreviewLinkAction()
    {
	    $data = $this->sanitizeJsonData($_POST['data']);

	    if(!isset($data['id']) and !isset($data['belongsTo']) and !isset($data['find']) and !isset($data['template']) ){
		    return wp_send_json([
			    'success' => false,
			    'error' => 'Missing params (`id`, `belongsTo`, `find`, `template`)'
		    ]);
	    }

	    $id = $data['id'];
	    $find = $data['find'];
	    $belongsTo = $data['belongsTo'];

	    if($belongsTo === MetaTypes::CUSTOM_POST_TYPE){
		    if($find === 'post'){
			    $category = get_the_category($id);
			    $archiveLink = get_category_link($category);
		    } else {
			    $archiveLink = get_post_type_archive_link($find);
		    }

		    return wp_send_json([
			    'success' => true,
			    'data' => [
				    'single_link' => get_the_permalink($id),
				    'archive_link' => $archiveLink
			    ]
		    ]);
	    }

	    if($belongsTo === MetaTypes::TAXONOMY){
		    return wp_send_json([
			    'success' => true,
			    'data' => [
				    'single_link' => get_term_link($id),
			    ]
		    ]);
	    }

	    return wp_send_json([
		    'success' => false,
	    ]);
    }

	/**
	 * Fetch custom post type meta
	 *
	 * @return mixed
	 * @throws \Exception
	 */
	public function fetchMetaAction()
	{
		$data = $this->sanitizeJsonData($_POST['data']);

		$belongsTo = isset($data['belongsTo']) ? $data['belongsTo'] : MetaTypes::CUSTOM_POST_TYPE;
		$find = isset($data['find']) ? $data['find'] : null;

		// OLD format, keep compatibility
		if($find === null){
			$find = $data['postType'];
		}

		if($belongsTo !== MetaTypes::USER and $find === null){
			return wp_send_json([
				'success' => false,
				'error' => 'No data sent'
			]);
		}

		$options = [];

		if(isset($data['excludeField'])){
			$options['excludeFields'][] = $data['excludeField'];
		}

		return wp_send_json(MetaRepository::get(array_merge([
			'belongsTo' => $belongsTo,
			'find' => $find,
		], $options)));
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
            return wp_send_json(CustomPostTypeRepository::get([
                'postType' => $postType
            ]));
        }

        return wp_send_json(CustomPostTypeRepository::get([
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
        return wp_send_json(CustomPostTypeRepository::count());
    }

    /**
     * @return mixed
     * @throws \Exception
     */
    public function fetchSettingsAction()
    {
        return wp_send_json(SettingsRepository::get());
    }

    /**
     * @return mixed
     * @throws \Exception
     */
    public function fetchWooCommerceProductDataAction()
    {
        if(isset($_POST['data'])){
            $data = $this->sanitizeJsonData($_POST['data']);

            return wp_send_json(WooCommerceProductDataRepository::get($data));
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
                $return = WooCommerceProductDataRepository::getFields($id);
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
            return wp_send_json(TaxonomyRepository::get([
                    'taxonomy' => $taxonomy
            ]));
        }

        return wp_send_json(TaxonomyRepository::get([
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
     * @return mixed
     */
    public function fetchTaxonomiesCountAction()
    {
        return wp_send_json(TaxonomyRepository::count());
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
            $id = (CustomPostTypeRepository::exists($data[1]["post_name"])) ? CustomPostTypeRepository::getId($data[1]["post_name"]) : Uuid::v4();
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

            CustomPostTypeRepository::save($model);
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
	 * Saves meta
	 */
	public function saveMetaAction()
	{
		$data = $this->sanitizeJsonData($_POST['data']);
		$ids = [];
		$arrayOfBoxNames = [];

		$belongsTo  = isset($data[0]) ? $data[0]['belongsTo'] : null;
		$find  = isset($data[0]) ? $data[0]['find'] : null;

		// OLD format, keep compatibility
		if($find === null){
			$find  = isset($data[0]) ? $data[0]['postType'] : null;
		}

		if($belongsTo !== MetaTypes::USER and $find === null){
			return wp_send_json([
				'success' => false,
				'error' => 'No data sent'
			]);
		}

		$ids[$find] = [
			'boxes' => [],
			'fields' => [],
			'options' => [],
		];

		// persist $model on DB
		try {
			foreach ($data as $boxIndex => $box ) {

				$boxModel = null;

				switch ($belongsTo){
					case null:
					case MetaTypes::CUSTOM_POST_TYPE:
						$boxModel = CustomPostTypeMetaBoxModel::hydrateFromArray([
							'id' => $box['id'],
							'postType' => $find,
							'name' =>  $box['title'],
							'sort' =>  ($boxIndex+1)
						]);
						break;

					case MetaTypes::TAXONOMY:
						$boxModel = TaxonomyMetaBoxModel::hydrateFromArray([
							'id' => $box['id'],
							'taxonomy' => $find,
							'name' =>  $box['title'],
							'sort' =>  ($boxIndex+1)
						]);
						break;

					case MetaTypes::USER:
						$boxModel = UserMetaBoxModel::hydrateFromArray([
							'id' => $box['id'],
							'name' =>  $box['title'],
							'sort' =>  ($boxIndex+1)
						]);
						break;
				}

				if($boxModel === null){
					return wp_send_json([
						'success' => false,
						'error' => 'Cannot create $boxModel object'
					]);
				}

				$ids[$find]['boxes'][] = $box['id'];

				if(isset($box['fields'])){
					$arrayOfFieldNames = [];

					foreach ($box['fields'] as $fieldIndex => $field) {

						$fieldModel = null;

						switch ($belongsTo) {
							case null:
							case MetaTypes::CUSTOM_POST_TYPE:
								$fieldModel = CustomPostTypeMetaBoxFieldModel::hydrateFromArray([
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
								break;

							case MetaTypes::TAXONOMY:
								$fieldModel = TaxonomyMetaBoxFieldModel::hydrateFromArray([
									'id' => $field['id'],
									'name' => $field['name'],
									'type' => $field['type'],
									'defaultValue' => isset($field['defaultValue']) ? $field['defaultValue'] : null,
									'description' => isset($field['description']) ? $field['description'] : null,
									'required' => isset($field['isRequired']) ? $field['isRequired'] : false,
									'metaBox' => $boxModel,
									'sort' =>  ($fieldIndex+1)
								]);
								break;

							case MetaTypes::USER:
								$fieldModel = UserMetaBoxFieldModel::hydrateFromArray([
									'id' => $field['id'],
									'name' => $field['name'],
									'type' => $field['type'],
									'defaultValue' => isset($field['defaultValue']) ? $field['defaultValue'] : null,
									'description' => isset($field['description']) ? $field['description'] : null,
									'showInArchive' => isset($field['showInArchive']) ? $field['showInArchive'] : false,
									'required' => isset($field['isRequired']) ? $field['isRequired'] : false,
									'metaBox' => $boxModel,
									'sort' =>  ($fieldIndex+1)
								]);
								break;
						}

						if($fieldModel === null){
							return wp_send_json([
								'success' => false,
								'error' => 'Cannot create $fieldModel object'
							]);
						}

						$ids[$find]['fields'][] = $field['id'];

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

								$ids[$find]['options'][] = $option['id'];

								$fieldModel->addOption($optionModel);
							}
						}

						$boxModel->addField($fieldModel);
					}
				}

				$boxModel->changeName($this->getTheFirstAvailableName($boxModel->getName(), $arrayOfBoxNames));
				$arrayOfBoxNames[] = $boxModel->getName();

				MetaRepository::saveMetaBox($boxModel);
			}

			// remove orphans
			foreach ($ids as $find => $childrenIds){
				MetaRepository::removeMetaOrphans([
					'belongsTo' => $belongsTo,
					'find' => $find,
					'ids' => $childrenIds,
				]);
			}

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
                $id = (!empty(SettingsRepository::get($key))) ? SettingsRepository::get($key)[0]->getId() : Uuid::v4();
                $model = SettingsModel::hydrateFromArray([
                    'id' => $id,
                    'key' => $key,
                    'value' => $value
                ]);
                SettingsRepository::save($model);
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

		    if($settings["rewrite"] === true){
			    $settings["rewrite"] = [];
			    $settings["rewrite"]["slug"] = (isset($settings["custom_rewrite"]) and null !== $settings["custom_rewrite"]) ? strtolower($settings["custom_rewrite"]) : strtolower($data[1]["slug"]) ;
		    }

		    $settings['capabilities'] = [];

		    if($settings['capabilities_0'] === 'manage_terms') { $settings['capabilities'][] = 'manage_terms'; }
		    if($settings['capabilities_1'] === 'edit_terms') { $settings['capabilities'][] = 'edit_terms'; }
		    if($settings['capabilities_2'] === 'delete_terms') { $settings['capabilities'][] = 'delete_terms'; }
		    if($settings['capabilities_3'] === 'assign_terms') { $settings['capabilities'][] = 'assign_terms'; }

		    unset($settings['capabilities_0']);
		    unset($settings['capabilities_1']);
		    unset($settings['capabilities_2']);
		    unset($settings['capabilities_3']);

		    $id = (TaxonomyRepository::exists($data[1]["slug"])) ? TaxonomyRepository::getId($data[1]["slug"]) : Uuid::v4();
		    $model = TaxonomyModel::hydrateFromArray([
			    'id' => $id,
			    'slug' => $data[1]["slug"],
			    'singular' => $data[1]["singular_label"],
			    'plural' => $data[1]["plural_label"],
			    'labels' => $data[2],
			    'native' => false,
			    'settings' => $settings
		    ]);

		    TaxonomyRepository::save($model);
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
        $id = (isset($data['id']) and WooCommerceProductDataRepository::exists($data['id'])) ? $data['id'] : Uuid::v4();

        $model = new WooCommerceProductDataModel(
            $id,
            $data['product_data_name'],
            $data['icon'],
            $data['visibility'],
            $data['show_ui']
        );

        try {
            WooCommerceProductDataRepository::save($model);

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

                $productData = WooCommerceProductDataRepository::get([
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

            WooCommerceProductDataRepository::saveFields($fields);

            // remove orphans
            WooCommerceProductDataRepository::removeFieldsOrphans($ids);

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

    /**
     * @return mixed
     */
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