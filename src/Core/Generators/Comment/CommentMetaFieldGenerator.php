<?php

namespace ACPT\Core\Generators\Comment;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Generators\AbstractGenerator;
use ACPT_Lite\Core\Generators\Meta\Fields\AbstractField;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;

class CommentMetaFieldGenerator extends AbstractGenerator
{
	/**
	 * @var MetaFieldModel
	 */
	private MetaFieldModel $fieldModel;

	/**
	 * AttachmentMetaFieldGenerator constructor.
	 *
	 * @param MetaFieldModel $fieldModel
	 */
	public function __construct(MetaFieldModel $fieldModel)
	{
		$this->fieldModel = $fieldModel;
	}

	/**
	 * @return string
	 */
	public function render()
	{
		$field = $this->getCommentMetaField();

		if($field){
			$render = $field->render();

			return preg_replace('/width: \d+\%\;|width: \d+\%/', '', $render);
		}

		return null;
	}

	/**
	 * @param null $commentId
	 *
	 * @return AbstractField|null
	 */
	public function getCommentMetaField($commentId = null)
	{
		$notAllowed = [
			MetaFieldModel::EMBED_TYPE,
			MetaFieldModel::REPEATER_TYPE,
			MetaFieldModel::FLEXIBLE_CONTENT_TYPE,
			MetaFieldModel::LIST_TYPE,
			MetaFieldModel::POST_TYPE,
			MetaFieldModel::IMAGE_TYPE,
			MetaFieldModel::GALLERY_TYPE,
			MetaFieldModel::VIDEO_TYPE,
		];

		if(in_array($this->fieldModel->getType(), $notAllowed)){
			return null;
		}

		$className = 'ACPT\\Core\\Generators\\Meta\\Fields\\'.$this->fieldModel->getType().'Field';
		$commentId = $commentId ? $commentId : 0;

		if(class_exists($className)){
			/** @var AbstractField $instance */
			$instance = new $className($this->fieldModel, MetaTypes::COMMENT, $commentId);

			return $instance;
		}

		return null;
	}
}
