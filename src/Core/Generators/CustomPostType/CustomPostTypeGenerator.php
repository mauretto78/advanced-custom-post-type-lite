<?php

namespace ACPT_Lite\Core\Generators\CustomPostType;

use ACPT_Lite\Constants\ReservedTerms;
use ACPT_Lite\Core\Generators\AbstractGenerator;
use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\CustomPostType\CustomPostTypeModel;
use ACPT_Lite\Core\Models\Meta\MetaGroupModel;
use ACPT_Lite\Core\Models\Settings\SettingsModel;
use ACPT_Lite\Core\Models\Taxonomy\TaxonomyModel;
use ACPT_Lite\Core\Repository\TaxonomyRepository;
use ACPT_Lite\Utils\Settings\Settings;
use ACPT_Lite\Utils\Wordpress\Translator;
use ACPT_Lite\Utils\Wordpress\WPAttachment;

/**
 * *************************************************
 * CustomPostTypeGenerator class
 * *************************************************
 *
 * @author Mauro Cassani
 * @link https://github.com/mauretto78/
 */
class CustomPostTypeGenerator extends AbstractGenerator
{
	/**
	 * @var CustomPostTypeModel
	 */
    private $postTypeModel;

    /**
     * The name of the post type.
     * @var string
     */
    private $postTypeName;

	/**
	 * @var bool
	 */
    private $isNative;

    /**
     * A list of user-specific options for the post type.
     * @var array
     */
    private $postTypeArgs;

	/**
	 * @var bool
	 */
	private $isWooCommerce;
	/**
	 * @var MetaGroupModel[]
	 */
	private array $metaGroups;

	/**
	 * Sets default values, registers the passed post type, and
	 * listens for when the post is saved.
	 *
	 * @param CustomPostTypeModel $postTypeModel
	 * @param MetaGroupModel[] $metaGroups
	 */
    public function __construct(CustomPostTypeModel $postTypeModel, array $metaGroups = [])
    {
	    $this->postTypeModel = $postTypeModel;
	    $this->isWooCommerce = $postTypeModel->isWooCommerce();
        $this->postTypeName = strtolower($postTypeModel->getName());
	    $this->isNative = $postTypeModel->isNative();
	    $this->metaGroups = $metaGroups;

        $this->init([&$this, "registerPostType"]);
        $this->postTypeLink([&$this, "rewritePostTypePermalinks"]);

        add_action( 'admin_notices', [$this, 'legacyAdminNotices' ]);
    }

    /**
     * Unregisters a post type in the WP db.
     */
    public function unregisterPostType()
    {
        unregister_post_type(ucwords($this->postTypeName));
    }

