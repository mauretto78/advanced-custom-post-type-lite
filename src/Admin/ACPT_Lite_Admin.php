<?php

namespace ACPT_Lite\Admin;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Generators\Attachment\AttachmentMetaGroupsGenerator;
use ACPT_Lite\Core\Generators\Comment\CommentAdminColumnsGenerator;
use ACPT_Lite\Core\Generators\Comment\CommentMetaGroupsGenerator;
use ACPT_Lite\Core\Generators\CustomPostType\CustomPostTypeAdminColumnsGenerator;
use ACPT_Lite\Core\Generators\CustomPostType\CustomPostTypeGenerator;
use ACPT_Lite\Core\Generators\CustomPostType\CustomPostTypeMetaBoxGenerator;
use ACPT_Lite\Core\Generators\CustomPostType\CustomPostTypeMetaGroupsGenerator;
use ACPT_Lite\Core\Generators\OptionPage\OptionPageGenerator;
use ACPT_Lite\Core\Generators\Taxonomy\TaxonomyAdminColumnsGenerator;
use ACPT_Lite\Core\Generators\Taxonomy\TaxonomyMetaGroupsGenerator;
use ACPT_Lite\Core\Generators\User\UserAdminColumnsGenerator;
use ACPT_Lite\Core\Generators\User\UserMetaGroupsGenerator;
use ACPT_Lite\Core\Models\Settings\SettingsModel;
use ACPT_Lite\Core\Repository\CustomPostTypeRepository;
use ACPT_Lite\Core\Repository\MetaRepository;
use ACPT_Lite\Core\Repository\OptionPageRepository;
use ACPT_Lite\Core\Repository\TaxonomyRepository;
use ACPT_Lite\Core\Shortcodes\ACPT\AttachmentMetaShortcode;
use ACPT_Lite\Core\Shortcodes\ACPT\CommentMetaShortcode;
use ACPT_Lite\Core\Shortcodes\ACPT\OptionPageMetaShortcode;
use ACPT_Lite\Core\Shortcodes\ACPT\PostMetaShortcode;
use ACPT_Lite\Core\Shortcodes\ACPT\TaxonomyMetaShortcode;
use ACPT_Lite\Core\Shortcodes\ACPT\UserMetaShortcode;
use ACPT_Lite\Core\Shortcodes\Form\FormShortcode;
use ACPT_Lite\Includes\ACPT_Lite_DB;
use ACPT_Lite\Includes\ACPT_Lite_Loader;
use ACPT_Lite\Integrations\AbstractIntegration;
use ACPT_Lite\Integrations\Breakdance\ACPT_Breakdance;
use ACPT_Lite\Integrations\Bricks\ACPT_Bricks;
use ACPT_Lite\Integrations\Divi\ACPT_Divi;
use ACPT_Lite\Integrations\Elementor\ACPT_Lite_Elementor;
use ACPT_Lite\Integrations\ElementorPro\ACPT_Elementor_Pro;
use ACPT_Lite\Integrations\Gutenberg\ACPT_Lite_Gutenberg;
use ACPT_Lite\Integrations\Oxygen\ACPT_Oxygen;
use ACPT_Lite\Integrations\Polylang\ACPT_Polylang;
use ACPT_Lite\Integrations\Polylang\Helper\PolylangChecker;
use ACPT_Lite\Integrations\RankMath\ACPT_RankMath;
use ACPT_Lite\Integrations\WooCommerce\ACPT_Lite_WooCommerce;
use ACPT_Lite\Integrations\WPAllExport\ACPT_WPAllExport;
use ACPT_Lite\Integrations\WPAllImport\ACPT_WPAllImport;
use ACPT_Lite\Integrations\WPGraphQL\ACPT_WPGraphQL;
use ACPT_Lite\Integrations\WPGridBuilder\ACPT_WPGridBuilder;
use ACPT_Lite\Integrations\WPML\ACPT_WPML;
use ACPT_Lite\Integrations\WPML\Helper\WPMLChecker;
use ACPT_Lite\Integrations\Yoast\ACPT_Yoast;
use ACPT_Lite\Integrations\Zion\ACPT_Zion;
use ACPT_Lite\Utils\PHP\Maps;
use ACPT_Lite\Utils\PHP\Profiler;
use ACPT_Lite\Utils\PHP\Server;
use ACPT_Lite\Utils\PHP\Session;
use ACPT_Lite\Utils\PHP\Url;
use ACPT_Lite\Utils\Settings\Settings;
use ACPT_Lite\Utils\Vite\Assets;
use ACPT_Lite\Utils\Wordpress\Translator;
use ACPT_Lite\Utils\Wordpress\WPUtils;

