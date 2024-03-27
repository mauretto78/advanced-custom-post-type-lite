<?php

namespace ACPT_Lite\Admin;

use ACPT_Lite\Constants\BelongsTo;
use ACPT_Lite\Constants\Operator;
use ACPT_Lite\Core\Generators\CustomPostType\CustomPostTypeGenerator;
use ACPT_Lite\Core\Generators\CustomPostType\CustomPostTypeMetaBoxGenerator;
use ACPT_Lite\Core\Generators\CustomPostType\CustomPostTypeMetaGroupGenerator;
use ACPT_Lite\Core\Generators\Meta\WooCommerceProductDataGenerator;
use ACPT_Lite\Core\Generators\Taxonomy\TaxonomyMetaBoxGenerator;
use ACPT_Lite\Core\Generators\User\UserMetaBoxGenerator;
use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Core\Models\Meta\MetaGroupModel;
use ACPT_Lite\Core\Repository\CustomPostTypeRepository;
use ACPT_Lite\Core\Repository\MetaRepository;
use ACPT_Lite\Core\Repository\TaxonomyRepository;
use ACPT_Lite\Core\Repository\WooCommerceProductDataRepository;
use ACPT_Lite\Core\Shortcodes\PostMetaShortcode;
use ACPT_Lite\Core\Shortcodes\TaxonomyMetaShortcode;
use ACPT_Lite\Core\Shortcodes\UserMetaShortcode;
use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Includes\ACPT_Lite_Loader;
use ACPT_Lite\Integrations\AbstractIntegration;
use ACPT_Lite\Integrations\Elementor\ACPT_Lite_Elementor;
use ACPT_Lite\Integrations\Gutenberg\ACPT_Lite_Gutenberg;
use ACPT_Lite\Utils\Nonce;
use ACPT_Lite\Utils\Translator;

/**
 * The admin-specific functionality of the plugin.
 *
 * @since      1.0.0
 * @package    advanced-custom-post-type-lite
 * @subpackage advanced-custom-post-type/admin
 * @author     Mauro Cassani <maurocassani1978@gmail.com>
 */
class ACPT_Lite_Admin
{
    /**
     * @var ACPT_Lite_Loader
     */
    private $loader;

    /**
     * @var ACPT_Lite_Ajax
     */
    private $ajax;

    /**
     * @var array
     */
    private $pages = [];

    /**
     * @var array
     */
    private $ajaxActions = [];

    /**
     * @var array
     */
    private $staticCssAssets = [];

    /**
     * @var array
     */
    private $staticJsAssets = [];

    /**
     * Admin constructor.
     *
     * @param ACPT_Lite_Loader $loader
     * @param ACPT_Lite_Ajax   $ajax
     */
    public function __construct( ACPT_Lite_Loader $loader, ACPT_Lite_Ajax $ajax)
    {
        $this->ajax = $ajax;
        $this->loader = $loader;
        $this->setStaticCssAssets();
        $this->setStaticJsAssets();
        $this->setAjaxActions();
        $this->setPages();
    }

    /**
     * Define static CSS assets
     */
    private function setStaticCssAssets()
    {
        $this->staticCssAssets = [
	        'admin_selectize_css' => plugin_dir_url( dirname( __FILE__ ) ) . '../assets/static/css/selectize/selectize.default.min.css',
            'admin_css' => plugin_dir_url( dirname( __FILE__ ) ) . '../assets/static/css/admin.css',
            'block_css' => plugin_dir_url( dirname( __FILE__ ) ) . '../assets/build/block.min.css',
        ];
    }

    /**
     * Define static JS assets
     */
    private function setStaticJsAssets()
    {
        $this->staticJsAssets = [
	        'admin_selectize_js' => [
		        'path' => plugin_dir_url( dirname( __FILE__ ) ) . '../assets/static/js/selectize/selectize.min.js',
		        'dep'  => ['jquery'],
	        ],
            'admin_google_maps_js' => [
                'path' => plugin_dir_url( dirname( __FILE__ ) ) . '../assets/static/js/google-maps.js',
                'dep'  => ['jquery'],
            ],
            'admin_js' => [
                'path' => plugin_dir_url( dirname( __FILE__ ) ) . '../assets/static/js/admin.js',
                'dep'  => ['jquery'],
            ],
            'block_js' => [
                'path' => plugin_dir_url( dirname( __FILE__ ) ) . '../assets/build/block.min.js',
                'dep'  => ['wp-blocks', 'wp-element'],
            ],
        ];
    }

