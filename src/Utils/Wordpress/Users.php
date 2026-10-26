<?php

namespace ACPT_Lite\Utils\Wordpress;

class Users
{
    /**
     * @param array<string, mixed> $args
     * @return array<int, string>
     */
    public static function getList(array $args = []): array
    {
        try {
            $list = [];
            $roleParam = $args['role'] ?? null;
            $queryParams = [
                'orderby'  => 'meta_value',
                'meta_key' => 'last_name',
                'order'    => 'ASC',
                'fields'   => [
                    'ID',
                    'display_name',
                ],
            ];

            if (is_array($roleParam)) {
                $queryParams['role__in'] = $roleParam;
            } elseif (is_string($roleParam)) {
                $queryParams['role'] = $roleParam;
            }

            $users = get_users($queryParams);

            foreach ($users as $user) {
                $wpUser = new \WP_User($user->ID);
                $list[$user->ID] = self::getUserLabel($wpUser);
            }

            return $list;
        } catch (\Exception $exception) {
            do_action("acpt/error", $exception);

            return [];
        }
    }

    /**
     * @param \WP_User $user
     *
     * @return string
     */
    public static function getUserLabel(\WP_User $user): string
    {
        $userData = get_userdata($user->ID);

        if ($userData instanceof \WP_User && $userData->first_name && $userData->last_name) {
            return $userData->first_name . ' ' . $userData->last_name;
        }

        return $user->display_name;
    }

    /**
     * @param \WP_User $user
     *
     * @return string|null
     */
    public static function getBio(\WP_User $user): ?string
    {
        $bio = get_the_author_meta('description', $user->ID);

        if (empty($bio)) {
            return null;
        }

        return $bio;
    }

    /**
     * @param \WP_User $user
     * @param int $size
     * @param string|null $default
     *
     * @return string|null
     */
    public static function getAvatar(\WP_User $user, int $size = 96, ?string $default = null): ?string
    {
        $avatar = get_avatar($user->ID, $size, (string)$default);

        if ($avatar === false) {
            return null;
        }

        return $avatar;
    }

    /**
     * Retrieves a user by a given label.
     *
     * @param string $label The label to search for within user data.
     * @return \WP_User|null Returns the first matching user as a \WP_User object, or null if no user is found.
     */
    public static function getByLabel(string $label): ?\WP_User
    {
        $users = get_users([
            'search' => $label,
            'number' => 1,
        ]);

        if (empty($users)) {
            return null;
        }

        return $users[0];
    }
}
