<?php

namespace ACPT_Lite\Core\Generators;

use ACPT_Lite\Core\Models\Taxonomy\TaxonomyModel;
use ACPT_Lite\Core\Repository\TaxonomyRepository;
use ACPT_Lite\Core\Validators\MetaDataValidator;
use ACPT_Lite\Utils\Sanitizer;

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
	 * Sets default values, registers the passed post type, and
	 * listens for when the post is saved.
	 *
	 * @param string $postTypeName The name of the desired post type.
	 * @param bool   $isNative
	 * @param array  $postTypeArgs
	 * @param null   $language
	 */
	public function __construct($postTypeName, $isNative, $postTypeArgs = [], $language = null)
	{
		$this->postTypeName = strtolower($postTypeName);
		$this->postTypeArgs = (array) $postTypeArgs;
		$this->isNative = $isNative;

		$this->init([&$this, "registerPostType"]);

		add_action( 'admin_notices', [$this, 'legacyAdminNotices' ]);

		$this->savePost();
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
			}

			$taxonomyNames[] = $taxonomyModel->getSlug();
		}

		// register custom post type if not native
		if(!$this->isNative){
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
			if($this->postTypeArgs['rewrite'] === true and !empty($this->postTypeArgs['custom_rewrite'])){
				$this->postTypeArgs['rewrite'] = [
					'slug' => $this->postTypeArgs['custom_rewrite'],
					'with_front' => true
				];
			}

			// Take user provided options, and override the defaults.
			$args = array_merge($args, $this->postTypeArgs);

			register_post_type($this->postTypeName, $args);
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
	 */
	public function saveCustomPostType()
	{
		global $post;

		$errors = [];

		if ($_POST && !wp_verify_nonce($_POST[self::NONCE_FIELD_NAME], $this->generateNonce())) {
			return;
		}

		if($post and isset($_POST['meta_fields'])){

			$metaFields = $_POST['meta_fields'];

			foreach ($metaFields as $key) {

				if (!empty($_FILES[$key])) {
					if (!empty($_FILES[$key]['tmp_name'])) {
						$upload = wp_upload_bits($_FILES[$key]['name'], null, file_get_contents($_FILES[$key]['tmp_name']));

						if (isset($upload['error']) && $upload['error'] != 0) {
							wp_die('There was an error uploading your file. The error is: ' . $upload['error']);
						} else {
							update_post_meta($post->ID, $key, esc_sql($upload['url']));
						}
					}
				} else {
					if(isset($_POST[$key])){

						$rawValue = $_POST[$key];
						$type = sanitize_text_field($_POST[$key.'_type']);
						$isRequired = ($_POST[$key.'_required'] == 1) ? true : false;

						// validation
						try {
							MetaDataValidator::validate($type, $rawValue, $isRequired);
						} catch (\Exception $exception){
							wp_die('There was an error during saving data. The error is: ' . $exception->getMessage());
						}

						$value = $rawValue;
						update_post_meta($post->ID, $key, Sanitizer::sanitizePostTypeRawData($type, $value));
					} else {
						update_post_meta($post->ID, $key, '');
					}
				}
			}

			if(!empty($errors)){
				set_transient( "acpt_plugin_error_msg_".$post->ID, $errors, 60 );
				add_filter( 'redirect_post_location', [$this, 'addNoticeQueryVar'], 99 );
			}
		}
	}

	/**
	 * @param $location
	 * @return mixed
	 */
	public function addNoticeQueryVar( $location )
	{
		remove_filter( 'redirect_post_location', array( $this, 'addNoticeQueryVar' ), 99 );

		return add_query_arg( ['errors' => true], $location );
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

