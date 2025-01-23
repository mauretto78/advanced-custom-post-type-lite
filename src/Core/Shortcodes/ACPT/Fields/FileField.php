<?php

namespace ACPT_Lite\Core\Shortcodes\ACPT\Fields;

use ACPT_Lite\Utils\Wordpress\WPAttachment;

class FileField extends AbstractField
{
    public function render()
    {
        if(!$this->isFieldVisible()){
            return null;
        }

	    $rawData = $this->fetchRawData();

	    if(!isset($rawData['value'])){
		    return null;
	    }

        $fileSrc = $rawData['value'];
        $wpAttachment = WPAttachment::fromUrl($fileSrc);
	    $label = (isset($rawData['label'])) ? $rawData['label'] : $wpAttachment->getTitle();

        return $this->addBeforeAndAfter('<a href="'.$fileSrc.'" target="_blank">'.$label.'</a>');
    }
}