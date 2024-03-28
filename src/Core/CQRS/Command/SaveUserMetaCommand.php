<?php

namespace ACPT_Lite\Core\CQRS\Command;

use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Core\Models\Meta\MetaGroupModel;
use ACPT_Lite\Core\Validators\MetaDataValidator;
use ACPT_Lite\Utils\Sanitizer;
use ACPT_Lite\Utils\Arrays;

class SaveUserMetaCommand implements CommandInterface
{
	/**
	 * @var
	 */
	private $user_id;

	/**
	 * @var MetaGroupModel[]
	 */
	private array $metaGroups;

	/**
	 * SaveUserMetaCommand constructor.
	 *
	 * @param $user_id
	 * @param array $metaGroups
	 */
	public function __construct($user_id, array $metaGroups = [])
	{
		$this->user_id = $user_id;
		$this->metaGroups = $metaGroups;
	}

	/**
	 * @return bool|mixed|void
	 * @throws \Exception
	 */
	public function execute()
	{
		$user_id = $this->user_id;

		if ( !current_user_can( 'edit_user', $user_id ) ){
			return false;
		}

		foreach ($this->metaGroups as $metaGroup){
			foreach ($metaGroup->getBoxes() as $boxModel){
				foreach ($boxModel->getFields() as $fieldModel){
					$idName = Strings::toDBFormat($boxModel->getName()) . '_' . Strings::toDBFormat($fieldModel->getName());

					if(isset($_POST[$idName])){
						$rawValue = $_POST[$idName];

						// validation
						try {
							MetaDataValidator::validate($fieldModel->getType(), $rawValue);
						} catch (\Exception $exception){
							wp_die('There was an error during saving data. The error is: ' . $exception->getMessage());
						}

						if(is_array($rawValue)){
							$rawValue = Arrays::reindex($rawValue);
						}

						update_user_meta( $user_id, $idName, Sanitizer::sanitizeRawData($fieldModel->getType(), $rawValue));

						$extras = [
							'type',
							'label',
							'currency',
							'weight',
							'length',
							'lat',
							'lng',
						];

						foreach ($extras as $extra){
							if(isset($_POST[$idName.'_'.$extra])){
								update_user_meta( $user_id, $idName.'_'.$extra, Sanitizer::sanitizeRawData(MetaFieldModel::TEXT_TYPE, $_POST[$idName.'_'.$extra] ) );
							}
						}
					}
				}
			}
		}
	}
}