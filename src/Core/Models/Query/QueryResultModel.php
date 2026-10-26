<?php

namespace ACPT_Lite\Core\Models\Query;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Repository\MetaRepository;
use ACPT_Lite\Core\Repository\WooCommerceProductDataRepository;
use ACPT_Lite\Utils\Data\Meta;
use ACPT_Lite\Utils\Data\Normalizer;

class QueryResultModel implements \JsonSerializable
{
    /**
     * @var array<string, mixed>
     */
    private array $post;

    /**
     * @var array<string, mixed>
     */
    private array $user;

    /**
     * @var array<string, mixed>
     */
    private array $meta;

    /**
     * QueryResultModel constructor.
     *
     * @param object $object
     *
     * @throws \Exception
     */
    private function __construct(object $object)
    {
        if ($object instanceof \WP_User) {
            $this->user = Normalizer::objectToArray($object);
        } elseif ($object instanceof \WP_Post) {
            $this->post = Normalizer::objectToArray($object);
        }

        $this->setMeta();
    }

    /**
     * @param \WP_Post $post
     *
     * @return QueryResultModel
     * @throws \Exception
     */
    public static function forPost(\WP_Post $post)
    {
        return new self($post);
    }

    /**
     * @param \WP_User $user
     *
     * @return QueryResultModel
     * @throws \Exception
     */
    public static function forUser(\WP_User $user)
    {
        return new self($user);
    }

    /**
     * @return array<string, mixed>
     */
    public function getPost()
    {
        return !empty($this->post) ? $this->post : [];
    }

    /**
     * @return array<string, mixed>
     */
    public function getUser()
    {
        return !empty($this->user) ? $this->user : [];
    }

    /**
     * @return void
     * @throws \Exception
     */
    private function setMeta(): void
    {
        $metaGroups = [];
        $meta = [
            'meta' => [],
        ];
        $pid = 0;

        if (!empty($this->post)) {
            $pid = $this->post['ID'];
            $pid = (int)$pid;
            $postType = $this->post['post_type'];

            $belongsTo = MetaTypes::CUSTOM_POST_TYPE;
            $find = $pid;

            $metaGroups = MetaRepository::get([
                'belongsTo' => MetaTypes::CUSTOM_POST_TYPE,
                'find' => $postType,
                'clonedFields' => true,
            ]);
        } elseif (!empty($this->user)) {
            $belongsTo = MetaTypes::USER;
            $find = (int)$this->user['ID'];

            $metaGroups = MetaRepository::get([
                'belongsTo' => MetaTypes::USER,
                'clonedFields' => true,
            ]);
        }

        if (empty($metaGroups)) {
            $this->meta = $meta;
            return;
        }

        if (empty($belongsTo)) {
            $this->meta = $meta;
            return;
        }

        if (empty($find)) {
            $this->meta = $meta;
            return;
        }

        foreach ($metaGroups as $groupModel) {
            foreach ($groupModel->getBoxes() as $metaBox) {
                $metaFields = [];

                foreach ($metaBox->getFields() as $field) {
                    $options = [];

                    foreach ($field->getOptions() as $option) {
                        $options[] = [
                            'label' => $option->getLabel(),
                            'value' => $option->getValue(),
                        ];
                    }

                    $metaFields[] = [
                        "name" => $field->getName(),
                        "type" => $field->getType(),
                        "options" => $options,
                        "value" => Meta::fetch($find, $belongsTo, $field->getDbName(), true),
                        "default" => $field->getDefaultValue(),
                        "required" => $field->isRequired() == '1',
                        "showInAdmin" => $field->isShowInArchive() == '1',
                        "advancedOptions" => array_values(array_filter(
                            $field->getAdvancedOptions(),
                            fn($advancedOption) => !$advancedOption->isPlaceholder()
                        )),
                    ];
                }

                $meta['meta'][] = [
                    "meta_box" => $metaBox->getName(),
                    "meta_fields" => $metaFields,
                ];
            }
        }

        if (isset($postType) && $postType === 'product' && class_exists('woocommerce')) {
            $meta['wc_product_data'] = [];
            $productData = WooCommerceProductDataRepository::get();

            foreach ($productData as $productDatum) {
                $productDataFields = [];

                foreach ($productDatum->getFields() as $field) {
                    $options = [];

                    foreach ($field->getOptions() as $option) {
                        $options[] = [
                            'label' => $option->getLabel(),
                            'value' => $option->getValue(),
                        ];
                    }

                    $productDataFields[] = [
                        'name' => $field->getName(),
                        'type' => $field->getType(),
                        "options" => $options,
                        'value' => Meta::fetch($pid, MetaTypes::CUSTOM_POST_TYPE, $field->getDbName(), true),
                        'default' => $field->getDefaultValue(),
                        'required' => $field->isRequired() == '1',
                    ];
                }

                $meta['wc_product_data'][] = [
                    'name' => $productDatum->getName(),
                    'icon' => $productDatum->getIcon(),
                    'visibility' => $productDatum->getVisibility(),
                    'fields' => $productDataFields,
                ];
            }
        }

        $this->meta = $meta;
    }

    /**
     * @return array<string, mixed>
     */
    #[\ReturnTypeWillChange]
    public function getMeta()
    {
        return !empty($this->meta) ? $this->meta : [];
    }

    #[\ReturnTypeWillChange]
    public function jsonSerialize()
    {
        return array_merge($this->getPost(), $this->getMeta());
    }
}