    /**
     * Define ajax actions
     */
    private function setAjaxActions()
    {
        $this->ajaxActions = [
            'wp_ajax_assocPostTypeToTaxonomyAction' => 'assocPostTypeToTaxonomyAction',
            'wp_ajax_assocTaxonomyToPostTypeAction' => 'assocTaxonomyToPostTypeAction',
            'wp_ajax_bulkActionsAction' => 'bulkActionsAction',
            'wp_ajax_calculateShortCodeAction' => 'calculateShortCodeAction',
            'wp_ajax_checkMetaBoxNameAction' => 'checkMetaBoxNameAction',
            'wp_ajax_checkMetaBoxFieldNameAction' => 'checkMetaBoxFieldNameAction',
            'wp_ajax_checkPostTypeNameAction' => 'checkPostTypeNameAction',
            'wp_ajax_checkTaxonomySlugAction' => 'checkTaxonomySlugAction',
            'wp_ajax_deleteCustomPostTypeAction' => 'deleteCustomPostTypeAction',
            'wp_ajax_deleteMetaAction' => 'deleteMetaAction',
            'wp_ajax_deleteTaxonomyAction' => 'deleteTaxonomyAction',
            'wp_ajax_deleteWooCommerceProductDataAction' => 'deleteWooCommerceProductDataAction',
            'wp_ajax_deleteWooCommerceProductDataFieldsAction' => 'deleteWooCommerceProductDataFieldsAction',
            'wp_ajax_doShortcodeAction' => 'doShortcodeAction',
            'wp_ajax_exportFileAction' => 'exportFileAction',
            'wp_ajax_fetchAllFindBelongsAction' => 'fetchAllFindBelongsAction',
            'wp_ajax_fetchFindFromBelongsToAction' => 'fetchFindFromBelongsToAction',
            'wp_ajax_fetchFindAction' => 'fetchFindAction',
            'wp_ajax_fetchMetaAction' => 'fetchMetaAction',
            'wp_ajax_fetchMetaFieldsFlatMapAction' => 'fetchMetaFieldsFlatMapAction',
            'wp_ajax_fetchCustomPostTypesAction' => 'fetchCustomPostTypesAction',
            'wp_ajax_fetchCustomPostTypesCountAction' => 'fetchCustomPostTypesCountAction',
            'wp_ajax_fetchMetaFieldRelationshipAction' => 'fetchMetaFieldRelationshipAction',
            'wp_ajax_fetchHeadersAndFootersAction' => 'fetchHeadersAndFootersAction',
            'wp_ajax_fetchPostDataAction' => 'fetchPostDataAction',
            'wp_ajax_fetchPreviewLinkAction' => 'fetchPreviewLinkAction',
            'wp_ajax_fetchSettingsAction' => 'fetchSettingsAction',
            'wp_ajax_fetchSidebarsAction' => 'fetchSidebarsAction',
            'wp_ajax_fetchTaxonomiesAction' => 'fetchTaxonomiesAction',
            'wp_ajax_fetchTaxonomiesCountAction' => 'fetchTaxonomiesCountAction',
            'wp_ajax_fetchMetaFieldsFromBelongsToAction' => 'fetchMetaFieldsFromBelongsToAction',
            'wp_ajax_fetchWooCommerceProductDataAction' => 'fetchWooCommerceProductDataAction',
            'wp_ajax_fetchWooCommerceProductDataFieldsAction' => 'fetchWooCommerceProductDataFieldsAction',
            'wp_ajax_fetchElementsAction' => 'fetchElementsAction',
            'wp_ajax_flushCacheAction' => 'flushCacheAction',
            'wp_ajax_globalSettingsAction' => 'globalSettingsAction',
            'wp_ajax_importFileAction' => 'importFileAction',
            'wp_ajax_languagesAction' => 'languagesAction',
            'wp_ajax_resetCustomPostTypesAction' => 'resetCustomPostTypesAction',
            'wp_ajax_resetTaxonomiesAction' => 'resetTaxonomiesAction',
            'wp_ajax_resetWooCommerceProductDataAction' => 'resetWooCommerceProductDataAction',
            'wp_ajax_saveCustomPostTypeAction' => 'saveCustomPostTypeAction',
            'wp_ajax_saveMetaAction' => 'saveMetaAction',
            'wp_ajax_saveSettingsAction' => 'saveSettingsAction',
            'wp_ajax_saveTaxonomyAction' => 'saveTaxonomyAction',
            'wp_ajax_saveWooCommerceProductDataAction' => 'saveWooCommerceProductDataAction',
            'wp_ajax_saveWooCommerceProductDataFieldsAction' => 'saveWooCommerceProductDataFieldsAction',
            'wp_ajax_saveUserMetaAction' => 'saveUserMetaAction',
            'wp_ajax_syncPostsAction' => 'syncPostsAction',
            'wp_ajax_sluggifyAction' => 'sluggifyAction',
            'wp_ajax_isWPGraphQLActiveAction' => 'isWPGraphQLActiveAction',
        ];
    }

