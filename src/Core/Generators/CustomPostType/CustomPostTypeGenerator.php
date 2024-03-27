<?php

namespace ACPT_Lite\Core\Generators\CustomPostType;

use ACPT_Lite\Core\CQRS\Command\SaveCustomPostTypeMetaCommand;
use ACPT_Lite\Core\Generators\AbstractGenerator;
use ACPT_Lite\Core\Models\Meta\MetaGroupModel;
use ACPT_Lite\Core\Models\Taxonomy\TaxonomyModel;
use ACPT_Lite\Core\Repository\TaxonomyRepository;

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
	 * @param string $postTypeName The name of the desired post type.
	 * @param bool $isNative
	 * @param $isWooCommerce
	 * @param array $postTypeArgs
	 * @param MetaGroupModel[] $metaGroups
	 */
    public function __construct($postTypeName, $isNative, $isWooCommerce, $postTypeArgs = [], array $metaGroups = [])
    {
	    $this->isWooCommerce = $isWooCommerce;
        $this->postTypeName = strtolower($postTypeName);
        $this->postTypeArgs = (array) $postTypeArgs;
        $this->isNative = $isNative;
	    $this->metaGroups = $metaGroups;

        $this->init([&$this, "registerPostType"]);

        add_action( 'admin_notices', [$this, 'legacyAdminNotices' ]);

	    global $pagenow;

	    // only on save edit post
	    if($pagenow === 'post.php' or $pagenow === 'post-new.php'){
		    $this->savePost();
        }
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
	    $taxonomyNames = [];
	    $taxonomies = TaxonomyRepository::get([
        	'customPostType' => $this->postTypeName
        ]);

	    // register taxonomies first
	    foreach ($taxonomies as $taxonomyModel){
	        if(!$taxonomyModel->isNative()){
		        $this->registerTaxonomy($taxonomyModel);
	        } else {
		        register_taxonomy_for_object_type($taxonomyModel->getSlug(), $this->postTypeName);
	        }

		    $taxonomyNames[] = $taxonomyModel->getSlug();
        }

	    // register custom post type if not native and is not WooCommerce
	    // (WooCommerce product cpt does not need to be registered twice)
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
		        "capability_type" => "post",
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
			        'with_front' => true
		        ];
	        }

	        // Take user provided options, and override the defaults.
	        $args = array_merge($args, $this->postTypeArgs);

	        register_post_type($this->postTypeName, $args);

	        // Manually add settings
            if(isset($args['settings'])){
	            foreach ($args['settings'] as $setting){
		            if(!post_type_supports( $this->postTypeName, $setting )){
			            add_post_type_support( $this->postTypeName, $setting );
		            }
	            }
            }
        }
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
	    $plural = $taxonomyModel->getPlural();
	    $options = array_merge(
		    [
			    'singular_label' => $taxonomyModel->getSingular(),
			    'label' => $taxonomyModel->getPlural(),
			    'labels' => $taxonomyModel->getLabels(),
		    ],
		    $taxonomyModel->getSettings()
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
			    "rewrite" => ["slug" => strtolower($taxonomyName)]
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

	    register_taxonomy(strtolower($taxonomyName), $customPostTypesArray, $options);
    }

    /**
     * When a post saved/updated in the database using `save_post_my_post_type` callback [Wordpress 3.7+],
     * this methods updates the meta box params in the db as well.
     */
    public function savePost()
    {
        add_action( 'save_post_'.$this->postTypeName, [&$this, "saveCustomPostType"]);
    }

	/**
	 * Custom save_post function
	 *
	 * @param $postId
	 * @throws \Exception
	 */
    public function saveCustomPostType($postId)
    {
        if(!empty($_POST)){
	        $command = new SaveCustomPostTypeMetaCommand($postId, $this->metaGroups, $_POST);
	        $command->execute();
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

