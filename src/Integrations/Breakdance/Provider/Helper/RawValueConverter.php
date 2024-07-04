<?php

namespace ACPT_Lite\Integrations\Breakdance\Provider\Helper;

use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Utils\Wordpress\WPAttachment;

class RawValueConverter
{
	/**
	 * @param $rawValue
	 * @param $fieldType
	 * @param $attributes
	 *
	 * @return array|string|null
	 */
	public static function convert($rawValue, $fieldType, $attributes)
	{
		try {
			switch ($fieldType){

				case MetaFieldModel::RATING_TYPE:

					if(empty($rawValue)){
						return null;
					}

					$size = isset($attributes['size']) ? $attributes['size'] : null;
					$rawValue = Strings::renderStars($rawValue, $size);
					break;

				case MetaFieldModel::GALLERY_TYPE:

					if(empty($rawValue)){
						return null;
					}

					if(!is_array($rawValue)){
						return null;
					}

					$attachmentIds = [];

					foreach ($rawValue as $image){
						if($image instanceof WPAttachment){
							$attachmentIds[] = $image->getId();
						}
					}

					$rawValue = $attachmentIds;
					break;

				case MetaFieldModel::LIST_TYPE:

					if(!is_array($rawValue)){
						return null;
					}

					$list = '<ul>';

					foreach ($rawValue as $item){
						$list .= '<li>'.$item.'</li>';
					}

					$list .= '</ul>';

					$rawValue = $list;

					break;
			}

			return $rawValue;
		} catch (\Exception $exception){
			return $rawValue;
		}
	}
}