    /**
     * Define admin pages
     */
    private function setPages()
    {
        $this->pages = [
            [
                'pageTitle' => 'Advanced Custom Post Types',
                'menuTitle' => 'ACPT Lite',
                'capability' => 'read',
                'menuSlug' => ACPT_LITE_PLUGIN_NAME,
                'template' => 'app',
                'iconUrl' => plugin_dir_url( dirname( __FILE__ ) ) . '../assets/static/img/advanced-custom-post-type-icon.svg',
                'position' => 50,
                'assets' => [
                    'css' => [
                            plugin_dir_url( dirname( __FILE__ ) ) . '../assets/build/app.min.css'
                    ],
                    'react' => [
                            plugin_dir_url( dirname( __FILE__ ) ) . '../assets/build/app.min.js'
                    ],
                ],
            ],
	        [
		        'parentSlug' => ACPT_LITE_PLUGIN_NAME,
		        'pageTitle' => translate('Custom Post Types', ACPT_LITE_PLUGIN_NAME),
		        'menuTitle' => translate('Custom Post Types', ACPT_LITE_PLUGIN_NAME),
		        'capability' => 'manage_options',
		        'menuSlug' => ACPT_LITE_PLUGIN_NAME,
		        'template' => 'app',
		        'position' => 52,
		        'assets' => [
			        'css' => [
				        plugin_dir_url( dirname( __FILE__ ) ) . '../assets/build/app.min.css'
			        ],
			        'react' => [
				        plugin_dir_url( dirname( __FILE__ ) ) . '../assets/build/app.min.js'
			        ],
		        ],
	        ],
            [
                    'parentSlug' => ACPT_LITE_PLUGIN_NAME,
                    'pageTitle' => translate('Taxonomies', ACPT_LITE_PLUGIN_NAME),
                    'menuTitle' => translate('Taxonomies', ACPT_LITE_PLUGIN_NAME),
                    'capability' => 'manage_options',
                    'menuSlug' => ACPT_LITE_PLUGIN_NAME . '#/taxonomies',
                    'template' => 'app',
                    'position' => 52,
                    'assets' => [
                            'css' => [
                                    plugin_dir_url( dirname( __FILE__ ) ) . '../assets/build/app.css'
                            ],
                            'react' => [
                                    plugin_dir_url( dirname( __FILE__ ) ) . '../assets/build/app.js'
                            ],
                    ],
            ],
	        [
		        'parentSlug' => ACPT_LITE_PLUGIN_NAME,
		        'pageTitle' => translate('Field groups', ACPT_LITE_PLUGIN_NAME),
		        'menuTitle' => translate('Field groups', ACPT_LITE_PLUGIN_NAME),
		        'capability' => 'manage_options',
		        'menuSlug' => ACPT_LITE_PLUGIN_NAME . '#/meta',
		        'template' => 'app',
		        'position' => 54,
		        'assets' => [
			        'css' => [
				        plugin_dir_url( dirname( __FILE__ ) ) . '../assets/build/app.min.css'
			        ],
			        'react' => [
				        plugin_dir_url( dirname( __FILE__ ) ) . '../assets/build/app.min.js'
			        ],
		        ],
	        ],
            [
                    'parentSlug' => ACPT_LITE_PLUGIN_NAME,
                    'pageTitle' => translate('Settings', ACPT_LITE_PLUGIN_NAME),
                    'menuTitle' => translate('Settings', ACPT_LITE_PLUGIN_NAME),
                    'capability' => 'manage_options',
                    'menuSlug' => ACPT_LITE_PLUGIN_NAME . '#/settings',
                    'template' => 'app',
                    'position' => 56,
                    'assets' => [
                            'css' => [
                                    plugin_dir_url( dirname( __FILE__ ) ) . '../assets/build/app.css'
                            ],
                            'react' => [
                                    plugin_dir_url( dirname( __FILE__ ) ) . '../assets/build/app.js'
                            ],
                    ],
            ],
        ];
    }

    /**
     * Add pages to to admin panel
     */
    public function addPages()
    {
        foreach ($this->pages as $page){
            $this->addPage(
                $page['pageTitle'],
                $page['menuTitle'],
                $page['capability'],
                $page['menuSlug'],
                $page['template'],
                (isset($page['iconUrl'])) ? $page['iconUrl'] : null,
                (isset($page['position'])) ? $page['position'] : null,
                (isset($page['parentSlug'])) ? $page['parentSlug'] : null
            );
        }
    }

    /**
     * Add a single page to admin panel
     *
     * @param string $pageTitle
     * @param string $menuTitle
     * @param string $capability
     * @param string $menuSlug
     * @param string $template
     * @param string $iconUrl
     * @param null   $position
     * @param null   $parentSlug
     */
    private function addPage($pageTitle, $menuTitle, $capability, $menuSlug, $template, $iconUrl = '', $position = null, $parentSlug = null)
    {
        if(isset($parentSlug)){
            add_submenu_page(
                $parentSlug,
                $pageTitle,
                $menuTitle,
                $capability,
                $menuSlug,
                function () use($template) {
                    require_once plugin_dir_path( dirname( __FILE__ ) ) . '../admin/templates/'.$template.'.php';
                },
                $position
            );
        } else {
            add_menu_page(
                $pageTitle,
                $menuTitle,
                $capability,
                $menuSlug,
                function () use($template) {
                    require_once plugin_dir_path( dirname( __FILE__ ) ) . '../admin/templates/'.$template.'.php';
                },
                $iconUrl,
                $position
            );
        }
    }

