<?php

use ACPT_Lite\Core\CQRS\Command\DeleteCustomPostTypeCommand;
use ACPT_Lite\Core\CQRS\Command\SaveCustomPostTypeCommand;
use ACPT_Lite\Core\Helper\Uuid;
use ACPT_Lite\Core\Models\CustomPostType\CustomPostTypeModel;
use ACPT_Lite\Core\Repository\CustomPostTypeRepository;

if (!function_exists('register_acpt_post_type')) {

    /**
     * Register a new custom post type.
     *
     * @param array<string, mixed> $args
     *
     * @return bool
     */
    function register_acpt_post_type(array $args = []): bool
    {
        try {
            // Callers may omit icon/supports/labels/settings entirely, expecting sensible
            // defaults (matching what the admin UI's creation wizard pre-fills) - as opposed to
            // explicitly sending an empty value, which is respected as-is. isset() treats an
            // explicit [] or {} as "present" and only fills in genuinely missing keys.
            if (!isset($args['icon'])) {
                $args['icon'] = 'admin-post';
            }

            if (!isset($args['supports'])) {
                $args['supports'] = ['title', 'editor'];
            }

            if (!isset($args['labels']) || !isset($args['settings'])) {
                $defaultsModel = new CustomPostTypeModel(
                    Uuid::v4(),
                    $args['post_name'] ?? '',
                    $args['singular_label'] ?? $args['singularLabel'] ?? '',
                    $args['plural_label'] ?? $args['pluralLabel'] ?? '',
                    $args['icon'],
                    false,
                    [],
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

            $id = (CustomPostTypeRepository::exists($args["post_name"])) ? CustomPostTypeRepository::getId($args["post_name"]) : Uuid::v4();
            $data = [
                'id' => $id,
                'name' => @$args["post_name"],
                'singular_label' => $args["singular_label"] ?? $args["singularLabel"],
                'plural_label' => $args["plural_label"] ?? $args["pluralLabel"],
                'icon' => @$args["icon"],
                'supports' => @$args['supports'],
                'labels' => @$args['labels'],
                'settings' => @$args['settings'],
                'permissions' => $args['permissions'] ?? []
            ];

            $command = new SaveCustomPostTypeCommand($data);
            $command->execute();

            return post_type_exists($args["post_name"]);
        } catch (\Exception $exception) {
            do_action("acpt/error", $exception);

            return false;
        }
    }
}

if (!function_exists('delete_acpt_post_type')) {

    /**
     * Delete a custom post type.
     *
     * @param string $post_type
     * @param bool   $delete_posts
     *
     * @return bool
     */
    function delete_acpt_post_type($post_type, $delete_posts = false)
    {
        if (!CustomPostTypeRepository::exists($post_type)) {
            return false;
        }

        try {
            $command = new DeleteCustomPostTypeCommand($post_type);
            $command->execute();

            return true;
        } catch (\Exception $exception) {
            do_action("acpt/error", $exception);

            return false;
        }
    }
}
