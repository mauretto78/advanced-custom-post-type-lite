<?php

namespace ACPT_Lite\Utils\Wordpress;

use ACPT_Lite\Includes\ACPT_Lite_DB;

class Comments
{
    public static function invalidCache(): void
    {
        try {
            ACPT_Lite_DB::invalidateCacheTag(Comments::class);
        } catch (\Exception $exception) {
            do_action("acpt/error", $exception);
        }
    }

    /**
     * Retrieves a list of comments based on the provided arguments.
     *
     * @param array<string, mixed> $args An associative array of arguments to filter and sort the results. Possible keys include:
     *                    - 'status' (string): The comment approval status. Default is 'approve'.
     *                    - 'orderby' (string): The column to order by. Default is 'comment_date'.
     *                    - 'order' (string): The sorting order, either 'ASC' or 'DESC'. Default is 'DESC'.
     *                    - 'comment_ids' (array|null): An array of specific comment IDs to include. Default is null.
     * @return array<int, \stdClass> An array of comments matching the specified criteria.
     */
    public static function getList($args = []): array
    {
        try {
            global $wpdb;

            $approved = isset($args['approved']) ? (int)$args['approved'] : 1;
            $commentIds = $args['comment_ids'] ?? null;

            // 1. Validate Orderby
            $allowedOrderby = ['comment_date', 'comment_ID', 'comment_author', 'comment_content'];
            $orderby = in_array($args['orderby'] ?? '', $allowedOrderby, true) ? $args['orderby'] : 'comment_date';

            // 2. Validate Order
            $order = strtoupper($args['order'] ?? 'DESC');
            if (!in_array($order, ['ASC', 'DESC'], true)) {
                $order = 'DESC';
            }

            $queryArgs = [$approved];

            $sql = "SELECT comment_ID, comment_author, comment_content 
                FROM {$wpdb->comments} 
                WHERE comment_approved = %d";

            // 3. Handle IDs safely
            if (!empty($commentIds) && is_array($commentIds)) {
                $placeholders = implode(',', array_fill(0, count($commentIds), '%d'));
                $sql .= " AND comment_ID IN ($placeholders)";
                $queryArgs = array_merge($queryArgs, array_map('intval', $commentIds));
            }

            // 4. Append validated (not placeholder) strings
            $sql .= " ORDER BY $orderby $order";

            return ACPT_Lite_DB::getResults($sql, $queryArgs);
        } catch (\Exception $exception) {
            do_action("acpt/error", $exception);
            return [];
        }
    }

    /**
     * Renders a formatted string representation of a WordPress comment.
     *
     * @param \WP_Comment $comment The comment instance to render.
     * @return string The formatted string containing the comment ID, author, and trimmed content.
     */
    public static function render(\WP_Comment $comment): string
    {
        if (empty($comment->comment_ID)) {
            return '';
        }

        if (empty($comment->comment_author)) {
            return '';
        }

        if (empty($comment->comment_content)) {
            return '';
        }

        return sprintf('#%d — %s: %s', $comment->comment_ID, $comment->comment_author, wp_trim_words($comment->comment_content, 8, '...'));
    }
}
