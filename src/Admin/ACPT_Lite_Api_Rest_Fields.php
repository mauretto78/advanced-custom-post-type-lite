<?php

namespace ACPT_Lite\Admin;

use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Query\QueryResultModel;
use ACPT_Lite\Core\Repository\CustomPostTypeRepository;
use ACPT_Lite\Core\Repository\MetaRepository;
use ACPT_Lite\Core\Repository\WooCommerceProductDataRepository;
use ACPT_Lite\Utils\Data\Sanitizer;
use ACPT_Lite\Utils\PHP\Assert;

class ACPT_Lite_Api_Rest_Fields extends ACPT_Lite_Api
{
    public function registerRestFields(): void
    {
        // loop acpt cpt and register only cpt with rest api enabled
        $posts = CustomPostTypeRepository::get([]);

        foreach ($posts as $post) {
            if ($post->isNative() || (isset($post->getSettings()['show_in_rest']) && $post->getSettings()['show_in_rest'] === true)) {
                $this->registerRestField($post->getName(), 'acpt', [
                    'get_callback' => [$this, 'getCallback'],
                    'update_callback' => [$this, 'updateCallback'],
                    'schema' => [
                        'type' => 'object',
                        'arg_options' => [
                            'sanitize_callback' => [$this, 'sanitizeCallback'],
                            'validate_callback' => [$this, 'validateCallback'],
                        ],
                    ],
                ]);
            }
        }

        // @TODO taxonomies

        // users
        $this->registerRestField('user', 'acpt', [
            'get_callback' => [$this, 'getUserCallback'],
            'update_callback' => [$this, 'updateUserCallback'],
            'schema' => [
                'type' => 'object',
                'arg_options' => [
                    'sanitize_callback' => [$this, 'sanitizeCallback'],
                    'validate_callback' => [$this, 'validateCallback'],
                ],
            ],
        ]);
    }

    /**
     * @param string               $route
     * @param string               $field
     * @param array<string, mixed> $callback
     */
    private function registerRestField(string $route, string $field, array $callback): void
    {
        register_rest_field($route, $field, $callback);
    }

    /**
     * @param array<string, mixed> $object
     * @return array<string, mixed>
     * @throws \Exception
     */
    public function getCallback(array $object): array
    {
        $post = get_post((int)$object['id']);
        $queryResultModel = QueryResultModel::forPost($post);

        return $queryResultModel->getMeta();
    }

    /**
     * @param array<string, mixed> $user
     * @param string               $field_name
     * @param \WP_REST_Request     $request
     * @return array<string, mixed>
     * @throws \Exception
     */
    public function getUserCallback(array $user, string $field_name, \WP_REST_Request $request): array
    {
        if (function_exists('get_user_by')) {
            $user = get_user_by('id', (int)$user['id']);

            if ($user instanceof \WP_User) {
                $queryResultModel = QueryResultModel::forUser($user);

                return $queryResultModel->getMeta();
            }
        }

        return [];
    }

    /**
     * @param mixed    $meta
     * @param \WP_Post $object
     * @return void|\WP_Error
     */
    public function updateCallback($meta, \WP_Post $object)
    {
        $postType = $object->post_type;
        $failedFields = [];

        try {
            // meta
            foreach ($meta['meta'] as $item) {

                // data
                $box = $item['box'];
                $field = $item['field'];
                $value = $item['value'];

                // check
                if (null === $singleMeta = MetaRepository::getMetaFieldByName([
                    'boxName' => $box,
                    'fieldName' => $field,
                ])) {
                    return $this->restError("Meta field does not exists");
                }

                $listTypes = [];

                if (in_array($singleMeta->getType(), $listTypes)) {
                    if (!is_array($value)) {
                        return $this->restError("Value MUST be an array");
                    }
                }

                $saved = save_acpt_meta_field_value([
                    'post_id' => $object->ID,
                    'box_name' => Strings::toDBFormat($box),
                    'field_name' => Strings::toDBFormat($field),
                    'value' => $value,
                ]);

                if ($saved === false) {
                    $failedFields[] = $field;
                }
            }

            if (!empty($failedFields)) {
                return $this->restError(sprintf(
                    "The following field(s) could not be saved: %s",
                    implode(", ", $failedFields)
                ));
            }

            // wc_product_data
            if (
                $postType === 'product' &&
                class_exists('woocommerce') &&
                function_exists('wc_get_product')
            ) {
                $product = wc_get_product($object->ID);

                foreach ($meta['wc_product_data'] as $item) {

                    // data
                    $productData = $item['product_data'];
                    $field = $item['field'];
                    $value = $item['value'];

                    // check if exists
                    if (WooCommerceProductDataRepository::getSingleField($productData, $field)) {
                        return $this->restError("Product data does not exists");
                    }

                    $sluggedName = strtolower(str_replace(" ", "_", $productData));
                    $fieldSluggedName = $sluggedName . '_' . strtolower(str_replace(" ", "_", $field));

                    $product->update_meta_data('_'.$fieldSluggedName, $value);
                }
            }
        } catch (\Exception $exception) {
            do_action("acpt/error", $exception);

            return $this->restError($exception->getMessage());
        }
    }