    /**
     * Registers a new post type in the WP db.
     */
    public function registerPostType()
    {
        try {
	        $taxonomyNames = [];

            $this->postTypeArgs = array_merge(
                [
                    'supports' => $this->postTypeModel->getSupports(),
                    'label' => $this->postTypeModel->getPlural(),
                    'labels' => $this->postTypeModel->getLabels(),
                    "menu_icon" => $this->postTypeModel->renderIcon(),
                ],
                $this->postTypeModel->getSettings()
            );

	        // register taxonomies first
	        if(Settings::get(SettingsModel::ENABLE_TAX, 1) == 1){

		        $taxonomies = TaxonomyRepository::get([
			        'customPostType' => $this->postTypeName
		        ]);

		        foreach ($taxonomies as $taxonomyModel){
			        if(!$taxonomyModel->isNative()){
				        if(!in_array($taxonomyModel->getSlug(), ReservedTerms::list())){
					        $this->registerTaxonomy($taxonomyModel);
				        }
			        } else {
				        register_taxonomy_for_object_type($taxonomyModel->getSlug(), $this->postTypeName);
			        }

			        $taxonomyNames[] = $taxonomyModel->getSlug();
		        }
	        }

	        // register custom post type if not native and is not WooCommerce
	        // (WooCommerce product cpt does not need to be registered twice)
	        if(Settings::get(SettingsModel::ENABLE_CPT, 1) == 1){

		        if(!$this->isNative and !$this->isWooCommerce){
			        $n = ucwords($this->postTypeName);
			        $n = str_replace("_", " ", $n);

			        $args = [
				        "label" => $n,
				        'singular_name' => $n,
				        'labels' => [
					        'add_new_item' => 'Add ' . $n,
					        'add_new' => 'Add ' . $n,
					        'view_item' => 'View ' . $n,
					        'search_items' => 'Search ' . $n,
					        'edit_item' => 'Modify ' . $n,
					        'not_found' => 'No ' . $n . ' was found'
				        ],
				        "public" => true,
				        "publicly_queryable" => true,
				        "query_var" => true,
				        "menu_icon" => "dashicons-admin-site-alt3",
				        "rewrite" => true,
				        "capability_type" => $this->postTypeName,
				        "hierarchical" => false,
				        "menu_position" => null,
				        "supports" => ["title", "editor", "thumbnail"],
				        'has_archive' => true,
				        "show_in_rest" => true,
				        'taxonomies' => $taxonomyNames
			        ];

			        // custom_rewrite
			        if(isset($this->postTypeArgs['rewrite']) and $this->postTypeArgs['rewrite'] === true and !empty($this->postTypeArgs['custom_rewrite'])){
                        $this->postTypeArgs['rewrite'] = [
                            'slug' => $this->postTypeArgs['custom_rewrite'],
                        ];
			        }

			        // with_front
                    if(isset($this->postTypeArgs['with_front'])){

                        if(!is_array($this->postTypeArgs['rewrite'])){
                            $this->postTypeArgs['rewrite'] = [];
                        }

                        $this->postTypeArgs['rewrite']['with_front'] = $this->postTypeArgs['with_front'];
                    }

			        // Use the translated strings
			        $this->postTypeArgs['label'] = Translator::translateString($this->postTypeModel->getPlural());
			        $this->postTypeArgs['singular_name'] = Translator::translateString($this->postTypeModel->getSingular());

			        $labelsArray = [
				        'menu_name',
				        'all_items',
				        'add_new',
				        'add_new_item',
				        'edit_item',
				        'new_item',
				        'view_item',
				        'view_items',
				        'search_item',
				        'not_found',
				        'not_found_in_trash',
				        'filter_items_list',
				        'items_list_navigation',
				        'items_list',
				        'item_published',
				        'item_published_privately',
				        'item_reverted_to_draft',
				        'item_scheduled',
				        'item_updated',
			        ];

			        foreach ($labelsArray as $label){
				        if(isset($this->postTypeModel->getLabels()[$label])){
					        $this->postTypeArgs['labels'][$label] = Translator::translateString($this->postTypeModel->getLabels()[$label]);
				        }

				        // copy `menu_name` into `name`
                        $this->postTypeArgs['labels']['name'] = $this->postTypeArgs['labels']['menu_name'];
			        }

			        // Take user provided options, and override the defaults.
			        $args = array_merge($args, $this->postTypeArgs);

			        // SVG icons
			        if(Strings::isUrl($args['menu_icon'])){
				        $attachment = WPAttachment::fromUrl($args['menu_icon']);
				        if($attachment->isSVG()){
					        $args['menu_icon'] = 'data:image/svg+xml;base64,' . base64_encode( file_get_contents($attachment->getPath()) );
				        }
			        }

			        // Override capabilities for roles permissions managing
			        if($this->postTypeModel->hasPermissions()){
				        $args['map_meta_cap'] = true;

				        if($args['capability_type'] === 'post'){
					        $args['capabilities'] = [
						        'edit_post' => 'edit_'.$this->postTypeName,
						        'edit_posts' => 'edit_'.$this->postTypeName.'s',
						        'edit_private_posts' => 'edit_private_'.$this->postTypeName.'s',
						        'edit_published_posts' => 'edit_published_'.$this->postTypeName.'s',
						        'edit_others_posts' =>  'edit_others_'.$this->postTypeName.'s',
						        'publish_post' => 'publish_'.$this->postTypeName,
						        'publish_posts' => 'publish_'.$this->postTypeName.'s',
						        'read_post' => 'read_'.$this->postTypeName.'s',
						        'read_private_posts' => 'read_private_'.$this->postTypeName.'s',
						        'delete_post' => 'delete_'.$this->postTypeName,
						        'delete_posts' => 'delete_'.$this->postTypeName.'s',
						        'delete_private_posts' => 'delete_private_'.$this->postTypeName.'s',
						        'delete_published_posts' => 'delete_published_'.$this->postTypeName.'s',
						        'delete_others_posts' => 'delete_others_'.$this->postTypeName.'s',
					        ];
				        }
			        }

			        // register post type only if does not exists
			        if(!post_type_exists($this->postTypeName)){

                        // Empty supports
                        if(empty($args['supports'])){
                            $args['supports'] = [""];
                        }

				        register_post_type($this->postTypeName, $args);

				        // Manually add settings
				        if(isset($args['settings'])){
					        foreach ($args['settings'] as $setting){
						        if(!post_type_supports( $this->postTypeName, $setting )){
							        add_post_type_support( $this->postTypeName, $setting );
						        }
					        }
				        }

				        // Modify default messages
                        add_filter('post_updated_messages', [$this, "updatedMessages"], 10, 1);
                        add_filter( 'bulk_post_updated_messages', [$this, "updatedBulkMessages"], 10, 2 );
                    }
		        }
	        }

        } catch (\Exception $exception){}
    }