    /**
     * Enqueue admin assets
     */
    public function enqueueAssets()
    {
        global $pagenow;

        // Global assets
        foreach ($this->pages as $page){
            if(isset($_GET['page']) and $page['menuSlug'] === $_GET['page'] and isset($page['assets'])){
                $pageAssets = $page['assets'];
                foreach ($pageAssets as $key => $assets){
                    // css
                    if($key === 'css'){
                        foreach ($assets as $asset){
                            wp_enqueue_style( dirname( __FILE__ ).'__'.$key, $asset, [], ACPT_LITE_PLUGIN_VERSION, 'all');
                        }
                        // js
                    } elseif($key === 'js'){
                        foreach ($assets as $asset){
                            wp_enqueue_script( dirname( __FILE__ ).'__'.$key, $asset, ['jquery'], ACPT_LITE_PLUGIN_VERSION, true);
                        }
                        // react
                    } elseif($key === 'react'){
                        foreach ($assets as $asset){
                            wp_enqueue_script( dirname( __FILE__ ).'__'.$key, $asset, ['wp-element'], ACPT_LITE_PLUGIN_VERSION, true);
                        }
                    }
                }
            }
        }

        // Assets for create/edit post
        if($pagenow === 'post-new.php' or
           $pagenow === 'post.php' or
           $pagenow === 'profile.php' or
           $pagenow === 'user-edit.php' or
           $pagenow === 'edit-tags.php' or
           $pagenow === 'term.php'
        ) {

            // other static assets here
            foreach ($this->staticCssAssets as $key => $asset){
                wp_enqueue_style( dirname( __FILE__ ).'__'.$key, $asset, [], ACPT_LITE_PLUGIN_VERSION, 'all');
            }

            foreach ($this->staticJsAssets as $key => $asset){
                wp_enqueue_script( dirname( __FILE__ ).'__'.$key, $asset['path'], isset($asset['dep']) ? $asset['dep'] : [], ACPT_LITE_PLUGIN_VERSION, true);
            }

	        //
	        // =================================
	        // WP DEFAULT UTILITIES
	        // =================================
	        //

	        // color picker
	        wp_enqueue_style( 'wp-color-picker' );
	        wp_enqueue_script( 'my-script-handle', plugin_dir_url( dirname( __FILE__ ) ) . '../assets/static/js/wp-color-picker.js', ['wp-color-picker'], false, true );

	        // media
	        wp_enqueue_media();

            //
            // =================================
            // ICONIFY
            // =================================
            //
            wp_register_script('iconify',  plugin_dir_url( dirname( __FILE__ ) ) . '../assets/static/js/iconify/iconify.min.js' );
            wp_enqueue_script('iconify');
        }
    }

    /**
     * Add filters here
     */
    public function addFilters()
    {
	    add_filter( 'plugin_action_links', [ $this, 'addPluginLinks' ], PHP_INT_MAX, 2 );
        add_filter('script_loader_tag', [$this, 'addAsyncDeferAttribute'], 10, 2);
        add_filter('block_categories', [$this, 'addGutenbergBlocks'], 10, 2 );
    }

	/**
	 * Add plugin links
	 *
	 * @param $actions
	 * @param $plugin_file
	 *
	 * @return array
	 */
	public function addPluginLinks($actions, $plugin_file)
	{
		$actionLinks = [];

		if ( 'advanced-custom-post-type-lite/advanced-custom-post-type-lite.php' === $plugin_file ) {
			$actionLinks['pro'] = '<a href="https://acpt.io/checkout/?pid=791276" target="_blank">'.Translator::translate('Upgrade to PRO').'</a>';
			$actionLinks['settings'] = '<a href="'.admin_url( 'admin.php?page=advanced-custom-post-type#/settings' ).'">'.Translator::translate('Settings').'</a>';
			$actionLinks['documentation'] = '<a target="_blank" href="https://docs.acpt.io/">'.Translator::translate('Documentation').'</a>';
		}

		return array_merge($actionLinks, $actions);
	}

    /**
     * Register custom Gutenberg
     *
     * @param $block_categories
     * @param $block_editor_context
     *
     * @return array
     */
    public function addGutenbergBlocks($block_categories, $block_editor_context)
    {
        $category_slugs = wp_list_pluck( $block_categories, 'slug' );

        return in_array( 'advanced-custom-post-type-blocks', $category_slugs, true ) ? $block_categories : array_merge(
                $block_categories,
                [
                    [
                        'slug'  => 'advanced-custom-post-type-blocks',
                        'title' => __( 'ACPT Blocks', 'advanced-custom-post-type-blocks' ),
                        'icon'  => null,
                    ]
                ]
        );
    }

    /**
     * Async script load
     *
     * @param $tag
     * @param $handle
     *
     * @return string|string[]
     */
    public function addAsyncDeferAttribute($tag, $handle)
    {
        if ( 'google-maps' !== $handle ){
            return $tag;
        }

        return str_replace( ' src', ' async defer src', $tag );
    }

    /**
     * Add shortcodes
     */
    private function addShortcodes()
    {
        add_shortcode('acpt', [new PostMetaShortcode(), 'render']);
        add_shortcode('acpt_tax', [new TaxonomyMetaShortcode(), 'render']);
        add_shortcode('acpt_user', [new UserMetaShortcode(), 'render']);
    }

