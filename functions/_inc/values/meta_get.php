<?php

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Constants\Visibility;
use ACPT_Lite\Core\CQRS\Query\FetchMetaFieldValueQuery;
use ACPT_Lite\Core\CQRS\Query\FetchMetaGroupsQuery;
use ACPT_Lite\Core\Models\Meta\MetaBoxModelFactory;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Core\Repository\MetaRepository;
use ACPT_Lite\Core\Validators\ArgumentsArrayValidator;
use ACPT_Lite\Utils\Data\Meta;

if (!function_exists('get_acpt_fields')) {
    /**
     * Fetch all box field values
     *
     * @param array<string, mixed> $args
     *
     * @return array<int|string, mixed>
     */
    function get_acpt_fields(array $args = []): array
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
                    'required' => false,
                    'type' => 'string',
                ],
                'format' => [
                    'required' => false,
                    'type' => 'string',
                    'enum' => [
                        'complete',
                        'only_value',
                    ]
                ],
                'assoc' => [
                    'required' => false,
                    'type' => 'boolean',
                ],
                'with_context' => [
                    'required' => false,
                    'type' => 'boolean',
                ],
                'all_users' => [
                    'required' => false,
                    'type' => 'boolean',
                ],
                'return' => [
                    'required' => false,
                    'type' => 'string',
                    'enum' => [
                        'raw',
                        'object',
                    ]
                ],
            ];

            $validator = new ArgumentsArrayValidator();

            if (!$validator->validate($mandatory_keys, $args)) {
                return [];
            }

            $assoc = $args['assoc'] ?? false;
            $boxName = $args['box_name'] ?? $args['boxName'] ?? null;
            $return = [];

            unset($args['assoc']);

            // get all box fields
            if ($boxName !== null) {
                $meta_box_model = MetaBoxModelFactory::fromName($boxName);

                if ($meta_box_model === null) {
                    return [];
                }

                if ($meta_box_model->getGroup()->isVisible($args)) {
                    foreach ($meta_box_model->getFields() as $field_index => $field_model) {
                        $new_args = array_merge($args, [
                            'field_name' => $field_model->getName(),
                            'format' => $args['format'] ?? 'only_value',
                            'with_context' => $args['with_context'] ?? false,
                            'return' => $args['return'] ?? 'object',
                        ]);
                        $get_acpt_field = get_acpt_field($new_args);

                        if ($get_acpt_field !== null) {
                            $index =  $assoc ? $field_model->getDbName() : $field_index;
                            $return[$index] = $get_acpt_field;
                        }
                    }
                }

            // get all fields
            } else {
                $meta_groups = (new FetchMetaGroupsQuery(['cct' => true]))->execute();

                foreach ($meta_groups as $meta_group) {
                    if ($meta_group->isVisible($args)) {
                        foreach ($meta_group->getBoxes() as $meta_box_model) {
                            foreach ($meta_box_model->getFields() as $field_model) {
                                $new_args = array_merge($args, [
                                    'box_name' => $meta_box_model->getName(),
                                    'field_name' => $field_model->getName(),
                                    'format' => $args['format'] ?? 'only_value',
                                    'with_context' => $args['with_context'] ?? false,
                                    'return' => $args['return'] ?? 'object',
                                ]);
                                $get_acpt_field = get_acpt_field($new_args);

                                if ($get_acpt_field !== null) {
                                    // $field_index is only unique within its own box — reusing it as
                                    // the array key here would let a field in one box silently
                                    // overwrite a same-positioned field in another box the moment a
                                    // group has more than one box. Use getDbName() (globally unique)
                                    // for assoc mode, and a plain auto-incrementing key otherwise —
                                    // never the box-local position.
                                    if ($assoc) {
                                        $return[$field_model->getDbName()] = $get_acpt_field;
                                    } else {
                                        $return[] = $get_acpt_field;
                                    }
                                }
                            }
                        }
                    }
                }
            }

            return $return;
        } catch (\Exception $exception) {
            return [];
        }
    }
}

