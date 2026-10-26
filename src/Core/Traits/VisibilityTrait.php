<?php

namespace ACPT_Lite\Core\Traits;

use ACPT_Lite\Constants\BelongsTo;
use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Constants\Operator;
use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Belong\BelongModel;
use ACPT_Lite\Integrations\WooCommerce\ACPT_Lite_WooCommerce;
use ACPT_Lite\Utils\Data\Meta;
use ACPT_Lite\Utils\PHP\Arrays;
use ACPT_Lite\Utils\PHP\Logics;
use ACPT_Lite\Utils\PHP\Request;
use ACPT_Lite\Utils\PHP\Url;
use ACPT_Lite\Utils\Wordpress\Terms;

trait VisibilityTrait
{
    /**
     * Evaluates the visibility of elements based on location-specific rules and request context.
     *
     * @param Request $request The current HTTP request object containing data about the request environment.
     * @param array<string, mixed> $rules An array of visibility rules to evaluate against the request context.
     * @param array<string, mixed> $args An array of extra arguments to be used during the evaluation process.
     *
     * @return bool Returns true if the visibility rules are satisfied for the given request context, otherwise false.
     */
    public function evaluateVisibilityFromLocationRules(Request $request, array $rules = [], array $args = []): bool
    {
        // no location rules
        if (empty($rules)) {
            return false;
        }

        $pagenow = Url::pagenow($request);
        $logicBlocks = Logics::extractLogicBlocks($rules);

        // extract base arguments from env
        $belongTo = $args['belongsTo'] ?? null;
        $find     = $args['find'] ?? null;
        $allUsers = $args['all_users'] ?? null;
        $userId   = $args['user_id']   ?? null;

        $postId = $args['post_id'] ?? $args['comment_id'] ?? $request->get('post') ?? $request->get('item') ?? $request->post('post_ID') ?? (
            ($belongTo === BelongsTo::POST_ID || $belongTo === MetaTypes::CUSTOM_POST_TYPE)
                ? (is_numeric($args['find']) ? $args['find'] : null)
                : null
        );

        $termId = $args['term_id'] ?? $request->get('tag_ID') ?? (
            ($belongTo === BelongsTo::TERM_ID || $belongTo === MetaTypes::TAXONOMY)
                ? (is_numeric($args['find']) ? $args['find'] : null)
                : null
        );

        $page = $args['option_page'] ?? $request->get('page') ?? (
            null
        );

        // Handle REST API requests
        // Example: /wp-json/wp/v2/users/1
        // /?rest_route=/wp/v2/users/1
        $restRoute = null;
        $restRouteParams = [];

        if ($request->isRestRequest()) {
            if ($postId === null) {
                $postId = get_the_ID();
            }

            $restRoute = $request->get('rest_route') ?? parse_url(Url::fullUrl($request), PHP_URL_PATH);
            $restRouteParams = explode("/", $restRoute);
        }

        // review only belongTo (get all fields belonging to CPT, TAXONOMY, or OPTION PAGES)
        if ($find === null) {
            $allowed = [
                MetaTypes::CUSTOM_POST_TYPE,
                MetaTypes::TAXONOMY,
            ];

            if ($request->isAjax()) {
                $allowed[] = MetaTypes::USER;
            }

            if (in_array($belongTo, $allowed)) {
                return $this->reviewOnlyBelongTo($belongTo, $logicBlocks);
            }
        }

        // determine postType and taxonomy
        $postType = null;
        $taxonomy = null;

        if (
            ($pagenow === "post-new.php" || $pagenow === "edit.php") &&
            $request->get('post_type') !== null &&
            !ACPT_Lite_WooCommerce::isWooCommerceProductAttributePage($pagenow)
        ) {
            $postType = $request->get('post_type');
        } elseif (!empty($postId)) {
            $postType = get_post_type($postId);
        } elseif ($belongTo === MetaTypes::CUSTOM_POST_TYPE) {
            $postType = $find;
        }

        // WooCommerce product attribute page
        if ($request->get('taxonomy') !== null) {
            $taxonomy = $request->get('taxonomy');
        } elseif (!empty($termId)) {
            $term = get_term($termId);
            $taxonomy = $term instanceof \WP_Term ? $term->taxonomy : null;
        } elseif ($belongTo === MetaTypes::TAXONOMY) {
            $taxonomy = $find;
        }

        if (empty($taxonomy) && ACPT_Lite_WooCommerce::isWooCommerceProductAttributePage($pagenow)) {
            $id = $request->get('edit') !== null ? absint($request->get('edit')) : 0;
            $taxonomy = ACPT_Lite_WooCommerce::getWooCommerceProductAttributeName((int)$id);
        }

        foreach ($logicBlocks as $logicBlock) {
            $matches = 0;

            foreach ($logicBlock as $model) {

                // exit if the model is not an instance of BelongModel or TableLocationObject
                if (!($model instanceof BelongModel)) {
                    continue;
                }

                $belongsTo = $model->getBelongsTo();
                $find = $model->getFind();
                $operator = $model->getOperator();



                switch ($belongsTo) {

                    case MetaTypes::CUSTOM_POST_TYPE:

                        if ($this->reviewCondition($postType, $operator, $find)) {
                            $matches++;
                        }

                        break;
                    case BelongsTo::POST_ID:

                        if ($this->reviewCondition($postId, $operator, $find)) {
                            $matches++;
                        }

                        break;
                    case BelongsTo::PARENT_POST_ID:

                        $postParent = get_post_parent($postId);

                        if ($postParent !== null) {
                            if ($this->reviewCondition($postParent->ID, $operator, $find)) {
                                $matches++;
                            }
                        }

                        break;
                    case BelongsTo::POST_TAX:
                    case BelongsTo::POST_CAT:

                        $post = get_post($postId);

                        if ($post instanceof \WP_Post) {
                            $terms = Terms::getForPostId($post->ID);

                            if (!empty($terms)) {
                                $isNegative = in_array($operator, [Operator::NOT_EQUALS, Operator::NOT_IN]);

                                if ($isNegative) {
                                    // All terms must satisfy the condition (none equals the excluded value)
                                    $allPass = true;
                                    foreach ($terms as $term) {
                                        if (!$this->reviewCondition($term->term_taxonomy_id, $operator, $find)) {
                                            $allPass = false;
                                            break;
                                        }
                                    }
                                    if ($allPass) {
                                        $matches++;
                                    }
                                } else {
                                    // Any matching term is sufficient
                                    foreach ($terms as $term) {
                                        if ($this->reviewCondition($term->term_taxonomy_id, $operator, $find)) {
                                            $matches++;
                                            break;
                                        }
                                    }
                                }
                            }
                        }

                        break;
                    case BelongsTo::POST_TEMPLATE:

                        $file = Meta::fetch($postId, MetaTypes::CUSTOM_POST_TYPE, '_wp_page_template', true);

                        if ($this->reviewCondition($file, $operator, $find)) {
                            $matches++;
                        }

                        break;

                        // 6b. POST_FORMAT
                    case BelongsTo::POST_FORMAT:

                        $format = get_post_format((int)$postId);
                        $format = ($format !== false) ? $format : 'standard';

                        if ($this->reviewCondition($format, $operator, $find)) {
                            $matches++;
                        }

                        break;
                    case MetaTypes::TAXONOMY:

                        if ($this->reviewCondition($taxonomy, $operator, $find)) {
                            $matches++;
                        }

                        break;
                    case BelongsTo::TERM_ID:

                        if ($this->reviewCondition($termId, $operator, $find)) {
                            $matches++;
                        }

                        break;
                    case MetaTypes::MEDIA:

                        if ($pagenow === "upload.php" && empty($postId)) {
                            $matches++;
                        }

                        $mimeType = get_post_mime_type($postId);

                        if ($mimeType) {
                            if ($find === "All formats") {
                                $find = $mimeType;
                            }

                            if ($this->reviewCondition($mimeType, $operator, $find)) {
                                $matches++;
                            }
                        }

                        break;
                    case MetaTypes::COMMENT:

                        $commentPages = [
                            'comment.php',
                        ];

                        if (in_array($pagenow, $commentPages)) {
                            $matches++;
                        }

                        break;
                    case MetaTypes::USER:

                        $userPages = [
                            'users.php',
                            'user-new.php',
                            'user-edit.php',
                            'profile.php',
                        ];

                        if (in_array($pagenow, $userPages)) {
                            $matches++;
                        }

                        // REST API requests
                        // Example: /wp-json/wp/v2/users/1
                        // /?rest_route=/wp/v2/users/1
                        if (Arrays::count($restRouteParams) >= 4) {
                            if ($restRouteParams[Arrays::count($restRouteParams)-2] === 'users' || $restRouteParams[Arrays::count($restRouteParams)-1] === 'users') {
                                $matches++;
                            }
                        }

                        if (!empty($allUsers)) {
                            $matches++;
                        }

                        if (!empty($userId)) {
                            $matches++;
                        }

                        break;
                    case BelongsTo::USER_ID:

                        $userPages = [
                            'profile.php',
                            'user-edit.php',
                        ];

                        // REST API requests. Example:
                        // /wp-json/wp/v2/users/1
                        // /?rest_route=/wp/v2/users/1
                        if (Arrays::count($restRouteParams) >= 4) {
                            $type = $restRouteParams[Arrays::count($restRouteParams)-2];
                            $lastPart = $restRouteParams[Arrays::count($restRouteParams)-1];

                            if ($type === 'users') {
                                if ($this->reviewCondition($lastPart, $operator, $find)) {
                                    $matches++;
                                }
                            }
                        }

                        if (in_array($pagenow, $userPages)) {
                            $userId = $args['user_id'] ?? $request->get('user_id') ?? get_current_user_id();

                            if ($userId == 0) {
                                $userId = $find;
                            }

                            if ($this->reviewCondition($userId, $operator, $find)) {
                                $matches++;
                            }
                        }

                        break;
                }
            }

            if ($matches === Arrays::count($logicBlock)) {
                return true;
            }
        }

        return false;
    }