	/**
	 * @throws \Exception
	 */
	private function registerCustomPostTypesAndTaxonomies()
	{
		$templates =  get_pages([
			'meta_key' => '_wp_page_template',
		]);

		$categoryIds = get_terms([
			'taxonomy'   => 'category',
			'hide_empty' => false,
			'fields' => 'ids',
		]);

		$termIds = [];
		$taxonomies = get_taxonomies([
			'public' => true,
			'_builtin' => true,
		]);

		foreach ($taxonomies as $taxonomy){
			$queriedTerms = get_terms([
				'taxonomy'   => $taxonomy,
				'hide_empty' => false,
				'fields' => 'ids',
			]);

			$termIds[] = [
				'taxonomy' => $taxonomy,
				'terms'    => $queriedTerms,
			];
		}

		$metaGroupModels = MetaRepository::get([]);

		// loop all post types
		foreach (CustomPostTypeRepository::get() as $postTypeModel){

			$postTypeMetaGroups = [];

			// loop all post types
			foreach ($metaGroupModels as $metaGroupModel){

				// Add meta boxes
				$postType = $postTypeModel->getName();

				// 1. POST_TYPE
				if($metaGroupModel->belongsTo(MetaTypes::CUSTOM_POST_TYPE, Operator::EQUALS, $postType)){

					$postTypeMetaGroups[] = $metaGroupModel;

					$postIds = get_posts([
						'fields'         => 'ids',
						'post_type'      => $postType,
						'posts_per_page' => -1,
					]);

					$generator = new CustomPostTypeMetaGroupGenerator($metaGroupModel, $postType);
					$generator->render();

					// POST_ID
					if(!empty($postIds)){
						foreach ($postIds as $postId){
							if($metaGroupModel->belongsTo(BelongsTo::POST_ID, Operator::EQUALS, $postId)){
								$postTypeMetaGroups[] = $metaGroupModel;
								$this->generateMetaBoxesFromPostIds([$postId], $postType, $metaGroupModel);
							}
						}
					}
				}

				// 2. POST_TEMPLATE
				if(!empty($templates)){
					foreach ($templates as $template){
						$file = get_post_meta($template->ID, '_wp_page_template', true);
						if($metaGroupModel->belongsTo(BelongsTo::POST_TEMPLATE, Operator::EQUALS, $file)){
							$postTypeMetaGroups[] = $metaGroupModel;
							$postIds = get_posts([
								'fields'         => 'ids',
								'post_type'      => $postType,
								'posts_per_page' => -1,
								'meta_key' => '_wp_page_template',
								'meta_value' => $file
							]);

							$this->generateMetaBoxesFromPostIds($postIds, $postType, $metaGroupModel);
						}
					}
				}

				// 3. POST_TAX
				if(!empty($termIds)){
					foreach ($termIds as $termId){
						$taxonomy = $termId['taxonomy'];
						$terms    = $termId['terms'];

						foreach ($terms as $term){
							if($metaGroupModel->belongsTo(BelongsTo::POST_TAX, Operator::EQUALS, $term)){
								$postTypeMetaGroups[] = $metaGroupModel;
								$postIds = get_posts([
									'fields'         => 'ids',
									'post_type'      => $postType,
									'posts_per_page' => -1,
									'tax_query' => array(
										array(
											'taxonomy' => $taxonomy,
											'field' => 'id',
											'terms' => $term,
										),
									),
								]);

								$this->generateMetaBoxesFromPostIds($postIds, $postType, $metaGroupModel);
							}
						}
					}
				}

				// 4. POST_CAT
				if(!empty($categoryIds)){
					foreach ($categoryIds as $categoryId){
						if($metaGroupModel->belongsTo(BelongsTo::POST_CAT, Operator::EQUALS, $categoryId)){
							$postTypeMetaGroups[] = $metaGroupModel;
							$postIds = get_posts([
								'fields'         => 'ids',
								'post_type'      => $postType,
								'posts_per_page' => -1,
								'category' => $categoryId
							]);

							$this->generateMetaBoxesFromPostIds($postIds, $postType, $metaGroupModel);
						}
					}
				}
			}

			// register CPTs and Taxonomy here
			$customPostType = new CustomPostTypeGenerator(
				$postTypeModel->getName(),
				$postTypeModel->isNative(),
				$postTypeModel->isWooCommerce(),
				array_merge(
					[
						'supports' => $postTypeModel->getSupports(),
						'label' => $postTypeModel->getPlural(),
						'labels' => $postTypeModel->getLabels(),
						"menu_icon" => $postTypeModel->renderIcon(),
					],
					$postTypeModel->getSettings()
				),
				$postTypeMetaGroups
			);
		}
	}

