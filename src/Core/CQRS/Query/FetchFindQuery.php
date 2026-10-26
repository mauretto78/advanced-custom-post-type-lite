<?php

namespace ACPT_Lite\Core\CQRS\Query;

use ACPT_Lite\Constants\BelongsTo;

class FetchFindQuery implements QueryInterface
{
    /**
     * @var int
     */
    private int $id;

    /**
     * @var string
     */
    private string $belongsTo;

    /**
     * @param int $id
     * @param string $belongsTo
     */
    public function __construct(int $id, string $belongsTo)
    {
        $this->id = $id;
        $this->belongsTo = $belongsTo;
    }

    /**
     * @return string
     * @throws \Exception
     */
    public function execute(): string
    {
        $return = '';

        // Prevent any error if one of those functions is undefined:
        if (!function_exists('get_post')) {
            include_once(ABSPATH . 'wp-includes/post.php');
        }

        if (!function_exists('get_user_by')) {
            include_once(ABSPATH . 'wp-includes/pluggable.php');
        }

        if (!function_exists('get_term')) {
            include_once(ABSPATH . 'wp-includes/taxonomy.php');
        }

        switch ($this->belongsTo) {

            case BelongsTo::PARENT_POST_ID:
            case BelongsTo::POST_ID:
                $return = get_the_title($this->id);
                break;

            case BelongsTo::TERM_ID:
            case BelongsTo::POST_TAX:
                $term = get_term($this->id);
                $return = ($term instanceof \WP_Term) ? $term->name : '';
                break;

            case BelongsTo::POST_CAT:
                $return = get_cat_name($this->id);
                break;

            case BelongsTo::POST_TEMPLATE:
                $templates = wp_get_theme()->get_page_templates();
                $return = $templates[$this->id] ?? '';
                break;

            case BelongsTo::USER_ID:
                $user = get_user_by('id', $this->id);
                $return = ($user instanceof \WP_User) ? $user->display_name : '';
                break;
        }

        return $return;
    }
}
