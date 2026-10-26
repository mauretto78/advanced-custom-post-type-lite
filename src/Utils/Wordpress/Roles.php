<?php

namespace ACPT_Lite\Utils\Wordpress;

class Roles
{
    /**
     * $return can be: array|objects|names
     *
     * @param string $return
     * @return array<int|string, mixed>
     */
    public static function get(string $return = 'array'): array
    {
        if (! function_exists('wp_roles')) {
            return [];
        }

        $wp_roles = wp_roles();
        $roles = [];

        $roleNames = $wp_roles->get_names();
        asort($roleNames);

        switch ($return) {
            case "array":
                foreach ($roleNames as $value => $label) {
                    $roles[] = [
                        'label' => $label,
                        'value' => $value,
                    ];
                }

                break;

            case "names":
                foreach ($roleNames as $value => $label) {
                    $roles[] = $value;
                }
                break;

            case "objects":
                foreach ($roleNames as $value => $label) {
                    $roles[$value] = get_role($value);
                }
                break;
        }

        return $roles;
    }

    public static function refresh(): void
    {
        if (! class_exists('WP_Roles')) {
            return;
        }

        // refresh roles
        $wpRoles = new \WP_Roles();
        $wpRoles->for_site();
    }
}
