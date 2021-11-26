<?php

namespace ACPT_Lite\Core\Generators;

use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\MetaBoxFieldModel;
use ACPT_Lite\Includes\ACPT_Lite_DB;

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

        if(!$isNative){
            $this->init([&$this, "registerPostType"]);
        }

        add_action( 'admin_notices', [$this, 'legacy_admin_notices' ]);

        $this->savePost();
    }

    /**
     * Registers a new post type in the WP db.
     */
    public function registerPostType()
    {
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
        ];

        // Take user provided options, and override the defaults.
        $args = array_merge($args, $this->postTypeArgs);

        register_post_type($this->postTypeName, $args);
    }

    /**
     * Registers a new taxonomy, associated with the instantiated post type.
     *
     * @param string $taxonomyName The name of the desired taxonomy
     * @param string $plural       The plural form of the taxonomy name. (Optional)
     * @param array  $options      A list of overrides
     */
    public function addTaxonomy( $taxonomyName, $plural = '', $options = [], $sharedPostTypeArray = null)
    {
        // Create local reference so we can pass it to the init cb.
        $postTypeName = $this->postTypeName;

        if (empty($plural) or $plural === '') {
            $plural = $taxonomyName . 's';
        }

        $taxonomyName = ucwords($taxonomyName);

        // At WordPress' init, register the taxonomy
        $this->init(
            function() use($taxonomyName, $plural, $postTypeName, $options, $sharedPostTypeArray) {
                $options = array_merge(
                    [
                        "hierarchical" => false,
                        "label" => $taxonomyName,
                        "singular_label" => $plural,
                        "show_ui" => true,
                        "query_var" => true,
                        'show_admin_column' => true,
                        "show_in_rest" => true,
                        "rewrite" => ["slug" => strtolower($taxonomyName)]
                    ], $options
                );

                // name of taxonomy, associated post type, options
                if(is_array($sharedPostTypeArray)){
                    register_taxonomy(strtolower($taxonomyName), $sharedPostTypeArray, $options);
                } else {
                    register_taxonomy(strtolower($taxonomyName), $postTypeName, $options);
                }
            });
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

        if ($_POST && !wp_verify_nonce($_POST[self::NONCE_FIELD_NAME], $this->generateNonce())) {
            return;
        }

        if($post and isset($_POST['meta_fields'])){
            foreach ($_POST['meta_fields'] as $key) {

                // validation
                $isRequired = ($_POST[$key.'_required'] == 1) ? true : false;
                if($isRequired and empty($_POST[$key])){

                    // legacy admin notices
                    add_filter( 'redirect_post_location', [$this, 'add_notice_query_var'], 99 );

                    return;
                }

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
                        update_post_meta($post->ID, $key, sanitize_text_field($_POST[$key]));

                    } else {
                        update_post_meta($post->ID, $key, '');
                    }
                }
            }
        }
    }

    /**
     * @param $key
     * @param $postId
     *
     * @throws \Exception
     */
    private function deleteAllInversedKeys($key, $postId)
    {
        global $wpdb;

        $sql = "DELETE FROM `{$wpdb->prefix}postmeta` WHERE meta_key=%s and meta_value = %s";

        ACPT_Lite_DB::executeQueryOrThrowException($sql, [
            $key,
            $postId
        ]);
    }

    /**
     * @param $location
     * @return mixed
     */
    public function add_notice_query_var( $location )
    {
        remove_filter( 'redirect_post_location', array( $this, 'add_notice_query_var' ), 99 );

        return add_query_arg( ['missing_fields' => true], $location );
    }

    /**
     * Display legacy notices
     */
    public function legacy_admin_notices()
    {
        if ( ! isset( $_GET['missing_fields'] ) ) {
            return;
        }

        global $post;

        if($post->post_type === $this->postTypeName){
            ?>
            <div class="notice notice-error is-dismissible">
                <p><?php esc_html_e( 'ERROR: Missing required fields!', 'ACPT' ); ?></p>
            </div>
            <?php
        }
    }
}

