<?php

namespace ACPT_Lite\Admin;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\CQRS\Command\AssocTaxonomyToCustomPostTypeCommand;
use ACPT_Lite\Core\CQRS\Command\CopyMetaBoxCommand;
use ACPT_Lite\Core\CQRS\Command\CopyMetaFieldCommand;
use ACPT_Lite\Core\CQRS\Command\DeleteCustomPostTypeCommand;
use ACPT_Lite\Core\CQRS\Command\DeleteMetaGroupCommand;
use ACPT_Lite\Core\CQRS\Command\DeleteTaxonomyCommand;
use ACPT_Lite\Core\CQRS\Command\DeleteWooCommerceProductDataCommand;
use ACPT_Lite\Core\CQRS\Command\SaveCustomPostTypeCommand;
use ACPT_Lite\Core\CQRS\Command\SaveMetaGroupCommand;
use ACPT_Lite\Core\CQRS\Command\SaveTaxonomyCommand;
use ACPT_Lite\Core\CQRS\Command\SaveWooCommerceProductDataCommand;
use ACPT_Lite\Core\CQRS\Command\SaveWooCommerceProductDataFieldsCommand;
use ACPT_Lite\Core\CQRS\Query\CalculateShortCodeQuery;
use ACPT_Lite\Core\CQRS\Query\FetchAllFindBelongsQuery;
use ACPT_Lite\Core\CQRS\Query\FetchElementsQuery;
use ACPT_Lite\Core\CQRS\Query\FetchFindQuery;
use ACPT_Lite\Core\CQRS\Query\FetchLanguagesQuery;
use ACPT_Lite\Core\CQRS\Query\FetchMetaFieldsFromBelongsQuery;
use ACPT_Lite\Core\CQRS\Query\FetchPreviewLinkQuery;
use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Helper\Uuid;
use ACPT_Lite\Core\Models\Settings\SettingsModel;
use ACPT_Lite\Core\Repository\CustomPostTypeRepository;
use ACPT_Lite\Core\Repository\MetaRepository;
use ACPT_Lite\Core\Repository\SettingsRepository;
use ACPT_Lite\Core\Repository\TaxonomyRepository;
use ACPT_Lite\Core\Repository\WooCommerceProductDataRepository;
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
	/**
	 * @throws \Exception
	 */
	public function globalSettingsAction()
	{
		try {
			$language = SettingsRepository::getSingle('language') ? SettingsRepository::getSingle('language')->getValue() : 'en_US';
		} catch (\Exception $exception){
			$language = 'en_US';
		}

		$languageQuery = new FetchLanguagesQuery();
		$languageEntries = $languageQuery->execute();

		$findQuery = new FetchAllFindBelongsQuery();
		$findEntries = $findQuery->execute();

		$globals = [
			"plugin_version" => ACPT_LITE_PLUGIN_VERSION,
			"site_url" =>  site_url(),
			"admin_url" => admin_url(),
			"ajax_url" => admin_url( 'admin-ajax.php' ),
			"rest_route_url" => "/?rest_route=/acpt/v1",
			"http_referer" => (isset($_SERVER['HTTP_REFERER'])) ? $_SERVER['HTTP_REFERER'] : '',
			"language" => $language,
			"locale" => get_locale(),
			"is_rtl" => is_rtl(),
			'find' => $findEntries,
			"available_languages" => $languageEntries['languages'],
			"translations" =>  $languageEntries['translations'],
		];

		$settings = SettingsRepository::get();

		return wp_send_json([
			'globals' => $globals,
			'settings' => $settings,
		]);
	}

	public function assocPostTypeToTaxonomyAction()
	{
		if(isset($_POST['data'])) {
			$data = $this->sanitizeJsonData($_POST['data']);

			try {
				$taxonomyId = TaxonomyRepository::getId($data['taxonomy']);

				foreach ($data['postTypes'] as $customPostType){
					$command = new AssocTaxonomyToCustomPostTypeCommand($customPostType['id'], $taxonomyId, $customPostType['checked']);
					$command->execute();
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
			        $command = new AssocTaxonomyToCustomPostTypeCommand($postId, $taxonomy['id'], $taxonomy['checked']);
			        $command->execute();
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
	 * Execute bulk actions
	 */
	public function bulkActionsAction()
	{
		if(isset($_POST['data'])) {
			$data = $this->sanitizeJsonData($_POST['data']);

			if (!isset($data['action'])) {
				return wp_send_json([
					'success' => false,
					'error' => 'Missing action'
				]);
			}

			if (!isset($data['belongsTo'])) {
				return wp_send_json([
					'success' => false,
					'error' => 'Missing belongsTo'
				]);
			}

			if (!isset($data['elements'])) {
				return wp_send_json([
					'success' => false,
					'error' => 'Missing elements'
				]);
			}

			$action = $data['action'];
			$elements = $data['elements'];
			$belongsTo = $data['belongsTo'];

			try {
				switch ($action){
					case "delete":
						foreach ($elements as $element => $toDelete){
							if($toDelete){
								switch ($belongsTo){
									default:
									case MetaTypes::CUSTOM_POST_TYPE:
										$command = new DeleteCustomPostTypeCommand($element);
										break;

									case MetaTypes::TAXONOMY:
										$command = new DeleteTaxonomyCommand($element);
										break;

									case MetaTypes::META:
										$command = new DeleteMetaGroupCommand($element);
										break;

									case "woo_product_data":
										$command = new DeleteWooCommerceProductDataCommand($element);
										break;
								}

								$command->execute();
							}
						}
				}

				return wp_send_json([
					'success' => true,
				]);

			} catch ( \Exception $e ) {
				return wp_send_json([
					'success' => false,
					'error' => $e->getMessage()
				]);
			}
		}
	}

	/**
	 * Calculate meta field shortcode
	 */
	public function calculateShortCodeAction()
	{
		if(isset($_POST['data'])) {
			$data = $this->sanitizeJsonData($_POST['data']);
			try {
				$query = new CalculateShortCodeQuery( $data );

				return wp_send_json($query->execute());
			} catch ( \Exception $e ) {
				return wp_send_json([
					"metaKey" => null,
					"shortcodes" => []
				]);
			}
		}
	}

	/**
	 * @throws \Exception
	 */
	public function checkMetaBoxNameAction()
	{
		$data = $this->sanitizeJsonData($_POST['data']);

		if (!isset($data['boxName'])) {
			return wp_send_json([
				'success' => false,
				'error' => 'Missing boxName'
			]);
		}

		$boxName = $data['boxName'];

		return wp_send_json([
			'exists' => MetaRepository::existsMetaBox([
				'boxName' => $boxName
			])
		]);
	}

	/**
	 * @throws \Exception
	 */
	public function checkMetaBoxFieldNameAction()
	{
		$data = $this->sanitizeJsonData($_POST['data']);

		if (!isset($data['boxName'])) {
			return wp_send_json([
				'success' => false,
				'error' => 'Missing boxName'
			]);
		}

		if (!isset($data['fieldName'])) {
			return wp_send_json([
				'success' => false,
				'error' => 'Missing fieldName'
			]);
		}

		$boxName = $data['boxName'];
		$fieldName = $data['fieldName'];

		return wp_send_json([
			'exists' => MetaRepository::existsMetaBoxField([
				'boxName' => $boxName,
				'fieldName' => $fieldName,
			])
		]);
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

	public function copyMetaBoxAction()
	{
		if(isset($_POST['data'])) {
			$data = $this->sanitizeJsonData($_POST['data']);

			try {
				$command = new CopyMetaBoxCommand($data);
				$command->execute();

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

	public function copyMetaBoxesAction()
	{
		if(isset($_POST['data'])) {
			$data = $this->sanitizeJsonData($_POST['data']);

			if(!isset($data['boxIds'])){
				return wp_send_json([
					'success' => false,
					'error' => 'Missing boxIds'
				]);
			}

			try {
				foreach ($data['boxIds'] as $boxId){
					$command = new CopyMetaBoxCommand([
						'boxId' => $boxId,
						'targetGroupId' => $data['targetGroupId'],
						'delete' => $data['delete'],
					]);
					$command->execute();
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

	public function copyMetaFieldAction()
	{
		if(isset($_POST['data'])) {
			$data = $this->sanitizeJsonData($_POST['data']);

			try {
				$command = new CopyMetaFieldCommand($data);
				$command->execute();

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

	public function copyMetaFieldsAction()
	{
		if(isset($_POST['data'])) {
			$data = $this->sanitizeJsonData($_POST['data']);

			if(!isset($data['fieldIds'])){
				return wp_send_json([
					'success' => false,
					'error' => 'Missing fieldIds'
				]);
			}

			try {
				foreach ($data['fieldIds'] as $fieldId){
					$command = new CopyMetaFieldCommand([
						'fieldId' => $fieldId,
						'targetEntityId' => $data['targetEntityId'],
						'targetEntityType' => $data['targetEntityType'],
						'delete' => $data['delete'],
					]);
					$command->execute();

					$return = [
						'success' => true,
					];
				}
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
			    $command = new DeleteCustomPostTypeCommand($postType);
			    $command->execute();

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

		    if(!isset($data['id'])){
			    return wp_send_json([
				    'success' => false,
				    'error' => 'Missing group `id`'
			    ]);
		    }

		    $id = $data['id'];

		    try {
			    $command = new DeleteMetaGroupCommand($id);
			    $command->execute();

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
			    $command = new DeleteTaxonomyCommand($taxonomy);
			    $command->execute();

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
			    $command = new DeleteWooCommerceProductDataCommand($id);
			    $command->execute();

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

	/**
	 * @throws \Exception
	 */
	public function fetchMetaFieldsFromBelongsToAction()
	{
		$data = $this->sanitizeJsonData($_POST['data']);

		if(!isset($data['belongsTo']) and !isset($data['find'])){
			return wp_send_json([
				'success' => false,
				'error' => 'Missing params (`belongsTo`)'
			]);
		}

		$belongsTo = $data['belongsTo'];
		$find = $data['find'];

		$query = new FetchMetaFieldsFromBelongsQuery($belongsTo, $find);

		return wp_send_json($query->execute());
	}

	/**
	 * @throws \Exception
	 */
	public function fetchAllFindBelongsAction()
	{
		$query = new FetchAllFindBelongsQuery();

		return wp_send_json($query->execute());
	}

	/**
	 * @throws \Exception
	 */
	public function fetchFindAction()
	{
		$data = $this->sanitizeJsonData($_POST['data']);

		if(!isset($data['belongsTo']) and !isset($data['id'])){
			return wp_send_json([
				'success' => false,
				'error' => 'Missing params (`id, belongsTo`)'
			]);
		}

		$id = $data['id'];
		$belongsTo = $data['belongsTo'];

		$command = new FetchFindQuery($id, $belongsTo);

		return wp_send_json($command->execute());
	}

	/**
	 * @throws \Exception
	 */
	public function fetchFindFromBelongsToAction()
	{
		$data = $this->sanitizeJsonData($_POST['data']);

		if(!isset($data['belongsTo'])){
			return wp_send_json([
				'success' => false,
				'error' => 'Missing params (`belongsTo`)'
			]);
		}

		$belongsTo = $data['belongsTo'];
		$format = $data['format'] ? $data['format'] : 'default';

		$command = new FetchMetaFieldsFromBelongsQuery($belongsTo, $format);

		return wp_send_json($command->execute());
	}

	public function fetchPreviewLinkAction()
	{
		$data = $this->sanitizeJsonData($_POST['data']);

		try {
			$query = new FetchPreviewLinkQuery($data);

			return wp_send_json([
				'success' => true,
				'link' => $query->execute(),
			]);

		} catch (\Exception $exception){
			return wp_send_json([
				'success' => false,
				'error' => $exception->getMessage(),
			]);
		}
	}

	public function fetchMetaFieldsFlatMapAction()
	{
		$data = $this->sanitizeJsonData($_POST['data']);

		if(!isset($data['excludeField'])){
			return wp_send_json([
				'success' => false,
				'error' => 'Missing `excludeField`'
			]);
		}

		return wp_send_json(MetaRepository::metaFieldsFlatArray($data['excludeField']));
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

		if(empty($data)){
			$data = [];
		}

		if(isset($data['id'])){

			$record = MetaRepository::get([
				'id' => $data['id'],
				'excludeField' => ((isset($data['excludeField'])) ? $data['excludeField'] : null),
				'gutenberg' => ((isset($data['gutenberg'])) ? $data['gutenberg'] : false),
			]);

			if(!empty($record)){
				return wp_send_json($record[0]);
			}

			return wp_send_json([]);
		}

		return wp_send_json([
			'count' => MetaRepository::count(),
			'records' => MetaRepository::get($data),
		]);
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
	 * fetch CPTs or Taxonomies
	 * (used by copy meta box/field UI)
	 *
	 * @return mixed
	 * @throws \Exception
	 */
	public function fetchElementsAction()
	{
		if(isset($_POST['data'])){
			$data = $this->sanitizeJsonData($_POST['data']);

			if(!isset($data['belongsTo'])){
				return wp_send_json([
					'success' => false,
					'error' => 'Missing belongsTo'
				]);
			}

			$belongsTo = $data['belongsTo'];
			$exclude = (isset($data['exclude'])) ? $data['exclude'] : null;

			$query = new FetchElementsQuery($belongsTo, $exclude);

			return wp_send_json($query->execute());
		}

		return wp_send_json([
			'success' => false,
			'error' => 'no params were sent'
		]);
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
	 * Return the string translations
	 * @throws \Exception
	 */
	public function languagesAction()
	{
		$query = new FetchLanguagesQuery();

		return wp_send_json($query->execute());
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

		    $data = [
			    'id' => $id,
			    'name' => $data[1]["post_name"],
			    'singular_label' => $data[1]["singular_label"],
			    'plural_label' => $data[1]["plural_label"],
			    'icon' => (isset($data[1]["icon"]['value'])) ? $data[1]["icon"]['value']: $data[1]["icon"],
			    'supports' => $supports,
			    'labels' => $data[2],
			    'settings' => $data[3]
		    ];

		    $command = new SaveCustomPostTypeCommand($data);

		    $return = [
			    'id' => $command->execute(),
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
	 * Saves meta
	 */
	public function saveMetaAction()
	{
		$data = $this->sanitizeJsonData($_POST['data']);

		if(
			!isset($data['id']) or
			!isset($data['name'])
		){
			return wp_send_json([
				'success' => false,
				'error' => 'No data sent'
			]);
		}

		try {
			$command = new SaveMetaGroupCommand($data);

			$return = [
				'id' => $command->execute(),
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
		    $data = [
			    'id' => $id,
			    'slug' => $data[1]["slug"],
			    'singular_label' => $data[1]["singular_label"],
			    'plural_label' => $data[1]["plural_label"],
			    'labels' => $data[2],
			    'settings' => $settings
		    ];

		    $command = new SaveTaxonomyCommand($data);
		    $command->execute();

		    $return = [
			    'id' => $id,
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
     * Creates a product data
     */
    public function saveWooCommerceProductDataAction()
    {
	    $data = $this->sanitizeJsonData($_POST['data']);

	    try {
		    $command = new SaveWooCommerceProductDataCommand($data);
		    $command->execute();

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
	    try {
		    $data = $this->sanitizeJsonData($_POST['data']);
		    $command = new SaveWooCommerceProductDataFieldsCommand($data);
		    $return = [
			    'ids' => $command->execute(),
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