    /**
     * @param mixed    $meta
     * @param \WP_User $user_object
     * @return void|\WP_Error
     */
    public function updateUserCallback($meta, \WP_User $user_object)
    {
        $userId = $user_object->ID;
        $failedFields = [];

        try {
            // meta
            foreach ($meta['meta'] as $item) {

                // data
                $box = $item['box'];
                $field = $item['field'];
                $value = $item['value'];

                // check
                if (null === $singleMeta = MetaRepository::getMetaFieldByName([
                    'boxName' => $box,
                    'fieldName' => $field,
                ])) {
                    return $this->restError("Meta field does not exists");
                }

                $listTypes = [];

                if (in_array($singleMeta->getType(), $listTypes)) {
                    if (!is_array($value)) {
                        return $this->restError("Value MUST be an array");
                    }
                }

                $saved = save_acpt_meta_field_value([
                    'user_id' => $userId,
                    'box_name' => Strings::toDBFormat($box),
                    'field_name' => Strings::toDBFormat($field),
                    'value' => $value,
                ]);

                if ($saved === false) {
                    $failedFields[] = $field;
                }
            }

            if (!empty($failedFields)) {
                return $this->restError(sprintf(
                    "The following field(s) could not be saved: %s",
                    implode(", ", $failedFields)
                ));
            }
        } catch (\Exception $exception) {
            do_action("acpt/error", $exception);

            return $this->restError($exception->getMessage());
        }
    }

    /**
     * @param array<string, mixed> $meta
     * @return array<string, mixed>
     */
    public function sanitizeCallback(array $meta): array
    {
        return Sanitizer::recursiveSanitizeRawData($meta);
    }

    /**
     * @param mixed $meta
     * @return bool|\WP_Error
     */
    public function validateCallback($meta)
    {
        // @TODO validate against schema

        if (!is_array($meta)) {
            return $this->restError('`meta` key is not an array');
        }

        // meta
        if (!isset($meta['meta'])) {
            return $this->restError('Missing `meta` key');
        }

        foreach ($meta['meta'] as $item) {
            if (null !== $error = $this->validateMetaItem($item)) {
                return $this->restError($error);
            }
        }

        // wc_product_data
        $requestUri = explode("/", $this->request->requestUri());
        $identifier = $requestUri[4];

        if ($identifier === 'product' && class_exists('woocommerce')) {
            if (!isset($meta['wc_product_data'])) {
                return $this->restError('Missing `wc_product_data` key');
            }

            try {
                Assert::isArray($meta['wc_product_data']);
            } catch (\Exception $exception) {
                do_action("acpt/error", $exception);

                return $this->restError('`wc_product_data` key is not an array');
            }

            foreach ($meta['wc_product_data'] as $data) {
                if (null !== $error = $this->validateWcProductData($data)) {
                    return $this->restError($error);
                }
            }
        }

        return true;
    }

    /**
     * @param array<string, mixed> $item
     * @return string|null
     */
    private function validateMetaItem(array $item): ?string
    {
        if (
            !isset($item['box']) &&
            !isset($item['field']) &&
            !isset($item['value'])
        ) {
            return 'Missing key(s): [`box`,`field`,`value`]';
        }

        try {
            Assert::string($item['box']);
            Assert::string($item['field']);
            Assert::isStringOrArray($item['value']);
        } catch (\Exception $exception) {
            do_action("acpt/error", $exception);

            return 'Invalid data: [`box`|STRING,`field`|STRING,`value`|STRING|ARRAY]';
        }

        return null;
    }

    /**
     * @param array<string, mixed> $item
     * @return string|null
     */
    private function validateWcProductData(array $item): ?string
    {
        if (
            !isset($item['product_data']) &&
            !isset($item['field']) &&
            !isset($item['value'])
        ) {
            return 'Missing key(s): [`product_data`,`field`,`value`]';
        }

        try {
            Assert::string($item['product_data']);
            Assert::string($item['field']);
            Assert::isStringOrArray($item['value']);
        } catch (\Exception $exception) {
            do_action("acpt/error", $exception);

            return 'Invalid data: [`product_data`|STRING,`field`|STRING,`value`|STRING|ARRAY]';
        }

        return null;
    }
}
