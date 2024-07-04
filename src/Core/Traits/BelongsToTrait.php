<?php

namespace ACPT_Lite\Core\Traits;

use ACPT_Lite\Constants\Operator;
use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Belong\BelongModel;
use ACPT_Lite\Utils\PHP\Logics;

trait BelongsToTrait
{
	/**
	 * @param string $belongsTo
	 * @param string|null $operator
	 * @param null $find
	 *
	 * @return bool
	 */
	public function belongsTo(string $belongsTo, ?string $operator = null, $find = null): bool
	{
		if(!method_exists(static::class, 'getBelongs')){
			return false;
		}

		try {
			/** @var BelongModel[] $belongs */
			$belongs = static::getBelongs();

			if(empty($belongs)){
				return false;
			}

			$logicBlocks = Logics::extractLogicBlocks($belongs);
			$logics = [];

			foreach ($logicBlocks as $logicBlock){
				$logics[] = $this->returnTrueOrFalseForALogicBlock($logicBlock, $belongsTo, $operator, $find);
			}

			return !in_array(false, $logics );

		} catch (\Exception $exception){
			return false;
		}
	}

	/**
	 * @param BelongModel[] $belongModels
	 * @param string $belongsTo
	 * @param string|null $operator
	 * @param null $find
	 *
	 * @return bool
	 */
	private function returnTrueOrFalseForALogicBlock(array $belongModels, string $belongsTo, ?string $operator = null, $find = null): bool
	{
		$matches = 0;

		foreach ($belongModels as $belongModel){

			if($belongModel->getBelongsTo() === $belongsTo){
				if($operator === null and $find == null){
					$matches++;
				} elseif($belongModel->getOperator() === $operator){
					switch ($operator){
						case Operator::EQUALS:
							if($find === $belongModel->getFind()){
								$matches++;
							}

							break;

						case Operator::NOT_EQUALS:
							if($find !== $belongModel->getFind()){
								$matches++;
							}

							break;

						case Operator::IN:
							$check = Strings::matches($find, $belongModel->getFind());

							if(count($check) > 0){
								$matches++;
							}

							break;

						case Operator::NOT_IN:
							$check = Strings::matches($find, $belongModel->getFind());

							if( empty($check)){
								$matches++;
							}

							break;
					}
				}

				switch ($operator){
					case Operator::EQUALS:

						if( $belongModel->getOperator() === Operator::NOT_EQUALS){

							if($find !== $belongModel->getFind()){
								$matches++;
							}

						} elseif( $belongModel->getOperator() === Operator::IN){
							$check = Strings::matches($find, $belongModel->getFind());

							if(count($check) > 0){
								$matches++;
							}
						} elseif( $belongModel->getOperator() === Operator::NOT_IN){

							$check = Strings::matches($find, $belongModel->getFind());

							if(empty($check)){
								$matches++;
							}

						} elseif($belongModel->getFind() === $find){
							$matches++;
						}

						break;

					case Operator::NOT_EQUALS:

						if($belongModel->getFind() !== $find){
							$matches++;
						}

						break;

					case Operator::IN:
						$check = Strings::matches($find, $belongModel->getFind());

						if( $belongModel->getOperator() === Operator::NOT_IN){
							if(empty($check)){
								$matches++;
							}
						} elseif(count($check) > 0){
							$matches++;
						}

						break;

					case Operator::NOT_IN:
						$check = Strings::matches($find, $belongModel->getFind());

						if(empty($check)){
							$matches++;
						}
				}
			}
		}

		return $matches > 0;
	}
}