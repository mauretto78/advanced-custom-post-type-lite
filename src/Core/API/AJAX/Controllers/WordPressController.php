<?php

namespace ACPT_Lite\Core\API\AJAX\Controllers;

use ACPT_Lite\Core\Helper\Uuid;
use ACPT_Lite\Core\Repository\CustomPostTypeRepository;
use ACPT_Lite\Utils\Data\JsonSanitizer;
use ACPT_Lite\Utils\PHP\Sluggify;
use ACPT_Lite\Utils\Wordpress\Comments;
use ACPT_Lite\Utils\Wordpress\Posts;
use ACPT_Lite\Utils\Wordpress\Users;

class WordPressController extends AbstractController
{
    /**
     * Check if a Custom post type exists
     *
     * @return void
     */
    public function checkPostTypeNameAction(): void
    {
        if (!empty($this->request->post('data'))) {
            $data = $this->sanitizeJsonData($this->request->post('data'));

            if (!isset($data['postType'])) {
                wp_send_json([
                        'success' => false,
                        'error' => 'Missing postType'
                ]);
            }

            $postType = $data['postType'];

            wp_send_json([
                    'exists' => CustomPostTypeRepository::exists($postType)
            ]);
        }
    }

    /**
     * Fetch attachments, optionally filtered by mime type.
     *
     * @return void
     */
    public function fetchAttachmentsAction(): void
    {
        if (!empty($this->request->post('data'))) {
            $data     = $this->sanitizeJsonData($this->request->post('data'));
            $mimeType = sanitize_text_field($data['mimeType'] ?? 'All formats');

            $result = [];

            foreach (Posts::getAttachmentsByMimeType($mimeType) as $attachment) {
                $label    = $attachment->post_title ?: basename(get_attached_file($attachment->ID) !== false ? get_attached_file($attachment->ID) : $attachment->guid);
                $result[] = ['label' => $label, 'value' => (int)$attachment->ID];
            }

            wp_send_json($result);
        }
    }

    /**
     * Fetch all comments for the RULE_COMMENT location value selector.
     * Accepts optional `commentIds` (comma-separated) to restrict the result set.
     *
     * @return void
     */
    public function fetchCommentsAction(): void
    {
        $data          = !empty($this->request->post('data')) ? $this->sanitizeJsonData($this->request->post('data')) : [];
        $commentIdsRaw = sanitize_text_field($data['commentIds'] ?? '');
        $commentIds    = array_values(array_filter(array_map('intval', explode(',', $commentIdsRaw))));

        $args = [
            'orderby' => 'comment_date',
            'order'   => 'DESC',
        ];

        if (!empty($commentIds)) {
            $args['comment_ids'] = $commentIds;
        }

        $result = [];

        foreach (Comments::getList($args) as $comment) {
            /** @var \WP_Comment $comment */
            $label    = Comments::render($comment);
            $result[] = ['label' => $label, 'value' => $comment->comment_ID];
        }

        wp_send_json($result);
    }

    /**
     * Fetch all page templates registered by the active theme for the RULE_POST_TEMPLATE location value selector.
     *
     * @return void
     */
    public function fetchPageTemplatesAction(): void
    {
        $templates = wp_get_theme()->get_page_templates();
        $result    = [];

        foreach ($templates as $file => $name) {
            $result[] = ['label' => $name, 'value' => $file];
        }

        wp_send_json($result);
    }

    /**
     * Fetch all registered post statuses for the RULE_POST_STATUS location value selector.
     * When RULE_POST_ID values are present in locationContext, returns only the statuses
     * those specific posts actually have.
     *
     * @return void
     */
    public function fetchPostStatusesAction(): void
    {
        $data    = !empty($this->request->post('data')) ? $this->sanitizeJsonData($this->request->post('data')) : [];
        $context = [];

        // RULE_POST_ID = 6
        $postIds = isset($context[6]) ? array_values(array_filter(array_map('intval', $context[6]))) : [];

        if (!empty($postIds)) {
            global $wpdb;
            $placeholders = implode(',', array_fill(0, count($postIds), '%d'));
            // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
            $rows         = $wpdb->get_results($wpdb->prepare("SELECT DISTINCT post_status FROM {$wpdb->prefix}posts WHERE ID IN ($placeholders)", $postIds));
            $usedStatuses = array_map(function ($row) {
                return $row->post_status;
            }, $rows);
            $allStatuses  = get_post_statuses();
            $result       = [];
            foreach ($allStatuses as $key => $label) {
                if (in_array($key, $usedStatuses, true)) {
                    $result[] = ['label' => $label, 'value' => $key];
                }
            }
            wp_send_json($result);
        }

        $statuses = get_post_statuses();
        $result   = [];

        foreach ($statuses as $key => $label) {
            $result[] = ['label' => $label, 'value' => $key];
        }

        wp_send_json($result);
    }

