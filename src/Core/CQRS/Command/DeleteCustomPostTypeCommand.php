<?php

namespace ACPT_Lite\Core\CQRS\Command;

use ACPT_Lite\Core\Models\Settings\SettingsModel;
use ACPT_Lite\Core\Repository\CustomPostTypeRepository;
use ACPT_Lite\Utils\Settings\Settings;

class DeleteCustomPostTypeCommand implements CommandInterface
{
	/**
	 * @var string
	 */
	private $postType;

	/**
	 * DeleteCustomPostTypeCommand constructor.
	 *
	 * @param $postType
	 */
	public function __construct($postType)
	{
		$this->postType = $postType;
	}

	/**
	 * @return mixed|void
	 * @throws \Exception
	 */
	public function execute()
	{
		// Delete posts option
		$deletePosts = false;
		$deletePostsOption = Settings::get(SettingsModel::DELETE_POSTS_KEY, 0);

		if($deletePostsOption == 1){
			$deletePosts = true;
		}

		CustomPostTypeRepository::delete($this->postType, $deletePosts);
		unregister_post_type($this->postType);
	}
}