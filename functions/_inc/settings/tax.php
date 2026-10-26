<?php

use ACPT_Lite\Core\CQRS\Command\AssocTaxonomyToCustomPostTypeCommand;
use ACPT_Lite\Core\CQRS\Command\DeleteTaxonomyCommand;
use ACPT_Lite\Core\CQRS\Command\SaveTaxonomyCommand;
use ACPT_Lite\Core\Helper\Uuid;
use ACPT_Lite\Core\Models\Taxonomy\TaxonomyModel;
use ACPT_Lite\Core\Repository\CustomPostTypeRepository;
use ACPT_Lite\Core\Repository\TaxonomyRepository;
use ACPT_Lite\Core\Validators\ArgumentsArrayValidator;

if (!function_exists('register_acpt_taxonomy')) {

    /**
     * Register a new custom taxonomy.
     *
     * @param array<string, mixed> $args
     *
     * @return bool
     */
    function register_acpt_taxonomy(array $args = []): bool
    {
        try {
            $mandatory_keys = [
                'slug' => [
                    'required' => true,
                    'type' => 'string',
                ],
                'singular_label' => [
                    'required' => true,
                    'type' => 'string',
                ],
                'plural_label' => [
                    'required' => true,
                    'type' => 'string',
                ],
                'labels' => [
                    'required' => false,
                    'type' => 'array',
                ],
                'settings' => [
                    'required' => false,
                    'type' => 'array',
                ],
                'post_types' => [
                    'required' => false,
                    'type' => 'array',
                ],
                'permissions' => [
                    'required' => false,
                    'type' => 'array',
                ],
            ];

            $validator = new ArgumentsArrayValidator();

            $args["singular_label"] = $args["singular_label"] ?? $args["singularLabel"];
            $args["plural_label"] = $args["plural_label"] ?? $args["pluralLabel"];

            // Callers may omit labels/settings entirely, expecting sensible defaults (matching
            // what the admin UI's creation wizard pre-fills) - as opposed to explicitly sending
            // an empty value, which is respected as-is. Must happen before validate() below,
            // since 'labels'/'settings' are mandatory keys (must be present, may be empty).
            if (!isset($args['labels']) || !isset($args['settings'])) {
                $defaultsModel = new TaxonomyModel(
                    Uuid::v4(),
                    $args['slug'] ?? '',
                    $args['singular_label'] ?? '',
                    $args['plural_label'] ?? '',
                    0,
                    [],
                    []
                );

                if (!isset($args['labels'])) {
                    $args['labels'] = $defaultsModel->defaultLabels();
                }

                if (!isset($args['settings'])) {
                    $args['settings'] = $defaultsModel->defaultSettings();
                }
            }

            if (!$validator->validate($mandatory_keys, $args)) {
                return false;
            }

            $id = (TaxonomyRepository::exists(@$args["slug"])) ? TaxonomyRepository::getId(@$args["slug"]) : Uuid::v4();
            $data = [
                'id' => $id,
                'slug' => @$args["slug"],
                'singular_label' => $args["singular_label"] ?? $args["singularLabel"],
                'plural_label' => $args["plural_label"] ?? $args["pluralLabel"],
                'labels' => @$args['labels'],
                'settings' => @$args['settings'],
                'post_types' => $args['post_types'] ?? $args['postTypes'] ?? [],
                'permissions' => $args['permissions'] ?? [],
            ];

            $command = new SaveTaxonomyCommand($data);
            $command->execute();

            return true;
        } catch (\Exception $exception) {
            do_action("acpt/error", $exception);

            return false;
        }
    }
}

if (!function_exists('delete_acpt_taxonomy')) {

    /**
     * Delete a custom taxonomy.
     *
     * @param string $taxonomy
     *
     * @return bool
     */
    function delete_acpt_taxonomy($taxonomy)
    {
        try {
            $command = new DeleteTaxonomyCommand($taxonomy);
            $command->execute();

            return true;
        } catch (\Exception $exception) {
            do_action("acpt/error", $exception);

            return false;
        }
    }
}

if (!function_exists('assoc_acpt_taxonomy_to_acpt_post')) {

    /**
     * Associate a custom taxonomy to a custom post type.
     *
     * @param string $taxonomy
     * @param string $post_type
     *
     * @return bool|void
     */
    function assoc_acpt_taxonomy_to_acpt_post(string $taxonomy, string $post_type)
    {
        try {
            $taxonomy_id = TaxonomyRepository::getId($taxonomy);
            $post_id = CustomPostTypeRepository::getId($post_type);

            if (empty($taxonomy_id) || empty($post_id)) {
                return false;
            }

            $command = new AssocTaxonomyToCustomPostTypeCommand($post_id, $taxonomy_id);
            $command->execute();

            $taxonomy_model = TaxonomyRepository::get(['id' => $taxonomy_id])[0];

            $modelOptions = array_merge(
                [
                        'singular_label' => $taxonomy_model->getSingular(),
                        'label' => $taxonomy_model->getPlural(),
                        'labels' => $taxonomy_model->getLabels(),
                ],
                $taxonomy_model->getSettings()
            );

            $options = array_merge(
                [
                        "hierarchical" => false,
                        "label" => $taxonomy_model->getSlug(),
                        "singular_label" => $taxonomy_model->getPlural(),
                        "show_ui" => true,
                        "query_var" => true,
                        'show_admin_column' => true,
                        "show_in_rest" => true,
                        "rewrite" => ["slug" => strtolower($taxonomy_model->getSlug())]
                ],
                $modelOptions
            );

            register_taxonomy(strtolower($taxonomy_model->getSlug()), $post_type, $options);
        } catch (\Exception $exception) {
            do_action("acpt/error", $exception);

            return false;
        }
    }
}

if (!function_exists('remove_assoc_acpt_taxonomy_to_acpt_post')) {

    /**
     * Remove association between a custom taxonomy to a custom post type.
     *
     * @param string $taxonomy
     * @param string $post_type
     *
     * @return bool|void
     */
    function remove_assoc_acpt_taxonomy_from_acpt_post(string $taxonomy, string $post_type)
    {
        try {
            $taxonomy_id = TaxonomyRepository::getId($taxonomy);
            $post_id = CustomPostTypeRepository::getId($post_type);

            TaxonomyRepository::removeAssocPost($post_id, $taxonomy_id);
            unregister_taxonomy($taxonomy);
        } catch (\Exception $exception) {
            do_action("acpt/error", $exception);

            return false;
        }
    }
}
