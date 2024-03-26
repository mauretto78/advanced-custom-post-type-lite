<?php

namespace ACPT_Lite\Utils\MetaSync;

use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Meta\MetaBoxModel;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Core\Repository\MetaRepository;
use ACPT_Lite\Includes\ACPT_DB;

class PostMetaSync extends AbstractMetaSync
{
    /**
     * @param MetaBoxModel $metaBoxModel
     * @param null $find
     *
     * @throws \Exception
     */
    public static function syncBox(MetaBoxModel $metaBoxModel, $find = null)
    {
        if($oldBox = self::getMetaBoxData($metaBoxModel)){
	        $boxNames = self::changedBoxNames($oldBox->meta_box_name, $metaBoxModel->getName());
	        self::updateBoxPostMeta($boxNames['newKey'], $boxNames['oldKey'], $find);
        }
    }

	/**
	 * @param $newKey
	 * @param $oldKey
	 * @param $postType
	 *
	 * @throws \Exception
	 */
    private static function updateBoxPostMeta($newKey, $oldKey, $postType)
    {
	    global $wpdb;

	    if($newKey !== $oldKey){
		    $sql = "UPDATE `{$wpdb->prefix}postmeta` pm 
                    JOIN `{$wpdb->prefix}posts` p ON p.ID=pm.post_id
                    SET pm.meta_key=REPLACE(pm.meta_key, %s, %s) 
                    WHERE pm.meta_key LIKE %s AND p.post_type=%s";
		    ACPT_DB::executeQueryOrThrowException($sql, [$oldKey, $newKey, $oldKey.'%', $postType]);
	    }
    }

	/**
	 * @param MetaFieldModel $fieldModel
	 * @param null $find
	 *
	 * @throws \Exception
	 */
	public static function syncField(MetaFieldModel $fieldModel, $find = null)
	{
		if($fieldModel->getParentId() !== null){
			self::updateNestedPostMetaWhenFieldNameChanges($fieldModel, $find);
		} elseif($fieldModel->getBlockId() !== null){
			self::updateNestedPostMetaInABlockWhenFieldNameChanges($fieldModel, $find);
		} else {
			self::updatePostMetaWhenFieldNameChanges($fieldModel, $find);
		}
	}

	/**
	 * @param MetaFieldModel $fieldModel
	 * @param $postType
	 *
	 * @throws \Exception
	 */
	private static function updateNestedPostMetaInABlockWhenFieldNameChanges(MetaFieldModel $fieldModel, $postType)
	{
		if($oldField = self::getMetaFieldData($fieldModel)){
			$parentBlockModel = MetaRepository::getMetaBlockById($fieldModel->getBlockId());

			if($parentBlockModel !== null){
				$parentField = $parentBlockModel->getMetaField();

				// old parent key
				$parentBoxName = $parentField->getBox()->getName();
				$parentFieldName = $parentField->getName();
				$parentKey = Strings::toDBFormat($parentBoxName).'_'.Strings::toDBFormat($parentFieldName);

				// old key
				$fieldName = $oldField->field_name;
				$oldKey = Strings::toDBFormat($fieldName);

				// new key
				$newKey = Strings::toDBFormat($fieldModel->getName());

				self::updateNestedPostMetaData($parentKey, $oldKey, $newKey, $postType);
			}
		}
	}

	/**
	 * @param MetaFieldModel $fieldModel
	 * @param $postType
	 *
	 * @throws \Exception
	 */
    private static function updateNestedPostMetaWhenFieldNameChanges(MetaFieldModel $fieldModel, $postType)
    {
	    if($oldField = self::getMetaFieldData($fieldModel)){
            if($parentField = self::getParentMetaFieldData($fieldModel)){

	            // old parent key
	            $parentBoxName = $parentField->meta_box_name;
	            $parentFieldName = $parentField->field_name;
	            $parentKey = Strings::toDBFormat($parentBoxName).'_'.Strings::toDBFormat($parentFieldName);

	            // old key
	            $fieldName = $oldField->field_name;
	            $oldKey = Strings::toDBFormat($fieldName);

	            // new key
	            $newKey = Strings::toDBFormat($fieldModel->getName());

            	self::updateNestedPostMetaData($parentKey, $oldKey, $newKey, $postType);
            }
        }
    }