    /**
     * Fetch post types
     * When locationContext is present, applies context filters:
     *   - RULE_POST_STATUS (5) → restrict results to posts with those statuses
     *   - RULE_PARENT_POST_ID (9) → restrict results to posts with those parent IDs
     *
     * @return void
     */
    public function fetchPostTypePostsAction(): void
    {
        if (!empty($this->request->post('data'))) {
            $data = $this->sanitizeJsonData($this->request->post('data'));

            if (!isset($data['postType'])) {
                wp_send_json([
                        'success' => false,
                        'error' => 'Missing postType'
                ], 500);
            }

            $postType = $data['postType'];
            $context  = [];

            // RULE_POST_STATUS = 5
            $statusFilter = $context[5] ?? [];

            // RULE_PARENT_POST_ID = 9
            $parentIds = array_map('intval', $context[9] ?? []);

            // POST_ID = 6
            $postIds  = $context[6] ?? [];

            // RULE_POST_TAX = 11 — resolved to post IDs by parseLocationContext
            $postTaxIds   = $context[11] ?? [];
            if (!empty($postTaxIds)) {
                $postTaxIds = array_map('intval', $postTaxIds);
                $postIds    = !empty($postIds)
                    ? array_values(array_intersect(array_map('intval', $postIds), $postTaxIds))
                    : $postTaxIds;
            }

            // RULE_POST_CAT = 10 — resolved to post IDs by parseLocationContext
            $postCatIds   = $context[10] ?? [];
            if (!empty($postCatIds)) {
                $postCatIds = array_map('intval', $postCatIds);
                $postIds    = !empty($postIds)
                    ? array_values(array_intersect(array_map('intval', $postIds), $postCatIds))
                    : $postCatIds;
            }

            // RULE_POST_TEMPLATE = 12 — resolved to post IDs by parseLocationContext
            $postTemplateIds = $context[12] ?? [];
            if (!empty($postTemplateIds)) {
                $postTemplateIds = array_map('intval', $postTemplateIds);
                $postIds         = !empty($postIds)
                    ? array_values(array_intersect(array_map('intval', $postIds), $postTemplateIds))
                    : $postTemplateIds;
            }

            // Values to be excluded from results (e.g. already selected in other location rules)
            $excludedIds = [];
            $result = [];

            foreach (Posts::getPostsByTypeFromCache($postType, $statusFilter, $parentIds, $postIds) as $post) {
                if (!in_array($post->ID, $excludedIds)) {
                    $result[] = ['label' => $post->post_title, 'value' => (int)$post->ID];
                }
            }

            wp_send_json($result);
        }
    }

    /**
     * Fetch CPT not registered in ACPT
     *
     * @return void
     */
    public function fetchPostTypesAction(): void
    {
        $postTypes = get_post_types(['_builtin' => false], 'objects');

        $postTypesArray = [];
        foreach ($postTypes as $postType) {
            if (
                CustomPostTypeRepository::exists($postType->name) === false &&
                $postType->show_ui === true &&
                $postType->show_in_nav_menus === true
            ) {
                $postTypesArray[] = $postType;
            }
        }

        wp_send_json($postTypesArray);
    }

    /**
     * Fetch users for the RULE_USER_ID location value selector.
     * Accepts an optional "userIds" param (comma-separated IDs) to restrict the list
     * to the users configured in the table's location rule.
     *
     * @return void
     */
    public function fetchUsersAction(): void
    {
        $data         = !empty($this->request->post('data')) ? $this->sanitizeJsonData($this->request->post('data')) : [];
        $userIdsParam = sanitize_text_field($data['userIds'] ?? '');
        $userIds      = array_values(array_filter(array_map('intval', explode(',', $userIdsParam))));

        $args = ['fields' => ['ID', 'display_name'], 'orderby' => 'display_name', 'order' => 'ASC'];

        if (!empty($userIds)) {
            $args['include'] = $userIds;
        }

        $result = [];

        foreach (get_users($args) as $user) {
            $wpUser   = new \WP_User($user->ID);
            $result[] = ['label' => Users::getUserLabel($wpUser), 'value' => $user->ID];
        }

        wp_send_json($result);
    }

    /**
     * Sluggify a string
     *
     * @throws \Exception
     *
     * @return void
     */
    public function sluggifyAction(): void
    {
        $string = null;
        $maxLength = 20;
        if (!empty($this->request->post('data'))) {
            $data = $this->sanitizeJsonData($this->request->post('data'));
            $string = isset($data['string']) ? $data['string'] : null;
            $maxLength = isset($data['maxLength']) ? $data['maxLength'] : 20;
        }

        if ($string) {
            wp_send_json([
                'string' => Sluggify::slug($string, $maxLength)
            ]);
        }

        wp_send_json([
                'success' => false,
                'error' => 'no string was sent'
        ], 500);
    }
}
