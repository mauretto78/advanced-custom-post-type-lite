<?php

use ACPT_Lite\Core\CQRS\Command\DeleteMetaFieldValueCommand;
use ACPT_Lite\Core\CQRS\Command\SaveMetaFieldValueCommand;
use ACPT_Lite\Core\Repository\MetaRepository;
use ACPT_Lite\Core\Validators\ArgumentsArrayValidator;

if (!function_exists('save_acpt_meta_field_value')) {
    /**
     * Add or update a field value. This function replaces:
     *
     * - add_acpt_meta_field_value
     * - edit_acpt_meta_field_value
     *
     * @param array<string, mixed> $args
     *
     * @return bool
     */
    function save_acpt_meta_field_value(array $args = []): bool
    {
        try {
            // validate array
            $mandatory_keys = [
                'post_id' => [
                    'required' => false,
                    'type' => 'integer',
                ],
                'term_id' => [
                    'required' => false,
                    'type' => 'integer',
                ],
                'user_id' => [
                    'required' => false,
                    'type' => 'integer',
                ],
                'comment_id' => [
                    'required' => false,
                    'type' => 'integer',
                ],
                'wc_product_attribute' => [
                    'required' => false,
                    'type' => 'integer',
                ],
                'option_page' => [
                    'required' => false,
                    'type' => 'string',
                ],
                'box_name' => [
                    'required' => true,
                    'type' => 'string',
                ],
                'field_name' => [
                    'required' => true,
                    'type' => 'string',
                ],
                'forged_by' => [
                    'required' => false,
                    'type' => 'array',
                ],
                // `value` is intentionally NOT required: a value-less save is legitimate
                // (a Message field stores nothing; passing null clears the field). The
                // #1249 ArgumentsArrayValidator guard now rejects a `required` key sent as
                // explicit null, which would otherwise break those callers.
                'value' => [
                    'required' => false,
                    'type' => 'boolean|float|double|string|integer|array|object',
                ],
                'skip_validation' => [
                    'required' => false,
                    'type' => 'boolean',
                ],
            ];

            $validator = new ArgumentsArrayValidator();

            if (!$validator->validate($mandatory_keys, $args)) {
                return false;
            }

            $forged_by = $args['forged_by'] ?? $args['forgedBy'] ?? [];

            // a value read with get_acpt_field() can be saved back as is (#1371)
            if (array_key_exists('value', $args)) {
                $args['value'] = SaveMetaFieldValueCommand::objectsToIds($args['value']);
            }

            $meta_field_model = MetaRepository::getMetaFieldByName([
                'boxName' => $args['box_name'] ?? $args['boxName'],
                'fieldName' => $args['field_name'] ?? $args['fieldName'],
                'forgedBy' => $forged_by,
            ]);

            if ($meta_field_model === null) {
                return false;
            }

            if (isset($args['wc_product_attribute'])) {
                $meta_field_model->setIsAWooCommerceProductAttribute(true);
            }

            // save data
            try {
                $command = new SaveMetaFieldValueCommand($meta_field_model, $args);

                return $command->execute();
            } catch (\Throwable $exception) {
                // \Throwable, not just \Exception: a PHP Error (e.g. a value that
                // can't be converted to a string) used to escape as a fatal error (#1371)
                do_action('acpt/error', $exception);

                return false;
            }
        } catch (\Throwable $exception) {
            do_action('acpt/error', $exception);

            return false;
        }
    }
}

if (!function_exists('delete_acpt_meta_field_value')) {
    /**
     * Delete a meta value
     *
     * @param array<string, mixed> $args
     *
     * @return bool
     */
    function delete_acpt_meta_field_value(array $args = []): bool
    {
        try {
            // validate array
            $mandatory_keys = [
                'post_id' => [
                    'required' => false,
                    'type' => 'integer',
                ],
                'term_id' => [
                    'required' => false,
                    'type' => 'integer',
                ],
                'user_id' => [
                    'required' => false,
                    'type' => 'integer',
                ],
                'comment_id' => [
                    'required' => false,
                    'type' => 'integer',
                ],
                'wc_product_attribute' => [
                    'required' => false,
                    'type' => 'integer',
                ],
                'option_page' => [
                    'required' => false,
                    'type' => 'string',
                ],
                'box_name' => [
                    'required' => true,
                    'type' => 'string',
                ],
                'field_name' => [
                    'required' => true,
                    'type' => 'string',
                ],
                'forged_by' => [
                    'required' => false,
                    'type' => 'array',
                ],
            ];

            $validator = new ArgumentsArrayValidator();

            if (!$validator->validate($mandatory_keys, $args)) {
                return false;
            }

            $forged_by = $args['forged_by'] ?? $args['forgedBy'] ?? [];

            $meta_field_model = MetaRepository::getMetaFieldByName([
                'boxName' => $args['box_name'] ?? $args['boxName'],
                'fieldName' => $args['field_name'] ?? $args['fieldName'],
                'forgedBy' => $forged_by
            ]);

            if ($meta_field_model === null) {
                return false;
            }

            if (isset($args['wc_product_attribute'])) {
                $meta_field_model->setIsAWooCommerceProductAttribute(true);
            }

            // delete data
            try {
                $command = new DeleteMetaFieldValueCommand($meta_field_model, $args);
                $command->execute();

                return true;
            } catch (\Exception $exception) {
                return false;
            }
        } catch (\Exception $exception) {
            return false;
        }
    }
}