	/**
	 * @param $parentKey
	 * @param $oldKey
	 * @param $newKey
	 * @param $postType
	 *
	 * @throws \Exception
	 */
    private static function updateNestedPostMetaData($parentKey, $oldKey, $newKey, $postType)
    {
	    global $wpdb;

	    $query = "
                    SELECT * FROM `{$wpdb->prefix}postmeta` pm 
                    JOIN `{$wpdb->prefix}posts` p ON p.ID=pm.post_id
                    WHERE pm.meta_key=%s AND p.post_type=%s
                ";
	    $results = ACPT_DB::getResults($query, [$parentKey, $postType]);

	    foreach ($results as $result) {

		    $oldMetaValue = unserialize( $result->meta_value );

		    // key update
		    if($newKey !== $oldKey){

		    	// blocks
			    if(isset($oldMetaValue['blocks']) and is_array($oldMetaValue['blocks'])){
			    	foreach ($oldMetaValue['blocks'] as $blockIndex => $block){
			    		foreach ($block as $blockName => $blockValues){
			    			foreach ($blockValues as $fieldName => $fieldValues){
			    				if($fieldName === $oldKey){
								    $oldMetaValue['blocks'][$blockIndex][$blockName][$newKey] = $oldMetaValue['blocks'][$blockIndex][$blockName][$oldKey];
								    unset($oldMetaValue['blocks'][$blockIndex][$blockName][$oldKey]);
							    }
						    }
					    }
				    }
			    } else {
				    $oldMetaValue[$newKey] = $oldMetaValue[$oldKey];
				    unset($oldMetaValue[$oldKey]);
			    }

			    $metaValue = serialize($oldMetaValue);

			    $sql = "
                            UPDATE `{$wpdb->prefix}postmeta` pm 
                            JOIN `{$wpdb->prefix}posts` p ON p.ID=pm.post_id
                            SET pm.meta_value=%s 
                            WHERE pm.meta_key=%s AND p.post_type=%s
                        ";
			    ACPT_DB::executeQueryOrThrowException($sql, [$metaValue, $parentKey, $postType]);
		    }
	    }
    }

	/**
	 * @param MetaFieldModel $fieldModel
	 * @param $postType
	 *
	 * @throws \Exception
	 */
	private  static function updatePostMetaWhenFieldNameChanges(MetaFieldModel $fieldModel, $postType)
    {
        if($oldField = self::getMetaFieldData($fieldModel)){

            // old key
            $boxName = $oldField->meta_box_name;
            $fieldName = $oldField->field_name;
            $oldKey = Strings::toDBFormat($boxName).'_'.Strings::toDBFormat($fieldName);

            // new key
            $newKey = $fieldModel->getDbName();

            self::updateFieldPostMeta($newKey, $oldKey, $postType);
        }
    }

    /**
     * @param $newKey
     * @param $oldKey
     * @param $postType
     *
     * @throws \Exception
     */
    private static function updateFieldPostMeta($newKey, $oldKey, $postType)
    {
        global $wpdb;

        if($newKey !== $oldKey){
            $sql = "
                UPDATE `{$wpdb->prefix}postmeta` pm 
                JOIN `{$wpdb->prefix}posts` p ON p.ID=pm.post_id
                SET pm.meta_key=%s 
                WHERE pm.meta_key=%s AND p.post_type=%s
            ";

            ACPT_DB::executeQueryOrThrowException($sql, [$newKey, $oldKey, $postType]);

            $sql = "
                UPDATE `{$wpdb->prefix}postmeta` pm 
                JOIN `{$wpdb->prefix}posts` p ON p.ID=pm.post_id
                SET meta_key=REPLACE(pm.meta_key, %s, %s) 
                WHERE pm.meta_key LIKE %s AND p.post_type=%s
            ";
            ACPT_DB::executeQueryOrThrowException($sql, [$oldKey.'_', $newKey.'_', $oldKey.'_%', $postType]);
        }
    }
}