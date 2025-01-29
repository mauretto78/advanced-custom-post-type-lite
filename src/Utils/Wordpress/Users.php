<?php

namespace ACPT_Lite\Utils\Wordpress;

class Users
{
	/**
	 * @param array $args
	 *
	 * @return array
	 */
    public static function getList($args = []): array
    {
    	try {
		    $list = [];
			$roleParam = isset($args['role']) ? $args['role'] : null;
			$queryParams = [
				'fields' => [
					'ID',
					'display_name',
				],
			];

		    if(is_array($roleParam)){
			    $queryParams['role__in'] = $roleParam;
		    } elseif(is_numeric($roleParam)){
			    $queryParams['role'] = $roleParam;
		    }

		    $users = get_users($queryParams);

		    usort($users, function ($a, $b){
			    if(isset($a->last_name) and isset($b->last_name)){
				    return strnatcasecmp($a->last_name, $b->last_name);
			    }

			    return 0;
		    });

		    foreach($users as $user){
			    $wpUser = new \WP_User($user->ID);
			    $list[$user->ID] = self::getUserLabel($wpUser);
		    }

		    return $list;

	    } catch (\Exception $exception){
		    return [];
	    }
    }

    /**
     * @param \WP_User $user
     *
     * @return string
     */
    public static function getUserLabel(\WP_User $user)
    {
        $userData = get_userdata( $user->ID );

        if($userData->first_name and $userData->last_name){
            return $userData->first_name . ' ' . $userData->last_name;
        }

        return $user->display_name;
    }

	/**
	 * @param \WP_User $user
	 *
	 * @return string|null
	 */
    public static function getBio(\WP_User $user)
    {
	    $bio = get_the_author_meta( 'description', $user->ID );

	    if(empty($bio)){
	    	return null;
	    }

	    return $bio;
    }

	/**
	 * @param \WP_User $user
	 * @param int $size
	 * @param null $default
	 *
	 * @return bool|mixed|void
	 */
	public static function getAvatar(\WP_User $user, $size = 96, $default = null)
	{
		return get_avatar($user->ID, $size, $default);
	}
}