	/**
	 * @param $postIds
	 * @param $postType
	 * @param MetaGroupModel $metaGroupModel
	 * @param bool $withPostId
	 */
	private function generateMetaBoxesFromPostIds($postIds, $postType, MetaGroupModel $metaGroupModel, $withPostId = true)
	{
		if(!empty($postIds)){
			foreach ($postIds as $postId){
				if($withPostId){
					$generator = new CustomPostTypeMetaGroupGenerator($metaGroupModel, $postType, $postId);
				} else {
					$generator = new CustomPostTypeMetaGroupGenerator($metaGroupModel, $postType, $postId);
				}

				$generator->render();
			}
		}
	}

	/**
	 * @throws \Exception
	 */
	private function registerTaxonomyMeta()
	{
		foreach (TaxonomyRepository::get()  as $taxonomyModel){
			$taxonomyMetaBoxGenerator = new TaxonomyMetaBoxGenerator($taxonomyModel);
			$taxonomyMetaBoxGenerator->generate();
		}
	}

    /**
     * @throws \Exception
     */
    public function addWooCommerceProductData()
    {
        $WooCommerceProductData = WooCommerceProductDataRepository::get([]);

        if(!empty($WooCommerceProductData)){
            $wooCommerceProductDataGenerator = new WooCommerceProductDataGenerator($WooCommerceProductData);
            $wooCommerceProductDataGenerator->generate();
        }
    }

