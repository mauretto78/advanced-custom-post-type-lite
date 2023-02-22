<?php

namespace ACPT_Lite\Admin;

use ACPT_Lite\Core\Generators\CustomPostTypeGenerator;
use ACPT_Lite\Core\Generators\CustomPostTypeMetaBoxGenerator;
use ACPT_Lite\Core\Generators\TaxonomyMetaBoxGenerator;
use ACPT_Lite\Core\Generators\UserMetaBoxGenerator;
use ACPT_Lite\Core\Generators\WooCommerceProductDataGenerator;
use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Abstracts\AbstractMetaBoxModel;
use ACPT_Lite\Core\Models\CustomPostType\CustomPostTypeMetaBoxFieldModel;
use ACPT_Lite\Core\Repository\CustomPostTypeRepository;
use ACPT_Lite\Core\Repository\MetaRepository;
use ACPT_Lite\Core\Repository\WooCommerceProductDataRepository;
use ACPT_Lite\Core\Shortcodes\PostMetaShortcode;
use ACPT_Lite\Core\Shortcodes\UserMetaShortcode;
use ACPT_Lite\Costants\MetaTypes;
use ACPT_Lite\Includes\ACPT_Lite_Elementor_Initiator;
use ACPT_Lite\Includes\ACPT_Lite_Loader;

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
            'wp_ajax_checkPostTypeNameAction' => 'checkPostTypeNameAction',
            'wp_ajax_checkTaxonomySlugAction' => 'checkTaxonomySlugAction',
            'wp_ajax_deleteCustomPostTypeAction' => 'deleteCustomPostTypeAction',
            'wp_ajax_deleteMetaAction' => 'deleteMetaAction',
            'wp_ajax_deleteTaxonomyAction' => 'deleteTaxonomyAction',
            'wp_ajax_deleteWooCommerceProductDataAction' => 'deleteWooCommerceProductDataAction',
            'wp_ajax_deleteWooCommerceProductDataFieldsAction' => 'deleteWooCommerceProductDataFieldsAction',
            'wp_ajax_doShortcodeAction' => 'doShortcodeAction',
            'wp_ajax_exportFileAction' => 'exportFileAction',
            'wp_ajax_fetchMetaAction' => 'fetchMetaAction',
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
            'wp_ajax_fetchWooCommerceProductDataAction' => 'fetchWooCommerceProductDataAction',
            'wp_ajax_fetchWooCommerceProductDataFieldsAction' => 'fetchWooCommerceProductDataFieldsAction',
            'wp_ajax_importFileAction' => 'importFileAction',
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
                'capability' => 'manage_options',
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
                    'pageTitle' => translate('Register post type', ACPT_LITE_PLUGIN_NAME),
                    'menuTitle' => translate('Register post type', ACPT_LITE_PLUGIN_NAME),
                    'capability' => 'manage_options',
                    'menuSlug' => ACPT_LITE_PLUGIN_NAME . '#/register',
                    'template' => 'app',
                    'position' => 51,
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
                    'pageTitle' => translate('User meta', ACPT_LITE_PLUGIN_NAME),
                    'menuTitle' => translate('User meta', ACPT_LITE_PLUGIN_NAME),
                    'capability' => 'manage_options',
                    'menuSlug' => ACPT_LITE_PLUGIN_NAME . '#/user-meta',
                    'template' => 'app',
                    'position' => 53,
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
        add_filter('script_loader_tag', [$this, 'addAsyncDeferAttribute'], 10, 2);
        add_filter('block_categories', [$this, 'addGutenbergBlocks'], 10, 2 );
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
        add_shortcode('acpt_user', [new UserMetaShortcode(), 'render']);
    }

    /**
     * @throws \Exception
     */
    private function registerCustomPostTypesAndTaxonomies()
    {
	    $customPostTypeMetaBoxGenerator = new CustomPostTypeMetaBoxGenerator();

	    // add meta box/taxonomies for CPT
	    foreach (CustomPostTypeRepository::get() as $postTypeModel){

		    // register CPTs and Taxonomy here
		    $customPostType = new CustomPostTypeGenerator(
			    $postTypeModel->getName(),
			    $postTypeModel->isNative(),
			    array_merge(
				    [
					    'supports' => $postTypeModel->getSupports(),
					    'label' => $postTypeModel->getPlural(),
					    'labels' => $postTypeModel->getLabels(),
					    "menu_icon" => 'dashicons-'.$postTypeModel->getIcon()
				    ],
				    $postTypeModel->getSettings()
			    )
		    );

		    // add meta boxes
		    foreach ($postTypeModel->getMetaBoxes() as $metaBoxModel){
			    $this->generateMetaBoxes($postTypeModel->getName(), $metaBoxModel, $customPostTypeMetaBoxGenerator);
		    }
	    }
    }

	/**
	 * @throws \Exception
	 */
	private function registerTaxonomyMeta()
	{
		$taxonomyMetaBoxGenerator = new TaxonomyMetaBoxGenerator();
		$taxonomyMetaBoxGenerator->generate();
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
	 * @param string               $postTypeName
	 * @param AbstractMetaBoxModel $metaBoxModel
	 * @param CustomPostTypeMetaBoxGenerator     $metaBoxGenerator
	 */
	private function generateMetaBoxes($postTypeName, AbstractMetaBoxModel $metaBoxModel, CustomPostTypeMetaBoxGenerator $metaBoxGenerator)
	{
		$metaFields = [];

		foreach ($metaBoxModel->getFields() as $fieldModel){
			$metaFields[] = $this->generateMetaBoxFieldArray($fieldModel);
		}

		$metaBoxGenerator->addMetaBox($metaBoxModel->getId(), $metaBoxModel->getName(), $postTypeName, $metaFields);
	}

	/**
	 * @param CustomPostTypeMetaBoxFieldModel $fieldModel
	 *
	 * @return array
	 */
	protected function generateMetaBoxFieldArray(CustomPostTypeMetaBoxFieldModel $fieldModel)
	{
		$options = [];

		foreach ($fieldModel->getOptions() as $optionModel){
			$options[] = [
				'label' => $optionModel->getLabel(),
				'value' => $optionModel->getValue(),
			];
		}

		return [
			'id' => $fieldModel->getId(),
			'type' => $fieldModel->getType(),
			'name' => $fieldModel->getName(),
			'defaultValue' => $fieldModel->getDefaultValue(),
			'description' => $fieldModel->getDescription(),
			'isRequired' => $fieldModel->isRequired(),
			'isShowInArchive' => $fieldModel->isShowInArchive(),
			'sort' => $fieldModel->getSort(),
			'options' => $options,
		];
	}

    /**
     * Add CPT columns to show in the admin panel
     *
     * @throws \Exception
     */
    private function addColumnsToShow()
    {
        foreach ( CustomPostTypeRepository::get() as $postTypeModel){

            $action = 'manage_edit-'.$postTypeModel->getName().'_columns';

            add_filter($action, function($columns) use ($postTypeModel) {
                foreach ($postTypeModel->getMetaBoxes() as $metaBoxModel){
                    foreach ($metaBoxModel->getFields() as $metaBoxFieldModel){
                        if ($metaBoxFieldModel->isShowInArchive()){
                            $key = Strings::toDBFormat($metaBoxModel->getName()).'_'.Strings::toDBFormat($metaBoxFieldModel->getName());
                            $value = Strings::toHumanReadableFormat($metaBoxFieldModel->getName());

                            $columns[$key] = $value;
                        }
                    }
                }

                return $columns;
            });

            add_action('manage_posts_custom_column', function($name) use ($postTypeModel) {
                global $post;

                foreach ($postTypeModel->getMetaBoxes() as $metaBoxModel){
                    foreach ($metaBoxModel->getFields() as $metaBoxFieldModel){
                        if ($metaBoxFieldModel->isShowInArchive()){
                            $key = Strings::toDBFormat($metaBoxModel->getName()).'_'.Strings::toDBFormat($metaBoxFieldModel->getName());

                            if($key === $name){
                                echo do_shortcode( '[acpt preview="true" box="'.esc_attr($metaBoxModel->getName()).'" field="'.esc_attr($metaBoxFieldModel->getName()).'"]');
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
        $boxes = MetaRepository::get([
        	'belongsTo' => MetaTypes::USER
        ]);

        if(!empty($boxes)){
            $generator = new UserMetaBoxGenerator($boxes);
            $generator->generate();
        }
    }

    /**
     * Add User meta columns to show in the admin panel
     */
    private function addUserMetaColumnsToShow()
    {
        add_filter( 'manage_users_columns', function ($column) {

            $boxes = MetaRepository::get([
	            'belongsTo' => MetaTypes::USER
            ]);

            foreach ($boxes as $boxModel){
                foreach ($boxModel->getFields() as $fieldModel){
                    if($fieldModel->isShowInArchive()){
                        $key = Strings::toDBFormat($boxModel->getName()).'_'.Strings::toDBFormat($fieldModel->getName());
                        $value = Strings::toHumanReadableFormat($fieldModel->getName());
                        $column[$key] = $value;
                    }
                }
            }

            return $column;
        } );

        add_filter( 'manage_users_custom_column', function ( $val, $columnName, $userId ) {

            $boxes = MetaRepository::get([
	            'belongsTo' => MetaTypes::USER
            ]);

            foreach ($boxes as $boxModel){
                foreach ($boxModel->getFields() as $fieldModel){
                    if($fieldModel->isShowInArchive()){
                        $key = Strings::toDBFormat($boxModel->getName()).'_'.Strings::toDBFormat($fieldModel->getName());

                        if($key === $columnName){
                            return do_shortcode( '[acpt_user uid="'.$userId.'" box="'.esc_attr($boxModel->getName()).'" field="'.esc_attr($fieldModel->getName()).'"]');
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

        // Elementor widgets
        $elementorInit = new ACPT_Lite_Elementor_Initiator();
        $elementorInit->run();

        // shortcodes
        $this->addShortcodes();

        // register custom post types and taxonomies
        $this->registerCustomPostTypesAndTaxonomies();

	    // register taxonomy meta
	    $this->registerTaxonomyMeta();

        // WooCommerce product data
        $this->addWooCommerceProductData();

        // add columns to show in the list panel
        $this->addColumnsToShow();

        // register user meta
        $this->registerUserMeta();

        // add user meta columns to show in the admin panel
        $this->addUserMetaColumnsToShow();

        // API REST
        $this->registerRestFields();
    }
}
