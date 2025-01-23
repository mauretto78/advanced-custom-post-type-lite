<?php

namespace ACPT_Lite\Core\Shortcodes\ACPT_Lite\Fields;

use ACPT_Lite\Utils\Wordpress\WPUtils;

class TextField extends AbstractField
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

        return $this->addBeforeAndAfter(WPUtils::renderShortCode($rawData['value']));
    }
}