    /**
     * @param array $messages
     * @return array
     */
    public function updatedMessages($messages)
    {
        $n = Translator::translateString($this->postTypeModel->getSingular());

        global $post;

        if($post instanceof \WP_Post){

            $viewPostLinkHtml = sprintf(
                ' <a href="%1$s">%2$s</a>',
                esc_url( get_the_permalink($post->ID) ),
                $this->translateMessage('view')
            );

            $messages[$this->postTypeName] = [
                0  => '', // Unused. Messages start at index 1.
                1  => $this->translateMessage('updated') . $viewPostLinkHtml,
                2  => __( 'Custom field updated.' ),
                3  => __( 'Custom field deleted.'),
                4  => $this->translateMessage('updated'),
                /* translators: %s: date and time of the revision */
                5  => isset( $_GET['revision'] ) ? sprintf( __( $n . ' restored to revision from %s', ACPT_LITE_PLUGIN_NAME ), wp_post_revision_title( (int) $_GET['revision'], false ) ) : false,
                6  => $this->translateMessage('published') . $viewPostLinkHtml,
                7  => $this->translateMessage('saved'),
                8  => $this->translateMessage('published') . $viewPostLinkHtml,
                9  => sprintf(
                    __( $n . ' scheduled for: <strong>%1$s</strong>.' ),
                    // translators: Publish box date format, see http://php.net/date
                    date_i18n( __( 'M j, Y @ G:i' ), strtotime( $post->post_date ) )
                ),
                10 => $this->translateMessage('draft') . $viewPostLinkHtml,
            ];
        }

        return $messages;
    }

    /**
     * @param $bulkMessages
     * @param $bulkCounts
     * @return mixed
     */
    public function updatedBulkMessages($bulkMessages, $bulkCounts)
    {
        $plural = Translator::translateString($this->postTypeModel->getPlural());
        $singular = Translator::translateString($this->postTypeModel->getSingular());

        $bulkMessages[$this->postTypeName] = [
            'updated'   => _n( '%s '.$singular.' updated.', '%s '.$plural.' updated.', $bulkCounts['updated'], ACPT_LITE_PLUGIN_NAME ),
            'locked'    => _n( '%s '.$singular.' not updated, somebody is editing it.', '%s '.$plural.' not updated, somebody is editing them.', $bulkCounts['locked'], ACPT_LITE_PLUGIN_NAME ),
            'deleted'   => _n( '%s '.$singular.' permanently deleted.', '%s '.$plural.' permanently deleted.', $bulkCounts['deleted'], ACPT_LITE_PLUGIN_NAME ),
            'trashed'   => _n( '%s '.$singular.' moved to the Trash.', '%s '.$plural.' moved to the Trash.', $bulkCounts['trashed'], ACPT_LITE_PLUGIN_NAME ),
            'untrashed' => _n( '%s '.$singular.' restored from the Trash.', '%s '.$plural.' restored from the Trash.', $bulkCounts['untrashed'], ACPT_LITE_PLUGIN_NAME ),
        ];

        return $bulkMessages;
    }

    /**
     * @param $key
     * @return string|string[]
     */
    private function translateMessage($key)
    {
        $n = ucwords($this->postTypeName);
        $n = str_replace("_", " ", $n);

        $translations = [
            'view' => "View %s",
            'updated' => "%s updated.",
            'published' => "Page %s.",
            'saved' => "Page %s.",
            'submitted' => "%s submitted.",
            'draft' => "%s draft updated.",
        ];

        if(!isset($translations[$key])){
            return null;
        }

        return __(str_replace("%s", $n, $translations[$key]), ACPT_LITE_PLUGIN_NAME);
    }