if (!function_exists('get_acpt_field')) {
    /**
     * @param array<string, mixed> $args
     *
     * @return mixed|null
     */
    function get_acpt_field(array $args = [])
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
                'all_users' => [
                    'required' => false,
                    'type' => 'boolean',
                ],
                'with_context' => [
                    'required' => false,
                    'type' => 'boolean',
                ],
                'format' => [
                    'required' => false,
                    'type' => 'string',
                    'enum' => [
                        'complete',
                        'only_value',
                    ]
                ],
                'return' => [
                    'required' => false,
                    'type' => 'string',
                    'enum' => [
                        'raw',
                        'string',
                        'object',
                    ]
                ],
            ];

            $validator = new ArgumentsArrayValidator();

            if (!$validator->validate($mandatory_keys, $args)) {
                return null;
            }

            if (empty($args['return'])) {
                $args['return'] = 'object';
            }

            $box_name = $args['box_name'] ?? $args['boxName'];
            $field_name = explode(".", $args['field_name']);
            $location = null;
            $belongs_to = null;

            $meta_field_model = MetaRepository::getMetaFieldByName([
                'boxName' => $box_name,
                'fieldName' => $field_name[0],
            ]);

            // check for saved field id. Used by cloned fields
            if ($meta_field_model === null) {
                if (isset($args['post_id'])) {
                    $belongs_to = MetaTypes::CUSTOM_POST_TYPE;
                    $location = $args['post_id'];
                } elseif (isset($args['term_id'])) {
                    $belongs_to = MetaTypes::TAXONOMY;
                    $location = $args['term_id'];
                } elseif (isset($args['user_id'])) {
                    $belongs_to = MetaTypes::USER;
                    $location = $args['user_id'];
                } elseif (isset($args['comment_id'])) {
                    $belongs_to = MetaTypes::COMMENT;
                    $location = $args['comment_id'];
                }

                if (empty($location) && empty($belongs_to)) {
                    return null;
                }

                $key = $box_name."_".$field_name[0]."_id";
                $field_id = Meta::fetch($location, $belongs_to, $key);

                if (!empty($field_id)) {
                    $meta_field_model = MetaRepository::getMetaFieldById($field_id);

                    if ($meta_field_model === null) {
                        return null;
                    }

                }
                // if field_id was empty, fall through to CCT probe below
            }

            if ($meta_field_model === null) {
                return null;
            }

            $query = new FetchMetaFieldValueQuery($meta_field_model, $args);
            $result = $query->execute();
            $format = $args['format'] ?? 'only_value';
            $field_object = $meta_field_model->toStdObject();

            if (is_array($result) && count($field_name) === 2) {
                $r = [];

                foreach ($result as $item) {
                    if (isset($item[$field_name[1]])) {
                        $r[] = Meta::format($field_object, $item[$field_name[1]], $format);
                    }
                }

                return $r;
            }

            if (is_array($result) && count($field_name) === 3) {
                $r = [];

                foreach ($result as $item) {
                    if (isset($item[$field_name[1]])) {
                        foreach ($item[$field_name[1]] as $nested_item) {
                            if (isset($nested_item[$field_name[2]])) {
                                $r[] = Meta::format($field_object, $nested_item[$field_name[2]], $format);
                            }
                        }
                    }
                }

                return $r;
            }

            return Meta::format($field_object, $result, $format);
        } catch (\Exception $exception) {
            return null;
        }
    }
}

if (!function_exists('acpt_field')) {
    /**
     * @param array<string, mixed> $args
     *
     * @return string|null
     */
    function acpt_field(array $args = []): ?string
    {
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
            'date_format' => [
                'required' => false,
                'type' => 'string',
            ],
            'width' => [
                'required' => false,
                'type' => 'string|integer',
            ],
            'height' => [
                'required' => false,
                'type' => 'string|integer',
            ],
            'target' => [
                'required' => false,
                'type' => 'string',
                'enum' => [
                    '_blank',
                    '_self',
                    '_parent',
                    '_top',
                ],
            ],
            'sort' => [
                'required' => false,
                'type' => 'string',
                'enum' => [
                    'asc',
                    'desc',
                    'rand',
                ],
            ],
            'elements' => [
                'required' => false,
                'type' => 'integer|string',
            ],
            'render' => [
                'required' => false,
                'type' => 'string',
            ],
            'date-format' => [
                'required' => false,
                'type' => 'string',
            ],
            'time-format' => [
                'required' => false,
                'type' => 'string',
            ],
        ];

        $validator = new ArgumentsArrayValidator();

        if (!$validator->validate($mandatory_keys, $args)) {
            return null;
        }

        $shortCode = null;
        $postId = $args['post_id'] ?? $args['postId'] ?? null;
        $termId = $args['term_id'] ?? $args['termId'] ?? null;
        $userId = $args['user_id'] ?? $args['userId'] ?? null;
        $wcProductAttribute = $args['wc_product_attribute'] ?? $args['wcProductAttribute'] ?? null;
        $optionPage = $args['option_page'] ?? $args['optionPage'] ?? null;
        $boxName = $args['box_name'] ?? $args['boxName'];
        $fieldName = $args['field_name'] ?? $args['fieldName'];
        $dateFormat = $args['date_format'] ?? $args['dateFormat'] ?? null;
        $timeFormat = $args['time_format'] ?? $args['timeFormat'] ?? null;

        if ($postId !== null) {
            $shortCode = '[acpt pid="'.$postId .'"';
        } elseif ($termId !== null) {
            $shortCode = '[acpt_tax tid="'.$termId .'"';
        } elseif ($userId !== null) {
            $shortCode = '[acpt_user uid="'.$userId.'"';
        } elseif ($optionPage !== null) {
            $shortCode = '[acpt_option page="'.$optionPage.'"';
        } elseif ($wcProductAttribute !== null) {
            $shortCode = '[acpt_wc_pa="'.$wcProductAttribute.'"';
        }

        if ($shortCode === null) {
            return null;
        }

        $shortCode .= ' box="'.$boxName.'" field="'.$fieldName.'"';

        if ($dateFormat !== null) {
            $shortCode .= ' date-format="'.$dateFormat.'"';
        }

        if ($timeFormat !== null) {
            $shortCode .= ' time-format="'.$timeFormat.'"';
        }

        if (isset($args['width'])) {
            $shortCode .= ' width="'.$args['width'].'"';
        }

        if (isset($args['height'])) {
            $shortCode .= ' height="'.$args['height'].'"';
        }

        if (isset($args['target'])) {
            $shortCode .= ' target="'.$args['target'].'"';
        }

        if (isset($args['elements'])) {
            $shortCode .= ' elements="'.$args['elements'].'"';
        }

        if (isset($args['render'])) {
            $shortCode .= ' render="'.$args['render'].'"';
        }

        if (isset($args['sort'])) {
            $shortCode .= ' sort="'.$args['sort'].'"';
        }

        $shortCode .= ']';

        return do_shortcode($shortCode);
    }
}