/**
 * The admin-specific functionality of the plugin.
 *
 * @since      1.0.0
 * @package    advanced-custom-post-type
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
	 * @var string
	 */
    private $googleMapsApiKey;

	/**
	 * ACPT_Admin constructor.
	 *
	 * @param ACPT_Lite_Loader $loader
	 *
	 * @throws \Exception
	 */
    public function __construct(ACPT_Lite_Loader $loader)
    {
        $this->ajax = new ACPT_Lite_Ajax();
        $this->loader = $loader;
        $this->setGoogleMapsApiKey();
        $this->setStaticCssAssets();
        $this->setStaticJsAssets();
        $this->setAjaxActions();
        $this->setPages();
    }

	/**
	 * @throws \Exception
	 */
    private function setGoogleMapsApiKey()
    {
	    $this->googleMapsApiKey = Maps::googleMapsKey();
    }

    /**
     * Define static CSS assets
     */
    private function setStaticCssAssets()
    {
    	$pagenow = Url::pagenow();

	    // other js assets
	    $allowedPages = [
		    "post-new.php",
		    "post.php",
		    "edit-tags.php",
		    "term.php",
		    "admin.php",
		    "profile.php",
		    "upload.php",
		    "comment.php",
		    "user-edit.php",
	    ];

	    if(in_array($pagenow, $allowedPages) and !$this->isACPTAppPage()){
		    $this->staticCssAssets = [
			    'admin_selectize_css' => plugins_url(  'advanced-custom-post-type/assets/vendor/selectize/selectize.default.min.css'),
			    'admin_css' => plugins_url(  'advanced-custom-post-type/assets/static/css/admin.css'),
		    ];
	    }
    }

    /**
     * Define static JS assets
     */
    private function setStaticJsAssets()
    {
        $pagenow = Url::pagenow();
	    $jsAssets = [];

	    // other js assets
        $allowedPages = [
	        "post-new.php",
	        "post.php",
	        "edit-tags.php",
	        "term.php",
	        "admin.php",
	        "profile.php",
	        "upload.php",
	        "comment.php",
	        "user-edit.php",
        ];

	    if(in_array($pagenow, $allowedPages) and !$this->isACPTAppPage()){
		    $jsAssets['admin_selectize_js'] = [
			    'path' => plugins_url( 'advanced-custom-post-type/assets/vendor/selectize/selectize.min.js'),
			    'dep'  => ['jquery'],
		    ];

		    $jsAssets['admin_commons_js'] = [
			    'path' => plugins_url( 'advanced-custom-post-type/assets/static/js/commons.js'),
			    'dep'  => ['jquery'],
		    ];

		    $jsAssets['admin_js'] = [
			    'path' => plugins_url( 'advanced-custom-post-type/assets/static/js/admin.js'),
			    'dep'  => ['jquery'],
		    ];
	    }

	    if($pagenow === "edit-comments.php"){
		    $jsAssets['comment_quick_edit_js'] = [
			    'path' => plugins_url( 'advanced-custom-post-type/assets/static/js/comment-quick-edit.js'),
			    'dep'  => ['jquery'],
		    ];
	    }

	    $this->staticJsAssets = $jsAssets;
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
            'wp_ajax_checkIsVisibleAction' => 'checkIsVisibleAction',
            'wp_ajax_checkMetaBoxNameAction' => 'checkMetaBoxNameAction',
            'wp_ajax_checkMetaBoxFieldNameAction' => 'checkMetaBoxFieldNameAction',
            'wp_ajax_checkPostTypeNameAction' => 'checkPostTypeNameAction',
            'wp_ajax_checkTaxonomySlugAction' => 'checkTaxonomySlugAction',
            'wp_ajax_copyMetaBoxAction' => 'copyMetaBoxAction',
            'wp_ajax_copyMetaBoxesAction' => 'copyMetaBoxesAction',
            'wp_ajax_copyMetaFieldAction' => 'copyMetaFieldAction',
            'wp_ajax_copyMetaFieldsAction' => 'copyMetaFieldsAction',
            'wp_ajax_copyMetaBlockAction' => 'copyMetaBlockAction',
            'wp_ajax_copyOptionPageAction' => 'copyOptionPageAction',
            'wp_ajax_copyOptionPagesAction' => 'copyOptionPagesAction',
            'wp_ajax_copyMetaBlocksAction' => 'copyMetaBlocksAction',
            'wp_ajax_deactivateLicenseAction' => 'deactivateLicenseAction',
            'wp_ajax_deleteApiKeyAction' => 'deleteApiKeyAction',
            'wp_ajax_deleteCustomPostTypeAction' => 'deleteCustomPostTypeAction',
            'wp_ajax_deleteDatasetAction' => 'deleteDatasetAction',
            'wp_ajax_deleteFormAction' => 'deleteFormAction',
            'wp_ajax_deleteMetaAction' => 'deleteMetaAction',
            'wp_ajax_deletePageAction' => 'deletePageAction',
            'wp_ajax_deleteOptionPagesAction' => 'deleteOptionPagesAction',
            'wp_ajax_deleteTableTemplateAction' => 'deleteTableTemplateAction',
            'wp_ajax_deleteTaxonomyAction' => 'deleteTaxonomyAction',
            'wp_ajax_deleteUserMetaAction' => 'deleteUserMetaAction',
            'wp_ajax_duplicateAction' => 'duplicateAction',
            'wp_ajax_doShortcodeAction' => 'doShortcodeAction',
            'wp_ajax_exportCodeAction' => 'exportCodeAction',
            'wp_ajax_exportFileAction' => 'exportFileAction',
            'wp_ajax_fetchApiKeysAction' => 'fetchApiKeysAction',
            'wp_ajax_fetchApiKeysCountAction' => 'fetchApiKeysCountAction',
            'wp_ajax_fetchAllFindBelongsAction' => 'fetchAllFindBelongsAction',
            'wp_ajax_fetchAllMetaAction' => 'fetchAllMetaAction',
            'wp_ajax_fetchBoxesAction' => 'fetchBoxesAction',
            'wp_ajax_fetchCommentMetaValueAction' => 'fetchCommentMetaValueAction',
            'wp_ajax_fetchCustomPostTypesAction' => 'fetchCustomPostTypesAction',
            'wp_ajax_fetchDatasetsAction' => 'fetchDatasetsAction',
            'wp_ajax_fetchElementsAction' => 'fetchElementsAction',
            'wp_ajax_fetchFindAction' => 'fetchFindAction',
            'wp_ajax_fetchFindFromBelongsToAction' => 'fetchFindFromBelongsToAction',
            'wp_ajax_fetchFormFieldsAction' => 'fetchFormFieldsAction',
            'wp_ajax_fetchFormsAction' => 'fetchFormsAction',
            'wp_ajax_fetchFieldsAction' => 'fetchFieldsAction',
            'wp_ajax_fetchFormPreviewElementAction' => 'fetchFormPreviewElementAction',
            'wp_ajax_fetchFormSubmissionsAction' => 'fetchFormSubmissionsAction',
            'wp_ajax_fetchHeadersAndFootersAction' => 'fetchHeadersAndFootersAction',
            'wp_ajax_fetchLicenseAction' => 'fetchLicenseAction',
            'wp_ajax_fetchMetaAction' => 'fetchMetaAction',
            'wp_ajax_fetchMetaFieldAction' => 'fetchMetaFieldAction',
            'wp_ajax_fetchMetaFieldRelationshipAction' => 'fetchMetaFieldRelationshipAction',
            'wp_ajax_fetchMetaFieldsFlatMapAction' => 'fetchMetaFieldsFlatMapAction',
            'wp_ajax_fetchMetaFieldsFromBelongsToAction' => 'fetchMetaFieldsFromBelongsToAction',
            'wp_ajax_fetchOptionPageAction' => 'fetchOptionPageAction',
            'wp_ajax_fetchOptionPagesAction' => 'fetchOptionPagesAction',
            'wp_ajax_fetchOptionPagesMetaAction' => 'fetchOptionPagesMetaAction',
            'wp_ajax_fetchPostTypesAction' => 'fetchPostTypesAction',
            'wp_ajax_fetchPostTypeTaxonomiesAction' => 'fetchPostTypeTaxonomiesAction',
            'wp_ajax_fetchPostTypePostsAction' => 'fetchPostTypePostsAction',
            'wp_ajax_fetchPermissionAction' => 'fetchPermissionAction',
            'wp_ajax_fetchPreviewLinkAction' => 'fetchPreviewLinkAction',
            'wp_ajax_fetchSettingsAction' => 'fetchSettingsAction',
            'wp_ajax_fetchTaxonomiesAction' => 'fetchTaxonomiesAction',
            'wp_ajax_fetchTableTemplatesAction' => 'fetchTableTemplatesAction',
            'wp_ajax_fetchTermsAction' => 'fetchTermsAction',
            'wp_ajax_fetchUserMetaAction' => 'fetchUserMetaAction',
            'wp_ajax_flushCacheAction' => 'flushCacheAction',
            'wp_ajax_generateApiKeyAction' => 'generateApiKeyAction',
            'wp_ajax_generateGroupedFieldsAction' => 'generateGroupedFieldsAction',
            'wp_ajax_generateFlexibleBlockAction' => 'generateFlexibleBlockAction',
            'wp_ajax_generateFlexibleGroupedFieldsAction' => 'generateFlexibleGroupedFieldsAction',
            'wp_ajax_generateGutenbergTemplateAction' => 'generateGutenbergTemplateAction',
            'wp_ajax_globalSettingsAction' => 'globalSettingsAction',
            'wp_ajax_healthCheckAction' => 'healthCheckAction',
            'wp_ajax_importDatasetAction' => 'importDatasetAction',
            'wp_ajax_importFileAction' => 'importFileAction',
            'wp_ajax_languagesAction' => 'languagesAction',
            'wp_ajax_regeneratePostLabelsAction' => 'regeneratePostLabelsAction',
            'wp_ajax_regenerateTaxonomyLabelsAction' => 'regenerateTaxonomyLabelsAction',
            'wp_ajax_resetCustomPostTypesAction' => 'resetCustomPostTypesAction',
            'wp_ajax_resetTaxonomiesAction' => 'resetTaxonomiesAction',
            'wp_ajax_runRepairAction' => 'runRepairAction',
            'wp_ajax_saveCustomPostTypeAction' => 'saveCustomPostTypeAction',
            'wp_ajax_savePermissionAction' => 'savePermissionAction',
            'wp_ajax_saveFormAction' => 'saveFormAction',
            'wp_ajax_saveFormFieldsAction' => 'saveFormFieldsAction',
            'wp_ajax_saveFormSubmissionAction' => 'saveFormSubmissionAction',
            'wp_ajax_saveDatasetAction' => 'saveDatasetAction',
            'wp_ajax_saveMetaAction' => 'saveMetaAction',
            'wp_ajax_saveOptionPagesAction' => 'saveOptionPagesAction',
            'wp_ajax_saveSettingsAction' => 'saveSettingsAction',
            'wp_ajax_saveTaxonomyAction' => 'saveTaxonomyAction',
            'wp_ajax_saveUserMetaAction' => 'saveUserMetaAction',
            'wp_ajax_syncPostsAction' => 'syncPostsAction',
            'wp_ajax_sluggifyAction' => 'sluggifyAction',
            'wp_ajax_isWPGraphQLActiveAction' => 'isWPGraphQLActiveAction',
            'wp_ajax_isOxygenBuilderActiveAction' => 'isOxygenBuilderActiveAction',
            'wp_ajax_isBBThemeBuilderActiveAction' => 'isBBThemeBuilderActiveAction',
            'wp_ajax_wpmlConfigAction' => 'wpmlConfigAction',
            'wp_ajax_saveTableTemplate' => 'saveTableTemplate',
            'wp_ajax_saveWPMLConfigAction' => 'saveWPMLConfigAction',
        ];
    }

	/**
	 * Define admin pages
	 *
	 * @throws \Exception
	 */
    private function setPages()
    {
        if(ACPT_License_Manager::isLicenseValid()){

            $pages = [
                [
                    'pageTitle' => 'Advanced Custom Post Types',
                    'menuTitle' => 'ACPT',
                    'capability' => 'manage_options',
                    'menuSlug' => ACPT_PLUGIN_NAME,
                    'template' => 'app',
                    'iconUrl' => plugins_url( 'advanced-custom-post-type/assets/static/img/advanced-custom-post-type-icon.svg'),
                    'position' => 50,
                ]
            ];

	        if(Settings::get(SettingsModel::ENABLE_CPT, 1) == 1){
		        $pages[] = [
			        'parentSlug' => ACPT_PLUGIN_NAME,
			        'pageTitle' => translate('Custom Post Types', ACPT_PLUGIN_NAME),
			        'menuTitle' => translate('Custom Post Types', ACPT_PLUGIN_NAME),
			        'capability' => 'manage_options',
			        'menuSlug' => ACPT_PLUGIN_NAME,
			        'template' => 'app',
			        'position' => 51,
		        ];
	        }

	        if(Settings::get(SettingsModel::ENABLE_TAX,1) == 1){
		        $pages[] = [
			        'parentSlug' => ACPT_PLUGIN_NAME,
			        'pageTitle' => translate('Taxonomies', ACPT_PLUGIN_NAME),
			        'menuTitle' => translate('Taxonomies', ACPT_PLUGIN_NAME),
			        'capability' => 'manage_options',
			        'menuSlug' => ACPT_PLUGIN_NAME . '#/taxonomies',
			        'template' => 'app',
			        'position' => 52,
		        ];
	        }

	        if(Settings::get(SettingsModel::ENABLE_OP, 1) == 1){
		        $pages[] = [
			        'parentSlug' => ACPT_PLUGIN_NAME,
			        'pageTitle' => translate('Option pages', ACPT_PLUGIN_NAME),
			        'menuTitle' => translate('Option pages', ACPT_PLUGIN_NAME),
			        'capability' => 'manage_options',
			        'menuSlug' => ACPT_PLUGIN_NAME . '#/option-pages',
			        'template' => 'app',
			        'position' => 53,
		        ];
	        }

	        if(Settings::get(SettingsModel::ENABLE_META, 1) == 1){
		        $pages[] = [
			        'parentSlug' => ACPT_PLUGIN_NAME,
			        'pageTitle' => translate('Field groups', ACPT_PLUGIN_NAME),
			        'menuTitle' => translate('Field groups', ACPT_PLUGIN_NAME),
			        'capability' => 'manage_options',
			        'menuSlug' => ACPT_PLUGIN_NAME . '#/meta',
			        'template' => 'app',
			        'position' => 54,
		        ];
	        }

            if(Settings::get(SettingsModel::ENABLE_FORMS, 0) == 1){
	            $pages[] = [
		            'parentSlug' => ACPT_PLUGIN_NAME,
		            'pageTitle' => translate('Forms', ACPT_PLUGIN_NAME),
		            'menuTitle' => translate('Forms', ACPT_PLUGIN_NAME),
		            'capability' => 'manage_options',
		            'menuSlug' => ACPT_PLUGIN_NAME . '#/forms',
		            'template' => 'app',
		            'position' => 55,
                ];
            }

            if(WPMLChecker::isActive()){
	            $pages[] = [
		            'parentSlug' => ACPT_PLUGIN_NAME,
		            'pageTitle' => translate('WPML', ACPT_PLUGIN_NAME),
		            'menuTitle' => translate('WPML', ACPT_PLUGIN_NAME),
		            'capability' => 'manage_options',
		            'menuSlug' => ACPT_PLUGIN_NAME . '#/wpml',
		            'template' => 'app',
		            'position' => 56,
	            ];
            }

	        if(PolylangChecker::isActive()){
		        $pages[] = [
			        'parentSlug' => ACPT_PLUGIN_NAME,
			        'pageTitle' => translate('Polylang', ACPT_PLUGIN_NAME),
			        'menuTitle' => translate('Polylang', ACPT_PLUGIN_NAME),
			        'capability' => 'manage_options',
			        'menuSlug' => ACPT_PLUGIN_NAME . '#/polylang',
			        'template' => 'app',
			        'position' => 56,
		        ];
	        }

            $pages[] = [
		        'parentSlug' => ACPT_PLUGIN_NAME,
		        'pageTitle' => translate('Tools', ACPT_PLUGIN_NAME),
		        'menuTitle' => translate('Tools', ACPT_PLUGIN_NAME),
		        'capability' => 'manage_options',
		        'menuSlug' => ACPT_PLUGIN_NAME . '#/tools',
		        'template' => 'app',
		        'position' => 57,
	        ];

	        $pages[] = [
		        'parentSlug' => ACPT_PLUGIN_NAME,
		        'pageTitle' => translate('Settings', ACPT_PLUGIN_NAME),
		        'menuTitle' => translate('Settings', ACPT_PLUGIN_NAME),
		        'capability' => 'manage_options',
		        'menuSlug' => ACPT_PLUGIN_NAME . '#/settings',
		        'template' => 'app',
		        'position' => 59,
	        ];

            $pages[] = [
	            'parentSlug' => ACPT_PLUGIN_NAME,
	            'pageTitle' => translate('License', ACPT_PLUGIN_NAME),
	            'menuTitle' => translate('License', ACPT_PLUGIN_NAME),
	            'capability' => 'manage_options',
	            'menuSlug' => ACPT_PLUGIN_NAME . '#/license',
	            'template' => 'app',
	            'position' => 60,
            ];

        } else {
            $pages = [
                [
                    'pageTitle' => 'Advanced Custom Post Types',
                    'menuTitle' => 'ACPT',
                    'capability' => 'manage_options',
                    'menuSlug' => ACPT_PLUGIN_NAME,
                    'template' => 'activate_license',
                    'iconUrl' => plugins_url( 'advanced-custom-post-type/assets/static/img/advanced-custom-post-type-icon.svg'),
                    'position' => 50,
                ],
            ];
        }

        $this->pages = $pages;
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
        $screen = get_current_screen();
        $pagenow = Url::pagenow();

        // ACPT app assets
        foreach ($this->pages as $page){
	        if(isset($_GET['page']) and $page['menuSlug'] === $_GET['page']){
		        $viteAssets = Assets::load('assets/src/App/index.jsx', 'acpt_app');

		        foreach ($viteAssets['css'] as $viteCssAssetKey => $viteCssAsset){
			        wp_enqueue_style( ACPT_PLUGIN_NAME.'__'.$viteCssAssetKey, $viteCssAsset, [], ACPT_PLUGIN_VERSION, 'all');
		        }

		        foreach ($viteAssets['js'] as $viteJsAssetKey => $viteJsAsset){
			        wp_enqueue_script(ACPT_PLUGIN_NAME.'__'.$viteJsAssetKey, $viteJsAsset, ['wp-element'],  ACPT_PLUGIN_VERSION, true);
			        wp_localize_script(ACPT_PLUGIN_NAME.'__'.$viteJsAssetKey, 'acpt', ['pluginsUrl' => plugins_url()]);
		        }
            }
        }

        // media
        if ( ! function_exists( 'wp_enqueue_media' ) ) {
            require ABSPATH . 'wp-admin/includes/media.php';
        }

        wp_enqueue_media();

	    // Validator
	    if($pagenow === 'post-new.php' or $pagenow === 'post.php'){
		    $customPostTypeMetaBoxGenerator = new CustomPostTypeMetaBoxGenerator();
		    $customPostTypeMetaBoxGenerator->enqueueScripts('save-cpt');
	    }

        // Quick-edit assets
        if($pagenow === 'edit.php'){
	        wp_enqueue_script( ACPT_PLUGIN_NAME.'__quick_edit_js', plugins_url( 'advanced-custom-post-type/assets/static/js/quick_edit.js'), ['jquery'], ACPT_PLUGIN_VERSION, true);
        }

	    // Gutenberg assets
        if($screen !== null and $screen->is_block_editor === true){
            $viteAssets = Assets::load('assets/src/Gutenberg/index.jsx', 'block_js');

            foreach ($viteAssets['css'] as $viteCssAssetKey => $viteCssAsset){
                $this->staticCssAssets[$viteCssAssetKey] = $viteCssAsset;
            }

            foreach ($viteAssets['js'] as $viteJsAssetKey => $viteJsAsset){
                $this->staticJsAssets[$viteJsAssetKey] = [
                    'path' => $viteJsAsset,
                    'dep'  => ['wp-blocks', 'wp-element'],
                ];
            }
        }

        // Other admin assets
        if(!$this->isACPTAppPage()){

            $allowedPages = [
                'site-editor.php',
                'post-new.php',
                'post.php',
                'profile.php',
                'user-edit.php',
                'edit-tags.php',
                'term.php',
                'upload.php',
                'admin.php',
                'comment.php',
                'edit-comments.php',
            ];

	        if(in_array($pagenow, $allowedPages)) {
		        // other static assets here
		        foreach ($this->staticCssAssets as $key => $asset){
			        wp_enqueue_style( ACPT_PLUGIN_NAME.'__'.$key, $asset, [], ACPT_PLUGIN_VERSION, 'all');
		        }

		        foreach ($this->staticJsAssets as $key => $asset){
			        wp_enqueue_script( ACPT_PLUGIN_NAME.'__'.$key, $asset['path'], isset($asset['dep']) ? $asset['dep'] : [], ACPT_PLUGIN_VERSION, true);
		        }

		        //
		        // =================================
		        // WP DEFAULT UTILITIES
		        // =================================
		        //

		        // color picker
		        wp_enqueue_style( 'wp-color-picker' );
		        wp_enqueue_script( 'wp-color-picker' );

		        // codemirror
		        $cm_settings['codeEditor'] = wp_enqueue_code_editor(array('type' => 'text/html'));
		        wp_localize_script('jquery', 'cm_settings', $cm_settings);
		        wp_enqueue_script('wp-theme-plugin-editor');
		        wp_enqueue_style('wp-codemirror');

		        // media
		        wp_enqueue_media();

		        //
		        // =================================
		        // ICONIFY
		        // =================================
		        //
		        wp_register_script('iconify',  plugins_url( 'advanced-custom-post-type/assets/vendor/iconify/iconify.min.js') );
		        wp_enqueue_script('iconify');
	        }
        }
    }

	/**
	 * Invalid CustomPostTypeMetaGroupsGenerator cache when creating a new post
	 *
	 * @param $new_status
	 * @param $old_status
	 * @param $post
	 */
    public function invalidPostIdsCache($new_status, $old_status, $post)
    {
        $allowedStatus = [
            'draft',
            'publish',
	        'private',
            'auto-draft',
	        'inherit'
        ];

	    if (
            in_array($new_status, $allowedStatus) and
            in_array($old_status, $allowedStatus)
        ) {
		    ACPT_Lite_DB::invalidateCacheTag(CustomPostTypeMetaGroupsGenerator::class);
	    }
    }

    /**
     * Add filters here
     */
    public function addFilters()
    {
	    add_filter( 'plugin_action_links', [ $this, 'addPluginLinks' ], PHP_INT_MAX, 2 );
        add_filter('script_loader_tag', [$this, 'addAsyncDeferAttribute'], 10, 2);
        add_filter('block_categories_all', [$this, 'addGutenbergBlocks'], 10, 2 );
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

	    if ( 'advanced-custom-post-type/advanced-custom-post-type.php' === $plugin_file ) {
	        if(ACPT_License_Manager::isLicenseValid()){
		        $actionLinks['settings'] = '<a href="'.admin_url( 'admin.php?page=advanced-custom-post-type#/settings' ).'">'.Translator::translate('Settings').'</a>';
	        }

		    $actionLinks['documentation'] = '<a target="_blank" href="https://docs.acpt.io/">'.Translator::translate('Documentation').'</a>';
	    }

	    return array_merge($actionLinks, $actions);
    }

    /**
     * Register custom Gutember
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
        add_shortcode('acpt_form', [new FormShortcode(), 'render']);
        add_shortcode('acpt', [new PostMetaShortcode(), 'render']);
        add_shortcode('acpt_user', [new UserMetaShortcode(), 'render']);
        add_shortcode('acpt_tax', [new TaxonomyMetaShortcode(), 'render']);
        add_shortcode('acpt_option', [new OptionPageMetaShortcode(), 'render']);
        add_shortcode('acpt_media', [new AttachmentMetaShortcode(), 'render']);
        add_shortcode('acpt_comm', [new CommentMetaShortcode(), 'render']);
    }

	/**
	 * @param bool $lazy
	 *
	 * @throws \Exception
	 */
    private function registerCustomPostTypesAndTaxonomies($lazy = false)
    {
        // run this code after all plugins are loaded
        try {
            $postTypeMetaGroups = [];

            // prevents any orphan meta box/field
            MetaRepository::removeOrphanBoxesAndFields();

            // generate meta groups
            if($lazy === false){

                $pagenow = Url::pagenow();

                // enable savePost function only on post and quick edit pages
                $allowedPages = [
                    'admin.php',
                    'admin-ajax.php',
                    'edit.php',
                    'post.php',
                    'post-new.php'
                ];

                $postTypeAssociatedWithGroup = MetaRepository::getAllAssociatedPostTypesAndTaxonomies()['postTypeNames'];
                $registeredACPTPostTypeNames = CustomPostTypeRepository::getNames();
                $postTypeNames = array_unique(array_merge($postTypeAssociatedWithGroup, $registeredACPTPostTypeNames));

                foreach ($postTypeNames as $postTypeName){
                    $metaGroupModels = MetaRepository::get([
                        'belongsTo' => MetaTypes::CUSTOM_POST_TYPE,
                        'find' => $postTypeName,
                        'clonedFields' => true
                    ]);

                    if(!empty($metaGroupModels) and Settings::get(SettingsModel::ENABLE_META, 1) == 1){
                        $postTypeMetaGroupsGenerator = new CustomPostTypeMetaGroupsGenerator($postTypeName, $metaGroupModels);
                        $postTypeMetaGroups[$postTypeName] = $postTypeMetaGroupsGenerator->generate();
                    }

                    // register the "save_post" hook for all custom post types
                    if(in_array($pagenow, $allowedPages) and !empty($postTypeMetaGroups[$postTypeName])){
                        $metaGroups = $postTypeMetaGroups[$postTypeName];

                        $hookName = 'save_post_'.$postTypeName;

                        // can't use a filter here, because integration are not yet running
                        if(ACPT_Lite_WooCommerce::active() and $postTypeName === 'shop_order'){
                            $hookName = 'woocommerce_process_shop_order_meta';
                        }

                        add_action($hookName, function ($postId) use($metaGroups) {
                            WPUtils::handleSavePost($postId, $metaGroups);
                        });
                    }
                }
            }

            // register here ACTP CPTs and Taxonomies
            foreach (CustomPostTypeRepository::get() as $postTypeModel){
                $postTypeName = $postTypeModel->getName();
                $ACPTPostTypeNames[] = $postTypeName;
                $customPostType = new CustomPostTypeGenerator($postTypeModel, $postTypeMetaGroups[$postTypeName] ?? []);
            }

        } catch (\Exception $exception){
            // do nothing
        }
    }

    private function registerAttachmentMeta()
    {
        (new AttachmentMetaGroupsGenerator())->generate();
    }

    private function registerCommentMeta()
    {
	    (new CommentMetaGroupsGenerator())->generate();
    }

    private function addCommentColumnsToAdminPanel()
    {
	    CommentAdminColumnsGenerator::addColumns();
    }

    /**
     * @throws \Exception
     */
    private function registerTaxonomyMeta()
    {
        (new TaxonomyMetaGroupsGenerator())->generate();
    }

    /**
     * Add CPT columns to the admin panel
     * (including quick edit and filter capabilities)
     *
     * @throws \Exception
     */
    private function addCustomPostTypeColumnsToAdminPanel()
    {
        $acptPostTypes = CustomPostTypeRepository::get();
        $postTypesAssociatedWithGroup = MetaRepository::getAllAssociatedPostTypesAndTaxonomies()['postTypeNames'];
        $notACPTPostTypes = $postTypesAssociatedWithGroup;

        foreach ($acptPostTypes as $postTypeModel){
	        CustomPostTypeAdminColumnsGenerator::addColumns($postTypeModel);

            if (($key = array_search($postTypeModel->getName(), $notACPTPostTypes)) !== false) {
                unset($notACPTPostTypes[$key]);
            }
        }

        foreach ($notACPTPostTypes as $notACPTPostType){
            CustomPostTypeAdminColumnsGenerator::addColumns($notACPTPostType);
        }
    }

    /**
     * Add Taxonomy columns to the admin panel
     *
     * @throws \Exception
     */
    private function addTaxonomyColumnsToAdminPanel()
    {
        $acptTaxonomies = TaxonomyRepository::get();
        $taxonomiesAssociatedWithGroup = MetaRepository::getAllAssociatedPostTypesAndTaxonomies()['taxonomyNames'];
        $notACPTTaxonomies = $taxonomiesAssociatedWithGroup;

        foreach ($acptTaxonomies as $taxonomyModel){
            TaxonomyAdminColumnsGenerator::addColumns($taxonomyModel);

            if (($key = array_search($taxonomyModel->getSlug(), $notACPTTaxonomies)) !== false) {
                unset($notACPTTaxonomies[$key]);
            }
        }

        foreach ($notACPTTaxonomies as $notACPTTaxonomy){
            TaxonomyAdminColumnsGenerator::addColumns($notACPTTaxonomy);
        }
    }

    /**
     * @throws \Exception
     */
    private function registerUserMeta()
    {
        (new UserMetaGroupsGenerator())->generate();
    }

    /**
     * Add User meta columns to show in the admin panel
     */
    private function addUserMetaColumnsToShow()
    {
	    UserAdminColumnsGenerator::addColumns();
    }

	/**
	 * Register option pages
	 *
	 * @param bool $lazy
	 *
	 * @throws \Exception
	 */
    private function registerOptionPages($lazy = false)
    {
	    $optionPages = OptionPageRepository::get([]);

	    foreach ($optionPages as $optionPage){
		    $optionPageGenerator = new OptionPageGenerator($this->loader, $optionPage, $lazy);
		    $optionPageGenerator->registerPage();
	    }
    }

    /**
     * Register API fields
     */
    private function registerRestFields()
    {
        $this->loader->addAction( 'rest_api_init', new ACPT_Lite_Api_Rest_Fields(), 'registerRestFields' );
    }

    /**
     * Register API endpoints
     */
    private function registerRestEndpoint()
    {
        $this->loader->addAction( 'rest_api_init', new ACPT_Api_V1(), 'registerRestRoutes' );
    }

	/**
	 * Register roles and set permissions
	 */
    private function registerRolesAndSetPermissions()
    {
	    $this->loader->addAction( 'admin_init', new ACPT_Permissions(), 'setPermissions', 999);
    }

    /**
     * Include PHP functions
     */
    private function includeFunctions()
    {
	    require_once ACPT_PLUGIN_DIR_PATH.'/functions/acpt_functions.php';
    }

    /**
     * Run integrations
     */
    private function runIntegrations()
    {
        $integrations = [
	        ACPT_Breakdance::class,
	        ACPT_Bricks::class,
	        ACPT_Divi::class,
	        ACPT_Lite_Elementor::class,
	        ACPT_Elementor_Pro::class,
	        ACPT_Lite_Gutenberg::class,
	        ACPT_Oxygen::class,
	        ACPT_Polylang::class,
	        ACPT_RankMath::class,
	        ACPT_Lite_WooCommerce::class,
	        ACPT_WPAllExport::class,
	        ACPT_WPAllImport::class,
	        ACPT_WPGraphQL::class,
	        ACPT_WPGridBuilder::class,
	        ACPT_WPML::class,
            ACPT_Yoast::class,
	        ACPT_Zion::class,
        ];

        foreach ($integrations as $integration){
            /** @var AbstractIntegration $instance */
            $instance = new $integration;
            $instance->run();
            Profiler::lap('runIntegrations');
        }
    }

	/**
	 * Close session before curl request
	 *
	 * @param $curlhandle
	 */
	public function curlBeforeRequest($curlhandle)
	{
		Session::close();
	}

	/**
	 * @param $timeout
	 *
	 * @return int
	 */
	public function extendHttpRequestTimeout($timeout)
    {
		return 30; // seconds
	}

	/**
	 * Fetch the admin menu and add it to document.globals
	 */
	public function fetchAdminMenu()
	{
		$home = get_option('home');
		$pluginsUrl = plugins_url();

		if(Server::isSecure()){
			$home = Url::secureUrl($home);
			$pluginsUrl = Url::secureUrl($pluginsUrl);
		}

		wp_register_script( 'globals-menu-run', '', [], '', true );
		wp_enqueue_script('globals-menu-run');
		wp_add_inline_script( 'globals-menu-run', '
            document.globals = {site_url: "'.$home.'", plugins_url: "'.$pluginsUrl.'", menu: '. json_encode($GLOBALS['menu']).', google_maps_key: "'.($this->googleMapsApiKey ? $this->googleMapsApiKey : "").'"};
		');
	}

	/**
	 * @return bool
	 */
	private function isACPTAppPage()
    {
        $pagenow = Url::pagenow();

	    return (
		    $pagenow === 'admin.php' and
		    isset($_GET['page']) and
		    $_GET['page'] === ACPT_PLUGIN_NAME
	    );
    }

	/**
	 * Run admin scripts
	 *
	 * @throws \Exception
	 */
    public function run()
    {
        // filters
        Profiler::start('addFilters');
	    $this->addFilters();
	    Profiler::stop('addFilters');

	    // pages and assets
	    Profiler::start('addPages');
	    $this->loader->addAction('admin_menu', $this, 'addPages');
	    Profiler::stop('addPages');

	    Profiler::start('enqueueAssets');
	    $this->loader->addAction('admin_enqueue_scripts', $this, 'enqueueAssets');
	    Profiler::stop('enqueueAssets');

	    // admin menu
	    Profiler::start('fetchAdminMenu');
	    $this->loader->addAction('admin_menu', $this, 'fetchAdminMenu');
	    Profiler::stop('fetchAdminMenu');

	    // register roles and set permissions
	    Profiler::start('registerRolesAndSetPermissions');
	    $this->registerRolesAndSetPermissions();
	    Profiler::stop('registerRolesAndSetPermissions');

		// run the application only if is activated
	    if(ACPT_License_Manager::isLicenseValid()){

		    Profiler::start('transitionPostStatus');
		    $this->loader->addAction('transition_post_status', $this, 'invalidPostIdsCache', 10, 3);
		    Profiler::stop('transitionPostStatus');

		    Profiler::start('siteHealth');
		    $this->loader->addAction('requests-curl.before_request', $this, 'curlBeforeRequest', 9999);
		    $this->loader->addAction('http_request_timeout', $this, 'extendHttpRequestTimeout');
		    Profiler::stop('siteHealth');

		    // ajax calls
		    Profiler::start('ajaxCalls');
		    foreach ($this->ajaxActions as $action => $callback){
			    $this->loader->addAction($action, $this->ajax, $callback);
			    Profiler::lap('ajaxCalls');
		    }
		    Profiler::stop('ajaxCalls');

		    // register custom post types and taxonomies. Lazy load custom post type metas
		    Profiler::start('registerCustomPostTypesAndTaxonomies');
		    $this->registerCustomPostTypesAndTaxonomies($this->isACPTAppPage());
		    Profiler::stop('registerCustomPostTypesAndTaxonomies');

		    if(Settings::get(SettingsModel::ENABLE_OP, 1) == 1){
			    // add option pages
			    Profiler::start('registerOptionPages');
			    $this->registerOptionPages($this->isACPTAppPage());
			    Profiler::stop('registerOptionPages');
		    }

		    // API REST
		    Profiler::start('RestFieldsAndEndpoints');
		    $this->registerRestFields();
		    $this->registerRestEndpoint();
		    Profiler::stop('RestFieldsAndEndpoints');

		    // lazy load, these functions are not needed in App page
		    if(!$this->isACPTAppPage()){

                // shortcodes
			    Profiler::start('addShortcodes');
			    $this->addShortcodes();
			    Profiler::stop('addShortcodes');

			    if(Settings::get(SettingsModel::ENABLE_META, 1) == 1){
				    // register attachment meta
				    Profiler::start('registerAttachmentMeta');
				    $this->registerAttachmentMeta();
				    Profiler::stop('registerAttachmentMeta');

				    // register comments meta
				    Profiler::start('registerCommentMeta');
				    $this->registerCommentMeta();
				    Profiler::stop('registerCommentMeta');

				    // add columns to show in the list panel
				    Profiler::start('addCustomPostTypeColumnsToAdminPanel');
				    $this->addCommentColumnsToAdminPanel();
				    Profiler::stop('addCustomPostTypeColumnsToAdminPanel');

				    // register taxonomy meta
				    Profiler::start('registerTaxonomyMeta');
				    $this->registerTaxonomyMeta();
				    Profiler::stop('registerTaxonomyMeta');

				    // add columns to show in the CPT list panel
				    Profiler::start('addCustomPostTypeColumnsToAdminPanel');
				    $this->addCustomPostTypeColumnsToAdminPanel();
				    Profiler::stop('addCustomPostTypeColumnsToAdminPanel');

                    // add columns to show in the taxonomy list panel
                    Profiler::start('addTaxonomyColumnsToAdminPanel');
                    $this->addTaxonomyColumnsToAdminPanel();
                    Profiler::stop('addTaxonomyColumnsToAdminPanel');

				    // register user meta
				    Profiler::start('registerUserMeta');
				    $this->registerUserMeta();
				    Profiler::stop('registerUserMeta');

				    // add user meta columns to show in the admin panel
				    Profiler::start('addUserMetaColumnsToShow');
				    $this->addUserMetaColumnsToShow();
				    Profiler::stop('addUserMetaColumnsToShow');
			    }

			    // functions and hooks
			    Profiler::start('includeFunctions');
			    $this->includeFunctions();
			    Profiler::stop('includeFunctions');

			    // run integrations
			    Profiler::start('runIntegrations');
			    $this->runIntegrations();
			    Profiler::stop('runIntegrations');
		    }
	    }
    }
}