	/**
	 * Add CPT columns to the admin panel
	 * (including quick edit and filter capabilities)
	 *
	 * @throws \Exception
	 */
	private function addColumnsToAdminPanel()
	{
		foreach (CustomPostTypeRepository::get() as $postTypeModel){

			$manageEditAction = 'manage_edit-'.$postTypeModel->getName().'_columns';
			$manageEditSortAction = 'manage_edit-'.$postTypeModel->getName().'_sortable_columns';
			$customColumnsAction = 'manage_'.$postTypeModel->getName().'_posts_custom_column';

			// add columns to show
			add_filter($manageEditAction, function($columns) use ($postTypeModel) {

				$metaGroups = MetaRepository::get([
					'belongsTo' => MetaTypes::CUSTOM_POST_TYPE,
					'find' => $postTypeModel->getName()
				]);

				foreach($metaGroups as $metaGroup){
					foreach ($metaGroup->getBoxes() as $metaBoxModel){
						foreach ($metaBoxModel->getFields() as $metaBoxFieldModel){
							if ($metaBoxFieldModel->isShowInArchive()){
								$key = Strings::toDBFormat($metaBoxModel->getName()).'_'.Strings::toDBFormat($metaBoxFieldModel->getName());
								$value = Strings::toHumanReadableFormat($metaBoxFieldModel->getName());

								$columns[$key] = $value;
							}
						}
					}
				}

				return $columns;
			});

			// add sortable columns
			add_filter( $manageEditSortAction, function($columns) use ($postTypeModel){

				$metaGroups = MetaRepository::get([
					'belongsTo' => MetaTypes::CUSTOM_POST_TYPE,
					'find' => $postTypeModel->getName()
				]);

				foreach($metaGroups as $metaGroup){
					foreach ($metaGroup->getBoxes() as $metaBoxModel){
						foreach ($metaBoxModel->getFields() as $metaBoxFieldModel){
							if ($metaBoxFieldModel->isShowInArchive() and $metaBoxFieldModel->isFilterable() and $metaBoxFieldModel->isFilterableInAdmin()){
								$key = Strings::toDBFormat($metaBoxModel->getName()).'_'.Strings::toDBFormat($metaBoxFieldModel->getName());
								$value = Strings::toHumanReadableFormat($metaBoxFieldModel->getName());

								$columns[$key] = $value;
							}
						}
					}
				}

				return $columns;
			} );

			// add filterable columns
			add_action( 'restrict_manage_posts', function($post_type) use ($postTypeModel) {

				if($post_type !== $postTypeModel->getName()){
					return;
				}

				$metaGroups = MetaRepository::get([
					'belongsTo' => MetaTypes::CUSTOM_POST_TYPE,
					'find' => $postTypeModel->getName()
				]);

				foreach($metaGroups as $metaGroup){
					foreach ($metaGroup->getBoxes() as $metaBoxModel){
						foreach ($metaBoxModel->getFields() as $metaBoxFieldModel){
							if ($metaBoxFieldModel->isShowInArchive() and $metaBoxFieldModel->isFilterable() and $metaBoxFieldModel->isFilterableInAdmin()){

								//get unique values of the meta field to filer by.
								$metaKey = Strings::toDBFormat($metaBoxModel->getName()).'_'.Strings::toDBFormat($metaBoxFieldModel->getName());
								$metaLabel = ($metaBoxFieldModel->getAdvancedOption('label')) ? $metaBoxFieldModel->getAdvancedOption('label') : $metaBoxFieldModel->getName();

								$selected = '';
								if ( isset($_REQUEST[$metaKey]) ) {
									$selected = $_REQUEST[$metaKey];
								}

								global $wpdb;

								$results = $wpdb->get_results(
									$wpdb->prepare( "
                                    SELECT DISTINCT pm.meta_value, pm.meta_id FROM {$wpdb->postmeta} pm
                                    LEFT JOIN {$wpdb->posts} p ON p.ID = pm.post_id
                                    WHERE pm.meta_key = '%s' 
                                    AND p.post_status IN ('publish', 'draft')
                                    ORDER BY pm.meta_value",
										$metaKey
									)
								);

								echo '<select id="'.$metaKey.'" name="'.$metaKey.'">';
								echo '<option value="0">' . Translator::translate('Select') . ' ' . $metaLabel .' </option>';

								$unique = [];

								foreach($results as $result){
									if(!in_array($result->meta_value, $unique)){
										$selected = ($result->meta_id == $selected) ? ' selected="selected"':'';
										$unique[] = $result->meta_value;
										echo '<option value="'.$result->meta_id.'"'.$selected.'>' . $result->meta_value . ' </option>';
									}
								}

								echo '</select>';
							}
						}
					}
				}
			});

			add_action('pre_get_posts', function ($query) use ($postTypeModel) {
				if ( is_admin() && $query->is_main_query() ) {
					$scr = get_current_screen();

					if ( $scr->base !== 'edit' && $scr->post_type !== 'events' ) {
						return;
					}

					$metaGroups = MetaRepository::get([
						'belongsTo' => MetaTypes::CUSTOM_POST_TYPE,
						'find' => $postTypeModel->getName()
					]);

					foreach ($metaGroups as $metaGroup){
						foreach ($metaGroup->getBoxes() as $metaBoxModel){
							foreach ($metaBoxModel->getFields() as $metaBoxFieldModel){
								if ($metaBoxFieldModel->isShowInArchive() and $metaBoxFieldModel->isFilterable() and $metaBoxFieldModel->isFilterableInAdmin()){

									$metaKey = Strings::toDBFormat($metaBoxModel->getName()).'_'.Strings::toDBFormat($metaBoxFieldModel->getName());

									if (isset($_GET[$metaKey]) && $_GET[$metaKey] != 0) {

										$meta = get_post_meta_by_id($_GET[$metaKey]);
										$query->set('meta_query', [
											[
												'key' => $metaKey,
												'value' => sanitize_text_field($meta->meta_value),
												'compare' => '=',
												'type' => 'CHAR'
											]
										]);
									}
								}
							}
						}
					}
				}
			});

			// quick edit
			add_action( 'quick_edit_custom_box', function($column_name) use ($postTypeModel) {
				global $post;

				$metaGroups = MetaRepository::get([
					'belongsTo' => MetaTypes::CUSTOM_POST_TYPE,
					'find' => $postTypeModel->getName()
				]);

				foreach ($metaGroups as $metaGroup){
					foreach ($metaGroup->getBoxes() as $metaBoxModel){
						foreach ($metaBoxModel->getFields() as $metaBoxFieldModel){
							if (
								$metaBoxFieldModel->isShowInArchive() and
								$metaBoxFieldModel->isForQuickEdit()
							){
								$key = Strings::toDBFormat($metaBoxModel->getName()).'_'.Strings::toDBFormat($metaBoxFieldModel->getName());
								$key = esc_html($key);
								$label = Strings::toHumanReadableFormat($metaBoxFieldModel->getName());
								$value = get_post_meta( $post->ID, $key, true );
								if( $column_name === $key ):
									Nonce::field();
									?>
									<fieldset class="inline-edit-col-right" id="#edit-<?php echo $key; ?>">
										<input type="hidden" name="meta_fields[]" value="<?php echo $key; ?>">
										<input type="hidden" name="meta_fields[]" value="<?php echo $key; ?>_type">
										<input type="hidden" name="<?php echo $key; ?>_type" value="<?php echo $metaBoxFieldModel->getType(); ?>">
										<input type="hidden" name="<?php echo $key; ?>_required" value="<?php echo $metaBoxFieldModel->isRequired(); ?>">
										<div class="inline-edit-col">
											<label>
												<span class="title"><?php echo $label; ?></span>
												<span class="input-text-wrap">
                                                <?php if($metaBoxFieldModel->getType() === MetaFieldModel::EMAIL_TYPE): ?>
	                                                <input type="email" name="<?php echo $key; ?>" data-acpt-column="column-<?php echo $key; ?>" class="inline-edit-menu-order-input" value="<?php echo $value; ?>">
                                                <?php elseif($metaBoxFieldModel->getType() === MetaFieldModel::TEXTAREA_TYPE): ?>
	                                                <textarea name="<?php echo $key; ?>" data-acpt-column="column-<?php echo $key; ?>" class="inline-edit-menu-order-input" rows="5"><?php echo $value; ?>"</textarea>
                                                <?php else: ?>
	                                                <input type="text" name="<?php echo $key; ?>" data-acpt-column="column-<?php echo $key; ?>" class="inline-edit-menu-order-input" value="<?php echo $value; ?>">
                                                <?php endif; ?>
									        </span>
											</label>
										</div>
									</fieldset>
								<?php endif;
							}
						}
					}
				}
			} );

			// display value on columns to show
			add_action($customColumnsAction, function($name) use ($postTypeModel) {
				global $post;

				$metaGroups = MetaRepository::get([
					'belongsTo' => MetaTypes::CUSTOM_POST_TYPE,
					'find' => $postTypeModel->getName()
				]);

				foreach ($metaGroups as $metaGroup){
					foreach ($metaGroup->getBoxes() as $metaBoxModel){
						foreach ($metaBoxModel->getFields() as $metaBoxFieldModel){
							if ($metaBoxFieldModel->isShowInArchive()){
								$key = Strings::toDBFormat($metaBoxModel->getName()).'_'.Strings::toDBFormat($metaBoxFieldModel->getName());

								if($key === $name){
									echo do_shortcode('[acpt preview="true" pid="'.$post->ID.'" box="'.esc_attr($metaBoxModel->getName()).'" field="'.esc_attr($metaBoxFieldModel->getName()).'"]');
								}
							}
						}
					}
				}
			});
		}
	}

