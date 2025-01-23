<?php

namespace ACPT_Lite\Core\Generators\Attachment;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Constants\MimeTypes;
use ACPT_Lite\Constants\Operator;
use ACPT_Lite\Core\Generators\AbstractGenerator;
use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Belong\BelongModel;
use ACPT_Lite\Core\Repository\MetaRepository;
use ACPT_Lite\Includes\ACPT_DB;
use ACPT_Lite\Utils\PHP\Logics;

class AttachmentMetaGroupsGenerator extends AbstractGenerator
{
	/**
	 * Generate meta boxes related to attachments
	 */
	public function generate()
	{
		try {
			$metaGroups = MetaRepository::get([
				'belongsTo' => MetaTypes::MEDIA,
                'clonedFields' => true,
			]);

			foreach ($metaGroups as $metaGroup){

				$cptBelongs = [];

				foreach ($metaGroup->getBelongs() as $index => $belong){
					// allow only media belongs
					if(in_array($belong->getBelongsTo(), [ MetaTypes::MEDIA ])){
						$cptBelongs[] = $belong;
					}
				}

				$attachmentIds = $this->getAttachmentIdsFromBelongs($cptBelongs);
				$generator = new AttachmentMetaGroupGenerator($metaGroup, $attachmentIds);
				$generator->generate();
			}

		} catch (\Exception $exception) {
			// do nothing
		}
	}

	/**
	 * @param array $belongs
	 *
	 * @return array
	 */
	private function getAttachmentIdsFromBelongs($belongs = [])
	{
		if(empty($belongs)){
			return [];
		}

		global $wpdb;
		$query = "SELECT p.ID FROM $wpdb->posts p WHERE p.post_type = %s ";
		$args = ['attachment'];

		$logicBlocks = Logics::extractLogicBlocks($belongs);

		foreach ($logicBlocks as $index => $logicBlock){

			$isLast = $index === (count($logicBlock)-1);
			$query .= ' AND ( ';

			/** @var BelongModel[] $logicBlock */
			foreach ($logicBlock as $logicBlockElement){
				if(
					!Strings::contains(MimeTypes::ALL, $logicBlockElement->getFind())
				){
					switch ($logicBlockElement->getOperator()){
						case Operator::EQUALS:
							$query .= ' p.post_mime_type = %s ';
							$args[] = $logicBlockElement->getFind();
							break;

						case Operator::NOT_EQUALS:
							$query .= ' p.post_mime_type != %s ';
							$args[] = $logicBlockElement->getFind();
							break;

						case Operator::IN:
							$query .= ' p.post_mime_type IN ('.Strings::formatForInStatement($logicBlockElement->getFind()).') ';
							break;

						case Operator::NOT_IN:
							$query .= ' p.post_mime_type NOT IN ('.Strings::formatForInStatement($logicBlockElement->getFind()).') ';
							break;
					}

					if($logicBlockElement->getLogic() and !$isLast){
						$query .= $logicBlockElement->getLogic();
					}
				} else {
					$query .= '1=1';
				}
			}

			$query .= ' ) ';
		}

		// close the query
		$query .= "AND p.post_status=%s GROUP BY p.ID ORDER BY p.ID";
		$args[] = 'inherit';

		// fetch data
		$postIds = [];

		$rawData = ACPT_DB::getResults($query, $args);
		foreach ($rawData as $result){
			$postIds[] = (int)$result->ID;
		}

		return $postIds;
	}
}