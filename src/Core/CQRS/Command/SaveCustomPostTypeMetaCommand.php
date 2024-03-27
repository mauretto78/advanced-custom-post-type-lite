<?php

namespace ACPT_Lite\Core\CQRS\Command;

use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Core\Models\Meta\MetaGroupModel;
use ACPT_Lite\Core\Validators\MetaDataValidator;
use ACPT_Lite\Utils\Sanitizer;
use ACPT_Lite\Utils\Arrays;

class SaveCustomPostTypeMetaCommand implements CommandInterface
{
	/**
	 * @var int
	 */
	private $postId;

	/**
	 * @var array
	 */
	private array $data;

	/**
	 * @var array
	 */
	private array $metaGroups;

	/**
	 * SaveCustomPostTypeMetaCommand constructor.
	 *
	 * @param $postId
	 * @param MetaGroupModel[] $metaGroups
	 * @param array $data
	 */
	public function __construct($postId, array $metaGroups = [], array $data = [])
	{
		$this->postId = $postId;
		$this->data = $data;
		$this->metaGroups = $metaGroups;
	}

	/**
	 * @inheritDoc
	 * @throws \Exception
	 */
	public function execute()
	{
		foreach ($this->metaGroups as $metaGroup){
			foreach ($metaGroup->getBoxes() as $boxModel) {
				foreach ($boxModel->getFields() as $fieldModel) {
					$this->saveField($fieldModel);
				}
			}
		}
	}

	/**
	 * @param MetaFieldModel $fieldModel
	 *
	 * @throws \Exception
	 */
	private function saveField(MetaFieldModel $fieldModel)
	{
		$data = $this->data;
		$idName = $fieldModel->getDbName();

		if(isset($data[$idName])){
			$rawValue = $data[$idName];

			// validation
			try {
				MetaDataValidator::validate($fieldModel->getType(), $rawValue, $fieldModel->isRequired());
			} catch (\Exception $exception){
				wp_die('There was an error during saving data. The error is: ' . $exception->getMessage());
			}

			$value = $rawValue;

			if(is_array($value)){
				$value = Arrays::reindex($value);
			}

			update_post_meta(
				$this->postId,
				$idName,
				Sanitizer::sanitizeRawData($fieldModel->getType(), $value)
			);

			$extras = [
				'id',
				'type',
				'label',
				'currency',
				'weight',
				'length',
				'lat',
				'lng',
			];

			foreach ($extras as $extra){
				if(isset($data[$idName.'_'.$extra])){
					update_post_meta($this->postId, $idName.'_'.$extra, Sanitizer::sanitizeRawData(MetaFieldModel::TEXT_TYPE, $data[$idName.'_'.$extra] ) );
				}
			}

		} else {
			update_post_meta($this->postId, $idName, '');
		}

		if(!empty($errors)){
			set_transient( "acpt_plugin_error_msg_".$this->postId, $errors, 60 );
			add_filter( 'redirect_post_location', [$this, 'addNoticeQueryVar'], 99 );
		}
	}

	/**
	 * @param $location
	 * @return mixed
	 */
	public function addNoticeQueryVar( $location )
	{
		remove_filter( 'redirect_post_location', array( $this, 'addNoticeQueryVar' ), 99 );

		return add_query_arg( ['errors' => true], $location );
	}
}