    /**
     * @throws \Exception
     */
    private function registerUserMeta()
    {
	    $metaGroups = MetaRepository::get([
		    'belongsTo' => MetaTypes::USER,
	    ]);

	    if(!empty($metaGroups)){
		    $generator = new UserMetaBoxGenerator($metaGroups);
		    $generator->generate();
	    }

	    add_action( 'plugins_loaded',  function() {
		    $users = get_users([
			    'fields' => [
				    'ID',
			    ]
		    ]);

		    if(!empty($users)){
			    foreach ($users as $user){
				    $metaGroups = MetaRepository::get([
					    'belongsTo' => BelongsTo::USER_ID,
					    'find' => $user->id,
				    ]);

				    if(!empty($metaGroups)){
					    $generator = new UserMetaBoxGenerator($metaGroups, $user->id);
					    $generator->generate();
				    }
			    }
		    }
	    } );
    }

	/**
	 * Add User meta columns to show in the admin panel
	 */
	private function addUserMetaColumnsToShow()
	{
		add_filter( 'manage_users_columns', function ($column) {

			$metaGroups = MetaRepository::get([
				'belongsTo' => MetaTypes::USER,
			]);

			foreach ($metaGroups as $metaGroup){
				foreach ($metaGroup->getBoxes() as $boxModel){
					foreach ($boxModel->getFields() as $fieldModel){
						if($fieldModel->isShowInArchive()){
							$key = Strings::toDBFormat($boxModel->getName()).'_'.Strings::toDBFormat($fieldModel->getName());
							$value = Strings::toHumanReadableFormat($fieldModel->getName());
							$column[$key] = $value;
						}
					}
				}
			}


			return $column;
		} );

		add_filter( 'manage_users_custom_column', function ( $val, $columnName, $userId ) {

			$metaGroups = MetaRepository::get([
				'belongsTo' => MetaTypes::USER,
			]);

			foreach ($metaGroups as $metaGroup){
				foreach ($metaGroup->getBoxes() as $boxModel){
					foreach ($boxModel->getFields() as $fieldModel){
						if($fieldModel->isShowInArchive()){
							$key = Strings::toDBFormat($boxModel->getName()).'_'.Strings::toDBFormat($fieldModel->getName());

							if($key === $columnName){
								return do_shortcode( '[acpt_user uid="'.$userId.'" box="'.esc_attr($boxModel->getName()).'" field="'.esc_attr($fieldModel->getName()).'"]');
							}
						}
					}
				}
			}

		}, 10, 3 );
	}

    /**
     * Register API endpoints
     */
    private function registerRestFields()
    {
        $this->loader->addAction( 'rest_api_init', new ACPT_Lite_Api_Rest_Fields(), 'registerRestFields' );
    }

	/**
	 * Run integrations
	 */
	private function runIntegrations()
	{
		$integrations = [
			ACPT_Lite_Gutenberg::class,
			ACPT_Lite_Elementor::class,
		];

		foreach ($integrations as $integration){
			/** @var AbstractIntegration $instance */
			$instance = new $integration;
			$instance->run();
		}
	}

	/**
	 * Run admin scripts
	 * @throws \Exception
	 */
    public function run()
    {
        // filters
        $this->addFilters();

        // pages and assets
        $this->loader->addAction( 'admin_menu', $this, 'addPages' );
        $this->loader->addAction( 'admin_enqueue_scripts', $this, 'enqueueAssets' );

        // ajax calls
        foreach ($this->ajaxActions as $action => $callback){
            $this->loader->addAction($action, $this->ajax, $callback);
        }

        // shortcodes
        $this->addShortcodes();

        // register custom post types and taxonomies
        $this->registerCustomPostTypesAndTaxonomies();

	    // register taxonomy meta
	    $this->registerTaxonomyMeta();

        // WooCommerce product data
        $this->addWooCommerceProductData();

        // add columns to show in the list panel
        $this->addColumnsToAdminPanel();

        // register user meta
        $this->registerUserMeta();

        // add user meta columns to show in the admin panel
        $this->addUserMetaColumnsToShow();

        // API REST
        $this->registerRestFields();

	    // run integrations
	    $this->runIntegrations();
    }
}
