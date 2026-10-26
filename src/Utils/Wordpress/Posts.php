<?php

namespace ACPT_Lite\Utils\Wordpress;

use ACPT_Lite\Includes\ACPT_Lite_DB;
use ACPT_Lite\Vendor\Psr\Cache\InvalidArgumentException;

class Posts
{
    /**
     * Retrieves and returns an array of registered post types, including custom post types
     * and the default 'page' and 'post' types, sorted in ascending order.
     *
     * @return string[] An array of post type names, sorted alphabetically.
     */
    public static function registeredPostTypes(): array
    {
        $registeredPostTypes = get_post_types([
            '_builtin' => false,
        ]);

        $registeredPostTypes = array_merge(['page', 'post'], $registeredPostTypes);

        asort($registeredPostTypes);

        return $registeredPostTypes;
    }
    public static function invalidCache(): void
    {
        try {
            ACPT_Lite_DB::invalidateCacheTag(Posts::class);
        } catch (\Exception $exception) {
            do_action("acpt/error", $exception);
        }
    }

    /**
     * Get attachments from cache, optionally filtered by MIME type.
     * Tagged with Posts::class so Posts::invalidCache() clears it alongside other Posts queries.
     *
     * @param string $mimeType 'All formats' = all attachments
     * @return array<int, \stdClass> Objects with fields: ID, post_title
     */
    public static function getAttachmentsByMimeType(string $mimeType = 'All formats'): array
    {
        global $wpdb;

        if ($mimeType === 'All formats') {
            $query = "SELECT ID, post_title FROM {$wpdb->prefix}posts WHERE post_type = 'attachment' AND post_status = 'inherit' ORDER BY post_title ASC";
            return ACPT_Lite_DB::getResults($query, []);
        }

        $query = "SELECT ID, post_title FROM {$wpdb->prefix}posts WHERE post_type = 'attachment' AND post_status = 'inherit' AND post_mime_type = %s ORDER BY post_title ASC";
        return ACPT_Lite_DB::getResults($query, [$mimeType]);
    }

    /**
     * Get posts by post type info from the cache.
     *
     * @param string $postType
     * @param array<int, string> $statusFilter Optional list of post statuses.
     * @param array<int, int|string> $parentIds        Optional list of parent IDs.
     * @param array<int, int|string> $postIds          Optional list of post IDs.
     * @param bool $restrictLoggedUserPosts            Optional flag to restrict posts to the logged-in user.
     * @return array<int, \stdClass>
     */
    public static function getPostsByTypeFromCache(string $postType, array $statusFilter = [], array $parentIds = [], array $postIds = [], bool $restrictLoggedUserPosts = false): array
    {
        global $wpdb;

        $allowedStatuses = ['publish', 'pending', 'draft', 'future', 'private'];
        $statuses        = !empty($statusFilter)
            ? array_values(array_intersect($statusFilter, $allowedStatuses))
            : $allowedStatuses;

        if (empty($statuses)) {
            $statuses = $allowedStatuses;
        }

        $statusPlaceholders = implode(',', array_fill(0, count($statuses), '%s'));
        $params             = array_merge([$postType], $statuses);

        $query = "SELECT ID, post_title, post_parent FROM {$wpdb->prefix}posts WHERE post_type=%s and post_status IN ($statusPlaceholders)";
        $query .= ($restrictLoggedUserPosts) ? " AND post_author = " . get_current_user_id() : "";

        if (!empty($parentIds)) {
            $parentIntIds = array_values(array_filter(array_map('intval', $parentIds)));
            if (!empty($parentIntIds)) {
                $parentPlaceholders = implode(',', array_fill(0, count($parentIntIds), '%d'));
                $query             .= " AND post_parent IN ($parentPlaceholders)";
                $params             = array_merge($params, $parentIntIds);
            }
        }

        if (!empty($postIds)) {
            $postIntIds = array_values(array_filter(array_map('intval', $postIds)));
            if (!empty($postIntIds)) {
                $postPlaceholders = implode(',', array_fill(0, count($postIntIds), '%d'));
                $query             .= " AND ID IN ($postPlaceholders)";
                $params             = array_merge($params, $postIntIds);
            }
        }

        $query .= ' ORDER BY post_title ASC';

        return ACPT_Lite_DB::getResults($query, $params);
    }

