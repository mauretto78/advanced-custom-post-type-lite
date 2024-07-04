<?php

namespace ACPT_Lite\Integrations\Breakdance\Provider\Fields;

use ACPT_Lite\Utils\Wordpress\WPAttachment;
use Breakdance\DynamicData\OembedData;
use Breakdance\DynamicData\StringData;

class ACPTVideoField extends ACPTOembedField
{
	/**
	 * @param mixed $attributes
	 *
	 * @return StringData
	 * @throws \Exception
	 */
	public function handler($attributes): OembedData
	{
		$value = ACPTField::getValue($this->fieldModel, $attributes);
		$oembed = new OembedData();

		if(empty($value)){
			return $oembed;
		}

		if(!$value instanceof WPAttachment){
			return $oembed;
		}

		$attachment = wp_prepare_attachment_for_js($value->getId());

		if(!empty($attachment)){
			$oembed->embedUrl = $attachment['url'];
			$oembed->format = $attachment['subtype'] ?? null;
			$oembed->type = $attachment['type'] ?? null;;
			$oembed->url = $attachment['url'];
		}

		return $oembed;
	}
}
