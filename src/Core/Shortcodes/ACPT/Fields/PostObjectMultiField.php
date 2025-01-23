<?php

namespace ACPT_Lite\Core\Shortcodes\ACPT\Fields;

class PostObjectMultiField extends AbstractField
{
	public function render()
	{
		if($this->payload->preview){

			$rawData = $this->fetchRawData();

			if(!isset($rawData['value'])){
				return null;
			}

			if(empty($rawData['value'])){
				return null;
			}

			$postIds = $rawData['value'];

			return $this->renderPosts($postIds);
		}

		return null;
	}

	/**
	 * @param $postIds
	 *
	 * @return string
	 */
	private function renderPosts($postIds)
	{
		if(!is_array($postIds)){
			return null;
		}

		if(!empty($postIds)){
			$postsArray = [];

			foreach ($postIds as $postId){
				$postsArray[] = $this->addBeforeAndAfter($this->renderPost($postId));
			}

			return implode(", ", $postsArray);
		}

		return null;
	}
}