    /**
     * @param string $postType
     */
    public static function invalidPostsByTypeQueryCache(string $postType): void
    {
        try {
            global $wpdb;
            $key = "SELECT ID, post_title, post_parent FROM {$wpdb->prefix}posts WHERE post_type='".$postType."' and post_status IN ('publish','pending','draft','future','private') order by post_title asc";
            ACPT_Lite_DB::invalidateCacheKey($key);
        } catch (\Exception $exception) {
            do_action("acpt/error", $exception);
        } catch (InvalidArgumentException $exception) {
            do_action("acpt/error", $exception);
        }
    }

    /**
     * @param string|int $termId
     * @return array<int, \stdClass>
     */
    public static function getForTermId($termId): array
    {
        global $wpdb;

        $sql = "
            SELECT r.object_id, p.post_type
            FROM `{$wpdb->prefix}term_relationships` r
            LEFT JOIN `{$wpdb->prefix}posts` p ON p.ID = r.object_id
            WHERE r.term_taxonomy_id = %s
        ";

        return ACPT_Lite_DB::getResults($sql, [$termId]);
    }

    /**
     * @param array<string, mixed> $args
     * @return array<int, array{postType: string, posts: array<int|string, string>}>
     */
    public static function getList(array $args = []): array
    {
        try {
            global $wpdb;

            $postTypeParam = isset($args['post_type']) ? $args['post_type'] : null;
            $postStatusParam = isset($args['post_status']) ? $args['post_status'] : null;
            $taxonomyParam = isset($args['taxonomy']) ? $args['taxonomy'] : null;
            $authorParam = isset($args['author']) ? $args['author'] : null;

            $posts = [];
            $postTypes = get_post_types([
                'public'  => true,
                'show_ui' => true,
            ]);

            if ($postTypeParam !== null) {
                $postTypes = array_filter($postTypes, function ($postType) use ($postTypeParam) {
                    return $postType === $postTypeParam;
                });
            }

            foreach ($postTypes as $postType) {
                $childPosts = [];
                $postStatus = ($postStatusParam !== null) ? $postStatusParam : 'publish';
                $queryArgs = [$postType, $postStatus];

                $sql = "
					SELECT ID, post_title FROM `{$wpdb->prefix}posts` p
					LEFT JOIN `{$wpdb->prefix}term_relationships` t  ON (p.ID = t.object_id) 
					WHERE p.post_type = %s 
					AND p.post_status = %s
				";

                if ($authorParam !== null) {
                    $sql .= ' AND p.post_author = %d';
                    $queryArgs[] = (int)$authorParam;
                }

                if ($taxonomyParam !== null) {
                    $sql .= ' AND t.term_taxonomy_id = %d';
                    $queryArgs[] = (int)$taxonomyParam;
                }

                $fetchedPosts = ACPT_Lite_DB::getResults($sql, $queryArgs);

                foreach ($fetchedPosts as $fetchedPost) {
                    $childPosts[$fetchedPost->ID] = $fetchedPost->post_title;
                }

                $posts[] = [
                    'postType' => $postType,
                    'posts' => $childPosts
                ];
            }

            return $posts;
        } catch (\Exception $exception) {
            do_action("acpt/error", $exception);

            return [];
        }
    }

    /**
     * Retrieves a post by its title.
     *
     * @param string $title The title of the post to retrieve.
     * @return \WP_Post|null The WordPress post object if found, or null if no post matches the specified title.
     */
    public static function getPostByTitle(string $title): ?\WP_Post
    {
        global $wpdb;

        $sql = "SELECT ID, post_title FROM {$wpdb->prefix}posts WHERE post_title = %s";
        $result = ACPT_Lite_DB::getResults($sql, [$title]);

        if (empty($result)) {
            return null;
        }

        $post = get_post($result[0]->ID);

        if ($post instanceof \WP_Post) {
            return $post;
        }

        return null;
    }
}