    /**
     * This function rewrites post type permalinks
     *
     * @param $postLink
     * @param \WP_Post $post
     * @return string
     */
    public function rewritePostTypePermalinks($postLink, \WP_Post $post)
    {
        $currentPostTypeName = strtolower($this->postTypeModel->getName());

        if($post->post_type === $currentPostTypeName and $post->post_status === 'publish'){

            $settings = $this->postTypeModel->getSettings();

            if(isset($settings['front_url_prefix']) and $settings['front_url_prefix'] !== $currentPostTypeName){

                $frontUrlPrefix = "/";
                $frontUrlPrefix .= $settings['front_url_prefix'];

                if($settings['front_url_prefix'] !== ""){
                    $frontUrlPrefix .= "/";
                }

                return str_replace("/".$post->post_type."/", $frontUrlPrefix, $postLink);
            }

            return $postLink;
        }

        return $postLink;
    }

	/**
	 * Registers a new taxonomy, associated with the instantiated post type(s).
	 *
	 * @param TaxonomyModel $taxonomyModel
	 */
    private function registerTaxonomy(TaxonomyModel $taxonomyModel)
    {
	    $slug = $taxonomyModel->getSlug();
	    $taxonomyName = ucwords($slug);
	    $singular = Translator::translateString($taxonomyModel->getSingular());
	    $plural = Translator::translateString($taxonomyModel->getPlural());
	    $labels = $taxonomyModel->getLabels();

        $labelsArray = [
	        'name',
	        'singular_name',
	        'search_items',
	        'popular_items',
	        'all_items',
	        'parent_item',
	        'parent_item_colon',
	        'edit_item',
	        'view_item',
	        'update_item',
	        'add_new_item',
	        'new_item_name',
	        'separate_items_with_commas',
	        'add_or_remove_items',
	        'choose_from_most_used',
	        'not_found',
	        'no_terms',
	        'filter_by_item',
	        'items_list_navigation',
	        'items_list',
	        'back_to_items',
	        'item_link',
	        'item_link_description',
	        'menu_name',
	        'name_admin_bar',
	        'archives',
        ];

	    foreach ($labelsArray as $label){
		    if(isset($labels[$label])){
			    $labels[$label] = Translator::translateString($labels[$label]);
		    }
	    }

	    $settings = $taxonomyModel->getSettings();

	    // Fix for preventing this warning:
        // avoid strip_tags(): Passing null to parameter #1 ($string) of type string is deprecated
	    if($settings['query_var'] === null){
            $settings['query_var'] = '';
        }

	    $options = array_merge(
		    [
			    'singular_label' => $singular,
			    'label' => $plural,
			    'labels' => $labels,
		    ],
            $settings
	    );

        if (empty($plural) or $plural === '') {
            $plural = $taxonomyName . 's';
        }

        $taxonomyName = ucwords($taxonomyName);

	    $options = array_merge(
		    [
			    "hierarchical" => true,
			    "label" => $taxonomyName,
			    "singular_label" => $plural,
			    "show_ui" => true,
			    "query_var" => true,
			    'show_admin_column' => true,
			    "show_in_rest" => true,
			    "rewrite" => [
                    "slug" => strtolower($taxonomyName)
                ]
		    ], $options
	    );

	    // fix for post_tag
		if($slug === 'post_tag'){
			$options["hierarchical"] = false;
		}

	    $customPostTypesArray = [];

	    foreach ($taxonomyModel->getCustomPostTypes() as $customPostTypeModel){
		    $customPostTypesArray[] = $customPostTypeModel->getName();
        }

	    if($taxonomyModel->hasPermissions()){
	        $capabilityType = $taxonomyModel->getSlug()."s";
		    $options['capabilities'] = [
			    'manage_terms' => 'manage_'.$capabilityType,
			    'edit_terms' => 'edit_'.$capabilityType,
			    'delete_terms' => 'delete_'.$capabilityType,
			    'assign_terms' => 'assign_'.$capabilityType
            ];
	    }

	    if(!taxonomy_exists(strtolower($taxonomyName))){
		    register_taxonomy(
			    strtolower($taxonomyName),
			    $customPostTypesArray,
			    $options
		    );
        }
    }

    /**
     * Display legacy notices
     */
    public function legacyAdminNotices()
    {
        if ( ! isset( $_GET['errors'] ) ) {
            return;
        }

        global $post;

        if($post->post_type === $this->postTypeName){
            if ( false !== ( $errors = get_transient( "acpt_plugin_error_msg_{$post->ID}" ) ) && $errors) {
                delete_transient( "acpt_plugin_error_msg_{$post->ID}" );
                foreach ($errors as $error){
                ?>
                    <div class="notice notice-error is-dismissible">
                        <p><?php esc_html( $error ); ?></p>
                    </div>
                <?php
                }
            }
        }
    }
}