    /**
     * @param string $belongTo
     * @param array<int, array<int, object>> $logicBlocks
     *
     * @return bool
     */
    private function reviewOnlyBelongTo(string $belongTo, array $logicBlocks = []): bool
    {
        foreach ($logicBlocks as $logicBlock) {
            $matches = 0;

            foreach ($logicBlock as $model) {

                // exit if the model is not an instance of BelongModel or TableLocationObject
                if (!($model instanceof BelongModel)) {
                    continue;
                }

                $belongsToCheck = $model->getBelongsTo();

                if ($belongTo == $belongsToCheck) {
                    $matches++;
                }
            }

            if ($matches === Arrays::count($logicBlock)) {
                return true;
            }
        }

        return false;
    }

    /**
     * @param int|string $find
     * @param string|null $operator
     * @param mixed $check
     *
     * @return bool
     */
    private function reviewCondition($find, ?string $operator, $check): bool
    {
        if (empty($operator)) {
            return false;
        }

        switch ($operator) {
            case Operator::EQUALS:
                if ($find == $check) {
                    return true;
                }

                break;

            case Operator::NOT_EQUALS:
                if ($find != $check) {
                    return true;
                }

                break;

            case Operator::IN:
                if (is_array($check)) {
                    if (in_array($find, $check)) {
                        return true;
                    }
                } elseif (is_string($find) && is_string($check)) {
                    $check = Strings::matches($find, $check);

                    if (Arrays::count($check) > 0) {
                        return true;
                    }
                }

                break;

            case Operator::NOT_IN:
                if (is_array($check)) {
                    if (!in_array($find, $check)) {
                        return true;
                    }
                } elseif (is_string($find) && is_string($check)) {
                    $check = Strings::matches($find, $check);

                    if (empty($check)) {
                        return true;
                    }
                }

                break;
        }

        return false;
    }
}
